// Vite 환경에서 import.meta.env 사용 가능
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

document.getElementById('loginBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        alert('Login failed: ' + error.message);
    } else {
        window.location.href = '/mold.html';
    }
});

document.getElementById('signupBtn').addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
    });

    if (error) {
        alert('Sign up failed: ' + error.message);
    } else {
        alert('Sign up successful! Please check your email to confirm.');
    }
});
