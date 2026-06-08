import React from 'react';
import { Text, StyleSheet, TextProps } from 'react-native';
import { Colors, FontSize } from '@/constants/theme';

interface TypographyProps extends TextProps {
  children: React.ReactNode;
}

// Display Heading - Neue Frutiger Black 72pt — main headings only
export const DisplayHeading: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text style={[styles.displayHeading, style]} {...props}>{children}</Text>
);

// Sub Heading 1 - Neue Frutiger Bold 40pt — sub-headings & scientific names
export const SubHeading1: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text style={[styles.subHeading1, style]} {...props}>{children}</Text>
);

// Sub Heading 2 - Neue Frutiger Regular 40pt
export const SubHeading2: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text style={[styles.subHeading2, style]} {...props}>{children}</Text>
);

// Body - National Park Regular 24pt
export const BodyText: React.FC<TypographyProps> = ({ children, style, ...props }) => (
  <Text style={[styles.body, style]} {...props}>{children}</Text>
);

const styles = StyleSheet.create({
  displayHeading: {
    fontFamily: 'NeueFrutigerWorld-Black',
    fontSize: FontSize.displayHeading,
    color: Colors.darkGreen,
  },
  subHeading1: {
    fontFamily: 'NeueFrutigerWorld-Bold',
    fontSize: FontSize.subHeading1,
    color: Colors.darkGreen,
  },
  subHeading2: {
    fontFamily: 'NeueFrutigerWorld-Regular',
    fontSize: FontSize.subHeading2,
    color: Colors.darkGreen,
  },
  body: {
    fontFamily: 'NationalPark-Regular',
    fontSize: FontSize.body,
    color: Colors.green,
  },
});
