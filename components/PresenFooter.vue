<template>
    <footer>
        <span class="powered">
            Provided by <NuxtLink class="link" to="/">RealTimeSlideShare</NuxtLink>
        </span>
        <span class="version">
            {{ useRuntimeConfig().public.appVersion }}
        </span>
    </footer>
</template>
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

    .version {
        margin-left: auto;
        font-size: 1rem;
    }
}
</style>