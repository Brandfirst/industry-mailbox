
import { motion } from "framer-motion";

const SocialProof = () => {
  // Profile images for the social proof section
  const profiles = [
    "/lovable-uploads/a6ebea68-fa17-4abb-a155-7a6e62e95514.png",
    "/lovable-uploads/9c18978d-5f8f-4ce3-9eab-aed71d4f66d3.png",
    "/lovable-uploads/bc6da6c1-6e77-4e9a-a2cd-554f46a925e6.png",
    "/lovable-uploads/8e30f8f8-9e78-4332-804f-a64bfee8112a.png",
    "/lovable-uploads/a6ebea68-fa17-4abb-a155-7a6e62e95514.png"
  ];

  return (
    <div className="flex items-center glass-effect px-4 py-2 rounded-full shadow-glass">
      {/* Glowing dot similar to "Nytt newsletter" */}
      <div className="relative mr-2 flex items-center">
        <span className="absolute w-2 h-2 bg-[#FF5722] rounded-full animate-pulse shadow-glow"></span>
        <span className="w-2 h-2 bg-[#FF5722] rounded-full opacity-75"></span>
      </div>
      
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
