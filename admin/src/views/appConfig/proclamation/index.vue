<!-- 公告 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
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
        @selection-change="handleSelectionChange"
        @row-click="rowSelectChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="内容" min-width="120" prop="content" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="primary" @click="openSeeFun(scope.row)">查看</el-button>
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
      :title="addModal.title"
      :visible.sync="addModal.show"
      center
      width="800px"
      @close="closeModal"
    >
      <el-form v-if="addModal.type==='see'" ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="100px" size="small">
        <el-form-item label="内容:" prop="content" style="width: 100%;max-height: 70vh;overflow-y: auto">
          <div style="max-height: 100%;border: 1px solid #dcdfe6;padding: 5px" v-html="addModal.formData.content" />
        </el-form-item>

      </el-form>
      <el-form v-else ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="100px" size="small">
        <el-form-item label="内容:" prop="content" style="width: 100%;">
          <Toolbar
            :editor="editorData.editor"
            :default-config="editorData.toolbarConfig"
            style="border: 1px solid #dcdfe6; border-bottom: none"
          />
          <Editor
            v-model="addModal.formData.content"
            :default-config="editorData.editorConfig"
            mode="default"
            style="border: 1px solid #dcdfe6; min-height: 300px;max-height: 70vh;overflow-y: auto"
            @onCreated="onEditorCreated"
          />
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
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

export default {
  name: 'AppConfigPage',
  components: {
    Editor,
    Toolbar
  },
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
        title: '',
        formData: {
          content: ''
        },
        rules: {
          content: [{ required: true, message: '请输入内容！', trigger: 'change' }],
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
      editorData: {
        editor: null,
        toolbarConfig: {
          toolbarKeys: [
            'headerSelect', // 标题
            'bold', // 加粗
            'italic', // 斜体
            'underline', // 下划线
            'through', // 删除线
            'color', // 字体颜色
            'bgColor', // 背景色
            'fontSize', // 字号
            'fontFamily', // 字体
            'lineHeight', // 行高

            'bulletedList', // 无序列表
            'numberedList', // 有序列表
            'todo', // 任务列表

            'justifyLeft', // 左对齐
            'justifyCenter', // 居中
            'justifyRight', // 右对齐
            'justifyJustify', // 两端对齐

            'indent', // 增加缩进
            'delIndent', // 减少缩进

            'emotion', // 表情
            'insertLink', // 插入链接
            'editLink', // 编辑链接
            'unLink', // 取消链接
            'viewLink', // 查看链接

            // 'insertImage',     // 插入网络图片
            // 'uploadImage',     // 上传图片

            // 'insertVideo',     // 插入视频
            // 'uploadVideo',     // 上传视频

            'blockquote', // 引用
            'codeBlock', // 代码块
            'divider', // 分割线

            // 'insertTable',     // 插入表格
            // 'deleteTable',     // 删除表格
            // 'insertTableRow',  // 插入表格行
            // 'deleteTableRow',  // 删除表格行
            // 'insertTableCol',  // 插入表格列
            // 'deleteTableCol',  // 删除表格列
            // 'tableHeader',     // 表头
            // 'tableFullWidth',  // 表格宽度

            'undo', // 撤销
            'redo', // 重做
            'fullScreen' // 全屏
          ]
        },
        editorConfig: {
          placeholder: '请输入内容...'
        }
      }
    }
  },
  watch: {
    'addModal.show'(val) {
      if (val) {
        this.$nextTick(() => {
          this.editorReady = true
        })
      } else {
        this.editorReady = false
      }
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
      this.addModal.title = '新增'
      this.addModal.show = true
    },
    // 编辑
    editOpenFun(row) {
      this.addModal.show = true
      this.addModal.type = 'edit'
      this.addModal.title = '编辑'
      this.addModal.formData = deepClone(row)
    },
    // 查看
    openSeeFun(row) {
      this.addModal.show = true
      this.addModal.type = 'see'
      this.addModal.title = '查看'
      this.addModal.formData = deepClone(row)
    },
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
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
        content: '',
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
    // 富文本编辑
    onEditorCreated(editor) {
      this.editorData.editor = editor
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
