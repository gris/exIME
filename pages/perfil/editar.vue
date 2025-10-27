<template>
    <div class="min-h-screen bg-neutral-50">
        <div class="bg-white shadow-sm">
            <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div class="flex justify-between items-center">
                    <h1
                        class="text-2xl font-bold text-neutral-900 dark:text-white"
                    >
                        {{ isEditing ? "Editar Perfil" : "Criar Perfil" }}
                    </h1>
                    <UButton
                        to="/diretorio"
                        variant="outline"
                        icon="i-heroicons-arrow-left"
                    >
                        Cancelar
                    </UButton>
                </div>
            </div>
        </div>

        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Loading State -->
            <div v-if="loading" class="flex justify-center py-12">
                <UIcon
                    name="i-heroicons-arrow-path"
                    class="animate-spin h-8 w-8 text-primary-600"
                />
            </div>

            <!-- Form -->
            <UCard v-else>
                <form
                    @submit.prevent="handleSubmit"
                    class="space-y-6 text-white"
                >
                    <!-- Basic Information -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold">
                            Informações Básicas
                        </h3>

                        <UFormField
                            label="Nome Completo"
                            required
                            class="w-full"
                        >
                            <UInput
                                v-model="formData.name"
                                placeholder="Seu nome completo"
                                size="lg"
                                class="w-full"
                                required
                            />
                        </UFormField>

                        <UFormField label="Email" required class="w-full">
                            <UInput
                                v-model="formData.email"
                                type="email"
                                size="lg"
                                class="w-full opacity-60 bg-neutral-100 dark:bg-neutral-800"
                                disabled
                                readonly
                            >
                                <template #trailing>
                                    <UIcon
                                        name="i-heroicons-lock-closed"
                                        class="text-neutral-400"
                                    />
                                </template>
                            </UInput>
                        </UFormField>

                        <UFormField label="Telefone" class="w-full">
                            <UInput
                                v-model="formData.phone"
                                type="tel"
                                placeholder="(21) 99999-9999"
                                size="lg"
                                class="w-full"
                            />
                        </UFormField>

                        <UFormField
                            label="LinkedIn"
                            name="linkedin"
                            :error="linkedinError"
                            class="w-full"
                        >
                            <UInput
                                v-model="formData.linkedin"
                                placeholder="https://linkedin.com/in/seu-perfil"
                                size="lg"
                                class="w-full"
                                @blur="linkedinValidation"
                            />
                        </UFormField>

                        <!-- Profile Picture Upload -->
                        <div class="space-y-3">
                            <label
                                class="text-sm font-medium text-neutral-900 dark:text-white"
                            >
                                Foto do Perfil
                                <span class="text-red-500">*</span>
                            </label>
                            <div class="flex items-start gap-4">
                                <!-- Profile Image Preview -->
                                <div class="relative">
                                    <img
                                        v-if="profileImageUrl"
                                        :src="profileImageUrl"
                                        alt="Foto do perfil"
                                        class="w-24 h-24 rounded-full object-cover border-2 border-neutral-200"
                                    />
                                    <div
                                        v-else
                                        class="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-info-500 flex items-center justify-center text-white font-bold text-3xl"
                                    >
                                        {{
                                            formData.name
                                                ? formData.name
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : "?"
                                        }}
                                    </div>
                                    <!-- Upload indicator -->
                                    <div
                                        v-if="uploadingImage"
                                        class="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center"
                                    >
                                        <UIcon
                                            name="i-heroicons-arrow-path"
                                            class="animate-spin h-8 w-8 text-white"
                                        />
                                    </div>
                                </div>

                                <!-- Upload Controls -->
                                <div class="flex-1 space-y-3">
                                    <p
                                        class="text-sm text-neutral-600 dark:text-neutral-400"
                                    >
                                        Faça upload de uma foto de perfil (JPEG,
                                        PNG, GIF ou WebP, máx. 10MB)
                                    </p>

                                    <div class="flex items-center gap-2">
                                        <input
                                            ref="fileInput"
                                            type="file"
                                            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                            class="hidden"
                                            @change="handleFileSelect"
                                        />
                                        <UButton
                                            type="button"
                                            color="primary"
                                            variant="outline"
                                            icon="i-heroicons-photo"
                                            @click="triggerFileInput"
                                            :disabled="uploadingImage"
                                        >
                                            Escolher Foto
                                        </UButton>
                                        <UButton
                                            v-if="selectedFile"
                                            type="button"
                                            color="primary"
                                            icon="i-heroicons-arrow-up-tray"
                                            @click="uploadProfileImage"
                                            :loading="uploadingImage"
                                            :disabled="uploadingImage"
                                        >
                                            Upload
                                        </UButton>
                                    </div>

                                    <div v-if="selectedFile" class="space-y-1">
                                        <p
                                            class="text-xs text-neutral-600 dark:text-neutral-400"
                                        >
                                            Arquivo selecionado:
                                            {{ selectedFile.name }}
                                        </p>
                                        <p
                                            class="text-xs text-primary-600 font-medium"
                                        >
                                            ✓ Preview exibido - clique em
                                            "Upload" para salvar
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Professional Information -->
                    <div class="space-y-4 pt-6 border-t">
                        <h3 class="text-lg font-semibold">
                            Informações Profissionais
                        </h3>

                        <UFormField
                            label="Status de Formatura IME"
                            class="w-full"
                        >
                            <div class="space-y-3">
                                <div
                                    class="flex flex-col sm:flex-row gap-4 sm:gap-8"
                                >
                                    <label
                                        class="flex items-center gap-2 cursor-pointer text-white py-2"
                                    >
                                        <input
                                            type="radio"
                                            :value="false"
                                            v-model="formData.is_dropout"
                                            class="w-5 h-5 sm:w-4 sm:h-4 text-primary-600 accent-primary-600 flex-shrink-0"
                                        />
                                        <span class="text-base sm:text-sm"
                                            >Formado</span
                                        >
                                    </label>
                                    <label
                                        class="flex items-center gap-2 cursor-pointer text-white py-2"
                                    >
                                        <input
                                            type="radio"
                                            :value="true"
                                            v-model="formData.is_dropout"
                                            class="w-5 h-5 sm:w-4 sm:h-4 text-primary-600 accent-primary-600 flex-shrink-0"
                                        />
                                        <span class="text-base sm:text-sm"
                                            >Não Concluído</span
                                        >
                                    </label>
                                </div>
                                <UInput
                                    v-if="!formData.is_dropout"
                                    v-model="formData.graduation_year"
                                    type="number"
                                    placeholder="Ex: 2017"
                                    size="lg"
                                    class="w-full"
                                    min="1950"
                                    :max="new Date().getFullYear() + 5"
                                />
                            </div>
                        </UFormField>

                        <UFormField label="Cargo Atual" class="w-full">
                            <UInput
                                v-model="formData.role"
                                placeholder="Ex: Engenheiro de Software Senior"
                                size="lg"
                                class="w-full"
                            />
                        </UFormField>

                        <UFormField label="Empresa Atual" class="w-full">
                            <UInput
                                v-model="formData.current_company"
                                placeholder="Nome da empresa"
                                size="lg"
                                class="w-full"
                            />
                        </UFormField>
                    </div>

                    <!-- Technologies -->
                    <div class="space-y-4 pt-6 border-t">
                        <h3 class="text-lg font-semibold">Tecnologias</h3>
                        <p
                            class="text-sm text-neutral-600 dark:text-neutral-400"
                        >
                            Digite e pressione Enter para adicionar tecnologias
                        </p>

                        <div class="space-y-3">
                            <UInput
                                v-model="newTechnology"
                                placeholder="Ex: JavaScript, Python, React..."
                                size="lg"
                                class="w-full"
                                @keydown.enter.prevent="addTechnology"
                            />

                            <div
                                v-if="formData.technologies.length > 0"
                                class="flex flex-wrap gap-2"
                            >
                                <UBadge
                                    v-for="(
                                        tech, index
                                    ) in formData.technologies"
                                    :key="index"
                                    color="primary"
                                    variant="subtle"
                                    size="md"
                                    class="cursor-pointer hover:bg-error-100"
                                    @click="removeTechnology(index)"
                                >
                                    {{ tech }}
                                    <UIcon
                                        name="i-heroicons-x-mark"
                                        class="ml-1 h-4 w-4"
                                    />
                                </UBadge>
                            </div>
                        </div>
                    </div>

                    <!-- Expertise Fields -->
                    <div class="space-y-4 pt-6 border-t">
                        <h3 class="text-lg font-semibold">Áreas de Atuação</h3>
                        <p
                            class="text-sm text-neutral-600 dark:text-neutral-400"
                        >
                            Digite e pressione Enter para adicionar campos como
                            "fresh food, ecommerce, crypto"
                        </p>

                        <div class="space-y-3">
                            <UInput
                                v-model="newExpertise"
                                placeholder="Ex: fresh food, ecommerce, crypto..."
                                size="lg"
                                class="w-full"
                                @keydown.enter.prevent="addExpertise"
                            />

                            <div
                                v-if="formData.expertise_fields.length > 0"
                                class="flex flex-wrap gap-2"
                            >
                                <UBadge
                                    v-for="(
                                        field, index
                                    ) in formData.expertise_fields"
                                    :key="index"
                                    color="info"
                                    variant="subtle"
                                    size="md"
                                    class="cursor-pointer hover:bg-error-100"
                                    @click="removeExpertise(index)"
                                >
                                    {{ field }}
                                    <UIcon
                                        name="i-heroicons-x-mark"
                                        class="ml-1 h-4 w-4"
                                    />
                                </UBadge>
                            </div>
                        </div>
                    </div>

                    <!-- Submit Button -->
                    <div class="flex justify-end gap-3 pt-6 border-t">
                        <UButton
                            type="button"
                            variant="outline"
                            size="lg"
                            @click="navigateTo('/diretorio')"
                        >
                            Cancelar
                        </UButton>
                        <UButton
                            type="submit"
                            color="primary"
                            size="lg"
                            :loading="saving"
                            :disabled="!formData.name || !formData.email"
                        >
                            {{
                                isEditing ? "Salvar Alterações" : "Criar Perfil"
                            }}
                        </UButton>
                    </div>
                </form>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { AlumniFormData } from "~/types/alumni";
