<!-- 规则配置 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.title" clearable placeholder="请输入标题" @input="changeInput" />
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
          <el-button type="primary">批量操作
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
        <el-table-column label="标题" min-width="120" prop="title" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="规则类型" min-width="120" prop="type" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'type')">
              <span :class="[Number(queryData.type)>0?'dropdown_title':'']" style="color:#909399"> 规则类型
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
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], typeList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="内容类型" min-width="120" prop="content_type" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], contentTypeList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="内容" min-width="120" prop="content">
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]">
              <div v-if="scope.row.content_type==='1'">
                <el-tooltip class="item" effect="dark" :content="getLabelByVal(scope.row[scope.column.property], contentList)" placement="top">
                  <span>{{ getLabelByVal(scope.row[scope.column.property], contentList) }}</span>
                </el-tooltip>
              </div>
              <div v-if="scope.row.content_type==='2'">
                <a :href="scope.row[scope.column.property]" class="aUnderline">文件</a>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $time(scope.row[scope.column.property]) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" prop="operation" show-overflow-tooltip width="180">
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
    <!-- 添加 编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="addModal.type==='add'?'新建':'编辑'"
      :visible.sync="addModal.show"
      center
      class="actionModal"
      width="600px"
      @close="closeModal"
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
          <el-form-item label="标题:" prop="title">
            <el-input v-model="addModal.formData.title" placeholder="请输入标题" @input="changeInput" />
          </el-form-item>
          <el-form-item label="规则类型:" prop="type">
            <el-select v-model="addModal.formData.type" clearable filterable placeholder="请选择规则类型">
              <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="内容:" prop="content">
            <el-select v-model="addModal.formData.content" clearable filterable placeholder="请选择内容">
              <el-option v-for="item in contentList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <div class="el-item-bottom" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, addDataApi, editDataApi, delDataApi } from './api';

import { deepClone, resetPage, successTips, getLabelByVal, getLabelArrByVal , getImageExtension } from '@/utils';
import { formatTimestamp, getLanguagePageList } from '@/filters'
import { getLanguagePageListApi, uploadFileApi } from '@/api/common';

export default {
  name: 'RulePage',
  components: {
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        title: '',
        type: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          title: '',
          type: '',
          content_type: '1',
          content: '',
        },
        rules: {
          title: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          type: [{ required: true, message: '请选择规则类型！', trigger: 'change' }],
          content_type: [{ required: true, message: '请选择内容类型！', trigger: 'change' }],
          content: [{ required: true, message: '请输入内容！', trigger: 'change' }],
        },
        isLoading: false,
      },
      typeList: [
        { label: '全部', value: '0' },
        { label: '收益规则', value: '1' },
      ],
      contentTypeList: [
        { label: '文本', value: '1' },
        { label: '视频', value: '2' },
      ],
      selectData: [], // 选择列表
      selectIdData: [], // 选择列表id
      loading: false,
      languageList: [
        { label: 'en', value: 'en' },
        { label: 'pt', value: 'pt' },
      ],
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        batchOption: [
          { icon: 'delete', label: '批量删除' },
        ],
      },
      contentList: []

    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
    this.getLanguagePageListFun()
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
        title: this.queryData.title,
        type: Number(this.queryData.type),
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.type = item.type ? String(item.type) : ''
            item.content_type = item.content_type ? String(item.content_type) : ''
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
    // 编辑类型
    changeTypeFun(val) {
      this.addModal.formData.content = ''
    },
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.type = formData.type ? Number(formData.type) : 0
          formData.content_type = formData.content_type ? Number(formData.content_type) : 0
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
    // 上传成功回调
    uploadSuccess(file, kay) {
      const formData = new FormData();
      formData.append('directory', 'language');
      formData.append('file', file);
      uploadFileApi(formData).then(res => {
        if (res.msg === 'success') {
          this.addModal.formData[kay] = res.data.url
          successTips(this, 'success', '上传成功！')
          if (this.$refs.refUploadFiles) {
            this.$refs.refUploadFiles.resetFileFun()
          }
        }
      })
    },
    // 删除图片
    delImgFun(kay) {
      this.addModal.formData[kay] = ''
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      this.addModal.isLoading = false
      this.$refs.refAddModal.resetFields();
      this.addModal.formData = {
        title: '',
        type: '',
        content_type: '1',
        content: '',
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
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.selectData = [];
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        title: '',
        type: '',
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
    // 获取国际化
    getLanguagePageListFun() {
      getLanguagePageListApi({}).then(res => {
        if (res.msg === 'success') {
          const kay = 'server.rules'
          this.contentList = getLanguagePageList(res.data.content,kay)
        }
      })
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp,
    getLabelByVal,
    getLabelArrByVal,
    getImageExtension

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
    left: 50px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.actionModal {
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
    justify-content: space-between;
    flex-wrap: wrap;

    .el-form-item {
      width: 47%;
      margin-right: 10px;
    }
  }

}

.aUnderline {
  color: #00a8ff;
  text-decoration: underline;
}
</style>
