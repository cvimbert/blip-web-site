/**
 * Created by Christophe on 15/03/2017.
 */

(function () {

    var dictionary = ["Sprite", "File"];

    var pagesPaths = [
        "intro",
        "mise-en-place",
        "api/sprites",
        "api/groups",
        "api/group-states"
    ];

    var tableOfContent = {
        "blip-project": {
            title: "Le projet Blip",
            content: [
                "intro",
                "mise-en-place"
            ]
        },
        "display": {
            title: "L'affichage",
            content: [
                "sprites",
                "groups",
                "group-states"
            ]
        }
    };

    var hljs = require("highlightjs");
    var $ = require("jquery");

    var qParam = getId("q");
    var rParam = getId("r");

    function setLocaleUrl() {
        setUrl([qParam, rParam]);
    }

    function pushLocaleUrl() {
        pushUrl([qParam, rParam]);
    }

    function generateSubMenu(id, contentSet, subs) {
        loadPagesSet(id, contentSet["content"], function (datas, cid) {

            if (!rParam) {
                rParam = Object.keys(datas)[0];
                pushLocaleUrl();
            }

            var pageContents = {};
            var terUls = {};

            for (var pageId in datas) {
                if (datas.hasOwnProperty(pageId)) {
                    var pageContent = $("<div></div>");
                    pageContent.html($(datas[pageId]));

                    var title = $("h1", pageContent).html();
                    var subLi = $("<li></li>");
                    subLi.data("pid", pageId);
                    subLi.html(title);

                    subLi.on("click", function () {
                        var qr = $(this).data("pid");
                        rParam = qr;
                        $(".level-2-sub").html("");
                        generateSubSubMenu(terUls[qr], pageContents[qr]);
                        pushLocaleUrl();
                    });

                    subs[cid].append(subLi);

                    var terUl = $("<ul class='level-2-sub'></ul>");
                    subs[cid].append(terUl);
                    terUls[pageId] = terUl;
                    pageContents[pageId] = pageContent;

                    if (rParam === pageId) {
                        generateSubSubMenu(terUl, pageContent);
                    }
                }
            }
        });
    }

    function generateSubSubMenu(containerUl, pageContent) {

        var sections = $("section", pageContent);

        sections.each(function () {
            var sectionTitle = $("h2", this).html();

            var subSubLi = $("<li></li>");
            subSubLi.html(sectionTitle);

            subSubLi.on("click", function () {

            });

            containerUl.append(subSubLi);
        });
    }

    function loadPages(pagesIndex, callback) {

        var pagesHtml = {};
        var count = 0;

        var index2Container = $("#index2");
        var subs = {};

        if (!qParam) {
            qParam = Object.keys(tableOfContent)[0];
            pushLocaleUrl();
        }

        for (var id in tableOfContent) {

            if (tableOfContent.hasOwnProperty(id)) {
                var contentSet = tableOfContent[id];

                var li = $("<li class='level-1'></li>");
                li.attr("id", "lv1-" + id);
                li.html(contentSet["title"]);
                li.data("lid", id);
                index2Container.append(li);

                li.on("click", function () {

                    // pour un effet ulterieur (joli effet de repliage)
                    //alert (subs[qParam].height());

                    var qp = $(this).data("lid");
                    qParam = qp;
                    rParam = null;
                    pushLocaleUrl();

                    $(".level-1-sub").html("");

                    generateSubMenu(qp, tableOfContent[qp], subs);
                });

                var sub = $("<ul class='level-1-sub'></ul>");
                sub.attr("id", id + "-sub");
                index2Container.append(sub);

                subs[id] = sub;

                if (qParam === id) {
                    generateSubMenu(id, contentSet, subs);
                }
            }
        }

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
    
    function createPagesSetDisplay(contentSet) {
        
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

    function loadPageB(directory, pagePath, callback) {

        var req = new XMLHttpRequest();
        req.overrideMimeType("text/html");
        req.open('GET', directory + "/" + pagePath + ".html");
        req.onload = function () {
            callback(pagePath, req.responseText);
        };
        req.send();
    }

    function loadPagesSet(id, pagesPaths, callback) {

        var pagesData = {};
        var count = 0;

        for (var i = 0; i < pagesPaths.length; i++) {

            loadPageB("pages/" + id, pagesPaths[i], function (path, pageContent) {
                pagesData[path] = pageContent;
                count++;

                if (count === pagesPaths.length) {
                    callback(pagesData, id);
                }
            });
        }
    }

    function contructPage(pageId, pageHtml) {

        $(".sub-menu").html("");

        //document.body.style.visibility = "visible";

        var htmlContainer = $("#right");
        var contentHtml = $(pageHtml);
        htmlContainer.html(contentHtml);

        var sections = $("section");
        var index = $("#index");
        var id = 0;

        sections.each(function () {
            var title = $("h2", this);
            var idt = "t" + id;
            title.attr("id", idt);

            var subElem = $(
                "<li>" +
                    "<a></a>" +
                "</li>"
            );

            $("#sub-menu-" + cleanPath(pageId)).append(subElem);

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

        var scriptContainers = $(".script-def", contentHtml);
        var gameContainers = $(".game-def", contentHtml);

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

    function cleanPath(path) {
        return path.replace("/", "-");
    }

    function getId(key) {
        var searchStr = document.location.search;

        if (searchStr.charAt(0) === "?") {
            searchStr = searchStr.substr(1);
        }

        var arr = searchStr.split("&");

        for (var i = 0; i < arr.length; i++) {
            var qstr = arr[i].split("=");

            if (qstr[0] === key) {
                return qstr[1];
            }
        }

        return null;
    }

    function getUrl(ids) {

        var letters = ["q", "r", "s", "t"];
        var queryString = "";

        for (var i = 0; i < ids.length; i++) {
            queryString += letters[i] + "=" + ids[i];
            if (i !== ids.length - 1) {
                queryString += "&";
            }
        }

        return "?" + queryString;
    }

    function setUrl(ids) {
        document.location.href = getUrl(ids);
    }

    function pushUrl(ids) {
        window.history.pushState("", "", getUrl(ids));
    }

    var currentScriptId;

    function loadScript(id) {

        if (currentScriptId) {
            System.delete(currentScriptId);
        }

        currentScriptId = 'examples/' + id + "/" + id + ".js";
        System.load(currentScriptId).catch(function(err){ console.error(err); });
    }

    loadPages(pagesPaths, function (pages) {

        var index = $("#index");
        var currentPageId = getId("q");

        for (var i = 0; i < pagesPaths.length; i++) {

            var element = $("<div></div>");

            var contentElement = $(pages[pagesPaths[i]]);
            element.append(contentElement);

            var title = $("h1", element).html();

            var li = $("<li class='menu-item'></li>");
            var sub = $("<ul class='sub-menu'></ul>");
            sub.attr("id", "sub-menu-" + cleanPath(pagesPaths[i]));

            li.attr("id", cleanPath(pagesPaths[i]));

            li.attr("data-id", i);
            //al.attr("href", "?q=" + cleanPath(pagesPaths[i]));

            li.on("click", function () {
                currentPageId = pagesPaths[$(this).data("id")];
                contructPage(currentPageId, pages[currentPageId]);
            });

            li.html(title);

            index.append(li);
            index.append(sub);

            if (cleanPath(pagesPaths[i]) === currentPageId) {

                contructPage(currentPageId, pages[pagesPaths[i]]);
            }
        }


    });

})();