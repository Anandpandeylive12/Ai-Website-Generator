"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { UserDetailContext } from "@/context/userDetailContext";
import { UserButton } from "@clerk/nextjs";
import { Ghost } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

const AppSidebar = () => {
    const [ProjectList, setProjectList] = useState([]);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-1 p-4">
                    <Image src="/logo.svg" alt="Logo" width={30} height={30} />
                    <h2 className="font-bold text-lg">AI Website Generator</h2>
                </div>
                <Link href={'/workspace'} className="w-full mt-2">
                    <Button className='w-full cursor-pointer'>+ Add New Project</Button>
                </Link>
            </SidebarHeader>

            <SidebarContent className='p-2'>
                <SidebarGroup>
                    <SidebarGroupLabel className='font-bold'>Projects</SidebarGroupLabel>
                    {ProjectList.length === 0 &&
                        <p className="text-sm mt-3 px-2 text-gray-500">No Projects Found</p>
                    }
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className='p-2'>
                <div className="p-3 border rounded-xl space-y-3 bg-secondary">

                    <h2>
                        Remaining Credits: <span className="font-bold">{userDetail?.credits ?? 0}</span>
                    </h2>

                    <Progress value={userDetail?.credits ?? 0} max={100} className="mt-2" />
                    <Button  className="w-full">Upgrade Plan</Button>
                </div>
                <div className="mt-5 flex items-center gap-8">
                    <UserButton/>
                    <Button variant={'outline'}>Settings</Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}

export default AppSidebar;