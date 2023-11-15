export interface TilesetCopyrightProps {
  /**
   * 기본적으로 출력되는 카피라이트
   */
  msg: string
  /**
   * 지도 영역이 작아졌을 때 출력되는 짧은 카피라이트
   */
  shortMsg: string
  /**
   * 해당 카피라이트가 노출될 최소 줌 레벨(기본값: 0)
   */
  minZoom?: number
}
