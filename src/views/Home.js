import { View, Text, StyleSheet, ActivityIndicator, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Modal, FlatList, Dimensions, RefreshControl } from 'react-native'
import React from 'react'
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';
import { ref, child, get } from "firebase/database";
import { database } from '../services/firebaseConnection';
import RecipeRenderItem from '../components/RecipeRenderItem';
import { Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({ navigation }) {
    const [loading, setLoading] = React.useState(false);

    const [modalVisible, setModalVisible] = React.useState(false);

    const [recipes, setRecipes] = React.useState([]);
    const [databaseRecipes, setDatabaseRecipes] = React.useState([]);
    const [favorites, setFavorites] = React.useState([]);

    const farinhaInputRef = React.useRef(null);
    const leiteInputRef = React.useRef(null);
    const carneInputRef = React.useRef(null);

    const [qOvos, setQOvos] = React.useState(0);
    const [qFarinha, setQFarinha] = React.useState(0);
    const [qLeite, setQLeite] = React.useState(0);
    const [qCarne, setQCarne] = React.useState(0);

    React.useEffect(() => {
        getRecipes();
        getFavorites();
    }, []);

    const getRecipes = async () => {
        setLoading(true);

        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, 'aiRecipes'));
        if (snapshot.exists()) {
            //ordernar por nome
            const data = Object.values(snapshot.val()).sort((a, b) => a.nome.localeCompare(b.nome));
            setRecipes(data);
            setDatabaseRecipes(data);
            setLoading(false);
        } else {
            console.log("No data available");
        }
    }

    const filterRecipes = () => {

        setLoading(true);

        //quantidade de cada ingrediente
        let quantOvos = parseInt(qOvos);
        let quantFarinha = parseInt(qFarinha);
        let quantLeite = parseInt(qLeite);
        let quantCarne = parseInt(qCarne);

        let arrayOriginal = [...databaseRecipes];
        let filteredRecipes = [];
        const tiposDeCarne = ['frango', 'boi', 'porco', 'peixe', 'bovina', 'carne', 'suína'];

        // //receitas que dá pra fazer com a quantidade dos ingredientes informados
        // arrayOriginal.forEach(receita => {
        //     let arrayIngredientes = receita.ingredientes;
        //     for (let i = 0; i < arrayIngredientes.length; i++) {

        //         let ingrediente = arrayIngredientes[i];
        //         let nomeIngrediente = ingrediente.nome.toLowerCase();
        //         let quantidadeIngrediente = parseInt(ingrediente.quantidade);

        //         if (nomeIngrediente.includes('ovo')) {
        //             if (quantOvos >= quantidadeIngrediente) {
        //                 filteredRecipes.push(receita);
        //             }
        //         }
        //         if (nomeIngrediente.includes('farinha')) {
        //             if (quantFarinha >= quantidadeIngrediente) {
        //                 filteredRecipes.push(receita);
        //             }
        //         }
        //         if (nomeIngrediente.includes('leite')) {
        //             if (quantLeite >= quantidadeIngrediente) {
        //                 filteredRecipes.push(receita);
        //             }
        //         }
        //         if (tiposDeCarne.some(tipo => nomeIngrediente.includes(tipo))) {
        //             if (quantCarne >= quantidadeIngrediente) {
        //                 filteredRecipes.push(receita);
        //             }
        //         }
        //     }
        // });

        // //remover receitas com id duplicados
        // filteredRecipes = filteredRecipes.filter((receita, index, self) =>
        //     index === self.findIndex((t) => (
        //         t.id === receita.id
        //     ))
        // );
        // setRecipes(filteredRecipes);
        setModalVisible(false);
        setLoading(false);

    }

    const getFavorites = async () => {
        setLoading(true);
        await AsyncStorage.getItem('favoritos').then((value) => {
            if (value !== null) {
                setFavorites(JSON.parse(value));
            }
            setLoading(false);
        }).catch((error) => {
            console.log(error);
            setLoading(false);
        });
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
        <KeyboardAvoidingView style={styles.container}>
            <ExpoStatusBar style="light" />
            {
                loading &&
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#ff5722" />
                </View>
            }
            {
                !loading &&
                <View style={{ width: '100%', flex: 1 }}>
                    <Modal animationType="fade" transparent={false} visible={modalVisible}>
                        <View style={{ flex: 1 }} />
                        <TouchableWithoutFeedback
                            style={{ flex: 2 }}
                            onPress={() => Keyboard.dismiss()}
                        >
                            <View style={{ padding: 20, elevation: 5, backgroundColor: '#fff' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ textAlign: 'center', fontSize: 18 }}>Preencha com a quantidade:</Text>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Icon type='font-awesome-5' name='times' size={20} color='#ff5722' />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ marginEnd: 10 }}>Ovos:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={text => setQOvos(text)}
                                        value={qOvos}
                                        placeholder=""
                                        keyboardType="numeric"
                                        returnKeyType='next'
                                        onSubmitEditing={() => { farinhaInputRef.current.focus() }}
                                    />
                                    <Text style={{ marginStart: 10 }}>unidade(s).</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ marginEnd: 10 }}>Farinha:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={text => setQFarinha(text)}
                                        value={qFarinha}
                                        placeholder=""
                                        keyboardType="numeric"
                                        returnKeyType='next'
                                        onSubmitEditing={() => { leiteInputRef.current.focus() }}
                                        ref={farinhaInputRef}
                                    />
                                    <Text style={{ marginStart: 10 }}>grama(s).</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ marginEnd: 10 }}>Leite:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={text => setQLeite(text)}
                                        value={qLeite}
                                        placeholder=""
                                        keyboardType="numeric"
                                        returnKeyType='next'
                                        onSubmitEditing={() => { carneInputRef.current.focus() }}
                                        ref={leiteInputRef}
                                    />
                                    <Text style={{ marginStart: 10 }}>ml(s).</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <Text style={{ marginEnd: 10 }}>Carne:</Text>
                                    <TextInput
                                        style={styles.input}
                                        onChangeText={text => setQCarne(text)}
                                        value={qCarne}
                                        placeholder=''
                                        keyboardType="numeric"
                                        returnKeyType='done'
                                        ref={carneInputRef}
                                    />
                                    <Text style={{ marginStart: 10 }}>grama(s).</Text>
                                </View>

                                <TouchableOpacity
                                    style={{ backgroundColor: '#ff5722', padding: 10, borderRadius: 5, marginBottom: 20 }}
                                    onPress={() => {
                                        filterRecipes();
                                    }}
                                >
                                    <Text style={{ color: '#fff', textAlign: 'center' }}>Buscar receitas</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ backgroundColor: '#fff', padding: 10, borderRadius: 5, borderColor: '#ff5722', borderWidth: 1 }}
                                    onPress={() => {
                                        getRecipes();
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={{ color: '#ff5722', textAlign: 'center' }}>Mostrar tudo</Text>
                                </TouchableOpacity>



                                <TouchableOpacity></TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{ flex: 1 }} />
                    </Modal>
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
                            return (
                                <RecipeRenderItem
                                    item={item}
                                    navigation={navigation}
                                    quantidades={{
                                        qOvos: qOvos,
                                        qFarinha: qFarinha,
                                        qLeite: qLeite,
                                        qCarne: qCarne
                                    }}
                                    onStarTap={() => {
                                        updateFavorites(item.id);
                                    }}
                                    favorites={favorites}
                                />
                            )
                        }}
                    />
                    <TouchableOpacity
                        style={styles.floatingButton}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Icon type='font-awesome' name='gear' size={30} color='#fff' />
                    </TouchableOpacity>

                </View>
            }
        </ KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        padding: 10,
        borderColor: 'gray',
        borderBottomWidth: 1,
        width: 'auto',
        backgroundColor: '#fff',
        minWidth: 50,
        textAlign: 'center'
    },
    floatingButton: {
        position: 'absolute',
        bottom: 30,
        right: 40,
        backgroundColor: '#ff5722',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        elevation: 10,
    }
});