
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting Trillroute! We'll be in touch soon.",
        duration: 5000,
      });
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
      
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about our programs? Need more information? Get in touch with our team, and we'll be happy to help.
          </p>
        </div>
      </section>
      
      {/* Contact Info & Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <Card className="music-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-music-100 rounded-full p-3 mr-4">
                        <MapPin className="h-6 w-6 text-music-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Our Location</h3>
                        <p className="text-gray-600">123 Harmony Street</p>
                        <p className="text-gray-600">Melody City, MC 12345</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="music-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-music-100 rounded-full p-3 mr-4">
                        <Mail className="h-6 w-6 text-music-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                        <p className="text-gray-600">info@trillroute.com</p>
                        <p className="text-gray-600">admissions@trillroute.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="music-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-music-100 rounded-full p-3 mr-4">
                        <Phone className="h-6 w-6 text-music-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                        <p className="text-gray-600">Main Office: (555) 123-4567</p>
                        <p className="text-gray-600">Student Support: (555) 987-6543</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="music-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-music-100 rounded-full p-3 mr-4">
                        <Clock className="h-6 w-6 text-music-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                        <p className="text-gray-600">Sunday: Closed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-music-400 hover:text-music-500 hover:bg-music-50 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                    </svg>
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-music-400 hover:text-music-500 hover:bg-music-50 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-music-400 hover:text-music-500 hover:bg-music-50 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                    </svg>
                  </a>
                  <a href="#" className="h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:border-music-400 hover:text-music-500 hover:bg-music-50 transition-colors">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-md music-card-hover">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <Input 
                          id="name" 
                          name="name" 
                          required 
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                        <Input 
                          id="subject" 
                          name="subject" 
                          required 
                          placeholder="Enter message subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        rows={5} 
                        required 
                        placeholder="Enter your message here"
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        required
                        className="h-4 w-4 text-music-600 focus:ring-music-500 border-gray-300 rounded"
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                        I agree to the privacy policy and terms of service
                      </label>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-music-500 hover:bg-music-600" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Visit Our Campus</h2>
          
          <div className="aspect-w-16 aspect-h-9 max-w-5xl mx-auto">
            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
              {/* Embed an iframe with a map (placeholder for demo purposes) */}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Interactive Map Would Be Displayed Here</p>
                  <p className="text-gray-500 text-sm">123 Harmony Street, Melody City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:border-music-200 transition-colors music-card-hover">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What are your operating hours?</h3>
                <p className="text-gray-600">
                  Our main office is open Monday through Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM. 
                  Individual lessons may be scheduled outside these hours based on instructor availability.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:border-music-200 transition-colors music-card-hover">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do I schedule a tour of the campus?</h3>
                <p className="text-gray-600">
                  You can schedule a campus tour by filling out the contact form above, calling our main office, 
                  or sending an email to admissions@trillroute.com. Tours are available during regular business hours.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:border-music-200 transition-colors music-card-hover">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How can I get information about tuition and fees?</h3>
                <p className="text-gray-600">
                  For detailed information about tuition and fees for specific programs, please contact our admissions office. 
                  We offer various payment plans and scholarship opportunities to make music education accessible.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-6 hover:border-music-200 transition-colors music-card-hover">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer virtual lessons?</h3>
                <p className="text-gray-600">
                  Yes, we offer virtual lessons for most instruments and courses. Our online learning platform provides 
                  high-quality video and audio capabilities to ensure an effective learning experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
