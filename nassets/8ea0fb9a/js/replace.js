var vimeoReplaceApi = "/pl/fileservice/video/vimeo-replace";
var vimeoSubstring = "player.vimeo.com";
var xhrSuccessState = 4;

function printCdnPlayerDiv(fileId) {
  var css =
    "<style>" +
    ".vhi-root {" +
    "width: 100%;" +
    "max-width: 100vw;" +
    "padding-top: 56.25%;" +
    "position: relative;" +
    "}" +
    ".vhi-iframe {" +
    "width: 100%;" +
    "height: 100%;" +
    "position: absolute;" +
    "top: 0;" +
    "left: 0;" +
    "}" +
    "</style>";

  return (
    css +
    "<div " +
    'class="vhi-root" ' +
    'data-place="new-player">' +
    '<div id="cdn-player-' +
    fileId +
    '" ' +
    'class="vhi-iframe js--vhi-iframe"></div> </div>'
  );
}

function startCdnPlayer(fileId, videoHash) {
  new Clappr.Player({
    language: "ru-RU",
    parentId: "#cdn-player-" + fileId,
    source:
      "https://vh02.gcfiles.net:8083/vod_hls/fileservice/file/download-proxy/h/" +
      videoHash +
      "/master.m3u8",
    autoPlay: false,
    width: "100%",
    height: "100%",
    playback: {
      debug: true,
    },
  });
}

function isJson(string) {
  try {
    var json = JSON.parse(string);
  } catch (exception) {
    return false;
  }

  return true;
}

/**
 *
 * @param {string} videoId
 * @param {HTMLIFrameElement} iframe
 */
function getIframeSrcByVideoId(videoId, iframe) {
  var url = vimeoReplaceApi + "?videoId=" + parseInt(videoId);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function (e) {
    if (xhr.readyState === xhrSuccessState) {
      if (xhr.status === 200) {
        var responseObject;
        var wrapper = document.createElement("div");

        if (xhr.responseText === "false") {
          return;
        }

        if (isJson(xhr.responseText)) {
          responseObject = JSON.parse(xhr.responseText);

          iframe.parentNode.classList.remove("videoWrapper");
          iframe.parentNode.insertBefore(wrapper, iframe);
          wrapper.appendChild(iframe);

          wrapper.innerHTML = printCdnPlayerDiv(responseObject.id);

          startCdnPlayer(responseObject.id, responseObject.hash);
          var playerElement = document.getElementById(
            "cdn-player-" + responseObject.id
          );
          var player = playerElement.querySelector("video[data-html5-video]");
          var conatainer = playerElement.querySelector(
            ".container[data-container]"
          );

          // conatainer.style.position = "initial";
          // player.style.position = "initial";
          // player.style.width = "initial";
          return;
        }

        iframe.parentNode.classList.remove("videoWrapper");
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);

        wrapper.innerHTML = xhr.responseText;
        runAlternateCdn();
      }
    }
  };

  xhr.onerror = function (e) {};

  xhr.send(null);
}

/**
 *
 * @param src
 *
 * @returns {null|string}
 */
function getVideoIdFromSrc(src) {
  var regGroups = src.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (regGroups === null) {
    return null;
  }

  return regGroups[1];
}

function upgradeCdn(data) {
  var url = "/pl/fileservice/video/upgrade-cdn";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(JSON.stringify({ "video-hash": data.videoHash }));
}

function feedbackCdn(data) {
  var url = "/pl/fileservice/video/feedback-cdn";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(JSON.stringify({ reason: data.reason, result: data.result }));
}

function closeFeedback() {
  var url = "/pl/fileservice/video/close-feedback";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, false);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.send(JSON.stringify({ reason: "close", result: "close" }));
}

function buildQuestion(data) {
  var question = data.question;
  var answers = "";

  data.answers.forEach(function (answer) {
    answers += answer;
  });

  return question + answers;
}

function show(el) {
  el.style.display = "block";
}

function close(el) {
  el.style.display = "none";
}

function remove(el) {
  el.parentNode.removeChild(el);
}

function runAlternateCdn() {
  var changes = document.querySelectorAll(".vhe-cdn-change");
  changes.forEach(function (change) {
    change.style.display = "none";
  });

  var change = document.querySelector(".vhe-cdn-change");

  if (!change) {
    // console.log('No cdn change container!');
    return;
  }

  var link = change.querySelector(".disclaimer-url");
  var feedbackReason = change.querySelector(".feedback#reason");
  var feedbackResult = change.querySelector(".feedback#result");
  var feedbackClose = change.querySelector(".feedback#close");
  var feedbackStatus = change.dataset["feedbackStatus"];
  var currentCdn = change.dataset["currentCdn"];

  change.style.display = "block";
  feedbackReason.style.display = "none";
  feedbackResult.style.display = "none";

  if (currentCdn === "integros" || currentCdn === "") {
    //change.style.height = '35px';
    link.innerHTML = window.tt("common", "Speed problem");
  } else {
    feedbackReason.innerHTML = buildQuestion(reasonQuestions);
    feedbackResult.innerHTML = buildQuestion(resultQuestions);

    link.innerHTML = window.tt("common", "Вернуться на основной плеер");

    switch (feedbackStatus) {
      case "noFeedback":
        show(feedbackReason);
        close(feedbackResult);
        break;
      case "hasReason":
        show(feedbackResult);
        close(feedbackReason);
        break;
      case "hasResult":
        //change.style.height = '35px';
        remove(feedbackReason);
        remove(feedbackResult);
        break;
    }
  }

  var btns = change.querySelectorAll(".btn");
  btns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (btn.classList.contains("reason-btn")) {
        change.dataset.reason = btn.id;

        show(feedbackResult);
        close(feedbackReason);
      }

      if (btn.classList.contains("result-btn")) {
        change.dataset.result = btn.id;
        feedbackCdn(change.dataset);
        feedbackResult.innerHTML = "Спасибо!";

        if (btn.id === "back") {
          upgradeCdn(change.dataset);
          window.location.reload();
        }

        setTimeout(function () {
          remove(feedbackReason);
          remove(feedbackResult);

          //change.style.height = 'auto';
        }, 2000);
      }
    });
  });

  feedbackClose.addEventListener("click", function (e) {
    e.preventDefault();
    closeFeedback();
    close(change);
  });

  link.addEventListener("click", function (e) {
    e.preventDefault();
    upgradeCdn(change.dataset);
    window.location.reload();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (window.params_52 !== 1) {
    //return;
  }

  var iframes = document.getElementsByTagName("iframe");
  for (var i = 0; i < iframes.length; i++) {
    var src = iframes[i].getAttribute("src");
    if (src.indexOf(vimeoSubstring) !== -1) {
      var videoId = getVideoIdFromSrc(src);
      if (videoId === null) {
        continue;
      }

      getIframeSrcByVideoId(videoId, iframes[i]);
    }
  }
});
