"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import WebpageTool, { HTML_CODE } from "./WebpageTool";
import ElementSettingSection from "./ElementSettingSection";
import ImageSettingSection from "./ImageSettingSection";
import { OnSaveContext } from "@/context/OnSaveContext";
import axios from "axios";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";


function WebsiteDesign({ generatedCode }) {
  const iframeRef = useRef(null);
  const [selectedScreenSize, setselectedScreenSize] = useState("web");
  const [selectedEl, setSelectedEl] = useState(null);
  const { OnSaveData, setOnSaveData } = useContext(OnSaveContext);
   const { projectId } = useParams();
    const params = useSearchParams();
    const frameId = params.get("frameId");

  useEffect(() => {
    if (!iframeRef.current) return;
    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // Inject HTML
    doc.open();
    doc.write(HTML_CODE.replace("{code}", generatedCode || ""));
    doc.close();

    // Wait until body exists
    const waitForBody = () => {
      if (!doc.body) {
        requestAnimationFrame(waitForBody);
        return;
      }

      let hoverEl = null;
      let selectedElement = null;

      const handleMouseOver = (e) => {
        if (selectedElement) return;
        const target = e.target;
        if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
        hoverEl = target;
        hoverEl.style.outline = "2px dotted blue";
      };

      const handleMouseOut = (e) => {
        if (selectedElement) return;
        if (hoverEl) hoverEl.style.outline = "";
        hoverEl = null;
      };

      const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = e.target;
        if (selectedElement && selectedElement !== target) {
          selectedElement.style.outline = "";
          selectedElement.removeAttribute("contenteditable");
        }
        selectedElement = target;
        selectedElement.style.outline = "2px solid red";
        selectedElement.setAttribute("contenteditable", "true");
        selectedElement.focus();
        selectedElement.addEventListener("blur", handleBlur);
        console.log("Selected element:", selectedElement);
        setSelectedEl(selectedElement);
      };

      const handleBlur = () => {
        if (selectedElement)
          console.log("Final edited element:", selectedElement.outerHTML);
      };

      const handleKeyDown = (e) => {
        if (e.key === "Escape" && selectedElement) {
          selectedElement.style.outline = "";
          selectedElement.removeAttribute("contenteditable");
          selectedElement.removeEventListener("blur", handleBlur);
          selectedElement = null;
        }
      };

      doc.body.addEventListener("mouseover", handleMouseOver);
      doc.body.addEventListener("mouseout", handleMouseOut);
      doc.body.addEventListener("click", handleClick);
      doc.addEventListener("keydown", handleKeyDown);

      // Cleanup
      return () => {
        if (doc.body) {
          doc.body.removeEventListener("mouseover", handleMouseOver);
          doc.body.removeEventListener("mouseout", handleMouseOut);
          doc.body.removeEventListener("click", handleClick);
          doc.removeEventListener("keydown", handleKeyDown);
        }
      };
    };

    waitForBody();
  }, [generatedCode]);

  useEffect(() => {
    OnSaveData && onSaveCode();
  }, [OnSaveData]);

 
const onSaveCode = async () => {
  if (!iframeRef.current) return;

  try {
    const iframeDoc =
      iframeRef.current.contentDocument ||
      iframeRef.current.contentWindow.document;
    if (!iframeDoc) return;

    // Clone the entire document
    const cloneDoc = iframeDoc.documentElement.cloneNode(true);

    // Remove all outlines and cursors
    const allElements = cloneDoc.querySelectorAll("*");
    allElements.forEach((el) => {
      el.style.outline = "";
      el.style.cursor = "";
    });

    const html = cloneDoc.outerHTML;

    // Save to database via API
    await axios.put("/api/frames", {
      newCode: html,          // raw HTML string
      frameId,                // ensure this is defined in your component
      projectId,              // ensure this is defined in your component
      title: "AI Generated Website",
    });

    // Update local state/context
    setOnSaveData && setOnSaveData(html);

    toast.success("Website saved successfully!");
  } catch (error) {
    console.error("Failed to save website:", error);
    toast.error("Failed to save website");
  }
};

  return (
    <div className="flex gap-2 w-full">
      <div className="p-5 w-full flex justify-center items-center flex-col">
        <iframe
          ref={iframeRef}
          className={`${
            selectedScreenSize === "web" ? "w-full" : "w-130"
          } h-full border-2 rounded-xl`}
          sandbox="allow-scripts allow-same-origin"
        />
        <WebpageTool
          selectedScreenSize={selectedScreenSize}
          setselectedScreenSize={(v) => setselectedScreenSize(v)}
          generatedCode={generatedCode}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onSaveCode}
        >
          Save HTML
        </button>
      </div>
      {selectedEl?.tagName === "IMG" ? (
        <ImageSettingSection selectedEl={selectedEl} />
      ) : selectedEl ? (
        <ElementSettingSection
          selectedEl={selectedEl}
          clearSection={() => setSelectedEl(null)}
        />
      ) : null}
    </div>
  );
}

export default WebsiteDesign;
