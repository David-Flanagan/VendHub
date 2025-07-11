# Supabase Setup for VendHub

This guide will help you set up Supabase for your VendHub catalog management system.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `vendhub-catalog`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL editor and click "Run"
4. This will create all the necessary tables, indexes, and sample data

## 4. Configure Authentication (Optional)

If you want to use Supabase Auth:

1. Go to **Authentication** → **Settings**
2. Configure your authentication providers
3. Set up email templates if needed

## 5. Set Up Row Level Security (RLS)

The schema already includes RLS policies, but you may need to:

1. Go to **Authentication** → **Policies**
2. Verify the policies are active
3. Test with different user roles

## 6. Test the Connection

1. Start your development server: `npm run dev`
2. Open your browser to the application
3. Check the browser console for any connection errors

## Database Schema Overview

### Tables Created:

- **machine_categories** - Snack, Drink, Sunscreen, Combo
- **product_types** - 12oz Can, Bagged Snack, etc.
- **global_products** - Products in the global catalog
- **company_products** - Company-specific product settings
- **machine_templates** - Machine configuration templates

### Key Features:

- **Row Level Security (RLS)** - Secure access control
- **Foreign Key Relationships** - Maintains data integrity
- **Automatic Timestamps** - Created/updated tracking
- **Sample Data** - Pre-populated with example products

## Environment Variables

Make sure your `.env.local` file contains:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Next Steps

1. **Replace Mock Data**: Update your components to use the Supabase services
2. **Add Authentication**: Implement user login/registration
3. **File Upload**: Set up image upload for products
4. **Real-time Features**: Add live updates for catalog changes

## Troubleshooting

### Common Issues:

1. **Connection Errors**: Check your environment variables
2. **RLS Errors**: Verify your user has the correct role
3. **Type Errors**: Make sure the database schema matches your TypeScript types

### Getting Help:

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- Check the browser console for detailed error messages 