import React, { useState, useEffect, ReactText } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { 
  View, 
  ImageBackground, 
  Image, 
  StyleSheet, 
  Text,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {Picker} from '@react-native-community/picker';
import axios from 'axios';

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCitys] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState('Selecione a UF');
  const [selectedCity, setSelectedCity] = useState('Selecione a cidade');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(uf => uf.sigla);
      setUfs(ufInitials);
    });
  }, []);

  useEffect(() => {
    if(selectedUf === 'Selecione a UF'){
      return
    }
    axios
      .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
      const cityNames = response.data.map(uf => uf.nome);
      setCitys(cityNames);
    });

  }, [selectedUf]);

  function handleNavigateToPoints(){
    navigation.navigate('Points', {
      selectedUf,
      selectedCity,
    });
  }

  function handleSelectUf(item: ReactText){
    const uf = String(item);

    setSelectedUf(uf);
  }

  function handleSelectCity(item: ReactText){
    const city = String(item);

    setSelectedCity(city);
  }

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios'? 'padding' : undefined}
    >
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <Text style={styles.title}>Seu marketplace de coleta de residuos</Text>
          <Text style={styles.description}>Ajudando pessoas a encontrarem pontos de coleta de forma eficiente</Text>
        </View>

        <View style={styles.footer}>

          <Picker
            style={styles.picker}
            onValueChange={item => handleSelectUf(item)}
          >
            <Picker.Item label={selectedUf} value={selectedUf} />
            {ufs.map(uf => (
              <Picker.Item key={uf} label={uf} value={uf} />
            ))}
          </Picker>

          <Picker
            style={styles.picker}
            onValueChange={item => handleSelectCity(item)}
          >
            <Picker.Item label={selectedCity} value={selectedCity} />
            {citys.map(city => (
              <Picker.Item key={city} label={city} value={city} />
            ))}
          </Picker>

          <RectButton
            style={styles.button}
            onPress={handleNavigateToPoints}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>  
    </KeyboardAvoidingView>
    )
}

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  picker: {
    backgroundColor: '#FFF',
    height: 60,
    borderRadius: 10,
    marginBottom: 10 
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});