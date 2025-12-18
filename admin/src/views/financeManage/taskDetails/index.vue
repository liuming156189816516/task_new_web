<!-- 任务明细 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane key="tabs1" label="任务明细" name="tabs1">
        <!-- 筛选条件 -->
        <el-form :inline="true" size="small" style="margin-top: 10px;">
          <el-form-item>
            <el-input v-model="queryData.id" clearable placeholder="请输入任务ID" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.uniqueid" clearable placeholder="请输入执行记录" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryData.l_account" clearable placeholder="请输入所属用户" />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="queryData.time"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="width: 400px"
              type="datetimerange"
            />
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
              row-key="id"
              show-body-overflow="title"
              style="width: 100%;"
              use-virtual
              @selection-change="handleSelectionChange"
              @row-click="rowSelectChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="序号" type="index" width="60" />
              <el-table-column label="任务ID" min-width="120" prop="id" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
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
                  {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
                </template>
              </el-table-column>
              <el-table-column label="结算时间" min-width="150" prop="settle_time" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
                </template>
              </el-table-column>
              <el-table-column label="任务奖励" min-width="80" prop="reward" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] }}
                </template>
              </el-table-column>
              <el-table-column label="所属用户" min-width="150" prop="l_account" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] }}
                </template>
              </el-table-column>
              <el-table-column label="创建时间" min-width="150" prop="itime" show-overflow-tooltip>
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
        </div>
      </el-tab-pane>
      <el-tab-pane key="tabs2" label="拉群任务明细" name="tabs2">
        <!-- 筛选条件 -->
        <el-form :inline="true" size="small" style="margin-top: 10px;">
          <el-form-item>
            <el-input v-model="taskWsTable.queryData.task_id" clearable placeholder="请输入任务ID" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="taskWsTable.queryData.name" clearable placeholder="请输入群名称" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="taskWsTable.queryData.q_url" clearable placeholder="请输入群链接" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="taskWsTable.queryData.qid" clearable placeholder="请输入群ID" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="taskWsTable.queryData.q_create" clearable placeholder="请输入群创建者" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="taskWsTable.queryData.l_account" clearable placeholder="请输入所属用户" />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="taskWsTable.queryData.time"
              end-placeholder="结束日期"
              range-separator="至"
              start-placeholder="开始日期"
              style="width: 500px"
              type="datetimerange"
            />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getTaskWsGroupRecordListFun(1)">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="restTaskWsQueryBtn">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="content_main">
          <div class="group_content">
            <el-table
              ref="serveTableWs"
              v-loading="taskWsTable.loading"
              :data="taskWsTable.tableData"
              :height="cliHeight -50"
              border
              element-loading-spinner="el-icon-loading"
              row-key="id"
              show-body-overflow="title"
              style="width: 100%;"
              use-virtual
              @selection-change="handleTaskWsSelectionChange"
              @row-click="rowTaskWsSelectChange"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="序号" type="index" width="60" />
              <el-table-column label="任务ID" min-width="120" prop="task_id" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="群ID" min-width="120" prop="qid" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="群名称" min-width="120" prop="name" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="群链接" min-width="120" prop="q_url" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="群创建者" min-width="120" prop="q_create" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="管理员1进群状态" min-width="140" prop="admin_is_in_group" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? '已进群' : '未进群' }}
                </template>
              </el-table-column>
              <el-table-column label="管理员2进群状态" min-width="140" prop="admin_two_is_in_group" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? '已进群' : '未进群' }}
                </template>
              </el-table-column>
              <el-table-column label="群管理员1" min-width="120" prop="admin" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="群管理员1的状态" min-width="140" prop="admin_status" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property]===1 ? '已设置' : scope.row[scope.column.property]===0? '未设置':'-' }}
                </template>
              </el-table-column>
              <el-table-column label="群管理员2" min-width="120" prop="admin_two" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="群管理员2的状态" min-width="140" prop="admin_two_status" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property]===1 ? '已设置' : scope.row[scope.column.property]===0? '未设置':'-' }}
                </template>
              </el-table-column>
              <el-table-column label="初始化成员" min-width="120" prop="member_list" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property].join(',') : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="进群成员" min-width="120" prop="q_in_member_list" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] ? scope.row[scope.column.property].join(',') : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="验群人数" min-width="120" prop="member_num" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] }}
                </template>
              </el-table-column>
              <el-table-column label="执行状态" min-width="120" prop="execute_status" show-overflow-tooltip>
                <template slot="header">
                  <el-dropdown trigger="click" @command="(val) => handleTaskWsRowQueryFun(val,'execute_status')">
                    <span :class="[(taskWsTable.queryData.execute_status)>0?'dropdown_title':'']" style="color:#909399"> 执行状态
                      <i class="el-icon-arrow-down el-icon--right" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item,index) in taskWsTable.executeStatusList"
                        :key="index"
                        :class="{'dropdown_selected':item.value===taskWsTable.queryData.execute_status}"
                        :command="item.value"
                      >{{ item.label }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
                <template slot-scope="scope">
                  <span v-if="scope.row[scope.column.property]!=='0'">
                    {{ getLabelByVal(scope.row[scope.column.property], taskWsTable.executeStatusList) }}
                  </span>
                  <span v-else>-</span>
                </template>
              </el-table-column>
              <el-table-column label="脚本状态" min-width="120" prop="script_status" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ getLabelByVal(scope.row[scope.column.property], taskWsTable.scriptStatusList) }}
                </template>
              </el-table-column>
              <el-table-column label="消息提示" min-width="120" prop="msg_str">
                <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" :content="getLabelByVal(scope.row[scope.column.property], titleList)" placement="top">
                    <span>{{ getLabelByVal(scope.row[scope.column.property], titleList) }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="所属用户" min-width="150" prop="l_account" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property] }}
                </template>
              </el-table-column>
              <el-table-column label="创建时间" min-width="180" prop="itime" show-overflow-tooltip>
                <template slot-scope="scope">
                  {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
                </template>
              </el-table-column>
            </el-table>
            <div class="layui_page">
              <el-pagination
                :current-page.sync="taskWsTable.queryData.page"
                :page-size="taskWsTable.queryData.limit"
                :page-sizes="taskWsTable.pageOption"
                :total="taskWsTable.queryData.total"
                background
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="changeTaskWsPageSize($event,'table')"
                @current-change="changeTaskWsPageCurrent($event,'table')"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 配置 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="confModal.show"
      center
      class="actionConfModal"
      title="配置"
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
            <el-input
              v-model="confModal.formData.conf"
              :autosize="{ minRows: 4, maxRows: 10}"
              :readonly="true"
              placeholder="请输入配置"
              style="width: 100%"
              type="textarea"
              @input="changeInput"
            />
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
import { resetPage, getLabelByVal, deepClone,zonedTimeToTimestamp } from '@/utils/index'
import { formatDateTime, formatTimestamp, getLanguagePageList } from '@/filters'
import { getTaskRecordListApi, getTaskWsGroupRecordListApi } from './api'
import { getLanguagePageListApi } from '@/api/common';

export default {
  data() {
    return {
      activeName: 'tabs1',
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        uniqueid: '',
        task_type: '',
        platform: '',
        execute_status: '',
        settle_status: '',
        l_account: '',
        id: '',
        time: []
      },
      tableData: [],
      cliHeight: null,
      loading: false,
      selectData: [],
      selectIdData: [],
      pageOption: resetPage(),
      taskTypeList: [
        { label: '全部', value: '0' },
        { label: 'Tiktok-Like', value: '1' },
        { label: 'Tiktok-Follow', value: '2' },
        { label: 'Whatsapp-Send', value: '3' },
        { label: 'Sms-Send', value: '4' },
        { label: 'Whatsapp-Send-Auto', value: '7' },
        { label: 'Whatsapp-Group', value: '9' },
      ],
      platformList: [
        { label: '全部', value: '0' },
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
      taskWsTable: {
        queryData: {
          page: 1,
          limit: 10,
          total: 0,
          task_id: '',
          execute_status: '',
          name: '',
          q_url: '',
          qid: '',
          q_create: '',
          l_account: '',
          time: []
        },
        tableData: [],
        loading: false,
        selectData: [],
        selectIdData: [],
        statusList: [],
        scriptStatusList: [
          { label: '成功', value: '1' },
          { label: '建群失败', value: '3' },
          { label: '设置管理失败', value: '13' },
          { label: '退群失败', value: '14' },
        ],
        executeStatusList: [
          { label: '全部', value: '0' },
          { label: 'Running', value: '1' },
          { label: 'Timeout', value: '2' },
          { label: 'Err', value: '3' },
          { label: 'Completed', value: '4' },
        ]
      },
      titleList: []
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getDataListFun();
    this.getLanguagePageListFun()
  },
  created() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    handleClick(tab, event) {
      if (tab.label === '任务明细') {
        this.getDataListFun(1)
      } else if (tab.label === '拉群任务明细') {
        this.getTaskWsGroupRecordListFun(1)
      }
    },
    // 获取 任务明细 列表
    getDataListFun(num) {
      this.$nextTick(() => {
        const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
        tableBodyWrapper.scrollTop = 0
      })
      this.loading = true;
      const startTime = this.queryData.time && this.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.queryData.time[0]))) / 1000 : ''
      const endTime = this.queryData.time && this.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.queryData.time[1]))) / 1000 : ''
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        uniqueid: this.queryData.uniqueid,
        l_account: this.queryData.l_account,
        task_type: this.queryData.task_type ? Number(this.queryData.task_type) : 0,
        platform: this.queryData.platform ? Number(this.queryData.platform) : 0,
        execute_status: this.queryData.execute_status ? Number(this.queryData.execute_status) : 0,
        settle_status: this.queryData.settle_status ? Number(this.queryData.settle_status) : 0,
        id: this.queryData.id,
      }
      if (startTime && endTime) {
        params.start_time = startTime
        params.end_time = endTime
      }

      getTaskRecordListApi(params).then(res => {
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
    // 重置
    restQueryBtn() {
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        uniqueid: '',
        task_type: '',
        platform: '',
        execute_status: '',
        settle_status: '',
        l_account: '',
        id: '',
        time: [],
      };
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    // 行筛选
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
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
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

    // 获取 拉群任务明细 列表
    getTaskWsGroupRecordListFun(num) {
      this.$nextTick(() => {
        const tableBodyWrapper = this.$refs.serveTableWs.$el.querySelector('.el-table__body-wrapper');
        tableBodyWrapper.scrollTop = 0
      })
      this.taskWsTable.loading = true;
      const startTime = this.taskWsTable.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.taskWsTable.queryData.time[0]))) / 1000 : ''
      const endTime = this.taskWsTable.queryData.time.length ? zonedTimeToTimestamp(formatDateTime(new Date(this.taskWsTable.queryData.time[1]))) / 1000 : ''
      const params = {
        page: num || this.taskWsTable.queryData.page,
        limit: this.taskWsTable.queryData.limit,
        task_id: this.taskWsTable.queryData.task_id,
        execute_status: this.taskWsTable.queryData.execute_status ? Number(this.taskWsTable.queryData.execute_status) : 0,
        name: this.taskWsTable.queryData.name,
        q_url: this.taskWsTable.queryData.q_url,
        qid: this.taskWsTable.queryData.qid,
        q_create: this.taskWsTable.queryData.q_create,
        l_account: this.taskWsTable.queryData.l_account,
      }
      if (startTime && endTime) {
        params.start_time = startTime
        params.end_time = endTime
      }
      getTaskWsGroupRecordListApi(params).then(res => {
        if (res.msg === 'success') {
          this.taskWsTable.loading = false;
          this.taskWsTable.queryData.total = res.data.total;
          this.taskWsTable.tableData = res.data.list.map(item => {
            item.script_status = item.script_status ? String(item.script_status) : '0'
            item.execute_status = item.execute_status ? String(item.execute_status) : '0'
            item.member_list = item.member_list ? JSON.parse(item.member_list) : ''
            item.q_in_member_list = item.q_in_member_list ? JSON.parse(item.q_in_member_list) : ''
            return item
          });
        }
      })
    },
    // 重置
    restTaskWsQueryBtn() {
      this.taskWsTable.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        task_id: '',
        execute_status: '',
        name: '',
        q_url: '',
        qid: '',
        q_create: '',
        l_account: '',
        time: [],
      };
      this.getTaskWsGroupRecordListFun(1)
      this.$refs.serveTableWs.clearSelection();
    },
    // 行筛选
    handleTaskWsRowQueryFun(val, kay) {
      this.taskWsTable.queryData[kay] = val;
      this.getTaskWsGroupRecordListFun(1)
    },
    // 分页 切换
    changeTaskWsPageSize(val, type) {
      if (type === 'table') {
        this.taskWsTable.queryData.limit = val;
        this.getTaskWsGroupRecordListFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 页码
    changeTaskWsPageCurrent(val, type) {
      if (type === 'table') {
        this.taskWsTable.queryData.page = val;
        this.getTaskWsGroupRecordListFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 选择项
    handleTaskWsSelectionChange(arr) {
      this.taskWsTable.selectData = arr
      this.taskWsTable.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 单行点击
    rowTaskWsSelectChange(row) {
      const tableCell = this.$refs.serveTableWs;
      if (this.taskWsTable.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 获取国际化
    getLanguagePageListFun() {
      getLanguagePageListApi({}).then(res => {
        if (res.msg === 'success') {
          const kay = 'server.enums'
          this.titleList = getLanguagePageList(res.data.content,kay)
        }
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
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
