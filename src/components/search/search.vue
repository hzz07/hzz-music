<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQuerychange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show='!query'>
      <scroll class="shortcut" :data="shortcut" ref="shortcut" :refreshDelay="refreshDelay">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>

              <li @click="addQuery(item.k)" v-for="item in hotkey" class="item">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--  -->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>

              </span>
            </h1>
            <!--  -->
            <!--  -->
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!-- @listScroll="blurInput"  -->
    <div class="search-result" ref="suggestResult" v-show='query'>
      <suggest ref="suggestList" @listScroll="blurInput" :query="query" @select="saveSearch"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空全部搜索记录" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
  import SearchBox from 'base/searchbox/searchbox'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {mapActions, mapGetters} from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {playListMixin, searchMixin} from 'common/js/mixin'

  export default {
    components: {
      SearchBox,
      Scroll,
      Suggest,
      SearchList,
      Confirm
    },
//   // 当前页面的methods会覆盖mixin里的methods同名方法
    mixins: [playListMixin, searchMixin],
    computed: {
      // scroll组件计算高度 包含两个异步数据此处合并再传:data
      shortcut() {
        return this.hotkey.concat(this.searchHistory)
      },
      ...mapGetters([
        'searchHistory'
      ])
    },
    watch: {
      // 搜索切换回来scroll计算不准确 手动计算
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          })
        }
      }
    },
    data() {
      return {
        hotkey: [],
        query: ''
      }
    },
    created() {
      this._getHotKey()
    },
    methods: {
      showConfirm() {
        this.$refs.confirm.show()
      },
      onQuerychange(query) {
        this.query = query
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query)
      },
//     // 有小播放器时 改变列表的bottom
      handlePlaylist(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.suggestResult.style.bottom = bottom
        this.$refs.shortcut.refresh()
        this.$refs.suggestList.refresh()
      },
      _getHotKey() {
        getHotKey().then(res => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10)
          }
        })
      },
      blurInput() {
        this.$refs.searchBox.blur()
      },
      saveSearch() {
        this.saveSearchHistory(this.query)
      },
      ...mapActions(['saveSearchHistory', 'deleteSearchHistory', 'clearSearchHistory'])
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px

    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%

      .shortcut
        height: 100%
        overflow: hidden

        .hot-key
          margin: 0 20px 20px 20px

          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-theme

          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-text-ll
            font-size: $font-size-medium
            color: $color-text-d

        .search-history
          position: relative
          margin: 0 20px

          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-theme

            .text
              flex: 1

            .clear
              extend-click()

              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d

    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

