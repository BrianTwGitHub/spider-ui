<template>
  <div id="app">
    <el-container>
      <el-header class="header" style="padding: 15px 20px;">Jobs</el-header>
      <el-container class="content">
        <el-aside class="aside" style="width:150px">
          <el-menu
            :default-active="$route.path"
            class="el-icon-menu"
            unique-opened
            router
          >
            <component
              class="menu-item"
              v-for="value in routers"
              :key="value.path"
              :index="value.path"
              :is="'el-menu-item'"
            >
              <template slot="title">
                <i :class="value.icon"></i>
                <span>{{ value.name }}</span>
              </template>
            </component>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      routers: this.$router.options.routes
    };
  }
};
</script>

<style lang="scss">
.header {
  background-color: #0fb0ef;
  color: #fff;
  text-align: center;
}
.content {
  height: calc(100vh - 50px);
  .aside {
    background-color: lightblue;
  }
  .menu-item {
    background-color: lightblue;
    color: #fff;
  }
}
</style>
