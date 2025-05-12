<template>
    <div>
        <PresenHeader :presen="presen" mode="view" />
        <iframe id="pdfviewer" :key="(presen.current_page.value ?? -1)" ref="pdfviewer"
            :onload="() => pdfviewerStyling(pdfviewer)" :src="`/pdfjs/web/viewer.html?file=${presen.path}`"
            frameborder="0" />
    </div>
</template>

<script setup lang="ts">
const presen = new Presentation(useRoute().params.id as string)
const pdfviewer = ref<HTMLIFrameElement | null>(null)
</script>

<style scoped lang="scss">
iframe {
    display: block; // これでiframeの外の余白を消す
    width: 100vw;
    height: calc(100vh - $header-height - $footer-height);
}
</style>