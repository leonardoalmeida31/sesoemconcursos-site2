import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

function ProtectedRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;


