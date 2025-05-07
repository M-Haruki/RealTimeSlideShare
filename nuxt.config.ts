// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    modules: ["@nuxt/eslint", "@nuxt/icon", "@prisma/nuxt"],
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
});
