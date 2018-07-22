import Vue from 'vue'
import Router from 'vue-router'
import MosaicMain from '@/components/MosaicMain'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MosaicMain',
      component: MosaicMain
    }
  ]
})
