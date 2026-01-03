// =================================================
// iDRIVE MAIN JS - HEADER, HERO ANIMATION, SCROLL, COUNTERS
// =================================================

document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.site-header');
    const heroSection = document.getElementById('hero');

    // =================================================
    // PERFORMANCE TRACKING
    // =================================================
    let scrollRafId = null;
    let animationRafId = null;
    let lastScrollY = window.scrollY;

    // =================================================
    // HEADER SCROLL HANDLER
    // =================================================
    function updateHeader() {
        const scrollY = window.scrollY;
        const isAtAbsoluteTop = scrollY <= 2;
        header.classList.toggle('hidden', !isAtAbsoluteTop);
        lastScrollY = scrollY;
    }

    function handleScroll() {
        if (scrollRafId === null) {
            scrollRafId = requestAnimationFrame(function () {
                updateHeader();
                scrollRafId = null;
            });
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateHeader();

    // =================================================
    // SMOOTH SCROLL FUNCTION
    // =================================================
    window.scrollToSection = function (sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;

        if (animationRafId !== null) {
            cancelAnimationFrame(animationRafId);
            animationRafId = null;
        }

        const targetPosition = section.offsetTop;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = 800;
        let startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animateScroll(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            window.scrollTo(
                0,
                startPosition + distance * easedProgress
            );

            if (progress < 1) {
                animationRafId = requestAnimationFrame(animateScroll);
            } else {
                animationRafId = null;
                updateHeader();
            }
        }

        animationRafId = requestAnimationFrame(animateScroll);
    };

    // =================================================
    // EVENT HANDLERS
    // =================================================
    const scrollHint = document.querySelector('.scroll-hint');
    if (scrollHint) {
        scrollHint.addEventListener('click', function (e) {
            e.preventDefault();
            scrollToSection('features');
        });
    }

    const trialBtn = document.getElementById('heroTrialBtn');
    if (trialBtn) {
        trialBtn.addEventListener('click', function () {
            scrollToSection('download');
        });
    }

    const appStoreBtn = document.querySelector('.app-store-btn');
    if (appStoreBtn) {
        appStoreBtn.addEventListener('click', function () {
            console.log('iOS Download clicked');
        });
    }

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('faq-toggle')) {
            const faqCard = e.target.closest('.faq-card');
            if (faqCard) {
                faqCard.classList.toggle('active');
            }
        }
    });

    document.addEventListener('click', function (e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (!anchor) return;
        const href = anchor.getAttribute('href');
        if (href.length <= 1) return;

        e.preventDefault();
        scrollToSection(href.substring(1));
    });

    // =================================================
    // COUNTER ANIMATIONS
    // =================================================
    function initCounters() {
        const statsSection = document.querySelector('.section-stats');
        if (!statsSection) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3, rootMargin: '0px 0px -100px 0px' });

        observer.observe(statsSection);
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');

        counters.forEach(counter => {
            const target = parseFloat(counter.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = target * eased;

                counter.textContent =
                    target > 1000
                        ? Math.floor(value).toLocaleString()
                        : value.toFixed(1);

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent =
                        target > 1000
                            ? target.toLocaleString()
                            : target.toFixed(1);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    setTimeout(initCounters, 1000);

    // =================================================
    // CLEANUP ON PAGE UNLOAD
    // =================================================
    window.addEventListener('beforeunload', function () {
        if (scrollRafId) cancelAnimationFrame(scrollRafId);
        if (animationRafId) cancelAnimationFrame(animationRafId);
    });


});

// FAQ Toggle Functionality
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item.active').forEach(item => {
            if (item !== faqItem) {
                item.classList.remove('active');
            }
        });
        
        // Toggle current FAQ
        faqItem.classList.toggle('active', !isActive);
    });
});

// Smart device detection for iDrive download section

