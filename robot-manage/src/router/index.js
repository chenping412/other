import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/login.vue'
import Home from '../components/home.vue'
import RouerView from '../components/router-view.vue'

import UserIndex from '../components/user/user-index.vue'
import UserNormalList from '../components/user/user-normal-list.vue'
import UserNormalAdd from '../components/user/user-normal-add.vue'
import UserNormalUserDetail from '../components/user/user-normal-user-detail.vue'
import UserNormalApiDetail from '../components/user/user-normal-api-detail.vue'
import UserAgentList from '../components/user/user-agent-list.vue'
import UserAgentAdd from '../components/user/user-agent-add.vue'
import UserAgentAgentDetail from '../components/user/user-agent-agent-detail.vue'
import UserAgentAddCustomer from '../components/user/user-agent-add-customer.vue'

import ProductIndex from '../components/product/product-index.vue'
import ProductRobotList from '../components/product/product-robot-list.vue'
import ProductRobotDetail from '../components/product/product-robot-detail.vue'
import ProductServiceList from '../components/product/product-service-list.vue'
import ProductServiceDetail from '../components/product/product-service-detail.vue'
import ProductPackageList from '../components/product/product-package-list.vue'
import ProductPackageDetail from '../components/product/product-package-detail.vue'
import ProductPackageAdd from '../components/product/product-package-add.vue'


import OrderIndex from '../components/order/order-index.vue'
import OrderList from '../components/order/order-list.vue'
import OrderDetail from '../components/order/order-detail.vue'
import OrderAdd from '../components/order/order-add.vue'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [

        {
          path: '',
          component: UserIndex,
          redirect: 'user-index'
        },
        {
          path: 'user-index',
          component: UserIndex,
          children: [
            {
              path: "",
              component: RouerView,
              redirect: 'user-normal'
            }, {
              path: "user-normal",
              component: RouerView,
              children: [
                {
                  path: "",
                  component: UserNormalList
                }, {
                  path: "add",
                  component: UserNormalAdd
                }, {
                  path: "user-detail",
                  component: UserNormalUserDetail
                }, {
                  path: "api-detail",
                  component: UserNormalApiDetail
                }
              ]
            }, {
              path: "user-agent",
              component: RouerView,
              children: [
                {
                  path: "",
                  component: UserAgentList
                }, {
                  path: "add",
                  component: UserAgentAdd
                }, {
                  path: "agent-detail",
                  component: UserAgentAgentDetail
                }, {
                  path: "add-customer",
                  component: UserAgentAddCustomer
                }, {
                  path: "user-detail",
                  component: UserNormalUserDetail
                }, {
                  path: "api-detail",
                  component: UserNormalApiDetail
                }
              ]
            }
          ]
        },
        {
          path: 'product',
          component: ProductIndex,
          children: [
            {
              path: "",
              component: RouerView,
              redirect: 'robot'
            },
            {
              path: "robot",
              component: RouerView,
              children:[
                {
                  path: "",
                  component: ProductRobotList
                },{
                  path: "detail",
                  component: ProductRobotDetail
                }
              ]
            },{
              path: "service",
              component: RouerView,
              children:[
                {
                  path: "",
                  component: ProductServiceList
                },{
                  path: "detail",
                  component: ProductServiceDetail
                }
              ]
            },{
              path: "package",
              component: RouerView,
              children:[
                {
                  path: "",
                  component: ProductPackageList
                },{
                  path: "detail",
                  component: ProductPackageDetail
                },{
                  path: "add",
                  component: ProductPackageAdd
                }
              ]
            }


          ]
        },
        {
          path: 'order',
          component: OrderIndex,
          children: [
            {
              path: "",
              component: RouerView,
              redirect: 'list'
            },
            {
              path: "list",
              component: RouerView,
              children: [
                {
                  path: "",
                  component: OrderList
                },
                {
                  path: "detail",
                  component: OrderDetail
                },
                {
                  path: "add",
                  component: OrderAdd
                }
              ]
            }
          ]
        }

      ]
    }

  ]
})
