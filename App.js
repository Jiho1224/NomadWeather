import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View, StyleSheet, Text, ScrollView, Dimensions
  , ActivityIndicator, Modal, Pressable, Alert
} from 'react-native';
import * as Location from 'expo-location';
import { MaterialCommunityIcons, Entypo, AntDesign } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';


const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
  const [city, setCity] = useState(); //시,특별시, 광역시
  const [country, setCountry] = useState(); //나라
  const [district, setDistrict] = useState("Loading..."); //구
  const [street, setStreet] = useState(); //동
  const [location, setLocation] = useState(); //location 정보
  const [OK, setOK] = useState(true); //위치 허용
  const [days, setDays] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); //날씨 상세정보를 위한 modal
  const [now_moon,setMoonIcon] = useState();
  const API_KEY = "95170051ba82f5306bcacf94821f4ab7";

  const icons = {
    "Clouds": "weather-cloudy",
    "Thunderstorm": "weather-lightning",
    "Drizzle": "weather-rainy",
    "Rain": "weather-pouring",
    "Snow": "weather-snowy-heavy",
    "Mist": "weather-fog",
    "Smoke": "weather-fog",
    "Haze": "weather-hazy",
    "Dust": "weather-fog",
    "Fog": "weather-fog",
    "Sand": "weather-fog",
    "Ash": "weather-fog",
    "Squall": "weather-windy-variant",
    "Tornado": "weather-tornado",
    "Clear": "weather-sunny",

  }


  const ask = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) setOK(false);

    const { coords: { latitude, longitude }, } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false });

    if (location[0].city != null) setCity(location[0].city);
    else setCity(location[0].region);

    setCountry(location[0].country);
    setDistrict(location[0].district);
    setStreet(location[0].street);


    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();

    setDays(json.daily);


  };

  const [detailWeather, setdW] = useState();
  const [minTemp, setmT] = useState();
  const [maxTemp, setmxT] = useState();
  const [avTemp, setavT] = useState();
  const [humidity, setHumidity] = useState();
  const [feelTemp, setfT] = useState();
  const [cloud, setCloud] = useState();
  const [wind, setWind] = useState();
  const [moon, setMoon] = useState();

  useEffect(() => {
    ask();
  }, []);

  let day = new Date();
  let year = day.getFullYear();
  let month = day.getMonth() + 1;
  let date = day.getDate();

  return (
    <View style={style.container}>
      <StatusBar style="inverted"></StatusBar>
      <View style={style.city}>
        <Text style={style.cityName}>{district}</Text>
        <View style={{ flexDirection: "row" }}>
          <Entypo name="location-pin" size={21} color="white" />

          <Text style={style.loc}>{country} {city} {street}</Text>
        </View>

      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        contentContainerStyle={style.weather}>

        {days.length == 0 ?
          (<View style={style.day}>
            <ActivityIndicator color="white" size="large"
              style={{ marginTop: 50, }}></ActivityIndicator>
          </View>)

          : (days.map((day, index) =>
            <View key={index} style={style.day}>
              <View>


                {index == 0 ? (<Text style={style.date}>{year}.{month}.{date}</Text>
                ) :
                  (<Text style={style.date}>{index} day(s) after</Text>)}

                <Pressable
                  onPress={() => {
                    setModalVisible(true);
                    setdW(day.weather[0].description);
                    setmxT(day.temp.max);
                    setmT(day.temp.min);
                    setavT(day.temp.day);
                    setHumidity(day.humidity);
                    setfT(day.feels_like.day);
                    setCloud(day.clouds);
                    setWind(day.wind_speed);
                    setMoon(day.moon_phase);
                  }}>
                  <Text style={style.temp}> {parseFloat(day.temp.day).toFixed(1)}<Text style={{ fontSize: 30 }}>°C</Text></Text>
                </Pressable>

                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons style={style.weatherIcon} name={icons[day.weather[0].main]} size={30} color="white" />
                  <Text style={style.des}>{day.weather[0].main}</Text>
                </View>

                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => setModalVisible(!modalVisible)}>

                  <View key={index} style={style.centeredView}>
                    <View style={style.modalView}>
                      <View style={{ flex: 9 }}>
                        {/* 상세날씨 */}
                        <View style={style.detailWeather}>
                          <Text style={{ paddingLeft: 5, fontSize: 13, fontWeight: "500" }}>Detail</Text>
                          <Text style={{ textAlign: "center", fontSize: 20, paddingBottom: 5, fontWeight: "600" }}>{detailWeather}</Text>
                        </View>

                        {/* 온도 */}
                        <View style={style.detailTemp}>
                          <Text style={{ paddingLeft: 5, paddingTop: 5, fontSize: 13, fontWeight: "500" }}>Temperature</Text>
                          <Text style={{ textAlign: "center", fontSize: 25, fontWeight: "600" }}>{parseFloat(maxTemp).toFixed(1)} / {parseFloat(minTemp).toFixed(1)}°C</Text>
                          <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            <AntDesign name="hearto" size={20} color="red" style={{ marginTop: 4, }} />
                            <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "600" }}>  {feelTemp}°C </Text>
                          </View>

                        </View>
                        {/* 습도 구름 풍속 달 */}
                        <View style={style.set}>
                          {/* 습도 구름 풍속 */}
                          <View>

                            <View style={style.hum}>
                              <Text style={{paddingLeft: 5, paddingTop: 3, paddingBottom:3,fontSize: 13, fontWeight: "500" }}>Humidity</Text>
                              <View style={{ flexDirection: "row",marginLeft:10, width:"100%",}}>
                                <View style={{margin:2,}}>
                                <Progress.Bar
                                  progress={humidity / 100}
                                  width={(SCREEN_WIDTH - 150) / 2}
                                  height={8}>
                                </Progress.Bar>
                                </View>
                                
                                <Text style={{margin: -1, fontWeight:"500",fontSize:12,}}> {humidity}%</Text>
                              </View>


                            </View>

                            <View style={style.hum}>
                              <Text style={{paddingLeft: 5, paddingTop: 3, paddingBottom:3,fontSize: 13, fontWeight: "500" }}>Clouds</Text>
                              <View style={{ flexDirection: "row",marginLeft:10, width:"100%",}}>
                                <View style={{margin:2,}}>
                                <Progress.Bar
                                  progress={cloud / 100}
                                  width={(SCREEN_WIDTH - 150) / 2}
                                  height={8}
                                  color="#0ABAB5">
                                </Progress.Bar>
                                </View>
                                
                                <Text style={{margin: -1, fontWeight:"500",fontSize:12,}}> {cloud}%</Text>
                              </View>

                            </View>
                            <View style={style.hum}>
                              <Text style={{paddingLeft: 5, paddingTop: 1,fontSize: 12, fontWeight: "500" }}>Wind Speed</Text>
                              <Text style={{textAlign:"center", fontWeight:"600",fontSize:17}}>{wind} m/s</Text>
                            </View>
                          </View>
                          {/* 달 */}
                          <View style={style.moon}>
                            <Text style={{paddingLeft: 5, paddingTop: 1,fontSize: 15, fontWeight: "500" }}>Moon</Text>
                            <View style={{justifyContent:"center",textAlign:"center", alignItems:"center"}}>
                            {(moon == 0 || moon == 1)&& <MaterialCommunityIcons name="moon-new" size={100} color="orange"/> }
                            {(moon>0 && moon<=0.125)&&<MaterialCommunityIcons name="moon-waxing-crescent" size={100} color="orange"  />}
                            {(moon>0.125 && moon <= 0.25)&&<MaterialCommunityIcons name="moon-first-quarter" size={100} color="orange"  />}
                            {(moon>0.25 && moon <=0.375)&&<MaterialCommunityIcons name="moon-waxing-gibbous" size={100} color="orange"  />}
                            {(moon > 0.375 && moon <= 0.5) && <MaterialCommunityIcons name="moon-full" size={100} color="orange"  />}
                            {(moon>0.5 && moon<=0.625)&&<MaterialCommunityIcons name="moon-waning-gibbous" size={100} color="orange"  />}
                            {(moon>0.625 && moon <= 0.75)&&<MaterialCommunityIcons name="moon-last-quarter" size={100} color="orange"  />}
                            {(moon>0.75 && moon<1)&&<MaterialCommunityIcons name="moon-waning-crescent" size={100} color="orange"  />}

                            </View>
                            
                            
                          </View>
                        </View>

                      </View>
                      <Pressable
                        style={style.buttonClose}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={{ color: "white", textAlign: "center" }}> CLOSE</Text>
                      </Pressable>
                    </View>
                  </View>

                </Modal>

              </View>
            </View>




          )
          )
        }



      </ScrollView>




    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7D90B6",
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },

  modalView: {
    width: SCREEN_WIDTH - 30,
    flex: 0.5,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
    ,
  },

  city: {
    flex: 1.2,
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  cityName: {
    fontSize: 48,
    color: "white",
    fontWeight: "600",
  },

  loc: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },

  weather: {

  },

  day: {
    width: SCREEN_WIDTH,
    // alignItems:"left",
  },
  date: {
    marginTop: 90,
    marginLeft: 40,
    fontSize: 20,
    color: "white",
    fontWeight: "500",
  },

  temp: {
    marginTop: -20,
    fontSize: 120,

    fontWeight: "400",
    color: "white",
    paddingRight: 30,
  },

  des: {
    marginTop: -30,
    fontSize: 40,
    marginLeft: 10,
    color: "white",
  },

  weatherIcon: {
    marginTop: -15,
    marginLeft: 35,
  },

  buttonClose: {
    padding: 3,
    margin: 5,
    marginBottom: 0,
    elevation: 2,
    borderRadius: 5,
    width: SCREEN_WIDTH - 35,
    backgroundColor: "black",
    // marginBottom: -32,
  },

  detailWeather: {
    width: SCREEN_WIDTH - 40,
    borderRadius: 10,
    padding: 3,
    flex: 1,
    margin: 5,
    backgroundColor: "white",
    elevation: 15,

  },

  detailTemp: {
    flex: 2,
    borderRadius: 10,
    margin: 2.5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "white",
    elevation: 15,
  },
  set: {
    flex: 3,
    margin: 2.5,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    flexDirection: "row",
  },

  hum: {
    flex: 1,
    backgroundColor: "white",
    elevation: 10,
    margin: 1,
    borderRadius: 10,
    width: (SCREEN_WIDTH - 45) / 2,
  },

  moon: {
    width: (SCREEN_WIDTH - 60) / 2,
    backgroundColor: "white",
    elevation: 15,
    marginLeft: 8,
    borderRadius: 10,
    marginTop: 1,
    marginBottom: 1,
  },
});


