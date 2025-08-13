import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import { useTasks } from '../contexts/TaskContext';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from '../features/counterSlice';
import {toggleTheme, clearTasks, exportTasks, restoreTasks, saveTasks}  from '../features/tasksSlice'

export default function SettingsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleClearTasks = async () => {
    try {
      await dispatch (clearTasks());
      await dispatch (saveTasks([]))
      setModalVisible(false);
      setSuccessMessage('Tarefas limpas com sucesso!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setModalVisible(false);
      setSuccessMessage('');
      alert('Erro ao limpar tarefas');
    }
  }

  const handleExport = async () => {
    try {
      const result = await dispatch  (exportTasks()).unwrap();
      setSuccessMessage(result);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setSuccessMessage('');
      alert(err.message);
    }
  };

  const handleRestore = async () => {
    try {
      const result = await dispatch (restoreTasks()).unwrap();
      setSuccessMessage('backup restaurado com sucesso!');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setSuccessMessage('');
      alert(err.message);
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
        Configurações
      </Text>
      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}
      <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
        contador: {counter}
      </Text>
      <CustomButton
      title='Incrementar'
      onPress={() => dispatch(increment())}
      color="#007bff"
      />
      <CustomButton
      title='Decrementar'
      onPress={() => dispatch(decrement())}
      color="#007bff"
      />
      <CustomButton
      title='Resetar Conatdor'
      onPress={() => dispatch(reset())}
      color="#007bff"
      />

      <CustomButton
        title={`Mudar para Tema (${theme === 'light' ? 'Escuro' : 'Claro'})`}
        onPress={() => dispatch(toggleTheme())}
        color="#007bff"
      />
      <CustomButton
        title="Limpar Todas as Tarefas"
        onPress={() => dispatch(setModalVisible(true))}
        color="#dc3545"
      />
      <CustomButton
        title="Exportar Tarefas"
        onPress={() => dispatch(handleExport())}
        color="#007bff"
      />
      <CustomButton
        title="Restaurar Backup"
        onPress={() => dispatch(handleRestore())}
        color="#28a745"
      />

      <CustomModal
        visible={modalVisible}
        onClose={() => dispatch(setModalVisible(false))}
        title="Limpar Tarefas"
        message="Deseja excluir todas as tarefas locais?"
        onConfirm={handleClearTasks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    darkContainer: {
      backgroundColor: '#333',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    successText: {
      fontSize: 16,
      color: '#28a745',
      textAlign: 'center',
      marginBottom: 10,
    },
    darkText: {
      color: '#fff',
    },
  });