import React, { useState, useCallback, useEffect } from 'react'
import { completeHandlerIOS } from 'react-native-fs';

import { Actions, GiftedChat } from 'react-native-gifted-chat'
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import CustomView from '../components/CustomView';
import defaultAvatar from '../Oval.png';

 
export function Message() {
  const [messages, setMessages] = useState([]);
  const [avatar, setAvatar] = useState(defaultAvatar);
  let [singleFile, setSingleFile] = useState(null);
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello developer',
        file_type:'pdf',
        pdf:"https://www.researchgate.net/profile/Christopher_Roy4/publication/253895824_Practical_Software_Engineering_Strategies_for_Scientific_Computing/links/00b7d52a72930a37e3000000/Practical-Software-Engineering-Strategies-for-Scientific-Computing.pdf",
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])
 
  const onSend = useCallback((messages = []) => {
      console.log(messages)
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])


  function renderActions(props) {
    let selectFile = async () => {
      //Opening Document Picker to select one file
      try {
        const res = await DocumentPicker.pick({
          //Provide which type of file you want user to pick
          type: [DocumentPicker.types.pdf],
          //There can me more options as well
          // DocumentPicker.types.allFiles
          // DocumentPicker.types.images
          // DocumentPicker.types.plainText
          // DocumentPicker.types.audio
          // DocumentPicker.types.pdf
        });
        //Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        props.onSend({pdf:res.uri,file_type:'pdf'});
        //Setting the state to show single file attributes
        setSingleFile(res);
      } catch (err) {
        setSingleFile(null);
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          //If user canceled the document selection
          alert('Canceled from single doc picker');
        } else {
          //For Unknown Error
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    };
    const handlePicker = () => {
      // console.log('edit');
      ImagePicker.showImagePicker({}, (response) => {
        // console.log('Response = ', response);
  
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          setAvatar({uri: response.uri});
          console.log(response.uri);
          props.onSend({image:response.uri});
        //   onSend([{"_id": "f3fda0e8-d860-46ef-ac72-0c02b8ea7ca9", "createdAt": new Date(), "image": response.uri, "user": {"_id": 1}}])
          return response.uri
          // here we can call a API to upload image on server
        }
        return avatar;
      });
    };
    
    return (
      <Actions
        {...props}
        options={{
          ['Send Image']: () => handlePicker(),
          ['Send Files']: () => selectFile(),
        }}
        icon={() => (
          <Icon name='attachment' size={28}  />
        )}
        // onSend={onSend}
      />
    )
  }
  function renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  };
  return (
      <>
      <GiftedChat
      renderActions={renderActions}
      renderCustomView={renderCustomView}
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
    </>
  )
}