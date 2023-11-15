export interface TilesetProps {
  /**
   * 타일의 가로 크기
   */
  width: number
  /**
   * 타일의 세로 크기
   */
  height: number
  /**
   * 타일셋 오버레이표시 여부 (기본값: true)
   */
  show?: boolean
  /**
   * 타일 주소를 반환하는 함수. 세 개의 파라메터를 가진다.
   */
  urlFunc?: (x: number, y: number, z: number) => string
  /**
   * 어두운 타일인지 여부
   */
  dark?: boolean
  /**
   * 최소 레벨
   */
  minZoom?: number
  /**
   * 최대 레벨
   */
  maxZoom?: number
  /**
   * 타일 Element를 반환하는 함수. 세개의 파라미터를 가진다. urlFunc 옵션 대신 사용한다.
   */
  getTile?: (x: number, y: number, z: number) => HTMLElement
}
