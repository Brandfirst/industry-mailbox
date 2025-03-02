
import { motion } from "framer-motion";

const SocialProof = () => {
  // Profile images for the social proof section - using the new uploaded images
  const profiles = [
    "/lovable-uploads/3bd3a78a-ed4c-4c2f-9661-a247d626f5b6.png",
    "/lovable-uploads/a86b4a49-530b-4bea-902d-d79c254737f0.png",
    "/lovable-uploads/0baed1aa-d0fc-4d00-8491-9b413d90c9f1.png",
    "/lovable-uploads/4d2e5613-2abd-49c9-ba8b-59f049e54dce.png",
    "/lovable-uploads/479f4b5c-3e23-46bb-ae99-d17e2ad134bd.png"
  ];

  return (
    <div className="flex items-center glass-effect px-4 py-2 rounded-full shadow-glass">
      {/* Profile pictures */}
      <div className="flex -space-x-2 mr-3">
        {profiles.map((profile, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="relative z-10"
            style={{ zIndex: 10 - index }}
          >
            <img
              src={profile}
              alt={`User ${index + 1}`}
              className="w-6 h-6 rounded-full border border-black/40 object-cover"
            />
          </motion.div>
        ))}
      </div>
      
      {/* Text */}
      <p className="text-sm font-medium text-white">
        500+ markedsførere bruker verktøyet akkurat nå
      </p>
    </div>
  );
};

export default SocialProof;
