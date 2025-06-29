'use client'

import { useState, useEffect } from 'react';
import styles from './tasks.module.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [isHighPriority, setIsHighPriority] = useState(false);
  const [filter, setFilter] = useState('all');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('pomodoro-tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pomodoro-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (taskInput.trim() !== '') {
      const newTask = {
        text: taskInput.trim(),
        completed: false,
        isHighPriority,
        createdAt: new Date().getTime()
      };
      
      setTasks([...tasks, newTask]);
      setTaskInput('');
      setIsHighPriority(false);
    }
  };

  const toggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const editTask = (index) => {
    const newText = prompt("Editar tarea:", tasks[index].text);
    if (newText !== null && newText.trim() !== '') {
      const updatedTasks = [...tasks];
      updatedTasks[index].text = newText.trim();
      setTasks(updatedTasks);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.isHighPriority !== b.isHighPriority) {
      return a.isHighPriority ? -1 : 1;
    }
    return a.createdAt - b.createdAt;
  });

  // Funciones para drag and drop
  const handleDragStart = (e, index) => {
    setDraggedItem(tasks[index]);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.parentNode);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    if (!draggedItem) return;
    
    const draggedIndex = tasks.findIndex(task => task === draggedItem);
    if (draggedIndex === -1) return;
    
    const newTasks = [...tasks];
    newTasks.splice(draggedIndex, 1);
    newTasks.splice(index, 0, draggedItem);
    
    setTasks(newTasks);
    setDraggedItem(null);
  };

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.tasksHeader}>
        <h3 className={styles.tasksTitle}>Lista de tareas 🍎📓</h3>
      </div>
      
      <div className={styles.taskInputContainer}>
        <input
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Añade una tarea..."
          className={styles.taskInput}
        />
        <button onClick={addTask} className={styles.addTaskBtn}>Añadir</button>
      </div>
      
      <div className={styles.taskControls}>
        <label className={styles.priorityLabel}>
          <input
            type="checkbox"
            checked={isHighPriority}
            onChange={(e) => setIsHighPriority(e.target.checked)}
            className={styles.highPriorityCheckbox}
          />
          Prioridad alta
        </label>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">Todas</option>
          <option value="completed">Completadas</option>
          <option value="pending">Pendientes</option>
        </select>
      </div>
      
      <ul className={styles.taskList}>
        {sortedTasks.map((task, index) => (
          <li
            key={index}
            className={`${styles.taskItem} ${task.isHighPriority ? styles.highPriority : ''} ${task.completed ? styles.completed : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          >
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(tasks.findIndex(t => t === task))}
                className={styles.taskCheckbox}
              />
              <span className={styles.taskText}>{task.text}</span>
            </label>
            
            <div className={styles.taskActions}>
              {task.isHighPriority && '❗️'}
              <button
                onClick={() => deleteTask(tasks.findIndex(t => t === task))}
                className={styles.deleteBtn}
              >
                Eliminar
              </button>
              <button
                onClick={() => editTask(tasks.findIndex(t => t === task))}
                className={styles.editBtn}
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;