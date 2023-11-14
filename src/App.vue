<script setup lang="ts">
import KakaoMap from '@/components/KakaoMap.vue';
import MapTypeControl from '@/components/MapTypeControl.vue';
import { ref } from 'vue';
import { useKakaoLoader } from '@/hooks/useKakaoLoader';
import ZoomControl from './components/ZoomControl.vue';
import InfoWindow from '@/components/InfoWindow.vue';
import Marker from './components/Marker.vue';
import CustomOverlay from './components/CustomOverlay.vue';
import MarkerClusterer from './components/MarkerClusterer.vue';

const show = ref(true)
const open = ref(false)

const data = ref([])
fetch("https://apis.map.kakao.com/download/web/data/chicken.json")
  .then(res => res.json())
  .then(json => data.value = json.positions)

useKakaoLoader({ appKey: import.meta.env.VITE_KAKAO_JAVASCRIPT_APP_KEY!, libraries: ['clusterer'] })
</script>

<template>
  <KakaoMap :center="{ lat: 36.2683, lng: 127.6358 }" :level="14" style="width: 100%; height: 95vh;">
    <MarkerClusterer average-center :min-level="10">
      <Marker v-for="(pos, i) in data" :position="pos" :key="i" />
    </MarkerClusterer>
    <!-- <MapTypeControl position="TOPRIGHT" />
    <ZoomControl position="BOTTOMRIGHT" />
    <Marker :position="{ lat: 36.502, lng: 127 }" clickable @mouseover="() => open = true" @mouseout="() => open = false">
      <InfoWindow :open="open">
        <div style="padding: 5px">
          Hello world
        </div>
      </InfoWindow>
    </Marker>
    <Marker :position="{ lat: 36.502, lng: 127.001 }" clickable @mouseover="() => open = true"
      @mouseout="() => open = false">
      <InfoWindow :open="open">
        <div style="padding: 5px">
          Hello world
        </div>
      </InfoWindow>
    </Marker>
    <Marker :position="{ lat: 36.501, lng: 127 }" clickable @mouseover="() => open = true" @mouseout="() => open = false">
      <InfoWindow :open="open">
        <div style="padding: 5px">
          Hello world
        </div>
      </InfoWindow>
    </Marker>
    <CustomOverlay :position="{ lat: 36.502, lng: 127.002 }">
      <div style="width: 50px; height: 50px; background-color: red;">
        Overlay hello
      </div>
    </CustomOverlay> -->
  </KakaoMap>
  <button @click="show = !show">reverse</button>
</template>

<style scoped></style>