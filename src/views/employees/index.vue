<template>
  <div class="emplayees-container">
    <PageTools :show-before="true">
      <span slot="before">共{{ page.total }}条数据</span>
      <template v-slot:after>
        <el-button size="small" type="warning" @click="$router.push('/import')">
          导入
        </el-button>
        <el-button size="small" type="danger" @click="exployExecl">
          导出
        </el-button>
        <el-button size="small" type="primary" @click="addEmployee">
          新增员工
        </el-button>
      </template>
    </PageTools>
    <!-- 防止表格和分页 -->
    <el-card v-loading="loading">
      <el-table border :data="list">
        <el-table-column type="index" label="序号" sortable="" />
        <el-table-column prop="username" label="姓名" sortable="" />
        <el-table-column label="头像" align="center">
          <template slot-scope="{ row }">
            <img
              slot="reference"
              v-imgerror="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto"
              style="
                border-radius: 50%;
                width: 100px;
                height: 100px;
                padding: 10px;
                cursor: pointer;
              "
              @click="showQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" sortable="" />
        <el-table-column
          prop="formOfEmployment"
          label="聘用形式"
          sortable=""
          :formatter="formatterEmployment"
        />
        <el-table-column prop="departmentName" label="部门" sortable="" />
        <el-table-column prop="timeOfEntry" label="入职时间" sortable="">
          <template slot-scope="{ row }">
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" sortable>
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable="" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`/employees/detail/${row.id}`)"
            >
              查看
            </el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="asRole(row.id)">
              角色
            </el-button>
            <el-button type="text" size="small" @click="delEmployee(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :page-size="page.size"
          :total="page.total"
          :current-page="page.page"
          layout="prev, pager, next"
          @current-change="changePage"
        />
      </el-row>
    </el-card>
    <!-- 弹层组件 -->
    <AddEmployee :show-dialog.sync="showDialog" />
    <!-- 二维码弹层 -->
    <el-dialog title="扫码查看图像" :visible.sync="showQc" width="20%">
      <!-- @close="closeQc" -->
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 角色弹层 -->
    <AssignRole
      ref="assignRole"
      v-model="showRoleDialog"
      :user-id="currentUserId"
    />
  </div>
</template>

<script>
import AddEmployee from './components/add-employee.vue'
import AssignRole from './components/assign-role.vue'
import { getEmployeesList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
import EmployeeEnum from '@/api/constant/employees'
import QrCode from 'qrcode'
export default {
  name: 'Employees',
  components: { AddEmployee, AssignRole },
  data() {
    return {
      // 员工列表
      list: [],
      // 分页数据
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      // 加载中
      loading: false,
      // 显示弹层
      showDialog: false,
      // 显示二维码
      showQc: false,
      // 显示角色弹层
      showRoleDialog: false,
      // 用户ID
      currentUserId: ''
    }
  },
  created() {
    this.getEmployeesList()
  },
  methods: {
    // 获取员工列表
    async getEmployeesList() {
      this.loading = true
      const { total, rows } = await getEmployeesList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
      // 当前页没有数据时
      if (total !== 0 && rows.length === 0) {
        this.page.page = this.page.page - 1
        this.getEmployeesList()
      }
    },
    // 改变页面调用
    changePage(curtPage) {
      this.page.page = curtPage
      this.getEmployeesList()
    },
    // 格式化聘用形式
    formatterEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === +cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('您确定要删除吗？')
        await delEmployee(id)
        // 批量删除
        // const { rows } = await getEmployeesList({ page: 1, size: 1000 })
        // for (let i = 1; i < 1000; i++) {
        //   delEmployee(rows[i].id)
        // }
        this.$message.success('删除成功！')
        this.getEmployeesList()
      } catch (error) {
        console.log(error)
      }
    },
    // 新增员工
    addEmployee() {
      this.showDialog = true
    },
    // 导出 excel
    async exployExecl() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      const { rows } = await getEmployeesList({
        page: 1,
        size: this.page.total
      })
      const data = this.formatJson(headers, rows)
      const excel = await import('@/vendor/Export2Excel')
      excel.export_json_to_excel({
        header: Object.keys(headers),
        data,
        filename: '员工列表'
      })
    },
    // 格式化数据
    formatJson(headers, rows) {
      return rows.map((obj) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(obj[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const res = EmployeeEnum.hireType.find(
              (item) => item.id === +obj[headers[key]]
            )
            return res ? res.value : '未知'
          }
          return obj[headers[key]]
        })
      })
      // reduce 方法
      // const arr = rows.reduce((arr, item) => {
      //   const newArr = Object.keys(headers).map((key) => item[headers[key]])
      //   arr.push(newArr)
      //   return arr
      // }, [])
    },
    // 显示二维码
    showQrCode(url) {
      // 有 url 才进行渲染
      if (url) {
        this.showQc = true
        // 页面渲染为异步行为
        this.$nextTick(() => {
          // 如果转化的二维码后面信息是一个地址的话，就会跳转到该地址，如果不是就会显示内容
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else this.$message.warning('该用户还未上传头像！')
    },
    // 角色操作
    async asRole(id) {
      // id: 当前用户的id
      this.currentUserId = id
      await this.$refs.assignRole.getRoleList()
      this.showRoleDialog = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
