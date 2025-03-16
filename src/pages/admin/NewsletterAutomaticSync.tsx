
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScheduledSyncSettings } from "@/components/newsletter-sync/ScheduledSyncSettings";
import { useAuth } from "@/contexts/auth";
import { useNewsletterSync } from "@/components/newsletter-sync/useNewsletterSync";

export default function NewsletterAutomaticSync() {
  const { user } = useAuth();
  const { selectedAccount } = useNewsletterSync(user?.id);

  return (
    <div className="space-y-6">
      <Card className="shadow-md bg-white">
        <CardHeader className="bg-white">
          <CardTitle className="text-xl">Newsletter Automatic Sync</CardTitle>
          <CardDescription>
            Configure automatic sync schedules for your connected email accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <ScheduledSyncSettings selectedAccount={selectedAccount} />
        </CardContent>
      </Card>
    </div>
  );
}
