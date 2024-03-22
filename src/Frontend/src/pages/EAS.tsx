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

import { Web3, Contract } from "web3";

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

declare global {
	interface Window {
		ethereum: any;
	}
}

const contractAdress = "0x9eb3C959ED45B6A18Bd19C88ff70220F7D95dc40";

const NETWORK_ID = 534351;

const EAS: React.FC = () => {
	console.log("entro a EAS");

	const [connectCardText, setconnectCardText] = useState<string>(
		"Connect to Metamask"
	);

	const [contract, setContract] = useState<Contract<any> | null>(null);
	const [connectedAccount, setConnectedAccount] = useState("null");
	const [web3, setWeb3] = useState<Web3 | null>(null);

	const [userId, setUserId] = useState("");
	const [equipmentId, setEquipmentId] = useState("");
	const [activationDays, setActivationDays] = useState("");

	async function connectMetamask() {
		if (window.ethereum) {
			const _web3 = new Web3(window.ethereum);
			setWeb3(web3);
			await window.ethereum.request({ method: "eth_requestAccounts" });

			const networkId = Number(await _web3.eth.net.getId());

			if (networkId !== NETWORK_ID) {
				alert(
					`Please connect to the correct network. Current network ID is ${networkId}`
				);
				return;
			}

			const accounts = await _web3.eth.getAccounts();
			setConnectedAccount(accounts[0]);
			setconnectCardText("Connected to Metamask Account:");

			// Create a new contract instance

			const contract = new Contract(ContractABI, contractAdress, _web3);
			setContract(contract);
		} else {
			alert("Please download metamask");
		}
	}

	async function createServiceAttestation(
		_userId: number,
		_equipmentId: number,
		_activationDays: number
	) {
		if (contract && connectedAccount !== "null") {
			try {
				const result = await contract.methods
					.createServiceAttestation(
						_userId,
						_equipmentId,
						_activationDays
					)
					.send({
						from: connectedAccount,
					});
				console.log(result);
			} catch (e) {
				console.log(e);
			}
		} else {
			alert("Please connect to Metamask first");
		}
	}

	async function getAttestationsByUserId(_userId: number) {
		if (contract) {
			const result = await contract.methods
				.getAttestationsByUserId(_userId)
				.call();
			console.log(result);
		}
	}

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		createServiceAttestation(
			parseInt(userId),
			parseInt(equipmentId),
			parseInt(activationDays)
		);
	};

	function disconnectMetamask() {
		setConnectedAccount("null");
		setContract(null);
		setconnectCardText("Connect to Metamask");
	}

	return (
		<>
			{/* <Header /> */}
			<IonGrid>
				<IonCol size="">
					<IonRow className="ion-justify-content-center">
						<IonCard>
							<IonCardContent>
								<IonCardTitle className="ion-text-center">
									{connectCardText}
								</IonCardTitle>
								{connectedAccount === "null" ? (
									<IonCardTitle className="ion-text-center">
										Not Connected
									</IonCardTitle>
								) : (
									<IonText>{connectedAccount}</IonText>
								)}
							</IonCardContent>

							<IonCardContent
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<IonButton
									onClick={() => connectMetamask()}
									disabled={connectedAccount !== "null"}
								>
									Connect
								</IonButton>
							</IonCardContent>
						</IonCard>
					</IonRow>
					<form onSubmit={handleSubmit}>
						<IonRow className="ion-justify-content-center">
							<IonCard>
								<IonCardContent>
									<IonInput
										type="number"
										value={userId}
										onIonChange={(e) =>
											setUserId(e.detail.value!)
										}
										placeholder="User ID"
									></IonInput>
								</IonCardContent>
							</IonCard>
						</IonRow>
						<IonRow className="ion-justify-content-center">
							<IonCard>
								<IonCardContent>
									<IonInput
										type="number"
										value={equipmentId}
										onIonChange={(e) =>
											setEquipmentId(e.detail.value!)
										}
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
										value={activationDays}
										onIonChange={(e) =>
											setActivationDays(e.detail.value!)
										}
										placeholder="Activation Days"
									></IonInput>
								</IonCardContent>
							</IonCard>
						</IonRow>
						<IonRow className="ion-justify-content-center">
							<IonButton type="submit">Registrar</IonButton>
						</IonRow>
					</form>

					<IonRow className="ion-justify-content-center">
						<IonButton>Seleccionar usuario</IonButton>
					</IonRow>

					<IonRow className="ion-justify-content-center">
						<IonButton onClick={disconnectMetamask}>
							Disconnect
						</IonButton>
					</IonRow>
				</IonCol>
			</IonGrid>
		</>
	);
};

export default EAS;
