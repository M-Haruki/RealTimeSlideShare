<template>
    <h1>新規プレゼンテーションの作成</h1>
    <form @submit.prevent="createPresentation">
        <label for="title">タイトル</label>
        <input type="text" id="title" v-model="title" required maxlength="32" />
        <small>32字以内</small>
        <br />
        <label for="file">PDFファイル</label>
        <input type="file" id="file" @change="onFileChange" accept=".pdf" required />
        <small>50MB以内、50ページ以内、1ページあたり最大1MB</small>
        <br />
        <p v-if="isUploading">アップロード中</p>
        <button v-else type="submit">アップロード&作成</button>
    </form>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '@/router'

const title = ref('')
const file = ref('')
const isUploading = ref(false)

function onFileChange(event: Event) {
    file.value = event?.target?.files;
};

async function createPresentation() {
    isUploading.value = true;
    if (!title.value || !file.value) {
        alert('タイトルとファイルを入力してください');
        return;
    }
    const formData = new FormData();
    formData.append('ufile', file.value[0]);
    await axios({
        method: 'post',
        url: `http://localhost:8000/create?title=${title.value}`,
        data: formData,
        withCredentials: true,
    }).then((response) => {
        isUploading.value = false;
        alert('プレゼンテーションを作成しました');
        router.push(`/${response.data.presentation_id}/control`);
    }).catch((error) => {
        isUploading.value = false;
        switch (error.response.data.detail.reason) {
            case "size":
                alert('ファイルのサイズが50MB以上です');
                break;
            case "content_type":
                alert('PDF以外のファイルは受け付けられません');
                break;
            case "title_length":
                alert('タイトルが32字を超えています');
                break;
            case "page_num":
                alert('ページ数が50ページ以上です');
                break;
            case "page_size":
                alert('1ページのPDFデータが1MB以上です');
                break;
            case "pdf_error":
                alert('PDF処理エラーです');
                break;
            default:
                alert('エラーが発生しました');
                break;
        }
    });
}
</script>