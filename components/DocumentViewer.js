import React from 'react';
import {
  View,
  WebView,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
  PermissionsAndroid,
  Text,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import RNFetchBlob from 'rn-fetch-blob';
import * as mime from 'react-native-mime-types';
// import apiConfig from '../../config/client.js';
// import Lightbox from 'react-native-lightbox';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator} from 'react-native-paper';
export default class DocumentView extends React.Component {
  state = {
    downloading: false,
    downloadProgress: 0,
  };
  checkPermission = async () => {
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission

    if (Platform.OS === 'ios') {
      this.downloadImage(this.props.url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          this.downloadImage(this.props.url);
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
    console.log(filename.replace(/^.*[\\\/]/, ''));
    return filename.replace(/^.*[\\\/]/, '');
  };
  downloadImage = (url) => {
    //Main function to download the image
    let date = new Date(); //To add the time suffix in filename

    let ext = this.getExtention(url);
    // ext = '.' + ext[0];
    //Get config and fs from RNFetchBlob
    //config: To pass the downloading related options
    //fs: To get the directory path in which we want our image to download
    const {config, fs} = RNFetchBlob;
    let PictureDir = fs.dirs.DownloadDir;
    let options = {
      path: PictureDir + '/' + ext,
      description: 'PDF',
      fileCache: false,
      // addAndroidDownloads: {
      //   //Related to the Android only
      //   useDownloadManager: true,
      //   notification: true,
      //   path:
      //     PictureDir +
      //     '/image_' + Math.floor(date.getTime() + date.getSeconds() / 2) + ext,
      //   description: 'Image',
      // },
    };
    RNFetchBlob.fs
      .exists(options.path)
      .then((exist) => {
        console.log(exist);
        if (exist) {
          RNFetchBlob.android
            .actionViewIntent(options.path, mime.lookup(options.path))
            .then({})
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.setState({
            downloading: true,
          });
          config(options)
            .fetch('GET', url)
            .progress({count: 1}, (received, total) => {
              console.log('progress', received / total);
              this.setState({
                downloadProgress: (received / total) * 100,
              });
              console.log(this.state.downloadProgress);
            })
            .then((res) => {
              //Showing alert after successful downloading
              RNFetchBlob.android.actionViewIntent(
                res.path(),
                mime.lookup(options.path),
              );
              console.log('res -> ', JSON.stringify(res));
              this.setState({
                downloading: false,
              });
              alert('file Downloaded Successfully.', res.path());
            });
        }
        console.log(`file ${exist ? '' : 'not'} exists`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <>
        {this.state.downloading ? (
          <ActivityIndicator />
        ) : (
          <TouchableOpacity
            onPress={() => this.checkPermission()}
            style={{
              margin: 10,
              padding: 10,
              borderRadius: 15,
              backgroundColor: 'white',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon name="attachment" size={30} />
            <Text style={{marginLeft: 10}}>attachment</Text>
          </TouchableOpacity>
        )}
      </>
    );
  }
}
