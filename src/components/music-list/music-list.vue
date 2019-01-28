<template>
  <div class="music-list">
      <div class="back" @click='back'> 
        <i class="icon-back"></i>
      </div>
      <h1 class="title" v-html='title'></h1>
      <div class="bg-image" :style='bgStyle' ref='bgImage'>
        <div class="play-wrapper" v-show="songs.length" ref="play">
            <div class="play" v-show='songs.length>0' ref='playBtn' @click='random'>
                <div class="icon-play">
                </div>
                  <span class="text">随机播放全部</span>
            </div>
        </div>
        <div class="filter" ref='filter'>
        </div>
      </div>
      <div class="bg-layer" ref="bgLayer"></div>
      <scroll :data='songs' @scroll='scroll' class='list' ref='list' :probeType='probeType' :listenScroll='listenScroll'>
        <div class="song-list-wrapper">
           <song-list @select='selectList' :songs='songs' :rank='rank'></song-list> 
        </div>
        <loading-container v-show="!songs.length"></loading-container>
      </scroll>
  </div>
</template>

<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/song-list'
import { prefixStyle } from 'common/js/dom'
import LoadingContainer from 'base/loading/loading'
import { mapActions } from 'vuex'
import { playListMixin } from 'common/js/mixin'

const RESERVED_HEIGHT = 40
const transform = prefixStyle('transform')
const backdrop = prefixStyle('webkitTransform')
export default {
  
  data(){
    return {
      scrollY:0,
    }
  },
  //vue混入 ， 在页面下有小播放器时重新计算歌曲列表的高度
  mixins:[playListMixin],
  props:{
    //父组件传入背景图
    bgImage:{
      type:String,
      default:''
    },
    //父组件传入歌曲列表
    songs:{
      type:Array,
      default:[]
    },
    //父组件传入歌曲列表的标题
    title:{
      type:String,
      default:''
    },
    //父组件传入排行
    rank:{
      type:Boolean,
      default:false
    }
  },
  computed:{
    bgStyle(){
      return `background-image:url(${this.bgImage})`
    }
  },
  mounted(){
    //页面初始化时歌曲列表距离底部距离
    this.$refs.list.$el.style.top=`${this.$refs.bgImage.clientHeight}px`
    //获取图片的高度
    this.imageHeight=this.$refs.bgImage.clientHeight
    //获取滚动条最小便偏移量
    this.minTranslateY=-this.imageHeight +RESERVED_HEIGHT
  },
  created(){
    //实时派发 scroll 事件
    this.probeType =3
    //scroll派发一个监听scroll当前位置
    this.listenScroll = true
  },
  methods:{
    //监听是否有小播放器
    handlePlaylist(newVal){
      const bottom = this.playlist.length>0 ? '60px' : ''
      this.$refs.list.$el.style.bottom=bottom
      this.$refs.list.refresh()
    },
    //点击随机播放按钮，将歌曲列表提交到vuex
    random(){
      this.randomPlay({
        list:this.songs
      })
    },
    //获取scroll组件派发事件，获取当前滚动区域相对初始状态y轴距离
    scroll(pos){
      this.scrollY=pos.y

    },
    //点击返回按钮返回上一级
    back(){
      this.$router.back()
    },
    //选择播放歌曲和索引
    selectList(item,index){
      this.selectPlay({
        list:this.songs,
        index
      })
    },
    //调用vuex里的action方法
    ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
  },
  watch:{
    //监听scrollY的变化
    scrollY(newY){
      console.log(newY)
      let zIndex=0
      let tanslateY= Math.max(this.minTranslateY,newY) 
      let scale = 1
      let blur = 0
      this.$refs.bgLayer.style[transform] = `translate3D(0,${tanslateY}px,0)`
      //下拉相对图片高度比例
      const percent= Math.abs(newY / this.imageHeight )
      //如果下拉时进行图片的放大
      if(newY>0){
        //放大比例
        scale = 1 + percent
        zIndex = 10
      }else{
        blur= Math.min( 20*percent , 20)
      }
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`
      if(newY<this.minTranslateY){
        //下拉高度大于最高偏移量
        zIndex = 10
        this.$refs.bgImage.style.paddingTop = 0
        this.$refs.bgImage.style.height=`${RESERVED_HEIGHT}px`
        this.$refs.play.style.display = 'none'
      }else{
        this.$refs.bgImage.style.paddingTop ='70%'
        this.$refs.bgImage.style.height=0
        this.$refs.play.style.display = ''
      }
      //设置背景图片的index 和 和背景图片缩放度
      this.$refs.bgImage.style.zIndex = zIndex
      this.$refs.bgImage.style[transform] = `scale(${scale})`
    }
  },
  components:{
    Scroll,
    SongList,
    LoadingContainer
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
