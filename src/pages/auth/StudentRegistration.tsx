
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Music, Calendar, Mail, Phone, Home, User, FileImage } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.date().optional(),
  profilePhoto: z.any().optional(),
  parentName: z.string().optional(),
  guardianRelation: z.string().optional(),
  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),
  whatsappEnabled: z.boolean().default(false),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  address: z.string().optional(),
  idProof: z.any().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions"
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof formSchema>;

const StudentRegistration = () => {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register: registerUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      whatsappEnabled: false,
      agreeToTerms: false,
    },
  });

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhotoFile(e.target.files[0]);
    }
  };

  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdProofFile(e.target.files[0]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Registration will be handled by the parent component
      await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        'student'
      );

      toast({
        title: "Registration successful",
        description: "Welcome to Trillroute! You are now logged in.",
      });
      
      // Navigate to student dashboard
      navigate("/dashboard/student");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const goToNextTab = () => {
    if (activeTab === "basic") setActiveTab("contact");
    else if (activeTab === "contact") setActiveTab("documents");
  };

  const goToPreviousTab = () => {
    if (activeTab === "documents") setActiveTab("contact");
    else if (activeTab === "contact") setActiveTab("basic");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100 px-4 py-12">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Music className="h-12 w-12 text-music-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Student Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/auth/login" className="font-medium text-music-500 hover:text-music-600">
              Sign in
            </Link>
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Join Trillroute as a Student</CardTitle>
            <CardDescription>
              Please fill in your details to create a student account
            </CardDescription>
          </CardHeader>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="contact">Contact Information</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="firstName"
                          placeholder="First name"
                          className="pl-10"
                          {...form.register("firstName")}
                        />
                        {form.formState.errors.firstName && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.firstName.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <Input
                          id="lastName"
                          placeholder="Last name"
                          {...form.register("lastName")}
                        />
                        {form.formState.errors.lastName && (
                          <p className="text-sm text-red-500 mt-1">
                            {form.formState.errors.lastName.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <div className="relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !form.watch("dateOfBirth") ? "text-muted-foreground" : ""
                            }`}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {form.watch("dateOfBirth") ? (
                              format(form.watch("dateOfBirth"), "PPP")
                            ) : (
                              "dd/mm/yyyy"
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={form.watch("dateOfBirth")}
                            onSelect={(date) => form.setValue("dateOfBirth", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="text-sm text-muted-foreground mt-1">For age group categorization</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profilePhoto">Profile Photo (Optional)</Label>
                    <div className="border border-gray-300 rounded-md p-4">
                      <Input 
                        id="profilePhoto" 
                        type="file" 
                        accept="image/*"
                        onChange={handleProfilePhotoChange}
                      />
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
                        placeholder="your.email@example.com"
                        className="pl-10"
                        {...form.register("email")}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...form.register("password")}
                      />
                      {form.formState.errors.password && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        {...form.register("confirmPassword")}
                      />
                      {form.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500 mt-1">
                          {form.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Contact Information Tab */}
                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="parentName">Parent/Guardian Name (For minors)</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="parentName"
                        placeholder="Parent or Guardian name"
                        className="pl-10"
                        {...form.register("parentName")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianRelation">Guardian Relation</Label>
                    <Input
                      id="guardianRelation"
                      placeholder="E.g., Father, Mother, Uncle, etc."
                      {...form.register("guardianRelation")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primaryPhone">Primary Phone</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="primaryPhone"
                          placeholder="Primary contact number"
                          className="pl-10"
                          {...form.register("primaryPhone")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondaryPhone">Secondary Phone</Label>
                      <Input
                        id="secondaryPhone"
                        placeholder="Alternate contact number"
                        {...form.register("secondaryPhone")}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="whatsappEnabled" 
                      checked={form.watch("whatsappEnabled")}
                      onCheckedChange={(checked) => form.setValue("whatsappEnabled", checked as boolean)}
                    />
                    <label
                      htmlFor="whatsappEnabled"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      WhatsApp Enabled
                    </label>
                  </div>
                  <p className="text-sm text-muted-foreground">Is WhatsApp available on the primary phone number?</p>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <Home className="h-5 w-5 text-gray-400" />
                      </div>
                      <Textarea
                        id="address"
                        placeholder="Full address"
                        className="pl-10 pt-2 min-h-[100px]"
                        {...form.register("address")}
                      />
                    </div>
                  </div>
                </TabsContent>

                {/* Documents Tab */}
                <TabsContent value="documents" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idProof">ID Proof (Optional)</Label>
                    <div className="border border-gray-300 rounded-md p-4">
                      <Input 
                        id="idProof" 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleIdProofChange}
                      />
                      <p className="text-sm text-muted-foreground mt-2">Upload ID proof if required (Aadhaar, PAN, etc.)</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-6">
                    <Checkbox 
                      id="agreeToTerms" 
                      checked={form.watch("agreeToTerms")}
                      onCheckedChange={(checked) => form.setValue("agreeToTerms", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="agreeToTerms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the Terms of Service and Privacy Policy
                      </label>
                      {form.formState.errors.agreeToTerms && (
                        <p className="text-sm text-red-500">
                          {form.formState.errors.agreeToTerms.message}
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>

            <CardFooter className="flex justify-between">
              {activeTab !== "basic" && (
                <Button type="button" variant="outline" onClick={goToPreviousTab}>
                  Previous
                </Button>
              )}
              {activeTab === "basic" && (
                <div className="flex-1"></div>
              )}
              {activeTab !== "documents" ? (
                <Button type="button" onClick={goToNextTab}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>

        <div className="text-center text-sm">
          <span className="text-gray-600">Looking to register as a teacher?</span>{" "}
          <Link to="/auth/register" className="font-medium text-music-500 hover:text-music-600">
            Click here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;
