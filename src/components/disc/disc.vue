
<template>
<!-- 歌单详情列表 -->
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs='songs' ></music-list>

  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/music-list'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {getSongVkey } from "api/singer";
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
export default {
  data() {
    return{
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    //获取歌单数据
    ...mapGetters([
      'disc'
      ])
  },
  components: {
    MusicList
  },
  //在页面加载时获取该歌单数据
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      // // // 刷新没有歌单数据回到上个路由
      if(!this.disc.dissid) {
        this.$router.push('/recommand')
        return
      }
      //调用接口获取歌单数据
      getSongList(this.disc.dissid).then((res) => {
        if(res.code === ERR_OK) {
          //调用_normalizeSongs方法获取歌曲url，此处会有异步操作可能会非法提交vuex
          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
        }
      })
    },
    //批量获取歌曲url
    _normalizeSongs (list) {
        let ret = []
        list.forEach((item) => {
          // let {musicData} = item
          getSongVkey(item.songmid).then((res) => {
            // console.log('这首歌的vkey获取到了')
            const vkey = res.data.items[0].vkey
            if (item.songid && item.albummid) {
              ret.push(createSong(item, vkey))
            }
          })
        })
        console.log(ret)
        return ret
      }
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

