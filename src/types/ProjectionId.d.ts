/**
 * `NONE` : 투영 없는 API 내부의 좌표계 자체. left-bottom을 (0,0)으로 하는 픽셀단위의 좌표계.
 *
 * `WCONG` : API 내부 좌표계를 WCongnamul좌표계로 투영. 외부에서 WCongnamul 좌표를 받아 사용가능.
 */
export type ProjectionId = 'NONE' | 'WCONG'
