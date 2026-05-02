import React from 'react'
import { SafeAreaView, View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function SessionStd() {
  const params = useLocalSearchParams() as any
  const router = useRouter()

  const date = params.Date || params.date || 'Friday, February 28, 2025'
  const start_time = params.start_time || params.start || '15:00'
  const end_time = params.end_time || params.end || '16:30'
  const duration = params.duration || '90 min'
  const location = params.location || 'Online'
  const mode = params.mode || 'Google Meet'
  const status = (params.status || 'Upcoming').toString()
  const tutorName = params.tutorName || params.tutor || 'Sara Belhadj'
  const tutorSubject = params.tutorSubject || params.subject || 'Mathematics & Physics'
  const serviceTitle = params.serviceTitle || params.title || 'Individual Math Sessions'
  const rawModality = (params.modality || '').toString().toLowerCase()
  const rawMode = mode.toString().toLowerCase()
  const rawLocation = location.toString().toLowerCase()
  const modality =
    rawModality.includes('online') || rawMode.includes('online') || rawMode.includes('meet') || rawMode.includes('zoom') || rawMode.includes('teams')
      ? 'Online'
      : rawModality.includes('present') || rawModality.includes('présen') || rawModality.includes('in-person') || rawLocation.includes('class')
        ? 'In-person'
        : 'In-person'

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.headerSurface}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerMetaService} numberOfLines={1}>{serviceTitle}</Text>

          <View style={styles.statusPillHeader}>
            <Text style={styles.statusPillHeaderText}>{status}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        <View style={styles.timeCardOutsideHeader}>
          <View style={styles.timeBlockOutside}>
            <Text style={styles.timeLabelDark}>START TIME</Text>
            <Text style={styles.timeValueDark}>{start_time}</Text>
          </View>

          <View style={styles.timeSpacer} />

          <View style={styles.timeBlockOutside}>
            <Text style={styles.timeLabelDark}>END TIME</Text>
            <Text style={styles.timeValueDark}>{end_time}</Text>
          </View>
        </View>

        <View style={styles.sectionCardVertical}>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Date</Text>
            <Text style={styles.fieldValue}>{date}</Text>
          </View>
          <View style={styles.underline} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Modality</Text>
            <Text style={styles.fieldValue}>{modality}</Text>
          </View>
          <View style={styles.underline} />

          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Status</Text>
            <Text style={[styles.fieldValue, styles.statusText]}>{status}</Text>
          </View>
          <View style={styles.underline} />
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>TEACHER</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.teacherCardCompact}>
            <View style={styles.teacherAvatarSmall}>
              <Text style={styles.teacherAvatarText}>{tutorName.charAt(0)}</Text>
            </View>
            <View style={styles.teacherContentSmall}>
              <Text style={[styles.teacherName, { fontWeight: '600' }]}>{tutorName}</Text>
              <Text style={styles.teacherMeta}>{tutorSubject}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>SERVICE</Text>
            <View style={styles.sectionLine} />
          </View>
          <View style={styles.serviceRowCompact}>
            <Text style={[styles.serviceTitle, { fontWeight: '600' }]}>{serviceTitle}</Text>
          </View>
        </View>

        <View style={{ height: 12 }} />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#ECEEF5' },
  headerSurface: { backgroundColor: '#1E2378', paddingTop: 18, paddingBottom: 18, paddingHorizontal: 14 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerIconButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#27318C', alignItems: 'center', justifyContent: 'center' },
  headerMetaService: { flex: 1, color: '#FFFFFF', fontSize: 15, fontWeight: '600', marginHorizontal: 14 },
  statusPillHeader: { backgroundColor: '#D9F2E4', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  statusPillHeaderText: { color: '#138A4B', fontWeight: '700', fontSize: 12 },

  timeCardOutsideHeader: {
    backgroundColor: '#F8F9FD',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeBlockOutside: { flex: 1 },
  timeSpacer: { width: 30 },
  timeLabelDark: { fontSize: 11, color: '#8B94B3', fontWeight: '600', marginBottom: 6, letterSpacing: 0.4 },
  timeValueDark: { fontSize: 22, color: '#0A1A4B', fontWeight: '600' },

  headerHero: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  heroLeft: { flex: 1 },
  bigDay: { fontSize: 48, color: '#FFFFFF', fontWeight: '800' },
  smallMonth: { color: '#DDE2FF', marginTop: 6, fontWeight: '600' },
  weekday: { color: '#DDE2FF', marginTop: 4 },
  heroRight: { flex: 1, alignItems: 'flex-end' },
  statusPill: { backgroundColor: '#EEF1FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 10 },
  statusPillText: { color: '#1E2378', fontWeight: '700' },
  timeCardMain: { width: '100%', backgroundColor: '#2E347A', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timeBlockMain: { alignItems: 'center', flex: 1 },
  timeLabelSmall: { color: '#D7DFF8', fontSize: 12 },
  timeValueLarge: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  durationMain: { paddingHorizontal: 8 },
  durationMainText: { backgroundColor: '#FF8A1C', color: '#fff', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 18, fontWeight: '700' },

  scrollBody: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 100 },
  sectionCard: { backgroundColor: '#F8F9FD', borderRadius: 24, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 12 },
  sectionCardVertical: { backgroundColor: '#F8F9FD', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', letterSpacing: 1, color: '#0F236C' },
  sectionTitleVertical: { fontSize: 13, fontWeight: '600', letterSpacing: 1, color: '#0F236C', marginBottom: 12 },
  sectionLine: { marginLeft: 10, height: 1, flex: 1, backgroundColor: '#D7DCEB' },

  fieldRow: { paddingVertical: 10 },
  fieldLabel: { fontSize: 12, color: '#8B94B3', fontWeight: '600', marginBottom: 6 },
  fieldValue: { fontSize: 15, color: '#0A1A4B', fontWeight: '600' },
  underline: { height: 1, backgroundColor: '#EEF0F8', marginVertical: 6 },
  statusText: { color: '#1E2378', fontWeight: '700' },

  teacherCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 12, backgroundColor: '#EDEFF7' },
  teacherCardCompact: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#EDEFF7', borderRadius: 12 },
  teacherAvatar: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#1FB657', alignItems: 'center', justifyContent: 'center' },
  teacherAvatarSmall: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#1FB657', alignItems: 'center', justifyContent: 'center' },
  teacherAvatarText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF' },
  teacherContent: { flex: 1, marginLeft: 11 },
  teacherContentSmall: { flex: 1, marginLeft: 10 },
  teacherName: { fontSize: 15, fontWeight: '600', color: '#0B1A4C' },
  teacherMeta: { marginTop: 2, fontSize: 12, fontWeight: '400', color: '#4D5A86' },

  serviceRow: { paddingVertical: 8 },
  serviceRowCompact: { paddingVertical: 8 },
  serviceTitle: { fontWeight: '600', color: '#0A1A4B' },

  actionsRow: { marginTop: 8, alignItems: 'center' },
  primaryButton: { backgroundColor: '#1E2378', paddingVertical: 14, paddingHorizontal: 40, borderRadius: 10 },
  primaryText: { color: '#fff', fontWeight: '700' },
})
