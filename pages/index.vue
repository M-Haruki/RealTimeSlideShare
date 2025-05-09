<template>
    <div class="content">
        <div class="titles">
            <h1 class="title">Real Time Slide Share</h1>
            <p>
                <b>{{ $t("catchphrase") }}</b><br>
                {{ $t("shortDescription") }}
            </p>
        </div>
        <div class="bottom">
            <div class="buttonArea">
                <div id="registerButton" @click="navigateTo('/register')">
                    <p>{{ $t("createButton") }}</p>
                </div>
            </div>
            <div class="description">
                <div class="container">
                    <h2>{{ $t("desc1_title") }}</h2>
                    <p>{{ $t("desc1_text") }}</p>
                </div>
                <div class="container">
                    <h2>{{ $t("desc2_title") }}</h2>
                    <p>{{ $t("desc2_text") }}</p>
                </div>
                <div class="container">
                    <h2>{{ $t("desc3_title") }}</h2>
                    <p>{{ $t("desc3_text") }}</p>
                </div>
                <div class="container">
                    <h2>{{ $t("desc4_title") }}</h2>
                    <p>{{ $t("desc4_text") }}</p>
                </div>
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

    .bottom {
        width: 100vw;
        background-color: $color-tertiary;
        display: flex;
        justify-content: start;
        align-items: center;
        flex-direction: column;

        .buttonArea {
            width: 100%;
            height: 50vh;
            display: flex;
            justify-content: center;
            align-items: center;

            #registerButton {
                width: 80%;
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

        .description {
            width: 80%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 25px 0;

            .container {
                width: 60%;
                max-width: 800px;
                margin-bottom: 50px;
                text-align: left;

                &:nth-child(even) {
                    margin-left: auto;
                }

                &:nth-child(odd) {
                    margin-right: auto;
                }

                h2 {
                    font-size: 1.5rem;
                    color: $color-body-primary;
                    margin-bottom: 5px;
                }

                p {
                    font-size: 1.2rem;
                    color: $color-body-primary;
                    line-height: 1.5rem;
                }
            }
        }
    }
}
</style>