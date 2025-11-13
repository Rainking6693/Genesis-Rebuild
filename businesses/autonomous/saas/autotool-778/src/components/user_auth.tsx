// src/components/UserAuth.tsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  email: string;
  password?: string; // Optional for registration
}

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate authentication API call
      console.log('Form data submitted:', data);
      // Replace with actual API call to your authentication service
      // const response = await authService.login(data.email, data.password);
      // if (response.success) {
      //   // Redirect or update user state
      // } else {
      //   // Handle authentication failure
      // }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      // Display error message to the user
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register("email", { required: "Email is required" })} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...register("password", { required: isLogin ? "Password is required" : false })} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={toggleAuthMode}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  email: string;
  password?: string; // Optional for registration
}

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and registration

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      // Simulate authentication API call
      console.log('Form data submitted:', data);
      // Replace with actual API call to your authentication service
      // const response = await authService.login(data.email, data.password);
      // if (response.success) {
      //   // Redirect or update user state
      // } else {
      //   // Handle authentication failure
      // }
    } catch (error: any) {
      console.error('Authentication error:', error.message);
      // Display error message to the user
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register("email", { required: "Email is required" })} />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...register("password", { required: isLogin ? "Password is required" : false })} />
          {errors.password && <span>{errors.password.message}</span>}
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={toggleAuthMode}>
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </button>
    </div>
  );
};

export default UserAuth;