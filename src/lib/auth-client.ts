import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:3001',
});

// Export the auth methods
export const { signUp, signOut, useSession } = authClient;

// Custom sign-in function for GitHub OAuth
export const signInWithGitHub = async () => {
  const data = await authClient.signIn.social({
    provider: 'github',
    callbackURL: 'http://localhost:3000/', // Redirect to frontend after successful login
  });
  return data;
};

// Email/password sign-in
export const signInWithEmail = async (email: string, password: string) => {
  const data = await authClient.signIn.email({
    email,
    password,
  });

  // Check if there's an error in the response
  if (data.error) {
    throw new Error(data.error.message || 'Invalid email or password');
  }

  return data;
};

// Email/password sign-up
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string
) => {
  const data = await signUp.email({
    email,
    password,
    name,
  });

  // Check if there's an error in the response
  if (data.error) {
    throw new Error(
      data.error.message ||
        'Failed to create account. Email may already be in use.'
    );
  }

  return data;
};
