<!-- 国际化-详情 添加 编辑 -->
<template>
  <el-dialog
    :title="actionModal.type==='add'?'新建':'编辑'"
    center
    :visible.sync="actionModal.show"
    :close-on-click-modal="false"
    width="500px"
    @close="closeModal"
  >
    <el-form ref="refactionModal" size="small" :model="actionModal.formData" label-width="100px" :rules="actionModal.rules">
      <el-form-item label="语言:" prop="lang">
        <el-input v-model="actionModal.formData.lang" placeholder="请输入语言" @input="changeInput" />
      </el-form-item>
      <el-form-item label="类别:" prop="category">
        <el-input v-model="actionModal.formData.category" placeholder="请输入类别" @input="changeInput" />
      </el-form-item>
      <el-form-item label="key:" prop="key">
        <el-input v-model="actionModal.formData.key" placeholder="请输入key" @input="changeInput" />
      </el-form-item>
      <el-form-item label="value:" prop="value">
        <el-input v-model="actionModal.formData.value" placeholder="请输入value" @input="changeInput" />
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="actionModal.formData.remark" placeholder="请输入备注" @input="changeInput" />
      </el-form-item>
      <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
        <el-button @click="closeModal">取消</el-button>
        <el-button :loading="actionModal.isLoading" type="primary" @click="submitFormFun">确认</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { deepClone, successTips } from '@/utils';
import { addDetailsDataApi, editDetailsDataApi } from '../api';
import UploadFiles from '@/components/UploadFiles/index'

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
          remark: [{ required: true, message: '请输入备注！', trigger: 'change' }],

        },
        isLoading: false,
      },
      cloneRow: {}

    }
  },
  methods: {
    open(row,type,parentForm) {
      this.actionModal.show = true
      this.actionModal.type = type
      if (row) {
        this.cloneRow = deepClone(parentForm)
        this.actionModal.formData = deepClone(row)
      }
    },
// 新建 编辑 保存
    submitFormFun() {
      this.$refs.refactionModal.validate((v) => {
        if (v) {
          this.actionModal.isLoading = true
          const formData = deepClone(this.actionModal.formData)
          if (this.actionModal.type === 'add') {
            formData.assets_id = this.cloneRow.id
            addDetailsDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '保存成功！')
                this.$refs.refUploadFiles.resetFileFun()
                this.$emit('updateDetailDataFun')
              }
            })
          } else if (this.actionModal.type === 'edit') {
            editDetailsDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '編輯成功！')
                this.$refs.refUploadFiles.resetFileFun()
                this.$emit('updateDetailDataFun')
              }
            })
          }
        }
      })
    },
    // 上传成功回调
    uploadSuccess(data) {
      console.log('data',data)
      this.actionModal.formData.value = data.url
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
      this.$refs.refUploadFiles.resetFileFun()
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
  }

}
</script>

<style scoped>

</style>
