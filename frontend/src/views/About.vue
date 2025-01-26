<template>
    <div class="titles">
        <p class="title">RealTimeSlideShare</p>
    </div>
    <div id="registerButton" @click="router.push({ name: 'register' })">登録</div>
</template>
<script lang="ts" setup>
import router from '@/router';
</script>
<style scoped>
.titles {
    text-align: center;
    width: 100vw;
    height: 60vh;
    background-color: var(--color-primary);
}

.title {
    font-size: 5rem;
    color: var(--color-white);
}

#registerButton {
    width: 100px;
    height: 50px;
    background-color: var(--color-primary);
    color: var(--color-white);
    text-align: center;
    line-height: 50px;
    border-radius: 10px;
    margin: 0 auto;
    margin-top: 20px;
    cursor: pointer;
}
</style>