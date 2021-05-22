import {
    LOAD_WEATHER,
    LOAD_WEATHER_SUCCESS,
    LOAD_WEATHER_ERROR, SET_LOCAL_WEATHER, SET_FAVORITE_WEATHER, UNSET_FAVORITE_WEATHER, SET_CURRENT_WEATHER,
} from "../actions/places";

import {PayloadAction} from "../../redux";
import {loadObject} from "../../resources/localStorage";

export type PlacesState = {
    view: null,
    current: null,
    local: number | null,
    favorite: number[],
    places: [],
    weather: {}
    loadingPlace: boolean,
    errorPlace: boolean,
}

const initialState: PlacesState = {
    view: null,
    current: null,
    local: null,
    favorite: [],
    places: [],
    weather: {},
    loadingPlace: false,
    errorPlace: false,
    ...loadObject("places"),
}

const placesReducer = (
    state = initialState,
    action: Partial<PayloadAction<{
        id: number,
        current: number,
        local: number,
        weather: {[key: string]: any},
    }>>
) => {
    switch (action.type) {

        case SET_CURRENT_WEATHER: return {
            ...state,
            current: action.payload?.id
        };

        case SET_LOCAL_WEATHER: return {
            ...state,
            local: action.payload?.id
        };

        case SET_FAVORITE_WEATHER: return {
            ...state,
            favorite: [...state.favorite, action.payload?.id],
        };

        case UNSET_FAVORITE_WEATHER: return {
            ...state,
            favorite: state.favorite.filter(f => f !== action.payload?.id),
        };

        case LOAD_WEATHER: return {
            ...state,
            loadingPlace: true,
            errorPlace: false,
        };

        case LOAD_WEATHER_SUCCESS: return action.payload ? {
            ...state,
            weather: {
                ...state.weather,
                [action.payload.id]: action.payload.weather
            },
            current: (action.payload.current || state.current),
            local: (action.payload.local || state.local),
            loadingPlace: false,
        } : state;


        case LOAD_WEATHER_ERROR: return {
            ...state,
            loadingPlace: false,
            errorPlace: true,
        };

        default: return state;
    }
}

export default placesReducer;