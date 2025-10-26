<template>
    <div class="min-h-screen bg-neutral-50">
        <AppHeader :show-create-profile="!hasProfile" />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-neutral-900 mb-2">
                    Encontros
                </h2>
                <p class="text-neutral-600">
                    Eventos e palestras da comunidade IME
                </p>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
                <UIcon
                    name="i-heroicons-arrow-path"
                    class="animate-spin h-8 w-8 text-primary-600"
                />
            </div>

            <!-- Encontros List -->
            <div v-else-if="encontros.length > 0" class="space-y-6">
                <UCard
                    v-for="encontro in encontros"
                    :key="encontro.id"
                    class="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-neutral-800"
                >
                    <div class="space-y-4">
                        <!-- Date and Time Header -->
                        <div
                            class="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700"
                        >
                            <div class="flex items-center gap-3">
                                <div
                                    class="flex items-center justify-center w-16 h-16 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                                >
                                    <div class="text-center">
                                        <div
                                            class="text-2xl font-bold leading-none"
                                        >
                                            {{ formatDay(encontro.date) }}
                                        </div>
                                        <div
                                            class="text-xs uppercase leading-none mt-1"
                                        >
                                            {{ formatMonth(encontro.date) }}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div
                                        class="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
                                    >
                                        {{ formatFullDate(encontro.date) }}
                                    </div>
                                    <div
                                        class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300"
                                    >
                                        <UIcon
                                            name="i-heroicons-clock"
                                            class="h-4 w-4"
                                        />
                                        <span>{{
                                            formatTime(encontro.time)
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <UBadge
                                :color="
                                    isPastEvent(encontro.date)
                                        ? 'neutral'
                                        : 'primary'
                                "
                                variant="subtle"
                            >
                                {{
                                    isPastEvent(encontro.date)
                                        ? "Finalizado"
                                        : "Próximo"
                                }}
                            </UBadge>
                        </div>

                        <!-- Topics List -->
                        <div
                            v-if="encontro.topics && encontro.topics.length > 0"
                            class="space-y-4"
                        >
                            <h3
                                class="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"
                            >
                                <UIcon
                                    name="i-heroicons-presentation-chart-line"
                                    class="h-5 w-5"
                                />
                                Palestras
                            </h3>
                            <div class="space-y-3">
                                <div
                                    v-for="(topic, index) in encontro.topics"
                                    :key="index"
                                    class="pl-4 border-l-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
                                >
                                    <div
                                        class="font-medium text-neutral-900 dark:text-neutral-100"
                                    >
                                        {{ topic.talk_name }}
                                    </div>
                                    <div
                                        class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 mt-1"
                                    >
                                        <UIcon
                                            name="i-heroicons-user"
                                            class="h-4 w-4"
                                        />
                                        <span>{{ topic.speaker }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty State for Topics -->
                        <div
                            v-else
                            class="text-center py-6 text-neutral-500 dark:text-neutral-400"
                        >
                            <UIcon
                                name="i-heroicons-information-circle"
                                class="h-8 w-8 mx-auto mb-2 opacity-50"
                            />
                            <p class="text-sm">
                                Nenhuma palestra agendada ainda
                            </p>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12">
                <UIcon
                    name="i-heroicons-calendar-days"
                    class="h-16 w-16 text-neutral-400 mx-auto mb-4"
                />
                <h3
                    class="text-lg font-medium text-neutral-900 dark:text-white mb-2"
                >
                    Nenhum encontro agendado
                </h3>
                <p class="text-neutral-600 dark:text-neutral-400">
                    Novos encontros serão publicados em breve
                </p>
            </div>
        </div>

        <!-- Back to Top Button -->
        <Transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <button
                v-show="showBackToTop"
                @click="scrollToTop"
                class="fixed bottom-8 right-8 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full p-3 shadow-lg transition-colors z-50"
                aria-label="Voltar ao topo"
            >
                <UIcon name="i-heroicons-arrow-up" class="h-5 w-5" />
            </button>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import type { Encontro } from "~/types/encontros";
import type { Alumni } from "~/types/alumni";

const encontros = ref<Encontro[]>([]);
const loading = ref(true);
const hasProfile = ref(true);
const showBackToTop = ref(false);

// Fetch encontros data
const fetchEncontros = async () => {
    loading.value = true;
    try {
        const data = await $fetch("/api/encontros");
        encontros.value = (data as Encontro[]) || [];

        // Check if user has a profile
        try {
            const myProfile = await $fetch<Alumni | null>("/api/alumni/me");
            hasProfile.value = !!myProfile;
        } catch (error) {
            hasProfile.value = false;
        }
    } catch (error: any) {
        console.error("Error fetching encontros:", error);
        if (error?.statusCode === 401) {
            navigateTo("/login");
        }
    } finally {
        loading.value = false;
    }
};

// Date formatting functions - parse as local date to avoid timezone issues
const parseLocalDate = (dateString: string) => {
    const parts = dateString.split("-").map(Number);
    const year = parts[0] || 2025;
    const month = parts[1] || 1;
    const day = parts[2] || 1;
    return new Date(year, month - 1, day);
};

const formatDay = (dateString: string) => {
    const date = parseLocalDate(dateString);
    return date.getDate();
};

const formatMonth = (dateString: string) => {
    const date = parseLocalDate(dateString);
    const months = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
    ];
    return months[date.getMonth()];
};

const formatFullDate = (dateString: string) => {
    const date = parseLocalDate(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    return date.toLocaleDateString("pt-BR", options);
};

const formatTime = (timeString: string) => {
    // timeString is in format "HH:MM:SS"
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
};

const isPastEvent = (dateString: string) => {
    const eventDate = parseLocalDate(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today;
};

// Back to top functionality
const handleScroll = () => {
    showBackToTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
};

onMounted(() => {
    fetchEncontros();

    if (process.client) {
        window.addEventListener("scroll", handleScroll);
    }
});

onBeforeUnmount(() => {
    if (process.client) {
        window.removeEventListener("scroll", handleScroll);
    }
});
</script>
