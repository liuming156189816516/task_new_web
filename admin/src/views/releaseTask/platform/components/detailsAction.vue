<!-- 发布平台-套餐 添加 编辑 -->
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
      <el-form-item label="执行类型:" prop="execution_type">
        <el-select v-model="actionModal.formData.execution_type" clearable filterable placeholder="请选择平台">
          <el-option v-for="item in executionTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="折扣:" prop="discount">
        <el-input v-model="actionModal.formData.discount" type="number" placeholder="请输入折扣" @input="changeInput" />
      </el-form-item>
      <el-form-item label="数量:" prop="num">
        <el-input v-model="actionModal.formData.num" type="number" placeholder="请输入数量" @input="changeInput" />
      </el-form-item>
      <el-form-item label="扣除:" prop="deduct">
        <el-input v-model="actionModal.formData.deduct" type="number" placeholder="请输入扣除" @input="changeInput" />
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
          execution_type: '',
          discount: null,
          num: null,
          deduct: null,
        },
        rules: {
          execution_type: [{ required: true, message: '请选择执行类型！', trigger: 'change' }],
          discount: [{ required: true, message: '请输入折扣！', trigger: 'change' }],
          num: [{ required: true, message: '请输入数量！', trigger: 'change' }],
          deduct: [{ required: true, message: '请输入扣除！', trigger: 'change' }],
        },
        isLoading: false,
      },
      cloneRow: {},
      executionTypeList: [
        { label: 'Tiktok-Like', value: '1' },
        { label: 'Tiktok-Follow', value: '2' },
      ],
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
          formData.discount = Number(this.actionModal.formData.discount)
          formData.num = Number(this.actionModal.formData.num)
          formData.deduct = Number(this.actionModal.formData.deduct)
          formData.execution_type = Number(this.actionModal.formData.execution_type)
          if (this.actionModal.type === 'add') {
            formData.publier_app_id = this.cloneRow.id
            addDetailsDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '保存成功！')
                this.$emit('updateDetailDataFun')
              }else {
                this.actionModal.isLoading = false
              }
            })
          } else if (this.actionModal.type === 'edit') {
            editDetailsDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '編輯成功！')
                this.$emit('updateDetailDataFun')
              }else {
                this.actionModal.isLoading = false
              }
            })
          }
        }
      })
    },
    // 关闭新建
    closeModal() {
      this.actionModal.show = false
      this.actionModal.isLoading = false
      this.actionModal.formData = {
        execution_type: '',
        discount: null,
        num: null,
        deduct: null,
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
