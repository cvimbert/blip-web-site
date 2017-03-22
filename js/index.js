/**
 * Created by Christophe on 15/03/2017.
 */

(function () {
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

        dictionary.each(function (elem) {
            tmp.replaceAll(elem, "<span class='" + elem + "-entry'></span>")
        });

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

        var htmlContainer = document.getElementById("right");
        htmlContainer.innerHTML = pageHtml;

        var sections = document.getElementsByTagName("section");
        var index = document.getElementById("index");
        var id = 0;

        var ul = document.createElement("ul");

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var title = section.getElementsByTagName("h2")[0];
            var idt = "t" + id;
            title.id = idt;
            var li = document.createElement("li");
            var al = document.createElement("a");
            al.href = "#" + idt;
            al.innerHTML = title.innerHTML;
            li.appendChild(al);

            ul.appendChild(li);
            
            id++;
        }

        index.appendChild(ul);

        //document.body.style.visibility = "visible";
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

        var index = document.getElementById("index");
        var currentPageId = getId();

        for (var i = 0; i < pagesPaths.length; i++) {
            var element = document.createElement("div");
            element.innerHTML = pages[pagesPaths[i]];

            var title = element.getElementsByTagName("h1")[0].innerHTML;
            var li = document.createElement("li");
            li.id = cleanPath(pagesPaths[i]);

            var al = document.createElement("a");
            al.href = "?q=" + cleanPath(pagesPaths[i]);
            al.innerHTML = title;
            li.appendChild(al);

            index.appendChild(li);

            if (cleanPath(pagesPaths[i]) === currentPageId) {
                contructPage(pages[pagesPaths[i]]);
            }

            var scriptContainers = element.getElementsByClassName("script-def");

            for (var j = 0; j < scriptContainers.length; j++) {
                var scriptId = scriptContainers[j].id;
                var cont = document.getElementById(scriptId);

                var exampleContainer = document.createElement("div");
                exampleContainer.classList.add("example-container");
                exampleContainer.id = scriptId + "-container";
                cont.appendChild(exampleContainer);

                var codeContainer = document.createElement("div");
                codeContainer.classList.add("code-display");
                cont.appendChild(codeContainer);

                var codeReq = new XMLHttpRequest();
                codeReq.open('GET', "examples/" + scriptId + "/" + scriptId + ".ts");
                codeReq.overrideMimeType("text/html");
                codeReq.onload = function () {
                    var codeHtml = String(codeReq.response);

                    codeHtml = codeHtml.replaceAll("\r\n", "<br>");

                    codeContainer.innerHTML = codeHtml;
                };
                codeReq.send();

                loadScript(scriptId);
            }
        }
    });

})();