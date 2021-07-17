import React, { Component } from 'react';
import { StyleSheet, View, Text, StatusBar, ScrollView, Picker, SafeAreaView, YellowBox, TouchableOpacity, AsyncStorage } from 'react-native';
import { FloatingLabelInput } from 'react-native-floating-label-input';
import { setGlobalStyles } from 'react-native-floating-label-input';
import MultiSelect from 'react-native-multiple-select';
import { ActivityIndicator } from 'react-native-paper';
import Api from '../components/Api';
import { appColor } from '../components/Style';
import Toast from 'react-native-simple-toast';

const items = [
  // name key is must. It is to show the text in front
  {id: '1', name: 'angellist'},
  {id: '2', name: 'codepen'},
  {id: '3', name: 'envelope'},
  {id: '4', name: 'etsy'},
  {id: '5', name: 'facebook'},
  {id: '6', name: 'foursquare'},
  {id: '7', name: 'github-alt'},
  {id: '8', name: 'github'},
  {id: '9', name: 'gitlab'},
  {id: '10', name: 'instagram'},
];
 
setGlobalStyles.containerStyles = {
  backgroundColor: 'white',
  borderColor:"white"
  // any styles you want to generalize to your input container
};
setGlobalStyles.labelStyles = {
  color: '#8F9BB3',
  // any styles you want to generalize to your floating label
};
setGlobalStyles.inputStyles = {
  color: 'black',
  // any styles you want to generalize to your input
};


export default class EditProfile extends Component {
      constructor(props) {
        super(props);
    }
  
    state = {
        loading:true,
        firstname: '',
        lastname:'',
        email:'',
        phone:'',
        bio:'',
        profession:'student',
        fields:{field1:'College Name',field2:'Degree',field3:'Year of passing'},
        field1:'',
        field2:'',
        field3:'',
        facebook:'',
        twitter:'',
        instagram:'',
        skills:'',
        selectedItems:[]
      };
      // componentDidUpdate(){
      //   YellowBox.ignoreWarnings([
      //     'VirtualizedLists should never be nested', // TODO: Remove when fixed
      //   ])
      // }
      onSelectedItemsChange = (selectedItems) => {
        // Set Selected Items
        this.setState({selectedItems:selectedItems});
      };
      handleTextChange = (newText) => this.setState({ value: newText });

