
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Check if this is the generic /dashboard route and redirect if needed
    if (!loading && location.pathname === "/dashboard" && user) {
      const correctDashboard = `/dashboard/${user.role}`;
      console.log(`Redirecting from generic dashboard to: ${correctDashboard}`);
      navigate(correctDashboard, { replace: true });
    }
  }, [location.pathname, navigate, user, loading]);

  const handleNavigateHome = () => {
    navigate("/", { replace: true });
  };

  const handleNavigateDashboard = () => {
    if (user) {
      navigate(`/dashboard/${user.role}`, { replace: true });
    } else {
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        
        {location.pathname === "/dashboard" && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md text-amber-700">
            <p>Looking for your dashboard?</p>
            {loading ? (
              <p className="text-sm mt-2">Checking authentication...</p>
            ) : isAuthenticated ? (
              <p className="text-sm mt-2">Click below to go to your specific dashboard.</p>
            ) : (
              <p className="text-sm mt-2">Please log in to access your dashboard.</p>
            )}
          </div>
        )}
        
        <div className="flex flex-col space-y-3">
          <Button onClick={handleNavigateHome} variant="outline">
            Return to Home
          </Button>
          
          <Button 
            onClick={handleNavigateDashboard} 
            className="bg-[#9b87f5] text-white hover:bg-[#7E69AB]"
          >
            {isAuthenticated ? "Go to Dashboard" : "Log In"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
