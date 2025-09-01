<!-- 静态资源-详情 添加 编辑 -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="actionModal.type==='add'?'新建':'编辑'"
    :visible.sync="actionModal.show"
    center
    width="500px"
    @close="closeModal"
  >
    <el-form
      ref="refActionModal"
      :model="actionModal.formData"
      :rules="actionModal.rules"
      label-width="100px"
      size="small"
    >
      <el-form-item label="类别:" prop="category">
        <el-input v-model="actionModal.formData.category" placeholder="请输入类别" @input="changeInput" />
      </el-form-item>
      <el-form-item label="key:" prop="key">
        <el-input v-model="actionModal.formData.key" placeholder="请输入key" @input="changeInput" />
      </el-form-item>
      <el-form-item label="value:" prop="value">
        <div v-if="actionModal.formData.value" class="imgBox">
          <div v-if="['png','jpg','jpeg','webp'].includes(getImageExtension(actionModal.formData.value))">
            <el-image :src="actionModal.formData.value" style="width: 120px;height: 120px" />
          </div>
          <div v-else>
            <a :href="actionModal.formData.value" class="aUnderline">文件</a>
          </div>
          <i class="el-icon-delete icon_del" @click="delImgFun('value')" />
        </div>
        <UploadFiles
          v-else
          ref="refUploadFiles"
          :format="['png','jpg','jpeg','webp','json']"
          :max-size="100"
          kay="value"
          @uploadSuccess="uploadSuccess"
        />
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="actionModal.formData.remark" placeholder="请输入备注" @input="changeInput" />
      </el-form-item>
      <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
        <el-button @click="closeModal">取消</el-button>
        <el-button :loading="actionModal.isLoading" type="primary" @click="submitFormFun">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone, successTips, getImageExtension } from '@/utils';
import { addDetailsDataApi, editDetailsDataApi } from '@/views/appConfig/staticResources/api';
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { uploadImgFileApi } from '@/api/common.js'

export default {
  name: 'DetailsAction',
  components: {
    UploadFiles
  },
  data() {
    return {
      actionModal: {
        show: false,
        type: 'add',
        formData: {
          category: '',
          key: '',
          value: '',
          remark: '',
        },
        rules: {
          category: [{ required: true, message: '请输入类别！', trigger: 'change' }],
          key: [{ required: true, message: '请输入key！', trigger: 'change' }],
          value: [{ required: true, message: '请选择value！', trigger: 'change' }],
          remark: [{ required: false, message: '请输入备注！', trigger: 'change' }],

        },
        isLoading: false,
      },
      cloneRow: {}

    }
  },
  methods: {
    open(row, type, parentForm) {
      this.actionModal.show = true
      this.actionModal.type = type
      this.cloneRow = deepClone(parentForm)
      this.$nextTick(() => {
        if (row) {
          this.actionModal.formData = deepClone(row)
        } else {
          this.$refs.refActionModal.resetFields()
        }
      })
    },
    // 新建 编辑 保存
    submitFormFun() {
      this.$refs.refActionModal.validate((v) => {
        if (v) {
          this.actionModal.isLoading = true
          const formData = deepClone(this.actionModal.formData)
          if (this.actionModal.type === 'add') {
            formData.assets_id = this.cloneRow.id
            addDetailsDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '保存成功！')
                this.$emit('updateDetailDataFun')
              }
            })
          } else if (this.actionModal.type === 'edit') {
            editDetailsDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '编辑成功！')
                if (this.$refs.refUploadFiles) {
                  this.$refs.refUploadFiles.resetFileFun()
                }
                this.$emit('updateDetailDataFun')
              }
            })
          }
        }
      })
    },
    // 上传成功回调
    uploadSuccess(file, kay) {
      const formData = new FormData();
      formData.append('category', this.actionModal.formData.category);
      formData.append('file', file);
      formData.append('assets_id', this.cloneRow.id);
      uploadImgFileApi(formData).then(res => {
        if (res.msg === 'success') {
          this.actionModal.formData[kay] = res.data.url
          successTips(this, 'success', '上传成功！')
        }
      })
    },
    // 删除图片
    delImgFun(kay) {
      this.actionModal.formData[kay] = ''
    },
    // 关闭新建
    closeModal() {
      this.actionModal.show = false
      this.actionModal.isLoading = false
      this.actionModal.formData = {
        category: '',
        key: '',
        value: '',
        remark: '',
      }
      if (this.$refs.refUploadFiles) {
        this.$refs.refUploadFiles.resetFileFun()
      }
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    getImageExtension
  }

}
</script>

<style lang="scss" scoped>
.imgBox {
  position: relative;

  .icon_del {
    cursor: pointer;
    color: red;
    position: absolute;
    font-size: 22px;
    left: 130px;
    transform: translateY(-50%);
    top: 50%;
  }
}
.aUnderline{
  color: #00a8ff;
  text-decoration: underline;
}
</style>
