import {Sprite, File} from "blip-framework/core";

var file:File = new File("files/sprites/p4-body.png");
var sprite:Sprite = new Sprite(file, 20, 20);
sprite.displayInDOMElement(document.body);