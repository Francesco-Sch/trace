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

            // Current weather condition
            currentWeatherCondition: String,

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
                    blobs[i].checkColor();
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

            // Blob creation (https://www.youtube.com/watch?v=ZI1dmHv3MeM&t=267s)
            class Blob { 
                constructor(xPoint, yPoint, radius, noiseMax, noiseSeed) {
                    this.x = xPoint;
                    this.y = yPoint;
                    this.radius = radius;
                    this.noiseMax = noiseMax;
                    this.noiseSeed = noiseSeed;
                    this.color;
                }

                checkColor() {
                    if(this.currentWeatherCondition == 'Rain') {
                        this.color = s.color(this.temperatureHue, 100, 100)
                    } else {
                        this.color = s.color(this.temperatureHue, 0, 100)
                    }
                }
                
                display() {
                    // Config for blobs
                    s.noFill();
                    s.stroke(this.color, 0, 100);
                    s.strokeWeight(2);
                    s.noiseSeed(this.noiseSeed)

                    // Starts drawing the shape
                    s.beginShape();

                    // i increment defines the number of vertices/sphere in the circle
                    for(let i = 0; i < s.TWO_PI; i += 0.05) { 
                        let xOffset = s.map(s.cos(i), -1, 1, 0, this.noiseMax);  
                        let yOffset = s.map(s.sin(i), -1, 1, 0, this.noiseMax);
                        
                        let tempRadius = s.map(s.noise(xOffset,yOffset), 0, 1, 20, this.radius);
                        
                        // Polar cartician coordinate (the cos and sin representation of x and y coordinates)
                        let x1 = this.x + tempRadius * s.cos(i);
                        let y2 = this.y + tempRadius * s.sin(i);

                        s.vertex(x1,y2);
                    }
                    s.endShape(s.CLOSE);
                }
            }

            s.constructBlobs = () => {
                // Add fitness data objects
                let overlapping = false;
                let protection = 0;

                while(blobs.length < 8) {
                    let blob = new Blob(
                        s.random(s.displayWidth), 
                        s.random(s.displayHeight), 
                        s.random(30,225), 
                        s.random(0.2,0.6),
                        s.random(0,100));

                    for(let j = 0; j < blobs.length; j++) {
                        var otherBlob = blobs[j];
                        var d = s.dist(blob.x, blob.y, otherBlob.x, otherBlob.y);

                         if(d < blob.radius + otherBlob.radius) {
                             overlapping = true;
                         }
                    }

                    if(!overlapping) {
                        blobs.push(blob);
                    }

                    protection++;

                    if(protection > 20000) {
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