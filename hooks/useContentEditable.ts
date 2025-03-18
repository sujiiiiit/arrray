import { useEffect, useRef, useState } from "react";

export const useContentEditable = () => {
  const contentEditableRef = useRef<HTMLDivElement>(null);
  const [hasContent, setHasContent] = useState(false);

  useEffect(() => {
    const checkContent = () => {
      if (contentEditableRef.current) {
        const content = contentEditableRef.current.innerHTML.trim();
        setHasContent(content !== "" && content !== "<br>");
      }
    };

    const handlePaste = (event: ClipboardEvent) => {
      // Prevent default paste behavior to handle it manually
      event.preventDefault();
      
      console.log('Paste event detected!');
      
      // Check if clipboard has items (modern API)
      if (event.clipboardData && event.clipboardData.items) {
        const items = event.clipboardData.items;
        
        console.log(`Number of items in clipboard: ${items.length}`);
        
        // Loop through all items in the clipboard
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          
          console.log(`Item ${i+1} - Type: ${item.type}`);
          
          // Check if the item is a file
          if (item.kind === 'file') {
            const file = item.getAsFile();
            
            if (file) {
              console.log('File detected!');
              console.log('File details:');
              console.log(`- Name: ${file.name}`);
              console.log(`- Size: ${file.size} bytes`);
              console.log(`- Type: ${file.type}`);
              console.log(`- Last Modified: ${new Date(file.lastModified).toLocaleString()}`);
              
              // If it's an image, you could also preview it
              if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                  if (e.target?.result) {
                    console.log('Image preview URL:', e.target.result);
                    // You could also insert the image into the div if needed
                    // const currentDiv = contentEditableRef.current;
                    // if (currentDiv) {
                    //   const imgElement = document.createElement('img');
                    //   imgElement.src = e.target.result as string;
                    //   imgElement.alt = 'Pasted image';
                    //   currentDiv.appendChild(imgElement);
                    // }
                  }
                };
                reader.readAsDataURL(file);
              }
            }
          } 
          // Check if it's text content
          else if (item.kind === 'string') {
            console.log('Text detected!');
            // Get the string content
            item.getAsString((str) => {
              console.log('Text content:', str);
              
              // Insert the text at cursor position
              const selection = window.getSelection();
              const currentDiv = contentEditableRef.current;
              
              if (selection && selection.rangeCount > 0 && currentDiv) {
                const range = selection.getRangeAt(0);
                const textNode = document.createTextNode(str);
                range.deleteContents();
                range.insertNode(textNode);
                
                // Move cursor to the end
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.setStartAfter(textNode);
                newRange.collapse(true);
                selection.addRange(newRange);
                
                // Check content after paste
                checkContent();
              } else if (currentDiv) {
                // If no selection, just append to the end
                currentDiv.textContent = (currentDiv.textContent || '') + str;
                checkContent();
              }
            });
          }
        }
      } 
      // Fallback for older browsers
      else if (event.clipboardData) {
        const text = event.clipboardData.getData('text/plain');
        console.log('Text detected (fallback method)!');
        console.log('Text content:', text);
        
        // Insert text at cursor position
        const currentDiv = contentEditableRef.current;
        if (currentDiv) {
          document.execCommand('insertText', false, text);
          checkContent();
        }
      }
    };

    const contentEditableElement = contentEditableRef.current;
    if (contentEditableElement) {
      contentEditableElement.addEventListener("input", checkContent);
      contentEditableElement.addEventListener("DOMSubtreeModified", checkContent);
      contentEditableElement.addEventListener("paste", handlePaste as EventListener);
    }

    return () => {
      if (contentEditableElement) {
        contentEditableElement.removeEventListener("input", checkContent);
        contentEditableElement.removeEventListener("DOMSubtreeModified", checkContent);
        contentEditableElement.removeEventListener("paste", handlePaste as EventListener);
      }
    };
  }, []);

  return { contentEditableRef, hasContent };
};