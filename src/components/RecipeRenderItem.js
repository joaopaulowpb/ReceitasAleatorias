import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Icon } from '@rneui/themed';

export default function RecipeRenderItem({ item, navigation, quantidades, onStarTap, favorites }) {

    let id = item.id;

    return (
        <TouchableOpacity
            onPress={() => {
                navigation.navigate('Recipe', {
                    item, quantidades
                })
            }}
            style={{ marginVertical: 10, marginHorizontal: 10, paddingHorizontal: 15, paddingVertical: 15, backgroundColor: '#eee', borderRadius: 10, elevation: 5, }}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text
                    style={style.titulo}
                    numberOfLines={1}
                >{item.nome}</Text>
                <TouchableOpacity
                    onPress={() => {
                        onStarTap(id);
                    }}
                    style={{
                        padding: 10,
                    }}
                >
                    {
                        favorites.includes(id) ?
                            <Icon type='font-awesome' name='star' size={25} color='#ff5722' />
                            :
                            <Icon type='font-awesome-5' name='star' size={20} color='#ff5722' />
                    }
                </TouchableOpacity>
            </View>
        </TouchableOpacity >
    )
}

const style = StyleSheet.create({
    titulo: {
        fontSize: 16,
        color: '#333',
        flex: 9
    }

});