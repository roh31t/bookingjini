import apiService from './api-service.js';
import enhancedImageService from './enhanced-image-service.js';
import dualPreviewService from './dual-preview-service.js';
import imageUploader from './image-uploader.js';

class ContentGenerator {
  constructor() {
    this.userUploadedImage = null;
  }

  initialize() {
    imageUploader.initialize('imageUploader', (imageData) => {
      this.userUploadedImage = imageData;
      if (imageData) {
        const hotelName = document.getElementById('hotelName').value || 'Your Hotel';
        const location = document.getElementById('location').value || 'Beautiful Location';
        dualPreviewService.updateSocialPreview(hotelName, null, null, imageData);
        dualPreviewService.updateDesignPreview(hotelName, location, imageData);
      }
    });
  }

  async generateContent(hotelName, location, uniqueFeatures, offers, tone, targetAudience) {
    try {
      const prompt = `Act as a professional social media marketer for the hospitality industry.
          Create BRIEF social media content for a hotel with these details:
          - Hotel Name: ${hotelName}
          - Location: ${location}
          - Unique Features: ${uniqueFeatures}
          - Seasonal Offers/Events: ${offers}
          - Desired Tone: ${tone}
          - Target Audience: ${targetAudience}
          
          Generate:
          1. A short Instagram caption (60-80 words)
          2. 5-8 relevant hashtags
          3. A brief layout suggestion with color theme (2-3 sentences)
          4. A very short marketing blurb for reels or stories (20-30 words)
          
          Format your response as:
          INSTAGRAM CAPTION:
          [caption text here]
          
          HASHTAGS:
          [hashtags here]
          
          LAYOUT SUGGESTION:
          [layout suggestion here]
          
          MARKETING BLURB:
          [marketing blurb here]`;

      const response = await apiService.generateContent(prompt);
      
      const sections = this.extractContentSections(response);
      if (!response) {
        return this.generateSampleContent(hotelName, location);
      }
      
      // Generate AI image
      const imagePrompt = `Professional marketing photograph of ${hotelName} in ${location}. 
        Key features: ${uniqueFeatures}. Target audience: ${targetAudience}. Tone: ${tone}.
        Professional photography with perfect lighting, sharp details, and vibrant colors.`;
      
      const image = await enhancedImageService.generatePreviewImage(hotelName, location, uniqueFeatures, tone, targetAudience);
      return sections;
    } catch (error) {
      console.error('Error in AI content generation:', error);
      return this.generateSampleContent(hotelName, location);
    }
  }

  generateSampleContent(hotelName, location) {
    return {
      instagram: `Experience paradise at ${hotelName} in beautiful ${location}. Where every sunrise brings new memories and every sunset tells a story. Book your escape today!`,
      hashtags: `#${hotelName.replace(/\s+/g, '')} #${location.replace(/\s+/g, '')} #${location.replace(/\s+/g, '')} #${uniqueFeatures.replace(/\s+/g, '')}`,
      layout: `Color Theme: Ocean Blues and Sunset Orange\n\nLayout: Main image of hotel exterior or signature view, overlay text in elegant font (top right), hotel logo (bottom left). Split-screen for second slide showing amenities.`,
      blurb: `Your dream getaway awaits at ${hotelName}! Nestled in the heart of ${location}, we're ready to make your vacation unforgettable. Tap the link in bio to book now and enjoy our special seasonal rates!`
    };
  }

  extractContentSections(text) {
    try {
      const parsed = typeof text === 'string' ? JSON.parse(text) : text;
      return {
        instagram: parsed.instagram || parsed.caption || '',
        hashtags: parsed.hashtags || '',
        layout: parsed.layout || '',
        blurb: parsed.blurb || ''
      };
    } catch (e) {
      const instagram = this.extractSection(text, ['instagram caption:', 'caption:', 'instagram:', 'caption for instagram']);
      const hashtags = this.extractSection(text, ['hashtags:', 'hashtags', 'relevant hashtags']);
      const layout = this.extractSection(text, ['layout suggestion:', 'layout:', 'design suggestion:', 'visual design:']);
      const blurb = this.extractSection(text, ['marketing blurb:', 'blurb:', 'for reels:', 'stories blurb:']);
      
      return {
        instagram: instagram || 'Instagram caption not found in the response.',
        hashtags: hashtags || 'Hashtags not found in the response.',
        layout: layout || 'Layout suggestion not found in the response.',
        blurb: blurb || 'Marketing blurb not found in the response.'
      };
    }
  }

  extractSection(text, keywords) {
    const lines = text.split('\n');
    let capturing = false;
    let result = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      
      const isHeader = keywords.some(keyword => line.includes(keyword.toLowerCase()));
      
      if (isHeader) {
        capturing = true;
        continue;
      }
      
      if (capturing && lines[i].trim()) {
        result.push(lines[i]);
      }
    }
    
    return result.join('\n').trim();
  }

  hasUserUploadedImage() {
    return !!this.userUploadedImage;
  }

  getUserUploadedImage() {
    return this.userUploadedImage;
  }

  resetUserUploadedImage() {
    this.userUploadedImage = null;
  }
}

export default new ContentGenerator();