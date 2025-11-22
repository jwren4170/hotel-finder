import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  signInWithGitHub,
  signUpWithEmail,
  useSession,
} from '@/lib/auth-client';
import { Link, useSearch } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

const RegisterPage = () => {
  const { data: session } = useSession();
  const search = useSearch({ from: '/register' });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if already logged in
  useEffect(() => {
    if (session?.user) {
      const redirectTo = search.redirect || '/';
      window.location.href = redirectTo;
    }
  }, [session, search.redirect]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await signUpWithEmail(email, password, name);
      // Success - redirect to login page since autoSignIn is false
      window.location.href = '/login';
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex justify-center items-center bg-linear-to-br from-background to-muted/20 p-4 min-h-screen'>
      <Card className='shadow-lg w-full max-w-md'>
        <CardHeader className='space-y-1 text-center'>
          <CardTitle className='font-bold text-3xl tracking-tight'>
            Create Account
          </CardTitle>
          <CardDescription className='text-base'>
            Sign up to get started
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* GitHub signup button */}
          <Button
            className='w-full h-11 font-medium text-base cursor-pointer'
            variant='default'
            onClick={async () => {
              try {
                console.log('Attempting GitHub sign up...');
                await signInWithGitHub();
              } catch (error) {
                console.error('GitHub sign up error:', error);
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
                Or sign up with email
              </span>
            </div>
          </div>

          {/* Email/Password signup form */}
          <form onSubmit={handleEmailSignUp} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                type='text'
                placeholder='John Doe'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            {error && (
              <div className='bg-destructive/10 p-3 border border-destructive rounded-md text-destructive text-sm'>
                {error}
              </div>
            )}

            <Button
              type='submit'
              className='w-full h-11 font-medium text-base'
              variant='default'
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className='mt-4 text-muted-foreground text-xs text-center'>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>

          <div className='mt-6 text-center'>
            <p className='text-muted-foreground text-sm'>
              Already have an account?{' '}
              <Link
                to='/login'
                className='font-medium text-primary hover:underline'
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
