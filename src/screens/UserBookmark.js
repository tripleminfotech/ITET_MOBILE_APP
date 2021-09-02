import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import {FlatList} from 'react-native';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Api from '../../components/Api';

export default function UserBookmark({navigation}) {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    let json = await Api('/my_courses', 'GET');
    setData(json);
  };
  const renderItem = (item) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('bookmark', {id: item.id, title: item.title})
        }
        style={{
          margin: 10,
          backgroundColor: 'white',
          flexDirection: 'row',
          borderRadius: 10,
          padding: 15,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{uri: item.thumbnail}}
            style={{height: 61, width: 61}}
          />
          <View style={{marginLeft: 10}}>
            <Text>{item.title}</Text>
            <Text style={{color: '#8F9BB3', fontSize: 13}}>
              {item.instructor_name}
            </Text>
          </View>
        </View>
        <Icon
          name="chevron-right"
          color="#18203A"
          size={30}
          style={{justifyContent: 'flex-end'}}
        />
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView>
      <FlatList
        data={data}
        renderItem={({item}) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
}
