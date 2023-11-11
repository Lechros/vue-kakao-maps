<script setup lang="ts">
import KakaoMap from '@/components/KakaoMap.vue';
import MapTypeControl from '@/components/MapTypeControl.vue';
import { ref } from 'vue';
import { useKakaoLoader } from './composables/useKakaoLoader';
import ZoomControl from './components/ZoomControl.vue';

const show = ref(true);
setTimeout(() =>
  useKakaoLoader({ appKey: import.meta.env.VITE_KAKAO_JAVASCRIPT_APP_KEY! }), 2000)
</script>

<template>
  <KakaoMap :center="{ latitude: 36.5, longitude: 127 }" :level="3" style="width: 100%; height: 95vh;" v-if="show">
    <MapTypeControl position="TOPRIGHT" />
    <ZoomControl position="BOTTOMRIGHT" />
  </KakaoMap>
  <button @click="show = !show">reverse</button>
</template>

<style scoped></style>