<template>
    <header>
        <div class="titles">
            <h1 class="title">{{ presen.title }}</h1>
        </div>
        <div class="menu">
            <div v-if="mode == 'control'" class="menu-item" @click="deleteSlide">
                <Icon name="humbleicons:trash" />
                <label>{{ $t("view_delete") }}</label>
            </div>
            <div v-if="!isShowShare" class="menu-item" @click="isShowShare = true">
                <Icon name="humbleicons:share" />
                <label>{{ $t("view_share") }}</label>
            </div>
            <div v-else class="menu-item" @click="isShowShare = false">
                <Icon name="humbleicons:times" />
                <label>{{ $t("view_close") }}</label>
            </div>
        </div>
    </header>
    <SharePopup v-if="isShowShare" :presen="presen" />
</template>

<script setup lang="ts">
const { t } = useI18n()

const isShowShare = useState('isShowShare')
type Mode = 'control' | 'share' | 'view'
const props = defineProps({
    presen: {
        type: Object,
        required: true
    },
    mode: {
        type: String as () => Mode,
        required: false,
        default: ''
    },
})

// delete処理
function deleteSlide() {
    if (!confirm(t("view_delete_alert"))) return
    props.presen.delete(() => {
        navigateTo('/')
    })
}
</script>

<style lang="scss" scoped>
header {
    width: 100vw;
    height: $header-height;
    background-color: $color-primary;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: $color-body-primary;
    padding: 8px;

    .titles {
        white-space: nowrap;
        overflow: hidden;

        .title {
            font-size: 1.5rem;
            font-weight: bold;
            margin-right: 1rem;
        }

        .mode {
            font-size: 1rem;
            font-weight: normal;
        }
    }

    .menu {
        display: flex;
        gap: 8px;

        .menu-item {
            cursor: pointer;
            height: calc($header-height * 0.8);
            width: calc($header-height * 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            color: $color-body-primary;
            text-decoration: none;
            border-radius: 10px;
            background-color: $color-secondary;
            padding: 3px;

            span.iconify {
                font-size: 1.5em;
                margin-bottom: -2px;
            }

            label {
                cursor: pointer;
                font-size: 0.8rem;
            }
        }
    }
}
</style>