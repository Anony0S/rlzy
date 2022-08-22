<template>
  <el-dialog :title="showTitle" :visible="showDialog" @close="bttnCancel">
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="1-50个字符"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          placeholder="1-50个字符"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          placeholder="请选择负责人"
          style="width: 80%"
          @focus="getEmployeesSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          type="textarea"
          style="width: 80%"
          placeholder="1-300个字符"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="bttnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {
  getDeaprtments,
  addDepartment,
  getDeaprtDetalis
} from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'
import { editDeaprtDetalis } from '@/api/departments'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 节点信息
    nodeData: {
      type: Object,
      required: true
    }
  },
  data() {
    // 定义名称校验规则
    const checkNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDeaprtments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts
          .filter(
            (item) =>
              item.id !== this.nodeData.id && item.pid === this.nodeData.pid
          )
          .some((item) => item.name === value)
      } else {
        // 添加模式
        isRepeat = depts
          .filter((item) => item.pid === this.nodeData.id)
          .some((item) => item.name === value)
      }
      isRepeat
        ? callback(new Error(`同级部门下已有${value}部门了`))
        : callback()
    }
    // 定义 code 校验规则
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDeaprtments()
      let isRepeat = false
      if (this.formData.id) {
        isRepeat = depts
          .filter((item) => item.id !== this.formData.id)
          .some((item) => item.code === value && value)
      } else {
        isRepeat = depts.some((item) => item.code === value && value)
      }
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '部门名称为必填项!' },
          { min: 1, max: 50, trigger: 'blur', message: '请输入1-50个字符!' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: 'blur', message: '部门编码为必填项!' },
          { min: 1, max: 50, trigger: 'blur', message: '请输入1-50个字符!' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, trigger: 'blur', message: '部门负责人为必填项!' }
        ],
        introduce: [
          { required: true, trigger: 'blur', message: '部门介绍为必填项!' },
          { min: 1, max: 300, trigger: 'blur', message: '请输入1-300个字符!' }
        ]
      },
      // 员工简单数据列表
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '添加子部门'
    }
  },
  methods: {
    // 获取部门详情
    // 因为父组件调用子组件的方法 先设置了 node 数据 直接调用方法
    // props 传值是异步的
    async getDeaprtDetalis(id) {
      this.formData = await getDeaprtDetalis(id)
    },
    // 获取部门简单数据列表
    async getEmployeesSimple() {
      this.peoples = await getEmployeesSimple()
    },
    // 确定提交
    async btnOK() {
      try {
        await this.$refs.deptForm.validate()
        // 区分场景
        if (this.formData.id) {
          // 编辑数据
          await editDeaprtDetalis({ ...this.formData })
          this.$message.success('编辑成功！')
        } else {
          // 新增数据
          await addDepartment({ ...this.formData, pid: this.nodeData.id })
          this.$message.success('添加成功！')
        }
        this.$emit('addDept')
        this.$emit('update:showDialog', false)
      } catch (error) {
        console.log(error)
        this.$message.success('添加失败！')
      }
    },
    // 取消按钮
    bttnCancel() {
      // 因为 resetFields 只能重置 表单上的数据，非表单上的不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      // 清除校验结果 只能重置定义在 data 中的数据
      this.$refs.deptForm.resetFields()
    }
  }
}
</script>

<style></style>
