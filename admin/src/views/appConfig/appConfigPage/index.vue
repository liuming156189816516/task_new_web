<!-- App配置 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.name" clearable placeholder="请输入名称" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.schema" clearable placeholder="请输入版本" @input="changeInput" />
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
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="名称" min-width="120" prop="name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="版本" min-width="120" prop="schema" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="默认语言" min-width="120" prop="default_lang" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="ttl" min-width="120" prop="ttl" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="签名" min-width="120" prop="sig" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="120" prop="remark" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="静态资源" min-width="120" prop="assets_name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="主题" min-width="120" prop="theme_name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="国际化" min-width="120" prop="il8n_name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="布局方案" min-width="120" prop="layouts_plan_name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
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
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="100px" size="small">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addModal.formData.name" placeholder="请输入名称" @input="changeInput" />
        </el-form-item>
        <el-form-item v-if="addModal.type ==='add'" label="版本:" prop="schema">
          <el-input v-model="addModal.formData.schema" placeholder="请输入版本" @input="changeInput" />
        </el-form-item>
        <el-form-item v-if="addModal.type ==='add'" label="默认语言:" prop="default_lang">
          <el-input v-model="addModal.formData.default_lang" placeholder="请输入默认语言" @input="changeInput" />
        </el-form-item>
        <el-form-item label="ttl:" prop="ttl">
          <el-input v-model="addModal.formData.ttl" placeholder="请输入ttl" type="number" @input="changeInput" />
        </el-form-item>
        <el-form-item label="静态资源:" prop="assets_id">
          <el-select v-model="addModal.formData.assets_id" clearable filterable placeholder="请选择静态资源">
            <el-option v-for="item in assetsList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="主题:" prop="theme_id">
          <el-select v-model="addModal.formData.theme_id" clearable filterable placeholder="请选择主题">
            <el-option v-for="item in themeList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="国际化:" prop="il8n_id">
          <el-select v-model="addModal.formData.il8n_id" clearable filterable placeholder="请选择国际化">
            <el-option v-for="item in il8nList" :key="item.id" :label="item.Name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="布局方案:" prop="layouts_plan_id">
          <el-select v-model="addModal.formData.layouts_plan_id" clearable filterable placeholder="请选择布局方案">
            <el-option v-for="item in layoutsList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="addModal.formData.remark" placeholder="请输入备注" @input="changeInput" />
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
import { getDataApi, addDataApi, editDataApi, delDataApi } from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import {
  getAppThemeDataApi,
  getInternationalizeDataApi,
  getLayoutPlanDataApi,
  getStaticResourcesDataApi
} from '../api';

export default {
  name: 'AppConfigPage',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        schema: '',
        name: '',
      },
      pageOption: resetPage(),
      formData: {},
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          name: '',
          schema: '',
          default_lang: '',
          ttl: '',
          remark: '',
          assets_id: '',
          theme_id: '',
          il8n_id: '',
          layouts_plan_id: '',
        },
        rules: {
          name: [{ required: true, message: '请输入名称！', trigger: 'change' }],
          schema: [{ required: true, message: '请输入版本！', trigger: 'change' }],
          default_lang: [{ required: true, message: '请输入默认语言！', trigger: 'change' }],
          ttl: [{ required: true, message: '请输入ttl！', trigger: 'change' }],
          remark: [{ required: false, message: '请输入备注！', trigger: 'change' }],
          assets_id: [{ required: true, message: '请选择静态资源！', trigger: 'change' }],
          theme_id: [{ required: true, message: '请选择主题！', trigger: 'change' }],
          il8n_id: [{ required: true, message: '请选择国际化！', trigger: 'change' }],
          layouts_plan_id: [{ required: true, message: '请选择布局方案！', trigger: 'change' }],
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
      assetsList: [],
      themeList: [],
      il8nList: [],
      layoutsList: [],
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
    this.getAppThemeDataFun()
    this.getInternationalizeDataFun()
    this.getStaticResourcesDataFun()
    this.getLayoutConfigDataFun()
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
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        schema: this.queryData.schema,
        name: this.queryData.name,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list.map(item => {
            return item
          });

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
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.ttl = formData.ttl ? Number(formData.ttl) : ''
          console.log('formData', formData)
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
                successTips(this, 'success', '編輯成功！')
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
      this.addModal.formData = {
        name: '',
        schema: '',
        default_lang: '',
        ttl: '',
        remark: '',
        assets_id: '',
        theme_id: '',
        il8n_id: '',
        layouts_plan_id: '',
      }
      this.$refs.refAddModal.resetFields();
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

    // 列表 App主题
    getAppThemeDataFun() {
      const params = {
        page: 1,
        limit: 1000,
      }
      getAppThemeDataApi(params).then(res => {
        if (res.msg === 'success') {
          if (res.data.list.length) {
            this.themeList = res.data.list
          }
        }
      })
    },
    // 列表 国际化
    getInternationalizeDataFun() {
      const params = {
        page: 1,
        limit: 1000,
      }
      getInternationalizeDataApi(params).then(res => {
        if (res.msg === 'success') {
          if (res.data.list.length) {
            this.il8nList = res.data.list
          }
        }
      })
    },
    // 列表 静态资源
    getStaticResourcesDataFun() {
      const params = {
        page: 1,
        limit: 1000,
      }
      getStaticResourcesDataApi(params).then(res => {
        if (res.msg === 'success') {
          if (res.data.list.length) {
            this.assetsList = res.data.list
          }
        }
      })
    },
    // 列表 布局方案
    getLayoutConfigDataFun() {
      const params = {
        page: 1,
        limit: 1000,
      }
      getLayoutPlanDataApi(params).then(res => {
        if (res.msg === 'success') {
          if (res.data.list.length) {
            this.layoutsList = res.data.list
          }
        }
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
      this.queryData.host = ''
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
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
</style>
