<!-- 账号列表(售后终端) -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;" class="queryForm">
      <el-form-item>
        <el-input v-model="model1.account" clearable placeholder="请输入WS账号" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="model1.reason" clearable placeholder="请输入描述" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="initNumberList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-download" type="primary" @click="batchExportDataFun">批量导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 分组管理 -->
    <div class="continer_main">
      <div :class="[!showGroup?'group_mian_hide':'']">
        <div class="group_head_warp">
          <div class="group_head" @click="changeGroup(0, 'clear')">
            <i class="el-icon-d-arrow-left" @click="showGroup=false" />
            全部分组 ({{ numGroupTotal }})
          </div>
          <div v-show="false" class="group_icon">
            <el-popover v-model="search_icon" placement="top" width="230">
              <p>
                <el-select
                  v-model="model1.group_name"
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
                  :class="['group_item', model1.group_id === item.id ? 'group_active' : '']"
                  :draggable="true"
                  @click="changeGroup(item, idx)"
                  @dragstart="dragStart(idx)"
                  @drop="handleMoveSort(idx)"
                  @dragover.prevent
                >
                  <div class="group_name">
                    <i
                      :class="['left_icon', model1.group_id === item.id ? 'el-icon-folder-opened' : 'el-icon-folder']"
                      class="left_icon"
                    />
                    <span class="group_text">{{ item.name }}</span>
                    <span v-show="false">({{ item.count }})</span>
                  </div>
                  <div v-show="false" class="group_icon">
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
          <div v-html="$t('sys_mat007',{value:checkIdArray.length})" />
        </div>
        <u-table
          ref="serveTable"
          v-loading="loading"
          :data="accountDataList"
          :height="cliHeight"
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
          <!-- <u-table-column type="index" :label="$t('sys_g020')" width="60" /> -->
          <u-table-column :reserve-selection="true" type="selection" width="55" />
          <u-table-column label="WS账号" prop="account" width="120" />
          <u-table-column label="状态" min-width="100" prop="status">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,1)">
                <span :class="[model1.status?'dropdown_title':'']" style="color:#909399">状态
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in accountOptions"
                    :key="idx"
                    :class="{'dropdown_selected':idx==model1.status}"
                    :command="idx"
                  >{{ item == '' ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <!-- <el-tag :type="handleTag(scope.row.status)" size="small"> {{ accountOptions[scope.row.status] }}</el-tag> -->
              {{ accountOptions[scope.row.status] }}
            </template>
          </u-table-column>
          <u-table-column label="描述" min-width="100" prop="reason" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.reason ? scope.row.reason : '-' }}</span>
            </template>
          </u-table-column>
          <u-table-column label="类型" min-width="100" prop="account_type">
            <template slot="header">
              <el-dropdown size="medium " trigger="click" @command="(command) => handleNewwork(command,3)">
                <span :class="[model1.account_type?'dropdown_title':'']" style="color:#909399">类型
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item,idx) in accountType"
                    :key="idx"
                    :class="{'dropdown_selected':idx==model1.account_type}"
                    :command="idx"
                  >{{ item == '' ? $t('sys_l053') : item }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope"> {{ accountType[scope.row.account_type] }}</template>
          </u-table-column>
          <u-table-column label="创建时间" prop="first_login_time" width="180">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : '-' }}
            </template>
          </u-table-column>
        </u-table>

        <div class="layui_page">
          <el-pagination
            :current-page.sync="model1.page"
            :page-size="model1.limit"
            :page-sizes="pageOption"
            :total="model1.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="homelHandleSize"
            @current-change="homeHandleCurrent"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { successTips, resetPage } from '@/utils/index'
import {
  getaccountinfolist,
  getaccountgrouplist,
  doaccountgroup,
  sortgroup,
  dooutputaccount
} from '@/api/storeroom'

