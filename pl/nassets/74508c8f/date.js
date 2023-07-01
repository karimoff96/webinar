function DateFieldWidget() {
  this.dateFrom = null;
  this.dateTo = null;
  this.dateType = null;

  this.toNDays = null;
  this.fromNDays = null;

  this.controlEl = null;
  this.withTime = false;
  this.datepickersInitialized = false;
  // this.withTime =
  var widget = this;

  this.getDates = function (field) {
    var params = {
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
      dateType: this.dateType,
      toNDays: this.toNDays,
      fromNDays: this.fromNDays,
    };

    var widget = this;

    if (this.dateType) {
      ajaxCall(
        "/pl/system/get-date-by-params",
        { params: params },
        {},
        function (response) {
          widget.controlEl
            .find(".date-helper")
            .html(response.label)
            .removeClass("hide");
        }
      );
    } else {
      widget.controlEl.find(".date-helper").addClass("hide");
    }
  };

  this.initEl = function ($el, field, value) {
    $el.addClass("date-field-widget");
    if (field.one_line) {
      $el.addClass("one-line");
    }

    $controlEl = $(
      "<div style='white-space: nowrap'>" +
        "<div class='manual-selected-date'><span class='from'/><span class='to'  size=20 /></div>" +
        "<div class='n-days-selected-wrap'><span class='from_n'/><span class='to_n'/></div>" +
        "<label class='date-helper'></label></div>"
    );
    this.controlEl = $controlEl;
    var self = this;

    this.fromElWrapper = $controlEl.find(".from");
    this.toElWrapper = $controlEl.find(".to");

    this.fromNDaysWrapper = $controlEl.find(".from_n");
    this.toNDaysWrapper = $controlEl.find(".to_n");

    var dateType = null;
    if (value) {
      if (value.from) this.dateFrom = value.from;
      if (value.to) this.dateTo = value.to;
      if (value.toNDays) this.toNDays = value.toNDays;
      if (value.fromNDays) this.fromNDays = value.fromNDays;
      if (value.dateType) dateType = value.dateType;
      if (value.withTime) this.withTime = value.withTime;
    }

    this.initDatepickers(value, field);
    widget.dateTypeChanged(dateType);

    $selectDateTypeEl = $("<div class='date-type-selector'/>");
    this.typeSelectWidget = new window.logicFieldWidgets["select"]();

    var datetypesUrl = "/pl/logic/logic-ajax/date-types";

    if (field.period_type) {
      datetypesUrl += "?periodType=" + field.period_type;
    }

    var labelSelectDates = "Выбрать даты";
    if (typeof Yii != "undefined") {
      labelSelectDates = Yii.t("common", "Select dates");
    }

    this.typeSelectWidget.init(
      $selectDateTypeEl,
      {
        name: "status",
        not_multiple: true,
        values_url: datetypesUrl,
        emptyLabel: labelSelectDates,
      },
      { selected_id: dateType }
    );
    this.typeSelectWidget.changed = function () {
      var value = this.getValue();
      var selected = null;
      if (value) {
        selected = value.selected_id;
      }
      widget.dateTypeChanged(selected);
      widget.changed();
      widget.getDates();
    };

    $withTimeEl = $("<input style='display: none' type='checkbox' >");
    this.withTimeElWrapperEl = $withTimeElWrapperEl = $(
      "<label class='with-time-checkbox manual-selected-date' title='Указать точное время'> <span class='fa fa-clock-o'></span></label>"
    );
    $withTimeEl.prependTo($withTimeElWrapperEl);

    $withTimeEl.change(function () {
      self.withTime = $(this).prop("checked");

      if (self.withTime) {
        $withTimeElWrapperEl.addClass("checked");
      } else {
        $withTimeElWrapperEl.removeClass("checked");
      }

      self.initDatepickers(self.getValue(), field);
      self.changed();
    });

    if (self.withTime) {
      $withTimeElWrapperEl.addClass("checked");
    }

    this.withTimeChecker = $withTimeEl;

    $addControlsEl = $("<div class='additional-controls'>");
    $selectDateTypeEl.appendTo($addControlsEl);
    $withTimeElWrapperEl.appendTo($addControlsEl);

    //this.dateTypeChanged( dateType )

    $addControlsEl.prependTo($controlEl);

    this.initFieldEl($el, $controlEl, field);
  };

  this.initDatepickers = function (value, field) {
    this.fromElWrapper.empty();
    this.toElWrapper.empty();
    this.toNDaysWrapper.empty();
    this.fromNDaysWrapper.empty();

    var placeholderFrom = "с";
    var placeholderTo = "по";
    var placeholderFrom2 = "от";
    var placeholderTo2 = "до";
    if (typeof Yii != "undefined") {
      placeholderFrom = Yii.t("common", "from");
      placeholderTo = Yii.t("common", "to");
      placeholderFrom2 = Yii.t("common", placeholderFrom2);
      placeholderTo2 = Yii.t("common", placeholderTo2);
    }

    this.fromEl = $(
      '<input class="form-control" type="text" autocomplete="off" size="14" placeholder="' +
        placeholderFrom +
        '" style="margin-right: 4px; display: inline; width: 130px;"/>'
    );
    this.toEl = $(
      '<input class="form-control" type="text" autocomplete="off" size="14" placeholder="' +
        placeholderTo +
        '" style="display: inline; width: 130px"/>'
    );

    this.fromNDaysEl = $(
      "<label>" + placeholderFrom2 + ' <input type="text" size=16/></label>'
    );
    this.fromNDaysEl.find("input:first").val(this.fromNDays);

    this.toNDaysEl = $(
      "<label>" + placeholderTo2 + ' <input type="text" size=16/></label>'
    );
    this.toNDaysEl.find("input:first").val(this.toNDays);

    this.toEl.appendTo(this.toElWrapper);
    this.fromEl.appendTo(this.fromElWrapper);

    this.toNDaysEl.appendTo(this.toNDaysWrapper);
    this.fromNDaysEl.appendTo(this.fromNDaysWrapper);

    if (value) {
      var setVal = null;

      if (value.from) {
        if (this.withTime) {
          setVal = value.from;
          if (setVal.length == 10) {
            setVal += " 00:00";
          }
        } else {
          this.dateFrom = value.from.substring(0, 10);
          setVal = this.dateFrom;
        }

        this.fromEl.val(setVal);
      }
      if (value.to) {
        if (this.withTime) {
          setVal = value.to;
          if (setVal.length == 10) {
            setVal += " 23:59";
          }
        } else {
          this.dateTo = value.to.substring(0, 10);
          setVal = this.dateTo;
        }

        this.toEl.val(setVal);
      }
    }
    var dateOptions = {
      autoclose: true,
      format: "dd.mm.yyyy",
      language: "ru",
      weekStart: 1,
    };
    var dateTimeOptions = {
      autoclose: true,
      format: "dd.mm.yyyy hh:ii",
      language: "ru",
      weekStart: 1,
    };

    if (field.without_year) {
      //options.format = 'dd.mm';
    }

    if (this.withTime) {
      this.fromEl.datetimepicker(dateTimeOptions);
      this.toEl.datetimepicker(dateTimeOptions);
    } else {
      this.fromEl.datepicker(dateOptions);
      this.toEl.datepicker(dateOptions);
    }

    var self = this;

    var dateChanged = function (field, obj) {
      if (field != "toNDays" && field != "fromNDays") {
        if (self.withTime) {
          var date = $(obj).datetimepicker("getDate");
        } else {
          var date = $(obj).datepicker("getDate");
        }
        var value = null;
        if (date) {
          value =
            ("0" + date.getDate()).slice(-2) +
            "." +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "." +
            date.getFullYear();
        }
        if (self.withTime) {
          value += " ";
          value +=
            date.getHours() >= 12
              ? date.getHours()
              : ("0" + date.getHours()).slice(-2);
          value += ":";
          value +=
            date.getMinutes() >= 10
              ? date.getMinutes()
              : ("0" + date.getMinutes()).slice(-2);
        }
      } else {
        value = $(obj).find("input:first").val();
      }

      widget[field] = value;
      widget.changed();
      widget.getDates();
    };

    this.toEl.on("keyUp", function () {
      dateChanged("dateTo", this);
    });

    this.toEl.on("changeDate", function () {
      dateChanged("dateTo", this);
    });

    this.fromEl.on("keyUp", function () {
      dateChanged("dateFrom", this);
    });

    this.fromEl.on("changeDate", function () {
      dateChanged("dateFrom", this);
    });

    this.toNDaysEl.on("change", function () {
      dateChanged("toNDays", this);
    });

    this.fromNDaysEl.on("change", function () {
      dateChanged("fromNDays", this);
    });

    this.datepickersInitialized = this.withTime ? "time" : "date";
  };

  this.dateTypeChanged = function (type) {
    if (type) {
      this.controlEl.addClass("date-type-selected");
      this.controlEl.removeClass("manual-type-selected");

      if (
        type == "next_n_days" ||
        type == "next_n_days_from_now" ||
        type == "last_n_days" ||
        type == "last_n_hours"
      ) {
        this.controlEl.addClass("n-days-selected");
      } else {
        this.controlEl.removeClass("n-days-selected");
      }
    } else {
      this.controlEl.removeClass("date-type-selected");
      this.controlEl.removeClass("n-days-selected");
      this.controlEl.addClass("manual-type-selected");
    }

    this.dateType = type;
  };

  this.getValue = function () {
    return {
      from: this.dateFrom,
      to: this.dateTo,
      toNDays: this.toNDays,
      fromNDays: this.fromNDays,
      dateType: this.dateType,
      withTime: this.withTime,
    };
  };

  this.setValue = function (value) {
    if (value) {
      var withTime = value.withTime;

      var from =
        value.from && !withTime ? value.from.substring(0, 10) : value.from;
      var to = value.to && !withTime ? value.to.substring(0, 10) : value.to;

      //this.fromEl.val( from )
      this.dateFrom = from;
      this.dateTypeChanged(value.dateType);
      this.typeSelectWidget.setValue({ selected_id: value.dateType });

      //this.toEl.val( value.to )
      this.dateTo = value.to;
      this.withTime = withTime;
      this.withTimeChecker.prop("checked", withTime);

      if (this.withTime) {
        this.withTimeElWrapperEl.addClass("checked");
      } else {
        this.withTimeElWrapperEl.removeClass("checked");
      }

      this.toNDays = value.toNDays;
      this.fromNDays = value.fromNDays;

      this.initDatepickers(value, this.field);
      widget.getDates();
    }
  };
}

extend(DateFieldWidget, FieldWidget);
DateFieldWidget.prototype = new FieldWidget();

window.logicFieldWidgets["date"] = DateFieldWidget;