import { validateLinkedinUrl } from "~/types/alumni";

const { userId, isLoaded, isSignedIn } = useAuth();
const { user: clerkUser } = useUser();
const toast = useToast();

const loading = ref(true);
const saving = ref(false);
const isEditing = ref(false);
const newTechnology = ref("");
const newExpertise = ref("");

// Profile image upload
const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const uploadingImage = ref(false);
const uploadedImageUrl = ref<string | null>(null);
const previewImageUrl = ref<string | null>(null);

// Get Clerk profile image
const profileImageUrl = computed(() => {
    // Show preview of selected file first (before upload)
    if (previewImageUrl.value) {
        return previewImageUrl.value;
    }

    // Show uploaded image if available
    if (uploadedImageUrl.value) {
        return uploadedImageUrl.value;
    }

    return clerkUser?.value?.imageUrl || null;
});

const formData = ref<AlumniFormData>({
    name: "",
    phone: "",
    email: "",
    linkedin: "",
    role: "",
    current_company: "",
    graduation_year: "",
    is_dropout: false,
    profile_image_url: "",
    technologies: [],
    expertise_fields: [],
});

const linkedinError = ref<string | undefined>(undefined);

const linkedinValidation = () => {
    const value = formData.value.linkedin;
    linkedinError.value = !validateLinkedinUrl(value)
        ? "URL de LinkedIn inválida"
        : undefined;
};

