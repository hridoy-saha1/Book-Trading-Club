// authService.ts
import { auth } from './firebase.config';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import {} from './authService';
import UseAxiosSecure from '@/axios/UseAxiosSecure';
import axios from 'axios';
import { toast } from 'react-toastify';

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Axios
const axiosSecure = UseAxiosSecure();

const RegisterUserToMongoDB = async (
  name: string,
  email: string,
  uid: string
) => {
  try {
    const res = await axiosSecure.post('/api/users', {
      displayName: name,
      email,
      uid,
    });
    console.log('[users POST] ✅', res.status, res.data);
    return { status: res.status, data: res.data };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(
        '[users POST] ❌',
        err.response?.status,
        err.response?.data
      );
      return Promise.reject({
        status: err.response?.status,
        data: err.response?.data,
      });
    }
    console.error('[users POST] ❌', err);
    return Promise.reject(err);
  }
};

// -------------------- Google login --------------------
export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const reg = await RegisterUserToMongoDB(
      user.displayName || 'No Name',
      user.email || 'No Email',
      user.uid
    );
    if (reg.status !== 200 && reg.status !== 201) {
      toast.error('Failed to register user in the database.');
    } else if (reg.status == 200) {
      toast.success('Welcome back! You have successfully logged in.');
    } else if (reg.status == 201) {
      toast.success('Account created successfully! Welcome aboard.');
    }
    console.log('Registered user to MongoDB:', user);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
};

// -------------------- GitHub login --------------------
export const signInWithGithub = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    await RegisterUserToMongoDB(
      user.displayName || 'No Name',
      user.email || 'No Email',
      user.uid
    );
    console.log('Registered user to MongoDB:', user);
    return result.user;
  } catch (error) {
    console.error('GitHub Sign-In Error:', error);
    throw error;
  }
};

// -------------------- Email/password signup --------------------
export const signUp = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await RegisterUserToMongoDB(
      user.displayName || 'No Name',
      user.email || 'No Email',
      user.uid
    );
    console.log('Registered user to MongoDB:', user);
    return userCredential.user;
  } catch (error) {
    console.error('Sign-Up Error:', error);
    throw error;
  }
};

// -------------------- Email/password login --------------------
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error('Email/Password Sign-In Error:', error);
    throw error;
  }
};

// -------------------- Sign out --------------------
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

// -------------------- Reset password --------------------
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
    console.log('Password reset email sent to:', email);
  } catch (error: any) {
    console.error('Reset password error:', error);
    throw error;
  }
};

// -------------------- Auth state observer --------------------
export const observeAuth = (callback: (user: User | null) => void) =>
  onAuthStateChanged(auth, callback);
