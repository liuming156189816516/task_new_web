<!-- 国际化 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.Name" clearable placeholder="请输入名称" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.strategy" clearable placeholder="请输入strategy" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.version" clearable placeholder="请输入版本" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataListFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form size="small" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown trigger="click" @command="(command)=>{handleCommand(command)}">
          <el-button type="primary"> {{ $t('sys_g018') }}
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, idx) in setBatchData.batchOption" v-show="item.label" :key="idx" :command="{item,idx}">
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
        row-key="id"
        use-virtual
        border
        :height="cliHeight"
        element-loading-spinner="el-icon-loading"
        style="width: 100%;"
        show-body-overflow="title"
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column label="名称" min-width="120" prop="Name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="strategy" min-width="120" prop="strategy" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="版本" min-width="200" prop="version" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="默认语言" min-width="200" prop="default_lang" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="FallbackStrategy" min-width="200" prop="fallback_strategy" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Notes" min-width="200" prop="notes" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="200" prop="remark" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="itime" label="创建时间" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="editOpenFun(scope.row)">编辑</el-button>
            <el-button type="primary" size="small" @click.stop="detailsOpenFun(scope.row)">详情</el-button>
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
      :title="addModal.type==='add'?'新建':'编辑'"
      center
      :visible.sync="addModal.show"
      :close-on-click-modal="false"
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" size="small" :model="addModal.formData" label-width="150px" :rules="addModal.rules">
        <el-form-item label="名称:" prop="Name">
          <el-input v-model="addModal.formData.Name" placeholder="请输入名称" @input="changeInput" />
        </el-form-item>
        <el-form-item label="strategy:" prop="strategy">
          <el-input v-model="addModal.formData.strategy" placeholder="请输入strategy" @input="changeInput" />
        </el-form-item>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="addModal.formData.version" placeholder="请输入版本" @input="changeInput" />
        </el-form-item>
        <el-form-item label="默认语言:" prop="default_lang">
          <el-input v-model="addModal.formData.default_lang" placeholder="请输入默认语言" @input="changeInput" />
        </el-form-item>
        <el-form-item label="FallbackStrategy:" prop="fallback_strategy">
          <el-input v-model="addModal.formData.fallback_strategy" placeholder="请输入FallbackStrategy" @input="changeInput" />
        </el-form-item>
        <el-form-item label="Notes:" prop="notes">
          <el-input v-model="addModal.formData.notes" placeholder="请输入Notes" @input="changeInput" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="addModal.formData.remark" placeholder="请输入remark" @input="changeInput" />
        </el-form-item>
        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 详情列表 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="detailModal.title"
      :visible.sync="detailModal.show"
      :width="detailModal.width"
      center
      @close="closeDetailModal"
    >
      <template v-if="detailModal.title ==='详情'">
        <!-- 筛选条件 -->
        <el-form :inline="true" size="small" style="margin-top: 10px;">
          <el-form-item>
            <el-input v-model="detailModal.queryData.Lang" clearable placeholder="请输入语言" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="detailModal.queryData.category" clearable placeholder="请输入类别" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getDetailsListFun(1)">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="restQueryBtn(2)">重置</el-button>
          </el-form-item>
        </el-form>
        <!--  新建 -->
        <el-form :inline="true" size="small">
          <el-form-item>
            <el-button type="primary" @click="addDetailOpenFun">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-dropdown trigger="click" @command="(command)=>{handleDetailCommand(command)}">
              <el-button type="primary"> {{ $t('sys_g018') }}
                <i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item, idx) in detailModal.setBatchData.batchOption"
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
        <el-table
          ref="detailTable"
          v-loading="detailModal.loading"
          :data="detailModal.data"
          :height="500"
          border
          element-loading-spinner="el-icon-loading"
          row-key="id"
          show-body-overflow="title"
          style="width: 100%;"
          @selection-change="handleModalSelectionChange"
          @sort-change="handleSortChange"
          @row-click="rowModalSelectChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="序号" type="index" width="60" />
          <el-table-column label="语言" min-width="120" prop="Lang" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="类别" min-width="120" prop="category" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="key" min-width="120" prop="Key" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="value" min-width="120" prop="Value" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.itime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="operation" show-overflow-tooltip min-width="100">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click.stop="editDetailOpenFun(scope.row)">编辑</el-button>
            </template>
          </el-table-column>

        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="detailModal.queryData.page"
            :page-size="detailModal.queryData.limit"
            :page-sizes="pageOption"
            :total="detailModal.queryData.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize($event,'modal')"
            @current-change="changePageCurrent($event,'modal')"
          />
        </div>
      </template>
    </el-dialog>
    <!-- 详情 新建 编辑 -->
    <detailsAction ref="refDetailsAction" @updateDetailDataFun="updateDetailDataFun" />
  </div>
</template>

