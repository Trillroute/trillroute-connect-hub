
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, Mail, Lock, User, UserPlus, Phone, Home, Calendar, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StudentRegistration from './StudentRegistration';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [isLoading, setIsLoading] = useState(false);
  
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [primaryPhone, setPrimaryPhone] = useState('');
  const [secondaryPhone, setSecondaryPhone] = useState('');
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [address, setAddress] = useState('');
  const [parentName, setParentName] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [idProof, setIdProof] = useState('');
  
  const { register } = useAuth();
  const { toast } = useToast();

  // Only redirect to StudentRegistration if role is student
  if (role === 'student') {
    return <StudentRegistration />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !firstName || !lastName) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
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
        email, 
        password, 
        firstName, 
        lastName, 
        role, 
        {
          date_of_birth: dateOfBirth,
          profile_photo: profilePhoto,
          parent_name: parentName,
          primary_phone: primaryPhone,
          secondary_phone: secondaryPhone,
          whatsapp_enabled: whatsappEnabled,
          address: address,
          id_proof: idProof
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
                
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          className="pl-10"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          className="pl-10"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        className="pl-10"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Note: Since we only render this component for non-student roles,
                      we don't need the conditional for parent name anymore */}
                </TabsContent>
                
                <TabsContent value="contact" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryPhone">Primary Phone</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="primaryPhone"
                        type="tel"
                        placeholder="Primary Phone"
                        className="pl-10"
                        value={primaryPhone}
                        onChange={(e) => setPrimaryPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryPhone">Secondary Phone (Optional)</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="secondaryPhone"
                        type="tel"
                        placeholder="Secondary Phone"
                        className="pl-10"
                        value={secondaryPhone}
                        onChange={(e) => setSecondaryPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="whatsapp"
                      checked={whatsappEnabled}
                      onCheckedChange={setWhatsappEnabled}
                    />
                    <Label htmlFor="whatsapp">WhatsApp enabled on primary phone</Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Home className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="address"
                        type="text"
                        placeholder="Your address"
                        className="pl-10"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="documents" className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto">Profile Photo URL (Optional)</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="profilePhoto"
                        type="text"
                        placeholder="URL to profile photo"
                        className="pl-10"
                        value={profilePhoto}
                        onChange={(e) => setProfilePhoto(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idProof">ID Proof (Optional)</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Upload className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="idProof"
                        type="text"
                        placeholder="URL to ID proof document"
                        className="pl-10"
                        value={idProof}
                        onChange={(e) => setIdProof(e.target.value)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700">I am registering as:</div>
                <RadioGroup defaultValue="teacher" className="grid grid-cols-2 gap-2" value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
              
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

export default Register;
