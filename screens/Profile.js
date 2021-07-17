import React,{  useState } from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  Alert
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import defaultAvatar from '../Oval.png';
import Api from '../components/Api';
import { cos } from 'react-native-reanimated';
import Axios from 'axios';
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { appColor, appName } from '../components/Style';
import { loaderData, MyLoader, MyLoader1 } from '../components/MyLoaders';
import { FlatList } from 'react-native';

class Profile extends Component{
    state ={
        avatar:defaultAvatar,
        data:{},
        loading:true,
        login:false
    }

    componentWillUnmount(){
        
        this._unsubscribe();
    }
    componentDidMount() {
        const { navigation } = this.props;
        
        this._unsubscribe = navigation.addListener('focus', () => {
            // do something
            this.fetchData();
          });
          this.fetchData();

      }
    async fetchData(){
        const userToken = await AsyncStorage.getItem('userToken');
        if(userToken){
            
            let json = await Api('/userdata','GET')
            this.setState({
                data:json,
                avatar:{uri: `${json.image}?${Date.now()}`},
                loading:false
            });
        }
        else{
            this.setState({
                login:true
            })
        }
    }
     clearAllData = () => {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => {
                this.props.navigation.reset({index:0,routes:[
                    {
                      name: 'Auth'
                    },
                  ],})
            });
    }
     LogoutAlert = () =>
            Alert.alert(
                "Sign out",
            `Sign out from ${appName}?`,
            [
                {
                text: "CANCEL",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
                },
                { text: "SIGN OUT", onPress: () => this.clearAllData()}
            ],
            { cancelable: false }
            );

             selectFile = async () => {
                // Opening Document Picker to select one file
                try {
                  const res = await DocumentPicker.pick({
                    // Provide which type of file you want user to pick
                    type: [DocumentPicker.types.images],
                    // There can me more options as well
                    // DocumentPicker.types.allFiles
                    // DocumentPicker.types.images
                    // DocumentPicker.types.plainText
                    // DocumentPicker.types.audio
                    // DocumentPicker.types.pdf
                  });
                  // Printing the log realted to the file
                  console.log('res : ' + JSON.stringify(res));
                  // Setting the state to show single file attributes
                //   setSingleFile(res);
                this.setState({
                    avatar:{uri: res.uri,cache:'reload'}
                });
               
                } catch (err) {
                //   setSingleFile(null);
                  // Handling any exception (If any)
                  if (DocumentPicker.isCancel(err)) {
                    // If user canceled the document selection
                    alert('Canceled');
                  } else {
                    // For Unknown Error
                    alert('Unknown Error: ' + JSON.stringify(err));
                    throw err;
                  }
                }
              };
     handlePicker = async() => {
      // console.log('edit');
      await ImagePicker.showImagePicker({}, async(response) => {
        // console.log('Response = ', response);
  
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
            this.setState({
                avatar:{uri: response.uri,cache:'reload'}
            })
            console.log("data:image/jpeg;base64,"+response.data)
            let json = await Api('/profile/image/update','POST',{"profile_image": "data:image/jpeg;base64,"+response.data});
            console.log(json);
            Toast.show(json.message, Toast.LONG);
                        }
                    });
    };
    render(){
        return (
            <>
            {this.state.login?
            <View style={{flex:1,justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>
                <Image source={require('../notlogin.png')} style={{width:210,height:170}} />
                <View style={{marginTop:40,marginRight:20,marginLeft:20,flexDirection:"column",alignItems:"center"}}>
                    <Text style={{fontSize:32,textAlign:"center"}}>BUILD YOUR PROFILE</Text>
                    <Text style={{textAlign:"center",fontSize:16,margin:20,lineHeight:30}}>Be one among the {appName} pro learner. Login Now and update your profile.</Text>
                </View>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('login')} style={{paddingLeft:20,paddingRight:20,paddingTop:10,paddingBottom:10,backgroundColor:appColor,borderRadius:11}}>
                    <Text style={{color:"white"}}>Login</Text>
                </TouchableOpacity>
              </View>:
              this.state.loading?
              <View style={{marginTop:10}}>
                <MyLoader1 />
                <FlatList
                data={loaderData}
                keyExtractor = {item => item.toString()}
                renderItem = {({item})=><MyLoader />}
                />
                </View>:
            <ScrollView>
            <View style={{backgroundColor:"white",margin:20,justifyContent:"center",alignItems:"center",padding:20,borderRadius:20}}>
                <TouchableHighlight onPress={()=>this.handlePicker()}>
                    <Image key={Date.now()} source={this.state.avatar} style={{borderRadius:50,height:105,width:105}} />
                </TouchableHighlight>
                    <Text style={{marginTop:10,fontSize:22}}>{this.state.data.first_name} {this.state.data.last_name}</Text>
                    <Text style={{fontSize:15,color:"#8F9BB3"}}>{this.state.data.email}</Text>
                    <Text style={{color: appColor,margin:10}}
                            onPress={() => this.props.navigation.navigate('editprofile')}>
                        Edit Profile
                    </Text>
            </View>
            <View style={{backgroundColor:"white",margin:20,padding:20,borderRadius:20}}>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('notification',{data:this.props.notification})} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="bell-outline" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Notifications</Text>
                    </View>
                    <View style={{
                                height: 30, width: 30, borderRadius: 15, backgroundColor: 'rgba(95,197,123,0.8)', right: 15,  alignItems: 'center', justifyContent: 'center', zIndex: 2000,
                                marginLeft:30
                            }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{this.props.unread}</Text>
                     </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('invoice')} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="history" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Orders</Text>
                    </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('usercertificates')} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="certificate-outline" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Certificate</Text>
                    </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>this.props.navigation.navigate('userbookmark')} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="bookmark-outline" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Bookmarks</Text>
                    </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('messages')} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="message-outline" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Messages</Text>
                    </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity> */}
    
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Cart')} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="cart-outline" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Cart</Text>
                    </View>
                    <View style={{
                                height: 30, width: 30, borderRadius: 15, backgroundColor: 'rgba(95,197,123,0.8)', right: 15,  alignItems: 'center', justifyContent: 'center', zIndex: 2000,
                                marginLeft:50
                            }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{this.props.cartItems.length}</Text>
                     </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity>
                
                {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('leaderboard')} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="chart-bar" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Leaderboard</Text>
                    </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate('jitsi')} style={{flexDirection:"row",justifyContent:"space-between",margin:10}}>
                    <View style={{flexDirection:"row"}}>
                    <Icon name="history" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>Orders</Text>
                    </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity> */}
            </View>
            <View style={{backgroundColor:"white",margin:20,padding:20,borderRadius:20}}>
                <TouchableOpacity onPress={() =>this.LogoutAlert()} style={{flexDirection:"row",justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                    <Icon name="logout" color={appColor} size={30} />
                    <Text style={{marginLeft:20,fontSize:20}}>LogOut</Text>
                </View>
                    <Icon name="chevron-right" color="#18203A" size={30} style={{justifyContent:"flex-end"}} />
                </TouchableOpacity>
            </View>
            </ScrollView>
    }
            </>
        )
    }
    }
    const mapStateToProps = (state) => {
        return {
            cartItems: state.cartItems.product,
            total: state.cartItems.total,
            notification: state.notificationItems.notification,
            unread:state.notificationItems.unread,
        }
    }
export default connect(mapStateToProps, null)(Profile);