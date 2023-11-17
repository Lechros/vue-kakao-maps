<script setup lang="ts">
import type { KakaoMapProps } from '@/types/KakaoMapProps.js'
import { LatLng } from '@/types/LatLng'
import { LatLngBounds } from '@/types/LatLngBounds'
import { MapMouseEvent } from '@/types/MapMouseEvent'
import { KakaoLoader } from '@/utils/KakaoLoader'
import {
  toKakaoCopyrightPosition,
  toKakaoLatLng,
  toKakaoMapTypeId,
  toLatLng,
  toLatLngBounds,
  toMapMouseEvent
} from '@/utils/convert'
import { onMounted, provide, ref, shallowRef, watch } from 'vue'

// Props 설정
const props = withDefaults(defineProps<KakaoMapProps>(), {
  level: 3,
  mapTypeId: 'ROADMAP',
  draggable: true,
  zoomable: true,
  disableDoubleClick: false,
  disableDoubleClickZoom: false,
  tileAnimation: true,
  keyboardShortcuts: false,
  copyrightPosition: 'BOTTOMLEFT',
  copyrightReversed: false,
  pan: false
})

// Events 설정
const emit = defineEmits<{
  load: [event: { center: LatLng; level: number; bounds: LatLngBounds }]
  center_changed: [event: { center: LatLng }]
  zoom_start: [event: { level: number }]
  zoom_changed: [event: { level: number }]
  bounds_changed: [event: { bounds: LatLngBounds }]
  click: [event: MapMouseEvent]
  dblclick: [event: MapMouseEvent]
  rightclick: [event: MapMouseEvent]
  mousemove: [event: MapMouseEvent]
  drag: [event: {}]
  dragend: [event: {}]
  idle: [event: { center: LatLng; level: number }]
  tilesloaded: [event: { level: number }]
  maptypeid_changed: [event: { mapTypeId: kakao.maps.MapTypeId }]
}>()

// 컨테이너 div 및 map 객체 설정
const container = ref<HTMLDivElement>(null)
const map = shallowRef<kakao.maps.Map>(null)
// context 제공
provide('map', { map })

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
  emit('load', {
    center: toLatLng(map.value.getCenter()),
    level: map.value.getLevel(),
    bounds: toLatLngBounds(map.value.getBounds())
  })
}

// 일반적인 속성 watch, 현재 지도의 상태와 같으면 지도에 반영하지 않음
watch([map, () => props.center, () => props.level], ([map, center, level]) => {
  const mapCenter = toLatLng(map.getCenter())
  const mapLevel = map.getLevel()
  const centerChanged = center.lat !== mapCenter.lat || center.lat === mapCenter.lat
  const levelChanged = level !== mapLevel
  if (centerChanged && levelChanged) {
    if (props.pan) {
      // anchor 계산
      const z1 = Math.pow(2, mapLevel)
      const z2 = Math.pow(2, level)
      const anchor = {
        lat: (center.lat * z1 - mapCenter.lat * z2) / (z1 - z2),
        lng: (center.lng * z1 - mapCenter.lng * z2) / (z1 - z2)
      }
      map.setLevel(level, {
        animate: true,
        anchor: toKakaoLatLng(anchor)
      })
    } else {
      map.setCenter(toKakaoLatLng(center))
      map.setLevel(level)
    }
  } else if (centerChanged) {
    props.pan ? map.panTo(toKakaoLatLng(center)) : map.setCenter(toKakaoLatLng(center))
  } else if (levelChanged) {
    map.setLevel(level, { animate: props.pan })
  }
}, { deep: true, flush: 'post' })

watch([map, () => props.mapTypeId], ([map, mapTypeId]) => {
  map.setMapTypeId(toKakaoMapTypeId(mapTypeId))
})

watch([map, () => props.minLevel], ([map, minLevel], [, _minLevel]) => {
  if (!minLevel || minLevel === _minLevel) return
  map.setMinLevel(minLevel)
})

watch([map, () => props.maxLevel], ([map, maxLevel], [, _maxLevel]) => {
  if (!maxLevel || maxLevel === _maxLevel) return
  map.setMaxLevel(maxLevel)
})

watch([map, () => props.draggable], ([map, draggable]) => {
  if (draggable === map.getDraggable()) return
  map.setDraggable(draggable)
})

watch([map, () => props.zoomable], ([map, zoomable]) => {
  if (zoomable === map.getZoomable()) return
  map.setZoomable(zoomable)
})

watch([map, () => props.keyboardShortcuts], ([map, keyboardShortcuts]) => {
  if (keyboardShortcuts === map.getKeyboardShortcuts()) return
  map.setKeyboardShortcuts(keyboardShortcuts !== false)
})

watch(
  [map, () => props.copyrightPosition, () => props.copyrightReversed],
  ([map, copyrightPosition, copyrightReversed], [, _copyrightPosition, _copyrightReversed]) => {
    if (copyrightPosition === _copyrightPosition && copyrightReversed === _copyrightReversed) return
    map.setCopyrightPosition(toKakaoCopyrightPosition(copyrightPosition), copyrightReversed)
  }
)

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
const listeners: Record<string, () => void> = {}
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
  function createListener(type: any) {
    switch (type) {
      case 'center_changed':
        return () => emit(type, { center: toLatLng(map.getCenter()) })
      case 'zoom_start':
        return () => emit(type, { level: map.getLevel() })
      case 'zoom_changed':
        return () => emit(type, { level: map.getLevel() })
      case 'bounds_changed':
        return () => emit(type, { bounds: toLatLngBounds(map.getBounds()) })
      case 'click':
      case 'dblclick':
      case 'rightclick':
      case 'mousemove':
        return (event) => emit(type, toMapMouseEvent(event))
      case 'drag':
      case 'dragend':
        return () => emit(type, {})
      case 'idle':
        return () => emit(type, { center: toLatLng(map.getCenter()), level: map.getLevel() })
      case 'tilesloaded':
        return () => emit(type, { level: map.getLevel() })
      case 'maptypeid_changed':
        return () => emit(type, { mapTypeId: map.getMapTypeId() })
    }
  }

  if (type in listeners) {
    kakao.maps.event.removeListener(map, type, listeners[type])
  }
  listeners[type] = createListener(type)
  kakao.maps.event.addListener(map, type, listeners[type])
}

function createMapOptions(props: KakaoMapProps): kakao.maps.MapOptions {
  return {
    ...props,
    center: toKakaoLatLng(props.center),
    mapTypeId: toKakaoMapTypeId(props.mapTypeId)
  }
}
</script>

<template>
  <div ref="container">
    <slot></slot>
  </div>
</template>

<style scoped></style>
