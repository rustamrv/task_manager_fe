import React, { useState } from 'react';
import Layout from '@components/layout/Layout';
import { Button } from '@components/ui/Button';
import { useUpdateProfileMutation } from '@api/endpoints/UserApi';
import { useToast } from '@components/ui/UseToast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<{
    username: string;
    image: File | null;
  }>({
    username: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    if (profileData.image) formData.append('profileImage', profileData.image);

    try {
      await updateProfile(formData).unwrap();
      setPreviewImage(null);
      toast({ title: 'Success', description: 'Profile updated successfully!' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2">
          Profile Image
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="w-32 h-32 object-cover mt-4 rounded-lg"
            />
          )}
        </label>
        <div className="flex justify-end gap-4">
          {previewImage && (
            <Button
              variant="secondary"
              type="button"
              onClick={() => setPreviewImage(null)}
            >
              Reset
            </Button>
          )}
          <Button variant="default" type="submit" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Update Profile'}
          </Button>
        </div>
      </form>
    </Layout>
  );
};

export default Settings;
