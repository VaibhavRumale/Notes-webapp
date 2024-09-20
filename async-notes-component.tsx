import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Minimize2, Maximize2, Move } from 'lucide-react';

const MultiNoteDisplay = () => {
  const [notes, setNotes] = useState([]);
  const [draggedNote, setDraggedNote] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchNotes = async () => {
      const mockNotes = [
        { id: '1', title: 'Note 1', content: 'This is the first note.', minimized: false, position: { x: 0, y: 0 }, size: { width: 250, height: 200 } },
        { id: '2', title: 'Note 2', content: 'This is the second note.', minimized: false, position: { x: 260, y: 0 }, size: { width: 250, height: 200 } },
      ];
      setNotes(mockNotes);
    };

    fetchNotes();
  }, []);

  const handleAddNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: `Note ${notes.length + 1}`,
      content: '',
      minimized: false,
      position: { x: 0, y: 0 },
      size: { width: 250, height: 200 },
    };
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (id, content) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const handleToggleMinimize = (id) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, minimized: !note.minimized } : note
    ));
  };

  const handleMouseDown = (e, id) => {
    const note = notes.find(n => n.id === id);
    setDraggedNote(id);
    setDragOffset({
      x: e.clientX - note.position.x,
      y: e.clientY - note.position.y
    });
  };

  const handleMouseMove = (e) => {
    if (draggedNote) {
      setNotes(notes.map(note =>
        note.id === draggedNote
          ? { ...note, position: { x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y } }
          : note
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggedNote(null);
  };

  return (
    <div 
      className="w-full h-screen relative overflow-hidden p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Button onClick={handleAddNote} className="mb-4">Add New Note</Button>
      {notes.map((note) => (
        <Card 
          key={note.id} 
          className="absolute" 
          style={{ 
            width: note.size.width, 
            height: note.size.height,
            left: note.position.x,
            top: note.position.y,
          }}
        >
          <CardHeader className="py-2 px-4 flex justify-between items-center">
            <h3 className="font-semibold">{note.title}</h3>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onMouseDown={(e) => handleMouseDown(e, note.id)}
              >
                <Move size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleToggleMinimize(note.id)}
              >
                {note.minimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteNote(note.id)}
              >
                <X size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className={note.minimized ? 'hidden' : ''}>
            <textarea
              className="w-full h-full p-2 border rounded resize-none"
              value={note.content}
              onChange={(e) => handleUpdateNote(note.id, e.target.value)}
              placeholder="Type your note here..."
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MultiNoteDisplay;
