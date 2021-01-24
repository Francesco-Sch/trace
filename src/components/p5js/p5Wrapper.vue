<template>
    <div id="p5canvas"></div>
</template>

<script>
import P5 from 'p5';
import moment from 'moment';

import { weatherApiKey } from '../../p5scripts/credentials.js'

export default {
    data() {
        return {
            // Weather API
            http: "https://",
            url: "weather.visualcrossing.com/VisualCrossingWebServices/rest/services/weatherdata/history",
            aggregateHours: '1',
            units: "us",
            json: 'json',
            astronomy: true,
            apiKey: weatherApiKey,
            weather: {},

            // moment().format('yyyy-MM-DDTHH:mm:ss')

            // Position
            latitude: 50.773,
            longitude: 8.748,

            // Day or Night
            itIsNight: true,

            // Current degrees & weather color
            //let degress = 0;
            minTemperature: 120,
            maxTemperature: 240,
            temperature: Number,
            temperatureHue: Number,

            // Current weather condition
            currentWeatherCondition: String,

            // Running Session
            runningSession: {}
        }
    },
    props: {
        startDate: Date,
        endDate: Date
    },
    methods: {
    },
    mounted() {
        const p5Sketch = (s) => {

            s.setup = () => {
                // Display config
                s.createCanvas(s.displayWidth, s.displayHeight);
                s.frameRate(25);

                // Color config
                s.colorMode(s.HSB, 240, 100, 100, 100);
                s.noStroke();
                s.ellipseMode(s.CENTER);

                // Display weather
                s.displayWeatherData();
            }

            s.draw = () => {

               for (var i = 0; i < maxCount; i++) {
                   s.push();
                   s.noFill();
                   s.strokeWeight(2);

                   // Sets stroke color equivalent to day or night
                   if(this.itIsNight == false) {
                        s.stroke(240, 0, 100);
                   } else {
                        s.stroke(240, 100, 0);
                   }

                    s.ellipse(x[i], y[i], r[i] * 2, r[i] * 2);
                    s.pop();
                }
            }

            s.displayWeatherData = () => { 
                // Get Start and End Date for request
                // and formats it
                let id = this.$route.params.id;
                this.runningSession = this.$store.getters.runningSession(id);

                let formattedStartDate = moment(this.startDate).format('yyyy-MM-DDTHH:mm:ss');
                let formattedEndDate = moment(this.endDate).format('yyyy-MM-DDTHH:mm:ss');
                
                let querys = "?locations=" + this.latitude + "," + this.longitude + "&aggregateHours=" + this.aggregateHours + 
                              "&unitGroup=" + this.units + "&shortColumnNames=" + false + "&contentType=" + this.json + 
                              "&startDateTime=" + formattedStartDate + "&endDateTime=" + formattedEndDate + "&includeAstronomy=" + this.astronomy;
                
                fetch(this.http + this.url + querys + "&key=" + this.apiKey)
                .then(response => response.json())
                .then(data => this.weather = data)
                .then(() => {
                        // Execute functions after fetching weather data
                        s.displayDayOrNight(this.itIsNight);
                        s.weatherColor();
                        s.drawWeatherShape();
                        s.constructBlubbles();
                    }
                )
            }

            s.displayDayOrNight = () => {
                // Convert unix seconds to normal format for moment.js
                let sunriseDate = this.weather.locations['50.773,8.748'].values[0].sunrise;
                let sunsetDate = this.weather.locations['50.773,8.748'].values[0].sunset;
                let activityDate = this.weather.locations['50.773,8.748'].values[0].datetimeStr;
                
                console.log("CurrentTime: " + activityDate + " ; Sunrise: " + sunriseDate + " ; Sunset: " + sunsetDate);
                
                // Display if it is day or night
                if(moment(activityDate).isSameOrBefore(sunsetDate) && moment(activityDate).isSameOrAfter(sunriseDate)) {
                    // Sets background to day
                    s.background(0,0,100); // white

                    // Currently it is day
                    this.itIsNight = false;
                    console.log("It is day");
                } else {
                    // Sets background to night
                    s.background(0,0,0); // black
                    
                    // Currently it is night
                    this.itIsNight = true;
                    console.log("It is night");
                }
            }

            s.weatherColor = () => {
                // Get current temperature
                this.temperature = this.weather.locations['50.773,8.748'].values[0].mint;
                
                // Check if temperature is above maximum temperature
                // Sets hue for shape color
                if((this.temperature + this.minTemperature) > this.maxTemperature) {
                    this.temperatureHue = this.maxTemperature;
                } else {
                    // Sets minimum temperature 
                    this.temperatureHue = this.temperature + this.minTemperature;
                }
                
                console.log(this.temperatureHue);
            }

            // Function for drawing sun shape
            s.drawSun = (amount) => {
                // Checks if it is night or day 
                if(this.itIsNight == true) {
                    // Draws gradient from shape for night
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                    
                        s.fill(this.temperatureHue, 100, c);
                        s.ellipse(s.displayWidth/2, s.displayHeight/2, i, i*1.5);
                    }
                } else {
                    // Draws gradient from shape for day
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                    
                        s.fill(this.temperatureHue, c, 100);
                        s.ellipse(s.displayWidth/2, s.displayHeight/2, i, i*1.5);
                    }
                }
            }

            // Function for rendering rain shape
            s.drawRainShape = (xPos, yPos, amount) => {
                // Checks if it is night or day 
                if(this.itIsNight == true) {
                    // Draws gradient from shape for night
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                        
                        s.fill(this.temperatureHue, 100, c);
                        s.ellipse(xPos, yPos, i, i*1.5);
                    }
                } else {
                    // Draws gradient from shape for day
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                        
                        s.fill(this.temperatureHue, c, 100);
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
                if(this.itIsNight == true) {
                    // Draws gradient from shape for night
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                        
                        s.fill(this.temperatureHue, 100, c);
                        s.ellipse(xPos, yPos, i*3, i);
                    }
                } else {
                    // Draws gradient from shape for day
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                        
                        s.fill(this.temperatureHue, c, 100);
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
                this.currentWeatherCondition = this.weather.locations['50.773,8.748'].values[0].conditions;
                console.log(this.currentWeatherCondition);

                // Checks present weather condition
                if(this.currentWeatherCondition == "Clouds") {
                    // Draws gradient shapes for clouds
                    s.drawClouds();
                } else if(this.currentWeatherCondition == "Rain") {
                    // Draws gradient shapes for rain
                    s.drawRain(5);
                } else {
                    // Draws gradient shapes for sun (or other weather conditions)
                    s.drawSun(750);
                }
            }

            /* ------------- Running-Visualization ----------------- */
            let maxCount = 5;

            let x = new Array;
            let y = new Array;
            let r = new Array;

            s.constructBlubbles = () => {
                x[0] = s.displayWidth / 2;
                y[0] = s.displayHeight / 2;
                r[0] = 100;
                let currentCount = 1;

                while(currentCount < maxCount) {
                    // create a random set of parameters
                    var newR = s.random(50, 125);
                    var newX = s.random(newR, s.displayWidth - newR);
                    var newY = s.random(newR, s.displayHeight - newR);

                    var closestDist = Number.MAX_VALUE;
                    var closestIndex = 0;

                    console.log(x.length);
                    console.log(currentCount);

                    // which circle is the closest?
                    for (var i = 0; i < currentCount; i++) {
                        var newDist = s.dist(newX, newY, x[i], y[i]);
                        if (newDist < closestDist) {
                            closestDist = newDist;
                            closestIndex = i;
                        }
                    }

                    // aline it to the closest circle outline
                    var angle = s.atan2(newY - y[closestIndex], newX - x[closestIndex]);

                    x[currentCount] = x[closestIndex] + s.cos(angle) * (r[closestIndex] + newR);
                    y[currentCount] = y[closestIndex] + s.sin(angle) * (r[closestIndex] + newR);
                    r[currentCount] = newR;

                    for(let k = 0; k < currentCount; k++) {
                        let otherX = x[k];
                        let otherY = y[k];
                        let otherR = r[k];

                        let d = s.dist(x[currentCount], y[currentCount], otherX, otherY);

                        if(d < r[currentCount] + otherR) {
                            x = x.filter(item => item !== otherX);
                            y = y.filter(item => item !== otherY);
                            r = r.filter(item => item !== otherR);
                            currentCount = currentCount - 1;
                            console.log("Bubble destroyed")
                        }
                    }

                    currentCount++;
                    console.log("Current count: " + currentCount)
                }

                console.log(this.$store.state.runningSessions)
            }

        }
        // Load sketch into div
        new P5(p5Sketch, 'p5canvas');
    }
}
</script>

<style scoped>
#p5canvas {
    width: 100%;
    height: 100%;
}
#p5canvas .p5Canvas {
    width: 100% !important;
    height: 100% !important;
}
</style>