import type { LatLng } from '@/types/LatLng'

export interface MapMouseEvent {
  /**
   * 지도 좌표
   */
  latLng: LatLng

  /**
   * 화면 좌표
   */
  point: kakao.maps.Point & { x: number; y: number }
}
