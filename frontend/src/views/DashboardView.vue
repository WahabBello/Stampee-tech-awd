<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>Dashboard</v-app-bar-title>
      
      <v-spacer />
      
      <v-chip class="mr-4" variant="outlined">
        <v-icon start icon="mdi-account-circle" />
        {{ authStore.user?.email }}
      </v-chip>
      
      <v-btn
        color="white"
        variant="outlined"
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        Déconnexion
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main style="background-color: #f5f5f5;">
      <v-container class="py-8">
        <v-card elevation="2">
          <v-card-title class="text-h5 pa-6">
            <v-icon icon="mdi-contacts" class="mr-2" />
            Gestion des contacts
          </v-card-title>
          
          <v-divider />
          
          <v-card-text class="pa-6">
            <v-alert
              type="info"
              variant="tonal"
              class="mb-4"
            >
              Maintenance en cours.
            </v-alert>
            
            <p class="text-body-1">
              Bienvenue, <strong>{{ authStore.user?.email }}</strong> !
            </p>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>