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
    <el-form ref="refActionModal" size="small" :model="actionModal.formData" label-width="100px" :rules="actionModal.rules">
      <el-form-item label="语言:" prop="Lang">
        <el-input v-model="actionModal.formData.Lang" placeholder="请输入语言" @input="changeInput" />
      </el-form-item>
      <el-form-item label="类别:" prop="category">
        <el-input v-model="actionModal.formData.category" placeholder="请输入类别" @input="changeInput" />
      </el-form-item>
      <el-form-item label="Key:" prop="Key">
        <el-input v-model="actionModal.formData.Key" placeholder="请输入key" @input="changeInput" />
      </el-form-item>
      <el-form-item label="Value:" prop="Value">
        <el-input v-model="actionModal.formData.Value" placeholder="请输入value" @input="changeInput" />
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

export default {
  name: 'DetailsAction',
  components: {
  },
  data() {
    return {
      actionModal: {
        show: false,
        type: 'add',
        formData: {
          Lang: '',
          category: '',
          Key: '',
          Value: '',
        },
        rules: {
          Lang: [{ required: true, message: '请输入语言！', trigger: 'change' }],
          category: [{ required: true, message: '请输入类别！', trigger: 'change' }],
          Key: [{ required: true, message: '请选择key！', trigger: 'change' }],
          Value: [{ required: true, message: '请输入value！', trigger: 'change' }],

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
            formData.il8n_id = this.cloneRow.id
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
                this.$emit('updateDetailDataFun')
              }
            })
          }
        }
      })
    },
    // 上传成功回调
    uploadSuccess(data) {
      this.actionModal.formData.Value = data.url
    },
    // 关闭新建
    closeModal() {
      this.actionModal.show = false
      this.actionModal.isLoading = false
      this.actionModal.formData = {
        Lang: '',
        category: '',
        Key: '',
        Value: '',
      }
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
