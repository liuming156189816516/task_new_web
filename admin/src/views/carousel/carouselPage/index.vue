<!-- 轮播图 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form size="small" :inline="true" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.title" clearable placeholder="请输入主题" @input="changeInput" />
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
        row-key="ID"
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
        <el-table-column label="跳转类型" min-width="120" prop="deep_type" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], deepTypeList) }}
          </template>
        </el-table-column>
        <el-table-column label="跳转地址" min-width="120" prop="deeplink" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="正常展示" min-width="120" prop="img" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="深色展示" min-width="120" prop="img_dark" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px" />
            </div>
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
        <el-form-item label="主题:" prop="title">
          <el-input v-model="addModal.formData.title" placeholder="请输入主题" @input="changeInput" />
        </el-form-item>
        <el-form-item label="类别:" prop="category">
          <el-select v-model="addModal.formData.category" clearable filterable placeholder="请选择类别">
            <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转类型:" prop="deep_type">
          <el-select v-model="addModal.formData.deep_type" clearable filterable placeholder="请选择跳转类型">
            <el-option v-for="item in deepTypeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="跳转地址:" prop="deeplink">
          <el-input v-model="addModal.formData.deeplink" placeholder="请输入跳转地址" @input="changeInput" />
        </el-form-item>
        <el-form-item label="正常展示:" prop="img">
          <div v-if="addModal.formData.img" class="imgBox">
            <el-image :src="addModal.formData.img" style="width: 120px;height: 120px" />
            <i class="el-icon-delete icon_del" @click="delImgFun('img')" />
          </div>
          <UploadFiles v-else ref="refUploadFiles" :format="['png','jpg','jpeg','webp']" :max-size="100" kay="img" @uploadSuccess="uploadSuccess" />
        </el-form-item>
        <el-form-item label="深色展示:" prop="img_dark">
          <div v-if="addModal.formData.img_dark" class="imgBox">
            <el-image :src="addModal.formData.img_dark" style="width: 120px;height: 120px" />
            <i class="el-icon-delete icon_del" @click="delImgFun('img_dark')" />
          </div>
          <UploadFiles v-else ref="refUploadFiles" :format="['png','jpg','jpeg','webp']" :max-size="100" kay="img_dark" @uploadSuccess="uploadSuccess" />
        </el-form-item>
        <el-form-item label="排序:" prop="slot">
          <el-input v-model="addModal.formData.slot" type="number" placeholder="请输入排序" @input="changeInput" />
        </el-form-item>

        <el-form-item label-width="0" style="text-align:center;" class="el-item-bottom">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getDataApi, addDataApi , editDataApi, delDataApi } from './api';
import { deepClone, resetPage, successTips,getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { uploadFileApi } from '@/api/common';
import sortablejs from 'sortablejs';

export default {
  name: 'AppConfigPage',
  components: {
    UploadFiles
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        title: '',
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
          deep_type: '',
          deeplink: '',
          img: '',
          img_dark: '',
          slot: '',
        },
        rules: {
          title: [{ required: true, message: '请输入主题！', trigger: 'change' }],
          category: [{ required: true, message: '请选择类别！', trigger: 'change' }],
          deep_type: [{ required: true, message: '请选择跳转类型！', trigger: 'change' }],
          deeplink: [{ required: true, message: '请输入跳转地址！', trigger: 'change' }],
          img: [{ required: true, message: '请上传图片！', trigger: 'change' }],
          img_dark: [{ required: true, message: '请上传图片！', trigger: 'change' }],
          slot: [{ required: true, message: '请输入排序！', trigger: 'change' }],
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
        { label: '首页',value: '1' },
        { label: '活动',value: '2' },
      ],
      deepTypeList: [
        { label: '内部跳转',value: 'nav' },
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
      this.loading = true;
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        name: this.queryData.name,
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
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.slot = formData.slot ? Number(formData.slot) : 0
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
    // 上传成功回调
    uploadSuccess(file,kay) {
      const formData = new FormData();
      formData.append('directory', 'carousel');
      formData.append('file', file);
      uploadFileApi(formData).then(res => {
        if (res.msg === 'success') {
          this.addModal.formData[kay] = res.data.url
          successTips(this, 'success', '上传成功！')
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
      this.addModal.formData = {
        name: '',
        json_str: '',
        remark: '',
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
    // 选择项
    handleSelectionChange(arr) {
      this.selectData = arr
      this.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 拖拽
    initDragSortTableRow() {
      const el = this.$refs.serveTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0];
      sortablejs.create(el, {
        ghostClass: 'ghostClass', // 定义拖拽的时候接触到的行样式
        setData: (dataTransfer) => {
          dataTransfer.setData('test', '1');
          console.log('dataTransfer',dataTransfer)
        },
        onEnd: (e) => {
          console.log('e',e)
          // this.$g.array.moveArrayElement(this.tableData, e.oldIndex, e.newIndex); // 修改数组的顺序
          // console.log(e.originalEvent.dataTransfer.getData('自定义传参字段'));
        },
      });
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

<style scoped lang="scss">
.bt-l-8{
  margin-left: 8px
}
.del:hover{
  color: rgba(255, 0, 0, .8);
  border-color: #dcdfe6;
  background-color: transparent;
}
.imgBox{
  position: relative;
  .icon_del{
    cursor: pointer;
    color: red;
    position: absolute;
    font-size: 22px;
    left: 130px;
    top: 38%;
  }
}
</style>
