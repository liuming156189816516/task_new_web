<!-- 静态资源 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.name" clearable placeholder="请输入名称" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.cdn_main" clearable placeholder="请输入主域名" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.cdn_minor" clearable placeholder="请输入副域名" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.version" clearable placeholder="请输入版本" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getDataListFun(1)">查询</el-button>
        <el-button icon="el-icon-refresh-right" @click="restQueryBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!--  新建 -->
    <el-form size="small" :inline="true">
      <el-form-item>
        <el-button type="primary" @click="addOpenFun">添加</el-button>
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
        <el-table-column label="名称" min-width="120" prop="name" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="主域名" min-width="120" prop="cdn_main" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="副域名" min-width="120" prop="cdn_minor" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="版本" min-width="120" prop="version" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="itime" label="创建时间" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" width="210" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click.stop="detailsOpenFun(scope.row)">详情</el-button>
            <el-button type="primary" size="small" class="bt-l-8" @click.stop="editOpenFun(scope.row)">编辑</el-button>
            <el-button size="small" class="bt-l-8 del" @click.stop="delDataFun(scope.row)">编辑</el-button>
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
      <el-form ref="refAddModal" size="small" :model="addModal.formData" label-width="100px" :rules="addModal.rules">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addModal.formData.name" placeholder="请输入名称" @input="changeInput" />
        </el-form-item>
        <el-form-item label="主域名:" prop="cdn_main">
          <el-input v-model="addModal.formData.cdn_main" placeholder="请输入主域名" @input="changeInput" />
        </el-form-item>
        <el-form-item label="副域名:" prop="cdn_minor">
          <el-input v-model="addModal.formData.cdn_minor" placeholder="请输入副域名" @input="changeInput" />
        </el-form-item>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="addModal.formData.version" placeholder="请输入版本" @input="changeInput" />
        </el-form-item>

        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="submitFormFun">确认</el-button>
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
            <el-input v-model="detailModal.queryData.category" clearable placeholder="请输入类别" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="detailModal.queryData.key" clearable placeholder="请输入key" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="detailModal.queryData.value" clearable placeholder="请输入value" @input="changeInput" />
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getDetailsListFun(1)">查询</el-button>
            <el-button icon="el-icon-refresh-right" @click="restQueryBtn(2)">重置</el-button>
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
          <el-table-column label="类别" min-width="120" prop="category" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="key" min-width="120" prop="key" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="value" min-width="120" prop="value" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="120" prop="remark" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="100" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.itime) }}
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

  </div>
</template>

<script>
import { getDataApi, addDataApi, editDataApi, delDataApi, getDetailsListApi } from './api';
import { deepClone, resetPage, successTips,getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'StaticResources',
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
        cdn_main: '',
        cdn_minor: '',
        version: '',
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
          cdn_main: '',
          cdn_minor: '',
          version: '',
        },
        rules: {
          name: [{ required: true, message: '请输入名称！', trigger: 'change' }],
          cdn_main: [{ required: true, message: '请输入主域名！', trigger: 'change' }],
          cdn_minor: [{ required: true, message: '请输入副域名！', trigger: 'change' }],
          version: [{ required: true, message: '请输入版本！', trigger: 'change' }],
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
          assets_id: '',
          category: '',
          key: '',
          value: '',
        },
        data: [],
        statusList: [
          { label: '全部', value: '0', },
          // { label: '待绑卡', value: '1', },
          // { label: '绑卡中', value: '2', },
          { label: '待上传视频', value: '3', },
          { label: '视频上传中', value: '4', },
          { label: '待检查视频', value: '5', },
          { label: '视频检查中', value: '6', },
          { label: '待创建标签', value: '7', },
          { label: '创建标签中', value: '8', },
          // { label: '待充值', value: '9', },
          // { label: '充值中', value: '10', },
          { label: '待下单', value: '11', },
          { label: '下单中', value: '12', },
          { label: '任务关闭', value: '13', },
          { label: '下单成功', value: '14', },
          { label: '投放中', value: '15', },
          { label: '投放完成', value: '16', },
        ],
        selectData: [],
        selectIdData: [],
        stateData: {},
        batchDetailOption: [
          { icon: 'lock', label: '批量关闭' },
        ],
        launchStatusList: [
          { label: '全部', value: '0', },
          { label: '正常', value: '1', },
          { label: '异常', value: '2', },
          // { label: '待关闭', value: '3', },
          // { label: '已关闭', value: '4', },
        ],
        isCloseList: [
          { label: '全部', value: '0', },
          { label: '否', value: '1', },
          { label: '是', value: '2', },
        ],
        statusLoading: false
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
      this.loading = true;
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        name: this.queryData.name,
        cdn_main: this.queryData.cdn_main,
        cdn_minor: this.queryData.cdn_minor,
        version: this.queryData.version,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = res.data.list.map(item => {
            return item
          });
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
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
    // 新建 编辑 保存
    submitFormFun() {
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
        cdn_main: '',
        cdn_minor: '',
        version: '',
      }
      this.$refs.refAddModal.resetFields();
    },
    // 删除
    delDataFun(form) {
      this.$confirm(`确认删除吗？`, '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            const formData = {
              ids: [form.id],// 要删除与的id集合
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
    // 详情列表
    getDetailsListFun(num) {
      this.detailModal.loading = true
      const params = {
        assets_id: this.detailModal.cloneRow.id,
        category: this.detailModal.queryData.category,
        key: this.detailModal.queryData.key,
        value: this.detailModal.queryData.value,
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
          this.$nextTick(() => {
            const tableBodyWrapper = this.$refs.detailTable.$el.querySelector('.el-table__body-wrapper');
            tableBodyWrapper.scrollTop = 0
          })
        }
      });
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
        tableCell.toggleRowSelection(row,false);
        return;
      }
      tableCell.toggleRowSelection(row,true);
    },
    // 重置
    restQueryBtn(type) {
      switch (type) {
        case 1:
          this.selectIdData = [];
          this.getDataListFun(1)
          this.queryData = {
            page: 1,
            limit: 10,
            total: 0,
            name: '',
            cdn_main: '',
            cdn_minor: '',
            version: '',
          }
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
