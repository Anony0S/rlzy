<template>
  <div class="emplayees-container">
    <PageTools :show-before="true">
      <span slot="before">共{{ page.total }}条数据</span>
      <template v-slot:after>
        <el-button size="small" type="warning">导入</el-button>
        <el-button size="small" type="danger">导出</el-button>
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
            <el-button type="text" size="small">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button
              type="text"
              size="small"
              @click="delEmployee(row.id)"
            >删除</el-button>
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
    <UploadExcel />
  </div>
</template>

<script>
import { getEmployeesList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee.vue'
export default {
  name: 'Employees',
  components: { AddEmployee },
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
      showDialog: false
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
        this.$message.success('删除成功！')
        this.getEmployeesList()
      } catch (error) {
        console.log(error)
      }
    },
    // TODO: 新增员工
    addEmployee() {
      this.showDialog = true
    }
  }
}
</script>

<style lang="scss" scoped></style>
