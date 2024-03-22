import { useEffect } from "react";
import { useAuthClient, useAuthClientUpdate } from "../AuthClientProvider";
import { toJwt } from "azle/http_client";
import { IonButton } from "@ionic/react";
import LogoutButton from "../Components/LogoutButton";
import Header from "../Components/Header";

const LoginPage: React.FC = () => {
	console.log("entro a loginpage");

	const authClient = useAuthClient();

	useEffect(() => {
		console.log("LoginPage: useEffect: authClient: ", authClient);
		const fetchAuthStatus = async () => {
			console.log(
				"LoginPage: useEffect: authClient.isAuthenticated: ",
				await authClient.isAuthenticated()
			);
		};
		fetchAuthStatus();
	}, [authClient]);

	const whoamiAuthenticated = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_CANISTER_ORIGIN}/login`,
			{
				method: "GET",
				headers: [["Authorization", toJwt(authClient.getIdentity())]],
			}
		);
		const responseText = await response.text();
		console.log(
			"LoginPage: whoamiAuthenticated: responseText: ",
			responseText
		);
	};

	return (
		<>
			<Header />
			<IonButton onClick={whoamiAuthenticated}>authbackend</IonButton>

			<LogoutButton />
		</>
	);
};

export default LoginPage;
