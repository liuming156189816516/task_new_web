<!-- 提现审批 -->
<template>
  <div class="container_coat">
    <div class="condition_warp select_warp">
      <el-form inline size="small">
        <el-form-item>
          <el-input v-model="factorModel.account" clearable placeholder="请输入用户账号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.country" clearable placeholder="请输入国家" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.user_withdraw_id" clearable type="number" placeholder="请输入提现编号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.card_no" clearable placeholder="请输入提现账号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.card_id" clearable placeholder="请输入订单号" style="width:180px;" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="factorModel.start_amount" clearable placeholder="开始金额" style="width:110px;" />
          -
          <el-input v-model="factorModel.end_amount" clearable placeholder="结束金额" style="width:110px;" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="small" type="primary" @click="getPayOrderList(1)">
            查询
          </el-button>
          <el-button icon="el-icon-refresh-right" size="small" @click="restQueryBtn">重置</el-button>
          <el-button :disabled="!pay_id.length" size="small" type="warning" @click="batchApprovalFun(0,1)">
            批量审批
          </el-button>
          <el-button size="small" type="primary" @click="openWithdrawFun">
            提现配置
          </el-button>
        </el-form-item>
        <el-form-item class="fr">
          提现金额
          <em style="font-size: 16px;font-weight: bold;">{{ $baseFun.moneyCut(bounty_amount || 0) }}</em>
        </el-form-item>
      </el-form>
    </div>
    <div class="switch_bar">
      <div class="consun_list handel_area">
        <el-table
          ref="serveTable"
          v-loading="loading"
          :data="bannerList"
          :height="cliHeight"
          border
          element-loading-spinner="el-icon-loading"
          row-key="ID"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          show-body-overflow="title"
          style="width: 100%"
          @selection-change="selectAllChange"
          @row-click="rowSelectChange"
        >
          <el-table-column :selectable="checkSelectable" type="selection" width="55" />
          <el-table-column label="订单号" min-width="140" prop="txid">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.txid" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.txid || "-" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="用户账号" min-width="150" prop="account" />
          <el-table-column align="center" label="国家" min-width="120" prop="country" />
          <el-table-column align="center" label="提现编号" min-width="120" prop="user_withdraw_id" />
          <el-table-column align="center" label="提现账号" min-width="100" prop="card_no" />
          <el-table-column align="center" label="收款类型" min-width="100" prop="type" />
          <el-table-column align="center" label="收款姓名" min-width="100" prop="payee_name">
            <template slot-scope="scope">
              {{ scope.row.payee_name || "-" }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="提现金额" min-width="100" prop="amount" />
          <el-table-column label="状态" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleStatus(command)">
                <span :class="[factorModel.status?'dropdown_title':'']" style="color:#909399">状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in payOptions"
                    :key="idx"
                    :class="{'dropdown_selected':idx==factorModel.status}"
                    :command="idx"
                  >
                    {{ item == '' ? '全部' : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag :type="scope.row.status==2?'success':scope.row.status==3?'danger':'warning'" size="small">
                {{ payOptions[scope.row.status] || "-" }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审批状态" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleApply(command)">
                <span :class="[factorModel.apy_status?'dropdown_title':'']" style="color:#909399">审批状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in applyOption"
                    :key="idx"
                    :class="{'dropdown_selected':idx==factorModel.apy_status}"
                    :command="idx"
                  >
                    {{ item == '' ? '全部' : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.approval_status==2?'success':scope.row.approval_status==3?'danger':'info'"
                size="small"
              >
                {{ applyOption[scope.row.approval_status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="失败原因" min-width="140" prop="remark">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.remark" class="item" effect="dark" placement="top">
                <div style="max-width: 200px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">
                  {{ scope.row.remark || "-" }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" prop="itime" width="160">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "~" }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="更新时间" prop="ptime" width="160">
            <template slot-scope="scope">
              {{ scope.row.ptime > 0 ? $baseFun.resetTime(scope.row.ptime * 1000) : "~" }}
            </template>
          </el-table-column>

        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="factorModel.page"
            :page-size="factorModel.limit"
            :page-sizes="pageOption"
            :total="factorModel.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="limitChange"
            @current-change="offsetChange"
          />
        </div>
      </div>
    </div>
    <!-- 批量审批 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="createModel"
      title="批量审批"
      width="450px"
    >
      <el-form ref="sendForm" :model="sendForm" :rules="sendRules" label-width="100px" size="small">
        <el-form-item label="选择类型" prop="replay_type">
          <el-radio-group v-model="sendForm.replay_type">
            <el-radio :label="2">通过</el-radio>
            <el-radio :label="3">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="sendForm.replay_type==1" label="备注：" prop="remark">
          <el-input
            v-model="sendForm.remark"
            :rows="4"
            placeholder="请输入原因"
            type="textarea"
          />
        </el-form-item>
        <el-form-item style="text-align:center;margin-left: -110px;">
          <el-button @click="createModel=false">取消</el-button>
          <el-button :loading="isLoading" type="primary" @click="submitSendBtn('sendForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 体现配置 -->
    <withdrawConfig ref="refWithdrawConfig" :modal-height="cliHeight" />
  </div>
</template>

<script>
import { resetPage } from '@/utils'
import { getwithdrawapprovallist, doapproval } from './api'
import withdrawConfig from './components/withdrawConfig'
import { getTitleListApi } from '@/views/taskGroup/taskType/api';
export default {
  components: {
    withdrawConfig
  },
  data() {
    return {
      factorModel: {
        status: 0,
        card_no: '',
        task_name: '',
        account: '',
        apy_status: '',
        total: 0,
        offset: 1,
        limit: 10,
        card_id: '',
        start_amount: '',
        end_amount: '',
        country: '',
        user_withdraw_id: null
      },
      type: 0,
      cliHeight: null,
      pay_id: [],
      loading: false,
      bannerList: [],
      isLoading: false,
      createModel: false,
      sendForm: {
        id: '',
        remark: '',
        replay_type: 2
      },
      bounty_amount: 0,
      pageOption: resetPage(),
      sendRules: {
        remark: [
          { required: true, message: '请输入原因', trigger: 'blur' },
        ],
        replay_type: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ]
      },
      applyOption: ['', '未审批', '已通过', '已驳回']
    }
  },
  computed: {
    lopOption() {
      return ['', '禁用', '启用']
    },
    payOptions() {
      return ['', '申请中', '已到账', '失败']
    },
    drawOption() {
      return ['', '银行卡', 'USDT账户']
    }
  },
  watch: {
    createModel(val) {
      if (val === false) {
        this.$refs.sendForm.resetFields();
        this.sendForm.id = '';
        this.sendForm.task_name = '';
        this.sendForm.file_url = '';
        this.sendForm.link = '';
        this.sendForm.remark = '';
        this.sendForm.status = 1;
      }
    }
  },
  mounted() {
    this.getPayOrderList();
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 重置
    restQueryBtn() {
      this.factorModel.card_no = '';
      this.factorModel.account = '';
      this.factorModel.apy_status = '';
      this.factorModel.card_id = '';
      this.factorModel.start_amount = '';
      this.factorModel.end_amount = '';
      this.getPayOrderList(1)
      this.$refs.serveTable.clearSelection();
    },
    // 获取订单列表
    getPayOrderList(num) {
      this.loading = true;
      this.factorModel.page = num || this.factorModel.page;
      const params = {
        id: this.factorModel.card_id,
        page: this.factorModel.page,
        limit: this.factorModel.limit,
        status: this.factorModel.status,
        card_no: this.factorModel.card_no,
        account: this.factorModel.account,
        approval_status: this.factorModel.apy_status || -1,
        start_amount: Number(this.factorModel.start_amount) || -1,
        end_amount: Number(this.factorModel.end_amount) || -1,
        country: this.factorModel.country,
        user_withdraw_id: Number(this.factorModel.user_withdraw_id) || -1,
      }
      getwithdrawapprovallist(params).then(res => {
        this.loading = false;
        this.factorModel.total = res.data.total;
        this.bannerList = res.data.list || [];
        this.bounty_amount = res.data.total_amount || 0;
      })
    },
    // 提现配置
    openWithdrawFun() {
      this.$refs.refWithdrawConfig.open()
    },
    checkSelectable(row) {
      return row.status === 1 && row.approval_status === 1;
    },
    selectAllChange(row) {
      this.pay_id = row.map(item => {
        return item.id
      })
      if (row.status !== 1) {
        for (let k = 0; k < this.pay_id.length; k++) {
          if (this.pay_id[k] === row.id) {
            this.pay_id.splice(k, 1)
          }
        }
      }
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.pay_id.find(item => item === row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      if (row.approval_status === 1) {
        refsElTable.toggleRowSelection(row, true);
      }
    },
    handleApply(val) {
      console.log(val);
      this.factorModel.apy_status = val;
      this.getPayOrderList();
    },
    handleStatus(val) {
      this.factorModel.status = val;
      this.getPayOrderList();
    },
    // 标题
    getTitleListFun() {
      const params = {
        page: 1,
        limit: 1000,
        language: 'en',
        category: 'server.activity.title',
      }
      getTitleListApi(params).then(res => {
        if (res.msg === 'success') {
          console.log('res',res)
          this.titleList = res.data.list.map(item => {
            return {
              value: item.key,
              label: item.val,
            }
          })
          console.log(' this.titleList ', this.titleList)
        }
      })
    },
    // 页数量
    limitChange(val) {
      this.factorModel.limit = val;
      this.getPayOrderList()
    },
    // 页码
    offsetChange(val) {
      this.factorModel.offset = val;
      this.getPayOrderList()
    },
    // 批量审批
    batchApprovalFun(row) {
      this.sendForm.id = row.id;
      this.createModel = true;
      this.$nextTick(() => {
        this.$refs.sendForm.resetFields();
      })
    },
    // 提交
    submitSendBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            ids: this.pay_id,
            approval_status: this.sendForm.replay_type
          }
          this.isLoading = true;
          doapproval(data).then(res => {
            this.isLoading = false;
            this.getPayOrderList()
            this.createModel = false;
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 240;
    },
  },
}
</script>

<style lang="scss" scoped>
.view_img {
  width: 60px;
  height: 60px;
  display: flex;
  cursor: pointer;
  position: relative;

  img {
    width: 100%;
    height: 100%;
  }

  .cover_bg {
    opacity: 0;
    width: 100%;
    height: 100%;
    display: flex;
    gap: 8px;
    position: absolute;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .7);
    transition: all .5s;

    i {
      font-size: 16px;
    }

    .el-icon-view {
      color: #409eff;
    }

    .el-icon-delete {
      color: #f56c6c;
    }
  }
}

.view_img:hover .cover_bg {
  opacity: 1;
}
</style>
