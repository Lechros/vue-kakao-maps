<script setup lang="ts">
import { useMap } from '@/hooks/useMap'
import { useMarkerClusterer } from '@/hooks/useMarkerClusterer'
import type { CustomOverlayProps } from '@/types/CustomOverlayProps'
import { toKakaoLatLng } from '@/utils/convert'
import { onUnmounted, ref, shallowRef, useSlots, watch } from 'vue'

const props = withDefaults(defineProps<CustomOverlayProps>(), {
  clickable: false,
  visible: true,
  xAnchor: 0.5,
  yAnchor: 0.5,
  zIndex: 0
})

const overlay = shallowRef<kakao.maps.CustomOverlay>(null)
const map = useMap('CustomOverlay')
const { clusterer, count } = useMarkerClusterer('CustomOverlay')
const content = shallowRef<HTMLDivElement>(null)

watch(map, (map) => {
  if (!map) return
  if (overlay.value) return

  const options = createOptions(props)
  overlay.value = new kakao.maps.CustomOverlay(options)
  overlay.value.setContent(content.value.innerHTML)
}, { immediate: true })

watch([overlay, map], ([overlay, map], [_overlay, _map]) => {
  if (!overlay) return
  if (overlay === _overlay && map === _map) return
  if (clusterer && clusterer) {
    clusterer.value.addMarker(overlay, true)
    count.value++
  }
}, { immediate: true })

watch([overlay, () => props.position], ([overlay, position], [, _position]) => {
  if (!overlay) return
  if (position === _position) return
  overlay.setPosition(toKakaoLatLng(position))
}, { deep: true })

// HTMLElement의 Attribute만 바뀌는 것으로는 업데이트가 안된다.
// watch([overlay, content], ([overlay, content]) => {
//   if (!overlay) return
//   overlay.setContent(content.innerHTML)
// }, { deep: true })

const slots = useSlots()

watch([overlay, () => slots.default()], ([overlay, slot]) => {
  if (!overlay) return
  overlay.setContent(content.value.innerHTML)
}, { deep: true })

watch([overlay, () => props.visible], ([overlay, visible], [, _visible]) => {
  if (!overlay) return
  if (visible === _visible) return
  overlay.setVisible(visible)
})

watch([overlay, () => props.zIndex], ([overlay, zIndex], [, _zIndex]) => {
  if (!overlay) return
  if (zIndex !== undefined && zIndex === _zIndex) return
  overlay.setZIndex(zIndex)
})

watch([overlay, () => props.altitude], ([overlay, altitude], [, _altitude]) => {
  if (!overlay) return
  if (altitude !== undefined && altitude === _altitude) return
  overlay.setAltitude(altitude)
})

watch([overlay, () => props.range], ([overlay, range], [, _range]) => {
  if (!overlay) return
  if (range !== undefined && range === _range) return
  overlay.setRange(range)
})

onUnmounted(() => {
  if (!overlay.value) return
  if (clusterer && clusterer.value) {
    clusterer.value.removeMarker(overlay.value, true)
    count.value++
  } else {
    overlay.value.setMap(null)
  }
})

function createOptions(props: CustomOverlayProps): kakao.maps.CustomOverlayOptions {
  const parent = clusterer && clusterer.value ? {} : { map: map.value }
  return {
    ...props,
    ...parent,
    position: toKakaoLatLng(props.position)
  }
}
</script>

<template>
  <div ref="content" class="vue-kakao-maps--hidden">
    <slot></slot>
  </div>
</template>

<style scoped>
.vue-kakao-maps--hidden {
  visibility: hidden;
}
</style>
