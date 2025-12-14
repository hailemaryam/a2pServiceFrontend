import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloak, keycloakInitOptions } from "./api/keycloak";
import { Provider } from "react-redux";
import store from "./store";
import { buildAuthPayloadFromKeycloak, clearAuth, setAuthFromKeycloak } from "./redux/auth/authSlice";

createRoot(document.getElementById("root")!).render(
  <ReactKeycloakProvider
    authClient={keycloak}
    initOptions={keycloakInitOptions}
    onEvent={(event: any) => {
      if (event === "onAuthSuccess" || event === "onReady" || event === "onTokenExpired" || event === "onAuthRefreshSuccess") {
        store.dispatch(setAuthFromKeycloak(buildAuthPayloadFromKeycloak()));
      }
      if (event === "onAuthLogout" || event === "onAuthError") {
        store.dispatch(clearAuth());
        // Clear tenant registration flag on logout
        sessionStorage.clear();
      }
      // Removed auto-login redirect - let the app handle routing based on auth state
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
