import { LatLng } from './LatLng'

/**
 * WGS84 좌표계에서 사각영역 정보
 */
export interface LatLngBounds {
  /**
   * 사각 영역에서 남서쪽 좌표
   */
  sw: LatLng
  /**
   * 사각 영역에서 북동쪽 좌표
   */
  ne: LatLng
}
