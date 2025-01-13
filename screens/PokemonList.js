import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
// import { SafeAreaView, View, FlatList} from 'react-native';
import { ListItem } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";

const List = ({ navigation }) => {
  // set state variables for mon
  const [mon, setmon] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    //set isLoadingto true
    setIsLoading(true);

    const baseUrl = `https://api.montcg.io/v2/cards?page=${page}&pageSize=25`;

    console.log("Fetching data...");

    // fetch the mon from the api
    const response = await fetch(baseUrl);
    const jsonData = await response.json();

    // set the mon to current mon plus previous
    //setmon(jsonData.data);
    setmon([...mon, ...jsonData.data]);

    // increment the page number
    //let newPage = ++page;
    setPage(page + 1);

    //set isLoadingto falose
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={mon}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <ListItem
              onPress={() => {
                navigation.navigate("Cards", {
                  id: item.id,
                });
              }}
            >
              <ListItem.Content>
                <ListItem.Title>{item.name}</ListItem.Title>
                <ListItem.Subtitle>{item.supertype}</ListItem.Subtitle>
              </ListItem.Content>
            </ListItem>
          );
        }}
        onEndReached={fetchData}
        onEndReachedThreshold={0.5}
      />
      {isLoading && <ActivityIndicator size="large" marginVertical={8} />}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
});
export default List;
