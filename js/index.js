/**
 * Created by Christophe on 15/03/2017.
 */

(function () {

    var classesDictionary = {
        "Sprite": "display_sprite",
        "File": "files_file"
    };

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
    var TweenLite = require("TweenLite");

    var qParam = getQueryStringParam("q");
    var rParam = getQueryStringParam("r");

    function getDocumentationPath(path, className) {
        var docPath = "documentation/classes/";
        var docFile = "_core_src_" + path + "_class_." + className.toLowerCase() + ".html";
        return docPath + docFile;
    }

    function setLocaleUrl() {
        setUrl([qParam, rParam]);
    }

    function pushLocaleUrl() {
        pushUrl([qParam, rParam]);
    }

    function getLinearTime(duration, height) {
       // return (height / 120) * duration;
        return duration;
    }

    var time;

    function closeLevel(levelClass) {
        var menu = $("#index");

        $(levelClass, menu).each(function () {
            if ($(this).html() !== "") {

                var elem = $(this);
                var height = elem.height();

                time = getLinearTime(0.6, height);

                TweenLite.to(this, time , {
                    css: {
                        opacity: 0,
                        height: 0
                    },
                    onComplete: function () {
                        elem.html("");
                        TweenLite.set(elem, {
                            clearProps: "all"
                        });
                    }
                });
            }
        });
    }

    function openLevel(levelElement) {
        var height = levelElement.height();

        TweenLite.set(levelElement, {
            css: {
                height: 0,
                opacity: 0
            }
        });

        TweenLite.to(levelElement, time, {
            css: {
                height: height,
                opacity: 1
            },
            onComplete: function () {
                TweenLite.set(levelElement, {
                    clearProps: "all"
                });
            }
        });
    }

    function updateLevels() {
        var menu = $("#index");

        // q-level
        $(".q-level", menu).removeClass("current");
        $(".q-level." + qParam, menu).addClass("current");

        // r-level
        $(".r-level", menu).removeClass("current");
        $(".r-level." + rParam, menu).addClass("current");
    }

    function updateSectionsLevel(sectionId) {
        var menu = $("#index");

        $(".section-level", menu).removeClass("current");
        $(".section-level." + sectionId, menu).addClass("current");
    }

    function generateSubMenu(id, contentSet, subs, animated) {
        loadPagesSet(id, contentSet["content"], function (datas, cid) {

            if (!rParam) {
                rParam = contentSet["content"][0];
                pushLocaleUrl();
            }

            var pageContents = {};
            var terUls = {};

            for (var i = 0; i < contentSet["content"].length; i++) {

                var pageId = contentSet["content"][i];

                if (datas.hasOwnProperty(pageId)) {
                    var pageContent = $("<div></div>");
                    pageContent.html($(datas[pageId]));

                    var title = $("h1", pageContent).html();
                    var subLi = $("<div class='level-2'><span class='r-level'></span></div>");
                    subLi.data("pid", pageId);
                    $("span", subLi).html(title);
                    $("span", subLi).addClass(pageId);

                    subLi.on("click", function () {
                        var qr = $(this).data("pid");

                        if (qr === rParam) {
                            return;
                        }

                        rParam = qr;

                        document.body.scrollTop = 0;

                        // ici on referme les menus ouverts
                        closeLevel(".level-2-sub");

                        generateSubSubMenu(terUls[qr], pageContents[qr]);

                        // et on ouvre le nouveau menus générés
                        openLevel(terUls[qr]);

                        pushLocaleUrl();
                    });

                    subs[cid].append(subLi);

                    var terUl = $("<div class='level-2-sub'><!--<div class='sub-content'></div>--></div>");
                    //terUl = $(".sub-content", terUl);
                    subs[cid].append(terUl);
                    terUls[pageId] = terUl;
                    pageContents[pageId] = pageContent;

                    if (rParam === pageId) {
                        generateSubSubMenu(terUl, pageContent);
                    }
                }
            }

            if (animated) {
                openLevel(subs[cid]);
            }
        });
    }

    function generateSubSubMenu(containerUl, pageContent) {

        var sections = $("section", pageContent);

        sections.each(function (i) {

            $(this).attr("id", "section-" + i);

            var sectionTitle = $("h2", this).html();

            var subSubLi = $("<div class='level-3'><span class='section-level'></span></div>");
            $("span", subSubLi).html(sectionTitle);
            $("span", subSubLi).addClass("section-" + i);

            subSubLi.on("click", function () {
                document.location.href = "#section-" + i;
                updateSectionsLevel("section-" + i);
            });

            containerUl.append(subSubLi);

            updateSectionsLevel("section-0");
        });

        displayPage(pageContent);
    }

    function displayPage(pageElem) {

        var htmlContainer = $("#right");
        var contentHtml = pageElem;
        htmlContainer.html(contentHtml);

        var sections = $("section");
        var index = $("#index");
        var id = 0;

        sections.each(function () {

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
                res = res.applyDictionary(classesDictionary);
                codeBlock.html(res);

                $(".dictionary-entry", codeBlock).each(function () {
                    var classId = $(this).data("class");
                    var path = $(this).data("path");

                    var content = $(this).html();
                    var link = $("<a></a>");
                    link.html(content);
                    link.attr("href", getDocumentationPath(path, classId));
                    link.attr("target", "_blank");
                    $(this).html(link);
                });

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

        updateLevels();
    }

    function loadPages(callback) {

        var pagesHtml = {};
        var count = 0;

        var index2Container = $("#index");
        var subs = {};

        if (!qParam) {
            qParam = Object.keys(tableOfContent)[0];
            pushLocaleUrl();
        }

        for (var id in tableOfContent) {

            if (tableOfContent.hasOwnProperty(id)) {
                var contentSet = tableOfContent[id];

                var li = $("<div class='level-1'><span class='q-level'></span></div>");
                li.attr("id", "lv1-" + id);
                li.data("lid", id);
                $("span", li).html(contentSet["title"]);
                $("span", li).addClass(id);
                index2Container.append(li);

                li.on("click", function () {

                    var qp = $(this).data("lid");

                    if (qp === qParam) {
                        return;
                    }

                    document.body.scrollTop = 0;

                    qParam = qp;
                    rParam = null;
                    pushLocaleUrl();

                    closeLevel(".level-1-sub");

                    generateSubMenu(qp, tableOfContent[qp], subs, true);
                });

                var sub = $("<div class='level-1-sub'><!--<div class='sub-content'></div>--></div>");
                //sub = $(".sub-content", sub);
                sub.attr("id", id + "-sub");
                index2Container.append(sub);

                subs[id] = sub;

                if (qParam === id) {
                    generateSubMenu(id, contentSet, subs);
                }
            }
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

        for (var id in dictionary) {
            if (dictionary.hasOwnProperty(id)) {
                tmp = tmp.replaceAll(id, "<span data-path='" + dictionary[id] + "' data-class='" + id.toLowerCase() + "' class='dictionary-entry " + id.toLowerCase() + "-entry'>TMP</span>");
                tmp = tmp.replaceAll("TMP", id);
            }
        }

        return tmp;
    };

    function loadPage(directory, pagePath, callback) {

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

            loadPage("pages/" + id, pagesPaths[i], function (path, pageContent) {
                pagesData[path] = pageContent;
                count++;

                if (count === pagesPaths.length) {
                    callback(pagesData, id);
                }
            });
        }
    }

    function cleanPath(path) {
        return path.replace("/", "-");
    }

    function getQueryStringParam(key) {
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

    loadPages(function (pages) {
        // plus rien !!!
    });

})();