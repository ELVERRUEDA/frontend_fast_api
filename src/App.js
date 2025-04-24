import React, { useState, useEffect } from 'react';

const API_URL = 'http://127.0.0.1:8000';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [modoEdicion, setModoEdicion] = useState(null);
  const [tareaEditada, setTareaEditada] = useState('');


  const fetchTareas = async () => {
    const res = await fetch(`${API_URL}/tareas/`);
    const data = await res.json();
    setTareas(data);
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const agregarTarea = async () => {
    if (!nuevaTarea) return;
    await fetch(`${API_URL}/tareas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: nuevaTarea,
        descripcion: ''
      })
    });
    setNuevaTarea('');
    fetchTareas();
  };

  const eliminarTarea = async (id) => {
    await fetch(`${API_URL}/tareas/${id}`, {
      method: 'DELETE',
    });
    fetchTareas();
  };
  const editarTarea = async (id) => {
    if (!tareaEditada) return;
  
    await fetch(`${API_URL}/tareas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: tareaEditada,
        descripcion: ''
      })
    });
  
    setModoEdicion(null);
    setTareaEditada('');
    fetchTareas();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>To-Do List</h1>

      <input
        type="text"
        value={nuevaTarea}
        onChange={(e) => setNuevaTarea(e.target.value)}
        placeholder="Escribe una tarea"
      />
      <button onClick={agregarTarea}>Agregar</button>

      <ul>
  {tareas.map((tarea) => (
    <li key={tarea.id}>
      {modoEdicion === tarea.id ? (
        <>
          <input
            type="text"
            value={tareaEditada}
            onChange={(e) => setTareaEditada(e.target.value)}
          />
          <button onClick={() => editarTarea(tarea.id)}>💾</button>
          <button onClick={() => setModoEdicion(null)}>❌</button>
        </>
      ) : (
        <>
          {tarea.titulo}
          <button onClick={() => {
            setModoEdicion(tarea.id);
            setTareaEditada(tarea.titulo);
          }}>✏️</button>
          <button onClick={() => eliminarTarea(tarea.id)}>🗑️</button>
        </>
      )}
    </li>
  ))}
</ul>

    </div>
  );
}

export default App;
