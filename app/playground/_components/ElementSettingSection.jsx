import { SwatchBook, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from '@/components/ui/button';

function ElementSettingSection({ selectedEl, clearSelection }) {
  const [fontSize, setFontSize] = useState('24');
  const [textColor, setTextColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [borderRadius, setBorderRadius] = useState('');
  const [padding, setPadding] = useState('');
  const [margin, setMargin] = useState('');
  const [align, setAlign] = useState('left');
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState('');

  // Apply style helper
  const applyStyle = (property, value) => {
    if (!selectedEl) return;
    selectedEl.style[property] = value;
  };

  // Sync state when element changes
  useEffect(() => {
    if (!selectedEl) return;

    // Font size
    setFontSize(parseInt(selectedEl.style.fontSize) || 24);
    setTextColor(selectedEl.style.color || '#000000');
    setBackgroundColor(selectedEl.style.backgroundColor || '#ffffff');
    setBorderRadius(selectedEl.style.borderRadius || '');
    setPadding(selectedEl.style.padding || '');
    setMargin(selectedEl.style.margin || '');
    setAlign(selectedEl.style.textAlign || 'left');

    // Classes safely
    const classString = typeof selectedEl.className === 'string' ? selectedEl.className : '';
    const currentClasses = classString.split(' ').filter(c => c.trim() !== '');
    setClasses(currentClasses);

    // Observe class changes
    const observer = new MutationObserver(() => {
      const updatedString = typeof selectedEl.className === 'string' ? selectedEl.className : '';
      const updated = updatedString.split(' ').filter(c => c.trim() !== '');
      setClasses(updated);
    });

    observer.observe(selectedEl, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [selectedEl]);

  // Class handlers
  const addClass = () => {
    const trimmed = newClass.trim();
    if (!trimmed) return;
    if (!classes.includes(trimmed)) {
      const updated = [...classes, trimmed];
      setClasses(updated);
      if (selectedEl) selectedEl.className = updated.join(' ');
    }
    setNewClass('');
  };

  const removeClass = (cls) => {
    const updated = classes.filter(c => c !== cls);
    setClasses(updated);
    if (selectedEl) selectedEl.className = updated.join(' ');
  };

  return (
    <div className='w-96 p-4 space-y-4'>
      <h2 className='flex gap-2 items-center font-bold'>
        <SwatchBook /> Settings
      </h2>

      {/* Font Size + Text Color */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className='text-sm'>Font Size</label>
          <Select
            value={fontSize}
            onValueChange={(val) => {
              setFontSize(val);
              applyStyle('fontSize', val + 'px');
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(53)].map((_, i) => {
                const size = (i + 12).toString();
                return <SelectItem key={i} value={size}>{size}px</SelectItem>;
              })}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className='text-sm block'>Text Color</label>
          <input
            type='color'
            className='w-[40px] h-[40px] rounded-lg mt-1'
            value={textColor}
            onChange={(e) => {
              setTextColor(e.target.value);
              applyStyle('color', e.target.value);
            }}
          />
        </div>
      </div>

      {/* Alignment */}
      <div>
        <label className="text-sm mb-1 block">Text Alignment</label>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={(val) => {
            setAlign(val);
            applyStyle('textAlign', val);
          }}
          className="bg-gray-100 rounded-lg p-1 inline-flex w-full justify-between"
        >
          <ToggleGroupItem value="left" className="p-2 rounded hover:bg-gray-200 flex-1"><AlignLeft size={20} /></ToggleGroupItem>
          <ToggleGroupItem value="center" className="p-2 rounded hover:bg-gray-200 flex-1"><AlignCenter size={20} /></ToggleGroupItem>
          <ToggleGroupItem value="right" className="p-2 rounded hover:bg-gray-200 flex-1"><AlignRight size={20} /></ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Background + Border Radius */}
      <div className="flex items-center gap-4">
        <div>
          <label className='text-sm block'>Background</label>
          <input
            type='color'
            className='w-[40px] h-[40px] rounded-lg mt-1'
            value={backgroundColor}
            onChange={(e) => {
              setBackgroundColor(e.target.value);
              applyStyle('backgroundColor', e.target.value);
            }}
          />
        </div>
        <div className="flex-1">
          <label className='text-sm'>Border Radius</label>
          <Input
            type='text'
            placeholder='e.g. 8px'
            value={borderRadius}
            onChange={(e) => {
              setBorderRadius(e.target.value);
              applyStyle('borderRadius', e.target.value);
            }}
            className='mt-1'
          />
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className='text-sm'>Padding</label>
        <Input
          type='text'
          placeholder='e.g. 10px 15px'
          value={padding}
          onChange={(e) => {
            setPadding(e.target.value);
            applyStyle('padding', e.target.value);
          }}
          className='mt-1'
        />
      </div>

      {/* Margin */}
      <div>
        <label className='text-sm'>Margin</label>
        <Input
          type='text'
          placeholder='e.g. 10px 15px'
          value={margin}
          onChange={(e) => {
            setMargin(e.target.value);
            applyStyle('margin', e.target.value);
          }}
          className='mt-1'
        />
      </div>

      {/* Classes */}
      <div>
        <label className="text-sm font-medium">Classes</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {classes.length > 0 ? (
            classes.map(cls => (
              <span key={cls} className="flex items-center gap-1 px-2 py-1 text-sm rounded-full bg-gray-100 border">
                {cls}
                <button onClick={() => removeClass(cls)} className="ml-1 text-red-500 hover:text-red-700">×</button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">No classes applied</span>
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Input
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Add class..."
          />
          <Button type="button" onClick={addClass}>Add</Button>
        </div>
      </div>
    </div>
  );
}

export default ElementSettingSection;
