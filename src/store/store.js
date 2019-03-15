import Vue from "vue";
import Vuex from "vuex";
import index from './modules/index'
import power from './modules/power'

Vue.use(Vuex);
const modules ={
  index,
  power
}
const store = new Vuex.Store({
  modules
})

export default store;

