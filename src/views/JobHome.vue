<template>
  <div class="home">
    <Jobs msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Jobs from "@/components/DefaultJobs.vue";

export default {
  name: "jobHome",
  components: {
    Jobs
  }
};
</script>
