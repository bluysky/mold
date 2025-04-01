// src/components/SignUp.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    } else {
      console.log('Membership registration successful:', data);
      alert('Your membership registration has been completed. Please check your email.');
      navigate('/'); // 또는 로그인 페이지로 리다이렉트
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="email">email:</label>
          <input
            type="email"
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">password:</label>
          <input
            type="password"
            id="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">verify password:</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="verify password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">join the membership</button>
      </form>
    </div>
  );
}

export default SignUp;
