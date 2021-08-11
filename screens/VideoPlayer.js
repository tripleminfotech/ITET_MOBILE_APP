import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView, Button, Image, FlatList, TextInput, BackHandler, AsyncStorage
} from 'react-native';
import Video, {
  OnSeekData,
  OnLoadData,
  OnProgressData,
} from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Modal from 'react-native-modal';
import CollapsibleList from "react-native-collapsible-list";
import {FullscreenClose, FullscreenOpen} from '../components/assets/icons';
import PlayerControls from '../components/PlayerControls';
import ProgressBar from '../components/ProgressBar';
import { useFocusEffect } from '@react-navigation/native';
import Api from '../components/Api';
import ytdl from 'react-native-ytdl';
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';
import { CheckBox } from 'native-base';
import url from '../components/Url';
import { SectionList } from 'react-native';
import  Icon  from 'react-native-vector-icons/MaterialCommunityIcons';
import { appColor } from '../components/Style';
import Animated from 'react-native-reanimated';
const { width,height } = Dimensions.get("window");
 function VideoPlayer({navigatio,data,completed,next,rout}) {
  const videoRef = React.createRef();
  const flatListRef = React.createRef();
  
  const [state, setState] = useState({
    active: 0,
    xTabOne: 0,
    xTabTwo: 0,
    translateX: new Animated.Value(0),
    translateXTabOne: new Animated.Value(0),
    translateXTabTwo: new Animated.Value(width),
    translateY: -1000,
    fullscreen: false,
    play: true,
    currentTime: 0,
    duration: 0,
    showControls: false,
  });
  const [isLoading,setLoading] = useState(false)
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoUrl,setVideourl] = useState(data.video_url);
  const [open,setisOpen] = useState(false);
  const [value,setValue] = useState();
  const [bookmark,setBookmark] = useState([]);
  const [minute,setMinute] = useState(0);
  const [lessons,setLessons] = useState([]);
  const [index,setIndex] = useState(0)
  
 const segmentClicked = (index) =>{
    setIndex(index)  
}

const handleSlide = type => {
  let {
      active,
      xTabOne,
      xTabTwo,
      translateX,
      translateXTabOne,
      translateXTabTwo
  } = state;
  Animated.spring(translateX, {
      toValue: type,
      duration: 100,
      useNativeDriver:true
  }).start();
  if (active === 0) {
      Animated.parallel([
          Animated.spring(translateXTabOne, {
              toValue: 0,
              duration: 100,
              useNativeDriver:true
          }).start(),
          Animated.spring(translateXTabTwo, {
              toValue: width,
              duration: 100,
              useNativeDriver:true
          }).start()
      ]);
  } else {
      Animated.parallel([
          Animated.spring(translateXTabOne, {
              toValue: -width,
              duration: 100,
              useNativeDriver:true
          }).start(),
          Animated.spring(translateXTabTwo, {
              toValue: 0,
              duration: 100,
              useNativeDriver:true
          }).start()
      ]);
  }
};


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        
        if (state.fullscreen) {
          Orientation.lockToPortrait()
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
    console.log(rout.params,data.id)
    
    fetchCourse()
    // setVideoLoading(true);
    setLoading(true)
    Orientation.addOrientationListener(handleOrientation);
    // youT();
    if(data.video_type === "YouTube"){
      youT();
      setLoading(false)
    }
    if(data.video_type === "Vimeo"){
      fetchVideo();
      setLoading(false)
    }
    return () => {
      Orientation.removeOrientationListener(handleOrientation);
    };
  }, [data]);

  const fetchCourse = async() =>{
    let json = await Api(`/course/${data.course_id}`,'GET')
    const section = json[0].sections.map(blog => ({
      title: blog.title,
      data: blog.lessons
    }
    ));
    setLessons(section)
    // const idToRemove = data.id;
    // var arr = []
    // const filteredPeople = json[0].sections.filter(
    //   (item) =>{
    //      item.lessons.filter((i)=>{
    //        if(i.id !== idToRemove){
    //          arr.push(i)
    //        }
          
    //       })
       
    //   } 
    //   );
    //   setLessons(arr)
  }
  
  const SectionHead = ({title}) => {
    return  <Text style={{marginLeft:10,marginBottom:10}}>Section {title}</Text>
    }
    const SectionItem = ({item,index}) => {
        return (
            <TouchableOpacity onPress={() => onNextprev(item.id)} style={{padding:8,backgroundColor:item.id === data.id?"#f1f1f1":"white"}}>
            
               
               <View style={{flexDirection:"row",marginTop:10,alignItems:"center"}}>
                <Text style={{marginHorizontal:10}}>{index + 1}</Text>
                <View style={{marginLeft:10}}>
                <Text style={{fontSize:17}}>{item.title}</Text>
                <View style={{flexDirection:"row",marginTop:5}}>
                  {item.is_completed === 1 && 
                <Icon name="check-underline" color="green" size={16} style={{marginHorizontal:5}} />
                  }
                <Text style={{color:"#C5CEE0"}}>{item.duration}</Text>
                </View>
                </View>
               </View>
               
            </TouchableOpacity>
        )
    }

