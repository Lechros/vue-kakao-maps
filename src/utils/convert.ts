import type { ControlPosition } from '@/types/ControlPosition'
import type { CopyrightPosition } from '@/types/CopyrightPosition'
import type { LatLng } from '@/types/LatLng'
import type { LatLngBounds } from '@/types/LatLngBounds'
import type { MapTypeId } from '@/types/MapTypeId'

export function toKakaoLatLng(latLng: LatLng): kakao.maps.LatLng {
  return new kakao.maps.LatLng(latLng.lat, latLng.lng)
}

export function toLatLng(latLng: kakao.maps.LatLng): LatLng {
  return { lat: latLng.getLat(), lng: latLng.getLng() }
}

export function toLatLngBounds(bounds: kakao.maps.LatLngBounds): LatLngBounds {
  return {
    ne: toLatLng(bounds.getNorthEast()),
    sw: toLatLng(bounds.getSouthWest())
  }
}

export function toKakaoMapTypeId(mapTypeId: MapTypeId): kakao.maps.MapTypeId {
  return kakao.maps.MapTypeId[mapTypeId]
}

export function toKakaoCopyrightPosition(
  copyrightPosition: CopyrightPosition
): kakao.maps.CopyrightPosition {
  return kakao.maps.CopyrightPosition[copyrightPosition]
}

export function toKakaoControlPosition(position: ControlPosition): kakao.maps.ControlPosition {
  return kakao.maps.ControlPosition[position]
}
