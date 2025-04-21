
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BasicInfoTab } from './register-tabs/BasicInfoTab';
import { ContactInfoTab } from './register-tabs/ContactInfoTab';
import { DocumentsTab } from './register-tabs/DocumentsTab';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappEnabled: boolean;
  address: string;
  parentName: string;
  profilePhoto: string;
  idProof: string;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    primaryPhone: '',
    secondaryPhone: '',
    whatsappEnabled: false,
    address: '',
    parentName: '',
    profilePhoto: '',
    idProof: '',
  });
  
  const [role, setRole] = useState('teacher');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      whatsappEnabled: checked,
    });
  };

  const handleRoleChange = (value: string) => {
    setRole(value);
  };

  // Helper function to check required fields
  const checkRequiredFields = () => {
    return (
      formData.email.trim() !== '' &&
      formData.password.trim() !== '' &&
      formData.confirmPassword.trim() !== '' &&
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.dateOfBirth.trim() !== '' &&
      formData.primaryPhone.trim() !== '' &&
      formData.address.trim() !== ''
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!checkRequiredFields()) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      await register(
        formData.email, 
        formData.password, 
        formData.firstName, 
        formData.lastName, 
        'student', 
        {
          date_of_birth: formData.dateOfBirth,
          profile_photo: formData.profilePhoto,
          parent_name: formData.parentName,
          primary_phone: formData.primaryPhone,
          secondary_phone: formData.secondaryPhone,
          whatsapp_enabled: formData.whatsappEnabled,
          address: formData.address,
          id_proof: formData.idProof
        }
      );
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Music className="h-12 w-12 text-music-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Create an account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{" "}
            <Link to="/auth/login" className="font-medium text-music-500 hover:text-music-600">
              sign in to your account
            </Link>
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Join Trillroute</CardTitle>
            <CardDescription>
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <BasicInfoTab 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
                
                <ContactInfoTab 
                  formData={formData} 
                  handleInputChange={handleInputChange}
                  handleSwitchChange={handleSwitchChange}
                />
                
                <DocumentsTab 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              </Tabs>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-music-500 focus:ring-music-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="font-medium text-music-500 hover:text-music-600">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-medium text-music-500 hover:text-music-600">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-music-500 hover:bg-music-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;

// NOTE: This file is now greater than 200 lines and is getting too long for maintainability.
// Please consider refactoring it into smaller components for better readability and maintainability.
