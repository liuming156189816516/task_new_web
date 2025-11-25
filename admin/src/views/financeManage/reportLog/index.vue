<!-- 上报日志 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.report_id" clearable placeholder="请输入上报ID" style="width:180px;" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.uniqueid" clearable placeholder="请输入执行ID" style="width:180px;" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具栏 -->
    <el-form :inline="true" size="small">
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
        <el-table-column label="任务类型" min-width="120" prop="task_type" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'task_type')">
              <span :class="[Number(queryData.task_type)>0 ?'dropdown_title':'']" style="color:#909399"> 任务类型
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
        <el-table-column label="上报ID" min-width="140" prop="report_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="执行ID" min-width="120" prop="uniqueid" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="手机号" min-width="120" prop="phone" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="任务状态" min-width="120" prop="code" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], codeList)||'-' }}
          </template>
        </el-table-column>
        <el-table-column label="DATA状态" min-width="120" prop="data_status" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="源数据" min-width="120" prop="source_json" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="120" prop="ptime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
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
</template>

<script>
import { getDataApi, delDataApi } from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'ActivityType',
  components: {
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        task_type: '',
        report_id: '',
        uniqueid: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
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
      taskTypeList: [
        { label: '全部', value: '0' },
        { label: 'Whatsapp-Send', value: '3' },
        { label: 'Sms-Send', value: '4' },
        { label: 'Whatsapp-Send-Auto', value: '7' },
        { label: 'Whatsapp-Group', value: '9' },
      ],
      codeList: [
        { label: '全部', value: '0' },
        { label: 'SUCCESS', value: '1' },
        { label: 'VERSION_MISMATCH', value: '2' },
        { label: 'UI_NODE_NOT_FOUND', value: '3' },
        { label: 'MD5_MISMATCH', value: '4' },
        { label: 'A11Y_OFF', value: '5' },
        { label: 'PERMISSION_DENIED', value: '6' },
        { label: 'TIMEOUT', value: '7' },
        { label: 'DELETE_FAILED', value: '8' },
        { label: 'NETWORK_ERROR', value: '9' },
        { label: 'UNKNOWN_ERROR', value: '10' },
        { label: 'CANCELLED', value: '11' },
        { label: 'RETRY_LATER', value: '12' },
      ],

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
      this.loading = true;
      this.tableData = []
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        task_type: Number(this.queryData.task_type),
        report_id: this.queryData.report_id,
        uniqueid: this.queryData.uniqueid
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.task_type = item.task_type ? String(item.task_type) : ''
            return item
          })
        }
      })
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
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        task_type: '',
        report_id: '',
        uniqueid: '',
      }
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    // 表头筛选
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

.ghostClass {
  background-color: #ecf5ff;

  td {
    border-bottom-color: #409eff;
  }
}

.tableContentLoading {
  text-align: center;
  margin: 50px 0;
}
</style>
