import { useEffect, useState } from "react";
import { Text, View, Alert, ScrollView, ActivityIndicator } from "react-native";
import * as Clipboard from "expo-clipboard";

import words from "../../words";
import styles from "./GameStyle";
import Keyboard from "../Keyboard/Keyboard";
import { copyArray, getDayOfTheYear } from "../../utils";
import { colors, CLEAR, ENTER, colorsToEmoji } from "../../constants";

import AsyncStorage from "@react-native-async-storage/async-storage";

const NUMBER_OF_TRIES = 6;
const dayOfTheYear = getDayOfTheYear();

const Game = () => {
    // AsyncStorage.removeItem('@game');
    // const word = words[dayOfTheYear];
    const word = "hello";
    const letters = word.split(""); // ['h', 'e', 'l', 'l', 'o']

    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(""))
    );
    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setGameState] = useState("playing"); // won, lost, playing
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (curRow > 0) {
            checkGameState();
        }
    }, [curRow]);

    useEffect(() => {
        if (loaded) {
            persistState();
        }
    }, [rows, curRow, curCol, gameState]);

    useEffect(() => {
        readState();
    }, []);

    const persistState = async () => {
        const data = {
            rows,
            curRow,
            curCol,
            gameState,
        };

        try {
            const dataString = JSON.stringify(data);
            await AsyncStorage.setItem("@game", dataString);
        } catch (e) {
            console.log("Failed to write data to async storage", e.message);
        }
    };

    const readState = async () => {
        const dataString = await AsyncStorage.getItem("@game");
        try {
            const data = JSON.parse(dataString);
            setRows(data.rows);
            setCurCol(data.curCol);
            setCurRow(data.curRow);
            setGameState(data.gameState);
        } catch (e) {
            console.log("Couldn't parse the sate", e.message);
        }
        setLoaded(true);
    };

    const checkGameState = () => {
        if (checkIfWon() && gameState !== "won") {
            Alert.alert("Parabéns", "Você vemceu!", [
                { text: "Compartilhar", onPress: shareScore },
            ]);
            setGameState("won");
        } else if (checkIfLost() && gameState !== "lost") {
            Alert.alert("Não foi desta vez", "Tente novamente!");
            setGameState("lost");
        }
    };

    const shareScore = () => {
        const textMap = rows
            .map((row, i) =>
                row
                    .map((cell, j) => colorsToEmoji[getCellBGColor(i, j)])
                    .join("")
            )
            .filter((row) => row)
            .join("\n");
        const textToShare = `Wordle \n${textMap}`;
        Clipboard.setString(textToShare);
        Alert.alert(
            "Copiado com sucesso",
            "Compartilhe sua pontuação em suas redes sociais."
        );
        //console.log(textMap);
    };

    const checkIfWon = () => {
        const row = rows[curRow - 1];
        return row.every((letter, i) => letter === letters[i]);
    };

    const checkIfLost = () => {
        return !checkIfWon() && curRow === rows.length;
    };

    const onKeyPressed = (key) => {
        if (gameState !== "playing") {
            return;
        }
        const updatedRows = copyArray(rows);
        if (key === CLEAR) {
            const prevCol = curCol - 1;
            if (prevCol >= 0) {
                updatedRows[curRow][prevCol] = "";
                setRows(updatedRows);
                setCurCol(prevCol);
            }
            return;
        }
        if (key === ENTER) {
            if (curCol === rows[0].length) {
                setCurRow(curRow + 1);
                setCurCol(0);
            }
            return;
        }
        if (curCol < rows[0].length) {
            updatedRows[curRow][curCol] = key;
            setRows(updatedRows);
            setCurCol(curCol + 1);
        }
    };

    const isCellActive = (row, col) => {
        return row === curRow && col === curCol;
    };

    const getCellBGColor = (row, col) => {
        const letter = rows[row][col];
        if (row >= curRow) {
            return colors.black;
        }
        if (letter === letters[col]) {
            return colors.primary;
        }
        if (letters.includes(letter)) {
            return colors.secondary;
        }
        return colors.darkgrey;
    };

    const getAllLettersWithColor = (color) => {
        return rows.flatMap((row, i) =>
            row.filter((cell, j) => getCellBGColor(i, j) === color)
        );
    };

    const greenCaps = getAllLettersWithColor(colors.primary);
    const yellowCaps = getAllLettersWithColor(colors.secondary);
    const greyCaps = getAllLettersWithColor(colors.darkgrey);

    if (!loaded) {
        return <ActivityIndicator />;
    }

    return (
        <>
            <ScrollView style={styles.map}>
                {rows.map((row, i) => (
                    <View key={`row-${i}`} style={styles.row}>
                        {row.map((letter, j) => (
                            <View
                                key={`cell-${i}-${j}`}
                                style={[
                                    styles.cell,
                                    {
                                        borderColor: isCellActive(i, j)
                                            ? colors.grey
                                            : colors.darkgrey,
                                        backgroundColor: getCellBGColor(i, j),
                                    },
                                ]}
                            >
                                <Text style={styles.cellText}>
                                    {letter.toUpperCase()}
                                </Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
            <Keyboard
                onKeyPressed={onKeyPressed}
                greenCaps={greenCaps} // ['a', 'b']
                yellowCaps={yellowCaps}
                greyCaps={greyCaps}
            />
        </>
    );
};

export default Game;
