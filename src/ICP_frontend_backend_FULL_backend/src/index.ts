import { ic, Server } from "azle";
import express from "express";
import cors from "cors";

export default Server(() => {
	const app = express();

	app.use(cors());

	app.get("/whoami", (req, res) => {
		res.send(ic.caller().toString());
	});


	app.use(express.static('/dist'));

	return app.listen();
});
