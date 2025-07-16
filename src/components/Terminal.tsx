import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TerminalLine } from './TerminalLine';
import { CommandProcessor } from './CommandProcessor';
import { TerminalHistory } from '../types/terminal';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalHistory[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [commandHistoryIndex, setCommandHistoryIndex] = useState(-1);
  const [welcomeShown, setWelcomeShown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const commandProcessor = useRef(new CommandProcessor());
  const animatingEntryIdRef = useRef<number | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize with welcome message - but only once
  useEffect(() => {
    if (!welcomeShown) {
      const showWelcome = async () => {
        try {
          const result = await commandProcessor.current.processCommand('welcome');
          
          setHistory([
            {
              id: Date.now(),
              type: 'command',
              content: 'welcome',
              timestamp: new Date()
            },
            {
              id: Date.now() + 1,
              type: 'output',
              content: result.content,
              timestamp: new Date(),
              animate: false  // Don't animate welcome
            }
          ]);
          
          setWelcomeShown(true);
        } catch (error) {
          console.error('Error showing welcome message', error);
        }
      };
      
      showWelcome();
    }
  }, [welcomeShown]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, isAnimating]);

  // Focus input on click
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current && !isProcessing && !isAnimating) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isProcessing, isAnimating]);

  // Make terminal fullscreen
  useEffect(() => {
    const handleResize = () => {
      if (terminalRef.current) {
        terminalRef.current.style.height = `${window.innerHeight}px`;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAnimationComplete = useCallback(() => {
    setIsAnimating(false);
    animatingEntryIdRef.current = null;
  }, []);

  const handleCommand = async (command: string) => {
    if (!command.trim() || isProcessing || isAnimating) return;

    setIsProcessing(true);
    
    // Add command to history
    const commandEntry = {
      id: Date.now(),
      type: 'command' as const,
      content: command,
      timestamp: new Date()
    };
    
    setHistory(prev => [...prev, commandEntry]);

    // Add to command history array for up/down navigation
    setCommandHistory(prev => [...prev, command]);
    setCommandHistoryIndex(-1);
    
    setCurrentInput('');

    try {
      // Process the command
      const result = await commandProcessor.current.processCommand(command.trim().toLowerCase());
      
      if (result.type === 'clear') {
        setHistory([]);
        setIsProcessing(false);
        return;
      } 
      
      if (result.type === 'exit') {
        window.location.reload();
        return;
      }
      
      // Add result to history
      const outputId = Date.now() + 1;
      const outputEntry = {
        id: outputId,
        type: result.type,
        content: result.content,
        timestamp: new Date(),
        animate: result.animate
      };
      
      setHistory(prev => [...prev, outputEntry]);
      
      // If this entry will animate, track its ID
      if (result.animate) {
        animatingEntryIdRef.current = outputId;
        setIsAnimating(true);
      }
    } 
    catch (error) {
      console.error('Command error:', error);
      setHistory(prev => [...prev, {
        id: Date.now() + 1,
        type: 'error',
        content: 'Command failed. Please try again.',
        timestamp: new Date()
      }]);
    }
    finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isProcessing && !isAnimating) {
      handleCommand(currentInput);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isProcessing || isAnimating) return;
    
    // Handle up arrow key - navigate command history
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = commandHistoryIndex < commandHistory.length - 1 ? commandHistoryIndex + 1 : commandHistoryIndex;
        setCommandHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
    
    // Handle down arrow key - navigate command history
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistoryIndex > 0) {
        const newIndex = commandHistoryIndex - 1;
        setCommandHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (commandHistoryIndex === 0) {
        setCommandHistoryIndex(-1);
        setCurrentInput('');
      }
    }
    
    // Handle tab for command completion
    if (e.key === 'Tab') {
      e.preventDefault();
      // Simple tab completion for commands
      const availableCommands = [
        'help', 'welcome', 'aboutme', 'projects', 'skills', 
        'experience', 'education', 'contact', 'email', 'resume', 
        'clear', 'exit'
      ];
      
      if (currentInput) {
        const matches = availableCommands.filter(cmd => 
          cmd.startsWith(currentInput.toLowerCase()));
        
        if (matches.length === 1) {
          setCurrentInput(matches[0]);
        }
      }
    }
  };

  const canTypeNewCommand = !isProcessing && !isAnimating;

  return (
    <div 
      ref={terminalRef}
      className="h-screen w-screen bg-black text-green-400 font-mono text-sm md:text-base overflow-auto p-2 md:p-4"
      style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Terminal Header */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <div className="text-gray-400 text-xs">{isMobile ? 'suyash@terminal' : 'suyash@terminal ~ '}</div>
        </div>

        {/* Terminal Content */}
        <div>
          {history.map((entry) => (
            <div key={entry.id} className="mb-1">
              <TerminalLine 
                entry={{
                  ...entry,
                  animate: entry.animate && entry.id === animatingEntryIdRef.current
                }}
                isMobile={isMobile}
                onAnimationComplete={
                  entry.id === animatingEntryIdRef.current ? 
                  handleAnimationComplete : 
                  undefined
                }
              />
            </div>
          ))}

          {/* Current Input Line - Only show if not processing and no animation is in progress */}
          {canTypeNewCommand && (
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">
                {isMobile ? 'guest$ ' : 'guest@suyash-portfolio:~$ '}
              </span>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent border-none outline-none w-full text-white caret-transparent"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="absolute top-0 left-0 text-white pointer-events-none">
                  {currentInput}
                  <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                    █
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">
                {isMobile ? 'guest$ ' : 'guest@suyash-portfolio:~$ '}
              </span>
              <span className="text-yellow-400">Processing...</span>
              <span className={`ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                █
              </span>
            </div>
          )}
          
          {/* Animation in progress indicator - just a blinking cursor */}
          {!isProcessing && isAnimating && (
            <div className="h-5">
              <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>
                █
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};