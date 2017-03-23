/**
 * Created by Christophe on 15/03/2017.
 */

(function () {

    var dictionary = ["Sprite", "File"];

    var hljs = require("node_modules/highlight.js/lib/index.js");
    var $ = require("node_modules/jquery/dist/jquery.js");

    function loadPages(pagesIndex, callback) {

        var pagesHtml = {};
        var count = 0;

        for (var i = 0; i < pagesIndex.length; i++) {
            loadPage(pagesIndex[i], function (path, html) {
                pagesHtml[path] = html;
                count++;

                if (count === pagesIndex.length) {
                    callback(pagesHtml);
                }
            });
        }
    }

    String.prototype.replaceAll = function (search, replacement) {
        var tmp = this;

        while (tmp.indexOf(search) !== -1) {
            tmp = tmp.replace(search, replacement);
        }

        return tmp;
    };

    Array.prototype.each = function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i]);
        }
    };

    // term, actionType, actionArg
    String.prototype.applyDictionary = function (dictionary) {
        var tmp = this;

        for (var i = 0; i < dictionary.length; i++) {
            tmp = tmp.replaceAll(dictionary[i], "<span class='dictionary-entry " + dictionary[i].toLowerCase() + "-entry'>TMP</span>");
            tmp = tmp.replaceAll("TMP", dictionary[i]);
        }

        return tmp;
    };

    var hh = "voilà un Sprite";
    hh = hh.applyDictionary(dictionary);

    function loadPage(pagePath, callback) {

        var req = new XMLHttpRequest();
        req.overrideMimeType("text/html");
        req.open('GET', "pages/" + pagePath + ".html");
        req.onload = function () {
            callback(pagePath, req.responseText);
        };
        req.send();
    }

    function contructPage(pageHtml) {

        //document.body.style.visibility = "visible";

        var htmlContainer = $("#right");
        var contentHtml = $(pageHtml);
        htmlContainer.html(contentHtml);

        var sections = $("section");
        var index = $("#index");
        var id = 0;

        var ul = $("<ul></ul>");

        sections.each(function () {
            var title = $("h2", this);
            var idt = "t" + id;
            title.attr("id", idt);

            var subElem = $(
                "<li>" +
                    "<a></a>" +
                "</li>"
            );

            ul.append(subElem);

            var link = $("a", subElem);
            link.html(title.html());
            link.attr("href", "#" + idt);
            id++;
        });

        index.append(ul);
    }

    var pagesPaths = [
        "intro",
        "mise-en-place",
        "api/sprites"
    ];

    function cleanPath(path) {
        return path.replace("/", "-");
    }

    function getId() {
        var searchStr = document.location.search;

        if (searchStr.charAt(0) === "?") {
            searchStr = searchStr.substr(1);
        }

        var arr = searchStr.split("&");

        for (var i = 0; i < arr.length; i++) {
            var qstr = arr[i].split("=");

            if (qstr[0] === "q") {
                return qstr[1];
            }
        }

        return null;
    }

    function loadScript(id) {
        System.import('examples/' + id + "/" + id + ".js").catch(function(err){ console.error(err); });
    }

    loadPages(pagesPaths, function (pages) {

        var index = $("#index");
        var currentPageId = getId();

        for (var i = 0; i < pagesPaths.length; i++) {

            var element = $("<div></div>");

            var contentElement = $(pages[pagesPaths[i]]);
            element.append(contentElement);

            var title = $("h1", element).html();

            var li = $(
                "<li>" +
                    "<a></a>" +
                "</li>"
            );

            li.attr("id", cleanPath(pagesPaths[i]));

            var al = $("a", li);
            al.attr("href", "?q=" + cleanPath(pagesPaths[i]));
            al.html(title);

            index.append(li);

            if (cleanPath(pagesPaths[i]) === currentPageId) {

                contructPage(pages[pagesPaths[i]]);

                var scriptContainers = $(".script-def");
                var gameContainers = $(".game-def");

                scriptContainers.each(function () {
                    var scriptId = $(this).attr("id");
                    var codeContainer = $("<div class='code-display'><pre><code class='typescript'></code></pre></div>");
                    $(this).append(codeContainer);
                    var codeBlock = $("code", this);

                    $.get("examples/" + scriptId + "/" + scriptId + ".ts", function (res) {
                        res = res.applyDictionary(dictionary);
                        codeBlock.html(res);
                        hljs.highlightBlock(codeBlock.get(0));
                    });
                });

                /*for (var j = 0; j < scriptContainers.length; j++) {
                    var scriptId = scriptContainers[j].id;
                    var cont = document.getElementById(scriptId);

                    var codeContainer = document.createElement("div");
                    codeContainer.classList.add("code-display");

                    // pre est inutile
                    var pre = document.createElement("pre");
                    codeContainer.appendChild(pre);
                    var coded = document.createElement("code");
                    coded.classList.add("typescript");
                    pre.appendChild(coded);
                    cont.appendChild(codeContainer);

                    var codeReq = new XMLHttpRequest();
                    codeReq.open('GET', "examples/" + scriptId + "/" + scriptId + ".ts");
                    codeReq.overrideMimeType("text/html");

                    codeReq.onload = function () {
                        var codeHtml = codeReq.responseText.applyDictionary(dictionary);
                        coded.innerHTML = codeHtml;
                        hljs.highlightBlock(coded);
                    };
                    codeReq.send();

                    loadScript(scriptId);
                }*/
            }
        }


    });

})();