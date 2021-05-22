
const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                resolve,
                (error) => {reject("Could not access position."); },
                {
                    timeout: 5000,
                    maximumAge: 0
                });
        } else {
            reject("Geolocation is not supported by this browser.")
        }
    })
}

export default getCurrentLocation;