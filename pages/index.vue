<template>
    <div>
        <div class="titles">
            <p class="title">RealTimeSlideShare</p>
        </div>
        <div id="registerButton" @click="navigateTo('/register')">登録
        </div>
    </div>
</template>

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