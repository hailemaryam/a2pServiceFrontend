import Keycloak from "keycloak-js";

export const keycloak = new Keycloak({
  url: "https://keycloak.fastsms.dev",
  realm: "a2p-realm",
  clientId: "a2p-ui-client",
});

export const keycloakInitOptions = {
  onLoad: "check-sso" as const,
  flow: "standard" as const,
  pkceMethod: "S256" as const,
  checkLoginIframe: false,
  checkLoginIframeInterval: 30,
  enableLogging: true,
};

export const ensureKeycloakToken = async () => {
  // Makes sure there is a valid token at least 30 seconds ahead of expiry.
  await keycloak.updateToken(30);
  return keycloak.token;
};



