<script setup lang="ts">
import { ref, watch } from 'vue';
import { type Contact } from '../services/api';

interface Props {
  modelValue: boolean;
  contact?: Contact | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const contactType = ref<'individual' | 'professional'>('individual');
const firstName = ref('');
const lastName = ref('');
const companyName = ref('');
const sirenNumber = ref('');
const email = ref('');
const formValid = ref(false);
const isEditMode = ref(false);
const isSubmitting = ref(false); // Pour empêcher les doubles clics

// Règles de validation
const emailRules = [
  (v: string) => !!v || 'Email requis',
  (v: string) => /.+@.+\..+/.test(v) || 'Email invalide',
];

const firstNameRules = [
  (v: string) => !!v || 'Prénom requis',
];

const lastNameRules = [
  (v: string) => !!v || 'Nom requis',
];

const companyNameRules = [
  (v: string) => !!v || 'Nom de l\'entreprise requis',
];

const sirenRules = [
  (v: string) => !!v || 'Numéro SIREN requis',
  (v: string) => /^\d{9}$/.test(v) || 'Le SIREN doit contenir exactement 9 chiffres',
];

// Watcher pour pré-remplir le formulaire en mode édition
watch([() => props.contact, () => props.modelValue], ([newContact, isOpen]) => {
  if (isOpen && newContact) {
    // Mode édition
    isEditMode.value = true;
    contactType.value = newContact.type;
    email.value = newContact.email;
    
    if (newContact.type === 'individual') {
      firstName.value = newContact.firstName;
      lastName.value = newContact.lastName;
      companyName.value = '';
      sirenNumber.value = '';
    } else {
      companyName.value = newContact.companyName;
      sirenNumber.value = newContact.sirenNumber;
      firstName.value = '';
      lastName.value = '';
    }
  } else if (isOpen && !newContact) {
    // Mode création
    isEditMode.value = false;
    resetForm();
  }
}, { immediate: true });

// Watcher pour réinitialiser le formulaire quand on ouvre/ferme
watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) {
    // Quand on ferme, toujours réinitialiser après un délai pour l'animation
    setTimeout(() => {
      resetForm();
    }, 200);
  }
});

const resetForm = () => {
  contactType.value = 'individual';
  firstName.value = '';
  lastName.value = '';
  companyName.value = '';
  sirenNumber.value = '';
  email.value = '';
  formValid.value = false;
  isEditMode.value = false;
  isSubmitting.value = false; // Réinitialiser l'état de soumission
};

const handleSave = async () => {
  if (!formValid.value || isSubmitting.value) return;

  isSubmitting.value = true; // Bloquer les doubles clics

  let contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;

  if (contactType.value === 'individual') {
    contact = {
      type: 'individual',
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    };
  } else {
    contact = {
      type: 'professional',
      companyName: companyName.value,
      sirenNumber: sirenNumber.value,
      email: email.value,
    };
  }

  emit('save', contact);
  // Le formulaire sera réinitialisé par le watcher quand modelValue passe à false
  // isSubmitting sera réinitialisé par resetForm()
};

const handleClose = () => {
  emit('update:modelValue', false);
  // Le formulaire sera réinitialisé par le watcher
};
</script>

<template>
  <v-dialog :model-value="modelValue" max-width="600" persistent>
    <v-card>
      <v-card-title class="text-h5 pa-4">
        {{ contact ? 'Modifier le contact' : 'Nouveau contact' }}
      </v-card-title>

      <v-divider />

      <v-card-text class="pa-4">
        <v-form v-model="formValid">
          <!-- Type de contact -->
          <div class="mb-4">
            <label class="text-subtitle-2 mb-2 d-block">Type de contact</label>
            <v-btn-toggle
              v-model="contactType"
              color="primary"
              mandatory
              divided
              class="w-100"
              :disabled="isEditMode"
            >
              <v-btn value="individual" class="flex-grow-1">
                <v-icon icon="mdi-account" class="mr-2" />
                Individuel
              </v-btn>
              <v-btn value="professional" class="flex-grow-1">
                <v-icon icon="mdi-office-building" class="mr-2" />
                Professionnel
              </v-btn>
            </v-btn-toggle>
            <p v-if="isEditMode" class="text-caption text-grey mt-1">
              Le type de contact ne peut pas être modifié
            </p>
          </div>

          <!-- Formulaire Individual -->
          <div v-if="contactType === 'individual'">
            <v-text-field
              v-model="firstName"
              label="Prénom"
              :rules="firstNameRules"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="lastName"
              label="Nom"
              :rules="lastNameRules"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              class="mb-2"
            />
          </div>

          <!-- Formulaire Professional -->
          <div v-else>
            <v-text-field
              v-model="companyName"
              label="Nom de l'entreprise"
              :rules="companyNameRules"
              prepend-inner-icon="mdi-office-building"
              variant="outlined"
              class="mb-2"
            />

            <v-text-field
              v-model="sirenNumber"
              label="Numéro SIREN"
              :rules="sirenRules"
              prepend-inner-icon="mdi-identifier"
              variant="outlined"
              hint="9 chiffres"
              persistent-hint
              class="mb-2"
            />
          </div>

          <!-- Email (commun) -->
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            :rules="emailRules"
            prepend-inner-icon="mdi-email"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleClose"
          :disabled="isSubmitting"
        >
          Annuler
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!formValid || isSubmitting"
          :loading="isSubmitting"
          @click="handleSave"
        >
          {{ contact ? 'Modifier' : 'Créer' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>