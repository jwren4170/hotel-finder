import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  signInWithGitHub,
  signInWithEmail,
  useSession,
  signOut,
} from '@/lib/auth-client';
import { Mail } from 'lucide-react';

const LoginPage = () => {
  const { data: session } = useSession();

  console.log('Session data:', session);

  // If user is logged in, show their info
  if (session?.user) {
    return (
      <div className='flex justify-center items-center bg-linear-to-br from-background to-muted/20 p-4 min-h-screen'>
        <Card className='shadow-lg w-full max-w-md'>
          <CardHeader className='space-y-1 text-center'>
            <CardTitle className='font-bold text-3xl tracking-tight'>
              Welcome, {session.user.name}!
            </CardTitle>
            <CardDescription className='text-base'>
              You are successfully logged in
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4 text-center'>
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className='mx-auto mb-4 rounded-full w-20 h-20'
                />
              )}
              <div>
                <p className='text-muted-foreground text-sm'>
                  Email: {session.user.email}
                </p>
                <p className='text-muted-foreground text-sm'>
                  ID: {session.user.id}
                </p>
              </div>
              <Button
                className='w-full h-11 font-medium text-base'
                variant='destructive'
                onClick={async () => {
                  try {
                    await signOut();
                    window.location.reload(); // Refresh the page after logout
                  } catch (error) {
                    console.error('Sign out error:', error);
                  }
                }}
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center bg-linear-to-br from-background to-muted/20 p-4 min-h-screen'>
      <Card className='shadow-lg w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <CardTitle className='font-bold text-3xl tracking-tight'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-base'>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* GitHub login button */}
          <Button
            className='w-full h-11 font-medium text-base cursor-pointer'
            variant='default'
            onClick={async () => {
              try {
                console.log('Attempting GitHub sign in...');
                await signInWithGitHub();
              } catch (error) {
                console.error('GitHub sign in error:', error);
              }
            }}
          >
            <svg
              className='mr-2 w-5 h-5'
              fill='currentColor'
              viewBox='0 0 24 24'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                clipRule='evenodd'
              />
            </svg>
            Continue with GitHub
          </Button>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='border-t w-full' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>

          {/* Email login */}
          <Button
            className='w-full h-11 font-medium text-base cursor-pointer'
            variant='outline'
            onClick={() => signInWithEmail('user@example.com', 'password123')}
          >
            <Mail className='mr-2 w-5 h-5' />
            Continue with Email
          </Button>

          <p className='mt-4 text-muted-foreground text-xs text-center'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
