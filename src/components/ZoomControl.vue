<script setup lang="ts">
import { useMap } from '@/hooks/useMap.js';
import type { ControlPosition } from '@/types/ControlPosition';
import { createControlPosition } from '@/utils/create';
import { onUnmounted, shallowRef, watch } from 'vue';

const props = defineProps<{ position: ControlPosition }>();

const control = shallowRef<kakao.maps.ZoomControl>(null);
const map = useMap("ZoomControl")

watch(map, (map) => {
  if (!map) return

  control.value = new kakao.maps.ZoomControl()
})

watch([control, () => props.position], ([control, position]) => {
  if (!control) return

  map.value.removeControl(control)
  map.value.addControl(control, createControlPosition(position))
})

onUnmounted(() => {
  if (map.value && control.value) {
    map.value.removeControl(control.value)
  }
})
</script>