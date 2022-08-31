<template>
  <el-dialog
    :title="`${formData.id ? '编辑' : '添加'}权限`"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <el-form ref="perForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="权限名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 90%"
          placeholder="权限名称必填"
        />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 90%"
          placeholder="权限标识必填"
        />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input
          v-model="formData.description"
          style="width: 90%"
          placeholder="权限描述必填"
        />
      </el-form-item>
      <el-form-item label="开启" prop="enVisible">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button
          size="small"
          type="primary"
          :loading="loading"
          @click="sureAdd"
        >
          确定
        </el-button>
        <el-button size="small" @click="handleClose">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addPermission, updatePermission } from '@/api/permisson'
export default {
  name: 'AddPermission',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 数据
      formData: {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型，该类型不需要显示，因为点击添加的时候已经知道类型了
        pid: '', // 添加到的父节点
        enVisible: '0' // 开启
      },
      // 规则
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '请填写权限名称！' }
        ],
        code: [{ required: true, trigger: 'blur', message: '请填写权限标识！' }]
      },
      // 确定按钮加载
      loading: false
    }
  },
  methods: {
    // 关闭弹窗
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.perForm.resetFields()
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
    },
    // 确定按钮
    async sureAdd() {
      try {
        await this.$refs.perForm.validate()
        this.loading = true
        this.formData.id
          ? await updatePermission(this.formData)
          : await addPermission(this.formData)
        this.handleClose()
        this.$parent.getPermissionList()
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}成功！`)
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style></style>
