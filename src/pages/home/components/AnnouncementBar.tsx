
import { Bell } from "lucide-react";

// Announcement bar that appears below the navbar
const AnnouncementBar = () => {
  return (
    <div className="w-full bg-blue-900 py-2 text-center">
      <p className="text-sm flex items-center justify-center">
        <Bell className="w-4 h-4 mr-2" />
        <span>Nytt! Newsletter 2.0 er nå tilgjengelig!</span>
      </p>
    </div>
  );
};

// Export a null component to prevent rendering a second navbar
export const HomeHeader = () => null;

export default AnnouncementBar;
