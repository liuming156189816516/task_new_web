<template>
  <div>
    <jsonEditorTool />
  </div>
</template>

<script>
import jsonEditorTool from './components/jsonEditorTool'
export default {
  name: 'Index',

  components: { jsonEditorTool },
  data() {
    return {
      jsonData: ''

    };
  },
  mounted() {
    console.log('refIframe',this.$refs.refIframe)
    },
  methods: {

  }
}
</script>

<style scoped>

</style>
