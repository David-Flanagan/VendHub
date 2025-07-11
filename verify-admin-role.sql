-- Verify that the user has the admin role
-- Run this in your Supabase SQL editor

-- Check if the user has the admin role
SELECT 
  u.email,
  r.name as role_name,
  r.description as role_description
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
WHERE u.id = 'efe928e2-17f9-4772-ac3f-246e02cd9e80';

-- Also check what roles exist
SELECT * FROM public.roles;

-- Check all user role assignments
SELECT 
  u.email,
  r.name as role_name
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
JOIN public.roles r ON ur.role_id = r.id
ORDER BY u.email, r.name; 