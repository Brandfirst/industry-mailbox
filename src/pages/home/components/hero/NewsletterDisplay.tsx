
import { Newsletter } from "@/lib/supabase/types";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NewsletterCardStack from "./NewsletterCardStack";
import TestimonialsSlider from "./TestimonialsSlider";
import SocialProof from "./SocialProof";

interface NewsletterDisplayProps {
  newsletters: Newsletter[];
  loading: boolean;
  selectedCategory: string;
  handleNewsletterClick: (newsletter: Newsletter) => void;
}

const NewsletterDisplay = ({ 
  newsletters, 
  loading, 
  selectedCategory,
  handleNewsletterClick 
}: NewsletterDisplayProps) => {
  const isMobile = useIsMobile();
  
  // Testimonials data
  const testimonials = [
    {
      quote: "Nyhetsbrev Hub er et fantastisk verktøy for markedsførere som ønsker å følge med på trender.",
      author: "Marc Andreessen",
      title: "Grunnlegger, Netscape",
      avatar: "/lovable-uploads/8e30f8f8-9e78-4332-804f-a64bfee8112a.png"
    },
    {
      quote: "Nyhetsbrev Hub er en frisk åpenbaring i markedsføringslandskapet.",
      author: "Alexis Ohanian",
      title: "Grunnlegger, Reddit",
      avatar: "/lovable-uploads/8e30f8f8-9e78-4332-804f-a64bfee8112a.png"
    },
    {
      quote: "Et uunnværlig verktøy for alle som jobber med digital markedsføring.",
      author: "Jens Nordvik",
      title: "Markedsdirektør, Norsk Bedrift",
      avatar: "/lovable-uploads/8e30f8f8-9e78-4332-804f-a64bfee8112a.png"
    }
  ];
  
  return (
    <div className="mb-8">
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCategory}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="mt-8 max-w-5xl mx-auto px-4"
        >
          <NewsletterCardStack 
            newsletters={newsletters}
            loading={loading}
            handleNewsletterClick={handleNewsletterClick}
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Social Proof Section */}
      <div className="mt-4 mb-6 flex justify-center">
        <SocialProof />
      </div>
      
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="relative px-4">
          <TestimonialsSlider testimonials={testimonials} />
        </div>
      </div>
    </div>
  );
};

export default NewsletterDisplay;