document.addEventListener('DOMContentLoaded', function() {
    // Function to detect device type
    function detectDevice() {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        
        // Check for iOS (iPhone, iPad, iPod)
        if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
            return 'ios';
        }
        
        // Check for Android
        if (/Android/.test(ua)) {
            return 'android';
        }
        
        // Check for macOS (Mac, MacBook, etc.)
        // More comprehensive macOS detection
        if (platform.includes('Mac') || 
            /Macintosh|MacIntel|MacPPC|Mac68K/.test(platform) ||
            (ua.includes('Mac OS') && !ua.includes('like Mac'))) {
            return 'macos';
        }
        
        // Default to desktop/other
        return 'desktop';
    }
    
    // Function to show appropriate scenario
    function showScenario(deviceType) {
        console.log('Device detected:', deviceType);
        
        // Hide all scenarios first
        const scenarios = document.querySelectorAll('.download-scenario');
        scenarios.forEach(scenario => {
            scenario.style.display = 'none';
        });
        
        // Show the correct scenario
        const scenarioId = deviceType + '-scenario';
        const targetScenario = document.getElementById(scenarioId);
        
        if (targetScenario) {
            targetScenario.style.display = 'block';
            console.log('Showing scenario:', scenarioId);
        } else {
            // Fallback to desktop scenario
            document.getElementById('desktop-scenario').style.display = 'block';
            console.log('Fallback to desktop scenario');
        }
        
        // Update device info text if element exists
        const deviceInfo = document.getElementById('device-info');
        if (deviceInfo) {
            const messages = {
                'ios': 'You\'re on an iOS device. Tap the App Store button above.',
                'android': "Android friends, iDrive is on its way to Google Play. Thanks for your patience.",
                'macos': 'You\'re on a Mac. Scan the QR code with your iPhone camera.',
                'desktop': 'Scan the QR code with your iPhone camera to download.'
            };
            
            deviceInfo.textContent = messages[deviceType] || messages.desktop;
        }
    }
    
    // Optional: Add loading state
    const detectionNote = document.querySelector('.detection-note');
    if (detectionNote) {
        detectionNote.style.opacity = '0.6';
    }
    
    // Add slight delay for better UX
    setTimeout(() => {
        const deviceType = detectDevice();
        showScenario(deviceType);
        
        // Remove loading state
        if (detectionNote) {
            detectionNote.style.opacity = '1';
        }
        
        // Add device class to body for CSS targeting (optional)
        document.body.classList.add('device-' + deviceType);
        
        console.log('Device detection complete. User is on:', deviceType);
    }, 300); // 300ms delay for smoother transition
});

// Optional: Re-run detection if window is resized (useful for testing)
window.addEventListener('resize', function() {
    // Only re-run if user agent indicates testing (optional)
    if (navigator.userAgent.includes('Chrome') || 
        navigator.userAgent.includes('Firefox')) {
        console.log('Window resized - re-detecting device for testing');
        setTimeout(() => {
            const deviceType = detectDevice();
            showScenario(deviceType);
        }, 200);
    }
});

// GLOBAL downloadCTA function - call it on any page
function downloadCTA(sectionSelector = '.download-cta', buttonSelector = '.btn-primary') {
    // Simple device check
    const ua = navigator.userAgent;
    let deviceType = 'desktop'; // default
    
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
        deviceType = 'ios';
    } else if (/Android/.test(ua)) {
        deviceType = 'android';
    }
    
    // Find the download section on current page
    const downloadSection = document.querySelector(sectionSelector);
    const downloadBtn = downloadSection ? downloadSection.querySelector(buttonSelector) : null;
    
    if (!downloadSection || !downloadBtn) {
        console.log('downloadCTA: No download section found with selector:', sectionSelector);
        return;
    }
    
    console.log('downloadCTA: Device detected:', deviceType);
    
    // Apply behavior based on device
    if (deviceType === 'ios') {
        // iOS: Replace button with App Store badge image (KEEPING existing section structure)
        const appStoreHTML = `
            <a href="https://apps.apple.com/app/id6751429770"
               target="_blank"
               rel="noopener"
               class="app-store-btn">
                <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83"
                     alt="Download on the App Store"
                     width="200"
                     height="60"
                     loading="lazy">
            </a>
        `;
        
        // Replace the button with App Store badge
        downloadBtn.outerHTML = appStoreHTML;
        
        // Update section heading and text to match iOS scenario
        const heading = downloadSection.querySelector('h2');
        const paragraph = downloadSection.querySelector('p');
        
        if (heading) heading.textContent = 'Download Directly to Your iPhone';
        if (paragraph) paragraph.textContent = 'Tap below to install iDrive from the App Store.';
        
    } else if (deviceType === 'android') {
        // Android: Completely hide the section (no message)
        downloadSection.style.display = 'none';
        downloadSection.style.visibility = 'hidden';
        downloadSection.style.height = '0';
        downloadSection.style.margin = '0';
        downloadSection.style.padding = '0';
        downloadSection.style.overflow = 'hidden';
        
        // Remove from accessibility tree
        downloadSection.setAttribute('aria-hidden', 'true');
        downloadSection.setAttribute('hidden', '');
        
    } else {
        // Desktop/Other: Link to main page's download section
        downloadBtn.innerHTML = '<i class="fas fa-desktop"></i> Learn More & Download';
        downloadBtn.href = '../index.html#download';
        // Or keep original href if it already points to index.html#download
    }
}

