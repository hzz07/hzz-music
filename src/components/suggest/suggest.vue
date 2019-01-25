<template>
  <scroll class="suggest"
          :data="result"
          :pullup="true"
          ref="suggest"
          @scrollToEnd="searchMore"
          :beforeScroll="true"
          @beforeScroll="listScroll"
  >


    <!--

    :pulldown="true"

    @pullDownEnd="pullDown"
    @beforeScroll="listScroll" -->

    <div class="suggest-list">
      <ul>
        <!--   -->
        <li @click="seletItem(item)" v-if="singerlist.length>0" class="suggest-item" v-for="(item,index) in singerlist">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
        <li @click="seletItem(item)" v-if="result.length>0" class="suggest-item" v-for="(item,index) in result">
          <div class="icon">
            <i :class="getIconCls(item)"></i>
          </div>
          <div class="name">
            <p class="text" v-html="getDisplayName(item)"></p>
          </div>
        </li>
        <loading v-show='hasMore' title=""></loading>
      </ul>
    </div>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length && !singerlist.length">
      <no-result title="抱歉,暂无搜索结果"></no-result>
    </div>

  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'
  import {getSongVkey} from "api/singer"
  import {filterSinger} from 'common/js/song'
  import NoResult from 'base/no-result/no-result'

  const perpage = 20

  export default {
    components: {
      Scroll,
      Loading,
      NoResult
    },
    props: {
      // 搜索词
      query: {
        type: String,
        default: ''
      },
      // 歌手
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        result: [],
        page: 1,
        singerlist: [],
        hasMore: true,
        pullup: true
      }
    },
    methods: {

      search() {
        this.hasMore = true
        this.page = 1
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._GetResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this._GetResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
      _GetResult(list) {
        this.singerlist = []
        if (list.zhida && list.zhida.singerid) {
          this.singerlist = this.singerlist.concat(list.zhida)
        }

        if (list.song) {
          this._normalizeSinger(list.song.list).then((data) => {
            let init = setInterval(() => {
              if (data.length != 0) {
                if(this.page===1){
                  this.result = data
                }else{
                  this.result = this.result.concat(data)
                }

                clearInterval(init)
              }
            }, 1000)
          })
        }

      },
      _normalizeSinger(list) {
        var p = new Promise((resolve, reject) => {
          let ret = []
          list.forEach((item) => {
            getSongVkey(item.songmid).then((res) => {
              // console.log('这首歌的vkey获取到了')
              const vkey = res.data.items[0].vkey
              if (item.songid && item.albummid) {
                ret.push(createSong(item, vkey))
              }
            })
          })
          resolve(ret)
        })
        return p
      },
      listScroll(){
        this.$emit('listScroll')
      },
      seletItem(item) {
        if (item.type === 2) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select',)
      },
      getIconCls(item) {
        if (item.type === 2 && item.type) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if (item.type === 2 && item.type) {
          return `${item.singername}`
        } else {
          return `${item.name}-${item.singer}`
        }
      },
      _checkMore(data) {
        console.log(data)
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
      refresh(){
        this.$refs.suggest.refresh()
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
      query() {
        this.search()
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 36%
      transform: translateY(-50%)
</style>
