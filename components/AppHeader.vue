<template>
    <div class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <img
                        src="/images/ime-logo.png"
                        alt="IME Logo"
                        class="w-16 h-16 object-contain"
                    />
                    <div>
                        <h1 class="text-xl font-bold !text-slate-950">IME</h1>
                        <p class="text-xs !text-slate-900">
                            Instituto Militar de Engenharia
                        </p>
                    </div>
                </div>
                <div class="flex gap-3 items-center">
                    <UButton
                        v-if="currentRoute !== '/diretorio'"
                        to="/diretorio"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-user-group"
                    >
                        <span class="hidden sm:inline">Diretório</span>
                    </UButton>
                    <UButton
                        v-if="currentRoute !== '/encontros'"
                        to="/encontros"
                        variant="outline"
                        size="sm"
                        icon="i-heroicons-calendar-days"
                    >
                        <span class="hidden sm:inline">Encontros</span>
                    </UButton>
                    <UButton
                        v-if="showCreateProfile"
                        to="/perfil/editar"
                        color="primary"
                        size="sm"
                        icon="i-heroicons-plus"
                    >
                        <span class="hidden sm:inline">Criar Perfil</span>
                    </UButton>
                    <div class="flex items-center">
                        <UserButton
                            :user-profile-props="{
                                appearance: {
                                    elements: {
                                        pageScrollBox__emailAddresses: 'hidden',
                                        navbar__menuItem__emailAddresses:
                                            'hidden',
                                        profileSection__emailAddresses:
                                            'hidden',
                                        profileSectionTitleText__emailAddresses:
                                            'hidden',
                                        profileSectionTitle__emailAddresses:
                                            'hidden',
                                        profileSectionContent__emailAddresses:
                                            'hidden',
                                    },
                                },
                            }"
                        >
                            <UserButton.MenuItems>
                                <UserButton.Link
                                    label="Meu Perfil"
                                    href="/perfil/"
                                >
                                    <template #labelIcon>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 1 .41-1.108 9.06 9.06 0 0 1 12.25 0c.433.39.465.933.41 1.108a.678.678 0 0 1-.313.486l-.03.022A13.617 13.617 0 0 1 10 16a13.617 13.617 0 0 1-6.192-1.001l-.03-.022a.678.678 0 0 1-.313-.486Z"
                                            />
                                        </svg>
                                    </template>
                                </UserButton.Link>
                                <UserButton.Link
                                    v-if="isAdmin"
                                    label="Painel de Admin"
                                    href="/admin"
                                >
                                    <template #labelIcon>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fill-rule="evenodd"
                                                d="M19 5.5a4.5 4.5 0 0 1-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 1 1-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 0 1 5.873-4.575c.324.105.39.51.15.752L13.34 4.66a.455.455 0 0 0-.11.494 3.01 3.01 0 0 0 1.617 1.617c.17.07.363.02.493-.111l2.692-2.692c.241-.241.647-.174.752.15.14.435.216.9.216 1.382Z"
                                                clip-rule="evenodd"
                                            />
                                        </svg>
                                    </template>
                                </UserButton.Link>
                            </UserButton.MenuItems>
                        </UserButton>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { UserButton } from "@clerk/vue";

const props = defineProps<{
    showCreateProfile?: boolean;
}>();

// Check if user is admin
const { isAdmin } = useAdmin();

// Get current route
const route = useRoute();
const currentRoute = computed(() => route.path);
</script>
