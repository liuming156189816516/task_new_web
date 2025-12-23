<!-- 数据统计 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 当日统计数据 -->
    <div class="detail_card">
      <el-table
        v-loading="isLoading"
        :data="statisticsList"
        border
        element-loading-spinner="el-icon-loading"
        min-height="max-content"
        style="width: 100%;"
      >
        <el-table-column label="新增注册" prop="register_num" width="100" />
        <el-table-column label="登录人数" min-width="100" prop="login_num" />
        <el-table-column label="当天新增活跃用户" min-width="140" prop="today_new_active_user_num" />
        <el-table-column label="当天活跃用户" min-width="120" prop="today_active_user_num" />
        <el-table-column label="ws私发任务数" min-width="120" prop="ws_send_task_num" />
        <el-table-column label="ws自动私发任务数" min-width="140" prop="ws_send_auto_task_num" />
        <el-table-column label="ws拉群任务数" min-width="120" prop="ws_create_group_task_num" />
        <el-table-column label="短信任务数" min-width="100" prop="sms_task_num" />
        <el-table-column label="ws私发资源数" min-width="120" prop="ws_send_data_num" />
        <el-table-column label="ws自动私发资源数" min-width="140" prop="ws_send_auto_data_num" />
        <el-table-column label="ws拉群资源数" min-width="120" prop="ws_create_group_data_num" />
        <el-table-column label="短信资源数" min-width="100" prop="sms_data_num" />
        <el-table-column label="ws私发赏金" min-width="100" prop="ws_send_bounty_amount" />
        <el-table-column label="ws自动私发赏金" min-width="140" prop="ws_send_auto_bounty_amount" />
        <el-table-column label="ws拉群赏金" min-width="100" prop="ws_create_group_bounty_amount" />
        <el-table-column label="短信赏金" min-width="100" prop="sms_bounty_amount" />
        <el-table-column label="佣金" min-width="100" prop="commission_amount" />
        <el-table-column label="提现人数" min-width="100" prop="withdraw_user_num" />
        <el-table-column label="提现扣款" min-width="100" prop="withdraw_amount" />
      </el-table>
    </div>
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item v-if="task_id">
        <el-button size="small" @click="$router.go(-1)">
          <i class="el-icon-back" />
          <span>{{ $t('sys_q006') }}</span>
        </el-button>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="task_time"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="datetimerange"
        />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="initTaskList(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 分组管理 -->
    <div class="continer_main">
      <div class="group_continer">
        <el-table
          ref="serveTable"
          v-loading="loading"
          :data="accountDataList"
          :height="cliHeight"
          :summary-method="getSummaries"
          border
          element-loading-spinner="el-icon-loading"
          row-key="id"
          show-summary
          style="width: 100%;"
          use-virtual
        >
          <el-table-column label="主键ID" min-width="140" prop="id" show-overflow-tooltip />
          <el-table-column label="新增注册" min-width="100" prop="register_num" />
          <el-table-column label="登录人数" min-width="100" prop="login_num" />
          <el-table-column label="当天新增活跃用户" min-width="140" prop="today_new_active_user_num" />
          <el-table-column label="当天活跃用户" min-width="120" prop="today_active_user_num" />
          <el-table-column label="ws私发任务数" min-width="120" prop="ws_send_task_num" />
          <el-table-column label="ws自动私发任务数" min-width="140" prop="ws_send_auto_task_num" />
          <el-table-column label="ws拉群任务数" min-width="120" prop="ws_create_group_task_num" />
          <el-table-column label="短信任务数" min-width="100" prop="sms_task_num" />
          <el-table-column label="ws私发资源数" min-width="120" prop="ws_send_data_num" />
          <el-table-column label="ws自动私发资源数" min-width="140" prop="ws_send_auto_data_num" />
          <el-table-column label="ws拉群资源数" min-width="120" prop="ws_create_group_data_num" />
          <el-table-column label="短信资源数" min-width="100" prop="sms_data_num" />
          <el-table-column label="ws私发赏金" min-width="100" prop="ws_send_bounty_amount" />
          <el-table-column label="ws自动私发赏金" min-width="140" prop="ws_send_auto_bounty_amount" />
          <el-table-column label="ws拉群赏金" min-width="100" prop="ws_create_group_bounty_amount" />
          <el-table-column label="短信赏金" min-width="100" prop="sms_bounty_amount" />
          <el-table-column label="佣金" min-width="100" prop="commission_amount" />
          <el-table-column label="提现人数" min-width="100" prop="withdraw_user_num" />
          <el-table-column label="提现扣款" min-width="100" prop="withdraw_amount" />
          <el-table-column label="人工调整" min-width="100" prop="adjust_amount" />
          <el-table-column label="统计时间 年月日" min-width="140" prop="statis_time_str" />
          <el-table-column label="统计时间" min-width="160" prop="statis_time" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
            </template>
          </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="page"
            :page-size="limit"
            :page-sizes="pageOption"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeFun"
            @current-change="handlePageFun"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { resetPage, zonedTimeToTimestamp } from '@/utils/index'
