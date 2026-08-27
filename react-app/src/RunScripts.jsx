import React, { useEffect, useRef } from 'react';
import { useLocation } from '@tanstack/react-router';

export default function RunScripts({ children }) {
  const containerRef = useRef(null);
  const location = useLocation(); // Re-run when route changes

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Slight delay to ensure DOM is fully painted
    const timer = setTimeout(() => {
      const scripts = Array.from(containerRef.current.querySelectorAll('script'));
      
      const loadScript = (index) => {
        if (index >= scripts.length) return;
        
        const oldScript = scripts[index];
        if (oldScript.dataset.executed) {
          loadScript(index + 1);
          return;
        }
        
        const newScript = document.createElement('script');
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        newScript.innerHTML = oldScript.innerHTML;
        newScript.dataset.executed = "true";
        
        if (newScript.src) {
          newScript.onload = () => loadScript(index + 1);
          newScript.onerror = () => loadScript(index + 1);
          oldScript.parentNode.replaceChild(newScript, oldScript);
        } else {
          oldScript.parentNode.replaceChild(newScript, oldScript);
          loadScript(index + 1);
        }
      };
      
      const waitForJQuery = () => {
        if (window.jQuery) {
          loadScript(0);
          
          // Force layout recalculation for XTRA theme menus after scripts execute
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 1500);
        } else {
          setTimeout(waitForJQuery, 50);
        }
      };
      
      waitForJQuery();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location.pathname]); // Re-run when location changes

  return <div ref={containerRef}>{children}</div>;
}
