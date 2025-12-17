<!-- 数据管理 -->
<template>
  <div style="width:100%;height: 100%; float: left;">
    <el-form :inline="true" size="small" style="margin-top: 10px;">
      <el-form-item>
        <el-button :disabled="checkIdArry.length==0" type="danger" @click="changeIpBtn">{{ $t('sys_g047') }}</el-button>
        <el-button type="primary" @click="pushDataBtn(0,1)">{{ $t('sys_c135') }}</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="model1.name" placeholder="请输入数据名称" />
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="initDatalist(1)">{{ $t('sys_c002') }}</el-button>
      </el-form-item>
    </el-form>

    <div class="group_main">
      <div class="tab_check_warp">
        <i slot="reference" class="el-icon-info" />
        <div v-html="$t('sys_mat007',{value:checkIdArry.length})" />
      </div>
      <div>
        <el-table
          ref="serveTable"
          v-loading="loading"
          :cell-style="{ textAlign: 'center' }"
          :data="dataList"
          :header-cell-style="{ color: '#909399', textAlign: 'center' }"
          :height="cliHeight"
          :summary-method="getSummaries"
          border
          element-loading-background="rgba(255, 255, 255,1)"
          element-loading-spinner="el-icon-loading"
          show-summary
          style="width: 100%;"
          @selection-change="handleSelectionChange"
          @row-click="rowSelectChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$t('sys_mat027')" min-width="140" prop="name" />
          <el-table-column label="数据类型" min-width="120" prop="data_type" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ getLabelByVal(scope.row[scope.column.property], dataTypeList) || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="国家" min-width="120" prop="country" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ getLabelByVal(scope.row[scope.column.property], countryList) || '-' }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_mat042')" min-width="100" prop="invalid_num" />
          <el-table-column :label="$t('sys_mat028')" min-width="100" prop="up_num" />
          <el-table-column :label="$t('sys_mat029')" min-width="100" prop="source_repeat_num" />
          <el-table-column :label="$t('sys_mat030')" min-width="100" prop="repeat_num" />
          <el-table-column :label="$t('sys_mat031')" min-width="100" prop="into_num" />
          <el-table-column :label="$t('sys_mat032')" min-width="100" prop="residue_num" />
          <el-table-column :label="$t('sys_mat106')" min-width="100" prop="err_num" />
          <el-table-column :label="$t('sys_l059')" min-width="100" prop="up_status">
            <template slot-scope="scope">
              <el-tag :type="scope.row.up_status==1?'warning':'success'" size="small">
                {{ taskOption[scope.row.up_status] }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c008')" min-width="148" prop="expire_time">
            <template slot-scope="scope">
              {{ scope.row[scope.column.property] > 0 ? $baseFun.resetTime(scope.row[scope.column.property] * 1000) : 0 }}
            </template>
          </el-table-column>
          <el-table-column :label="$t('sys_c010')" width="268">
            <template slot-scope="scope">
              <el-popover placement="left" trigger="click" width="200">
                <div>{{ $t('sys_mat037') }}</div>
                <div style="display: flex;justify-content: flex-end;">
                  {{ $t('sys_mat038', {value: residueList.length}) }}
                </div>
                <div>
                  <template v-if="residueList.length>0">
                    <div ref="lazyEle" class="residue_less" @scroll="lazyScroll">
                      <el-button
                        v-if="moreLoading"
                        :loading="true"
                        class="loading_icon"
                        style="margin-top: 10px;"
                        type="primary"
                      />
                      <template v-else>
                        <div v-for="(item,idx) in residueList" :key="idx">{{ item }}</div>
                        <div v-if="isMore" style="font-size: 12px;margin-top: 5px;">{{ $t('sys_mat014') }}</div>
                      </template>
                    </div>
                  </template>
                  <p v-else>{{ $t('sys_mat013') }}</p>
                </div>
                <el-button
                  slot="reference"
                  :disabled="checkIdArry.length>0"
                  size="small"
                  type="warning"
                  @click.stop="showLeaveNum(scope.row)"
                >{{ $t('sys_mat032') }}
                </el-button>
              </el-popover>
              <el-button
                :disabled="checkIdArry.length>0"
                size="small"
                style="margin-left:10px;"
                type="primary"
                @click.stop="pushDataBtn(scope.row,2)"
              >{{ $t('sys_mat107') }}
              </el-button>
              <el-button :border="false" :disabled="checkIdArry.length>0" size="small" style="padding: 0;" @click.stop>
                <el-dropdown @command="(command)=>{handleCommand(scope.row,command)}">
                  <el-button :disabled="checkIdArry.length>0" size="small" type="primary">{{ $t('sys_c079') }}
                    <i class="el-icon-arrow-down el-icon--right" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,idx) in moreOption" v-show="item" :key="idx" :command="idx">
                      {{ item }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="layui_page">
          <el-pagination
            :current-page.sync="model1.page"
            :page-size="this.model1.limit"
            :page-sizes="pageOption"
            :total="this.model1.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="setPageSize"
            @current-change="switchPage"
          />
        </div>
      </div>
    </div>

    <!-- 新增-->
    <el-dialog
      :close-on-click-modal="false"
      :title="$t('sys_mat034')"
      :visible.sync="ipModel"
      :width="ipModelWidth"
      center
    >
      <el-form ref="ipForm" :model="ipForm" :rules="ipRules" label-width="0" size="small">
        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-steps :active="stepsActive">
                <el-step :description="$t('sys_m056')" :title="$t('sys_c058')" />
                <el-step :description="$t('sys_m057')" :title="$t('sys_m055')" />
                <el-step :description="$t('sys_m058')" :title="$t('sys_mat034')" />
              </el-steps>
            </el-form-item>
          </el-col>
          <template v-if="stepsActive==1">
            <el-col v-if="!ipForm.id" :span="12">
              <el-form-item prop="file_name">
                <div class="label_title">{{ $t('sys_m059') }}</div>
                <el-input v-model="ipForm.file_name" :placeholder="$t('sys_mat024')" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="data_way">
                <div class="label_title">{{ $t('sys_g130') }}</div>
                <el-radio-group v-model="ipForm.data_way">
                  <el-radio v-for="(item,idx) in dataOption" v-show="item!==''" :key="idx" :label="idx">{{
                    item
                  }}
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item prop="data_type">
                <div class="label_title">数据类型</div>
                <el-select v-model="ipForm.data_type" :disabled="ipModelType===2" clearable filterable placeholder="请选择数据类型">
                  <el-option v-for="item in dataTypeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <div style="width: 20px;height: 20px;" />
            </el-col>
            <el-col :span="11">
              <el-form-item prop="country">
                <div class="label_title">国家</div>
                <el-select v-model="ipForm.country" :disabled="ipModelType===2" clearable filterable placeholder="请选择国家">
                  <el-option v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <div class="label_title">{{ $t('sys_c058') }}</div>
                <div>{{ $t('sys_c136') }}</div>
                <div class="submit_btn">
                  <el-button v-if="ipForm.file_name" class="custom_file1" style="margin-top: 0;">{{ $t('sys_c059') }}
                    <input id="uploadFile" ref="uploadclear" title=" " type="file" @change="checkDataIsUse">
                  </el-button>
                  <el-button v-else class="custom_file1" style="margin-top: 0;" @click="submitWayBtn('ipForm')">点击上传
                  </el-button>
                  <span class="export_tips" @click="downLoadTemp">
                    <i class="el-icon-download" />{{ $t('sys_l066') }}
                  </span>
                </div>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="24">
            <el-form-item label-width="0">
              <template v-if="stepsActive==2">
                <el-progress :percentage="percentage" :stroke-width="14" :text-inside="true" />
                <div class="upload_img" style="margin-top: 10px;">
                  <img alt="" src="../../../assets/upload_ing.png" srcset="">
                </div>
              </template>
              <template v-if="stepsActive==3">
                <div class="upload_img">
                  <img alt="" src="../../../assets/success.png" srcset="">
                  <div style="font-weight: 600;">{{ $t('sys_c119') }}</div>
                  <div v-html="$t('sys_c118',{s_number:success_number,f_number:fail_number})" />
                </div>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="stepsActive==3">
          <el-form-item class="el-item-bottom" label-width="0" style="text-align:center;">
            <el-button @click="restUpload">{{ $t('sys_c076') }}</el-button>
            <el-button type="primary" @click="ipModel = false">{{ $t('sys_c075') }}</el-button>
          </el-form-item>
        </template>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { successTips, resetPage } from '@/utils'
import { getdatapacklist, bathdel, uploadfile, getschedule, dooutputdata, getresiduenum } from '@/api/datamanage'
import { getLabelByVal } from '@/utils';

export default {
  data() {
    return {
      model1: {
        page: 1,
        limit: 10,
        total: 0,
        name: ''
      },
      Loading: '',
      percentage: 0,
      stepsActive: 1,
      ipModelType: '',
      ipModelWidth: '',
      dataList: [],
      loading: false,
      ipModel: false,
      isLoading: false,
      moreLoading: false,
      fail_number: 0,
      setIpType: '',
      waitTimer: null,
      setInter: 1000,
      success_number: 0,
      countryList: [
        { label: '美国', value: 'US' },
        { label: '中国', value: 'CN' },
        { label: '巴西', value: 'BR' },
        { label: '马来西亚', value: 'MY' },
        { label: '老挝', value: 'LA' },
        { label: '全球', value: 'ALL' },
      ],
      checkIdArry: [],
      residueList: [],
      showNum: [7, 8],
      randomNum: [1, 2, 4, 8, 3, 8, 4, 6, 3, 8],
      pageOption: resetPage(),
      ipForm: {
        id: '',
        file_name: '',
        data_way: 1,
        ip_file: '',
        is_err: 1,
        data_type: '',
        country: ''
      },
      model2: {
        page: 1,
        limit: 10,
        total: 0
      },
      timer: null,
      isTime: null,
      isMore: false,
      cliHeight: null,
      dataTypeList: [
        { label: 'Whatsapp', value: '1', },
        { label: 'Sms', value: '2', },
        { label: 'WhatsappGroup', value: '3', },
      ],
    }
  },
  computed: {
    ipRules() {
      return {
        data_way: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        is_err: [{ required: true, message: this.$t('sys_c052'), trigger: 'change' }],
        data_type: [{ required: true, message: '请选择数据类型', trigger: 'change' }],
        country: [{ required: true, message: '请选择国家', trigger: 'change' }],
        file_name: [{ required: true, message: this.$t('sys_mat024'), trigger: 'blur' }]
      }
    },
    dataOption() {
      return ['', this.$t('sys_mat022'), this.$t('sys_mat023')]
    },
    taskOption() {
      return ['', this.$t('sys_q015'), this.$t('sys_mat047')]
    },
    stopOptions() {
      return ['', this.$t('sys_c025'), this.$t('sys_c026')]
    },
    clearOption() {
      return ['', this.$t('sys_l113'), this.$t('sys_l114')]
    },
    moreOption() {
      return ['', this.$t('sys_mat035'), this.$t('sys_mat036'), this.$t('sys_mat105')]
    }
  },
  watch: {
    ipModel(val) {
      console.log('val',val)
      if (val === false) {
        this.ipForm.is_err = 1;
        this.ipForm.data_way = 1;
        this.ipForm.file_name = '';
        this.ipForm.ip_file = '';
        this.ipForm.data_type = '';
        this.ipForm.country = '';
        this.$refs.ipForm.resetFields();
      }
    }
  },
  created() {
    this.initDatalist();
  },
  mounted() {
    this.setFullHeight();
    window.addEventListener('resize', this.setFullHeight);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setFullHeight);
  },
  destroyed() {
    clearInterval(this.waitTimer);
    clearTimeout(this.heartTimer);
    this.waitTimer = null;
    this.heartTimer = null;
  },
  methods: {
    showLeaveNum(row) {
      this.model2.page = 1;
      this.model2.id = row.id;
      this.getLeaveNum()
    },
    getLeaveNum() {
      this.moreLoading = true;
      getresiduenum({ id: this.model2.id, page: this.model2.page, limit: this.model2.limit }).then(res => {
        this.moreLoading = false;
        if (res.code !== 0) return;
        this.model2.total = res.data.total;
        this.residueList = res.data.list || []
      })
    },
    lazyScroll() {
      const scrollEle = this.$refs.lazyEle;
      const scrollbtn = scrollEle.scrollHeight - scrollEle.scrollTop - scrollEle.clientHeight;
      clearTimeout(this.timer);
      if (scrollbtn < 20 && this.residueList.length < this.model2.total) {
        this.timer = setTimeout(() => {
          this.isMore = false;
          this.model2.page += 1;
          getresiduenum({ id: this.model2.id, page: this.model2.page, limit: this.model2.limit }).then(res => {
            this.moreLoading = false;
            if (res.code !== 0) return;
            this.residueList = this.residueList.concat(res.data.list)
          })
        }, 500);
      } else {
        this.timer = setTimeout(() => {
          this.isMore = true;
        }, 500);
      }
    },
    handleSelectionChange(row) {
      this.checkIdArry = row.map(item => {
        return item.id
      })
    },
    rowSelectChange(row, column, event) {
      const refsElTable = this.$refs.serveTable;
      const findRow = this.checkIdArry.find(item => item === row.id);
      if (findRow) {
        refsElTable.toggleRowSelection(row, false);
        return;
      }
      refsElTable.toggleRowSelection(row, true);
    },
    initDatalist(num) {
      this.loading = true;
      this.model1.page = num || this.model1.page;
      const params = {
        page: this.model1.page,
        limit: this.model1.limit,
        name: this.model1.name
      }
      getdatapacklist(params).then(res => {
        this.loading = false;
        this.model1.total = res.data.total;
        this.dataList = res.data.list.map(item => {
          item.data_type = item.data_type ? String(item.data_type) : '0'
          return item
        });
        this.$nextTick(() => {
          if (this.$refs.serveTable) {
            this.$refs.serveTable.doLayout();
          }
        })
      })
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map(item => Number(item[column.property]));
        if (index === 0) {
          sums[index] = this.$t('sys_c125');
          return;
        } else if (this.showNum.indexOf(index) > -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '--';
        }
      });
      return sums;
    },
    // 新建 编辑
    pushDataBtn(row, idx) {
      this.ipModel = true;
      this.stepsActive = 1;
      this.ipModelType = idx;
      this.startPercent();
      this.ipModelWidth = '700px';
      this.ipForm = {
        id: '',
        file_name: '',
        data_way: 1,
        ip_file: '',
        is_err: 1,
        data_type: '',
        country: ''
      }
      this.ipForm.id = row.id;
      if (idx === 1) return;
      this.ipForm.id = row.id;
      this.ipForm.file_name = row.name;
      this.ipForm.data_type = row.data_type;
      this.ipForm.country = row.country;
    },
    async checkDataIsUse(e) {
      const files = this.$refs.uploadclear.files[0];
      const formData = new FormData();
      formData.append('file', files);
      formData.append('ptype', this.ipModelType);
      formData.append('name', this.ipForm.file_name);
      formData.append('into_type', this.ipForm.data_way);
      formData.append('data_type', Number(this.ipForm.data_type));
      formData.append('country', this.ipForm.country);
      // formData.append('is_err',this.ipForm.is_err);
      if (this.ipModelType === 2) {
        formData.append('id', this.ipForm.id);
      }
      this.stepsActive = 2;
      this.$refs.uploadclear.value = null;
      const result = await uploadfile(formData);
      if (result.code !== 0) return;
      this.waitTimer = setInterval(async() => {
        const getResult = await getschedule({ id: result.data.id })
        if (getResult.code !== 0) return;
        if (getResult.data.up_status === 2) {
          clearInterval(this.waitTimer);
          this.initDatalist();
          this.stepsActive = 3
          this.fail_number = getResult.data.fail;
          this.success_number = getResult.data.success;
        }
      }, this.setInter)
      // const getResult = await getschedule({id:result.data.id})
      // if (getResult.code !== 0) return;
      // this.initDatalist();
      // this.stepsActive = 3,
      // this.fail_number = getResult.data.fail;
      // this.success_number = getResult.data.success;
    },
    submitWayBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('123')
        }
      })
    },
    startPercent() {
      this.percentage = 0;
      this.progrTimer = setInterval(() => {
        const curPercent = Number(this.randomNum[Math.floor(Math.random() * this.randomNum.length)]);
        if (this.percentage >= 35) {
          if (this.percentage < 96) {
            this.percentage++
          } else {
            this.percentage = 99
            clearInterval(this.progrTimer)
          }
        } else {
          this.percentage = this.percentage + curPercent
        }
      }, 800)
    },
    restUpload() {
      this.stepsActive = 1
      this.ipModelType = 1;
    },
    setPageSize(val) {
      this.model1.limit = val;
      this.initDatalist();
    },
    switchPage(val) {
      this.model1.page = val;
      this.initDatalist();
    },
    downLoadTemp() {
      var blob = new Blob(['每行一个手机号'], { type: 'text/plain' });
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'example-import-was-data-zh.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    },
    changeIpBtn() {
      const that = this;
      that.$confirm(that.$t('sys_rai046', { value: that.$t('sys_c024') }), that.$t('sys_c028'), {
        type: 'warning',
        confirmButtonText: that.$t('sys_c024'),
        cancelButtonText: that.$t('sys_c023'),
        beforeClose: function(action, instance, done) {
          if (action === 'confirm') {
            bathdel({ ids: that.checkIdArry }).then(res => {
              if (res.code !== 0) return;
              that.initDatalist();
              successTips(that)
              done();
            })
          } else {
            done();
          }
        }
      }).catch(() => {
        that.$message({ type: 'info', message: that.$t('sys_c048') });
      })
    },
    handleCommand(row, idx) {
      dooutputdata({ type: idx, id: row.id }).then(res => {
        if (res.code !== 0) return;
        window.location.href = res.data.url;
      })
    },
    // 窗口高度
    setFullHeight() {
      this.cliHeight = document.documentElement.clientHeight - 280;
    },
    getLabelByVal
  }
}
</script>

