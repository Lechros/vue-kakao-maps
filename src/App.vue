<script setup lang="ts">
import CustomOverlay from '@/components/CustomOverlay.vue'
import InfoWindow from '@/components/InfoWindow.vue'
import KakaoMap from '@/components/KakaoMap.vue'
import Marker from '@/components/Marker.vue'
import MarkerClusterer from '@/components/MarkerClusterer.vue'
import Tileset from '@/components/Tileset.vue'
import { useKakaoLoader } from '@/hooks/useKakaoLoader'
import { ref } from 'vue'

const showCustomOverlay = ref(false)

const pos = ref({ lat: 0, lng: 0 })
const open = ref(false)

const str = ref("hello")

const center = ref({ lat: 37.5013, lng: 127.0395 })
const centerOut = ref({ lat: 37.5013, lng: 127.0395 })
const level = ref(8)

const data = ref([])
let cnt = 0
fetch('https://apis.map.kakao.com/download/web/data/chicken.json')
  .then((res) => res.json())
  .then((json) => (data.value = json.positions.map(pos => ({ ...pos, id: cnt++ }))))
  .then(data => cnt = data.length)
setInterval(() => {
  for (let i = 0; i < 20; ++i) {
    const idx = Math.floor(Math.random() * data.value.length)
    data.value[idx].id = ++cnt
    data.value[idx].lat += 0.001
    data.value[idx].lng += 0.001
  }
}, 500)

function getFloodUrl(x: number, y: number, z: number) {
  const l = Math.pow(2, z) * 80
  const coords1 = new kakao.maps.Coords(x * l - 75000, y * l - 150000)
  const coords2 = new kakao.maps.Coords(x * l - 75000 + l, y * l - 150000 + l)
  const latLng1 = coords1.toLatLng()
  const latLng2 = coords2.toLatLng()
  return `https://geo.safemap.go.kr/geoserver/safemap/wms?LAYERS=A2SM_FLUDMARKS&STYLES=A2SM_FludMarks&FORMAT=image%2Fpng&EXCEPTIONS=text%2Fxml&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&SRS=EPSG%3A4326&BBOX=${latLng1.getLng()},${latLng1.getLat()},${latLng2.getLng()},${latLng2.getLat()}&WIDTH=256&HEIGHT=256`
}

function getTile(x, y, z) {
  const div = document.createElement('div')
  div.innerHTML = x + ', ' + y + ', ' + z
  div.style.fontSize = '36px'
  div.style.fontWeight = 'bold'
  div.style.lineHeight = '256px'
  div.style.textAlign = 'center'
  div.style.color = '#4D4D4D'
  div.style.border = '1px dashed #ff5050'
  return div
}

useKakaoLoader({ appKey: import.meta.env.VITE_KAKAO_JAVASCRIPT_APP_KEY!, libraries: ['clusterer'] })
</script>

