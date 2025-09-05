<!-- 活动列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.title" clearable placeholder="请输入主题" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.categories_id" clearable filterable placeholder="请选择活动类型">
          <el-option v-for="item in categoriesList" :key="item.id" :label="item.title" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.category" clearable filterable placeholder="请选择类别">
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.release_status" clearable filterable placeholder="请选择发布状态">
          <el-option v-for="item in releaseStatusList" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column label="活动类型" min-width="120" prop="categories_title" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="类别" min-width="120" prop="category" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], categoryList) }}
          </template>
        </el-table-column>
        <el-table-column label="活动图标" min-width="120" prop="activitie_icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'activitie_icon')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="描述" min-width="120" prop="desc" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="增加积分" min-width="120" prop="reward" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="跳转地址" min-width="120" prop="deeplink" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="发布状态" min-width="120" prop="release_status" show-overflow-tooltip>
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
      class="actionModal"
      width="1000px"
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
          <el-form-item label="主题:" prop="title">
            <el-input v-model="addModal.formData.title" placeholder="请输入主题" @input="changeInput" />
          </el-form-item>
          <el-form-item label="活动类型:" prop="categories_id">
            <el-select v-model="addModal.formData.categories_id" clearable filterable placeholder="请选择活动类型">
              <el-option v-for="item in categoriesList" :key="item.id" :label="item.title" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动图标:" prop="activitie_icon">
            <div v-if="addModal.formData.activitie_icon" class="imgBox">
              <el-image :src="addModal.formData.activitie_icon" style="width: 120px;height: 120px" />
              <i class="el-icon-delete icon_del" @click="delImgFun('activitie_icon')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp']"
              :max-size="100"
              kay="activitie_icon"
              @uploadSuccess="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="描述:" prop="desc">
            <el-input v-model="addModal.formData.desc" placeholder="请输入描述" @input="changeInput" />
          </el-form-item>
          <el-form-item label="增加积分:" prop="reward">
            <el-input v-model="addModal.formData.reward" type="number" placeholder="请输入增加积分" @input="changeInput" />
          </el-form-item>
          <el-form-item label="跳转地址:" prop="deeplink">
            <el-input v-model="addModal.formData.deeplink" placeholder="请输入跳转地址" @input="changeInput" />
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

    <!-- 图片预览 -->
    <ImagePreview ref="refImagePreview" v-model="imgData.show" :src="imgData.scr" />
  </div>
</template>

<script>
import { getDataApi, addDataApi, editDataApi, delDataApi, editSortDataApi ,editReleaseStatusApi } from './api';
import { getDataApi as getCategoriesListApi } from '@/views/activityGroup/activityType/api/index.js';

import { deepClone, resetPage, successTips, getLabelByVal, getLabelArrByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import ImagePreview from '@/components/ImagePreview'
import { uploadFileApi } from '@/api/common';
import sortablejs from 'sortablejs';

export default {
  name: 'AppConfigPage',
  components: {
    UploadFiles,
    ImagePreview
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 1000,
        total: 0,
        title: '',
        category: '',
        categories_id: '',
        release_status: null,
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          categories_id: '',
          activitie_icon: '',
          title: '',
          desc: '',
          reward: '',
          deeplink: '',
        },
        rules: {
          categories_id: [{ required: true, message: '请选择活动类型！', trigger: 'change' }],
          activitie_icon: [{ required: true, message: '请上传活动图标！', trigger: 'change' }],
          title: [{ required: true, message: '请输入主题！', trigger: 'change' }],
          desc: [{ required: true, message: '请输入描述！', trigger: 'change' }],
          reward: [{ required: true, message: '请输入增加积分！', trigger: 'change' }],
          deeplink: [{ required: true, message: '请输入跳转地址！', trigger: 'change' }],
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
        { label: '未发布', value: '1' ,type: 'primary' },
        { label: '已下架', value: '2' ,type: 'primary' },
        { label: '已发布', value: '3' ,type: 'success' },
      ],
      categoriesList: [],
      imgData: {
        show: false,
        scr: ''
      }
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.setFullHeight();
    this.getCategoriesListFun()
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
        categories_id: this.queryData.categories_id,
        release_status: Number(this.queryData.release_status) || 0,
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
    uploadSuccess(file, kay) {
      const formData = new FormData();
      formData.append('directory', 'activity');
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
      this.selectData = [];
      this.queryData = {
        page: 1,
        limit: 1000,
        total: 0,
        title: '',
        category: '',
        categories_id: '',
        release_status: null,
      }
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
    // 获取活动类型
    getCategoriesListFun() {
      const params = {
        page: 1,
        limit: 1000,
      }
      getCategoriesListApi(params).then(res => {
        if (res.msg === 'success') {
          this.categoriesList = res.data.list
        }
      })
    },
    // 打开预览图片
    openImageViewFun(row, kay) {
      this.imgData.show = true
      this.imgData.scr = row[kay]
    },
    // 处理打开输入框无法输入问题
    changeInput() {
      this.$forceUpdate()
    },
    formatTimestamp,
    getLabelByVal,
    getLabelArrByVal

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
      width: 48%;
    }

    .item_100 {
      width: 100%;
      margin-top: 20px;
    }
  }

}
</style>
