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
import React, { useState } from "react";
import Header from "../Components/Header";

const EAS: React.FC = () => {
	console.log("entro a EAS");

	const [connectCardText, setconnectCardText] = useState<string>(
		"Connect to Metamask"
	);
	return (
		<>
			<Header />
			<IonGrid>
				<IonCol size="">
					<IonRow className="ion-justify-content-center">
						<IonCard>
							<IonCardContent>
								<IonCardTitle className="ion-text-center">
									{connectCardText}
								</IonCardTitle>
							</IonCardContent>

							<IonCardContent
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<IonButton>Connect</IonButton>
							</IonCardContent>
						</IonCard>
					</IonRow>
					<IonRow className="ion-justify-content-center">
						<IonCard>
							<IonCardContent>
								<IonInput label="User ID"></IonInput>
							</IonCardContent>
						</IonCard>
					</IonRow>
					<IonRow className="ion-justify-content-center">
						<IonCard>
							<IonCardContent>
								<IonInput label="Eqipment ID"></IonInput>
							</IonCardContent>
						</IonCard>
					</IonRow>
					<IonRow className="ion-justify-content-center">
						<IonCard>
							<IonCardContent>
								<IonInput label="Activation Days"></IonInput>
							</IonCardContent>
						</IonCard>
					</IonRow>
					<IonRow className="ion-justify-content-center">
						<IonButton>Registrar</IonButton>
					</IonRow>

					<IonRow className="ion-justify-content-center">
						<IonButton>Seleccionar usuario</IonButton>
					</IonRow>
				</IonCol>
			</IonGrid>
		</>
	);
};

export default EAS;
