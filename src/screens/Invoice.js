import React, {useEffect, useState} from 'react';
import {FlatList, Text, View} from 'react-native';
import Api from '../components/Api';
import {appColor} from '../components/Style';

export default function Invoice() {
  const [data, setData] = useState([]);
  useEffect(() => {
    // alert('sss');
    fetchData();
  }, []);
  const fetchData = async () => {
    let json = await Api('/invoice/', 'GET');
    console.log(json);
    setData(json.data);
  };
  const renderItem = ({item}) => {
    var today = new Date(item.date_added * 1000);
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: 'white',
          padding: 10,
          marginTop: 10,
          borderRadius: 10,
        }}>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 16}}>Date</Text>
          <Text>{today.toDateString()}</Text>
        </View>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 16}}>ID</Text>
          <Text>{item.id}</Text>
        </View>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 16}}>Price</Text>
          <Text>{item.amount}</Text>
        </View>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 16}}>Payment</Text>
          <Text>{item.payment_type}</Text>
        </View>
        <View
          style={{flexDirection: 'column', justifyContent: 'space-between'}}>
          <Text style={{fontSize: 16}}>Actions</Text>
          <View style={{backgroundColor: appColor, padding: 1}}>
            <Text style={{color: 'white', textAlign: 'center'}}>Invoice</Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <FlatList
        data={data}
        renderItem={(item) => renderItem(item)}
        keyExtractor={(item) => item.id}
      />
    </>
    // renderItem()
  );
}
