# CredentiaLink - Credential Lifecycle Dashboard

This is a Next.js application built in Firebase Studio. It provides a dashboard for administrators to manage user credentials and for users to track the status of their assigned credentials.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- **Node.js**: Version 18.x or later. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node Package Manager, which comes bundled with Node.js.
- **MongoDB**: A running MongoDB instance. You can install it locally or use a cloud-based service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

## Getting Started

Follow these steps to get your local development environment set up and running.

### 1. Install Dependencies

Navigate to the project's root directory in your terminal and run the following command to install all the required packages listed in `package.json`:

```bash
npm install
```

### 2. Configure Environment Variables

You need to connect the application to your MongoDB instance. To do this, create a new file named `.env.local` in the root of the project.

Inside `.env.local`, add your MongoDB connection string. It should look like this:

```
MONGODB_URI="your_mongodb_connection_string_goes_here"
```

Replace `"your_mongodb_connection_string_goes_here"` with the actual connection string for your database.

### 3. Seed the Database

The project includes a seed script to populate your database with initial sample data (users, credentials, etc.). Run the following command in your terminal:

```bash
npm run db:seed
```

This will clear any existing data and insert the sample records defined in `src/lib/seed.ts`.

### 4. Run the Development Server

Once the dependencies are installed and the database is seeded, you can start the application's development server:

```bash
npm run dev
```

The application will now be running and accessible at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm run dev`: Starts the application in development mode.
- `npm run build`: Creates a production-ready build of the application.
- `npm run start`: Starts the application in production mode (requires a build first).
- `npm run lint`: Lints the project files for code quality.
- `npm run db:seed`: Clears and seeds the database with initial data.
