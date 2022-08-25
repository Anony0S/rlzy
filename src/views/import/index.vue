<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
import { importEmployees } from '@/api/employees'
export default {
  name: 'Import',
  methods: {
    async success({ header, results }) {
      const userRelations = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      const employeeArry = []
      results.forEach((item) => {
        const info = {}
        Object.keys(item).forEach((key) => {
          if (
            userRelations[key] === 'timeOfEntry' ||
            userRelations[key] === 'correctionTime'
          ) {
            info[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else info[userRelations[key]] = item[key]
        })
        employeeArry.push(info)
      })
      // 添加数据
      try {
        await importEmployees(employeeArry)
        this.$message.success('导入数据成功！')
        this.$router.back()
      } catch (error) {
        console.log(error)
      }
    },
    // 转换 excel 时间数据
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return (
        year +
        (month < 10 ? '0' + month : month) +
        (date < 10 ? '0' + date : date)
      )
    }
  }
}
</script>

<style></style>
