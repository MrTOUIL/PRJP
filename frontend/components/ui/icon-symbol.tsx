import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = { name?: string; size?: number; color?: string };

const iconMap: Record<string, React.ComponentProps<typeof MaterialCommunityIcons>['name']> = {
  'exclamationmark.bubble.fill': 'message-alert',
  'eye.slash.fill': 'eye-off',
  'trash.fill': 'trash-can',
};

export const IconSymbol: React.FC<Props> = ({ name, size = 20, color = '#000' }) => {
  const mappedName = (name && iconMap[name]) || 'help-circle-outline';

  return <MaterialCommunityIcons name={mappedName} size={size} color={color} />;
};

export default IconSymbol;
