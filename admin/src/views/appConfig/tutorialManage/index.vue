<!-- 教程管理 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.name" size="small" clearable placeholder="请输入名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.locale" size="small" clearable placeholder="请输入语言" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.device_brand" size="small" clearable placeholder="请输入手机厂商" />
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
        row-key="id"
        show-body-overflow="title"
        style="width: 100%;"
        use-virtual
        @selection-change="handleSelectionChange"
        @row-click.self="rowSelectChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="序号" type="index" width="60" />
        <el-table-column label="名称" min-width="120" prop="name">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="语言" min-width="120" prop="locale">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="手机厂商" min-width="120" prop="device_brand">
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="任务类型" min-width="120" prop="task_type" show-overflow-tooltip>
          <template slot="header">
            <el-dropdown trigger="click" @command="(val) => handleRowQueryFun(val,'task_type')">
              <span :class="[Number(queryData.task_type)>0 ?'dropdown_title':'']" style="color:#909399"> 任务类型
                <i class="el-icon-arrow-down el-icon--right" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                  v-for="(item,index) in taskTypeList"
                  :key="index"
                  :class="{'dropdown_selected':item.value===queryData.task_type}"
                  :command="item.value"
                >{{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row[scope.column.property]!=='0'">
              {{ getLabelByVal(scope.row[scope.column.property], taskTypeList) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="教程视频" min-width="120" prop="url">
          <template slot-scope="scope">
            <span v-if="scope.row.url">
              <i class="el-icon-video-camera-solid file_content" @click.stop="openVideoFn(scope.row)" />
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="210">
          <template slot-scope="scope">
            <div v-if="scope.row.release_status!=='3'" class="action-btn">
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
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="addModal.formData.name" placeholder="请输入名称" @input="changeInput" />
        </el-form-item>
        <el-form-item label="语言:" prop="locale">
          <el-input v-model="addModal.formData.locale" placeholder="请输入语言" @input="changeInput" />
        </el-form-item>
        <el-form-item label="手机厂商:" prop="device_brand">
          <el-input v-model="addModal.formData.device_brand" placeholder="请输入手机厂商" @input="changeInput" />
        </el-form-item>
        <el-form-item label="任务类型:" prop="task_type">
          <el-select v-model="addModal.formData.task_type" clearable filterable placeholder="请选择任务类型">
            <el-option v-for="item in taskTypeList.filter(item => Number(item.value)>0)" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="教程视频:" prop="url">
          <UploadFiles ref="refUploadFiles" :max-size="1000" :format="['mp4']" :see-format="['mp4']" :default-file-list="videoFile" @uploadSuccess="uploadSuccess" @openVideoFn="openVideoFn" />
        </el-form-item>
        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 视频弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="videoModal.title"
      :visible.sync="videoModal.show"
      center
      style="border-radius: 20px"
      width="30%"
      @close="closeVideoModal"
    >
      <div class="video_content">
        <VideoPlayer
          ref="refVideoPlayer"
          :autoplay="false"
          :src="videoModal.url"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script >
import {
  getDataApi,
  addDataApi,
  editDataApi,
  delDataApi,
} from './api';
import { deepClone, resetPage, successTips, getLabelByVal } from '@/utils';
import { formatTimestamp ,getFileExtension } from '@/filters'
import UploadFiles from '@/components/UploadFiles/index'
import VideoPlayer from '@/components/VideoPlayer'
import { uploadFileApi } from '@/api/common';
export default {
  name: 'AppConfigPage',
  components: {
    UploadFiles,
    VideoPlayer
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
        locale: '',
        device_brand: '',
        task_type: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          name: '',
          locale: '',
          device_brand: '',
          task_type: '',
          url: '',
        },
        rules: {
          name: [{ required: true, message: '请输入名称！', trigger: 'change' }],
          locale: [{ required: true, message: '请输入语言！', trigger: 'change' }],
          device_brand: [{ required: true, message: '请输入手机厂商！', trigger: 'change' }],
          task_type: [{ required: true, message: '请选择任务类型！', trigger: 'change' }],
          url: [{ required: true, message: '请上传教程视频！', trigger: 'change' }],
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
      taskTypeList: [
        { label: '全部', value: '0' },
        { label: 'Tiktok-Like', value: '1' },
        { label: 'Tiktok-Follow', value: '2' },
        { label: 'Whatsapp-Send', value: '3' },
        { label: 'Sms-Send', value: '4' },
        { label: 'Whatsapp-Send-Auto', value: '7' },
        { label: 'Whatsapp-Group', value: '9' },

      ],
      videoModal: {
        title: '',
        show: false,
        url: ''
      },
      videoFile: []
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
      this.tableData = []
      this.queryData.page = num || this.queryData.page;
      const params = {
        page: this.queryData.page,
        limit: this.queryData.limit,
        name: this.queryData.name,
        locale: this.queryData.locale,
        device_brand: this.queryData.device_brand,
        task_type: Number(this.queryData.task_type),
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.task_type = item.task_type ? String(item.task_type) : ''
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
      this.videoFile = [
        { url: row.url,name: row.name }
      ]
      console.log('this.videoFile',this.videoFile)
    },
    // 上传成功回调
    uploadSuccess(file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('directory', 'tutorial');

      uploadFileApi(formData).then(res => {
        if (res.msg === 'success') {
          this.addModal.formData.url = res.data.url
          successTips(this, 'success', '上传成功！')
          this.$refs.refUploadFiles.uploadSuccessFun(this.addModal.formData)
        }
      })
    },
    // 关闭视频弹窗
    closeVideoModal() {
      this.videoModal.show = false
      this.videoModal.title = ''
      this.videoModal.url = ''
      this.$refs.refVideoPlayer.closePausePlay()
    },
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.task_type = formData.task_type ? Number(formData.task_type) : 0
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
    // 打开视频弹窗
    openVideoFn(row) {
      const suffixArr = ['mp4']
      const suffix = getFileExtension(row.url)
      if (suffixArr.includes(suffix)) {
        this.videoModal.show = true
        this.videoModal.title = row.name
        this.videoModal.url = row.url
      } else {
        successTips(this, 'error', '仅支持查看 .mp4 格式的视频')
      }
    },
    // 关闭新建
    closeModal() {
      this.addModal.show = false
      this.addModal.isLoading = false
      this.$refs.refAddModal.resetFields();
      this.$refs.refUploadFiles.resetFileFun();
      this.addModal.formData = {
        name: '',
        locale: '',
        device_brand: '',
        task_type: '',
        url: '',
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
    // 筛选项
    handleSortChange({ column, prop, order }) {
      if (order === 'descending') { // 下降 = 倒序
        this.queryData.sort = '-' + prop
        /*
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = '-' + prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = '-' + prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = '-' + prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = '-' + prop
            break;
        }
        */
      } else if (order === 'ascending') { // 上升 = 正序
        this.queryData.sort = prop
        /*
        switch (prop) {
          case 'consumption_num': // 消耗量
            this.queryData.sort = prop
            break;
          case 'exposure_num': // 曝光量
            this.queryData.sort = prop
            break;
          case 'click_num': // 点击量
            this.queryData.sort = prop
            break;
          case 'watch_rate': // 完播率
            this.queryData.sort = prop
            break;
        }
         */
      } else {
        this.queryData.sort = ''
      }
      this.getDataListFun()
    },
    // 重置
    restQueryBtn() {
      this.selectIdData = [];
      this.queryData = {
        page: 1,
        limit: 10,
        total: 0,
        name: '',
        locale: '',
        device_brand: '',
        task_type: '',
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

.videoBtn{
  color: #00a8ff;
  text-decoration: underline;
  cursor: pointer;
}

.file_content {
  cursor: pointer;
  color: #0a76a4;
  text-decoration: underline;
  font-size: 25px;
}
.video_content {
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

</style>
