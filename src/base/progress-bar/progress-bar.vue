<template>
  <div class="progress-bar" ref="progressBar" @click='progressClick'>
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    watch:{
      percent(newPercent){
        this.setProgressOffset(newPercent)
      }
    },
    created(){
      this.touch={}
    },
    methods:{
      progressTouchStart(e){
        this.touch.initiated=true
        this.touch.startX=e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth

      },
      progressTouchMove(e){
        if(!this.touch.initiated){
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth=Math.min( this.$refs.progressBar.clientWidth - progressBtnWidth,Math.max(0,this.touch.left + deltaX))
        this._offsetWidth(offsetWidth)
      },
      progressTouchEnd(e){
        this.touch.initiated=false
        this._triggerPercent()
      },
      _offsetWidth(offsetWidth){
        this.$refs.progress.style.width=`${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      },
      _triggerPercent(){
        const barWidth=this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth/barWidth
        this.$emit('percentChange',percent)
      },
      setProgressOffset(percent) {
        if (percent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = percent * barWidth
          this._offsetWidth(offsetWidth)
        }
      },
      progressClick(e){
        // this._offsetWidth(e.offsetX)
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offsetWidth(offsetWidth)
        this._triggerPercent()
      }
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: $color-text
      .progress
        position: absolute
        height: 100%
        background: $color-sub-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-sub-theme
</style>
