<template>
    <div>
        <NuxtLink :to="`/${slide.id}/share`">share</NuxtLink>
        <h1>{{ slide.title }}</h1>
        <p>page:{{ (slide.current_page.value ?? -1) + 1 }}/{{ slide.total_page.value ?? 0 }}</p>
        <button v-if="slide.isGo.value.prev" @click="slide.go((slide.current_page.value ?? 0) - 1)">Back</button>
        <button v-else disabled>Back</button>
        <button v-if="slide.isGo.value.next" @click="slide.go((slide.current_page.value ?? 0) + 1)">Next</button>
        <button v-else disabled>Next</button>
        <button @click="deleteSlide">削除</button>
        <iframe id="pdfviewer" :key="(slide.current_page.value ?? -1)" :onload="() => pdfviewerStyling()"
            :src="`/pdfjs/web/viewer.html?file=${slide.path}`" frameborder="0" />
    </div>
</template>

<script setup lang="ts">
const slide = new Slide(useRoute().params.id as string)
function deleteSlide() {
    if (!confirm('本当に削除しますか？')) return
    slide.delete(() => {
        navigateTo('/')
    })
}
</script>
<style scoped>
#pdfviewer {
    width: 100%;
    height: 50vh;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}
</style>