import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IndexScreen from './src/screens/IndexScreen';
import CreateScreen from './src/screens/CreateScreen';
import EditScreen from './src/screens/EditScreen';
import QuizScreen from './src/screens/QuizScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Index"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Index" 
          component={IndexScreen} 
          options={{ title: 'Media Pembelajaran' }} 
        />
        <Stack.Screen 
          name="Create" 
          component={CreateScreen} 
          options={{ title: 'Tambah Materi' }} 
        />
        <Stack.Screen 
          name="Edit" 
          component={EditScreen} 
          options={{ title: 'Edit Materi' }} 
        />
        <Stack.Screen 
          name="Quiz" 
          component={QuizScreen} 
          options={{ title: 'Kuis Evaluasi' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
