<template>
  <!-- 图表容器 -->
  <div>
    <div
      ref="pieChart"
      :style="{ width: width, height: height }"
    />
  </div>
</template>

<script>
// ⚠️ ECharts 4.x 必须这样引入
import echarts from 'echarts'

export default {
  name: 'PieChart',

  props: {
    /**
     * 饼图数据
     * 示例：
     * [
     *   { device_brand: 'Samsung', total: 12345 },
     *   { device_brand: 'Xiaomi', total: 8654 }
     * ]
     */
    list: {
      type: Array,
      default: () => []
    },
    // 🔥 自定义颜色数组
    colors: {
      type: Array,
      default: () => [
        '#5470C6',
        '#91CC75',
        '#FAC858',
        '#EE6666',
        '#73C0DE'
      ]
    },
    // 图表宽度
    name: {
      type: String,
      default: '品牌统计'
    },
    // 图表宽度
    width: {
      type: String,
      default: '100%'
    },

    // 图表高度
    height: {
      type: String,
      default: '300px'
    }
  },

  data() {
    return {
      chartInstance: null
    }
  },

  watch: {
    list: {
      deep: true,
      handler() {
        this.updateChart()
      }
    }
  },

  mounted() {
    this.initChart()
    window.addEventListener('resize', this.resizeChart)
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart)
    if (this.chartInstance) {
      this.chartInstance.dispose()
      this.chartInstance = null
    }
  },

  methods: {
    /**
     * 初始化图表
     */
    initChart() {
      if (!this.$refs.pieChart) return

      this.chartInstance = echarts.init(this.$refs.pieChart)
      this.updateChart()
    },

    /**
     * 更新图表数据
     */
    updateChart() {
      if (!this.chartInstance) return

      const seriesData = this.list.map(item => ({
        name: item.device_brand,
        value: item.total
      }))

      const option = {
        color: this.colors, // ⭐ 核心
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>数量：{c}<br/>占比：{d}%'
        },

        legend: {
          orient: 'vertical',
          left: 'left',
          data: seriesData.map(item => item.name)
        },

        series: [
          {
            name: this.name,
            type: 'pie',
            radius: '65%',
            center: ['60%', '50%'],
            data: seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              formatter: '{b}: {d}%'
            }
          }
        ]
      }

      this.chartInstance.setOption(option, true)
    },

    /**
     * 窗口 resize
     */
    resizeChart() {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
  }
}
</script>
