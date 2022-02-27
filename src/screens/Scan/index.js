import React, { useState, useEffect, useContext } from "react";
import { Text, View, StyleSheet, Modal, Image } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { SIZES } from "../../constants";
import CustomText from "../../components/CustomText";
import { useTheme, useIsFocused } from "@react-navigation/native";
import { ethers } from "ethers";
import { TransferTokenContext } from "../../context/TransferTokenProvider";

const Scan = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const { setReceiverAddress } = useContext(TransferTokenContext);
  const isFocused = useIsFocused();
  const [isAddressValid, setAddressValid] = useState();
  const [isModalVisible, setModalVisible] = useState(false);

  const { colors } = useTheme();

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    console.log(isAddressValid);
    if (isAddressValid === false) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [isAddressValid]);

  useEffect(() => {
    console.log(isModalVisible);
  }, [isModalVisible]);

  function isAddress(address) {
    try {
      ethers.utils.getAddress(address);
    } catch (e) {
      console.log("Adress is not valid.");
      setAddressValid(false);
      return false;
    }
    return true;
  }

  const handleBarCodeScanned = ({ type, data }) => {
    // console.log(data);
    if (isAddress(data)) {
      setReceiverAddress(data);
      navigation.navigate("Send Token");
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <View style={styles.container}>
        {isFocused && (
          <BarCodeScanner
            onBarCodeScanned={(data) => handleBarCodeScanned(data)}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        <View style={styles.frameHolder}>
          <View style={{ paddingBottom: SIZES.windowWidth / 2, opacity: 1 }}>
            <Image
              style={styles.frame}
              source={require("../../../assets/images/qr-frame.png")}
            />
          </View>
        </View>
        <View style={styles.infoTextHolder}>
          <CustomText
            fontWeight="bold"
            style={[{ color: colors.text }, styles.infoTextHeader]}
          >
            Scan Your Product Certificate QR code
          </CustomText>
          <CustomText
            style={[
              {
                color: colors.text,
              },
              styles.infoTextBody,
            ]}
          >
            You can only scan Ethereum based wallet addresses. Otherwise, QR
            scanner will not operate.
          </CustomText>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, { backgroundColor: colors.background }]}
          >
            <CustomText style={{ color: colors.text, textAlign: "center" }}>
              This address is not valid. You can only scan Ethereum based wallet
              addresses. Otherwise, QR scanner will not operate.
            </CustomText>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Scan;

const styles = StyleSheet.create({
  container: { flex: 1 },
  frameHolder: {
    position: "absolute",
    height: SIZES.windowHeight,
    width: SIZES.windowWidth,
    backgroundColor: "black",
    opacity: 0.5,
    justifyContent: "center",
    alignItems: "center",
  },
  frame: {
    height: SIZES.windowWidth / 1.5,
    width: SIZES.windowWidth / 1.5,
  },
  infoTextHolder: {
    position: "absolute",
    bottom: SIZES.windowWidth / 4,
    alignItems: "center",
    width: SIZES.windowWidth,
    paddingHorizontal: 48,
  },
  infoTextHeader: { fontSize: SIZES.h5 },
  infoTextBody: { textAlign: "center", marginTop: 5, opacity: 0.75 },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  modalView: {
    width: SIZES.windowWidth / 1.25,
    borderRadius: 8,
    paddingHorizontal: 35,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
