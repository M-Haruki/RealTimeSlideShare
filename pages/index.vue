<template>
    <div class="content">
        <div class="titles">
            <h1 class="title">Real Time Slide Share</h1>
            <p>
                <b>{{ $t("catchphrase") }}</b><br>
                {{ $t("shortDescription") }}
            </p>
        </div>
        <div class="description">
            <div id="registerButton" @click="navigateTo('/register')">
                <p>{{ $t("createButton") }}</p>
            </div>
            <div>
                <h2>{{ $t("desc1_title") }}</h2>
                <p>{{ $t("desc1_text") }}</p>
            </div>
            <div>
                <h2>{{ $t("desc2_title") }}</h2>
                <p>{{ $t("desc2_text") }}</p>
            </div>
            <div>
                <h2>{{ $t("desc3_title") }}</h2>
                <p>{{ $t("desc3_text") }}</p>
            </div>
            <div>
                <h2>{{ $t("desc4_title") }}</h2>
                <p>{{ $t("desc4_text") }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.content {
    overflow-x: hidden;

    .titles {
        text-align: center;
        width: 100vw;
        height: 50vh;
        background-color: $color-primary;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        .title {
            font-size: 3rem;
            color: $color-body-primary;
        }

        p {
            font-size: 1.2rem;
            color: $color-body-primary;
            margin-top: 20px;
            width: 80%;
            max-width: 800px;
            text-align: center;
        }
    }

    .description {
        width: 100vw;
        height: 50vh;
        background-color: $color-tertiary;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;

        #registerButton {
            width: 75%;
            max-width: 500px;
            height: 60px;
            background-color: $color-secondary;
            text-align: center;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            margin-top: 50px;
            cursor: pointer;
            font-size: 1.5rem;
            color: $color-body-primary;

            &:hover {
                background-color: $color-accent;
            }
        }
    }
}
</style>