<template>
  <div class="main">
    <a-config-provider
      :theme="{
        token: {
          fontFamily: 'Inter, Noto Sans SC',
        },
      }"
    >
      <a-float-button
        @click="changePanel"
        :tooltip="tooltip"
        :style="{
          right: '24px',
        }"
      ></a-float-button>
      <Transition name="fade">
        <div v-show="panel_status" class="fade map-panel py-5 px-5">
          <div class="flex items-center px-4">
            <a href="/" class="font-medium">Map Shear</a>
            <a
              href="https://github.com/MengXin001/map-shear"
              class="ml-auto w-6"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                version="1.1"
                data-view-component="true"
                class="octicon octicon-mark-github v-align-middle color-fg-default"
              >
                <path
                  d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"
                ></path>
              </svg>
            </a>
          </div>
          <a
            class="max-w-xs my-5 bg-[#f9fafb] text-[#1677ff] mr-2 px-2 py-2 text-sm font-medium rounded-md"
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
            class="max-w-xs my-5 bg-[#f9fafb] text-[#1677ff] mr-2 px-2 py-2 text-sm font-medium rounded-md"
          >
            自定义地图配置
          </a>
          <a class="text-sm">Mapbox Token：</a>
          <a-input
            v-model:value="user_token"
            placeholder="Mapbox Token"
            class="mt-3 max-w-xs"
          />
          <a class="mt-3 text-sm">Mapbox 样式链接：</a>
          <a-input
            v-model:value="user_style"
            placeholder="mapbox://styles/mapbox/streets-v11"
            class="mt-3 max-w-xs"
          />
          <div class="mt-5 flex gap-x-6">
            <a-button type="primary" @click="customMap">
              使用自定义地图
            </a-button>
            <a-button class="bg-[#3eaf7c] text-white" @click="shearMap">
              导出地图
            </a-button>
          </div>
          <div ref="navigationControlContainer" id="navigation-control"></div>
          <div ref="scaleControlContainer" id="scale-control"></div>
        </div>
      </Transition>
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
const panel_status = ref(true)
const tooltip = ref('隐藏面板')

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

const changePanel = () => {
  panel_status.value = !panel_status.value
  if (panel_status.value) {
    tooltip.value = '隐藏面板'
  } else {
    tooltip.value = '显示面板'
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
