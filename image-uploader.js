class ImageUploader {
  constructor() {
    this.dropZone = null;
    this.fileInput = null;
    this.uploadedImage = null;
    this.onImageUploaded = null;
  }

  initialize(containerId, onImageUploaded) {
    this.onImageUploaded = onImageUploaded;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Create drop zone
    this.dropZone = document.createElement('div');
    this.dropZone.className = 'drag-drop-zone';
    this.dropZone.innerHTML = `
      <div class="drop-icon"><i class="fas fa-cloud-upload-alt"></i></div>
      <p>Drag & drop your image here</p>
      <p class="or-text">- OR -</p>
      <button class="browse-btn">Browse Files</button>
      <p class="file-info">Supported formats: JPG, PNG (Max 5MB)</p>
    `;
    container.appendChild(this.dropZone);

    // Create hidden file input
    this.fileInput = document.createElement('input');
    this.fileInput.type = 'file';
    this.fileInput.accept = 'image/*';
    this.fileInput.style.display = 'none';
    container.appendChild(this.fileInput);

    // Add event listeners
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Drag and drop events
    this.dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.dropZone.classList.add('drag-over');
    });

    this.dropZone.addEventListener('dragleave', () => {
      this.dropZone.classList.remove('drag-over');
    });

    this.dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.dropZone.classList.remove('drag-over');
      const files = e.dataTransfer.files;
      if (files.length) {
        this.handleFileUpload(files[0]);
      }
    });

    // Browse button click
    const browseBtn = this.dropZone.querySelector('.browse-btn');
    browseBtn.addEventListener('click', () => {
      this.fileInput.click();
    });

    // File input change
    this.fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        this.handleFileUpload(e.target.files[0]);
      }
    });
  }

  handleFileUpload(file) {
    // Check file type
    if (!file.type.match('image.*')) {
      this.showError('Please upload an image file (JPG, PNG)');
      return;
    }

    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      this.showError('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedImage = e.target.result;
      this.showUploadedImage();
      
      // Call the callback function with the uploaded image
      if (this.onImageUploaded) {
        this.onImageUploaded(this.uploadedImage);
      }
    };
    reader.readAsDataURL(file);
  }

  showUploadedImage() {
    this.dropZone.innerHTML = `
      <div class="uploaded-image-container">
        <img src="${this.uploadedImage}" alt="Uploaded image" class="uploaded-image">
        <button class="remove-image-btn"><i class="fas fa-times"></i></button>
      </div>
    `;

    // Add event listener to remove button
    const removeBtn = this.dropZone.querySelector('.remove-image-btn');
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.resetUploader();
    });
  }

  resetUploader() {
    this.uploadedImage = null;
    this.fileInput.value = '';
    this.dropZone.innerHTML = `
      <div class="drop-icon"><i class="fas fa-cloud-upload-alt"></i></div>
      <p>Drag & drop your image here</p>
      <p class="or-text">- OR -</p>
      <button class="browse-btn">Browse Files</button>
      <p class="file-info">Supported formats: JPG, PNG (Max 5MB)</p>
    `;
    
    // Reset event listeners
    this.setupEventListeners();
    
    // Call the callback with null to indicate image removal
    if (this.onImageUploaded) {
      this.onImageUploaded(null);
    }
  }

  showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'upload-error';
    errorElement.textContent = message;
    errorElement.style.position = 'absolute';
    errorElement.style.bottom = '10px';
    errorElement.style.left = '50%';
    errorElement.style.transform = 'translateX(-50%)';
    errorElement.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    errorElement.style.color = 'white';
    errorElement.style.padding = '8px 15px';
    errorElement.style.borderRadius = '4px';
    errorElement.style.zIndex = '100';
    
    document.body.appendChild(errorElement);
    
    setTimeout(() => {
      document.body.removeChild(errorElement);
    }, 3000);
  }

  getUploadedImage() {
    return this.uploadedImage;
  }
}

export default new ImageUploader();