import type { ControlPosition } from '../types/ControlPosition'
import type { CopyrightPosition } from '../types/CopyrightPosition'
import type { LatLng } from '../types/LatLng'
import type { MapTypeId } from '../types/MapTypeId'

export function createLatLng(latLng: LatLng): kakao.maps.LatLng {
  if ('latitude' in latLng && 'longitude' in latLng) {
    return new kakao.maps.LatLng(latLng.latitude, latLng.longitude)
  } else {
    return new kakao.maps.LatLng(latLng.lat, latLng.lng)
  }
}

export function createMapTypeId(mapTypeId: MapTypeId): kakao.maps.MapTypeId {
  return kakao.maps.MapTypeId[mapTypeId]
}

export function createCopyrightPosition(
  copyrightPosition: CopyrightPosition
): kakao.maps.CopyrightPosition {
  return kakao.maps.CopyrightPosition[copyrightPosition]
}

export function createControlPosition(position: ControlPosition): kakao.maps.ControlPosition {
  return kakao.maps.ControlPosition[position]
}
