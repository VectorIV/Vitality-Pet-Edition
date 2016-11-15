/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ListView,
  Image,
  TextInput,
} from 'react-native';

  import * as firebase from 'firebase';
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDT6_4A73KNDr22Z2XR2aCje-KEnJPM6mw",
    authDomain: "vitality-pet-edition.firebaseapp.com",
    databaseURL: "https://vitality-pet-edition.firebaseio.com",
    storageBucket: "vitality-pet-edition.appspot.com",
    messagingSenderId: "866202889763"
  };
  firebase.initializeApp(config);

  
export default class ListViewScreen extends Component{
    
    // Used for styling the navigator
    static navigatorStyle = {
      navBarButtonColor: '#ffffff',
      navBarTextColor: '#ffffff',
      navBarBackgroundColor: '#ff0000',
      navBarHideOnScroll: true,
    };

    constructor(props) {
        super(props);
        this.database = firebase.database();
        
        const dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
       
        const modifiedDataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (s1, s2) => s1 !== s2});
            
        // References to firebase
        this.petObject = this.database.ref('Pet');
        
        this.state = {
            searchKey: '',
            sort: null,
            dataSource: dataSource.cloneWithRowsAndSections({}),
            modifiedDataSource: modifiedDataSource.cloneWithRowsAndSections({})
        };
        
    }
  
  
    // -------------------------
    // Methods Section
    // -------------------------
    
    // For testing purpose only!
    initialiseDB(){
        this.petObject.set([
        {firstName:'Tom',lastName:'JustTom',petName:'Jerry',petType:'Dog'},{firstName:'Tim',lastName:'Drake',petName:'Boi',petType:'Cat'},
        {firstName:'John',lastName:'Smith',petName:'Meat',petType:'Cat'}
        ]);
    }
    
    // Listening for data change, and return data whenever there is change
    listeningDataSourceDB(){
        this.petObject.on('value', (snapshot) => {
            this.setState({dataSource: this.state.dataSource.cloneWithRowsAndSections(this.convertArraytoMap(snapshot.val() || []))});
        });
    }
    
    
    // Magically convert array into map
    convertArraytoMap(array){
        let map = {};
        array.forEach((item) => {
            let index = item.firstName.charAt(0);
            if (!map[index]){
                map[index] = [];
            }
            map[index].push(item);
        });
        return  map;
    }
    
    // Determine whether the page is empty or not, and display the proper components
    sourceChecker(dataSource) {
        // Display the message below
        if(dataSource.getRowCount()==0){
            return <View style={{height: 50,justifyContent: 'center',alignItems: 'center'}}><Text>Your list is empty right now. Try adding a new pet!</Text></View>
         
        }
        // Display ListView of data
        else {
            return <View><ListView
                    dataSource={dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) =>
                          <TouchableOpacity onPress={()=> this.props.navigator.push({screen: 'main.DetailScreen', title: 'Detail Screen: '+rowData.petName, passProps:{petPointer: rowData.petPointer}})}>
                          <View style={styles.content_item}>
                              {/** Icon column */}
                              <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                                  {this.iconSelector(rowData.petType)}
                              </View>
                              {/** Text column */}
                              <View style={{flex:10, padding: 10}}>
                                <Text>{rowData.firstName} {rowData.lastName}</Text>
                                <Text>      Pet name: {rowData.petName}</Text>
                              </View>
                              {/** Arrow column */}
                              <View style={{flex:1, justifyContent:'center'}}>
                                <Text>></Text>
                              </View>
                          </View>
                        </TouchableOpacity>
                    }
                    renderSectionHeader={(sectionData,firstName) => 
                        <View style={styles.content_tab}>
                        {/** Section name. Divide the rows based on first character of user's name */}
                        <View style={styles.content_tab_button}>
                        <Text style={styles.content_tab_text}> • {firstName.charAt(0)} </Text>
                        {/** <Text style={styles.content_tab_text}> Hide </Text> */}
                        </View>
                        </View>
                    }
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) =>
                      <View key={rowID} style={{height:1, backgroundColor: 'lightgray'}}/>
                    }
                    />
                <View key='end-list' style={{height:1, backgroundColor: 'lightgray'}}/>
                </View>
                
        }
    }
  
    // Determine the pet icon
    iconSelector(type) {
        if (type == 'Dog'){
            return  <Image style={{width:40,height:40}} source={require('./img/dog.png')}/>
        }
        else if (type == 'Cat'){
           return  <Image style={{width:40,height:40}} source={require('./img/cat.png')}/>
        }
        else if (type == 'Rabbit'){
           return  <Image style={{width:40,height:40}} source={require('./img/rabbit.png')}/>
        }
        else if (type == 'Bird'){
           return  <Image style={{width:40,height:40}} source={require('./img/bird.png')}/>
        }
        else if (type == 'Mouse'){
           return  <Image style={{width:40,height:40}} source={require('./img/mouse.png')}/>
        }
        else{
           return  <Image style={{width:40,height:40}} source={require('./img/pet.png')}/>
        }
    }
    // -------------------------
    // End Methods Section
    // -------------------------
    
    
    // -------------------------
    // Component Section
    // -------------------------
    componentDidMount(){
        this.listeningDataSourceDB();
    }

    shouldComponentUpdate(nextProps, nextState){
        if (nextState.dataSource == this.state.dataSource){
            return false;
        }
        return true;
    }
    // -------------------------
    // End Component Section
    // -------------------------
    
    
    // -------------------------
    // Render screen components
    // -------------------------
    render() {
/*     if (this.state.searchKey && this.state.searchKey.length>0){
    } */
    
    return (
        <View style={{marginTop: 5}}>
            {/** Render search bar */}
            <View style={{flexDirection: 'row', alignItems: 'center', height: 40}}>
                <View style={{flex: 12}}>
                    <TextInput style={styles.textInput} onChangeText={(text) => this.setState({searchKey: text})}
                    value={this.state.searchKey} placeholder='Search' underlineColorAndroid='#ff0000'/>{/** Android exclusive */}
                </View>
                <View style={{flex: 1}}>
                    {/** Temporary used for initialising starter data in firebase */}
                    <TouchableOpacity onPress={() => this.initialiseDB()}><Image style={{width:20,height:20}} source={require('./img/search.png')}/></TouchableOpacity>
                </View>
            </View>
            {/** Render item list or empty message */}
            {this.sourceChecker(this.state.dataSource)}
            <View style={{marginTop: 5}}>
                <TouchableOpacity onPress={()=> this.props.navigator.push({screen: 'main.AddScreen', title: 'Add Pet'})}>
                    <View style={styles.content_item_add}>
                        {/** Icon column */}
                        <View style={{flex:3,justifyContent:'center',alignItems:'center'}}>
                            <Image style={{width:40,height:40}} source={require('./img/plus.png')}/>
                        </View>
                        {/** Text column */}
                        <View style={{flex:10, padding: 10, justifyContent:'center'}}>
                          <Text>Add a new pet </Text>
                        </View>
                        {/** Arrow column */}
                        <View style={{flex:1, justifyContent:'center'}}>
                             <Text></Text>
                        </View>
                     </View>
                </TouchableOpacity>
            </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput:{
    marginTop: 1,
    marginBottom: 1,
    fontSize: 12,
  },
  content_tab:{
    backgroundColor: 'lightgray',
    borderWidth: 2,
    borderColor: '#F5FCFF',
    borderRadius: 5,
  },
  content_tab_button:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  content_tab_text:{
    marginTop: 1,
    marginBottom: 3,
    fontSize: 12,
  },
  content_item:{
    flexDirection: 'row',
    height: 50,
  },
  content_item_add:{
    margin: 5,
    flexDirection: 'row',
    height: 50,
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 5,
  }
});
