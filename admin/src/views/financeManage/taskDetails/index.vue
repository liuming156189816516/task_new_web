<!-- 任务明细 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.uniqueid" clearable placeholder="请输入执行记录" />
      </el-form-item>
      <!--
      <el-form-item>
        <el-select v-model="queryData.task_type" clearable filterable placeholder="请选择任务类型">
          <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.platform" clearable filterable placeholder="请选择平台">
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      -->
      <el-form-item>
        <el-input v-model="queryData.l_account" clearable placeholder="请输入所属用户" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <div class="content_main">
      <div class="group_content">
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
          <el-table-column label="执行记录" min-width="120" prop="uniqueid" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="任务类型" min-width="160" prop="task_type" show-overflow-tooltip>
            <template slot="header">
              <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'task_type')">
                <span :class="[(queryData.task_type)>0?'dropdown_title':'']" style="color:#909399"> 任务类型
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in taskTypeList"
                    :key="index"
                    :class="{'dropdown_selected':item.value===queryData.task_type}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row[scope.column.property]!=='0'">
                {{ getLabelByVal(scope.row[scope.column.property], taskTypeList) }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="国家" min-width="120" prop="country" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="平台" min-width="120" prop="platform" show-overflow-tooltip>
            <template slot="header">
              <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'platform')">
                <span :class="[(queryData.platform)>0?'dropdown_title':'']" style="color:#909399"> 平台
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in platformList"
                    :key="index"
                    :class="{'dropdown_selected':item.value===queryData.platform}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>

            <template slot-scope="scope">
              <span v-if="scope.row[scope.column.property]!=='0'">
                {{ getLabelByVal(scope.row[scope.column.property], platformList) }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="执行状态" min-width="120" prop="execute_status" show-overflow-tooltip>
            <template slot="header">
              <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'execute_status')">
                <span :class="[(queryData.execute_status)>0?'dropdown_title':'']" style="color:#909399"> 执行状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in executeStatusList"
                    :key="index"
                    :class="{'dropdown_selected':item.value===queryData.execute_status}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row[scope.column.property]!=='0'">
                {{ getLabelByVal(scope.row[scope.column.property], executeStatusList) }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="结算状态" min-width="100" prop="settle_status" show-overflow-tooltip>
            <template slot="header">
              <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'settle_status')">
                <span :class="[(queryData.settle_status)>0?'dropdown_title':'']" style="color:#909399"> 结算状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,index) in settleStatusList"
                    :key="index"
                    :class="{'dropdown_selected':item.value===queryData.settle_status}"
                    :command="item.value"
                  >{{ item.label }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              {{ getLabelByVal(scope.row[scope.column.property], settleStatusList) }}
            </template>
          </el-table-column>
          <el-table-column label="执行时间" min-width="150" prop="execute_time" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row[scope.column.property]) }}
            </template>
          </el-table-column>
          <el-table-column label="结算时间" min-width="150" prop="settle_time" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row[scope.column.property]) }}
            </template>
          </el-table-column>
          <el-table-column label="任务奖励" min-width="80" prop="reward" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
          <el-table-column label="任务配置" min-width="80" prop="conf" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click.stop="confOpenFun(scope.row)">配置</el-button>
            </template>
          </el-table-column>
          <el-table-column label="所属用户" min-width="150" prop="l_account" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="150" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row[scope.column.property]) }}
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
    </div>
    <!-- 配置 -->
    <el-dialog
      :close-on-click-modal="false"
      title="配置"
      :visible.sync="confModal.show"
      center
      class="actionConfModal"
      width="500px"
      @close="closeConfModal"
    >
      <div :style="{maxHeight:cliHeight-100+'px'}" class="content">
        <el-form
          ref="refConfModal"
          :model="confModal.formData"
          :rules="confModal.rules"
          label-position="top"
          label-width="0"
          size="small"
        >
          <el-form-item label="配置:" prop="conf">
            <el-input v-model="confModal.formData.conf" :readonly="true" type="textarea" style="width: 100%" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入配置" @input="changeInput" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <div class="el-item-bottom" style="text-align:center;">
          <el-button @click="closeConfModal">关闭</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { resetPage, getLabelByVal, deepClone } from '@/utils/index'
