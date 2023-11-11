<script setup lang="ts">
import type { KakaoMapProps } from '@/types/KakaoMapProps.js'
import type { LatLng } from '@/types/LatLng'
import type { MapTypeId } from '@/types/MapTypeId'
import { KakaoLoader } from '@/utils/KakaoLoader'
import { onMounted, provide, ref, watch } from 'vue'

const props = withDefaults(defineProps<KakaoMapProps>(), {
  level: 3,
  mapTypeId: "ROADMAP",
  draggable: true,
  scrollwheel: true,
  disableDoubleClick: false,
  disableDoubleClickZoom: false,
  tileAnimation: true,
  keyboardShortcuts: false,
})

const container = ref<HTMLDivElement>(null)
const map = ref<kakao.maps.Map>(null)

provide("map", { map })

KakaoLoader.addLoadEventListener(init)
onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    init()
  }
})

function init() {
  if (!container.value) return

  const options = parse(props)
  map.value = new kakao.maps.Map(container.value, options)

  watch(() => props.center, (value) => {
    props.pan ? map.value.setCenter(getLatLng(value)) : map.value.panTo(getLatLng(value))
  })

  watch(() => props.level, (value) => {
    map.value.setLevel(value)
  })

  watch(() => props.mapTypeId, (value) => {
    map.value.setMapTypeId(getMapTypeId(value))
  })

  watch(() => props.minLevel, (value) => {
    if (!value) return
    map.value.setMinLevel(value)
  }, { immediate: true })

  watch(() => props.maxLevel, (value) => {
    if (!value) return
    map.value.setMaxLevel(value)
  }, { immediate: true })
}


function parse(props: KakaoMapProps): kakao.maps.MapOptions {
  return {
    center: getLatLng(props.center),
    level: props.level,
    mapTypeId: getMapTypeId(props.mapTypeId),
    draggable: props.draggable,
    scrollwheel: props.scrollwheel,
    disableDoubleClick: props.disableDoubleClick,
    disableDoubleClickZoom: props.disableDoubleClickZoom,
    tileAnimation: props.tileAnimation,
    keyboardShortcuts: props.keyboardShortcuts,
  }
}

function getLatLng(latLng: LatLng): kakao.maps.LatLng {
  return new kakao.maps.LatLng(latLng.latitude, latLng.longitude)
}

function getMapTypeId(mapTypeId: MapTypeId): kakao.maps.MapTypeId {
  return kakao.maps.MapTypeId[mapTypeId]
}
</script>

<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<style scoped></style>