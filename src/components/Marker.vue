<script setup lang="ts">
import { useMap } from '@/hooks/useMap';
import { MarkerProps } from '@/types/MarkerProps.js';
import { createLatLng } from '@/utils/create';
import { onMounted, onUnmounted, provide, ref, watch } from 'vue';

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
  click: [marker: kakao.maps.Marker, map: kakao.maps.Map]
  mouseover: [marker: kakao.maps.Marker, map: kakao.maps.Map]
  mouseout: [marker: kakao.maps.Marker, map: kakao.maps.Map]
  rightclick: [marker: kakao.maps.Marker, map: kakao.maps.Map]
  dragstart: [marker: kakao.maps.Marker, map: kakao.maps.Map]
  dragend: [marker: kakao.maps.Marker, map: kakao.maps.Map]
}>()

const marker = ref<kakao.maps.Marker>(null);
const map = useMap("Marker")
// context 제공
provide("marker", { marker })

watch(map, (map) => {
  if (!map) return
  if (marker.value) return

  marker.value = new kakao.maps.Marker(createOptions(props))
}, { immediate: true })

watch([marker, () => props.image], ([marker, image], [, _image]) => {
  if (!marker) return
  if (image === undefined && image === _image) return
  marker.setImage(image)
}, { deep: true })

watch([marker, () => props.position], ([marker, position], [, _position]) => {
  if (!marker) return
  if (position === _position) return
  marker.setPosition(createLatLng(position))
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
  if (!map.value) return
  if (!marker.value) return

  marker.value.setMap(null)
})

// 지도 Event emit
const listeners: Record<string, () => void> = {};
watch([marker, map], ([marker, map]) => {
  if (!window.kakao || !window.kakao.maps) return
  if (!marker) return

  addListener(marker, map, 'click', listeners)
  addListener(marker, map, 'mouseover', listeners)
  addListener(marker, map, 'mouseout', listeners)
  addListener(marker, map, 'rightclick', listeners)
  addListener(marker, map, 'dragstart', listeners)
  addListener(marker, map, 'dragend', listeners)
}, { immediate: true })

function addListener(marker: kakao.maps.Marker, map: kakao.maps.Map, type: any, listeners: Record<string, Function>) {
  if (type in listeners) {
    kakao.maps.event.removeListener(marker, type, listeners[type])
  }
  listeners[type] = () => emit(type, marker, map)
  kakao.maps.event.addListener(marker, type, listeners[type])
}

function createOptions(props: MarkerProps): kakao.maps.MarkerOptions {
  return {
    ...props,
    map: map.value,
    position: createLatLng(props.position)
  }
}
</script>

<template>
  <slot></slot>
</template>