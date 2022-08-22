<template>
  <div class="departments-container">
    <el-card class="tree-card">
      <TreeTools
        :tree-node="company"
        :is-root="true"
        @addDept="addDept(company)"
      />
      <!-- 树形静态组织结构 -->
      <el-tree :data="departs" :props="defaultProps" default-expand-all>
        <TreeTools
          slot-scope="{ data }"
          :tree-node="data"
          @delDepart="getDeaprtments"
          @addDept="addDept(data)"
        />
      </el-tree>
    </el-card>
    <AddDept :show-dialog="showDialog" :node-data="nodeData" />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
import { getDeaprtments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  name: 'Departments',
  components: { TreeTools, AddDept },
  data() {
    return {
      // 子节点数据
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      // 头部数据
      company: {},
      showDialog: false,
      nodeData: {}
    }
  },
  created() {
    this.getDeaprtments()
  },
  methods: {
    async getDeaprtments() {
      try {
        const res = await getDeaprtments()
        this.company = { name: res.companyName, manager: '负责人', id: '' }
        this.departs = tranListToTreeData(res.depts, '')
      } catch (error) {
        this.$message.error('获取信息错误！')
      }
    },
    addDept(node) {
      this.showDialog = true
      this.nodeData = node
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      padding-right: 20px;
    }
  }
}
</style>
