// Theme Switcher for EndlessNovel Standalone Pages

document.addEventListener('DOMContentLoaded', function() {
    // Default theme is fantasy, but check localStorage
    const storedTheme = localStorage.getItem('theme') || 'fantasy';
    setTheme(storedTheme);
    
    // Add theme switcher buttons if they exist
    const themeSwitchers = document.querySelectorAll('.theme-switcher');
    if (themeSwitchers.length > 0) {
        themeSwitchers.forEach(button => {
            const theme = button.getAttribute('data-theme');
            
            // Add active class to current theme button
            if (theme === storedTheme) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                setTheme(theme);
                
                // Update active class
                document.querySelectorAll('.theme-switcher').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
            });
        });
    }
});

function setTheme(theme) {
    // Valid themes
    const validThemes = ['fantasy', 'scifi', 'real'];
    if (!validThemes.includes(theme)) {
        theme = 'fantasy'; // Default fallback
    }
    
    // Remove existing theme classes and add new one
    document.body.classList.remove('fantasy', 'scifi', 'real');
    document.body.classList.add(theme);
    
    // Update background image based on theme
    if (theme === 'fantasy') {
        document.body.style.backgroundImage = 'url("assets/fantasy_bg.jpg")';
    } else if (theme === 'scifi') {
        document.body.style.backgroundImage = 'url("assets/scifi_bg.jpg")';
    } else if (theme === 'real') {
        document.body.style.backgroundImage = 'url("assets/real_bg.jpg")';
    }
    
    // Save theme preference
    localStorage.setItem('theme', theme);
} 