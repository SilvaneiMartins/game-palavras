import { StyleSheet, Dimensions } from "react-native";
import { keys, colors } from "../../constants";

const screenWidth = Dimensions.get("window").width;
export const keyWidth = (screenWidth - 10) / keys[0].length;
const keyHeight = keyWidth * 1.3;

export default StyleSheet.create({
  keyboard: {
      marginTop: "auto",
      alignSelf: "stretch",
  },
  row: {
    alignSelf: "stretch",
    flexDirection: "row",
    justifyContent: "center",
  },
  key: {
    margin: 2,
    borderRadius: 4,
    width: keyWidth - 4,
    alignItems: "center",
    height: keyHeight - 4,
    justifyContent: "center",
    backgroundColor: colors.grey,
  },
  keyText: {
      fontSize: 12,
      fontWeight: "bold",
      color: colors.lightgrey,
  },
});
