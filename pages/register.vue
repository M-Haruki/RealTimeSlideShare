<template>
    <div>
        <header>
            <h1>RealTimeSlideShare</h1>
        </header>
        <div class="content">
            <h2>Create New Presentation</h2>
            <form @submit.prevent="createPresentation">
                <div class="group">
                    <label for="title">Title</label>
                    <input id="title" v-model="title" type="text" required maxlength="32" :disabled="isUploading">
                    <small>Max 32 characters</small>
                </div>
                <div class="group">
                    <label for="file">PDF File</label>
                    <input id="file" type="file" accept=".pdf" required :disabled="isUploading" @change="onFileChange">
                    <small>Maximum 50 MB total, up to 50 pages, with each page no larger than 1 MB</small>
                </div>
                <div class="group">
                    <button v-if="isUploading" disabled>Uploading...</button>
                    <button v-else type="submit">Upload & Create</button>
                </div>
            </form>
        </div>
        <PresenFooter />
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
        if (!error.data || !error.data.reason) {
            alert('エラーが発生しました');
            return;
        }
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

<style scoped lang="scss">
header {
    width: 100vw;
    height: $header-height;
    background-color: $color-primary;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: $color-body-primary;
    padding: 8px;

    h1 {
        font-size: 1.5rem;
        font-weight: bold;
        align-items: center;
    }
}

.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    height: calc(100vh - $header-height - $footer-height);
    background-color: $color-tertiary;
    padding: 8px;
    color: $color-body-primary;

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        text-decoration: underline;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;
        width: 100%;

        .group {
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            width: 100%;
            margin: 15px 0;

            label {
                font-size: 1.2rem;
                margin-bottom: 5px;
                font-weight: bold;
            }

            small {
                font-size: 0.8rem;
                color: $color-body-primary;
            }

            input[type="text"] {
                width: 75%;
                max-width: 400px;
                height: 40px;
                font-size: 1.2rem;
                border-radius: 10px;
                border: none;
                padding: 5px;
                background-color: $color-white;
                color: $color-body-primary;
                text-align: center;

                &:disabled {
                    background-color: $color-gray;
                    cursor: not-allowed;
                }
            }

            input[type="file"] {
                width: 75%;
                max-width: 400px;
                font-size: 1rem;
                border-radius: 10px;
                border: none;
                padding: 5px;
                background-color: $color-white;
                color: $color-body-primary;
                text-align: center;

                &:disabled {
                    background-color: $color-gray;
                    cursor: not-allowed;
                }
            }


            button {
                font-weight: bold;
                width: 75%;
                max-width: 400px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                color: $color-body-primary;
                background-color: $color-secondary;
                font-size: 1.3rem;
                border-radius: 15px;
                border: none;

                &:disabled {
                    background-color: $color-gray;
                    cursor: not-allowed;
                }
            }
        }


    }
}
</style>