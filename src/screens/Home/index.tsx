import React, { useState, useCallback } from "react";
import { View, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import { Appointment, AppointmentProps } from "../../components/Appointment";
import { ButtonAdd } from "../../components/ButtonAdd";
import { CategorySelect } from "../../components/CategorySelect";
import { ListDivider } from "../../components/ListDivider";
import { ListHeader } from "../../components/ListHeader";
import { Profile } from "../../components/Profile";
import { Background } from "../../components/Background";

import { styles } from "./styles";
import { COLLECTION_APPOINTMENTS } from "../../configs/database";
import { Load } from "../../components/Load";

export function Home() {
  const [category, setCategory] = useState('');
  const [appointments, setAppointmens] = useState<AppointmentProps[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation()

  function handleCategorySelect(categoryId: string) {
    categoryId === category ? setCategory("") : setCategory(categoryId);
  }

  function handleAppointmentDetails(guildSelected: AppointmentProps) {
    navigation.navigate('AppointmenDetails', { guildSelected })
  }

  function handleAppointmentCreate() {
    navigation.navigate('AppointmentCreate')
  }

  async function loadAppointments() {
    const response = await AsyncStorage.getItem(COLLECTION_APPOINTMENTS);
    const storage: AppointmentProps[] = response ? JSON.parse(response) : [];

    if(category) {
      setAppointmens(storage.filter(item => item.category === category));
    } else {
      setAppointmens(storage);
    }

    setLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadAppointments();
  },[category]))

  return (
    <Background>
      <View style={styles.header}>
        <Profile />
        <ButtonAdd
          onPress={handleAppointmentCreate}
        />
      </View>

      <CategorySelect
        categorySelected={category}
        setCategory={handleCategorySelect}
      />

      {
        loading ? <Load /> :
        <>
        <ListHeader title="Partidas Agendadas" subtitle={`Total: ${appointments.length}`} />
        <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => 
          {
            if (!item.category) {
              item.category = '1';
            }
            return <Appointment
            data={item}
            onPress={() => handleAppointmentDetails(item)} />
          }
        }
        style={styles.matches}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 69}}
        ItemSeparatorComponent={() => <ListDivider isCentered/>}
        />
        </>
      }
    </Background>
  );
}