// Fetch existing profile if editing
const fetchProfile = async () => {
    // Wait for auth to be loaded
    if (!isLoaded.value) {
        return;
    }

    // If not signed in, stop loading
    if (!isSignedIn.value) {
        loading.value = false;
        return;
    }

    loading.value = true;

    // Always get email from Clerk user (client-side only)
    let clerkEmail = "";
    let clerkName = "";
    if (process.client) {
        try {
            const { user } = useUser();
            if (user?.value) {
                clerkEmail = user.value.primaryEmailAddress?.emailAddress || "";
                clerkName =
                    user.value.fullName ||
                    `${user.value.firstName || ""} ${user.value.lastName || ""}`.trim() ||
                    "";
            }
        } catch (authError) {
            console.error("Could not get Clerk user data:", authError);
        }
    }

    try {
        const data = await $fetch("/api/alumni/me");

        if (data) {
            // Profile found - auto-fill form with existing data
            isEditing.value = true;
            formData.value = {
                name: data.name || clerkName,
                phone: data.phone || "",
                email: clerkEmail || data.email || "", // use Clerk email first
                linkedin: data.linkedin || "",
                role: data.role || "",
                current_company: data.current_company || "",
                graduation_year: data.graduation_year
                    ? data.graduation_year.toString()
                    : "",
                is_dropout: data.is_dropout || false,
                profile_image_url: data.profile_image_url || "",
                technologies: Array.isArray(data.technologies)
                    ? data.technologies
                    : [],
                expertise_fields: Array.isArray(data.expertise_fields)
                    ? data.expertise_fields
                    : [],
            };
        } else {
            // No profile found - creating new one
            isEditing.value = false;

            // Pre-populate with Clerk user data for new profiles
            if (clerkUser?.value) {
                formData.value.name =
                    clerkUser.value.fullName ||
                    `${clerkUser.value.firstName || ""} ${clerkUser.value.lastName || ""}`.trim() ||
                    "";
                formData.value.email =
                    clerkUser.value.primaryEmailAddress?.emailAddress || "";
            }
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
        // If error occurred, we're creating a new one
        isEditing.value = false;

        // Pre-populate with Clerk user data for new profiles
        if (clerkUser?.value) {
            formData.value.name =
                clerkUser.value.fullName ||
                `${clerkUser.value.firstName || ""} ${clerkUser.value.lastName || ""}`.trim() ||
                "";
            formData.value.email =
                clerkUser.value.primaryEmailAddress?.emailAddress || "";
        }
    } finally {
        loading.value = false;
    }
};

const addTechnology = () => {
    const tech = newTechnology.value.trim();
    if (tech && !formData.value.technologies.includes(tech)) {
        formData.value.technologies.push(tech);
        newTechnology.value = "";
    }
};

const removeTechnology = (index: number) => {
    formData.value.technologies.splice(index, 1);
};

const addExpertise = () => {
    const expertise = newExpertise.value.trim();
    if (expertise && !formData.value.expertise_fields.includes(expertise)) {
        formData.value.expertise_fields.push(expertise);
        newExpertise.value = "";
    }
};

const removeExpertise = (index: number) => {
    formData.value.expertise_fields.splice(index, 1);
};

// Profile image upload handlers
const triggerFileInput = () => {
    fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
        // Validate file type
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            toast.add({
                title: "Tipo de arquivo inválido",
                description:
                    "Por favor, escolha uma imagem JPEG, PNG, GIF ou WebP",
                color: "error",
                duration: 2000,
            });
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.add({
                title: "Arquivo muito grande",
                description: "O tamanho máximo é 10MB",
                color: "error",
                duration: 2000,
            });
            return;
        }

        selectedFile.value = file;

        // Create preview URL
        if (previewImageUrl.value) {
            URL.revokeObjectURL(previewImageUrl.value);
        }
        previewImageUrl.value = URL.createObjectURL(file);
    }
};

