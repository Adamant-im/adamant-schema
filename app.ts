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
const { version: packageVersion } = require('./package.json');
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

    (function () {
      var TIMEOUT_MS = 5000;
      var PACKAGE_VERSION = '${packageVersion}';

      function originalLabel(option) {
        if (!option.dataset.originalLabel) {
          option.dataset.originalLabel = option.textContent;
        }
        return option.dataset.originalLabel;
      }

      function parseOption(option) {
        var text = originalLabel(option);
        var sep = text.indexOf(' - ');
        var url = sep >= 0 ? text.slice(0, sep) : text;
        var description = sep >= 0 ? text.slice(sep + 3) : '';
        return { url: url, description: description };
      }

      function statusUrl(apiUrl) {
        return apiUrl.replace(/\\/+$/, '') + '/node/status';
      }

      function displayUrl(apiUrl) {
        return apiUrl.replace(/\\/api\\/?$/, '');
      }

      function buildLabel(result) {
        var label = result.displayUrl;
        if (result.description) label += ' — ' + result.description;
        label += result.version
          ? ', API v' + result.version
          : ' (Ping failed)';
        return label;
      }

      function fetchVersion(apiUrl) {
        var controller = new AbortController();
        var timer = setTimeout(function () {
          controller.abort();
        }, TIMEOUT_MS);

        return fetch(statusUrl(apiUrl), { signal: controller.signal })
          .then(function (response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
          })
          .then(function (data) {
            return data && data.version && data.version.version;
          })
          .finally(function () {
            clearTimeout(timer);
          });
      }

      function compareVersions(a, b) {
        var pa = String(a).split('.');
        var pb = String(b).split('.');
        var len = Math.max(pa.length, pb.length);
        for (var i = 0; i < len; i++) {
          var na = parseInt(pa[i], 10) || 0;
          var nb = parseInt(pb[i], 10) || 0;
          if (na !== nb) return na - nb;
        }
        return 0;
      }

      function setServerValue(select, value) {
        var setter = Object.getOwnPropertyDescriptor(
          window.HTMLSelectElement.prototype,
          'value'
        ).set;
        setter.call(select, value);
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }

      function selectBest(select, results) {
        var responding = results.filter(function (r) {
          return r.version && /^Mainnet/.test(r.description);
        });
        if (!responding.length) return;

        var chosen = responding.find(function (r) {
          return r.version === PACKAGE_VERSION;
        });

        if (!chosen) {
          var highest = responding.reduce(function (best, r) {
            return compareVersions(r.version, best.version) > 0 ? r : best;
          }).version;
          chosen = responding.find(function (r) {
            return r.version === highest;
          });
        }

        if (chosen) setServerValue(select, chosen.url);
      }

      function runHealthCheck(select) {
        var results = Array.prototype.map.call(
          select.options,
          function (option) {
            var parsed = parseOption(option);
            return {
              option: option,
              url: option.value || parsed.url,
              displayUrl: displayUrl(option.value || parsed.url),
              description: parsed.description,
              version: null,
            };
          }
        );

        var checks = results.map(function (result) {
          return fetchVersion(result.url)
            .then(function (version) {
              result.version = version || null;
            })
            .catch(function () {
              result.version = null;
            })
            .finally(function () {
              result.option.text = buildLabel(result);
            });
        });

        return Promise.allSettled(checks).then(function () {
          selectBest(select, results);
        });
      }

      function checkServerSelect() {
        var select = document.querySelector('.servers select');
        if (!select || select.__healthChecked) return !!select;

        select.__healthChecked = true;
        runHealthCheck(select);
        return true;
      }

      window.addEventListener('load', function () {
        if (checkServerSelect()) return;

        var observer = new MutationObserver(function () {
          if (checkServerSelect()) observer.disconnect();
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });
    })();
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
