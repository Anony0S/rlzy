<template>
  <el-dialog title="新增员工" :visible="showDialog" width="40%" @close="close">
    <el-form
      ref="formData"
      :model="formData"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="姓名" style="width: 90%" prop="username">
        <el-input v-model="formData.username" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" style="width: 90%" prop="mobile">
        <el-input v-model="formData.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" style="width: 90%" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          placeholder="请选择日期"
        />
      </el-form-item>
      <el-form-item label="聘用形式" style="width: 90%" prop="formOfEmployment">
        <el-select
          v-model.number="formData.formOfEmployment"
          placeholder="请选择"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" style="width: 90%" prop="workNumber">
        <el-input v-model="formData.workNumber" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" style="width: 90%" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          placeholder="请选择部门"
          @focus="getList"
        />
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="list"
          :props="{ label: 'name' }"
          :default-expand-all="true"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" style="width: 90%" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          placeholder="请选择日期"
        />
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <el-row slot="footer" type="flex" justify="center" align="middle">
      <el-col :span="6">
        <el-button size="small" @click="close">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDeaprtments } from '@/api/departments'
import { addEmplayee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
import EmployeeEnum from '@/api/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      // 格式化数据
      EmployeeEnum,
      // 表单数据
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      // 表单规则
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' },
          { min: 1, max: 4, message: '用户名长度1-4位！' }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          {
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur',
            message: '手机号格式不正确'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          // 注意：校验设置为 change
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      // 组织架构列表
      list: [],
      // 显示树型结构
      showTree: false,
      // 加载状态
      loading: false
    }
  },
  methods: {
    // 关闭弹层
    close() {
      this.$emit('update:showDialog', false)
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.formData.resetFields()
    },
    // 部门输入框聚焦
    async getList() {
      this.showTree = true
      this.loading = true
      // 获取组织架构列表
      const { depts } = await getDeaprtments()
      console.log(depts)
      this.list = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 点击节点
    selectNode(node) {
      this.formData.departmentName = node.name
      this.showTree = false
    },
    // 确定按钮
    async btnOK() {
      try {
        await this.$refs.formData.validate()
        await addEmplayee(this.formData)
        this.$emit('update:showDialog', false)
        this.$parent.getEmployeesList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style></style>
