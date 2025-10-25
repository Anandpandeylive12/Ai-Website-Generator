"use client";
import React, { useRef, useState } from "react";
import {
    Image as ImageIcon,
    Crop,
    Expand,
    Image as ImageUpscale,
    ImageMinus,
    Loader2Icon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import ImageKit from "imagekit";
import { set, transform } from "zod";

const imagekit = new ImageKit({
    publicKey : process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ,
    privateKey : process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY ,
    urlEndpoint : process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ,
});

const transformOptions = [
    { label: "Smart Crop", value: "smartcrop", icon: <Crop /> ,transformation:`tr-smartcrop` },
    { label: "Resize", value: "resize", icon: <Expand />,transformation:`e-dropshadow`  },
    { label: "Upscale", value: "upscale", icon: <ImageUpscale />,transformation:`e-upscale`  },
    { label: "BG Remove", value: "bgremove", icon: <ImageMinus />,transformation:`e-bgremove`  },
];

function ImageSettingSection({ selectedEl }) {
    const [altText, setAltText] = useState(selectedEl?.alt || "");
    const [width, setWidth] = useState(selectedEl?.width || 300);
    const [height, setHeight] = useState(selectedEl?.height || 200);
    const [borderRadius, setBorderRadius] = useState(selectedEl?.style?.borderRadius || "0px");
    const [preview, setPreview] = useState(selectedEl?.src || "");
    const [activeTransforms, setActiveTransforms] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef(null);

    const toggleTransform = (value) => {
        setActiveTransforms(prev =>
            prev.includes(value)
                ? prev.filter(t => t !== value)
                : [...prev, value]
        );
    };

    // Open file dialog
    const openFileDialog = () => fileInputRef.current?.click();

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            if (selectedEl) selectedEl.src = reader.result;
        };
        reader.readAsDataURL(file);
    };

    // Upload to ImageKit
    const saveUploadedFile = async () => {
    if (!selectedImage) return openFileDialog();

    setLoading(true);
    try {
        const uploaded = await imagekit.upload({
            file: selectedImage,
            fileName: Date.now() + ".png",
            isPublished: true,
        });

        const baseUrl = uploaded.url;
        const newUrl = activeTransforms.length > 0 ? `${baseUrl}?tr=${activeTransforms.join(",")}` : baseUrl;

        setPreview(newUrl);
        if (selectedEl) selectedEl.src = newUrl;

    } catch (err) {
        console.error("Upload failed:", err);
    } finally {
        setLoading(false);
    }
};

    // Apply changes immediately to selected element
    const handleWidthChange = (value) => {
        setWidth(value);
        if (selectedEl) selectedEl.width = value;
    };
    const handleHeightChange = (value) => {
        setHeight(value);
        if (selectedEl) selectedEl.height = value;
    };
    const handleBorderRadiusChange = (value) => {
        setBorderRadius(value);
        if (selectedEl) selectedEl.style.borderRadius = value;
    };
    const handleAltTextChange = (value) => {
        setAltText(value);
        if (selectedEl) selectedEl.alt = value;
    };

    const GenerateAiImage=()=>{
        setLoading(true);

        const url = `https://ik.imagekit.io/v52q2czlw/ik-genimg-prompt-${altText}/${Date.now()}.png?tr=`
        setPreview(url);
         selectedEl.setAttribute("src", url);
         
    }

const applyTransformation = (trValue) => {
    setLoading(true);

    let [baseUrl] = preview.split("?tr=");
    let transforms = [...activeTransforms];

    if (transforms.includes(trValue)) {
        transforms = transforms.filter(t => t !== trValue); // remove
    } else {
        transforms.push(trValue); // add
    }

    const newUrl = transforms.length > 0 ? `${baseUrl}?tr=${transforms.join(",")}` : baseUrl;

    setPreview(newUrl);
    if (selectedEl) selectedEl.src = newUrl;

    // sync activeTransforms with current transforms
    setActiveTransforms(transforms);

    setLoading(false);
};


    return (
        <div className="w-96 shadow p-4 space-y-4">
            <h2 className="flex gap-2 items-center font-bold">
                <ImageIcon /> Image Settings
            </h2>

            {/* Preview */}
            <div className="flex justify-center">
                <img
                    src={preview}
                    alt={altText}
                    className="max-h-40 object-contain border rounded cursor-pointer hover:opacity-80"
                    onClick={openFileDialog}
                    onLoad={()=>setLoading(false)}
                />
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Upload Button */}
            <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={saveUploadedFile}
                disabled={loading}
            >
                {loading && <Loader2Icon className="animate-spin mr-2"/>}
                {selectedImage ? "Upload Image" : "Select & Upload Image"}
            </Button>

            {/* Alt Text */}
            <div>
                <label className="text-sm">Prompt</label>
                <Input
                    type="text"
                    value={altText}
                    onChange={e => handleAltTextChange(e.target.value)}
                    placeholder="Enter alt text"
                    className="mt-1"
                />
            </div>

            <Button className="w-full" onClick={GenerateAiImage}>Generate AI Image</Button>

            {/* Transform Buttons */}
            <div>
                <label className="text-sm mb-1 block">AI Transform</label>
                <div className="flex gap-2 flex-wrap">
                    <TooltipProvider>
                        {transformOptions.map(opt => {
                            const applied = activeTransforms.includes(opt.value);
                            return (
                                <Tooltip key={opt.value}>
                                    <TooltipTrigger asChild>
                                        <Button
                                            type="button"
                                           variant={activeTransforms.includes(opt.transformation) ? "primary" : "outline"}

                                            className="flex items-center justify-center p-2"
                                            onClick={() => applyTransformation(opt.transformation)}

                                        >
                                            {opt.icon}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {opt.label} {applied && "(Applied)"}
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </TooltipProvider>
                </div>
            </div>

            {/* Conditional Resize Inputs */}
            {activeTransforms.includes("resize") && (
                <div className="flex gap-2">
                    <div className="flex-1">
                        <label className="text-sm">Width</label>
                        <Input
                            type="number"
                            value={width}
                            onChange={e => handleWidthChange(Number(e.target.value))}
                            className="mt-1"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="text-sm" >Height</label>
                        <Input
                            type="number"
                            value={height}
                            onChange={e => handleHeightChange(Number(e.target.value))}
                            className="mt-1"
                            
                        />
                    </div>
                </div>
            )}

            {/* Border Radius */}
            <div>
                <label className="text-sm">Border Radius</label>
                <Input
                    type="text"
                    value={borderRadius}
                    onChange={e => handleBorderRadiusChange(e.target.value)}
                    placeholder="e.g. 8px or 50%"
                    className="mt-1"
                />
            </div>
        </div>
    );
}

export default ImageSettingSection;
