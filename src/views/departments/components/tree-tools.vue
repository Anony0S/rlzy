<template>
  <el-row type="flex" justify="space-between" style="hight: 40px; width: 100%">
    <el-col>{{ treeNode.name }}</el-col>

    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="operateDeots">
            <span> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="edit"
              >编辑部门</el-dropdown-item>
              <el-dropdown-item
                v-if="!isRoot"
                command="del"
              >删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartment } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDeots(type) {
      if (type === 'add') {
        // TODO: 添加子部门
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // TODO: 编辑子部门
      } else {
        // 删除子部门
        this.$confirm('您确定要删除吗？')
          .then(() => {
            return delDepartment(this.treeNode.id)
          })
          .then(() => {
            this.$emit('delDepart')
            this.$message.success('删除成功！')
          })
      }
    }
  }
}
</script>

<style></style>
