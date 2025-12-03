<!-- bug管理 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.bug_desc" size="small" clearable placeholder="请输入bug描述" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.type" clearable filterable placeholder="请选择类型">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.status" clearable filterable placeholder="请选择状态">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.developers" clearable filterable placeholder="请选择开发人员">
          <el-option v-for="item in developersList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.creator" clearable filterable placeholder="请选择创建者">
          <el-option v-for="item in creatorList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form :inline="true" size="small">
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
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @selection-change="handleSelectionChange"
        @row-click.self="rowSelectChange"
        @sort-change="handleSortChange"
      >
        <el-table-column label="序号" type="index" width="60" />

        <el-table-column label="bug描述" min-width="120" prop="bug_desc">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="类型" min-width="120" prop="type" sortable="custom">
          <!--
          <template slot="header">
            <el-dropdown trigger="click" style="margin-right: 10px" @command="(val) => handleRowQueryFun(val,'type')">
              <span :class="[Number(queryData.type)>0?'dropdown_title':'']" style="color:#909399"> 类型
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in typeList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.type}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          -->
          <template slot-scope="scope">
            <span>{{ getLabelByVal(scope.row[scope.column.property], typeList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="120" prop="status" sortable="custom">
          <!--
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'status')">
              <span :class="[Number(queryData.status)>0?'dropdown_title':'']" style="color:#909399"> 状态
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in statusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          -->
          <template slot-scope="scope">
            <el-dropdown placement="bottom" @command="changeStatusFun($event,scope.row)">
              <el-tag effect="dark" style="border: none;cursor: pointer" :color="getLabelByVal(scope.row[scope.column.property], statusList,{ value: 'value', label: 'color' })">
                {{ getLabelByVal(scope.row[scope.column.property], statusList) }}
                <i class="el-icon-arrow-down el-icon&#45;&#45;right" />
              </el-tag>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item,index) in statusList" :key="index" :command="item.value">{{ item.label }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

            <span />
          </template>
        </el-table-column>
        <el-table-column label="开发人员" min-width="120" prop="developers" sortable="custom">
          <!--
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'developers')">
              <span :class="[Number(queryData.developers)>0?'dropdown_title':'']" style="color:#909399"> 开发人员
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in developersList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.developers}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          -->
          <template slot-scope="scope">
            <span>{{ getLabelByVal(scope.row[scope.column.property], developersList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建者" min-width="120" prop="creator" sortable="custom">
          <!--
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'creator')">
              <span :class="[Number(queryData.creator)>0?'dropdown_title':'']" style="color:#909399"> 创建者
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in creatorList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.creator}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          -->
          <template slot-scope="scope">
            <span>{{ getLabelByVal(scope.row[scope.column.property], creatorList) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row[scope.column.property]) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间" min-width="120" prop="ptime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row[scope.column.property]) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="210">
          <template slot-scope="scope">
            <div v-if="scope.row.release_status!=='3'" class="action-btn">
              <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
            </div>
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
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="bug描述:" prop="bug_desc">
          <el-input v-model="addModal.formData.bug_desc" placeholder="请输入bug描述" @input="changeInput" />
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select v-model="addModal.formData.type" clearable filterable placeholder="请选择类型:">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="addModal.formData.status" clearable filterable placeholder="请选择状态:">
            <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开发人员:" prop="developers">
          <el-select v-model="addModal.formData.developers" clearable filterable placeholder="请选择开发人员">
            <el-option v-for="item in developersList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建者:" prop="creator">
          <el-select v-model="addModal.formData.creator" clearable filterable placeholder="请选择创建者">
            <el-option v-for="item in creatorList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import {
  getDataApi,
  addDataApi,
  editDataApi,
  delDataApi,
} from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'AppConfigPage',
  components: {

  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        bug_desc: '',
        type: '',
        status: '',
        developers: '',
        creator: '',
        sort: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          bug_desc: '',
          type: '',
          status: '',
          developers: '',
          creator: '',
        },
        rules: {
          bug_desc: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          type: [{ required: true, message: '请选择类型！', trigger: 'change' }],
          status: [{ required: true, message: '请选择状态！', trigger: 'change' }],
          developers: [{ required: true, message: '请选择开发人员！', trigger: 'change' }],
          creator: [{ required: true, message: '请选择创建者！', trigger: 'change' }],
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
      typeList: [
        { label: '全部',value: '0' },
        { label: '前端',value: '1' },
        { label: '后端',value: '2' },
        { label: 'app',value: '3' },
      ],
      statusList: [
        { label: '全部',value: '0' },
        { label: '待解决',value: '1' ,color: '#E6A23C' },
        { label: '解决中',value: '2' ,color: '#409EFF' },
        { label: '已解决',value: '3' ,color: '#67C23A' },
        { label: '已完成',value: '4' ,color: '#909399' },
        { label: '备忘',value: '5' ,color: '#DCDFE6' },
      ],
      developersList: [
        { label: '全部',value: '0' },
        { label: '富',value: '1' },
        { label: '亮',value: '2' },
        { label: '明',value: '3' },
        { label: '杜',value: '4' },
        { label: '莫',value: '5' },
        { label: '薰',value: '6' },
      ],
      creatorList: [
        { label: '全部',value: '0' },
        { label: '富',value: '1' },
        { label: '亮',value: '2' },
        { label: '明',value: '3' },
        { label: '杜',value: '4' },
        { label: '莫',value: '5' },
        { label: '薰',value: '6' },
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
        bug_desc: this.queryData.title,
        type: Number(this.queryData.type),
        status: Number(this.queryData.status),
        developers: Number(this.queryData.developers),
        creator: Number(this.queryData.creator),
        sort: this.queryData.sort,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.type = item.type ? String(item.type) : ''
            item.status = item.status ? String(item.status) : ''
            item.developers = item.developers ? String(item.developers) : ''
            item.creator = item.creator ? String(item.creator) : ''
            return item
          })
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
    // 编辑 状态
    changeStatusFun(val,row) {
      const formData = deepClone(row)
      formData.type = formData.type ? Number(formData.type) : 0
      formData.status = val ? Number(val) : 0
      formData.developers = formData.developers ? Number(formData.developers) : 0
      formData.creator = formData.creator ? Number(formData.creator) : 0
      editDataApi(formData).then(res => {
        if (res.msg === 'success') {
          successTips(this, 'success', '编辑成功！')
          this.getDataListFun()
        }
      })
    },
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.type = formData.type ? Number(formData.type) : 0
          formData.status = formData.status ? Number(formData.status) : 0
          formData.developers = formData.developers ? Number(formData.developers) : 0
          formData.creator = formData.creator ? Number(formData.creator) : 0
          if (this.addModal.type === 'add') {
            addDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '保存成功！')
                this.closeModal()
                this.getDataListFun()
              }
            })
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
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      this.addModal.isLoading = false
      this.$refs.refAddModal.resetFields();
      this.addModal.formData = {
        bug_desc: '',
        type: '',
        status: '',
        developers: '',
        creator: '',
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
    // 筛选项
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') { // 下降 = 倒序
        this.queryData.sort = '-' + prop
        /*
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = '-' + prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = '-' + prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = '-' + prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = '-' + prop
            break;
        }
        */
      } else if (order === 'ascending') { // 上升 = 正序
        this.queryData.sort = prop
        /*
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = prop
            break;
        }
         */
      } else {
        this.queryData.sort = ''
      }
      this.getDataListFun()
    },
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        bug_desc: '',
        type: '',
        status: '',
        developers: '',
        creator: '',
        sort: '',
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
