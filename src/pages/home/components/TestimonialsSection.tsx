
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Embla from 'embla-carousel-react';
import { cn } from "@/lib/utils";

const TestimonialsSection = () => {
  const [testimonialViewportRef, emblaApi] = Embla({ 
    loop: true, 
    align: "center",
    skipSnaps: false
  });
  const [activeIndex, setActiveIndex] = useState(0);
  
  useEffect(() => {
    if (emblaApi) {
      emblaApi.on('select', () => {
        setActiveIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  // Testimonials data
  const testimonials = [
    {
      text: "NewsletterHub har hjulpet oss å finne de beste markedsførings-ideene fra konkurrentene våre.",
      author: "Marie Johansen",
      company: "Digital Byrå AS",
      initial: "M",
      rating: 5,
    },
    {
      text: "Den beste ressursen for å holde seg oppdatert på markedsføringstrender i Norge.",
      author: "Anders Nilsen",
      company: "BrandCore Norge",
      initial: "A",
      rating: 5,
    },
    {
      text: "Helt uunnværlig for strategiarbeidet vårt. Vi sparer så mye tid på research!",
      author: "Sofie Berg",
      company: "Mediekonsulenterne",
      initial: "S",
      rating: 4,
    },
    {
      text: "Fantastisk verktøy for å analysere nyhetsbrev fra hele markedet samlet på ett sted.",
      author: "Kristian Hansen",
      company: "MarkedsInsikt AS",
      initial: "K",
      rating: 5,
    },
    {
      text: "Har økt konverteringsraten på nyhetsbrevene våre med 35% takket være inspirasjonen fra andre bransjer.",
      author: "Nina Larsen",
      company: "E-handel Norge",
      initial: "N",
      rating: 5,
    },
  ];

  // Navigate slider with keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') emblaApi?.scrollPrev();
      if (e.key === 'ArrowRight') emblaApi?.scrollNext();
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [emblaApi]);

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#FF5722]/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-[#FF8A50] border-[#FF5722]/30 bg-[#FF5722]/5 px-3 py-1">
            Kundehistorier
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hva våre kunder sier</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hør fra markedsførere og byråer som bruker NewsletterHub hver dag for å forbedre sine nyhetsbrev.
          </p>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          {/* Navigation buttons */}
          <button 
            onClick={() => emblaApi?.scrollPrev()} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-[#FF5722]/10 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          
          <button 
            onClick={() => emblaApi?.scrollNext()} 
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-[#FF5722]/10 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          
          {/* Testimonial carousel */}
          <div className="overflow-hidden rounded-xl" ref={testimonialViewportRef}>
            <div className="flex">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex-shrink-0 w-full md:w-4/5 px-4">
                  <div className={cn(
                    "testimonial-card glass-effect",
                    activeIndex === index ? "scale-100 opacity-100" : "scale-95 opacity-70"
                  )}>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 mr-1 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} 
                        />
                      ))}
                    </div>
                    <p className="testimonial-text">{testimonial.text}</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        {testimonial.initial}
                      </div>
                      <div className="testimonial-info">
                        <div className="testimonial-name">{testimonial.author}</div>
                        <div className="testimonial-company">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Modern pagination dots */}
          <div className="pagination-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`pagination-dot ${activeIndex === index ? 'active' : ''}`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
