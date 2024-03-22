import { IonButton } from "@ionic/react";
import { useAuthClientUpdate, useUser } from "../AuthClientProvider";
import { useHistory } from "react-router";

const LogoutButton: React.FC = () => {
	const { logout } = useAuthClientUpdate();
	const { setUser } = useUser();
	const history = useHistory();
	const logoutactions = async () => {
		setUser(null);
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
