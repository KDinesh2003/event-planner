/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/organizerRegister.module.css'; // Import the styles

export default function OrganizerRegister() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    organization: '', // Added this field
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post('/organizers/register', form);
      localStorage.setItem('organizerToken', res.data.token);
      router.push('/pages/auth/organizer-login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
  <div className={styles.formContainer}>
    <h2 className={styles.header}>Organizer Registration</h2>
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        name="name"
        onChange={handleChange}
        placeholder="Name"
        required
        className={styles.inputField}
      />
      <input
        name="email"
        onChange={handleChange}
        placeholder="Email"
        required
        type="email"
        className={styles.inputField}
      />
      <input
        name="password"
        onChange={handleChange}
        placeholder="Password"
        type="password"
        required
        className={styles.inputField}
      />
      <input
        name="organization"
        onChange={handleChange}
        placeholder="Organization"
        required
        className={styles.inputField}
      />
      <button type="submit" className={styles.submitBtn}>
        Register
      </button>
    </form>
    <p className={styles.loginText}>
      Already have an account?{' '}
      <a href="/pages/auth/organizer-login" className={styles.loginLink}>
        Login
      </a>
    </p>
  </div>
);
}
