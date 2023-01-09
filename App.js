import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './src/views/Home';
import { Icon } from '@rneui/themed';
import Favorites from './src/views/Favorites';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Recipe from './src/views/Recipe';

const Tab = createBottomTabNavigator();

const Stack = createNativeStackNavigator();

export default function App() {

    function HomeStack() {
        return (
            <Stack.Navigator
                screenOptions={{
                    headerShown: true
                }}
            >
                <Stack.Screen name="Home"
                    component={Home}
                    options={{
                        title: 'Receitas',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: '#ff5722',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
                <Stack.Screen name="Recipe" component={Recipe} options={{
                    title: 'Receita',
                    headerTitleAlign: 'center',
                    headerStyle: {
                        backgroundColor: '#ff5722',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }} />
            </Stack.Navigator>
        );
    }

    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName='Home'
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        let icontype;

                        switch (route.name) {
                            case "HomeStack":
                                icontype = 'font-awesome-5';
                                iconName = 'home';
                                size = 20;
                                break;
                            case "Favorites":
                                icontype = 'font-awesome-5';
                                iconName = 'heart';
                                size = 20;
                                break;
                        }
                        return <Icon type={icontype} name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#ff5722',
                    tabBarInactiveTintColor: 'gray',
                    headerStyle: {
                        backgroundColor: '#ff5722',
                    },
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        textAlign: 'center',
                        color: '#fff'
                    },
                    tabBarShowLabel: false,
                })}

            >
                <Tab.Screen
                    name="HomeStack"
                    component={HomeStack}
                    //background laranja escuro
                    options={{
                        headerShown: false,
                    }}
                />
                <Tab.Screen
                    name="Favorites"
                    component={Favorites}
                    //background laranja escuro
                    options={{
                        title: 'Favoritos',
                        headerTitleAlign: 'center',
                        headerStyle: {
                            backgroundColor: '#ff5722',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}