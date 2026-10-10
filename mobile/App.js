import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IndexScreen from './src/screens/IndexScreen';
import CreateScreen from './src/screens/CreateScreen';
import EditScreen from './src/screens/EditScreen';

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
          options={{ title: 'Data Posts' }} 
        />
        <Stack.Screen 
          name="Create" 
          component={CreateScreen} 
          options={{ title: 'Tambah Post' }} 
        />
        <Stack.Screen 
          name="Edit" 
          component={EditScreen} 
          options={{ title: 'Edit Post' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
