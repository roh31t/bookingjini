import apiService from './api-service.js';
import indianThemeService from './indian-theme-service.js';
import dualPreviewService from './dual-preview-service.js';

class EnhancedImageService {
  constructor() {
    this.processingImage = false;
    this.imageQueue = [];
  }

  async generatePreviewImage(hotel, location, features, tone, audience) {
    try {
      // If already processing an image, queue this request
      if (this.processingImage) {
        this.imageQueue.push({ hotel, location, features, tone, audience });
        return null;
      }
      
      this.processingImage = true;
      this.showGeneratingMessage();
      
      // Generate a more detailed prompt for better image quality
      const imagePrompt = indianThemeService.generateImagePrompt(hotel, location, features, tone, audience);
      const enhancedPrompt = this.enhancePrompt(imagePrompt, tone);
      
      // Show that we're generating an image
      const imageDataUrl = await apiService.generateImage(enhancedPrompt);
      
      if (imageDataUrl) {
        // Update both preview panels with the new image
        dualPreviewService.updateSocialPreview(hotel, null, null, imageDataUrl);
        dualPreviewService.updateDesignPreview(hotel, location, imageDataUrl);
        
        this.processingImage = false;
        
        // Process next image in queue if any
        if (this.imageQueue.length > 0) {
          const nextImage = this.imageQueue.shift();
          this.generatePreviewImage(
            nextImage.hotel, 
            nextImage.location, 
            nextImage.features, 
            nextImage.tone, 
            nextImage.audience
          );
        }
        
        return imageDataUrl;
      } else {
        this.processingImage = false;
        this.setPlaceholderImage(hotel, location);
        return null;
      }
    } catch (error) {
      console.error('Error generating image:', error);
      this.processingImage = false;
      this.setPlaceholderImage(hotel, location);
      return null;
    }
  }

  enhancePrompt(basePrompt, tone) {
    const enhancementsByTone = {
      'luxurious': 'with cinematic lighting, high-end photography style, 8k resolution, photo-realistic rendering, dramatic lighting',
      'budget-friendly': 'with bright natural lighting, vibrant colors, appealing and clean spaces',
      'cozy': 'with warm ambient lighting, soft focus, golden hour glow, inviting atmosphere',
      'modern': 'with clean lines, minimalist aesthetic, dramatic shadows, professional architectural photography style',
      'adventurous': 'with dynamic composition, vibrant colors, action-oriented perspective'
    };
    
    const enhancement = enhancementsByTone[tone] || enhancementsByTone['luxurious'];
    
    return `${basePrompt} Rendered in 3D ${enhancement}. Photorealistic quality, not cartoonish.`;
  }

  showGeneratingMessage() {
    const previewImage = document.querySelector('.insta-image');
    const designImage = document.querySelector('.design-image');
    
    if (previewImage) {
      previewImage.innerHTML = '<div class="placeholder-text">Generating stunning image...</div>';
    }
    
    if (designImage) {
      const overlay = designImage.querySelector('.design-overlay');
      if (overlay) {
        const generatingMsg = document.createElement('div');
        generatingMsg.textContent = 'Generating image...';
        generatingMsg.style.fontSize = '0.8rem';
        generatingMsg.style.marginTop = '10px';
        overlay.appendChild(generatingMsg);
        
        // Remove the message after 10 seconds in case generation takes too long
        setTimeout(() => {
          if (generatingMsg.parentNode === overlay) {
            overlay.removeChild(generatingMsg);
          }
        }, 10000);
      }
    }
  }

  setPlaceholderImage(hotel, location) {
    const svgPlaceholder = `
      <svg width="100%" height="100%" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f5f5f5"/>
        <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#999" text-anchor="middle">${hotel || 'Your Hotel'}</text>
        <text x="50%" y="58%" font-family="Arial" font-size="12" fill="#999" text-anchor="middle">${location || 'Beautiful Location'}</text>
      </svg>
    `;
    
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgPlaceholder);
    dualPreviewService.updateSocialPreview(hotel, null, null, dataUrl);
    dualPreviewService.updateDesignPreview(hotel, location, dataUrl);
  }
}

export default new EnhancedImageService();
