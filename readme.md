# Sales Analytics Dashboard API

A powerful Node.js & Express backend using MongoDB to process, analyze, and optimize order data using Aggregation Pipelines and Indexing performance strategies.

## Key Features
- **MongoDB Indexing**: Compound index implemented on `category` and `orderDate` fields to maximize retrieval speed and eliminate full collection scans.
- **Aggregation Pipeline**: Multi-stage data pipeline (`$match`, `$group`, `$sort`) calculating overall revenue and tracking top-performing item categories directly inside the database layer.
- **Environment Security**: Sensitive operational keys, database credentials, and system ports are fully dynamic and sandboxed outside version control.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repository-url>
   cd <project-folder-name>
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a local configuration file named `.env` in the root folder (this file is excluded from git tracking for security) and define your parameters:
   ```env
   PORT=your port
   dbport=your_mongodb_connection_string
   ```

4. **Run the application:**
   ```bash
   # For production runtime environment
   npm start

   # For hot-reload development environment
   npm run dev
   ```

## Active API Endpoints
- `POST /api/seed` - populates initial dummy data into the collection to test database execution.
- `GET /api/analytics` - triggers the primary aggregation process and yields calculated pipeline results.
