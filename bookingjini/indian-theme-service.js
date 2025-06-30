import { config } from './config.js';

class IndianThemeService {
  constructor() {
    this.defaultThemes = {
      luxury: "opulent palace-inspired design with gold accents and rich textures",
      beach: "coastal vibes with turquoise waters and palm trees, reminiscent of Goa beaches",
      urban: "modern metropolitan atmosphere with skyline views like Mumbai or Delhi",
      mountain: "serene Himalayan retreat with mountain views and peaceful ambiance",
      budget: "vibrant and colorful clean spaces with traditional Indian design elements"
    };
  }

  generateImagePrompt(hotelName, location, features, tone, audience) {
    const toneDescription = this.defaultThemes[tone] || this.defaultThemes.luxury;
    const audienceMap = {
      families: "families with children enjoying amenities",
      couples: "romantic couples relaxing in luxurious settings",
      business: "professional business travelers in elegant surroundings",
      solo: "solo travelers exploring comfortable spaces",
      luxury: "discerning guests experiencing premium services"
    };
    
    const audienceDesc = audienceMap[audience] || audienceMap.families;
    
    return `A professional marketing photograph of ${hotelName} in ${location}, India. 
    The image shows ${toneDescription}. 
    Key features visible: ${features}. 
    The scene depicts ${audienceDesc}.
    Professional photography with perfect lighting, sharp details, and vibrant colors.
    Styled like a premium hotel advertisement for Instagram.`;
  }
}

export default new IndianThemeService();