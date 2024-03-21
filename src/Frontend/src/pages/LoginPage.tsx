import { IonButton } from "@ionic/react";
import { useInternetIdentity } from "ic-use-internet-identity";

export function LoginPage() {
	const { login, loginStatus } = useInternetIdentity();

	const disabled = loginStatus === "logging-in" || loginStatus === "success";
	const text = loginStatus === "logging-in" ? "Logging in..." : "Login";

	return (
		<IonButton onClick={login} disabled={disabled}>
			{text}
		</IonButton>
	);
}
