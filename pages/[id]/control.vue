<template>
    <div>
        <SlideHeader :slide="slide" mode="control" />
        <div>
            <button v-if="slide.isGo.value.prev" @click="slide.go((slide.current_page.value ?? 0) - 1)">Back</button>
            <button v-else disabled>Back</button>
            <span>
                <input v-model="current_page_vmodel" type="text" @blur="commitInput">
                /
                {{ slide.total_page.value ?? 0 }}
            </span>
            <button v-if="slide.isGo.value.next" @click="slide.go((slide.current_page.value ?? 0) + 1)">Next</button>
            <button v-else disabled>Next</button>
        </div>
        <button @click="deleteSlide">削除</button>
        <iframe id="pdfviewer" :key="(slide.current_page.value ?? -1)" :onload="() => pdfviewerStyling()"
            :src="`/pdfjs/web/viewer.html?file=${slide.path}`" frameborder="0" />
    </div>
</template>

<script setup lang="ts">
const slide = new Slide(useRoute().params.id as string)
const current_page_vmodel = ref(0)
// slide.current_pageとの同期
watch(slide.current_page, (val) => {
    current_page_vmodel.value = (val ?? 0) + 1
})
// inputからフォーカスが離れたときに、正しい値か判定して、送信する
function commitInput() {
    if (current_page_vmodel.value < 1 || slide.total_page.value === null || current_page_vmodel.value > slide.total_page.value) {
        // 値を修正する
        current_page_vmodel.value = (slide.current_page.value ?? 0) + 1
        return
    }
    slide.go(current_page_vmodel.value - 1)
}
// delete処理
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