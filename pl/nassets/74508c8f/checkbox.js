function CheckboxFieldWidget() {
  this.checkboxEl = null;

  this.initEl = function ($el, field, value) {
    var widget = this;

    var id = Math.round(Math.random() * 10000);
    var name = "r" + id;

    this.yesEl = $("<input type='radio'>");
    this.yesEl.attr("name", name);
    this.yesEl.attr("id", name);
    this.yesEl.on("change", function () {
      widget.changed();
    });
    this.yesEl.prop("checked", true);

    var labelYes = "Да";
    var labelNo = "Нет";

    if (typeof Yii != "undefined") {
      labelYes = Yii.t("common", "Yes");
      labelNo = Yii.t("common", "No");
    }

    $yesWrapperEl = $("<label>" + labelYes + "</label>");
    this.yesEl.prependTo($yesWrapperEl);

    this.noEl = $("<input type='radio'>");
    this.noEl.attr("name", name);
    this.noEl.attr("id", name);
    this.noEl.on("change", function () {
      widget.changed();
    });

    $noWrapperEl = $(
      "<label style='margin-left: 20px'>" + labelNo + "</label>"
    );
    this.noEl.prependTo($noWrapperEl);

    $controlEl = $("<div></div>");

    $yesWrapperEl.appendTo($controlEl);
    $noWrapperEl.appendTo($controlEl);

    this.initFieldEl($el, $controlEl, field);
    this.setValue(value);
  };

  this.getValue = function () {
    return { checked: this.yesEl.prop("checked") ? 1 : 0 };
  };

  this.setValue = function (value) {
    if (value) {
      if (value.checked == 1) {
        this.yesEl.prop("checked", true);
        this.noEl.prop("checked", false);
      } else {
        this.yesEl.prop("checked", false);
        this.noEl.prop("checked", true);
      }
    }
  };
}

extend(CheckboxFieldWidget, FieldWidget);
CheckboxFieldWidget.prototype = new FieldWidget();

window.logicFieldWidgets["checkbox"] = CheckboxFieldWidget;
