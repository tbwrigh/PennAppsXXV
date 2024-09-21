import { View, Heading, Text, useTheme } from '@aws-amplify/ui-react';
import './AuthenticatorComponents.css';

const AuthenticatorComponents = {
  SignIn: {
    Header() {
      const { tokens } = useTheme();

      return (
        <View className="auth-container" textAlign="center" padding={tokens.space.large}>
          <Heading level={3}>Hey, Let's Meet</Heading>
          <Text>Sign in to your account</Text>
        </View>
      );
    },
  },
  SignUp: {
    Header() {
      const { tokens } = useTheme();

      return (
        <View className="auth-container" textAlign="center" padding={tokens.space.small}>
          <Heading level={3}>Get Started</Heading>
          <Text>Create your account</Text>
        </View>
      );
    },
  }
}


export default AuthenticatorComponents;
