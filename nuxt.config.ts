// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  devServer: {
    port: 3001,
    host: 'localhost'
  },
  
  build: {
    transpile: ['@clerk/nuxt']
  },

  modules: [
    '@clerk/nuxt',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss'
  ],

  runtimeConfig: {
    clerkSecretKey: process.env.NUXT_CLERK_SECRET_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      clerkPublishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
    }
  },

  app: {
    head: {
      title: 'Diretório de Ex-Alunos IME',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Diretório de ex-alunos do Instituto Militar de Engenharia' }
      ]
    }
  },

  vite: {
    resolve: {
      alias: {
        'cookie': 'cookie'
      }
    },
    optimizeDeps: {
      exclude: ['@clerk/nuxt'],
      include: ['cookie'],
      esbuildOptions: {
        tsconfigRaw: {
          compilerOptions: {
            jsx: 'preserve',
            target: 'esnext'
          }
        }
      }
    },
    ssr: {
      noExternal: ['@clerk/nuxt', 'cookie']
    }
  }
  ,
  clerk: {
    publishableKey: process.env.NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    signInUrl: '/login',
    skipServerMiddleware: false
  }
})
