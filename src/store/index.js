// import dependency to handle HTTP request to our back end
import axios from "axios";
import Vuex from "vuex";
import Vue from "vue";

//load Vuex
Vue.use(Vuex);
//to handle state
const state = { content: [], currentPage: 1, rows: 0 };

//to handle state
const getters = {};

//to handle actions
const actions = {
  getJobs({ commit }, params) {
    axios
      .get("http://localhost:8080/job", { params: params })
      .then(response => {
        commit("GET_JOBS", response.data);
      });
  }
};

//to handle mutations
const mutations = {
  GET_JOBS(state, jobs) {
    state.content = jobs.content ? jobs.content : [];
    state.currentPage = jobs.number ? jobs.number + 1 : 1;
    state.rows = jobs.totalElements ? jobs.totalElements : 0;
  }
};

//export store module
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
