<template>
  <div class="container">
    <div v-if="!successFileList.length" class="toolBox">
      <el-button class="custom_file" :loading="uploadIng">选择文件
        <input ref="fileInputRef" title="" :disabled="uploadIng" type="file" @change="fileInputFun">
      </el-button>
    </div>
    <div v-if="successFileList.length" class="successFileNameList">
      <div v-for="(item,index) in successFileList" :key="index" class="fileItem">
        <el-image :src="item.url" style="width: 120px;height: 120px;" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'UploadFiles2',
  props: {
    // 单个文件最大大小（MB）
    maxSize: {
      type: Number,
      default: 5 // 100MB
    },
    // 文件格式
    format: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 文件格式
    seeFormat: {
      type: Array,
      default: () => {
        return ['mp4']
      }
    },
    // 文件列表
    defaultFileList: {
      type: Array,
      default: () => {
        return []
      }
    },

  },
  data() {
    return {
      // 上传状态
      uploadIng: false,
      // 选择的文件
      fileList: [],
      // 文件类型
      fileType: '',
      // 上传成功的文件
      successFileList: [],

    };
  },
  computed: {},
  watch: {
    defaultFileList(value) {
      if (value.length) {
        this.successFileList = value
      }
    },
    immediate: true
  },
  methods: {
    // 上传文件
    fileInputFun() {
      this.uploadIng = true
      const { files } = this.$refs['fileInputRef']
      const fileList = [files[0]]
      if (fileList.length) {
        this.fileList = fileList.map(item => {
          item.fileExtension = item.name.match(/\.[^.]+$/)[0].slice(1);
          item.fileSize = (item.size / (1024 * 1024)).toFixed(2) + ' MB'
          return item
        })
        const file = files[0]
        if (this.format.includes(file.fileExtension)) {
          this.uploadImgFileFun(file)
        } else {
          this.$message({
            message: '请选择' + this.format.join(',') + '格式文件上传！',
            type: 'warning'
          });
        }
      } else {
        this.$message({
          message: '请选择文件后开始上传！',
          type: 'warning'
        });
      }
    },
    // 上传图片
    uploadImgFileFun(file) {
      this.$emit('uploadSuccess', file)
    },
    // 删除
    delDataFun(item, index) {
      this.successFileList = []
      this.fileList = []
      this.uploadIng = false
    },

    // 清空数据
    resetFileFun() {
      this.uploadIng = false
      this.fileList = []
      this.successFileList = []
    }
  }
}
</script>

<style lang="scss" scoped>

.container {
  width: 100%;
  margin: 0 auto;
  overflow: hidden;

  .toolBox {
    display: flex;
    justify-content: space-between;
    font-size: 20px;

    .custom_file{
      margin: 0;
    }

  }

  .successFileNameList {
    .fileItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 30px;
      font-size: 12px;
      width: 100%;
      padding: 0 10px;
      border-radius: 8px;
      background: rgba(108, 117, 125, 0.1);

      .iconBox {
        i {
          font-size: 16px;
          cursor: pointer;
          margin-right: 10px;
        }

        .del {
          color: red;
        }

        .see {
          color: #67c23a;
        }

        .download {
          color: rgb(64, 158, 255);
        }
      }
    }
  }

}
</style>
