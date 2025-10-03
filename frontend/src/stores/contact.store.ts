import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { contactsAPI, type Contact } from '../services/api';

export const useContactStore = defineStore('contact', () => {
  // State
  const contacts = ref<Contact[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const searchQuery = ref('');

  // Getters
  const filteredContacts = computed(() => {
    if (!searchQuery.value || searchQuery.value.trim() === '') {
      return contacts.value;
    }
    
    const query = searchQuery.value.toLowerCase().trim();
    return contacts.value.filter((contact) => {
      if (contact.type === 'individual') {
        return (
          contact.firstName.toLowerCase().includes(query) ||
          contact.lastName.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query)
        );
      } else {
        return (
          contact.companyName.toLowerCase().includes(query) ||
          contact.sirenNumber.includes(query) ||
          contact.email.toLowerCase().includes(query)
        );
      }
    });
  });

  const hasContacts = computed(() => contacts.value.length > 0);

  // Actions
  const fetchContacts = async (search?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await contactsAPI.getAll(search);
      contacts.value = response.data.contacts;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de la récupération des contacts';
      console.error('Fetch contacts error:', err);
    } finally {
      loading.value = false;
    }
  };

  const createContact = async (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await contactsAPI.create(contact);
      contacts.value.unshift(response.data.contact); // Ajouter au début
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de la création du contact';
      console.error('Create contact error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateContact = async (id: number, contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await contactsAPI.update(id, contact);
      const index = contacts.value.findIndex((c) => c.id === id);
      if (index !== -1) {
        contacts.value[index] = response.data.contact;
      }
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de la mise à jour du contact';
      console.error('Update contact error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteContact = async (id: number) => {
    loading.value = true;
    error.value = null;

    try {
      await contactsAPI.delete(id);
      contacts.value = contacts.value.filter((c) => c.id !== id);
      return true;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Erreur lors de la suppression du contact';
      console.error('Delete contact error:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const setSearchQuery = (query: string) => {
    searchQuery.value = query;
  };

  return {
    // State
    contacts,
    loading,
    error,
    searchQuery,
    // Getters
    filteredContacts,
    hasContacts,
    // Actions
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    clearError,
    setSearchQuery,
  };
});