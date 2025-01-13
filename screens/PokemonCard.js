import React, {useState, useEffect} from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { Text, Card, Button, Icon, Avatar } from '@rneui/themed';


const Cards = ({navigation, route}) => {

    const currentUrl = `https://api.pokemontcg.io/v2/cards/${route.params.id}`;

    const [pokemon, setPokemon] = useState({});

    const fetchData = async() => {

      console.log("Fetching data...");

      // fetch the pokemon from the api
      const response = await fetch(currentUrl);
      const jsonData = await response.json();

      setPokemon(jsonData.data);

    };

    useEffect(() => {
        fetchData();
    }, {});

    return (
        <ScrollView>
            <View style={styles.container}>
                <Card>
                    <Card.Title>{pokemon.name}</Card.Title>
                    <Card.Divider />
                      <Text style={styles.titleText}>Subtypes:</Text>
                      {pokemon.subtypes && pokemon.subtypes.map((subtype, index) => {
                        return (
                          <Text style={styles.name}>{subtype}</Text>
                        )
                      })}
                    <Card.Divider />
                      {
                        pokemon.images && 
                          <Image
                            style={styles.image}
                            resizeMode="cover"
                            source={{ uri: pokemon.images.small }}
                          />
                      }
                </Card>
                <Button 
                  onPress={() => {
                  navigation.navigate('Chat',{
                    id: pokemon.id,
                    // pakemon:name
                    name:pokemon.name
                  });
                }}>
                  Open Chat
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    fonts: {
      marginBottom: 8,
    },
    user: {
      flexDirection: 'row',
      marginBottom: 6,
    },
    image: {
      width: 245,
      height: 342,
      marginRight: 10,
    },
    name: {
      fontSize: 16,
      marginTop: 5,
    },
    titleText: {
      fontSize: 20,
      fontWeight: 'bold',
    }
});

export default Cards;