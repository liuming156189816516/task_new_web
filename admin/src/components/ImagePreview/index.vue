<!-- 图片预览 -->
<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="modal.show"
    center
    title="图片"
  >
    <div class="body">
      <el-image :src="modal.formData[modal.kay]" />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      modal: {
        show: false,
        kay: '',
        formData: {}
      }
    }
  },
  methods: {
    open(row, kay) {
      this.modal.show = true
      this.modal.kay = kay
      this.modal.formData = row
    }
  }
}
</script>

<style lang="scss" scoped>
.body {
  max-height: 85vh;
  overflow-x: hidden;
  overflow-y: scroll;

}
</style>
