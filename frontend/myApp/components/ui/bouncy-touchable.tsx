import React, { useEffect } from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

type Props = React.ComponentProps<typeof TouchableOpacity> & {
  glow?: boolean;
  glowOpacity?: number;
  idleScale?: number;
  pressScale?: number;
  entering?: any;
  style?: StyleProp<ViewStyle>;
};

export function BouncyTouchable({
  glow = true,
  glowOpacity = 0.18,
  idleScale = 1.02,
  pressScale = 0.95,
  style,
  children,
  onPressIn,
  onPressOut,
  ...rest
}: Props) {
  const press = useSharedValue(0);
  const idle = useSharedValue(0);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    idle.value = withRepeat(
      withSequence(withTiming(1, { duration: 1300 }), withTiming(0, { duration: 1300 })),
      -1,
      true
    );

    glowPulse.value = withRepeat(withTiming(1, { duration: 1500 }), -1, true);
  }, [glowPulse, idle]);

  const containerStyle = useAnimatedStyle(() => {
    const p = interpolate(press.value, [0, 1], [1, pressScale]);
    const i = interpolate(idle.value, [0, 1], [1, idleScale]);
    const scale = p * i;

    return {
      transform: [{ scale }],
      opacity: interpolate(press.value, [0, 1], [1, 0.92]),
    };
  });

  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glow ? interpolate(glowPulse.value, [0, 1], [0.0, glowOpacity]) : 0,
    };
  });

  return (
    <AnimatedTouchableOpacity
      activeOpacity={0.95}
      {...rest}
      onPressIn={(e) => {
        press.value = withSpring(1, { damping: 16, stiffness: 240 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        press.value = withSpring(0, { damping: 16, stiffness: 240 });
        onPressOut?.(e);
      }}
      style={[style, containerStyle]}
    >
      <Animated.View pointerEvents="none" style={[styles.glow, glowStyle]} />
      {children}
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});
