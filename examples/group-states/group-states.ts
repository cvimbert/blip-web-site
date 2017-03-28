import {Sprite, File, SpritesGroupState, SpritesGroup} from "blip-framework/core";

var file1:File = new File("files/sprites/character-1.png");
var file2:File = new File("files/sprites/character-2.png");
var file3:File = new File("files/sprites/character-3.png");
var file4:File = new File("files/sprites/character-4.png");

var sprite1:Sprite = new Sprite(file1, 258, 40);
sprite1.displayInDOMElement(document.getElementById("group-states-container"));
var sprite2:Sprite = new Sprite(file2, 343, 40);
sprite2.displayInDOMElement(document.getElementById("group-states-container"));
var sprite3:Sprite = new Sprite(file3, 258, 110);
sprite3.displayInDOMElement(document.getElementById("group-states-container"));
var sprite4:Sprite = new Sprite(file4, 343, 110);
sprite4.displayInDOMElement(document.getElementById("group-states-container"));

var group1:SpritesGroup = new SpritesGroup([sprite1, sprite2, sprite3, sprite4]);

var state1:SpritesGroupState = new SpritesGroupState(group1, [sprite1, sprite4]);
var state2:SpritesGroupState = new SpritesGroupState(group1, [sprite3, sprite2]);
var state3:SpritesGroupState = new SpritesGroupState(group1, [sprite1, sprite2, sprite3, sprite4]);
var state4:SpritesGroupState = new SpritesGroupState(group1, []);

var state1Button = document.getElementById("state1-display");
state1Button.onclick = () => state1.display();

var state2Button = document.getElementById("state2-display");
state2Button.onclick = () => state2.display();

var state3Button = document.getElementById("state3-display");
state3Button.onclick = () => state3.display();

var state4Button = document.getElementById("state4-display");
state4Button.onclick = () => state4.display();