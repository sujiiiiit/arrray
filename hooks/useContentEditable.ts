import { useEffect, useRef, useState, useCallback } from "react";

interface UseContentEditableProps {
  onSubmit: (content: string) => void;
  onChange?: (content: string) => void;
  initialValue?: string;
}

export const useContentEditable = ({ 
  onSubmit, 
  onChange, 
  initialValue = "" 
}: UseContentEditableProps) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [hasContent, setHasContent] = useState(!!initialValue);

  // Initialize with initial value if provided
  useEffect(() => {
    if (initialValue && contentEditableRef.current) {
      contentEditableRef.current.innerText = initialValue;
      if (textAreaRef.current) {
        textAreaRef.current.value = initialValue;
      }
      setHasContent(!!initialValue.trim());
    }
  }, [initialValue]);

  // Memoized function to check content and update state/sync with textarea
  const checkContent = useCallback(() => {
    if (!contentEditableRef.current) return;
    
    const content = contentEditableRef.current.innerText.trim();
    const isEmpty = content === " " ||content === "" || content === "<br>";
    setHasContent(!isEmpty);
    
    if (textAreaRef.current) {
      // Always sync the raw content (not trimmed) to maintain spaces
      textAreaRef.current.value = contentEditableRef.current.innerText;
    }
    
    // Notify parent component of changes if onChange handler is provided
    if (onChange) {
      onChange(contentEditableRef.current.innerText);
    }
  }, [onChange]);

  // Handle keydown for preventing a leading blank space and triggering submit on Enter (without Shift)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent starting with a blank space
    if (
      contentEditableRef.current && 
      contentEditableRef.current.textContent === "" &&
      e.key === " "
    ) {
      e.preventDefault();
      return;
    }

    // Trigger submit when Enter is pressed without Shift
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const content = contentEditableRef.current?.innerText || "";
      if (content.trim()) {
        onSubmit(content);
      }
    }
  }, [onSubmit]);

  // Handle paste events for text
  const handlePaste = useCallback((e: ClipboardEvent) => {
    // Don't prevent default here to allow file paste events to bubble up
    // to the component's own handlePaste
    
    // Only handle plain text paste here
    if (!e.clipboardData?.types.includes('Files')) {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain");
      document.execCommand("insertText", false, text);
      
      if (textAreaRef.current && contentEditableRef.current) {
        textAreaRef.current.value = contentEditableRef.current.innerText;
      }
      checkContent();
    }
  }, [checkContent]);

  useEffect(() => {
    const contentEditableElement = contentEditableRef.current;
    if (!contentEditableElement) return;

    contentEditableElement.addEventListener("input", checkContent);
    contentEditableElement.addEventListener("keydown", handleKeyDown);
    contentEditableElement.addEventListener("paste", handlePaste);

    return () => {
      contentEditableElement.removeEventListener("input", checkContent);
      contentEditableElement.removeEventListener("keydown", handleKeyDown);
      contentEditableElement.removeEventListener("paste", handlePaste);
    };
  }, [checkContent, handleKeyDown, handlePaste]);

  // Clear the content
  const clearContent = useCallback(() => {
    if (contentEditableRef.current) {
      contentEditableRef.current.innerText = "";
    }
    if (textAreaRef.current) {
      textAreaRef.current.value = "";
    }
    setHasContent(false);
  }, []);

  // Get current text content
  const getText = useCallback(() => {
    return textAreaRef.current?.value || contentEditableRef.current?.innerText || "";
  }, []);

  // Set text content programmatically
  const setText = useCallback((text: string) => {
    if (contentEditableRef.current) {
      contentEditableRef.current.innerText = text;
      if (textAreaRef.current) {
        textAreaRef.current.value = text;
      }
      setHasContent(!!text.trim());
    }
  }, []);

  return { 
    contentEditableRef, 
    textAreaRef, 
    hasContent,
    clearContent,
    getText,
    setText
  };
};