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
	id: number;
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
		console.log(
			"---------------------------------------------------------"
		);
		console.log(
			"---------------------------------------------------------"
		);
		console.log("GETMODULES REQUEST");
		const calleric = ic.caller().toString();
		const modulesArray: Number[] = req.body.modules;

		const index = sensorData.findIndex(
			(item) => item.Ic_cliente === calleric
		);

		if (index === -1) {
			res.send({ message: "No data found" });
			return;
		}

		if (index !== -1) {
			console.log("Data found");
			const modules = sensorData[index].data.filter((item) =>
				modulesArray.includes(item.moduleId)
			);

			const listFilterJsonData: SavedModule[] = [];

			for (let i = 0; i < modulesArray.length; i++) {
				console.log(`Outer loop iteration ${i}`);

				const moduleid = modulesArray[i];
				console.log(`moduleid: ${moduleid}`);

				let greatestId = -1;
				let greatestModule = null;

				for (let j = 0; j < modules.length; j++) {
					console.log(`Inner loop iteration ${j}`);

					if (
						modules[j].moduleId === moduleid &&
						modules[j].id > greatestId
					) {
						greatestId = modules[j].id;
						greatestModule = modules[j];
						console.log(
							`New greatest found at index ${j}: ${greatestId}`
						);
					}
				}

				if (greatestModule !== null) {
					console.log(
						`Pushing module with id ${greatestId} to listFilterJsonData`
					);
					listFilterJsonData.push(greatestModule);
				}
			}

			res.send({ modules: listFilterJsonData });
			return;
		}
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
