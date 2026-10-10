import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid, ScrollView } from 'react-native';
import API from '../services/Api';

export default function EditScreen({ route, navigation }) {
    const { id } = route.params;

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await API.get(`/posts/${id}`);
                setTitle(response.data.data.title);
                setContent(response.data.data.content);
            } catch (error) {
                ToastAndroid.show('Gagal mengambil data post', ToastAndroid.SHORT);
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleUpdate = async () => {
        setSaving(true);
        setErrors({});

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('_method', 'PUT'); // If backend requires method spoofing, though Express router.put handles it if we send standard PUT. For multipart, some use method spoofing. We will just use axios.put if json, but since multipart formData with PUT sometimes has issues, we can try API.put directly.

            await API.put(`/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            ToastAndroid.show('Data berhasil diupdate', ToastAndroid.SHORT);
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
                ToastAndroid.show('Gagal mengupdate data', ToastAndroid.SHORT);
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.loaderContainer]}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

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
                onPress={handleUpdate} 
                disabled={saving}
            >
                {saving ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Update</Text>
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
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
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
        backgroundColor: '#ffc107',
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
