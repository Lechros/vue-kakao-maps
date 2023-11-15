<script setup lang="ts">
import { useMap } from '@/hooks/useMap';
import type { CustomOverlayProps } from '@/types/CustomOverlayProps';
import { toKakaoLatLng } from '@/utils/convert';
import { onUnmounted, ref, shallowRef, watch } from 'vue';

const props = withDefaults(defineProps<CustomOverlayProps>(), {
  clickable: false,
  xAnchor: 0.5,
  yAnchor: 0.5,
  zIndex: 0
})

const overlay = shallowRef<kakao.maps.CustomOverlay>(null);
const map = useMap("CustomOverlay")
const content = ref<HTMLDivElement>(null)
const hidden = ref(true)

watch(map, (map) => {
  if (!map) return
  if (overlay.value) return

  hidden.value = false
  overlay.value = new kakao.maps.CustomOverlay(createOptions(props))
}, { immediate: true })

watch([overlay, () => props.position], ([marker, position], [, _position]) => {
  if (!marker) return
  if (position === _position) return
  marker.setPosition(toKakaoLatLng(position))
}, { deep: true })

// HTMLElement의 Attribute만 바뀌는 것으로는 업데이트가 안된다.
watch([overlay, content], ([overlay, content]) => {
  if (!overlay) return
  overlay.setContent(content)
}, { deep: true })

watch([overlay, () => props.visible], ([marker, visible]) => {
  if (!marker) return
  marker.setVisible(visible)
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
  if (!map.value) return
  if (!overlay.value) return

  hidden.value = true
  overlay.value.setMap(null)
})

function createOptions(props: CustomOverlayProps): kakao.maps.CustomOverlayOptions {
  return {
    ...props,
    map: map.value,
    position: toKakaoLatLng(props.position)
  }
}
</script>

<template>
  <div ref="content" :class="{ 'vue-kakao-maps--hidden': hidden }">
    <slot></slot>
  </div>
</template>

<style scoped>
.vue-kakao-maps--hidden {
  visibility: hidden;
}
</style>@/utils/convert