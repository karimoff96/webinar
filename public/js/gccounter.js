if (typeof window.gcCounter == "undefined") {
  var getTimeZoneData = function () {
    var today = new Date();
    var jan = new Date(today.getFullYear(), 0, 1);
    var jul = new Date(today.getFullYear(), 6, 1);
    var dst =
      today.getTimezoneOffset() <
      Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());

    return encodeURI(
      today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        " " +
        today.getHours() +
        ":" +
        today.getMinutes()
    );
  };

  try {
    let tz = getTimeZoneData(),
      urlAdd = "";

    if (window.gcsObjectType) {
      urlAdd = "&objectType=" + window.gcsObjectType;
    }

    if (window.gcsObjectId) {
      urlAdd = "&objectId=" + window.gcsObjectId;
    }

    if (window.gcUniqId) {
      urlAdd += "&uniqId=" + encodeURIComponent(window.gcUniqId);
    }

    if (window.gcsObjectTypeId) {
      urlAdd += "&objectTypeId=" + window.gcsObjectTypeId;
    }

    if (
      undefined !== window.csrfToken &&
      window.csrfToken &&
      undefined !== window.gcSessionId &&
      !window.gcSessionId
    ) {
      urlAdd += "&token=" + window.csrfToken;
    }

    let statUrl =
      "/stat/counter?ref=" +
      encodeURIComponent(document.referrer) +
      "&loc=" +
      encodeURIComponent(document.location.href) +
      urlAdd +
      "&tzof=" +
      tz;
    if (
      window.isSessionLocalStorageEnabled == "undefined" ||
      !window.isSessionLocalStorageEnabled
    ) {
      document.write(
        "<img style='position: absolute; left:0;top:0' width=1 height=1 id='gccounterImg' src='" +
          statUrl +
          "'/>"
      );
    } else {
      document.write("<script src='" + statUrl + "'></script>");
    }
    window.gcCounter = 1;
  } catch (e) {
    document.write(
      "<img style='position: absolute; left:0;top:0' width=1 height=1 id='gccounterErrImg' src=''/>"
    );
  }
}

function gcFixIncident(type, subtype) {
  var data = {};
  data.type = type;
  data.subtype = subtype;
  data.userId = window.accountUserId;
  data.sessionId = window.gcSessionId;

  ajaxCall("/pl/stat/counter/fix-incident", data, {}, function (response) {});
}
