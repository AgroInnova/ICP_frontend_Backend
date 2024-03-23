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

import { useEtherBalance, useEthers, useSendTransaction } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

import { utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import { useAuthClient } from "../AuthClientProvider";

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

		const data = contract.interface.encodeFunctionData(
			"createServiceAttestation",
			[_user, _equipmentId, _activationDays]
		);

		sendTransaction({
			to: "0x139D0f3f24283bC2012f79d9915989Ea9b33a62a",
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
					</form>
				</IonCol>
			</IonGrid>
		</>
	);
};

export default AdminEAS;
