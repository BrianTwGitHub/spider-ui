<template>
  <div>
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
        { key: "jobUrl", label: "工作原始網址" }
      ],
      perPage: 10,
      currentPage: 1
    };
  },
  computed: {
    rows() {
      return this.$store.state.rows;
    },
    jobs() {
      return this.$store.state.content;
    }
  },
  watch: {
    currentPage() {
      this.getJobs();
    }
  },
  methods: {
    getJobs: function() {
      this.$store.dispatch("getJobs", {
        page: this.currentPage - 1,
        size: this.perPage,
        jobName: null,
        jobContent: null,
        jobAreaId: null
      });
    },
    checkStringLength(str) {
      if (str.length > 30) {
        str = str.substring(0, 30) + "...";
      }
      return str;
    }
  },
  mounted() {
    this.getJobs();
  }
};
</script>
