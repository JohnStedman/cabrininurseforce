# NurseForce Supabase Setup Guide

This guide will help you connect your NurseForce application to Supabase for data persistence.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Your NurseForce application running locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organisation
4. Enter a project name (e.g., "NurseForce")
5. Create a strong database password (save this somewhere safe!)
6. Select a region close to your users (e.g., Australia for Cabrini)
7. Click "Create new project"
8. Wait for the project to be provisioned (1-2 minutes)

## Step 2: Get Your Supabase Credentials

Once your project is ready:

1. Go to Project Settings (gear icon in the sidebar)
2. Click on "API" in the left menu
3. You'll see two important values:
   - **Project URL** - This is your `VITE_SUPABASE_URL`
   - **anon public** key - This is your `VITE_SUPABASE_ANON_KEY`

## Step 3: Create the Database Schema

1. In your Supabase project, click on the "SQL Editor" icon in the sidebar
2. Click "New Query"
3. Copy the entire contents of the `supabase-schema.sql` file from this project
4. Paste it into the SQL Editor
5. Click "Run" or press Cmd/Ctrl + Enter
6. You should see a success message: "NurseForce database schema created successfully!"

This creates all the necessary tables:
- `shifts` - All shift data
- `staff` - Staff member profiles
- `wards` - Ward and bed management
- `deployments` - Staff redeployment tracking
- `providers` - Agency and contractor details
- `audit_logs` - System audit trail

## Step 4: Configure Environment Variables

### Option A: Using Figma Make (Recommended)

If you're running this in Figma Make, the Supabase connection modal should have already captured your credentials. If not:

1. Look for the Supabase configuration modal in the app
2. Enter your Project URL and Anon Key
3. Click "Connect"

### Option B: Manual Configuration

Create a `.env` file in the root of your project:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace `your_project_url_here` and `your_anon_key_here` with your actual credentials from Step 2.

## Step 5: Initialize the Database with Sample Data

1. Open your NurseForce application
2. Navigate to **Admin → System Settings** tab
3. You'll see a "Database Status" card at the top
4. Click the **"Initialize Database with Sample Data"** button
5. Wait for the migration to complete
6. You should see a success message confirming all data has been migrated

This will populate your database with:
- Sample shifts from the mock data
- All staff members
- Ward configurations
- Initial deployment data

## Step 6: Verify the Integration

1. In your Supabase dashboard, click on "Table Editor"
2. Select the `shifts` table
3. You should see rows of data populated from the migration
4. Check other tables (`staff`, `wards`, etc.) to confirm data is present

## Using the Application

Now that Supabase is connected:

### ✅ **All Changes Are Automatically Saved**
- Every shift you create is saved to Supabase
- Staff profile updates persist to the database
- Ward configuration changes are stored
- Deployment actions are logged

### ✅ **Data Persists Across Sessions**
- Close and reopen the app - your data is still there
- Share your Supabase credentials with team members to access the same data
- Data is backed up automatically by Supabase

### ✅ **Real-time Sync**
- Changes made in one session are reflected across all users
- No manual refresh needed

## Database Operations

### Viewing Your Data

In Supabase Dashboard:
1. Go to **Table Editor**
2. Select any table to view/edit data directly
3. Use filters and search to find specific records

### Backing Up Your Data

Supabase automatically backs up your database. To create a manual backup:
1. Go to **Database** → **Backups**
2. Click "Create Backup"
3. Your backup will be available for download

### Querying with SQL

1. Go to **SQL Editor**
2. Write custom queries to analyse your data:

```sql
-- Example: Get all open shifts for today
SELECT * FROM shifts 
WHERE date = CURRENT_DATE 
AND status = 'open';

-- Example: Count staff by role
SELECT role, COUNT(*) as total 
FROM staff 
WHERE status = 'active' 
GROUP BY role;

-- Example: Ward occupancy summary
SELECT facility, SUM(open_beds) as total_open, SUM(total_beds) as total_beds
FROM wards
GROUP BY facility;
```

## Troubleshooting

### "Supabase not configured" message

**Solution:** Check that your environment variables are set correctly. The URL should start with `https://` and the anon key should be a long string of characters.

### "Failed to fetch data" errors

**Possible causes:**
1. **Network issue** - Check your internet connection
2. **Invalid credentials** - Verify your Supabase URL and anon key
3. **RLS policies** - If you enabled Row Level Security, ensure policies allow access

### Tables not created

**Solution:** Re-run the `supabase-schema.sql` script in the SQL Editor. Make sure there are no error messages.

### Data not syncing

**Solution:** 
1. Check the browser console for error messages
2. Verify your Supabase project is active (not paused due to inactivity)
3. Confirm you're using the same Supabase project URL

## Advanced Configuration

### Row Level Security (RLS)

For production deployments, enable RLS for enhanced security:

1. Uncomment the RLS sections in `supabase-schema.sql`
2. Re-run the script
3. Configure authentication policies based on your requirements

### Custom Indexes

Add additional indexes for better query performance:

```sql
CREATE INDEX idx_shifts_facility_date ON shifts(facility, date);
CREATE INDEX idx_staff_ahpra_expiry ON staff(ahpra_expiry) WHERE ahpra_expiry IS NOT NULL;
```

### Monitoring

Monitor database performance:
1. Go to **Database** → **Logs**
2. Review query performance and slow queries
3. Add indexes as needed

## Support

- **Supabase Documentation:** [supabase.com/docs](https://supabase.com/docs)
- **Supabase Community:** [github.com/supabase/supabase/discussions](https://github.com/supabase/supabase/discussions)
- **NurseForce Issues:** Report issues specific to this application

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit `.env` files** to version control
2. **Rotate your anon key** periodically
3. **Enable RLS** for production deployments
4. **Use authentication** to restrict access to authorized users only
5. **Monitor audit logs** regularly for suspicious activity

## Free Tier Limits

Supabase free tier includes:
- 500 MB database space
- 2 GB bandwidth per month
- 50,000 monthly active users
- 7 days of log retention

This should be sufficient for testing and small deployments. For production use, consider upgrading to the Pro plan.

---

**You're all set!** Your NurseForce platform is now powered by Supabase with full data persistence. 🎉
