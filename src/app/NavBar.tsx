"use client";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import Drawer from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Globe, Menu, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

export default function Navbar() {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  const pathname = usePathname();
  return (
    <>
      <div className="absolute left-0 right-0 top-0 -z-10 bg-[rgba(255,255,255,0.15)] p-4 shadow-sm">
        <div className="m-auto flex max-w-7xl flex-wrap items-center justify-between">
          <Link href="/notes">
            <div className="flex space-x-2">
              <Globe className="flex rotate-45 scale-110 text-teal-500" />
              <span className="font-bold">Study Mate</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 space-x-5 font-semibold">
            <div className="flex md:hidden lg:hidden xl:hidden">
              <Drawer />
            </div>

            <div className="hidden items-center font-semibold md:flex md:space-x-5 lg:flex lg:space-x-5">
              <Link
                href="/notes"
                className="uderline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                note
              </Link>
              <Link
                href="/wildcard"
                className="uderline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                wildcard
              </Link>
              <Link
                href="/exam"
                className="uderline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                exam
              </Link>
              <Link
                href="/review"
                className="uderline-offset-1 hover:scale-105 hover:text-teal-700"
              >
                review
              </Link>
              {pathname == "/" && (
                <Button
                  className="rounded-full bg-white px-8 py-4 text-slate-800 hover:text-white"
                  asChild
                >
                  <Link href="/notes">registration</Link>
                </Button>
              )}
            </div>
            <div className="hidden md:flex lg:flex xl:flex">
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: { width: "2.5rem", height: "2.5rem" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
