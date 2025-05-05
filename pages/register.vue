<template>
    <div>
        <h1>新規プレゼンテーションの作成</h1>
        <form @submit.prevent="createPresentation">
            <label for="title">タイトル</label>
            <input id="title" v-model="title" type="text" required maxlength="32">
            <small>32字以内</small>
            <br>
            <label for="file">PDFファイル</label>
            <input id="file" type="file" accept=".pdf" required @change="onFileChange">
            <small>50MB以内、50ページ以内、1ページあたり最大1MB</small>
            <br>
            <p v-if="isUploading">アップロード中</p>
            <button v-else type="submit">アップロード&作成</button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const title = ref('')
const files = ref<FileList | null>(null)
const isUploading = ref(false)

function onFileChange(event: Event) {
    const target = event.target as HTMLInputElement
    files.value = target.files ?? null
    // ファイル選択時にファイル名を表示
    if (files.value && title.value == "") {
        title.value = files.value[0].name.replace(/\.pdf$/, '')
    }
};

function createPresentation() {
    isUploading.value = true;
    if (!title.value || title.value == "" || !files.value) {
        alert('タイトルとファイルを入力してください');
        return;
    }
    const formData = new FormData();
    formData.append('file', files.value[0], title.value + '.pdf');
    $fetch(`/api/register?title=${title.value}`, {
        method: 'POST',
        body: formData,
        // contentTypeを設定したらエラーが出たので、設定しない
    }).then((response) => {
        isUploading.value = false;
        alert('プレゼンテーションを作成しました');
        navigateTo(`/${response.uuid}/control`);
    }).catch((error) => {
        isUploading.value = false;
        switch (error.data.data.reason) {
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
            case "pdf_error":
                alert('PDF処理エラーです');
                break;
            default:
                alert('エラーが発生しました');
                break;
        }
    });
};
</script>