/**
 * - `ROADMAP` : 일반 지도
 * - `SKYVIEW` : 스카이뷰
 * - `HYBRID` : 하이브리드(스카이뷰 + 레이블)
 * - `ROADVIEW` : 로드뷰
 * - `OVERLAY` : 레이블
 * - `TRAFFIC` : 교통정보
 * - `TERRAIN` : 지형도
 * - `BICYCLE` : 자전거
 * - `BICYCLE_HYBRID` : 스카이뷰를 위한 자전거 (어두운 지도에서 활용)
 * - `USE_DISTRICT` : 지적편집도
 */
export type MapTypeId =
  | 'ROADMAP'
  | 'SKYVIEW'
  | 'HYBRID'
  | 'OVERLAY'
  | 'TERRAIN'
  | 'TRAFFIC'
  | 'BICYCLE'
  | 'BICYCLE_HYBRID'
  | 'USE_DISTRICT'
