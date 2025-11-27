<!-- 任务列表 -->
<template>
  <div style="width:100%;height: 100%; float: left; position: relative;">
    <!-- 筛选条件 -->
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-select v-model="queryData.title" clearable filterable placeholder="请选择标题">
          <el-option v-for="item in titleList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.category" clearable filterable placeholder="请选择任务分类">
          <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.platform" clearable filterable placeholder="请选择平台">
          <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryData.task_type" clearable filterable placeholder="请选择任务类型">
          <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value" />
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
        <el-table-column label="标题" min-width="120" prop="title">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row[scope.column.property]" class="item" effect="dark" placement="top">
              <span>{{ getLabelByVal(scope.row[scope.column.property], titleList) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="任务分类" min-width="120" prop="category" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], categoryList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="平台" min-width="120" prop="platform" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], platformList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="任务类型" min-width="180" prop="task_type" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], taskTypeList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="任务图标" min-width="120" prop="task_icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'task_icon')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="任务图标上的右下角图标" min-width="120" prop="one_icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'one_icon')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="任务右上角图标" min-width="120" prop="two_icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]">
              <div v-if="['png','jpg','jpeg','webp'].includes(getImageExtension(scope.row[scope.column.property]))">
                <el-image
                  :src="scope.row[scope.column.property]"
                  style="width: 80px;height: 30px;cursor: pointer;"
                  @click.stop="openImageViewFun(scope.row,'two_icon')"
                />
              </div>
              <div v-else>
                <a :href="scope.row[scope.column.property]" class="aUnderline">文件</a>
              </div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="任务左下角图标" min-width="120" prop="three_icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'three_icon')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="任务中间的积分图标" min-width="120" prop="points_icon" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-if="scope.row[scope.column.property]" @click.stop="openImageViewFun(scope.row,'points_icon')">
              <el-image :src="scope.row[scope.column.property]" style="width: 80px;height: 30px;cursor: pointer;" />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="增加积分" min-width="120" prop="reward" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row[scope.column.property] ? scope.row[scope.column.property] : '-' }}
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" min-width="120" prop="is_recommend" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ getLabelByVal(scope.row[scope.column.property], isRecommendList) || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="标签" min-width="120" prop="tags" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row[scope.column.property].join(',')"
              class="item"
              effect="dark"
              placement="top"
            >
              <el-tag>
                {{ getLabelArrByVal(scope.row[scope.column.property], tagsList) }}
              </el-tag>
            </el-tooltip>
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
            {{ getLabelByVal(scope.row[scope.column.property], releaseStatusList) }}
          </template>
        </el-table-column>
        <el-table-column label="跳转地址" min-width="120" prop="deeplink" show-overflow-tooltip>
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
            <div v-if="scope.row.release_status==='1' || scope.row.release_status==='2'" class="action-btn">
              <el-button size="small" type="success" @click="changeReleaseStatusFun(scope.row,1)">发布</el-button>
            </div>
            <div v-if="scope.row.release_status==='3'" class="action-btn">
              <el-button size="small" type="primary" @click="changeReleaseStatusFun(scope.row,2)">下架</el-button>
            </div>
            <div v-if="scope.row.release_status !=='3'" class="action-btn">
              <el-button size="small" type="primary" @click.stop="editOpenFun(scope.row)">编辑</el-button>
            </div>
            <div class="action-btn">
              <el-button size="small" type="primary" @click.stop="confOpenFun(scope.row)">配置</el-button>
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
          <el-form-item label="标题:" prop="title">
            <el-select v-model="addModal.formData.title" clearable filterable placeholder="请选择标题">
              <el-option v-for="item in titleList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务分类:" prop="category">
            <el-select v-model="addModal.formData.category" clearable filterable placeholder="请选择任务分类">
              <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="平台:" prop="platform">
            <el-select v-model="addModal.formData.platform" clearable filterable placeholder="请选择平台">
              <el-option v-for="item in platformList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务类型:" prop="task_type">
            <el-select v-model="addModal.formData.task_type" clearable filterable placeholder="请选择任务类型">
              <el-option v-for="item in taskTypeList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="任务图标:" prop="task_icon">
            <div v-if="addModal.formData.task_icon" class="imgBox">
              <el-image :src="addModal.formData.task_icon" style="width: 120px;height: 120px" />
              <i class="el-icon-delete icon_del" @click="delImgFun('task_icon')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp']"
              :max-size="100"
              kay="task_icon"
              @uploadSuccess="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="任务图标上的右下角图标:" prop="one_icon">
            <div v-if="addModal.formData.one_icon" class="imgBox">
              <el-image :src="addModal.formData.one_icon" style="width: 120px;height: 120px" />
              <i class="el-icon-delete icon_del" @click="delImgFun('one_icon')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp']"
              :max-size="100"
              kay="one_icon"
              @uploadSuccess="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="任务右上角图标:" prop="two_icon">
            <div v-if="addModal.formData.two_icon" class="imgBox">
              <div v-if="['png','jpg','jpeg','webp'].includes(getImageExtension(addModal.formData.two_icon))">
                <el-image :src="addModal.formData.two_icon" style="width: 120px;height: 120px" />
              </div>
              <div v-else>
                <a :href="addModal.formData.two_icon" class="aUnderline">文件</a>
              </div>
              <i class="el-icon-delete icon_del" @click="delImgFun('two_icon')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp','json']"
              :max-size="100"
              kay="two_icon"
              @uploadSuccess="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="任务左下角图标:" prop="three_icon">
            <div v-if="addModal.formData.three_icon" class="imgBox">
              <el-image :src="addModal.formData.three_icon" style="width: 120px;height: 120px" />
              <i class="el-icon-delete icon_del" @click="delImgFun('three_icon')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp']"
              :max-size="100"
              kay="three_icon"
              @uploadSuccess="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="任务中间的积分图标:" prop="points_icon">
            <div v-if="addModal.formData.points_icon" class="imgBox">
              <el-image :src="addModal.formData.points_icon" style="width: 120px;height: 120px" />
              <i class="el-icon-delete icon_del" @click="delImgFun('points_icon')" />
            </div>
            <UploadFiles
              v-else
              ref="refUploadFiles"
              :format="['png','jpg','jpeg','webp']"
              :max-size="100"
              kay="points_icon"
              @uploadSuccess="uploadSuccess"
            />
          </el-form-item>
          <el-form-item label="增加积分:" prop="reward">
            <el-input v-model="addModal.formData.reward" placeholder="请输入增加积分" type="number" @input="changeInput" />
          </el-form-item>
          <el-form-item label="是否推荐:" prop="is_recommend">
            <el-switch
              v-model="addModal.formData.is_recommend"
              active-text="是"
              active-value="1"
              inactive-text="否"
              inactive-value="0"
            />
          </el-form-item>
          <el-form-item label="标签:" prop="tags">
            <el-select v-model="addModal.formData.tags" :multiple="true" clearable filterable placeholder="请选择标签">
              <el-option v-for="item in tagsList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
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

    <!-- 配置 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="confModal.show"
      center
      class="actionConfModal"
      title="配置"
      width="800px"
      @close="closeConfModal"
    >
      <div :style="{maxHeight:cliHeight-100+'px'}" class="content">
        <el-form
          ref="refConfModal"
          :model="confModal.formData"
          class="confModalStyle"
          label-position="top"
          label-width="0"
          size="small"
        >
          <el-form-item
            v-if="confModal.cloneRow.task_type!=='1'&&confModal.cloneRow.task_type!=='2'&&confModal.cloneRow.task_type!=='9'"
            class="formTitleRules"
            label=""
          >
            <div style="font-size: 18px;color: #333333">发送文本</div>
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type!=='1'&&confModal.cloneRow.task_type!=='2'&&confModal.cloneRow.task_type!=='9'"
            :rules="[
              { required: true, message: '请输入发送文本！', trigger: 'change' },
            ]"
            label=""
            prop="conf"
            style="width: 100%"
          >
            <el-input
              v-model="confModal.formData.conf"
              :autosize="{ minRows: 4, maxRows: 10}"
              placeholder="请输入配置"
              style="width: 100%"
              type="textarea"
              @input="changeInput"
            />
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type==='9'"
            class="formTitleRules"
            label=""
          >
            <div style="font-size: 18px;color: #333333">数据包配置</div>
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type==='9'"
            :rules="[
              { required: true, message: '请选择数据包！', trigger: 'change' },
            ]"
            label=""
            prop="data_pack_id"
            style="width: 100%"
          >
            <el-select v-model="confModal.formData.data_pack_id" clearable filterable placeholder="请选择数据包">
              <el-option v-for="item in dataPackList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type==='9'"
            class="formTitleRules"
            label=""
          >
            <div style="font-size: 18px;color: #333333">管理员分组</div>
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type==='9'"
            :rules="[
              { required: true, message: '请选择管理员分组！', trigger: 'change' },
            ]"
            label=""
            prop="data_pack_id"
            style="width: 100%"
          >
            <el-select v-model="confModal.formData.admin_group_id" clearable filterable placeholder="请选择管理员分组">
              <el-option v-for="item in accountRoleList1" :key="item.value" :label="item.label" :value="item.value">
                <span style="float: left">{{ item.label + '(数量：' + item.count + '，在线：' + item.online_num + ')' }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type==='9'"
            class="formTitleRules"
            label=""
          >
            <div style="font-size: 18px;color: #333333">进群分组</div>
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type==='9'"
            :rules="[
              { required: true, message: '请选择进群分组！', trigger: 'change' },
            ]"
            label=""
            prop="data_pack_id"
            style="width: 100%"
          >
            <el-select v-model="confModal.formData.in_group_id" clearable filterable placeholder="请选择进群分组">
              <el-option v-for="item in accountRoleList2" :key="item.value" :label="item.label" :value="item.value" >
                <span style="float: left">{{ item.label + '(数量：' + item.count + '，在线：' + item.online_num + ')' }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="formTitleRules" label="">
            <div style="font-size: 18px;color: #333333">任务限制</div>
          </el-form-item>
          <el-form-item
            v-for="(item,index) in confModal.formData.domains"
            :key="item.key"
            :label="item.label"
            :prop="'domains.' + index + '.value'"
            :rules="[
              {
                required: false,
                message: '请输入' + item.label + '！',
                trigger: 'change'
              }
            ]"
          >
            <el-input
              v-model="item.value"
              :placeholder="'请输入'+item.label"
              type="number"
              @input="changeInput"
            />
          </el-form-item>
          <el-form-item
            v-if="confModal.cloneRow.task_type==='3'||confModal.cloneRow.task_type==='4'||confModal.cloneRow.task_type==='7'"
            :rules="[
              { required: true, message: '请选择是否优先取本地数据！', trigger: 'change' },
            ]"
            label="是否优先取本地数据"
            prop="is_prefer_local_data"
            style="width: 100%"
          >
            <el-switch
              v-model="confModal.formData.is_prefer_local_data"
              active-text="是"
              active-value="1"
              inactive-text="否"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <div class="el-item-bottom" style="text-align:center;">
          <el-button @click="closeConfModal">取消</el-button>
          <el-button :loading="confModal.isLoading" type="primary" @click="confSubmit">确认</el-button>
        </div>
      </div>
    </el-dialog>

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
  editSortDataApi,
  editReleaseStatusApi,
  editConfDataApi,
  getBadgeListApi,
  getDataPackListApi,
  getSendMsgGroupApi
} from './api';
import { deepClone, resetPage, successTips, getLabelByVal, getLabelArrByVal, getImageExtension } from '@/utils';
import { formatTimestamp, getLanguagePageList } from '@/filters'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import ImagePreview from '@/components/ImagePreview'
import { uploadFileApi, getLanguagePageListApi } from '@/api/common';
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
        release_status: null,
        task_type: null,
        platform: ''
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
          reward: '',
          tags: [],
          task_icon: '',
          one_icon: '',
          two_icon: '',
          three_icon: '',
          points_icon: '',
          deeplink: '',
          task_type: '',
          platform: '',
          is_recommend: '0',
        },
        rules: {
          title: [{ required: true, message: '请输入标题！', trigger: 'change' }],
          category: [{ required: true, message: '请选择任务分类！', trigger: 'change' }],
          platform: [{ required: true, message: '请选择平台！', trigger: 'change' }],
          task_type: [{ required: true, message: '请选择任务类型！', trigger: 'change' }],
          reward: [{ required: true, message: '请输入增加积分！', trigger: 'change' }],
          tags: [{ required: true, message: '请选择标签！', trigger: 'change' }],
          task_icon: [{ required: true, message: '请上传任务图标！', trigger: 'change' }],
          one_icon: [{ required: true, message: '请上传任务图标上的右下角图标！', trigger: 'change' }],
          two_icon: [{ required: true, message: '请上传任务右上角图标！', trigger: 'change' }],
          three_icon: [{ required: true, message: '请上传任务左下角图标！', trigger: 'change' }],
          points_icon: [{ required: true, message: '请上传任务中间的积分图标！', trigger: 'change' }],
          deeplink: [{ required: true, message: '请输入跳转地址！', trigger: 'change' }],
          is_recommend: [{ required: true, message: '请选择是否推荐！', trigger: 'change' }],
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
        { label: 'Hot', value: '1' },
        { label: 'Social', value: '2' },
        { label: 'Games', value: '3' },
        { label: 'Others', value: '4' },
      ],
      taskTypeList: [
        { label: 'Tiktok-Like', value: '1' },
        { label: 'Tiktok-Follow', value: '2' },
        { label: 'Whatsapp-Send', value: '3' },
        { label: 'Sms-Send', value: '4' },
        { label: 'Whatsapp-Send-Auto', value: '7' },
        { label: 'Whatsapp-Group', value: '9' },
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
        formColumn: [],
        formData: {
          domains: [],
          conf: '',
          data_pack_id: '',
          is_prefer_local_data: '1',
          admin_group_id: '',
          in_group_id: '',
        },
        rules: {
          conf: [
            { required: true, message: '请输入发送文本！', trigger: 'change' },
          ],
        },
        isLoading: false,
      },
      titleList: [],
      dataPackList: [],
      accountRoleList1: [],
      accountRoleList2: [],
    }
  },
  mounted() {
    this.getDataListFun(); // 获取列表
    this.getLanguagePageListFun();
    this.getBadgeListFun()
    this.getDataPackListFun()
    this.setFullHeight();
    this.getSendMsgGroupApi()
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
        release_status: Number(this.queryData.release_status),
        category: Number(this.queryData.category),
        platform: Number(this.queryData.platform),
        task_type: Number(this.queryData.task_type),
      }
      getDataApi(params).then(res => {
        if (res.msg === 'success') {
          this.loading = false;
          this.queryData.total = res.data.total;
          const data = deepClone(res.data.list)
          this.tableData = data.map(item => {
            item.release_status = item.release_status ? String(item.release_status) : ''
            item.task_type = item.task_type ? String(item.task_type) : ''
            item.category = item.category ? String(item.category) : ''
            item.platform = item.platform ? String(item.platform) : ''
            item.is_recommend = item.is_recommend ? String(item.is_recommend) : '0'
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
    // 打开配置
    confOpenFun(row) {
      this.confModal.show = true
      this.confModal.cloneRow = deepClone(row)
      if (deepClone(row).conf) {
        this.confModal.formData.conf = deepClone(row).conf.message
        this.confModal.formData.data_pack_id = this.confModal.cloneRow.conf.data_pack_id || ''
        this.confModal.formData.admin_group_id = this.confModal.cloneRow.conf.admin_group_id || ''
        this.confModal.formData.in_group_id = this.confModal.cloneRow.conf.in_group_id || ''
        this.confModal.formData.is_prefer_local_data = this.confModal.cloneRow.conf.is_prefer_local_data ? '1' : '0'
      }
      if (deepClone(row).conf && deepClone(row).conf.limit_by_level) {
        this.confModal.formData.domains.forEach(item => {
          item.value = row.conf.limit_by_level[item.key]
        })
      }
    },
    // 修改发布
    changeReleaseStatusFun(form, val) {
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
          formData.reward = formData.reward ? Number(formData.reward) : 0
          formData.category = formData.category ? Number(formData.category) : 0
          formData.task_type = formData.task_type ? Number(formData.task_type) : 0
          formData.platform = formData.platform ? Number(formData.platform) : 0
          formData.is_recommend = formData.is_recommend ? Number(formData.is_recommend) : 0
          if (this.addModal.type === 'add') {
            addDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '保存成功！')
                this.closeModal()
                this.getDataListFun()
              } else {
                this.addModal.isLoading = false
              }
            })
          } else if (this.addModal.type === 'edit') {
            editDataApi(formData).then(res => {
              if (res.msg === 'success') {
                successTips(this, 'success', '編輯成功！')
                this.closeModal()
                this.getDataListFun()
              } else {
                this.addModal.isLoading = false
              }
            })
          }
        }
      })
    },
    // 保存 配置
    confSubmit() {
      this.$refs.refConfModal.validate((v) => {
        if (v) {
          this.confModal.isLoading = true
          const levelData = {}
          this.confModal.formData.domains.forEach(item => {
            levelData[item.key] = Number(item.value)
          })
          const formData = {
            id: this.confModal.cloneRow.id,
            conf: {
              limit_by_level: levelData
            }
          }
          const taskType = this.confModal.cloneRow.task_type

          if (taskType !== '1' && taskType !== '2' && taskType !== '9') {
            formData.conf.message = this.confModal.formData.conf
          }
          if (taskType === '3' || taskType === '4' || taskType === '7') {
            formData.conf.is_prefer_local_data = this.confModal.formData.is_prefer_local_data === '1'
          }
          if (taskType === '9') {
            formData.conf.data_pack_id = this.confModal.formData.data_pack_id
            formData.conf.admin_group_id = this.confModal.formData.admin_group_id
            formData.conf.in_group_id = this.confModal.formData.in_group_id
          }

          editConfDataApi(formData).then(res => {
            if (res.msg === 'success') {
              successTips(this, 'success', '编辑成功！')
              this.closeConfModal()
              this.getDataListFun()
            }
          })
        }
      })
    },
    // 关闭 配置
    closeConfModal() {
      this.$refs.refConfModal.resetFields();
      this.confModal.show = false
      this.confModal.isLoading = false
    },

    // 上传成功回调
    uploadSuccess(file, kay) {
      const formData = new FormData();
      formData.append('directory', 'task');
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
        category: '',
        reward: '',
        tags: [],
        task_icon: '',
        one_icon: '',
        two_icon: '',
        three_icon: '',
        points_icon: '',
        deeplink: '',
        task_type: '',
        platform: '',
        is_recommend: '0',
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
      this.selectData = [];
      this.queryData = {
        page: 1,
        limit: 1000,
        total: 0,
        title: '',
        category: '',
        release_status: null,
        task_type: null,
        platform: ''
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
          const kay1 = 'server.task.title'
          const kay2 = 'server.task.tag'
          this.titleList = getLanguagePageList(res.data.content, kay1)
          this.tagsList = getLanguagePageList(res.data.content, kay2)
        }
      })
    },
    // 获取 徽章列表 配置 等级列表
    getBadgeListFun() {
      const params = {
        page: 1,
        limit: 100,
        level: -1,
        tar_points: -1,
      }
      getBadgeListApi(params).then(res => {
        if (res.msg === 'success') {
          this.confModal.formColumn = res.data.list.map((item, index) => {
            item.label = '等级' + (index + 1)
            item.prop = 'level' + (index + 1)
            item.key = 'level' + (index + 1)
            item.rules = [
              {
                required: true,
                message: '请输入' + item.label + '！',
                trigger: 'change'
              }
            ]
            this.confModal.formData.domains.push({
              label: '等级' + (index + 1),
              prop: 'level' + (index + 1),
              key: 'level' + (index + 1),
              value: '',
            })
            return item
          })
        }
      })
    },
    // 获取 徽章列表 配置 等级列表
    getDataPackListFun() {
      const params = {
        page: 1,
        limit: 1000,
      }
      getDataPackListApi(params).then(res => {
        if (res.msg === 'success') {
          this.dataPackList = []
          res.data.list.forEach((item, index) => {
            const val = { label: item.name, value: item.id }
            if (item.data_type === 3) {
              this.dataPackList.push(val)
            }
          })
        }
      })
    },
    // 获取 账号角色
    getSendMsgGroupApi() {
      // 管理员
      getSendMsgGroupApi({ account_role: 1 }).then(res => {
        console.log('管理员', res.data)
        if (res.msg === 'success') {
          this.accountRoleList1 = res.data.list.map(item => {
            return {
              label: item.name,
              value: item.group_id,
              count: item.count,
              online_num: item.name,
            }
          })
        }
      })
      // 进群号
      setTimeout(() => {
        getSendMsgGroupApi({ account_role: 2 }).then(res => {
          console.log('进群号', res.data)
          if (res.msg === 'success') {
            this.accountRoleList2 = res.data.list.map(item => {
              return {
                label: item.name,
                value: item.group_id,
                count: item.count,
                online_num: item.name,
              }
            })
          }
        })
      }, 200)
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
    getLabelArrByVal,
    getImageExtension,

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
    //justify-content: space-between;
    flex-wrap: wrap;

    .el-form-item {
      width: 31%;
      margin-right: 20px;

      &:nth-of-type(3n) {
        margin-right: 0;
      }
    }

    .item_100 {
      width: 100%;
      margin-top: 20px;
    }
  }

}

.aUnderline {
  color: #00a8ff;
  text-decoration: underline;
}

.actionConfModal {
  ::v-deep .el-dialog__body {
    padding: 0;
  }

  .content {
    overflow: hidden;
    overflow-y: auto;
    padding: 16px;
  }

}

.confModalStyle {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .el-form-item {
    width: 48%;
  }

  .formTitleRules {
    width: 100%;
    position: relative;
    padding-left: 10px;

    &:before {
      position: absolute;
      content: '*';
      left: 0;
      top: 5px;
      font-size: 14px;
      color: #ff0000;
    }

  }
}
</style>
