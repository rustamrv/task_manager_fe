import React, { useState } from 'react';
import Navbar from '@components/navbar/Navbar';
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

  const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfileData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    if (profileData.image) {
      formData.append('profileImage', profileData.image);
    }

    try {
      await updateProfile(formData).unwrap();
      setPreviewImage(null);
      toast({ title: 'Success', description: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setProfileData({ username: '', image: null });
    setPreviewImage(null);
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen w-full max-w-full p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <section className="flex-grow flex flex-col lg:ml-12 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Profile Image Field */}
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            {previewImage && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => handleReset()}
              >
                Reset
              </Button>
            )}
            <Button variant="default" type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default Settings;
