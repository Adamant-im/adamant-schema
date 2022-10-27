import express from "express";
import swaggerUI from "swagger-ui-express";

const app = express();
const swaggerDocument = require("./docs/schema.json");

app.use(express.static("docs"));
app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
