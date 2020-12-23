import { weatherApiKey } from './credentials.js'
import moment from 'moment';

let http = "https://";
let url = "api.openweathermap.org/data/2.5/weather";
let units = "imperial";
let apiKey = weatherApiKey;
let weather = {};

// Position
let latitude = 50.773;
let longitude = 8.748;

// Current time
let currentTime = new Date();

// Day or Night
let itIsNight;

// Current degrees & weather color
//let degress = 0;
let minTemperature = 120;
let maxTemperature = 240;
let temperature;
let temperatureHue; 

// Load weather graphics
// PShape sun;
// PShape rain;
// PShape cloud;

export function p5Sketch(sketch) {
    let s = sketch;
    
    s.setup = () => {
        // Display config
        let canvas = s.createCanvas(s.displayWidth, s.displayHeight);
        s.frameRate(25);

        // Color config
        s.colorMode(s.HSB, 240, 100, 100, 100);
        s.noStroke();
        s.ellipseMode(s.CENTER);

        // Div to load in the canvas
        canvas.parent('p5canvas');

        s.weatherVisualization();
    }

    s.draw = () => {
    }

    s.retrieveWeatherData = () => {  
        let querys = "?lat=" + latitude + "&lon=" + longitude + "&units=" + units;
        
        fetch(http + url + querys + "&appid=" + apiKey)
        .then(response => response.json())
        .then(data => weather = data)
        .then(() => {
                s.displayDayOrNight(itIsNight);
            }
        )
    }

    s.displayDayOrNight = () => {
        // Get unix seconds of sunrise and sunset
        let sunriseUnix = weather.sys.sunrise;
        let sunsetUnix = weather.sys.sunset;

        // Convert unix seconds to normal format for moment.js
        let sunriseDate = new Date(sunriseUnix*1000);
        let sunsetDate = new Date(sunsetUnix*1000);
        let formattedSunrise = moment(sunriseDate).format();
        let formattedSunset = moment(sunsetDate).format();
        
        console.log("CurrentTime: " + currentTime + " ; Sunrise: " + formattedSunrise + " ; Sunset: " + formattedSunset);
        
        // Display if it is day or night
        if(moment(currentTime).isSameOrBefore(formattedSunset) || moment(currentTime).isSameOrAfter(formattedSunset)) {
            // Sets background to day
            s.background(0,0,100); // white

            // Currently it is day
            itIsNight = false;
            console.log("It is day");
        } else {
            // Sets background to night
            s.background(0,0,0); // black
            
            // Currently it is night
            itIsNight = true;
            console.log("It is night");
        }
    }

    s.weatherColor = () => {
        // Get current temperature
        temperature = weather.getJSONObject("main").getFloat("temp");
        
        // Check if temperature is above maximum temperature
        // Sets hue for shape color
        if((temperature + minTemperature) > maxTemperature) {
            temperatureHue = maxTemperature;
        } else {
            // Sets minimum temperature 
            temperatureHue = temperature + minTemperature;
        }
        
        console.log(temperatureHue);
    }

/*     // Function for drawing sun shape
    s.drawSun = (amount) => {  
        // Load sun shape
        sun = loadShape("sun.svg");
        sun.disableStyle();
        noStroke();
        
        // Checks if it is night or day 
        if(itIsNight == true) {
            // Draws gradient from shape for night
            for(let i=amount; i>0; i-=10) {
            let c = map(i,amount,0,0,100);
            
            fill(temperatureHue, 100, c);
            shape(sun, width/2, height/2, i, i);
            }
        } else {
            // Draws gradient from shape for day
            for(let i=amount; i>0; i-=10) {
            let c = map(i,amount,0,0,100);
            
            fill(temperatureHue, c, 100);
            shape(sun, width/2, height/2, i, i);
            }
        }
    }

    // Function for rendering rain shape
    s.drawRainShape = (xPos, yPos, amount) => {
    // Load rain shape
    rain = loadShape("rain.svg");
    rain.disableStyle();
    noStroke();
    
    // Checks if it is night or day 
    if(itIsNight == true) {
        // Draws gradient from shape for night
        for(let i=amount; i>0; i-=10) {
        let c = map(i,amount,0,0,100);
        
        fill(temperatureHue, 100, c);
        shape(rain, xPos, yPos, i, i);
        }
    } else {
        // Draws gradient from shape for day
        for(let i=amount; i>0; i-=10) {
        let c = map(i,amount,0,0,100);
        
        fill(temperatureHue, c, 100);
        shape(rain, xPos, yPos, i, i);
        }
    }
    }

    // Function for drawing multiple rain shapes
    // and distributing them
    s.drawRain = (amount) => {
    let xPos = new Array(amount);
    let yPos = new Array(amount);
    
    for(let i=0; i<amount; i++) {
        xPos[i] = random(width);
        yPos[i] = random(height);
        
        s.drawRainShape(xPos[i], yPos[i], 750);
    }
    }

    // Function for drawing cloudy shapes
    s.drawCloudShape = (xPos, yPos, amount) => {
        // Load cloud shape
        cloud = loadShape("cloud.svg");
        cloud.disableStyle();
        noStroke();
        
        // Checks if it is night or day 
        if(itIsNight == true) {
            // Draws gradient from shape for night
            for(let i=amount; i>0; i-=10) {
            let c = map(i,amount,0,0,100);
            
            fill(temperatureHue, 100, c);
            shape(cloud, xPos, yPos, i, i);
            }
        } else {
            // Draws gradient from shape for day
            for(let i=amount; i>0; i-=10) {
            let c = map(i,amount,0,0,100);
            
            fill(temperatureHue, c, 100);
            shape(cloud, xPos, yPos, i, i);
            }
        }
    }

    // Function for drawing two cloud shapes
    s.drawClouds = () => {
        // Position of cloud shapes
        let xPos = {0, (width)};
        let yPos = {(displayHeight/5), ((height/5)*4)};
        
        for(let i=0; i<2; i++) {
            s.drawCloudShape(xPos[i], yPos[i], 3800);
        }
    }

    s.drawWeatherShape = () => {
        let currentWeatherCondition = weather.getJSONArray("weather").getJSONObject(0).getlet("main");
        let cloudWeather = "Clouds";
        let rainWeather = "Rain";
        prletln(currentWeatherCondition);

        // Checks present weather condition
        if(currentWeatherCondition.equals(cloudWeather) == true) {
            // Draws gradient shapes for clouds
            s.drawClouds();
        } else if(currentWeatherCondition.equals(rainWeather) == true) {
            // Draws gradient shapes for rain
            s.drawRain(5);
        } else {
            // Draws gradient shapes for sun (or other weather conditions)
            s.drawSun(2000);
        }
    } */

    // Function for drawing weather visualization
    s.weatherVisualization = () => {
        s.retrieveWeatherData();
        //s.displayDayOrNight(); 
        //s.weatherColor();
        //s.drawWeatherShape();
    }
}