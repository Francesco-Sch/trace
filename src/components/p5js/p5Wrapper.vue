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
            startDate: Date,
            endDate:  Date,
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

            // Running Session
            runningSession: {}
        }
    },
    methods: {
    },
    mounted() {
        const p5Sketch = (s) => {
            let blobs = [];

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
                // Blob drawing
                for(let i = 0; i < blobs.length; i++) {
                    blobs[i].display();
                }
            }

            s.displayWeatherData = () => { 
                // Get Start and End Date for request
                // and formats it
                let id = this.$route.params.id;
                this.runningSession = this.$store.getters.runningSession(id);

                this.startDate = moment(this.runningSession.startDate).format('yyyy-MM-DDTHH:mm:ss');
                this.endDate = moment(this.runningSession.endDate).format('yyyy-MM-DDTHH:mm:ss');
                
                let querys = "?locations=" + this.latitude + "," + this.longitude + "&aggregateHours=" + this.aggregateHours + 
                              "&unitGroup=" + this.units + "&shortColumnNames=" + false + "&contentType=" + this.json + 
                              "&startDateTime=" + this.startDate + "&endDateTime=" + this.endDate + "&includeAstronomy=" + this.astronomy;
                
                fetch(this.http + this.url + querys + "&key=" + this.apiKey)
                .then(response => response.json())
                .then(data => this.weather = data)
                .then(() => {
                        s.displayDayOrNight(this.itIsNight);
                        s.weatherColor();
                        s.drawWeatherShape();
                        s.constructBlobs();
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
                if(moment(activityDate).isSameOrBefore(sunsetDate) || moment(activityDate).isSameOrAfter(sunriseDate)) {
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
                let currentWeatherCondition = this.weather.locations['50.773,8.748'].values[0].conditions;
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

            /* ------------- Running-Visualization ----------------- */

            // Blob creation (https://www.youtube.com/watch?v=ZI1dmHv3MeM&t=267s)
            class Blob { 
                constructor(xPoint, yPoint, noiseMax, color) {
                    this.noiseMax = noiseMax;
                    this.x = xPoint;
                    this.y = yPoint;
                    this.radius = 200;
                    this.color = color;
                }
                
                display() {
                    // Config for blobs
                    s.noFill();
                    s.stroke(this.color, 100, 100);
                    s.strokeWeight(2);

                    // Starts drawing the shape
                    s.beginShape();

                    // i increment defines the number of vertices/sphere in the circle
                    for(let i = 0; i < s.TWO_PI; i += 0.05) { 

                        let xOffset = s.map(s.cos(i), -1, 1, 0, this.noiseMax);  
                        let yOffset = s.map(s.sin(i), -1, 1, 0, this.noiseMax);
                        
                        this.radius = s.map(s.noise(xOffset,yOffset), 0, 1, 20, 150);
                        
                        // Polar cartician coordinate (the cos and sin representation of x and y coordinates)
                        let x1 = this.x + this.radius * s.cos(i);
                        let y2 = this.y + this.radius * s.sin(i);

                        s.vertex(x1,y2);
                    }
                    s.endShape(s.CLOSE);
                }

                changeColor() {
                    this.color = s.color(230, 100, 100);
                }

                intersects(other) {
                    let d = s.dist(this.x, this.y, other.x, other.y)
                    if(d < this.radius + other.radius) {
                        return true;
                    } else {
                        return false;
                    }
                }
                
            }

            s.constructBlobs = () => {
                // Add fitness data objects

                let overlapping = false;
                let protection = 0;

                while(blobs.length < 59) {
                //for(let i = 0; i < 8; i++) {
                    let blob = new Blob(s.random(s.displayWidth), s.random(s.displayHeight), s.random(0.1, 0.5), this.temperatureHue);

                    

                    for(let j = 0; j < blobs.length; j++) {
                        var otherBlob = blobs[j];
                        var d = s.dist(blob.x, blob.y, otherBlob.x, otherBlob.y);

                        if(d < blob.radius + otherBlob.radius) {
                            overlapping = true;
                            //break;
                        }
                    }
                    console.log('Hello');

                    if(!overlapping) {
                        blobs.push(blob);
                    }

                    protection++;

                    if(protection > 10000) {
                        break;
                    }
                }
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