import { getStatisticsList, getTodayStatisticsInfo } from './api'
import { formatDateTime } from '@/filters';

export default {
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      account: '',
      task_id: '',
      pixe_id: [],
      task_time: [],
      loading: false,
      isLoading: false,
      checkIdArry: [],
      checkAccount: [],
      statisticsList: [],
      accountDataList: [],
      pageOption: resetPage(),
      showNum: [1, 2, 3, 4, 5, 6, 7, 8, 12, 13, 14],
      cliHeight: null
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.task_id = this.$route.query.id;
    this.initTaskList();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 当日统计数据
    getStatistics() {
      this.isLoading = true;
      getTodayStatisticsInfo({}).then(res => {
        this.statisticsList = [res.data]
        this.isLoading = false;
      })
    },
    // 列表数据
    initTaskList(num) {
      this.loading = true;
      this.page = num || this.page;
      const startTime = this.task_time && this.task_time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.task_time[0]))) / 1000 : ''
      const endTime = this.task_time && this.task_time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.task_time[1]))) / 1000 : ''
      const params = {
        page: this.page,
        limit: this.limit,
        account: this.account,
      }
      if (startTime && endTime) {
        params.start_time = startTime
        params.end_time = endTime
      }
      this.task_id ? params.uid = this.task_id : '';
      this.getStatistics();
      getStatisticsList(params).then(res => {
        this.loading = false;
        this.total = res.data.total;
        this.accountDataList = res.data.list || [];
        this.$nextTick(() => {
          if (this.$refs.serveTable) {
            this.$refs.serveTable.doLayout();
          }
        })
      })
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => {
        return item.id
      })
      this.checkAccount = row.map(item => {
        return item.account
      })
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.checkIdArry.find(item => item === row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    restQueryBtn() {
      this.account = '';
      this.task_time = []
      this.checkAccount = [];
      this.initTaskList(1);
      this.$refs.serveTable.clearSelection();
    },

    handleSizeFun(limit) {
      this.limit = limit;
      this.initTaskList(1);
    },
    handlePageFun(page) {
      this.page = page;
      this.initTaskList();
    },
    switchPage({ page, size }) {
      this.loading = true;
      if (this.limit !== size) {
        this.page = 1;
      } else {
        this.page = page;
      }
      this.limit = size;
      this.initTaskList();
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (index === 0) {
          sums[index] = this.$t('sys_c125');
          return;
        } else if (this.showNum.indexOf(index) > -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 340;
    },
  }
}
</script>

<style lang="scss" scoped>
.detail_card {
  // width: 100%;
  width: 100%;
  margin-bottom: 20px;
  // min-height: 160px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;

  .card_item {
    height: 60px;
    width: calc((100% - (5 - 1) * 30px) / 5);
    display: flex;
    font-size: 14px;
    cursor: pointer;
    align-items: center;
    border-radius: 10px;
    padding: 0 20px;
    margin: 10px 0;
    margin-left: 30px;
    border-radius: 10px;
    justify-content: center;
    //   justify-content: space-between;
    .card_num {
      display: flex;
      font-weight: 600;
      font-size: 20px;
      margin-left: 10px;

      em {
        font-style: normal;
      }
    }
  }

  .card_item:nth-of-type(5n + 1) {
    margin-left: 0;
  }
}

::v-deep .el-card__body {
  width: 100%;
  height: 118px;
  display: flex;
  flex-shrink: 0;
  position: relative;
  align-items: center;
  justify-content: space-between;
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

  & > div {
    flex: 1;
  }

  .refsh_icon {
    cursor: pointer;
    color: #409eff;
    position: absolute;
    top: 8px;
    right: 8px;
  }

  .box_card_item {
    display: flex;
    cursor: pointer;
    padding: 6px;
    align-items: center;
    flex-direction: column;

    span {
      font-size: 16px;
    }

    .port_title {
      color: #409eff;
      font-size: 18px;
      margin-bottom: 20px;
    }
  }
}

.level_01 {
  display: flex;
  color: #C0C4CC;
  align-items: center;
  width: max-content;
  padding: 0 15px;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  border: 1px solid #DCDFE6;

  .level_01_1 {
    color: #606266;
    font-size: 13px;
    margin-left: 10px;
  }

  .screen_t_02 {
    width: 20px;
    height: 20px;
    color: #fff;
    display: flex;
    font-size: 12px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-left: 5px;
    background-color: #409eff;
  }

  .down_01 {
    width: 500px;
    height: 40px;
    position: absolute;
    top: 40px;
    left: 0;
    border-radius: 4px;
    border: solid 1px #dfe4ed;
    background-color: #FFFFFF;
    -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

    .down_01_01 {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      top: -12px;
      left: 20%;
      transform: translateX(-50%);
      margin-right: 3px;
      border-bottom-width: 0;
      border-bottom-color: #e6ebf5;
      border-width: 6px;
      -webkit-filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    }

    .down_01_01::after {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
    }
  }
}

.level_01:hover {
  border-color: #C0C4CC;
}

