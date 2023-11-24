
import { useEffect, useState } from 'react';
import './App.css'

function App() {
    
    const [todo, setTodo] = useState([]);
    const [nombre, setNombre] = useState('');
    const [updateName, setUpdateName] = useState('');
    const [editar, setEditar] = useState(null);

    const postTask = () => {
      fetch('http://localhost:3000/todo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nombre
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error');
          }
          return response.json();
        })
        .then((data) => {
          setTodo([...todo, data]);
          setNombre('');
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };

    const patchTask = async (id) => {
      const taskUpdate = todo.find((todo) => todo.id === id);
      try {
        const response = await fetch(`http://localhost:3000/todo/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: editar === id ? updateName : taskUpdate.name
          }),
        });
        if (!response.ok) {
          throw new Error('Error');
        }
        const updatedtodo = todo.map((todo) =>
          todo.id === id
            ? {
                ...todo,
                name: editar === id ? updateName : todo.name
              }
            : todo
        );
        setTodo(updatedtodo);
        setEditar(null);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const deleteTask = (id) => {
      fetch(`http://localhost:3000/todo/${id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error');
          }
          setTodo(todo.filter((todo) => todo.id !== id));
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
    
    useEffect(() => {
      const fetchData = async () => {
        try {
          const respuesta = await fetch('http://localhost:3000/todo');
          if (!respuesta.ok) {
            throw new Error('Error del servidor');
          }
          const datosJson = await respuesta.json();
          setTodo(datosJson);
        } catch (error) {
          console.log('Sin información del servidor');
        }
      };
      fetchData();
    }, []);
    return (
      <div className='container'>
        <div className='first-container'>
          <h1>Tareas</h1>
          <div className='input-container'>
            <input
              type='text'
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}/>
            <button onClick={postTask}>Enviar</button>
          </div>
        </div>
        <div className='second-container' key={todo.id}>
          {todo.map((todo) => (
            <div className='card' key={todo.id}>
              {editar === todo.id ? (
                <div className='update-container'>
                  <input
                    type='text'
                    value={updateName}
                    onChange={(e) => setUpdateName(e.target.value)}/>
                  <button onClick={() => patchTask(todo.id)}>Guardar</button>
                </div>):
                 (<div className='first-card-container'>
                    <p className='task-title'>{todo.name}</p>
                    <input type='checkbox'/>
                  </div>
                )}<div className= 'second-card-container'>
                    <button className='edit-button' onClick={() => setEditar(todo.id)}>Editar</button>
                    <button className='delete-button' onClick={() => deleteTask(todo.id)}>Eliminar</button>
                  </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

export default App
