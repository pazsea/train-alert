import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Image,
  Button,
  Text,
  TouchableOpacity,
  PermissionsAndroid
} from "react-native";
import MapView from "react-native-maps";
import Modal from "react-native-modal";

import complete from "../../images/complete.png";

import { isPointWithinRadius } from "geolib";

class SelectedDestination extends Component {
  state = {
    arrived: false,
    startedTrip: false,
    currentCoords: { currentLat: null, currentLong: null }
  };

  async startWatchListener(confirmedLat, confirmedLong) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Train Alert needs to access your location",
          message:
            "Train Alert needs access to your location " +
            "so it can alert you when you are at your destination",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.setState({ startedTrip: true });
        this.watchID = navigator.geolocation.watchPosition(
          position => {
            // checks if 51.525/7.4575 is within a radius of 5 km from 51.5175/7.4678
            const calc = isPointWithinRadius(
              {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              },
              { latitude: confirmedLat, longitude: confirmedLong },
              500
            );
            if (calc) {
              this.setState(
                {
                  arrived: calc
                },
                navigator.geolocation.clearWatch(this.watchID)
              );
            } else {
              console.log("Calc är " + calc);
              // this.setState({
              //   currentCords: {
              //     currentLat: position.coords.latitude,
              //     currentLong: position.coords.longitude
              //   }
              // });
            }
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 10000
          }
        );
      } else {
        return () => this.props.cancel;
      }
    } catch (err) {
      console.warn(err);
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    const {
      selectedStation,
      selectedCoords: { lat, long },
      cancel
    } = this.props;
    const { arrived, startedTrip } = this.state;

    return (
      <React.Fragment>
        <Modal
          isVisible={arrived}
          onBackButtonPress={() => cancel}
          onBackdropPress={() => cancel}
          hideModalContentWhileAnimating={true}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#FFDF00"
          }}
        >
          <Text style={styles.headerArrived}>YOU HAVE ARRIVED!</Text>
          <Image
            style={{ width: 200, height: 200 }}
            source={complete}
            onPress={() => cancel}
          />
          <TouchableOpacity style={styles.buttonBackArrived} onPress={cancel}>
            <Text style={styles.textCancel}>GO BACK</Text>
          </TouchableOpacity>
        </Modal>
        <View style={styles.destinationView}>
          <Text style={styles.headerMap}>
            {startedTrip ? "On our way to:" : "Selected Destination:"}
          </Text>
          <Text style={styles.headerDestination}>{selectedStation}</Text>
        </View>
        <View style={styles.mapStyle}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: lat,
              longitude: long,
              latitudeDelta: 0.0422,
              longitudeDelta: 0.091
            }}
          >
            <MapView.Marker coordinate={{ latitude: lat, longitude: long }} />
          </MapView>
        </View>
        {startedTrip ? (
          <TouchableOpacity style={styles.buttonCancel} onPress={cancel}>
            <Text style={styles.textCancel}>CANCEL</Text>
          </TouchableOpacity>
        ) : (
          <React.Fragment>
            <TouchableOpacity
              onPress={() => this.startWatchListener(lat, long)}
              style={styles.buttonConfirm}
            >
              <Text style={styles.textConfirm}>CONFIRM DESTINATION</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonCancel} onPress={cancel}>
              <Text style={styles.textCancel}>GO BACK</Text>
            </TouchableOpacity>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: "80%",
    height: 300
  },
  destinationView: {
    width: "80%",
    borderWidth: 1,
    borderColor: "white",
    borderStyle: "dotted",
    textAlign: "center",
    marginTop: "20%",
    marginBottom: "5%"
  },
  header: {
    color: "white"
  },
  buttonArrived: {
    backgroundColor: "#009900"
  },
  headerMap: {
    textAlign: "center",
    color: "white",
    fontSize: 20
  },
  headerDestination: {
    color: "gold",
    marginBottom: "3%",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center"
  },
  headerArrived: {
    color: "black",
    marginBottom: "3%",
    fontSize: 25
  },
  buttonCancel: {
    backgroundColor: "red",
    width: "80%",
    marginTop: "3%",
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  buttonBackArrived: {
    backgroundColor: "green",
    width: "60%",
    marginTop: "10%",
    paddingHorizontal: 30,
    paddingVertical: 5
  },
  textCancel: {
    color: "white",
    fontSize: 20,
    textAlign: "center"
  },
  textConfirm: {
    textAlign: "center",
    color: "white",
    fontSize: 20
  },
  buttonConfirm: {
    backgroundColor: "#009900",
    width: "80%",
    marginTop: "3%",
    paddingHorizontal: 30,
    paddingVertical: 5
  }
});

export default SelectedDestination;
