
import { useState } from "react";
import { Award, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEditMode } from "@/contexts/EditModeContext";
import EditableText from "@/components/EditableText";

const TestimonialsSection = () => {
  const { isEditMode } = useEditMode();
  const [sectionTitle, setSectionTitle] = useState("Hva våre kunder sier");
  const [sectionDescription, setSectionDescription] = useState(
    "Hør fra markedsførere og byråer som bruker NewsletterHub hver dag for å forbedre sine nyhetsbrev."
  );
  
  // Testimonials data
  const [testimonials, setTestimonials] = useState([
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
  ]);

  const handleTestimonialUpdate = (index: number, field: 'text' | 'author' | 'company', value: string) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index][field] = value;
    setTestimonials(updatedTestimonials);
  };

  const [activeIndex, setActiveIndex] = useState(0);

  // Simplified testimonial navigation without embla carousel
  const goToTestimonial = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#FF5722]/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-[#FF8A50] border-[#FF5722]/30 bg-[#FF5722]/5 px-3 py-1">
            <Award className="w-4 h-4 mr-1" /> Brukervurderinger
          </Badge>
          <EditableText 
            text={sectionTitle}
            onSave={setSectionTitle}
            className="text-3xl md:text-4xl font-bold mb-4 text-white"
            as="h2"
          />
          <EditableText 
            text={sectionDescription}
            onSave={setSectionDescription}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
            as="p"
          />
        </div>
        
        <div className="carousel-container">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(activeIndex, activeIndex + 3).map((testimonial, index) => (
              <div key={index} className="testimonial-card shine-effect bg-black/40 p-6 rounded-lg border border-[#FF5722]/20">
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`} fill={i < testimonial.rating ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <EditableText 
                  text={testimonial.text}
                  onSave={(newText) => handleTestimonialUpdate(index + activeIndex, 'text', newText)}
                  className="text-white mb-4"
                  as="p"
                />
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#FF5722]/10 flex items-center justify-center mr-3">
                    {testimonial.initial}
                  </div>
                  <div>
                    <EditableText 
                      text={testimonial.author}
                      onSave={(newText) => handleTestimonialUpdate(index + activeIndex, 'author', newText)}
                      className="text-white font-medium"
                      as="div"
                    />
                    <EditableText 
                      text={testimonial.company}
                      onSave={(newText) => handleTestimonialUpdate(index + activeIndex, 'company', newText)}
                      className="text-gray-400 text-sm"
                      as="div"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination dots */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full ${activeIndex === index ? 'bg-[#FF5722]' : 'bg-gray-600'}`}
                onClick={() => goToTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
