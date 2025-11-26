<!-- 账号列表(安卓终端) -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 端口管理 -->
    <el-row :gutter="20">
      <el-col v-for="(item, idx) in allPortList" v-show="item != ''" :key="idx" :span="6">
        <el-card>
          <div class="refsh_icon" @click="getPortNum">
            <i class="el-icon-refresh" size="16" />
          </div>
          <el-button v-if="loadingPort" class="loading_icon" type="primary" :loading="true" />
          <div v-else class="box_card_item">
            <span class="port_title">{{ item.name }}</span>
            <span>{{ item.num }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="model1.account" clearable :placeholder="$t('sys_g006')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initNumberList(1)">{{ $t('sys_c002') }}</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">{{ $t('sys_c049') }}</el-button>
      </el-form-item>
      <div v-if="screenSelect.length>0" class="level_01_01">
        <div v-for="(item,idx) in screenSelect" v-if="item.label" :key="idx" class="level_01_02" @click="delScreen(idx)">
          <span v-if="item.label">【{{ screenOptions[item.label].name }}】</span>
          <template v-if="!item.item">
            <span v-if="termOptions[item.blong]">{{ termOptions[item.blong] }}</span>
            <span v-if="item.reason">【{{ item.reason }}】</span>
          </template>
          <template v-else>
            【{{ $baseFun.resetTime(item.item[0]) }} ~ {{ $baseFun.resetTime(item.item[1]) }}】
          </template>
          <i class="el-icon-error" />
        </div>
      </div>
    </el-form>
    <el-form size="small" :inline="true">
      <el-form-item>
        <el-dropdown trigger="click" @command="onlineHandle">
          <el-button type="primary"> {{ $t('sys_g016') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in onlineOption" :id="idx" :key="idx" :disabled="idx==0||checkIdArry.length==0" :command="{item,idx}">
              {{ item }}
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
            <el-dropdown-item v-for="(item, idx) in baseConfigOption" v-show="item.label" :key="idx" :command="{item,idx}">
              <i :class="'el-icon-' + item.icon" />
              {{ item.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(2,command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in betchOption" v-show="item.label" :key="idx" :command="{item,idx}">
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
                <el-select v-model="model1.group_name" size="small" clearable filterable :placeholder="$t('sys_c053')" style="width:100%;">
                  <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="search_icon=false">{{ $t('sys_c023') }}</el-button>
                <el-button type="primary" size="mini" @click="initNumberGroup">{{ $t('sys_c024') }}</el-button>
              </div>
              <i slot="reference" class="el-icon-search" style="margin-right: 10px;" />
            </el-popover>
            <el-popover v-model="addVisible" placement="top" width="230">
              <p>
                <el-input v-model="group_name" size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
              </p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="addVisible=false">{{ $t('sys_c023') }}</el-button>
                <el-button type="primary" size="mini" :loading="ipLoading" :disabled="!group_name.trim()" @click="addGroup(0, 0)">{{ $t('sys_c024') }}</el-button>
              </div>
              <i slot="reference" class="el-icon-plus" @click.stop="editGroup(0, 1)" />
            </el-popover>
          </div>
        </div>
        <el-button v-if="loadingGroup" class="loading_icon" type="primary" :loading="true" />
        <template v-else>
          <div class="group_warp" :style="{height:(cliHeight-40)+'px'}">
            <template v-if="numberGroupList.length>0">
              <transition-group name="fade">
                <div v-for="(item, idx) in numberGroupList" :key="idx" :draggable="true" :class="['group_item', model1.group_id === item.id ? 'group_active' : '']" @click="changeGroup(item, idx)" @dragstart="dragStart(idx)" @dragover.prevent @drop="handleMoveSort(idx)">
                  <div class="group_name">
                    <i class="left_icon" :class="['left_icon', model1.group_id === item.id ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                  <div class="group_icon">
                    <el-popover :key="idx" v-model="item.visible" placement="top" width="230">
                      <p>
                        <el-input v-model="group_name" clearable size="small" maxlength="10" show-word-limit :placeholder="$t('sys_c112')" />
                      </p>
                      <div style="text-align: right; margin: 0">
                        <el-button size="mini" type="text" @click="item.visible = false">{{ $t('sys_c023') }}</el-button>
                        <el-button type="primary" :loading="ipLoading" :disabled="!group_name.trim()" size="mini" @click="addGroup(item, 2)">{{ $t('sys_c024') }}</el-button>
                      </div>
                      <i slot="reference" class="el-icon-edit" @click.stop="editGroup(item, 2)" />
                    </el-popover>
                    <el-popconfirm :title="$t('sys_c128')" :confirm-button-text="$t('sys_c024')" :cancel-button-text="$t('sys_c023')" icon="el-icon-info" @confirm="delGroup(item, idx)">
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
            <el-tooltip effect="dark" content="展开分组" placement="top">
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
          row-key="id"
          use-virtual
          border
          :height="cliHeight"
          element-loading-spinner="el-icon-loading"
          style="width: 100%;"
          show-body-overflow="title"
          :total="model1.total"
          :page-sizes="pageOption"
          :page-size="model1.limit"
          :current-page="model1.page"
          :pagination-show="true"
          @sort-change="sorthandle"
          @selection-change="handleSelectionChange"
          @row-click="rowSelectChange"
          @handlePageSize="switchPage"
        >
          <!-- <u-table-column type="index" :label="$t('sys_g020')" width="60" /> -->
          <u-table-column type="selection" width="55" :reserve-selection="true" />
          <u-table-column prop="head" :label="$t('sys_g021')" width="80">
            <template slot-scope="scope">
              <el-avatar v-if="scope.row.head" :src="scope.row.head" />
              <el-avatar v-else icon="el-icon-user-solid" />
            </template>
          </u-table-column>
          <u-table-column prop="account" :label="$t('sys_g027')" width="120" />
          <u-table-column prop="nick_name" :label="$t('sys_g022')" min-width="100">
            <template slot-scope="scope">
              {{ scope.row.nick_name?scope.row.nick_name:"-" }}
            </template>
          </u-table-column>
          <u-table-column prop="status" :label="$t('sys_c022')" min-width="100">
            <template slot="header">
              <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,1)">
                <span style="color:#909399" :class="[model1.status?'dropdown_title':'']"> {{ $t('sys_c022') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,idx) in accountOptions" :key="idx" :class="{'dropdown_selected':idx==model1.status}" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope">
              <el-tag size="small" :type="handleTag(scope.row.status)"> {{ accountOptions[scope.row.status] }}</el-tag>
            </template>
          </u-table-column>
          <u-table-column prop="reason" show-overflow-tooltip :label="$t('sys_g025')" min-width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.reason?scope.row.reason:"-" }}</span>
            </template>
          </u-table-column>
          <u-table-column prop="account_type" :label="$t('sys_l057')" min-width="100">
            <template slot="header">
              <el-dropdown trigger="click" size="medium " @command="(command) => handleNewwork(command,3)">
                <span style="color:#909399" :class="[model1.account_type?'dropdown_title':'']"> {{ $t('sys_l057') }}
                  <i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item v-for="(item,idx) in accountType" :key="idx" :class="{'dropdown_selected':idx==model1.account_type}" :command="idx">{{ item==''?$t('sys_l053'):item }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
            <template slot-scope="scope"> {{ accountType[scope.row.account_type] }}</template>
          </u-table-column>
          <u-table-column prop="first_login_time" :label="$t('sys_g015')" width="180">
            <template slot-scope="scope">
              {{ scope.row.itime > 0 ? $baseFun.resetTime(scope.row.itime * 1000) : "-" }}
            </template>
          </u-table-column>
          <u-table-column prop="offline_time" :label="$t('sys_g013')" min-width="160">
            <template slot-scope="scope">
              {{ scope.row.offline_time > 0 ? $baseFun.resetTime(scope.row.offline_time * 1000) : "-" }}
            </template>
          </u-table-column>
          <u-table-column prop="remark" show-overflow-tooltip :label="$t('sys_l062')" width="100">
            <template slot-scope="scope">
              <div class="remark_ext">{{ scope.row.remark }}</div>
              <div @click.stop="addRemark(scope.row,8)"><i class="el-icon-edit" style="color: rgb(103, 194, 58); cursor: pointer;" /></div>
            </template>
          </u-table-column>
        </u-table>
      </div>
    </div>
    <!-- 设置IP -->
    <el-dialog :title="setIpName" center :visible.sync="setIpModel" :close-on-click-modal="false" :width="setIpType==7?'1000px':'550px'">
      <el-form v-if="setIpModel" ref="ipForm" size="small" :model="ipForm" label-width="100px" :rules="ipRules">
        <template v-if="setIpType == 1">
          <el-form-item :label="$t('sys_c053') + ':'" prop="group_id" label-width="140px">
            <el-select v-model="ipForm.group_id" size="small" clearable filterable :placeholder="$t('sys_c053')" style="width:100%;">
              <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label-width="0">
            <div class="group_tips">一个账号只能存在于一个分组中！</div>
          </el-form-item>
        </template>
        <template v-if="setIpType == 3">
          <el-form-item :label="$t('sys_c052') + ':'" prop="use_status" label-width="120px">
            <el-select v-model="ipForm.use_status" :placeholder="$t('sys_c052')">
              <el-option v-for="(item,idx) in isUseOptions" v-show="item!=''" :key="idx" :label="item" :value="idx" />
            </el-select>
          </el-form-item>
        </template>
        <template v-if="setIpType == 7">
          <div class="close_inherit">
            <div>
              <u-table v-loading="inheLoading" :data="blockAccount" border height="420" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" @selection-change="handleBlockChange">
                <u-table-column type="selection" width="40" />
                <u-table-column prop="account" :label="$t('sys_g027')" min-width="140" />
                <u-table-column prop="staff_no" show-overflow-tooltip :label="$t('sys_l017')" min-width="140" />
              </u-table>
              <div class="footer_btn">
                <!-- let checkAccount = this.blockType==1?this.blockAccount:this.inheritAccount; -->
                <el-button size="small" type="primary" @click="addCloseBtn(1)">{{ $t('sys_mat015',{value:$t('sys_g027')}) }}</el-button>
                <el-button size="small" type="info" :disabled="blockCheckItem.length==0" @click="delCloseBtn(1)"> {{ $t('sys_rai076',{value:$t('sys_c028')}) }}</el-button>
              </div>
            </div>
            <div class="close_desc">
              <span v-for="(item,idx) in closeOption" :key="idx" v-html="item" />
            </div>
            <div>
              <u-table v-loading="inheLoading" :data="inheritAccount" border height="420" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255,1)" @selection-change="handleInheritChange">
                <u-table-column type="selection" width="40" />
                <u-table-column prop="account" :label="$t('sys_g027')" min-width="140" />
                <u-table-column prop="group_name" show-overflow-tooltip :label="$t('sys_g108')" min-width="140" />
              </u-table>
              <div class="footer_btn">
                <el-button size="small" type="primary" @click="addCloseBtn(2)">{{ $t('sys_mat015',{value:$t('sys_g027')}) }}</el-button>
                <el-button size="small" type="info" :disabled="inheritCheckItem.length==0" @click="delCloseBtn(2)"> {{ $t('sys_rai076',{value:$t('sys_c028')}) }}</el-button>
              </div>
            </div>
          </div>
        </template>
        <template v-if="setIpType == 8 || setIpType == 11">
          <el-form-item prop="remock_text" label-width="0">
            <el-input v-model="ipForm.remock_text" type="textarea" :placeholder="$t('sys_mat021')" size="small" :rows="6" maxlength="50" show-word-limit />
          </el-form-item>
        </template>
        <template v-if="setIpType==99">
          <el-form-item v-if="countryList.length==0" :label="$t('sys_c052') + ':'" prop="iptype">
            <el-cascader ref="myCascader" v-model="ipForm.iptype" el-cascader :options="ipOptions" style="width: 100%;" @change="changeIpHandle" />
          </el-form-item>
          <el-form-item v-if="countryList.length>0" :label="$t('sys_c054') + ':'" prop="ip_id">
            <el-select v-model="ipForm.ip_id" filterable :placeholder="$t('sys_c052')">
              <el-option v-for="(item,idx) in countryList" :key="idx" :label="item.country" :value="item.ip_id?item.ip_id:item.country" />
            </el-select>
          </el-form-item>
        </template>

        <template v-if="setIpType==12">
          <el-alert :title="$t('sys_g062')" type="success" :closable="false" style="background: #ecf5ff;color: #409eff;border-radius: 0;" effect="dark" />
          <el-form-item :label="$t('sys_g056') + ':'" prop="seat_type" style="margin:20px 0 20px 0;">
            <el-radio-group v-model="ipForm.seat_type">
              <el-radio :label="1">{{ $t('sys_g061') }}</el-radio>
              <el-radio :label="2">{{ $t('sys_q106') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <template v-if="ipForm.seat_type==1">
            <el-form-item :label="$t('sys_g057') + ':'" prop="allocat_role" style="margin-bottom: 20px;">
              <el-radio-group v-model="ipForm.allocat_role">
                <el-radio :label="1">{{ $t('sys_g060') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('sys_g058') + ':'" style="margin-bottom: 20px;" prop="staffCheck">
              <el-button type="primary" @click="showStaffModel">{{ $t('sys_g058') }}</el-button>
            </el-form-item>
            <el-form-item style="margin-bottom: 0px;">
              <div class="seat_class">
                <div style="display: flex;justify-content: space-between;">
                  <div class="">
                    {{ $t('sys_g066') }}:<span style="color:#409eff;">{{ ipForm.staffCheck.length }}</span>
                  </div>
                  <div style="color:#409eff;cursor: pointer;" @click="clearAllSeat">{{ $t('sys_g063') }}</div>
                </div>
                <div style="display: flex;gap: 10px; flex-wrap: wrap;">
                  <div v-for="item in ipForm.staffCheck" :key="item" class="seat_item" style="display: flex;align-items: center; height: 28px; padding: 5px;color: #409eff;background: #ecf5ff;border-radius: 4px;border:1px solid #b3d8ff;">
                    <span>{{ item }}</span>
                    <i class="el-icon-close" style="cursor: pointer;margin-left: 5px;" @click="clearStaff(item)" />
                  </div>
                </div>
              </div>
            </el-form-item>
            <el-form-item style="margin-top: 10px;" label-width="0">
              <router-link :to="{ path: '/list' }">
                <span style="color:#409eff;cursor: pointer;">{{ $t('sys_g059') }}</span>
              </router-link>
            </el-form-item>
          </template>
        </template>
        <el-form-item label-width="0" style="text-align:center;margin-top: 40px;" class="el-item-bottom">
          <el-button v-if="setIpType != 7" @click="setIpModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button v-if="setIpType == 7" :loading="isLoading" :disabled="inheritAccount.length==0||blockAccount.length==0" type="success" @click="submitBlockBtn">{{ $t('sys_g107') }}</el-button>
          <el-button v-else :loading="isLoading" :disabled="setIpType==99&&countryList.length==0" type="primary" @click="submitSetBtn('ipForm')">{{ $t('sys_c024') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 设置IP -->
    <el-dialog :title="is_staff==1?setStaffName:setIpName" center :visible.sync="changeModel" :close-on-click-modal="false" width="800px">
      <el-form ref="ipForm" size="small" :model="ipForm" label-width="100px" :rules="ipRules">
        <div style="display: flex;justify-content: space-between;">
          <div>
            <div class="group_head_warp" @click="changeStaffGroup(1,0)">
              <div class="group_head">
                {{ $t('sys_g049') }} ({{ numGroupTotal }})
              </div>
            </div>
            <el-button v-if="outLoading" class="loading_icon" type="primary" :loading="true" />
            <template v-else>
              <div class="group_warp">
                <div v-for="(item, idx) in staffGroupList" :key="idx" :class="['group_item', stsff_group_id==item.id ? 'group_active' : '']" @click="changeStaffGroup(item,idx)">
                  <div class="group_name">
                    <i class="left_icon" :class="['left_icon', stsff_group_id==item.id ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                    <span class="group_text">{{ item.name }}</span>
                    <span>({{ item.count }})</span>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div style="width: 100%;margin-left: 10px;">
            <div style="display:flex;gap:10px;">
              <el-input v-model="ipForm.staff_name" size="small" clearable placeholder="请输入账号查询" />
              <el-button size="small" type="primary" icon="el-icon-search" @click="getStaffList(1)">{{ $t('sys_c002') }}</el-button>
            </div>
            <div v-if="changeModel" style="max-height:450px;overflow-y:auto;margin-top:10px;">
              <u-table
                ref="tableName"
                v-loading="staffLoading"
                :data="staffData"
                row-key="uid"
                border
                style="width: 100%;"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(255, 255, 255,1)"
                @selection-change="handleStaffChange"
                @row-click="rowStaffChange"
              >
                <u-table-column type="selection" width="55" :reserve-selection="true" />
                <u-table-column prop="date" :label="$t('sys_c134')">
                  <template slot="header">
                    <span style="color:#909399">全部 已选:{{ checkItem.length||0 }}项</span>
                  </template>
                  <template slot-scope="scope">
                    {{ scope.row.account }}({{ scope.row.name }},账号数量:{{ scope.row.account_num }})
                  </template>
                </u-table-column>
              </u-table>
            </div>
            <div style="margin-top: 10px;">
              <el-pagination
                :current-page.sync="seatPage"
                :pager-count="5"
                :page-size="seatLimit"
                :page-sizes="pageOption"
                layout="total, sizes, prev, pager, next"
                :total="seatTotal"
                @size-change="seatSizeChange"
                @current-change="seatChangePage"
              />
            </div>
          </div>
        </div>
        <el-form-item label-width="0" style="text-align:center;margin-top: 40px;" class="el-item-bottom">
          <el-button @click="changeModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" @click="confirmBtn">{{ $t('sys_c090') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 设置IP -->
    <el-dialog :title="blockTitle" center :visible.sync="closeModel" :close-on-click-modal="false" width="1000px">
      <el-form size="small" label-width="100px">
        <div class="add_inherit">
          <div class="table_group">
            <div class="group_head_warp">
              <div class="group_head" @click="changeCloseGroup(0,0)">
                {{ $t('sys_g049') }} ({{ numGroupTotal }})
              </div>
              <div class="group_icon">
                <el-popover v-model="close_icon" placement="top" width="230">
                  <p>
                    <el-select v-model="close_group_name" size="small" clearable filterable :placeholder="$t('sys_c053')" style="width:100%;">
                      <el-option v-for="item in numberGroupList" :key="item.id" :label="item.name" :value="item.name" />
                    </el-select>
                  </p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="close_icon=false">{{ $t('sys_c023') }}</el-button>
                    <el-button type="primary" size="mini" @click="initNumberGroup">{{ $t('sys_c024') }}</el-button>
                  </div>
                  <i slot="reference" class="el-icon-search" />
                </el-popover>
              </div>
            </div>
            <el-button v-if="blockGroupLoading" class="loading_icon" style="margin-top: 10px;" type="primary" :loading="true" />
            <template v-else>
              <div class="group_warp">
                <template v-if="blockGroupList.length>0">
                  <div v-for="(item, idx) in blockGroupList" :key="idx" :class="['group_item', titleGroupIdx == item.id ? 'group_active' : '']" @click="changeCloseGroup(item, idx)">
                    <div class="group_name">
                      <i class="left_icon" :class="['left_icon', titleGroupIdx == item.id ? 'el-icon-folder-opened' : 'el-icon-folder']" />
                      <span class="group_text">{{ item.name }}</span>
                      <span>({{ item.count }})</span>
                    </div>
                    <div class="group_icon" @click.stop>
                      <el-dropdown trigger="click" placement="top-start" size="small">
                        <span class="el-dropdown-link">
                          <i class="el-icon-more" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item size="small">
                            <i class=" el-icon-user-solid" />
                            {{ $t('sys_c124') }}：{{ item.id }}
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                </template>
                <div v-else class="text_empty">{{ $t('sys_mat013') }}</div>
              </div>
            </template>
          </div>
          <div class="table_ele">
            <div class="tab_check_warp">
              <i slot="reference" class="el-icon-info" />
              <div v-html="$t('sys_mat007',{value:blockCheckList.length})" />
            </div>
            <u-table
              ref="blockTable"
              v-loading="isBlockLoading"
              :data="blockAccountList"
              style="width:100%;"
              row-key="id"
              border
              height="420"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(255, 255, 255,1)"
              @selection-change="handleCloseChange"
              @row-click="rowCloseChange"
            >

              <!-- <u-table :data="blockAccountList" row-key="id" use-virtual border height="420" v-loading="loading" ref="blockTable"
              element-loading-spinner="el-icon-loading" style="width: 100%;" :page-sizes="pageOption" :total="blockPramse.total"
              :page-size="blockPramse.limit" :current-page="blockPramse.page" :pagination-show="true" @row-click="rowCloseChange"
               @selection-change="handleCloseChange"  @handlePageSize="blockSwitchPage">  -->
              <u-table-column type="selection" width="40" :reserve-selection="true" />
              <u-table-column prop="account" :label="$t('sys_g109')" min-width="140" />
              <u-table-column prop="account_type" :label="$t('sys_l057')" min-width="100">
                <template slot="header">
                  <span style="color:#909399"> {{ blockType==1?$t('sys_mat062'):$t('sys_l057') }}</span>
                </template>
                <template slot-scope="scope">
                  <span>{{ blockType==1?scope.row.staff_no:accountType[scope.row.account_type] }}</span>
                </template>
              </u-table-column>
            </u-table>
            <div class="layui_page">
              <el-pagination
                background
                :page-sizes="pageOption"
                :current-page.sync="blockPramse.page"
                :page-size="blockPramse.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="blockPramse.total"
                @size-change="blockPageSize"
                @current-change="blockSwitchPage"
              />
            </div>
          </div>
        </div>
        <el-form-item label-width="0" style="text-align:center;margin-top: 40px;" class="el-item-bottom">
          <el-button @click="closeModel = false">{{ $t('sys_c023') }}</el-button>
          <el-button type="primary" @click="addBlockBtn">{{ $t('sys_c090') }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { successTips, resetPage } from '@/utils/index'
import { getadmingrouplist,getcustomeruserlist } from '@/api/staff'
import { getaccountinfolist,getaccountgrouplist,doaccountgroup,getwaport,doupgroup,dofreedip,dousestatus,dooutputaccount,dobatchdelaccount,doupremark,getdynamicip,getstaticip,dobatchlogin,dobatchfastlogin,dobatchlogout,doresetip,distributecustomer,getinheritgrouplist,getinheritaccountlist,doinherit,sortgroup } from '@/api/storeroom'
export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 100,
        total: 0,
        ipCtime: '',
        account: '',
        staff_no: '',
        group_id: '',
        work_status: '',
        custom_popover: '960px',
        select_sort: 'account',
        status: '',
        use_status: '',
        staff_status: '',
        account_type: '',
        sort_type: 1,
        group_name: '',
        ip_category: '',
        expire_status: '',
        disable_status: '',
      },
      cliHeight: 0,
      seatPage: 1,
      seatLimit: 10,
      seatTotal: 0,
      blockedList: [],
      inheritList: [],
      staffData: [],
      screenSelect: [],
      countryList: [],
      numGroupTotal: 0,
      stsff_group_id: '',
      accountDataList: [],
      numberGroupList: [],
      staffGroupList: [],
      loading: false,
      closeModel: false,
      is_show_id: false,
      ipLoading: false,
      showGroup: true,
      loadingPort: false,
      staffLoading: false,
      setIpModel: false,
      changeModel: false,
      checkIdArry: [],
      checkAccount: [],
      search_icon: false,
      loadingGroup: false,
      outLoading: false,
      blockGroupLoading: false,
      isBlockLoading: false,
      setIpType: '',
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
      groupList: [],
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
      draggedItemIndex: 0
    }
  },
  computed: {
    tableHrad() {
      return [
        this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),
        this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),
        this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),
        this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),
        this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021'),this.$t('sys_g021')
      ]
    },
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
        staffCheck: [{ type: 'array',required: true, message: this.$t('sys_c052'), trigger: 'change' }],
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
      return ['',this.$t('sys_g111'),this.$t('sys_g112')]
    },
    isUseOptions() {
      return ['',this.$t('sys_g037'),this.$t('sys_g038')]
    },
    setOptions() {
      return ['',this.$t('sys_c064'),this.$t('sys_g039')]
    },
    accountType() {
      return ['',this.$t('sys_l067'),this.$t('sys_l068')]
    },
    accountOptions() {
      return ['',this.$t('sys_g032'),this.$t('sys_g033'),this.$t('sys_g034'),this.$t('sys_g035'),this.$t('sys_g036')]
    },
    screenOptions() {
      return [
        {},{ name: this.$t('sys_g022'),value: 1,check: false },{ name: this.$t('sys_g025'),value: 2,check: false },
        { name: this.$t('sys_l062'),value: 3,check: false },{ name: this.$t('sys_g015'),value: 4,check: false },
        { name: this.$t('sys_g014'),value: 5,check: false },{ name: this.$t('sys_g013'),value: 6,check: false }
      ]
      // return ["",this.$t('sys_g022'),this.$t('sys_g025'),this.$t('sys_l062'),this.$t('sys_g015'),this.$t('sys_g014'),this.$t('sys_g013')]
    },
    termOptions() {
      return ['',this.$t('sys_g050'),this.$t('sys_g051'),this.$t('sys_g052'),this.$t('sys_g053')]
    },
    allPortList() {
      return [{ name: this.$t('sys_mat058'),num: 0 },{ name: this.$t('sys_mat059'),num: 0 },{ name: '账号离线数',num: 0 },{ name: '账号被封数',num: 0 }]
    },
    selecSort() {
      return [
        {
          label: this.$t('sys_g011'),
          value: 'account'
        },
        {
          label: this.$t('sys_g012'),
          value: 'staff_no'
        },
        {
          label: this.$t('sys_g013'),
          value: 'offline_time'
        },
        {
          label: this.$t('sys_g014'),
          value: 'first_login_time'
        },
        {
          label: this.$t('sys_g015'),
          value: 'item'
        }
      ]
      // return ["",this.$t('sys_g011'),this.$t('sys_g012'),this.$t('sys_g013'), this.$t('sys_g014'), this.$t('sys_g015')]
    },
    onlineOption() {
      return [this.$t('sys_g028'),this.$t('sys_g029'),this.$t('sys_g030')]
    },
    betchOption() {
      return [
        {
          icon: 'bottom',
          label: this.$t('sys_g041')
        },
        {
          icon: 'rank',
          label: this.$t('sys_g042')
        },
        {
          icon: 'refresh',
          label: this.$t('sys_g043')
        },
        {
          icon: 'setting',
          label: this.$t('sys_g044')
        },
        // {
        //     icon: "setting",
        //     label: this.$t('sys_g045')
        // },
        {
          icon: 'download',
          label: this.$t('sys_g046')
        },
        {
          icon: 'delete',
          label: this.$t('sys_g047')
        },
        {
          icon: 'edit',
          label: this.$t('sys_g104')
        },
        // {},
        {
          icon: 'connection',
          label: this.$t('sys_g106')
        },
        {
          icon: 'edit',
          label: this.$t('sys_g048')
        }
      ]
    },
    baseConfigOption() {
      return [
        {},{},{},{},{},{},{},{},{},
        {
          icon: 'help',
          label: this.$t('sys_g055')
        }
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
    closeModel(val) {
      if (val == false) {
        this.blockPramse.offest = 1;
        if (this.$refs.blockTable) {
          this.$refs.blockTable.clearSelection();
        }
      }
    },
    setIpModel(val) {
      if (val == false) {
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
    //   this.syncInitApi();
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
      this.cliHeight = document.documentElement.clientHeight - 380;
    },
    handleDisabled(row, inde) {
      return !(row.status == 2 || row.status == 3);
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => { return item.id })
      this.checkAccount = row.map(item => { return item.account })
    },
    rowCloseChange(row) {
      const refsElTable = this.$refs.blockTable;
      // let blockArry = this.blockType==1?this.blockAccount:this.inheritAccount;
      const findRow = this.blockCheckList.find(item => item.id == row.id);
      if (findRow) {
        refsElTable.toggleRowSelection([{ row: row,selected: false }]);
        return;
      }
      refsElTable.toggleRowSelection([{ row: row,selected: true }]);
    },
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.checkIdArry.includes(row.id)) {
        tableCell.toggleRowSelection([{ row: row,selected: false }]);
        return;
      }
      tableCell.toggleRowSelection([{ row: row,selected: true }]);
    },
    rowStaffChange(row) {
      const tableCell = this.$refs.tableName;
      if (this.checkItem.includes(row.account)) {
        tableCell.toggleRowSelection([{ row: row,selected: false }]);
        return;
      }
      tableCell.toggleRowSelection([{ row: row,selected: true }]);
    },
    async changeIpHandle() {
      const params = {
        ip_type: this.ipForm.iptype[1] == 4 ? 1 : 2,
      }
      this.ipForm.iptype[0] == 2 ? delete params.ip_type : '';
      const reqApi = this.ipForm.iptype[0] == 1 ? getstaticip : getdynamicip;
      const res = await reqApi(params);
      if (res.code != 0) return;
      this.countryList = res.data.list || [];
    },
    handleNewwork(row, idx) {
      if (idx == 1) {
        this.model1.status = row;
      } else if (idx == 2) {
        this.model1.use_status = row;
      } else if (idx == 3) {
        this.model1.account_type = row;
      } else if (idx == 4) {
        this.model1.staff_status = row;
      } else if (idx == 5) {
        this.model1.work_status = row;
      }
      this.initNumberList();
    },
    addRemark(row, idx) {
      this.setIpType = idx;
      this.setIpModel = true;
      this.ipForm.account = row.account;
      this.ipForm.remock_text = row.remark || '';
      this.setIpName = this.$t('sys_c091');
    },
    sorthandle({ column, prop, order }) {
      this.model1.sort = '';
      if (order) {
        this.model1.sort = order == 'ascending' ? 'user_num' : '-user_num';
      }
      this.initNumberList();
    },
    addScreen(type) {
      if (type == 1) {
        for (let x = 0; x < this.screenOptions.length; x++) {
          this.screenOptions[x].check = false;
        }
        this.screenSelect = [];
        this.initNumberList();
        return;
      }
      const newObj = { label: '',blong: 1,reason: '',item: '' }
      this.screenSelect.push(newObj)
      for (let x = 0; x < this.screenOptions.length; x++) {
        for (let l = 0; l < this.screenSelect.length; l++) {
          if (this.screenOptions[x].value == this.screenSelect[l].label) {
            this.screenOptions[x].check = true;
          }
        }
      }
    },
    delScreen(idx) {
      for (let k = 0; k < this.screenSelect.length; k++) {
        if (k === idx) {
          this.screenSelect.splice(k,1);
          this.initNumberList();
        }
      }
    },
    restQueryBtn() {
      this.model1.seat_id = 1;
      this.model1.sort_type = 1;
      this.model1.account = '';
      this.model1.staff_no = '';
      this.model1.group_id = '';
      this.checkIdArry = [];
      this.checkAccount = [];
      this.screenSelect = [];
      this.model1.select_sort = 'account';
      this.initNumberList(1)
      this.$refs.serveTable.clearSelection();
    },
    initNumberList(num) {
      this.loading = true;
      this.model1.page = num || this.model1.page;
      const sort = this.model1.sort_type == 1 ? this.model1.select_sort : '-' + this.model1.select_sort;
      const params = {
        page: this.model1.page,
        limit: this.model1.limit,
        account: this.model1.account, // 账号
        group_id: this.model1.group_id, // 分组
        staff_no: this.model1.staff_no, // 席位
        sort: sort, // 排序
        nick_name: '',
        reason: '',
        remark: '',
        reason_type: -1,
        remark_type: -1,
        nick_name_type: -1,
        itime_start_time: -1,
        itime_end_time: -1,
        first_login_start_time: -1,
        first_login_end_time: -1,
        offline_start_time: -1,
        offline_end_time: -1,
        status: this.model1.status || -1,
        use_status: this.model1.use_status || -1,
        staff_status: this.model1.staff_status || -1,
        work_status: this.model1.work_status || -1,
        account_type: this.model1.account_type || -1,
      }
      for (let k = 0; k < this.screenSelect.length; k++) {
        if (this.screenSelect[k].label == 1) {
          params.nick_name = this.screenSelect[k].reason;
          params.nick_name_type = this.screenSelect[k].blong
        }
        if (this.screenSelect[k].label == 2) {
          params.reason = this.screenSelect[k].reason;
          params.reason_type = this.screenSelect[k].blong
        }
        if (this.screenSelect[k].label == 3) {
          params.remark = this.screenSelect[k].reason;
          params.remark_type = this.screenSelect[k].blong
        }
        if (this.screenSelect[k].label == 4 && this.screenSelect[k].item) {
          const time1 = this.screenSelect[k].item;
          params.itime_start_time = this.$baseFun.resetTime(time1[0],3)
          params.itime_end_time = this.$baseFun.resetTime(time1[1],3)
        }
        if (this.screenSelect[k].label == 5 && this.screenSelect[k].item) {
          const time1 = this.screenSelect[k].item;
          params.first_login_start_time = this.$baseFun.resetTime(time1[0],3)
          params.first_login_end_time = this.$baseFun.resetTime(time1[1],3)
        }
        if (this.screenSelect[k].label == 6 && this.screenSelect[k].item) {
          const time1 = this.screenSelect[k].item;
          params.offline_start_time = this.$baseFun.resetTime(time1[0],3)
          params.offline_end_time = this.$baseFun.resetTime(time1[1],3)
        }
      }
      getaccountinfolist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.accountDataList = res.data.list || [];
      })
    },
    async initNumberGroup() {
      this.loadingGroup = true;
      const { data } = await getaccountgrouplist({ name: this.model1.group_name,page: 1,limit: 100 });
      this.search_icon = false;
      this.loadingGroup = false;
      this.numGroupTotal = data.total;
      this.numberGroupList = data.list || [];
    },
    getPortNum() {
      this.loadingPort = true;
      getwaport({}).then(res => {
        setTimeout(() => { this.loadingPort = false; },500)
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
      if (idx == 1) return;
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
      this.type == 2 ? params.id = this.groupForm.id : '';
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
        if (this.numberGroupList[k].id == row.id) {
          this.numberGroupList.splice(k, 1)
        }
      }
    },
    changeGroup(row, idx) {
      this.batchArry = [];
      this.checkedNum = 0;
      this.groupIdx = idx;
      this.model1.group_id = idx == 'clear' ? '' : row.id;
      if (idx == 'clear') { this.initNumberGroup() }
      this.initNumberList(1);
      this.$refs.serveTable.clearSelection();
    },
    addContent(row, idx) {
      this.materType = idx;
      this.groupForm.id = row.id;
      this.groupModel = true;
      this.$nextTick(() => {
        this.$refs.groupForm.resetFields();
        if (idx == 1) return;
        this.groupForm.title = row.name;
        this.groupForm.content = row.content;
      })
    },
    getRowKeys(row) {
      return row.id;
    },
    handleSizeFun(limit) {
      this.model1.limit = limit;
      this.initNumberList(1);
    },
    handlePageFun(page) {
      this.model1.page = page;
      this.initNumberList();
    },
    switchPage({ page,size }) {
      this.loading = true;
      if (this.model1.limit != size) {
        this.model1.page = 1;
      } else {
        this.model1.page = page;
      }
      this.model1.limit = size;
      this.initNumberList();
    },
    onlineHandle(row) {
      this.ipForm.ip_id = '';
      for (let k = 0; k < this.onlineOption.length; k++) {
        if (k == row.idx) {
          this.setIpName = this.onlineOption[k];
          if (k == 1) {
            this.setIpType = 99;
          } else {
            this.setIpType = 100;
          }
        }
      }
      if (this.setIpType == 100) {
        this.popconfirm();
        return;
      }
      this.setIpModel = true;
      this.$nextTick(() => {
        this.$refs.ipForm.resetFields();
        const _cascader = this.$refs.myCascader;
        _cascader.$refs.panel.activePath = [];
        _cascader.$refs.panel.checkedValue = [];
        _cascader.$refs.panel.syncActivePath()
      })
      this.countryList = [];
    },
    seatHandleBtn() {
      this.is_staff = '';
      this.setIpType = 12;
      this.setIpModel = true;
      this.setIpName = this.$t('sys_g061');
      this.$nextTick(() => {
        this.staffCheck = [];
        this.ipForm.staffCheck = [];
        this.$refs.ipForm.resetFields();
      })
    },
    async showStaffModel() {
      this.is_staff = 1;
      this.seatPage = 1;
      this.ipForm.staff_name = '';
      this.changeModel = true;
      this.staffLoading = true;
      this.ipForm.staffCheck = [];
      this.setStaffName = this.$t('sys_g058');
      await this.initStaffGroup();
      await this.getStaffList();
      // await this.$nextTick();
      if (this.staffData.length == 0 || this.ipForm.staffCheck.length == 0) return;
      for (let i = 0; i < this.staffData.length; i++) {
        if (this.ipForm.staffCheck.indexOf(this.staffData[i].account) > -1) {
          this.$nextTick(() => {
            this.$refs.tableName.toggleRowSelection(this.staffData[i], true);
          })
        } else {
          this.$nextTick(() => {
            this.$refs.tableName.toggleRowSelection(this.staffData[i], false);
          })
        }
      }
    },
    async initStaffGroup() {
      this.outLoading = true;
      const { data } = await getadmingrouplist({ name: this.model1.group_name,page: 1,limit: 100 });
      this.outLoading = false;
      this.staffGroupList = data.list || [];
    },
    changeStaffGroup(row,idx) {
      this.stsff_group_id = row.id;
      this.getStaffList();
    },
    seatSizeChange(val) {
      this.seatLimit = val;
      this.getStaffList()
    },
    seatChangePage(val) {
      this.seatPage = val;
      this.getStaffList()
    },
    async getStaffList(num) {
      this.staffData = [];
      this.seatPage = num || this.seatPage;
      this.staffLoading = true;
      // this.$refs.tableName.clearSelection();
      const res = await getcustomeruserlist({ account: this.ipForm.staff_name,page: this.seatPage,limit: this.seatLimit,group_id: this.stsff_group_id });
      this.staffLoading = false;
      this.seatTotal = res.data.total;
      this.staffData = res.data.list || [];
    },
    handleStaffChange(row) {
      this.checkItem = [];
      const shortItem = row.map(item => { return item.account })
      for (let k = 0; k < shortItem.length; k++) {
        if (this.ipForm.staffCheck.indexOf(shortItem[k]) == -1) {
          this.checkItem.push(shortItem[k])
        }
      }
      this.$refs.ipForm.clearValidate('staffCheck');
    },
    confirmBtn() {
      this.ipForm.staffCheck = [... this.ipForm.staffCheck,...this.checkItem];
      this.changeModel = false;
      this.seatPage = 1;
    },
    clearStaff(row) {
      for (let k = 0; k < this.ipForm.staffCheck.length; k++) {
        if (this.ipForm.staffCheck[k] == row) {
          this.ipForm.staffCheck.splice(k,1)
        }
      }
    },
    clearAllSeat() {
      this.ipForm.staffCheck = [];
      this.$refs.blockTable.clearSelection();
    },
    handleCommand(row,command) {
      this.ipForm.account = '';
      this.blockAccount = [];
      this.inheritAccount = [];
      if (this.checkIdArry.length == 0 && command.idx != 7 && command.idx != 9) {
        return successTips(this,'error',this.$t('sys_c126'));
      }
      this.setIpType = command.idx;
      this.setIpName = command.item.label;
      if (this.setIpType == 1 || this.setIpType == 3 || this.setIpType == 7 || this.setIpType == 8) {
        this.setIpModel = true;
        this.$nextTick(() => {
          this.$refs.ipForm.resetFields();
        })
      } else if (this.setIpType == 6) {
        this.$router.push({ path: '/modify-wa-profile',query: { accounts: String(this.checkAccount) }});
      } else {
        this.popconfirm();
      }
    },
    jumpServeicBtn(row,type) {
      if (type == 1 && row.staff_no) {
        this.$router.push({ path: '/chatroom',query: { staff: row.staff_no,alt: row.account }});
      }
      if (type == 2 && row.work_id) {
        // this.$router.push({path:'/ticket-details',query:{workId:row.work_id}});
        this.$router.push({ path: '/counter-list',query: { workId: row.work_id }});
      }
    },
    popconfirm() {
      const that = this;
      that.$confirm(`确认${that.setIpName}吗？`, that.$t('sys_l013'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            let reqApi;
            const params = {}
            if (that.setIpType == 100) {
              reqApi = dobatchfastlogin;
            } else {
              const allPost = [dobatchlogout,doupgroup,dofreedip,dousestatus,dooutputaccount,dobatchdelaccount,doupremark,'','',doresetip]
              reqApi = allPost[that.setIpType]
            }
            that.setIpType != 9 ? params.accounts = that.checkAccount : '';
            instance.confirmButtonLoading = true;
            reqApi(params).then(res => {
              instance.confirmButtonLoading = false;
              if (res.code != 0) return;
              that.initNumberList();
              that.$refs.serveTable.clearSelection();
              if (that.setIpType == 4) {
                window.location.href = res.data.url
              }
              if (that.setIpType == 5) {
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
        that.$message({ type: 'info', message: that.$t('sys_c048') });
      })
    },
    submitSetBtn(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = {}
          // console.log(this.setIpType );
          this.ipForm.account ? params.accounts = [this.this.ipForm.account] : params.accounts = this.checkAccount;
          if (this.setIpType == 0) {
            params.expire_time = Date.parse(this.$baseFun.resetTime(this.ipForm.expire_time)) / 1000;
          } else if (this.setIpType == 1) {
            params.group_id = this.ipForm.group_id
          } else if (this.setIpType == 3) {
            params.use_status = this.ipForm.use_status
          } else if (this.setIpType == 8) {
            params.remark = this.ipForm.remock_text
          } else if (this.setIpType == 10) {
            params.country = this.ipForm.country
          } else if (this.setIpType == 99) {
            params.ip_category = this.ipForm.iptype[0];
            params.ip_type = this.ipForm.iptype[1] == 4 ? 1 : this.ipForm.iptype[1] == 6 ? 3 : 2;
            this.ipForm.iptype[0] == 1 ? params.country = this.ipForm.ip_id : params.ip_id = this.ipForm.ip_id;
          } else if (this.setIpType == 9) {
            delete params.account
          } else if (this.setIpType == 12) {
            params.ptype = this.ipForm.seat_type;
            params.users = this.ipForm.staffCheck;
            params.accounts = this.checkAccount;
          }
          let reqApi;
          this.isLoading = true;
          if (this.setIpType == 99) {
            reqApi = dobatchlogin;
          } else {
            const allPost = [dobatchlogout,doupgroup,dofreedip,dousestatus,dooutputaccount,dobatchdelaccount,'','',doupremark,'','','',distributecustomer]
            reqApi = allPost[this.setIpType]
          }
          reqApi(params).then(res => {
            this.isLoading = false;
            if (res.code != 0) return;
            this.setIpModel = false;
            if (this.setIpType == 1) {
              this.initNumberGroup();
            }
            this.initNumberList();
            this.$refs.serveTable.clearSelection();
            successTips(this)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addCloseBtn(idx) {
      this.blockType = idx;
      this.blockGroupList = [];
      this.blockAccountList = [];
      this.blockPramse.total = 0;
      this.blockPramse.offest = 1;
      this.blockPramse.group_id = '';
      this.blockTitle = this.blockOptions[idx];
      this.closeModel = true;
      await this.getBlockGroup();
      await this.getBlockAccount();
    },
    handleBlockChange(row) {
      this.blockCheckItem = row.map(item => { return item.id });
    },
    handleInheritChange(row) {
      this.inheritCheckItem = row.map(item => { return item.id });
    },
    delCloseBtn(type) {
      if (type == 1) {
        this.blockAccount = this.blockAccount.filter(item => !this.blockCheckItem.includes(item.id));
      } else {
        this.inheritAccount = this.inheritAccount.filter(item => !this.inheritCheckItem.includes(item.id));
      }
    },
    changeCloseGroup(row,idx) {
      this.titleGroupIdx = row ? row.id : '';
      this.blockPramse.group_id = row ? row.id : '';
      this.getBlockAccount();
    },
    async getBlockGroup() {
      this.blockGroupLoading = true;
      const { data } = await getinheritgrouplist({ ptype: this.blockType,page: 1,limit: 100 });
      this.blockGroupList = data.list || [];
      this.blockGroupLoading = false;
    },
    async getBlockAccount(num) {
      this.isBlockLoading = true;
      this.blockPramse.offest = num || this.blockPramse.offest;
      const params = {
        ptype: this.blockType,
        page: this.blockPramse.offest,
        limit: this.blockPramse.limit,
        group_id: this.blockPramse.group_id
      }
      const { data } = await getinheritaccountlist(params);
      this.isBlockLoading = false;
      this.blockPramse.total = data.total;
      this.blockAccountList = data.list || [];
      const checkAccount = this.blockType == 1 ? this.blockAccount : this.inheritAccount;
      if (checkAccount.length == 0) return;
      const accountArry = checkAccount.map(item => { return item.account });
      for (let i = 0; i < this.blockAccountList.length; i++) {
        if (accountArry.indexOf(this.blockAccountList[i].account) > -1) {
          this.$nextTick(() => {
            this.$refs.blockTable.toggleRowSelection(this.blockAccountList[i], true);
          })
        } else {
          this.$nextTick(() => {
            this.$refs.blockTable.toggleRowSelection(this.blockAccountList[i], false);
          })
        }
      }
    },
    blockSwitchPage(page) {
      this.blockPramse.offest = page;
      this.getBlockAccount()
    },
    blockPageSize(limit) {
      this.blockPramse.limit = limit;
      this.getBlockAccount()
    },
    dedupMethod(item1,item2) {
      let newArry;
      for (let k = 0; k < item2.length; k++) {
        if (item1.indexOf(item2[k].id) == -1) {
          newArry.push(item2[k])
        }
      }
      return newArry;
    },
    handleCloseChange(row) {
      this.blockCheckList = row.map(item => ({ id: item.id,account: item.account,staff_no: item.staff_no,group_name: item.group_name }));
    },
    addBlockBtn() {
      if (this.blockCheckList.length > 0 && this.blockType == 1) {
        this.blockAccount = [];
        this.blockAccount = this.blockCheckList;
      }
      if (this.blockCheckList.length > 0 && this.blockType == 2) {
        this.inheritAccount = [];
        this.inheritAccount = this.blockCheckList;
      }
      this.closeModel = false;
    },
    async submitBlockBtn() {
      const from_accounts = this.blockAccount.map(item => { return item.account });
      const to_accounts = this.inheritAccount.map(item => { return item.account });
      if (this.blockAccount.length != this.inheritAccount.length) {
        return successTips(this,'error',this.$t('sys_g114'));
      }
      const params = {
        from_accounts: from_accounts,
        to_accounts: to_accounts
      }
      // console.log(params);
      this.isLoading = true;
      const res = await doinherit(params);
      this.isLoading = false;
      if (res.code != 0) return;
      this.setIpModel = false;
      successTips(this,'',this.$t('sys_g113'))
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
      const sortMap = this.numberGroupList.map(item => { return item.id });
      const res = await sortgroup({ list: sortMap });
      if (res.code != 0) return;
    }
  }
}
</script>
<style scoped lang="scss">
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

  &>div {
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
.level_01{
  display: flex;
  color: #C0C4CC;
  align-items: center;
  width: max-content;
  padding: 0 15px;
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  .level_01_1{
    color: #606266;
    font-size: 13px;
    margin-left: 10px;
  }
  .screen_t_02{
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
  .down_01{
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
    .down_01_01{
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
    .down_01_01::after{
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
    }
  }
}
.level_01:hover{
  border-color: #C0C4CC;
}
.custom_popover{
  .screen_01{
    color: #209cdf;
    display: flex;
    .screen_t_01{
      display: flex;
      opacity: .7;
      align-items: center;
      cursor: pointer;
      i{
        margin-right: 5px;
      }
    }
    .screen_t_01:nth-child(1){
      margin-right: 20px;
    }
    .screen_t_01:hover{
      opacity: 1;
    }
  }
  .select_02{
    .el-icon-close{
      font-size: 14px;
      color: #f56c6c;
      font-weight: bold;
      cursor: pointer;
    }
  }
}
.level_01_01{
  width: 100%;
  display: flex;
  font-size: 12px;
  margin-bottom: 10px;
  .level_01_02{
    color: #409eff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    border-radius: 4px;
    width: max-content;
    margin-right: 10px;
    background-color: #ecf5ff;
    .el-icon-error{
      color: #409eff;
      font-size: 17px;
      cursor: pointer;
      margin-left: 10px;
    }
  }
}
::v-deep .el-form-item{
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
  .group_mian_hide{
    display: none;
  }
  .group_continer {
    width: 100%;
    overflow-x: auto;
  }
}
.group_tips{
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
        border: 1px solid #ebeef5;
      ;
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
.close_inherit, .add_inherit{
  display: flex;
  width: 100%;
  justify-content: center;
  .close_desc{
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
  .footer_btn{
    display: flex;
    margin-top: 20px;
    justify-content: center;
  }
}
.add_inherit{
  justify-content:space-between;
  .table_group{
    display: flex;
    flex-grow: 1;
    flex-direction: column;
  }
  .table_ele{
    width: 100%;
    height: 100%;
    // display: flex;
    flex-grow: 2;
    flex-direction: column;
    .tab_check_warp{
      margin: 12px 0 20px 10px;
    }
  }
}
.seat_class{
  border:1px solid #e0e0e0;
  padding: 10px;
  border-radius: 10px;
  .seat_item{
    display: flex;
    align-items: center;
    height: 28px;
    padding: 5px;
    color: #409eff;
    background: #ecf5ff;
    border-radius: 4px;
    border:1px solid #b3d8ff;
  }
}
.loading_icon{
  margin-top: 10px;
}
</style>
<style lang="scss">
.group_continer{
  .el-pagination{
    text-align: left !important;
  }
}
</style>
