<template>
    <footer>
        <p>
            Provided by <NuxtLink class="link" to="/">RealTimeSlideShare</NuxtLink>
        </p>
    </footer>
</template>
<style scoped lang="scss">
footer {
    width: 100vw;
    height: $footer-height;
    background-color: $color-primary;
    color: $color-body-primary;
    padding: 2px 8px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;

    p {
        font-size: 1rem;

        .link {
            color: $color-body-primary;
        }
    }
}
</style>