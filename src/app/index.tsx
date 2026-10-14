import * as Calendar from 'expo-calendar';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MaintenanceRecord = {
  id: string;
  title: string;
  date: string;
  mileage: number;
  cost: number;
  notes: string;
  nextDueMileage?: number;
  nextDueDate?: string;
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const initialRecords: MaintenanceRecord[] = [
  {
    id: '1',
    title: 'Oil change',
    date: '2026-09-12',
    mileage: 125400,
    cost: 72,
    notes: 'Synthetic blend oil and new filter.',
    nextDueMileage: 130000,
    nextDueDate: '2026-12-15',
  },
  {
    id: '2',
    title: 'Brake inspection',
    date: '2026-08-08',
    mileage: 122600,
    cost: 145,
    notes: 'Pads looked healthy, no service needed.',
    nextDueMileage: 128000,
  },
  {
    id: '3',
    title: 'Tire rotation',
    date: '2026-07-04',
    mileage: 119050,
    cost: 58,
    notes: 'Tires rotated and rebalanced.',
    nextDueDate: '2026-10-30',
  },
];

const today = new Date();
const defaultDate = today.toISOString().slice(0, 10);
const commonServices = [
  'Oil change',
  'Brake inspection',
  'Tire rotation',
  'Battery replacement',
  'Spark plug service',
  'Transmission fluid',
  'Coolant flush',
  'Alignment',
  'Air filter',
  'Inspection',
];

const isValidDateString = (value: string) => {
  if (!value.trim()) {
    return false;
  }

  const parsed = new Date(`${value}T12:00:00`);
  return !Number.isNaN(parsed.getTime());
};

const createCalendarReminder = async (serviceTitle: string, dueDate: string) => {
  try {
    const { status } = await Calendar.requestCalendarPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Calendar access needed', 'Allow access to create a reminder for your next service.');
      return;
    }

    const calendar = await Calendar.getDefaultCalendarAsync();
    const reminderDate = new Date(`${dueDate}T09:00:00`);
    const endDate = new Date(reminderDate.getTime() + 60 * 60 * 1000);

    await Calendar.createEventAsync(calendar.id, {
      title: `Service reminder: ${serviceTitle}`,
      startDate: reminderDate,
      endDate,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      location: 'Vehicle service',
      notes: 'Reminder created from the car maintenance app.',
    });

    Alert.alert('Reminder added', `A calendar reminder was scheduled for ${dueDate}.`);
  } catch (error) {
    Alert.alert('Could not add reminder', 'Please check your calendar settings and try again.');
  }
};

