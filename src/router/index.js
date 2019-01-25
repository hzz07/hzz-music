import Vue from 'vue'
import Router from 'vue-router'
const Recommand = () => import('components/recommand/recommand')
const Singer = () => import('components/singer/singer')
const Rank = () => import('components/rank/rank')
const Search = () => import('components/search/search')
const SingerDetail = () => import('components/singer-detall/singer-detall')
const Disc = () => import('components/disc/disc')
const TopList = () => import('components/top-list/top-list')
const UserCenter = () => import('components/user-center/user-center')

Vue.use(Router)

export default new Router({
  routes: [
  	{
  		path:'/',
  		redirect:'/Recommend'
  	},
    {
      path:'/Recommand',
      component:Recommand,
      children:[
        {
          path:':id',
          component:Disc
        }
      ]
    },
    {
  	  path:'/singer',
  	  component:Singer,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
	  path:'/rank',
	  component:Rank,
    children:[
      {
        path:':id',
        component:TopList
      }
    ]
    },{
      path:'/search',
      component:Search,
      children:[
        {
          path:':id',
          component:SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
