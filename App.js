import { StatusBar } from "expo-status-bar";
import { Text, Platform, StyleSheet, SafeAreaView } from "react-native";

import { colors } from "./src/constants";
import Game from "./src/components/Game";

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.title}>PALAVRAS</Text>
            <Game />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: colors.black,
    },
    title: {
        fontSize: 32,
        letterSpacing: 7,
        fontWeight: "bold",
        color: colors.lightgrey,
        marginTop: Platform.OS === "android" ? 35 : 0,
    },
});
