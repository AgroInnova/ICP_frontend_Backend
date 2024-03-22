import {
	IonButton,
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonCol,
	IonGrid,
	IonInput,
	IonPage,
	IonRow,
	IonText,
	IonTitle,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import Header from "../Components/Header";

import {
	useEtherBalance,
	useEthers,
	useSendTransaction,
	useContractFunction,
} from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
const ContractABI = [
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_userId",
				type: "uint64",
			},
			{
				internalType: "uint64",
				name: "_equipmentId",
				type: "uint64",
			},
			{
				internalType: "uint32",
				name: "_activationDays",
				type: "uint32",
			},
		],
		name: "addEntry",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		name: "attestationsArray",
		outputs: [
			{
				internalType: "uint64",
				name: "userId",
				type: "uint64",
			},
			{
				internalType: "uint64",
				name: "equipmentId",
				type: "uint64",
			},
			{
				internalType: "uint32",
				name: "activationDays",
				type: "uint32",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "attestationsCount",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_user",
				type: "uint64",
			},
			{
				internalType: "uint64",
				name: "_equipmentId",
				type: "uint64",
			},
			{
				internalType: "uint32",
				name: "_activationDays",
				type: "uint32",
			},
		],
		name: "createServiceAttestation",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32",
			},
		],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "uint64",
				name: "_userId",
				type: "uint64",
			},
		],
		name: "getAttestationsByUserId",
		outputs: [
			{
				components: [
					{
						internalType: "uint64",
						name: "userId",
						type: "uint64",
					},
					{
						internalType: "uint64",
						name: "equipmentId",
						type: "uint64",
					},
					{
						internalType: "uint32",
						name: "activationDays",
						type: "uint32",
					},
				],
				internalType:
					"struct ServiceActivationAttestation.Attestations[]",
				name: "",
				type: "tuple[]",
			},
		],
		stateMutability: "view",
		type: "function",
	},
] as const;

const contractInterface = new utils.Interface(ContractABI);

const contractAdress = "0x9eb3C959ED45B6A18Bd19C88ff70220F7D95dc40";

const contract = new Contract(contractAdress, contractInterface);

const EAS: React.FC = () => {
	const { account, activateBrowserWallet, deactivate, chainId } = useEthers();

	const userBalance = useEtherBalance(account);

	const [userID, setUserID] = useState<number>();

	const [equipmentID, setEquipmentID] = useState<string>("0");

	const [activationDays, setActivationDays] = useState<number>();

	const [contractParams, setContractParams] =
		useState<[number, string, number]>();

	const { sendTransaction, state, resetState } = useSendTransaction({
		transactionName: "createServiceAttestation",
	});

	const handleClick = () => {
		if (!contractParams) {
			alert("Contract parameters are not set");
			return;
		}

		const [_user, _equipmentId, _activationDays] = contractParams;

		const data = contract.interface.encodeFunctionData(
			"createServiceAttestation",
			[_user, _equipmentId, _activationDays]
		);

		console.log(data);

		sendTransaction({
			to: "0x9eb3C959ED45B6A18Bd19C88ff70220F7D95dc40",
			data: data,
		});
	};

	useEffect(() => {
		activateBrowserWallet();
	}, []);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		if (!userID || !equipmentID || !activationDays) {
			alert("Please fill all fields");

			return;
		}
		setContractParams([userID, equipmentID, activationDays]);
	};

	return (
		<>
			{/* <Header /> */}
			<IonGrid>
				<IonCol size="">
					<IonRow className="ion-justify-content-center">
						<IonCard>
							<IonCardContent>
								<IonCardTitle className="ion-text-center">
									Registro de attestaciones
								</IonCardTitle>
							</IonCardContent>

							<IonCardContent>
								<IonText className="ion-text-center">
									<IonTitle>Cuenta</IonTitle>
								</IonText>
								<IonCardTitle className="ion-text-center">
									{account}
								</IonCardTitle>
							</IonCardContent>

							<IonCardContent>
								<IonText className="ion-text-center">
									<IonTitle>chainId</IonTitle>
								</IonText>
								<IonCardTitle className="ion-text-center">
									{chainId}
								</IonCardTitle>
							</IonCardContent>

							<IonCardContent
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<IonButton
									onClick={() =>
										account
											? deactivate()
											: activateBrowserWallet()
									}
								>
									{account
										? "Desconectar"
										: "Conectar Metamask"}
								</IonButton>
							</IonCardContent>
							<IonCardContent>
								<IonText className="ion-text-center">
									<IonTitle>Balance</IonTitle>
								</IonText>
								<IonCardTitle className="ion-text-center">
									{formatEther(userBalance || 0)} ETH
								</IonCardTitle>
							</IonCardContent>
						</IonCard>
					</IonRow>
					<form onSubmit={handleSubmit}>
						<IonRow className="ion-justify-content-center">
							<IonCard>
								<IonCardContent>
									<IonInput
										type="number"
										onIonChange={(e) => {
											setUserID(Number(e.detail.value));
										}}
										placeholder="User ID"
									></IonInput>
								</IonCardContent>
							</IonCard>
						</IonRow>
						<IonRow className="ion-justify-content-center">
							<IonCard>
								<IonCardContent>
									<IonInput
										type="text"
										onIonChange={(e) => {
											setEquipmentID(
												String(e.detail.value)
											);
										}}
										placeholder="Equipment ID"
									></IonInput>
								</IonCardContent>
							</IonCard>
						</IonRow>
						<IonRow className="ion-justify-content-center">
							<IonCard>
								<IonCardContent>
									<IonInput
										type="number"
										onIonChange={(e) => {
											setActivationDays(
												Number(e.detail.value)
											);
										}}
										placeholder="Activation Days"
									></IonInput>
								</IonCardContent>
							</IonCard>
						</IonRow>
						<IonRow className="ion-justify-content-center">
							<IonButton type="submit">Registrar</IonButton>
						</IonRow>
					</form>					
				</IonCol>
			</IonGrid>
		</>
	);
};

export default EAS;
