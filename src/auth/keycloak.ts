import Keycloak from 'keycloak-js';

// Instantiate Keycloak once, pointing at your realm and SPA client
export const keycloak = new Keycloak({
  url: "https://keycloak.fastsms.dev",
  realm: "a2p-realm",
  clientId: "a2p-ui-client",
});

export const initOptions = {
  onLoad: 'check-sso',                    
  flow: 'standard',                         
  pkceMethod: 'S256',                     
  checkLoginIframe: false,                 
  checkLoginIframeInterval: 30,            
  enableLogging: true,                   
};