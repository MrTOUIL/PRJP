import React from 'react';
import { View, Text } from 'react-native';

type Props = { name?: string; size?: number; color?: string };

export const IconSymbol: React.FC<Props> = ({ name, size = 20, color = '#000' }) => {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: Math.max(12, size * 0.6) }}>{name ? name.charAt(0) : '●'}</Text>
    </View>
  );
};

export default IconSymbol;
