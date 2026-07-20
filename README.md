# Travlr Module 2

Travlr Module 2 is a full-stack travel booking application with three pieces:

- a Node.js and Express backend that serves the website and API
- an Angular admin client for managing trips
- shared MongoDB-backed data models for trips and users

The backend runs on port `3000` and the Angular admin app runs on port `4200`.

## Project Structure

- `server.js` starts the backend server
- `app.js` configures Express, routes, middleware, and views
- `app_api/` contains the API controllers, models, middleware, and routes
- `app_server/` contains the server-rendered website routes, views, and controllers
- `app_admin/` contains the Angular admin frontend

## Requirements

- Node.js
- npm
- MongoDB running locally or a valid MongoDB connection string in `.env`

## Run the Backend

From the project root:

```bash
cd C:\Users\PMLS\Desktop\fiverr\app_admin\travlr_module2
npm install
npm start
```

The backend should start at:

```bash
http://localhost:3000
```

Alternative development command:

```bash
npm run dev
```

## Run the Angular Admin App

From the Angular folder:

```bash
cd C:\Users\PMLS\Desktop\fiverr\app_admin\travlr_module2\app_admin
npm install
npx ng serve --proxy-config proxy.conf.json
```

The admin app should open at:

```bash
http://localhost:4200
```

The proxy forwards `/api` requests to the backend on `http://localhost:3000`.

## Run Both Apps Together

1. Start the backend in one terminal:

   ```bash
   cd C:\Users\PMLS\Desktop\fiverr\app_admin\travlr_module2
   npm start
   ```

2. Start the Angular admin app in a second terminal:

   ```bash
   cd C:\Users\PMLS\Desktop\fiverr\app_admin\travlr_module2\app_admin
   npx ng serve --proxy-config proxy.conf.json
   ```

3. Open the admin UI in your browser:

   ```bash
   http://localhost:4200
   ```

## Useful Commands

Backend:

```bash
npm start
npm run dev
npm run seed
```

Angular admin:

```bash
npm start
npx ng serve --proxy-config proxy.conf.json
npm run build
npm test
```

## Notes

- If the backend cannot connect to MongoDB, check your `.env` file and database connection string.
- If the admin app cannot load API data, confirm the backend is running on port `3000` and the proxy config is being used.
