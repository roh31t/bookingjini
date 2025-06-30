import apiService from './api-service.js';
import indianThemeService from './indian-theme-service.js';
import dualPreviewService from './dual-preview-service.js';

class ImageService {
  constructor() {
    // Removed this.previewImage reference as we now use dualPreviewService
  }

  async generatePreviewImage(hotel, location, features, tone, audience) {
    try {
      const imagePrompt = indianThemeService.generateImagePrompt(hotel, location, features, tone, audience);
      const imageDataUrl = await apiService.generateImage(imagePrompt);
      
      if (imageDataUrl) {
        // Update both preview panels with the new image
        dualPreviewService.updateSocialPreview(hotel, null, null, imageDataUrl);
        dualPreviewService.updateDesignPreview(hotel, location, imageDataUrl);
        return imageDataUrl;
      } else {
        this.setPlaceholderImage(hotel, location);
        return null;
      }
    } catch (error) {
      console.error('Error generating image:', error);
      this.setPlaceholderImage(hotel, location);
      return null;
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

export default new ImageService();