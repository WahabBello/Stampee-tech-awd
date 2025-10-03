<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useContactStore } from '../stores/contact.store';
import ContactCard from '../components/ContactCard.vue';
import ContactListItem from '../components/ContactListItem.vue';
import ContactDialog from '../components/ContactDialog.vue';
import type { Contact } from '../services/api';

const router = useRouter();
const authStore = useAuthStore();
const contactStore = useContactStore();

const dialogOpen = ref(false);
const editingContact = ref<Contact | null>(null);
const deleteDialogOpen = ref(false);
const contactToDelete = ref<number | null>(null);
const searchQuery = ref('');
const viewMode = ref<'grid' | 'list'>('list'); // Vue par défaut: mosaïque

onMounted(() => {
  contactStore.fetchContacts();
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const openCreateDialog = () => {
  editingContact.value = null;
  dialogOpen.value = true;
};

const openEditDialog = (contact: Contact) => {
  editingContact.value = contact;
  dialogOpen.value = true;
};

const handleSaveContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
  let success = false;
  
  if (editingContact.value?.id) {
    success = await contactStore.updateContact(editingContact.value.id, contact);
  } else {
    success = await contactStore.createContact(contact);
  }

  if (success) {
    dialogOpen.value = false;
    editingContact.value = null;
  }
};

const confirmDelete = (id: number) => {
  contactToDelete.value = id;
  deleteDialogOpen.value = true;
};

const handleDelete = async () => {
  if (contactToDelete.value) {
    await contactStore.deleteContact(contactToDelete.value);
    deleteDialogOpen.value = false;
    contactToDelete.value = null;
  }
};

const handleSearch = () => {
  contactStore.setSearchQuery(searchQuery.value);
};

const handleClearSearch = () => {
  searchQuery.value = '';
  contactStore.setSearchQuery('');
};
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" elevation="2">
      <v-app-bar-title>
        <v-icon icon="mdi-contacts" class="mr-2" />
        Gestion des Contacts
      </v-app-bar-title>
      
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
        <!-- Header avec recherche et bouton créer -->
        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher un contact"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              clearable
              hide-details
              @input="handleSearch"
              @click:clear="handleClearSearch"
            />
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn-toggle
              v-model="viewMode"
              color="primary"
              mandatory
              divided
              class="w-100"
            >
              <v-btn value="grid" class="flex-grow-1">
                <v-icon icon="mdi-view-grid" />
                <span class="ml-2 d-none d-sm-inline">Mosaïque</span>
              </v-btn>
              <v-btn value="list" class="flex-grow-1">
                <v-icon icon="mdi-view-list" />
                <span class="ml-2 d-none d-sm-inline">Liste</span>
              </v-btn>
            </v-btn-toggle>
          </v-col>
          <v-col cols="12" md="3" class="d-flex align-center">
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-plus"
              block
              @click="openCreateDialog"
            >
              Nouveau
            </v-btn>
          </v-col>
        </v-row>

        <!-- Message d'erreur -->
        <v-alert
          v-if="contactStore.error"
          type="error"
          variant="tonal"
          closable
          class="mb-4"
          @click:close="contactStore.clearError()"
        >
          {{ contactStore.error }}
        </v-alert>

        <!-- Loading -->
        <v-row v-if="contactStore.loading && !contactStore.hasContacts" class="mt-8">
          <v-col cols="12" class="text-center">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-body-1">Chargement des contacts...</p>
          </v-col>
        </v-row>

        <!-- État vide -->
        <v-row v-else-if="!contactStore.hasContacts" class="mt-8">
          <v-col cols="12">
            <v-card class="text-center pa-8" elevation="2">
              <v-icon icon="mdi-account-multiple-outline" size="80" color="grey" class="mb-4" />
              <h2 class="text-h5 mb-4">Aucun contact</h2>
              <p class="text-body-1 mb-6">Commencez par créer votre premier contact</p>
              <v-btn
                color="primary"
                size="large"
                prepend-icon="mdi-plus"
                @click="openCreateDialog"
              >
                Créer un contact
              </v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Liste des contacts - Vue Mosaïque -->
        <v-row v-else-if="viewMode === 'grid'">
          <v-col
            v-for="contact in contactStore.filteredContacts"
            :key="contact.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <ContactCard
              :contact="contact"
              @edit="openEditDialog"
              @delete="confirmDelete"
            />
          </v-col>

          <!-- Message si aucun résultat de recherche -->
          <v-col v-if="contactStore.filteredContacts.length === 0" cols="12">
            <v-alert type="info" variant="tonal">
              Aucun contact ne correspond à votre recherche.
            </v-alert>
          </v-col>
        </v-row>

        <!-- Liste des contacts - Vue Liste -->
        <div v-else-if="viewMode === 'list'">
          <ContactListItem
            v-for="contact in contactStore.filteredContacts"
            :key="contact.id"
            :contact="contact"
            @edit="openEditDialog"
            @delete="confirmDelete"
          />

          <!-- Message si aucun résultat de recherche -->
          <v-alert v-if="contactStore.filteredContacts.length === 0" type="info" variant="tonal">
            Aucun contact ne correspond à votre recherche.
          </v-alert>
        </div>
      </v-container>
    </v-main>

    <!-- Dialog Création/Édition -->
    <ContactDialog
      v-model="dialogOpen"
      :contact="editingContact"
      @save="handleSaveContact"
    />

    <!-- Dialog Confirmation Suppression -->
    <v-dialog v-model="deleteDialogOpen" max-width="500">
      <v-card>
        <v-card-text class="text-center pa-8">
          <!-- Icône de warning -->
          <v-avatar color="error" size="80" class="mb-4">
            <v-icon icon="mdi-alert-circle-outline" size="50" color="white" />
          </v-avatar>

          <!-- Titre -->
          <h2 class="text-h5 mb-3">Supprimer ce contact ?</h2>

          <!-- Message -->
          <p class="text-body-1 text-grey-darken-1">
            Cette action est irréversible et supprimera définitivement ce contact.
          </p>
        </v-card-text>

        <v-divider />

        <!-- Actions -->
        <v-card-actions class="pa-4 justify-center">
          <v-btn
            variant="outlined"
            size="large"
            min-width="120"
            @click="deleteDialogOpen = false"
          >
            Annuler
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            size="large"
            min-width="120"
            :loading="contactStore.loading"
            @click="handleDelete"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>