function getVimeoid(url){
  // var url = "http://www.vimeo.com/7058755";
  var ID = '';
  var regExp = /https:\/\/(www\.)?vimeo.com\/(\d+)($|\/)/;
  
  var match = url.match(regExp);
  
  if (match){
    ID = match[2]
  }
  else{
      ID = url
  }
  return ID;
}
const onOpen = () => {
  setisOpen(true)
  setState({...state, play: false, showControls: true})
  setMinute(getMinutesFromSeconds(state.currentTime));
};
const onClose = () => {
  setisOpen(false);
  setState({...state, play: true, showControls: false})
};
function getMinutesFromSeconds(time) {
  const minutes = time >= 60 ? Math.floor(time / 60) : 0;
  const seconds = Math.floor(time - minutes * 60);

  return `${minutes >= 10 ? minutes : '0' + minutes}:${
    seconds >= 10 ? seconds : '0' + seconds
  }`;
}
const renderCollapse = () =>{
  const arr = bookmark.map((item) => (
    <View key={item.id} style={styles.collapsibleItem}>
            <View style={{width:200}}>
            <Text> {item.note} </Text>
            </View>
            <TouchableOpacity onPress={() => (videoRef.current.seek(item.duration),setState({...state,play:true}))}>
              <Text style={{color:"green"}}> {getMinutesFromSeconds(item.duration)} </Text>
            </TouchableOpacity>
          </View>
  ))
  return arr
}
const submitBookmark = async() =>{
  setVideoLoading(true)
  const userId = await AsyncStorage.getItem('UserId');
  await Api(`/bookmark/create/`,"POST",{lessonId: data.id,notes: value,duration:state.currentTime,userId:userId});
  setBookmark([...bookmark,{id: data.id,note: value,duration:state.currentTime}])
  setValue('')
  onClose();
  setVideoLoading(false)
  Toast.show(`Bookmark added successfully..!`, Toast.LONG);
}

