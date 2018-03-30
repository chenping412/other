import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import RouterView from '../components/router-view'
import FormulaList from '../components/formula/formula-list.vue'
import FormulaAdd from '../components/formula/formula-add.vue'
import DatasourceList from '../components/datasource/datasource-list.vue'
import DatasourceAdd from '../components/datasource/datasource-add.vue'
import RuleList from '../components/rule/rule-list.vue'
import RuleAdd from '../components/rule/rule-add.vue'
import SectionList from '../components/section/section-list.vue'
import SectionAdd from '../components/section/section-add.vue'
import TemplateList from '../components/template/template-list.vue'
import TemplateAdd from '../components/template/template-add.vue'
//import TaskList from '../components/task/task-list.vue'
//import TaskAdd from '../components/task/task-add.vue'



export default new Router({
  routes: [
    {
      path: '/',
      redirect: "/datasource"
    },
    {
      path: '/datasource',
      component: RouterView,
      children:[
        {
          path: '',
          component: DatasourceList
        },{
          path: 'add',
          component: DatasourceAdd
        },
      ]
    },
    {
      path: '/formula',
      component: RouterView,
      children:[
        {
          path: '',
          component: FormulaList
        },{
          path: 'add',
          component: FormulaAdd
        },
      ]
    },
    {
      path: '/rule',
      component: RouterView,
      children:[
        {
          path: '',
          component: RuleList
        },{
          path: 'add',
          component: RuleAdd
        },
      ]
    },
    {
      path: '/section',
      component: RouterView,
      children:[
        {
          path: '',
          component: SectionList
        },{
          path: 'add',
          component: SectionAdd
        },
      ]
    },
    {
      path: '/template',
      component: RouterView,
      children:[
        {
          path: '',
          component: TemplateList
        },{
          path: 'add',
          component: TemplateAdd
        },
      ]
    },
    //{
    //  path: '/task',
    //  component: RouterView,
    //  children:[
    //    {
    //      path: '',
    //      component: TaskList
    //    },{
    //      path: 'add',
    //      component: TaskAdd
    //    },
    //  ]
    //}
  ]
})
