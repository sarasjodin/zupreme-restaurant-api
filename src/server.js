import app from './app.js';

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Zupreme API running on container port ${port}`);
  if (process.env.NODE_ENV === 'development') {
    console.log('Local health endpoint: http://localhost:3001/api/health');
  } else {
    console.log(
      'Health endpoint: https://zupreme-restaurant-api.sarasjodin.se/api/health',
    );
  }
});
