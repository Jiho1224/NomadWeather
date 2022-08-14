import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {View, StyleSheet,Text,ScrollView, Dimensions
,ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';


const {width : SCREEN_WIDTH} = Dimensions.get("window");

export default function App() {
  const [city,setCity] = useState(); //시,특별시, 광역시
  const [country,setCountry] = useState(); //나라
  const [district,setDistrict] = useState("Loading..."); //구
  const [street,setStreet] = useState(); //동
  const [location, setLocation] = useState(); //location 정보
  const [OK,setOK] = useState(true); //위치 허용
  const [days,setDays] = useState([]);

  const API_KEY="95170051ba82f5306bcacf94821f4ab7";

  const icons={
    "Clouds": "weather-cloudy",
    "Thunderstorm":"weather-lightning",
    "Drizzle":"weather-rainy",
    "Rain":"weather-pouring",
    "Snow":"weather-snowy-heavy",
    "Mist":"weather-fog",
    "Smoke":"weather-fog",
    "Haze":"weather-hazy",
    "Dust":"weather-fog",
    "Fog":"weather-fog",
    "Sand":"weather-fog",
    "Ash":"weather-fog",
    "Squall":"weather-windy-variant",
    "Tornado":"weather-tornado",
    "Clear":"weather-sunny",

  }
  
  
  
  const ask = async()=>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted) setOK(false);

    const {coords:{latitude,longitude},} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude,longitude},
      {useGoogleMaps:false});
    
    if(location[0].city != null) setCity(location[0].city);
    else setCity(location[0].region);

    setCountry(location[0].country);
    setDistrict(location[0].district);
    setStreet(location[0].street);

    
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    
    setDays(json.daily);
    
    
  };


  useEffect(()=>{
    ask();
  },[]);

  let day = new Date();
  let year = day.getFullYear();
  let month = day.getMonth() + 1;
  let date = day.getDate();

  return (
    <View style={style.container}>
      <StatusBar style="inverted"></StatusBar>
      <View style={style.city}>
        <Text style={style.cityName}>{district}</Text>
        <View style={{flexDirection:"row"}}>
            <Entypo name="location-pin" size={21} color="white" />
            
            <Text style={style.loc}>{country} {city} {street}</Text>
        </View>
        
      </View>
      
      <ScrollView 
        showsHorizontalScrollIndicator = {false}
        pagingEnabled 
        horizontal 
        contentContainerStyle={style.weather}>
          
          {days.length == 0 ? 
             (<View style={style.day}>
                <ActivityIndicator color="white" size="large"
                style={{marginTop:50,}}></ActivityIndicator>
             </View>)
             
             : (days.map((day,index) => 
             <View key={index} style={style.day}>
                {index == 0 ? (<Text style={style.date}>{year}.{month}.{date}</Text>
                  ):
                  (<Text style={style.date}>{index} day(s) after</Text>)}
                <Text style={style.temp}> {parseFloat(day.temp.day).toFixed(1)}<Text style={{fontSize:30}}>°C</Text></Text>
                <View style={{flexDirection:"row"}}>
                  <MaterialCommunityIcons style={style.weatherIcon} name={icons[day.weather[0].main]} size={30} color="white" />
                  <Text style={style.des}>{day.weather[0].main}</Text>
                </View>
                
             </View>)
             )
          }

          {/* Clear Clouds Rain  */}

      </ScrollView>



      
    </View>
  );
}

const style = StyleSheet.create({
  container:{
    flex : 1,
    backgroundColor:"#7D90B6",
  },

  city:{
    flex:1.2,
    marginTop:30,
    justifyContent:"center",
    alignItems:"center",
  },

  cityName:{
    fontSize: 48,
    color: "white",
    fontWeight:"600",
  },

  loc:{
    fontSize: 16,
    color:"white",
    fontWeight:"600",
  },

  weather:{
       
  },

  day:{
    width:SCREEN_WIDTH,
    // alignItems:"left",
  },
  date:{
    marginTop:90,
    marginLeft:40,
    fontSize:20,
    color:"white",
    fontWeight:"500",
  },

  temp:{
    marginTop:-20,
    fontSize: 120,
    
    fontWeight:"400",
    color: "white",
    paddingRight:30,
  },

  des:{
    marginTop:-30,
    fontSize:40,
    marginLeft:10,
    color: "white",
  },

  weatherIcon:{
    marginTop:-15,
    marginLeft:35,
  },

  
});


