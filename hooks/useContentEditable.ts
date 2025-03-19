import { useEffect, useRef, useState, useCallback } from "react";

export const useContentEditable = () => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  // Memoized function to check content
  const checkContent = useCallback(() => {
    const content = contentEditableRef.current?.innerHTML.trim();
    setHasContent(!!content && content !== "<br>");
  }, []);

  // Handle paste event efficiently
  const handlePaste = useCallback((event: ClipboardEvent) => {
    event.preventDefault();

    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const items = clipboardData.items;
    const currentDiv = contentEditableRef.current;

    if (!items || !currentDiv) return;

    for (const item of items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file && file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            console.log("Pasted image URL:", e.target?.result);
          };
          reader.readAsDataURL(file);
        }
      } else if (item.kind === "string") {
        item.getAsString((text) => {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);
          } else {
            currentDiv.textContent += text;
          }
          checkContent();
        });
      }
    }
  }, [checkContent]);

  useEffect(() => {
    const contentEditableElement = contentEditableRef.current;
    if (!contentEditableElement) return;

    contentEditableElement.addEventListener("input", checkContent);
    contentEditableElement.addEventListener("paste", handlePaste as EventListener);

    return () => {
      contentEditableElement.removeEventListener("input", checkContent);
      contentEditableElement.removeEventListener("paste", handlePaste as EventListener);
    };
  }, [checkContent, handlePaste]);

  return { contentEditableRef, hasContent };
};
