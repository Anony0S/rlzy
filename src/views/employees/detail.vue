<template>
  <div class="detail-container">
    <el-card>
      <el-tabs>
        <!-- 左 -->
        <el-tab-pane label="登录账户设置">
          <el-form
            ref="infoForm"
            :model="userInfo"
            :rules="rules"
            label-width="220px"
            style="margin-top: 30px"
          >
            <el-form-item label="姓名：" prop="username">
              <el-input
                v-model="userInfo.username"
                placeholder="请输入姓名"
                style="width: 300px"
              />
            </el-form-item>
            <el-form-item label="密码：" prop="password">
              <!-- type="password" -->
              <el-input
                v-model="userInfo.password"
                placeholder="请输入密码"
                style="width: 300px"
              />
            </el-form-item>
            <el-button
              type="primary"
              style="margin-left: 220px"
              @click="saveUserDetailById"
            >
              更新
            </el-button>
          </el-form>
        </el-tab-pane>

        <!-- 中 -->
        <el-tab-pane label="个人详情"> 个人详情 </el-tab-pane>

        <!-- 右 -->
        <el-tab-pane label="岗位信息"> 岗位信息 </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { getDetaliInfoById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
export default {
  data() {
    return {
      userInfo: {
        username: '',
        // 避免把读出来的加密的密码给赋值上去
        password: ''
      },
      // 验证规则
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '请填写用户名' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '请填写密码' },
          { min: 6, max: 9, trigger: 'blur', message: '密码要求6-9位' }
        ]
      }
    }
  },
  created() {
    this.getDetaliInfoById()
  },
  methods: {
    // 获取用户详情
    async getDetaliInfoById() {
      // console.log(this.$route.params.id)
      const res = await getDetaliInfoById(this.$route.params.id)
      this.userInfo = res
      this.userInfo.password = ''
      // this.userInfo.password = password
    },
    // 保存用户信息
    async saveUserDetailById() {
      try {
        await this.$refs.infoForm.validate()
        await saveUserDetailById(this.userInfo)
        this.$message.success('保存成功！')
      } catch (error) {
        this.$message.error('保存失败！')
        console.log(error)
      }
    }
  }
}
</script>

<style></style>
