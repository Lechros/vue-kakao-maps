<script setup lang="ts">
import { useMap } from '@/hooks/useMap.js';
import type { ControlPosition } from '@/types/ControlPosition';
import { toKakaoControlPosition } from '@/utils/convert';
import { onUnmounted, shallowRef, watch } from 'vue';

const props = defineProps<{ position: ControlPosition }>();

const control = shallowRef<kakao.maps.MapTypeControl>(null);
const map = useMap("MapTypeControl")

watch(map, (map) => {
  if (!map) return

  control.value = new kakao.maps.MapTypeControl()
})

watch([control, () => props.position], ([control, position]) => {
  if (!control) return

  map.value.removeControl(control)
  map.value.addControl(control, toKakaoControlPosition(position))
})

onUnmounted(() => {
  if (map.value && control.value) {
    map.value.removeControl(control.value)
  }
})
</script>@/utils/convert