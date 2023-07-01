function NumericFieldWidget() {
  var self = this;

  this.valueEl = null;
  this.value1El = null;
  this.value2El = null;
  this.dashEl = null;
  this.fromToComment = null;

  var labelNlt = "Не менее";
  var labelLt = "Меньше";
  var labelEqual = "Равно";
  var labelGt = "Больше";
  var labelNgt = "Не более";
  var labelFrmTo = "От — до";

  if (typeof Yii != "undefined") {
    labelNlt = Yii.t("common", "Not less than");
    labelLt = Yii.t("common", "Less");
    labelEqual = Yii.t("common", "Equally");
    labelGt = Yii.t("common", "More");
    labelNgt = Yii.t("common", "No more");
    labelFrmTo = Yii.t("common", "From — to");
  }

  this.checkers = {
    nlt: labelNlt,
    lt: labelLt,
    equal: labelEqual,
    gt: labelGt,
    ngt: labelNgt,
    frmto: labelFrmTo,
  };

  this.initEl = function ($el, field, value) {
    var widget = this;

    $selectEl = $("<select></select>");
    this.selectEl = $selectEl;

    for (key in this.checkers) {
      var $option = $("<option>" + this.checkers[key] + "</option>");
      $option.attr("value", key);
      $option.appendTo($selectEl);
    }

    $valueEl = $("<input type='text' size='15' >");

    this.initFieldEl($el, $selectEl, field);
    $valueEl.appendTo($el.find(".control-wrapper"));
    $valueEl.addClass("numeric-input");
    this.valueEl = $valueEl;

    if (field.unitsLabel) {
      $("<span> " + field.unitsLabel + "</span>").appendTo(
        $el.find(".control-wrapper")
      );
    }

    $valueEl.on("input", function () {
      widget.changed();
    });
    $selectEl.on("change", function () {
      if ($(this).val() == "frmto") {
        self.initFromToElements(self.valueEl.val());
      } else {
        self.hideFromToElements();
      }
      widget.changed();
    });

    this.setValue(value);
  };

  this.getValue = function () {
    return {
      checker: this.selectEl.val(),
      numval: this.valueEl.val(),
    };
  };

  this.setValue = function (value) {
    if (value) {
      if (value.checker) {
        this.selectEl.val(value.checker);
      }
      if (value.numval) {
        this.valueEl.val(value.numval);
      }
      if (value.checker == "frmto") {
        this.initFromToElements(value.numval);
      } else {
        this.hideFromToElements();
      }
    }
  };

  this.initFromToElements = function (value) {
    var numbers = value.split(":");

    self.valueEl.hide();

    $value1El = $("<input type='text' size='7'>");
    $value1El.appendTo(self.valueEl.parent());
    $value1El.addClass("numeric-input");
    this.value1El = $value1El;
    this.value1El.val(numbers[0]);

    this.dashEl = $("<span>—</span>").appendTo(self.valueEl.parent());

    $value2El = $("<input type='text' size='7'>");
    $value2El.appendTo(self.valueEl.parent());
    $value2El.addClass("numeric-input");
    this.value2El = $value2El;
    this.value2El.val(numbers[1]);

    var inLabel = "включительно";
    if (typeof Yii != "undefined") {
      inLabel = Yii.t("common", inLabel);
    }

    this.fromToComment = $(
      "<div style='font-size:smaller;margin-left:1em;'>" + inLabel + "</div>"
    ).appendTo(self.valueEl.parent());

    this.value1El.on("input", function () {
      self.valueEl.val(self.value1El.val() + ":" + self.value2El.val());
      self.valueEl.trigger("input");
    });
    this.value2El.on("input", function () {
      self.valueEl.val(self.value1El.val() + ":" + self.value2El.val());
      self.valueEl.trigger("input");
    });
  };

  this.hideFromToElements = function () {
    var value = this.valueEl.val();
    var numbers = value.split(":");
    this.valueEl.val(numbers[0]);
    this.valueEl.show();
    if (this.value1El) {
      this.value1El.remove();
      this.value1El = null;
    }
    if (this.value2El) {
      this.value2El.remove();
      this.value2El = null;
    }
    if (this.dashEl) {
      this.dashEl.remove();
      this.dashEl = null;
    }
    if (this.fromToComment) {
      this.fromToComment.remove();
      this.fromToComment = null;
    }
  };
}

extend(NumericFieldWidget, FieldWidget);
NumericFieldWidget.prototype = new FieldWidget();

window.logicFieldWidgets["numeric"] = NumericFieldWidget;
