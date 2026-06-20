import express from 'express';
import swaggerUI from 'swagger-ui-express';

function operationSearchPlugin() {
  return {
    fn: {
      opsFilter(taggedOperations: any, filter: string) {
        const query = String(filter).trim().toLowerCase();

        if (!query) {
          return taggedOperations;
        }

        return taggedOperations
          .map((tagData: any, tagName: string) => {
            if (String(tagName).toLowerCase().includes(query)) {
              return tagData;
            }

            const operations = tagData.get('operations').filter((item: any) => {
              const operation = item.get('operation');
              const searchableValues = [
                item.get('path'),
                item.get('method'),
                operation.get('operationId'),
                operation.get('summary'),
              ];

              return searchableValues.some((value) =>
                String(value ?? '')
                  .toLowerCase()
                  .includes(query)
              );
            });

            return tagData.set('operations', operations);
          })
          .filter((tagData: any) => !tagData.get('operations').isEmpty());
      },
    },
  };
}

const app = express();
const swaggerDocument = require('./dist/schema.json');
const swaggerUiOptions = {
  customSiteTitle: 'ADAMANT Node API',
  swaggerOptions: {
    deepLinking: true,
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    plugins: [operationSearchPlugin],
  },
  customJsStr: `
    window.addEventListener('load', function () {
      function updateSearchPlaceholder() {
        const input = document.querySelector('.operation-filter-input');

        if (!input) return false;

        input.placeholder = 'Search operations';
        return true;
      }

      if (updateSearchPlaceholder()) return;

      const observer = new MutationObserver(function () {
        if (updateSearchPlaceholder()) observer.disconnect();
      });

      observer.observe(document.body, { childList: true, subtree: true });
    });
  `,
};

app.use(express.static('dist', { index: false }));
app.use(
  '/',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, swaggerUiOptions)
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
