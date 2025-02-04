import React, { useState, useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const RichTextEditor = ({ input, setInput }) => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  // First useEffect to initialize Quill
  useEffect(() => {
    if (!editorRef.current) {
      const toolbarOptions = [
        [{ header: [1, 2, 3, false] }],
        [
          "bold",
          "italic",
          "underline",
          "link",
          { list: "ordered" },
          { list: "bullet" },
        ],
      ];

      // Initialize Quill
      editorRef.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: toolbarOptions,
        },
      });

      // Handle text changes with debounce
      let timeoutId;
      const handleTextChange = () => {
        const newContent = editorRef.current.root.innerHTML;

        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Set a new timeout to update the input
        timeoutId = setTimeout(() => {
          setInput((prev) => ({
            ...prev,
            description: newContent,
          }));
        }, 100);
      };

      // Add the change handler to text-change event
      editorRef.current.on("text-change", handleTextChange);
    }

    // Cleanup
    return () => {
      if (editorRef.current) {
        editorRef.current.off("text-change");
      }
    };
  }, []); // Empty dependency array for initial setup

  // Second useEffect to handle content updates
  useEffect(() => {
    if (editorRef.current && input.description !== undefined) {
      const currentContent = editorRef.current.root.innerHTML;
      if (currentContent !== input.description) {
        editorRef.current.root.innerHTML = input.description;
      }
    }
  }, [input.description]); // Dependency on input.description

  return (
    <div className="editor-container">
      <div ref={quillRef}></div>
    </div>
  );
};

export default RichTextEditor;