      handleProfession = (value) =>{
        const data = {student:{field1:'College Name',field2:'Degree',field3:'Year of passing'},employe:{field1:'Company Name',field2:'Position',field3:'Year of experience'}}
        this.setState({profession:value,fields:data[value]});
        console.log(this.state.fields);
      }
      componentDidMount(){
        this.fetchData();
      }
      _submit = async() =>{
        this.setState({
          loading:true
        })
        let raw = {
          first_name:this.state.firstname,
          last_name:this.state.lastname,
          email:this.state.email,
          phone_no:this.state.phone,
          facebook:this.state.facebook,
          twitter:this.state.twitter,
          linkedin:this.state.instagram,
          skills:this.state.skills.split(','),
          profession:this.state.profession,
          biography:this.state.bio
        }
        // "qualification":"ABC",
        //   "major_in":"Computer Science",
        //   "college_name":"ABC College",
        //   "degree":"ABC",
        //   "year_of_study":"1970",
        //   "work_experience":"100",
        //   "work_designation":"favorite designation",
        if(this.state.profession === 'student'){
          raw['college_name'] = this.state.field1
          raw['degree'] = this.state.field2
          raw['year_of_study'] = this.state.field3 !== null?this.state.field3.toString(): ''
          raw['major_in'] = ''
          raw['work_experience'] = ''
          raw['work_designation'] = ''
          raw['qualification'] = ''
        }
        else{
          raw['college_name'] = this.state.field1
          raw['degree'] = ''
          raw['year_of_study'] = ''
          raw['major_in'] = ''
          raw['work_experience'] = this.state.field3 !== null?this.state.field3.toString(): ''
          raw['work_designation'] = this.state.field2
          raw['qualification'] = ''
        }
        console.log(raw);
        let json = await Api('/profile/update','POST',raw)
        if(!json.error){
          this.setState({
            loading:false
          })
          Toast.show(`profile updated successfully..!`, Toast.LONG);
          this.props.navigation.goBack();
        }
        else{
          console.log(json)
          alert(json.message)
          this.setState({
            loading:false
          })
        }
      }
      fetchData = async() =>{
        let json = await Api('/userdata','GET')
        console.log(json);
        this.setState(
          {
            firstname:json.first_name,
            lastname:json.last_name,
            email:json.email,
            phone:json.phone_no,
            bio:json.biography,
            facebook:json.facebook,
            twitter:json.twitter,
            instagram:json.linkedin,
            loading:false
          })
        const data = {student:{field1:'College Name',field2:'Degree',field3:'Year of passing'},employe:{field1:'Company Name',field2:'Position',field3:'Year of experience'}}
        this.setState({fields:json.profession === 'student'?data['student']:data['employe']});
        if(json.profession === 'student'){
          this.setState({
            profession:json.profession,
            field1:json.college_name,
            field2:json.degree,
            field3:json.year_of_study
          })
        }
        else{
          this.setState({
            profession:'employe',
            field1:json.college_name,
            field2:json.work_designation,
            field3:json.work_experience
          })
        }
        let skills = JSON.parse(json.skills)
        this.setState({skills:skills.toString()})
      }
      render() {
        return (
          <>
         {this.state.loading?<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
    <ActivityIndicator/>
    </View>:
            <ScrollView contentInsetAdjustmentBehavior="automatic">
             
            <Text style={{marginLeft:10,marginTop:10}}>Basic</Text>
            <View style={{borderColor:"white",margin:10,borderRadius:15}}>
                <FloatingLabelInput
                label="First name"
                value={this.state.firstname}
                onChangeText={value => this.setState({firstname:value})}
                />
            </View>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label="Last name"
                value={this.state.lastname}
                onChangeText={value => this.setState({lastname:value})}
                />
            </View>
            {/* <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label="Email"
                value={this.state.email}
                onChangeText={value => this.setState({email:value})}
                />
            </View> */}
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                mask="(99)98765-43210"
                keyboardType="numeric"
                label="Phone Number"
                value={this.state.phone}
                onChangeText={value => this.setState({phone:value})}
                />
            </View>
            <Text style={{margin:10}}>Biography</Text>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label="Hey I'm a software Developer"
                value={this.state.bio}
                multiline={true}
                countdownLabel="chars left"
                maxLength={100}
                showCountdown={true}
                onChangeText={value => this.setState({bio:value})}
                />
            </View>
            <Text style={{margin:10}}>Profession</Text>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15,backgroundColor:"white"}}>
            <Picker
                selectedValue={this.state.profession}
                style={{color:"#8F9BB3"}}
                onValueChange={(itemValue, itemIndex) => this.handleProfession(itemValue)}
              >
                <Picker.Item label="Student" value="student" />
                <Picker.Item label="Employee" value="employe" />
              </Picker>
              </View>
              <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label={this.state.fields.field1}
                value={this.state.field1}
                onChangeText={value => this.setState({field1:value})}
                />
            </View>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label={this.state.fields.field2}
                value={this.state.field2}
                onChangeText={value => this.setState({field2:value})}
                />
            </View>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label={this.state.fields.field3}
                value={this.state.field3}
                keyboardType="numeric"
                onChangeText={value => this.setState({field3:value})}
                />
            </View>
            <Text style={{margin:10}}>social Links</Text>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label="Facebook link"
                value={this.state.facebook}
                onChangeText={value => this.setState({fb:value})}
                />
            </View>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label="Twitter link"
                value={this.state.twitter}
                onChangeText={value => this.setState({twitter:value})}
                />
            </View>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label="linkedin Link"
                value={this.state.instagram}
                onChangeText={value => this.setState({instagram:value})}
                />
            </View>
            <Text style={{margin:10}}>Skills</Text>
            <View style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
                <FloatingLabelInput
                label="your skills"
                value={this.state.skills}
                onChangeText={value => this.setState({skills:value})}
                />
            </View>
          {/* <SafeAreaView style={{borderColor:"white",marginRight:10,marginBottom:10,marginLeft:10,borderRadius:15}}>
            <MultiSelect
          // hideTags
          items={items}
          uniqueKey="id"
          
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          onChangeInput={(text) => console.log(text)}
          tagRemoveIconColor="#2365FF"
          tagBackgroundColor="#2365FF"
          tagBorderColor="#2365FF"
          tagTextColor="black"
          selectedItemTextColor="#2365FF"
          selectedItemIconColor="#2365FF"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{color: '#CCC'}}
          submitButtonColor="#48d22b"
          submitButtonText="Submit"
        />
        
        </SafeAreaView> */}
          </ScrollView>
      }
      {!this.state.loading &&
          <View>
          <TouchableOpacity
              style={{
   
                  marginTop:10,
                  paddingTop:15,
                  paddingBottom:15,
                  marginLeft:30,
                  marginRight:30,
                  backgroundColor:appColor,
                  borderRadius:10,
                  borderWidth: 1,
                  borderColor: '#fff'
                }}
              activeOpacity = { .5 }
              onPress={() => this._submit() }
          >
    
                <Text style={{
                  color:'#fff',
                  textAlign:'center',
              }}> Save </Text>
                
          </TouchableOpacity>
          </View>}
          
          </>
        );
      }
    }