<script setup lang="ts">
import KakaoMap from '@/components/KakaoMap.vue';
import MapTypeControl from '@/components/MapTypeControl.vue';
import { ref } from 'vue';
import { useKakaoLoader } from '@/hooks/useKakaoLoader';
import ZoomControl from './components/ZoomControl.vue';
import InfoWindow from '@/components/InfoWindow.vue';
import Marker from './components/Marker.vue';

const show = ref(true)
const open = ref(false)


setTimeout(() => {
  useKakaoLoader({ appKey: import.meta.env.VITE_KAKAO_JAVASCRIPT_APP_KEY! })
}, 2000)
</script>

<template>
  <KakaoMap :center="{ lat: 36.5, lng: 127 }" :level="3" style="width: 100%; height: 95vh;">
    <MapTypeControl position="TOPRIGHT" />
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
  </KakaoMap>
  <button @click="show = !show">reverse</button>
</template>

<style scoped></style>