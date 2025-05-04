<template>
    <div>
        <h1>{{ slide.title }}</h1>
        <p>スライドのページ数: {{ slide.total_page }}</p>
        <p>現在のページ: {{ slide.current_page }}</p>
        <button v-if="slide.isGo.value.prev" @click="slide.go(slide.current_page.value - 1)">Back</button>
        <button v-else disabled>Back</button>
        <button v-if="slide.isGo.value.next" @click="slide.go(slide.current_page.value + 1)">Next</button>
        <button v-else disabled>Next</button>
        <button @click="deleteSlide">削除</button>
    </div>
</template>
<script setup lang="ts">
const slide = new Slide(useRoute().params.id as string)

function deleteSlide() {
    if (!confirm('本当に削除しますか？')) return
    slide.delete(() => {
        alert('削除しました')
        navigateTo('/')
    })
}

</script>