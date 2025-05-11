// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    ssr: true, // default is true
    devtools: { enabled: true },
    modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxtjs/i18n"],
    css: ["~/assets/css/main.scss"],
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `
                        @use "~/assets/css/_variables.scss" as *;
                    `,
                },
            },
        },
    },
    runtimeConfig: {
        public: {
            appVersion: "v0.0.1",
        },
    },
    i18n: {
        strategy: "no_prefix",
        defaultLocale: "en",
        locales: [
            { code: "en", language: "en-US", name: "English", file: "en.ts" },
            { code: "ja", language: "ja-JP", name: "Japanese", file: "ja.ts" },
        ],
        langDir: "../locales/",
        lazy: true,
    },
});
