<template>
  <el-dialog title="分配权限" :visible="showManagerDialog" @close="handleClose">
    <el-tree
      ref="permTree"
      :data="permData"
      :props="defaultProps"
      :show-checkbox="true"
      :default-expand-all="true"
      :check-strictly="true"
      node-key="id"
      :default-checked-keys="selectKeys"
    />
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="sureAdd">确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getPermissionList } from '@/api/permisson'
import { tranListToTreeData } from '@/utils'
import { getRoleDetalis, assignPerm } from '@/api/settings'
export default {
  name: 'ManagerPermission',
  props: {
    showManagerDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      permData: [],
      defaultProps: {
        label: 'name'
      },
      selectKeys: [],
      userId: ''
    }
  },
  methods: {
    // 关闭弹层
    handleClose() {
      this.$emit('update:showManagerDialog', false)
      this.permData = []
    },
    // 获取权限点
    async getPermissionList(id) {
      try {
        this.userId = id
        const res = await getPermissionList()
        const { permIds } = await getRoleDetalis(id)
        this.permData = tranListToTreeData(res, '0')
        this.selectKeys = permIds
      } catch (error) {
        console.log(error)
      }
    },
    // 确定按钮
    async sureAdd() {
      try {
        this.loading = true
        await assignPerm({
          permIds: this.$refs.permTree.getCheckedKeys(),
          id: this.userId
        })
        this.$message.success('分配角色权限成功！')
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
