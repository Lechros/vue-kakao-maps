<script setup lang="ts">
import { useMap } from '@/hooks/useMap';
import { useMarkerClusterer } from '@/hooks/useMarkerClusterer';
import type { MarkerProps } from '@/types/MarkerProps';
import { toKakaoLatLng } from '@/utils/convert';
import { onUnmounted, provide, ref, shallowRef, watch } from 'vue';

const props = withDefaults(defineProps<MarkerProps>(), {
  open: false,
  image: undefined,
  visible: false,
  title: '',
  draggable: false,
  clickable: false,
  zIndex: 0,
  opacity: 1,
  altitude: 0,
  range: 0
})

// Events 설정
const emit = defineEmits<{
  click: [event: {}]
  mouseover: [event: {}]
  mouseout: [event: {}]
  rightclick: [event: {}]
  dragstart: [event: {}]
  dragend: [event: {}]
}>()

const marker = shallowRef<kakao.maps.Marker>(null);
const map = useMap("Marker")
const { clusterer, count } = useMarkerClusterer("Marker")
// context 제공
const pos = ref({ lat: 0, lng: 0 })
provide("marker", { marker, position: pos })
// Marker가 모두 추가된 후 MarkerCluster.redraw 호출하기 위해 로드된 개수 추적

watch(map, (map) => {
  if (!map) return
  if (marker.value) return

  const options = createOptions(props)
  marker.value = new kakao.maps.Marker(options)
}, { immediate: true })

watch([marker, map], ([marker, map], [_marker, _map]) => {
  if (!marker) return
  if (marker === _marker && map === _map) return
  if (clusterer) {
    clusterer.value.addMarker(marker, true)
    count.value++
  }
})

watch([marker, () => props.image], ([marker, image], [, _image]) => {
  if (!marker) return
  if (image === undefined && image === _image) return
  marker.setImage(image)
}, { deep: true })

watch([marker, () => props.position], ([marker, position], [, _position]) => {
  pos.value = position;
  if (!marker) return
  if (position === _position) return
  marker.setPosition(toKakaoLatLng(position))
}, { deep: true })

watch([marker, () => props.zIndex], ([marker, zIndex], [, _zIndex]) => {
  if (!marker) return
  if (zIndex !== undefined && zIndex === _zIndex) return
  marker.setZIndex(zIndex)
})

watch([marker, () => props.visible], ([marker, visible], [, _visible]) => {
  if (!marker) return
  if (visible === _visible) return
  marker.setVisible(visible)
})

watch([marker, () => props.title], ([marker, title], [, _title]) => {
  if (!marker) return
  if (title !== undefined && title === _title) return
  marker.setTitle(title)
})

watch([marker, () => props.draggable], ([marker, draggable], [, _draggable]) => {
  if (!marker) return
  if (draggable === _draggable) return
  marker.setDraggable(draggable)
})

watch([marker, () => props.clickable], ([marker, clickable], [, _clickable]) => {
  if (!marker) return
  if (clickable === _clickable) return
  marker.setClickable(clickable)
})

watch([marker, () => props.altitude], ([marker, altitude], [, _altitude]) => {
  if (!marker) return
  if (altitude !== undefined && altitude === _altitude) return
  marker.setAltitude(altitude)
})

watch([marker, () => props.range], ([marker, range], [, _range]) => {
  if (!marker) return
  if (range !== undefined && range === _range) return
  marker.setRange(range)
})

watch([marker, () => props.opacity], ([marker, opacity], [, _opacity]) => {
  if (!marker) return
  if (opacity === _opacity) return
  marker.setOpacity(opacity)
})

onUnmounted(() => {
  if (!marker.value) return

  if (clusterer && clusterer.value) {
    clusterer.value.removeMarker(marker.value)
  } else {
    marker.value.setMap(null)
  }
})

// 지도 Event emit
const listeners: Record<string, () => void> = {};
watch([marker, map], ([marker,]) => {
  if (!window.kakao || !window.kakao.maps) return
  if (!marker) return

  addListener(marker, 'click', listeners)
  addListener(marker, 'mouseover', listeners)
  addListener(marker, 'mouseout', listeners)
  addListener(marker, 'rightclick', listeners)
  addListener(marker, 'dragstart', listeners)
  addListener(marker, 'dragend', listeners)
}, { immediate: true })

function addListener(marker: kakao.maps.Marker, type: any, listeners: Record<string, Function>) {
  if (type in listeners) {
    kakao.maps.event.removeListener(marker, type, listeners[type])
  }
  listeners[type] = () => emit(type, {})
  kakao.maps.event.addListener(marker, type, listeners[type])
}

function createOptions(props: MarkerProps): kakao.maps.MarkerOptions {
  const parent = clusterer && clusterer.value
    ? {}
    : { map: map.value }
  return {
    ...props,
    ...parent,
    position: toKakaoLatLng(props.position)
  }
}
</script>

<template>
  <slot></slot>
</template>@/utils/convert