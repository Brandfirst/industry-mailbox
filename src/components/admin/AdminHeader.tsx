
import React from 'react';
import { Separator } from "@/components/ui/separator";

interface AdminHeaderProps {
  activeTab: string;
}

const AdminHeader = ({ activeTab }: AdminHeaderProps) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">
        {activeTab === "dashboard" && "Dashboard"}
        {activeTab === "newsletters" && "Newsletters"}
        {activeTab === "users" && "Users"}
        {activeTab === "categories" && "Categories"}
        {activeTab === "settings" && "Settings"}
        {activeTab === "newsletter-senders" && "Newsletter Senders"}
      </h1>
      <p className="text-muted-foreground mt-1 mb-4">
        {activeTab === "dashboard" && "Overview of your NewsletterHub instance"}
        {activeTab === "newsletters" && "Manage all archived newsletters"}
        {activeTab === "users" && "View and manage user accounts"}
        {activeTab === "categories" && "Configure industry categories"}
        {activeTab === "settings" && "Admin account and system settings"}
        {activeTab === "newsletter-senders" && "Manage newsletter senders and categories"}
      </p>
      <Separator />
    </div>
  );
};

export default AdminHeader;
