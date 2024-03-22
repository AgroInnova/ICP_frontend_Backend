import { ic, Principal, Server } from "azle";
import express from "express";
import cors from "cors";

const principalAdmin: String =
	"4ry4y-2a5ih-yvfjn-qlxaj-god53-bnqdd-d4wam-egsax-aopnm-pohgx-2ae";

export default Server(() => {
	const app = express();

	app.use(cors());

	app.get("/whoami", (req, res) => {
		console.log(ic.caller());
		res.send(ic.caller().toString());
	});

	app.get("/test", (req, res) => {
		console.log("aaaaaaaaaa");
		res.json({ test: "helloworld" });
	});

	app.get("/login", (req, res) => {
		if (ic.caller().toString() === principalAdmin) {
			res.send({ type: "admin" });
		}
		res.send({ type: "user", caller: ic.caller().toString() });
	});

	return app.listen();
});
