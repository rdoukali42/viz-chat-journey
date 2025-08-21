import React, { useEffect, useRef } from 'react';

interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSend, placeholder, disabled, className }) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // autosize
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 300)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isEnter = e.key === 'Enter';
    const isMod = e.metaKey || e.ctrlKey;
    if (isEnter && isMod) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      className={
        `resize-none overflow-hidden min-h-[44px] max-h-[300px] p-3 rounded-md border border-border bg-transparent focus:outline-none focus:ring-0 ${className || ''}`
      }
      rows={1}
    />
  );
};

export default ChatInput;
