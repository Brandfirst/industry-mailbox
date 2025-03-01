
import { useEffect, useState } from "react";
import { Award, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Embla from 'embla-carousel-react';

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

  return (
    <section className="py-20 bg-gradient-to-b from-black to-blue-950/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-blue-400 border-blue-500/30 bg-blue-500/5 px-3 py-1">
            <Award className="w-4 h-4 mr-1" /> Brukervurderinger
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Hva våre kunder sier</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hør fra markedsførere og byråer som bruker NewsletterHub hver dag for å forbedre sine nyhetsbrev.
          </p>
        </div>
        
        <div className="carousel-container">
          <div className="embla" ref={testimonialViewportRef}>
            <div className="embla__container">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="embla__slide px-2 md:px-4">
                  <div className="testimonial-card shine-effect">
                    <div className="mb-4 flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
                      ))}
                    </div>
                    <p className="testimonial-text mb-4">{testimonial.text}</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar bg-blue-500/10">
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
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-blue-500' : 'bg-gray-600'}`}
                onClick={() => emblaApi?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
