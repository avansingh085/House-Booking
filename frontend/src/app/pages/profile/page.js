'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '@/app/redux/userSlice';
import { useRouter } from 'next/navigation';
import apiClient from '@/app/utils/apiClient';
import Header from '@/app/components/header';

export default function ProfilePage() {
  const user = useSelector((state) => state.user?.user);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [form, setForm] = useState({
    name: user?.name || '',
    phoneNumber: user?.phoneNumber || '',
    profilePictureUrl: user?.profilePictureUrl || '',
  });

  if (!user) return <div className="text-center py-10">User not found</div>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true); // Set loading to true
    try {
      const res = await apiClient.post('/user/user/updateUser', form);

      if (res.data.success) {
        // dispatch(updateUser(res.data.user));
        setIsEditing(false); // Close the form after success
      }
    } catch (err) {
      // Handle error
      console.error(err);
    }
    setIsLoading(false); // Set loading to false after submit
  };

  return (
    <div>
      <Header />
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:underline text-sm"
        >
          ← Back
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-sm px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {!isEditing ? (
          <div className="mt-6">
            <div className="flex items-center space-x-4">
              <img
                src={user.profilePictureUrl || '/default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">
                  {user.phoneNumber || 'No phone number'}
                </p>
                <p className={`text-sm ${user.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <p><strong>Favorites:</strong> {user.favorites?.length || 0}</p>
              <p><strong>Past Views:</strong> {user.pastViews?.length || 0}</p>
              <p><strong>Listed Houses:</strong> {user.houseListed?.length || 0}</p>
              <p><strong>Bookings:</strong> {user.bookingHouse?.length || 0}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block font-medium">Profile Picture URL</label>
              <input
                type="text"
                name="profilePictureUrl"
                value={form.profilePictureUrl}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className={`px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-green-600'} text-white rounded hover:bg-green-700`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
