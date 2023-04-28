<template>
  <div class="home">
    <b-nav-form>
      <b-form-group size="md" class="mb-0">
        <b-select v-model="selected" placeholder="天數">
          <b-select-option value="0">1天</b-select-option>
          <b-select-option value="3">3天</b-select-option>
          <b-select-option value="7">1週</b-select-option>
          <b-select-option value="30">30天</b-select-option>
        </b-select>
        &nbsp;
        <b-button
          size="sm"
          class="mr-sm-2"
          @click="reloadJobs()"
          :disabled="reloadJobsClass"
          ><i :class="{ 'el-icon-loading': reloadJobsClass }"></i
          >更新Job列表</b-button
        >
      </b-form-group>
    </b-nav-form>
    <br />
    <b-nav-form>
      <b-form-group size="md" class="mb-0">
        <b-button
          size="sm"
          class="mr-sm-2"
          @click="reloadFailedJob()"
          :disabled="reloadFailedJobClass"
          ><i :class="{ 'el-icon-loading': reloadFailedJobClass }"></i
          >重新取得Job內容</b-button
        >
      </b-form-group>
    </b-nav-form>
    <br />
    <b-nav-form>
      <b-form-group size="md" class="mb-0">
        <b-button
          size="sm"
          class="mr-sm-2"
          @click="reloadCompany()"
          :disabled="reloadCompanyClass"
          ><i :class="{ 'el-icon-loading': reloadCompanyClass }"></i
          >重新取得公司連結</b-button
        >
      </b-form-group>
    </b-nav-form>
  </div>
</template>

<script>
export default {
  name: "job-trigger",
  data() {
    return {
      selected: 0,
      reloadJobsClass: false,
      reloadFailedJobClass: false,
      reloadCompanyClass: false
    };
  },
  methods: {
    async reloadJobs() {
      this.reloadJobsClass = true;
      await this.$store.dispatch("reloadJobs", {
        effectiveDays: this.selected
      });
      this.reloadJobsClass = false;
    },
    async reloadFailedJob() {
      this.reloadFailedJobClass = true;
      await this.$store.dispatch("reloadFailedJob");
      this.reloadFailedJobClass = false;
    },
    async reloadCompany() {
      this.reloadCompanyClass = true;
      await this.$store.dispatch("reloadCompany");
      this.reloadCompanyClass = false;
    }
  }
};
</script>
