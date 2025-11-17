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
  return data;
};
