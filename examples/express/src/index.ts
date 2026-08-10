import express, { type Express } from "express";
import routes from "./routes";

const app: Express = express();
const port = 3000;

app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
