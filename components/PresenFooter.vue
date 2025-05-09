<template>
    <footer>
        <span class="powered">
            Provided by <NuxtLink class="link" to="/">RealTimeSlideShare</NuxtLink>
        </span>
        <span class="language">
            <span v-if="locale != 'en'" @click="setLocale('en')">English</span>
            <span v-if="locale != 'ja'" @click="setLocale('ja')">日本語</span>
        </span>
        <span class="version">
            {{ useRuntimeConfig().public.appVersion }}
        </span>
    </footer>
</template>
<script setup lang="ts">
const { setLocale, locale } = useI18n()
</script>
<style scoped lang="scss">
footer {
    width: 100vw;
    height: $footer-height;
    background-color: $color-primary;
    color: $color-body-primary;
    padding: 2px 10px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;

    .powered {
        font-size: 1rem;

        .link {
            color: $color-body-primary;
        }
    }

    .language {
        margin-left: 15px;
        font-size: 1rem;
        cursor: pointer;

        span {
            text-decoration: underline;
            cursor: pointer;
        }
    }

    .version {
        margin-left: auto;
        font-size: 1rem;
    }
}
</style>