<template>
    <header>
        <div class="titles">
            <span class="title">{{ slide.title }}</span>
        </div>
        <div class="menu">
            <NuxtLink v-if="mode != 'share'" class="menu-item" :to="`/${slide.id}/share`">
                <Icon name="humbleicons:share" />
                <label>Share</label>
            </NuxtLink>
            <div v-else class="menu-item" @click="$router.go(-1);">
                <Icon name="humbleicons:arrow-go-back" />
                <label>Back</label>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
type Mode = 'control' | 'share' | 'view'
defineProps({
    slide: {
        type: Object,
        required: true
    },
    mode: {
        type: String as () => Mode,
        required: false,
        default: ''
    },
})
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
        .menu-item {
            height: calc($header-height * 0.8);
            width: calc($header-height * 0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            color: $color-body-primary;
            text-decoration: none;
            border-radius: 10px;
            background-color: $color-tertiary;
            padding: 3px;

            span.iconify {
                font-size: 1.5em;
                margin-bottom: -2px;
            }

            label {
                font-size: 0.8rem;
            }
        }
    }
}
</style>