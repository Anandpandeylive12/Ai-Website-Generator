'use client';
import { UserDetailContext } from '@/context/userDetailContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Provider = ({ children }) => {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    if (user && user.id) CreateNewUser();
  }, [user]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post('/api/users', {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
      setUserDetail(result.data.user);
      console.log('User credits:', result.data.user?.credits);
    } catch (error) {
      console.error('Failed to create or fetch user:', error);
    }
  };

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      {children}
    </UserDetailContext.Provider>
  );
};

export default Provider;
