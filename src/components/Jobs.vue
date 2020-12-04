<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="#">NavBar</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-nav-item-dropdown :text="selectedJobArea.jobArea" right>
              <b-dropdown-item
                v-for="option in jobAreaList"
                :key="option.id"
                :value="option.jobArea"
                @click="selectedJobArea = option"
              >
                {{ option.jobArea }}
              </b-dropdown-item>
            </b-nav-item-dropdown>

            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="職稱"
              v-model="jobName"
            ></b-form-input>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              placeholder="工作內容"
              v-model="jobContent"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="button"
              @click="search"
              >Search</b-button
            >
          </b-nav-form>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-table
      id="my-table"
      :items="jobs"
      :per-page="perPage"
      :fields="fields"
      small
    >
      <template #cell(jobName)="row">
        <span :title="row.item.jobName">{{
          checkStringLength(row.item.jobName)
        }}</span>
      </template>
      <template #cell(jobCompany)="row">
        <span :title="row.item.jobCompany">{{
          checkStringLength(row.item.jobCompany)
        }}</span>
      </template>
      <template #cell(jobContent)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? "Hide" : "Show" }} Details
        </b-button>
      </template>
      <template #cell(jobUrl)="row">
        <span v-html="toUrlHtml(row.item.jobUrl)"></span>
      </template>
      <template #row-details="row">
        <b-card>
          <b-row class="mb-2">
            <b-col sm="3" class="text-sm-right"></b-col>
            <span v-html="row.item.jobContent"></span>
          </b-row>
        </b-card>
      </template>
    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
      align="center"
    ></b-pagination>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
export default {
  data() {
    return {
      fields: [
        { key: "jobId", label: "id" },
        { key: "jobName", label: "職稱", formatter: "checkStringLength" },
        { key: "jobCompany", label: "公司" },
        { key: "jobContent", label: "工作內容" },
        { key: "jobArea", label: "工作地點" },
        { key: "jobSalary", label: "薪資範圍" },
        { key: "jobLocation", label: "工作詳細地址" },
        { key: "jobUrl", label: "工作原始網址", formatter: "toUrlHtml" }
      ],
      perPage: 10,
      currentPage: 1,
      jobName: null,
      jobContent: null,
      selectedJobArea: { jobArea: "工作地點" }
    };
  },
  computed: {
    rows() {
      return this.$store.state.rows;
    },
    jobs() {
      return this.$store.state.content;
    },
    jobAreaList() {
      let array = [{ id: null, jobArea: "工作地點" }];
      array = array.concat(this.$store.state.jobAreaList);
      return array;
    }
  },
  watch: {
    currentPage() {
      this.getJobs();
    }
  },
  methods: {
    getJobs: function() {
      console.log(this.jobName);
      this.$store.dispatch("getJobs", {
        page: this.currentPage - 1,
        size: this.perPage,
        jobName: this.jobName,
        jobContent: this.jobContent,
        jobAreaId: this.selectedJobArea.id
      });
    },
    search() {
      this.currentPage = 1;
      this.getJobs();
    },
    getJobAreaList() {
      return this.$store.dispatch("getJobAreaList");
    },
    checkStringLength(str) {
      if (str.length > 20) {
        str = str.substring(0, 20) + "...";
      }
      return str;
    },
    toUrlHtml(url) {
      return "<a href='" + url + "' target='_blank'>開啟網頁</a>";
    }
  },
  mounted() {
    this.getJobs();
    this.getJobAreaList();
  }
};
</script>
