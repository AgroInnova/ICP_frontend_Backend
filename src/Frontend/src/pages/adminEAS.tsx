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
	useTransactions,
	useContractFunction,
} from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useAuthClient } from "../AuthClientProvider";

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

const AdminEAS: React.FC = () => {
	const authclient = useAuthClient();

	const [principal, setPrincipal] = useState<string>();

	const onclickprincipal = () => {
		setPrincipal(authclient.getIdentity().getPrincipal().toString());
		setUserID(authclient.getIdentity().getPrincipal().toString());
	};

	const { account, activateBrowserWallet, deactivate, chainId } = useEthers();

	const userBalance = useEtherBalance(account);

	const [userID, setUserID] = useState<string>();

	const [equipmentID, setEquipmentID] = useState<number>();

	const [activationDays, setActivationDays] = useState<number>();

	const [contractParams, setContractParams] =
		useState<[string, number, number]>();

	const { sendTransaction, state, resetState } = useSendTransaction({
		transactionName: "createServiceAttestation",
	});

	useEffect(() => {
		if (state) {
			if (state.status === "Success") {
				alert("Transaction successful");
				resetState();
			}
		}
	}, [state]);

	useEffect(() => {
		if (contractParams) {
			handleClick();
		}
	}, [contractParams]);

	const handleClick = () => {
		if (!contractParams) {
			alert("Contract parameters are not set");
			return;
		}

		const [_user, _equipmentId, _activationDays] = contractParams;

		const data = contract.interface.encodeFunctionData("attest", [
			_schema,
			_user,
			_equipmentId,
			_activationDays,
		]);

		sendTransaction({
			to: contractAdress,
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

		setActivationDays(timestampUnix);
	};

	return (
		<>
			<Header />
			<IonGrid>
				<IonCol>
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
										type="text"
										value={principal}
										onIonChange={(e) => {
											setUserID(String(e.detail.value));
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
										type="number"
										onIonChange={(e) => {
											setEquipmentID(
												Number(e.detail.value)
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
										value={activationDays}
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

						<IonRow className="ion-justify-content-center">
							<IonCardContent>
								<IonText>
									{authclient
										.getIdentity()
										.getPrincipal()
										.toString()}
								</IonText>
							</IonCardContent>
						</IonRow>

						<IonRow className="ion-justify-content-center">
							<IonCardContent>
								<IonButton onClick={onclickprincipal}>
									SetearID como principal
								</IonButton>
							</IonCardContent>
						</IonRow>

						<IonRow className="ion-justify-content-center">
							<IonCardContent>
								<IonButton onClick={expirationgeneration}>
									Generar Fecha de expiracion
								</IonButton>
							</IonCardContent>
						</IonRow>
					</form>
				</IonCol>
			</IonGrid>
		</>
	);
};

export default AdminEAS;
