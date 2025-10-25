import { Button } from "@/components/ui/button";
import { OnSaveContext } from "@/context/OnSaveContext";
import Image from "next/image";
import React, { useContext } from 'react'

const PlaygroundHeader = () => {
  const {OnSaveData , setOnSaveData }=useContext(OnSaveContext)
  return (
    <div className="flex items-center justify-between p-4 shadow-md">
         <Image src="/logo.svg" alt="Logo" width={40} height={40} />
         <Button onClick={()=>setOnSaveData(Date.now())} >
            Save
         </Button>
    </div>
  )
}

export default PlaygroundHeader