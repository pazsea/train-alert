import React from "react";
import { StyleSheet, View, Text } from "react-native";
import FindDestination from "./components/FindDestination";
import SelectedDestination from "./components/SelectedDestination";

export default class App extends React.Component {
  state = {
    loading: false,
    selected: false,
    selectedCoords: {},
    selectedStation: ""
  };

  selectedDestination = (destCoords, destName) => {
    this.setState({
      selected: true,
      selectedCoords: destCoords,
      selectedStation: destName
    });
  };

  cancelSelectedDestination = () => {
    this.setState({
      selected: false,
      selectedCoords: {},
      selectedStation: ""
    });
  };

  render() {
    const { selected, selectedCoords, selectedStation } = this.state;
    return (
      <View style={styles.container}>
        {selected ? (
          <SelectedDestination
            selectedCoords={selectedCoords}
            selectedStation={selectedStation}
            cancel={this.cancelSelectedDestination}
          />
        ) : (
          <FindDestination selectedDestination={this.selectedDestination} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1D65A6",
    alignItems: "center"
  },
  header: {
    color: "white",
    fontSize: 25
  }
});
