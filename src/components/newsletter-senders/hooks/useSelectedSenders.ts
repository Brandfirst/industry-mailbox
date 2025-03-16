
import { useState } from "react";

export function useSelectedSenders(senders: { sender_email: string }[]) {
  const [selectedSenders, setSelectedSenders] = useState<string[]>([]);

  const handleToggleSelect = (senderEmail: string) => {
    setSelectedSenders(prev => 
      prev.includes(senderEmail)
        ? prev.filter(email => email !== senderEmail)
        : [...prev, senderEmail]
    );
  };

  const handleSelectAll = () => {
    if (selectedSenders.length === senders.length) {
      setSelectedSenders([]);
    } else {
      setSelectedSenders(senders.map(sender => sender.sender_email));
    }
  };

  return {
    selectedSenders,
    setSelectedSenders,
    handleToggleSelect,
    handleSelectAll
  };
}
