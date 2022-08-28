<template>
  <div class="dashboard-container">
    首页
    <PageTools :show-before="true">
      <span slot="before">前面部分内容</span>
    </PageTools>
    <ImgUpload />
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
