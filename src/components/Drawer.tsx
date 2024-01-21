"use client";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import AddEditNoteDialog from "./AddEditNoteDialog";

const Drawer = () => {
  const pathname = usePathname();
  const [showAddEditNoteDialog, setShowAddEditNoteDialog] = useState(false);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu className="" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="flex flex-col items-center">
          <SheetTitle>Edit profile</SheetTitle>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: { width: "2.5rem", height: "2.5rem" },
              },
            }}
          />
          <SheetDescription className="max-w-48">
            {"Make changes to  your profile by clicking the icon above "}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col items-center space-y-10 py-10">
          <Link
            href="/notes"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            note
          </Link>
          <Link
            href="/wilcard"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            wildcard
          </Link>
          <Link
            href="/exam"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            exam
          </Link>
          <Link
            href="/review"
            className="underline-offset-1 hover:scale-105 hover:text-teal-700"
          >
            review
          </Link>
          {pathname.includes("/notes") && (
            <Button onClick={() => setShowAddEditNoteDialog(true)}>
              Add a Note
            </Button>
          )}
          <AddEditNoteDialog
            open={showAddEditNoteDialog}
            setOpen={setShowAddEditNoteDialog}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Drawer;