// Auto-run on pages with .download-cta when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're NOT on the main index page (where you have your own detection)
    const isMainIndexPage = window.location.pathname.endsWith('index.html') || 
                            window.location.pathname.endsWith('/') ||
                            document.querySelector('.download-scenario'); // Your index.html has this
    
    if (!isMainIndexPage) {
        // Auto-run on other pages
        downloadCTA();
    }
});

// =================================================
// NAVI BACK HOME - PERMANENT TEXT FADE
// =================================================

document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById('backHome');
    const header = document.getElementById('main-header');
    if (!backButton || !header) return;
    
    let textHidden = false;
    let hasPulsed = false;
    let hideTextTimeout;
    let textFadedPermanently = false;
    let arrowCurrentlyVisible = false;
    
    // Check if logo is at very top of viewport
    function isLogoAtTop() {
        const headerRect = header.getBoundingClientRect();
        // Logo is at top when its top is at or near viewport top
        return headerRect.top >= 0 && headerRect.top <= 10;
    }
    
    // Show arrow (with text initially)
    function showArrow() {
        if (arrowCurrentlyVisible) return;
        
        backButton.classList.add('visible');
        arrowCurrentlyVisible = true;
        
        // Pulse only on first appearance
        if (!hasPulsed) {
            backButton.classList.add('pulse');
            hasPulsed = true;
            setTimeout(() => backButton.classList.remove('pulse'), 1500);
        }
        
        // Fade text after 3 seconds (only once)
        if (!textHidden && !textFadedPermanently) {
            clearTimeout(hideTextTimeout);
            hideTextTimeout = setTimeout(() => {
                backButton.classList.add('text-hidden');
                textHidden = true;
                textFadedPermanently = true;
            }, 3000);
        }
    }
    
    // Hide arrow (completely)
    function hideArrow() {
        if (!arrowCurrentlyVisible) return;
        
        backButton.classList.remove('visible');
        arrowCurrentlyVisible = false;
    }
    
    // Main scroll logic
    function handleScroll() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        
        // Check logo position
        const logoAtTop = isLogoAtTop();
        
        if (logoAtTop) {
            // Phase 3: Logo at top - hide arrow
            hideArrow();
        } else if (scrollY > 100) { // Threshold to show arrow
            // Phase 1/4: Scrolled down - show arrow
            showArrow();
            
            // If text already faded, ensure text-hidden class stays
            if (textFadedPermanently && !backButton.classList.contains('text-hidden')) {
                backButton.classList.add('text-hidden');
            }
        }
    }
    
    // Initial check
    handleScroll();
    
    // Listen for scroll
    window.addEventListener('scroll', handleScroll);
    
    // Handle resize for different screens
    window.addEventListener('resize', handleScroll);
    
    // Force text-hidden if already faded (for page refreshes)
    if (textFadedPermanently) {
        backButton.classList.add('text-hidden');
    }
});

