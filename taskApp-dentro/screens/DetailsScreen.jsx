import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTasks } from '../contexts/TaskContext'
  export default function DetailsScreen({ navigation, route }) {
    const { task } = route.params;
    const { theme } = useTasks();

    return (
      <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
          <Text style={[styles.detail, theme === 'dark' && styles.darkText]}>
            {task.title}
          </Text>
          <Text style={[styles.detail, theme === 'dark' && styles.darkText]}>
            Descrição: {task.description || 'Nenhuma Descrição'}
          </Text>
          <Text style={[styles.detail, theme === 'dark' && styles.darkText]}>
            Prioridade: {task.priority || 'Não Definida'}
          </Text>
          <Text style={[styles.detail, theme === 'dark' && styles.darkText]}>
            Status: {task.completed ? 'Concluída' : 'Pendente'}
          </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
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
     backgroundColor: '#333'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    detail: {
      fontSize: 16,
      color: '#333',
      marginBottom: 10
    },
    darkText: {
      color: '#fff'
    },
    button: {
      backgroundColor: '#dc3545',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 5,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });