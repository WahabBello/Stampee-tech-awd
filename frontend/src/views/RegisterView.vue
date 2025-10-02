<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const emailRules = [
  (v: string) => !!v || 'Email requis',
  (v: string) => /.+@.+\..+/.test(v) || 'Email invalide',
];

const passwordRules = [
  (v: string) => !!v || 'Mot de passe requis',
  (v: string) => v.length >= 6 || 'Le mot de passe doit contenir au moins 6 caractères',
];

const confirmPasswordRules = [
  (v: string) => !!v || 'Confirmation requise',
  (v: string) => v === password.value || 'Les mots de passe ne correspondent pas',
];

const formValid = ref(false);

const handleSubmit = async () => {
  if (!formValid.value) return;

  const success = await authStore.register({
    email: email.value,
    password: password.value,
  });

  if (success) {
    router.push('/dashboard');
  }
};
</script>

<template>
  <v-app>
    <v-main class="d-flex align-center justify-center" style="min-height: 100vh; background-color: #f5f5f5;">
      <v-container>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="pa-4" elevation="4">
              <v-card-title class="text-h4 text-center mb-4">
                Inscription
              </v-card-title>

              <!-- Message d'erreur général -->
              <v-alert
                v-if="authStore.error"
                type="error"
                variant="tonal"
                class="mb-4"
              >
                {{ authStore.error }}
              </v-alert>

              <v-card-text>
                <v-form v-model="formValid">
                  <!-- Email -->
                  <v-text-field
                    v-model="email"
                    label="Email"
                    type="email"
                    :rules="emailRules"
                    prepend-inner-icon="mdi-email"
                    variant="outlined"
                    class="mb-2"
                  />

                  <!-- Password -->
                  <v-text-field
                    v-model="password"
                    label="Mot de passe"
                    type="password"
                    :rules="passwordRules"
                    prepend-inner-icon="mdi-lock"
                    variant="outlined"
                    class="mb-2"
                  />

                  <!-- Confirm Password -->
                  <v-text-field
                    v-model="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    :rules="confirmPasswordRules"
                    prepend-inner-icon="mdi-lock-check"
                    variant="outlined"
                    class="mb-4"
                    @keyup.enter="handleSubmit"
                  />

                  <!-- Submit Button -->
                  <v-btn
                    color="primary"
                    block
                    size="large"
                    :loading="authStore.loading"
                    :disabled="!formValid || authStore.loading"
                    @click.prevent="handleSubmit"
                  >
                    S'inscrire
                  </v-btn>
                </v-form>
              </v-card-text>

              <!-- Link to Login -->
              <v-card-actions class="justify-center">
                <span class="text-body-2">Déjà un compte ?</span>
                <v-btn
                  variant="text"
                  color="primary"
                  @click="router.push('/login')"
                >
                  Se connecter
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>