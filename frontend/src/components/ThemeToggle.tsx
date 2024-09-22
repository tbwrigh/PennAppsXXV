import React, { useState, useEffect } from 'react';
import './ThemeToggle.css'; // Import your CSS file for theme styles

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Function to apply theme
    const applyTheme = (isDark: boolean) => {
      setIsDarkMode(isDark);
      document.body.className = isDark ? 'dark-mode' : 'light-mode';
    };

    // Load theme from local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme === 'dark');
    } else {
      // Detect preferred color scheme
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(prefersDarkScheme.matches);

      // Listen for changes in the preferred color scheme
      prefersDarkScheme.addEventListener('change', (e) => {
        applyTheme(e.matches);
      });
    }
  }, []);

  return null; // No toggle button needed
};

export default ThemeToggle;