<style lang="scss" scoped>
.group_main {
  display: flex;
  width: 100%;
  flex-direction: column;

  .tab_check_warp {
    width: 100%;
    display: flex;
    color: #909399;
    font-size: 14px;
    margin-bottom: 10px;
    align-items: center;

    i {
      margin-right: 4px;
    }

    .el-checkbox {
      margin-right: 10px;
    }

    .check_num {
      color: #606266;
    }
  }
}

.text_number {
  color: #209cdf;
}

.label_title {
  color: #606266;
  font-size: 14px;
  font-weight: 700;
}

.residue_less {
  width: 100%;
  max-height: 100px;
  overflow: hidden;
  overflow-y: auto;
}

.upload_img {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 30px;
  margin-top: 10px;

  img {
    width: 280px;
    height: 188px;
    margin: 10px 0;
  }
}

.submit_btn {
  height: 100%;
  display: flex;
  align-items: center;
  margin-top: 0;

  .export_tips {
    display: flex;
    font-size: 12px;
    cursor: pointer;
    align-items: center;
    color: #209cdf;
    margin-left: 20px;
  }
}

::v-deep .el-alert--success.is-light,
::v-deep .el-alert--success.is-light .el-alert__description {
  color: #67c23a;
  background-color: #f0f9eb;
}</style>
