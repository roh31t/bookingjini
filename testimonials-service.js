import { config } from './config.js';

class TestimonialsService {
  constructor() {
    // Override config testimonials with new names
    this.testimonialData = [
      {
        quote: "BookingJini increased our Instagram engagement by 230% in just two months. The AI-generated content perfectly captures our hotel's essence!",
        name: "Sumit Kumar",
        role: "Owner, Seaside Retreat Goa",
        image: "https://randomuser.me/api/portraits/men/45.jpg",
        stars: 5
      },
      {
        quote: "As a boutique hotel in Jaipur, we couldn't afford a marketing team. BookingJini gives us professional content at a fraction of the cost.",
        name: "Rohit Verma",
        role: "Manager, Heritage Palace Inn",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        stars: 5
      },
      {
        quote: "The AI understands our brand voice perfectly. Our posts look like they were crafted by a professional social media team from Mumbai!",
        name: "Sahasara Trimula",
        role: "Marketing, Lakeside Resort & Spa",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        stars: 5
      }
    ];
  }

  updateTestimonials() {
    const testimonialContainer = document.querySelector('.testimonial-carousel');
    if (!testimonialContainer) return;
    
    testimonialContainer.innerHTML = '';
    
    this.testimonialData.forEach(testimonial => {
      const testimonialEl = document.createElement('div');
      testimonialEl.className = 'testimonial';
      
      const stars = '★'.repeat(testimonial.stars) + '☆'.repeat(5 - testimonial.stars);
      
      testimonialEl.innerHTML = `
        <div class="quote">"${testimonial.quote}"</div>
        <div class="testimonial-author">
            <img src="${testimonial.image}" alt="${testimonial.name}" class="author-image">
            <div class="author-info">
                <div class="author-name">${testimonial.name}</div>
                <div class="author-role">${testimonial.role}</div>
                <div class="stars">${stars}</div>
            </div>
        </div>
      `;
      
      testimonialContainer.appendChild(testimonialEl);
    });
    
    // Reset dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === 0);
    });
  }
}

export default new TestimonialsService();