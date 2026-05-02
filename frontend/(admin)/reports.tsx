import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert, Animated, Platform, Modal } from 'react-native';
import { ThemedView } from '../components/themed-view';
import { ThemedText } from '../components/themed-text';
import { useEffect, useRef, useState } from 'react';
import { AdminTheme } from '../constants/adminTheme';
import { apiJson } from '../constants/api';
import { getCurrentAdminId } from '../constants/adminSession';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

type ActionReport = {
  id: string;
  action: string;
  actor: string;
  note?: string;
  date: string;
  targetType?: string;
  targetId?: string;
  detail?: string;
};

const headingFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' });

type ReportsScreenProps = {
  onBack?: () => void;
};

export default function ReportsScreen({ onBack }: ReportsScreenProps) {
  const [reports, setReports] = useState<ActionReport[]>([]);
  const [adminId, setAdminId] = useState(getCurrentAdminId());
  const [loading, setLoading] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfNote, setPdfNote] = useState('');
  const [activeReport, setActiveReport] = useState<ActionReport | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchReports = async () => {
    const trimmed = adminId.trim();
    if (!trimmed) {
      Alert.alert('Admin ID requis', 'Veuillez saisir un Admin ID.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiJson(`/api/admin/logs?adminId=${encodeURIComponent(trimmed)}`);
      const actions = Array.isArray(data?.actions) ? data.actions : [];
      const mapped = actions.map((item: any) => ({
        id: item._id || `${item.createdAt ?? Date.now()}-${Math.random().toString(16).slice(2)}`,
        action: item.action || 'action',
        target: item.target || 'Unknown',
        actor: trimmed,
        note: item.detail,
        date: item.createdAt ? new Date(item.createdAt).toLocaleString() : new Date().toLocaleString(),
        targetType: item.targetType,
        targetId: item.targetId,
        detail: item.detail,
      }));
      setReports(mapped);
    } catch (error: any) {
      Alert.alert('Chargement echoue', error?.message || 'Impossible de charger les rapports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);
  const formatValue = (value: unknown) => {
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'string' && /T\d{2}:\d{2}:\d{2}/.test(value)) {
      const parsed = new Date(value);
      if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleString();
    }
    if (value && typeof value === 'object' && 'first_name' in (value as any)) {
      const doneBy = value as { first_name?: string; last_name?: string; email?: string };
      return `${doneBy.first_name ?? ''} ${doneBy.last_name ?? ''}`.trim() || doneBy.email || '---';
    }
    return String(value);
  };

  const getAvatarLetter = (report: ActionReport, details: Record<string, unknown>) => {
    const fullName = details?.first_name
      ? `${details?.first_name ?? ''} ${details?.last_name ?? ''}`.trim()
      : report.target;
    const trimmed = fullName.trim();
    return trimmed ? trimmed.charAt(0).toUpperCase() : 'A';
  };

  const buildHtml = (report: ActionReport, details: Record<string, unknown>, note: string) => {
    const avatarLetter = getAvatarLetter(report, details);
    const rows = Object.entries(details)
      .filter(([key, value]) => value !== undefined && value !== null && key !== '__v' && key !== '_id')
      .map(([key, value]) => {
        const label = key.replace(/_/g, ' ');
        return `<tr><td style="padding:6px 10px;color:#64748b;font-weight:600">${label}</td><td style="padding:6px 10px;color:#0f172a">${formatValue(value)}</td></tr>`;
      })
      .join('');

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: "Times New Roman", serif; background: #f8fafc; padding: 24px; color: #0f172a; }
            .card { background: #ffffff; border: 2px solid #0f172a; border-radius: 10px; overflow: hidden; box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); }
            .banner { background: #b91c1c; color: #ffffff; font-weight: 700; letter-spacing: 2px; padding: 10px 16px; text-transform: uppercase; font-size: 14px; }
            .title { padding: 12px 16px; font-size: 20px; border-bottom: 1px solid #e2e8f0; }
            .row { display: flex; gap: 16px; padding: 16px; }
            .photo { width: 110px; height: 140px; border: 2px solid #0f172a; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: 700; background: #0f172a; color: #ffffff; }
            .info { flex: 1; }
            .info h2 { font-size: 14px; margin: 0 0 8px 0; color: #334155; text-transform: uppercase; letter-spacing: 1px; }
            .kv { display: grid; grid-template-columns: 140px 1fr; row-gap: 6px; column-gap: 12px; font-size: 12px; }
            .label { color: #64748b; font-weight: 700; text-transform: uppercase; }
            .value { color: #0f172a; }
            table { width: 100%; border-collapse: collapse; margin: 0 16px 16px 16px; font-size: 12px; }
            tr { border-bottom: 1px solid #e2e8f0; }
            td { padding: 6px 8px; }
            .note { margin: 0 16px 16px 16px; padding: 12px; border: 1px solid #0f172a; background: #f8fafc; border-radius: 6px; font-size: 12px; }
            .footer { padding: 10px 16px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="banner">Rapport officiel</div>
            <div class="title">${report.action} • ${report.date}</div>
            <div class="row">
              <div class="photo">${avatarLetter}</div>
              <div class="info">
                <h2>Identification</h2>
                <div class="kv">
                  <div class="label">Target</div><div class="value">${report.target}</div>
                  <div class="label">Actor</div><div class="value">${report.actor}</div>
                  ${report.note ? `<div class="label">Note</div><div class="value">${report.note}</div>` : ''}
                </div>
              </div>
            </div>
            <div class="title">Details complets</div>
            <table>${rows}</table>
            ${note ? `<div class="note"><strong>Commentaire admin:</strong><br/>${note}</div>` : ''}
            <div class="footer">Generation automatique • Alemni Admin</div>
          </div>
        </body>
      </html>
    `;
  };

  const openPdfModal = (report: ActionReport) => {
    setActiveReport(report);
    setPdfNote('');
    setPdfModalOpen(true);
  };

  const printHtmlOnWeb = (html: string) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    iframe.style.opacity = '0';
    iframe.style.border = '0';
    iframe.setAttribute('aria-hidden', 'true');

    let printTriggered = false;

    const cleanup = () => {
      if (iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };

    iframe.onload = () => {
      try {
        const frameWindow = iframe.contentWindow;
        if (!frameWindow) {
          Alert.alert('PDF echoue', 'Impossible d ouvrir l apercu impression.');
          cleanup();
          return;
        }

        frameWindow.document.write(html);
        frameWindow.document.close();

        setTimeout(() => {
          if (!printTriggered) {
            printTriggered = true;
            frameWindow.focus();
            frameWindow.print();
            
            // Nettoyage après l'impression
            setTimeout(cleanup, 500);
          }
        }, 250);
      } catch (error: any) {
        Alert.alert('PDF echoue', error?.message || 'Erreur lors de la generation du PDF');
        cleanup();
      }
    };

    iframe.onerror = () => {
      Alert.alert('PDF echoue', 'Impossible de charger l apercu.');
      cleanup();
    };

    document.body.appendChild(iframe);
    
    // Écrire le HTML directement
    try {
      iframe.srcdoc = html;
    } catch (error: any) {
      Alert.alert('PDF echoue', 'Impossible de generer le contenu PDF');
      cleanup();
    }
  };

  const generatePdf = async (report: ActionReport, note: string) => {
    try {
      Alert.alert('Generation en cours...', 'Veuillez patienter');
      
      let details: Record<string, unknown> = {
        action: report.action,
        target: report.target,
        actor: report.actor,
        note: report.note,
        date: report.date,
      };

      try {
        if (report.targetType === 'member' && report.targetId) {
          const memberData = await apiJson(`/api/admin/member/${report.targetId}`);
          details = { ...details, ...memberData };
        } else if (report.targetType === 'service' && report.targetId) {
          const serviceData = await apiJson(`/api/admin/service/${report.targetId}`);
          details = { ...details, ...serviceData };
        } else if (report.targetType === 'devis' && report.targetId) {
          const devisData = await apiJson(`/api/admin/devis/${report.targetId}`);
          details = { ...details, ...devisData };
        }
      } catch (apiError: any) {
        console.warn('Impossible de charger les details de la cible:', apiError?.message);
        // Continue avec les details de base
      }

      const html = buildHtml(report, details, note);

      if (Platform.OS === 'web') {
        printHtmlOnWeb(html);
        Alert.alert('Succes', 'PDF pret pour impression');
        return;
      }

      const { uri } = await Print.printToFileAsync({ html });
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { dialogTitle: 'Generer le PDF', mimeType: 'application/pdf' });
      } else {
        Alert.alert('PDF genere', `Fichier disponible a: ${uri}`);
      }
    } catch (err: any) {
      console.error('Erreur PDF:', err);
      Alert.alert('PDF echoue', err?.message || 'Impossible de generer le PDF. Verifiez votre connexion.');
    }
  };

  const confirmGenerate = async () => {
    if (!activeReport) return;
    const note = pdfNote.trim();
    setPdfModalOpen(false);
    await generatePdf(activeReport, note);
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 420,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const renderItem = ({ item }: { item: ActionReport }) => (
    <View style={[styles.card, { backgroundColor: '#FFFFFF' }]}>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold">{item.action}</ThemedText>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
      </View>
      <ThemedText style={styles.content}>Target: {item.target}</ThemedText>
      <View style={styles.metaRow}>
        <ThemedText style={styles.meta}>Actor: {item.actor}</ThemedText>
        <ThemedText style={styles.badge}>log</ThemedText>
      </View>
      {item.note ? <ThemedText style={styles.note}>Note: {item.note}</ThemedText> : null}
      <TouchableOpacity onPress={() => openPdfModal(item)} style={styles.pdfBtn}>
        <ThemedText style={styles.pdfBtnText}>Generer le PDF</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <View pointerEvents="none" style={styles.backgroundLayer}>
        <View style={[styles.blob, styles.blobOne]} />
        <View style={[styles.blob, styles.blobTwo]} />
      </View>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [12, 0],
                }),
              },
            ],
          },
        ]}
      >
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <ThemedText style={styles.backBtnText}>Retour</ThemedText>
          </TouchableOpacity>
        ) : null}
        <View style={[styles.hero, { backgroundColor: '#F3F4F6' }]}
        >
          <View style={styles.heroAccent} />
          <ThemedText type="title" style={styles.heroTitle}>Rapports d actions</ThemedText>
          <ThemedText style={styles.heroSub}>Chaque action est tracée, rien ne se perd.</ThemedText>
        </View>

        <View style={styles.toolbar}>
          <TextInput
            value={adminId}
            onChangeText={setAdminId}
            placeholder="Admin ID"
            placeholderTextColor="#9CA3AF"
            style={styles.adminInput}
          />
          <TouchableOpacity onPress={fetchReports} style={styles.toolbarBtn}>
            <ThemedText style={styles.toolbarText}>{loading ? '...' : 'Actualiser'}</ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={reports}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<ThemedText style={styles.empty}>No reports found.</ThemedText>}
        />
      </Animated.View>
      <Modal visible={pdfModalOpen} transparent animationType="fade" onRequestClose={() => setPdfModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ThemedText type="subtitle">Commentaire admin</ThemedText>
            <ThemedText style={styles.modalSub}>Ce texte apparaitra en bas du PDF.</ThemedText>
            <TextInput
              value={pdfNote}
              onChangeText={setPdfNote}
              placeholder="Ecrire un paragraphe descriptif..."
              placeholderTextColor="#9CA3AF"
              multiline
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setPdfModalOpen(false)} style={styles.modalBtn}>
                <ThemedText>Annuler</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmGenerate} style={[styles.modalBtn, styles.modalPrimary]}>
                <ThemedText style={{ color: '#FFFFFF' }}>Generer</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundLayer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.18,
  },
  blobOne: {
    width: 210,
    height: 210,
    backgroundColor: '#4B5BD7',
    top: -70,
    right: -40,
  },
  blobTwo: {
    width: 230,
    height: 230,
    backgroundColor: '#F2C14E',
    bottom: -70,
    left: -60,
  },
  content: {
    paddingBottom: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  backBtnText: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '700',
  },
  hero: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 18,
    padding: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  heroAccent: {
    width: 48,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  heroTitle: {
    marginTop: 6,
    letterSpacing: 0.4,
    fontFamily: headingFont,
  },
  heroSub: {
    opacity: 0.7,
  },
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  adminInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  toolbarBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  toolbarText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  list: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
  },
  content: {
    fontSize: 14,
  },
  meta: {
    fontSize: 12,
    opacity: 0.6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    fontSize: 10,
    color: '#1E3A8A',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    overflow: 'hidden',
  },
  pdfBtn: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#111827',
  },
  pdfBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  modalSub: {
    marginTop: 6,
    opacity: 0.7,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    marginTop: 12,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  modalPrimary: {
    backgroundColor: '#111827',
  },
  note: {
    fontSize: 12,
    opacity: 0.7,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.5,
  }
});
