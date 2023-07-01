function FieldWidget() {
  this.type = "fieldrule";

  this.init = function ($el, field, value) {
    $el.addClass("field-widget");
    $el.data("widget", this);

    this.$el = $el;
    this.field = field;

    this.initEl($el, field, value);
  };

  this.initFieldEl = function ($el, $controlEl, field) {
    this.controlEl = $controlEl;

    $controlWrapperEl = $("<div class='control-wrapper'></div>'");
    $controlEl.appendTo($controlWrapperEl);

    $controlWrapperEl.appendTo($el);
  };

  this.initLabeledFieldEl = function ($el, $controlEl, field) {
    $labelEl = $("<label></label>");
    $labelEl.html(field.label);

    $labelEl.appendTo($el);

    this.initFieldEl($el, $controlEl, field);
  };

  this.getValue = function () {
    return null;
  };

  this.changed = function () {};
}
window.logicFieldWidgets = [];

jQuery.widget("gc.fieldWidget", {
  options: {
    type: "string",
    value: null,
    field: null,
  },
  _create: function () {
    var type = this.options.type;
    var self = this;
    if (!window.logicFieldWidgets[type]) {
      alert("Unknown logic field widget type: " + type);
    }
    var widget = new window.logicFieldWidgets[type]();
    widget.initEl(this.element, this.options.field, this.options.value);

    widget.changed = function () {
      if (self.options.changed) {
        self.options.changed(widget.getValue());
      }
    };
  },
});
