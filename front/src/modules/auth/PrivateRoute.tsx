import { Navigate } from "react-router-dom";
import useLoginStore from "../../store/useLoginStore";

interface PrivateRouteProps {
  component: JSX.Element;
}

const PrivateRoute = ({ component }: PrivateRouteProps) => {
  const isAuthenticated = useLoginStore((state) => state.getIsLogin());
  return isAuthenticated ? component : <Navigate to="/login" />;
};

export default PrivateRoute;
