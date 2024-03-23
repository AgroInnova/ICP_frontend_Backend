import {
	IonContent,
	IonHeader,
	IonPage,
	IonTitle,
	IonToolbar,
} from "@ionic/react";
import "./Home.css";
import Header from "../Components/Header";
import { useAuthClient } from "../AuthClientProvider";
const Home: React.FC = () => {

	return (
		<>
			<Header />
		</>
	);
};

export default Home;
