<script setup lang="ts">
import { type Contact } from '../services/api';

interface Props {
  contact: Contact;
}

interface Emits {
  (e: 'edit', contact: Contact): void;
  (e: 'delete', id: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const getContactName = (contact: Contact) => {
  if (contact.type === 'individual') {
    return `${contact.firstName} ${contact.lastName}`;
  }
  return contact.companyName;
};

const getContactIcon = (contact: Contact) => {
  return contact.type === 'individual' ? 'mdi-account' : 'mdi-office-building';
};

const getContactColor = (contact: Contact) => {
  return contact.type === 'individual' ? 'blue' : 'orange';
};
</script>

<template>
  <v-card elevation="2" hover class="contact-card d-flex flex-column" height="100%">
    <v-card-title class="d-flex align-center pa-4">
      <v-avatar :color="getContactColor(contact)" size="40" class="mr-3">
        <v-icon :icon="getContactIcon(contact)" color="white" />
      </v-avatar>
      <div class="flex-grow-1 text-truncate">
        <div class="text-h6 text-truncate">{{ getContactName(contact) }}</div>
        <v-chip
          :color="getContactColor(contact)"
          size="x-small"
          variant="outlined"
          class="mt-1"
        >
          {{ contact.type === 'individual' ? 'Individuel' : 'Professionnel' }}
        </v-chip>
      </div>
    </v-card-title>

    <v-card-text class="flex-grow-1 pa-4">
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-email" size="small" class="mr-2" />
        <span class="text-body-2 text-truncate">{{ contact.email }}</span>
      </div>

      <div v-if="contact.type === 'professional'" class="d-flex align-center">
        <v-icon icon="mdi-identifier" size="small" class="mr-2" />
        <span class="text-body-2">SIREN: {{ contact.sirenNumber }}</span>
      </div>
    </v-card-text>

    <v-card-actions class="pa-4 pt-0">
      <v-spacer />
      <v-btn
        color="primary"
        variant="text"
        size="small"
        icon="mdi-pencil"
        @click="emit('edit', contact)"
      />
      <v-btn
        color="error"
        variant="text"
        size="small"
        icon="mdi-delete"
        @click="emit('delete', contact.id!)"
      />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.contact-card {
  min-height: 260px;
  max-height: 260px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>