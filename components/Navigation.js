import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Discover from '../src/screens/Discover';
import Messages from '../src/screens/Messages';
import MyCourses from '../src/screens/MyCourses';
import Notification from '../src/screens/Notification';
import Profile from '../src/screens/Profile';
import Detail from '../src/screens/Detail';
import Search from '../src/screens/Search';
import Course from '../src/screens/Course';
import SliderScreen from '../src/screens/Slider';
import LoginScreen from '../src/screens/Login';
import AuthLoadingScreen from '../components/AuthLoading';
import StartCourse from '../src/screens/StartCourse';
import VideoPlayer from '../src/screens/Lessons';
import QandA from '../src/screens/QandA';
import Test from '../src/screens/Test';
import Certificate from '../src/screens/Certificate';
import Review from '../src/screens/Rating';
import MyWishlist from '../src/screens/MyWishlist';
import EditProfile from '../src/screens/EditProfile';
import {Message} from '../src/screens/Message';
import {Animated, Image, View} from 'react-native';

import {Text} from 'native-base';
import CustomMenu from './Menu';
import ForgotPassword from '../src/screens/ForgotPassword';
import Signup from '../src/screens/Signup';
import UserCertificates from '../src/screens/UserCertificates';
import UserBookmark from '../src/screens/UserBookmark';
import Bookmark from '../src/screens/Bookmark';
import LeaderBoard from '../src/screens/LeaderBoard';
import Cart from '../src/screens/Cart';
import Invoice from '../src/screens/Invoice';
import {connect} from 'react-redux';
import store from '../src/redux';
import Notifications from '../src/screens/Notifications';
import CallScreen from '../src/screens/CallScreen';
import VideoLoginScreen from '../src/screens/LoginScreen';
import {appColor} from './Style';
const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const StartCourseStack = createStackNavigator();
const AuthStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

const VideoStack = createStackNavigator();

function VideoStackNavigator() {
  return (
    <VideoStack.Navigator>
      <VideoStack.Screen
        name="Login"
        component={VideoLoginScreen}
        options={{headerShown: false}}
      />
      <VideoStack.Screen
        name="Call"
        component={CallScreen}
        options={{headerShown: false}}
      />
    </VideoStack.Navigator>
  );
}

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="slider"
        component={SliderScreen}
        options={({route}) => ({
          headerShown: false,
          params: {route: route},
        })}
      />
      <AuthStack.Screen
        name="login"
        component={LoginScreen}
        options={({route}) => ({
          headerShown: false,
        })}
      />
      <AuthStack.Screen
        name="forgot"
        component={ForgotPassword}
        options={({route}) => ({
          headerShown: true,
          title: '',
        })}
      />
      <AuthStack.Screen
        name="signup"
        component={Signup}
        options={({route}) => ({
          headerShown: false,
          title: '',
        })}
      />
      <AuthStack.Screen
        name="Discover"
        component={MainStackNavigator}
        options={({route}) => ({
          headerShown: false,
        })}
      />
    </AuthStack.Navigator>
  );
}

const MessageHeader = ({route}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View>
        <Image source={require('../src/assets/Oval.png')} />
      </View>
      <View>
        <Text style={{marginLeft: 10}}> {route.params.title} </Text>
        <Text style={{marginLeft: 10, color: '#8F9BB3', fontSize: 12}}>
          Online
        </Text>
      </View>
    </View>
  );
};