const uploadProfileImage = async () => {
    if (!selectedFile.value) return;

    uploadingImage.value = true;

    try {
        const formData = new FormData();
        formData.append("file", selectedFile.value);

        const response = await $fetch<{ success: boolean; imageUrl: string }>(
            "/api/profile-image/upload",
            {
                method: "POST",
                body: formData,
            },
        );

        if (response.success) {
            uploadedImageUrl.value = response.imageUrl;

            toast.add({
                title: "Sucesso!",
                description: "Foto de perfil atualizada",
                color: "success",
                duration: 2000,
            });

            // Clean up preview URL
            if (previewImageUrl.value) {
                URL.revokeObjectURL(previewImageUrl.value);
                previewImageUrl.value = null;
            }

            // Clear selection
            selectedFile.value = null;
            if (fileInput.value) {
                fileInput.value.value = "";
            }
        }
    } catch (error: any) {
        console.error("Error uploading image:", error);
        toast.add({
            title: "Erro",
            description:
                error?.data?.statusMessage ||
                "Não foi possível fazer upload da imagem",
            color: "error",
            duration: 2000,
        });
    } finally {
        uploadingImage.value = false;
    }
};

// Cleanup on unmount
onBeforeUnmount(() => {
    if (previewImageUrl.value) {
        URL.revokeObjectURL(previewImageUrl.value);
    }
});

const handleSubmit = async () => {
    // Validate profile picture is set
    if (!profileImageUrl.value) {
        toast.add({
            title: "Erro",
            description: "Por favor, faça upload de uma foto de perfil",
            color: "error",
            duration: 3000,
        });
        return;
    }

    saving.value = true;
    try {
        const alumniData = {
            clerk_user_id: userId.value,
            name: formData.value.name,
            phone: formData.value.phone || null,
            email: formData.value.email,
            linkedin: formData.value.linkedin || null,
            role: formData.value.role || null,
            current_company: formData.value.current_company || null,
            graduation_year: formData.value.is_dropout
                ? null
                : formData.value.graduation_year
                  ? parseInt(formData.value.graduation_year)
                  : null,
            is_dropout: formData.value.is_dropout,
            // profile_image_url is automatically synced from Clerk on the backend
            technologies:
                formData.value.technologies.length > 0
                    ? formData.value.technologies
                    : null,
            expertise_fields:
                formData.value.expertise_fields.length > 0
                    ? formData.value.expertise_fields
                    : null,
            updated_at: new Date().toISOString(),
        };

        const res = await $fetch("/api/alumni/upsert", {
            method: "POST",
            body: alumniData,
        });

        toast.add({
            title: "Sucesso!",
            description: isEditing.value
                ? "Perfil atualizado com sucesso"
                : "Perfil criado com sucesso",
            color: "success",
            duration: 2000,
        });

        navigateTo("/perfil");
    } catch (error) {
        console.error("Error saving profile:", error);
        toast.add({
            title: "Erro",
            description: "Não foi possível salvar o perfil",
            color: "error",
            duration: 2000,
        });
    } finally {
        saving.value = false;
    }
};

// Watch for auth to be loaded before fetching profile
watch([isLoaded, isSignedIn, userId], () => {
    if (isLoaded.value) {
        fetchProfile();
    }
}, { immediate: true });
</script>
