import { StyleSheet, View, Text, Switch, Alert } from 'react-native';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask } from '../features/taskSlice';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'O título deve ter pelo menos 3 caracteres')
    .max(50, 'O título deve ter no máximo 50 caracteres')
    .required('O título é obrigatório'),
  description: Yup.string().max(200, 'A descrição deve ter no máximo 200 caracteres'),
  priority: Yup.string().required('Selecione uma prioridade'),
  location: Yup.string().required('Dê o endereço de sua Tarefa')
});

export default function AddTaskScreen({ navigation }) {
  const { theme } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values, { resetForm }) => {
    if (!acceptTerms) {
      Alert.alert('Erro', 'Você deve aceitar os termos para adicionar uma tarefa.');
      return;
    }

    try {
      const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
        title: values.title,
        completed: false,
      });
      dispatch(addTask({
        title: values.title,
        description: values.description,
        location: values.location,
        priority: values.priority,
      }));
      setSuccessMessage('Tarefa adicionada com sucesso!');
      setTimeout(() => {
        setSuccessMessage('');
        resetForm();
        setAcceptTerms(false);
        navigation.goBack();
      }, 1000);
    } catch (err) {
      Alert.alert('Erro', 'Falha ao salvar na API');
    }
  };


  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>Nova Tarefa</Text>
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
      <Formik
        initialValues={{ title: '', description: '', priority: 'baixa', title: ''  }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleSubmit, values, errors, touched, resetForm }) => (
          <View style={styles.form}>
            <CustomInput
              value={values.title}
              onChangeText={handleChange('title')}
              placeholder="Digite o título da tarefa (máx. 50 caracteres)"
              required
            />
            {touched.title && errors.title && (
              <Text style={styles.errorText}>{errors.title}</Text>
            )}
            <CustomInput
              value={values.description}
              onChangeText={handleChange('description')}
              placeholder="Digite a descrição (opcional)"
              multiline
            />
            {touched.description && errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}
            <CustomInput
              value={values.location}
              onChangeText={handleChange('location')}
              placeholder="Digite a localização (opcional)"
              multiline
            />
            <View style={[styles.pickerContainer, theme === 'dark' && styles.darkPickerContainer]}>
              <Text style={[styles.label, theme === 'dark' && styles.darkText]}>Prioridade:</Text>
              <Picker
                selectedValue={values.priority}
                onValueChange={handleChange('priority')}
                style={[styles.picker, theme === 'dark' && styles.darkPicker]}
              >
                <Picker.Item label="Baixa" value="baixa" />
                <Picker.Item label="Média" value="media" />
                <Picker.Item label="Alta" value="alta" />
              </Picker>
            </View>
            {touched.priority && errors.priority && (
              <Text style={styles.errorText}>{errors.priority}</Text>
            )}
            <View style={styles.switchContainer}>
              <Switch
                value={acceptTerms}
                onValueChange={setAcceptTerms}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={acceptTerms ? '#007bff' : '#f4f3f4'}
              />
              <Text style={[styles.switchLabel, theme === 'dark' && styles.darkText]}>
                Aceitar termos de uso
              </Text>
            </View>
            <CustomButton
              title="Salvar Tarefa"
              onPress={handleSubmit}
              color="#007bff"
              size="large"
            />
            <CustomButton
              title="Cancelar"
              onPress={() => navigation.goBack()}
              color="#dc3545"
              size="large"
            />
            <CustomButton
              title="Limpar Formulário"
              onPress={() => {
                resetForm();
                setAcceptTerms(false);
              }}
              color="#6c757d"
              size="large"
            />
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
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
  darkText: {
    color: '#fff',
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  pickerContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  darkPickerContainer: {
    backgroundColor: '#444',
  },
  picker: {
    width: '100%',
    height: 50,
    color: '#333',
  },
  darkPicker: {
    color: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 10,
  },
});