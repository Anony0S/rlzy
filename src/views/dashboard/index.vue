<template>
  <div class="dashboard-container">
    首页
    <el-button type="primary" @click="test">测试</el-button>
    <PageTools :show-before="true">
      <span slot="before">前面部分内容</span>
    </PageTools>
    <ImgUpload />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Dashboard',
  methods: {
    async test() {
      try {
        for (let i = 1; i < 100; i++) {
          axios.get(
            'https://mhh-harssas-32-1303981279.cos.ap-nanjing.myqcloud.com/%E7%BE%8E%E5%A5%B3.PNG'
          )
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
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