<script>
import { getDataApi, addDataApi , editDataApi, delDataApi ,getDetailsListApi,delDetailsDataApi } from './api';
import { deepClone, resetPage, successTips,getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import detailsAction from './components/detailsAction'

export default {
  name: 'AppConfigPage',
  components: {
    detailsAction
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        strategy: '',
        name: '',
        version: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          Name: '',
          strategy: '',
          version: '',
          default_lang: '',
          fallback_strategy: '',
          notes: '',
          remark: '',
        },
        rules: {
          Name: [{ required: true, message: '请输入名称！', trigger: 'change' }],
          strategy: [{ required: true, message: '请输入strategy！', trigger: 'change' }],
          version: [{ required: true, message: '请输入版本！', trigger: 'change' }],
          default_lang: [{ required: true, message: '请输入默认语言！', trigger: 'change' }],
          fallback_strategy: [{ required: true, message: '请输入FallbackStrategy！', trigger: 'change' }],
          notes: [{ required: true, message: '请输入Notes！', trigger: 'change' }],
        },
        isLoading: false,
      },
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      detailModal: {
        show: false,
        loading: false,
        title: '',
        width: '',
        cloneRow: {},
        queryData: {
          page: 1,
          limit: 10,
          total: 0,
          Lang: '',
          category: '',
        },
        data: [],
        selectData: [],
        selectIdData: [],
        stateData: {},
        statusLoading: false,
        setBatchData: {
          show: false,
          title: '',
          type: -1,
          batchOption: [
            { icon: 'delete', label: '批量删除' },
          ],
        },
      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        batchOption: [
          { icon: 'delete', label: '批量删除' },
        ],
      },
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
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        strategy: this.queryData.strategy,
        Name: this.queryData.Name,
        version: this.queryData.version,
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
        Name: '',
        strategy: '',
        version: '',
        default_lang: '',
        fallback_strategy: '',
        notes: '',
        remark: '',
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

    // 打开详情
    detailsOpenFun(row) {
      this.detailModal.show = true
      this.detailModal.title = '详情'
      this.detailModal.cloneRow = deepClone(row)
      this.detailModal.width = '60%'
      this.getDetailsListFun(1)
    },
    // 关闭详情列表
    closeDetailModal() {
      this.detailModal.show = false
      this.detailModal.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        assets_id: '',
        category: '',
        key: '',
        value: '',
      }
      this.detailModal.title = ''
      if (this.$refs.detailTable) {
        this.$refs.detailTable.clearSort()
      }
    },
    // 批量操作
    handleDetailCommand(command) {
      if (!this.detailModal.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.detailModal.setBatchData.type = command.idx
      if (command.item.label === '批量删除') {
        this.delDetailDataFun()
      }
    },
    // 详情列表
    getDetailsListFun(num) {
      this.$nextTick(() => {
        const tableBodyWrapper = this.$refs.detailTable.$el.querySelector('.el-table__body-wrapper');
        tableBodyWrapper.scrollTop = 0
      })
      this.detailModal.loading = true
      const params = {
        il8n_id: this.detailModal.cloneRow.id,
        Lang: this.detailModal.queryData.Lang,
        category: this.detailModal.queryData.category,
        page: num || this.detailModal.queryData.page,
        limit: this.detailModal.queryData.limit,

      }
      getDetailsListApi(params).then(res => {
        if (res.msg === 'success') {
          this.detailModal.loading = false
          this.detailModal.data = res.data.list.map((item, index) => {
            // item.key = item.key = ? String(item.key =) : ''
            return item
          })
          this.detailModal.queryData.total = res.data.total

        }
      });
    },
    // 详情 新增
    addDetailOpenFun() {
      this.$refs.refDetailsAction.open(null,'add',this.detailModal.cloneRow)
    },
    // 详情 编辑
    editDetailOpenFun(form) {
      this.$refs.refDetailsAction.open(form,'edit',this.detailModal.cloneRow)
    },
    // 详情 删除
    delDetailDataFun() {
      this.$confirm(`确认删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ids: this.detailModal.selectIdData,// 要删除与的id集合
            }
            delDetailsDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getDetailsListFun()
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
    // 编辑 保存 详情数据
    updateDetailDataFun() {
      this.$refs.refDetailsAction.closeModal()
      this.getDetailsListFun(1)
    },
    // 详情列 筛选项
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') { // 下降 倒序
        switch (prop) {
          case 'key': // 消耗量
            this.detailModal.queryData.sort = '-' + prop
            break;
        }
      } else if (order === 'ascending') { // 上升 = 正序
        switch (prop) {
          case 'key': // 消耗量
            this.detailModal.queryData.sort = prop
            break;
        }
      } else {
        this.detailModal.queryData.sort = ''
      }
      this.getDetailsListFun()
    },
    // 详情列 选择
    handleModalSelectionChange(arr) {
      this.detailModal.selectData = arr
      this.detailModal.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 详情 单行 点击勾选
    rowModalSelectChange(row, column, event) {
      const tableCell = this.$refs.detailTable;
      if (this.detailModal.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
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
        tableCell.toggleRowSelection(row,false);
        return;
      }
      tableCell.toggleRowSelection(row,true);
    },
    // 重置
    restQueryBtn(type) {
      switch (type) {
        case 1:
          this.queryData = {
            page: 1,
            limit: 10,
            total: 0,
            strategy: '',
            Name: '',
            version: '',
          }
          this.selectIdData = [];
          this.getDataListFun(1)
          this.$refs.serveTable.clearSelection();
          break;

        case 2:
          this.detailModal.queryData = {
            page: 1,
            limit: 10,
            total: 0,
            assets_id: '',
            category: '',
            key: '',
            value: '',
          }
          this.getDetailsListFun(1)
          this.$refs.detailTable.clearSelection();
          break;
      }
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.queryData.limit = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.limit = val;
        this.getDetailsListFun();
      }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.queryData.page = val;
        this.getDataListFun();
      } else if (type === 'modal') {
        this.detailModal.queryData.page = val;
        this.getDetailsListFun();
      }
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

<style scoped lang="scss">
.bt-l-8{
  margin-left: 8px
}
.del:hover{
  color: rgba(255, 0, 0, .8);
  border-color: #dcdfe6;
  background-color: transparent;
}
</style>
