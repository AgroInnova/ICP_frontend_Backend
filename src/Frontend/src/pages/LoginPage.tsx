import { useEffect } from "react";
import {
	useAuthClient,
	useAuthClientUpdate,
	useUser,
} from "../AuthClientProvider";
import { toJwt } from "azle/http_client";
import { IonProgressBar } from "@ionic/react";

import { useHistory } from "react-router";

type UserType = {
	type: "admin" | "user";
};

const LoginPage: React.FC = () => {
	
	const { user, setUser } = useUser();

	const { login } = useAuthClientUpdate();

	const authClient = useAuthClient();

	const history = useHistory();

	useEffect(() => {
		const fetchAuthStatus = async () => {
			const isAuth = await authClient.isAuthenticated();

			if (isAuth === false) {
				login();
				refreshPage();
			}

			if (isAuth === true) {
				whoamiAuthenticated();
			}
		};
		fetchAuthStatus();
	}, [authClient, user]);

	const whoamiAuthenticated = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_CANISTER_ORIGIN}/login`,
			{
				method: "GET",
				headers: [["Authorization", toJwt(authClient.getIdentity())]],
			}
		);
		const responseText: UserType = await response.json();

		if (responseText.type === "admin") {
			setUser(true);

			history.push("/adminEAS");
		}
		if (responseText.type === "user") {
			setUser(false);
			history.push("/userEAS");
		}
	};

	const refreshPage = () => {
		window.location.reload();
	};

	return (
		<>
			<IonProgressBar type="indeterminate"></IonProgressBar>
		</>
	);
};

export default LoginPage;
