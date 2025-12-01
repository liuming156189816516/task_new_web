<!-- 发布平台 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.title" clearable placeholder="请输入标题" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.platform" clearable filterable placeholder="请选择平台">
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="getDataListFun(1)">查询</el-button>
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
        <el-table-column label="标題" min-width="120" prop="title" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="平台" min-width="120" prop="platform" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], platformList)||'-' }}
          </template>
        </el-table-column>
        <el-table-column label="图标" min-width="120" prop="icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'icon')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="发布状态" min-width="120" prop="release_status" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'release_status')">
              <span :class="[Number(queryData.release_status)>0?'dropdown_title':'']" style="color:#909399"> 发布状态
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
            {{ getLabelByVal(scope.row[scope.column.property], releaseStatusList)||'-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ formatTimestamp(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="280">
          <template slot-scope="scope">
            <div v-if="scope.row.release_status==='1' || scope.row.release_status==='2'" class="action-btn">
              <el-button size="small" type="success" @click="changeReleaseStatusFun(scope.row,1)">发布</el-button>
            </div>
            <div v-if="scope.row.release_status==='3'" class="action-btn">
              <el-button size="small" type="primary" @click="changeReleaseStatusFun(scope.row,2)">下架</el-button>
            </div>
            <div class="action-btn" v-if="scope.row.release_status !=='3'">
              <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
            </div>
            <div class="action-btn">
              <el-button size="small" type="primary" @click.stop="detailsOpenFun(scope.row)">套餐</el-button>
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
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="100px" size="small">
        <el-form-item label="标题:" prop="title">
          <el-input v-model="addModal.formData.title" placeholder="请输入标题" @input="changeInput" />
        </el-form-item>
        <el-form-item label="平台:" prop="platform">
          <el-select v-model="addModal.formData.platform" clearable filterable placeholder="请选择平台">
            <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="图标:" prop="icon">
          <div v-if="addModal.formData.icon" class="imgBox">
            <el-image :src="addModal.formData.icon" style="width: 120px;height: 120px" />
            <i class="el-icon-delete icon_del" @click="delImgFun('icon')" />
          </div>
          <UploadFiles
            v-else
            ref="refUploadFiles"
            :format="['png','jpg','jpeg','webp']"
            :max-size="100"
            kay="icon"
            @uploadSuccess="uploadSuccess"
          />
        </el-form-item>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 套餐列表 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="detailModal.title"
      :visible.sync="detailModal.show"
      :width="detailModal.width"
      center
      @close="closeDetailModal"
    >
      <template v-if="detailModal.title ==='套餐'">
        <!-- 筛选条件 -->
        <el-form :inline="true" size="small" style="margin-top: 10px;">
          <el-form-item>
            <el-select v-model="detailModal.queryData.execution_type" clearable filterable placeholder="请选择执行类型">
              <el-option v-for="item in detailModal.executionTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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
          <el-table-column label="执行类型" min-width="120" prop="execution_type" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ getLabelByVal(scope.row[scope.column.property], detailModal.executionTypeList)||'-' }}
            </template>
          </el-table-column>
          <el-table-column label="折扣" min-width="120" prop="discount" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
          <el-table-column label="数量" min-width="120" prop="num" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
          <el-table-column label="扣除" min-width="120" prop="deduct" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
          <el-table-column label="实际扣除" min-width="120" prop="actual_deduction" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ formatTimestamp(scope.row.itime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="100" prop="operation" show-overflow-tooltip>
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

    <!-- 套餐 新建 编辑 -->
    <detailsAction ref="refDetailsAction" @updateDetailDataFun="updateDetailDataFun" />

    <!-- 图片预览 -->
    <ImagePreview ref="refImagePreview" v-model="imgData.show" :src="imgData.scr" />
  </div>
</template>

<script>
import {
  getDataApi,
  addDataApi,
  editDataApi,
  delDataApi,
  getDetailsListApi,
  delDetailsDataApi,
  editSortDataApi,
  editReleaseStatusApi
} from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import detailsAction from './components/detailsAction'
import ImagePreview from '@/components/ImagePreview'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { uploadFileApi } from '@/api/common';
import sortablejs from 'sortablejs';

export default {
  name: 'AppConfigPage',
  components: {
    detailsAction,
    ImagePreview,
    UploadFiles
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 1000,
        total: 0,
        title: '',
        platform: '',
        release_status: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          title: '',
          platform: '',
          icon: ''
        },
        rules: {
          title: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          platform: [{ required: true, message: '请选择平台！', trigger: 'change' }],
          icon: [{ required: true, message: '请上传图标！', trigger: 'change' }],
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
          execution_type: '',
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
        executionTypeList: [
          { label: 'Tiktok-Like', value: '1' },
          { label: 'Tiktok-Follow', value: '2' },
        ],

      },
      setBatchData: {
        show: false,
        title: '',
        type: -1,
        batchOption: [
          { icon: 'delete', label: '批量删除' },
        ],
      },
      platformList: [
        { label: '全部', value: '0' },
        { label: 'Tiktok', value: '1' },
        { label: 'Whatsapp', value: '2' },
        { label: 'Instagram', value: '3' },
      ],
      releaseStatusList: [
        { label: '全部', value: '0' },
        { label: '未发布', value: '1' },
        { label: '已下架', value: '2' },
        { label: '已发布', value: '3' },
      ],
      imgData: {
        show: false,
        scr: ''
      }
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
      const params = {
        page: num || this.queryData.page,
        limit: this.queryData.limit,
        title: this.queryData.title,
        platform: Number(this.queryData.platform),
        release_status: Number(this.queryData.release_status),
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.platform = item.platform ? String(item.platform) : ''
            item.release_status = item.release_status ? String(item.release_status) : ''
            return item
          });
        }
      })
    },
    // 表头筛选
    handleRowQueryFun(val,kay) {
      this.queryData[kay] = val;
      this.getDataListFun(1)
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
          formData.platform = Number(this.addModal.formData.platform)
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
        platform: '',
        icon: ''
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
    // 上传成功回调
    uploadSuccess(file, kay) {
      const formData = new FormData();
      formData.append('directory', 'publier');
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
    // 打开预览图片
    openImageViewFun(row, kay) {
      this.imgData.show = true
      this.imgData.scr = row[kay]
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
    // 打开套餐
    detailsOpenFun(row) {
      this.detailModal.show = true
      this.detailModal.title = '套餐'
      this.detailModal.cloneRow = deepClone(row)
      this.detailModal.width = '60%'
      this.getDetailsListFun(1)
    },
    // 关闭套餐列表
    closeDetailModal() {
      this.detailModal.show = false
      this.detailModal.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        execution_type: '',
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
    // 套餐列表
    getDetailsListFun(num) {
      this.$nextTick(() => {
        const tableBodyWrapper = this.$refs.detailTable.$el.querySelector('.el-table__body-wrapper');
        tableBodyWrapper.scrollTop = 0
      })
      this.detailModal.loading = true
      const params = {
        publier_app_id: this.detailModal.cloneRow.id,
        execution_type: Number(this.detailModal.queryData.execution_type),
        page: num || this.detailModal.queryData.page,
        limit: this.detailModal.queryData.limit,
      }
      getDetailsListApi(params).then(res => {
        if (res.msg === 'success') {
          this.detailModal.loading = false
          this.detailModal.data = res.data.list.map((item, index) => {
            item.execution_type = item.execution_type ? String(item.execution_type) : ''
            return item
          })
          this.detailModal.queryData.total = res.data.total
        }
      });
    },
    // 套餐 新增
    addDetailOpenFun() {
      this.$refs.refDetailsAction.open(null, 'add', this.detailModal.cloneRow)
    },
    // 套餐 编辑
    editDetailOpenFun(form) {
      this.$refs.refDetailsAction.open(form, 'edit', this.detailModal.cloneRow)
    },
    // 套餐 删除
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
    // 编辑 保存 套餐数据
    updateDetailDataFun() {
      this.$refs.refDetailsAction.closeModal()
      this.getDetailsListFun(1)
    },
    // 套餐列 筛选项
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
    // 套餐列 选择
    handleModalSelectionChange(arr) {
      this.detailModal.selectData = arr
      this.detailModal.selectIdData = arr.map(item => {
        return item.id
      })
    },
    // 套餐 单行 点击勾选
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
        tableCell.toggleRowSelection(row, false);
        return;
      }
      tableCell.toggleRowSelection(row, true);
    },
    // 重置
    restQueryBtn(type) {
      switch (type) {
        case 1:
          this.queryData = {
            page: 1,
            limit: 1000,
            total: 0,
            title: '',
            platform: '',
            release_status: '',
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
            execution_type: '',
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
</style>