export default function HomeScreen() {
  const [records, setRecords] = useState<MaintenanceRecord[]>(initialRecords);
  const [selectedService, setSelectedService] = useState('Oil change');
  const [customService, setCustomService] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [mileage, setMileage] = useState('126200');
  const [cost, setCost] = useState('89');
  const [notes, setNotes] = useState('');
  const [nextDueMileage, setNextDueMileage] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');

  const serviceTitle = customService.trim() || selectedService;

  const totalSpent = useMemo(
    () => records.reduce((sum, record) => sum + record.cost, 0),
    [records],
  );

  const nextServiceDue = useMemo(() => {
    const sorted = [...records].sort((a, b) => b.mileage - a.mileage);
    const highestMileage = sorted[0]?.mileage ?? 0;
    return highestMileage + 5000;
  }, [records]);

  const lastService = useMemo(() => {
    const sorted = [...records].sort((a, b) => b.mileage - a.mileage);
    return sorted[0];
  }, [records]);

  const addRecord = () => {
    const cleanedTitle = serviceTitle.trim();
    const cleanedMileage = Number(mileage);
    const cleanedCost = Number(cost);
    const cleanedNextDueMileage = nextDueMileage.trim() ? Number(nextDueMileage) : undefined;

    if (!cleanedTitle || !date || Number.isNaN(cleanedMileage) || Number.isNaN(cleanedCost)) {
      Alert.alert('Missing info', 'Add a service type, date, mileage, and cost to save the record.');
      return;
    }

    if (nextDueMileage.trim() && Number.isNaN(cleanedNextDueMileage)) {
      Alert.alert('Invalid mileage', 'Next due mileage must be a valid number.');
      return;
    }

    const newRecord: MaintenanceRecord = {
      id: `${Date.now()}`,
      title: cleanedTitle,
      date,
      mileage: cleanedMileage,
      cost: cleanedCost,
      notes: notes.trim(),
      nextDueMileage: cleanedNextDueMileage,
      nextDueDate: nextDueDate.trim() || undefined,
    };

    setRecords((current) => [...current, newRecord].sort((a, b) => b.mileage - a.mileage));

    if (nextDueDate.trim() && isValidDateString(nextDueDate)) {
      Alert.alert(
        'Add calendar reminder?',
        `Create a calendar reminder for ${new Date(`${nextDueDate.trim()}T12:00:00`).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}?`,
        [
          { text: 'No thanks', style: 'cancel' },
          {
            text: 'Add reminder',
            onPress: async () => {
              await createCalendarReminder(cleanedTitle, nextDueDate.trim());
            },
          },
        ],
      );
    }

    setSelectedService('Oil change');
    setCustomService('');
    setDate(defaultDate);
    setMileage(String(cleanedMileage + 500));
    setCost('');
    setNotes('');
    setNextDueMileage('');
    setNextDueDate('');
  };

  const removeRecord = (id: string) => {
    setRecords((current) => current.filter((record) => record.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.kicker}>Garage overview</Text>
            <Text style={styles.title}>2022 Toyota Camry</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Healthy</Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Current mileage</Text>
          <Text style={styles.heroValue}>{lastService?.mileage.toLocaleString() ?? '0'} mi</Text>
          <Text style={styles.heroMeta}>Next service due around {nextServiceDue.toLocaleString()} mi</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total spent</Text>
            <Text style={styles.statValue}>{currency.format(totalSpent)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Last service</Text>
            <Text style={styles.statValue}>{lastService?.title ?? 'No service yet'}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Next reminder</Text>
            <Text style={styles.statValue}>{currency.format(150)}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Add maintenance</Text>

          <Text style={styles.label}>Service</Text>
          <View style={styles.chipGroup}>
            {commonServices.map((service) => {
              const isSelected = !customService && selectedService === service;

              return (
                <Pressable
                  key={service}
                  onPress={() => {
                    setSelectedService(service);
                    setCustomService('');
                  }}
                  style={[styles.serviceChip, isSelected && styles.serviceChipSelected]}
                >
                  <Text style={[styles.serviceChipText, isSelected && styles.serviceChipTextSelected]}>
                    {service}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={customService}
            onChangeText={(value) => {
              setCustomService(value);
              if (value.trim()) {
                setSelectedService(value.trim());
              }
            }}
            placeholder="Add custom service"
            style={styles.input}
          />

          <View style={styles.twoColumnRow}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Date</Text>
              <TextInput value={date} onChangeText={setDate} style={styles.input} keyboardType="default" />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Mileage</Text>
              <TextInput
                value={mileage}
                onChangeText={setMileage}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>Cost</Text>
          <TextInput
            value={cost}
            onChangeText={setCost}
            style={styles.input}
            keyboardType="numeric"
            placeholder="129"
          />

          <Text style={styles.sectionHint}>Next service due (optional)</Text>
          <View style={styles.twoColumnRow}>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Mileage</Text>
              <TextInput
                value={nextDueMileage}
                onChangeText={setNextDueMileage}
                style={styles.input}
                keyboardType="numeric"
                placeholder="130000"
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>Date</Text>
              <TextInput
                value={nextDueDate}
                onChangeText={setNextDueDate}
                style={styles.input}
                placeholder="2027-02-15"
              />
            </View>
          </View>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, styles.textArea]}
            multiline
            placeholder="Brake fluid topped up..."
          />

          <Pressable onPress={addRecord} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Save record</Text>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          <Text style={styles.sectionTitle}>Recent maintenance</Text>

          {records.map((record) => (
            <View key={record.id} style={styles.recordItem}>
              <View style={styles.recordHeader}>
                <View>
                  <Text style={styles.recordTitle}>{record.title}</Text>
                  <Text style={styles.recordMeta}>
                    {new Date(`${record.date}T12:00:00`).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </Text>
                </View>
                <Pressable onPress={() => removeRecord(record.id)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>Remove</Text>
                </Pressable>
              </View>

              <View style={styles.recordFooter}>
                <Text style={styles.recordValue}>{record.mileage.toLocaleString()} mi</Text>
                <Text style={styles.recordValue}>{currency.format(record.cost)}</Text>
              </View>

              {(record.nextDueMileage || record.nextDueDate) ? (
                <Text style={styles.recordNotes}>
                  Next due:{' '}
                  {record.nextDueMileage ? `${record.nextDueMileage.toLocaleString()} mi` : ''}
                  {record.nextDueMileage && record.nextDueDate ? ' or ' : ''}
                  {record.nextDueDate
                    ? new Date(`${record.nextDueDate}T12:00:00`).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
                </Text>
              ) : null}

              {record.notes ? <Text style={styles.recordNotes}>{record.notes}</Text> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f6fb',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kicker: {
    color: '#4b5563',
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 6,
  },
  badge: {
    backgroundColor: '#dcfce7',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  heroCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 22,
    marginBottom: 18,
  },
  heroLabel: {
    color: '#a5b4fc',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  heroValue: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
    marginTop: 12,
  },
  heroMeta: {
    color: '#dbeafe',
    fontSize: 14,
    marginTop: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    width: '31%',
    minWidth: 110,
    flexGrow: 1,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  statValue: {
    marginTop: 8,
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 14,
  },
  sectionHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4b5563',
    marginBottom: 8,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  serviceChip: {
    backgroundColor: '#eef2ff',
    borderColor: '#c7d2fe',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  serviceChipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  serviceChipText: {
    color: '#1e3a8a',
    fontSize: 12,
    fontWeight: '700',
  },
  serviceChipTextSelected: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
    marginBottom: 14,
  },
  textArea: {
    minHeight: 94,
    textAlignVertical: 'top',
  },
  twoColumnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
  },
  recordItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  recordMeta: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 6,
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: '#b91c1c',
    fontSize: 11,
    fontWeight: '700',
  },
  recordFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  recordValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1f2937',
  },
  recordNotes: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: '#374151',
  },
});
