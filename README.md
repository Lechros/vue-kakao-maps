# vue-kakao-maps

[Kakao Maps API](https://apis.map.kakao.com/web/)를 vue에서 사용할 수 있도록 도와주는 라이브러리입니다.

[react-kakao-maps-sdk](https://github.com/JaeSeoKim/react-kakao-maps-sdk/)를 참고했습니다.

## Usage

이 라이브러리를 사용하기 위해서는 필수적으로 Kakao 지도 API를 불러와야 합니다.

[Kakao Maps Javascript API](https://apis.map.kakao.com/web/guide/)

### Hook(Composable)을 이용하여 Kakao Maps API 불러오기

```vue
<script setup>
import { useKakaoLoader, KakaoLoader } from 'vue-kakao-maps'

KakaoLoader.addLoadEventListener(() => console.log('ok'))
KakaoLoader.addErrorEventListener((err) => console.error(err))

useKakaoLoader({
  appKey: '...', // 발급 받은 APP KEY
  ...options // 추가 옵션
})
</script>
```

### HTML Script Tag를 이용하여 Kakao Maps API 불러오기

```html
<script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은 APP KEY를 넣으시면 됩니다.&libraries=services,clusterer"
></script>
```

## Install

```bash
npm i vue-kakao-maps
# or
yarn add vue-kakao-maps
# or
pnpm i vue-kakao-maps
```

## Sample

### 맵 위에 컨트롤 올리기

```vue
<script setup>
import { KakaoMap, MapTypeControl, ZoomControl, useKakaoLoader } from 'vue-kakao-maps'

useKakaoLoader({ appKey: '...' })
</script>

<KakaoMap :center="{ lat: 37.5013, lng: 127.0395 }" style="width: 100%; height: 500px">
  <MapTypeControl position="TOPRIGHT" />
  <ZoomControl position="RIGHT" />
</KakaoMap>
```

### 맵 위에 마커와 인포윈도우 올리기

```vue
<script setup>
import { KakaoMap, Marker, InfoWindow, useKakaoLoader } from 'vue-kakao-maps'

useKakaoLoader({ appKey: '...' })
</script>

<KakaoMap :center="{ lat: 37.5013, lng: 127.0395 }" style="width: 100%; height: 500px">
  <Marker :position="{ lat: 37.5013, lng: 127.0395 }">
    <InfoWindow open>
      Hello World!
    </InfoWindow>
  </Marker>
</KakaoMap>
```

### 맵 위에 커스텀 오버레이 올리기

```vue
<script setup>
import { KakaoMap, CustomOverlay, useKakaoLoader } from 'vue-kakao-maps'

useKakaoLoader({ appKey: '...' })
</script>

<KakaoMap :center="{ lat: 37.5013, lng: 127.0395 }" style="width: 100%; height: 500px">
  <CustomOverlay :position="{ lat: 37.5013, lng: 127.0395 }">
    <div class="overlay_info">
      <a href="https://place.map.kakao.com/17600274" target="_blank"><strong>월정리 해수욕장</strong></a>
      <div class="desc">
        <img src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/place_thumb.png" alt="">
        <span class="address">제주특별자치도 제주시 구좌읍 월정리 33-3</span>
      </div>
    </div>
  </CustomOverlay>
</KakaoMap>
```

### 마커 클러스터러 사용하기

```vue
<script setup>
import { KakaoMap, CustomOverlay, useKakaoLoader } from 'vue-kakao-maps'

useKakaoLoader({ appKey: '...', libraries: ['clusterer'] })

const data = ref([])
fetch('https://apis.map.kakao.com/download/web/data/chicken.json')
  .then((res) => res.json())
  .then((json) => (data.value = json.positions))
</script>

<KakaoMap :center="{ lat: 37.5013, lng: 127.0395 }" style="width: 100%; height: 500px">
  <MarkerClusterer average-center :min-level="10">
    <Marker v-for="(pos, i) in data" :position="pos" :key="i" />
  </MarkerClusterer>
</KakaoMap>
```

### 커스텀 타일셋2

```vue
<script setup>
import { KakaoMap, Tileset, useKakaoLoader } from 'vue-kakao-maps'

useKakaoLoader({ appKey: '...' })

function getTile(x, y, z) {
  const div = document.createElement('div');
  div.innerHTML = x + ', ' + y + ', ' + z;
  div.style.fontSize = '36px';
  div.style.fontWeight = 'bold';
  div.style.lineHeight = '256px'
  div.style.textAlign = 'center';
  div.style.color = '#4D4D4D';
  div.style.border = '1px dashed #ff5050';
  return div;
}

<KakaoMap :center="{ lat: 37.5013, lng: 127.0395 }" style="width: 100%; height: 500px">
  <Tileset :width="256" :height="256" :getTile="getTile" />
</KakaoMap>
```

## Working list

- Map
  - Marker
  - InfoWindow
  - MapTypeControl
  - ZoomControl
  - CustomOverlay
  - MarkerClusterer
  - Tileset
