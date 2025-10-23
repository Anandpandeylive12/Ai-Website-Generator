import React, { useEffect, useRef, useState } from "react";
import WebpageTool, { HTML_CODE } from "./WebpageTool";
import ElementSettingSection from "./ElementSettingSection";

function WebsiteDesign({ generatedCode }) {
  const iframeRef = useRef(null);
  const [selectedScreenSize, setselectedScreenSize] = useState("web");

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
      requestAnimationFrame(waitForBody); // check again on next frame
      return;
    }

    let hoverEl = null;
    let selectedEl = null;

    const handleMouseOver = (e) => {
      if (selectedEl) return;
      const target = e.target;
      if (hoverEl && hoverEl !== target) hoverEl.style.outline = "";
      hoverEl = target;
      hoverEl.style.outline = "2px dotted blue";
    };

    const handleMouseOut = (e) => {
      if (selectedEl) return;
      if (hoverEl) hoverEl.style.outline = "";
      hoverEl = null;
    };

    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target;
      if (selectedEl && selectedEl !== target) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
      }
      selectedEl = target;
      selectedEl.style.outline = "2px solid red";
      selectedEl.setAttribute("contenteditable", "true");
      selectedEl.focus();
      selectedEl.addEventListener("blur", handleBlur);
      console.log("Selected element:", selectedEl);
    };

    const handleBlur = () => {
      if (selectedEl) console.log("Final edited element:", selectedEl.outerHTML);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedEl) {
        selectedEl.style.outline = "";
        selectedEl.removeAttribute("contenteditable");
        selectedEl.removeEventListener("blur", handleBlur);
        selectedEl = null;
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
    </div>
    <ElementSettingSection/>
    </div>
  );
}

export default WebsiteDesign;
