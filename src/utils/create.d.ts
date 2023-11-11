import type { ControlPosition } from '@/types/ControlPosition'
import type { CopyrightPosition } from '@/types/CopyrightPosition'
import type { LatLng } from '@/types/LatLng'
import type { MapTypeId } from '@/types/MapTypeId'

export function createLatLng(latLng: LatLng): kakao.maps.LatLng

export function createMapTypeId(mapTypeId: MapTypeId): kakao.maps.MapTypeId

export function createCopyrightPosition(
  copyrightPosition: CopyrightPosition
): kakao.maps.CopyrightPosition

export function createControlPosition(position: ControlPosition): kakao.maps.ControlPosition
