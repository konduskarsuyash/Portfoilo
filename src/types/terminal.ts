export interface TerminalHistory {
  id: number;
  type: 'command' | 'output' | 'error';
  content: string;
  timestamp: Date;
  animate?: boolean;
}

export interface CommandResult {
  type: 'output' | 'error' | 'clear' | 'exit';
  content: string;
  animate: boolean;
}