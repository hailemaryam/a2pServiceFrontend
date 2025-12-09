import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloak, initOptions } from "./auth/keycloak";
import { Provider } from "react-redux";
import store from "./store";

createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={initOptions}
    onEvent={(event: any) => {
      if (event === "onReady" && !keycloak.authenticated) {
        keycloak.login();
      }
    }}
  >
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ThemeProvider>
      </Provider>
    </StrictMode>
  </ReactKeycloakProvider>
);
