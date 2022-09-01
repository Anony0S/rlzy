<template>
  <div class="setting-container">
    <el-card>
      <el-tabs>
        <!-- 角色管理 -->
        <el-tab-pane label="角色管理">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="small"
            style="margin: 20px 0"
            @click="showDialog = true"
          >
            新增角色
          </el-button>
          <el-table :data="list" :border="true" :stripe="true">
            <el-table-column
              label="序号"
              width="120"
              type="index"
              align="center"
            />
            <el-table-column
              label="角色"
              width="240"
              prop="name"
              align="center"
            />
            <el-table-column label="描述" prop="description" align="center" />
            <el-table-column label="操作" align="center">
              <template slot-scope="{ row }">
                <el-button size="small" type="success" @click="btnManager(row)">
                  分配权限
                </el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="editRole(row.id)"
                >
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="delRole(row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-row
            type="flex"
            justify="center"
            align="middle"
            style="height: 60px"
          >
            <!-- 分页 -->
            <el-pagination
              :total="page.total"
              :page-size="page.pagesize"
              :current-page="page.page"
              background
              layout="prev, pager, next"
              @current-change="changePage"
            />
          </el-row>
        </el-tab-pane>

        <!-- 公司信息 -->
        <el-tab-pane label="公司信息">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            :closable="false"
            show-icon
          />
          <el-form label-width="120px" style="margin-top: 50px">
            <el-form-item label="公司名称">
              <el-input
                v-model="companyInfo.name"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input
                v-model="companyInfo.companyAddress"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="公司邮箱">
              <el-input
                v-model="companyInfo.mailbox"
                disabled
                style="width: 400px"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input
                v-model="companyInfo.remarks"
                type="textarea"
                :rows="3"
                disabled
                style="width: 400px"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <!-- 弹层 -->
      <el-dialog title="编辑角色" :visible="showDialog" @close="closeDialog">
        <el-form
          ref="roleForm"
          :model="roleForm"
          :rules="rules"
          label-width="120px"
        >
          <el-form-item prop="name" style="width: 90%" label="角色名称">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item style="width: 90%" label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="closeDialog">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">
              确定
            </el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-card>

    <!-- 分配权限弹层 -->
    <ManagerPermission
      ref="ManagerPermission"
      :show-manager-dialog.sync="showManagerDialog"
    />
  </div>
</template>

<script>
import {
  getRoles,
  getCompanyInfo,
  delRole,
  getRoleDetalis,
  updateRole,
  addRole
} from '@/api/settings'
import { mapGetters } from 'vuex'
import ManagerPermission from './components/manager-permission.vue'

export default {
  name: 'Setting',
  components: { ManagerPermission },
  data() {
    return {
      // 表格数据
      list: [],
      // 分页相关数据
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      // 企业信息
      companyInfo: {},
      // 显示弹层
      showDialog: false,
      // 角色信息
      roleForm: {
        name: '',
        description: ''
      },
      // 校验规则
      rules: {
        name: [{ required: true, trigger: 'blur', message: '角色名称必填！' }]
      },
      // 分配权限弹层
      showManagerDialog: false
    }
  },

  computed: {
    ...mapGetters(['companyID'])
  },

  created() {
    this.getRoles()
    this.getCompanyInfo()
  },

  methods: {
    // 获取角色列表
    async getRoles() {
      const { total, rows } = await getRoles(this.page)
      this.page.total = total
      this.list = rows
    },
    // 分页切换页码
    changePage(thisPage) {
      this.page.page = thisPage
      this.getRoles()
    },
    // 获取企业信息
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyID)
    },
    // 删除角色
    async delRole(id) {
      try {
        await this.$confirm('确认删除吗?')
        await delRole(id)
        this.$message.success('删除成功！')
        // 更新数据
        this.getRoles()
      } catch (error) {
        console.log(error)
      }
    },
    // 编辑角色
    async editRole(id) {
      this.roleForm = await getRoleDetalis(id)
      this.showDialog = true
    },
    // 确定按钮
    async btnOK() {
      try {
        this.$refs.roleForm.validate()
        if (this.roleForm.id) {
          // 编辑角色
          await updateRole(this.roleForm)
        } else {
          // 新增角色
          await addRole(this.roleForm)
        }
        // 重新拉取数据
        this.getRoles()
        this.$message.success('操作成功！')
        this.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    // 关闭弹层
    closeDialog() {
      this.showDialog = false
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
    },
    // 分配权限按钮
    async btnManager(row) {
      await this.$refs.ManagerPermission.getPermissionList(row.id)
      this.showManagerDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.setting-container {
  padding: 20px;
}
</style>
