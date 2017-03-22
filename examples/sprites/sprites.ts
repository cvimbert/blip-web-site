import {Sprite, File} from "blip-framework/core";

var file:File = new File("files/sprites/p4-body.png");

var sprite:Sprite = new Sprite(file, 20, 20);
sprite.displayInDOMElement(document.getElementById("sprites-container"));

var toggleButton:HTMLElement = document.getElementById("sprites-toggle");
toggleButton.onclick = () => sprite.toggle();

var showButton:HTMLElement = document.getElementById("sprites-show");
showButton.onclick = () => sprite.display();

var hideButton:HTMLElement = document.getElementById("sprites-hide");
hideButton.onclick = () => sprite.hide();