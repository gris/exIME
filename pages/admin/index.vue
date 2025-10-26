<template>
    <div class="min-h-screen bg-neutral-50">
        <AppHeader />

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Title -->
            <div class="mb-8">
                <h2
                    class="text-3xl font-bold text-neutral-900 dark:text-neutral-900 mb-2"
                >
                    Painel Administrativo
                </h2>
                <p class="text-neutral-600 dark:text-neutral-400">
                    Gerencie os recursos da plataforma
                </p>
            </div>

            <!-- Admin Options Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- Encontros Card -->
                <NuxtLink to="/admin/encontros" class="group">
                    <UCard
                        class="hover:shadow-xl transition-all duration-200 cursor-pointer hover:-translate-y-1 bg-white dark:bg-neutral-800"
                    >
                        <div class="space-y-4">
                            <div
                                class="flex items-center justify-center w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 group-hover:scale-110 transition-transform duration-200"
                            >
                                <UIcon
                                    name="i-heroicons-calendar-days"
                                    class="h-8 w-8"
                                />
                            </div>
                            <div>
                                <h3
                                    class="text-xl font-semibold text-neutral-900 dark:text-white mb-2"
                                >
                                    Encontros
                                </h3>
                                <p
                                    class="text-sm text-neutral-600 dark:text-neutral-400"
                                >
                                    Gerenciar eventos e palestras da comunidade
                                    IME
                                </p>
                            </div>
                            <div
                                class="flex items-center text-primary-600 dark:text-primary-400 text-sm font-medium"
                            >
                                <span>Acessar</span>
                                <UIcon
                                    name="i-heroicons-arrow-right"
                                    class="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform"
                                />
                            </div>
                        </div>
                    </UCard>
                </NuxtLink>

                <!-- Placeholder for future admin sections -->
                <!-- You can add more cards here as needed -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ["admin"],
});
</script>
