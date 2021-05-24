## Example Weather App

For preview visit: (https://shyclown.github.io/weather/) -> click current location top right or use search field
There is a bit of delay but results will appear in selected section.

### How to set up things locally

App is bootstraped with create-react-app 

Can be started by running 
`npm install` and `npm run start`

You should see app running on localhost:4444 
(used port 4444 for development due to too many requests from 3000 towards free weather API via "Same Origin" bypass)

### How App Works

With app it is possible to search for any place on earth with Google places API,
Searched Location is then converted to coordinates and passed to free weather API,
from where we recover closest available location with weather information. (Not every city / location is covered by weather api)

It is possible to add/remove locations to favorites or see previously found locations

### Limitations of Example: 
Currently Results are cached in local storage due to limitations for free api, 
there is just 50 requests per requesting url per hour.
So in order to see updated weather results next day / week you would need to clear local storage 'This is intentional', and should be sufficient for this example.

## About technical solution
 
Used technologies:
typescript
react & functional components 
redux & thunk - action creators

css inside components / inline styling (due to limited time I deciced to focus on different pars and did just quick styling)

