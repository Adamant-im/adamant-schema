import express from 'express';
import swaggerUI from 'swagger-ui-express';

const app = express();
const swaggerDocument = require('./dist/schema.json');

app.use(express.static('dist'));
app.use(
  '/',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, {
    customSiteTitle: 'ADAMANT Node API',
    swaggerOptions: {
      deepLinking: true,
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
