import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';
import Api from '../../components/Api';
import {connect} from 'react-redux';

function Notification(props) {
  const [data, setData] = useState([]);
  console.log(props.route.params.id);
  useEffect(() => {
    props.updateRead(props.route.params.id);
    const fetchData = async () => {
      let json = await Api(`/notification/${props.route.params.id}`, 'GET');
      console.log(json);
      await setData(json.data);
    };
    fetchData();
  }, []);
  return (
    <View
      style={{
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
      }}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontSize: 19}}>{data.sender}</Text>
        <Text>{data.date_added}</Text>
      </View>
      <Text style={{marginTop: 5, marginBottom: 5, fontSize: 17}}>
        {data.subject}
      </Text>
      <Text>{data.message}</Text>
    </View>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateRead: (product) => dispatch({type: 'UPDATE_READ', payload: product}),
  };
};

export default connect(null, mapDispatchToProps)(Notification);
