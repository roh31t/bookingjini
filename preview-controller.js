document.addEventListener('DOMContentLoaded', () => {
    const previewModeToggle = document.querySelector('.preview-mode-toggle');
    const designCard = document.querySelector('.design-card');
    const design3DContainer = document.querySelector('.design-3d-container');
    
    if (previewModeToggle && designCard && design3DContainer) {
        previewModeToggle.addEventListener('click', () => {
            const is3DVisible = design3DContainer.style.display === 'block';
            
            if (is3DVisible) {
                design3DContainer.style.display = 'none';
                designCard.style.display = 'flex';
                previewModeToggle.textContent = 'View in 3D';
            } else {
                design3DContainer.style.display = 'block';
                designCard.style.display = 'none';
                previewModeToggle.textContent = 'View in 2D';
                
                // Initialize 3D if THREE.js is available
                if (typeof THREE !== 'undefined') {
                    // This will be handled by the dual-preview-service
                    // when it detects the 3D container is visible
                    const event = new CustomEvent('switch-to-3d');
                    document.dispatchEvent(event);
                }
            }
        });
    }
});

export {};