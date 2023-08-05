/* Vercel wants api/index.js to be the "entry point" script, but we import it into server.js.
   So we have vercel.json move the api directory to "myapi" and put this script in api/index.js. */
import express from "express";

import initApi from "../myapi/index.js";

const app = express();
await initApi(app);
export default app;
