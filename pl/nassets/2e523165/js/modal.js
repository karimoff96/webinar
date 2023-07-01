var createFactory = function () {
  var active;
  var initVal = 0;

  var bugfixIosMethod = function () {
    if (window.bugfixIosMethodRunned) {
      return;
    }
    // Detect ios 11_0_x affected
    // NEED TO BE UPDATED if new versions are affected
    var ua = navigator.userAgent,
      iOS = /iPad|iPhone|iPod/.test(ua),
      iOS11 = /OS 11_0_1|OS 11_0_2|OS 11_0_3|OS 11_1/.test(ua);

    // ios 11 bug caret position
    if (iOS && iOS11) {
      // Add CSS class to body
      $("body").addClass("iosBugFixCaret");
    }
    window.bugfixIosMethodRunned = true;
  };

  var modal = function (params, $existingModal) {
    bugfixIosMethod();

    params = undefined === params ? {} : params;
    var self = this;
    var isActive = false;
    var createdFromExisting = false;

    var loaderHtml =
      "<div class='loader'><i class='fa fa-spinner fa-spin'></i></div>";
    var closeButtonHtml =
      '<div class="close-btn"><i class="fa fa-times"></div>';

    if ($existingModal) {
      var $modal = $existingModal;
      createdFromExisting = true;
    } else {
      var $modal = $(
        "<div class='modal gc-modal' id='gc-modal-" +
          initVal++ +
          "'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'>" +
          [
            '<div class="gc-modal-content" id="gc-modal-content-' +
              initVal++ +
              '">',
            loaderHtml,
            "</div>",
          ].join("") +
          "</div></div></div>" +
          closeButtonHtml +
          "</div>"
      );
    }

    if (params.width) {
      $modal.find(".modal-dialog").css("max-width", params.width);
    }

    $modal.on("hide.bs.modal", function (event) {
      self.setIsActive(false);
      params.onHide && params.onHide();
    });
    $modal.on("show.bs.modal", function (event) {
      self.setIsActive(true);
      params.onShow && params.onShow();
    });
    $modal.on("hidden.bs.modal", function (event) {
      $(`#gc-modal-content-${initVal - 1} [id^='vhplayeriframe-']`).each(
        function () {
          this.contentWindow.postMessage("vh-stop-video", "*");
        }
      );
      $(`#gc-modal-content-${initVal - 1} .fotorama__video iframe`).each(
        function () {
          this.contentWindow.postMessage("vh-stop-video", "*");
        }
      );
      $(
        `#gc-modal-content-${
          initVal - 1
        } [id*="videoSlider"], #gc-modal-content-${
          initVal - 1
        } [id*="fotorama"]`
      ).each(function () {
        $(this).data("fotorama").stopVideo();
      });

      let activeModals = $(".modal").filter(function () {
        return $(this).css("display") === "block";
      });
      if (activeModals.length > 0) {
        $("body").addClass("modal-open");
      }
    });

    $(".close-btn", $modal).click(function () {
      $modal.modal("hide");
    });

    this.isActive = function () {
      return isActive;
    };

    this.setIsActive = function (value) {
      if (value) {
        active = this;
      }
      isActive = value;
    };

    this.show = function (t) {
      $modal.modal("show");
    };

    this.hide = function () {
      $modal.modal("hide");
    };

    this.getTopSelector = function () {
      return ".gc-modal";
    };

    this.getBodyEl = function () {
      return $modal.find(".modal-body");
    };

    this.getContentSelector = function () {
      return ".gc-modal-content";
    };

    this.reset = function () {
      this.setContent(loaderHtml);
    };

    this.setContent = function (content) {
      $modal.find(this.getContentSelector()).html(content);
    };

    this.getContent = function () {
      return $modal.find(this.getContentSelector()).html();
    };

    this.getContentEl = function () {
      return $modal.find(this.getContentSelector());
    };

    this.getModalEl = function () {
      return $modal;
    };

    this.get$Modal = function () {
      return $modal;
    };

    this.getId = function () {
      return this.get$Modal().attr("id");
    };

    this.getContentId = function () {
      return this.get$Modal().find(".gc-modal-content").attr("id");
    };

    this.getFooterEl = function () {
      if (!this.footerEl) {
        var $contentEl = this.get$Modal().find(".modal-content");

        this.footerEl = $('<div class="modal-footer"/>');
        this.footerEl.appendTo($contentEl);
      }
      return this.footerEl;
    };

    this.setTitle = function (title) {
      this.getHeaderEl().html(title);
    };

    this.headerEl = null;
    this.getHeaderEl = function () {
      if (!this.headerEl) {
        var $contentEl = this.get$Modal().find(".modal-content");

        this.headerEl = $('<div class="modal-header"/>');
        this.headerEl.prependTo($contentEl);
      }
      return this.headerEl;
    };

    this.alignVertical = function () {
      var $dialogEl = $modal.find(".modal-dialog");
      if ($dialogEl) {
        $dialogEl.css(
          "top",
          $(window).height() / 2 - $dialogEl.height() / 2 - 150 + "px"
        );
      }
    };

    this.isCreatedFromExisting = function () {
      return createdFromExisting;
    };

    if (!createdFromExisting) {
      $modal.modal(params);
    }
  };

  var factory = function () {
    var registry = [];

    this.create = function (params) {
      var w = new modal(params);
      registry.push(w);
      return w;
    };

    this.createFromExisting = function (params, $existingModal) {
      var w = new modal(params, $existingModal);
      registry.push(w);
      return w;
    };
  };

  window.gcModalFactory = new factory();

  window.gcModalActive = function () {
    return active;
  };

  $(document).keyup(function (event) {
    if (active && active.isActive) {
      if (event.keyCode == 27) {
        active.hide();
      }
    }
  });
};

createFactory();
