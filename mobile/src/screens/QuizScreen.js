import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';

const questions = [
    {
        question: "1. Sebuah sekolah ingin membangun Lab Komputer dengan 20 unit PC. Sekolah tersebut ingin memastikan jika salah satu kabel pada komputer siswa putus, komputer yang lain tetap bisa digunakan untuk ujian. Namun, mereka memiliki dana yang cukup untuk membeli sebuah Switch sentral. Berdasarkan studi kasus tersebut, topologi jaringan apa yang paling tepat untuk digunakan?",
        options: ["A. Topologi Bus", "B. Topologi Ring", "C. Topologi Star", "D. Topologi Mesh", "E. Topologi Tree"],
        answer: 2 // C is index 2
    },
    {
        question: "2. Perhatikan karakteristik topologi berikut:\n1. Menghabiskan banyak kabel.\n2. Setiap node terhubung langsung satu sama lain.\n3. Sangat aman dan tingkat toleransi kesalahan sangat tinggi.\n\nJika diimplementasikan pada sebuah perusahaan dengan database yang sangat krusial, topologi yang memiliki karakteristik tersebut adalah...",
        options: ["A. Topologi Ring", "B. Topologi Star", "C. Topologi Bus", "D. Topologi Mesh", "E. Topologi Hybrid"],
        answer: 3 // D is index 3
    },
    {
        question: "3. Dalam sebuah jaringan bertopologi Star, seluruh komputer siswa terhubung ke sebuah Switch di meja guru. Tiba-tiba, seluruh komputer siswa tidak bisa terkoneksi ke internet dan tidak bisa saling berbagi file, padahal indikator lampu LAN di masing-masing PC menyala. Kemungkinan terbesar penyebab gangguan tersebut adalah...",
        options: ["A. Kabel penghubung antar komputer siswa terputus.", "B. Switch sentral di meja guru mengalami kerusakan atau mati.", "C. Kartu jaringan (NIC) pada salah satu komputer siswa rusak.", "D. Server utama terkena virus malware.", "E. Topologi jaringan tidak cocok dengan sistem operasi."],
        answer: 1 // B is index 1
    }
];

export default function QuizScreen({ navigation }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);

    const handleAnswer = (selectedIndex) => {
        if (selectedIndex === questions[currentQuestion].answer) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
    };

    return (
        <ScrollView style={styles.container}>
            {showScore ? (
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>Skor Anda: {Math.round((score / questions.length) * 100)}</Text>
                    <Text style={styles.scoreDetail}>Anda menjawab benar {score} dari {questions.length} soal.</Text>
                    <TouchableOpacity style={styles.button} onPress={resetQuiz}>
                        <Text style={styles.buttonText}>Ulangi Kuis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.btnOutline]} onPress={() => navigation.goBack()}>
                        <Text style={styles.btnOutlineText}>Kembali ke Materi</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.quizContainer}>
                    <Text style={styles.questionCounter}>Pertanyaan {currentQuestion + 1} / {questions.length}</Text>
                    <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
                    
                    {questions[currentQuestion].options.map((option, index) => (
                        <TouchableOpacity 
                            key={index} 
                            style={styles.optionButton}
                            onPress={() => handleAnswer(index)}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    quizContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        elevation: 2,
    },
    questionCounter: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    questionText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        lineHeight: 24,
    },
    optionButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#dee2e6',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 15,
        color: '#333',
    },
    scoreContainer: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 2,
        marginTop: 50,
    },
    scoreText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 10,
    },
    scoreDetail: {
        fontSize: 16,
        color: '#555',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    btnOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007bff',
    },
    btnOutlineText: {
        color: '#007bff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
