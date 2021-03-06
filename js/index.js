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
    
    function openGlossaryPopup(definitionId) {
        $.get("glossary/" + definitionId + ".html", function (definitionHtml) {
            var popup = $("#glossary-popup");
            $(".content", popup).html(definitionHtml);
            popup.css("display", "block");
            $(".close-button", popup).on("click", function () {
                closeGlossaryPopup();
            });
        });
    }

    function closeGlossaryPopup() {
        var popup = $("#glossary-popup");
        popup.css("display", "none");
        $(".close-button", popup).off("click");
    }

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
        //return (height / 100) * duration;
        return duration;
    }
    
    function setNavigationArrowsVisibility() {
        var qKeys = Object.keys(tableOfContent);
        var rKeys = tableOfContent[qParam]["content"];

        var qIndex = qKeys.indexOf(qParam);
        var rIndex = rKeys.indexOf(rParam);

        if (qIndex === 0 && rIndex === 0) {
            $("#previous-article").css("visibility", "hidden");
        } else {
            $("#previous-article").css("visibility", "visible");
        }

        if (qIndex >= qKeys.length - 1 && rIndex >= rKeys.length - 1) {
            $("#next-article").css("visibility", "hidden");
        } else {
            $("#next-article").css("visibility", "visible");
        }
    }

    function getClosestToBaseLineElementByTagName(tagName, baseLine) {
        var elements = document.getElementsByTagName(tagName);
        return getClosestToBaseLineElement(elements, baseLine);
    }


    var latest;

    function getClosestToBaseLineElement(elements, baseLine) {
        var closest;
        var minDistance = Number.MAX_VALUE;

        for (var i = 0; i < elements.length; i++) {

            //setDocumentScroll(elements[i]);

            var rect = elements[i].getBoundingClientRect();
            var dist = Math.abs(rect["top"] - baseLine);

            if (dist < minDistance && rect["top"] > 0 && rect["bottom"] <= window.innerHeight) {
                closest = elements[i];
                latest = closest;
                minDistance = dist;
            }
        }

        if (!closest) closest = latest;
        return closest;
    }

    function setDocumentScroll(element) {
        element = element[0];
        var pos = element.offsetTop;
        var fact = pos / document.body.clientHeight;
        var baseLine = fact * window.innerHeight;
        var scTop = pos - baseLine;
        document.body.scrollTop = scTop;
    }

    function getVisibleTagNameElements(tagName) {
        var elements = document.getElementsByTagName(tagName);
        return getVisibleElements(elements);
    }

    function getVisibleElements(elements) {
        var retElems = [];

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var rect = element.getBoundingClientRect();

            if (rect["top"] > 0 && rect["bottom"] < window.innerHeight) {
                retElems.push(element);
            }
        }

        return retElems;
    }

    var time;

    function closeLevel(levelClass, subContainerClass) {
        var menu = $("#index");

        $(levelClass, menu).each(function () {
            if ($(subContainerClass, this).html() !== "") {

                var elem = $(this);
                var height = elem.height();

                time = getLinearTime(0.6, height);

                TweenLite.set(this, {
                    css: {
                        height: height
                    }
                });

                $(subContainerClass, this).addClass("absolute-bottom");

                TweenLite.to(this, time , {
                    css: {
                        opacity: 0,
                        height: 0
                    },
                    onComplete: function () {
                        $(subContainerClass, elem).removeClass("absolute-bottom");
                        $(subContainerClass, elem).html("");
                        TweenLite.set(elem, {
                            clearProps: "all"
                        });
                    }
                });
            }
        });
    }

    function openLevel(levelElement, subContainerClass, delay) {
        var height = levelElement.height();

        TweenLite.set(levelElement, {
            css: {
                height: 0,
                opacity: 0
            }
        });

        $(subContainerClass, levelElement).addClass("absolute-bottom");

        if (!delay) delay = 0;

        setTimeout(function () {

            TweenLite.to(levelElement, time, {
                css: {
                    height: height,
                    opacity: 1
                },
                onComplete: function () {
                    $(subContainerClass, levelElement).removeClass("absolute-bottom");
                    TweenLite.set(levelElement, {
                        clearProps: "all"
                    });
                }
            });

        }, delay * 1000);
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

    function completeOpenRLevel(qq, qr) {
        if (qr === rParam) {
            return;
        }

        rParam = qr;

        document.body.scrollTop = 0;

        // ici on referme les menus ouverts
        closeLevel(".level-2-sub", ".sub-content-2");

        generateSubSubMenu(terUlsIndex[qq][qr], pagesContentIndex[qq][qr]);

        // et on ouvre le nouveau menus générés
        openLevel(terUlsIndex[qq][qr], ".sub-content-2", 0.7);

        pushLocaleUrl();
    }

    function completeOpenQLevel(qp) {
        if (qp === qParam) {
            return;
        }

        document.body.scrollTop = 0;

        qParam = qp;
        rParam = null;
        pushLocaleUrl();

        closeLevel(".level-1-sub", ".sub-content-1");

        generateSubMenu(qp, tableOfContent[qp], subs, true);
    }

    var terUlsIndex = {};
    var pagesContentIndex = {};

    function generateSubMenu(id, contentSet, subs, animated) {
        loadPagesSet(id, contentSet["content"], function (datas, cid) {

            if (!rParam) {
                rParam = contentSet["content"][0];
                pushLocaleUrl();
            }

            var pageContents = {};
            pagesContentIndex[id] = pageContents;
            var terUls = {};
            terUlsIndex[id] = terUls;

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
                        completeOpenRLevel(id, qr);
                    });

                    $(".sub-content-1", subs[cid]).append(subLi);

                    var terUl = $("<div class='level-2-sub'><div class='sub-content-2'></div></div>");
                    $(".sub-content-1", subs[cid]).append(terUl);
                    terUls[pageId] = terUl;
                    pageContents[pageId] = pageContent;

                    if (rParam === pageId) {
                        generateSubSubMenu(terUl, pageContent);
                    }
                }
            }

            if (animated) {
                openLevel(subs[cid], ".sub-content-1", 0.7);
            }
        });
    }

    function generateSubSubMenu(containerUl, pageContent) {

        var sections = $("section", pageContent);

        sections.each(function (i) {

            $(this).attr("id", "section-" + i);

            $("h2", this).data("section", i);
            var sectionTitle = $("h2", this).html();

            var subSubLi = $("<div class='level-3'><span class='section-level'></span></div>");
            subSubLi.data("section", i);
            $("span", subSubLi).html(sectionTitle);
            $("span", subSubLi).addClass("section-" + i);

            subSubLi.on("click", function () {
                //document.location.href = "#section-" + i;
                //updateSectionsLevel("section-" + i);
                var sectionId = $(this).data("section");
                var elem = $("#section-" + sectionId);
                setDocumentScroll(elem);
            });

            $(".sub-content-2", containerUl).append(subSubLi);

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

            // glossaire
            var glossaryEntries = $(".glossary", this);

            glossaryEntries.each(function () {
                var item = $(this);
                item.on("click", function () {
                    var entryName = item.data("glossary");
                    openGlossaryPopup(entryName)
                });
            });
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
        setNavigationArrowsVisibility();
        getVisibleTagNameElements("h2");
    }

    $(document).on("scroll", function () {
        var scrollRatio = document.body.scrollTop / (document.body.scrollHeight - window.innerHeight);
        var baseLinePosition = window.innerHeight * scrollRatio;

        var closestElement = getClosestToBaseLineElementByTagName("h2", baseLinePosition);
        var sectionId = $(closestElement).data("section");

        var menu = $("#index");
        $(".section-level", menu).removeClass("current");
        $(".section-" + sectionId, menu).addClass("current");
    });

    var subs = {};

    function loadPages() {

        var pagesHtml = {};
        var count = 0;

        var index2Container = $("#index");

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
                    completeOpenQLevel(qp);
                });

                var sub = $("<div class='level-1-sub'><div class='sub-content-1'></div></div>");
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

    $("#previous-article").on("click", function () {
        var currentRList = tableOfContent[qParam].content;
        var rIndex = currentRList.indexOf(rParam);

        if (rIndex <= 0) {
            var qList = Object.keys(tableOfContent);
            var qIndex = qList.indexOf(qParam);
            completeOpenQLevel(qList[qIndex - 1]);
        } else {
            completeOpenRLevel(qParam, currentRList[rIndex - 1]);
        }
    });

    $("#next-article").on("click", function () {
        var currentRList = tableOfContent[qParam].content;
        var rIndex = currentRList.indexOf(rParam);

        if (rIndex >= currentRList.length - 1) {
            // on est en fin de rList
            var qList = Object.keys(tableOfContent);
            var qIndex = qList.indexOf(qParam);
            completeOpenQLevel(qList[qIndex + 1]);
        } else {
            // il reste encore des éléments dans la rList à voir
            completeOpenRLevel(qParam, currentRList[rIndex + 1]);
        }
    });

    loadPages();

})();