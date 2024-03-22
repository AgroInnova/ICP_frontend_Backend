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

const Header: React.FC = () => {
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
