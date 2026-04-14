<!-- 提现账户 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <!--      <el-form-item>-->
      <!--        <el-select v-model="queryData.country" placeholder="请选择国家">-->
      <!--          <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value" />-->
      <!--        </el-select>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-input v-model="queryData.account" clearable placeholder="请输入账号" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.account_id" clearable placeholder="请输入账号id" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form v-show="false" :inline="true" size="small">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, idx) in setBatchData.batchOption"
              v-show="item.label"
              :key="idx"
              :command="{item,idx}"
            >
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="tableContent">
      <el-table
        ref="serveTable"
        v-loading="loading"
        :data="tableData"
        :height="cliHeight"
        border
        element-loading-spinner="el-icon-loading"
        row-key="ID"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="账号" min-width="120" prop="account" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="账号ID" min-width="120" prop="account_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="提现类型" min-width="120" prop="type" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], typeSelectData) }}
          </template>
        </el-table-column>
        <el-table-column label="银行卡号" min-width="120" prop="card_no" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="银行编码" min-width="120" prop="code" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], codeSelectData) }}
          </template>
        </el-table-column>
        <el-table-column label="收款姓名" min-width="120" prop="payee_name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="证件号码" min-width="120" prop="identify_Num" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="国家" min-width="120" prop="country" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], countryList) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="layui_page">
        <el-pagination
          :current-page.sync="queryData.page"
          :page-size="queryData.limit"
          :page-sizes="pageOption"
          :total="queryData.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="changePageSize($event,'table')"
          @current-change="changePageCurrent($event,'table')"
        />
      </div>
    </div>
    <!-- 添加 编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.type==='add'?'新建':'编辑'"
      :visible.sync="addModal.show"
      center
      width="500px"
      class="actionModal"
      @close="closeModal"
    >
      <div class="content" :style="{maxHeight:cliHeight-100+'px'}">
        <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="0" size="small" label-position="top">
          <el-form-item v-if="addModal.formData.country==='ID'" label="银行编码:" prop="code">
            <el-select v-model="addModal.formData.code" placeholder="请选择银行编码">
              <el-option v-for="item in codeSelectData" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-else label="提现类型:" prop="type">
            <el-select v-model="addModal.formData.type" placeholder="请选择提现类型">
              <el-option v-for="item in typeSelectData" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="银行卡号:" prop="card_no">
            <el-input v-model="addModal.formData.card_no" placeholder="请输入银行卡号" @input="changeInput" />
          </el-form-item>

          <el-form-item label="收款姓名:" prop="payee_name">
            <el-input v-model="addModal.formData.payee_name" placeholder="请输入收款姓名" @input="changeInput" />
          </el-form-item>
          <el-form-item label="证件号码:" prop="identify_Num">
            <el-input v-model="addModal.formData.identify_Num" placeholder="请输入证件号码" @input="changeInput" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <div class="el-item-bottom" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, editDataApi } from './api';

