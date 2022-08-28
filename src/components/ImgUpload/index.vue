<template>
  <div>
    <!-- action为必选参数，不写报错 -->
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      action="#"
      :on-change="onChange"
      :http-request="oRequest"
      :on-remove="onRemove"
      :on-preview="onPreview"
      :limit="1"
      :class="fileList.length === 1 ? 'hideAdd' : ''"
      :before-upload="beforeUpload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 预览弹层 -->
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img style="width: 100%" :src="previewImg">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ImgUpload',
  data() {
    return {
      fileList: [{ url: 'http://destiny001.gitee.io/image/cxk.gif' }],
      // 图片预览弹层
      showDialog: false,
      // 预览图片链接
      previewImg: 'http://destiny001.gitee.io/image/cxk.gif'
    }
  },
  methods: {
    // 文件状态发生变化
    onChange(file, fileList) {
      // 添加文件
      this.fileList = fileList
    },
    // 自定义请求
    // 覆盖默认的上传行为，可以自定义上传的实现
    oRequest() {
      console.log('自定义请求！')
    },
    // 删除
    // file为要删除的文件，fileList为删过之后的文件
    onRemove(file, fileList) {
      this.fileList = fileList
    },
    // 预览图片
    onPreview(file) {
      this.fileList.url = file.url
      this.previewImg = this.fileList.url
      this.showDialog = true
    },
    // 上传之前进行检查
    beforeUpload(file) {
      console.log(file)
      const imgType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
      const typeStatus = imgType.includes(file.type)
      // 大小限制 浏览器单位为 B
      const sizeLimit = 5 * 1024 * 1024
      if (!typeStatus) {
        this.$message.error('图片格式错误！')
        return false
      } else if (file.size > sizeLimit) {
        this.$message.error('图片最大为5MB！')
        return false
      } else return true
    }
  }
}
</script>

<style lang="scss">
.hideAdd .el-upload--picture-card {
  display: none;
}
</style>