export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 100,
        total: 0,
        account: '',
        group_id: '',
        select_sort: 'account',
        status: '',
        account_type: '',
        sort_type: 1,
        group_name: '',
        reason: '',
      },
      cliHeight: 0,
      screenSelect: [],
      numGroupTotal: 0,
      accountDataList: [],
      numberGroupList: [],
      loading: false,
      ipLoading: false,
      showGroup: true,
      checkIdArray: [],
      checkAccount: [],
      search_icon: false,
      loadingGroup: false,
      pageOption: resetPage(),
      limit: 200,
      total: 0,
      addVisible: false,
      cardAcyive: '1',
      type: '',
      group_id: '',
      group_name: '',
      groupForm: {
        id: '',
        account: '',
        group_id: '',
        title: '',
        content: ''
      },

      draggedItemIndex: 0
    }
  },
  computed: {
    accountType() {
      return ['', this.$t('sys_l067'), this.$t('sys_l068')]
    },
    accountOptions() {
      return ['', this.$t('sys_g032'), this.$t('sys_g033'), this.$t('sys_g034'), this.$t('sys_g035'), this.$t('sys_g036')]
    },
  },
  watch: {},
  created() {
    this.initNumberGroup();
    this.initNumberList();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  methods: {
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 240;
    },
    handleSelectionChange(row) {
      this.checkIdArray = row.map(item => {
        return item.id
      })
      this.checkAccount = row.map(item => {
        return item.account
      })
    },
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.checkIdArray.includes(row.id)) {
        tableCell.toggleRowSelection([{ row: row, selected: false }]);
        return;
      }
      tableCell.toggleRowSelection([{ row: row, selected: true }]);
    },
    handleNewwork(row, idx) {
      if (idx === 1) {
        this.model1.status = row;
      } else if (idx === 3) {
        this.model1.account_type = row;
      }
      this.initNumberList();
    },
    sorthandle({ column, prop, order }) {
      this.model1.sort = '';
      if (order) {
        this.model1.sort = order === 'ascending' ? 'user_num' : '-user_num';
      }
      this.initNumberList();
    },
    restQueryBtn() {
      this.model1.sort_type = 1;
      this.model1.account = '';
      this.model1.group_id = '';
      this.checkIdArray = [];
      this.checkAccount = [];
      this.screenSelect = [];
      this.model1.select_sort = 'account';
      this.initNumberList(1)
      this.$refs.serveTable.clearSelection();
    },

    // 批量导出
    batchExportDataFun() {
      if (this.checkAccount.length === 0) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.$confirm('确认批量导出吗？','提示',{
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const params = {
              accounts: this.checkAccount
            }
            dooutputaccount(params).then(res => {
              if (res.code !== 0) return;
              window.location.href = res.data.url
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
    // 列表分页
    initNumberList(num) {
      this.loading = true;
      this.model1.page = num || this.model1.page;
      const sort = this.model1.sort_type === 1 ? this.model1.select_sort : '-' + this.model1.select_sort;
      const params = {
        page: this.model1.page,
        limit: this.model1.limit,
        account: this.model1.account, // 账号
        group_id: this.model1.group_id, // 分组
        sort: sort, // 排序
        reason_type: 1,// 固定参数
        reason: this.model1.reason,
        status: this.model1.status || -1,
        account_type: this.model1.account_type || -1,
      }
      getaccountinfolist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.accountDataList = res.data.list.map(item => {
          if (item.reason !== '封号' && item.reason !== '') {
            item.reason = '登录异常'
          }
          return item
        });
      })
    },
    async initNumberGroup() {
      this.loadingGroup = true;
      const { data } = await getaccountgrouplist({ name: this.model1.group_name, page: 1, limit: 100 });
      this.search_icon = false;
      this.loadingGroup = false;
      this.numGroupTotal = data.total;
      this.numberGroupList = data.list || [];
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
      this.ipLoading = false;
      this.addVisible = false;
      this.initNumberGroup();
      successTips(this)
    },
    async delGroup(row) {
      const res = await doaccountgroup({ ptype: 3, del_id: [row.id] });
      if (res.code !== 0) return;
      this.groupForm.group_id = '';
      successTips(this)
      for (let k = 0; k < this.numberGroupList.length; k++) {
        if (this.numberGroupList[k].id === row.id) {
          this.numberGroupList.splice(k, 1)
        }
      }
    },
    changeGroup(row, idx) {
      this.model1.group_id = idx === 'clear' ? '' : row.id;
      if (idx === 'clear') {
        this.initNumberGroup()
      }
      this.initNumberList(1);
      this.$refs.serveTable.clearSelection();
    },
    switchPage({ page, size }) {
      this.loading = true;
      if (this.model1.limit !== size) {
        this.model1.page = 1;
      } else {
        this.model1.page = page;
      }
      this.model1.limit = size;
      this.initNumberList();
    },
    // 分页 切换
    homelHandleSize(val) {
      this.model1.limit = val;
      this.initNumberList();
    },
    // 页码
    homeHandleCurrent(val) {
      this.model1.page = val;
      this.initNumberList();
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

.queryForm{
  &:after{
    content: "";
    display: table;
    clear: both;
  }
  ::v-deep .el-form-item{
    float: left;
  }
  ::v-deep .el-form-item:last-of-type{
    float: right;
    //clear: both; /* 清除左右两边的浮动 */
  }
}
</style>
<style lang="scss">
.group_continer {
  .el-pagination {
    text-align: left !important;
  }
}
</style>
