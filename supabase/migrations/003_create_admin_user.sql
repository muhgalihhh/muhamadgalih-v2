-- ============================================================
-- BUAT AKUN ADMIN UNTUK LOGIN KE /admin
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
  admin_email TEXT := 'galihslank79@gmail.com';
  admin_password TEXT := 'galih123@';
BEGIN

  -- Cek kalau email sudah ada, skip
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = admin_email) THEN
    RAISE NOTICE 'User % sudah ada, skip.', admin_email;
    RETURN;
  END IF;

  -- 1. Insert user
  INSERT INTO auth.users (
    instance_id, id, aud, role, email,
    encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data,
    is_super_admin, created_at, updated_at,
    confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    new_user_id, 'authenticated', 'authenticated', admin_email,
    crypt(admin_password, gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}', '{"name":"Admin"}',
    FALSE, NOW(), NOW(),
    '', '', '', ''
  );

  -- 2. Insert identity (provider_id wajib di Supabase versi terbaru)
  INSERT INTO auth.identities (
    id, user_id, provider_id,
    identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_user_id, admin_email,
    jsonb_build_object('sub', new_user_id::text, 'email', admin_email),
    'email', NOW(), NOW(), NOW()
  );

  RAISE NOTICE 'Admin user berhasil dibuat: %', admin_email;

END;
$$;
