/*
import { createClient } from '@supabase/supabase-js';

// Vite 환경 변수 로드
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// supabase 인스턴스 생성
const supabase = createClient(supabaseUrl, supabaseAnonKey);
*/

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
    // createClient는 window.supabase에서 접근할 수 있게 됩니다.
    const { createClient } = window.supabase;

    const supabaseUrl = 'https://xyzcompany.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54dXpwZHd6cHpyeHd5eGR0cWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNzE5MTUsImV4cCI6MjA1Nzc0NzkxNX0.BIDc-F9sLVhdjmnC6N-VjQwEe55nqkZV07X_X-NCLcY';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Supabase 관련 코드 작성
</script>



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
