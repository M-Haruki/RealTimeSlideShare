<template>
    <div>
        <SlideHeader :slide="slide" mode="share" />
        <p @click="$router.go(-1);">
            <u>back</u>
        </p>
        <p>title:{{ slide.title }}</p>
        <p>id:{{ slide.id }}</p>
        <p>link:<a :href="link">{{ link }}</a></p>
        <p @click="shareLink">share</p>
        <p>QR code:</p>
        <canvas id="qr-canvas" />
        <SlideFooter />
    </div>
</template>

<script lang="ts" setup>
import QRCode from "qrcode";
const slide = new Slide(useRoute().params.id as string, false);
const link = ref<string>("");
onMounted(() => {
    link.value = `${location.origin}/${slide.id}/view`;
    QRCode.toCanvas(
        document.getElementById("qr-canvas"),
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
});
// リンク共有
function shareLink() {
    try {
        navigator.share({ title: `"${slide.title}"RealTimeSlideShare`, url: `${location.origin}/${slide.id}/view` })
    } catch (e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(location.href)
            alert("リンクをコピーしました")
        } else {
            alert("リンクのコピー及び共有に対応していません")
        }
    }
}
</script>