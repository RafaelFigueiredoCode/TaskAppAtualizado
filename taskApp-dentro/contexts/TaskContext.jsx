import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [localTasks, setLocalTasks] = useState([]);
  const [theme, setTheme] = useState('light');

  // Carregar tarefas do AsyncStorage ao iniciar
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedTasks = await AsyncStorage.getItem('@TaskApp:tasks');
        if (savedTasks) {
          const parsedTasks = JSON.parse(savedTasks);
          if (Array.isArray(parsedTasks) && parsedTasks.every(task => task.id && task.title)) {
            setLocalTasks(parsedTasks);
          } else {
            console.warn('Dados inválidos, inicializando com array vazio');
            setLocalTasks([]);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar tarefas:', err);
      }
    };
    loadTasks();
  }, []);

  // Salvar tarefas no AsyncStorage quando localTasks mudar
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('@TaskApp:tasks', JSON.stringify(localTasks));
      } catch (err) {
        console.error('Erro ao salvar tarefas:', err);
      }
    };
    saveTasks();
  }, [localTasks]);

  const addTask = ({ title, description, id }) => {
    setLocalTasks((prev) => [
      ...prev,
      { id: id || `local-${Date.now()}`, title, description: description || '', completed: false },
    ]);
  };

  const toggleTaskCompletion = (id) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setLocalTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearTasks = async () => {
    try {
      await AsyncStorage.removeItem('@TaskApp:tasks');
      setLocalTasks([]);
    } catch (err) {
      console.error('Erro ao limpar tarefas:', err);
    }
  };

  const getCompletedCount = () => localTasks.filter((task) => task.completed).length;

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const exportTasks = async () => {
    try {
      await AsyncStorage.setItem('@TaskApp:backup', JSON.stringify(localTasks));
      return 'Backup realizado com sucesso!';
    } catch (err) {
      throw new Error('Erro ao criar backup');
    }
  };

  const restoreTasks = async () => {
    try {
      const backupTasks = await AsyncStorage.getItem('@TaskApp:backup');
      if (backupTasks) {
        const parsedTasks = JSON.parse(backupTasks);
        if (Array.isArray(parsedTasks) && parsedTasks.every(task => task.id && task.title)) {
          setLocalTasks(parsedTasks);
          await AsyncStorage.setItem('@TaskApp:tasks', JSON.stringify(parsedTasks));
          return 'Backup restaurado com sucesso!';
        }
        throw new Error('Dados de backup inválidos');
      }
      throw new Error('Nenhum backup encontrado');
    } catch (err) {
      throw err;
    }
  };
  return (
    <TaskContext.Provider
      value={{
        localTasks,
        addTask,
        toggleTaskCompletion,
        deleteTask,
        clearTasks,
        getCompletedCount,
        theme,
        toggleTheme,
        exportTasks,
        restoreTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}