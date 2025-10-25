'use client';
import { OnSaveContext } from '@/context/OnSaveContext';
import { UserDetailContext } from '@/context/userDetailContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Provider = ({ children }) => {
  const { isSignedIn, user } = useUser();
  const [userDetail, setUserDetail] = useState(null);
  const [OnSaveData, setOnSaveData] = useState(null);

  useEffect(() => {
    if (isSignedIn && user?.id) {
      CreateNewUser();
    }
  }, [isSignedIn, user]);

  const CreateNewUser = async () => {
    try {
      const result =await axios.post('/api/users', {
  id: user.id,
  email: user.primaryEmailAddress?.emailAddress,
  name: user.fullName,
}, {
  headers: { 'Content-Type': 'application/json' }
});
      setUserDetail(result.data.user);
      console.log('User credits:', result.data.user?.credits);
    } catch (error) {
      console.error('Failed to create or fetch user:', error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <OnSaveContext.Provider value={{ OnSaveData, setOnSaveData }}>
      {children}
      </OnSaveContext.Provider>
    </UserDetailContext.Provider>
  );
};

export default Provider;
