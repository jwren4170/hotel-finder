import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

export const LoadingSpinner = ({
  size = 'lg',
  text = 'Loading...',
  fullScreen = false,
}: LoadingSpinnerProps) => {
  const content = (
    <div className='flex flex-col justify-center items-center gap-4'>
      <Loader className={`${sizeClasses[size]} text-primary animate-spin`} />
      {text && (
        <p className='font-medium text-muted-foreground text-sm'>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className='flex justify-center items-center bg-background min-h-screen'>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
