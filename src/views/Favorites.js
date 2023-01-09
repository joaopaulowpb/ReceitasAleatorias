import { View, Text, ActivityIndicator, FlatList, RefreshControl } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import { ref, child, get } from "firebase/database";
import { database } from '../services/firebaseConnection';
import RecipeRenderItem from '../components/RecipeRenderItem';

export default function Favorites({ navigation }) {

    const [loading, setLoading] = React.useState(0);
    const [favorites, setFavorites] = React.useState([]);
    const [recipes, setRecipes] = React.useState([]);

    React.useEffect(() => {
        getFavorites();
    }, []);

    React.useEffect(() => {
        getRecipes();
    }, [loading == 1]);

    //toda vez que a tela for focada, atualizar os favoritos



    const getFavorites = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('favoritos');
            if (jsonValue != null) {
                setFavorites(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.log(e);
        }
        setLoading(1);
    }

    const getRecipes = async () => {

        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'aiRecipes'));
        if (snapshot.exists()) {
            //ordernar por nome
            const data = Object.values(snapshot.val()).sort((a, b) => a.nome.localeCompare(b.nome));
            setRecipes(data);
            setLoading(2);
        } else {
            console.log("No data available");
        }
    }

    const updateFavorites = async (id) => {
        let arrayFavoritos = [...favorites];
        if (arrayFavoritos.includes(id)) {
            arrayFavoritos.splice(arrayFavoritos.indexOf(id), 1);
        } else {
            arrayFavoritos.push(id);
        }
        await AsyncStorage.setItem('favoritos', JSON.stringify(arrayFavoritos)).then((_) => {
            setFavorites(arrayFavoritos);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <View style={{ flex: 1 }}>
            <ExpoStatusBar style="light" />
            {
                loading == 0 || loading == 1 &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ff5722" />
                </View>
            }
            {
                loading == 2 && favorites.length == 0 &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Não há favoritos</Text>
                </View>
            }
            {
                loading == 2 &&
                <FlatList
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => {
                                getRecipes();
                                getFavorites();
                            }}
                        />
                    }
                    data={recipes}
                    keyExtractor={item => item.id}
                    renderItem={({ item, index }) => {
                        if (!favorites.includes(item.id)) {
                            return null;
                        }
                        return (
                            <RecipeRenderItem
                                item={item}
                                navigation={navigation}
                                onStarTap={() => {
                                    updateFavorites(item.id);
                                }}
                                favorites={favorites}
                            />
                        )
                    }}
                />

            }
        </View>
    )
}