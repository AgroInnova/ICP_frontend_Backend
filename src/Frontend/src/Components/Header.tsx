import {
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
	IonMenu,
	IonButtons,
	IonMenuButton,
} from "@ionic/react";
import LogoutButton from "./LogoutButton";
import { useUser } from "../AuthClientProvider";
import { useEffect } from "react";

const Header: React.FC = () => {
	const { user } = useUser();

	useEffect(() => {
		console.log('is adming?',user);
	}, [user]);

	return (
		<>
			<IonMenu contentId="main-content">
				<IonHeader>
					<IonToolbar>
						<IonTitle>Menu Content</IonTitle>
					</IonToolbar>
				</IonHeader>
				<IonContent className="ion-padding">
					This is the menu content.
				</IonContent>
			</IonMenu>

			<IonHeader id="main-content">
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton></IonMenuButton>
					</IonButtons>
					<IonButtons slot="end">
						<LogoutButton />
					</IonButtons>
				</IonToolbar>
			</IonHeader>
		</>
	);
};

export default Header;
