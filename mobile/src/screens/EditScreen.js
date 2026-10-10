import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ToastAndroid, ScrollView } from 'react-native';
import API from '../services/Api';

export default function EditScreen({ route, navigation }) {
    const { id } = route.params;

    const [judul, setJudul] = useState('');
    const [deskripsi, setDeskripsi] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await API.get(`/materi/${id}`);
                setJudul(response.data.data.judul);
                setDeskripsi(response.data.data.deskripsi);
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
            formData.append('judul', judul);
            formData.append('deskripsi', deskripsi);
            formData.append('_method', 'PUT'); // If backend requires method spoofing, though Express router.put handles it if we send standard PUT. For multipart, some use method spoofing. We will just use axios.put if json, but since multipart formData with PUT sometimes has issues, we can try API.put directly.

            await API.put(`/materi/${id}`, formData, {
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
                <Text style={styles.label}>Judul Materi</Text>
                <TextInput
                    style={[styles.input, errors.judul && styles.inputError]}
                    value={judul}
                    onChangeText={setJudul}
                    placeholder="Masukkan Judul Materi"
                />
                {errors.judul && <Text style={styles.errorText}>{errors.judul}</Text>}
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Isi Materi</Text>
                <TextInput
                    style={[styles.input, styles.textArea, errors.deskripsi && styles.inputError]}
                    value={deskripsi}
                    onChangeText={setDeskripsi}
                    placeholder="Masukkan Isi Materi"
                    multiline
                    numberOfLines={4}
                />
                {errors.deskripsi && <Text style={styles.errorText}>{errors.deskripsi}</Text>}
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
