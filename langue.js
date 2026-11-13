// main.js
document.addEventListener('DOMContentLoaded', () => {
    // A function to apply the selected language
    function setLanguage(lang) {
        // Save the language to local storage so it persists across pages
        localStorage.setItem('language', lang);
        
        // Find all elements with a data-i18n attribute and update their text
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = translations[lang][key];
            if (translation) {
                // Use innerHTML to handle <br> tags
                element.innerHTML = translation;
            }
        });

        // Update the page's language attribute
        document.documentElement.lang = lang;
    }

    // Function to handle language selection clicks
    function handleLanguageSelection(event) {
        // Prevent default link behavior
        event.preventDefault(); 
        const selectedLang = event.currentTarget.getAttribute('data-lang');
        setLanguage(selectedLang);
    }

    // Get the language dropdown menu links
    const languageLinks = document.querySelectorAll('#language-dropdown-menu a, #sidebar-language-menu a');

    // Add a click event listener to each language link
    languageLinks.forEach(link => {
        link.addEventListener('click', handleLanguageSelection);
    });

    // On page load, check for a saved language in local storage
    const savedLanguage = localStorage.getItem('language');

    // If a language is saved, apply it. Otherwise, use the default language (fr).
    if (savedLanguage) {
        setLanguage(savedLanguage);
    } else {
        setLanguage('fr');
    }

    // Toggle the desktop language dropdown
    const languageDropdownButton = document.getElementById('language-dropdown-button');
    const languageDropdownMenu = document.getElementById('language-dropdown-menu');

    if (languageDropdownButton && languageDropdownMenu) {
        languageDropdownButton.addEventListener('click', () => {
            languageDropdownMenu.classList.toggle('hidden');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!languageDropdownButton.contains(event.target) && !languageDropdownMenu.contains(event.target)) {
            languageDropdownMenu.classList.add('hidden');
        }
    });

    // Toggle the mobile sidebar
    const menuBtn = document.getElementById('menu-btn');
    const closeBtn = document.getElementById('close-btn');
    const sidebar = document.getElementById('sidebar');

    if (menuBtn && closeBtn && sidebar) {
        menuBtn.addEventListener('click', () => {
            sidebar.classList.add('open');
        });

        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('open');
        });
    }

    // Toggle the mobile language dropdown
    const sidebarLanguageButton = document.getElementById('sidebar-language-button');
    const sidebarLanguageMenu = document.getElementById('sidebar-language-menu');

    if (sidebarLanguageButton && sidebarLanguageMenu) {
        sidebarLanguageButton.addEventListener('click', () => {
            sidebarLanguageMenu.classList.toggle('hidden');
        });
    }

    // Back-to-top button functionality
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.remove('invisible', 'opacity-0');
            } else {
                backToTopButton.classList.add('invisible', 'opacity-0');
            }
        });
    }
});