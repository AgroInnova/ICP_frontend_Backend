import { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { IonProgressBar } from "@ionic/react";

const AuthClientContext = createContext<AuthClient | null>(null);

export const useAuthClient = () => {
	const context = useContext(AuthClientContext);
	if (context === null) {
		throw new Error(
			"useAuthClient must be used within a AuthClientProvider"
		);
	}
	return context;
};

const AuthClientUpdateContext = createContext<{
	logout: () => Promise<void>;
	login: () => Promise<void>;
} | null>(null);

export const useAuthClientUpdate = () => {
	const context = useContext(AuthClientUpdateContext);
	if (context === null) {
		throw new Error(
			"useAuthClientUpdate must be used within a AuthClientProvider"
		);
	}
	return context;
};

const UserContext = createContext<{
	user: boolean | null;
	setUser: React.Dispatch<React.SetStateAction<boolean | null>>;
} | null>(null);

export const useUser = () => {
	const context = useContext(UserContext);
	if (context === null) {
		throw new Error("useUser must be used within a AuthClientProvider");
	}
	return context;
};

export const AuthClientProvider: React.FC<React.PropsWithChildren<{}>> = ({
	children,
}) => {
	const [authClient, setAuthClient] = useState<AuthClient | null>(null);

	const [user, setUser] = useState<boolean | null>(null);

	const logout = async () => {
		if (authClient) {
			await authClient.logout();
			const newClient = await AuthClient.create();
			setAuthClient(newClient);
		}
	};
	const login = async () => {
		const client = await AuthClient.create();
		const isAuthenticated = await client.isAuthenticated();
		if (!isAuthenticated) {
			await new Promise((resolve, reject) => {
				const width = 500;
				const height = 1000;
				const y =
					(window.top?.outerHeight ?? 0) / 2 +
					(window.top?.screenY ?? 0) -
					height / 2;
				const x =
					(window.top?.outerWidth ?? 0) / 2 +
					(window.top?.screenX ?? 0) -
					width / 2;
				client.login({
					identityProvider: import.meta.env.VITE_IDENTITY_PROVIDER,
					onSuccess: resolve as () => void,
					onError: reject,
					windowOpenerFeatures: `width=${width},height=${height},top=${y},left=${x}`,
				});
			});
		}
		setAuthClient(client);
	};
	useEffect(() => {
		login();
	}, []);

	if (!authClient) {
		return <IonProgressBar type="indeterminate"></IonProgressBar>;
	}

	return (
		<AuthClientContext.Provider value={authClient}>
			<AuthClientUpdateContext.Provider value={{ logout, login }}>
				<UserContext.Provider value={{ user, setUser }}>
					{children}
				</UserContext.Provider>
			</AuthClientUpdateContext.Provider>
		</AuthClientContext.Provider>
	);
};
