import { ic, Principal, Server } from "azle";
import express from "express";
import cors from "cors";

const principalAdmin: String =
	"pg6uo-z4bcp-vofpq-fbvnc-szj6j-qyusf-kh2i6-45dft-pzurs-rolzb-pqe";

interface SensorData {
	moduleId: number;
	temperature: number;
	humidity: number;
	valve: boolean;
	client: string;
	id: number;
	dateTime: string;
}

interface CubetasClientes {
	Ic_cliente: string;
	data: SensorData[];
}

let sensorData: CubetasClientes[] = [];

export default Server(() => {
	const app = express();

	app.use(cors());

	app.post("/sensorData", (req: express.Request<{}, {}, SensorData>, res) => {
		const message: SensorData = req.body;
		const index = sensorData.findIndex(
			(item) => item.Ic_cliente === message.client
		);

		if (index !== -1) {
			sensorData[index].data.push(message);
		} else {
			sensorData.push({
				Ic_cliente: message.client,
				data: [message],
			});
		}

		console.log(sensorData);
		res.sendStatus(200);
	});

	app.get("/login", (req, res) => {
		if (ic.caller().toString() === principalAdmin) {
			res.send({ type: "admin" });
		}
		res.send({ type: "user" });
	});

	app.get("/getModules", (req, res) => {
		const caller = ic.caller().toString();
		const modules: number[] = req.body;

		const index = sensorData.findIndex(
			(item) => item.Ic_cliente === caller
		);

		if (index !== -1) {
			const filteredData = sensorData[index].data.filter((dataItem) =>
				modules.includes(dataItem.moduleId)
			);
			res.json(filteredData);
		} else {
			res.json([]);
		}
	});

	return app.listen();
});
