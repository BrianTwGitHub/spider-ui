<template>
  <div class="home">
    <Jobs msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import Jobs from "@/components/Jobs.vue";

export default {
  name: "home",
  components: {
    Jobs
  }
};
</script>
