import { StyleSheet, View, Text } from 'react-native';
import { useState } from 'react';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import { useTasks } from '../contexts/TaskContext';

export default function SettingsScreen() {
  const { toggleTheme, theme, clearTasks, exportTasks, restoreTasks } = useTasks();
  const [modalVisible, setModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleClearTasks = async () => {
    try {
      await clearTasks();
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
      const message = await exportTasks();
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setSuccessMessage('');
      alert(err.message);
    }
  };

  const handleRestore = async () => {
    try {
      const message = await restoreTasks();
      setSuccessMessage(message);
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setSuccessMessage('');
      alert(err.message);
    }
  }
  
  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
        Configurações
      </Text>
      {successMessage ? (
        <Text style={styles.successText}>{successMessage}</Text>
      ) : null}

      <CustomButton
        title={`Mudar para Tema (${theme === 'light' ? 'Escuro' : 'Claro'})`}
        onPress={toggleTheme}
        color="#000"
      />
      <CustomButton
        title="Limpar Todas as Tarefas"
        onPress={() => setModalVisible(true)}
        color="#dc3545"
      />
      <CustomButton
        title="Exportar Tarefas"
        onPress={handleExport}
        color="#007bff"
      />
      <CustomButton
        title="Restaurar Backup"
        onPress={handleRestore}
        color="#28a745"
      />

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
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