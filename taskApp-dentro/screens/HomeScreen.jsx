import { StyleSheet, View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskCard from '../components/TaskCard';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';
import { useTasks } from '../contexts/TaskContext';

export default function HomeScreen({ navigation }) {
  const { localTasks, toggleTaskCompletion, deleteTask, getCompletedCount, theme} = useTasks();
  const [apiTasks, setApiTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [clearModalVisible, setClearModalVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
      .then(response => {
        setApiTasks(response.data);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Erro ao carregar tarefas da API');
        setIsLoading(false);
      });
  }, []);

  const allTasks = [...apiTasks, ...localTasks];
  const filteredTasks = allTasks.filter((task) => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  
  const renderItem = ({ item }) => {
    const isLocal = typeof item.id === 'string'
    return(
      <TaskCard
      title={item.title}
      completed={item.completed}
      priority= {item.priority}
      onPress={isLocal ? () => navigation.navigate('Details', { task: item }) : null}
      onToggle={isLocal ? () => toggleTaskCompletion(item.id) : null}
      isLocal={isLocal}
      onDelete={isLocal ? () => {
        setTaskToDelete(item.id);
        setModalVisible(true);
      } : null}
    />
  )};

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>Minhas Tarefas</Text>
      <Text style={[styles.counterText, theme === 'dark' && styles.darkText]}>
        Tarefas: {filteredTasks.length} | Concluídas: {getCompletedCount()}
      </Text>
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      <View style={styles.filterContainer}>
        <CustomButton
          title="Todas"
          onPress={() => setFilter('all')}
          color={filter === 'all' ? '#007bff' : '#ddd'}
          textStyle={{ color: filter === 'all' ? '#fff' : '#333' }}
          size="small"
        />
        <CustomButton
          title="Pendentes"
          onPress={() => setFilter('pending')}
          color={filter === 'pending' ? '#007bff' : '#ddd'}
          textStyle={{ color: filter === 'pending' ? '#fff' : '#333' }}
          size="small"
        />
        <CustomButton
          title="Concluídas"
          onPress={() => setFilter('completed')}
          color={filter === 'completed' ? '#007bff' : '#ddd'}
          textStyle={{ color: filter === 'completed' ? '#fff' : '#333' }}
          size="small"
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color="#007bff" />
      ) : error ? (
        <>
          <Text style={[styles.errorText, theme === 'dark' && styles.darkText]}>{error}</Text>
          <CustomButton
            title="Tentar Novamente"
            onPress={() => {
              setError(null);
              setIsLoading(true);
              axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5')
                .then(response => {
                  setApiTasks(response.data);
                  setIsLoading(false);
                })
                .catch(err => {
                  setError('Erro ao carregar tarefas da API');
                  setIsLoading(false);
                });
            }}
            color="#ffc107"
          />
        </>
      ) : filteredTasks.length === 0 ? (
        <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>Nenhuma tarefa adicionada</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      <CustomButton
        title="Adicionar Tarefa"
        onPress={() => navigation.navigate('AddTask')}
        color="#28a745"
      />

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Confirmar Exclusão"
        message="Deseja realmente excluir esta tarefa?"
        onConfirm={() => {
          deleteTask(taskToDelete);
          setModalVisible(false);
          setTaskToDelete(null);
          setSuccessMessage('Tarefa excluída com sucesso!');
          setTimeout(() => setSuccessMessage(''), 2000);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 60,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  successText: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  counterText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
  darkText: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
});