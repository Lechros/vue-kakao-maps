/**
 * 마커 클러스터링 옵션
 */
export interface MarkerClustererProps {
  /**
   * 클러스터의 격자 크기. 화면 픽셀 단위이며 해당 격자 영역 안에 마커가 포함되면 클러스터에 포함시킨다 (default : 60)
   */
  gridSize?: number
  /**
   * 마커들의 좌표 평균을 클러스터 좌표 설정 여부 (default : false)
   */
  averageCenter?: boolean
  /**
   * 클러스터링 할 지도의 최소 레벨 값. 지정한 숫자에 해당하는 레벨 미만에서는 클러스터링 하지 않는다 (default : 0)
   */
  minLevel?: number
  /**
   * 클러스터링 할 최소 마커 수 (default: 2)
   */
  minClusterSize?: number
  /**
   * 클러스터의 스타일. 여러개를 선언하면 `calculator` 로 구분된 사이즈 구간마다 서로 다른 스타일을 적용시킬 수 있다
   */
  styles?: CSSStyleValue[]
  /**
   * 클러스터에 표시할 문자열 또는 문자열 생성 함수. (default : 클러스터에 포함된 숫자)
   */
  texts?: string[] | ((size: number) => string)
  /**
   * 클러스터 크기를 구분하는 값을 가진 배열 또는 구분값 생성함수 (default : [10, 100, 1000, 10000])
   */
  calculator?: number[] | ((size: number) => number[])
  /**
   * 클러스터 클릭 시 지도 확대 여부. true로 설정하면 클러스터 클릭 시 확대 되지 않는다 (default: false)
   */
  disableClickZoom?: boolean
  /**
   * 클러스터 클릭 가능 여부 지정 옵션. false일 경우 클러스터의 clusterclick, clusterdblclick, clusterrightclick 이벤트가 발생하지 않으며, 커서가 변경되지 않는다. (default: true)
   */
  clickable?: boolean
  /**
   * 클러스터에 마우스 over/out 가능 여부 지정 옵션. false일 경우 클러스터의 clusterover, clusterout 이벤트가 발생하지 않는다. (default: true)
   */
  hoverable?: boolean
}
