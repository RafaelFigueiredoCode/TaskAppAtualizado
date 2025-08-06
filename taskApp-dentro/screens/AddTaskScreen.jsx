import { StyleSheet, View, Text, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTasks } from '../contexts/TaskContext';

export default function AddTaskScreen({ navigation, route }) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    if (title.trim()) {
      try {
        const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
          title,
          completed: false,
        });
        addTask({ title, description });
        navigation.goBack();
      } catch (err) {
        Alert.alert('Erro', 'Falha ao salvar na API');
      }
    } else {
      Alert.alert('Erro', 'Por favor, insira o título da tarefa.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova Tarefa</Text>
      <CustomInput
        value={title}
        onChangeText={(text) => setTitle(text.slice(0, 50))}
        placeholder="Digite o título da tarefa (máx. 50 caracteres)"
      />
      <CustomInput
        value={description}
        onChangeText={setDescription}
        placeholder="Digite a descrição (opcional)"
        multiline
      />
      <CustomButton title="Salvar Tarefa" onPress={handleSubmit} color="#007bff" />
      <CustomButton
        title="Cancelar"
        onPress={() => navigation.goBack()}
        color="#dc3545"
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});