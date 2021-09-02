import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// const [like,setLike] = useState(false);
const NextLession = ({item, click}) => {
  return (
    <TouchableOpacity
      onPress={() => console.log('clicked')}
      style={{
        height: 74,
        marginLeft: 20,
        borderWidth: 1,
        borderColor: '#dddddd',
        borderRadius: 20,
        marginBottom: 15,
      }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{width: 200, fontSize: 15, marginBottom: 10}}>
            {item.desc}
          </Text>
          <Text style={{fontSize: 12, color: '#999999'}}>Mrs. Andora Lion</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NextLession;
