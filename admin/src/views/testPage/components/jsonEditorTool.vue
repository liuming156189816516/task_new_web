<template>
  <div class="json-page">
    <div class="card">
      <div class="card-header">
        <div class="btn-group">
          <button class="btn" @click="beautify">
            <i class="fa fa-expand" /> 格式化
          </button>
          <button class="btn" @click="minify">
            <i class="fa fa-compress" /> 压缩
          </button>
          <button class="btn" @click="validateJson">验证</button>
          <button class="btn" @click="jsonTocsv">JSON 转 CSV</button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="warningMsg" class="alert" :class="warningClass">
          {{ warningMsg }}
        </div>
        <div class="content_box">
          <div class="left_box">
            <div ref="jsonEditor1" class="editor" />
          </div>
          <div class="left_icon">
            <el-button class="btn" @click="toTree">
              》
            </el-button>

            <el-button class="btn" @click="toCode">
              《
            </el-button>
          </div>
          <div class="right_box">
            <div ref="jsonEditor2" class="editor" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import JSONEditor from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.css';

export default {
  name: 'JsonTool',
  data() {
    return {
      editor1: null,
      editor2: null,
      warningMsg: '',
      warningClass: 'alert-warning'
    };
  },
  mounted() {
    const json = {
      sites: {
        site: [
          { id: '1', name: '菜鸟教程', url: 'www.runoob.com' },
          { id: '2', name: '菜鸟工具', url: 'www.jyshare.com' },
          { id: '3', name: 'Google', url: 'www.google.com' }
        ]
      }
    };
    this.editor1 = new JSONEditor(this.$refs.jsonEditor1, { mode: 'code' }, json);
    this.editor2 = new JSONEditor(this.$refs.jsonEditor2, { mode: 'tree' }, json);
    this.editor2.expandAll();
  },
  methods: {
    toTree() {
      try {
        const jsonStr = this.editor1.getText();
        this.editor2.setText(jsonStr);
        this.editor2.setMode('tree');
        this.editor2.expandAll();
      } catch (e) {
        this.showError(e);
      }
    },
    toCode() {
      try {
        const jsonStr = this.editor2.getText();
        const obj = JSON.parse(jsonStr);
        this.editor1.setText(JSON.stringify(obj, null, 2));
        this.editor1.setMode('code');
      } catch (e) {
        this.showError(e);
      }
    },
    beautify() {
      try {
        const obj = JSON.parse(this.editor1.getText());
        this.editor1.setText(JSON.stringify(obj, null, 2));
        this.editor2.setText(JSON.stringify(obj, null, 0));
        this.editor2.setMode('tree');
        this.editor2.expandAll();
      } catch (e) {
        this.showError(e);
      }
    },
    minify() {
      try {
        const obj = JSON.parse(this.editor1.getText());
        this.editor1.setText(JSON.stringify(obj));
        this.editor2.setText(JSON.stringify(obj));
        this.editor2.setMode('tree');
        this.editor2.expandAll();
      } catch (e) {
        this.showError(e);
      }
    },
    validateJson() {
      try {
        JSON.parse(this.editor1.getText());
        this.showSuccess('JSON 数据合法');
      } catch (e) {
        this.showError(e);
      }
    },
    jsonTocsv() {
      try {
        const obj = JSON.parse(this.editor1.getText());
        const keys = Object.keys(obj.sites.site[0]);
        const header = keys.join(',') + '\n';
        const rows = obj.sites.site
          .map(row => keys.map(k => row[k]).join(','))
          .join('\n');
        this.editor2.setMode('text');
        this.editor2.setText(header + rows);
      } catch (e) {
        this.showError(e);
      }
    },
    showError(e) {
      this.warningMsg = 'JSON 数据错误: ' + e.message;
      this.warningClass = 'alert-danger';
      setTimeout(() => (this.warningMsg = ''), 5000);
    },
    showSuccess(msg) {
      this.warningMsg = msg;
      this.warningClass = 'alert-success';
      setTimeout(() => (this.warningMsg = ''), 5000);
    }
  }
};
</script>

<style scoped lang="scss">
.content_box{
  display: flex;
  .left_box{
    width: 43%;
  }
  .left_icon{
    width: 5%;
    text-align: center;
    .btn{
      margin: 0 0 15px;
    }
  }
  .right_box{
    width: 43%;
  }

}
.editor {
  height: 60vh;
  min-height: 450px;
  width: 100%;
  margin-bottom: 20px;
}
</style>
