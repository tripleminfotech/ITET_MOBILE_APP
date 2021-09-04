import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  SafeAreaView,
  Image,
  Button,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  Share,
} from 'react-native';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import RNFetchBlob from 'rn-fetch-blob';
import Api from '../../components/Api';
import Modal from 'react-native-modal';
import {ProgressBar, Colors} from 'react-native-paper';
import url from '../../components/Url';
import AsyncStorage from '@react-native-community/async-storage';

import {appColor} from '../../components/Style';

export default class Certificate extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: {},
    open: false,
    progress: 0,
  };
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    let userToken = await AsyncStorage.getItem('userToken');
    let json = await Api(`/certificate/${this.props.route.params.id}/f`, 'GET');
    console.log(json, this.props.route.params.id);
    this.setState({data: json});
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message: this.state.data.path,
        dialogTitle: 'React Native Camera Expo Example',
        url: this.state.data.path,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  checkPermission = async (url) => {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission

    if (Platform.OS === 'ios') {
      this.downloadPdf(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          this.downloadPdf(url);
        } else {
          //If permission denied then show alert 'Storage Permission Not Granted'
          alert('Storage Permission Not Granted');
        }
      } catch (err) {
        //To handle permission related issue
        console.warn(err);
      }
    }
  };
  getExtention = (filename) => {
    //To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  downloadPdf = (url) => {
    var filename = url.replace(/^.*[\\\/]/, '');
    console.log(filename);

    //Get config and fs from RNFetchBlob
    //config: To pass the downloading related options
    //fs: To get the directory path in which we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.DownloadDir;
    let options = {
      path: PictureDir + '/' + filename,
      description: 'PDF',

      fileCache: false,
    };
    RNFetchBlob.fs
      .exists(options.path)
      .then((exist) => {
        console.log(exist);
        if (exist) {
          RNFetchBlob.android.actionViewIntent(options.path, 'application/pdf');
        } else {
          config(options)
            .fetch('GET', url)
            .progress({count: 10}, (received, total) => {
              console.log('progress', received / total);
              this.setState({
                open: true,
                progress: received / total,
              });
              console.log('progress', this.state.progress);
            })
            .then((res) => {
              this.setState({
                open: false,
              });
              //Showing alert after successful downloading
              RNFetchBlob.android.actionViewIntent(
                res.path(),
                'application/pdf',
              );
              console.log('res -> ', JSON.stringify(res));
              alert('file Downloaded Successfully.', res.path());
            });
        }
        console.log(`file ${exist ? '' : 'not'} exists`);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //   downloadImage = () => {
  //   //Main function to download the image
  //   let date = new Date(); //To add the time suffix in filename
  //   //Image URL which we want to download
  //   let image_URL =
  //     'https://www.ilminneed.com/uploads/certificates/soundarajdone_advanced-java-an-introduction.pdf';
  //   //Getting the extention of the file
  //   let ext = this.getExtention(image_URL);
  //   ext = '.' + ext[0];
  //   //Get config and fs from RNFetchBlob
  //   //config: To pass the downloading related options
  //   //fs: To get the directory path in which we want our image to download
  //   const { config, fs } = RNFetchBlob;
  //   let PictureDir = fs.dirs.PictureDir;
  //   let options = {
  //     fileCache: true,
  //     addAndroidDownloads: {
  //       //Related to the Android only
  //       useDownloadManager: true,
  //       notification: true,
  //       path:
  //         PictureDir +
  //         '/certificate_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
  //       description: 'Image',
  //     },
  //   };
  //   config(options)
  //     .fetch('GET', image_URL)
  //     .then(res => {
  //       //Showing alert after successful downloading
  //       console.log('res -> ', JSON.stringify(res));
  //       alert('Certificate Downloaded Successfully.');
  //     });
  // };

  render() {
    return (
      <>
        {/* <StatusBar translucent backgroundColor="transparent" /> */}
        <Modal testID={'modal'} isVisible={this.state.open}>
          <View>
            <ProgressBar
              style={{height: 10, borderRadius: 8}}
              progress={this.state.progress}
              color={appColor}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={{color: 'white'}}>Downloading...</Text>
              <Text style={{color: 'white'}}>
                {Math.round(this.state.progress * 100)}%
              </Text>
            </View>
          </View>
        </Modal>
        <ImageBackground
          style={{flex: 1, resizeMode: 'cover'}}
          source={require('../assets/background.png')}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontSize: 22, color: 'white', marginBottom: 10}}>
              Certificate
            </Text>
            <Text style={{fontSize: 25, color: 'white', textAlign: 'center'}}>
              {this.props.route.params.title}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <View style={styles.row_items}>
              <Text style={styles.row_text}>Language</Text>
              <Text style={styles.row_text}>
                {this.props.route.params.language}
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.row_items}>
              <Text style={styles.row_text}>Required Level</Text>
              <Text style={styles.row_text}>
                {this.props.route.params.level}
              </Text>
            </View>
            <View style={styles.line} />
            <View style={styles.row_items}>
              <Text style={styles.row_text}>Course Status</Text>
              <Text style={styles.row_text}>Completed</Text>
            </View>
            <View style={styles.line} />
            <View style={styles.row_items}>
              <Text style={styles.row_text}>Instructor</Text>
              <Text style={styles.row_text}>
                {this.props.route.params.instructor_name}
              </Text>
            </View>
            <View style={styles.line} />
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => this.checkPermission(this.state.data.path)}
              style={styles.SubmitButtonStyle}>
              <Text style={styles.TextStyle}>Download Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onShare}
              style={styles.SubmitButtonStyle}>
              <Text style={styles.TextStyle}>Share Now</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </>
    );
  }
}

const styles = StyleSheet.create({
  row_items: {
    flexDirection: 'row',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  row_text: {
    margin: 10,
    color: 'white',
  },
  line: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  SubmitButtonStyle: {
    marginTop: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginLeft: 30,
    marginRight: 30,
    backgroundColor: appColor,
    borderRadius: 10,
  },

  TextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});
