import * as React from "react";
import {FunctionComponent, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {AppStore} from "../utils/redux";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import getPlaceDetailsForPlaceId from "../utils/resources/placeDetails";
import getCurrentLocation from "../utils/resources/getCurrentLocation";
import {
    loadWeatherAction,
} from "utils/redux/actions/places";
import {saveObject} from "../utils/resources/localStorage";
import WeatherForLocation from "./WeatherForLocation";

type Props = {}

const useStyles = makeStyles({
    page: {
        borderTop: "1px solid #999",
    },
    wrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#4c85cd",
        padding: "8px",
        color: "white"
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
        <div  className={classes.wrapper}>

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
                    dispatch(loadWeatherAction(
                        position.coords.latitude,
                        position.coords.longitude,
                        true
                    ));
                });

            }}> {t("Current Location")}
            </button>
        </div>
        <div style={{backgroundColor: "#ccdbdb"}}>
            <div style={{padding: "16px"}}>

                <h2>{t("Selected")}</h2>
                {
                    weathers && weathers.filter(
                        w => w.woeid === placesStore.current
                    )?.map?.((weatherLocation: any) =>
                        <WeatherForLocation
                            weatherLocation={weatherLocation}
                            key={weatherLocation.woeid}
                        />
                    )
                }

            </div>
            <div style={{padding: "16px"}}>
                <h2>{t("Favorite")}</h2>
                {
                    weathers && weathers.filter(
                        w => placesStore.favorite.includes(w.woeid)
                    )?.map((weatherLocation: any) =>
                        <WeatherForLocation
                            small
                            weatherLocation={weatherLocation}
                            key={weatherLocation.woeid}
                        />
                    )
                }
            </div>
            <div style={{padding: "16px"}}>
                <h2>{t("Recent")}</h2>
                {
                    weathers && weathers.filter(
                        w => !placesStore.favorite.includes(w.woeid) && (w.woeid !== placesStore.current)
                    )?.map((weatherLocation: any) =>
                        <WeatherForLocation
                            smaller
                            weatherLocation={weatherLocation}
                            key={weatherLocation.woeid}
                        />
                    )
                }
            </div>
        </div>
    </div>;
}

export default FirstPage;