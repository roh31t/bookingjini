import threeDDesignService from './3d-design-service.js';

class DualPreviewService {
  constructor() {
    this.socialPreview = null;
    this.designPreview = null;
    this.currentImageUrl = null;
    this.is3DInitialized = false;
  }

  initialize() {
    this.socialPreview = document.querySelector('.social-preview');
    this.designPreview = document.querySelector('.design-preview');
    
    // Create toggle buttons for the preview panels
    const previewToggle = document.querySelector('.preview-toggle');
    if (previewToggle) {
      const socialBtn = previewToggle.querySelector('.social-btn');
      const designBtn = previewToggle.querySelector('.design-btn');
      
      socialBtn.addEventListener('click', () => this.switchPreview('social'));
      designBtn.addEventListener('click', () => this.switchPreview('design'));
    }
  }

  switchPreview(type) {
    const previewToggle = document.querySelector('.preview-toggle');
    const socialBtn = previewToggle.querySelector('.social-btn');
    const designBtn = previewToggle.querySelector('.design-btn');
    
    if (type === 'social') {
      this.socialPreview.style.display = 'flex';
      this.designPreview.style.display = 'none';
      socialBtn.classList.add('active');
      designBtn.classList.remove('active');
    } else {
      this.socialPreview.style.display = 'none';
      this.designPreview.style.display = 'flex';
      socialBtn.classList.remove('active');
      designBtn.classList.add('active');
      
      // Initialize 3D design if needed
      if (!this.is3DInitialized && typeof THREE !== 'undefined') {
        const container = this.designPreview.querySelector('.design-3d-container');
        if (container) {
          threeDDesignService.initialize(container);
          threeDDesignService.updateCardTexture(this.currentImageUrl, 
                                               document.querySelector('.design-title')?.textContent, 
                                               document.querySelector('.design-location')?.textContent);
          this.is3DInitialized = true;
        }
      }
    }
  }

  updateSocialPreview(hotelName, caption, hashtags, imageUrl) {
    const previewHotelName = document.getElementById('previewHotelName');
    const previewCaption = document.getElementById('previewCaption');
    const previewHashtags = document.getElementById('previewHashtags');
    const previewImage = document.querySelector('.insta-image');
    
    if (previewHotelName) previewHotelName.textContent = hotelName || 'Your Hotel';
    if (previewCaption) previewCaption.textContent = caption || 'Your caption will appear here...';
    if (previewHashtags) previewHashtags.textContent = hashtags || '#YourHashtags #WillAppear #Here';
    
    if (previewImage && imageUrl) {
      previewImage.innerHTML = '';
      const img = document.createElement('img');
      img.src = imageUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      previewImage.appendChild(img);
      this.currentImageUrl = imageUrl;
    }
  }

  updateDesignPreview(hotelName, location, imageUrl) {
    if (!this.designPreview) return;
    
    const designTitle = this.designPreview.querySelector('.design-title');
    const designLocation = this.designPreview.querySelector('.design-location');
    
    if (designTitle) designTitle.textContent = hotelName || 'Your Hotel';
    if (designLocation) designLocation.textContent = location || 'Beautiful Location';
    
    // Update 2D design
    const designImage = this.designPreview.querySelector('.design-image');
    if (designImage && imageUrl) {
      designImage.style.backgroundImage = `url(${imageUrl})`;
    }
    
    // Update 3D card if initialized
    if (this.is3DInitialized && imageUrl) {
      threeDDesignService.updateCardTexture(imageUrl, hotelName, location);
    }
    
    this.currentImageUrl = imageUrl;
  }

  getCurrentImageUrl() {
    return this.currentImageUrl;
  }
}

export default new DualPreviewService();