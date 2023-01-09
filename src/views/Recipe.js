import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Recipe(props) {
    let receita = props.route.params.item;
    let ingredientes = receita.ingredientes;
    let quantidadesUser = props.route.params.quantidades;
    // console.log(quantidadesUser.qCarne);

    const [loading, setLoading] = React.useState(false);
    const [favorites, setFavorites] = React.useState([]);

    const [viewLista, setViewLista] = React.useState(false);
    const [ListaCompras, setListaCompras] = React.useState([]);

    React.useEffect(() => {
        getFavorites();
    }, []);

    const getFavorites = async () => {
        setLoading(true);
        try {
            const jsonValue = await AsyncStorage.getItem('favoritos');
            if (jsonValue != null) {
                setFavorites(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
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

    const updateListaCompras = () => {
        let ingredientesQueFaltam = [];

        let qCarne;
        let qFarinha;
        let qOvos;
        let qLeite;

        if (!quantidadesUser) {
            qCarne = 0;
            qFarinha = 0;
            qOvos = 0;
            qLeite = 0;
        } else {
            qCarne = quantidadesUser.qCarne;
            qFarinha = quantidadesUser.qFarinha;
            qOvos = quantidadesUser.qOvos;
            qLeite = quantidadesUser.qLeite;
        }

        const tiposDeCarne = ['frango', 'boi', 'porco', 'peixe', 'bovina', 'carne', 'suína'];

        ingredientes.forEach((ingrediente, index) => {

            let nomeIngrediente = ingrediente.nome.toLowerCase();
            let quantidadeIngrediente = ingrediente.quantidade;

            ingredientesQueFaltam.push({
                nome: ingrediente.nome,
                quantidade: ingrediente.quantidade,
                unidade: ingrediente.unidade
            });

            for (let i = 0; i < tiposDeCarne.length; i++) {
                const tipo = tiposDeCarne[i];
                if (nomeIngrediente.includes(tipo)) {
                    if (qCarne >= parseInt(quantidadeIngrediente)) {
                        return;
                    } else {
                        ingredientesQueFaltam.push({
                            nome: 'carne',
                            quantidade: (quantidadeIngrediente - qCarne),
                            unidade: ingrediente.unidade
                        });
                        ingredientesQueFaltam.splice(index, 1);
                    }
                }
            }

            if (nomeIngrediente.includes('farinha')) {
                if (qFarinha >= parseInt(quantidadeIngrediente)) {
                    return;
                } else {
                    ingredientesQueFaltam.push({
                        nome: 'farinha',
                        quantidade: (quantidadeIngrediente - qFarinha),
                        unidade: ingrediente.unidade
                    });
                    ingredientesQueFaltam.splice(index, 1);
                }
            }

            if (nomeIngrediente.includes('ovo')) {
                if (qOvos >= parseInt(quantidadeIngrediente)) {
                    return;
                } else {
                    ingredientesQueFaltam.push({
                        nome: 'ovo',
                        quantidade: (quantidadeIngrediente - qOvos),
                        unidade: ingrediente.unidade
                    });
                    ingredientesQueFaltam.splice(index, 1);
                }
            }

            if (nomeIngrediente == ('leite')) {
                if (qLeite >= parseInt(quantidadeIngrediente)) {
                    return;
                } else {
                    ingredientesQueFaltam.push({
                        nome: 'leite',
                        quantidade: (quantidadeIngrediente - qLeite),
                        unidade: ingrediente.unidade
                    });
                    ingredientesQueFaltam.splice(index, 1);
                }
            }

            //remover duplicados

            ingredientesQueFaltam = ingredientesQueFaltam.filter((ingrediente, index, self) => {
                return index === self.findIndex((t) => (
                    t.nome === ingrediente.nome
                ));
            });
            setListaCompras(ingredientesQueFaltam);
            setViewLista(!viewLista);
        });

    }



    return (
        <View style={{ flex: 1 }}>
            {
                loading &&
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ff5722" />
                </View>
            }
            {
                !loading &&
                <ScrollView>
                    <View style={{ paddingHorizontal: 0 }}>
                        <View style={{ paddingVertical: 20 }}>
                            <Text style={style.titulo}>{receita.nome}</Text>
                        </View>
                        <View style={{ backgroundColor: '#fff', elevation: 3, paddingHorizontal: 20, paddingVertical: 10 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Ingredientes:</Text>
                            {
                                ingredientes.map((ingrediente, index) => {
                                    return (
                                        <Text key={index} style={style.descricao}>
                                            {`- ${ingrediente.quantidade} ${ingrediente.unidade}(s) de ${ingrediente.nome}`}
                                        </Text>
                                    )
                                })
                            }
                            {
                                viewLista &&
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Lista de compras:</Text>
                                    {
                                        ListaCompras.map((ingrediente, index) => {
                                            return (
                                                <Text key={index} style={style.descricao}>
                                                    {`- ${ingrediente.quantidade} ${ingrediente.unidade}(s) de ${ingrediente.nome}`}
                                                </Text>
                                            )
                                        }
                                        )
                                    }
                                </View>
                            }
                        </View>
                        <View style={{ backgroundColor: '#fff', elevation: 3, paddingHorizontal: 20, paddingVertical: 10, marginBottom: 20 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Modo de preparo:</Text>
                            <Text style={style.descricao}>
                                {receita.modoPreparo}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 }}>
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                    backgroundColor: '#ff5722',
                                    borderRadius: 50,
                                    elevation: 5,
                                }}
                                onPress={() => updateListaCompras()}
                            >
                                <Text style={{ color: '#fff', fontSize: 16 }}>Lista de compra(s) automática</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    padding: 10,
                                }}
                                onPress={() => updateFavorites(receita.id)}
                            >
                                {
                                    favorites.includes(receita.id) ?
                                        <Icon type='font-awesome' name='star' size={25} color='#ff5722' />
                                        :
                                        <Icon type='font-awesome-5' name='star' size={20} color='#ff5722' />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            }
        </View>
    )
}

const style = StyleSheet.create({
    titulo: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center'
    },
    descricao: {
        fontSize: 14,
        color: '#333',
        textAlign: 'justify',
        lineHeight: 20
    },
});