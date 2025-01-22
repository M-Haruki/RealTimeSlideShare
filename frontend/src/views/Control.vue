<template>
    <h1>Control</h1>
    <canvas id="pdf-canvas"></canvas>
    <div>
        <button @click="go(1)">Next</button>
        <button @click="go(-1)">Back</button>
        <button @click="end()">End</button>
    </div>
    <p>page:{{ slide.current_page.value + 1 }}/{{ slide.total_page }}</p>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import Slide from '@/components/SlideView.ts';
import router from '@/router';
import { useRoute } from 'vue-router';

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
    slide.renderPdf(slide.path.value, "pdf-canvas");
}, { immediate: true });
</script>