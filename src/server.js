import app from './app.js';

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Zupreme API running on container port ${port}`);
  console.log(
    'Local health endpoint (Docker): http://localhost:3001/api/health',
  );
});
