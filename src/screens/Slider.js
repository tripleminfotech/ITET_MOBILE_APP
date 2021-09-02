// import { Button } from 'native-base';
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  Button,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {NavigationActions} from 'react-navigation';
import globalStyle from '../../components/Style';
import {SliderOne, SliderThree, SliderTwo} from '../assets/slider';

// import { Image } from 'native-base';

const slides = [
  {
    key: '1',
    title: 'LEARN AND COLLOBORATE',
    text: 'IT EXPERT TRAINING is a one-stop online hub to \nlearn Trending Technologies.',
    image: <SliderOne height="50%" width="100%" />,
    backgroundColor: 'white',
  },
  {
    key: '2',
    title: 'JOIN 10X SCALING COMMUNITY',
    text: 'Welcome to the world of 10000+ pro learners \nwho gets trained by industry experts.',
    image: <SliderTwo height="50%" width="100%" />,
    backgroundColor: 'white',
  },
  {
    key: '3',
    title: 'LEARN ON YOUR OWN SCHEDULE',
    text: "Anywhere, Anytime. Start Learning Today! \nIt's time to upgrade your skills.",
    image: <SliderThree height="50%" width="100%" />,
    backgroundColor: 'white',
  },
];

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96, // Add padding to offset large buttons and pagination in bottom of page
  },
  image: {
    width: 290,
    height: 290,
    marginTop: 32,
  },
  title: {
    fontSize: 22,
    // marginTop: 32,
    // color: 'white',
    textAlign: 'center',
  },
});

export default class SliderScreen extends React.Component {
  _renderItem = ({item, props}) => {
    const {navigation} = this.props;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: item.backgroundColor,
        }}>
        <SafeAreaView style={styles.slide}>
          {item.image}

          {/* <Image source={item.image} style={styles.image} /> */}
          <Text style={styles.title}>{item.title}</Text>
          <Text style={{marginTop: 10, textAlign: 'center', color: '#8F9BB3'}}>
            {item.text}
          </Text>
        </SafeAreaView>
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            marginBottom: 100,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('login')}
            style={{...globalStyle.appColor, padding: 15, borderRadius: 15}}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              start learning
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'Discover',
                  },
                ],
              })
            }
            style={{
              ...globalStyle.appColor,
              marginLeft: 10,
              padding: 15,
              borderRadius: 15,
            }}>
            <Text style={{textAlign: 'center', color: 'white'}}>
              continue as guest
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  _renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="home" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };
  _renderDoneButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon name="home" color="rgba(255, 255, 255, .9)" size={24} />
      </View>
    );
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          renderItem={this._renderItem}
          bottomButton={true}
          showSkipButton={false}
          showNextButton={false}
          showDoneButton={false}
          activeDotStyle={globalStyle.appColor}
          data={slides}
          onDone={() => console.log('ok')}
        />
      </View>
    );
  }
}
