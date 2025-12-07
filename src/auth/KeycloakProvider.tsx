import React, { createContext, useContext, useEffect, useState } from "react";
import Keycloak, { KeycloakInstance } from "keycloak-js";

type KeycloakContextType = {
  kc?: KeycloakInstance | null;
  initialized: boolean;
  authenticated: boolean;
};

const KeycloakContext = createContext<KeycloakContextType>({ initialized: false, authenticated: false });

const keycloakConfig = {
  url: "https://keycloak.fastsms.dev/",
  realm: "a2p-realm",
  clientId: "a2p-ui-client",
};

export const KeycloakProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [kc, setKc] = useState<KeycloakInstance | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const keycloak = new Keycloak(keycloakConfig);

    keycloak
      .init({ onLoad: "check-sso", silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html" })
      .then((auth) => {
        setKc(keycloak);
        setInitialized(true);
        setAuthenticated(!!auth);
      })
      .catch((err) => {
        console.error("Keycloak init error:", err);
        setInitialized(true);
      });

    // expose for debugging
    (window as any).keycloak = keycloak;
  }, []);

  return <KeycloakContext.Provider value={{ kc, initialized, authenticated }}>{children}</KeycloakContext.Provider>;
};

export const useKeycloak = () => useContext(KeycloakContext);