import { deepClone, resetPage, successTips, getLabelByVal,getLabelArrByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import { uploadFileApi } from '@/api/common';

export default {
  name: 'WithdrawAccount',
  components: {
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 20,
        total: 0,
        account: '',
        account_id: '',
      },
      countryList: [
        { label: '巴西', value: 'BR' },
        { label: '印尼', value: 'ID' },
        { label: '印度', value: 'IN' },
      ],
      typeSelectData: [
        { label: 'CPF', value: 'CPF' },
        { label: 'CNPJ', value: 'CNPJ' },
        { label: 'EMAIL', value: 'EMAIL' },
        { label: 'PHONE', value: 'PHONE' }
      ],
      codeSelectData: [],
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          level: null,
          badge_icon: '',
          avatar_coin: '',
          tar_points: null,
          reward_points: null,
          country: '',
        },
        rules: {
          level: [
            { required: true, message: '请输入等级！', trigger: 'change' },
            {
              required: true, validator: (rule, value, callback) => {
                const reg = /^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/
                if (reg.test(value)) {
                  callback()
                } else {
                  return callback(new Error('请输入大于0的数！'))
                }
              }, trigger: 'change'
            },
          ],
          badge_icon: [
            { required: true, message: '请上传徽章图标！', trigger: 'change' },
          ],
          avatar_coin: [{ required: true, message: '请上传头像上的图标！', trigger: 'change' }],
          tar_points: [
            { required: true, message: '请输入目标积分！', trigger: 'change' },
            {
              required: true, validator: (rule, value, callback) => {
                const reg = /^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/
                if (reg.test(value)) {
                  callback()
                } else {
                  return callback(new Error('请输入大于0的数！'))
                }
              }, trigger: 'change'
            },
          ],
          reward_points: [
            { required: true, message: '请输入升级奖励！', trigger: 'change' },
            {
              required: true, validator: (rule, value, callback) => {
                const reg = /^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/
                if (reg.test(value)) {
                  callback()
                } else {
                  return callback(new Error('请输入大于0的数！'))
                }
              }, trigger: 'change'
            },
          ],
          country: [
            { required: true, message: '请选择国家！', trigger: 'change' },
          ],
        },
        isLoading: false,
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        batchOption: [
          { icon: 'delete', label: '批量删除' },
        ],
      },

    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表
    getDataListFun(num) {
      this.$nextTick(() => {
        const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
        tableBodyWrapper.scrollTop = 0
      })
      this.loading = true;
      this.tableData = []
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        account: this.queryData.account,
        account_id: Number(this.queryData.account_id),
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = deepClone(res.data.list)
          if (res.data.list.length) {
            this.codeSelectData = []
            const dataObj = res.data.list[0].bank_code_config
            Object.keys(dataObj).forEach(key => {
              this.codeSelectData.push({ value: key,label: dataObj[key] })
            });
          }
        } else {
          this.loading = false;
          this.tableData = []
        }
      })
    },
    // 新建
    addOpenFun() {
      this.addModal.type = 'add'
      this.addModal.show = true
    },
    // 编辑
    editOpenFun(row) {
      this.addModal.show = true
      this.addModal.type = 'edit'
      this.addModal.formData = deepClone(row)
    },
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.account_id = formData.account_id ? Number(formData.account_id) : 0
          if (this.addModal.type === 'add') {
            /*
            addDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '保存成功！')
                this.closeModal()
                this.getDataListFun()
              }
            })
            */
          } else if (this.addModal.type === 'edit') {
            editDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '编辑成功！')
                this.closeModal()
                this.getDataListFun()
              }
            })
          }
        }
      })
    },
    // 上传成功回调
    uploadSuccess(file, kay) {
      const formData = new FormData();
      formData.append('directory', 'badge');
      formData.append('file', file);
      uploadFileApi(formData).then(res => {
        if (res.msg === 'success') {
          this.addModal.formData[kay] = res.data.url
          successTips(this, 'success', '上传成功！')
          if (this.$refs.refUploadFiles) {
            this.$refs.refUploadFiles.resetFileFun()
          }
        }
      })
    },
    // 删除图片
    delImgFun(kay) {
      this.addModal.formData[kay] = ''
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      this.addModal.isLoading = false
      this.$refs.refAddModal.resetFields();
      this.addModal.formData = {
        level: null,
        badge_icon: '',
        avatar_coin: '',
        tar_points: null,
        reward_points: null,
      }
    },
    // 批量操作
    handleCommand(command) {
      if (!this.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.item.label === '批量删除') {
        this.delDataFun()
      }
    },
    // 删除
    delDataFun() {
      /*
      this.$confirm(`确认删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ids: this.selectIdData,// 要删除与的id集合
            }
            delDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDataListFun()
                done();
                instance.confirmButtonLoading = false;
              }
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消' });
      })
     */
    },
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.selectData = [];
      this.queryData = {
        page: 1,
        limit: 20,
        total: 0,
        account: '',
        account_id: '',
      }
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },

    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp,
    getLabelByVal,
    getLabelArrByVal

  }
}
</script>

<style lang="scss" scoped>
.bt-l-8 {
  margin-left: 8px
}

.del:hover {
  color: rgba(255, 0, 0, .8);
  border-color: #dcdfe6;
  background-color: transparent;
}

.imgBox {
  position: relative;

  .icon_del {
    cursor: pointer;
    color: red;
    position: absolute;
    font-size: 22px;
    left: 130px;
    top: 38%;
  }
}

.actionModal{
 ::v-deep .el-dialog__body{
    padding: 0;
  }
.content{
  overflow: hidden;
  overflow-y: auto;
  padding: 16px;

}
  .el-form{
    //display: flex;
    //align-items: self-start;
    //justify-content:space-between;
    //flex-wrap: wrap;
    .el-form-item{
      //width: 48%;
    }
    .item_100{
      //width: 100%;
      //margin-top: 20px;
    }
}

}
</style>
