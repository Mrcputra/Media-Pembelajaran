import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid, ScrollView } from 'react-native';
import API from '../services/Api';

export default function CreateScreen({ navigation }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleStore = async () => {
        setLoading(true);
        setErrors({});

        try {
            // Note: Since we are in React Native and file upload needs a real file picker like expo-image-picker or react-native-image-picker,
            // we will simulate form data submission. For this curriculum example, we may send data without image or mocked image
            // If image is required, we use FormData. Here we focus on standard text fields and optional image.
            
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            // formData.append('image', { uri: '...', type: 'image/jpeg', name: 'photo.jpg' });

            await API.post('/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            ToastAndroid.show('Data berhasil disimpan', ToastAndroid.SHORT);
            navigation.navigate('Index');
        } catch (error) {
            if (error.response && error.response.status === 422) {
                const validationErrors = {};
                error.response.data.errors.forEach(err => {
                    validationErrors[err.path] = err.msg;
                });
                setErrors(validationErrors);
                ToastAndroid.show('Terdapat kesalahan validasi', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('Gagal menyimpan data', ToastAndroid.SHORT);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.formGroup}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Masukkan Title"
                />
                {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Content</Text>
                <TextInput
                    style={[styles.input, styles.textArea, errors.content && styles.inputError]}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Masukkan Content"
                    multiline
                    numberOfLines={4}
                />
                {errors.content && <Text style={styles.errorText}>{errors.content}</Text>}
            </View>

            <TouchableOpacity 
                style={styles.button} 
                onPress={handleStore} 
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Simpan</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: 'bold',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        padding: 10,
        fontSize: 16,
    },
    inputError: {
        borderColor: '#dc3545',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 4,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
