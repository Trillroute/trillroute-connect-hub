
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { LeadChannel, LeadLocation, LeadStage } from '@/types/lead';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  secondary_phone: z.string().optional(),
  whatsapp_enabled: z.boolean().default(false),
  age: z.number().min(1).max(120).optional(),
  location: z.enum(['Indiranagar', 'Online'] as const).optional(),
  channel: z.enum([
    'Call', 'Wix', 'Walk-in', 'Whatsapp', 'Message', 
    'Google My Business', 'Instagram', 'Meta Ads', 'Facebook',
    'Justdial', 'Urbanpro', 'Google form', 'Other', 
    'In Person', 'Referral', 'E-mail'
  ] as const).optional(),
  remarks: z.string().optional(),
  lead_quality: z.number().min(1).max(5).optional(),
  stage: z.enum(['New', 'Contacted', 'Interested', 'Take admission', 'Converted', 'Lost'] as const).default('New'),
  owner: z.string().optional(),
  interested_courses: z.array(z.string()).optional(),
  interested_skills: z.array(z.string()).optional()
});

type LeadFormValues = z.infer<typeof formSchema>;

type CreateLeadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

const CreateLeadDialog: React.FC<CreateLeadDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess 
}) => {
  const { toast } = useToast();

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      secondary_phone: "",
      whatsapp_enabled: false,
      age: undefined,
      location: undefined,
      channel: undefined,
      remarks: "",
      lead_quality: 1,
      stage: "New",
      owner: "",
      interested_courses: [],
      interested_skills: []
    }
  });

  const onSubmit = async (data: LeadFormValues) => {
    try {
      const { error } = await supabase
        .from('leads')
        .insert({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          secondary_phone: data.secondary_phone || null,
          whatsapp_enabled: data.whatsapp_enabled,
          age: data.age || null,
          location: data.location || null,
          channel: data.channel || null,
          remarks: data.remarks || null,
          lead_quality: data.lead_quality || null,
          stage: data.stage,
          owner: data.owner || null,
          interested_courses: data.interested_courses || [],
          interested_skills: data.interested_skills || []
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Lead created successfully",
      });
      
      form.reset();
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating lead:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create lead",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Create a new lead by filling out the information below.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secondary_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secondary Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 555 123 4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp_enabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">WhatsApp Enabled</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Indiranagar">Indiranagar</SelectItem>
                        <SelectItem value="Online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          'Call', 'Wix', 'Walk-in', 'Whatsapp', 'Message',
                          'Google My Business', 'Instagram', 'Meta Ads', 'Facebook',
                          'Justdial', 'Urbanpro', 'Google form', 'Other',
                          'In Person', 'Referral', 'E-mail'
                        ].map((channel) => (
                          <SelectItem key={channel} value={channel}>
                            {channel}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          'New', 'Contacted', 'Interested', 'Take admission',
                          'Converted', 'Lost'
                        ].map((stage) => (
                          <SelectItem key={stage} value={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lead_quality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lead Quality (1-5)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        max="5" 
                        {...field} 
                        onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="Lead owner name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add any additional notes or remarks"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
                Cancel
              </Button>
              <Button type="submit">
                Add Lead
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeadDialog;
