<template>
    <div class="min-h-screen bg-neutral-50">
        <AppHeader />

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Title -->
            <div class="mb-8">
                <h2 class="text-3xl font-bold text-neutral-900 mb-2">
                    Administração de Encontros
                </h2>
                <p class="text-neutral-600">
                    Gerenciar eventos e palestras da comunidade IME
                </p>
            </div>

            <!-- Form Section -->
            <UCard class="mb-8">
                <template #header>
                    <div
                        class="flex items-center justify-between bg-white dark:bg-neutral-800"
                    >
                        <h3 class="text-xl font-semibold">
                            {{
                                formMode === "edit"
                                    ? "Editar Encontro"
                                    : "Criar Novo Encontro"
                            }}
                        </h3>
                        <UButton
                            v-if="formMode === 'edit'"
                            variant="ghost"
                            size="sm"
                            icon="i-heroicons-x-mark"
                            @click="cancelEdit"
                        >
                            Cancelar
                        </UButton>
                    </div>
                </template>

                <form @submit.prevent="handleSubmit" class="space-y-6">
                    <!-- Date and Time -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label
                                class="block text-sm font-medium text-neutral-700 mb-2"
                            >
                                Data <span class="text-red-500">*</span>
                            </label>
                            <UInput
                                v-model="formData.date"
                                type="date"
                                size="lg"
                                required
                                :disabled="saving"
                            />
                        </div>
                        <div>
                            <label
                                class="block text-sm font-medium text-neutral-700 mb-2"
                            >
                                Horário <span class="text-red-500">*</span>
                            </label>
                            <UInput
                                v-model="formData.time"
                                type="time"
                                size="lg"
                                required
                                :disabled="saving"
                            />
                        </div>
                    </div>

                    <!-- Topics Section -->
                    <div>
                        <div class="flex items-center justify-between mb-4">
                            <label
                                class="block text-sm font-medium text-neutral-700"
                            >
                                Palestras
                            </label>
                            <UButton
                                type="button"
                                size="sm"
                                icon="i-heroicons-plus"
                                @click="addTopic"
                                :disabled="saving"
                            >
                                Adicionar Palestra
                            </UButton>
                        </div>

                        <div
                            v-if="formData.topics.length === 0"
                            class="text-center py-8 border-2 border-dashed border-neutral-300 rounded-lg"
                        >
                            <UIcon
                                name="i-heroicons-presentation-chart-line"
                                class="h-12 w-12 text-neutral-400 mx-auto mb-2"
                            />
                            <p class="text-neutral-500 text-sm">
                                Nenhuma palestra adicionada
                            </p>
                            <p class="text-neutral-400 text-xs mt-1">
                                Clique em "Adicionar Palestra" para começar
                            </p>
                        </div>

                        <div v-else class="space-y-4">
                            <UCard
                                v-for="(topic, index) in formData.topics"
                                :key="index"
                                class="bg-neutral-50 dark:bg-neutral-700"
                            >
                                <div class="space-y-3">
                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <h4
                                            class="font-medium text-neutral-900 dark:text-neutral-100"
                                        >
                                            Palestra {{ index + 1 }}
                                        </h4>
                                        <UButton
                                            type="button"
                                            color="error"
                                            variant="ghost"
                                            size="xs"
                                            icon="i-heroicons-trash"
                                            @click="removeTopic(index)"
                                            :disabled="saving"
                                        >
                                            Remover
                                        </UButton>
                                    </div>
                                    <div class="grid grid-cols-1 gap-3">
                                        <div>
                                            <label
                                                class="block text-sm text-neutral-600 dark:text-neutral-300 mb-1"
                                            >
                                                Palestrante
                                                <span class="text-red-500"
                                                    >*</span
                                                >
                                            </label>
                                            <UInput
                                                v-model="topic.speaker"
                                                placeholder="Nome do palestrante"
                                                size="lg"
                                                required
                                                :disabled="saving"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                class="block text-sm text-neutral-600 dark:text-neutral-300 mb-1"
                                            >
                                                Título da Palestra
                                                <span class="text-red-500"
                                                    >*</span
                                                >
                                            </label>
                                            <UInput
                                                v-model="topic.talk_name"
                                                placeholder="Título da palestra"
                                                size="lg"
                                                required
                                                :disabled="saving"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </UCard>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex gap-3">
                        <UButton
                            type="submit"
                            size="lg"
                            :loading="saving"
                            :disabled="saving"
                            icon="i-heroicons-check"
                        >
                            {{
                                formMode === "edit"
                                    ? "Atualizar Encontro"
                                    : "Criar Encontro"
                            }}
                        </UButton>
                        <UButton
                            v-if="formMode === 'edit'"
                            type="button"
                            variant="outline"
                            size="lg"
                            @click="cancelEdit"
                            :disabled="saving"
                        >
                            Cancelar
                        </UButton>
                    </div>
                </form>
            </UCard>

            <!-- Encontros List -->
            <div class="mb-4">
                <h3 class="text-xl font-semibold text-neutral-900">
                    Encontros Cadastrados
                </h3>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
                <UIcon
                    name="i-heroicons-arrow-path"
                    class="animate-spin h-8 w-8 text-primary-600"
                />
            </div>

            <!-- Encontros List -->
            <div v-else-if="encontros.length > 0" class="space-y-4">
                <UCard
                    v-for="encontro in encontros"
                    :key="encontro.id"
                    class="hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-neutral-800"
                >
                    <div class="space-y-4">
                        <!-- Header with Actions -->
                        <div
                            class="flex items-start justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700"
                        >
                            <div class="flex items-center gap-3 flex-1">
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
                                <div class="flex-1">
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

                            <!-- Action Buttons -->
                            <div class="flex gap-2">
                                <UButton
                                    variant="outline"
                                    size="sm"
                                    icon="i-heroicons-pencil"
                                    @click="editEncontro(encontro)"
                                    :disabled="saving || deleting"
                                >
                                    <span class="hidden sm:inline">Editar</span>
                                </UButton>
                                <UButton
                                    color="error"
                                    variant="outline"
                                    size="sm"
                                    icon="i-heroicons-trash"
                                    @click="confirmDelete(encontro)"
                                    :disabled="saving || deleting"
                                >
                                    <span class="hidden sm:inline"
                                        >Excluir</span
                                    >
                                </UButton>
                            </div>
                        </div>

                        <!-- Topics List -->
                        <div
                            v-if="encontro.topics && encontro.topics.length > 0"
                            class="space-y-3"
                        >
                            <h4
                                class="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2"
                            >
                                <UIcon
                                    name="i-heroicons-presentation-chart-line"
                                    class="h-5 w-5"
                                />
                                Palestras ({{ encontro.topics.length }})
                            </h4>
                            <div class="space-y-2">
                                <div
                                    v-for="(topic, index) in encontro.topics"
                                    :key="index"
                                    class="pl-4 border-l-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
                                >
                                    <div
                                        class="font-medium text-neutral-900 dark:text-neutral-100 text-sm"
                                    >
                                        {{ topic.talk_name }}
                                    </div>
                                    <div
                                        class="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300 mt-1"
                                    >
                                        <UIcon
                                            name="i-heroicons-user"
                                            class="h-3 w-3"
                                        />
                                        <span>{{ topic.speaker }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Empty Topics State -->
                        <div
                            v-else
                            class="text-center py-4 text-neutral-500 dark:text-neutral-400 text-sm"
                        >
                            <UIcon
                                name="i-heroicons-information-circle"
                                class="h-6 w-6 mx-auto mb-1 opacity-50"
                            />
                            <p>Nenhuma palestra cadastrada</p>
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
                    Nenhum encontro cadastrado
                </h3>
                <p class="text-neutral-600 dark:text-neutral-400">
                    Crie o primeiro encontro usando o formulário acima
                </p>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <UModal v-model="showDeleteModal">
            <UCard v-if="encontroToDelete">
                <template #header>
                    <div class="flex items-center gap-3">
                        <div
                            class="flex items-center justify-center w-10 h-10 rounded-full bg-error-100"
                        >
                            <UIcon
                                name="i-heroicons-exclamation-triangle"
                                class="h-6 w-6 text-error-600"
                            />
                        </div>
                        <h3 class="text-lg font-semibold">
                            Confirmar Exclusão
                        </h3>
                    </div>
                </template>

                <div class="space-y-4">
                    <p class="text-neutral-700">
                        Tem certeza que deseja excluir este encontro?
                    </p>
                    <div class="bg-neutral-50 p-4 rounded-lg">
                        <div class="font-semibold text-neutral-900">
                            {{ formatFullDate(encontroToDelete.date) }}
                        </div>
                        <div class="text-sm text-neutral-600 mt-1">
                            {{ formatTime(encontroToDelete.time) }}
                        </div>
                        <div
                            v-if="
                                encontroToDelete.topics &&
                                encontroToDelete.topics.length > 0
                            "
                            class="text-sm text-neutral-500 mt-2"
                        >
                            {{ encontroToDelete.topics.length }} palestra(s)
                            cadastrada(s)
                        </div>
                    </div>
                    <p class="text-sm text-error-600">
                        Esta ação não pode ser desfeita.
                    </p>
                </div>

                <template #footer>
                    <div class="flex gap-3 justify-end">
                        <UButton
                            variant="outline"
                            @click="showDeleteModal = false"
                            :disabled="deleting"
                        >
                            Cancelar
                        </UButton>
                        <UButton
                            color="error"
                            @click="deleteEncontro"
                            :loading="deleting"
                            :disabled="deleting"
                        >
                            Excluir Encontro
                        </UButton>
                    </div>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import type { Encontro, Topic } from "~/types/encontros";

definePageMeta({
    middleware: ["admin"],
});

// State
const encontros = ref<Encontro[]>([]);
const loading = ref(true);
const saving = ref(false);
const deleting = ref(false);
const showDeleteModal = ref(false);
const encontroToDelete = ref<Encontro | null>(null);

// Form state
const formMode = ref<"create" | "edit">("create");
const editingId = ref<string | null>(null);
const formData = ref({
    date: "",
    time: "",
    topics: [] as Topic[],
});

const toast = useToast();

// Fetch encontros
const fetchEncontros = async () => {
    loading.value = true;
    try {
        const data = await $fetch("/api/encontros");
        encontros.value = (data as Encontro[]) || [];
    } catch (error: any) {
        console.error("Error fetching encontros:", error);
        toast.add({
            title: "Erro",
            description: "Falha ao carregar encontros",
            color: "error",
        });
    } finally {
        loading.value = false;
    }
};

// Topic management
const addTopic = () => {
    formData.value.topics.push({
        speaker: "",
        talk_name: "",
    });
};

const removeTopic = (index: number) => {
    formData.value.topics.splice(index, 1);
};

// Form submission
const handleSubmit = async () => {
    saving.value = true;
    try {
        if (formMode.value === "edit" && editingId.value) {
            // Update existing encontro
            await $fetch(`/api/admin/encontros/${editingId.value}`, {
                method: "PUT",
                body: formData.value,
            });
            toast.add({
                title: "Sucesso",
                description: "Encontro atualizado com sucesso!",
                color: "success",
            });
        } else {
            // Create new encontro
            await $fetch("/api/admin/encontros", {
                method: "POST",
                body: formData.value,
            });
            toast.add({
                title: "Sucesso",
                description: "Encontro criado com sucesso!",
                color: "success",
            });
        }

        // Reset form and refresh list
        resetForm();
        await fetchEncontros();
    } catch (error: any) {
        console.error("Error saving encontro:", error);
        toast.add({
            title: "Erro",
            description:
                error.data?.statusMessage || "Falha ao salvar encontro",
            color: "error",
        });
    } finally {
        saving.value = false;
    }
};

// Edit encontro
const editEncontro = (encontro: Encontro) => {
    formMode.value = "edit";
    editingId.value = encontro.id;
    formData.value = {
        date: encontro.date,
        time: encontro.time,
        topics: encontro.topics ? [...encontro.topics] : [],
    };

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// Cancel edit
const cancelEdit = () => {
    resetForm();
};

// Reset form
const resetForm = () => {
    formMode.value = "create";
    editingId.value = null;
    formData.value = {
        date: "",
        time: "",
        topics: [],
    };
};

// Delete confirmation
const confirmDelete = (encontro: Encontro) => {
    encontroToDelete.value = encontro;
    showDeleteModal.value = true;
};

// Delete encontro
const deleteEncontro = async () => {
    if (!encontroToDelete.value) return;

    deleting.value = true;
    try {
        await $fetch(`/api/admin/encontros/${encontroToDelete.value.id}`, {
            method: "DELETE",
        });

        toast.add({
            title: "Sucesso",
            description: "Encontro excluído com sucesso!",
            color: "success",
        });

        showDeleteModal.value = false;
        encontroToDelete.value = null;
        await fetchEncontros();
    } catch (error: any) {
        console.error("Error deleting encontro:", error);
        toast.add({
            title: "Erro",
            description:
                error.data?.statusMessage || "Falha ao excluir encontro",
            color: "error",
        });
    } finally {
        deleting.value = false;
    }
};

// Date formatting functions
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
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
};

// Load encontros on mount
onMounted(() => {
    fetchEncontros();
});
</script>
