"use client";
import { Note } from "@prisma/client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { BookmarkCheck, Clock } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { validateHeaderValue } from "http";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}
const SetTimer = ({ open, setOpen, noteToEdit }: AddEditNoteDialogProps) => {
  const [timeValue, setTimeValue] = useState<number>(0);
  const [error, setError] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Timer</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Exam Topic</CardTitle>
            <CardDescription>Start your exam in one-click.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <div className="flex">
                  <div className="flex items-center space-x-1 rounded-sm bg-red-500 px-2 text-sm text-white">
                    <BookmarkCheck />
                    <span>{noteToEdit?.title}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label
                  htmlFor="framework"
                  className=" mb-2 flex items-center space-x-1"
                >
                  <span>Set your timer</span>
                  <Clock size={12} />
                </Label>
                <Select onValueChange={(value) => setTimeValue(Number(value))}>
                  <SelectTrigger id="framework">
                    <SelectValue
                      placeholder="Select"
                      className="border-transparent focus:border-transparent focus:ring-0"
                    />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    <SelectItem value="30000">30 s</SelectItem>
                    <SelectItem value="300000">05 min</SelectItem>
                    <SelectItem value="600000">10 min</SelectItem>
                    <SelectItem value="900000">15 min</SelectItem>
                    <SelectItem value="1200000">20 min</SelectItem>
                    <SelectItem value="1800000">30 min</SelectItem>
                    <SelectItem value="3600000">60 min</SelectItem>
                    <SelectItem value="5400000">1.5 h</SelectItem>
                    <SelectItem value="7200000">2.0 h</SelectItem>
                  </SelectContent>
                </Select>
                {error && (
                  <div className="text-red-500">
                    Your have not set your timmer
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={timeValue == 0}
              onClick={() => {
                if (localStorage?.getItem("timer")) {
                  localStorage.removeItem("timer");
                }
              }}
            >
              <Link
                href={{
                  pathname: `/exam/${noteToEdit?.id}/ongoing`,
                  query: { timer: timeValue },
                }}
              >
                Confirm
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SetTimer;
