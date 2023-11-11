# vue-kakao-maps

[Kakao Maps API](https://apis.map.kakao.com/web/)를 vue에서 사용할 수 있도록 도와주는 라이브러리입니다.

[react-kakao-maps-sdk](https://github.com/JaeSeoKim/react-kakao-maps-sdk/)를 참고했습니다.

## Usage

이 라이브러리를 사용하기 위해서는 필수적으로 Kakao 지도 API를 불러와야 합니다.

[Kakao Maps Javascript API](https://apis.map.kakao.com/web/guide/)

### HTML Script Tag를 이용하여 Kakao Maps API 불러오기

```html
<script
  type="text/javascript"
  src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은 APP KEY를 넣으시면 됩니다.&libraries=services,clusterer"
></script>
```

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
import { KakaoMap, MapTypeControl, ZoomControl } from 'vue-kakao-maps'
</script>

<KakaoMap :center="{ lat: 37.5013, lng: 127.0395 }" style="width: 100%; height: 500px">
  <MapTypeControl position="TOPRIGHT" />
  <ZoomControl position="RIGHT" />
</KakaoMap>
```

### 맵 위에 마커와 인포윈도우 올리기

```vue
<script setup>
import { KakaoMap, Marker, InfoWindow } from 'vue-kakao-maps'
</script>

<KakaoMap :center="{ lat: 37.5013, lng: 127.0395 }" style="width: 100%; height: 500px">
  <Marker :position="{ lat: 37.5013, lng: 127.0395 }">
    <InfoWindow open>
      Hello World!
    </InfoWindow>
  </Marker>
</KakaoMap>
```

## Working list

- Map
  - Marker
  - InfoWindow
  - MapTypeControl
  - ZoomControl
