<template>
    <div>
        <header>
            <h1>
                <NuxtLink class="link" to="/">RealTimeSlideShare</NuxtLink>
            </h1>
        </header>
        <div class="content">
            <h2>{{ $t("register_h") }}</h2>
            <form @submit.prevent="createPresentation">
                <div class="group">
                    <label for="title">{{ $t("register_title") }}</label>
                    <input id="title" v-model="title" type="text" required maxlength="32" :disabled="isUploading">
                    <small>{{ $t("register_title_detail") }}</small>
                </div>
                <div class="group">
                    <label for="file">{{ $t("register_pdf") }}</label>
                    <input id="file" type="file" accept=".pdf" required :disabled="isUploading" @change="onFileChange">
                    <small>{{ $t("register_pdf_detail") }}</small>
                </div>
                <div class="group">
                    <button v-if="isUploading" disabled>{{ $t("register_button_processing") }}</button>
                    <button v-else type="submit">{{ $t("register_button") }}</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const { t } = useI18n()

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
        alert(t("register_alert_input"));
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
        alert(t("register_success_alert"));
        navigateTo(`${response.uuid}/control`);
    }).catch((error) => {
        isUploading.value = false;
        if (!error.data || !error.data.data || !error.data.data.reason) {
            alert(t("error_alert"));
            return;
        }
        switch (error.data.data.reason) {
            case "size":
                alert(t("register_error_alert_size"));
                break;
            case "content_type":
                alert(t("register_error_alert_content_type"));
                break;
            case "title_length":
                alert(t("register_error_alert_title_length"));
                break;
            case "page_num":
                alert(t("register_error_alert_page_num"));
                break;
            case "pdf_error":
                alert(t("register_error_alert_pdf_error"));
                break;
            default:
                alert(t("error_alert"));
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

        .link {
            color: $color-body-primary;
            text-decoration: none;
        }
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
        margin: 5px 0 15px 0;
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
            margin: 10px 0;

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