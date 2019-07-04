import React, { Component } from "react";

import { dest } from "../../constants/destinations";
import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity
} from "react-native";

import trainlogo from "../../images/trainlogo.png";

class FindDestination extends Component {
  state = {
    search: "",
    destinations: dest
  };

  // componentDidMount() {
  //   console.log(this.state);
  //   console.log(dest);
  // }

  searchDestinations = text => {
    const search = text;
    this.setState({ search: search });
    if (search) {
      this.filterDestinations(search.toUpperCase());
    }
  };

  filterDestinations(value) {
    const destinationKeys = Object.keys(this.state.destinations);
    this.setState({
      possibleDestinations: destinationKeys.filter(destination =>
        destination.toUpperCase().includes(value)
      )
    });
  }

  render() {
    const { search, possibleDestinations } = this.state;
    const { selectedDestination } = this.props;

    return (
      <React.Fragment>
        {search ? null : <Image style={styles.image} source={trainlogo} />}
        <TextInput
          style={styles.searchBar}
          onChangeText={text => this.searchDestinations(text)}
          value={search}
          placeholder="Enter your destination"
        />
        {possibleDestinations && search
          ? possibleDestinations.slice(0, 5).map((dest, index) => (
              <TouchableOpacity
                style={styles.destinationButton}
                key={dest + index}
                onPress={() =>
                  selectedDestination(this.state.destinations[dest], dest)
                }
              >
                <Text style={styles.destinationText}>{dest.toUpperCase()}</Text>
              </TouchableOpacity>
            ))
          : null}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    marginTop: "20%",
    width: "80%",
    height: 230
  },
  searchBar: {
    marginTop: "5%",
    width: "80%",
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "lightgrey",
    borderStyle: "solid",
    padding: 10,
    fontSize: 20,
    textAlign: "center"
  },
  destinationButton: {
    width: "80%",
    margin: "2%",
    backgroundColor: "#007aff",
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  destinationText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
    color: "#fff"
  }
});

export default FindDestination;
