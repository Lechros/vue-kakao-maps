import type { LatLng } from './LatLng'

export interface CustomOverlayProps {
  /**
   * true 로 설정하면 컨텐츠 영역을 클릭했을 경우 지도 이벤트를 막아준다.
   */
  clickable?: boolean
  /**
   * 커스텀 오버레이의 좌표 또는 로드뷰에서의 시점
   */
  position: LatLng
  /**
   * 컨텐츠의 x축 위치. 0_1 사이의 값을 가진다. 기본값은 0.5
   */
  xAnchor?: number
  /**
   * 컨텐츠의 x축 위치. 0_1 사이의 값을 가진다. 기본값은 0.5
   */
  yAnchor?: number
  /**
   * 커스텀 오버레이의 표시 여부
   */
  visible?: boolean
  /**
   * 커스텀 오버레이의 z-index
   */
  zIndex?: number
  /**
   * 로드뷰상에서 커스텀 오버레이의 높이(위치)
   */
  altitude?: number
  /**
   * 커스텀 오버레이의 가시반경
   * 로드뷰의 위치와 커스텀 오버레이의 위치 사이의 거리가 가시반경 이내일 경우에만 로드뷰상에 노출된다.
   */
  range?: number
}