import { formatTimestamp } from '@/filters'
import { gettaskrecordlistApi } from './api'

export default {
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        uniqueid: '',
        task_type: '',
        platform: '',
        execute_status: '',
        settle_status: '',
        l_account: ''
      },
      tableData: [],
      cliHeight: null,
      loading: false,
      selectData: [],
      selectIdData: [],
      pageOption: resetPage(),
      taskTypeList: [
        { label: 'Tiktok-Like', value: '1' },
        { label: 'Tiktok-Follow', value: '2' },
        { label: 'Whatsapp-Send', value: '3' },
        { label: 'Sms-Send', value: '4' },
        { label: 'Whatsapp-Send-Auto', value: '7' },
        { label: 'Whatsapp-Group', value: '9' },
      ],
      platformList: [
        { label: 'Tiktok', value: '1' },
        { label: 'Whatsapp', value: '2' },
        { label: 'Instagram', value: '3' },
        { label: 'Sms', value: '4' },
      ],
      executeStatusList: [
        { label: '全部', value: '0' },
        { label: 'Running', value: '1' },
        { label: 'Timeout', value: '2' },
        { label: 'Err', value: '3' },
        { label: 'Completed', value: '4' },
      ],
      settleStatusList: [
        { label: '全部', value: '0' },
        { label: 'Settling', value: '1' },
        { label: 'Unsettled', value: '2' },
        { label: 'Settled', value: '3' },
      ],
      confModal: {
        show: false,
        cloneRow: {},
        formData: {
          conf: '',
        },
        rules: {
          conf: [{ required: true, message: '请输入配置！', trigger: 'change' }],
        },
        isLoading: false,
      },
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getDataListFun();
  },
  created() {
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
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        uniqueid: this.queryData.uniqueid,
        l_account: this.queryData.l_account,
        task_type: this.queryData.task_type ? Number(this.queryData.task_type) : 0,
        platform: this.queryData.platform ? Number(this.queryData.platform) : 0,
        execute_status: this.queryData.execute_status ? Number(this.queryData.execute_status) : 0,
        settle_status: this.queryData.settle_status ? Number(this.queryData.settle_status) : 0,
      }

      gettaskrecordlistApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list.map(item => {
            item.task_type = item.task_type ? String(item.task_type) : '0'
            item.platform = item.platform ? String(item.platform) : '0'
            item.execute_status = item.execute_status ? String(item.execute_status) : '0'
            item.settle_status = item.settle_status ? String(item.settle_status) : '0'
            return item
          });
        }
      })
    },
    // 打开配置
    confOpenFun(row) {
      this.confModal.show = true
      this.confModal.type = 'edit'
      this.confModal.cloneRow = deepClone(row)
      if (deepClone(row).conf && deepClone(row).conf.message) {
        this.confModal.formData.conf = deepClone(row).conf.message
      }
    },
    // 关闭 配置
    closeConfModal() {
      this.confModal.show = false
      this.confModal.isLoading = false
      this.$refs.refConfModal.resetFields();
      this.confModal.formData = {
        conf: '',
      }
    },
    // 重置
    restQueryBtn() {
      this.queryData = {
        page: 1,
        limit: 20,
        total: 0,
        uniqueid: '',
        task_type: '',
        platform: '',
        execute_status: '',
        settle_status: '',
        l_account: '',
      };
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    handleRowQueryFun(val,kay) {
      this.queryData[kay] = val;
      this.getDataListFun(1)
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
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.uid
      })
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.selectIdData.includes(row.uid)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 240;
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp,
    getLabelByVal
  }
}
</script>

<style lang="scss" scoped>
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

.content_main {
  display: flex;
  width: 100%;
  justify-content: space-between;

  .group_content {
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
