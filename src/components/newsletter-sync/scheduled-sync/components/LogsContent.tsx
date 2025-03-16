
import React from "react";
import { SyncLogEntry } from "@/lib/supabase/emailAccounts/syncLogs";
import { Table, TableBody } from "@/components/ui/table";

export interface LogsContentProps {
  children?: React.ReactNode;
  syncLogs?: SyncLogEntry[];
  formatTimestamp?: (timestamp: string) => string;
}

export function LogsContent({ 
  children,
  syncLogs,
  formatTimestamp
}: LogsContentProps) {
  return (
    <div className="p-4 text-center">
      {children ? (
        children
      ) : (
        <Table>
          <TableBody>
            {syncLogs?.map((log, index) => (
              <tr key={log.id}>
                <td>{index + 1}</td>
                <td>{formatTimestamp && log.timestamp ? formatTimestamp(log.timestamp) : log.timestamp}</td>
                <td>{log.status}</td>
                <td>{log.sync_type || 'manual'}</td>
                <td>{log.message_count}</td>
                <td>{log.error_message || 'Success'}</td>
              </tr>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
