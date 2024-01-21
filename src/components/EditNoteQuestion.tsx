import React from "react";
import { NoteType } from "./ReviewNoteQuestion";
interface questionDataProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit: NoteType;
}
const EditNoteQuestion = ({ open, setOpen, noteToEdit }: questionDataProps) => {
  return <div>EditNoteQuestion</div>;
};

export default EditNoteQuestion;
