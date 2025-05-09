<template>
    <div v-show="isShowShare" class="share-popup-wrapper" @click.self="isShowShare = false">
        <div class="share-popup">
            <p class="title">"{{ presen.title }}"</p>
            <p class="id">({{ presen.id }})</p>
            <p class="link"><a :href="link">{{ link }}</a></p>
            <div class="shareButton" @click="shareLink">{{ $t("view_share") }}</div>
            <canvas id="qr-canvas" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import QRCode from "qrcode";
const { t } = useI18n()
const isShowShare = useState('isShowShare')
const props = defineProps({
    presen: {
        type: Object,
        required: true
    },
});
const link = ref<string>("");
onMounted(() => {
    link.value = `${location.origin}/${props.presen.id}/view`;
    const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
    QRCode.toCanvas(
        canvas,
        link.value,
        {
            margin: 4,
            color: {
                dark: "#000000",
                light: "#ffffff",
            },
            scale: 4,
            width: 128,
            errorCorrectionLevel: "Q",
        },
        function (error) {
            if (error) console.error(error);
        }
    );
    // デフォルトでcanvasのサイズを指定しているので、styleで上書きする
    canvas.style.setProperty("width", null);
    canvas.style.setProperty("height", null);
});
// リンク共有
function shareLink() {
    try {
        navigator.share({ title: `"${props.presen.title}"RealTimeSlideShare`, url: `${location.origin}/${props.presen.id}/view` })
    } catch (e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(location.href)
            alert(t("view_share_link_alert"))
        } else {
            alert(t("view_share_link_alert_error"))
        }
    }
}
</script>
<style scoped lang="scss">
.share-popup-wrapper {
    position: absolute;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.5);
    height: calc(100vh - $header-height - $footer-height);
    width: 100vw;
    display: flex;
    justify-content: center;
    align-items: center;

    .share-popup {
        background-color: $color-primary;
        width: 90%;
        height: 90%;
        max-width: 500px;
        max-height: 500px;
        border-radius: 20px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: hidden;
        overflow-y: auto;

        .title {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
        }

        .id {
            font-size: 1rem;
            text-align: center;
        }

        .link {
            font-size: 1rem;
            text-align: center;
            margin-top: 10px;

            a {
                color: $color-body-primary;
            }
        }

        .shareButton {
            background-color: $color-secondary;
            color: $color-body-primary;
            width: 100%;
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 10px;
            margin-top: 20px;
            cursor: pointer;
            flex-shrink: 0;
            font-size: 1.5rem;
        }

        #qr-canvas {
            margin-top: 20px;
            width: 50%;
        }

    }
}
</style>