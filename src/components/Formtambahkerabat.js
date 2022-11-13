import React, { Component, useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import Btntambah from "./Btntambah";

function Formtambahkerabat(props) {
  const [nama_kerabat, setNama_kerabat] = useState(props.nama_kerabat);
  const [profesi_hobi, setProfesi_hobi] = useState(props.profesi_hobi);

  const[styleHubungan, setStyleHubungan] = useState(styles.rect6);
  const[styleNama_kerabat, setStyleNama_kerabat] = useState(styles.rect6);
  const[styleSex, setStyleSex] = useState(styles.rect6);
  const[styleProfesi_hobi, setStyleProfesi_hobi] = useState(styles.rect6);

  const[selectHub, setSelectHub] = useState(props.nama_kerabat === '' ? false:true);

  useEffect(() => {
    if(props.styleKerabat) {
      setStyleError(props.styleKerabat);
    }
  },[props.styleKerabat]);

  const updateNama_kerabat = () => {
    props.setNama_kerabat(nama_kerabat);
  }

  const updateProfesi_hobi = () => {
    props.setProfesi_hobi(profesi_hobi);
  }

  const setStyleError = (e) => {
    //alert(JSON.stringify(e));
    if(e.id_hubungan !== '') {
      setStyleHubungan(styles.rect6Error);
    }else {
      setStyleHubungan(styles.rect6);
    }
    if(e.nama_kerabat !== '') {
      setStyleNama_kerabat(styles.rect6Error);
    }else {
      setStyleNama_kerabat(styles.rect6);
    }
    if(e.sex !== '') {
      setStyleSex(styles.rect6Error);
    }else {
      setStyleSex(styles.rect6);
    }
    if(e.profesi_hobi !== '') {
      setStyleProfesi_hobi(styles.rect6Error);
    }else {
      setStyleProfesi_hobi(styles.rect6);
    }
  }

  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect4}>
        <Text style={styles.tambahkanKerabat}>Tambahkan Kerabat</Text>
        <View style={styles.hunkerabat}>
          <View style={styleNama_kerabat}>
            <TextInput
              placeholder="Nama Kerabat"
              placeholderTextColor="#939393"
              style={styles.fhubkerabat}
              onChangeText={setNama_kerabat}
              onEndEditing={updateNama_kerabat}
              value={nama_kerabat}
            />
          </View>
        </View>
        <View style={styles.hunkerabat} pointerEvents={!selectHub ? 'none':'auto'}>
          <View style={styleHubungan}>
            <props.RenderHubungan style={styles.fhubkerabat} />
          </View>
        </View>
        <View style={styles.hunkerabat} pointerEvents={!selectHub ? 'none':'auto'}>
          <View style={styleSex}>
            <props.RenderSex style={styles.fhubkerabat} />
          </View>
        </View>
        <View style={styles.hunkerabat}>
          <View style={[styleProfesi_hobi, {height: 100, borderRadius: 20}]}>
            <TextInput
              placeholder="Hobby/Minat"
              multiline={true}
              placeholderTextColor="#939393"
              style={styles.fhubkerabat}
              onChangeText={setProfesi_hobi}
              onEndEditing={updateProfesi_hobi}
              value={profesi_hobi}
            ></TextInput>
          </View>
        </View>
        <Btntambah style={styles.btntambah} simpanKerabat={props.simpanKerabat} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rect4: {
    flex: 1,
    padding: '4%',
    backgroundColor: "rgba(74,74,74,1)",
    borderWidth: 3,
    borderColor: "rgba(0,0,0,1)",
    borderRadius: 20
  },
  tambahkanKerabat: {
    fontSize: 18,
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)"
  },
  hunkerabat: {
    flex: 1,
    marginTop: '2%'
  },
  rect6: {
    flex: 1,
    backgroundColor: "rgba(222,222,222,1)",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    borderRadius: 100
  },
  rect6Error: {
    flex: 1,
    backgroundColor: "#FFA07C",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    borderRadius: 100
  },
  fhubkerabat: {
    flex: 1,
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    padding: '4%'
  },
  btntambah: {
    flex: 1,
    alignSelf: 'center',
    padding: '2%',
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,1)",
    backgroundColor: "rgba(74,74,74,1)",
    marginTop: '4%'
  }
});

export default Formtambahkerabat;
