# Nabo - Reddit Style Social News Aggregator

A RESTful API for a news aggregation platform built with Node.js, Express, and PostgreSQL. This backend service provides endpoints for managing articles, topics, users, and comments, enabling a comprehensive news reading and discussion experience.

## Hosted Version

**[Live API](https://nabo.onrender.com/api)**

## Project Summary

This News Aggregator API is a backend service that allows users to:

Browse and filter news articles by topic
Read full article content
Post and manage comments on articles
Vote on articles and comments
Manage user profiles and preferences

The API follows RESTful design principles and includes comprehensive error handling, input validation, and test coverage. It's built with a focus on scalability, maintainability, and best practices.

## Tech Stack

- <img src="https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" height="20" style="vertical-align: middle;"> Runtime: Scalable server-side execution and asynchronous logic

- <img src="https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white" height="20" style="vertical-align: middle;"> Framework: RESTful API routing and middleware integration

- <img src="https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" height="20" style="vertical-align: middle;"> Database: Relational data modeling and ACID-compliant storage

- <img src="https://img.shields.io/badge/-Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" height="20" style="vertical-align: middle;"> Cloud DB: Managed production database with real-time capabilities

- <img src="https://img.shields.io/badge/-Render-46E3B7?style=flat-square&logo=render&logoColor=white" height="20" style="vertical-align: middle;"> Hosting: Automated CI/CD deployment and web service management

- <img src="https://img.shields.io/badge/-Jest-C21325?style=flat-square&logo=jest&logoColor=white" height="20" style="vertical-align: middle;"> Testing: Unit and integration testing for logic reliability

- <img src="https://img.shields.io/badge/-Insomnia-4000BF?style=flat-square&logo=insomnia&logoColor=white" height="20" style="vertical-align: middle;"> API Testing: Manual endpoint validation and request debugging

- <img src="https://img.shields.io/badge/-Husky-663399?style=flat-square" height="20" style="vertical-align: middle;"> Quality: Automated Git hooks for pre-commit linting and tests

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** - minimum version: `v21.0.0`
- **PostgreSQL** - minimum version: `16.0`

You can check your versions by running

```bash
node --versionß
psql --version
```

## Project Setup

### 1. Clone the Repository and Set as Root Directory

```
git clone https://github.com/Nasif-Islam/nabo.git
cd nabo
```

### 2. Set up a `.gitignore`

To protect sensitive information, ensure your `.gitignore` file includes the following:

```
node_modules
.env.\*
```

Warning: Never commit .env files to a remote repository. They contain sensitive credentials like API keys and passwords. If a leak occurs, revoke and rotate your credentials immediately.

### 3. Install dependencies

The node_modules directory is excluded from the repository to keep the project lightweight. Install the required packages locally by running:

```bash
npm install
```

### 4. Set Up Environment Variables

Create two .env files in the root directory for development and test databases:

`.env.development_`

```
PGDATABASE=news_aggregator
PORT=9090    #Can be set to any port number
```

`.env.test`

```
PGDATABASE=news_aggregator_test
PORT=9090    #Can be set to any port number
```

> **Note:** If you're connecting to a remote database (e.g., Supabase), you will need to add additional credentials such as the database connection string and password.

### 5. Create Development and Test Databases

```bash
npm run setup-dbs
```

This command creates the PostgresSQL databases specified in your `.env` file,s

### 6. Seed the Development Database

Populate the development database with initial data:

```bash
npm run seed-dev
```

### 7. Run the Development Server

Start the API server locally:

```bash
npm start
```

By default, the API will be running at `http://localhost:9090`, unless you have specified a different port.

## Running Tests

This project uses **Jest** and **Supertest** for testing.

### Run All Tests

```bash
npm test
```

### Run Specific Test Files

```bash
npm test
```

### Available Test Scripts

```bash
npm run test-seed    # Test database seeding
npm run test-utils   # Test utility functions
npm run test-app     # Test API endpoints
```

## Database Schema

The database consists of the following main tables:

- **users** - User accounts and profiles
- **topics** - News categories/topics
- **articles** - News articles with content
- **comments** - User comments on articles

![Database Schema](./schema-diagram.png)

## Available Scripts

The development server can be started by running

```bash
node listen.js
# or
npm run start
```

## Available Scripts

| Script               | Description                           |
| -------------------- | ------------------------------------- |
| `npm start`          | Start the development server          |
| `npm test`           | Run all test suites                   |
| `npm run setup-dbs`  | Create development and test databases |
| `npm run seed-dev`   | Seed the development database         |
| `npm run test-seed`  | Test database seeding                 |
| `npm run test-utils` | Test utility functions                |
| `npm run test-app`   | Test API endpoints                    |

## API Endpoints

API Endpoints

For a full list of available endpoints and their usage, refer to the API documentation or explore the `/routes` directory in the codebase.

### Example Endpoints

| Method | Endpoint                             | Description                 |
| ------ | ------------------------------------ | --------------------------- |
| GET    | `/api/articles`                      | Retrieve all articles       |
| GET    | `/api/articles/:article_id`          | Retrieve a specific article |
| POST   | `/api/articles/:article_id/comments` | Add a comment to an article |
| PATCH  | `/api/articles/:article_id`          | Update article votes        |
| GET    | `/api/topics`                        | Retrieve all topics         |
| GET    | `/api/users`                         | Retrieve all users          |

## Project Structure

```
nabo/
├── __tests__/          # Test files
├── controllers/        # Route controllers
├── db/                 # Database setup and seed data
├── models/             # Data models and database queries
├── routes/             # API route definitions
├── services/           # Business logic layer
├── utils/              # Helper functions and utilities
├── app.js              # Express application setup
├── listen.js           # Server initialization
└── package.json        # Project dependencies and scripts
```

## Development Tools

This project was developed and tested using:

- **Insomnia** - For API endpoint testing during development
- **Supabase** - PostgreSQL database hosting for production
- **Render** - Application deployment and hosting

## Contributing

This project follows best practices including:

- Git hooks via Husky for code quality checks
- Comprehensive test coverage
- Clear separation of concerns (MVC pattern)
- Error handling middleware

## Future Enhancements

Potential features for future development:

- User authentication and authorization
- Article bookmarking
- Search functionality
- Pagination for large datasets
- Rate limiting
- API documentation with Swagger/OpenAPI

## Credits

Built following a professional full-stack industry brief by Northcoders. Special thanks to the Northcoders team for their technical guidance and mentorship throughout the development process.Implementation and feature expansions are my own.

## Author

**Nasif Islam**

<p align="left">
  <a href="https://github.com/Nasif-Islam">
    <img src="https://img.shields.io/badge/--Nasif--Islam-181717?style=for-the-badge&logo=github&logoColor=white" height="28" style="vertical-align: middle;">
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/nasiful-islam">
    <img src="https://github.com/Nasif-Islam/my-assets/raw/refs/heads/main/linkedin.svg?v=8" height="28" style="vertical-align: middle;">
  </a>
</p>
