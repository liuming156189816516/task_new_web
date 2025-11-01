<!-- 配置 -->
<template>
  <div class="layoutPlan">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="configModal.show"
      center
      title="配置"
      width="500px"
      @close="closePageModal"
    >
      <el-form
        ref="refAddModal"
        :model="configModal.formData"
        :rules="configModal.rules"
        label-width="100px"
        size="small"
      >
        <el-form-item label="第一天:" prop="day1">
          <el-input v-model="configModal.formData.day1" placeholder="请输入第一天的积分" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item label="第二天:" prop="day2">
          <el-input v-model="configModal.formData.day2" placeholder="请输入第二天的积分" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item label="第三天:" prop="day3">
          <el-input v-model="configModal.formData.day3" placeholder="请输入第三天的积分" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item label="第四天:" prop="day4">
          <el-input v-model="configModal.formData.day4" placeholder="请输入第四天的积分" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item label="第五天:" prop="day5">
          <el-input v-model="configModal.formData.day5" placeholder="请输入第五天的积分" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item label="第六天:" prop="day6">
          <el-input v-model="configModal.formData.day6" placeholder="请输入第六天的积分" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item label="第七天:" prop="day7">
          <el-input v-model="configModal.formData.day7" placeholder="请输入第七天的积分" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="configModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  editConfigApi,
} from '../api'
import { deepClone, resetPage, successTips } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'LayoutPlan',
  data() {
    return {
      pageOption: resetPage(),
      configModal: {
        show: false,
        formData: {
          day1: '',
          day2: '',
          day3: '',
          day4: '',
          day5: '',
          day6: '',
          day7: '',
        },
        rules: {
          day1: [{ required: true, message: '请输入第一天的积分！', trigger: 'change' }],
          day2: [{ required: true, message: '请输入第二天的积分！', trigger: 'change' }],
          day3: [{ required: true, message: '请输入第三天的积分！', trigger: 'change' }],
          day4: [{ required: true, message: '请输入第四天的积分！', trigger: 'change' }],
          day5: [{ required: true, message: '请输入第五天的积分！', trigger: 'change' }],
          day6: [{ required: true, message: '请输入第六天的积分！', trigger: 'change' }],
          day7: [{ required: true, message: '请输入第七天的积分！', trigger: 'change' }],
        },
        isLoading: false,
      },
      cloneRow: {}
    }
  },
  methods: {
    open(row) {
      this.configModal.show = true
      this.cloneRow = deepClone(row)
      this.configModal.formData = this.cloneRow.conf.daily_points
    },
    // 关闭页面
    closePageModal() {
      this.configModal.tableData = []
      this.configModal.selectData = []
      this.configModal.selectIdData = []
      this.configModal.show = false
    },
    // 编辑 打开
    editOpenFun(form) {
      this.configModal.type = 'edit'
      this.configModal.show = true
      this.configModal.formData = deepClone(form)
    },
    // 新建编辑保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.configModal.isLoading = true
          const formData = deepClone(this.configModal.formData)
          formData.day1 = Number(this.configModal.formData.day1)
          formData.day2 = Number(this.configModal.formData.day2)
          formData.day3 = Number(this.configModal.formData.day3)
          formData.day4 = Number(this.configModal.formData.day4)
          formData.day5 = Number(this.configModal.formData.day5)
          formData.day6 = Number(this.configModal.formData.day6)
          formData.day7 = Number(this.configModal.formData.day7)
          const params = {
            id: this.cloneRow.id,
            conf: {
              daily_points: formData
            }
          }
          editConfigApi(params).then(res => {
            successTips(this, 'success', '编辑成功！')
            this.closeModal()
            setTimeout(() => {
              this.$emit('updateData')
            }, 500)
          })
        }
      })
    },
    // 关闭新建编辑弹窗
    closeModal() {
      this.configModal.show = false
      this.configModal.isLoading = false
      this.$refs.refAddModal.resetFields()
      this.configModal.formData = {
        day1: '',
        day2: '',
        day3: '',
        day4: '',
        day5: '',
        day6: '',
        day7: '',
      }
    },

    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp
  }
}
</script>

<style scoped>

</style>
