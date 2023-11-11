<script setup lang="ts">
import { CopyrightPosition } from '@/types/CopyrightPosition'
import type { KakaoMapProps } from '@/types/KakaoMapProps.js'
import type { LatLng } from '@/types/LatLng'
import type { MapTypeId } from '@/types/MapTypeId'
import { KakaoLoader } from '@/utils/KakaoLoader'
import { onMounted, provide, ref, watch } from 'vue'

// Props 설정
const props = withDefaults(defineProps<KakaoMapProps>(), {
  level: 3,
  mapTypeId: "ROADMAP",
  draggable: true,
  zoomable: true,
  disableDoubleClick: false,
  disableDoubleClickZoom: false,
  tileAnimation: true,
  keyboardShortcuts: false,
  copyrightPosition: "BOTTOMLEFT",
  copyrightReversed: false,
  pan: false,
})

// 컨테이너 div 및 map 객체 설정
const container = ref<HTMLDivElement>(null)
const map = ref<kakao.maps.Map>(null)
// context 제공
provide("map", { map })

// useKakaoLoader() 사용할 경우 script 로드 완료 후 init 실행
KakaoLoader.addLoadEventListener(init)
// 또는 script 로드 완료 후 KakaoMap 컴포넌트가 마운트되었을 경우 init 실행
onMounted(() => {
  if (window.kakao && window.kakao.maps) {
    init()
  }
})

// 컨테이너 div가 존재할 경우 props로부터 Map 생성
function init() {
  if (!container.value) return

  const options = createMapOptions(props)
  map.value = new kakao.maps.Map(container.value, options)
}

// 일반적인 속성 watch, 기존 값과 같으면 지도에 반영하지 않음
watch([map, () => props.center], ([map, center], [, _center]) => {
  if (center === _center) return
  props.pan ? map.panTo(createLatLng(center)) : map.setCenter(createLatLng(center))
})

watch([map, () => props.level], ([map, level], [, _level]) => {
  if (level === _level) return
  map.setLevel(level)
})

watch([map, () => props.mapTypeId], ([map, mapTypeId], [, _mapTypeId]) => {
  if (mapTypeId === _mapTypeId) return
  map.setMapTypeId(createMapTypeId(mapTypeId))
})

watch([map, () => props.minLevel], ([map, minLevel], [, _minLevel]) => {
  if (!minLevel || minLevel === _minLevel) return
  map.setMinLevel(minLevel)
})

watch([map, () => props.maxLevel], ([map, maxLevel], [, _maxLevel]) => {
  if (!maxLevel || maxLevel === _maxLevel) return
  map.setMaxLevel(maxLevel)
})

watch([map, () => props.draggable], ([map, draggable], [, _draggable]) => {
  if (draggable === _draggable) return
  map.setDraggable(draggable)
})

watch([map, () => props.zoomable], ([map, zoomable], [, _zoomable]) => {
  if (zoomable === _zoomable) return
  map.setZoomable(zoomable)
})

watch([map, () => props.keyboardShortcuts], ([map, keyboardShortcuts], [, _keyboardShortcuts]) => {
  if (keyboardShortcuts === _keyboardShortcuts) return
  if (keyboardShortcuts === false) {
    map.setKeyboardShortcuts(keyboardShortcuts)
  } else {
    map.setKeyboardShortcuts(true)
  }
})

watch([map, () => props.copyrightPosition, () => props.copyrightReversed], ([map, copyrightPosition, copyrightReversed], [, _copyrightPosition, _copyrightReversed]) => {
  if (copyrightPosition === _copyrightPosition && copyrightReversed === _copyrightReversed) return
  map.setCopyrightPosition(createCopyrightPosition(copyrightPosition), copyrightReversed)
})

watch([map, () => props.cursorStyle], ([map, cursorStyle], [, _cursorStyle]) => {
  if (cursorStyle === _cursorStyle) return
  map.setCursor(cursorStyle)
})

// 지도를 표시하는 HTML elemente의 크기를 변경한 후에는 반드시 relayout 함수를 호출해야 한다.
const resizeObserver = new ResizeObserver(() => map.value.relayout())
watch([container, map], ([container, map]) => {
  if (container && map) {
    resizeObserver.observe(container)
  } else {
    resizeObserver.unobserve(container)
  }
})

function createMapOptions(props: KakaoMapProps): kakao.maps.MapOptions {
  return {
    ...props,
    center: createLatLng(props.center),
    mapTypeId: createMapTypeId(props.mapTypeId),
  };
}

function createLatLng(latLng: LatLng): kakao.maps.LatLng {
  return new kakao.maps.LatLng(latLng.latitude, latLng.longitude)
}

function createMapTypeId(mapTypeId: MapTypeId): kakao.maps.MapTypeId {
  return kakao.maps.MapTypeId[mapTypeId]
}

function createCopyrightPosition(copyrightPosition: CopyrightPosition): kakao.maps.CopyrightPosition {
  return kakao.maps.CopyrightPosition[copyrightPosition]
}
</script>

<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<style scoped></style>