// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  modules: ['@nuxt/ui', 'dayjs-nuxt', '@nuxtjs/leaflet'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiUrl: 'https://tracker-be.gandalfthegray.org'
      // apiUrl: 'http://localhost:8080'
    }
  },
  dayjs: {
    plugins: ['duration']
  }
})
