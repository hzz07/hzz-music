import { playMode } from 'common/js/config'
//获取本地localStorge 搜索历史，喜欢歌曲历史，播放历史
import { loadSearch , loadFavorite , loadPlay} from 'common/js/cache'

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite()
}

export default state


// WEBPACK FOOTER //
// ./src/store/state.js
