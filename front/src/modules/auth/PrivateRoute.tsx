import { Navigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";

interface PrivateRouteProps {
  component: JSX.Element;
  redirectTo?: string;
}

const PrivateRoute = ({ component, redirectTo = "/login" }: PrivateRouteProps) => {
  const isAuthenticated = useLoginStore((state) => state.getIsLogin());
  return isAuthenticated ? component : <Navigate to={redirectTo} replace />;
};

export default PrivateRoute;
