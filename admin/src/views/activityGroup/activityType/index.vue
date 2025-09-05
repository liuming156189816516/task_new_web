<!-- 活动类型 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.title" clearable placeholder="请输入主题" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.category" clearable filterable placeholder="请选择类别">
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
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
        row-key="ID"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="主题" min-width="120" prop="title" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="类别" min-width="120" prop="category" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], categoryList) }}
          </template>
        </el-table-column>
        <el-table-column label="发布状态" min-width="120" prop="release_status" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'release_status')">
              <span :class="[Number(queryData.release_status)?'dropdown_title':'']" style="color:#909399"> 发布状态
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in releaseStatusList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.release_status}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], releaseStatusList) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.release_status==='1' || scope.row.release_status==='2'" class="action-btn">
              <el-button size="small" type="success" @click="changeReleaseStatusFun(scope.row,1)">发布</el-button>
            </div>
            <div v-if="scope.row.release_status==='3'" class="action-btn">
              <el-button size="small" type="primary" @click="changeReleaseStatusFun(scope.row,2)">下架</el-button>
            </div>
            <div class="action-btn">
              <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="false" class="layui_page">
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
        <el-form-item label="主题:" prop="title">
          <el-input v-model="addModal.formData.title" placeholder="请输入主题" @input="changeInput" />
        </el-form-item>
        <el-form-item label="类别:" prop="category">
          <el-select v-model="addModal.formData.category" clearable filterable placeholder="请选择类别">
            <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
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
import { getDataApi, addDataApi, editDataApi, delDataApi ,editSortDataApi ,editReleaseStatusApi } from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import sortablejs from 'sortablejs';

export default {
  name: 'ActivityType',
  components: {
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 1000,
        total: 0,
        title: '',
        category: '',
        release_status: null,
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          title: '',
          category: '',
        },
        rules: {
          title: [{ required: true, message: '请输入主题！', trigger: 'change' }],
          category: [{ required: true, message: '请选择类别！', trigger: 'change' }],
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
      categoryList: [
        { label: 'all', value: 'all' },
        { label: 'limited', value: 'limited' },
        { label: 'newbie', value: 'newbie' },
        { label: 'hot', value: 'hot' },
      ],
      releaseStatusList: [
        { label: '全部', value: '0' ,type: 'primary' },
        { label: '未发布', value: '1' ,type: 'primary' },
        { label: '已下架', value: '2' ,type: 'primary' },
        { label: '已发布', value: '3' ,type: 'success' },
      ],
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
    this.initDragSortTableRow(); // 拖拽表格行排序
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
        title: this.queryData.title,
        category: this.queryData.category,
        release_status: Number(this.queryData.release_status),
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.release_status = item.release_status ? String(item.release_status) : ''
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
    // 修改发布
    changeReleaseStatusFun(form,val) {
      const massage = val === 2 ? '下架' : '发布'
      this.$confirm('确认' + massage + '吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: form.id,
          type: val
        }
        editReleaseStatusApi(params).then(res => {
          if (res.msg === 'success') {
            successTips(this, 'success', massage + '成功!')
            this.getDataListFun()
          }
        })
      }).catch(() => {

      });
    },
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          // formData.slot = formData.slot ? Number(formData.slot) : 0
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
      this.$refs.refAddModal.resetFields();
      this.addModal.formData = {
        title: '',
        category: '',
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
    // 拖拽
    initDragSortTableRow() {
      const el = this.$refs.serveTable.$el.querySelector('.el-table__body-wrapper tbody');
      sortablejs.create(el, {
        animation: 150,
        ghostClass: 'sortable-ghost',
        setData: (dataTransfer) => {
        },
        onEnd: ({ newIndex, oldIndex }) => {
          if (newIndex === oldIndex) return;
          let arr = deepClone(this.tableData)
          const movedItem = arr.splice(oldIndex, 1)[0];
          arr.splice(newIndex, 0, movedItem);
          arr = arr.map((item, index) => ({
            ...item,
            sort: index + 1,
          }));
          const arrID = arr.map((item, index) => {
            return item.id
          })
          editSortDataApi({ ids: arrID }).then(res => {
            if (res.msg === 'success') {
              this.getDataListFun()
            }
          })
        },
      });
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
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.queryData = {
        page: 1,
        limit: 1000,
        total: 0,
        title: '',
        category: '',
        release_status: null,
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
