import { useState } from "react";
import Sidebar from "./component/SideBar";
import "./App.css";
import { nanoid } from "nanoid";

function App() {
  const [notes, setnotes] = useState([]);
  const [currentNoteId, setCurrentNoteId] = useState(notes[0] && notes[0].id);

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setnotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }
  function findCurrentNote() {
    return (
      notes.find((note) => {
        return note.id === currentNoteId;
      }) || notes[0]
    );
  }
  return (
    <>
      <Sidebar
        notes={notes}
        currentNote={findCurrentNote()}
        setCurrentNoteId={setCurrentNoteId}
        newNote={createNewNote}
      />
    </>
  );
}

export default App;
