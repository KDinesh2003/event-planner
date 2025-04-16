/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from 'react';
import api from '../../../utils/api';
import { useRouter } from 'next/navigation';
import styles from '../../../styles/studentRegister.module.css'; // Import the styles

export default function StudentRegister() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const router = useRouter();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post('/students/register-student', form);
      localStorage.setItem('studentToken', res.data.token);
      router.push('/pages/student/dashboard');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.header}>Student Registration</h2>
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
        <button type="submit" className={styles.submitBtn}>
          Register
        </button>
      </form>
    </div>
  );
}
