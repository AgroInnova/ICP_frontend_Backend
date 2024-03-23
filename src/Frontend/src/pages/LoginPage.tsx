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
		console.log(authClient.getIdentity().getPrincipal().toString());

		try {
			const response = await fetch(
				`${import.meta.env.VITE_CANISTER_ORIGIN}/login`,
				{
					method: "POST",
					headers: [
						["Authorization", toJwt(authClient.getIdentity())],
						["Content-Type", "application/json"],
					],
					body: JSON.stringify({
						principal: authClient
							.getIdentity()
							.getPrincipal()
							.toString(),
					}),
				}
			);
			const responseText: UserType = await response.json();

			if (responseText.type === "admin") {
				setUser(true);
				console.log(responseText.type);

				history.push("/adminEAS");
			}
			if (responseText.type === "user") {
				setUser(false);
				console.log(responseText.type);
				history.push("/userEAS");
			}
		} catch (error) {
			console.error("An error occurred:", error);
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
