<template>
  <div class="emplayees-container">
    <PageTools :show-before="true">
      <span slot="before">共166条数据</span>
      <template v-slot:after>
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
        <el-button size="small" type="primary">新增员工</el-button>
      </template>
    </PageTools>
  </div>
</template>

<script>
export default {
  name: 'Employees',
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped></style>
