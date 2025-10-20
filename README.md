# exIME - Alumni Directory

IME (Instituto Militar de Engenharia) Alumni Directory platform built with Nuxt 3, Clerk, and Supabase.

## Local Development Setup

This guide will help you set up the project for local development.

### Prerequisites

- **Node.js**: >= 20.11.0 or >= 22.0.0
- **Docker Desktop**: Required for local Supabase (install from [docker.com](https://www.docker.com/products/docker-desktop))
- **Supabase CLI**: Install via Homebrew
  ```bash
  brew install supabase/tap/supabase
  ```

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd exIME
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Contact `gris` to get the **shared development credentials**:
   - Clerk development keys (shared across all developers)
   - Any other necessary API keys

4. **Start local Supabase**
   ```bash
   supabase start
   ```
   
   This will:
   - Start PostgreSQL, PostgREST, and other Supabase services in Docker
   - Output local API URLs and keys
   - Take a few minutes on first run
   
   After it starts, you'll see output like:
   ```
   API URL: http://localhost:54321
   DB URL: postgresql://postgres:postgres@localhost:54322/postgres
   anon key: eyJhbG...
   service_role key: eyJhbG...
   ```

5. **Update `.env` with local Supabase credentials**
   
   Replace the Supabase variables with your local ones:
   ```bash
   SUPABASE_URL=http://localhost:54321
   SUPABASE_PUBLISHABLE_KEY=<anon-key-from-supabase-start-output>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key-from-supabase-start-output>
   ```
   
   Keep the **shared Clerk development keys** as provided by `gris`.

6. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at http://localhost:3000

**Key Commands:**
```bash
# Start local Supabase (Docker required)
supabase start

# Stop local Supabase
supabase stop

# Reset database (drops all data and reapplies migrations)
supabase db reset

# Check status
supabase status

# View database in Supabase Studio (local GUI)
# Open http://localhost:54323
```

## Database Migrations

Database schema changes are managed through migrations in the `supabase/migrations/` directory.

### Creating a New Migration

1. **Make sure local Supabase is running:**
   ```bash
   supabase start
   ```

2. **Create a new migration file:**
   ```bash
   supabase migration new <migration-name>
   ```
   
   Example:
   ```bash
   supabase migration new add_company_field
   ```

3. **Edit the migration file** in `supabase/migrations/`
   
   Add your SQL:
   ```sql
   ALTER TABLE alumni ADD COLUMN company_size TEXT;
   ```

4. **Apply the migration:**
   ```bash
   supabase db reset
   ```

5. **Commit the migration file** to git
   ```bash
   git add supabase/migrations/
   git commit -m "Add company_size field to alumni table"
   ```

### Applying Migrations from Others

When you pull changes that include new migrations:

```bash
git pull
supabase db reset  # Applies all migrations from scratch
```

## Supabase Studio (Local Database GUI)

Supabase includes a local web interface for managing your database:

- **URL**: http://localhost:54323
- View tables, run SQL queries, test RLS policies
- Manage users and authentication
- View logs and API usage

## Environment Variables

Your `.env` file should look like this:

```bash
# Clerk (SHARED - same for all developers)
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NUXT_CLERK_SECRET_KEY=sk_test_...

# Supabase (LOCAL - from your supabase start output)
SUPABASE_URL=http://localhost:54321
SUPABASE_PUBLISHABLE_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

**Important:**
- **Never commit `.env`** to git (it's in `.gitignore`)
- Clerk keys are **shared** across the team (development instance)
- Supabase keys are **local** to your machine

## Common Development Tasks

### Reset Your Local Database

If you need to start fresh:
```bash
supabase db reset
```

This drops all tables and data, then reapplies all migrations.

### Stop Supabase (Free Up Docker Resources)

When you're done developing:
```bash
supabase stop
```

## Tech Stack

- **Frontend**: Nuxt 3, Vue 3, TailwindCSS, Nuxt UI
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## Useful Resources

- [Nuxt 3 Documentation](https://nuxt.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase CLI Local Development](https://supabase.com/docs/guides/cli/local-development)
- [Supabase Migrations](https://supabase.com/docs/guides/cli/managing-environments)

## Troubleshooting

### Supabase won't start

**Issue**: Docker not running
```bash
# Make sure Docker Desktop is running
open -a Docker
```

**Issue**: Port already in use
```bash
# Stop Supabase and restart
supabase stop
supabase start
```

### Can't connect to Supabase

1. Check if Supabase is running: `supabase status`
2. Verify `.env` has correct local URLs and keys
3. Make sure `SUPABASE_URL` is `http://localhost:54321` (not a cloud URL)

### Clerk authentication not working

1. Verify Clerk keys in `.env` are correct (get from `gris`)
2. Make sure you're using the shared development instance keys
3. Check the Clerk dashboard for any webhook or configuration issues

### Database schema is out of sync

Reset and reapply all migrations:
```bash
supabase db reset
```

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

