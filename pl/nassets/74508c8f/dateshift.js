function DateshiftFieldWidget() {
  this.partsEl = [];

  this.mode = "edit";

  this.parts = {
    days: { label: "days", short: "d" },
    hours: { label: "hours", short: "h" },
    minutes: { label: "minutes", short: "min" },
  };

  this.initEl = function ($el, field, value) {
    var widget = this;

    widget.controlEl = $controlEl = $("<div class='field-dateshift'></div>");

    widget.viewEl = $viewEl = $('<span class="view-elem"></span>');

    $viewEl.appendTo($controlEl);
    $viewEl.click(function () {
      widget.changeMode("edit");
    });

    for (var key in widget.parts) {
      var part = key;
      var label = widget.parts[key].label;
      if (typeof Yii != "undefined") {
        label = Yii.t("common", label);
      }

      var $partEl = $("<input type='text' size=3>");
      $partEl.on("change", function () {
        widget.changed();
      });

      var $wrapperEl = $(
        "<span class='dateshift-part'><span>" + label + "</span></span>"
      );
      $partEl.prependTo($wrapperEl);

      this.partsEl[key] = $partEl;
      $partEl.prependTo($wrapperEl);
      $wrapperEl.appendTo($controlEl);
    }

    this.initFieldEl($el, $controlEl, field);
    this.setValue(value);

    setTimeout(function () {
      widget.changed(value);
    }, 10);

    this.changeMode("edit");
  };

  this.onChange = function () {};

  this.changeMode = function (mode) {
    this.mode = mode;
    if (this.mode == "edit") {
      this.controlEl.addClass("edit-mode");
    } else {
      this.controlEl.removeClass("edit-mode");
    }
  };

  this.getValue = function () {
    var parts = {};
    for (key in this.partsEl) {
      parts[key] = this.partsEl[key].val();
    }
    return {
      parts: parts,
    };
    //return { 'checked' : this.yesEl.prop( 'checked' ) ? 1 : 0 };
  };

  this.setValue = function (value) {
    let notSpecified = "not specified";
    if (typeof Yii != "undefined") {
      notSpecified = Yii.t("common", notSpecified);
    }
    if (value && value.parts) {
      var stringParts = [];

      for (key in this.partsEl) {
        if (value.parts[key]) {
          this.partsEl[key].val(value.parts[key]);
          let short = this.parts[key].short;
          if (typeof Yii != "undefined") {
            short = Yii.t("common", short);
          }
          stringParts.push(value.parts[key] + " " + short + ".");
        }
      }

      if (stringParts.length > 0) {
        this.viewEl.html(stringParts.join(" "));
      } else {
        this.viewEl.html(notSpecified);
      }
    } else {
      this.viewEl.html(notSpecified);
    }
  };
}

extend(DateshiftFieldWidget, FieldWidget);
DateshiftFieldWidget.prototype = new FieldWidget();

window.logicFieldWidgets["dateshift"] = DateshiftFieldWidget;
