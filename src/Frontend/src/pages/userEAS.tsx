import { useEffect, useState } from "react";
import Header from "../Components/Header";
import { useEthers, useCall } from "@usedapp/core";
import { IonButton, IonContent, IonProgressBar } from "@ionic/react";
import { useAuthClient } from "../AuthClientProvider";

import { gql, useQuery } from "@apollo/client";

import {
	SchemaDecodedItem,
	SchemaEncoder,
} from "@ethereum-attestation-service/eas-sdk";

interface Attestation {
	data: string;
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
		}
	}
`;

const UserEAS: React.FC = () => {
	const authclient = useAuthClient();

	const principal = authclient.getIdentity().getPrincipal().toString();
	const queryVariables = generateQueryParameters(principal);

	const { loading, error, data } = useQuery(getAttestations, {
		variables: queryVariables,
	});

	const [userEquipmentList, setUserEquipmentList] = useState<number[]>([]);

	useEffect(() => {
		if (data) {
			decodeDataStr(data);
			console.log(principal);
		}
	}, [data]);

	useEffect(() => {
		if (userEquipmentList.length > 0) {
			console.log(userEquipmentList);
		}
	}, [userEquipmentList]);
	function decodeDataStr(data: QueryResult) {
		const schemaEncoder = new SchemaEncoder(
			"string _user,uint32 _equipmentId,uint32 _activationDays"
		);
		const decodedDataArray = data.attestations.map((item) =>
			schemaEncoder.decodeData(item.data)
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

	function generateQueryParameters(principal: string) {
		return {
			where: {
				schemaId: {
					equals: "0xf301772006017f6abc8314732c97cd37932d4b7295c428c3dec3660226bf7f29",
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

	return (
		<>
			<Header />
		</>
	);
};

export default UserEAS;
