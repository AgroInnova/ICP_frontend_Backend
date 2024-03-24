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
			{ internalType: "contract IEAS", name: "eas", type: "address" },
			{
				internalType: "address",
				name: "targetRecipient",
				type: "address",
			},
		],
		stateMutability: "nonpayable",
		type: "constructor",
	},
	{ inputs: [], name: "InvalidEAS", type: "error" },
	{
		inputs: [
			{ internalType: "bytes32", name: "_schema", type: "bytes32" },
			{ internalType: "string", name: "_userId", type: "string" },
			{ internalType: "uint32", name: "_equipmentId", type: "uint32" },
			{ internalType: "uint64", name: "_activationDays", type: "uint64" },
		],
		name: "attest",
		outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{ internalType: "bytes32", name: "schema", type: "bytes32" },
			{ internalType: "bytes32", name: "uid", type: "bytes32" },
		],
		name: "revoke",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
] as const;

const contractInterface = new utils.Interface(ContractABI);

const contractAdress = "0x4D57CEA19A2783D96872C965E7A092250bbf5775";

export const contract = new Contract(contractAdress, contractInterface);

const _schema =
	"0x14050ed8107691323eb632a934dfc33e1338e7950894a8edb1d3f6fbce0d79fe";

const AttestationSampleCreation = () => {
	const history = useHistory();

	const authclient = useAuthClient();

	const { sendTransaction, state, resetState } = useSendTransaction({
		transactionName: "attest",
	});

	const create4TestAttestations = async () => {
		const _user = authclient.getIdentity().getPrincipal().toString();

		const _equipmentId1 = 3;
		const _equipmentId2 = 33;
		const _equipmentId3 = 333;
		const _equipmentId4 = 3333;

		const _activationDays = expirationgeneration();

		const transactionadata = contract.interface.encodeFunctionData(
			"attest",
			[_schema, _user, _equipmentId1, _activationDays]
		);

		const transactionadata2 = contract.interface.encodeFunctionData(
			"attest",
			[_schema, _user, _equipmentId2, _activationDays]
		);

		const transactionadata3 = contract.interface.encodeFunctionData(
			"attest",
			[_schema, _user, _equipmentId3, _activationDays]
		);

		const transactionadata4 = contract.interface.encodeFunctionData(
			"attest",
			[_schema, _user, _equipmentId4, _activationDays]
		);

		sendTransaction({
			to: contractAdress,
			data: transactionadata,
		});

		resetState();

		sendTransaction({
			to: contractAdress,
			data: transactionadata2,
		});

		resetState();

		sendTransaction({
			to: contractAdress,
			data: transactionadata3,
		});

		resetState();

		sendTransaction({
			to: contractAdress,
			data: transactionadata4,
		});
	};

	const skipStep = () => {
		history.push("/userEAS");
	};

	const expirationgeneration = () => {
		const currentDate = new Date();
		currentDate.setMinutes(currentDate.getMinutes() + 10);

		const year = currentDate.getUTCFullYear();
		const month = currentDate.getUTCMonth() + 1; // getUTCMonth returns a 0-based month, so add 1
		const day = currentDate.getUTCDate();
		const hours = currentDate.getUTCHours();
		const minutes = currentDate.getUTCMinutes();

		const fechaExpiracion = new Date(
			Date.UTC(year, month - 1, day, hours, minutes)
		);
		console.log(fechaExpiracion);

		const timestampUnix = Math.floor(fechaExpiracion.getTime() / 1000);

		return timestampUnix;
	};
	return (
		<>
			<div>attestationSampleCreation</div>;
			<IonButton onClick={create4TestAttestations}>
				Create 4 Test with current id
			</IonButton>
			<IonButton onClick={skipStep}>
				Seguir a la otra pagina si ya se hizo esto con anticipacion
				completaron
			</IonButton>
		</>
	);
};

export default AttestationSampleCreation;
