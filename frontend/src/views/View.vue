<template>
    <h1>{{ slide.title }}</h1>
    <canvas id="pdf-canvas"></canvas>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Slide, renderPdf } from '@/components/SlideView.ts';
import router from '@/router';
import { useRoute } from 'vue-router';

const route = useRoute();

const slide = new Slide(String(route.params.id));

watch(() => slide.path.value, () => {
    renderPdf(slide.path.value, "pdf-canvas");
}, { immediate: true });
</script>