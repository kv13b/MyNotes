import React, { useEffect } from "react";
import Sidebar from "./component/SideBar";
import Editor from "./component/Editor";
//import { data } from "./data";
import Split from "react-split";
import "./App.css";
import "react-mde/lib/styles/css/react-mde-all.css";
import { addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { notesCollection, db } from "./FireBase";

export default function App() {
  const [notes, setNotes] = React.useState([]);
  const [currentNoteId, setCurrentNoteId] = React.useState(notes[0]?.id || "");

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
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
  function updateNote(text) {
    setNotes((oldNotes) => {
      const newArray = [];
      for (let i = 0; i < oldNotes.length; i++) {
        const oldNote = oldNotes[i];
        if (oldNote.id == currentNoteId) {
          newArray.unshift({ ...oldNote, body: text });
        } else {
          newArray.push(oldNote);
        }
      }
      return newArray;
    });

    // setNotes((oldNotes) =>
    //   oldNotes.map((oldNote) => {
    //     return oldNote.id === currentNoteId
    //       ? { ...oldNote, body: text }
    //       : oldNote;
    //   })
    // );
  }
  const currentNote =
    notes.find((note) => note.id === currentNoteId) || notes[0];

  async function deleteNote(noteId) {
    const docref = doc(db, "notes", noteId);
    await deleteDoc(docref);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[25, 75]} direction="horizontal" className="split">
          <Sidebar
            notes={notes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && (
            <Editor currentNote={currentNote} updateNote={updateNote} />
          )}
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
