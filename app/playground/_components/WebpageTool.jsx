import { Button } from '@/components/ui/button'
import SyntaxHighlighter from 'react-syntax-highlighter';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Code2Icon, CopyIcon, Download, ExternalLink, Ghost, Monitor, TabletIcon, TabletSmartphone } from 'lucide-react'
import React, { useEffect, useState } from 'react'
// import ViewCodeBlock from './ViewCodeBlock';
import { fi } from 'zod/v4/locales';
import { toast } from 'sonner';
export const HTML_CODE = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="description" content="AI Website Builder - Modern TailwindCSS + Flowbite Template">
          <title>AI Website Builder</title>

          <!-- Tailwind CSS -->
          <script src="https://cdn.tailwindcss.com"></script>

          <!-- Flowbite CSS & JS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

          <!-- Font Awesome / Lucide -->
          <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

          <!-- Chart.js -->
          <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

          <!-- AOS -->
          <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
          <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>

          <!-- GSAP -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

          <!-- Lottie -->
          <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.11.2/lottie.min.js"></script>

          <!-- Swiper -->
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
          <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

          <!-- Tippy.js -->
          <link rel="stylesheet" href="https://unpkg.com/tippy.js@6/dist/tippy.css" />
          <script src="https://unpkg.com/@popperjs/core@2"></script>
          <script src="https://unpkg.com/tippy.js@6"></script>
      </head>
      <body id="root">
      {code}
      </body>
      </html>`;

const WebpageTool = ({ selectedScreenSize, setselectedScreenSize, generatedCode }) => {

  const handleCopy = async() => {
    await navigator.clipboard.writeText(finalCode); 
    toast.success('Code copied to clipboard!');
  }

  const [finalCode, setFinalCode] = useState('');

  useEffect(() => {
    const cleanCode = (HTML_CODE.replace('{code}', generatedCode) || '').replaceAll('```html', '').replace('', '```').replaceAll('html', '');

    setFinalCode(cleanCode)
  }, [generatedCode])


  const ViewInNewTab = () => {
    if (!finalCode) return;


    const blob = new Blob([finalCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

    const downloadCode = () => {
      const blob = new Blob([finalCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-webpage.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    }

  return (
    <div className='p-2 shadow rounded-xl flex justify-between items-center '>
      <div className='flex gap-2'>
        <Button
          className={`${selectedScreenSize === 'web' ? 'border border-primary' : null}` + ' cursor-pointer'}
          variant={Ghost} onClick={() => setselectedScreenSize('web')}><Monitor /></Button>
        <Button
          className={`${selectedScreenSize == 'mobile' ? 'border border-primary' : null}` + ' cursor-pointer'}
          variant={Ghost} onClick={() => setselectedScreenSize('mobile')}><TabletSmartphone /></Button>
      </div>
      <div className='flex flex-row gap-2'>
        <Button className={'cursor-pointer'} variant={Ghost} onClick={() => ViewInNewTab()}>View<ExternalLink /></Button>
       <Dialog>
  <DialogTrigger asChild>
    <Button
      variant="outline"
      className="flex items-center gap-2 cursor-pointer transition hover:bg-muted"
    >
      View Code <Code2Icon size={16} />
    </Button>
  </DialogTrigger>

  <DialogContent className="max-w-3xl bg-white shadow-xl rounded-lg border p-6">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold flex  items-center justify-between  gap-2 ">
        View Generated Code <span><Button className={'mt-2 cursor-pointer'} onClick={handleCopy}><CopyIcon/></Button></span>
      </DialogTitle>
    </DialogHeader>

    <div className="mt-4 rounded-lg bg-gray-900 text-white overflow-auto max-h-[500px] text-sm">
      <SyntaxHighlighter language="html">
        {finalCode}
      </SyntaxHighlighter>
    </div>
  </DialogContent>
</Dialog>

        <Button onClick={downloadCode} className={'cursor-pointer'}>Export<Download /></Button>

      </div>
    </div>
  )
}

export default WebpageTool