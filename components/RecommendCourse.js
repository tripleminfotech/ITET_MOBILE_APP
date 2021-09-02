import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RecommendCourse = ({navigation, item}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Course')}
      style={{
        flex: 1,
        marginLeft: 20,
        backgroundColor: '#F4F4F4',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
      }}>
      <Image source={require('../Rectangle.png')} width={82} height={82} />
      <View style={{marginLeft: 10, width: 200}}>
        <Text style={{flexShrink: 1}}>
          3000 Most Popular English Vocabulary
        </Text>
        <Text style={{color: '#8F9BB3', fontSize: 15}}>Mrs. Andora Lion</Text>
      </View>
      <Icon
        name="chevron-right"
        color="#8F9BB3"
        size={25}
        style={{marginLeft: 10}}
      />
    </TouchableOpacity>
  );
};

export default RecommendCourse;
