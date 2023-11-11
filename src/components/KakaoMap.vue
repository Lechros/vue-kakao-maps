<script setup lang="ts">
import type { KakaoMapProps } from '../types/KakaoMapProps.js';
import { KakaoLoader } from '../utils/KakaoLoader';
import { createCopyrightPosition, createLatLng, createMapTypeId } from '../utils/create';
import { onMounted, provide, ref, watch } from 'vue';

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

// Events 설정
const emit = defineEmits<{
  center_changed: [map: kakao.maps.Map]
  zoom_start: [map: kakao.maps.Map]
  zoom_changed: [map: kakao.maps.Map]
  bounds_changed: [map: kakao.maps.Map]
  click: [mouseEvent: MouseEvent, map: kakao.maps.Map]
  dblclick: [mouseEvent: MouseEvent, map: kakao.maps.Map]
  rightclick: [mouseEvent: MouseEvent, map: kakao.maps.Map]
  mousemove: [mouseEvent: MouseEvent, map: kakao.maps.Map]
  drag: [map: kakao.maps.Map]
  dragend: [map: kakao.maps.Map]
  idle: [map: kakao.maps.Map]
  tilesloaded: [map: kakao.maps.Map]
  maptypeid_changed: [map: kakao.maps.Map]
}>()

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
  if (map.value) return

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
  map.setKeyboardShortcuts(keyboardShortcuts !== false)
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

// 지도 Event emit
const listeners: Record<string, () => void> = {};
watch(map, (map) => {
  if (!window.kakao || !window.kakao.maps) return
  if (!map) return

  addListener(map, 'center_changed', listeners)
  addListener(map, 'zoom_start', listeners)
  addListener(map, 'zoom_changed', listeners)
  addListener(map, 'bounds_changed', listeners)
  addListener(map, 'click', listeners)
  addListener(map, 'dblclick', listeners)
  addListener(map, 'rightclick', listeners)
  addListener(map, 'mousemove', listeners)
  addListener(map, 'drag', listeners)
  addListener(map, 'dragend', listeners)
  addListener(map, 'idle', listeners)
  addListener(map, 'tilesloaded', listeners)
  addListener(map, 'maptypeid_changed', listeners)
})

function addListener(map: kakao.maps.Map, type: any, listeners: Record<string, Function>) {
  function createListener(map: kakao.maps.Map, type: any) {
    if (['click', 'dblclick', 'rightclick', 'mousemove'].includes(type)) {
      return (ev) => emit(type, ev, map)
    } else {
      return () => emit(type, map)
    }
  }

  if (type in listeners) {
    kakao.maps.event.removeListener(map, type, listeners[type])
  }
  listeners[type] = createListener(map, type)
  kakao.maps.event.addListener(map, type, listeners[type])
}

function createMapOptions(props: KakaoMapProps): kakao.maps.MapOptions {
  return {
    ...props,
    center: createLatLng(props.center),
    mapTypeId: createMapTypeId(props.mapTypeId),
  };
}
</script>

<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<style scoped></style>