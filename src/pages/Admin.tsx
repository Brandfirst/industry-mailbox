
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRedirect = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate("/admin/dashboard");
  }, [navigate]);
  
  return null;
};

export default AdminRedirect;
