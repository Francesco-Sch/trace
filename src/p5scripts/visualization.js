import { weatherApiKey } from './credentials.js'
import moment from 'moment';

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
    
    let http = "https://";
    let url = "api.openweathermap.org/data/2.5/weather";
    let units = "imperial";
    let apiKey = weatherApiKey;
    let weather = {};

    // Position
    let latitude = 50.773;
    let longitude = 8.748;
 
    // Current time
    //let currentTime;
    //let currentHour = s.hour();
   // let currentMinute = s.minute();
    //let currentSecond = s.second();
    let sCurrentHour, sCurrentMinute, sCurrentSecond;

    // Day or Night
    //let itIsNight = false;

    // Current degrees & weather color
    //let degress = 0;
    //let minTemperature = 120;
    //let maxTemperature = 240;
    //let temperature;
    //let temperatureHue; 

    // Load weather graphics
    // PShape sun;
    // PShape rain;
    // PShape cloud;

    s.retrieveWeatherData = () => {  
        let querys = "?lat=" + latitude + "&lon=" + longitude + "&units=" + units;
        
        fetch(http + url + querys + "&appid=" + apiKey)
        .then(response => response.json())
        .then(data => weather = data)
        .then(() => {
                s.displayDayOrNight();
            }
        )
    }

    s.displayDayOrNight = () => {
        console.log(weather);
        // Get unix seconds of sunrise and sunset
        let sunriseUnix = weather.sys.sunrise;
        let sunsetUnix = weather.sys.sunset;

        console.log(sunriseUnix, sunsetUnix);

        // Convert unix seconds to normal hour and minute format
        let sunriseDate = new Date(sunriseUnix*1000);
        let sunsetDate = new Date(sunsetUnix*1000);
        let formattedSunrise = moment(sunriseDate).format('hh:mm:ss a');
        let formattedSunset = moment(sunsetDate).format('hh:mm:ss a');

        console.log("Sunrise: " + formattedSunrise + "; Sunset: " + formattedSunset);
        // Convert strings to let for comparison
        //let formattedSunrise = stringFormattedSunrise.replace(":", "");
        //let formattedSunset = stringFormattedSunset.replace(":", "");
        
        // Check if currentHour, currentMinute or currentSecond misses a leading zero
/*         if(str(currentHour).length() == 1) {
            sCurrentHour = nf(currentHour, 2);
        } else {
            sCurrentHour = str(currentHour);
        }
        if(str(currentMinute).length() == 1) {
            sCurrentMinute = nf(currentMinute, 2);
        } else {
            sCurrentMinute = str(currentMinute);
        }
        if(str(currentSecond).length() == 1) {
            sCurrentSecond = nf(currentSecond, 2);
        } else {
            sCurrentSecond = str(currentSecond);
        } */
        
        // Get current time and convert string to let for comparison
        let stringCurrentTime = sCurrentHour + "" + sCurrentMinute + "" + sCurrentSecond;
        let currentTime = stringCurrentTime;
        
        console.log("CurrentTime: " + currentTime + " ; Sunrise: " + formattedSunrise + " ; Sunset: " + formattedSunset);
        
        // Display if it is day or night
        if(currentTime < formattedSunrise || currentTime > formattedSunset) {
            // Sets background to night
            s.background(0,0,0); // black
            
            // Currently it is night
            //itIsNight = true;
            console.log("It is night");
        } else {
            // Sets background to day
            s.background(0,0,100); // white
            
            // Currently it is day
            //itIsNight = false;
            console.log("It is day");
        }
    }

 /*    s.weatherColor = () => {
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
        
        prletln(temperatureHue);
    }

    // Function for drawing sun shape
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