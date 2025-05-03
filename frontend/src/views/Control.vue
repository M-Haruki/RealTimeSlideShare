<template>
    <slide-title>
        [ {{ slide.title }} ] (Control)
    </slide-title>
    <canvas id="pdf-canvas" class="pdf-canvas"></canvas>
    <div class="control">
        <RouterLink :to="{ name: 'share', params: { id: slide.id } }">Share</RouterLink>
        <p>page:{{ slide.current_page.value + 1 }}/{{ slide.total_page }}</p>
        <div>
            <button v-if="slide.isGo.value.prev" @click="go(-1)">Back</button>
            <button v-else disabled>Back</button>
            <button v-if="slide.isGo.value.next" @click="go(1)">Next</button>
            <button v-else disabled>Next</button>
            <button @click="end()">End</button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Slide, renderPdf } from '@/components/SlideView.ts';
import router from '@/router';
import { useRoute } from 'vue-router';
import SlideTitle from '@/components/SlideTitle.vue';

const route = useRoute();

const slide = new Slide(String(route.params.id));

function go(num: number) {
    slide.go(num);
}
function end() {
    if (confirm('本当に終了しますか? この操作は取り消せません。')) {
        slide.delete(
            () => {
                alert('プレゼンテーションを終了しました')
                router.push('/')
            }
        );
    }
}

watch(() => slide.path.value, () => {
    renderPdf(slide.path.value, "pdf-canvas");
}, { immediate: true });
</script>
<style scoped>
.pdf-canvas {
    width: 100vw !important;
    height: auto !important;
    overflow: auto;
    height: 70vh !important;
}

.control {
    height: 20vh;
}
</style>
<style>
.slideTitle {
    height: 10vh;
}
</style>