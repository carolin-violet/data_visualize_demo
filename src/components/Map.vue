<template>
  <div class="com-container" @click="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from 'axios'
import {getProvinceMapInfo} from '@/utils/map_utils'

export default {
  data () {
    return {
      chartInstance: null,
      allData: null,
      mapData: {}
    }
  },
  created () {
    this.$socket.registerCallBack("mapData", this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('mapData')
  },
  methods: {
    async initChart () {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, 'chalk')

      const res = await axios.get('http://localhost:8999/static/map/china.json')
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '商家分布',
          left: 20,
          top: 20
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        }
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('click', async target => {
        const provinceInfo = getProvinceMapInfo(target.name)
        if (!this.mapData[provinceInfo.key]) {
          const res = await axios.get('http://localhost:8999' + provinceInfo.path)
          this.mapData[provinceInfo.key] = res.data
          this.$echarts.registerMap(provinceInfo.key, res.data)
        }

        const changeOption = {
          geo: {
            map: provinceInfo.key
          }
        }
        this.chartInstance.setOption(changeOption)
      })
    },
    async getData (res) {
      // const {data: res} = await this.$http.get('map')
      this.allData = res

      this.updateChart()
    },
    updateChart () {
      const seriesArr = this.allData.map(item => {
        return {
          type: 'effectScatter',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo'
        }
      })

      const legendArr = this.allData.map(item => {
        return item.name
      })

      const dataOption = {
        legend: {
          data: legendArr
        },
        series: seriesArr
      }
      this.chartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }
      this.chartInstance.setOption(adapterOption)
      this.chartInstance.resize()
    },
    revertMap () {
      const revertOption = {
        geo: {
          map: 'china'
        }
      }
      this.chartInstance.setOption(revertOption)
    }
  }
}
</script>

<style>

</style>