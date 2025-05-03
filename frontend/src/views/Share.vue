<template>
    <h1>Share</h1>
    <p @click="router.go(-1);">
        <u>back</u>
    </p>
    <p>title:{{ slide.title }}</p>
    <p>id:{{ slide.id }}</p>
    <p>link:<a :href="link">{{ link }}</a></p>
    <canvas id="qr-canvas"></canvas>
</template>
<script lang="ts" setup>
import router from '@/router';
import { useRoute } from 'vue-router';
import { Slide } from '@/components/SlideView.ts';
import { onMounted } from 'vue';
import QRCode from "qrcode";

const route = useRoute();
const slide = new Slide(String(route.params.id), false);
const link = `${location.origin}/${slide.id}/view`;


onMounted(() => {
    QRCode.toCanvas(
        document.getElementById("qr-canvas"),
        link,
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