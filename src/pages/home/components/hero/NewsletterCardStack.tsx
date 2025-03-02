
import { Newsletter } from "@/lib/supabase/types";
import { motion } from "framer-motion";
import { useState } from "react";
import NewsletterPreview from "@/components/search/NewsletterPreview";

interface NewsletterCardStackProps {
  newsletters: Newsletter[];
  loading: boolean;
  handleNewsletterClick: (newsletter: Newsletter) => void;
}

const NewsletterCardStack = ({ 
  newsletters, 
  loading, 
  handleNewsletterClick 
}: NewsletterCardStackProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Card swipe functionality
  const swipeCard = (direction: number) => {
    if (newsletters.length === 0) return;
    
    // Next card becomes visible
    setCurrentIndex((prevIndex) => 
      direction > 0 
        ? (prevIndex + 1) % newsletters.length 
        : (prevIndex - 1 + newsletters.length) % newsletters.length
    );
  };
  
  if (loading) {
    return (
      <div className="w-full flex justify-center">
        <div className="bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden h-[500px] animate-pulse w-full max-w-sm">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (newsletters.length === 0) {
    return (
      <div className="col-span-3 text-center py-10">
        <p className="text-gray-400">No newsletters found. Try selecting a different category.</p>
      </div>
    );
  }
  
  return (
    <div className="relative w-full flex justify-center h-[500px]">
      {newsletters.map((newsletter, index) => {
        // Calculate if this card should be visible based on index
        const isCurrentCard = index === currentIndex;
        const isPreviousCard = index === (currentIndex - 1 + newsletters.length) % newsletters.length;
        const isNextCard = index === (currentIndex + 1) % newsletters.length;
        
        // Only render current card and adjacent cards for performance
        if (!isCurrentCard && !isPreviousCard && !isNextCard && newsletters.length > 3) {
          return null;
        }
        
        // Determine positioning and styling
        const zIndex = isCurrentCard ? 30 : (isPreviousCard ? 20 : 10);
        
        // Position adjustments based on card status
        const xOffset = isCurrentCard 
          ? 0 
          : (isPreviousCard ? -60 : 60); // Move previous card left, next card right
        
        const yOffset = isCurrentCard ? 0 : 10;
        
        // Rotation and scaling
        const rotation = isCurrentCard 
          ? 0 
          : (isPreviousCard ? -6 : 6); // Tilt previous card left, next card right
        
        const scale = isCurrentCard ? 1 : 0.92;
        const opacity = isCurrentCard ? 1 : 0.7;
        
        return (
          <motion.div
            key={newsletter.id}
            className="absolute w-full max-w-sm h-[500px] bg-black/40 backdrop-blur-sm border border-[#FF5722]/20 rounded-xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ 
              scale,
              opacity,
              x: xOffset,
              y: yOffset,
              zIndex,
              rotateZ: rotation
            }}
            transition={{ duration: 0.3 }}
            drag={isCurrentCard ? "x" : false}
            dragConstraints={{ left: -100, right: 100 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (Math.abs(offset.x) > 100 || Math.abs(velocity.x) > 500) {
                swipeCard(offset.x > 0 ? 1 : -1);
              }
            }}
            onClick={() => isCurrentCard && handleNewsletterClick(newsletter)}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center p-3 border-b border-gray-700">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-2 flex-shrink-0">
                  {newsletter.sender && (
                    <span className="text-sm font-semibold text-gray-700">
                      {newsletter.sender.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium text-sm truncate text-white">
                    {newsletter.sender || 'Unknown Sender'}
                  </span>
                  <span className="text-gray-300 text-xs">
                    {new Date(newsletter.published_at || '').toLocaleDateString('no-NO')}
                  </span>
                </div>
                {newsletter.categories?.name && (
                  <div 
                    className="px-2 py-1 text-xs rounded-full font-medium ml-auto"
                    style={{ 
                      backgroundColor: newsletter.categories?.color ? `${newsletter.categories.color}20` : '#8B5CF620',
                      color: newsletter.categories?.color || '#8B5CF6' 
                    }}
                  >
                    {newsletter.categories.name}
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-hidden bg-white">
                <NewsletterPreview 
                  content={newsletter.content} 
                  title={newsletter.title}
                  isMobile={false}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default NewsletterCardStack;
