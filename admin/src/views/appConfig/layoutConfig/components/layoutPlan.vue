<!-- 布局方案 -->
<template>
  <div class="layoutPlan">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="pageModal.show"
      center
      title="布局方案"
      width="60%"
      @close="closePageModal"
    >
      <!-- 筛选条件 -->
      <el-form :inline="true" size="small" style="margin-top: 10px;">
        <el-form-item>
          <el-input v-model="pageModal.queryData.name" clearable placeholder="请输入名称" @input="changeInput" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary" @click="getLayoutPlanDataFun(1)">查询</el-button>
          <el-button icon="el-icon-refresh-right" @click="restQueryBtn(1)">重置</el-button>
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
          v-loading="pageModal.loading"
          :data="pageModal.tableData"
          :height="500"
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
          <el-table-column label="方案名称" min-width="120" prop="name" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="备注" min-width="200" prop="remark" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ $time(scope.row[scope.column.property]) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="operation" show-overflow-tooltip width="120">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="pageModal.queryData.page"
            :page-size="pageModal.queryData.limit"
            :page-sizes="pageOption"
            :total="pageModal.queryData.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="changePageSize($event,'table')"
            @current-change="changePageCurrent($event,'table')"
          />
        </div>
      </div>
    </el-dialog>

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
        <el-form-item label="方案名称:" prop="name">
          <el-input v-model="addModal.formData.name" placeholder="请输入方案名称" @input="changeInput" />
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
import {
  getLayoutPlanDataApi,
  addLayoutPlanDataApi,
  editLayoutPlanDataApi,
  delLayoutPlanDataApi,
} from '../api'
import { deepClone, resetPage, successTips } from '@/utils';
import { formatTimestamp } from '@/filters'

export default {
  name: 'LayoutPlan',
  data() {
    return {
      pageOption: resetPage(),
      pageModal: {
        show: false,
        queryData: {
          page: 1,
          limit: 10,
          total: 0,
          name: '',
        },
        tableData: [],
        selectData: [], // 选择列表
        selectIdData: [], // 选择列表id
        loading: false,
      },
      addModal: {
        show: false,
        type: 'add',
        formData: {
          name: '',
          remark: '',
        },
        rules: {
          name: [{ required: true, message: '请输入方案名称！', trigger: 'change' }],
        },
        isLoading: false,
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
  methods: {
    open() {
      this.pageModal.show = true
      this.getLayoutPlanDataFun()
    },
    // 列表
    getLayoutPlanDataFun(num) {
      this.$nextTick(() => {
        const tableBodyWrapper = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper');
        tableBodyWrapper.scrollTop = 0
      })
      this.loading = true;
      this.pageModal.queryData.page = num || this.pageModal.queryData.page;
      const params = {
        page: this.pageModal.queryData.page,
        limit: this.pageModal.queryData.limit,
        name: this.pageModal.queryData.name,
      }
      getLayoutPlanDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.pageModal.queryData.total = res.data.total;
          this.pageModal.tableData = res.data.list.map(item => {
            return item
          });

        }
      })
    },
    // 重置
    restQueryBtn(type) {
      switch (type) {
        case 1:
          this.pageModal.queryData = {
            page: 1,
            limit: 10,
            total: 0,
            name: '',
          }
          this.selectIdData = [];
          this.getLayoutPlanDataFun(1)
          this.$refs.serveTable.clearSelection();
          break;
      }
    },
    // 批量操作
    handleCommand(command) {
      if (!this.pageModal.selectIdData.length) {
        return successTips(this, 'error', '请勾选要操作的列表');
      }
      this.setBatchData.type = command.idx
      if (command.item.label === '批量删除') {
        this.delDataFun()
      }
    },
    // 关闭页面
    closePageModal() {
      this.pageModal.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
      }
      this.pageModal.tableData = []
      this.pageModal.selectData = []
      this.pageModal.selectIdData = []
      this.pageModal.show = false
    },

    // 新建 打开
    addOpenFun() {
      this.addModal.show = true
      this.addModal.type = 'add'
    },
    // 编辑 打开
    editOpenFun(form) {
      this.addModal.type = 'edit'
      this.addModal.show = true
      this.addModal.formData = deepClone(form)
    },
    // 新建编辑保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          if (this.addModal.type === 'add') {
            addLayoutPlanDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '保存成功！')
                this.closeModal()
                this.getLayoutPlanDataFun()
               setTimeout(()=>{
                 this.$emit('updateData')
               },1500)
              }
            })
          } else if (this.addModal.type === 'edit') {
            editLayoutPlanDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '编辑成功！')
                this.closeModal()
                this.getLayoutPlanDataFun()
                setTimeout(()=>{
                  this.$emit('updateData')
                },1500)
              }
            })
          }
        }
      })
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
              ids: this.pageModal.selectIdData,// 要删除与的id集合
            }
            delLayoutPlanDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this)
                this.getLayoutPlanDataFun()
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
    // 关闭新建编辑弹窗
    closeModal() {
      this.addModal.show = false
      this.addModal.isLoading = false
      this.$refs.refAddModal.resetFields()
      this.addModal.formData = {
        name: '',
        remark: '',
      }
    },
    // 分页 切换
    changePageSize(val, type) {
      if (type === 'table') {
        this.pageModal.queryData.limit = val;
        this.getLayoutPlanDataFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 页码
    changePageCurrent(val, type) {
      if (type === 'table') {
        this.pageModal.queryData.page = val;
        this.getLayoutPlanDataFun();
      }
      // else if (type === 'modal') {
      //
      // }
    },
    // 选择项
    handleSelectionChange(arr) {
      this.pageModal.selectData = arr
      this.pageModal.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 单行点击
    rowSelectChange(row) {
      const tableCell = this.$refs.serveTable;
      if (this.pageModal.selectIdData.includes(row.id)) {
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },

    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp
  }
}
</script>

<style scoped>

</style>
