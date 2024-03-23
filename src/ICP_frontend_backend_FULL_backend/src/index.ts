import { CallbackStrategy, ic, Principal, Server } from "azle";
import express, { Request } from "express";
import cors from "cors";

const principalAdmin: string[] = [];

const users: String[] = [];

interface SavedModule {
	moduleId: number;
	temperature: number;
	humidity: number;
	valve: boolean;
	client: string;
	id: string;
	dateTime: string;
}

interface Message {
	savedModule: SavedModule;
}

interface CubetasClientes {
	Ic_cliente: string;
	data: SavedModule[];
}

const sensorData: CubetasClientes[] = [];

export default Server(() => {
	const app = express();

	app.use(express.json());

	app.use(cors());

	app.use(express.json());

	//Enpoint para NestJS
	app.post("/sensorData", (req: Request, res) => {
		const message: Message = req.body;

		const clientid = message.savedModule.client;

		const index = sensorData.findIndex(
			(item) => item.Ic_cliente === clientid
		);

		if (index !== -1) {
			sensorData[index].data.push(message.savedModule);
		} else {
			sensorData.push({
				Ic_cliente: String(clientid),
				data: [message.savedModule],
			});
		}

		res.sendStatus(200);
	});

	//Enpoint para verificar si es admin o user
	app.post("/login", (req, res) => {
		if (principalAdmin.length === 0) {
			principalAdmin[0] = ic.caller().toString();

			res.send({ type: "admin" });

			console.log("principalAdmin === vacio");
			console.log(principalAdmin[0]);
			console.log();
			console.log("___________________________");

			console.log();
			console.log();
			return;
		}

		if (principalAdmin[0] === ic.caller().toString()) {
			console.log("ic.caller() === principalAdmin");
			console.log(principalAdmin[0]);

			console.log();
			console.log("_____________________________");
			console.log();
			console.log();
			res.send({ type: "admin" });
			return;
		}

		if (!users.includes(ic.caller().toString())) {
			console.log("!users.includes(ic.caller())");

			users[users.length] = ic.caller().toString();

			console.log(users);
			console.log("_____________________________");
			console.log();
			console.log();

			res.send({ type: "user" });
			return;
		}

		res.send({ type: "user" });
	});

	app.post("/getModules", (req, res) => {
		// console.log(ic.caller().toString());
		console.log(req.body.modules);
		res.send({ message: "getModules" });
	});

	app.delete("/reset", (req, res) => {
		principalAdmin[0] = "";

		for (let i = 0; i < users.length; i++) {
			users.pop();
		}

		res.send({ message: "Data reset successfully" });
	});

	//Testing purposes only

	app.get("/getUsersandAdmin", (req, res) => {
		const _users = users.map((user) => user.toString());

		res.json({ users: _users, principalAdmin: principalAdmin });
	});

	app.get("/getUsers", (req, res) => {
		res.json({ Users: users });
	});

	app.get("/getallData", (req, res) => {
		res.send(sensorData);
	});
	return app.listen();
});
