<!-- 账号列表(安卓终端) -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 端口管理 -->
    <el-row :gutter="20">
      <el-col v-for="(item, idx) in allPortList" v-show="item !== ''" :key="idx" :span="6">
        <el-card>
          <div class="refsh_icon" @click="getPortNum">
            <i class="el-icon-refresh" size="16" />
          </div>
          <el-button v-if="loadingPort" :loading="true" class="loading_icon" type="primary" />
          <div v-else class="box_card_item">
            <span class="port_title">{{ item.name }}</span>
            <span>{{ item.num }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.account" :placeholder="$t('sys_g006')" clearable />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.reason" clearable placeholder="请输入离线原因" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getTableDataFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 工具栏 -->
    <el-form :inline="true" size="small">
      <el-form-item>
        <el-dropdown trigger="click" @command="onlineHandle">
          <el-button type="primary"> {{ $t('sys_g016') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, idx) in onlineOption"
              :id="idx"
              :key="idx"
              :command="{item,idx}"
              :disabled="idx==0||checkIdArry.length==0"
            >
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(1,command)}">
          <el-button type="primary"> {{ $t('sys_g054') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, idx) in baseConfigOption"
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
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{batchHandleOptionFun(command)}">
          <el-button type="primary"> 批量操作
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in batchOption" v-show="item.label" :key="idx" :command="{item,idx}">
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 分组管理 -->
    <div class="continer_main">
      <div :class="[!showGroup?'group_mian_hide':'']">
        <div class="group_head_warp">
          <div class="group_head" @click="changeGroup(0, 'clear')">
            <i class="el-icon-d-arrow-left" @click="showGroup=false" />
            {{ $t('sys_g049') }} ({{ numGroupTotal }})
          </div>
          <div class="group_icon">
            <el-popover v-model="search_icon" placement="top" width="230">
              <p>
                <el-select
                  v-model="queryData.group_name"
                  :placeholder="$t('sys_c053')"
                  clearable
                  filterable
                  size="small"
                  style="width:100%;"
                >
                  <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="search_icon=false">{{ $t('sys_c023') }}</el-button>
                <el-button size="mini" type="primary" @click="initNumberGroup">{{ $t('sys_c024') }}</el-button>
              </div>
              <i slot="reference" class="el-icon-search" style="margin-right: 10px;" />
            </el-popover>
            <el-popover v-model="addVisible" placement="top" width="230">
              <p>
                <el-input
                  v-model="group_name"
                  :placeholder="$t('sys_c112')"
                  maxlength="10"
                  show-word-limit
                  size="small"
                />
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addVisible=false">{{ $t('sys_c023') }}</el-button>
                <el-button
                  :disabled="!group_name.trim()"
                  :loading="ipLoading"
                  size="mini"
                  type="primary"
                  @click="addGroup(0, 0)"
                >{{ $t('sys_c024') }}
                </el-button>
              </div>
              <i slot="reference" class="el-icon-plus" @click.stop="editGroup(0, 1)" />
            </el-popover>
          </div>
        </div>
        <el-button v-if="loadingGroup" :loading="true" class="loading_icon" type="primary" />
        <template v-else>
          <div :style="{height:(cliHeight-40)+'px'}" class="group_warp">
            <template v-if="numberGroupList.length>0">
              <transition-group name="fade">
                <div
                  v-for="(item, idx) in numberGroupList"
                  :key="idx"
                  :class="['group_item', queryData.group_id === item.id ? 'group_active' : '']"
                  :draggable="true"
                  @click="changeGroup(item, idx)"
                  @dragstart="dragStart(idx)"
                  @drop="handleMoveSort(idx)"
                  @dragover.prevent
                >
                  <div class="group_name">
                    <i
                      :class="['left_icon', queryData.group_id === item.id ? 'el-icon-folder-opened' : 'el-icon-folder']"
                      class="left_icon"
                    />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                  <div class="group_icon">
                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input
                          v-model="group_name"
                          :placeholder="$t('sys_c112')"
                          clearable
                          maxlength="10"
                          show-word-limit
                          size="small"
                        />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{
                          $t('sys_c023')
                        }}
                        </el-button>
                        <el-button
                          :disabled="!group_name.trim()"
                          :loading="ipLoading"
                          size="mini"
                          type="primary"
                          @click="addGroup(item, 2)"
                        >{{ $t('sys_c024') }}
                        </el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click.stop="editGroup(item, 2)" />
                    </el-popover>
                    <el-popconfirm
                      :cancel-button-text="$t('sys_c023')"
                      :confirm-button-text="$t('sys_c024')"
                      :title="$t('sys_c128')"
                      icon="el-icon-info"
                      @confirm="delGroup(item, idx)"
                    >
                      <i slot="reference" class="el-icon-delete" @click.stop />
                    </el-popconfirm>
                  </div>
                </div>
              </transition-group>
            </template>
            <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
          </div>
        </template>
      </div>
      <div class="group_continer" style="margin-left: 20px;">
        <div class="tab_check_warp">
          <span v-if="!showGroup" style="margin-right: 8px;cursor: pointer; color:#409eff;" @click="showGroup=true">
            <el-tooltip content="展开分组" effect="dark" placement="top">
              <i class="el-icon-d-arrow-right" />
            </el-tooltip>
          </span>
          <i class="el-icon-info" />
          <div v-html="$t('sys_mat007',{value:checkIdArry.length})" />
        </div>
        <u-table
          ref="serveTable"
          v-loading="loading"
          :data="accountDataList"
          :height="500||cliHeight"
          :pagination-show="false"
          border
          element-loading-spinner="el-icon-loading"
          row-key="id"
          show-body-overflow="title"
          style="width: 100%;"
          use-virtual
          @handlePageSize="switchPage"
          @sort-change="sorthandle"
          @selection-change="handleSelectionChange"
          @row-click="rowSelectChange"
        >
          <u-table-column :reserve-selection="true" type="selection" width="55" />
          <u-table-column label="头像" prop="head" width="80">
            <template slot-scope="scope">
              <el-avatar v-if="scope.row.head" :src="scope.row.head" />
              <el-avatar v-else icon="el-icon-user-solid" />
            </template>
          </u-table-column>
          <u-table-column label="账号" prop="account" width="120" />
          <u-table-column label="昵称" min-width="100" prop="nick_name">
            <template slot-scope="scope">
              {{ scope.row.nick_name ? scope.row.nick_name : "-" }}
            </template>
          </u-table-column>
          <u-table-column label="账号状态" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,1)">
                <span :class="[queryData.status?'dropdown_title':'']" style="color:#909399"> 账号状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in accountOptions"
                    :key="idx"
                    :class="{'dropdown_selected':idx==queryData.status}"
                    :command="idx"
                  >
                    {{ item === '' ? '全部' : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag :type="handleTag(scope.row.status)" size="small"> {{ accountOptions[scope.row.status] }}</el-tag>
            </template>
          </u-table-column>
          <u-table-column label="账号类型" min-width="100" prop="account_type">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,3)">
                <span :class="[queryData.account_type?'dropdown_title':'']" style="color:#909399"> 账号类型
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in accountType"
                    :key="idx"
                    :class="{'dropdown_selected':idx==queryData.account_type}"
                    :command="idx"
                  >
                    {{ item === '' ? '全部' : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope"> {{ accountType[scope.row.account_type] }}</template>
          </u-table-column>
          <u-table-column label="账号角色" min-width="100" prop="account_role">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,6)">
                <span :class="[queryData.account_role?'dropdown_title':'']" style="color:#909399"> 账号角色
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in accountRoleList"
                    :key="idx"
                    :class="{'dropdown_selected':idx==queryData.account_role}"
                    :command="idx"
                  >
                    {{ item === '' ? '全部' : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope"> {{ accountRoleList[scope.row.account_role] }}</template>
          </u-table-column>
          <u-table-column label="离线原因" min-width="100" prop="reason" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.reason ? scope.row.reason : "-" }}</span>
            </template>
          </u-table-column>
          <u-table-column label="离线时间" min-width="160" prop="offline_time">
            <template slot-scope="scope">
              {{ scope.row.offline_time > 0 ? $baseFun.resetTime(scope.row.offline_time * 1000) : "-" }}
            </template>
          </u-table-column>
          <u-table-column label="入库时间" prop="first_login_time" width="180">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}
            </template>
          </u-table-column>
          <u-table-column label="备注" prop="remark" show-overflow-tooltip width="100">
            <template slot-scope="scope">
              <div class="remark_ext">{{ scope.row.remark }}</div>
              <div @click.stop="addRemark(scope.row,8)"><i
                class="el-icon-edit"
                style="color: rgb(103, 194, 58); cursor: pointer;"
              /></div>
            </template>
          </u-table-column>
        </u-table>
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
    <!-- 批量操作 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="setIpName"
      :visible.sync="setIpModel"
      :width="'550px'"
      center
    >
      <el-form v-if="setIpModel" ref="ipForm" :model="ipForm" :rules="ipRules" label-width="100px" size="small">

        <!-- 移至其他分组 -->
        <template v-if="batchOptionData.btnLabel === '移至其他分组'">
          <el-form-item :label="$t('sys_c053') + ':'" label-width="140px" prop="group_id">
            <el-select
              v-model="ipForm.group_id"
              :placeholder="$t('sys_c053')"
              clearable
              filterable
              size="small"
              style="width:100%;"
            >
              <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="group_tips">一个账号只能存在于一个分组中！</div>
          </el-form-item>
        </template>
        <!-- 批量修改备注 -->
        <template v-if="batchOptionData.btnLabel === '批量修改备注'">
          <el-form-item label-width="0" prop="remock_text">
            <el-input
              v-model="ipForm.remock_text"
              :placeholder="$t('sys_mat021')"
              :rows="6"
              maxlength="50"
              show-word-limit
              size="small"
              type="textarea"
            />
          </el-form-item>
        </template>
        <template v-if="batchOptionData.btnLabel === '批量上线'">
          <el-form-item v-if="countryList.length===0" :label="$t('sys_c052') + ':'" prop="iptype">
            <el-cascader ref="myCascader" v-model="ipForm.iptype" el-cascader :options="ipOptions" style="width: 100%;" @change="changeIpHandle" />
          </el-form-item>
          <el-form-item v-if="countryList.length>0" :label="$t('sys_c054') + ':'" prop="ip_id">
            <el-select v-model="ipForm.ip_id" filterable :placeholder="$t('sys_c052')">
              <el-option v-for="(item,idx) in countryList" :key="idx" :label="item.country" :value="item.ip_id?item.ip_id:item.country" />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;margin-top: 40px;">
          <el-button @click="setIpModel = false">取消</el-button>
          <el-button
            :loading="isLoading"
            type="primary"
            @click="submitSetBtn('ipForm')"
          >确定
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import { getcustomeruserlist } from '@/api/staff'
import {
  getaccountinfolist,
  getaccountgrouplist,
  doaccountgroup,
  getwaport,
  doupgroup,
  dofreedip,
  dooutputaccount,
  dobatchdelaccount,
  doupremark,
  getdynamicip,
  getstaticip,
  dobatchlogout,
  doresetip,
  sortgroup,
  dobatchlogin,
  dobatchfastlogin
} from '@/api/storeroom'

export default {
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        group_id: '',
        account: '',
        status: '',
        account_type: '',
        reason: '',
        account_role: ''
      },
      cliHeight: 0,
      seatPage: 1,
      seatLimit: 10,
      seatTotal: 0,
      staffData: [],
      countryList: [],
      numGroupTotal: 0,
      stsff_group_id: '',
      accountDataList: [],
      numberGroupList: [],
      staffGroupList: [],
      loading: false,
      ipLoading: false,
      showGroup: true,
      loadingPort: false,
      staffLoading: false,
      setIpModel: false,
      checkIdArry: [],
      checkAccount: [],
      search_icon: false,
      loadingGroup: false,
      outLoading: false,
      blockGroupLoading: false,
      isBlockLoading: false,
      setIpName: '',
      is_staff: '',
      setStaffName: '',
      ipForm: {
        id: '',
        ip_id: '',
        iptype: '',
        group_id: '',
        staff_name: '',
        use_status: 1,
        remock_text: '',
        allocat_role: 1,
        seat_type: 1,
        staffCheck: []
      },
      pageOption: resetPage(),
      offest: 1,
      limit: 200,
      total: 0,
      groupIdx: '',
      materType: '',
      checkedNum: 0,
      isLoading: false,
      visible: false,
      addVisible: false,
      groupModel: false,
      inheLoading: false,
      cardAcyive: '1',
      type: '',
      group_id: '',
      group_name: '',
      close_icon: '',
      close_group_name: '',
      titleGroupIdx: '',
      checkItem: [],
      batchArry: [],
      staffCheck: [],
      blockType: null,
      blockAccount: [],
      inheritAccount: [],
      blockAccountList: [],
      groupForm: {
        id: '',
        account: '',
        group_id: '',
        title: '',
        content: ''
      },
      blockTitle: '',
      inheritCheckItem: [],
      blockCheckItem: [],
      blockGroupList: [],
      blockCheckList: [],
      blockPramse: {
        group_id: '',
        offest: 1,
        limit: 10,
        total: 0
      },
      draggedItemIndex: 0,
      batchOptionData: {
        title: '',
        btnLabel: ''
      }
    }
  },
  computed: {
    ipRules() {
      return {
        use_status: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        expire_time: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        group_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        remock_text: [{ required: true, message: this.$t('sys_mat021'), trigger: 'blure' }],
        iptype: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        ip_id: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        allocat_role: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        seat_type: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        staffCheck: [{ type: 'array', required: true, message: this.$t('sys_c052'), trigger: 'change' }],
      }
    },
    ipOptions() {
      return [
        {
          value: 1,
          label: '静态ip',
          children: [{
            value: 4,
            label: 'Ipv4'
          }, {
            value: 5,
            label: 'Ipv6'
          }]
        },
        {
          value: 2,
          label: '动态ip',
          children: [{
            value: 6,
            label: '动态住宅IP'
          }]
        }
      ]
    },
    blockOptions() {
      return ['', this.$t('sys_g111'), this.$t('sys_g112')]
    },
    accountType() {
      return ['', this.$t('sys_l067'), this.$t('sys_l068')]
    },
    accountRoleList() {
      return ['', '管理员', '进群号']
    },
    accountOptions() {
      return ['', this.$t('sys_g032'), this.$t('sys_g033'), this.$t('sys_g034'), this.$t('sys_g035'), this.$t('sys_g036')]
    },
    screenOptions() {
      return [
        {}, { name: this.$t('sys_g022'), value: 1, check: false }, { name: this.$t('sys_g025'), value: 2, check: false },
        { name: this.$t('sys_l062'), value: 3, check: false }, { name: this.$t('sys_g015'), value: 4, check: false },
        { name: this.$t('sys_g014'), value: 5, check: false }, { name: this.$t('sys_g013'), value: 6, check: false }
      ]
    },
    allPortList() {
      return [{ name: this.$t('sys_mat058'), num: 0 }, { name: this.$t('sys_mat059'), num: 0 }, {
        name: '账号离线数',
        num: 0
      }, { name: '账号被封数', num: 0 }]
    },
    onlineOption() {
      return [
        { label: '---默认通道---' ,api: dobatchfastlogin },
        { label: '批量上线' ,api: dobatchlogin },
        { label: '批量快速上线' ,api: dobatchfastlogin },
      ]
    },
    batchOption() {
      return [
        { icon: 'bottom', label: '批量下线' ,api: dobatchlogout },
        { icon: 'rank', label: '移至其他分组',api: doupgroup },
        { icon: 'refresh', label: '释放ip',api: dofreedip },
        { icon: 'download', label: '批量导出',api: dooutputaccount },
        { icon: 'delete', label: '批量删除',api: dobatchdelaccount },
        { icon: 'edit', label: '批量修改备注',api: doupremark }
      ]
    },
    baseConfigOption() {
      return [
        { icon: 'help', label: 'IP校正工具' ,api: doresetip }
      ]
    },
    moveRules() {
      return {
        checked_group: [{ required: true, message: this.$t('sys_c051'), trigger: 'change' }],
      }
    },
    groupRules() {
      return {
        title: [{ required: true, message: this.$t('sys_mat018'), trigger: 'blur' }],
        content: [{ required: true, message: this.$t('sys_mat020'), trigger: 'blur' }],
      }
    },
    closeOption() {
      return [
        '1、将被封禁的账号的聊天记录转移到另一个账号',
        '2、执行封号继承功能后，被封账号移出当前席位，继承账号自动移入被继承账号所在席位',
        "3、只有<span style='font-weight:bold;color: rgb(16, 16, 16);'>封号、账号环境失效</span>的主号方可被继承。（在账号列表页批量选中账号后点击封号继承按钮，会过滤掉不满足条件的账号）",
        '4、继承的账号需满足在线且当前未分配至席位内时',
        '5、封号继承任务只会一对一执行，只需选好被封账号与继承账号即会进行一对一分配',
        '6、账号在封号继承任务进行中时，请勿执行其他操作',
      ]
    }
  },
  watch: {
    setIpModel(val) {
      if (val === false) {
        this.$refs.ipForm.resetFields();
        this.ipForm.iptype = '';
        this.ipForm.staffCheck = [];
        this.ipForm.group_id = '';
        this.ipForm.use_status = 1;
        this.ipForm.remock_text = '';
      }
    }
  },
  created() {
    this.getPortNum();
    this.initNumberGroup();
  },
  mounted() {
    this.getTableDataFun();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    // 获取列表数据
    getTableDataFun(num) {
      this.loading = true;
      const params = {
        group_id: this.queryData.group_id, // 分组
        account: this.queryData.account, // 账号
        status: this.queryData.status || -1,
        account_type: this.queryData.account_type || -1,
        reason: this.queryData.reason,
        limit: this.queryData.limit,
        page: num || this.queryData.page,
        account_role: this.queryData.account_role || -1,
      }
      getaccountinfolist(params).then(res => {
        this.loading = false;
        this.queryData.total = res.data.total;
        this.accountDataList = res.data.list || [];
      })
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getTableDataFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getTableDataFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 获取 分组
    async initNumberGroup() {
      this.loadingGroup = true;
      const { data } = await getaccountgrouplist({ name: this.queryData.group_name, page: 1, limit: 100 });
      this.search_icon = false;
      this.loadingGroup = false;
      this.numGroupTotal = data.total;
      this.numberGroupList = data.list || [];
    },
    // 主表 点击行
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.checkIdArry.includes(row.id)) {
        tableCell.toggleRowSelection([{ row: row, selected: false }]);
        return;
      }
      tableCell.toggleRowSelection([{ row: row, selected: true }]);
    },
    // 批量操作
    batchHandleOptionFun(command) {
      this.ipForm.account = '';
      this.blockAccount = [];
      this.inheritAccount = [];
      if (this.checkIdArry.length === 0) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setIpName = command.item.label;
      this.batchOptionData.title = command.item.label;
      this.batchOptionData.btnLabel = command.item.label;
      if (command.item.label === '移至其他分组' || command.item.label === '批量修改备注') {
        this.setIpModel = true;
        this.$nextTick(() => {
          this.$refs.ipForm.resetFields();
        })
      } else {
        this.popConfirm(command);
      }
    },
    // 批量操作 功能
    popConfirm(command) {
      const that = this;
      that.$confirm(`确认${command.item.label}吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            const reqApi = command.item.api;
            const labelIndex = command.item.label
            const params = {}
            params.accounts = that.checkAccount
            instance.confirmButtonLoading = true;
            reqApi(params).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code !== 0) return;
              that.getTableDataFun();
              that.$refs.serveTable.clearSelection();
              if (labelIndex === '批量导出') {
                window.location.href = res.data.url
              }
              if (labelIndex === '批量删除') {
                that.initNumberGroup();
              }
              successTips(that)
              done();
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: '已取消' });
      })
    },
    // 全局配置项
    handleCommand(row, command) {
      this.ipForm.account = '';
      this.blockAccount = [];
      this.inheritAccount = [];
      this.setIpName = command.item.label;
      const that = this;
      that.$confirm(`确认${command.item.label}吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            const reqApi = command.item.api;
            const params = {}
            params.accounts = that.checkAccount
            instance.confirmButtonLoading = true;
            reqApi(params).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code !== 0) return;
              that.getTableDataFun();
              that.$refs.serveTable.clearSelection();
              successTips(that)
              done();
            })
          } else {
            done();
            instance.confirmButtonLoading = false;
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: '已取消' });
      })
    },
    // 批量上线
    onlineHandle(command) {
      this.ipForm.ip_id = '';
      this.setIpName = command.item.label;
      this.batchOptionData.title = command.item.label;
      this.batchOptionData.btnLabel = command.item.label;
      if (command.item.label === '批量上线') {
        this.setIpModel = true;
        this.$nextTick(() => {
          this.$refs.ipForm.resetFields();
        })
      } else {
        this.popConfirm(command);
      }
      this.countryList = [];
    },
    // 批量操作 弹窗 保存
    submitSetBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {}
          this.ipForm.account ? params.accounts = [this.this.ipForm.account] : params.accounts = this.checkAccount;
          let batchOptionArr = []
          if (this.batchOptionData.btnLabel === '移至其他分组') {
            batchOptionArr = this.batchOption
            params.group_id = this.ipForm.group_id // 移动分组
          } else if (this.batchOptionData.btnLabel === '批量修改备注') {
            batchOptionArr = this.batchOption
            params.remark = this.ipForm.remock_text // 修改备注
          } else if (this.batchOptionData.btnLabel === '批量上线') {
            batchOptionArr = this.onlineOption
            params.ip_category = this.ipForm.iptype[0];
            params.ip_type = this.ipForm.iptype[1] === 4 ? 1 : this.ipForm.iptype[1] === 6 ? 3 : 2;
            this.ipForm.iptype[0] === 1 ? params.country = this.ipForm.ip_id : params.ip_id = this.ipForm.ip_id;
        }
          let reqApi;
          this.isLoading = true;
          batchOptionArr.forEach(item => {
            if (item.label === this.batchOptionData.btnLabel) {
              reqApi = item.api
            }
          })
          reqApi(params).then(res => {
            this.isLoading = false;
            if (res.code !== 0) return;
            this.setIpModel = false;
            if (this.batchOptionData.btnLabel === '移至其他分组') {
              this.initNumberGroup();
            }
            this.getTableDataFun();
            this.$refs.serveTable.clearSelection();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 窗口容器大小
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 380;
    },
    // 选中项
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => {
        return item.id
      })
      this.checkAccount = row.map(item => {
        return item.account
      })
    },
    async changeIpHandle() {
      const params = {
        ip_type: this.ipForm.iptype[1] === 4 ? 1 : 2,
      }
      this.ipForm.iptype[0] === 2 ? delete params.ip_type : '';
      const reqApi = this.ipForm.iptype[0] === 1 ? getstaticip : getdynamicip;
      const res = await reqApi(params);
      if (res.code !== 0) return;
      this.countryList = res.data.list || [];
    },
    handleNewwork(row, idx) {
      if (idx === 1) {
        this.queryData.status = row;
      } else if (idx === 2) {
        this.queryData.use_status = row;
      } else if (idx === 3) {
        this.queryData.account_type = row;
      } else if (idx === 4) {
        this.queryData.staff_status = row;
      } else if (idx === 5) {
        this.queryData.work_status = row;
      } else if (idx === 6) {
        this.queryData.account_role = row;
      }
      this.getTableDataFun();
    },
    addRemark(row, idx) {
      this.setIpModel = true;
      this.ipForm.account = row.account;
      this.ipForm.remock_text = row.remark || '';
      this.setIpName = this.$t('sys_c091');
    },
    sorthandle({ column, prop, order }) {
      this.queryData.sort = '';
      if (order) {
        this.queryData.sort = order === 'ascending' ? 'user_num' : '-user_num';
      }
      this.getTableDataFun();
    },

    restQueryBtn() {
      this.queryData.seat_id = 1;
      this.queryData.sort_type = 1;
      this.queryData.account = '';
      this.queryData.staff_no = '';
      this.queryData.group_id = '';
      this.checkIdArry = [];
      this.checkAccount = [];
      this.queryData.select_sort = 'account';
      this.getTableDataFun(1)
      this.$refs.serveTable.clearSelection();
    },
    getPortNum() {
      this.loadingPort = true;
      getwaport({}).then(res => {
        setTimeout(() => {
          this.loadingPort = false;
        }, 500)
        const port = res.data || '';
        this.allPortList[0].num = port.account_num;
        this.allPortList[1].num = port.online_num;
        this.allPortList[2].num = port.offline_num;
        this.allPortList[3].num = port.title_num;
      })
    },
    editGroup(row, idx) {
      this.type = idx;
      this.group_name = '';
      if (idx === 1) return;
      this.groupForm.id = row.id;
      this.group_name = row.name;
    },
    async addGroup(title) {
      const params = {
        ptype: this.type,
        name: this.group_name,
        type: Number(this.cardAcyive),
      }
      this.ipLoading = true;
      this.type === 2 ? params.id = this.groupForm.id : '';
      const newBank = await doaccountgroup(params);
      if (newBank.code !== 0) return;
      this.visible = false;
      this.ipLoading = false;
      this.addVisible = false;
      this.initNumberGroup();
      successTips(this)
    },
    async delGroup(row) {
      const res = await doaccountgroup({ ptype: 3, del_id: [row.id] });
      if (res.code !== 0) return;
      this.groupIdx = 0;
      this.groupForm.group_id = '';
      successTips(this)
      for (let k = 0; k < this.numberGroupList.length; k++) {
        if (this.numberGroupList[k].id === row.id) {
          this.numberGroupList.splice(k, 1)
        }
      }
    },
    changeGroup(row, idx) {
      this.batchArry = [];
      this.checkedNum = 0;
      this.groupIdx = idx;
      this.queryData.group_id = idx === 'clear' ? '' : row.id;
      if (idx === 'clear') {
        this.initNumberGroup()
      }
      this.getTableDataFun(1);
      this.$refs.serveTable.clearSelection();
    },
    switchPage({ page, size }) {
      this.loading = true;
      if (this.queryData.limit !== size) {
        this.queryData.page = 1;
      } else {
        this.queryData.page = page;
      }
      this.queryData.limit = size;
      this.getTableDataFun();
    },
    async getStaffList(num) {
      this.staffData = [];
      this.seatPage = num || this.seatPage;
      this.staffLoading = true;
      // this.$refs.tableName.clearSelection();
      const res = await getcustomeruserlist({
        account: this.ipForm.staff_name,
        page: this.seatPage,
        limit: this.seatLimit,
        group_id: this.stsff_group_id
      });
      this.staffLoading = false;
      this.seatTotal = res.data.total;
      this.staffData = res.data.list || [];
    },
    handleTag(type) {
      let color;
      switch (type) {
        case 1:
          color = 'danger';
          break;
        case 2:
          color = 'success';
          break;
        case 3:
          color = 'warning';
          break;
        case 4:
          color = 'danger';
          break;
        case 5:
          color = 'warning';
          break;
        default:
          break;
      }
      return color;
    },
    dragStart(index) {
      this.draggedItemIndex = index;
    },
    async handleMoveSort(index) {
      const draggedItem = this.numberGroupList[this.draggedItemIndex];
      this.numberGroupList.splice(this.draggedItemIndex, 1);
      this.numberGroupList.splice(index, 0, draggedItem);
      this.draggedItemIndex = -1;
      const sortMap = this.numberGroupList.map(item => {
        return item.id
      });
      const res = await sortgroup({ list: sortMap });
      if (res.code !== 0) return;
    }
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
  // max-height: 550px;
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
