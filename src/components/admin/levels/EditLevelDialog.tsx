
import React, { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AdminLevelDetailed } from '@/types/adminLevel';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Level name cannot be empty' }),
  description: z.string().min(1, { message: 'Description cannot be empty' }),
});

interface EditLevelDialogProps {
  level: AdminLevelDetailed | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUpdateLevel: (id: number, levelData: Partial<AdminLevelDetailed>) => void;
  isLoading: boolean;
}

const EditLevelDialog = ({
  level,
  isOpen,
  onOpenChange,
  onUpdateLevel,
  isLoading,
}: EditLevelDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: level?.name || '',
      description: level?.description || '',
    },
  });

  useEffect(() => {
    if (level) {
      form.reset({
        name: level.name,
        description: level.description,
      });
    }
  }, [level, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!level) return;

    onUpdateLevel(level.id, values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Admin Level</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter level name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter level description"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Level'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLevelDialog;
