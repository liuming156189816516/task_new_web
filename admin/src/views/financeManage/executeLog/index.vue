<!-- 执行日志 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input
          v-model="queryData.execute_id"
          clearable
          placeholder="请输入任务ID"
          style="width:180px;"
          @input="changeInput"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="queryData.l_account"
          clearable
          placeholder="请输入所属用户"
          style="width:180px;"
          @input="changeInput"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="queryData.time"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          style="width: 380px"
          :clearable="false"
          type="datetimerange"
        />
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
        @cell-click="cellClickFun"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="任务ID" min-width="140" prop="execute_id" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
<!--        <el-table-column label="执行ID" min-width="120" prop="uniqueid" show-overflow-tooltip>-->
<!--          <template slot-scope="scope">-->
<!--            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}-->
<!--          </template>-->
<!--        </el-table-column>-->
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
        <el-table-column label="执行类型" min-width="120" prop="ptype" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'ptype')">
              <span :class="[Number(queryData.ptype)>0?'dropdown_title':'']" style="color:#909399"> 执行类型
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in pTypeList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.ptype}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <!--
          <template slot-scope="scope">
            <span v-if="scope.row[scope.column.property]!=='0'">
              {{ getLabelByVal(scope.row[scope.column.property], pTypeList) }}
            </span>
            <span v-else>-</span>
          </template>
          -->
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="源数据" min-width="120" prop="source_json" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row[scope.column.property]" class="clickPointer">{{ scope.row[scope.column.property] }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="所属用户" min-width="120" prop="l_account" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="120" prop="ptime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
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

    <!-- JSON 配置 -->
    <el-dialog
      :title="configData.title"
      center
      :visible.sync="configData.show"
      :close-on-click-modal="false"
      width="80%"
      @close="closeConfigModal"
    >
      <div style="height: 75vh">
        <jsonEditorTool ref="refJsonEditorToo" v-model="configData.value" :show-footer="false" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, delDataApi } from './api';
import { deepClone, resetPage, successTips, getLabelByVal, zonedTimeToTimestamp } from '@/utils';
import { formatDateTime, formatTimestamp } from '@/filters'
import jsonEditorTool from '@/components/jsonEditorTool'

export default {
  name: 'ActivityType',
  components: {
    jsonEditorTool
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        task_type: '',
        execute_id: '',
        ptype: '',
        l_account: '',
        time: []
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
        { label: 'Tiktok-Like', value: '1' },
        { label: 'Tiktok-Follow', value: '2' },
        { label: 'Whatsapp-Send', value: '3' },
        { label: 'Sms-Send', value: '4' },
        { label: 'Whatsapp-Send-Auto', value: '7' },
        { label: 'Whatsapp-Group', value: '9' }
      ],
      pTypeList: [
        { label: '全部', value: '0' },
        // { label: '检查是否可以执行', value: '1' },
        // { label: '前端通知后端任务是否完成', value: '2' },
        { label: '1', value: '1' },
        { label: '2', value: '2' },
      ],
      configData: {
        title: '',
        show: false,
        formData: {},
        value: null
      },

    }
  },
  mounted() {
    const startTime = formatDateTime(new Date(), 'YYYY-MM-DD') + ' 00:00:00'
    const endTime = formatDateTime(new Date(), 'YYYY-MM-DD') + ' 23:59:59'
    this.queryData.time = [startTime, endTime]
    this.getDataListFun(1); // 获取列表
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
      const startTime = this.queryData.time && this.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.queryData.time[0]))) / 1000 : ''
      const endTime = this.queryData.time && this.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.queryData.time[1]))) / 1000 : ''
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        execute_id: this.queryData.execute_id,
        l_account: this.queryData.l_account,
        task_type: Number(this.queryData.task_type),
        ptype: Number(this.queryData.ptype),
      }
      if (startTime && endTime) {
        params.start_time = startTime
        params.end_time = endTime
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.task_type = item.task_type ? String(item.task_type) : ''
            item.ptype = item.ptype ? String(item.ptype) : ''
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
      this.cliHeight = document.documentElement.clientHeight - 240;
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
    // 单元格点击
    cellClickFun(row,column) {
      console.log('row',row)
      console.log('column',column)
      if (column.label === '源数据') {
        if (row.source_json) {
          this.configData.title = column.label
          this.configData.show = true
          this.configData.value = JSON.parse(row.source_json)
        } else {
          this.$message.warning('源数据为空')
        }
      }
    },
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        task_type: '',
        execute_id: '',
        ptype: '',
        l_account: '',
        time: [],
      }
      const startTime = formatDateTime(new Date(), 'YYYY-MM-DD') + ' 00:00:00'
      const endTime = formatDateTime(new Date(), 'YYYY-MM-DD') + ' 23:59:59'
      this.queryData.time = [Number(new Date(startTime)), Number(new Date(endTime))]
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    // 关闭配置
    closeConfigModal() {
      this.configData.show = false
      this.configData.formData = {}
      this.configData.value = null
      this.$refs.refJsonEditorToo.closeClearFun()
    },
    // 表头筛选
    handleRowQueryFun(val, kay) {
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
.clickPointer{
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
</style>
