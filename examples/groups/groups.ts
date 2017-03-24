import {Sprite, File, SpritesGroup} from "blip-framework/core";

var file1:File = new File("files/sprites/character-1.png");
var file2:File = new File("files/sprites/character-2.png");
var file3:File = new File("files/sprites/character-3.png");

// Instanciation des sprites
var sprite1:Sprite = new Sprite(file1, 230, 30);
sprite1.displayInDOMElement(document.getElementById("groups-container"));
var sprite2:Sprite = new Sprite(file2, 300, 30);
sprite2.displayInDOMElement(document.getElementById("groups-container"));
var sprite3:Sprite = new Sprite(file3, 370, 30);
sprite3.displayInDOMElement(document.getElementById("groups-container"));

// Création du groupe avec la liste de ses sprites en paramètre
var group:SpritesGroup = new SpritesGroup([sprite1, sprite2, sprite3]);

// Toggle du groupe au clic sur le bouton "Afficher / Masquer"
var toggleButton:HTMLElement = document.getElementById("sprites-toggle");
toggleButton.onclick = () => group.toggle();

// Affichage du groupe au clic sur le bouton "Afficher"
var showButton:HTMLElement = document.getElementById("sprites-show");
showButton.onclick = () => group.show();

// Masquage du groupe au clic sur le bouton "Masquer"
var hideButton:HTMLElement = document.getElementById("sprites-hide");
hideButton.onclick = () => group.hide();