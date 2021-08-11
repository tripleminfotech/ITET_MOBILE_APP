import PropTypes from 'prop-types';
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
  PermissionsAndroid, Share
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import RNFetchBlob from 'rn-fetch-blob';
// import apiConfig from '../../config/client.js';
// import Lightbox from 'react-native-lightbox';

export default class CustomView extends React.Component {
  state = {
    downloadProgress:''
  }
  checkPermission = async (url) => {
   
    //Function to check the platform
    //If iOS the start downloading
    //If Android then ask for runtime permission

    if (Platform.OS === 'ios') {
      this.downloadImage(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //Once user grant the permission start downloading
          console.log('Storage Permission Granted.');
          this.downloadImage(url);
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
  getExtention = filename => {
    //To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  downloadImage = (url) => {
    //Main function to download the image
    let date = new Date(); //To add the time suffix in filename
    //Image URL which we want to download
    let image_URL =
      'https://raw.githubusercontent.com/AboutReact/sampleresource/master/gift.png';
    //Getting the extention of the file
    let ext = this.getExtention(url);
    ext = '.' + ext[0];
    //Get config and fs from RNFetchBlob
    //config: To pass the downloading related options
    //fs: To get the directory path in which we want our image to download
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.DownloadDir;
    let options = {
      path:
          PictureDir +
          '/file1'+ ext,
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
    RNFetchBlob.fs.exists(options.path)
        .then((exist) => {
          console.log(exist);
          if(exist){
            RNFetchBlob.android.actionViewIntent(options.path,"application/pdf")
          }
          else{
            config(options)
              .fetch('GET', url)
              .progress({ count : 10 },(received,total)=>{
                console.log('progress',received/total);
                this.setState({
                    downloadProgress:(received/total)*100
                })
                console.log(this.state.downloadProgress);
            })
              .then(res => {
                //Showing alert after successful downloading
                RNFetchBlob.android.actionViewIntent(res.path(),"application/pdf")
                console.log('res -> ', JSON.stringify(res));
                alert('file Downloaded Successfully.',res.path());
              });
                  }
                  console.log(`file ${exist ? '' : 'not'} exists`)
                })
                .catch((err) => { console.log(err) });
  };

  renderPdf() {
    return (
      <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
        
          // Linking.openURL(`https://docs.google.com/viewerng/viewer?url=${this.props.currentMessage.pdf}`)
          this.checkPermission(this.props.currentMessage.pdf)
      
      }}>
      <Image
          {...this.props.imageProps}
          style={[styles.image, this.props.imageStyle]}
          source = {{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/150px-PDF_file_icon.svg.png"}}
        //   source={{uri: `${apiConfig.url}/images/messages/${this.props.currentMessage._id}/preview.jpg`}}
        />
      </TouchableOpacity>
    );
  }

  renderHtml() {
    return ( 
      <TouchableOpacity style={[styles.container, this.props.containerStyle]} onPress={() => {
        Actions.chat_html({properties: this.props.currentMessage});
      }}>
      <Image
          {...this.props.imageProps}
          style={[styles.image, this.props.imageStyle]}
          // source={{ uri: this.props.currentMessage.template_image }}
          source = {{uri:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/150px-PDF_file_icon.svg.png"}}
        />
      </TouchableOpacity>
    );
  }

  render() {
    if (this.props.currentMessage.file_type == 'pdf') {
      return this.renderPdf();
    } else if (this.props.currentMessage.template && this.props.currentMessage.template != 'none') {
      return this.renderHtml();
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: 'cover'
  },
  webview: {
    flex: 1,
  },
  imageActive: {
    flex: 1,
    resizeMode: 'contain',
  },
});

CustomView.defaultProps = {
  mapViewStyle: {},
  currentMessage: {
    image: null,
    file_type: null,
    template: null,
    template_html: null,
  },
  containerStyle: {},
  imageStyle: {},
};

CustomView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
};