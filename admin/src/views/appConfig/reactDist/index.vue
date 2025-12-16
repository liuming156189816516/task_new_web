<!-- React资源包 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-select v-model="queryData.os" clearable filterable placeholder="请选择Os">
          <el-option v-for="item in osList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.version" clearable placeholder="请输入版本" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.channel" clearable filterable placeholder="请选择渠道">
          <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column label="Os" min-width="120" prop="os" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], osList) }}
          </template>
        </el-table-column>
        <el-table-column label="版本" min-width="120" prop="version" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="最小支持版本" min-width="120" prop="min_version" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="渠道" min-width="120" prop="channel" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], channelList) }}
          </template>
        </el-table-column>
        <el-table-column label="资源包" min-width="120" prop="packageUrl" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]">
              <div v-if="['png','jpg','jpeg','webp'].includes(getImageExtension(scope.row[scope.column.property]))">
                <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" @click.stop="openImageViewFun(scope.row,'packageUrl')" />
              </div>
              <div v-else>
                <a :href="scope.row[scope.column.property]" class="aUnderline">文件</a>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="资源包的md5" min-width="150" prop="md5" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <!--
        <el-table-column label="补丁版本" min-width="120" prop="patch_version" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        -->
        <el-table-column label="补丁包" min-width="120" prop="patch_url" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]">
              <div v-if="['png','jpg','jpeg','webp'].includes(getImageExtension(scope.row[scope.column.property]))">
                <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" @click.stop="openImageViewFun(scope.row,'patch_url')" />
              </div>
              <div v-else>
                <a :href="scope.row[scope.column.property]" class="aUnderline">文件</a>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="补丁包的md5" min-width="150" prop="patch_md5" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ $time(scope.row.itime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="operation" show-overflow-tooltip width="210">
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
      width="500px"
      @close="closeModal"
    >
      <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="120px" size="small">
        <el-form-item label="Os:" prop="os">
          <el-select v-model="addModal.formData.os" clearable filterable placeholder="请选择Os">
            <el-option v-for="item in osList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="版本:" prop="version">
          <el-input v-model="addModal.formData.version" placeholder="请输入版本" @input="changeInput" />
        </el-form-item>
        <el-form-item label="最小支持版本:" prop="min_version">
          <el-input v-model="addModal.formData.min_version" type="number" placeholder="请输入最小支持版本" @input="changeInput" />
        </el-form-item>
        <el-form-item label="渠道:" prop="channel">
          <el-select v-model="addModal.formData.channel" clearable filterable placeholder="请选择渠道">
            <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="资源包:" prop="packageUrl">
          <div v-if="addModal.formData.packageUrl" class="imgBox">
            <div v-if="['png','jpg','jpeg','webp'].includes(getImageExtension(addModal.formData.packageUrl))">
              <el-image :src="addModal.formData.packageUrl" style="width: 120px;height: 120px" />
            </div>
            <div v-else>
              <a :href="addModal.formData.packageUrl" class="aUnderline">文件</a>
            </div>
            <i class="el-icon-delete icon_del" @click="delImgFun('packageUrl')" />
          </div>
          <UploadFiles
            v-else
            ref="refUploadFilespackageUrl"
            :format="['zip']"
            :max-size="100"
            kay="packageUrl"
            @uploadSuccess="uploadSuccess"
          />
        </el-form-item>
        <!--
        <el-form-item label="补丁版本:" prop="patch_version">
          <el-input v-model="addModal.formData.patch_version" placeholder="请输入补丁版本" @input="changeInput" />
        </el-form-item>
        -->
        <el-form-item label="补丁包:" prop="patch_url">
          <div v-if="addModal.formData.patch_url" class="imgBox">
            <div v-if="['png','jpg','jpeg','webp'].includes(getImageExtension(addModal.formData.patch_url))">
              <el-image :src="addModal.formData.patch_url" style="width: 120px;height: 120px" />
            </div>
            <div v-else>
              <a :href="addModal.formData.patch_url" class="aUnderline">文件</a>
            </div>
            <i class="el-icon-delete icon_del" @click="delImgFun('patch_url')" />
          </div>
          <UploadFiles
            v-else
            ref="refUploadFilespatch_url"
            :format="['zip']"
            :max-size="100"
            kay="patch_url"
            @uploadSuccess="uploadSuccess"
          />
        </el-form-item>

        <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
          <el-button @click="closeModal">取消</el-button>
          <el-button :loading="addModal.isLoading" type="primary" @click="addSubmit">确认</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 图片预览 -->
    <ImagePreview ref="refImagePreview" v-model="imgData.show" :src="imgData.scr" />
  </div>
</template>

<script>
import { getDataApi, addDataApi, editDataApi, delDataApi } from './api';
import { deepClone, resetPage, successTips, getLabelByVal,getImageExtension } from '@/utils';
import { formatTimestamp } from '@/filters'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import ImagePreview from '@/components/ImagePreview'
import { uploadFileApi } from '@/api/common';

export default {
  name: 'ReactDist',
  components: {
    UploadFiles,
    ImagePreview
  },
  data() {
    return {
      queryData: {
        page: 1,
        limit: 20,
        total: 0,
        os: '',
        version: '',
        channel: '',
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          os: '',
          version: '',
          channel: '',
          packageUrl: '',
          min_version: '',
          patch_version: '',
          patch_url: '',
        },
        rules: {
          os: [{ required: true, message: '请选择Os！', trigger: 'change' }],
          version: [{ required: true, message: '请输入版本！', trigger: 'change' }],
          min_version: [{ required: true, message: '请输入最小支持版本！', trigger: 'change' }],
          channel: [{ required: true, message: '请选择渠道！', trigger: 'change' }],
          packageUrl: [{ required: true, message: '请上传资源包！' }],
          patch_version: [{ required: false, message: '请输入补丁版本！', trigger: 'change' }],
          patch_url: [{ required: false, message: '请上补丁包！' }],
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
      osList: [
        { label: 'Android', value: '1' },
        { label: 'Ios', value: '2' },
      ],
      channelList: [
        { label: 'GooglePlay', value: '1' },
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
        os: Number(this.queryData.os),
        version: this.queryData.version,
        channel: Number(this.queryData.channel),
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.os = item.os ? String(item.os) : ''
            item.channel = item.channel ? String(item.channel) : ''
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
    // 新建 编辑 保存
    addSubmit() {
      this.$refs.refAddModal.validate((v) => {
        if (v) {
          this.addModal.isLoading = true
          const formData = deepClone(this.addModal.formData)
          formData.os = formData.os ? Number(formData.os) : 0
          formData.channel = formData.channel ? Number(formData.channel) : 0
          formData.min_version = formData.min_version ? Number(formData.min_version) : 0
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
      const refName = 'refUploadFiles' + kay
      const formData = new FormData();
      formData.append('directory', 'react-package');
      formData.append('file', file);
      uploadFileApi(formData).then(res => {
        if (res.msg === 'success') {
          this.addModal.formData[kay] = res.data.url
          successTips(this, 'success', '上传成功！')
          if (this.$refs.refUploadFiles) {
            this.$refs[refName].resetFileFun()
          }
        } else {
          this.$refs[refName].resetFileFun()
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
        os: '',
        version: '',
        channel: '',
        packageUrl: '',
        min_version: '',
        patch_version: '',
        patch_url: '',
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
      this.queryData = {
        page: 1,
        limit: 20,
        total: 0,
        os: '',
        version: '',
        channel: '',
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
    left: 130px;

    top: 50%;
    transform: translateY(-50%);
  }
}

.aUnderline{
  color: #00a8ff;
  text-decoration: underline;
}
</style>
