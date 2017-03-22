"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("blip-framework/core");
var file = new core_1.File("files/sprites/p4-body.png");
var sprite = new core_1.Sprite(file, 20, 20);
sprite.displayInDOMElement(document.getElementById("sprites-container"));
var toggleButton = document.getElementById("sprites-toggle");
toggleButton.onclick = function () { return sprite.toggle(); };
var showButton = document.getElementById("sprites-show");
showButton.onclick = function () { return sprite.display(); };
var hideButton = document.getElementById("sprites-hide");
hideButton.onclick = function () { return sprite.hide(); };
//# sourceMappingURL=sprites.js.map