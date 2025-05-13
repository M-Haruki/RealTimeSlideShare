
<template>
    <div>
        <PresenHeader :presen="presen" mode="control" />
        <div class="content">
            <iframe id="pdfviewer" :key="(presen.current_page.value ?? -1)" ref="pdfviewer"
                :onload="() => pdfviewerStyling(pdfviewer)" :src="`${runtimeConfig.app.baseURL}pdfjs/web/viewer.html?file=${presen.path}`"
                frameborder="0" />
            <div class="page-controller">
                <div class="button prev" :class="presen.isGo.value.prev ? '' : 'disabled'"
                    @click="presen.isGo.value.prev && presen.go((presen.current_page.value ?? 0) - 1)">
                    <Icon name="humbleicons:arrow-left" />
                </div>
                <span class="page-number">
                    <input v-model="current_page_vmodel" type="text" @blur="commitInput">
                    /
                    {{ presen.total_page.value ?? 0 }}
                </span>
                <div class="button next" :class="presen.isGo.value.next ? '' : 'disabled'"
                    @click="presen.isGo.value.next && presen.go((presen.current_page.value ?? 0) + 1)">
                    <Icon name="humbleicons:arrow-right" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const presen = new Presentation(useRoute().params.id as string)
const current_page_vmodel = ref(0)
const pdfviewer = ref<HTMLIFrameElement | null>(null)
const runtimeConfig = useRuntimeConfig()
// presen.current_pageとの同期
watch(presen.current_page, (val) => {
    current_page_vmodel.value = (val ?? 0) + 1
})
// inputからフォーカスが離れたときに、正しい値か判定して、送信する
function commitInput() {
    if (current_page_vmodel.value < 1 || presen.total_page.value === null || current_page_vmodel.value > presen.total_page.value) {
        // 値を修正する
        current_page_vmodel.value = (presen.current_page.value ?? 0) + 1
        return
    }
    presen.go(current_page_vmodel.value - 1)
}
</script>

<style scoped lang="scss">
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: calc(100vh - $header-height - $footer-height);

    iframe {
        display: block; // これでiframeの外の余白を消す
        width: 100vw;
        height: 100%;
    }

    .page-controller {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 80px;
        background-color: $color-primary;
        padding: 10px 0;

        .button {
            width: 80px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            color: $color-body-primary;
            background-color: $color-secondary;
            font-size: 3rem;
            border-radius: 10px;
            margin: 0 10px;

            &.disabled {
                background-color: $color-gray;
                cursor: not-allowed;
            }
        }

        .page-number {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 1.5rem;
            color: $color-body-primary;

            input {
                width: 50px;
                height: 75%;
                font-size: 1.5rem;
                text-align: center;
                border-radius: 10px;
                border: none;
                background-color: $color-secondary;
                color: $color-body-primary;

                &:focus {
                    outline: none;
                    background-color: $color-accent;
                }
            }
        }
    }
}
</style>
