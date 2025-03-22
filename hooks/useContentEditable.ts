import { useEffect, useRef, useState, useCallback } from "react";

interface UseContentEditableProps {
  onSubmit: (content: string) => void;
}

export const useContentEditable = ({ onSubmit }: UseContentEditableProps) => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [hasContent, setHasContent] = useState(false);

  // Memoized function to check content
  const checkContent = useCallback(() => {
    const content = contentEditableRef.current?.innerText.trim();
    setHasContent(!!content && content !== "<br>");
    if (textAreaRef.current && contentEditableRef.current) {
      textAreaRef.current.value = contentEditableRef.current.innerText;
    }
  }, []);

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
      onSubmit(contentEditableRef.current?.innerText || "");
    }
  }, [onSubmit]);

  const handlePaste = useCallback((e: ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain");
    document.execCommand("insertText", false, text);
    if (textAreaRef.current && contentEditableRef.current) {
      textAreaRef.current.value = contentEditableRef.current.innerText;
    }
  }, []);

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

  return { contentEditableRef, textAreaRef, hasContent };
};