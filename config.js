export const config = {
    // API Configuration
    geminiApiKey: "",//
    
    // Default text lengths and constraints
    maxInstagramLength: 2200,  // Instagram caption character limit
    maxHashtags: 30,           // Recommended max hashtags for Instagram
    
    // Color themes
    colorThemes: {
        luxury: {
            primary: "#C9A050",  // Gold
            secondary: "#2C3E50", // Dark blue
            accent: "#E5E5E5"     // Light gray
        },
        beach: {
            primary: "#0095B6",   // Ocean blue
            secondary: "#FF9E43", // Sunset orange
            accent: "#FFFFFF"     // White
        },
        urban: {
            primary: "#2D3436",   // Charcoal
            secondary: "#FD746C", // Coral
            accent: "#F2F2F2"     // Off-white
        },
        mountain: {
            primary: "#2E5E31",   // Forest green
            secondary: "#8D6E63", // Brown
            accent: "#F9F9F9"     // Snow white
        },
        budget: {
            primary: "#00C853",   // Vibrant green
            secondary: "#FFC107", // Amber
            accent: "#EEEEEE"     // Light gray
        }
    },
    
    // Default samples for each hotel type
    samples: {
        luxury: {
            caption: "Indulge in unparalleled luxury where every detail has been meticulously crafted for your pleasure. Our suites offer breathtaking views and world-class amenities that redefine opulence.",
            hashtags: "#LuxuryTravel #ExclusiveStay #PremiumExperience #VIPTreatment #LuxuryLifestyle",
            layout: "Gold and deep blue theme with serif fonts. Hero image: aerial view of property at golden hour. Secondary images: spa treatment room, gourmet dining experience, and suite interior with city/ocean view.",
            blurb: "Experience the epitome of luxury in our award-winning suites. Where exceptional service meets unparalleled comfort. Limited availability - book now."
        },
        budget: {
            caption: "Smart travelers choose smart stays! Get all the essentials without breaking the bank. Our centrally located rooms provide comfort, convenience, and incredible value.",
            hashtags: "#BudgetTravel #SmartStay #TravelHack #AffordableLuxury #BudgetFriendly #TravelTips",
            layout: "Bright and vibrant colors with sans-serif fonts. Hero image: happy guests in common area. Secondary images: clean room interior, complimentary breakfast, and nearby attraction.",
            blurb: "Great value without compromising comfort! Book directly for our best rate guarantee and free breakfast. Use code SMART10 for an extra 10% off!"
        },
        cozy: {
            caption: "Escape to our warm and welcoming retreat, where comfort meets charm. Wrap yourself in the cozy ambiance of our thoughtfully designed spaces that feel just like home—only better.",
            hashtags: "#CozyRetreat #HomeAwayFromHome #WarmWelcome #ComfortableStay #RelaxAndUnwind #HotelLife",
            layout: "Warm amber and cream palette with soft lighting effects. Hero image: fireplace lounge with comfortable seating. Secondary images: plush bedding, reading nook with mountain/garden view, and steaming cup of coffee/tea service.",
            blurb: "Your cozy hideaway awaits. Plush beds, warm hospitality, and all the comforts of home. Book now for the perfect relaxing getaway!"
        }
    },
    
    // Indian pricing
    indianPricing: {
        free: {
            price: "₹0",
            features: [
                "5 AI generations per month",
                "Basic templates",
                "Standard response time",
            ],
            limitations: [
                "No export to Canva",
                "No advanced customization"
            ]
        },
        pro: {
            price: "₹29",
            features: [
                "100 AI generations per month",
                "All premium templates",
                "Priority generation",
                "Export to Canva",
                "Advanced customization"
            ],
            limitations: []
        },
        business: {
            price: "₹79",
            features: [
                "Unlimited AI generations",
                "All premium templates",
                "Fastest generation priority",
                "Export to all platforms",
                "White-label exports"
            ],
            limitations: []
        }
    },
    
    // Indian testimonials
    indianTestimonials: [
        {
            quote: "BookingJini increased our Instagram engagement by 230% in just two months. The AI-generated content perfectly captures our hotel's essence!",
            name: "Priya Sharma",
            role: "Owner, Seaside Retreat Goa",
            image: "https://randomuser.me/api/portraits/women/45.jpg",
            stars: 5
        },
        {
            quote: "As a boutique hotel in Jaipur, we couldn't afford a marketing team. BookingJini gives us professional content at a fraction of the cost.",
            name: "Vikram Mehta",
            role: "Manager, Heritage Palace Inn",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            stars: 5
        },
        {
            quote: "The AI understands our brand voice perfectly. Our posts look like they were crafted by a professional social media team from Mumbai!",
            name: "Anjali Patel",
            role: "Marketing, Lakeside Resort & Spa",
            image: "https://randomuser.me/api/portraits/women/68.jpg",
            stars: 5
        }
    ]
};