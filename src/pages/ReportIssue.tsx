
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Camera, MapPin, Tag, AlertCircle, Info, Send, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';

import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/supabase';
import { uploadFile, getFileUrl } from '@/services/supabaseService';

const categories = [
  "Infrastructure",
  "Water",
  "Electricity",
  "Trash",
  "Transportation",
  "Safety",
  "Noise",
  "Drainage",
  "Public Space",
  "Other"
];

// Form schema validation
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  location: z.string().min(5, 'Location must be at least 5 characters'),
  category: z.string().min(1, 'Please select a category'),
  imageUrl: z.string().optional(),
});

const ReportIssue = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showCameraOptions, setShowCameraOptions] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      category: '',
      imageUrl: '',
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Set the file for later upload
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setShowCameraOptions(false);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Image selected",
      description: "Your image is ready to be uploaded with the report",
    });
  };

  const handleCameraCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set the file for later upload
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setShowCameraOptions(false);
    };
    reader.readAsDataURL(file);

    toast({
      title: "Photo captured",
      description: "Your photo is ready to be uploaded with the report",
    });
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    form.setValue('imageUrl', '');
    setShowCameraOptions(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    if (!file) return '';
    
    try {
      setIsUploading(true);
      console.log('Starting image upload...', file.name, file.size, 'bytes');
      
      // Create unique file path
      const filePath = `issues/${Date.now()}_${file.name}`;
      console.log('Uploading to path:', filePath);
      
      // Upload to Supabase Storage
      const uploadData = await uploadFile(file, 'uploads', filePath);
      console.log('Upload successful:', uploadData);
      
      // Get public URL
      const publicUrl = getFileUrl('uploads', filePath);
      console.log('Public URL obtained:', publicUrl);
      
      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Provide specific error messages
      if (error.message?.includes('unauthorized')) {
        throw new Error('Storage access denied. Please check Supabase Storage policies.');
      } else if (error.message?.includes('timeout')) {
        throw new Error('Upload timeout. Please check your connection.');
      }
      
      throw new Error(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report an issue",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = '';
      
      // Upload image if exists
      if (imageFile) {
        try {
          console.log('Uploading image file:', imageFile.name);
          imageUrl = await uploadImage(imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (error: any) {
          console.error("Error uploading image:", error);
          const errorMessage = error.message || "Could not upload the image. Please try again.";
          toast({
            title: "Image upload failed",
            description: errorMessage,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Add the issue to Supabase
      const { error } = await supabase
        .from('issues')
        .insert([
          {
            title: values.title,
            description: values.description,
            location: values.location,
            category: values.category,
            image: imageUrl || values.imageUrl,
            created_by: currentUser.id,
            status: 'reported',
            comments_count: 0,
            volunteers_count: 0,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) throw error;

      toast({
        title: "Issue reported",
        description: "Your issue has been successfully submitted!",
      });
      navigate('/issues');
    } catch (error) {
      console.error("Error adding issue:", error);
      toast({
        title: "Failed to report issue",
        description: "An error occurred while submitting your issue. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-28 pb-20 flex-1">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-semibold mb-2">Report an Issue</h1>
              <p className="text-muted-foreground">
                Help improve your community by reporting issues in your neighborhood
              </p>
            </div>
            
            <div className="bg-card rounded-xl shadow-subtle p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Broken Park Benches" {...field} />
                        </FormControl>
                        <FormDescription>
                          A clear, concise title for the issue
                        </FormDescription>
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
                            placeholder="Describe the issue in detail..." 
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide details about the issue, its impact, and any relevant context
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input placeholder="e.g., Maple Park, Main Avenue" {...field} />
                              <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormDescription>
                            Where is this issue located?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Select the category that best fits the issue
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <FormLabel>Add Photo (Optional)</FormLabel>
                    <FormDescription>
                      Upload a photo of the issue to help others understand the problem better
                    </FormDescription>
                    
                    {!imagePreview ? (
                      <div className="space-y-3">
                        <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
                          <div className="flex flex-col items-center justify-center gap-4">
                            <div className="p-3 rounded-full bg-secondary">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div className="text-sm text-center space-y-2">
                              <p className="font-medium">Choose how to add a photo</p>
                              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                {/* Camera Capture */}
                                <label htmlFor="camera-capture" className="flex-1">
                                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-border hover:border-primary hover:bg-secondary/50 cursor-pointer transition-all">
                                    <Camera className="h-5 w-5" />
                                    <span className="font-medium">Take Photo</span>
                                  </div>
                                  <input
                                    id="camera-capture"
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    className="hidden"
                                    onChange={handleCameraCapture}
                                  />
                                </label>
                                
                                {/* File Upload */}
                                <label htmlFor="image-upload" className="flex-1">
                                  <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-border hover:border-primary hover:bg-secondary/50 cursor-pointer transition-all">
                                    <Upload className="h-5 w-5" />
                                    <span className="font-medium">Upload Image</span>
                                  </div>
                                  <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">Maximum file size: 5MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="relative w-full rounded-lg overflow-hidden border-2 border-border">
                          <img 
                            src={imagePreview} 
                            alt="Issue preview" 
                            className="w-full h-auto max-h-96 object-contain bg-secondary"
                          />
                          <button
                            type="button"
                            className="absolute top-3 right-3 p-2 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg transition-colors"
                            onClick={removeImage}
                            title="Remove image"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                          <Info className="h-4 w-4 text-primary" />
                          <p className="text-sm text-muted-foreground">
                            This image will be uploaded and visible to all users when you submit the report
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <p>Your issue will be publicly visible to the community and local authorities.</p>
                    </div>
                    
                    {imageFile && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <p className="text-blue-900 dark:text-blue-100">
                          Image will be uploaded when you submit. If upload fails, you can submit without the image.
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/issues')}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || isUploading}
                    >
                      {isSubmitting || isUploading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {isUploading ? 'Uploading...' : 'Submitting...'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Submit Issue
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
