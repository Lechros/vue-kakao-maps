/**
 * - `TOP` : 위 가운데를 의미한다. 아래로 쌓인다.
 * - `TOPLEFT` : 왼쪽 위를 의미한다. 오른쪽으로 쌓인다.
 * - `TOPRIGHT` : 오른쪽 위를 의미한다. 왼쪽으로 쌓인다.
 * - `LEFT` : 왼쪽 위를 의미한다. 아래로 쌓인다. (주의: 왼쪽 중앙을 의미하는 것이 아니다.)
 * - `RIGHT` : 오른쪽 위를 의미한다. 아래로 쌓인다. (주의: 오른쪽 중앙을 의미하는 것이 아니다.)
 * - `BOTTOMLEFT` : 왼쪽 아래를 의미한다. 오른쪽으로 쌓인다.
 * - `BOTTOM` : 아래 가운데를 의미한다. 위로 쌓인다.
 * - `BOTTOMRIGHT` : 오른쪽 아래를 의미한다. 왼쪽으로 쌓인다.
 */
export type ControlPosition =
  | 'TOP'
  | 'TOPLEFT'
  | 'TOPRIGHT'
  | 'LEFT'
  | 'RIGHT'
  | 'BOTTOM'
  | 'BOTTOMLEFT'
  | 'BOTTOMRIGHT'
