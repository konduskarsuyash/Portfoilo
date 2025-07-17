import React, { useEffect, useRef, useState } from 'react';
import { TerminalHistory } from '../types/terminal';

interface TerminalLineProps {
  entry: TerminalHistory;
  isMobile?: boolean;
  onAnimationComplete?: () => void;
}

export const TerminalLine: React.FC<TerminalLineProps> = ({ 
  entry, 
  isMobile, 
  onAnimationComplete 
}) => {
  const [content, setContent] = useState(entry.animate ? '' : entry.content);
  const [isComplete, setIsComplete] = useState(!entry.animate);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasNotifiedRef = useRef(false);

  useEffect(() => {
    // For non-animated content, just show it immediately
    if (!entry.animate) {
      setContent(entry.content);
      setIsComplete(true);
      return;
    }
    
    // Reset state for animation
    setContent('');
    setIsComplete(false);
    hasNotifiedRef.current = false;
    
    let charIndex = 0;
    const text = entry.content;
    
    // Calculate typing speed based on content length
    const baseSpeed = 10;
    const typingSpeed = Math.max(1, Math.min(baseSpeed, 
      text.length > 2000 ? 1 : 
      text.length > 1000 ? 2 : 
      text.length > 500 ? 5 : baseSpeed
    ));
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Start typewriter effect
    intervalRef.current = setInterval(() => {
      if (charIndex < text.length) {
        setContent(text.slice(0, charIndex + 1));
        charIndex++;
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsComplete(true);
        
        // Only notify parent once when animation completes
        if (onAnimationComplete && !hasNotifiedRef.current) {
          hasNotifiedRef.current = true;
          onAnimationComplete();
        }
      }
    }, typingSpeed);
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [entry.content, entry.animate, onAnimationComplete]);

  // Add click handlers to links after content is rendered
  useEffect(() => {
    if (contentRef.current && isComplete) {
      const links = contentRef.current.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          if (href) {
            window.open(href, '_blank');
          }
        });
      });
    }
  }, [isComplete]);
  
  const prompt = isMobile ? 'guest$ ' : 'guest@suyash-portfolio:~$ ';
  
  // Process any custom formatting in the content
  const processContent = (content: string) => {
    if (!content) return '';
    
    // Replace skill bars with more compact styled versions
    content = content.replace(/\[([\|]+) /g, (match, bars) => {
      const barCount = bars.length;
      const barWidth = barCount * 10;
      
      return `<span class="inline-flex items-center">
        <span class="inline-block w-12 h-1 bg-gray-700 rounded-sm overflow-hidden">
          <span class="inline-block h-full bg-green-500 rounded-sm" style="width: ${barWidth}%"></span>
        </span>
      </span>`;
    });

    // Remove excess whitespace between bullet points
    content = content.replace(/•\s+/g, '• ');
    
    return content;
  };
  
  const getLinePrefix = () => {
    switch (entry.type) {
      case 'command':
        return <span className="text-blue-400 mr-1">{prompt}</span>;
      case 'error':
        return <span className="text-red-400 mr-1">ERROR: </span>;
      default:
        return null;
    }
  };
  
  const getTextColor = () => {
    switch (entry.type) {
      case 'command':
        return 'text-white';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };
  
  return (
    <div className="flex">
      {getLinePrefix()}
      <div className={`${getTextColor()} whitespace-pre-wrap break-words flex-1 ${isMobile ? 'text-xs' : ''}`}>
        <div 
          ref={contentRef}
          dangerouslySetInnerHTML={{ __html: processContent(content) }} 
          className="terminal-content"
        />
        {entry.animate && !isComplete && (
          <span className="animate-pulse">█</span>
        )}
      </div>
    </div>
  );
};