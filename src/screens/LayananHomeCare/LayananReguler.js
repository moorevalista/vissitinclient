import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';

import Loader from '../../components/Loader';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from 'axios';

export default function LayananReguler(props) {
  const formValidation = useContext(form_validation);

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [serviceUser, setServiceUser] = useState('');
  const [tambahKerabat, setTambahKerabat] = useState(false);
  const [jenisLayanan, setJenisLayanan] = useState('reguler');

  const [refCode, setRefCode] = useState('');

  //check persetujuan
  const [setujuPribadi, setSetujuPribadi] = useState(false);
  const [setujuKerabat, setSetujuKerabat] = useState(false);

  //variable untuk menampung dataset kerabat
  const [dataHubungan, setDataHubungan] = useState('');
  const [dataKerabat, setDataKerabat] = useState('')

  //variable untuk menampung list yang dimapping dari dataset
  const [itemsHubungan, setItemsHubungan] = useState([]);
  const [itemsKerabat, setItemsKerabat] = useState([]);

  //data kerabat yang dipilih
  const [id_kerabat, setId_kerabat] = useState('');
  const [nama_kerabat, setNama_kerabat] = useState('');
  const [id_hubungan, setId_hubungan] = useState('');
  const [hubungan, setHubungan] = useState('');
  const [profesi_hobi, setProfesi_hobi] = useState('');
  const [sex, setSex] = useState('');

  //style for form tambah kerabat
  const [styleKerabat, setStyleKerabat] = useState('');
  const [stylePilihKerabat, setStylePilihKerabat] = useState(false);

  //parameter jenis layanan (ex: fisioterapi)
  const [id_profesi, setId_profesi] = useState(props.route.params.id_profesi);
  const [layanan, setLayanan] = useState(props.route.params.jenisLayanan);

  //id faskes jika reservasi FASKES
  const [id_faskes, setId_faskes] = useState(props.route.params.id_faskes);
  const [dataFaskes, setDataFaskes] = useState(props.route.params.dataFaskes);

  //tab layanan
  const [tabReguler, setTabReguler] = useState(true);
  const [tabKhusus, setTabKhusus] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(dataLogin);
        //await setLoading(false);
      }
    }
  }

  useEffect(() => {
    getLoginData();
  },[refreshing]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentDataPasien();
    }
  },[dataLogin]);

  useEffect(() => {
    if(serviceUser === 'kerabat') {
      setKerabatSource(true);
    }
  },[serviceUser]);

  useEffect(() => {
    if(serviceUser === 'kerabat' && itemsKerabat) {
      listKerabat()
      //console.log('uye')
    }
  },[dataKerabat]);

  const setCurrentDataPasien = async () => {
    
    setLoading(false);
  }

  const setKerabatSource = async (e) => {
    await setLoadingSave(e);
    await getHubungan();
    await getKerabat();
    await setLoadingSave(false);
  }

  const getHubungan = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, token: dataLogin.token });

    success = await formValidation.getHubungan(params);

    if(success.status === true) {
      await setDataHubungan(success.res);
    }
  }

  const getKerabat = async () => {
    let params = [];
    params.push({ id_pasien: dataLogin.id_pasien, base_url: props.route.params.base_url, token: dataLogin.token });

    success = await formValidation.getKerabat(params);

    if(success.status === true) {
      await setDataKerabat(success.res);
    }
  }

  function pilihUser(e) {
    if(jenisLayanan === 'khusus') {
      if(!refCode == '') {
        if(refCode.length < 13){
          isValid = false;
          formValidation.showError('Kode Referensi tidak valid...');
          return;
        }
      }else {
        isValid = false;
        formValidation.showError('Kode Referensi harus diisi...');
        return;
      }
    }

    setServiceUser(e);
    setSetujuPribadi(false);
    setSetujuKerabat(false);
    setTambahKerabat(false);
    resetDataKerabat();
    if(e === 'kerabat') {
      setKerabatSource(false);
    }
  }

  function resetDataKerabat() {
    setId_kerabat('');
    setNama_kerabat('');
    setId_hubungan('');
    setSex('');
    setProfesi_hobi('');
    setStyleKerabat('');
  }

  function pilihLayanan(e) {
    setJenisLayanan(e);
    setServiceUser('');
    setRefCode('');
    switch (e) {
      case 'reguler':
        setTabReguler(true);
        setTabKhusus(false);
        break;
      case 'khusus':
        setTabReguler(false);
        setTabKhusus(true);
        break;
      default:
        setTabReguler(true);
        setTabKhusus(false);
    }
  }

  //render jenis layanan
  function Reguler() {
    if(jenisLayanan === 'reguler') {
      return (
        <>
          <Text style={styles.reguler}>REGULER</Text>
          <View style={styles.group}>
            <View style={styles.innerGroup}>
              <TouchableOpacity style={styles.button} onPress={() => pilihUser('pribadi')}>
                <View style={styles.rect}>
                  <Text style={styles.label}>PRIBADI</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => pilihUser('kerabat')}>
                <View style={styles.rect2}>
                  <Text style={styles.label2}>KERABAT</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }else {
      return (
        <></>
      )
    }
  }

  //handle click persetujuan
  function handlePersetujuan(name) {
    switch(name) {
      case 'pribadi':
        setSetujuPribadi(!setujuPribadi);
        break;
      case 'kerabat':
        setSetujuKerabat(!setujuKerabat);
        break;
      default:
        setSetujuPribadi(false);
        setSetujuKerabat(false);
    }
  }

  //tambah kerabat
  function handleTambahKerabat(e) {
    setTambahKerabat(e);
    listHubungan();
    resetDataKerabat();
  }

  //mapping data hubungan
  const listHubungan = async () => {
    const newItems = dataHubungan;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_hub + '|' + item.hubungan, label: item.hubungan}
        )
      });
    }
    //console.log(options);
    setItemsHubungan(options);
  }

  //mapping data kerabat
  const listKerabat = async () => {
    const newItems = dataKerabat;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kerabat + '|' + item.full_name + '|' + item.hubungan + '|' + item.sex, label: item.full_name}
        )
      });
    }
    //console.log(options);
    setItemsKerabat(options);
  }

  //render Dropdown listHubungan untuk ditampilkan di form
  const RenderHubungan = () => {
    const items = itemsHubungan;
    const placeholder = {
      label: 'Pilih Hubungan...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== null) {
                const data = value.split('|')
                if(data[0] !== id_hubungan) {
                  setId_hubungan(data[0])
                  setHubungan(data[1])
                }
              }
            }}
            style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
            value={id_hubungan + '|' + hubungan}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  //render Dropdown listKerabat untuk ditampilkan di form
  const RenderKerabat = () => {
    const items = itemsKerabat;
    const placeholder = {
      label: 'Pilih Kerabat...',
      value: null
    };
    return (
      <RNPickerSelect
            placeholder={placeholder}
            items={items}
            onValueChange={(value) => {
              if(value !== null) {
                const data = value.split('|')
                if(data[0] !== id_kerabat) {
                  setId_kerabat(data[0])
                  setNama_kerabat(data[1])
                  setHubungan(data[2])
                  setSex(data[3])
                }
              }
            }}
            style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
            value={id_kerabat + '|' + nama_kerabat + '|' + hubungan + '|' + sex}
            useNativeAndroidPickerStyle={false}
          />
    )
  }

  //render Dropdown Gender untuk ditampilkan di form
  const RenderSex = () => {
    const placeholder = {
      label: 'Pilih Gender...',
      value: null
    };

    return (
        <RNPickerSelect
            placeholder={placeholder}
            items={[
              { label: 'Pria', value: 'Pria' },
              { label: 'Wanita', value: 'Wanita' },
            ]}
            onValueChange={(value) => {
              if(value !== null && value !== sex) {
                setSex(value)
              }
            }}
            style={{...pickerSelectStyles, placeholder: {color: '#939393'}}}
            value={sex}
            useNativeAndroidPickerStyle={false}
          />
    );
  }

  function TambahKerabat() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.containerKey}
        >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.container, {paddingBottom: 10, borderRadius: 10, backgroundColor: 'rgba(36,195,142,1)'}]}>
            <TouchableOpacity onPress={() => setTambahKerabat(false)}>
              <View style={[styles.Tbl_iconPanah, {alignSelf: 'flex-end'}]}>
                <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
              </View>
            </TouchableOpacity>
            <View style={[stylesKerabat.Form_kerabat]}>
              <View style={stylesKerabat.Group463}>
                {/*<View style={stylesKerabat.Select}>*/}
                  <View style={stylesKerabat.Box}>
                    {/*<TextInput style={stylesKerabat.Txt686} placeholder='Hubungan Kerabat'/>*/}
                    <RenderHubungan />
                  </View>
                {/*</View>*/}
                {/*<View style={stylesKerabat.Select}>*/}
                  <View style={stylesKerabat.Box}>
                    <TextInput
                      style={stylesKerabat.Txt686}
                      placeholder='Nama Kerabat'
                      //onChangeText={setNama_kerabat}
                      onEndEditing={(value) => setNama_kerabat(value.nativeEvent.text)}
                      defaultValue={nama_kerabat}
                    />
                  </View>
                {/*</View>*/}
                {/*<View style={stylesKerabat.Select}>*/}
                  <View style={stylesKerabat.Box}>
                    {/*<TextInput style={stylesKerabat.Txt686} placeholder='Jenis Kelamin' />*/}
                    <RenderSex />
                  </View>
                {/*</View>*/}
                <View style={[stylesKerabat.Box, {height: 100, paddingVertical: 5}]}>
                  <TextInput
                    style={stylesKerabat.Txt686}
                    multiline={true}
                    maxLength={100}
                    placeholder='Hobby / Minat'
                    //onChangeText={setProfesi_hobi}
                    onEndEditing={(value => setProfesi_hobi(value.nativeEvent.text))}
                    defaultValue={profesi_hobi}
                  />
                </View>
                <TouchableOpacity style={[stylesKerabat.Btn_tambah, {marginTop: 10}]} onPress={simpanKerabat}>
                  <Text style={stylesKerabat.Txt337}>Tambah</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    )
  }

  function Layanan() {
    if(jenisLayanan === 'reguler') {
      switch(serviceUser) {
        case 'pribadi':
          return (
            <>
              <Pribadi />
              <Btnlanjut
                page="rootService"
                name="pribadi"
                type="reguler"
                style={styles.cupertinoButtonGrey}
                handleNextReguler={handleNextReguler}
              />
            </>
          )
          break;
        case 'kerabat':
          if(!tambahKerabat) {
            return(
              <>
                <Kerabat />
                <Btnlanjut
                  page="rootService"
                  name="kerabat"
                  type="reguler"
                  style={styles.cupertinoButtonGrey}
                  handleNextReguler={handleNextReguler}
                />
              </>
            )
          }else {
            return (
              <TambahKerabat />
            )
          }
          break;
        default:
          return (
            <></>
          )
      }
    }else {
      return (
        <></>
      )
    }
  }

  //simpan data
  const simpanKerabat = async () => {
    let paramsData = [];
    paramsData.push({
      nama_kerabat: nama_kerabat,
      sex: sex,
      profesi_hobi: profesi_hobi,
      id_hubungan: id_hubungan
    });

    //alert(JSON.stringify(paramsData));
    val = formValidation.handlePreSubmitAddKerabat(paramsData);
    if(val.status === false) {
      setStyleKerabat(val);
      //alert(JSON.stringify(val));
    }else if(val.status === true) {
      setLoadingSave(true);
      const formData = new FormData();
      formData.append("full_name", nama_kerabat);
      formData.append("id_pasien", dataLogin.id_pasien);
      formData.append("sex", sex);
      formData.append("profesi_hobi", profesi_hobi);
      formData.append("id_hubungan", id_hubungan);
      formData.append("token", dataLogin.token);

      axios
      .post(props.route.params.base_url + "pasien/regisFamily/", formData)
      .then(() => {
        setLoadingSave(false);
        pilihUser('kerabat');
        formValidation.showError('Registrasi berhasil...');
        setRefreshing(true);
      })
      .catch(error => {
        if(error.response !== undefined && error.response.status === 404) {
            formValidation.showError('Terjadi kesalahan...');
          }else {
            formValidation.showError(error);
          }
          setLoadingSave(false);
      })
    }
  }

  const handleNextReguler = async (e) => {
    let nameButton = e;

    if(nameButton === 'pribadi' && setujuPribadi === false) {
      formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran untuk melanjutkan !!!');
    }else if(nameButton === 'kerabat' && setujuKerabat === false) {
      formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran kerabat anda untuk melanjutkan !!!');
    }else {
      //await AsyncStorage.setItem('checkPribadi', JSON.stringify(setujuPribadi));
      //await AsyncStorage.setItem('checkKerabat', JSON.stringify(setujuKerabat));
      onNextReguler();
    }
  };

  const onNextReguler = async () => {
    // Go to screen 'ft_page'
    if(setujuKerabat === true && id_kerabat === '') {
      setStylePilihKerabat(true);

      formValidation.showError('Anda belum memilih data kerabat');
    }else {
      let resKerabat = [];
      resKerabat.push({
        id_kerabat: id_kerabat,
        nama_kerabat: nama_kerabat,
        id_hubungan: id_hubungan,
        hubungan: hubungan,
        sex: sex
      })
      props.navigation.navigate('layananFirst', { base_url: props.route.params.base_url, resKerabat: resKerabat, id_profesi: id_profesi, jenisLayanan: layanan, id_faskes: id_faskes, dataFaskes: dataFaskes });
    }
  }

  const handleNextKhusus = async (e) => {
    const nameButton = e;
    let isValid = true;

    if(serviceUser === '') {
      isValid = false;
      formValidation.showError('Pengguna Layanan harus dipilih...');
    }else {
      if(serviceUser === 'kerabat' && (id_kerabat === '' || nama_kerabat === '' || hubungan === '' || sex === '')) {
        isValid = false;
        formValidation.showError('Data Kerabat harus dipilih...');
      }
    }

    if(!refCode == '') {
      if(refCode.length < 13){
        isValid = false;
        formValidation.showError('Kode Referensi tidak valid...');
      }
    }else {
      isValid = false;
      formValidation.showError('Kode Referensi harus diisi...');
    }

    if(isValid) {
      if(serviceUser === 'pribadi' && setujuPribadi === false) {
        formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran untuk melanjutkan !!!');
      }else if(serviceUser === 'kerabat' && setujuKerabat === false) {
        formValidation.showError('Pastikan anda mengerti dan memahami syarat dan ketentuan pendaftaran kerabat anda untuk melanjutkan !!!');
      }else {
        //await AsyncStorage.setItem('checkPribadi', JSON.stringify(setujuPribadi));
        //await AsyncStorage.setItem('checkKerabat', JSON.stringify(setujuKerabat));
        onNextKhusus();
      }
    }
  };

  const onNextKhusus = async () => {
    // Go to screen 'ft_page'
    if(setujuKerabat === true && id_kerabat === '') {
      setStylePilihKerabat(true);

      formValidation.showError('Anda belum memilih data kerabat');
    }else {
      let resKerabat = [];
      resKerabat.push({
        id_kerabat: id_kerabat,
        nama_kerabat: nama_kerabat,
        id_hubungan: id_hubungan,
        hubungan: hubungan,
        sex: sex
      });
      
      props.navigation.navigate('profilNakesKhusus', { base_url: props.route.params.base_url, refCode: refCode, serviceUser: serviceUser, resKerabat: resKerabat, id_profesi: id_profesi, jenisLayanan: layanan });
    }
  }

  function refValidation(e) {
    const refCode = e;
    
    if(refCode !== '') {
      if(!refCode.match(/^[0-9]+$/)){
        return('');
      }else {
        return(refCode);
      }
    }else {
      return('');
    }
  }

  //new script//

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 14,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
  };

  // untuk tampilan reguler dan khusus
  const TampilanReguler = () => {
    if (serviceUser === 'pribadi') {
      return <TampilanPribadi />;
    }
    if (serviceUser === 'kerabat') {
      return <TampilanKerabat />;
    }
    return (
      <>
        <View style={styles.sub_reguler}>
          <Text style={styles.Txt253}>
            Tentukan kebutuhan layanan untuk anda pribadi atau untuk kerabat
            dekat anda.
          </Text>
        </View>
        <TouchableOpacity onPress={() => pilihUser('pribadi')}>
          <View style={styles.Btn_pribadi}>
            <Text style={styles.Txt760}>Pribadi</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pilihUser('kerabat')}>
          <View style={styles.Btn_pribadi}>
            <Text style={styles.Txt760}>Kerabat</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const TampilanKhusus = () => {
    const [newRefCode, setNewRefCode] = useState(refCode);

    if (serviceUser === 'pribadi') {
      return <TampilanPribadi />;
    }
    if (serviceUser === 'kerabat') {
      return <TampilanKerabat />;
    }
    return (
      <>
        <View style={styles.sub_reguler}>
          <Text style={styles.Txt253}>
            Masukkan kode referensi yang dapat anda peroleh dari tenaga
            kesehatan terdaftar.
          </Text>
        </View>
        <View style={styles.sub_reguler}>
          <TextInput
            placeholder="Kode Referensi Tenaga Kesehatan"
            keyboardType="numeric"
            style={styles.input}
            maxLength={13}
            onChangeText={(value) => {
              const code = refValidation(value)
              setNewRefCode(code)
            }}
            onEndEditing={() => {
                setRefCode(newRefCode)
            }}
            value={newRefCode}
          />
        </View>
        <View style={styles.sub_reguler}>
          <Text style={styles.Txt253}>
            Dan tentukan kebutuhan layanan untuk anda pribadi atau untuk kerabat
            dekat anda.
          </Text>
        </View>
        <TouchableOpacity onPress={() => pilihUser('pribadi')}>
          <View style={styles.Btn_pribadi}>
            <Text style={styles.Txt760}>Pribadi</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pilihUser('kerabat')}>
          <View style={styles.Btn_pribadi}>
            <Text style={styles.Txt760}>Kerabat</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };
  // akhir tampilan reguler dan khusus

  // awal untuk tampilan Pribadi dan kerabat
  const TampilanPribadi = () => {
    return (
      <>
        <View style={styles.Checkbox_pribadi}>
          <CheckBox
            style={styles.checkbox}
            boxType='square'
            tintColors={true}
            disabled={false}
            value={setujuPribadi}
            onValueChange={() => handlePersetujuan('pribadi')}
          />
          <Text style={styles.Txt2535}>
            Saya mengerti dan memahami bahwa segala layanan yang saya pilih dan
            gunakan adalah untuk kebutuhan saya pribadi.
          </Text>
        </View>
      </>
    );
  };
  const TampilanKerabat = () => {
    return (
      !tambahKerabat ?
      <>
        <View style={styles.selectOption}>
          <RenderKerabat />
        </View>
        <View style={styles.Checkbox_pribadi}>
          <CheckBox
            style={styles.checkbox}
            boxType='square'
            tintColors={true}
            disabled={false}
            value={setujuKerabat}
            onValueChange={() => handlePersetujuan('kerabat')}
          />
          <Text style={styles.Txt2535}>
            Saya mengerti dan memahami bahwa saya akan bertindak sebagai wali
            dari kerabat saya untuk kebutuhan layanan yang saya pilih dan
            gunakan untuk kebutuhan kerabat saya.
          </Text>
        </View>
        <TouchableOpacity style={styles.Btn_layanan1} onPress={() => {
          handleTambahKerabat(true);
        }}>
          <Text style={styles.Txt386}>Tambah Kerabat</Text>
          <View style={styles.Tbl_iconPanah}>
            <Icons label="Panah" name="add" />
          </View>
        </TouchableOpacity>
      </>
      :
      <TambahKerabat />
    );
  };
  // akhir untuk tampilan Pribadi dan kerabat

  // fungtion untuk bagian pribadi dan kerabat
  const pilihanPribadiKerabat = pilih => {
    if (pilih == 'pribadi') {
      setPribadi(true);
      setKerabat(false);
    } else {
      setPribadi(false);
      setKerabat(true);
    }
  };

  // btn untuk lanjut
  const BtnLanjutReguler = () => {
    if(!tambahKerabat) {
      if (serviceUser === 'pribadi' && jenisLayanan === 'reguler') {
        return (
          <View style={styles.Group1039}>
            <TouchableOpacity
              style={styles.Btn_lanjut(layout)}
              onPress={() => pilihLayanan('reguler')}>
              <Text style={styles.Txt760}>BATAL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Btn_lanjut1(layout)}
              onPress={() => handleNextReguler('pribadi')}>
              <Text style={styles.Txt760}>LANJUT</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (serviceUser === 'pribadi' && jenisLayanan === 'khusus') {
        return (
          <View style={styles.Group1039}>
            <TouchableOpacity
              style={styles.Btn_lanjut(layout)}
              onPress={() => pilihLayanan('khusus')}>
              <Text style={styles.Txt760}>BATAL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Btn_lanjut1(layout)}
              onPress={() => handleNextKhusus('pribadi')}>
              <Text style={styles.Txt760}>LANJUT</Text>
            </TouchableOpacity>
          </View>
        );
      }
      if (serviceUser === 'kerabat' && jenisLayanan === 'reguler') {
        return (
          <View style={styles.Group1039}>
            <TouchableOpacity
              style={styles.Btn_lanjut(layout)}
              onPress={() => pilihLayanan('reguler')}>
              <Text style={styles.Txt760}>BATAL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Btn_lanjut1(layout)}
              onPress={() => handleNextReguler('kerabat')}>
              <Text style={styles.Txt760}>LANJUT</Text>
            </TouchableOpacity>
          </View>
        );
      } else if (serviceUser === 'kerabat' && jenisLayanan === 'khusus') {
        return (
          <View style={styles.Group1039}>
            <TouchableOpacity
              style={styles.Btn_lanjut(layout)}
              onPress={() => pilihLayanan('khusus')}>
              <Text style={styles.Txt760}>BATAL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.Btn_lanjut1(layout)}
              onPress={() => handleNextKhusus('kerabat')}>
              <Text style={styles.Txt760}>LANJUT</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
    return <></>;
  };

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  return (
    !loading ?
    <SafeAreaView style={styles.container}>
      <ScrollView
        horizontal={false}
        contentContainerStyle={styles.scrollArea_contentContainerStyle}
      >
        <View style={styles.Layanan_reservasi_reguler}>
          <View>
            <View style={styles.Tab_pesan}>
              <TouchableOpacity onPress={() => pilihLayanan('reguler')}>
                <View style={styles.Group316(tabReguler)}>
                  <Text style={styles.Txt6110(tabReguler)}>Reguler</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pilihLayanan('khusus')}>
                <View style={styles.Group316(tabKhusus)}>
                  <Text style={styles.Txt6110(tabKhusus)}>Khusus</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/*  isi untuk bagian reguler */}
            {jenisLayanan === 'reguler' ? (
              <TampilanReguler />
            ) : (
              // isi untuk bagian khusus
              <>
                <TampilanKhusus />
              </>
            )}
          </View>
        </View>
        <BtnLanjutReguler />
      </ScrollView>
    </SafeAreaView>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  containerKey: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Layanan_reservasi_reguler: {
    flex: 1,
    paddingTop: 25,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  Tab_pesan: {
    flexDirection: 'row',
    padding: 6,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(218,218,218,1)',
  },
  Group316: item => ({
    paddingVertical: 7,
    justifyContent: 'space-between',
    paddingHorizontal: 60,
    borderRadius: 20,
    backgroundColor: item ? 'rgba(36,195,142,1)' : 'rgba(217,217,217,1)',
  }),
  Txt6110: item => ({
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: item ? 'rgba(255, 255, 255, 1)' : 'rgba(79,92,99,1)',
    textAlign: 'center',
    justifyContent: 'center',
  }),

  sub_reguler: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 30,
    width: '90%'
  },

  Txt253: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    textAlign: 'justify',
    width: '90%',
  },
  Txt2535: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    textAlign: 'justify',
    width: '80%',
  },

  Btn_pribadi: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    marginBottom: 20,
  },

  Txt760: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  Btn_layanan1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  Txt386: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    justifyContent: 'space-around',
    alignItems: 'center',
    color: 'rgba(0,0,0,1)',
  },
  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(36,195,142,0.5)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  input: {
    //flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 25,
    borderWidth: 0.5,
    borderColor: 'rgba(54,54,54,1)',
    borderRadius: 20,
    color: 'rgba(0,32,51,1)',
    height: 40,
    width: '90%',
    textAlign: 'center',
  },
  Checkbox_pribadi: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: 50,
    width: '90%',
  },

  checkbox: {
    borderWidth: 1,
    height: 20,
    width: 20,
    marginRight: 10,
  },

  selectOption: {
    justifyContent: 'space-around',
    paddingHorizontal: '4%',
    borderWidth: 0.5,
    borderColor: 'rgba(54,54,54,1)',
    borderRadius: 20,
    marginVertical: 20,
    color: 'rgba(0,32,51,1)',
    height: 40,
  },

  Group1039: {
    //flex: 1,
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: '8%',
    marginTop: 10,
  },
  Btn_lanjut: layout => ({
    flex: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 19,
    paddingRight: 19,
    paddingVertical: 5,
    marginRight: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(36,195,142,1)',
    //width: layout.width - 180,
  }),
  Btn_lanjut1: layout => ({
    flex: 0.5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 19,
    paddingRight: 19,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(54,54,54,1)',
    //width: layout.width - 180,
  }),
});

