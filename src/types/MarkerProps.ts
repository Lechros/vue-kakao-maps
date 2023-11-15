import type { LatLng } from '@/types/LatLng'

export interface MarkerProps {
  /**
   * 마커의 좌표
   */
  position: LatLng
  /**
   * 마커의 이미지
   */
  image?: {
    src: string
    size: {
      width: number
      height: number
    }
    options?: {
      alt?: string
      coords?: string
      offset?: { x: number; y: number }
      shape?: 'default' | 'rect' | 'circle' | 'poly'
      spriteOrigin?: { x: number; y: number }
      spriteSize?: { width: number; height: number }
    }
  }
  /**
   * 마커의 표시 여부
   */
  visible?: boolean
  /**
   * 마커 엘리먼트의 타이틀 속성 값 (툴팁)
   */
  title?: string
  /**
   * 드래그 가능한 마커, 로드뷰에 올릴 경우에는 유효하지 않다
   */
  draggable?: boolean
  /**
   * 클릭 가능한 마커
   */
  clickable?: boolean
  /**
   * 마커 엘리먼트의 z-index 속성 값
   */
  zIndex?: number
  /**
   * 마커 투명도 (0-1)
   */
  opacity?: number
  /**
   * 로드뷰에 올라있는 마커의 높이 값(m 단위)
   */
  altitude?: number
  /**
   * 로드뷰 상에서 마커의 가시반경(m 단위), 두 지점 사이의 거리가 지정한 값보다 멀어지면 마커는 로드뷰에서 보이지 않게 된다
   */
  range?: number
}
