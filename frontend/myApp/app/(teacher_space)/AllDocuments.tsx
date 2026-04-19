import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../constants/api';
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
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#1A1A5E',
  background: '#F5F6FA',
  cardBg: '#FFFFFF',
  textDark: '#1A1A1A',
  textLight: '#8E8E93',
  border: '#E1E1E1',
  success: '#00C853',
};

export default function AllDocuments() {
  const router = useRouter();
  const [documents, setDocuments] = useState<Array<{ _id?: string; title?: string; type_doc: string; url: string; fileId: string; date: string; session: string }> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  /*useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync("accessToken");

        const response = await fetch(`${BASE_URL}/teacher/getalldocuments`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${accessToken}`,
          },
        });

        const data = await response.json();

        if (data.succ && Array.isArray(data.documents)) {
          setDocuments(data.documents);
          if (data.documents.length === 0) {
            setMessage('No documents uploaded yet.');
          }
        } else {
          setDocuments([]);
          setMessage('No documents uploaded yet.');
        }
      } catch (error) {
        console.error('Fetch documents error:', error);
        setMessage('Failed to load documents.');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };<

    fetchDocuments();
  }, []);*/

  useEffect(() => {
    const fetchDocuments = async():Promise<void> => {
      try{
        const accessToken = await SecureStore.getItemAsync("accessToken") ; 
        const refreshToken = await SecureStore.getItemAsync("refreshToken") ;
         
        fetch(`${BASE_URL}/teacher/getalldocuments`,{
          method:"GET" , 
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${accessToken}`,
          },
        })
        .then(res => res.json())
        .then(data => {
          if (data.documents){
            setDocuments(data.documents) ; 
            if (data.documents.length == 0){
              setMessage("no documents uploaded yet!") ;
            }
          }else if (data.error = "Token expired!"){
            fetch(`${BASE_URL}/teacher/refresh`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ refreshToken })
            })

            .then(res => res.json())
            .then(data => {
              if (data.accessToken){
                SecureStore.setItemAsync("accessToken",data.accessToken) ;
                fetch(`${BASE_URL}/teacher/getalldocuments`,{
                  method:"GET",
                  headers: {
                   'Content-Type': 'application/json',
                   'authorization': `Bearer ${accessToken}`,
                  },
                })
                .then(res => res.json())
                .then(data =>{
                  if (data.documents){
                    setDocuments(data.documents) ;
                    if (data.documents.length == 0){
                     setMessage("no documents uploaded yet!") ;
                    } 
                  }else{
                    router.replace("/sign_in");
                  }
                });
              }else{
                setLoading(false);
                router.replace("/sign_in");
              }
            }) ;
          }
        });
      }catch(e){
        router.replace("/sign_in");
      }finally{
        setLoading(false) ; 
      }
    }

    fetchDocuments() ; 
  },[]) ; 


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


  /*const delete_document = async (docid:String):Promise<void> => {
    try{
      const accessToken = await SecureStore.getItemAsync("accessToken") ; 
      const refreshToken = await SecureStore.getItemAsync("refreshToken") ;
      fetch(`${BASE_URL}/document/deletedocument`,{
        method:"DELETE",
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${accessToken}`,
        },
        body:JSON.stringify({id:docid})
      })
      .then(res => res.json())
      .then(data => {
        if (data.succ){
          router.reload() ;
        }
        else if (data.error == "Token expired!"){
          fetch(`${BASE_URL}/teacher/refresh`, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ refreshToken })
            })

            .then(res => res.json())
            .then(data => {
              if (data.accessToken){
                SecureStore.setItemAsync("accessToken",data.accessToken) ;
                fetch(`${BASE_URL}/document/deletedocument`,{
                  method:"DELETE",
                  headers: {
                   'Content-Type': 'application/json',
                   'authorization': `Bearer ${accessToken}`,
                  },
                  body:JSON.stringify({id:docid})
                })
                .then(res => res.json())
                .then(data =>{
                  if (data.succ){router.reload()}
                  if (data.error){
                    router.replace("/sign_in") ;
                  }
                });
              }else{
                router.replace("/sign_in");
              }
            }) ;
        }else{
          router.replace("/sign_in") ;
        }
      }) ;
    }catch(e){
      router.replace("/sign_in");
    }finally{

    }
  }*/

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Documents</Text>
      </View>

      <ScrollView style={styles.scrollContent} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {loading && (
          <Text style={styles.infoText}>Loading documents...</Text>
        )}

        {!loading && message && (
          <Text style={styles.infoText}>{message}</Text>
        )}
 
        {/*display section*/}
        {documents && documents.length > 0 && (
          documents.map((doc) => (
            <View key={doc._id ?? doc.fileId} style={styles.documentCard}>
              <View style={styles.docHeader}>
                <Text style={styles.docType}>{doc.title || 'Untitled Document'}</Text>
              </View>
              
              <Text style={styles.docMeta}>Type: {doc.type_doc} | Uploaded: {doc.date}</Text>
              
              <TouchableOpacity onPress={() => openUrl(doc.url)} style={styles.docLink}>
                <Text style={styles.linkText} numberOfLines={2} ellipsizeMode="tail">
                  {doc.url}
                </Text>
              </TouchableOpacity>

              

              <Text style={styles.docHint}>(tap to open)</Text>
            </View>
          ))
        )}

        {documents && documents.length === 0 && !loading && (
          <Text style={styles.infoText}>No documents uploaded yet.</Text>
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
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  infoText: {
    color: COLORS.textLight,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  documentCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  docHeader: {
    marginBottom: 8,
  },
  docType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  docMeta: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  docSession: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  docLink: {
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 10,
    backgroundColor: 'rgba(26, 26, 94, 0.05)',
  },
  deleteBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#F3B4BF',
    backgroundColor: '#FFF1F4',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  deleteBtnText: {
    color: '#B00020',
    fontSize: 13,
    fontWeight: '700',
  },
  linkText: {
    color: COLORS.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  docHint: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 6,
  },
});
