<template>
    <div class="slideTitle">
        <p class="slideTitleText">
            <slot></slot>
        </p>
    </div>
</template>
<style scoped>
.slideTitleText {
    font-size: 2rem;
    font-weight: bold;
    color: var(--color-body-primary);
    margin-bottom: 1rem;
    text-align: center;
}

.slideTitle {
    width: 100vw;
    background-color: var(--color-primary);
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>