
const getPlaceDetails = (typeOfSearchedProperty : 'location' | 'placeId', searchedValue : string | {lat: number, lng: number}) => {
    return new Promise((resolve, rejects) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            [typeOfSearchedProperty]: searchedValue
        }, function(results, status) {

            if (status === google.maps.GeocoderStatus.OK) {
                let latitude = results?.[0].geometry.location.lat();
                let longitude = results?.[0].geometry.location.lng();

                console.log(latitude, longitude);
                resolve(results);
            }
            else {
                rejects("Failed to load geometry for location.");
            }
        });
    })
}

// Possibly useful?
export const getPlaceDetailsForLatLng = (latLng: {lat: number, lng: number}) => {
    return getPlaceDetails("location", latLng);
}

export const getPlaceDetailsForPlaceId = (placeId: string) => {
    return getPlaceDetails("placeId", placeId);
}

export default getPlaceDetailsForPlaceId;