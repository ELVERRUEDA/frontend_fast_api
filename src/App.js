import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://127.0.0.1:8080';

function App() {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [modoEdicion, setModoEdicion] = useState(null);
  const [tareaEditada, setTareaEditada] = useState('');

  const fetchTareas = async () => {
    try {
      const res = await fetch(`${API_URL}/tareas/`);
      const data = await res.json();

      const items = data.map((item) => {
        const [id, values] = Object.entries(item)[0];
        return { id, ...values };
      });

      setTareas(items);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
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
    <div className="container">
      <h1>To-Do List</h1>

      <form onSubmit={(e) => { e.preventDefault(); agregarTarea(); }}>
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Escribe una tarea"
        />
        <button type="submit">Agregar</button>
      </form>

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
                <div className="action-buttons">
                  <button onClick={() => editarTarea(tarea.id)}>💾</button>
                  <button onClick={() => setModoEdicion(null)}>❌</button>
                </div>
              </>
            ) : (
              <>
                <span>{tarea.titulo}</span>
                <div className="action-buttons">
                  <button onClick={() => {
                    setModoEdicion(tarea.id);
                    setTareaEditada(tarea.titulo);
                  }}>✏️</button>
                  <button onClick={() => eliminarTarea(tarea.id)}>🗑️</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
