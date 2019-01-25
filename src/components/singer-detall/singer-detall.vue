<template>

   <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </transition>
    

  
    <!-- <transition name="slide"> -->
        <!-- <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list> -->
    <!-- </transition> -->
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail,getSongVkey } from "api/singer";
import { ERR_OK } from "api/config";
import jsonp from "common/js/jsonp";
import { commonParams, options } from "api/config";
import {createSong,isValidMusic,processSongsUrl} from 'common/js/song'
import MusicList from 'components/music-list/music-list'

export default {
    data(){
      return{
        songs:[]
      }
    },
    computed:{
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters([
          'singer'
        ])
    },
    created(){
      this._getDetail()
      console.log(this.singer)
    },
    methods:{
      _getDetail(){

        if(!this.singer.id){
          this.$router.push('/singer')
          return
        }
        getSingerDetail(this.singer.id).then((res)=> {
          if (res.code === ERR_OK) {
            this._normalizeSongs(res.data.list).then((data) => {
              let init = setInterval(() => {
                if (data.length != 0) {
                  this.songs = this.songs.concat(data)
                  clearInterval(init)
                }
              }, 1000)
            })
          }
        })
      },
      _normalizeSongs (list) {
        var p = new Promise((resolve, reject) => {
          let ret = []
          list.forEach((item) => {
            let {musicData} = item
            getSongVkey(musicData.songmid).then((res) => {
              // console.log('这首歌的vkey获取到了')
              const vkey = res.data.items[0].vkey
              if (musicData.songid && musicData.albummid) {
                ret.push(createSong(musicData, vkey))
              }
            })
          })
          resolve(ret)
          })
        return p
      }
    },
    components:{
      MusicList
    }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.singer-detail {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: $color-background;
}

  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

