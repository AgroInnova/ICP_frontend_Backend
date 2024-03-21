import React, { useState, useEffect } from "react";
import { Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { toJwt } from "azle/http_client"
import { IonButton } from "@ionic/react";
import { CapacitorCookiesPluginWeb } from "@capacitor/core/types/core-plugins";

const AzleApp: React.FC = () => {
	const [authClient, setAuthClient] = useState<AuthClient>();
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

	const [identity, setIdentity] = useState<Identity>();
	const [whoami, setWhoami] = useState<string>("");

	useEffect(() => {
		(async () => {
			const authClient = await AuthClient.create();
			setAuthClient(authClient);
			async () => {
				const isAuthenticated = await authClient.isAuthenticated();
				setIsAuthenticated(isAuthenticated);
			};
		})();
	}, []);

	// useEffect(() => {
	// 	if (authClient) {
	// 		(async () => {
	// 			const isAuthenticated = await authClient.isAuthenticated();
	// 			setIsAuthenticated(isAuthenticated);
	// 		})();
	// 	}
	// }, [authClient]);

	const handleIsAuthenticated = (authClient: AuthClient) => {
		setIdentity(authClient.getIdentity());
	};

	const handleIsNotAuthenticated = async (authClient: AuthClient) => {
		await new Promise((resolve, reject) => {
			authClient.login({
				identityProvider: import.meta.env.VITE_IDENTITY_PROVIDER,
				onSuccess: resolve as () => void,
				onError: reject,
				windowOpenerFeatures: `width=500,height=500`,
			});
		});

		setIdentity(authClient.getIdentity());
	};

	const whoamiUnauthenticated = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_CANISTER_ORIGIN}/whoami`
		);
		const responseText = await response.text();

		setWhoami(responseText);
	};

	const whoamiAuthenticated = async () => {
		const response = await fetch(
			`${import.meta.env.VITE_CANISTER_ORIGIN}/whoami`,
			{
				method: "GET",
				headers: [["Authorization", toJwt(identity)]],
			}
		);
		const responseText = await response.text();

		setWhoami(responseText);
	};

	return (
		<div>
			<h1>Internet Identity</h1>
			<h2>
				Whoami principal:
				<span id="whoamiPrincipal">{whoami}</span>
			</h2>

			<IonButton onClick={whoamiUnauthenticated}>
				{" "}
				Whoami Unathenticated
			</IonButton>
			<IonButton
				onClick={whoamiAuthenticated}
				disabled={identity === null}
			>
				Whoami Authenticated
			</IonButton>

			<IonButton>Logout</IonButton>
		</div>
	);
};

export default AzleApp;
