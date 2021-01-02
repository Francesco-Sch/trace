import { weatherApiKey } from './credentials.js'
import moment from 'moment';

// Weather API
const http = "https://";
const url = "history.openweathermap.org/data/2.5/history/city";
const units = "imperial";
let apiKey = weatherApiKey;
let weather = {};

// Position
const latitude = 50.773;
const longitude = 8.748;

// Current time
let currentTime = new Date();

// Day or Night
let itIsNight = true;

// Current degrees & weather color
//let degress = 0;
let minTemperature = 120;
let maxTemperature = 240;
let temperature;
let temperatureHue;

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

        //s.weatherVisualization();
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
                s.weatherColor();
                s.drawWeatherShape();
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
        temperature = weather.main.temp;
        
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

    // Function for drawing sun shape
    s.drawSun = (amount) => {

        // Checks if it is night or day 
        if(itIsNight == true) {
            // Draws gradient from shape for night
            for(let i=amount; i>0; i-=2) {
                let c = s.map(i,amount,0,0,100);
            
                s.fill(temperatureHue, 100, c);
                s.ellipse(s.displayWidth/2, s.displayHeight/2, i, i*1.5);
            }
        } else {
            // Draws gradient from shape for day
            for(let i=amount; i>0; i-=2) {
                let c = s.map(i,amount,0,0,100);
            
                s.fill(temperatureHue, c, 100);
                s.ellipse(s.displayWidth/2, s.displayHeight/2, i, i*1.5);
            }
        }
    }

    // Function for rendering rain shape
    s.drawRainShape = (xPos, yPos, amount) => {
        // Checks if it is night or day 
        if(itIsNight == true) {
            // Draws gradient from shape for night
            for(let i=amount; i>0; i-=2) {
                let c = s.map(i,amount,0,0,100);
                
                s.fill(temperatureHue, 100, c);
                s.ellipse(xPos, yPos, i, i*1.5);
            }
        } else {
            // Draws gradient from shape for day
            for(let i=amount; i>0; i-=2) {
                let c = s.map(i,amount,0,0,100);
                
                s.fill(temperatureHue, c, 100);
                s.ellipse(xPos, yPos, i, i*1.5);
            }
        }
    }

    // Function for drawing multiple rain shapes
    // and distributing them
    s.drawRain = (amount) => {
        let xPos = new Array(amount);
        let yPos = new Array(amount);
        
        for(let i=0; i<amount; i++) {
            xPos[i] = s.random(s.displayWidth);
            yPos[i] = s.random(s.displayHeight);
            
            s.drawRainShape(xPos[i], yPos[i], 125);
        }
    }

    // Function for drawing cloudy shapes
    s.drawCloudShape = (xPos, yPos, amount) => {
        
        // Checks if it is night or day 
        if(itIsNight == true) {
            // Draws gradient from shape for night
            for(let i=amount; i>0; i-=2) {
                let c = s.map(i,amount,0,0,100);
                
                s.fill(temperatureHue, 100, c);
                s.ellipse(xPos, yPos, i*3, i);
            }
        } else {
            // Draws gradient from shape for day
            for(let i=amount; i>0; i-=2) {
                let c = s.map(i,amount,0,0,100);
                
                s.fill(temperatureHue, c, 100);
                s.ellipse(xPos, yPos, i*3, i);
            }
        }
    }

    // Function for drawing two cloud shapes
    s.drawClouds = () => {
        // Position of cloud shapes
        let xPos = [0, s.displayWidth];
        let yPos = [((s.displayHeight/4)), ((s.displayHeight/4)*3)];
        
        for(let i=0; i<2; i++) {
            s.drawCloudShape(xPos[i], yPos[i], 375);
        }
    }

    s.drawWeatherShape = () => {
        let currentWeatherCondition = weather.weather[0].main;
        console.log(currentWeatherCondition);

        // Checks present weather condition
        if(currentWeatherCondition == "Clouds") {
            // Draws gradient shapes for clouds
            s.drawClouds();
        } else if(currentWeatherCondition == "Rain") {
            // Draws gradient shapes for rain
            s.drawRain(5);
        } else {
            // Draws gradient shapes for sun (or other weather conditions)
            s.drawSun(750);
        }
    }

    // Function for drawing weather visualization
    s.weatherVisualization = () => {
        s.retrieveWeatherData();
    }
}