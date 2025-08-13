import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadTasks = createAsyncThunk("tasks/loadTasks", async () => {
    try {
        const savedTasks = await AsyncStorage.getItem("@TaskApp:tasks");
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            if (Array.isArray(parsedTasks) && parsedTasks.every(task => task.id && task.title)) {
                return parsedTasks;
            }
            return [];
        }
        return [];
    } catch (err) {
        throw new Error("Erro ao carregar tarefas:");
    }
});

export const saveTasks = createAsyncThunk("tasks/saveTasks", async (tasks) => {
    try {
        await AsyncStorage.setItem("@TaskApp:tasks", JSON.stringify(tasks));
        return tasks;
    } catch (err) {
        throw new Error("Erro ao salvar tarefas:");
    }
});

export const exportTasks = createAsyncThunk("tasks/exportTasks", async (tasks) => {
    try {
        await AsyncStorage.setItem("@TaskApp:backup", JSON.stringify(tasks));
        return "Backup realizado com sucesso!";
    } catch (err) {
        throw new Error("Erro ao criar backup");
    }
});

export const restoreTasks = createAsyncThunk("tasks/restoreTasks", async () => {
    try {
        const backupTasks = await AsyncStorage.getItem("@TaskApp:backup");
        if (backupTasks) {
            const parsedTasks = JSON.parse(backupTasks);
            if (Array.isArray(parsedTasks) && parsedTasks.every(task => task.id && task.title)) {
                await AsyncStorage.setItem("@TaskApp:tasks", JSON.stringify(parsedTasks));
                return parsedTasks;
            }
            throw new Error("Dados de backup inválidos");
        }
        throw new Error("Nenhum backup encontrado");
    } catch (err) {
        throw err;
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        localTasks: [],
        theme : 'light',
        status: 'idle',
        error: null,
    },
    reducers: {
        addTask: (state, action) => {
            state.localTasks.push({
                id: action.payload.id || `local-${Date.now()}`,
                title: action.payload.title,
                description: action.payload.description || '',
                priority: action.payload.priority || 'baixa',
                completed: false
            });
        },

        toggleTaskCompletion: (state, action) => {
            const task = state.localTasks.find(task => task.id === action.payload);
            if (task) {
                task.completed = !task.completed;
            }
        },

        deleteTask: (state, action) => {
            state.localTasks = state.localTasks.filter((task) => task.id !== action.payload);
        },

        clearTasks: (state) => {
            state.localTasks = [];
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTasks.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadTasks.fulfilled, (state, action) => {
                state.localTasks = action.payload;
                state.status = 'succeeded';
            })
            .addCase(loadTasks.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(saveTasks.fulfilled, (state, action) => {
                state.localTasks = action.payload;
            })
            .addCase(exportTasks.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(restoreTasks.fulfilled, (state, action) => {
                state.localTasks = action.payload;
                state.status = 'succeeded';
            })
    }
})

export const { addTask, toggleTaskCompletion, deleteTask, clearTasks, toggleTheme } = taskSlice.actions;
export default taskSlice.reducer;