const stylesKerabat = StyleSheet.create({
  Form_kerabat: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 'auto',
    paddingHorizontal: 10,
  },
  Group463: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },

  Button: {
    width: 40,
    height: 40,
  },

  Select: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  Box1: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 19,
    paddingRight: 0,
    borderRadius: 99,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(0,66,105,0.28)",
    width: 280,
    height: 40,
  },

  Select: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  Box: {
    justifyContent: 'space-around',
    paddingHorizontal: '4%',
    borderWidth: 0.5,
    borderColor: 'rgba(54,54,54,1)',
    borderRadius: 20,
    marginVertical: 2,
    color: 'rgba(0,32,51,1)',
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "rgba(0,66,105,0.28)",
    width: 280,
  },
  Txt686: {
    flex: 1,
    fontSize: 12,
    //fontFamily: "Inter, sans-serif",
    fontWeight: "400",
    //lineHeight: 22,
    color: "gray",
    padding: 0
    /*  linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), linear-gradient(0deg, rgba(79,92,99,1), rgba(79,92,99,1)) */
  },
  Button: {
    width: 40,
    height: 40,
  },

  Btn_tambah: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 38,
    paddingRight: 38,
    borderRadius: 20,
    backgroundColor: "rgba(54,54,54,1)",
    //height: 40,
  },
  Txt337: {
    fontSize: 12,
    //fontFamily: "Poppins, sans-serif",
    fontWeight: "400",
    lineHeight: 22,
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    justifyContent: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    //padding: '4%',
    //paddingVertical: 10,
    //paddingHorizontal: 12,
    //borderWidth: 1,
    borderColor: 'green',
    //borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 12,
    //padding: '4%',
    //paddingHorizontal: 10,
    //paddingVertical: 8,
    //borderWidth: 1,
    borderColor: 'blue',
    //borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
