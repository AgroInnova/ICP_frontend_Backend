import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import LoginPage from "./pages/LoginPage";
import { AuthClientProvider } from "./AuthClientProvider";
import Logout from "./pages/Logout";

import { DAppProvider, Config, ScrollSepoliaTestnet } from "@usedapp/core";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import AdminEAS from "./pages/adminEAS";
import UserEAS from "./pages/userEAS";
import AttestationSampleCreation from "./pages/attestationSampleCreation";

const NodeURL = ScrollSepoliaTestnet.rpcUrl as string;

const config: Config = {
	readOnlyChainId: ScrollSepoliaTestnet.chainId,
	readOnlyUrls: {
		[ScrollSepoliaTestnet.chainId]: NodeURL,
	},
};

const client = new ApolloClient({
	uri: "https://scroll-sepolia.easscan.org/graphql",
	cache: new InMemoryCache(),
});

setupIonicReact();

const App: React.FC = () => {
	return (
		<ApolloProvider client={client}>
			<DAppProvider config={config}>
				<AuthClientProvider>
					<IonApp>
						<IonReactRouter>
							<IonRouterOutlet>
								<Route exact path="/login">
									<LoginPage />
								</Route>
								<Route exact path="/home">
									<Home />
								</Route>
								<Route exact path="/">
									<Redirect to="/login" />
								</Route>
								<Route exact path="/adminEAS">
									<AdminEAS />
								</Route>

								<Route exact path="/userEAS">
									<UserEAS />
								</Route>

								<Route exact path="/logout">
									<Logout />
								</Route>

								<Route exact path="/testAttestations">
									<AttestationSampleCreation />
								</Route>
							</IonRouterOutlet>
						</IonReactRouter>
					</IonApp>
				</AuthClientProvider>
			</DAppProvider>
		</ApolloProvider>
	);
};

export default App;
