"use client";
import AddEditNoteDialog from "@/components/AddEditNoteDialog";
import Drawer from "@/components/Drawer";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { Globe, Menu, Plus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function Navbar() {
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  // const addNote = async () => {
  //   const response = await fetch("/api/notes", {
  //     method: "POST",
  //     body: JSON.stringify({
  //       title: "CSA",
  //       description: "this is my description",
  //     }),
  //   });
  //   if (response.ok) {
  //     alert("we succeed");
  //   }
  //   if (!response.ok) {
  //     alert("we failed");
  //   }
  // };
  return (
    <>
      <div className="z-10 bg-white p-4 shadow">
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

            <div className="hidden font-semibold md:flex md:space-x-5 lg:flex lg:space-x-5">
              <Link href="/notes">note</Link>
              <Link href="/wildcard">wildcard</Link>
              <Link href="/exam">exam</Link>
              <Link href="/review">review</Link>
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
            <Button
              onClick={() => setShowAddEditNoteDialog(true)}
              // onClick={addNote}
              className="bg hidden scale-75 bg-teal-500 md:flex lg:flex xl:flex "
            >
              <Plus size={20} />
            </Button>
          </div>
        </div>
      </div>
      <AddEditNoteDialog
        open={showAddEditNoteDialog}
        setOpen={setShowAddEditNoteDialog}
      />
    </>
  );
}
