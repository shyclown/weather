import * as React from "react";
import {FunctionComponent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import {AppStore} from "../utils/redux";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import getPlaceDetailsForPlaceId from "../utils/resources/placeDetails";
import getCurrentLocation from "../utils/resources/getCurrentLocation";
import {
    loadWeatherAction,
    setCurrentWeather,
    setFavoriteWeather,
    unsetFavoriteWeather
} from "utils/redux/actions/places";
import {saveObject} from "../utils/resources/localStorage";

type Props = {}

const useStyles = makeStyles({
    page: {
        borderTop: "1px solid #999",
    },


    buttonStyle: {
        border: "none",
        padding: "8px",
        marginLeft: "8px",
        color: "#09F",
        fontWeight: "bold",
        backgroundColor: "rgba(0,0,0,0)",
        transition: "all 500ms",
        "&:hover": {
            backgroundColor: "#EAEAEA",
            cursor: "pointer",
            color: "black",
        }
    }
});


const WeatherForLocation: FunctionComponent<{
    weatherLocation: { [key: string]: any };
    small?: boolean | undefined | null;
    smaller?: boolean | undefined | null;
}> = props => {

    const {weatherLocation, small, smaller} = props;

    const {t} = useTranslation();
    const placesStore = useSelector((state: AppStore) => state.places);

    const favorite = Object.values(placesStore.favorite);
    const classes = useStyles();

    const dispatch = useDispatch();

    const id = weatherLocation.woeid as number;

    return <div key={weatherLocation.woeid} style={
        {
            padding: "8px",
            display: small ? "inline-block" : "block",
            backgroundColor: "white",
            marginTop: "8px",
            marginRight: "8px",
            borderRadius: "8px",
            border: "solid 1px #EAEAEA"
        }
    }>

        <div style={{display: "flex", justifyContent: "space-between", padding: "8px"}}>


            <div style={{display: "flex"}}>
                <h3 style={{padding: "0px", margin: "0px"}} onClick={() => dispatch(setCurrentWeather(id))}>
                    {weatherLocation.title} / {weatherLocation.parent?.title}
                </h3>
                <button className={classes.buttonStyle} onClick={() => dispatch(setCurrentWeather(id))}>
                    Open
                </button>
            </div>

            {favorite.includes(id) ?
                <button className={classes.buttonStyle} onClick={() => dispatch(unsetFavoriteWeather(id))}>
                    {t("Remove from Favorites")}
                </button> :
                <button className={classes.buttonStyle} onClick={() => dispatch(setFavoriteWeather(id))}>
                    {t("Add to favorites")}
                </button>}
        </div>

        <div style={{display: "grid", gridTemplateColumns: "repeat( auto-fill, minmax(250px, 1fr) )", width: "100%"}}>
            {
                !smaller && weatherLocation.consolidated_weather.map((day: { [key: string]: any }, index: number) => {
                    const momentDate = moment(day.applicable_date, "YYYY-MM-DD")
                    const date = momentDate.format("D MMM YYYY");
                    return ((small && index < 3) || !small) ? <div
                        key={index}
                        style={{
                            display: "block",
                            padding: "8px",
                            margin: "8px",
                            borderRadius: "8px",
                            border: "solid 1px #EAEAEA"
                        }}
                    >
                        <div>{date}</div>
                        {
                            !small ? <div>
                                <div style={{display: "flex", justifyContent: "center", padding: "4px"}}>
                                    <img alt={day.weather_state_name}
                                        src={"https://www.metaweather.com/static/img/weather/png/64/" + day.weather_state_abbr + ".png"}/>
                                </div>
                                <div style={{fontSize: "16px"}}>
                                    <strong style={{fontSize: "20px"}}>
                                        <div>{parseInt(day.the_temp)} °C</div>
                                    </strong>
                                    <div style={{fontSize: "12px", backgroundColor: "#EAEAEA", padding: "4px"}}>

                                        <div>Min: {parseInt(day.min_temp)} °C</div>
                                        <div>Max: {parseInt(day.max_temp)} °C</div>
                                    </div>
                                    <div>Weather: {day.weather_state_name}</div>
                                    <div>Wind direction: {day.wind_direction_compass}</div>
                                    <div>Wind speed: {parseInt(day.wind_speed)} m/s</div>
                                    <div>Humidity: {parseInt(day.humidity)} %</div>
                                </div>
                            </div> : <div>
                                <strong style={{fontSize: "20px"}}>
                                    <div>{parseInt(day.the_temp)} °C</div>
                                </strong>
                                <div style={{display: "flex", justifyContent: "center", padding: "4px"}}>
                                    <img width={45} alt={day.weather_state_name}
                                         src={"https://www.metaweather.com/static/img/weather/png/64/" + day.weather_state_abbr + ".png"}/>
                                </div>
                            </div>
                        }
                    </div> : null
                })
            }

        </div>
    </div>
}


export const FirstPage: FunctionComponent<Props> = (
    props
) => {

    const {t} = useTranslation();
    const placesStore = useSelector((state: AppStore) => state.places);
    const weathers: any[] = Object.values(placesStore.weather);

    useEffect(() => {
        saveObject("places", placesStore);
    }, [placesStore])

    const classes = useStyles();
    const dispatch = useDispatch();

    const [value, setValue] = useState<null | { [key: string]: any }>(null);


    return <div className={classes.page}>


        <div style={{
            display: "flex", flexDirection: "row", justifyContent: "space-between",
            backgroundColor: "#4c85cd",
            padding: "8px", color: "white"
        }}>

            <div style={{fontSize: "24px"}}>{t("Weather")}</div>
            <div style={{width: "350px", color: "black"}}>
                <GooglePlacesAutocomplete
                    selectProps={{
                        value,
                        onChange: (place: { [key: string]: any }) => {
                            getPlaceDetailsForPlaceId(place.value.place_id).then((details) => {
                                if (Array.isArray(details)) {
                                    let latitude = details?.[0].geometry.location.lat();
                                    let longitude = details?.[0].geometry.location.lng();
                                    dispatch(loadWeatherAction(latitude, longitude, false));
                                }

                            });
                            setValue(place)
                        },
                    }}
                    onLoadFailed={(error) => (
                        console.error("Could not inject Google script", error)
                    )}
                    autocompletionRequest={{
                        types: ['(cities)'],
                    }}
                />
            </div>

            <button onClick={() => {
                getCurrentLocation().then((position: any) => {
                    dispatch(loadWeatherAction(position.coords.latitude, position.coords.longitude, true));
                });

            }}>Current Location
            </button>
        </div>
        <div style={{backgroundColor: "#ccdbdb"}}>
            <div style={{padding: "16px"}}>

                <h2>Selected</h2>
                {
                    weathers && weathers.filter(w => w.woeid === placesStore.current)?.map?.((weatherLocation: any) =>
                        <WeatherForLocation
                            weatherLocation={weatherLocation}
                            key={weatherLocation.woeid}
                        />)
                }

            </div>
            <div style={{padding: "16px"}}>
                <h2>Favorite</h2>
                {
                    weathers && weathers.filter(w => placesStore.favorite.includes(w.woeid))?.map((weatherLocation: any) =>
                        <WeatherForLocation small
                                            weatherLocation={weatherLocation}
                                            key={weatherLocation.woeid}
                        />)
                }
            </div>
            <div style={{padding: "16px"}}>
                <h2>Recent</h2>
                {
                    weathers && weathers.filter(w => !placesStore.favorite.includes(w.woeid) && (w.woeid !== placesStore.current))?.map((weatherLocation: any) =>
                        <WeatherForLocation smaller
                                            weatherLocation={weatherLocation}
                                            key={weatherLocation.woeid}
                        />)
                }
            </div>
        </div>
    </div>;
}

export default FirstPage;