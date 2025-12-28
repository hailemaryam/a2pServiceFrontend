import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";


export default function RoleBasedRedirect() {
  const { isAuthenticated, isSysAdmin, isTenantRole } = useAuth();


  useEffect(() => {
   
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

 
  if (isSysAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (isTenantRole) {
    
    return <Navigate to="/" replace />;
  }

 
  return <Navigate to="/landing" replace />;
}
