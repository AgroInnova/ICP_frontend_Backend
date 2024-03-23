import React, { useEffect, useState } from "react";

import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import {
	useEthers,
	useSendTransaction,
	useTransactions,
	getStoredTransactionState,
} from "@usedapp/core";
import { useAuthClient } from "../AuthClientProvider";
import { IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";

const ContractABI = [
	{
		inputs: [
			{ internalType: "string", name: "_user", type: "string" },
			{ internalType: "uint32", name: "_equipmentId", type: "uint32" },
			{ internalType: "uint32", name: "_activationDays", type: "uint32" },
		],
		name: "createServiceAttestation",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;

const contractInterface = new utils.Interface(ContractABI);

const contractAdress = "0x139D0f3f24283bC2012f79d9915989Ea9b33a62a";

export const contract = new Contract(contractAdress, contractInterface);

const AttestationSampleCreation = () => {
	const history = useHistory();

	const authclient = useAuthClient();

	const { sendTransaction, state, resetState } = useSendTransaction({
		transactionName: "createServiceAttestation",
	});

	const create4TestAttestations = async () => {
		const _user = authclient.getIdentity().getPrincipal().toString();

		const _equipmentId1 = 3;
		const _equipmentId2 = 33;
		const _equipmentId3 = 333;
		const _equipmentId4 = 3333;

		const _activationDays = 30;
		const transactionadata = contract.interface.encodeFunctionData(
			"createServiceAttestation",
			[_user, _equipmentId1, _activationDays]
		);

		const transactionadata2 = contract.interface.encodeFunctionData(
			"createServiceAttestation",
			[_user, _equipmentId2, _activationDays]
		);

		const transactionadata3 = contract.interface.encodeFunctionData(
			"createServiceAttestation",
			[_user, _equipmentId3, _activationDays]
		);

		const transactionadata4 = contract.interface.encodeFunctionData(
			"createServiceAttestation",
			[_user, _equipmentId4, _activationDays]
		);

		sendTransaction({
			to: "0x139D0f3f24283bC2012f79d9915989Ea9b33a62a",
			data: transactionadata,
		});

		resetState();

		sendTransaction({
			to: "0x139D0f3f24283bC2012f79d9915989Ea9b33a62a",
			data: transactionadata2,
		});

		resetState();

		sendTransaction({
			to: "0x139D0f3f24283bC2012f79d9915989Ea9b33a62a",
			data: transactionadata3,
		});

		resetState();

		sendTransaction({
			to: "0x139D0f3f24283bC2012f79d9915989Ea9b33a62a",
			data: transactionadata4,
		});

		setOneMinuteTimer();
	};

	function setOneMinuteTimer() {
		setTimeout(() => {
			console.log("One minute has passed");
			history.push("/userEAS");
		}, 60000);
	}

	const skipStep = () => {
		history.push("/userEAS");
	};
	return (
		<>
			<div>attestationSampleCreation</div>;
			<IonButton onClick={create4TestAttestations}>
				Create 4 Test with current id
			</IonButton>
			<IonButton onClick={skipStep}>
				Seguir a la otra pagina si ya se hizo esto con anticipacion completaron
			</IonButton>
		</>
	);
};

export default AttestationSampleCreation;