// =================================================
// CONTACT FORM FUNCTIONALITY (UPDATED)
// =================================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const categorySelect = document.getElementById('category');
    const techFields = document.getElementById('techFields');
    const emailInput = document.getElementById('email');
    const emailHint = document.getElementById('emailHint');
    const formStatus = document.getElementById('formStatus');
    const fileInput = document.getElementById('attachments');
    const fileList = document.getElementById('fileList');
    const fileWrapper = document.querySelector('.file-input-wrapper');
    const originalHint = fileWrapper.querySelector('.file-hint'); // Original hint text
    let selectedFiles = [];
    
    // Store original hint text for when no files are selected
    const originalHintHTML = originalHint ? originalHint.innerHTML : '';
    
    // ===== FILE UPLOAD FUNCTIONS =====
   function updateFileList() {
        const files = selectedFiles;

        fileList.innerHTML = '';

        if (files.length > 0) {
            if (originalHint) {
                originalHint.style.display = 'none';
            }

            files.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';

                const fileSize = formatFileSize(file.size);

                fileItem.innerHTML = `
                    <div class="file-info">
                        <span class="file-icon">
                            <i class="fas fa-image"></i>
                        </span>
                        <div>
                            <div class="file-name">${escapeHtml(file.name)}</div>
                            <div class="file-size">${fileSize}</div>
                        </div>
                    </div>
                    <button type="button" class="file-remove" data-index="${index}" title="Remove file">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;

                fileList.appendChild(fileItem);
            });
        } else {
            if (originalHint) {
                originalHint.style.display = 'block';
                originalHint.innerHTML = originalHintHTML;
            }
        }
    }
    
    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
    
    function addFiles(newFiles) {
        const maxFiles = 3;
        const errors = [];
        let addedCount = 0;

        for (let i = 0; i < newFiles.length; i++) {
            const file = newFiles[i];

            // Check max files
            if (selectedFiles.length >= maxFiles) {
                errors.push(`Maximum ${maxFiles} files allowed.`);
                break;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                errors.push(`"${file.name}" exceeds 5MB limit.`);
                continue;
            }

            // Validate file type
            const validTypes = [
                'image/jpeg',
                'image/jpg',
                'image/png',
                'image/gif',
                'image/bmp',
                'image/webp'
            ];
            if (!validTypes.includes(file.type)) {
                errors.push(`"${file.name}" is not a supported image format.`);
                continue;
            }

            // Duplicate check (Option B)
            const isDuplicate = selectedFiles.some(f => f.name === file.name && f.size === file.size);
            if (isDuplicate) {
                showFormStatus('error', `You have already added this file, please choose another one.`);
                continue;
            }

            // Add file to persistent store
            selectedFiles.push(file);
            addedCount++;
        }

        // Sync selectedFiles to file input
        const dataTransfer = new DataTransfer();
        selectedFiles.forEach(file => dataTransfer.items.add(file));
        fileInput.files = dataTransfer.files;

        // Update UI
        updateFileList();

        // Show errors if any
        if (errors.length > 0) {
            showFormStatus('error', errors.join(' '));
        }

        // Show success message if files were added and no errors
        if (addedCount > 0 && errors.length === 0) {
            showFormStatus(
                'success',
                addedCount === 1 ? '1 file added.' : `${addedCount} files added.`,
                3000
            );
        }

        return addedCount > 0;
    }
    // Event delegation for remove buttons
    fileList.addEventListener('click', function(e) {
        // Find the remove button that was clicked
        let removeBtn = e.target;
        if (removeBtn.classList.contains('fa-trash-alt')) {
            removeBtn = removeBtn.closest('.file-remove');
        }
        
        if (removeBtn && removeBtn.classList.contains('file-remove')) {
            const index = parseInt(removeBtn.getAttribute('data-index'));
            removeFile(index);
        }
    });
    
    function removeFile(index) {
        if (index >= 0 && index < selectedFiles.length) {
            selectedFiles.splice(index, 1);

            const dataTransfer = new DataTransfer();
            selectedFiles.forEach(file => dataTransfer.items.add(file));
            fileInput.files = dataTransfer.files;

            updateFileList();
            showFormStatus('info', 'File removed', 2000);
        }
    }
    // Drag and drop support
    fileWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileWrapper.classList.add('drag-over');
    });
    
    fileWrapper.addEventListener('dragleave', () => {
        fileWrapper.classList.remove('drag-over');
    });
    
    fileWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        fileWrapper.classList.remove('drag-over');

        if (e.dataTransfer.files.length) {
            addFiles(e.dataTransfer.files);
        }
    });
    
    // File input change handler
    fileInput.addEventListener('change', function () {
        if (this.files.length) {
            addFiles(this.files);
            this.value = ''; // IMPORTANT: prevent overwrite on next selection
        }
    });
    // ===== FORM FUNCTIONS =====
    // Category change handler
    categorySelect.addEventListener('change', function() {
        if (this.value === 'tech') {
            techFields.style.display = 'block';
            emailInput.required = true;
            emailInput.placeholder = "Required for response";
            emailHint.innerHTML = '<strong>Required for technical support responses</strong>';
        } else {
            techFields.style.display = 'none';
            emailInput.required = false;
            emailInput.placeholder = "your@email.com (optional)";
            emailHint.textContent = 'We\'ll use this to respond to your inquiry';
        }
    });
    
    // Set form timestamp for rate limiting
    document.getElementById('formTimestamp').value = Date.now();
    
    // Form validation
    function validateForm() {
        const errors = [];
        const formData = new FormData(contactForm);
        
        // Check honeypot (anti-spam)
        if (formData.get('website')) {
            errors.push('Spam detection triggered.');
        }
        
        // Check rate limiting (5 minutes between submissions)
        const timestamp = parseInt(formData.get('timestamp'));
        const now = Date.now();
        const lastSubmission = localStorage.getItem('lastFormSubmission');
        
        if (lastSubmission && (now - parseInt(lastSubmission)) < 300000) {
            errors.push('Please wait 5 minutes between submissions.');
        }
        
        // Validate email if required
        if (categorySelect.value === 'tech' && !formData.get('email')) {
            errors.push('Email is required for technical support.');
        }
        
        // Validate iDrive account email for tech support
        if (categorySelect.value === 'tech' && !formData.get('userEmail')) {
            errors.push('iDrive account email is required for technical support.');
        }
        
        // File validation
        const files = fileInput.files;
        if (files.length > 3) {
            errors.push('Maximum 3 files allowed.');
        }
        
        for (let file of files) {
            if (file.size > 5 * 1024 * 1024) {
                errors.push(`"${file.name}" exceeds 5MB limit.`);
            }
            
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                errors.push(`"${file.name}" is not a supported image format (JPG, PNG, GIF, BMP, WebP only).`);
            }
        }
        
        return errors;
    }
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Reset status
        formStatus.style.display = 'none';
        formStatus.className = 'form-status';
        
        // Validate
        const errors = validateForm();
        if (errors.length > 0) {
            showFormStatus('error', errors.join(' '));
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {

           await submitContactForm(this);

            // Success
            showFormStatus('success', 'Message sent successfully! We\'ll respond within 24-48 hours.');
            contactForm.reset();
            techFields.style.display = 'none';
            selectedFiles = [];
            fileList.innerHTML = '';
            
            // Reset file input
            fileInput.value = '';
            updateFileList();
            
            // Store submission timestamp
            localStorage.setItem('lastFormSubmission', Date.now().toString());
            
        } catch (error) {
            showFormStatus('error', 'Failed to send message. Please try again or email us directly at support@idrive.today');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Show status messages
    function showFormStatus(type, message, timeout = null) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        formStatus.style.display = 'block';

        formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Set default timeouts
        let displayTime;
        if (timeout !== null) {
            displayTime = timeout;
        } else if (type === 'success') {
            displayTime = 7000; // 7s for success
        } else if (type === 'error') {
            displayTime = 3000; // 3s for error
        } else {
            displayTime = 3000; // default for info/other
        }

        setTimeout(() => {
            formStatus.style.display = 'none';
        }, displayTime);
    }
    
    // =================================================
    // REAL FORM SUBMISSION (Formspree)
    // =================================================
    async function submitContactForm(formElement) {
        const response = await fetch('https://formspree.io/f/meeqkjel', {
            method: 'POST',
            body: new FormData(formElement),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Form submission failed');
        }

        return response.json();
    }
    // Initialize
    updateFileList();
});