<template>
  <div>
    <!-- action为必选参数，不写报错 -->
    <!-- v-loading="loading"
      element-loading-text="上传中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0,0,0,0.8)" -->
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
      <i v-loading="loading" class="el-icon-plus" />
    </el-upload>
    <!-- 上传进度条显示 -->
    <el-progress
      v-if="showProgress"
      :percentage="percent"
      style="width: 180px"
    />

    <!-- 预览弹层 -->
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img style="width: 100%" :src="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云 COS 包
// 实例化 COS 对象
const cos = new COS({
  SecretId: 'AKIDOUUxhEdpSwFJfw42riQxKWbWGgy76vlT',
  SecretKey: 'f9DAzlNq9JIoBOTTNAmDC6PYYRDtOky2'
})
export default {
  name: 'ImgUpload',
  data() {
    return {
      fileList: [],
      // 图片预览弹层
      showDialog: false,
      // 预览图片链接
      previewImg: '',
      // 上传百分比
      percent: 0,
      // 上传进度条显示
      showProgress: false,
      // 上传图片的 uid
      uploadUid: 0,
      // 上传中
      loading: false
    }
  },
  methods: {
    // 文件状态发生变化
    onChange(file, fileList) {
      // 添加文件
      this.fileList = fileList
    },
    // TODO: 自定义上传动作，有个参数 里面有 file 对象，是需要上传到腾讯云服务器的内容
    oRequest(params) {
      // console.log(params.file)
      this.percent = 0
      this.showProgress = true
      this.loading = true
      cos.putObject(
        {
          Bucket: 'rlzy-1253407035', // 存储桶名称
          Region: 'ap-shanghai', // 所属地域
          Key: params.file.name, // 文件名称
          StorageClass: 'STANDARD', // 固定模式
          Body: params.file, // 上传文件对象
          // 上传进度回调函数
          onProgress: (progressData) => {
            this.percent = Math.ceil(progressData.percent * 100)
          }
        },
        (err, data) => {
          // console.log(err || data)
          // if (data) {
          //   this.fileList[0].url = 'https://' + data.Location
          //   this.showProgress = false
          // } else console.log(err)
          if (!err && data.statusCode === 200) {
            // 成功或者失败都进入该函数
            if (err || data.statusCode !== 200) {
              return this.$message.error('上传失败，请重试！')
            }
            // TODO: 上传成功
            this.fileList = this.fileList.map((item) => {
              if (item.uid === this.uploadUid) {
                return { url: 'https://' + data.Location, upload: true }
              }
              return item
            })
            this.showProgress = false
            this.loading = false
          }
        }
      )
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
      } else {
        this.uploadUid = file.uid
        return true
      }
    }
  }
}
</script>

<style lang="scss">
.hideAdd .el-upload--picture-card {
  display: none;
}
</style>
