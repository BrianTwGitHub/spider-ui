// import dependency to handle HTTP request to our back end
import axios from "axios";
import Vuex from "vuex";
import Vue from "vue";

//load Vuex
Vue.use(Vuex);
//to handle state
const state = {
  content: [],
  currentPage: 1,
  rows: 0,
  jobAreaList: [],
  readJobId: null,
  reloadJobStatus: false,
  favorite: false,
  addFilterSuccess: false,
  updateFilterSuccess: false,
  deleteFilterSuccess: false
};

//to handle state
const getters = {};
const baseUrl = "http://localhost:8080";
const config = {
  headers: {
    "Content-Type": "application/json"
  }
};

//to handle actions
const actions = {
  getJobs({ commit }, params) {
    axios.get(baseUrl + "/job/", { params: params }).then(response => {
      commit("GET_JOBS", response.data);
    });
  },
  getJobAreaList({ commit }) {
    axios.get(baseUrl + "/job/area/list").then(response => {
      commit("GET_JOB_AREA_LIST", response.data);
    });
  },
  async readJob({ commit }, params) {
    await axios
      .post(baseUrl + "/job/" + params.jobId + "/read")
      .then(response => {
        commit("READ_JOB", response.status);
      });
  },
  async reloadJobs({ commit }, params) {
    commit("RELOAD_JOBS", null);
    await axios
      .get(baseUrl + "/trigger/jobs", { params: params })
      .then(response => {
        commit("RELOAD_JOBS", response.status);
      });
  },
  async updateFavorite({ commit }, params) {
    await axios
      .post(baseUrl + "/job/" + params.jobId + "/favorite")
      .then(response => {
        commit("UPDATE_FAVORITE", response.status);
      });
  },
  async reloadFailedJob({ commit }) {
    await axios.post(baseUrl + "/job/failed/reload").then(response => {
      commit("RELOAD_FAILED_JOB", response.status);
    });
  },
  async reloadCompany({ commit }) {
    await axios.post(baseUrl + "/job/failed/company/reload").then(response => {
      commit("RELOAD_COMPANY", response.status);
    });
  },
  getFilters({ commit }, params) {
    axios
      .get(baseUrl + "/settings/filter", { params: params })
      .then(response => {
        commit("GET_FILTERS", response.data);
      });
  },
  addFilter({ commit }, body) {
    axios.post(baseUrl + "/settings/filter", body, config).then(response => {
      commit("ADD_FILTER", response.status);
    });
  },
  updateFilter({ commit }, body) {
    commit("UPDATE_FILTER", false);
    axios.patch(baseUrl + "/settings/filter", body, config).then(response => {
      commit("UPDATE_FILTER", response.status);
    });
  },
  deleteFilter({ commit }, params) {
    commit("DELETE_FILTER", false);
    axios
      .delete(baseUrl + "/settings/filter", { filterId: params })
      .then(response => {
        commit("DELETE_FILTER", response.status);
      });
  }
};

//to handle mutations
const mutations = {
  GET_JOBS(state, jobs) {
    state.content = jobs.content ? jobs.content : [];
    state.currentPage = jobs.number ? jobs.number + 1 : 1;
    state.rows = jobs.totalElements ? jobs.totalElements : 0;
  },
  GET_JOB_AREA_LIST(state, jobAreaList) {
    state.jobAreaList = jobAreaList;
  },
  RELOAD_JOBS(state, status) {
    state.status = status == 200;
  },
  READ_JOB() {},
  UPDATE_FAVORITE(state, status) {
    state.favorite = status == 200;
  },
  RELOAD_FAILED_JOB() {},
  RELOAD_COMPANY() {},
  GET_FILTERS(state, filters) {
    state.content = filters.content ? filters.content : [];
    state.currentPage = filters.number ? filters.number + 1 : 1;
    state.rows = filters.totalElements ? filters.totalElements : 0;
  },
  ADD_FILTER(state, status) {
    state.addFilterSuccess = status == 200;
  },
  UPDATE_FILTER(state, status) {
    state.updateFilterSuccess = status == 200;
  },
  DELETE_FILTER(state, status) {
    state.deleteFilterSuccess = status == 200;
  }
};

//export store module
export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
