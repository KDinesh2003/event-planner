/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/organizerLogin.module.css'; // Import the styles

export default function OrganizerLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post('/organizers/login', form);
      localStorage.setItem('organizerToken', res.data.token);
      router.push('/pages/organizer/dashboard');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.header}>Organizer Login</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
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
        <button type="submit" className={styles.submitBtn}>
          Login
        </button>
      </form>
    </div>
  );
}
