import { AnyAction, Store } from "redux";

import {PlacesState} from "./redux/reducers/places";

export interface AppStore extends Store {
    places: PlacesState,
}

export interface PayloadAction<T> extends AnyAction {
    type: string;
    payload?: T;
}