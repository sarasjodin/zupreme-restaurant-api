import cors from 'cors';
import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import menuItemRoutes from './routes/menuItemRoutes.js';
import menuCategoryRoutes from './routes/menuCategoryRoutes.js';

const app = express();

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'https://zupreme-restaurant.netlify.app',
      'https://zupreme-restaurant-admin.sarasjodin.se',
    ],
  }),
);

app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/menu-categories', menuCategoryRoutes);
app.use('/api/menu-items', menuItemRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

export default app;
