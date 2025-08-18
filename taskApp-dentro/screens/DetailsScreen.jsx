import { StyleSheet, View, Text } from 'react-native';
import { useSelector } from 'react-redux';

export default function DetailsScreen({ route }) {
  const { task } = route.params;
  const { theme } = useSelector((state) => state.tasks);

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
        {task.title}
      </Text>
      <Text style={[styles.detail, theme === 'dark' && styles.darkText]}>
        Descrição: {task.description || 'Nenhuma descrição'}
      </Text>
      <Text style={[styles.detail, theme === 'dark' && styles.darkText]}>
        Prioridade: {task.priority || 'Não definida'}
      </Text>
      <Text style={[styles.detail, theme === 'dark' && styles.darkText]}>
        Status: {task.completed ? 'Concluída' : 'Pendente'}
      </Text>
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
  detail: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  darkText: {
    color: '#fff',
  },
});