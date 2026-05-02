import React from 'react';
import { Text, TextProps } from 'react-native';

type Props = TextProps & { type?: 'title' | 'subtitle' | 'defaultSemiBold' };

export const ThemedText: React.FC<Props> = ({ children, style, ...rest }) => {
  return (
    <Text {...rest} style={style}>
      {children}
    </Text>
  );
};

export default ThemedText;
