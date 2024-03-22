import React from "react";
import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
	IonButton,
	IonCard,
	IonCardContent,
	IonText,
} from "@ionic/react";

const Logout: React.FC = () => {
	console.log('entro a logout');
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Logout</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent className="ion-padding">
				<IonCard>
					<IonCardContent>
						<IonText>You have successfully logged out.</IonText>
					</IonCardContent>

					
				</IonCard>

				<IonCard>
					<IonCardContent>
						<IonText>Log in again</IonText>
						<IonButton routerLink="/login">Login</IonButton>
					</IonCardContent>		
				</IonCard>
			
			</IonContent>
		</IonPage>
	);
};

export default Logout;
