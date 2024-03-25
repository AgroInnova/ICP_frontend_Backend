import { useEffect, useState } from "react";
import Header from "../Components/Header";
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCol,
	IonContent,
	IonGrid,
	IonProgressBar,
	IonRow,
} from "@ionic/react";
import { useAuthClient } from "../AuthClientProvider";

import { gql, setLogVerbosity, useQuery } from "@apollo/client";

import {
	SchemaDecodedItem,
	SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";
import { toJwt } from "azle/http_client/to_jwt";

import { formatEther } from "@ethersproject/units";

interface Attestation {
	data: string;
	revoked: boolean;
	expirationTime: number;
	__typename: string;
}

interface QueryResult {
	attestations: Attestation[];
}

interface AttestationTypes {
	Userid: string;
	EquipmentId: number;
	ActivationDays: number;
}

const getAttestations = gql`
	query Query($where: AttestationWhereInput) {
		attestations(where: $where) {
			data
			revoked
			expirationTime
		}
	}
`;

interface Module {
	moduleId: number;
	temperature: number;
	humidity: number;
	valve: boolean;
	client: string;
	id: number;
	dateTime: string;
}

interface Data {
	modules: Module[];
}

const UserEAS: React.FC = () => {
	const authclient = useAuthClient();

	const principal = authclient.getIdentity().getPrincipal().toString();
	const queryVariables = generateQueryParameters(principal);

	const { loading, error, data } = useQuery(getAttestations, {
		variables: queryVariables,
	});

	const [equipmentdata, setEquipmentData] = useState<Data>();

	const [userEquipmentList, setUserEquipmentList] = useState<number[]>([]);

	useEffect(() => {
		if (userEquipmentList.length > 0) {
			setInterval(getmodules, 2000);
		}
	}, [userEquipmentList]);

	useEffect(() => {
		const datatyped: QueryResult = data;
		if (data) {
			const dataarrayencoded: string[] = datatyped.attestations.map(
				(item) => item.data
			);

			decodeDataStr(dataarrayencoded);
		}

		if (error) {
			console.log(error);
		}

		if (loading) {
			console.log("loading");
		}
	}, [data, loading, error]);

	useEffect(() => {
		if (equipmentdata) {
			console.log(JSON.stringify(equipmentdata));
		}
	}, [equipmentdata]);

	function decodeDataStr(data: string[]) {
		const schemaEncoder = new SchemaEncoder(
			"string _user,uint32 _equipmentId,uint32 _activationDays"
		);
		const decodedDataArray = data.map((item) =>
			schemaEncoder.decodeData(item)
		);

		extractAttestationData(decodedDataArray);
	}

	function extractAttestationData(decodedDataArray: SchemaDecodedItem[][]) {
		const mappedData: AttestationTypes[] = decodedDataArray.map((item) => ({
			Userid: item[0].value.value.toString(),
			EquipmentId: Number(item[1].value.value.toString()),
			ActivationDays: Number(item[2].value.value.toString()),
		}));

		const equipments = mappedData.map((item) => item.EquipmentId);

		setUserEquipmentList(equipments);
	}

	const getmodules = async () => {
		try {
			const response = await fetch(
				"http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:8000/getModules",
				{
					method: "POST",
					headers: [
						["Authorization", toJwt(authclient.getIdentity())],
						["Content-Type", "application/json"],
					],
					body: JSON.stringify({
						modules: userEquipmentList,
					}),
				}
			);
			if (response.ok) {
				const data = await response.json();
				console.log(data);

				setEquipmentData(data);
			} else {
				console.log("Error:", response.status);
			}
		} catch (error) {
			console.log("Error:", error);
		}
	};

	function generateQueryParameters(principal: string) {
		return {
			where: {
				schemaId: {
					equals: "0x14050ed8107691323eb632a934dfc33e1338e7950894a8edb1d3f6fbce0d79fe",
				},
				AND: [
					{
						AND: [
							{
								recipient: {
									equals: "0x1684C2a107C113c4CCB02dF651933978491dB385",
								},
								decodedDataJson: {
									contains: principal,
								},
							},
						],
					},
				],
			},
		};
	}

	if (!equipmentdata?.modules) {
		return (
			<>
				<Header />
				<IonContent>
					<IonProgressBar type="indeterminate"></IonProgressBar>
				</IonContent>
			</>
		);
	}

	return (
		<>
			<Header />

			<IonButton onClick={getmodules}>get modules try</IonButton>

			<IonContent className="ion-padding">
				<IonGrid fixed={true}>
					<IonRow>
						{equipmentdata.modules.map((module) => (
							<IonCol key={module.moduleId} size="4">
								<div>
									<IonCard>
										<IonCardContent>
											<p>ID: {module.id}</p>
										</IonCardContent>
										<IonCardContent>
											<p>Module ID: {module.moduleId}</p>
										</IonCardContent>
										<IonCardContent>
											<p>
												Temperature:{" "}
												{module.temperature}
											</p>
										</IonCardContent>
										<IonCardContent>
											<p>Humidity: {module.humidity}</p>
										</IonCardContent>
									</IonCard>
								</div>
							</IonCol>
						))}
					</IonRow>
				</IonGrid>
			</IonContent>
		</>
	);
};

export default UserEAS;
