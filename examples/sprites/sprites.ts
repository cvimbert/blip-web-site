import {Sprite, File} from "blip-framework/core";

// Instanciation de l'image utilisée pour le sprite
var file:File = new File("files/sprites/p4-body.png");

// Création du sprite, positionné aux coordonnées x: 20 et y:20
var sprite:Sprite = new Sprite(file, 20, 20);

// Ajout du sprite au DOM
sprite.displayInDOMElement(document.getElementById("sprites-container"));

// Toggle du sprite au clic sur le bouton "Afficher / Masquer"
var toggleButton:HTMLElement = document.getElementById("sprites-toggle");
toggleButton.onclick = () => sprite.toggle();

// Affichage du sprite au clic sur le bouton "Afficher"
var showButton:HTMLElement = document.getElementById("sprites-show");
showButton.onclick = () => sprite.display();

// Masquage du sprite au clic sur le bouton "Masquer"
var hideButton:HTMLElement = document.getElementById("sprites-hide");
hideButton.onclick = () => sprite.hide();