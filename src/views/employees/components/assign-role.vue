<template>
  <el-dialog title="分配角色" :visible="value" :before-close="handleClose">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          :loading="loading"
          @click="btnOk"
        >确定</el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoles } from '@/api/settings'
import { getDetaliInfoById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'HrsaasAssignRole',
  model: {
    event: 'update'
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },
  watch: {
    value(newValue) {
      if (newValue) this.getDetaliInfoById()
    }
  },
  methods: {
    // 关闭弹层
    handleClose() {
      this.$emit('update', false)
    },
    // 获取角色列表
    async getRoleList() {
      const { rows } = await getRoles()
      this.roleList = rows
    },
    // 获取角色详细信息
    async getDetaliInfoById() {
      const { roleIds } = await getDetaliInfoById(this.$attrs['user-id'])
      this.roleIds = roleIds || []
    },
    // 确定按钮
    async btnOk() {
      try {
        this.loading = true
        await assignRoles({ id: this.$attrs['user-id'], roleIds: this.roleIds })
        this.$message.success('更新成功')
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
