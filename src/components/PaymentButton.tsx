
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PaymentButtonProps {
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  className?: string;
  children?: React.ReactNode;
  courseId: string;
}

export const PaymentButton = ({
  onSuccess,
  onError,
  className,
  children = 'Enroll Now',
  courseId
}: PaymentButtonProps) => {
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleClick = async () => {
    try {
      setLoading(true);
      
      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login...');
        toast.error("Authentication Required", {
          description: "Please login to enroll in this course"
        });
        
        localStorage.setItem('enrollRedirectUrl', `/courses/${courseId}`);
        navigate('/auth/login');
        return;
      }

      // Double check course ID is valid
      if (!courseId) {
        console.error('Missing course ID');
        toast.error("Configuration Error", {
          description: "Missing course information. Please try again later."
        });
        if (onError) onError({ message: "Missing course ID" });
        return;
      }

      if (onSuccess) onSuccess({ enrollment: true });

    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error("Enrollment Failed", {
        description: error.message || "Failed to enroll in course"
      });
      if (onError) onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
};
