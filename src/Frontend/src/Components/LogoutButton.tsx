import { IonButton } from "@ionic/react";
import { useAuthClientUpdate } from "../AuthClientProvider";
import { useHistory } from "react-router";

const LogoutButton: React.FC = () => {
	const {logout} = useAuthClientUpdate();
	const history = useHistory();
	const logoutactions = async () => {
		logout();
		history.push("/logout");
	};

	return (
		<IonButton color="danger" onClick={logoutactions}>
			Logout
		</IonButton>
	);
};

export default LogoutButton;
