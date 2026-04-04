import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
const COLORS = {
  primary: '#1A1A5E',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#888',
  border: '#E1E1E1',
  success: '#00C853',
};


export default function AllDocService() {
  const router = useRouter();
  const { sessionid } = useLocalSearchParams();
  const [documents, setDocuments] = useState<Array<{ _id?: string; title?: string; type_doc: string; url: string; fileId:string; date:string; session:string }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!sessionid) {
        setMessage('Session ID is missing');
        setLoading(false);
        return;
      }

      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        fetch(`http://10.89.124.250:5000/document/getdocuments`, {
          method: "POST",
          headers: { "content-type": "application/json", "authorization": `Bearer ${accessToken}` },
          body:JSON.stringify({sessionid})
        })
        .then(res => res.json())
        .then(data => {
          setLoading(false);
          if (data.succ) {
            setDocuments(data.documents);
            if (data.documents.length === 0) setMessage("No documents for this session.");
          } else if (data.error === "Token expired!") {
            fetch("http://10.89.124.250:5000/teacher/refresh", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ refreshToken })
            })
            .then(res => res.json())
            .then(data => {
              if (data.accessToken) {
                SecureStore.setItemAsync("accessToken", data.accessToken);
                fetch(`http://10.89.124.250:5000/document/getdocuments`, {
                  method: "POST",
                  headers: { "content-type": "application/json", "authorization": `Bearer ${data.accessToken}` },
                  body:JSON.stringify({sessionid})
                })
                .then(res => res.json())
                .then(data => {
                  setLoading(false);
                  if (data.succ) {
                    setDocuments(data.documents);
                    if (data.documents.length === 0) setMessage("No documents for this session.");
                  } else {
                    router.replace("/sign_in");
                  }
                });
              } else {
                router.replace("/sign_in");
              }
            });
          } else {
            router.replace("/sign_in");
          }
        });
      } catch (e) {
        console.error(e);
        router.replace("/sign_in");
      }
    };

    fetchDocuments();
}, [sessionid]);
  const openUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        setMessage('Cannot open document URL');
      }
    } catch (error) {
      console.error('Open URL error:', error);
      setMessage('Cannot open document URL');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Documents</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <Text style={styles.infoText}>Loading documents...</Text>
        ) : message ? (
          <Text style={styles.infoText}>{message}</Text>
        ) : null}

        {documents && documents.length > 0 && (
          documents.map((doc) => (
            <View key={doc._id ?? doc.fileId} style={styles.card}>
              <Text style={styles.docTitle}>{doc.title || 'Untitled Document'}</Text>
              <Text style={styles.docMeta}>Type: {doc.type_doc} | Uploaded: {doc.date}</Text>
              <TouchableOpacity onPress={() => openUrl(doc.url)} style={styles.docLink}>
                <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="tail">{doc.url}</Text>
              </TouchableOpacity>
              <Text style={styles.docHint}>(press to open)</Text>
            </View>
          ))
        )}

        {documents && documents.length === 0 && !loading && (
          <Text style={styles.infoText}>No documents for this session.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    height: Platform.OS === 'android' ? 110 : 95,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff22',
    marginBottom: 15,
  },
  backBtn: {
    marginRight: 12,
  },
  backText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  infoText: {
    color: COLORS.textLight,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  docTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  docMeta: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 4,
  },
  docLink: {
    marginTop: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 8,
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  docHint: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
});
