import axios from "axios";

export const getLocationWeather = (lat: number, long: number) => {
    return axios("https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/search/?lattlong="+lat+","+long+"").then(res =>
        axios("https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/"+ res.data[0].woeid)
    );
}


