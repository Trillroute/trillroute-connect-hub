
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Music, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Create a schema for form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize form with validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  
  // Check for redirect information - prioritize state, then localStorage
  const redirectPath = location.state?.redirectTo || localStorage.getItem('paymentRedirectUrl') || '/dashboard';

  // If user is already authenticated, redirect them immediately
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User already authenticated, redirecting to:', redirectPath);
      // Check if we have pending enrollment actions
      const authRedirectState = localStorage.getItem('authRedirectState');
      
      if (authRedirectState) {
        try {
          const redirectState = JSON.parse(authRedirectState);
          if (redirectState.action === 'payment' && redirectState.courseId) {
            console.log('Found pending payment action for course:', redirectState.courseId);
          }
        } catch (error) {
          console.error('Error parsing redirect state:', error);
        }
      }
      
      // Navigate to the stored redirect path and clean up storage
      navigate(redirectPath);
      localStorage.removeItem('paymentRedirectUrl');
      localStorage.removeItem('authRedirectState');
    }
  }, [isAuthenticated, navigate, redirectPath]);

  // Clear login error when form values change
  useEffect(() => {
    const subscription = form.watch(() => {
      if (loginError) setLoginError(null);
    });
    return () => subscription.unsubscribe();
  }, [form, loginError]);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      console.log('Attempting login with:', { email: data.email });
      await login(data.email, data.password);
      // Auth state change will trigger the useEffect above to handle the redirection
    } catch (error: any) {
      console.error('Login failed in component:', error);
      setLoginError(error.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Music className="h-12 w-12 text-music-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/auth/register" className="font-medium text-music-500 hover:text-music-600">
              create a new account
            </Link>
          </p>
          {redirectPath && redirectPath !== '/dashboard' && (
            <p className="mt-2 text-sm text-blue-600">
              You'll be redirected back after login
            </p>
          )}
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                    {loginError}
                  </div>
                )}
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••••"
                            className="pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="rememberMe"
                          type="checkbox"
                          className="h-4 w-4 text-music-500 focus:ring-music-500 border-gray-300 rounded"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                          Remember me
                        </label>
                      </div>
                      
                      <div className="text-sm">
                        <a href="#" className="font-medium text-music-500 hover:text-music-600">
                          Forgot your password?
                        </a>
                      </div>
                    </div>
                  )}
                />
              </CardContent>
              
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-music-500 hover:bg-music-600 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
