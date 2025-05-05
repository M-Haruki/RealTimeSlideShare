<template>
    <div>
        <h1>Share</h1>
        <p @click="$router.go(-1);">
            <u>back</u>
        </p>
        <p>title:{{ slide.title }}</p>
        <p>id:{{ slide.id }}</p>
        <p>link:<a :href="link">{{ link }}</a></p>
        <canvas id="qr-canvas" />
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
</script>