import Vue from 'vue'
import SvgIcon from './SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)

let req = require.context('./svg', false, /\.svg$/)
let requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
