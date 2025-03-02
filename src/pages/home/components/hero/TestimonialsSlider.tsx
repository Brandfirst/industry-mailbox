
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar: string;
}

interface TestimonialsSliderProps {
  testimonials: Testimonial[];
}

const TestimonialsSlider = ({ testimonials }: TestimonialsSliderProps) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-medium text-white mb-4 text-left">
        Profesjonelle bruker Nyhetsbrev Hub for å oppnå mer, raskere.
      </h3>
      
      <div className="testimonial-slider w-full overflow-hidden">
        <div className="transition-all duration-500 flex"
          style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}
        >
          {testimonials.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <div className="py-3 border-l-2 border-[#FF5722]/50 pl-4">
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-[#FF5722]" fill="currentColor" />
                  ))}
                </div>
                <p className="testimonial-text">"{item.quote}"</p>
                <div className="flex items-center">
                  <div className="testimonial-avatar">
                    <img src={item.avatar} alt={item.author} className="w-full h-full object-cover" />
                  </div>
                  <div className="testimonial-info">
                    <p className="testimonial-name">{item.author}</p>
                    <p className="testimonial-company">{item.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between mt-3">
        <button 
          onClick={prevTestimonial}
          className="bg-transparent border border-[#FF5722]/30 rounded-full p-1 hover:bg-[#FF5722]/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-white" />
        </button>
        <button 
          onClick={nextTestimonial}
          className="bg-transparent border border-[#FF5722]/30 rounded-full p-1 hover:bg-[#FF5722]/10 transition-colors"
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialsSlider;
