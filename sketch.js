const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var solo;
var fruta, corda1, corda2, corda3;
var cfc1, cfc2, cfc3;

var b1, b2, b3;
var c1, c2, c3;

var cenarioIMG, frutaIMG, coelhoIMG, coelho;

var piscar, triste, comer;

var botaoVentilador;

function preload() {

    cenarioIMG = loadImage("background.png");
    frutaIMG = loadImage("melon.png");
    coelhoIMG = loadImage("Rabbit-01.png");

    piscar = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
    triste = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
    comer = loadAnimation("eat_0.png", "eat_1.png", "eat_2.png", "eat_3.png", "eat_4.png")
    piscar.playing = true;
    triste.playing = true;
    triste.looping = false;
    comer.playing = true;
    comer.looping = false;

    somCorte = loadSound("rope_cut.mp3");
    somComendo = loadSound("eating_sound.mp3");
    somFundo = loadSound("sound1.mp3");
    somAr = loadSound("Cutting Through Foliage.mp3");

}


function setup() {

    var eCell = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (eCell) {
        canW = displayWidth;
        canH = displayHeight;
        createCanvas(displayWidth, displayHeight);
    } else {
        canW = windowWidth;
        canH = windowHeight;
        createCanvas(windowWidth, windowHeight);
    }
    frameRate(80);
    somFundo.play();
    somFundo.setVolume(0.1);

    b1 = createImg("cut_btn.png");
    b1.position(width / 9, height / 9);
    b1.size(50, 50);
    b1.mouseClicked(soltar1);

    b2 = createImg("cut_btn.png");
    b2.position(width / 1.5, height / 5);
    b2.size(50, 50);
    b2.mouseClicked(soltar2);

    b3 = createImg("cut_btn.png");
    b3.position(width / 3, height / 3);
    b3.size(50, 50);
    b3.mouseClicked(soltar3);

    botaoVolume = createImg("mute.png");
    botaoVolume.position(300, 25);
    botaoVolume.size(50, 50);
    botaoVolume.mouseClicked(pausar);

    botaoVentilador = createImg("blower.png");
    botaoVentilador.position(50, 350);
    botaoVentilador.size(50, 50);
    botaoVentilador.mouseClicked(empurrar);

    engine = Engine.create();
    world = engine.world;
    solo = new Ground(width / 2, height - 20, 600, 20);

    corda1 = new Rope(7, { x: width / 9, y: height / 9 });
    corda2 = new Rope(7, { x: width / 1.5, y: height / 5 });
    corda3 = new Rope(7, { x: width / 3, y: height / 3 });

    f = {
        density: 0.001
    }

    fruta = Bodies.circle(width / 2, height / 2, 20, f);
    Matter.Composite.add(corda1.body, fruta);


    cfc1 = new Link(corda1, fruta);
    cfc2 = new Link(corda2, fruta);
    cfc3 = new Link(corda3, fruta);

    piscar.frameDelay = 20;
    comer.frameDelay = 20;
    triste.frameDelay = 20;


    coelho = createSprite(width / 2, height - 75, 50, 50);
    coelho.addImage(coelhoIMG);
    coelho.addAnimation("chorando", triste);
    coelho.addAnimation("piscando", piscar);
    coelho.addAnimation("comendo", comer);

    coelho.scale = 0.15

    coelho.changeAnimation("piscando");
    rectMode(CENTER);
    ellipseMode(RADIUS);

    textSize(50)


}

function draw() {
    image(cenarioIMG, 0, 0, width, height);

    corda1.show();
    corda2.show();
    corda3.show();

    imageMode(CENTER);
    coelho.x = mouseX;
    Engine.update(engine);
    solo.show();

    if (fruta !== null) {
        image(frutaIMG, fruta.position.x, fruta.position.y, 60, 60);
    }

    if (collide(fruta, coelho) == true) {
        coelho.changeAnimation("comendo");
    }

    if (collide(fruta, solo.body) == true) {
        coelho.changeAnimation("chorando");
        somFundo.stop();
    }

    drawSprites();

}

function soltar1() {
    corda1.break();
    cfc1.detach();
    cfc1 = null;
    somCorte.play();

}

function soltar2() {
    corda2.break();
    cfc2.detach();
    cfc2 = null;
    somCorte.play();

}

function soltar3() {
    corda3.break();
    cfc3.detach();
    cfc3 = null;
    somCorte.play();

}


function collide(body, sprite) {

    if (body != null) {
        var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
        if (d <= 80) {
            World.remove(engine.world, fruta);
            fruta = null;
            return true;
        } else {
            return false;
        }
    }
}


function pausar() {

    if (somFundo.isPlaying()) {
        somFundo.stop();

    } else {
        somFundo.play();
        somFundo.setVolume(0.5);
    }
}

function empurrar() {

    Matter.Body.applyForce(fruta, { x: 0, y: 0 }, { x: 0.01, y: 0 })
    somAr.play();
}