import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useUpdateProfileMutation } from '../api/apiSlice'; // Use the updated mutation

const Settings: React.FC = () => {
  const [profileData, setProfileData] = useState<{
    username: string;
    image: File | null;
  }>({
    username: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [updateProfile, { isLoading, isSuccess }] = useUpdateProfileMutation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

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
    formData.append('username', profileData.username);
    if (profileData.image) {
      formData.append('profileImage', profileData.image);
    }

    try {
      await updateProfile(formData).unwrap();
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  return (
    <section className="flex flex-col lg:flex-row min-h-screen p-8 gap-8">
      {/* Navbar */}
      <Navbar className="border-2 border-gray-300 shadow-md rounded-lg lg:p-6 lg:mt-6 lg:mb-6 lg:ml-6 lg:h-[calc(100vh-64px)] p-4" />

      {/* Main Content */}
      <section className="flex-grow flex flex-col lg:ml-72 p-6 overflow-y-auto">
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
            <Button
              variant="secondary"
              type="button"
              onClick={() => setProfileData({ username: '', image: null })}
            >
              Reset
            </Button>
            <Button variant="default" type="submit" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Profile'}
            </Button>
          </div>
        </form>

        {isSuccess && (
          <p className="text-green-600 mt-4">Profile updated successfully!</p>
        )}
      </section>
    </section>
  );
};

export default Settings;
