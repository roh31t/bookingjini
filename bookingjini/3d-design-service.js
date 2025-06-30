class ThreeDDesignService {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.card = null;
    this.isAnimating = false;
  }

  initialize(container) {
    if (!container) return;
    
    // Clear any existing 3D scene
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    
    // Set up Three.js scene
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.renderer.setSize(320, 500);
    this.renderer.setClearColor(0x000000, 0);
    container.appendChild(this.renderer.domElement);
    
    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);
    
    // Create hotel card
    this.createCard();
    
    // Position camera
    this.camera.position.z = 2;
    
    // Start animation
    this.animate();
    this.isAnimating = true;
  }
  
  createCard() {
    // Create card geometry
    const geometry = new THREE.BoxGeometry(1.5, 2, 0.05);
    
    // Create materials for each side of the card
    const materials = [
      new THREE.MeshStandardMaterial({ color: 0x444444 }), // right side
      new THREE.MeshStandardMaterial({ color: 0x444444 }), // left side
      new THREE.MeshStandardMaterial({ color: 0x444444 }), // top side
      new THREE.MeshStandardMaterial({ color: 0x444444 }), // bottom side
      new THREE.MeshStandardMaterial({ color: 0xffffff }), // front (will hold image)
      new THREE.MeshStandardMaterial({ color: 0x666666 })  // back side
    ];
    
    // Create mesh with geometry and materials
    this.card = new THREE.Mesh(geometry, materials);
    this.scene.add(this.card);
  }
  
  updateCardTexture(imageUrl, hotelName, location) {
    if (!this.card) return;
    
    // Create canvas for the front texture
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // Draw background color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Load and draw image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      // Draw the image at the top 70% of the card
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height * 0.7);
      
      // Create gradient overlay
      const gradient = ctx.createLinearGradient(0, canvas.height * 0.4, 0, canvas.height * 0.7);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height * 0.4, canvas.width, canvas.height * 0.3);
      
      // Add hotel name
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36 Arial';
      ctx.fillText(hotelName || 'Your Hotel', 30, canvas.height * 0.65);
      
      // Add location
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '24px Arial';
      ctx.fillText(location || 'Beautiful Location', 30, canvas.height * 0.7);
      
      // Add footer area
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);
      
      // Add logo circle
      ctx.fillStyle = '#3494e6';
      ctx.beginPath();
      ctx.arc(60, canvas.height * 0.85, 30, 0, Math.PI * 2);
      ctx.fill();
      
      // Add CTA button
      const gradientCTA = ctx.createLinearGradient(canvas.width - 200, 0, canvas.width - 40, 0);
      gradientCTA.addColorStop(0, '#3494e6');
      gradientCTA.addColorStop(1, '#ec6ead');
      ctx.fillStyle = gradientCTA;
      
      ctx.beginPath();
      ctx.roundRect(canvas.width - 200, canvas.height * 0.83, 160, 40, 20);
      ctx.fill();
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Discover More', canvas.width - 180, canvas.height * 0.85 + 5);
      
      // Apply the canvas as a texture
      const texture = new THREE.CanvasTexture(canvas);
      this.card.material[4] = new THREE.MeshStandardMaterial({ map: texture });
    };
    
    img.onerror = () => {
      console.error('Error loading image for 3D card');
      // Create fallback texture with hotel name and location
      ctx.fillStyle = '#3494e6';
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.7);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(hotelName || 'Your Hotel', canvas.width/2, canvas.height * 0.4);
      
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.font = '24px Arial';
      ctx.fillText(location || 'Beautiful Location', canvas.width/2, canvas.height * 0.45);
      
      // Apply the canvas as a texture
      const texture = new THREE.CanvasTexture(canvas);
      this.card.material[4] = new THREE.MeshStandardMaterial({ map: texture });
    };
    
    if (imageUrl) {
      img.src = imageUrl;
    } else {
      img.onerror();
    }
  }
  
  animate() {
    if (!this.isAnimating) return;
    
    requestAnimationFrame(() => this.animate());
    
    if (this.card) {
      // Add a gentle floating animation
      this.card.rotation.y = Math.sin(Date.now() * 0.001) * 0.2;
      this.card.position.y = Math.sin(Date.now() * 0.002) * 0.05;
    }
    
    this.renderer.render(this.scene, this.camera);
  }
  
  dispose() {
    this.isAnimating = false;
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

export default new ThreeDDesignService();