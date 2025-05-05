<template>
    <div>
        <NuxtLink :to="`/${slide.id}/share`">share</NuxtLink>
        <h1>{{ slide.title }}</h1>
        <iframe id="pdfviewer" :key="(slide.current_page.value ?? -1)" :onload="() => pdfviewerStyling()"
            :src="`/pdfjs/web/viewer.html?file=${slide.path}`" frameborder="0" />
    </div>
</template>
<script setup lang="ts">
const slide = new Slide(useRoute().params.id as string)


</script>