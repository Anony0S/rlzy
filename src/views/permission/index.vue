<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools :show-before="false">
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPer('0', 1)">
            添加权限
          </el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table
        v-loading="loading"
        border
        :data="perList"
        row-key="id"
        :default-expand-all="true"
      >
        <el-table-column label="序号" type="index" />
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="left" label="操作">
          <template slot-scope="{ row }">
            <el-button
              v-if="+row.type === 1"
              type="text"
              icon="el-icon-circle-plus-outline"
              @click="addPer(row.id, 2)"
            >
              添加
            </el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(row)">
              编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              style="color: red"
              @click="del(row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加权限弹窗 -->
    <AddPermission ref="addPer" :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
import { getPermissionList, delPermission } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import AddPermission from './components/add-promission.vue'
export default {
  name: 'HrsaasIndex',
  components: { AddPermission },
  data() {
    return {
      perList: [],
      loading: false,
      // 显示弹窗
      dialogVisible: false
    }
  },
  mounted() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.loading = true
      try {
        const res = await getPermissionList()
        this.perList = tranListToTreeData(res, '0')
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
    // 删除
    async del(id) {
      try {
        await this.$confirm('确定删除吗？', '提示', {
          type: 'warning'
        })
        await delPermission(id)
        this.$message.success('删除成功！')
        this.getPermissionList()
      } catch (error) {
        console.log(error)
      }
    },
    // 添加权限
    addPer(pid, type) {
      this.$refs.addPer.formData.pid = pid
      this.$refs.addPer.formData.type = type
      this.dialogVisible = true
    },
    // 编辑
    edit(row) {
      this.$refs.addPer.formData = { ...row }
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
