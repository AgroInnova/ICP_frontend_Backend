import React, { useState, useEffect } from "react";
import { Identity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";
import { toJwt } from "azle/http_client";
import { IonButton } from "@ionic/react";

const AzleApp: React.FC = () => {
	const [identity, setIdentity] = useState<Identity | null>(null);
	const [whoami, setWhoami] = useState<string>("");

	useEffect(() => {
		authenticate();
	}, []);

	const authenticate = async () => {
		const authClient = await AuthClient.create();

		const isAuthenticated = await authClient.isAuthenticated();

		if (isAuthenticated === true) {
			handleIsAuthenticated(authClient);
		} else {
			await handleIsNotAuthenticated(authClient);
		}
	};

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

	const logout = async () => {
		const authClient = await AuthClient.create();
		await authClient.logout();
		setIdentity(null);
	};

	return (
		<div>
			asdfasdfasdf
			<h1>Internet Identity</h1>
			<h2>
				Whoami principal:
				<span id="whoamiPrincipal">{whoami}</span>
			</h2>
			<button id="whoamiUnauthenticated" onClick={whoamiUnauthenticated}>
				Whoami Unauthenticated
			</button>
			<button
				id="whoamiAuthenticated"
				onClick={whoamiAuthenticated}
				disabled={identity === null}
			>
				Whoami Authenticated
			</button>
			<IonButton onClick={logout}>Logout</IonButton>
			<IonButton onClick={authenticate}>login</IonButton>
		</div>
	);
};

export default AzleApp;
