# ReliefSync - Disaster Coordination Platform

ReliefSync is a centralized platform for NGOs and government agencies to coordinate rehabilitation efforts post-disaster.

## Features
- **Central Dashboard**: Overview of tasks, resources, and reports.
- **Task Allocation**: Admin can create tasks; NGOs can claim and track them.
- **Resource Tracking**: NGOs can manage their inventory of kits, medicine, and volunteers.
- **Standardized Reporting**: Field reports to track people helped and pending needs.
- **Map Visualization**: Real-time map of active tasks and NGO distribution.
- **Role-Based Access**: Specialized views for Admins and NGOs.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Leaflet.js
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL + Auth)

## Setup Instructions

### 1. Database Setup (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to the **SQL Editor** and run the contents of `supabase_schema.sql`.
3. Go to **Project Settings > API** and copy the `Project URL` and `anon public` key.

### 2. Backend Setup
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file and add your Supabase credentials:
   ```env
   PORT=5000
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run start (or nodemon index.js)
   ```

### 3. Frontend Setup
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Sample Data
You can use the following sample data to test the platform:
- **Admin**: Create a task for "Food Distribution in Sector A".
- **NGO**: Register an NGO account, claim the task, and update the status to "In Progress".
- **Resources**: Add "500 Food Kits" to your inventory.
- **Reporting**: Submit a report after "completing" a task.
