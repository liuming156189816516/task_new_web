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
      <el-form-item label="组件名称:" prop="page_name">
        <el-input v-model="actionModal.formData.page_name" placeholder="请输入组件名称" @input="changeInput" />
      </el-form-item>
      <el-form-item label="页面配置:" prop="page_conf">
        <el-input v-model="actionModal.formData.page_conf" type="textarea" :rows="5" placeholder="请输入页面配置" @input="changeInput" />
      </el-form-item>
      <el-form-item label="API配置:" prop="api_conf">
        <el-input v-model="actionModal.formData.api_conf" type="textarea" :rows="5" placeholder="请输入API配置" @input="changeInput" />
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
          page_name: '',
          page_conf: '',
          api_conf: '',
        },
        rules: {
          page_name: [{ required: true, message: '请输入组件名称！', trigger: 'change' }],
          page_conf: [{ required: true, message: '请输入页面配置！', trigger: 'change' }],
          api_conf: [{ required: true, message: '请输入API配置！', trigger: 'change' }],

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
            formData.layouts_id = this.cloneRow.id
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
        page_name: '',
        page_conf: '',
        api_conf: '',
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
