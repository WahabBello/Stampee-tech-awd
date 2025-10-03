<script setup lang="ts">
import { type Contact } from '../services/api';

interface Props {
  contact: Contact;
}

interface Emits {
  (e: 'edit', contact: Contact): void;
  (e: 'delete', id: number): void;
}

const props = defineProps<Props>();
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

const getContactType = (contact: Contact) => {
  return contact.type === 'individual' ? 'Individuel' : 'Professionnel';
};
</script>

<template>
  <v-card elevation="1" hover class="mb-2">
    <v-list-item class="px-4">
      <template #prepend>
        <v-avatar :color="getContactColor(contact)" size="48">
          <v-icon :icon="getContactIcon(contact)" color="white" />
        </v-avatar>
      </template>

      <v-list-item-title class="text-h6 mb-1">
        {{ getContactName(contact) }}
      </v-list-item-title>

      <v-list-item-subtitle class="d-flex align-center flex-wrap">
        <v-chip
          :color="getContactColor(contact)"
          size="x-small"
          variant="outlined"
          class="mr-2 mb-1"
        >
          {{ getContactType(contact) }}
        </v-chip>

        <span class="d-flex align-center mr-4 mb-1">
          <v-icon icon="mdi-email" size="small" class="mr-1" />
          {{ contact.email }}
        </span>

        <span v-if="contact.type === 'professional'" class="d-flex align-center mb-1">
          <v-icon icon="mdi-identifier" size="small" class="mr-1" />
          SIREN: {{ contact.sirenNumber }}
        </span>
      </v-list-item-subtitle>

      <template #append>
        <div class="d-flex gap-2">
          <v-btn
            color="primary"
            variant="text"
            icon="mdi-pencil"
            size="small"
            @click="emit('edit', contact)"
          />
          <v-btn
            color="error"
            variant="text"
            icon="mdi-delete"
            size="small"
            @click="emit('delete', contact.id!)"
          />
        </div>
      </template>
    </v-list-item>
  </v-card>
</template>