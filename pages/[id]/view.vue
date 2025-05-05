<template>
    <div>
        <SlideHeader :slide="slide" mode="view" />
        <iframe id="pdfviewer" :key="(slide.current_page.value ?? -1)" :onload="() => pdfviewerStyling()"
            :src="`/pdfjs/web/viewer.html?file=${slide.path}`" frameborder="0" />
        <SlideFooter />
    </div>
</template>

<script setup lang="ts">
const slide = new Slide(useRoute().params.id as string)
</script>

<style scoped lang="scss">
iframe {
    display: block; // これでiframeの外の余白を消す
    width: 100vw;
    height: calc(100vh - $header-height - $footer-height);
    background-color: $color-body-primary;
}
</style>