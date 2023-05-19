import { StyleSheet } from "react-native";
import { colors } from "../../constants";

export default StyleSheet.create({
    map: {
        marginVertical: 20,
        alignSelf: "stretch",
    },
    row: {
        alignSelf: "stretch",
        flexDirection: "row",
        justifyContent: "center",
    },
    cell: {
        flex: 1,
        margin: 3,
        maxWidth: 70,
        aspectRatio: 1,
        borderWidth: 3,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        borderColor: colors.darkgrey,
    },
    cellText: {
        fontSize: 28,
        fontWeight: "bold",
        color: colors.lightgrey,
    },
});
