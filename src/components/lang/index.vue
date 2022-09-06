<template>
  <el-dropdown @command="change">
    <div>
      <svg-icon style="color: #fff; font-size: 20px" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="zh" :disabled="$i18n.locale === 'zh'">
        中文
      </el-dropdown-item>
      <el-dropdown-item command="en" :disabled="$i18n.locale === 'en'">
        英文
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'Lang',
  methods: {
    change(type) {
      Cookie.set('language', type)
      this.$message.success('语言切换成功')
      window.location.reload()
    }
  }
}
</script>

<style></style>
