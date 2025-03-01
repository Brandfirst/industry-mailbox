
import React from 'react';

interface AdminHeaderProps {
  activeTab: string;
}

const AdminHeader = ({ activeTab }: AdminHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold text-foreground">
        {activeTab === "dashboard" && "Dashboard"}
        {activeTab === "newsletters" && "Newsletters"}
        {activeTab === "users" && "Users"}
        {activeTab === "categories" && "Categories"}
        {activeTab === "settings" && "Settings"}
      </h1>
      <p className="text-muted-foreground">
        {activeTab === "dashboard" && "Overview of your NewsletterHub instance"}
        {activeTab === "newsletters" && "Manage all archived newsletters"}
        {activeTab === "users" && "View and manage user accounts"}
        {activeTab === "categories" && "Configure industry categories"}
        {activeTab === "settings" && "Admin account and system settings"}
      </p>
    </div>
  );
};

export default AdminHeader;
