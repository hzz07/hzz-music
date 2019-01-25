import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

//查询list中含有song的index
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
//选择歌曲 提交到vuex
export const selectPlay = function ({commit, state}, {list, index}) {
  //提交到歌曲列表
  commit(types.SET_SEQUENCE_LIST, list)
  //判断歌曲播放状态
  if (state.mode === playMode.random) {
    //如果是随机播放 执行shuffle函数打乱歌曲列表 将列表赋值给playList
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    //查询到当前歌曲在随机列表的index
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  //提交当前播放下标
  commit(types.SET_CURRENT_INDEX, index)
  //提交播放器大小
  commit(types.SET_FULL_SCREEN, true)
  //提交播放状态
  commit(types.SET_PLAYING_STATE, true)

}
//提交随机播放方法
export const randomPlay = function ({commit}, {list}) {
  //提交播放模式
  commit(types.SET_PLAY_MODE, playMode.random)
  //提交歌曲列表
  commit(types.SET_SEQUENCE_LIST, list)
  //执行函数打乱歌曲列表
  let randomList = shuffle(list)
  //将randomList赋值给播放列表
  commit(types.SET_PLAYLIST, randomList)
  //将当前歌曲下标置为0
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

//搜索列表插入歌曲
export const insertSong = function ({commit, state}, song) {
  //获取播放列表副本
  let playlist = state.playlist.slice()
  //获取歌曲列表副本
  let sequenceList = state.sequenceList.slice()
  //获取当前播放歌曲下标
  let currentIndex = state.currentIndex
  //记录当前歌曲
  let currentSong = playlist[currentIndex]
  //查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song)
  //因为是插入索引，索引加一
  currentIndex++
  //插入歌曲到当前歌曲的地方
  playlist.splice(currentIndex, 0, song)

  //如果已经包含了这首歌
  if (fpIndex > -1) {
    //如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1)
      currentIndex--

    } else {
      playlist.splice(fpIndex + 1, 1)

    }
  }
  //如果没有包含这首歌
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentIndex, 1, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)

}
//提交搜索历史
export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}
//删除搜索历史
export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}
//清除搜索历史
export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

//删除播放列表里的歌曲
export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playlist.length) {
    commit(types.SET_PLAYING_STATE, false)
  }
}
//提交删除所有歌曲
export const deleteSongList = function ({commit}) {
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING_STATE, false)
}
//保存播放历史
export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}
//保存喜欢歌曲
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
//删除喜欢歌曲列表
export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

