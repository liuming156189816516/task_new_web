<!-- 体现配置 -->
<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="modal.show"
      center
      class="actionModal"
      title="提现配置"
      width="1300px"
      @close="closeModal"
    >
      <div :style="{maxHeight:modalHeight-100+'px'}" class="content">
        <!-- 筛选条件 -->
        <el-form :inline="true" size="small" style="margin-top: 10px;">
          <el-form-item>
            <el-select v-model="queryData.country" clearable filterable placeholder="请选择国家">
              <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value" />
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
            :height="modalHeight -240"
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
            <el-table-column label="国家" min-width="120" prop="country" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ getLabelByVal(scope.row[scope.column.property], countryList) || '-' }}
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
            <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
              <template slot-scope="scope">
                {{ formatTimestamp(scope.row.itime) }}
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" prop="operation" show-overflow-tooltip width="240">
              <template slot-scope="scope">
                <div class="action-btn">
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
      </div>
      <div slot="footer" />
    </el-dialog>
    <!-- 添加 编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.type==='add'?'新建':'编辑'"
      :visible.sync="addModal.show"
      center
      class="action2Modal"
      width="600px"
      @close="closeAddModal"
    >
      <div :style="{maxHeight:cliHeight-100+'px'}" class="content">
        <el-form
          ref="refAddModal"
          :model="addModal.formData"
          :rules="addModal.rules"
          label-position="top"
          label-width="0"
          size="small"
        >
          <el-form-item v-if="addModal.type==='add'" label="国家:" prop="title">
            <el-select v-model="addModal.formData.country" clearable filterable placeholder="请选择国家">
              <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="addModal.type==='add'" label="key:" prop="key">
            <el-input v-model="addModal.formData.key" placeholder="请输入任务限制" @input="changeInput" />
          </el-form-item>
          <el-form-item label="value:" prop="value">
            <el-input v-model="addModal.formData.value" placeholder="请输入任务限制" @input="changeInput" />
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input v-model="addModal.formData.remark" placeholder="请输入备注" @input="changeInput" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <div class="el-item-bottom" style="text-align:center;">
          <el-button @click="closeAddModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone, getLabelByVal, resetPage, successTips } from '@/utils';
import { getDataApi, addDataApi, delDataApi, editDataApi, } from '../api';
import { formatTimestamp } from '@/filters'

export default {
  name: 'WithdrawConfig',
  props: {
    // 单个文件最大大小（MB）
    modalHeight: {
      type: Number,
      default: null
    },

  },
  data() {
    return {
      modal: {
        show: false,
      },
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        country: '',
      },
      pageOption: resetPage(),
      tableData: [],
      addModal: {
        show: false,
        type: 'add',
        formData: {
          country: '',
          key: '',
          value: '',
          remark: '',
        },
        rules: {
          country: [{ required: true, message: '请选择国家！', trigger: 'change' }],
          key: [{ required: true, message: '请输入key！', trigger: 'change' }],
          value: [{ required: true, message: '请输入value！', trigger: 'change' }],
          remark: [{ required: false, message: '请选择备注！', trigger: 'change' }],
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
      countryList: [
        { label: '全部',value: '' },
        { label: '巴西',value: 'BR' },
      ],
      categoryList: [
        { label: 'Hot', value: '1' },
        { label: 'Social', value: '2' },
        { label: 'Games', value: '3' },
        { label: 'Others', value: '4' },
      ],
      taskTypeList: [
        { label: 'tiktok-Like', value: '1' },
        { label: 'tiktok-follow', value: '2' },
        { label: 'Whatsapp-SendLocal', value: '3' },
        { label: 'Sms-SendLocal', value: '4' },
        { label: 'Whatsapp-SendGlobal', value: '5' },
        { label: 'Sms-SendGlobal', value: '6' },
      ],
      platformList: [
        { label: 'tiktok', value: '1' },
        { label: 'whatsapp', value: '2' },
        { label: 'instagram', value: '3' },
        { label: 'Sms', value: '4' },
      ],
      tagsList: [],
      releaseStatusList: [
        { label: '全部', value: '0', type: 'primary' },
        { label: '未发布', value: '1', type: 'primary' },
        { label: '已下架', value: '2', type: 'primary' },
        { label: '已发布', value: '3', type: 'success' },
      ],
      imgData: {
        show: false,
        scr: ''
      },
      isRecommendList: [
        { label: '否', value: '0' },
        { label: '是', value: '1' },

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
      titleList: []
    }
  },
  methods: {
    // 打开弹窗 体现配置
    open() {
      this.modal.show = true
      this.getDataListFun(1)
    },
    // 关闭 体现配置
    closeModal() {
      this.modal.show = false
      this.addModal.formData = {
        country: '',
        key: '',
        value: '',
        remark: '',
      }
    },
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
        country: this.queryData.country,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
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
    // 关闭新建
    closeAddModal() {
      this.addModal.show = false
      this.addModal.formData = {
        country: '',
        key: '',
        value: '',
        remark: '',
      }
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
                this.closeAddModal()
                this.getDataListFun()
              } else {
                this.addModal.isLoading = false
              }
            })
          } else if (this.addModal.type === 'edit') {
            editDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '編輯成功！')
                this.closeAddModal()
                this.getDataListFun()
              } else {
                this.addModal.isLoading = false
              }
            })
          }
        }
      })
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
      this.selectData = [];
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        country: '',
      }
      this.getDataListFun(1)
      this.$refs.serveTable.clearSelection();
    },
    // 表头筛选
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
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    getLabelByVal,
    formatTimestamp
  }
}
</script>

<style scoped lang="scss">
.action2Modal {
  ::v-deep .el-dialog__body {
    padding: 0;
  }

  .content {
    overflow: hidden;
    overflow-y: auto;
    padding: 16px;

  }

  .el-form {
    display: flex;
    align-items: self-start;
    //justify-content: space-between;
    flex-wrap: wrap;

    .el-form-item {
      width: 46%;
      margin-right: 20px;
    }
  }

}
</style>
