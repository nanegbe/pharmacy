# Pharmacy Management System

This is a Pharmacy Management System built with Next.js, Tailwind CSS, and PostgreSQL.

## Features

- User authentication
- Inventory management
- Sales tracking
- Analytics dashboard

## Tech Stack

- Next.js 16+
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth.js

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up PostgreSQL database (locally or using Docker):

```bash
# For local development, ensure PostgreSQL is running
# Update .env with your PostgreSQL connection details
```

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup

This project now uses PostgreSQL for both local development and production. Update your `.env` file with the appropriate database connection string.

## Deployment

This project is designed for deployment on Railway with PostgreSQL:

1. Connect your GitHub repository to Railway
2. Add the PostgreSQL plugin to your project
3. Set environment variables: `DATABASE_URL` and `NEXTAUTH_SECRET`
4. Deploy your application