<template>
  <KakaoMap pan :center="center" :level="level" style="width: 100%; height: 90vh" @click="({ latLng }) => (pos = latLng)"
    @center_changed="(ev) => { centerOut = ev.center; console.log(ev) }"
    @bounds_changed="(ev) => console.log('Bounds changed:', ev.bounds)"
    @load="({ bounds }) => console.log('Initial bounds:', bounds)">
    <Marker :position="pos" @mouseover="open = true" @mouseout="open = false">
      <InfoWindow :open="open">
        <div style="width: 100px; padding: 5px 5px">
          <div style="display: flex; gap: 4px">
            <span>Lat:</span><span>{{ pos.lat.toFixed(6) }}</span>
          </div>
          <div style="display: flex; gap: 4px">
            <span>Lng:</span><span>{{ pos.lng.toFixed(6) }}</span>
          </div>
        </div>
      </InfoWindow>
    </Marker>
    <MarkerClusterer average-center :min-level="10" @clusterover="(ev) => console.log(ev)">
      <Marker v-for="(pos, i) in data" :position="pos" :key="pos.id" />
    </MarkerClusterer>
    <!-- <CustomOverlay clickable v-for="(pos, i) in data" :position="pos" :key="pos.id">
      <div style="background-color: red">{{ str }}</div>
    </CustomOverlay> -->
    <CustomOverlay :position="{ lat: 37.5, lng: 127.1 }" :visible="showCustomOverlay">
      <div class="overlaybox">
        <div class="boxtitle">금주 영화순위</div>
        <div class="first">
          <div class="triangle text">1</div>
          <div class="movietitle text">드래곤 길들이기2</div>
        </div>
        <ul>
          <li class="up">
            <span class="number">2</span> <span class="title">명량</span>
            <span class="arrow up"></span> <span class="count">2</span>
          </li>
          <li>
            <span class="number">3</span> <span class="title">해적(바다로 간 산적)</span>
            <span class="arrow up"></span> <span class="count">6</span>
          </li>
          <li>
            <span class="number">4</span> <span class="title">해무</span>
            <span class="arrow up"></span> <span class="count">3</span>
          </li>
          <li>
            <span class="number">5</span> <span class="title">안녕, 헤이즐</span>
            <span class="arrow down"></span> <span class="count">1</span>
          </li>
        </ul>
      </div>
    </CustomOverlay>
    <Tileset :width="256" :height="256" :urlFunc="getFloodUrl" />
    <Tileset :width="256" :height="256" :getTile="getTile" />
  </KakaoMap>
  <button @click="showCustomOverlay = !showCustomOverlay">커스텀 오버레이 토글</button>
  <button @click="() => { str = Math.random().toFixed(3); console.log('changed to:', str) }">커스텀 오버레이 마커 내용 변경</button>
  <button @click="level = 5">zoom 5로 설정</button>
  <button @click="level = 6">zoom 6으로 설정</button>
  <button @click="level = 6; center = { lat: 37.5013, lng: 127.0395 }">zoom 6으로 설정하고 역삼으로 이동</button>
  <button @click="center = { lat: 37, lng: 127 }">37,127로 이동</button>
  클릭한 위치의 위도는 {{ pos.lat }}이고, 경도는 {{ pos.lng }}입니다.
  현재 위치: {{ centerOut.lat }}, {{ centerOut.lng }}
</template>

<style scoped>
.overlaybox {
  position: relative;
  width: 360px;
  height: 350px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/box_movie.png') no-repeat;
  padding: 15px 10px;
}

.overlaybox div,
ul {
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.overlaybox li {
  list-style: none;
}

.overlaybox .boxtitle {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png') no-repeat right 120px center;
  margin-bottom: 8px;
}

.overlaybox .first {
  position: relative;
  width: 247px;
  height: 136px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/thumb.png') no-repeat;
  margin-bottom: 8px;
}

.first .text {
  color: #fff;
  font-weight: bold;
}

.first .triangle {
  position: absolute;
  width: 48px;
  height: 48px;
  top: 0;
  left: 0;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/triangle.png') no-repeat;
  padding: 6px;
  font-size: 18px;
}

.first .movietitle {
  position: absolute;
  width: 100%;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  padding: 7px 15px;
  font-size: 14px;
}

.overlaybox ul {
  width: 247px;
}

.overlaybox li {
  position: relative;
  margin-bottom: 2px;
  background: #2b2d36;
  padding: 5px 10px;
  color: #aaabaf;
  line-height: 1;
}

.overlaybox li span {
  display: inline-block;
}

.overlaybox li .number {
  font-size: 16px;
  font-weight: bold;
}

.overlaybox li .title {
  font-size: 13px;
}

.overlaybox ul .arrow {
  position: absolute;
  margin-top: 8px;
  right: 25px;
  width: 5px;
  height: 3px;
  background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/updown.png') no-repeat;
}

.overlaybox li .up {
  background-position: 0 -40px;
}

.overlaybox li .down {
  background-position: 0 -60px;
}

.overlaybox li .count {
  position: absolute;
  margin-top: 5px;
  right: 15px;
  font-size: 10px;
}

.overlaybox li:hover {
  color: #fff;
  background: #d24545;
}

.overlaybox li:hover .up {
  background-position: 0 0px;
}

.overlaybox li:hover .down {
  background-position: 0 -20px;
}
</style>
