import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

  export default function DetailsScreen({ navigation, route }) {
    const { task } = route.params;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Detalhes da Tarefa</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{task.title}</Text>
          <Text style={styles.cardStatus}>
            Status: {task.completed ? 'Concluída' : 'Pendente'}
          </Text>
        </View>
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
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    card: {
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      marginBottom: 20,
      width: '100%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    cardStatus: {
      fontSize: 16,
      color: '#666',
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