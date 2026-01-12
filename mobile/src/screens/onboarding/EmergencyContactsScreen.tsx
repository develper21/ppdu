import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {COLORS, SIZES} from '@constants/index';
import {AuthStackParamList} from '@navigation/AppNavigator';

type EmergencyContactsNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'EmergencyContacts'>;

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

const EmergencyContactsScreen = () => {
  const navigation = useNavigation<EmergencyContactsNavigationProp>();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false,
  });

  const handleAddContact = () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (contacts.length >= 5) {
      Alert.alert('Limit Reached', 'You can add maximum 5 emergency contacts');
      return;
    }

    const newContact: EmergencyContact = {
      id: Date.now().toString(),
      ...formData,
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);

    setFormData({
      name: '',
      phone: '',
      relationship: '',
      isPrimary: false,
    });

    Alert.alert('Success', 'Emergency contact added successfully');
  };

  const handleRemoveContact = (contactId: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedContacts = contacts.filter(c => c.id !== contactId);
            setContacts(updatedContacts);
            Alert.alert('Success', 'Emergency contact removed');
          },
        },
      ],
    );
  };

  const handleSetPrimary = (contactId: string) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === contactId,
    }));
    setContacts(updatedContacts);
    Alert.alert('Success', 'Primary emergency contact updated');
  };

  const handleContinue = () => {
    if (contacts.length === 0) {
      Alert.alert(
        'No Contacts',
        'Please add at least one emergency contact to continue',
      );
      return;
    }

    // Store contacts locally (in real app, this would save to backend)
    // await AsyncStorage.setItem('emergencyContacts', JSON.stringify(contacts));

    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Contacts</Text>
        <Text style={styles.subtitle}>
          Add trusted contacts who will be notified during emergencies
        </Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.addContactForm}>
            <Text style={styles.formTitle}>Add New Contact</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData(prev => ({...prev, name: text}))}
                placeholder="Enter contact name"
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={text => setFormData(prev => ({...prev, phone: text}))}
                placeholder="+1234567890"
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Relationship</Text>
              <TextInput
                style={styles.input}
                value={formData.relationship}
                onChangeText={text => setFormData(prev => ({...prev, relationship: text}))}
                placeholder="e.g., Mother, Friend, Partner"
                maxLength={30}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                (!formData.name || !formData.phone) && styles.addButtonDisabled,
              ]}
              onPress={handleAddContact}
              disabled={!formData.name || !formData.phone}>
              <Text style={styles.addButtonText}>
                Add Contact ({contacts.length}/5)
              </Text>
            </TouchableOpacity>
          </View>

          {contacts.map(contact => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactHeader}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>
                    {contact.isPrimary && '⭐ '}
                    {contact.name}
                  </Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                  {contact.relationship && (
                    <Text style={styles.contactRelationship}>
                      {contact.relationship}
                    </Text>
                  )}
                </View>
                <View style={styles.contactActions}>
                  {!contact.isPrimary && (
                    <TouchableOpacity
                      style={styles.primaryButton}
                      onPress={() => handleSetPrimary(contact.id)}>
                      <Text style={styles.primaryButtonText}>Set Primary</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveContact(contact.id)}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {contacts.length > 0 && (
            <View style={styles.noteContainer}>
              <Text style={styles.note}>
                💡 Your primary contact will be called first during SOS activation
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            contacts.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={contacts.length === 0}>
          <Text style={styles.continueButtonText}>
            {contacts.length > 0 ? 'Complete Setup' : 'Skip for Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: SIZES.xl2,
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  title: {
    fontSize: SIZES.xl2,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  subtitle: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SIZES.lg,
  },
  addContactForm: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.lg,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  inputGroup: {
    marginBottom: SIZES.base,
  },
  label: {
    fontSize: SIZES.sm,
    color: COLORS.text,
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.textLight,
    borderRadius: SIZES.radiusBase,
    padding: SIZES.base,
    fontSize: SIZES.base,
    backgroundColor: COLORS.background,
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusBase,
    alignItems: 'center',
    marginTop: SIZES.sm,
  },
  addButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  addButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.base,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  contactPhone: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xs,
  },
  contactRelationship: {
    fontSize: SIZES.sm,
    color: COLORS.textLight,
    fontStyle: 'italic',
  },
  contactActions: {
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.xs,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SIZES.sm,
    paddingVertical: SIZES.xs,
    borderRadius: SIZES.radiusSm,
  },
  removeButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.xs,
    fontWeight: '500',
  },
  noteContainer: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.base,
    marginTop: SIZES.base,
  },
  note: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    padding: SIZES.lg,
    paddingTop: SIZES.base,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.textLight,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: COLORS.textLight,
  },
  continueButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
});

export default EmergencyContactsScreen;