.custom_popover {
  .screen_01 {
    color: #209cdf;
    display: flex;

    .screen_t_01 {
      display: flex;
      opacity: .7;
      align-items: center;
      cursor: pointer;

      i {
        margin-right: 5px;
      }
    }

    .screen_t_01:nth-child(1) {
      margin-right: 20px;
    }

    .screen_t_01:hover {
      opacity: 1;
    }
  }

  .select_02 {
    .el-icon-close {
      font-size: 14px;
      color: #f56c6c;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.level_01_01 {
  width: 100%;
  display: flex;
  font-size: 12px;
  margin-bottom: 10px;

  .level_01_02 {
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 4px;
    width: max-content;
    margin-right: 10px;
    background-color: #ecf5ff;

    .el-icon-error {
      color: #409eff;
      font-size: 17px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}

::v-deep .el-form-item {
  margin-bottom: 10px;
}

::v-deep .el-radio-group {
  margin-top: -2px;
}

::v-deep .el-radio-button:first-child .el-radio-button__inner {
  border-radius: 0;
}

.remark_ext {
  width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.select_body {
  .select_ele {
    width: 130px;

    ::v-deep .el-input__inner {
      border-right: transparent;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
  }

  .input_ele {
    width: 202px;

    ::v-deep .el-input__inner {
      border-left: transparent;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      border-left: 1px solid #DCDFE6;
    }
  }
}

.continer_main {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .group_mian_hide {
    display: none;
  }

  .group_continer {
    width: 100%;
    overflow-x: auto;
  }
}

.group_tips {
  display: flex;
  color: #f56c6c;
  font-size: 12px;
  align-items: center;
  justify-content: center;
}

.group_head_warp {
  display: flex;
  width: 220px;
  height: 40px;
  flex-shrink: 0;
  position: relative;
  font-size: 14px;
  color: #606266;
  align-items: center;
  padding: 0 8px 0 15px;
  box-sizing: border-box;
  justify-content: space-between;
  background: #f5f7fa;

  .group_head {
    cursor: pointer;
    display: flex;
    align-items: center;

    .el-icon-d-arrow-left {
      color: #409eff;
      font-size: 18px;
      margin-right: 10px;
    }
  }

  .custom_popover {
    position: absolute;
    top: 280px;
    // position: absolute;
    // top: -80px;
  }

  .el-icon-setting {
    margin-left: 10px;
  }

  .group_icon {
    display: flex;

    i {
      cursor: pointer;
    }
  }
}

.group_warp {
  width: 220px;
  max-height: 550px;
  overflow-y: auto;
  flex-shrink: 0;
  flex-wrap: wrap;

  .group_item {
    display: flex;
    width: 100%;
    flex-shrink: 0;
    height: 36px;
    margin-top: 8px;
    cursor: pointer;
    font-size: 14px;
    align-items: center;
    justify-content: space-between;
    padding: 0 8px 0 12px;

    .group_name {
      width: 80%;
      display: flex;
      align-items: center;

      .left_icon {
        margin-right: 6px;
      }

      .group_text {
        max-width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .el-icon-more,
    .el-icon-delete {
      margin-left: 10px;
      position: relative;

      .del_alert {
        //opacity: 0;
        width: 60px;
        padding: 10px;
        display: flex;
        position: absolute;
        top: 15px;
        left: -22px;
        z-index: 99999;
        border-radius: 4px;
        align-items: center;
        justify-content: center;
        // background-color: darkgreen;
        border: 1px solid #ebeef5;;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

        .del_arrow {
          position: absolute;
          display: block;
          width: 0;
          height: 0;
          border-color: transparent;
          border-style: solid;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          margin-right: 3px;
          border-bottom-width: 0;
          border-bottom-color: #ebeef5;
          border-width: 6px;
          filter: drop-shadow(0 2px 12px rgba(0, 0, 0, .03));
        }
      }
    }
  }

  .group_item:hover {
    background-color: #F5F8FA;
  }

  .group_active {
    background-color: #ebeef5;
  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}

.close_inherit, .add_inherit {
  display: flex;
  width: 100%;
  justify-content: center;

  .close_desc {
    display: flex;
    height: max-content;
    color: #606266;
    line-height: 1.4;
    font-size: 14px;
    padding: 10px;
    margin: 0 10px;
    border-radius: 10px;
    flex-direction: column;
    border: 1px solid #dcdcdc;
  }

  .footer_btn {
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
}

.add_inherit {
  justify-content: space-between;

  .table_group {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }

  .table_ele {
    width: 100%;
    height: 100%;
    // display: flex;
    flex-grow: 2;
    flex-direction: column;

    .tab_check_warp {
      margin: 12px 0 20px 10px;
    }
  }
}

.seat_class {
  border: 1px solid #e0e0e0;
  padding: 10px;
  border-radius: 10px;

  .seat_item {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 5px;
    color: #409eff;
    background: #ecf5ff;
    border-radius: 4px;
    border: 1px solid #b3d8ff;
  }
}

.loading_icon {
  margin-top: 10px;
}
</style>

<style lang="scss">
.group_continer {
  .el-pagination {
    text-align: left !important;
  }
}
</style>
