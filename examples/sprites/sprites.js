"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("blip-framework/core");
// Instanciation de l'image utilisée pour le sprite
var file = new core_1.File("files/sprites/character-1.png");
// Création du sprite, positionné aux coordonnées x: 300 et y: 30
var sprite = new core_1.Sprite(file, 300, 30);
// Ajout du sprite au DOM
sprite.displayInDOMElement(document.getElementById("sprites-container"));
// Toggle du sprite au clic sur le bouton "Afficher / Masquer"
var toggleButton = document.getElementById("sprites-toggle");
toggleButton.onclick = function () { return sprite.toggle(); };
// Affichage du sprite au clic sur le bouton "Afficher"
var showButton = document.getElementById("sprites-show");
showButton.onclick = function () { return sprite.display(); };
// Masquage du sprite au clic sur le bouton "Masquer"
var hideButton = document.getElementById("sprites-hide");
hideButton.onclick = function () { return sprite.hide(); };
//# sourceMappingURL=sprites.js.map