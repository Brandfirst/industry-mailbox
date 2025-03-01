
import { AlertCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AlertMessagesProps = {
  errorMessage: string | null;
  warningMessage: string | null;
};

export function AlertMessages({ errorMessage, warningMessage }: AlertMessagesProps) {
  return (
    <AnimatePresence>
      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-md flex items-center shadow-sm"
        >
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          <span className="text-red-700 font-medium">{errorMessage}</span>
        </motion.div>
      )}
      
      {warningMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 mb-4 rounded-md flex items-center shadow-sm"
        >
          <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
          <span className="text-yellow-700 font-medium">{warningMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
