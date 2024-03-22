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
	console.log("entro a home");

	const authClient = useAuthClient();

	console.log(authClient.getIdentity().getPrincipal().toText());

	return (
		<>
			<Header />
		</>
	);
};

export default Home;
