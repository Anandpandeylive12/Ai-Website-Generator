import { Settings2, SwatchBook } from 'lucide-react'
import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ElementSettingSection = () => {
  return (
    <div className='flex flex-col w-96 shadow-xl p-4'>
      <h2 className='flex flex-col gap-2 item-center font-bold'>

       <SwatchBook/> Settings
      </h2>
      <lable className=''>Font Size</lable>
      <Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
    </div>
  )
}

export default ElementSettingSection