<script setup lang="ts">
import { onUnmounted, provide, ref, shallowRef, useSlots, watch } from "vue";
import { useMap } from "../hooks/useMap";
import type { MarkerClustererProps } from "../types/MarkerClustererProps";

const props = withDefaults(defineProps<MarkerClustererProps>(), {
    gridSize: 60,
    averageCenter: false,
    minLevel: 0,
    minClusterSize: 2,
    styles: undefined,
    texts: undefined,
    calculator: undefined,
    disableClickZoom: false,
    clickable: true,
    hoverable: true
})

const emit = defineEmits<{
    clusterclick: [cluster: kakao.maps.Cluster]
    clusterover: [cluster: kakao.maps.Cluster]
    clusterout: [cluster: kakao.maps.Cluster]
    clusterdblclick: [cluster: kakao.maps.Cluster]
    clusterrightclick: [cluster: kakao.maps.Cluster]
    clustered: [cluster: kakao.maps.Cluster]
}>()

// clusterer 객체 설정
const clusterer = shallowRef<kakao.maps.MarkerClusterer>(null)
const map = useMap("MarkerClusterer")
// Marker가 모두 추가된 후 MarkerCluster.redraw 호출하기 위해 로드된 개수 추적
const slots = useSlots()
const count = ref(0)
// context 제공
provide('clusterer', { clusterer, count })

watch(map, (map) => {
    if (!map) return
    if (clusterer.value) return

    if (window.kakao && window.kakao.maps && !window.kakao.maps.MarkerClusterer) {
        throw new Error("MarkerClusterer: clusterer 라이브러리가 로드되지 않았습니다.\n"
            + "KakaoLoader를 사용할 경우 options.libraries에 'clusterer'를 추가해주세요.")
    }

    const options = createOptions(props)
    clusterer.value = new kakao.maps.MarkerClusterer(options)
}, { immediate: true })

const markerMountedWatcher = watch(count, (count) => {
    if (count === slots.default()[0].children.length) {
        clusterer.value.redraw()
        markerMountedWatcher()
    }
}, { flush: "post" })

watch([clusterer, () => props.gridSize], ([clusterer, gridSize], [, _gridSize]) => {
    if (!clusterer) return
    if (gridSize === _gridSize) return
    clusterer.setGridSize(gridSize)
    clusterer.redraw()
})

watch([clusterer, () => props.minClusterSize], ([clusterer, minClusterSize], [, _minClusterSize]) => {
    if (!clusterer) return
    if (minClusterSize === _minClusterSize) return
    clusterer.setMinClusterSize(minClusterSize)
    clusterer.redraw()
})

watch([clusterer, () => props.averageCenter], ([clusterer, averageCenter], [, _averageCenter]) => {
    if (!clusterer) return
    if (averageCenter === _averageCenter) return
    clusterer.setAverageCenter(averageCenter)
    clusterer.redraw()
})

watch([clusterer, () => props.minLevel], ([clusterer, minLevel], [, _minLevel]) => {
    if (!clusterer) return
    if (minLevel === _minLevel) return
    clusterer.setMinLevel(minLevel)
    clusterer.redraw()
})

watch([clusterer, () => props.texts], ([clusterer, texts], [, _texts]) => {
    if (!clusterer) return
    if (texts === _texts) return
    clusterer.setTexts(texts)
    clusterer.redraw()
})

watch([clusterer, () => props.calculator], ([clusterer, calculator], [, _calculator]) => {
    if (!clusterer) return
    if (calculator === _calculator) return
    clusterer.setCalculator(calculator)
    clusterer.redraw()
})

watch([clusterer, () => props.styles], ([clusterer, styles], [, _styles]) => {
    if (!clusterer) return
    if (styles === _styles) return
    clusterer.setStyles(styles)
    clusterer.redraw()
})

onUnmounted(() => {
    if (!map.value) return

    clusterer.value.setMap(null)
})

// 지도 Event emit
const listeners: Record<string, () => void> = {};
watch([clusterer, map], ([clusterer,]) => {
    if (!window.kakao || !window.kakao.maps) return
    if (!clusterer) return

    addListener(clusterer, 'clusterclick', listeners)
    addListener(clusterer, 'clusterover', listeners)
    addListener(clusterer, 'clusterout', listeners)
    addListener(clusterer, 'clusterdblclick', listeners)
    addListener(clusterer, 'clusterrightclick', listeners)
    addListener(clusterer, 'clustered', listeners)
}, { immediate: true })

function addListener(clusterer: kakao.maps.MarkerClusterer, type: any, listeners: Record<string, Function>) {
    if (type in listeners) {
        kakao.maps.event.removeListener(clusterer, type, listeners[type])
    }
    listeners[type] = (event) => emit(type, event)
    kakao.maps.event.addListener(clusterer, type, listeners[type])
}

function createOptions(props: MarkerClustererProps): kakao.maps.MarkerClustererOptions {
    return {
        ...props,
        map: map.value
    }
}
</script>

<template>
    <slot></slot>
</template>