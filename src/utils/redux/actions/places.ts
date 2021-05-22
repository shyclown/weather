
import {Dispatch} from "redux";
import {AppStore} from "../../redux";
import {getLocationWeather} from "../../resources/getCurrentWeather";

export const LOAD_WEATHER = "LOAD_WEATHER";
export const LOAD_WEATHER_ERROR = "LOAD_WEATHER_ERROR";
export const LOAD_WEATHER_SUCCESS = "LOAD_WEATHER_SUCCESS";

export const SET_LOCAL_WEATHER = "SET_LOCAL_WEATHER";
export const SET_FAVORITE_WEATHER = "SET_FAVORITE_WEATHER";

export const UNSET_FAVORITE_WEATHER = "UNSET_FAVORITE_WEATHER";
export const SET_CURRENT_WEATHER = "SET_CURRENT_WEATHER";


export const setCurrentWeather = (id: number) => (
    dispatch : Dispatch
) => {
    dispatch({
        type: SET_CURRENT_WEATHER, payload: {
            id: id,
        }
    });
}

export const setLocalWeather = (id: number) => (
    dispatch : Dispatch
) => {
    dispatch({
        type: SET_LOCAL_WEATHER, payload: {
            id: id,
        }
    });
}

export const setFavoriteWeather = (id: number)  => (
    dispatch : Dispatch
) => {
    dispatch({
        type: SET_FAVORITE_WEATHER, payload: {
            id: id
        }
    });
}

export const unsetFavoriteWeather = (id: number) => (
    dispatch : Dispatch
) => {
    dispatch({
        type: UNSET_FAVORITE_WEATHER, payload: {
            id: id
        }
    });
}


export const loadWeatherAction = (lat: number, lng: number, local: boolean) => (
    dispatch : Dispatch,
    getState : () => AppStore
) => {

        console.log("loadWeatherAction", getState());
        return new Promise((resolve, reject) => {

                dispatch({type: LOAD_WEATHER});

                const cache = localStorage.getItem("weather");
                const parsedCache = cache && JSON.parse(cache);

                if(parsedCache?.[lat+","+lng]) {
                    const weather = parsedCache[lat+","+lng];

                    dispatch({
                        type: LOAD_WEATHER_SUCCESS, payload: {
                            id: weather.woeid as number,
                            current: weather.woeid as number,
                            local: local ? weather.woeid as number : null,
                            weather: weather
                        }
                    });
                    resolve(weather);
                } else {
                    //
                    getLocationWeather(lat, lng).then(
                        (response) => {

                            const weather = response.data;

                            localStorage.setItem("weather", JSON.stringify({
                                ...getState().places.weather,
                                [lat+","+lng]: weather
                            }));

                            dispatch({
                                type: LOAD_WEATHER_SUCCESS, payload: {
                                    id: response.data.woeid as number,
                                    current: weather.woeid as number,
                                    local: local ? weather.woeid as number : null,
                                    weather: response.data
                                }
                            });

                            resolve(response)
                        },
                        (error) => {
                            dispatch({type: LOAD_WEATHER_ERROR});
                            reject(error);
                        }
                    )
                }


            }

        );

}