const fetchVideo = async() =>{
  const VIMEO_ID = getVimeoid(data.video_url);
  await fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`,{
    headers: {"Referer":url}
})

        // .then(res => res.json(),
        // )
        .then(res =>
          res.json()
        )
        .then(res => setVideourl(res.request.files.hls.cdns[res.request.files.hls.default_cdn].url)
        );
        // .then(res => this.setState({
        //   thumbnailUrl: res.video.thumbs['640'],
        //   videoUrl: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        //   video: res.video,
        // }));
  setBookmark(data.bookmarks.length > 0 ? JSON.parse(data.bookmarks[0].notes) : bookmark);

}

const youT = async() =>{
  const youtubeURL = data.video_url
  const urls = await ytdl(youtubeURL, { quality: 'highestaudio' });
  
  await setVideourl(urls[0].url);
  setBookmark(data.bookmarks.length > 0 ? JSON.parse(data.bookmarks[0].notes) : bookmark);
}

  return (
    <>
    {isLoading?<View><Text>loading</Text></View>:
    <View style={styles.container}>
      
      <TouchableWithoutFeedback onPress={showControls}>
        <View>
          <Video
            ref={videoRef}
            source = {{uri:videoUrl}}
            style={state.fullscreen ? styles.fullscreenVideo : styles.video}
            controls={false}
            resizeMode={'contain'}
            onBuffer={()=>console.log('buffering')}
            onLoad={onLoadEnd}
            onProgress={onProgress}
            onEnd={onEnd}
            paused={!state.play}
            playInBackground={false}
            pictureInPicture={false}
            // poster = "https://baconmockup.com/300/200/"
          />
          {videoLoading && ( // show overlay only when vide is loading
          <View
            style={{
              alignItems: "center",
              backgroundColor: "#000000c4",
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
              <View style={styles.fullscreenButton}>
              <Text style={{fontSize:20,color:"white",marginLeft:5}}>{data.title}</Text>
              <TouchableOpacity
                onPress={handleFullscreen}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                >
                {state.fullscreen ? <FullscreenClose /> : <FullscreenOpen />}
              </TouchableOpacity>
              </View>
              
              <PlayerControls
                onPlay={handlePlayPause}
                onPause={handlePlayPause}
                playing={state.play}
                showPreviousAndNext={true}
                showSkip={true}
                skipBackwards={skipBackward}
                skipForwards={skipForward}
                previousDisabled = {data.previous_lesson !== null ? false : true}
                nextDisabled  = {data.next_lesson !== null ? false : true}
                onNext = {()=>onNextprev(data.next_lesson)}
                onPrevious = {()=>onNextprev(data.previous_lesson)}
              />
              <ProgressBar
                currentTime={state.currentTime}
                duration={state.duration > 0 ? state.duration : 0}
                onSlideStart={handlePlayPause}
                onSlideComplete={handlePlayPause}
                onSlideCapture={onSeek}
              />
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
      {videoLoading ?
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <ActivityIndicator />
          </View>
             :
      <>
        {/* <View style={{marginTop:10,marginLeft:10}}>
          <Text style={{fontSize:20}}>{data.title}</Text>
        </View> */}
        <View style={{flexDirection:"row",justifyContent:"space-between",padding:20}}>
          <TouchableOpacity onPress={()=>onOpen()} style={{padding:9,backgroundColor:"#0095FF"}}>
            <Text style={{color:"white"}}>Bookmark</Text>
          </TouchableOpacity>
          <Modal
              testID={'modal'}
              isVisible={open}
              onSwipeComplete={onClose}
              onBackButtonPress={onClose}
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
                  <TouchableOpacity onPress={submitBookmark} style={{backgroundColor:"#32a852",padding:5,borderRadius:10}}>
                    <Text style={{fontSize:18,color:"white"}}>SAVE</Text>
                  </TouchableOpacity>
                  </View>
                  
                </View>
              </View>
            </Modal>
          {data.is_completed ===1 ? <TouchableOpacity disabled={true} style={{padding:9,backgroundColor:"#32a852"}}>
            <Text style={{color:"white"}}>completed</Text>
          </TouchableOpacity> :
          <TouchableOpacity onPress={()=>completed()}  style={{padding:9,backgroundColor:"#FF0000"}}>
            <Text style={{color:"white"}}>Mark as completed</Text>
          </TouchableOpacity>
        }
          
        </View>
       
        {/* <View style={{margin:10}}>
          <Text style={{color:"#C5CEE0"}}>Previous and Upcoming Lessons</Text>
          
        </View>
        
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={lessons}
            keyExtractor = {item => item.id}
           
            renderItem={({ item,index }) => <SectionItem item={item} index={index}/>}
            />
        </View> */}
        
        {/* qand a view */}
           {/* <View style={{backgroundColor:"#F4F4F4",margin:10,padding:10,flexDirection:"row",justifyContent:'space-between',borderRadius:8}}>
               <Text style={{marginTop:10,marginLeft:5}}>You have any questions?</Text>
               <TouchableOpacity onPress={() => (navigatio.navigate('qanda',{"id":data.course_id}),setState({...state,play:false}))}>
               <Image source={require('../message.png')} style={{width:41,height:41}}/>
               </TouchableOpacity>
           </View> */}
          <View style={{ flexDirection: 'row', borderTopColor: '#eae5e5',margin:10 }}>
          <TouchableOpacity onPress={()=>segmentClicked(0)} style={{borderBottomWidth:index===0?1:0,marginRight:10,borderColor:appColor}}>
            <Text style={{fontSize:16}}>Lessons</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>segmentClicked(1)} style={{borderBottomWidth:index===1?1:0,borderColor:appColor}}>
            <Text style={{fontSize:16}}>Bookmarks</Text>
          </TouchableOpacity>
        </View>
        {/* <ScrollView style={{flexGrow:1}}>
          {renderSection()}
        </ScrollView> */}
     {index===0&&
    //  lessons.map(
    //    (item,index) => (
    //      <View key={index}>
    //        <SectionHead title={item.title} />
    //        {item.data.map((i,index)=>(
    //          <SectionItem item={i} index={index}/>
    //        ))}
    //      </View>
    //    )
    //  )
     <SectionList
     sections={lessons}
     keyExtractor={(item, index) => item + index}
     renderItem={({ item,index }) => <SectionItem item={item} index={index}/>}
     renderSectionHeader={({ section: { title } }) => (
        <SectionHead title={title} />
     )}
     />
     }
     {index===1&&
     <View>
     {renderCollapse()}
     </View>
     }

     </>
    }
    
    </View>
    }
    
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
      ? (Orientation.lockToPortrait(),setState(s => ({...s, fullscreen: false})), StatusBar.setHidden(false))
      : (Orientation.lockToLandscape(),setState(s => ({...s, fullscreen: true})), StatusBar.setHidden(true))
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
    videoRef.current.seek(state.currentTime - 15);
    setState({...state, currentTime: state.currentTime - 15});
  }

  function skipForward() {
    videoRef.current.seek(state.currentTime + 15);
    setState({...state, currentTime: state.currentTime + 15});
  }

  function onSeek(data = OnSeekData) {
    videoRef.current.seek(data.seekTime);
    setState({...state, currentTime: data.seekTime});
  }

  function onLoadEnd(loadData = OnLoadData) {
    console.log(loadData);
    setVideoLoading(false);
    // flatListRef.current.scrollToIndex({index:4})
    if(rout.params.duration !== undefined && rout.params.id === data.id){
      onSeek({seekTime:rout.params.duration})
    }
    setState(s => ({
      ...s,
      duration: loadData.duration,
      currentTime: loadData.currentTime,
    }));
    // onSeek({seekTime:60})
  }

  function onProgress(data = OnProgressData) {
    setState(s => ({
      ...s,
      currentTime: data.currentTime,
    }));
  }

  function onNextprev(lesson){
    Orientation.lockToPortrait()
    setState(s => ({...s, fullscreen: false}))
    StatusBar.setHidden(false)
    next(lesson)
  }

  function onEnd() {
    setState({...state, play: false});
    videoRef.current.seek(0);
    completed();
  }

  function showControls() {
    state.showControls
      ? setState({...state, showControls: false})
      : setState({...state, showControls: true});
  }
};

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
    backgroundColor: 'white',
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
    // alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent:"space-between",
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
    backgroundColor:"#F4F4F4",
    borderColor: "#F4F4F4",
    padding: 10,
    flexDirection:"row",
    justifyContent:"space-between"
  }
});

export default VideoPlayer;