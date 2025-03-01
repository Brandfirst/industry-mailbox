
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const UsersPage = () => {
  const [activeTab, setActiveTab] = useState("users");
  const navigate = useNavigate();

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>User management content will go here.</p>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UsersPage;
