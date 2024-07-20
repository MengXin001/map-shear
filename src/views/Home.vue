<template>
    <div class="bg-white pt-24 sm:pt-32">
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
            <div class="mx-auto max-w-2xl lg:text-center">
                <h2 class="text-xl font-semibold leading-7">Export Mapbox Base Map</h2>
                <a-badge-ribbon :text="'v' + pkg.version">
                <h1 class="mt-2 tracking-tight">Map Shear</h1>
                </a-badge-ribbon>
                <p class="mt-6 text-lg leading-8 text-gray-600">快速导出基于 Mapbox 样式的底图用于 Ai 等绘图应用</p>
                <p class="text-md leading-8 text-gray-600">在开始使用前：浏览器最小宽度应不小于 720 px </p>
            </div>
            <div class="mt-8 flex items-center justify-center gap-x-6">
                <a href="/#/map"
                    class="btn rounded-md bg-[#1677ff] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600">开始使用</a>
                <a href="https://github.com/MengXin001/map-shear"
                    class="btn px-3.5 py-2.5 text-sm font-semibold text-gray-900">项目首页</a>
                <a href="https://www.mapbox.com/" class="text-sm font-semibold leading-6 text-gray-900">关于 Mapbox →</a>
            </div>
        </div>
        <div class="relative mt-16">
            <div class="absolute inset-0 flex flex-col" aria-hidden="true">
                <div class="flex-1" />
                <div class="w-full flex-1 bg-gray-800" />
            </div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6">
                <img class="relative rounded-lg shadow-lg"
                    src="/PRD_Map_Backgound.png" />
            </div>
        </div>
    </div>
</template>

<script setup>
import pkg from '../../package.json'
</script>