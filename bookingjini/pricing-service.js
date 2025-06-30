import { config } from './config.js';

class PricingService {
  constructor() {
    this.pricingData = config.indianPricing;
  }

  updatePricingDisplay() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    // Update free plan
    if (pricingCards[0]) {
      const freePrice = pricingCards[0].querySelector('.price');
      if (freePrice) freePrice.innerHTML = `${this.pricingData.free.price}<span>/month</span>`;
      
      const freeFeatures = pricingCards[0].querySelector('.card-features ul');
      if (freeFeatures) this.updateFeaturesList(freeFeatures, this.pricingData.free);
    }
    
    // Update pro plan
    if (pricingCards[1]) {
      const proPrice = pricingCards[1].querySelector('.price');
      if (proPrice) proPrice.innerHTML = `${this.pricingData.pro.price}<span>/month</span>`;
      
      const proFeatures = pricingCards[1].querySelector('.card-features ul');
      if (proFeatures) this.updateFeaturesList(proFeatures, this.pricingData.pro);
    }
    
    // Update business plan
    if (pricingCards[2]) {
      const businessPrice = pricingCards[2].querySelector('.price');
      if (businessPrice) businessPrice.innerHTML = `${this.pricingData.business.price}<span>/month</span>`;
      
      const businessFeatures = pricingCards[2].querySelector('.card-features ul');
      if (businessFeatures) this.updateFeaturesList(businessFeatures, this.pricingData.business);
    }
  }
  
  updateFeaturesList(featuresList, planData) {
    featuresList.innerHTML = '';
    
    // Add features
    planData.features.forEach(feature => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
      featuresList.appendChild(li);
    });
    
    // Add limitations
    planData.limitations.forEach(limitation => {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-times"></i> ${limitation}`;
      featuresList.appendChild(li);
    });
  }
}

export default new PricingService();