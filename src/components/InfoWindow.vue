<script setup lang="ts">
import { useMap } from '../hooks/useMap';
import { useMarker } from '../hooks/useMarker';
import { InfoWindowProps } from '../types/InfoWindowProps';
import { createLatLng } from '../utils/create';
import { onUnmounted, ref, watch } from 'vue';

const props = withDefaults(defineProps<InfoWindowProps>(), {
  open: false,
  position: () => ({ latitude: 0, longitude: 0 }),
  disableAutoPan: false,
  removable: false,
  zIndex: undefined,
})

const infoWindow = ref<kakao.maps.InfoWindow>(null);
const map = useMap("InfoWindow")
const marker = useMarker("InfoWindow")
const content = ref<HTMLDivElement>(null)
const hidden = ref(true)

watch(map, (map) => {
  if (!map) return
  if (infoWindow.value) return

  hidden.value = false
  infoWindow.value = new kakao.maps.InfoWindow(createOptions(props))
}, { immediate: true })

watch([infoWindow, map, () => props.open], ([infoWindow, map, open], [, _map, _open]) => {
  if (!infoWindow) return
  if (map === _map && open === _open) return
  if (open) {
    if (marker) {
      infoWindow.open(map, marker.value)
    } else {
      infoWindow.open(map)
    }
  } else {
    infoWindow.close()
  }
})

watch([infoWindow, () => props.position], ([infoWindow, position], [, _position]) => {
  if (!infoWindow) return
  if (position === _position) return
  infoWindow.setPosition(createLatLng(position))
}, { deep: true })

// HTMLElement의 Attribute만 바뀌는 것으로는 업데이트가 안된다.
watch([infoWindow, content], ([infoWindow, content]) => {
  if (!infoWindow) return
  infoWindow.setContent(content)
}, { deep: true })

watch([infoWindow, () => props.zIndex], ([infoWindow, zIndex], [, _zIndex]) => {
  if (!infoWindow) return
  if (zIndex === _zIndex) return
  infoWindow.setZIndex(zIndex)
})

watch([infoWindow, () => props.altitude], ([infoWindow, altitude], [, _altitude]) => {
  if (!infoWindow) return
  if (altitude === _altitude) return
  infoWindow.setAltitude(altitude)
})

watch([infoWindow, () => props.range], ([infoWindow, range], [, _range]) => {
  if (!infoWindow) return
  if (range === _range) return
  infoWindow.setRange(range)
})

onUnmounted(() => {
  if (!map.value) return
  if (!infoWindow.value) return

  hidden.value = true
  infoWindow.value.close()
})

function createOptions(props: InfoWindowProps): kakao.maps.InfoWindowOptions {
  return {
    ...props,
    position: createLatLng(props.position),
    content: content.value
  }
}
</script>

<template>
  <div ref="content" :class="{ hidden }">
    <slot></slot>
  </div>
</template>

<style scoped>
.hidden {
  visibility: hidden;
}
</style>