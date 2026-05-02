import React from 'react';
import { View, ViewProps } from 'react-native';

export const ThemedView: React.FC<ViewProps> = (props) => {
  return <View {...props} />;
};

export default ThemedView;
