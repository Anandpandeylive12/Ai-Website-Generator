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
} from "@/components/ui/sidebar";
import { UserDetailContext } from "@/context/userDetailContext";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { set } from "zod";

const AppSidebar = () => {
  const [ProjectList, setProjectList] = useState([]);
  const { userDetail } = useContext(UserDetailContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetProjectList();
  }, []);

  const GetProjectList = async () => {
    try {
        setLoading(true);
      const result = await axios.get("/api/get-all-projects");
      console.log("Projects:", result.data);
      setProjectList(result.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  return (
    <Sidebar>
      {/* Sidebar Header */}
      <SidebarHeader>
        <div className="flex items-center gap-1 p-4">
          <Image src="/logo.svg" alt="Logo" width={30} height={30} />
          <h2 className="font-bold text-lg">AI Website Generator</h2>
        </div>
        <Link href={"/workspace"} className="w-full mt-2">
          <Button className="w-full cursor-pointer">+ Add New Project</Button>
        </Link>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="font-bold">Projects</SidebarGroupLabel>

          {ProjectList.length === 0 && (
            <p className="text-sm mt-3 px-2 text-gray-500">No Projects Found</p>
          )}

        <div>
  {!loading && ProjectList.length > 0 ? (
    ProjectList.map((project, index) => {
      const firstMessage =
        project.chats?.[0]?.chatMessages?.[0]?.content || "No message";

      return (
        <Link
          href={`/playground/${project.projectId}?frameId=${project.frameId}`}
          key={index}
          className="my-2 hover:bg-secondary p-2 rounded-lg cursor-pointer block"
        >
          <h2 className="line-clamp-1">{firstMessage}</h2>
        </Link>
      );
    })
  ) : !loading && ProjectList.length === 0 ? (
    <p className="text-sm mt-3 px-2 text-gray-500">No Projects Found</p>
  ) : (
    // Skeleton loader while loading
    [1, 2, 3, 4, 5].map((_, index) => (
      <div
        key={index}
        className="w-full h-10 bg-gray-200 animate-pulse rounded-lg mt-2"
      />
    ))
  )}
</div>


        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="p-2">
        <div className="p-3 border rounded-xl space-y-3 bg-secondary">
          <h2>
            Remaining Credits:{" "}
            <span className="font-bold">{userDetail?.credits ?? 0}</span>
          </h2>

          <Progress
            value={userDetail?.credits ?? 0}
            max={10}
            className="mt-2"
          />
          <Button className="w-full">Upgrade Plan</Button>
        </div>

        <div className="mt-5 flex items-center gap-8">
          <UserButton />
          <Button variant={"outline"}>Settings</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
