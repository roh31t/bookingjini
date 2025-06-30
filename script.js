import apiService from './api-service.js';
import enhancedImageService from './enhanced-image-service.js';
import dualPreviewService from './dual-preview-service.js';
import testimonialService from './testimonials-service.js';
import contentGenerator from './content-generator.js';
import downloadService from './download-service.js';
import authService from './auth-service.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize auth service
    authService.initialize();
    
    // Initialize dual preview service
    dualPreviewService.initialize();
    
    // Initialize content generator (which includes image uploader)
    contentGenerator.initialize();
    
    // Initialize download service
    downloadService.initialize();
    
    // Initialize testimonial service with updated names
    testimonialService.updateTestimonials();
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDark = body.classList.contains('dark-theme');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Scroll to generator from hero CTA
    const scrollToGeneratorBtn = document.getElementById('scrollToGenerator');
    const generatorSection = document.getElementById('generator');
    
    if (scrollToGeneratorBtn && generatorSection) {
        scrollToGeneratorBtn.addEventListener('click', () => {
            generatorSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Final CTA button
    const finalCTA = document.getElementById('finalCTA');
    
    if (finalCTA && generatorSection) {
        finalCTA.addEventListener('click', () => {
            generatorSection.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Testimonial carousel
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    const dots = document.querySelectorAll('.dot');
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            // Calculate the scroll position
            const testimonials = document.querySelectorAll('.testimonial');
            const scrollPosition = testimonials[index].offsetLeft - testimonialCarousel.offsetLeft;
            
            testimonialCarousel.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });
            
            // Update active dot
            dots.forEach(d => d.classList.remove('active'));
            dot.classList.add('active');
        });
    });
    
    // Form elements and real-time preview
    const hotelNameInput = document.getElementById('hotelName');
    const previewHotelName = document.getElementById('previewHotelName');
    
    hotelNameInput.addEventListener('input', () => {
        previewHotelName.textContent = hotelNameInput.value || 'Your Hotel';
    });
    
    // Surprise Me button functionality
    const surpriseMeBtn = document.getElementById('surpriseMe');
    
    const sampleHotels = [
        {
            name: "Seaside Retreat",
            location: "Malibu, California",
            features: "Oceanfront suites, private beach access, award-winning spa, dolphin watching tours",
            offers: "Summer beach yoga retreats, 20% off on stays longer than 5 nights",
            tone: "luxurious",
            audience: "couples"
        },
        {
            name: "Urban Loft Hotel",
            location: "New York, NY",
            features: "Rooftop bar, coworking space, smart room technology, local art gallery",
            offers: "Business traveler weekday discount, free Broadway show tickets with 3-night stay",
            tone: "modern",
            audience: "business"
        },
        {
            name: "Mountain Pine Lodge",
            location: "Aspen, Colorado",
            features: "Ski-in/ski-out access, fireplace in every room, hot cocoa bar, dog-friendly",
            offers: "Winter ski packages, off-season hiking discounts, family reunion specials",
            tone: "cozy",
            audience: "families"
        },
        {
            name: "Backpacker's Haven",
            location: "Bangkok, Thailand",
            features: "Free city tours, communal kitchen, bicycle rentals, 24-hour café",
            offers: "Monthly digital nomad passes, group adventure discounts, local cooking classes",
            tone: "budget-friendly",
            audience: "solo"
        }
    ];
    
    surpriseMeBtn.addEventListener('click', async () => {
        const randomHotel = sampleHotels[Math.floor(Math.random() * sampleHotels.length)];
        
        document.getElementById('hotelName').value = randomHotel.name;
        document.getElementById('location').value = randomHotel.location;
        document.getElementById('uniqueFeatures').value = randomHotel.features;
        document.getElementById('offers').value = randomHotel.offers;
        document.getElementById('tone').value = randomHotel.tone;
        document.getElementById('targetAudience').value = randomHotel.audience;
        
        // Update previews using our dual preview service
        const placeholderCaption = `Experience the magic of ${randomHotel.name} in ${randomHotel.location.split(',')[0]}...`;
        const hotelTag = randomHotel.name.replace(/\s+/g, '');
        const locationTag = randomHotel.location.split(',')[0].replace(/\s+/g, '');
        const placeholderHashtags = `#${hotelTag} #${locationTag} #TravelGoals #VacationMode`;
        
        dualPreviewService.updateSocialPreview(
            randomHotel.name,
            placeholderCaption,
            placeholderHashtags,
            null
        );
        
        dualPreviewService.updateDesignPreview(
            randomHotel.name,
            randomHotel.location,
            null
        );
        
        // Generate a preview image
        await enhancedImageService.generatePreviewImage(
            randomHotel.name, 
            randomHotel.location, 
            randomHotel.features, 
            randomHotel.tone, 
            randomHotel.audience
        );
    });
    
    // Form submission
    const form = document.getElementById('hotelForm');
    const outputSection = document.getElementById('outputSection');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const copyAllBtn = document.getElementById('copyAll');
    const newContentBtn = document.getElementById('newContent');
    const exportToCanvaBtn = document.getElementById('exportToCanva');
    const previewSection = document.getElementById('previewSection');
    const previewCaption = document.getElementById('previewCaption');
    const previewHashtags = document.getElementById('previewHashtags');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        showLoading();
        
        try {
            const hotelName = document.getElementById('hotelName').value;
            const location = document.getElementById('location').value;
            const uniqueFeatures = document.getElementById('uniqueFeatures').value;
            const offers = document.getElementById('offers').value;
            const tone = document.getElementById('tone').value;
            const targetAudience = document.getElementById('targetAudience').value;
            
            // Generate content using the content generator service
            const content = await contentGenerator.generateContent(
                hotelName, location, uniqueFeatures, offers, tone, targetAudience
            );
            
            // Display content
            displayContent(content);
            
            // Update previews using dual preview service
            dualPreviewService.updateSocialPreview(
                hotelName,
                content.instagram.substring(0, 100) + "...",
                content.hashtags.split(' ').slice(0, 5).join(' ') + "...",
                contentGenerator.hasUserUploadedImage() ? 
                    contentGenerator.getUserUploadedImage() : 
                    dualPreviewService.getCurrentImageUrl()
            );
            
            dualPreviewService.updateDesignPreview(
                hotelName,
                location,
                contentGenerator.hasUserUploadedImage() ? 
                    contentGenerator.getUserUploadedImage() : 
                    dualPreviewService.getCurrentImageUrl()
            );
            
            // Show output section
            outputSection.style.display = 'block';
            
            // Scroll to output
            outputSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Sorry, there was an error generating content. Please try again.');
        } finally {
            hideLoading();
        }
    });
    
    // Copy all content
    copyAllBtn.addEventListener('click', () => {
        const instagramOutput = document.getElementById('instagramOutput').textContent;
        const hashtagsOutput = document.getElementById('hashtagsOutput').textContent;
        const layoutOutput = document.getElementById('layoutOutput').textContent;
        const blurbOutput = document.getElementById('blurbOutput').textContent;
        
        const allContent = `INSTAGRAM CAPTION:\n${instagramOutput}\n\nHASHTAGS:\n${hashtagsOutput}\n\nLAYOUT SUGGESTION:\n${layoutOutput}\n\nMARKETING BLURB:\n${blurbOutput}`;
        
        navigator.clipboard.writeText(allContent)
            .then(() => {
                showToast('All content copied to clipboard!');
            })
            .catch(err => {
                console.error('Error copying text: ', err);
                alert('Failed to copy text. Please try again.');
            });
    });
    
    // Export to Canva button
    exportToCanvaBtn.addEventListener('click', () => {
        showToast('Canva export feature coming soon!');
    });
    
    // New content button
    newContentBtn.addEventListener('click', () => {
        outputSection.style.display = 'none';
        // Reset uploaded image when creating new content
        contentGenerator.resetUserUploadedImage();
        generatorSection.scrollIntoView({ behavior: 'smooth' });
    });
    
    // Template gallery view more button
    const viewMoreBtn = document.querySelector('.view-more-btn');
    viewMoreBtn.addEventListener('click', () => {
        showToast('More templates coming soon!');
    });
    
    // Newsletter subscription
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input');
        
        if (emailInput.value) {
            showToast('Thanks for subscribing to our newsletter!');
            emailInput.value = '';
        }
    });
    
    // Show loading indicator
    function showLoading() {
        loadingIndicator.style.display = 'flex';
    }
    
    // Hide loading indicator
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }
    
    // Show toast message
    function showToast(message) {
        // Create toast element if it doesn't exist
        let toast = document.querySelector('.toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            document.body.appendChild(toast);
            
            // Style the toast
            toast.style.position = 'fixed';
            toast.style.bottom = '20px';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%)';
            toast.style.backgroundColor = 'rgba(0,0,0,0.8)';
            toast.style.color = 'white';
            toast.style.padding = '12px 20px';
            toast.style.borderRadius = '8px';
            toast.style.zIndex = '1000';
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
        }
        
        toast.textContent = message;
        toast.style.opacity = '1';
        
        setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }
    
    // Display content in the output sections
    function displayContent(content) {
        document.getElementById('instagramOutput').textContent = content.instagram;
        document.getElementById('hashtagsOutput').textContent = content.hashtags;
        document.getElementById('layoutOutput').textContent = content.layout;
        document.getElementById('blurbOutput').textContent = content.blurb;
    }
});