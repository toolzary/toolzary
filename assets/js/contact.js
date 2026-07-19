/**
 * Contact Page Functionality
 * Handles email copy, tool suggestion, bug report, form validation, and auto-expand textarea
 * Integrated with Netlify Forms
 */

(function() {
    'use strict';

    // ============================================
    // DOM ELEMENTS
    // ============================================

    var emailCard = document.querySelector('.info-card.email-card');
    var suggestCard = document.querySelector('.info-card.suggest-tool');
    var bugCard = document.querySelector('.info-card.report-bug');
    var subjectField = document.getElementById('contactSubject');
    var messageField = document.getElementById('contactMessage');
    var contactForm = document.getElementById('contactForm');

    // ============================================
    // AUTO-EXPAND TEXTAREA
    // ============================================

    function autoExpandTextarea() {
        var textarea = document.getElementById('contactMessage');
        if (!textarea) return;
        
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
        
        textarea.addEventListener('blur', function() {
            if (this.value === '') {
                this.style.height = 'auto';
                this.style.height = '120px';
            }
        });
    }

    // ============================================
    // ANIMATION FUNCTIONS
    // ============================================

    function animateCard(card) {
        if (!card) return;
        try {
            card.style.transform = 'scale(0.97)';
            card.style.borderColor = 'var(--primary)';
            card.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.2)';
            setTimeout(function() {
                if (card) {
                    card.style.transform = '';
                    card.style.borderColor = '';
                    card.style.boxShadow = '';
                }
            }, 300);
        } catch (error) {
            // Silently fail
        }
    }

    function highlightSubject() {
        try {
            if (subjectField) {
                subjectField.style.transition = 'all 0.3s ease';
                subjectField.style.borderColor = '#4f46e5';
                subjectField.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.15)';
                subjectField.style.backgroundColor = 'rgba(79, 70, 229, 0.04)';
                setTimeout(function() {
                    if (subjectField) {
                        subjectField.style.borderColor = '';
                        subjectField.style.boxShadow = '';
                        subjectField.style.backgroundColor = '';
                    }
                }, 1500);
            }
        } catch (error) {
            // Silently fail
        }
    }

    function scrollToForm() {
        try {
            if (contactForm) {
                var header = document.querySelector('header');
                var headerHeight = header ? header.offsetHeight : 80;
                var elementPosition = contactForm.getBoundingClientRect().top + window.pageYOffset;
                var offsetPosition = elementPosition - headerHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } catch (error) {
            // Silently fail
        }
    }

    // ============================================
    // EMAIL CARD - COPY TO CLIPBOARD
    // ============================================

    if (emailCard) {
        emailCard.addEventListener('click', function(e) {
            var email = 'contact@toolzary.com';
            var emailText = emailCard.querySelector('.info-content p');
            var actionSpan = emailCard.querySelector('.info-action');
            
            if (!emailText) return;
            
            function showCopied() {
                var originalHTML = emailText.innerHTML;
                
                emailText.innerHTML = `
                    <span style="display: inline-flex; align-items: center; gap: 6px; color: #22c55e; font-weight: 600;">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 7 17l-5-5"/>
                            <path d="m22 10-7.5 7.5L13 16"/>
                        </svg>
                        Copied!
                    </span>
                `;
                
                if (actionSpan) {
                    actionSpan.textContent = '';
                    actionSpan.style.color = '#22c55e';
                }
                
                animateCard(emailCard);
                
                setTimeout(function() {
                    if (emailText) {
                        emailText.innerHTML = originalHTML;
                    }
                    if (actionSpan) {
                        actionSpan.textContent = 'Click to copy →';
                        actionSpan.style.color = '';
                    }
                }, 2500);
            }
            
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email)
                    .then(showCopied)
                    .catch(function() {
                        fallbackCopy(email, showCopied);
                    });
            } else {
                fallbackCopy(email, showCopied);
            }
        });
    }

    // ============================================
    // FALLBACK COPY FUNCTION
    // ============================================

    function fallbackCopy(text, callback) {
        try {
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (callback) callback();
        } catch (error) {
            // Silently fail
        }
    }

    // ============================================
    // SUGGEST TOOL CARD
    // ============================================

    if (suggestCard) {
        suggestCard.addEventListener('click', function(e) {
            e.preventDefault();
            if (subjectField) {
                subjectField.value = 'Tool Suggestion';
                var event = new Event('input', { bubbles: true });
                subjectField.dispatchEvent(event);
            }
            if (messageField) {
                messageField.focus();
                messageField.placeholder = 'Describe the tool you\'d like to see...';
            }
            animateCard(suggestCard);
            highlightSubject();
            scrollToForm();
        });
    }

    // ============================================
    // REPORT BUG CARD
    // ============================================

    if (bugCard) {
        bugCard.addEventListener('click', function(e) {
            e.preventDefault();
            if (subjectField) {
                subjectField.value = 'Bug Report';
                var event = new Event('input', { bubbles: true });
                subjectField.dispatchEvent(event);
            }
            if (messageField) {
                messageField.focus();
                messageField.placeholder = 'Describe the bug you encountered...';
            }
            animateCard(bugCard);
            highlightSubject();
            scrollToForm();
        });
    }

    // ============================================
    // FORM VALIDATION & NETLIFY SUBMISSION
    // ============================================

    if (contactForm) {
        // Add Netlify form attributes dynamically if not present
        if (!contactForm.hasAttribute('data-netlify')) {
            contactForm.setAttribute('data-netlify', 'true');
        }
        if (!contactForm.hasAttribute('netlify')) {
            contactForm.setAttribute('netlify', '');
        }
        
        // Ensure form name is set
        if (!contactForm.getAttribute('name')) {
            contactForm.setAttribute('name', 'contact');
        }

        // Add hidden form-name input if missing
        var formNameInput = contactForm.querySelector('input[name="form-name"]');
        if (!formNameInput) {
            formNameInput = document.createElement('input');
            formNameInput.type = 'hidden';
            formNameInput.name = 'form-name';
            formNameInput.value = contactForm.getAttribute('name') || 'contact';
            contactForm.prepend(formNameInput);
        }

        // Handle form submission
        contactForm.addEventListener('submit', function(e) {
            var name = document.getElementById('contactName');
            var email = document.getElementById('contactEmail');
            var subject = document.getElementById('contactSubject');
            var message = document.getElementById('contactMessage');
            
            var isValid = true;
            var errorMessage = '';
            
            // Clear previous errors
            var allInputs = [name, email, subject, message];
            allInputs.forEach(function(input) {
                if (input) {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                }
            });
            
            // Validate name
            if (!name || !name.value.trim()) {
                isValid = false;
                errorMessage += 'Name is required.\n';
                if (name) {
                    name.style.borderColor = '#ef4444';
                    name.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            }
            
            // Validate email
            if (!email || !email.value.trim()) {
                isValid = false;
                errorMessage += 'Email is required.\n';
                if (email) {
                    email.style.borderColor = '#ef4444';
                    email.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            } else if (email.value.trim() && !isValidEmail(email.value.trim())) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
                if (email) {
                    email.style.borderColor = '#ef4444';
                    email.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            }
            
            // Validate subject
            if (!subject || !subject.value.trim()) {
                isValid = false;
                errorMessage += 'Subject is required.\n';
                if (subject) {
                    subject.style.borderColor = '#ef4444';
                    subject.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            }
            
            // Validate message
            if (!message || !message.value.trim()) {
                isValid = false;
                errorMessage += 'Message is required.\n';
                if (message) {
                    message.style.borderColor = '#ef4444';
                    message.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fix the following errors:\n\n' + errorMessage);
                return false;
            }
            
            // Let Netlify handle the submission
            // The form will submit to Netlify's form handler
            // and redirect to /contact/success
            
            // Show loading state (optional)
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                var originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Re-enable after a timeout in case of issues
                setTimeout(function() {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 10000);
            }
            
            return true;
        });
        
        // Clear validation styles on input
        var formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(function(input) {
            if (input) {
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                    this.style.boxShadow = '';
                });
                input.addEventListener('focus', function() {
                    this.style.borderColor = '';
                    this.style.boxShadow = '';
                });
            }
        });
    }

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ============================================
    // SUCCESS MESSAGE HANDLER (for success page)
    // ============================================

    function checkSuccessPage() {
        // Check if we're on the success page
        if (window.location.pathname.includes('/contact/success/')) {
            // You can add any success page specific logic here
            console.log('✅ Form submitted successfully!');
        }
    }

    // ============================================
    // INITIALIZE
    // ============================================

    function init() {
        autoExpandTextarea();
        checkSuccessPage();
        
        // Update CTA tool count
        var ctaCount = document.getElementById('ctaToolCount');
        if (ctaCount && window.TOOLS) {
            ctaCount.textContent = window.TOOLS.length;
        }
        
        // Log Netlify form status
        if (contactForm) {
            console.log('✅ Netlify Forms enabled');
            console.log('✅ Form will send to: contact@toolzary.com');
            console.log('✅ Form name:', contactForm.getAttribute('name'));
        }
        
        if (console && console.log) {
            console.log('✅ Contact page initialized with Netlify Forms');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();



















