import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, ToastAndroid, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import API from '../services/Api';

export default function IndexScreen({ navigation }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await API.get('/posts');
            setPosts(response.data.data);
        } catch (error) {
            ToastAndroid.show('Gagal mengambil data', ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [])
    );

    const deletePost = async (id) => {
        Alert.alert(
            "Hapus Data",
            "Apakah Anda yakin ingin menghapus post ini?",
            [
                { text: "Batal", style: "cancel" },
                { 
                    text: "Hapus", 
                    onPress: async () => {
                        try {
                            await API.delete(`/posts/${id}`);
                            ToastAndroid.show('Data berhasil dihapus', ToastAndroid.SHORT);
                            fetchPosts();
                        } catch (error) {
                            ToastAndroid.show('Gagal menghapus data', ToastAndroid.SHORT);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const imageUrl = item.image 
            ? `${API.defaults.baseURL.replace('/api', '')}/uploads/${item.image}` 
            : 'https://via.placeholder.com/150';

        return (
            <View style={styles.card}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.cardBody}>
                    <Text style={styles.title}>{item.title}</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity 
                            style={[styles.button, styles.btnEdit]} 
                            onPress={() => navigation.navigate('Edit', { id: item.id })}
                        >
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.btnDelete]} 
                            onPress={() => deletePost(item.id)}
                        >
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={styles.emptyText}>Tidak ada data.</Text>}
                />
            )}

            <TouchableOpacity 
                style={styles.fab} 
                onPress={() => navigation.navigate('Create')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 16,
        elevation: 2, // for android
        shadowColor: '#000', // for ios
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    cardBody: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        marginRight: 8,
    },
    btnEdit: {
        backgroundColor: '#ffc107',
    },
    btnDelete: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: '#007bff',
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 2,
    },
    fabText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    }
});
