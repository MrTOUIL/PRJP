import { useColorScheme as rnscheme } from 'react-native';

export const useColorScheme = () => {
  return rnscheme() || 'light';
};

export default useColorScheme;
