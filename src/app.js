import cors from 'cors';
import express from 'express';
import healthRoutes from './routes/healthRoutes.js';
import menuItemRoutes from './routes/menuItemRoutes.js';
import menuCategoryRoutes from './routes/menuCategoryRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

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
app.use('/api/messages', messageRoutes);

// SyntaxError - JSON kunde inte tolkas
app.use((err, req, res, next) => {
  // Express identifierar att det är ett JSON parse-fel
  // och sätter status till 400
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'Invalid JSON',
    });
  }

  next(err);
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
  });
});

export default app;
