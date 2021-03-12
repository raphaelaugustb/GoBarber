import React from 'react';
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { RectButtonProperties } from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

interface ButtonsProps extends RectButtonProperties {
  children: string;
}

const Button: React.FC<ButtonsProps> = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonText>{children}</ButtonText>
    </Container>
  );
};

export default Button;
