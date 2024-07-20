<template>
  <div class="main">
    <a-config-provider
      :theme="{
        token: {
          fontFamily: 'Inter, Noto Sans SC',
        },
      }"
    >
      <div class="map-panel py-5 px-5">
        <a href="/" class="font-medium px-4">Map Shear</a>
        <a
          class="my-5 bg-[#f9fafb] text-[#1677ff] mr-2 px-2 py-2 text-sm font-medium rounded-md"
        >
          基本地图配置
        </a>
        <div>
          <a class="text-sm">选择地图样式：</a>
          <a-select
            ref="select"
            v-model:value="map_style"
            style="width: 120px"
            @change="changeMap(map_style)"
            :options="styleOptions"
          ></a-select>
        </div>
        <a
          class="mt-8 mb-5 bg-[#f9fafb] text-[#1677ff] mr-2 px-2 py-2 text-sm font-medium rounded-md"
        >
          自定义地图配置
        </a>
        <a class="text-sm">Mapbox Token：</a>
        <a-input
          v-model:value="user_token"
          placeholder="Mapbox Token"
          class="mt-3 max-w-xs"
        />
        <a class="mt-5 text-sm">Mapbox 样式链接：</a>
        <a-input
          v-model:value="user_style"
          placeholder="mapbox://styles/mapbox/streets-v11"
          class="mt-3 max-w-xs"
        />
        <div class="mt-10 flex gap-x-6">
          <a-button type="primary" @click="customMap">使用自定义地图</a-button>
          <a-button class="bg-[#3eaf7c] text-white" @click="shearMap">
            导出地图
          </a-button>
        </div>
        <div ref="navigationControlContainer" id="navigation-control"></div>
        <div ref="scaleControlContainer" id="scale-control"></div>
      </div>
      <div class="map-box">
        <div id="map" class="w-full h-screen"></div>
      </div>
    </a-config-provider>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import { message } from 'ant-design-vue'
import html2canvas from 'html2canvas'

import 'mapbox-gl/dist/mapbox-gl.css'
import '../styles/map.scss'

import { MAP_CONFIG } from '../data/map'

const styleOptions = Object.entries(MAP_CONFIG.STYLES).map(
  ([label, value]) => ({ label, value }),
)
const map_style = ref(MAP_CONFIG.STYLES.Default)
const user_token = ref('')
const user_style = ref('')

const scaleControlContainer = ref(null)
const navigationControlContainer = ref(null)

let map = null

onMounted(() => {
  initMap(MAP_CONFIG.TK, map_style.value)
})

const initMap = (token, style) => {
  if (map) {
    map.remove()
    scaleControlContainer.value = navigationControlContainer.value = null
  }
  mapboxgl.accessToken = token
  map = new mapboxgl.Map({
    container: 'map',
    style: style,
    center: [113.88, 22.5],
    zoom: 5,
    minZoom: 0,
    maxZoom: 22,
    pitch: 0,
    bearing: 0,
    preserveDrawingBuffer: true,
    attributionControl: false,
  })
  let scaleControl = new mapboxgl.ScaleControl()
  if (scaleControlContainer.value) {
    scaleControlContainer.value.appendChild(scaleControl.onAdd(map))
  }
  let navigationControl = new mapboxgl.NavigationControl({
    visualizePitch: true,
  })
  if (navigationControlContainer.value) {
    navigationControlContainer.value.appendChild(navigationControl.onAdd(map))
  }
}

const changeMap = (style) => {
  if (map) {
    map.setStyle(style)
  }
}

const customMap = () => {
  if (user_token.value && user_style.value) {
    try {
      initMap(user_token.value, user_style.value)
      message.success('切换样式成功')
    } catch (error) {
      message.error('切换样式失败:', error)
    }
  } else {
    message.error('Input Token & Style')
  }
}

const shearMap = async () => {
  const mapElement = document.getElementById('map')
  if (mapElement) {
    try {
      const canvas = await html2canvas(mapElement)
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = map_style.value + '.png'
      link.click()
      message.success('导出完成')
    } catch (error) {
      message.error('导出失败:', error)
    }
  }
}
</script>
