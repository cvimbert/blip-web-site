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

            // et les liens
            var links = $("a", this);

            if (links.length > 0) {
                var blocksLine = $("<div class='link-blocks-line'></div>");
                $(this).append(blocksLine);

                links.each(function () {
                    var linkBlock = $("<div class='link-block'><a><span class='title'></span></a><div class='ico fa fa-external-link'></div></div>");
                    $(".title", linkBlock).html($(this).attr("title"));
                    var blockLink = $("a", linkBlock);
                    blockLink.attr("href", $(this).attr("href"));
                    blockLink.attr("target", $(this).attr("target"));
                    blocksLine.append(linkBlock);

                    $(this).on("mouseover", function () {
                        linkBlock.addClass("over");
                    });

                    $(this).on("mouseout", function () {
                        linkBlock.removeClass("over");
                    });
                });
            }
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
                    var scriptId = $(this).data("script");
                    var codeContainer = $("<div class='code-display'><pre><code class='typescript'></code></pre></div>");
                    var header = $("<div class='script-tools'><span class='title'></span><div class='code-header'>header</div></div>");
                    var blockTitle = $(this).data("name");

                    if (!blockTitle) {
                        blockTitle = "Code de l'exemple :";
                    }

                    $(".title", header).html(blockTitle);
                    $(".code-header", header).html("> " + scriptId + ".ts");
                    $(this).append(header);
                    $(this).append(codeContainer);
                    var codeBlock = $("code", this);

                    $.get("examples/" + scriptId + "/" + scriptId + ".ts", function (res) {
                        res = res.applyDictionary(dictionary);
                        codeBlock.html(res);
                        hljs.highlightBlock(codeBlock.get(0));
                    });
                });
                
                gameContainers.each(function () {
                    var scriptId = $(this).data("script");
                    var elem = $("<div></div>");
                    $(this).append(elem);
                    elem.attr("id", scriptId + "-container");
                    loadScript(scriptId);
                });
            }
        }


    });

})();