import * as SecureStore from 'expo-secure-store';

export const getStudentOrParentRole = async (): Promise<'student' | 'parent'> => {
  const role = await SecureStore.getItemAsync('userRole');
  if (role === 'parent') {
    return 'parent';
  }

  // Backward compatibility if only session object exists
  const sessionRaw = await SecureStore.getItemAsync('sessionUser');
  if (sessionRaw) {
    try {
      const parsed = JSON.parse(sessionRaw);
      if (parsed?.role === 'parent') {
        return 'parent';
      }
    } catch {
      // ignore parse errors
    }
  }

  return 'student';
};
