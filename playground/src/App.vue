<template>
  <router-view></router-view>
</template>
<script >
export default {
  name: 'App',
};
</script>
<style lang="scss">
html,
body,
#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  .el-form-item.el-form-item{
    margin-bottom: 10px !important;
  }
}
</style>
