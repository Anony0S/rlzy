<template>
  <el-dialog title="新增部门" :visible="showDialog">
    <el-form :model="formData" :rules="rules" label-width="120px">
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
        <el-button type="primary" size="small">确定</el-button>
        <el-button size="small">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDeaprtments } from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'
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
      const isRepeat = depts
        .filter((item) => item.pid === this.nodeData.id)
        .some((item) => item.name === value)
      isRepeat
        ? callback(new Error(`同级部门下已有${value}部门了`))
        : callback()
    }
    // 定义 code 校验规则
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDeaprtments()
      const isRepeat = depts.some((item) => item.code === value && value)
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
  methods: {
    async getEmployeesSimple() {
      this.peoples = await getEmployeesSimple()
    }
  }
}
</script>

<style></style>
