function StringFieldWidget() {
  this.stringEl = null;

  this.initEl = function ($el, field, value) {
    var widget = this;
    var id = Math.round(Math.random() * 10000);
    var name = "r" + id;

    this.stringEl = $("<input type='type'>");
    this.stringEl.attr("name", name);
    this.stringEl.attr("id", name);
    this.stringEl.on("change", function () {
      widget.changed();
    });
    $controlEl = $("<div></div>");
    this.stringEl.appendTo($controlEl);
    if (field.hint) {
      $controlEl.append(
        '<div class="input-hint" style="font-size: 12px; color: #808080;">' +
          field.hint +
          "</div>"
      );
    }

    this.initFieldEl($el, $controlEl, field);
    this.setValue(value);
  };

  this.getValue = function () {
    return this.stringEl.val();
  };

  this.setValue = function (value) {
    this.stringEl.val(value);
  };
}

extend(StringFieldWidget, FieldWidget);
StringFieldWidget.prototype = new FieldWidget();
window.logicFieldWidgets["string"] = StringFieldWidget;
