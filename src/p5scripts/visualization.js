export function p5Sketch(sketch) {
    let x = 0;
    let w = 20;
    let h = 20;
    let step = 30;
    let abstand = 10;
    
    sketch.setup = () => {
        let canvas = sketch.createCanvas(2000, 2000);
        canvas.parent('p5canvas');
    }

    sketch.draw = () => {
        sketch.background(200);

        for (var i = 0; i < 10; i++) {
            sketch.rect(x, i * (h + abstand), w, h);
        }

        x = x+step

        if(x >= 2000) {
            x=0;
        }
    }
}