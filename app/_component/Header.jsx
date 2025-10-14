"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, Menu, X } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const menuOptions = [
  { name: "About", path: "/about" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full shadow bg-white">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" height={35} width={35} />
          <h2 className="font-bold text-xl">AI Website Generator</h2>
        </div>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-4">
          {menuOptions.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="cursor-pointer shadow-none"
            >
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Get Started button */}
        <div className="hidden md:block">
        <SignInButton mode="modal" forceRedirectUrl="/workspace">
  <Link href="/workspace">
    <Button>Get Started <ArrowBigRight className="ml-1" /></Button>
  </Link>
</SignInButton>

        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-2">
          {menuOptions.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full text-left shadow-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </Button>
          ))}
          <Button className="w-full mt-2 flex items-center justify-center">
            Get Started <ArrowBigRight className="ml-1" />
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
