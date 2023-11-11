import { CopyrightPosition } from './CopyrightPosition.d'
import { LatLng } from './LatLng'
import { MapTypeId } from './MapTypeId'

export interface KakaoMapProps {
  /**
   * 중심 좌표 (필수)
   */
  center: LatLng
  /**
   * 확대 수준 (기본값: `3`)
   */
  level?: number
  /**
   * 지도 종류 (기본값: 일반 지도)
   */
  mapTypeId?: MapTypeId
  /**
   * 마우스 드래그, 휠, 모바일 터치를 이용한 시점 변경(이동, 확대, 축소) 가능 여부
   */
  draggable?: boolean
  /**
   * 마우스 휠, 모바일 터치를 이용한 확대 및 축소 가능 여부
   */
  zoomable?: boolean
  /**
   * 더블클릭 이벤트 및 더블클릭 확대 가능 여부
   */
  disableDoubleClick?: boolean
  /**
   * 더블클릭 확대 가능 여부
   */
  disableDoubleClickZoom?: boolean
  // /**
  //  * 투영법 지정 (기본값: `"WCONG"`)
  //  */
  // projectionId?: ProjectionId
  /**
   * 지도 타일 애니메이션 설정 여부 (기본값: `true`)
   */
  tileAnimation?: boolean
  /**
   * 키보드의 방향키와 +, – 키로 지도 이동,확대,축소 가능 여부 (기본값: `false`)
   */
  keyboardShortcuts?: boolean | { /** 지도 이동 속도 */ speed: number }
  /**
   * 최저 레벨 값
   */
  minLevel?: number
  /**
   * 최고 레벨 값
   */
  maxLevel?: number
  /**
   * Copyright의 위치를 설정한다
   */
  copyrightPosition?: CopyrightPosition
  /**
   * Copyright의 로고와의 위치를 반전시킨다
   */
  copyrightReversed?: boolean
  /**
   * 지도 위에 마우스 커서가 위치할 경우 보여지는 커서의 스타일을 지정한다.
   */
  cursorStyle?: string
  /**
   * 중심 좌표 이동 시 부드럽게 이동 여부 (기본값: `false`)
   */
  pan?: boolean
}
