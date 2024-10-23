import React, { useEffect, useState } from "react";
import Sidebar from "./component/SideBar";
import Editor from "./component/Editor";
//import { data } from "./data";
import Split from "react-split";
import "./App.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { notesCollection, db } from "./FireBase";

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState(notes[0]?.id || "");
  const [tempnotetext, setTempnoteText] = useState("");

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const notenewref = await addDoc(notesCollection, newNote);
    setCurrentNoteId(notenewref.id);
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);
  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId);
    await setDoc(
      docRef,
      { body: text, updatedAt: Date.now() },
      { merge: true }
    );
  }
  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  React.useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  useEffect(() => {
    if (currentNote) {
      setTempnoteText(currentNote.body);
    }
  }, [currentNote]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (tempnotetext != currentNote.body) {
        updateNote(tempnotetext);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [tempnotetext]);

  async function deleteNote(noteId) {
    const docref = doc(db, "notes", noteId);
    await deleteDoc(docref);
  }
  const sortedarray = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[25, 75]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedarray}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          <Editor
            tempnotetext={tempnotetext}
            setTempnoteText={setTempnoteText}
          />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}