function MainStackNavigator() {
  return (
    <HomeStack.Navigator
      initialRouteName="Discover"
      options={{
        transitionSpec: {
          duration: 0,
          timing: Animated.timing,
        },
      }}>
      <HomeStack.Screen
        name="Discover"
        component={tabConnector}
        options={({route}) => ({
          headerShown: false,
          title: '',
          headerRight: () => <Icon name="home" />,
          headerStyle: {
            shadowColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
          },
        })}
      />
      <HomeStack.Screen
        name="Auth"
        component={AuthStackNavigator}
        options={({route}) => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="Detail"
        component={Detail}
        options={({route}) => ({
          title: 'Detail',
          tabBarVisible: false,
        })}
      />
      <HomeStack.Screen
        name="Course"
        component={Course}
        options={({route}) => ({
          title: 'Course',
        })}
      />
      <HomeStack.Screen
        name="StartCourse"
        component={StartCourseStackScreen}
        options={({route}) => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="review"
        component={Review}
        options={({route}) => ({
          tabBarVisible: false,
        })}
      />
      <HomeStack.Screen
        name="editprofile"
        component={EditProfile}
        options={({route}) => ({
          title: 'Edit Profile',
          tabBarVisible: false,
        })}
      />
      <HomeStack.Screen name="Cart" component={Cart} />
      <HomeStack.Screen
        name="jitsi"
        component={CallScreen}
        options={({route}) => ({
          headerShown: false,
        })}
      />
      <HomeStack.Screen
        name="message"
        component={Message}
        options={({route, navigation}) => ({
          headerShown: true,
          title: <MessageHeader route={route} />,
          headerRight: () => (
            <CustomMenu
              //Menu Text
              menutext="Menu"
              //Menu View Style
              menustyle={{
                marginRight: 16,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
              //Menu Text Style
              textStyle={{
                color: 'white',
              }}
              //Click functions for the menu items
              option1Click={() => {
                alert('Option 4');
              }}
              option2Click={() => {}}
              option3Click={() => {}}
              option4Click={() => {
                alert('Option 4');
              }}
            />
          ),
        })}
      />
    </HomeStack.Navigator>
  );
}
const SearchStackScreen = ({navigation}) => (
  <SearchStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <SearchStack.Screen
      name="Search"
      component={Search}
      options={({route}) => ({
        headerTitle: 'Search',
      })}
    />
    {/* <SearchStack.Screen
                                                                      name='Detail'
                                                                      component={Detail}
                                                                      options={({ route }) => ({
                                                                        title: 'Detail'
                                                                      })}
                                                                    /> */}
  </SearchStack.Navigator>
);

const StartCourseStackScreen = ({navigation}) => (
  <StartCourseStack.Navigator
    screenOptions={
      {
        // headerShown: false
      }
    }>
    <StartCourseStack.Screen
      name="StartCourse"
      component={StartCourse}
      options={({route}) => ({
        headerShown: false,
      })}
    />
    <StartCourseStack.Screen
      name="Lesson"
      component={VideoPlayer}
      options={({route}) => ({
        headerShown: false,
      })}
    />
    <StartCourseStack.Screen
      name="qanda"
      component={QandA}
      options={({route}) => ({
        headerTitle: 'Q & A',
      })}
    />
    <StartCourseStack.Screen
      name="test"
      component={Test}
      options={({route}) => ({
        headerShown: false,
      })}
    />
    <StartCourseStack.Screen
      name="certificate"
      component={Certificate}
      options={({route}) => ({
        headerShown: false,
      })}
    />
    {/* <SearchStack.Screen
                                                                      name='Detail'
                                                                      component={Detail}
                                                                      options={({ route }) => ({
                                                                        title: 'Detail'
                                                                      })}
                                                                    /> */}
  </StartCourseStack.Navigator>
);

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={() => ({
          headerShown: false,
        })}
      />
      <ProfileStack.Screen
        name="notification"
        component={Notifications}
        options={() => ({
          headerShown: false,
        })}
      />
      <ProfileStack.Screen
        name="messages"
        component={Messages}
        options={() => ({
          headerShown: false,
        })}
      />
      <ProfileStack.Screen
        name="usercertificates"
        component={UserCertificates}
        options={() => ({
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Certificate',
        })}
      />
      <ProfileStack.Screen
        name="userbookmark"
        component={UserBookmark}
        options={() => ({
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Bookmark',
        })}
      />
      <ProfileStack.Screen
        name="bookmark"
        component={Bookmark}
        options={() => ({
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Bookmark',
        })}
      />
      <ProfileStack.Screen
        name="leaderboard"
        component={LeaderBoard}
        options={() => ({
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Your Stats',
        })}
      />
      <ProfileStack.Screen
        name="invoice"
        component={Invoice}
        options={() => ({
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Your Orders',
        })}
      />
      <ProfileStack.Screen
        name="notifi"
        component={Notification}
        options={() => ({
          headerShown: true,
          headerTitleAlign: 'center',
          title: 'Your Notification',
        })}
      />
      <ProfileStack.Screen
        name="videocall"
        component={CallScreen}
        options={() => ({
          headerShown: false,
          headerTitleAlign: 'center',
          title: 'Your Notification',
        })}
      />
    </ProfileStack.Navigator>
  );
}

function MyTabs({value, read, unread}) {
  return (
    <Tab.Navigator
      animationEnabled={true}
      swipeEnabled={true}
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: appColor,
      }}>
      <Tab.Screen
        name="Home"
        component={Discover}
        options={{
          tabBarLabel: 'Discover',
          headerShown: true,
          tabBarIcon: ({color, size}) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchStackScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Search',
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="MyCourses"
        component={MyCourses}
        options={{
          tabBarLabel: 'MyCourses',
          tabBarIcon: ({color, size}) => (
            <Icon name="play-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="wishlist"
        component={MyWishlist}
        options={{
          tabBarLabel: 'Wishlist',
          tabBarIcon: ({color, size}) => (
            <Icon name="heart-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarBadge: unread !== undefined && unread !== 0 ? unread : null,
          // tabBarBadge: value!==undefined && !read?value.length:0,
          tabBarIcon: ({color, size}) => (
            <Icon name="account-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
const tabConnector = connect((state) => ({
  value: state.notificationItems.notification,
  read: state.notificationItems.read,
  unread: state.notificationItems.unread,
}))(MyTabs);
// export default MainStackNavigator

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: MainStackNavigator,
      Auth: AuthStackNavigator,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
