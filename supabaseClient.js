// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // .env 파일에서 설정
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY; // .env 파일에서 설정

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
