class DownloadService {
    constructor() {
      this.downloadBtn = null;
      this.currentPreviewMode = 'social'; // Default preview mode
    }
  
    initialize() {
      // Create download button
      this.downloadBtn = document.createElement('button');
      this.downloadBtn.className = 'download-btn';
      this.downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download Image';
      
      // Add to preview controls
      const previewControls = document.querySelector('.preview-controls');
      if (previewControls) {
        previewControls.appendChild(this.downloadBtn);
        
        // Set up event listener
        this.downloadBtn.addEventListener('click', () => this.downloadCurrentImage());
      }
      
      // Subscribe to preview toggle events to track current mode
      const socialBtn = document.querySelector('.social-btn');
      const designBtn = document.querySelector('.design-btn');
      
      if (socialBtn && designBtn) {
        socialBtn.addEventListener('click', () => this.currentPreviewMode = 'social');
        designBtn.addEventListener('click', () => this.currentPreviewMode = 'design');
      }
    }
  
    downloadCurrentImage() {
      let imageUrl;
      let filename;
      
      if (this.currentPreviewMode === 'social') {
        // Get image from social preview
        const imgElement = document.querySelector('.insta-image img');
        if (imgElement) {
          imageUrl = imgElement.src;
          filename = 'social-post.png';
        }
      } else {
        // Get design image - either from background image or 3D view
        const designImage = document.querySelector('.design-image');
        const is3DVisible = document.querySelector('.design-3d-container').style.display === 'block';
        
        if (is3DVisible && window.threeDDesignService) {
          // Capture the 3D canvas
          const canvas = document.querySelector('.design-3d-container canvas');
          if (canvas) {
            imageUrl = canvas.toDataURL('image/png');
            filename = 'design-3d-post.png';
          }
        } else if (designImage) {
          // Get the background image URL
          const bgImage = getComputedStyle(designImage).backgroundImage;
          imageUrl = bgImage.replace(/url\(['"]?([^'"]+)['"]?\)/gi, '$1');
          filename = 'design-post.png';
        }
      }
      
      if (!imageUrl) {
        this.showError('No image available to download');
        return;
      }
      
      // For user-uploaded images or data URLs
      if (imageUrl.startsWith('data:')) {
        this.downloadDataUrl(imageUrl, filename);
      } else {
        // For remote images
        this.fetchAndDownload(imageUrl, filename);
      }
    }
    
    async fetchAndDownload(url, filename) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        this.triggerDownload(objectUrl, filename);
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
      } catch (error) {
        console.error('Error downloading image:', error);
        this.showError('Failed to download image');
      }
    }
    
    downloadDataUrl(dataUrl, filename) {
      this.triggerDownload(dataUrl, filename);
    }
    
    triggerDownload(url, filename) {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    
    showError(message) {
      const errorElement = document.createElement('div');
      errorElement.className = 'download-error';
      errorElement.textContent = message;
      errorElement.style.position = 'fixed';
      errorElement.style.bottom = '20px';
      errorElement.style.left = '50%';
      errorElement.style.transform = 'translateX(-50%)';
      errorElement.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
      errorElement.style.color = 'white';
      errorElement.style.padding = '8px 15px';
      errorElement.style.borderRadius = '4px';
      errorElement.style.zIndex = '1000';
      
      document.body.appendChild(errorElement);
      
      setTimeout(() => {
        document.body.removeChild(errorElement);
      }, 3000);
    }
  }
  
  export default new DownloadService();