import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  BackHandler,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SearchBar from "../../components/yohan/SearchBar";
import CategoryGrid from "../../components/yohan/CategoryGrid";
import PopularServiceProviders from "../../components/yohan/PopularServiceProvider";

const { width } = Dimensions.get("window");

const Home = () => {
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "Are you sure you want to exit the app?", [
          { text: "Cancel", onPress: () => null, style: "cancel" },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => backHandler.remove();
    }, [])
  );

  const renderContent = () => (
    <View>
      <SearchBar />
      <CategoryGrid />
      <PopularServiceProviders />
      <View style={styles.quickAccessContainer}>
        <Text style={styles.quickAccessHeading}>Quick Access</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.quickAccessButton}>
          <Text style={styles.buttonText}>My Job History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessButton}>
          <Text style={styles.buttonText}>Create Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={[]}
          renderItem={null}
          ListHeaderComponent={renderContent}
          scrollEnabled={false} // Disable FlatList scrolling to enable ScrollView
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  quickAccessContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quickAccessHeading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#3498DB",
    flex: 1,
    fontFamily: "sans-serif-condensed",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  quickAccessButton: {
    backgroundColor: "#3498DB",
    justifyContent: "center",
    borderRadius: 5,
    alignItems: "center",
    width: "48%",
    height: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "sans-serif-condensed",
    fontSize: 18,
  },
});

export default Home;
