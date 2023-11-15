<script setup lang="ts">
import { useMap } from '@/hooks/useMap';
import type { TilesetProps } from '@/types/TilesetProps';
import { onUnmounted, shallowRef, watch } from 'vue';

const props = withDefaults(defineProps<TilesetProps>(), {
  show: true,
  urlFunc: undefined,
  copyright: () => [],
  dark: false,
  minZoom: undefined,
  maxZoom: undefined,
  getTile: undefined,
})

const tileset = shallowRef<kakao.maps.Tileset>(null);
const map = useMap("Tileset")
const id = `TILE_${Date.now()}_${Math.floor(Math.random() * 1000000)}`
let added = false

watch(map, (map) => {
  if (!map) return
  if (tileset.value) return

  const options = createOptions(props)
  tileset.value = new kakao.maps.Tileset(options)
}, { immediate: true })

watch(tileset, tileset => {
  kakao.maps.Tileset.add(id, tileset)
  added = true
})

watch([tileset, map, () => props.show], ([tileset, map, show], [_tileset, _map, _show]) => {
  if (!map || !tileset) return
  if (tileset === _tileset && map === _map && show === _show) return

  if (show) {
    map.addOverlayMapTypeId(kakao.maps.MapTypeId[id])
  } else {
    map.removeOverlayMapTypeId(kakao.maps.MapTypeId[id])
  }
}, { flush: "post" })

onUnmounted(() => {
  if (map.value && tileset.value && added) {
    map.value.removeOverlayMapTypeId(kakao.maps.MapTypeId[id])
  }
})

function createOptions(props: TilesetProps): kakao.maps.TilesetOptions {
  return props;
}
</script>