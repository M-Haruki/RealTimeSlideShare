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
                <p class="caution">{{ $t("desc_caution") }}</p>
            </div>
            <div class="description">
                <div v-for="(desc, index) in description" :key="index" class="container">
                    <h2>{{ $t(desc.title) }}</h2>
                    <p>{{ $t(desc.text) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const description = [
    {
        title: "desc1_title",
        text: "desc1_text"
    },
    {
        title: "desc2_title",
        text: "desc2_text"
    },
    {
        title: "desc3_title",
        text: "desc3_text"
    },
    {
        title: "desc4_title",
        text: "desc4_text"
    }
]

onMounted(() => {
    const descElements = document.querySelectorAll('.container');
    descElements.forEach((descElement) => {
        // 初期状態で非表示にする
        descElement.classList.add('hiden');
    });

    const observer = new IntersectionObserver(
        (entries) => {
            // entriesはIntersectionObserverEntryの配列
            // entry.isIntersectingがtrueの時、要素が表示されている
            // entry.targetはIntersectionObserverEntryのtargetプロパティ
            // つまり、交差している要素を取得できる
            // ここで、isDescShownNumをインクリメントする
            // ただし、最初から表示されている場合も含めて発火するので注意
            entries.forEach(
                entry => {
                    if (entry.isIntersecting) {
                        // ここが「最初から表示されている」場合も含めて発火する
                        entry.target.classList.remove('hiden');
                        observer.unobserve(entry.target);
                    }
                })
        },
        {
            root: null,
            rootMargin: '0px',
            threshold: 1.0 // 1.0は、要素が完全に表示されている時
        }
    )

    descElements.forEach((descElement) => {
        observer.observe(descElement);
    });
});

</script>

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
            flex-direction: column;

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
                cursor: pointer;
                font-size: 1.5rem;
                color: $color-body-primary;

                &:hover {
                    background-color: $color-accent;
                }
            }

            .caution {
                margin-top: 20px;
                font-size: 1.2rem;
                color: $color-body-primary;
                width: 80%;
                max-width: 800px;
                text-align: center;
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

                transition: all 1s ease-in-out;
                transition-delay: 0.2s;
                opacity: 1;

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

                    // border-bottom: solid 4px orange;
                    background: linear-gradient(transparent 50%, $color-accent 80%);
                }

                p {
                    font-size: 1.2rem;
                    color: $color-body-primary;
                    line-height: 1.5rem;
                }
            }

            .container.hiden {
                opacity: 0;
                transition: all 0s ease-in-out; // 表示->非表示の時はtransitionを無効にする
                transition-delay: 0s;

                &:nth-child(even) {
                    transform: translateX(50px);
                }

                &:nth-child(odd) {
                    transform: translateX(-50px);
                }
            }
        }
    }
}
</style>