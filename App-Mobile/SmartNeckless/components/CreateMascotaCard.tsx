import React, { use, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Pressable,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Heart, MapPin, ArrowRight, Thermometer, Plus, X, Spinner } from 'phosphor-react-native';
import Toast from 'react-native-toast-message';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { ItemValue } from '@react-native-picker/picker/typings/Picker';
import API from '@/services/apiSmartNeckless';
import { useAuth } from '@/context/AuthContext';
import {Picker} from '@react-native-picker/picker';

interface Mascota {
  nombre: string;
  especie: string;
  sexo: string;
  raza: string;
  imagen?: string;
}

interface Props {
  onMascotaCreada: (nuevaMascota: Mascota) => void;
}

interface SelectItem {
  label: string;
  value: string;
  key: string;
}

export default function CreateMascotaCard({ onMascotaCreada }: Props) {
  const theme = useTheme();
  const isDark = theme === 'dark';
  const styles = createStyles(isDark);
  const [razas, setRazas] = useState<SelectItem[]>([]);
  const [especies, setEspecies] = useState<SelectItem[]>([])
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    especie: '',
    sexo: '',
    raza: '',
  });
  const [loading, setLoading] = useState(false);
  const handleOpenModal = () => setModalVisible(true);
  const handleCloseModal = () => {
    setModalVisible(false);
    setForm({ nombre: '', especie: '', sexo: '', raza: '' });
  };
  useEffect(() => {
    if (especies.length > 0) return; // Evita recargar si ya hay especies
    setLoading(true);
    API.getEspecies().then(response => setEspecies(response.body.map((especie: any) => {return {label: especie.nombre, value: especie.id, key: especie.id}})))
    setLoading(false);
  }, []);
  
  useEffect(() => {
    setLoading(true);
    if (form.especie) {
      API.getRazas(form.especie).then(response => setRazas(response.body.map((raza: any) => {return {label: raza.nombre, value: raza.id, key: raza.id}})))
    }
    setLoading(false);
  }, [form.especie]);

  if (loading) return <Spinner size="large" />;

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handleOpenModal}>
        <View style={styles.imageWrapper}>
          <Plus size={48} color={isDark ? '#fff' : '#000'} weight="regular" />
        </View>

        <View style={styles.info}>
          <Text style={styles.nombre}>{"Nueva Mascota"}</Text>
          <Text style={styles.raza}>{"Raza"}</Text>

          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Heart size={16} color="#ff4757" />
              <Text style={styles.statusText}>{" - "} bpm</Text>
            </View>

            <View style={styles.statusItem}>
              <Thermometer size={16} color="#5099ff" />
              <Text style={styles.statusText}>{" - "}</Text>
            </View>

            <View style={styles.statusItemEnd}>
              <MapPin size={16} color="#0a84ff" />
              <ArrowRight size={16} color="#0a84ff" />
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                    <X size={24} color={isDark ? '#fff' : '#000'} />
                  </TouchableOpacity>

                  <View style={{ alignItems: 'center' }}>
                    {
                      form.especie == 'perro' ?
                        (<Image source={require("@/assets/images/perro.jpg")} style={styles.modalImage} />) : 
                        (form.especie == 'gato' ?
                          (<Image source={require("@/assets/images/gato.jpeg")} style={styles.modalImage} />) :
                          (<View style={[styles.modalImage, styles.placeholder]}>
                            <Plus size={32} color="#888" />
                          </View>))
                    }

                    <TextInput
                      style={styles.input}
                      placeholder="Nombre"
                      placeholderTextColor="#888"
                      value={form.nombre}
                      onChangeText={(text) => setForm({ ...form, nombre: text })}
                    />
                    <Picker style={styles.input}
                      selectedValue={form.sexo}
                      onValueChange={(itemValue: string) => setForm({ ...form, sexo: itemValue })}
                      // style={{ placeholder:{color: isDark ? '#fff' : '#000'} }}
                      // placeholder={{label:"Seleccionar Sexo", value:"", key: ""}}
                      // value={form.sexo}
                      
                      // items={[
                      //   {label:"Macho", value:"MACHO", key: "MACHO"},
                      //   {label:"Hembra", value:"HEMBRA", key: "HEMBRA"}
                      // ]}
                    >
                      <Picker.Item label="Seleccionar Sexo" value="" key="" />
                      <Picker.Item label="Macho" value="MACHO" key="MACHO" />
                      <Picker.Item label="Hembra" value="HEMBRA" key="HEMBRA" />
                    </Picker>
                    <Picker style={styles.input}
                      selectedValue={form.especie}
                      onValueChange={(itemValue: string) => setForm({ ...form, especie: itemValue })}>
                      <Picker.Item label="Seleccionar Especie" value="" key="" />
                      {especies.map((item) => (
                        <Picker.Item label={item.label} value={item.value} key={item.key} />
                      ))}
                    </Picker>
                    {/* <RNPickerSelect
                      style={{ placeholder:{color: isDark ? '#fff' : '#000'} }}
                      placeholder={{label:"Seleccionar Especie", value:"", key: ""}}
                      value={form.especie}
                      onValueChange={(itemValue: string) => setForm({ ...form, especie: itemValue })}
                      items={[...especies]}
                    >
                    </RNPickerSelect> */}
                    <Picker style={styles.input}
                      selectedValue={form.raza}
                      onValueChange={(itemValue: string) => setForm({ ...form, raza: itemValue })}>
                      <Picker.Item label="Seleccionar Raza" value="" key="" />
                      {razas.map((item) => (
                        <Picker.Item label={item.label} value={item.value} key={item.key} />
                      ))}
                    </Picker>
                    {/* <RNPickerSelect
                      style={{ placeholder:{color: isDark ? '#fff' : '#000'} }}
                      placeholder={{label:"Seleccionar Raza", value:"", key: ""}}
                      value={form.raza}
                      onValueChange={(itemValue: string) => setForm({ ...form, raza: itemValue })}
                      items={[...razas]}
                    >
                    </RNPickerSelect> */}
                    <Pressable
                      style={styles.actionButton}
                      onPress={() => {
                        const user = useAuth().user;
                        if (!form.nombre || !form.especie) {
                          Toast.show({
                            type: 'error',
                            text1: 'Campos obligatorios',
                            text2: 'Nombre y especie son requeridos',
                          });
                          return;
                        }

                        // Crear el objeto mascota
                        const nuevaMascota = {
                          ...form,
                        };

                        // Llamar a la función callback
                        onMascotaCreada(nuevaMascota);

                        // Cerrar el modal y limpiar el formulario
                        handleCloseModal();

                        // Mostrar mensaje de éxito
                        Toast.show({
                          type: 'success',
                          text1: 'Mascota creada',
                          text2: `${form.nombre} ha sido agregada`,
                        });

                        if (!form.nombre || !form.especie) {
                          alert('Nombre y especie son obligatorios'); // Mensaje de error
                          return; // Detiene la ejecución si falta algún campo
                        }
                        API.crearMascota(nuevaMascota.nombre, nuevaMascota.especie, nuevaMascota.raza, nuevaMascota.sexo, user?.id)
                        handleCloseModal(); // Cierra el modal solo si pasa la validación
                      }}
                    >
                      <Text style={styles.actionText}>Crear Mascota</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}
const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: 'transparent',
      borderColor: '#ffd33da1',
      borderStyle: 'dashed',
      borderWidth: 3,
      padding: 12,
      marginVertical: 8,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: '80%',
    },
    imageWrapper: {
      marginRight: 12,
      justifyContent: 'center',
      alignItems: 'center',
      width: 64,
      height: 64,
    },
    info: {
      flex: 1,
      justifyContent: 'center',
    },
    nombre: {
      fontWeight: 'bold',
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    raza: {
      fontSize: 14,
      color: isDark ? '#ccc' : '#555',
      marginBottom: 8,
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    statusItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      color: isDark ? '#fff' : '#000',
    },
    statusItemEnd: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: '#0009',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: isDark ? '#25292e' : '#fff',
      padding: 20,
      borderRadius: 20,
      width: '90%',
      maxHeight: '90%',
    },
    modalImage: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 16,
    },
    placeholder: {
      backgroundColor: '#eee',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      padding: 10,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 12,
      color: isDark ? '#fff' : '#000',
    },
    actionButton: {
      backgroundColor: '#0a84ff',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    actionText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 10,
    },
  });