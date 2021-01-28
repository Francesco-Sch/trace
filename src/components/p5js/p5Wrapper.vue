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
            runningSession: {},
            duration: Number,
            mappedCalories: Number,
            mappedDistance: Number,
            mappedSteps: Number,

        }
    },
    props: {
        startDate: Date,
        endDate: Date,
        calories: Number,
        distance: Number,
        heartrate: Array,
        steps: Array
    },
    methods: {
    },
    mounted() {
        const p5Sketch = (s) => {
            let bgVis;

            let numBubbles = 4;
            let spring = 1;
            let friction = -0.05;
            let bubbles = [];

            let grow = true;

            s.setup = () => {
                // Display config
                s.createCanvas(s.displayWidth, s.displayHeight);
                s.frameRate(30);

                s.colorMode(s.HSB, 240, 100, 100, 100);
                s.noStroke();
                s.ellipseMode(s.CENTER);

                // Background config
                bgVis = s.createGraphics(s.displayWidth, s.displayHeight);

                bgVis.colorMode(s.HSB, 240, 100, 100, 100);
                bgVis.noStroke();
                bgVis.ellipseMode(s.CENTER);

                // Display weather
                s.displayWeatherData();

                // Create bubbles
                for (let i = 0; i < numBubbles; i++) {
                    bubbles[i] = new Bubble(
                    s.random((s.displayWidth / 4), ((s.displayWidth / 4) * 3)),
                    s.random((s.displayHeight / 4), ((s.displayHeight / 4) * 3)),
                    s.random(75, 100),
                    i,
                    bubbles
                    );
                }

                // Set hearRateBubble
                bubbles[0].x = s.displayWidth / 2;
                bubbles[0].y = (s.displayHeight / 2) - 25;
                bubbles[0].diameter = 50;
            }

            s.draw = () => {
                // Maps the data from the fitness api
                // to the frameCount
                s.mapDatatoFrameCount();

                // Redraws background to delete old frame
                s.image(bgVis, 0, 0);

                // PulsatingHeartrateBubble
                if(grow == true) {
                    bubbles[0].diameter += ((1/6) * (this.heartrate/2))

                    if(bubbles[0].diameter >= 350) {
                        grow = false;
                    }
                } else {
                    bubbles[0].diameter -= ((1/6) * (this.heartrate/2))

                    if(bubbles[0].diameter <= 50) {
                        grow = true;
                    }
                }

                // Grow bubbles
                bubbles[1].diameter = s.map(this.mappedCalories, 0, this.duration, 100, 500);
                bubbles[2].diameter = s.map(this.mappedDistance, 0, this.duration, 100, 500);
                bubbles[3].diameter = s.map(this.mappedSteps, 0, this.duration, 100, 500);
                
                // Draws bubbles each representing another data-set
                bubbles.forEach(bubble => {
                    bubble.collide();
                    bubble.move();
                    bubble.display(
                        this.itIsNight, 
                        this.currentWeatherCondition,
                        this.temperatureHue
                        );
                });
            }


            /* ------------- Weather-Visualization ----------------- */
            s.displayWeatherData = () => { 
                // Get Start and End Date for request
                // and formats it
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
                        s.calculateDuration(64);
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
                    
                        bgVis.fill(this.temperatureHue, 100, c);
                        bgVis.ellipse(bgVis.displayWidth/2, bgVis.displayHeight/2, i, i*1.5);
                    }
                } else {
                    // Draws gradient from shape for day
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                    
                        bgVis.fill(this.temperatureHue, c, 100);
                        bgVis.ellipse(bgVis.displayWidth/2, bgVis.displayHeight/2, i, i*1.5);
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
                        
                        bgVis.fill(this.temperatureHue, 100, c);
                        bgVis.ellipse(xPos, yPos, i, i*1.5);
                    }
                } else {
                    // Draws gradient from shape for day
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                        
                        bgVis.fill(this.temperatureHue, c, 100);
                        bgVis.ellipse(xPos, yPos, i, i*1.5);
                    }
                }
            }

            // Function for drawing multiple rain shapes
            // and distributing them
            s.drawRain = (amount) => {
                let xPos = new Array(amount);
                let yPos = new Array(amount);
                
                for(let i=0; i<amount; i++) {
                    xPos[i] = s.random(bgVis.displayWidth);
                    yPos[i] = s.random(bgVis.displayHeight);
                    
                    s.drawRainShape(xPos[i], yPos[i], 125);

                    console.log("Test Rain")
                }
            }

            // Function for drawing cloudy shapes
            s.drawCloudShape = (xPos, yPos, amount) => {
                
                // Checks if it is night or day 
                if(this.itIsNight == true) {
                    // Draws gradient from shape for night
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                        
                        bgVis.fill(this.temperatureHue, 100, c);
                        bgVis.ellipse(xPos, yPos, i*3, i);
                    }
                } else {
                    // Draws gradient from shape for day
                    for(let i=amount; i>0; i-=2) {
                        let c = s.map(i,amount,0,0,100);
                        
                        bgVis.fill(this.temperatureHue, c, 100);
                        bgVis.ellipse(xPos, yPos, i*3, i);
                    }
                }
            }

            // Function for drawing two cloud shapes
            s.drawClouds = () => {
                // Position of cloud shapes
                let xPos = [0, bgVis.displayWidth];
                let yPos = [((bgVis.displayHeight/4)), ((bgVis.displayHeight/4)*3)];
                
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
            s.calculateDuration = (multiplier) => {
                let formattedStartDate = moment(this.startDate);
                let formattedEndDate = moment(this.endDate);

                // Calculates max FrameCount
                let maxFrameCount = (formattedStartDate.diff(formattedEndDate, 'seconds') * -1) * 30

                // Sets duration depending on multipier (how fast the visualization should play)
                this.duration = maxFrameCount / multiplier;
            }

             s.mapDatatoFrameCount = () => {
                // Calories
                this.mappedCalories = s.map(s.frameCount, 0, this.duration, 0, this.calories);

                // Distance
                this.mappedDistance = s.map(s.frameCount, 0, this.duration, 0, this.distance);

                // Steps
                this.mappedSteps = s.map(s.frameCount, 0, this.duration, 0, this.steps);
            }

            // Bubble-Object --- Code from https://p5js.org/examples/motion-bouncy-bubbles.html
            // based on code from Keith Peters
            class Bubble {
                constructor(xin, yin, din, idin, oin) {
                    this.x = xin;
                    this.y = yin;
                    this.vx = 0;
                    this.vy = 0;
                    this.diameter = din;
                    this.id = idin;
                    this.others = oin;
                }

                collide() {
                    for (let i = this.id + 1; i < numBubbles; i++) {
                        let dx = this.others[i].x - this.x;
                        let dy = this.others[i].y - this.y;
                        let distance = s.sqrt(dx * dx + dy * dy);
                        let minDist = this.others[i].diameter / 2 + this.diameter / 2;

                        if (distance < minDist) {
                            let angle = s.atan2(dy, dx);
                            let targetX = this.x + s.cos(angle) * minDist;
                            let targetY = this.y + s.sin(angle) * minDist;
                            let ax = (targetX - this.others[i].x) * spring;
                            let ay = (targetY - this.others[i].y) * spring;
                            this.vx -= ax;
                            this.vy -= ay;
                            this.others[i].vx += ax;
                            this.others[i].vy += ay;
                        }
                    }
                }

                move() {
                    this.x += this.vx;
                    this.y += this.vy;
                    
                    this.vy *= friction;
                    this.vx *= friction;
                }

                display(itIsNight, currentWeatherCondition, temperatureHue) {
                    s.noFill();
                    s.strokeWeight(2);

                    // Sets stroke color equivalent to rain or day or night 
                    if(currentWeatherCondition == "Rain") {
                        s.stroke(temperatureHue, 100, 100);
                    } else if(itIsNight == false) {
                        s.stroke(240, 0, 100);
                    } else {
                        s.stroke(240, 100, 0);
                    }

                    s.ellipse(this.x, this.y, this.diameter, this.diameter);
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