"use client";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import Typewriter from "@/components/ui/Typewriter";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowUpIcon,
  HomeIcon,
  ImagePlusIcon,
  KeyIcon,
  LayoutDashboard,
  Loader2Icon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const suggestions = [
  { label: "Dashboard", prompt: "Create an analytics dashboard...", icon: LayoutDashboard },
  { label: "SignUp Form", prompt: "Create a modern sign up form...", icon: KeyIcon },
  { label: "Hero", prompt: "Create a modern header and centered hero section...", icon: HomeIcon },
  { label: "User Profile Card", prompt: "Create a modern user profile card...", icon: UserIcon },
];

const generateRandomFrameNumber=()=>{
  const num = Math.floor(100000 + Math.random() * 900000).toString();
  return num;
}

const Hero = () => {
  const [userInput, setUserInput] = useState("");
  const router = useRouter();
  const [Loading, setLoading] = useState(false);


   const CreateNewProject=async()=>{
    setLoading(true);
    const projectId=uuidv4();
    const frameId=generateRandomFrameNumber();
    try {
      const result = await axios.post("/api/projects",{
        projectId:projectId,
        frameId:frameId,
        messages:[{role:"user",content:userInput}]
      })
      toast.success("Project Created Successfully!");
      console.log(result.data );
      //Navigate to Playground
      router.push(`/playground/${projectId}?frameId=${frameId}`);
      setLoading(false);
    } catch (error) {
      toast.error("Internal Server Error!");
      console.log(error);
      setLoading(false);
    }
   }
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 lg:px-0 mt-10">
      {/* Header and description */}
      <h2 className="font-bold text-4xl sm:text-5xl md:text-6xl text-center">
        What Should We Design?
      </h2>
      <p className="mt-2 text-lg sm:text-xl text-gray-500 text-center max-w-2xl">
       <Typewriter text ="Generate , Edit, & Explore Design With AI, Export Code as well " speed={100}/>
      </p>

      {/* Input box */}
      <div className="w-full max-w-2xl bg-gray-50 rounded-xl shadow-2xl p-4 mt-6 flex flex-col gap-2">
        <textarea
          className="w-full h-32 sm:h-36 border-2 border-gray-300 rounded-md p-4 pr-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. Design a modern website for a tech startup"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        
        <div className="flex justify-between items-center mt-2">
          <Button variant="ghost" className="p-2 cursor-pointer">
            <ImagePlusIcon className="w-5 h-5" />
          </Button>

          
          <SignInButton mode="modal" forceRedirectUrl="/workspace">
            <Button disabled={!userInput || Loading} className="p-2 cursor-pointer" onClick={CreateNewProject}>
             {Loading?<Loader2Icon className='animate-spin'/>: <ArrowUpIcon className="w-5 h-5" />}
            </Button>
          </SignInButton>
        </div>
      </div>

      {/* Suggestion list */}
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {suggestions.map((suggestion, index) => (
          <Button
            onClick={() => setUserInput(suggestion.prompt)}
            className="bg-gray-50 shadow-2xl"
            key={index}
            variant="ghost"
          >
            <suggestion.icon className="mr-2 h-4 w-4" />
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Hero;
