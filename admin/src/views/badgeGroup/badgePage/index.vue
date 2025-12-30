<!-- 徽章管理 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-input v-model="queryData.level" clearable placeholder="请输入等级" type="number" @input="changeInput" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="queryData.tar_points" clearable placeholder="请输入目标积分" type="number" @input="changeInput" />
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
        <el-table-column label="等级" min-width="120" prop="level" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="目标积分" min-width="120" prop="tar_points" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="升级奖励" min-width="120" prop="reward_points" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] }}
          </template>
        </el-table-column>
        <el-table-column label="徽章图标" min-width="120" prop="badge_icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'badge_icon')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="头像上的图标" min-width="120" prop="avatar_coin" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'avatar_coin')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="120" prop="itime" show-overflow-tooltip>
          <template slot-scope="scope">
             {{ scope.row[scope.column.property]?$time(scope.row[scope.column.property]):"-" }}
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
      :title="addModal.type==='add'?'新建':'编辑'"
      :visible.sync="addModal.show"
      center
      width="500px"
      class="actionModal"
      @close="closeModal"
    >
      <div class="content" :style="{maxHeight:cliHeight-100+'px'}">
        <el-form ref="refAddModal" :model="addModal.formData" :rules="addModal.rules" label-width="0" size="small" label-position="top">
          <el-form-item label="等级:" prop="level">
            <el-input v-model="addModal.formData.level" placeholder="请输入等级" type="number" @input="changeInput" />
          </el-form-item>
          <el-form-item label="目标积分:" prop="tar_points">
            <el-input v-model="addModal.formData.tar_points" placeholder="请输入目标积分" type="number" @input="changeInput" />
          </el-form-item>
          <el-form-item label="升级奖励:" prop="reward_points">
            <el-input v-model="addModal.formData.reward_points" placeholder="请输入升级奖励" type="number" @input="changeInput" />
          </el-form-item>
          <el-form-item label="徽章图标:" prop="badge_icon">
            <div v-if="addModal.formData.badge_icon" class="imgBox">
              <el-image :src="addModal.formData.badge_icon" style="width: 120px;height: 120px" />
              <i class="el-icon-delete icon_del" @click="delImgFun('badge_icon')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp']"
              :max-size="100"
              kay="badge_icon"
              @uploadSuccess="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="头像上的图标:" prop="avatar_coin">
            <div v-if="addModal.formData.avatar_coin" class="imgBox">
              <el-image :src="addModal.formData.avatar_coin" style="width: 120px;height: 120px" />
              <i class="el-icon-delete icon_del" @click="delImgFun('avatar_coin')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp']"
              :max-size="100"
              kay="avatar_coin"
              @uploadSuccess="uploadSuccess"
            />
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
import { getDataApi, addDataApi, editDataApi, delDataApi } from './api';

import { deepClone, resetPage, successTips, getLabelByVal,getLabelArrByVal } from '@/utils';
import { formatTimestamp } from '@/filters'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import ImagePreview from '@/components/ImagePreview'
import { uploadFileApi } from '@/api/common';

export default {
  name: 'BadgePage',
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
        level: null,
        tar_points: null,
      },
      pageOption: resetPage(),
      tableData: [],
      cliHeight: null,
      addModal: {
        show: false,
        type: 'add',
        formData: {
          level: null,
          badge_icon: '',
          avatar_coin: '',
          tar_points: null,
          reward_points: null,
        },
        rules: {
          level: [
            { required: true, message: '请输入等级！', trigger: 'change' },
            {
              required: true, validator: (rule, value, callback) => {
                const reg = /^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/
                if (reg.test(value)) {
                  callback()
                } else {
                  return callback(new Error('请输入大于0的数！'))
                }
              }, trigger: 'change'
            },
          ],
          badge_icon: [
            { required: true, message: '请上传徽章图标！', trigger: 'change' },
          ],
          avatar_coin: [{ required: true, message: '请上传头像上的图标！', trigger: 'change' }],
          tar_points: [
            { required: true, message: '请输入目标积分！', trigger: 'change' },
            {
              required: true, validator: (rule, value, callback) => {
                const reg = /^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/
                if (reg.test(value)) {
                  callback()
                } else {
                  return callback(new Error('请输入大于0的数！'))
                }
              }, trigger: 'change'
            },
          ],
          reward_points: [
            { required: true, message: '请输入升级奖励！', trigger: 'change' },
            {
              required: true, validator: (rule, value, callback) => {
                const reg = /^(?:0(?:\.\d+)?|[1-9]\d*(?:\.\d+)?)$/
                if (reg.test(value)) {
                  callback()
                } else {
                  return callback(new Error('请输入大于0的数！'))
                }
              }, trigger: 'change'
            },
          ],
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
        level: Number(this.queryData.level) || -1,
        tar_points: Number(this.queryData.tar_points) || -1,
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          this.tableData = deepClone(res.data.list)
        } else {
          this.loading = false;
          this.tableData = []
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
          formData.level = formData.level ? Number(formData.level) : 0
          formData.tar_points = formData.tar_points ? Number(formData.tar_points) : 0
          formData.reward_points = formData.reward_points ? Number(formData.reward_points) : 0
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
      formData.append('directory', 'badge');
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
        level: null,
        badge_icon: '',
        avatar_coin: '',
        tar_points: null,
        reward_points: null,
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
        limit: 20,
        total: 0,
        level: null,
        tar_points: null,
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

.actionModal{
 ::v-deep .el-dialog__body{
    padding: 0;
  }
.content{
  overflow: hidden;
  overflow-y: auto;
  padding: 16px;

}
  .el-form{
    //display: flex;
    //align-items: self-start;
    //justify-content:space-between;
    //flex-wrap: wrap;
    .el-form-item{
      //width: 48%;
    }
    .item_100{
      //width: 100%;
      //margin-top: 20px;
    }
}

}
</style>
