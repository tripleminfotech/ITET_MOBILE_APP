import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button, View, Alert, StyleSheet, Dimensions, TouchableOpacity, Text, StatusBar, BackHandler, ScrollView, Image, TextInput, AsyncStorage, TextComponent } from "react-native";
import CollapsibleList from "react-native-collapsible-list";
import { FlatList, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Orientation from "react-native-orientation-locker";
import { ActivityIndicator } from "react-native-paper";
import YoutubePlayer from "react-native-youtube-iframe";
import Modal from 'react-native-modal';
import ytdl from "react-native-ytdl"
import { FullscreenClose, FullscreenOpen } from "../components/assets/icons";
import PlayerControls from "../components/PlayerControls";
import ProgressBar from "../components/ProgressBar";
import YouTubeGetID from "../components/YoutubeId";
import { set } from "react-native-reanimated";
import Api from "../components/Api";


export default function App({navigatio,data,completed,next}) {
  const [videoLoading, setVideoLoading] = useState(true);
  const [elapsed, setElapsed] = useState(0);
  const [total,setTotal] = useState(0);
  const [open,setisOpen] = useState(false);
  const [value,setValue] = useState();
  const [bookmark,setBookmark] = useState([]);
  const [minute,setMinute] = useState(0);
  const [state, setState] = useState({
    fullscreen: false,
    play: true,
    currentTime: 0,
    duration: 0,
    showControls: false,
  });
  const videoId =  YouTubeGetID(data.video_url) 
  const playerRef = useRef();
  function getMinutesFromSeconds(time) {
    const minutes = time >= 60 ? Math.floor(time / 60) : 0;
    const seconds = Math.floor(time - minutes * 60);

    return `${minutes >= 10 ? minutes : '0' + minutes}:${
      seconds >= 10 ? seconds : '0' + seconds
    }`;
  }
  const onOpen = () => {
    setisOpen(true)
    setState({...state, play: false, showControls: true})
    setMinute(getMinutesFromSeconds(elapsed));
  };
  const onClose = () => {
    setisOpen(false);
    setState({...state, play: true, showControls: false})
  };

  const submitBookmark = async() =>{
    const userId = await AsyncStorage.getItem('UserId');
    await Api(`/bookmark/create/`,"POST",{lessonId: data.id,notes: value,duration:elapsed,userId:userId});
    console.log({lessonId: data.id,notes: value,duration:elapsed,userId:userId});
    setBookmark([...bookmark,{id: data.id,note: value,duration:elapsed}])
    onClose();
  }
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        
        if (state.fullscreen) {
          Orientation.unlockAllOrientations()
          setState(s => ({...s, fullscreen: false}))
          StatusBar.setHidden(false)
          return true;
        }
        else{
          return false;
        }
       
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [state.fullscreen])
  );
  useEffect(() => {
    setState({...state, play: false, showControls: true})
    
    setBookmark(data.bookmarks.length > 0 ? JSON.parse(data.bookmarks[0].notes) : bookmark);

    const interval = setInterval(async () => {
      const elapsed_sec = await playerRef.current.getCurrentTime(); // this is a promise. dont forget to await
      const duration = await playerRef.current.getDuration();
      setTotal(duration);
      setElapsed(elapsed_sec)
    }, 1000); // 100 ms refresh. increase it if you don't require millisecond precision
    
    const youT = async() =>{
      const youtubeURL = 'http://www.youtube.com/watch?v=04GiqLjRO3A';
      const urls = await ytdl(youtubeURL, { quality: 'highestvideo' });
      console.log(urls);
    }
    youT();
    Orientation.addOrientationListener(handleOrientation);
    console.log(state.fullscreen);
    return () => {
      Orientation.unlockAllOrientations()
      Orientation.removeOrientationListener(handleOrientation);
      clearInterval(interval);
    };
  }, [data]);
  // const [showControls,setShowcontrols] = useState(true)
  // const [fullscreen,setFullscreen] = useState(false)
  
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const renderCollapse = () =>{
    const arr = bookmark.map((item) => (
      <View key={item.id} style={styles.collapsibleItem}>
              <View style={{width:200}}>
              <Text> {item.note} </Text>
              </View>
              <TouchableOpacity onPress={() => playerRef.current.seekTo(item.duration)}>
                <Text> {getMinutesFromSeconds(item.duration)} </Text>
              </TouchableOpacity>
            </View>
    ))
    return arr
  }
  return (
    <>
    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={showControls}>
       <View style={state.fullscreen ? styles.fullscreenVideo : styles.video}>
        <YoutubePlayer
          ref={playerRef}
          onReady={()=>setState({...state, play: true, showControls: false})}
          height={state.fullscreen ? Dimensions.get('window').width : Dimensions.get('window').width * (9 / 16)}
          // width={width}
          initialPlayerParams={{
            modestbranding: true,
            rel:false,
            controls:false,
          }}
          // webViewProps={{
          //   mediaPlaybackRequiresUserAction: undefined,
          //   userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36"
          // }}

          play={state.play}
          videoId={videoId}
          onChangeState={(state) => {
            switch (state) {
              case "playing":
                // video is done loading
                setVideoLoading(false);
                break;
              case "ended":
                playerRef.current.seekTo(0);
                completed();
                break;
            }
            // playerRef.current.getCurrentTime().then(
            //   currentTime => console.log(currentTime)
            // );
          }}
        />
        {videoLoading && ( // show overlay only when vide is loading
          <View
            style={{
              alignItems: "center",
              backgroundColor: "red",
              justifyContent: "center",
              ...StyleSheet.absoluteFill, // covers the video
            }}
          >
            <ActivityIndicator />
            <Text>loading video</Text>
          </View>
        )}
        {state.showControls && (
            <View style={styles.controlOverlay}>
              <TouchableOpacity
                onPress={handleFullscreen}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                style={styles.fullscreenButton}>
                {state.fullscreen ? <FullscreenClose /> : <FullscreenOpen />}
              </TouchableOpacity>
              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={true}
                previousDisabled = {data.previous_lesson !== null ? false : true}
                nextDisabled  = {data.next_lesson !== null ? false : true}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
                onNext = {()=>next(data.next_lesson)}
                onPrevious = {()=>next(data.previous_lesson)}
              />
              <ProgressBar
                currentTime={elapsed}
                duration={total > 0 ? total : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
      </View>
      </TouchableWithoutFeedback>
      </View>
      <ScrollView>
        <View style={{flexDirection:"row",justifyContent:"space-between",padding:20}}>
          <TouchableOpacity onPress={()=>onOpen()} style={{padding:9,borderRadius:10,backgroundColor:"#0095FF"}}>
            <Text style={{color:"white"}}>Bookmark</Text>
          </TouchableOpacity>
          <Modal
              testID={'modal'}
              isVisible={open}
              onSwipeComplete={onClose}
              swipeDirection={['up', 'left', 'right', 'down']}
              style={styles.view}>
              <View style={styles.content}>
                <View >
                <TextInput
                  onChangeText={text => setValue(text)}
                  value={value}
                  autoFocus={true}
                  onBackButtonPress={onClose}
                  placeholder = "enter your notes"
                  />
                </View>
                <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:10,alignItems:"center"}}>
                  <TouchableOpacity onPress={onClose}>
                  <Text style={{color:"blue",fontSize:18}}>CANCEL</Text>
                  </TouchableOpacity>
                  <View style={{flexDirection:"row",alignItems:"center"}}>
                  <Text style={{fontSize:18,marginRight:2}}>Note at {minute} </Text>
                  <TouchableOpacity onPress={submitBookmark} style={{backgroundColor:"#32a852",padding:2,borderRadius:10}}>
                    <Text style={{fontSize:18,color:"white"}}>SAVE</Text>
                  </TouchableOpacity>
                  </View>
                  
                </View>
              </View>
            </Modal>
          {data.is_completed ===1 ? <TouchableOpacity disabled={true} style={{padding:9,borderRadius:10,backgroundColor:"#32a852"}}>
            <Text style={{color:"white"}}>completed</Text>
          </TouchableOpacity> :
          <TouchableOpacity onPress={()=>completed()}  style={{padding:9,backgroundColor:"#FF0000",borderRadius:10}}>
            <Text style={{color:"white"}}>Mark as completed</Text>
          </TouchableOpacity>
        }
          
        </View>
        
           <View style={{backgroundColor:"#D1D1D1",margin:10,padding:10,flexDirection:"row",justifyContent:'space-between',borderRadius:8}}>
               <Text style={{marginTop:10,marginLeft:5}}>You have any questions?</Text>
               <TouchableOpacity onPress={() => navigatio.navigate('qanda')}>
               <Image source={require('../message.png')} style={{width:41,height:41}}/>
               </TouchableOpacity>
           </View>

      <View style={{padding:10}} >
        <Text>Bookmark Tab</Text>
        <CollapsibleList
          numberOfVisibleItems={1}
          wrapperStyle={styles.wrapperCollapsibleList}
          buttonContent={
            <View style={{marginLeft:10}} >
              <Text style={{color:"red"}}>view all</Text>
            </View>
          }
        >
          
          {renderCollapse()}
          
        </CollapsibleList>
      </View>
      </ScrollView>
      </>
  );
  function handleOrientation(orientation) {
    orientation === 'LANDSCAPE-LEFT' || orientation === 'LANDSCAPE-RIGHT'
      ? (setState(s => ({...s, fullscreen: true})), StatusBar.setHidden(true))
      : (setState(s => ({...s, fullscreen: false})),
        StatusBar.setHidden(false));
  }
  
  function handleFullscreen() {
    state.fullscreen
      ? Orientation.unlockAllOrientations()
      : Orientation.lockToLandscapeLeft();
  }
  
  function handlePlayPause() {
    // If playing, pause and show controls immediately.
    if (state.play) {
      setState({...state, play: false, showControls: true});
      return;
    }
  
    setState({...state, play: true});
    setTimeout(() => setState(s => ({...s, showControls: false})), 2000);
  }
  
  function skipBackward() {
    playerRef.current.seekTo(elapsed - 15);
    setElapsed(elapsed - 15);
    // setState({...state, currentTime: state.currentTime - 15});
  }
  
  function skipForward() {
    playerRef.current.seekTo(elapsed + 15);
    setElapsed(elapsed + 15);
    // setState({...state, currentTime: state.currentTime + 15});
  }
  
  function onSeek(data) {
    playerRef.current.seekTo(data.seekTime);
    // setElapsed(data.seekTime);
    // setState({...state, currentTime: data.seekTime});
  }
  
  function onLoadEnd() {
    setState(s => ({
      ...s,
      duration: playerRef.current.getDuration(),
      // currentTime: data.currentTime,
    }));
  }
  
  function onProgress(data = playerRef) {
    setState(s => ({
      ...s,
      currentTime: data.current.getCurrentTime(),
    }));
  }
  
  function onEnd() {
    setState({...state, play: false});
    videoRef.current.seek(0);
  }
  
  function showControls() {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }
  
}


const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 22,
    // justifyContent: 'center',
    // alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#ebebeb',
  },
  video: {
    height: Dimensions.get('window').width * (9 / 16),
    width: Dimensions.get('window').width,
    backgroundColor: 'black',
  },
  fullscreenVideo: {
    height: Dimensions.get('window').width,
    width: Dimensions.get('window').height,
    backgroundColor: 'black',
  },
  text: {
    marginTop: 30,
    marginHorizontal: 20,
    fontSize: 15,
    textAlign: 'justify',
  },
  fullscreenButton: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-end',
    alignItems: 'center',
    paddingRight: 10,
  },
  controlOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000c4',
    justifyContent: 'space-between',
  },
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "rgba(0, 0, 0, 0.1)"
  // },
  wrapperCollapsibleList: {
    flex: 1,
    marginTop: 20,
    overflow: "hidden",
    backgroundColor: "#FFF",
    borderRadius: 5
  },
  collapsibleItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#CCC",
    padding: 10,
    flexDirection:"row",
    justifyContent:"space-between"
  }
});