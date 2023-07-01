window.gcCreateFieldWidget = function (a, b, c) {
  var d = {
    select: "selectField",
    multi_select: "multiSelectField",
    string: "stringField",
    phone: "phoneField",
    phone_confirm: "phoneConfirmField",
    password: "passwordField",
    text: "textField",
    date: "dateField",
    checkbox: "checkboxField",
    file: "fileField",
    numeric: "stringField",
  };
  d[b] || (b = "string");
  return a[d[b]](c);
};
jQuery.widget("gc.abstractField", {
  options: { types: [], field: null, hideShowInTableInput: !1 },
  field: null,
  _create: function () {
    if (!this.options.field) return !1;
    "false" == this.options.field.required &&
      (this.options.field.required = !1);
    this.field = this.options.field;
    this.element.addClass("custom-field");
    this.element.addClass("type-" + this.field.type);
    this.element.data("fieldWidget", this);
    this.labelEl = $(
      "<label class='field-label'><span class='label-value'></span></label>"
    );
    this.field.id && this.labelEl.attr("for", "field-input-" + this.field.id);
    this.labelEl.appendTo(this.element);
    this.requiredEl = $('<span class="required-sign">*</span>');
    this.requiredEl.appendTo(this.labelEl);
    this.inputBlock = $('<div class="field-input-block"></div>');
    this.inputBlock.appendTo(this.element);
    this.descriptionBlock = $('<div class="field-description-block"></div>');
    this.descriptionBlock.appendTo(this.element);
    if (window.params_52)
      switch (
        ((this.htmlBlockBlock = $(
          '<div class="field-html_block-block"></div>'
        )),
        this.field.html_block_position)
      ) {
        case "top":
          this.htmlBlockBlock.insertBefore(this.element);
          break;
        case "bottom":
          this.htmlBlockBlock.insertAfter(this.inputBlock);
          break;
        case "left":
          this.htmlBlockBlock.addClass("html-block-left");
          this.inputBlock.addClass("html-block-left");
          this.htmlBlockBlock.insertBefore(this.inputBlock);
          break;
        case "right":
          this.htmlBlockBlock.addClass("html-block-right"),
            this.inputBlock.addClass("html-block-right"),
            this.htmlBlockBlock.insertAfter(this.inputBlock);
      }
    this.build();
    this.rebuild();
  },
  rebuild: function () {
    this.labelEl.find(".label-value").html(this.field.label);
    this.field.required
      ? this.element.addClass("required")
      : this.element.removeClass("required");
    "" == this.field.label ? this.labelEl.hide() : this.labelEl.show();
    this.field.description && 0 < this.field.description.length
      ? (this.descriptionBlock.html(this.field.description),
        this.descriptionBlock.show())
      : (this.descriptionBlock.html(""), this.descriptionBlock.hide());
    window.params_52 &&
      (this.field.html_block && 0 < this.field.html_block.length
        ? (this.htmlBlockBlock.html(this.field.html_block),
          this.htmlBlockBlock.show())
        : (this.htmlBlockBlock.html(""), this.htmlBlockBlock.hide()));
  },
  initEditor: function (a) {
    this.settingsEl = $('<div class="field-settings"></div>');
    this.settingsEl.hide();
    this.settingsEl.appendTo(a);
    this.paramsEl = $('<div class="field-params"></div>');
    this.paramsEl.appendTo(this.settingsEl);
    this.hideInput = this.makeInputSelectHide(
      "hide",
      Yii.t(
        "common",
        "\u0412\u0438\u0434\u0438\u043c\u043e\u0441\u0442\u044c \u043f\u043e\u043b\u044f"
      )
    );
    this.hideInput.val(this.field.hide);
    $labelInputEl = $(
      "<label class=''>" +
        Yii.t("common", "Title") +
        "</label><input class='label-input' type='text' size='40'>"
    );
    $labelInputEl.val(this.field.label);
    $labelInputEl.appendTo(this.paramsEl);
    this._on($labelInputEl, { input: this.fieldChanged });
    this.options.requiredEnabled &&
      (($requiredInputWrapper = $(
        "<label style='display: block'>" +
          Yii.t("common", "Required") +
          "</label>"
      )),
      $requiredInputWrapper.appendTo(this.paramsEl),
      ($requiredInputEl = $(
        "<input class='required-input' type='checkbox' value='1'>"
      )),
      $requiredInputEl.prependTo($requiredInputWrapper),
      $requiredInputEl.prop("checked", this.field.required),
      this._on($requiredInputEl, { change: this.fieldChanged }));
    this.options.forSurvey &&
      (($hideFilledInputWrapper = $(
        "<label style='display: block'> " +
          Yii.t("common", "Hide if filled") +
          "</label>"
      )),
      $hideFilledInputWrapper.appendTo(this.paramsEl),
      ($hideFilledInputEl = $(
        "<input class='hide_filled-input' type='checkbox' value='1'>"
      )),
      $hideFilledInputEl.prependTo($hideFilledInputWrapper),
      "false" == this.field.hide_filled && (this.field.hide_filled = !1),
      $hideFilledInputEl.prop("checked", this.field.hide_filled),
      this._on($hideFilledInputEl, { change: this.fieldChanged }));
    this.descriptionInput = this.makeInputTextarea(
      "description",
      Yii.t("common", "Description")
    );
    this.descriptionInput.val(this.field.description);
    window.params_52 &&
      ((this.htmlBlockInput = this.makeInputTextarea(
        "html_block",
        window.tt("common", "Custom HTML")
      )),
      this.htmlBlockInput.val(this.field.html_block),
      (a = [
        ["top", window.tt("common", "top")],
        ["right", window.tt("common", "right")],
        ["bottom", window.tt("common", "bottom")],
        ["left", window.tt("common", "left")],
      ]),
      (this.htmlBlockPosInput = this.makeSelector(
        "html_block_position",
        window.tt("common", "Custom HTML position"),
        a
      )),
      this.htmlBlockPosInput.val(this.field.html_block_position));
    this.tableTitleInput = this.makeInputField(
      "table_title",
      Yii.t("common", "Name at output")
    );
    this.isImportantInput = this.makeInputCheckbox(
      "is_important",
      Yii.t("common", "Is the key")
    );
    this.descriptionInput.val(this.field.description);
    this.options.forSurvey &&
      !this.options.hideShowInTableInput &&
      ((this.showInTableInput = this.makeInputCheckbox(
        "show_in_table",
        Yii.t("common", "Show in the table of answers (for administrator)")
      )),
      this._on(this.showInTableInput, { change: this.fieldChanged }),
      this.showInTableInput.val(this.field.description),
      this.showInTableInput.prop("checked", this.field.show_in_table));
  },
  getField: function () {
    var a = this.field;
    a.label = this.paramsEl.find(".label-input").val();
    "[object Array]" === Object.prototype.toString.call(a.settings) &&
      (a.settings = {});
    this.options.requiredEnabled &&
      (a.required = this.paramsEl.find(".required-input").is(":checked"));
    this.options.forSurvey &&
      (a.hide_filled = this.paramsEl.find(".hide_filled-input").is(":checked"));
    this.tableTitleInput &&
      (a.settings.table_title = this.tableTitleInput.val());
    this.isImportantInput &&
      (a.settings.is_important = this.isImportantInput.prop("checked"));
    a.description = this.paramsEl.find(".description-input").val();
    a.show_in_table = this.paramsEl.find(".show_in_table-input").is(":checked");
    a.hide = this.paramsEl.find(".hide-input").val();
    window.params_52 &&
      ((a.html_block = this.paramsEl.find(".html_block-input").val()),
      (a.html_block_position = this.paramsEl
        .find(".html_block_position-input")
        .val()));
    return a;
  },
  fieldChanged: function () {
    this.field = this.getField();
    this.rebuild();
    0 < this.element.parents(".custom-form-editor").length &&
      this.element.parents(".custom-form-editor").customFormEditor("changed");
    this._onChange();
  },
  _onChange: function () {},
  showEditor: function () {
    this.settingsEl.show();
  },
  hideEditor: function () {
    this.settingsEl.hide();
  },
  makeInputField: function (a, b, c) {
    c || (c = 40);
    $settingEl = $("<div class='field-" + a + "'/>");
    $el = $("<input class='" + a + "-input' type='text' size='" + c + "'>");
    $el.val(this.field.settings[a]);
    this._on($el, { input: this.fieldChanged });
    $("<label>" + b + "</label>").appendTo($settingEl);
    $el.appendTo($settingEl);
    $settingEl.appendTo(this.paramsEl);
    return $el;
  },
  makeInputTextarea: function (a, b) {
    $settingEl = $("<div class='field-" + a + "'/>");
    $el = $("<textarea class='standard " + a + "-input' type='text'/>");
    $el.val(this.field.settings[a]);
    this._on($el, { input: this.fieldChanged });
    $("<label>" + b + "</label>").appendTo($settingEl);
    $el.appendTo($settingEl);
    $settingEl.appendTo(this.paramsEl);
    return $el;
  },
  makeSelector: function (a, b, c) {
    $settingEl = $("<label class='field-" + a + "'>" + b + " </label>");
    $el = $('<select class="' + a + '-input" />');
    for (var d in c)
      (b = c[d]),
        $("<option />")
          .val(b[0])
          .prop("selected", this.field[a] == b[0])
          .text(b[1])
          .appendTo($el);
    $el.appendTo($settingEl);
    this._on($el, { change: this.fieldChanged });
    $settingEl.appendTo(this.paramsEl);
    return $el;
  },
  makeInputCheckbox: function (a, b) {
    $settingEl = $("<label class='field-" + a + "'> " + b + "</label>");
    $el = $("<input class='standard " + a + "-input' type='checkbox'/>");
    $el.prop("checked", this.field.settings[a]);
    this._on($el, { change: this.fieldChanged });
    $el.prependTo($settingEl);
    $settingEl.appendTo(this.paramsEl);
    return $el;
  },
  makeInputSelectHide: function (a, b) {
    $settingEl = $(
      "<div style='margin-bottom: 20px' class='field-" + a + "'/>"
    );
    $el = $(
      "<select id='" +
        a +
        "' class='form-control standard " +
        a +
        "-input' type='text'/>"
    );
    $el.append(
      $("<option>", {
        value: 0,
        text: Yii.t(
          "common",
          "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c \u0432\u0441\u0435\u0433\u0434\u0430"
        ),
      })
    );
    $el.append(
      $("<option>", {
        value: 1,
        text: Yii.t(
          "common",
          "\u041f\u043e\u043a\u0430\u0437\u044b\u0432\u0430\u0442\u044c, \u0435\u0441\u043b\u0438 \u0437\u0430\u043f\u043e\u043b\u043d\u0435\u043d\u043e"
        ),
      })
    );
    $el.append(
      $("<option>", {
        value: 2,
        text: Yii.t(
          "common",
          "\u0421\u043a\u0440\u044b\u0442\u044c \u043f\u043e\u043b\u0435"
        ),
      })
    );
    this._on($el, { input: this.fieldChanged });
    $("<label>" + b + "</label>").appendTo($settingEl);
    $el.appendTo($settingEl);
    $settingEl.appendTo(this.paramsEl);
    return $el;
  },
  getValue: function () {
    return null;
  },
  setValue: function (a) {
    this.input.val(a);
  },
  afterInit: function () {},
  setInputClass: function (a) {},
});
jQuery.widget("gc.checkboxField", $.gc.abstractField, {
  build: function () {
    $input = $('<input type="checkbox"/>');
    this.field.id && $input.attr("id", "field-input-" + this.field.id);
    this.labelEl.find(".required-sign").detach();
    $input.prependTo(this.labelEl);
    this.input = $input;
  },
  initEditor: function (a) {
    $.gc.abstractField.prototype.initEditor.call(this, a);
  },
  getValue: function () {
    return this.input.prop("checked") ? 1 : 0;
  },
  setValue: function (a) {
    1 == a ? this.input.prop("checked", !0) : this.input.prop("checked", !1);
  },
});
jQuery.widget("gc.customForm", {
  options: { form: [], showFields: null, fieldOptions: {}, checkHidden: !1 },
  selectedFieldEl: null,
  fieldElems: [],
  _create: function () {
    this.element.addClass("without-help-elems");
    var a = [];
    for (key in this.options.form.fields) {
      var b = this.options.form.fields[key];
      if (!this.options.fieldsSettings || this.options.fieldsSettings[b.id])
        if (
          !this.options.fieldsSettings ||
          !this.options.fieldsSettings[b.id] ||
          "" != this.options.fieldsSettings[b.id].show
        ) {
          this.options.fieldsSettings &&
            this.options.fieldsSettings[b.id] &&
            "required" == this.options.fieldsSettings[b.id].show &&
            (b.required = !0);
          var c = this.addField(b);
          this.fieldElems[b.id] = c.fieldEl;
          "select" === b.type && a.push("#field-input-" + b.id);
        }
    }
    0 < a.length &&
      setTimeout(function () {
        $(a.join(",")).select2();
      }, 10);
    this.options.valueSet && this.setValueSet(this.options.valueSet);
  },
  setValueSet: function (a) {
    for (fieldId in a) {
      var b = a[fieldId];
      if (
        this.fieldElems[fieldId] &&
        this.fieldElems[fieldId].data("widgetClass")
      ) {
        var c = this.fieldElems[fieldId].data("widgetClass");
        this.fieldElems[fieldId][c]("setValue", b);
      }
    }
    this.changed();
  },
  addField: function (a) {
    var b = this;
    $fieldWrapperEl = $('<div class="field-wrapper"/>');
    this.options.checkHidden &&
      ("2" === a.hide ||
        ("1" === a.hide &&
          !this.options.valueSet[a.id] &&
          0 !== this.options.valueSet[a.id])) &&
      ($fieldWrapperEl.addClass("hidden custom-field-hidden"),
      $(".showAllCustomFields").removeClass("hidden"));
    $fieldEl = $('<div class="field"/>');
    $fieldEl.appendTo($fieldWrapperEl);
    a.isEmpty =
      this.options.valueSet &&
      "undefined" === typeof this.options.valueSet[a.id];
    var c = this.element.find(".fields");
    0 == c.length &&
      ((c = $('<div class="fields"></div>')), c.appendTo(this.element));
    $fieldWrapperEl.appendTo(c);
    window.initCustomFormFieldEl(a, $fieldEl, this.options.fieldOptions);
    this.changed();
    ($widgetEl = $fieldEl.data("gc-" + $fieldEl.data("widgetClass"))) &&
      $widgetEl.afterInit();
    $fieldEl.on("change", function () {
      $(this).data("gc-" + $(this).data("widgetClass")).field.isEmpty = !1;
      b.changed();
    });
    $fieldWrapperEl.fieldEl = $fieldEl;
    return $fieldWrapperEl;
  },
  getFields: function () {
    var a = [];
    $(this.element)
      .find(".custom-field")
      .each(function (b, c) {
        var d = $(c);
        a.push(d.data("gc-" + d.data("widgetClass")).getField());
      });
    return a;
  },
  changed: function () {
    this.options.valueEl &&
      this.options.valueEl.val(JSON.stringify(this.getFormValues()));
  },
  selectField: function () {},
  getFormValues: function () {
    var a = {};
    $(this.element)
      .find(".custom-field")
      .each(function (b, c) {
        var d = $(c),
          e = d.data("gc-" + d.data("widgetClass"));
        e
          ? ((d = e.field),
            (d.isEmpty && "checkbox" === d.type) || (a[d.id] = e.getValue()))
          : ((e = d
              .find(".field-label")
              .attr("for")
              .replace("field-input-", "")),
            (c = $('input[name="field-value-' + e + '"]')),
            (d = null),
            (d =
              "radio" == c.attr("type")
                ? $('input[name="field-value-' + e + '"]:checked').val()
                : $('input[name="field-value-' + e + '"]').val()),
            (a[e] = d));
      });
    return a;
  },
});
"undefined" == typeof Yii &&
  (window.Yii = {
    t: function (a, b) {
      return b;
    },
  });
window.initCustomFormFieldEl = function (a, b, c) {
  c || (c = {});
  c.field = a;
  c.addClass && b.addClass(c.addClass);
  a = a.type;
  "string" == a && (b.stringField(c), b.data("widgetClass", "stringField"));
  "text" == a && (b.textField(c), b.data("widgetClass", "textField"));
  "checkbox" == a &&
    (b.checkboxField(c), b.data("widgetClass", "checkboxField"));
  "select" == a && (b.selectField(c), b.data("widgetClass", "selectField"));
  "multi_select" == a &&
    (b.multiSelectField(c), b.data("widgetClass", "multiSelectField"));
  "date" == a && (b.dateField(c), b.data("widgetClass", "dateField"));
  "file" == a &&
    ((c.showVideoPreview = !1),
    b.fileField(c),
    b.data("widgetClass", "fileField"));
  "numeric" == a && (b.numericField(c), b.data("widgetClass", "numericField"));
};
jQuery.widget("gc.customFormEditor", {
  options: { fields: [], types: [], valueEl: null },
  selectedFieldEl: null,
  editorSettingsEl: null,
  editorEl: null,
  _create: function () {
    var a = this;
    this.createEditorEl();
    this.element.addClass("without-help-elems");
    $addTypesList = this.element.find(".add-types-list");
    for (type in this.options.types)
      ($addFieldLink = $("<a>" + this.options.types[type].label + "</a>")),
        ($addFieldEl = $("<li></li>")),
        $addFieldLink.appendTo($addFieldEl),
        $addFieldEl.appendTo($addTypesList),
        $addFieldLink.data("type", type),
        $addFieldLink.click(function () {
          var b = $(this).data("type"),
            b = a.createField(b);
          a.addField(b).click();
        });
    for (key in this.options.fields) this.addField(this.options.fields[key]);
    this.element.find(".fields").sortable({
      update: function () {
        a.changed();
      },
    });
  },
  createEditorEl: function () {
    this.editorSettingsEl = $("<div class='editor-settings'></div>");
    this.editorEl = this.element.find(".field-settings-editor");
    this.editorSettingsEl.appendTo(this.editorEl);
    $btnDelete = $(
      "<a href='javascript:void(0)' class='btn btn-default' >" +
        Yii.t("common", "Delete field") +
        "</a>"
    );
    $btnDelete.appendTo(this.editorEl);
    this._on($btnDelete, {
      click: function () {
        this.selectedFieldEl.detach();
        this.editorEl.hide();
        this.changed();
        return !1;
      },
    });
    this.editorEl.hide();
  },
  createField: function (a) {
    return this.options.types[a];
  },
  addField: function (a) {
    var b = this;
    $fieldWrapperEl = $('<div class="field-wrapper"/>');
    $fieldWrapperEl.click(function () {
      b.selectField($(this));
    });
    $fieldEl = $('<div class="field"/>');
    $fieldEl.appendTo($fieldWrapperEl);
    var c = this.element.find(".fields");
    $fieldWrapperEl.appendTo(c);
    window.initCustomFormFieldEl(a, $fieldEl, this.options.fieldOptions);
    if (($widgetEl = $fieldEl.data("gc-" + $fieldEl.data("widgetClass"))))
      $widgetEl.initEditor(this.editorSettingsEl), $widgetEl.afterInit();
    this.changed();
    return $fieldWrapperEl;
  },
  selectField: function (a) {
    this.selectedFieldEl &&
      (($fieldEl = this.selectedFieldEl.find(".field")),
      $fieldEl.data("gc-" + $fieldEl.data("widgetClass")).hideEditor(),
      this.selectedFieldEl.removeClass("selected"));
    a.addClass("selected");
    this.selectedFieldEl = a;
    $fieldEl = this.selectedFieldEl.find(".field");
    $fieldEl.data("gc-" + $fieldEl.data("widgetClass")).showEditor();
    this.editorEl.show();
  },
  getFields: function () {
    var a = [];
    $(this.element)
      .find(".custom-field")
      .each(function (b, c) {
        var d = $(c);
        a.push(d.data("gc-" + d.data("widgetClass")).getField());
      });
    return a;
  },
  changed: function () {
    if (this.options.valueEl) {
      var a = this.getFields();
      this.options.valueEl.val(JSON.stringify({ fields: a }));
    }
  },
});
jQuery.widget("gc.stringField", $.gc.abstractField, {
  build: function () {
    this.input = $("<input/>");
    this.field.id && this.input.attr("id", "field-input-" + this.field.id);
    this.input.appendTo(this.inputBlock);
  },
  initEditor: function (a) {
    $.gc.abstractField.prototype.initEditor.call(this, a);
    this.placeholderInput = this.makeInputField(
      "placeholder",
      Yii.t("common", "Hint")
    );
    this.options.forSurvey &&
      (this.sizeInput = this.makeInputField(
        "size",
        Yii.t("common", "Size of the field"),
        3
      ));
  },
  getField: function () {
    var a = $.gc.abstractField.prototype.getField.call(this);
    (a.settings &&
      "[object Array]" !== Object.prototype.toString.call(a.settings)) ||
      (a.settings = {});
    a.settings.placeholder = this.placeholderInput.val();
    this.sizeInput && (a.settings.size = this.sizeInput.val());
    return a;
  },
  rebuild: function () {
    $.gc.abstractField.prototype.rebuild.call(this);
    this.input.attr("type", this.getInputType());
    this.input.attr("placeholder", this.field.settings.placeholder);
    this.input.addClass("form-control");
  },
  getInputType: function () {
    return "text";
  },
  getValue: function () {
    return this.input.val();
  },
  setInputClass: function (a) {
    this.input.addClass(a);
  },
});
jQuery.widget("gc.dateField", $.gc.stringField, {
  build: function () {
    var a = $('<input type="text" autocomplete="off" />');
    this.field.id && a.attr("id", "field-input-" + this.field.id);
    a.appendTo(this.inputBlock);
    a.datepicker({
      value: "",
      autoclose: !0,
      lang: "ru",
      weekStart: 1,
      format: "dd.mm.yyyy",
      closeOnDateSelect: !0,
    });
    this.input = a;
  },
  initEditor: function (a) {
    $.gc.stringField.prototype.initEditor.call(this, a);
  },
  getValue: function () {
    return this.input.val();
  },
});
window.fileWidgetQueueNum = 15;
jQuery.widget("gc.fileWidget", {
  uploader: null,
  showButtonOnStart: !1,
  options: {
    showPreview: !0,
    onComplete: null,
    fileSizeLimit: "6GB",
    fileSizeLimitWarning:
      "undefined" != typeof Yii
        ? Yii.t("common", "Max size {n} GB", 6)
        : "Max size 6 GB",
  },
  _create: function () {
    var a = this,
      b = $("<div>");
    b.insertAfter(this.element);
    this.stateEl = $("<span style='float: left;'>");
    this.stateEl.appendTo(b);
    this.previewEl = $("<div>");
    this.previewEl.appendTo(b);
    this.element.val();
    var c = "\u0418\u0437\u043c\u0435\u043d\u0438\u0442\u044c",
      d = "\u0423\u0434\u0430\u043b\u0438\u0442\u044c";
    "undefined" != typeof Yii &&
      ((c = Yii.t("common", "Change")), (d = Yii.t("common", "Delete")));
    var e = $("<div>");
    $uploader = $(
      "<a href='javascript:void(0)' class='file-change-link dotted-link'>" +
        c +
        "</a>"
    );
    $uploader.css("marginRight", "5px");
    $uploader.appendTo(e);
    this.uploader = $uploader;
    this.deleteLink = $deleteLink = $(
      "<a class='dotted-link' style='' href='javascript:void(0)'>" + d + "</a>"
    );
    $deleteLink.click(function () {
      a.element.val("");
      a.element.change();
      a.showPreview();
    });
    $deleteLink.appendTo(e);
    this.options.hideDeleteLink && $deleteLink.hide();
    e.appendTo(b);
    this.showPreview();
    $uploader.click(function () {
      if (!$(this).data("uploadifive-inited")) {
        window.fileWidgetQueueNum++;
        var b = "queue" + window.fileWidgetQueueNum;
        $el = $("<div id='" + b + "'></div>");
        $el.insertBefore($(this));
        var c = "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c";
        "undefined" != typeof Yii && (c = Yii.t("common", "Upload"));
        $(this).uploadifive({
          auto: !0,
          buttonText: c,
          width: 120,
          id: window.queueNum,
          queueID: b,
          dnd: !1,
          removeCompleted: a.options.removeUploaded,
          multi: !1,
          fileSizeLimit: a.options.fileSizeLimit,
          uploadScript:
            "/fileservice/widget/upload?deprecated=19&secure=" +
            window.isEnabledSecureUpload +
            "&host=" +
            window.fileserviceUploadHost,
          formData: { fullAnswer: !0 },
          onUploadError: function (a, b, c) {
            alert("ERROR");
          },
          onUploadComplete: function (b, c) {
            c = JSON.parse(c);
            a.element.val(c.hash);
            a.showPreview();
            a.element.change();
          },
          onUpload: function (a, b) {
            $.ajax({
              url: "/fileservice/widget/create-secret-link",
              method: "GET",
              data: {
                host: window.fileserviceUploadHost,
                uri: "/fileservice/widget/secure-direct-upload",
                expires: 600,
              },
              success: function (a, c, d) {
                a.link && (b.uploadScript = a.link);
              },
              error: function (a, b, c) {
                sendCreateLinkError(a, b, c);
              },
              async: !1,
            });
          },
        });
        a.options.fileSizeLimit &&
          a.options.fileSizeLimitWarning &&
          $(
            "<p class='text-muted'>" + a.options.fileSizeLimitWarning + "</p>"
          ).appendTo(e);
        b = jQuery(a.element).data("accept");
        b = void 0 === b ? "" : b;
        a.options.accept && (b = a.options.accept);
        b && jQuery(a.element).next().find('[type="file"]').attr("accept", b);
        $(this).data("uploadifive-inited", !0);
      }
    });
    this.options.startWithUploader &&
      !this.element.val() &&
      setTimeout(function () {
        $uploader.click();
      }, 100);
  },
  showUploader: function () {
    this.uploader.click();
  },
  setValue: function (a) {
    this.element.val(a);
    this.showPreview(!0);
  },
  showPreview: function (a) {
    if (this.options.showPreview) {
      var b = this.element.val();
      b && "" != b
        ? ((a = null),
          isImage(b)
            ? ((a = this.element.data("thumbnail-url")
                ? this.element.data("thumbnail-url")
                : this.options.thumbnailWidth || this.options.thumbnailHeight
                ? getThumbnailUrl(
                    b,
                    this.options.thumbnailWidth,
                    this.options.thumbnailHeight
                  )
                : getThumbnailUrl(b, 200, 200)),
              this.previewEl.html("<img src='" + a + "'>"))
            : isVideo(b) && !1 !== this.options.showVideoPreview
            ? (getVideoThumbnailUrl(b, 200, 200),
              this.previewEl.html(
                "<img src='/public/img/dummy.png' width='250'>"
              ))
            : (b &&
                (b = b
                  .replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;")),
              this.previewEl.html(
                "<a href='" + getDownloadUrl(b) + "'>" + b + "</a>"
              )),
          this.previewEl.show(),
          this.deleteLink.show())
        : (this.previewEl.hide(),
          this.deleteLink.hide(),
          a && this.uploader.click());
    }
  },
});
jQuery.widget("gc.fileField", $.gc.abstractField, {
  build: function () {
    $input = $('<input type="hidden"/>');
    this.field.id && $input.attr("id", "field-input-" + this.field.id);
    $input.appendTo(this.labelEl);
    $input.fileWidget({
      showButtonOnStart: !0,
      thumbnailWidth: this.field.settings.width,
      thumbnailHeight: this.field.settings.height,
      showVideoPreview: this.options.showVideoPreview,
    });
    this.input = $input;
  },
  afterInit: function () {
    this.input.fileWidget("showUploader");
  },
  initEditor: function (a) {
    $.gc.abstractField.prototype.initEditor.call(this, a);
    this.widthInput = this.makeInputField(
      "width",
      Yii.t("common", "Width thumbnail"),
      3
    );
    this.heightInput = this.makeInputField(
      "height",
      Yii.t("common", "Height thumbnail"),
      3
    );
  },
  getField: function () {
    var a = $.gc.abstractField.prototype.getField.call(this);
    a.settings.width = this.widthInput.val();
    a.settings.height = this.heightInput.val();
    return a;
  },
  getValue: function () {
    return this.input.val();
  },
  valueChanged: function (a) {
    this.input.fileWidget("showPreview", a);
  },
  setValue: function (a) {
    this.input.fileWidget("setValue", a);
  },
});
jQuery.widget("gc.passwordField", $.gc.stringField, {
  getInputType: function () {
    return "password";
  },
});
jQuery.widget("gc.phoneField", $.gc.stringField, {});
jQuery.widget("gc.phoneConfirmField", $.gc.abstractField, {
  phone: null,
  build: function () {
    var a =
      !this.field.hasOwnProperty("captchaDisabled") ||
      !this.field.captchaDisabled;
    a &&
      $(
        '<script type="text/javascript" src="https://www.google.com/recaptcha/api.js">\x3c/script>'
      ).appendTo($("body"));
    var b = "\u0412\u0430\u0448 \u0442\u0435\u043b\u0435\u0444\u043e\u043d",
      c =
        "\u041a\u043e\u0434 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f \u0431\u044b\u043b \u043e\u0442\u043f\u0440\u0430\u0432\u043b\u0435\u043d \u043d\u0430 \u0432\u0430\u0448 \u043d\u043e\u043c\u0435\u0440",
      d = "\u041f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u043a\u043e\u0434",
      e =
        "\u0421\u043c\u0435\u043d\u0438\u0442\u044c \u0442\u0435\u043b\u0435\u0444\u043e\u043d",
      g =
        "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043a\u043e\u0434 \u043f\u043e\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043d\u0438\u044f";
    "undefined" != typeof Yii &&
      ((b = Yii.t("cms", b)),
      (c = Yii.t("cms", c)),
      (d = Yii.t("cms", d)),
      (e = Yii.t("cms", e)),
      (g = Yii.t("cms", g)));
    this.currentStateEl = $(
      "<div>" + b + ': <b class="phone-value"></b> </div>'
    );
    this.input = $(
      '<input type="text" name="' +
        this.options.field.fieldName +
        '" size=4 placeholder="' +
        g +
        '"/>'
    );
    this.codeSentEl = $("<div>" + c + "</div>");
    this.input.hide();
    this.codeSentEl.hide();
    this.buttonsEl = $(
      '<div style="padding-top: 10px; padding-bottom: 10px;"/>'
    );
    a &&
      ((this.captcha = $(
        '<div class="g-recaptcha" data-sitekey="6LedcXoUAAAAALSIjF8UgtAgz0J6JwkbFW2mZiTI"></div>'
      )),
      this.captcha.appendTo(this.buttonsEl));
    this.sendSmsLink = $(
      '<a href="javascript:void(0)" class="btn btn-sm btn-primary" style="margin-right: 10px;">' +
        d +
        "</a>"
    );
    this.changePhoneLink = $(
      '<a class="btn btn-sm btn-link" style="padding-left: 0">' + e + "</a>"
    );
    this.sendSmsLink.appendTo(this.buttonsEl);
    this.changePhoneLink.appendTo(this.buttonsEl);
    this.currentStateEl.appendTo(this.inputBlock);
    this.buttonsEl.appendTo(this.inputBlock);
    this.codeSentEl.appendTo(this.inputBlock);
    this.input.appendTo(this.inputBlock);
    var f = this;
    this.sendSmsLink.click(function () {
      var b = { phone: f.phone };
      a && (b.recaptcha = grecaptcha.getResponse());
      ajaxCall(
        "/user/public/user/sendConfirmationCode",
        b,
        { btn: $(this) },
        function (a) {
          f.valueChanged(1);
          f.sendSmsLink.hide();
          a.text && $.toast(a.text, { type: "info" });
        }
      );
      return !1;
    });
    this.changePhoneLink.click(function () {
      $(f.element)
        .parents(".xdget-common-user-form")
        .find(".xdget-form-field-phone")
        .show();
      f.sendSmsLink.show();
      f.element.hide();
      return !1;
    });
  },
  getValue: function () {
    return "" + this.input.val();
  },
  valueChanged: function (a, b) {
    b &&
      ((this.phone = b.phone),
      this.currentStateEl.find(".phone-value").html(b.phone));
    1 == a &&
      (this.sendSmsLink.hide(), this.codeSentEl.show(), this.input.show());
    this.input.val("");
  },
});
jQuery.widget("gc.selectField", $.gc.abstractField, {
  build: function () {
    this.buildValuesList();
  },
  buildValuesList: function () {
    if (this.field.settings.valueList) {
      var a = this.field.settings.valueList.split("\n");
      this.inputBlock.empty();
      if (this.field.settings.showAllValues) {
        if (
          this.field.settings.emptyValueText &&
          "" != this.field.settings.emptyValueText
        ) {
          $label = $("<label></label>");
          $label.html(this.field.settings.emptyValueText);
          var b = $(
            '<input type="radio" name="field-value-' + this.field.id + '">'
          );
          b.attr("value", "");
          b.prependTo($label);
          b.prop("checked", !0);
          $label.appendTo(this.inputBlock);
        }
        for (i = 0; i < a.length; i++)
          (c = a[i]),
            ($label = $("<label></label>")),
            $label.html(c),
            (b = $(
              '<input type="radio" name="field-value-' + this.field.id + '">'
            )),
            b.attr("value", c),
            b.prependTo($label),
            $label.appendTo(this.inputBlock);
      } else
        for (
          $input = $("<select/>"),
            this.field.id && $input.attr("id", "field-input-" + this.field.id),
            $input.addClass("form-control"),
            $input.appendTo(this.inputBlock),
            this.input = $input,
            this.field.settings.emptyValueText &&
              "" != this.field.settings.emptyValueText &&
              ((b = $("<option></option>")),
              b.attr("value", ""),
              b.html(this.field.settings.emptyValueText),
              b.appendTo(this.input)),
            i = 0;
          i < a.length;
          i++
        ) {
          var c = a[i],
            b = $("<option></option>");
          b.attr("value", c);
          b.html(c);
          b.appendTo(this.input);
        }
    }
  },
  initEditor: function (a) {
    $.gc.abstractField.prototype.initEditor.call(this, a);
    this.valueListInput = this.makeInputTextarea(
      "valueList",
      Yii.t("common", "Value list")
    );
    this.showAllValuesCheckbox = this.makeInputCheckbox(
      "showAllValues",
      Yii.t("common", "Value list")
    );
    this.emptyValueTextInput = this.makeInputField(
      "emptyValueText",
      Yii.t("common", "Empty value text")
    );
  },
  getField: function () {
    var a = $.gc.abstractField.prototype.getField.call(this);
    a.settings = {};
    a.settings.valueList = this.valueListInput.val();
    a.settings.showAllValues = this.showAllValuesCheckbox.prop("checked");
    a.settings.emptyValueText = this.emptyValueTextInput.val();
    return a;
  },
  rebuild: function () {
    $.gc.abstractField.prototype.rebuild.call(this);
    this.field.settings.valueList && this.buildValuesList();
  },
  getValue: function () {
    return this.field.settings.showAllValues
      ? this.inputBlock.find("input:checked").val() || null
      : this.input
      ? this.input.val()
      : null;
  },
  setValue: function (a) {
    this.field.settings.showAllValues
      ? this.inputBlock.find('input[value="' + a + '"]').prop("checked", !0)
      : this.input && this.input.val(a);
  },
});
jQuery.widget("gc.multiSelectField", $.gc.selectField, {
  build: function () {
    this.buildValuesList();
  },
  buildValuesList: function () {
    if (this.field.settings.valueList) {
      var a = this.field.settings.valueList.split("\n");
      this.inputBlock.empty();
      for (i = 0; i < a.length; i++) {
        var b = a[i];
        $label = $("<label></label>");
        $label.html(b);
        var c = $(
          '<input type="checkbox" name="field-value-' + this.field.id + '">'
        );
        c.attr("value", b);
        c.prependTo($label);
        $label.appendTo(this.inputBlock);
      }
    }
  },
  initEditor: function (a) {
    $.gc.abstractField.prototype.initEditor.call(this, a);
    this.valueListInput = this.makeInputTextarea(
      "valueList",
      Yii.t("common", "Value list")
    );
  },
  getField: function () {
    var a = $.gc.abstractField.prototype.getField.call(this);
    a.settings = {};
    a.settings.valueList = this.valueListInput.val();
    return a;
  },
  getValue: function () {
    var a = [];
    this.inputBlock.find("input:checked").each(function (b, c) {
      a.push($(c).val());
    });
    return a;
  },
  setValue: function (a) {
    this.inputBlock.find("input").prop("checked", !1);
    for (key in a)
      this.inputBlock
        .find('input[value="' + escapeDoubleQuotes(a[key]) + '"]')
        .prop("checked", !0);
  },
});
jQuery.widget("gc.textField", $.gc.abstractField, {
  build: function () {
    this.input = $("<textarea/>");
    this.field.id && this.input.attr("id", "field-input-" + this.field.id);
    this.field.id && this.input.attr("id", "field-input-" + this.field.id);
    this.input.appendTo(this.inputBlock);
  },
  initEditor: function (a) {
    $.gc.abstractField.prototype.initEditor.call(this, a);
    this.placeholderInput = this.makeInputTextarea(
      "placeholder",
      Yii.t("common", "Placeholder")
    );
    this.options.forSurvey &&
      (this.colsInput = this.makeInputField(
        "cols",
        Yii.t("common", "Symbols (width)"),
        3
      ));
    this.rowsInput = this.makeInputField("rows", Yii.t("common", "Rows"), 3);
  },
  getField: function () {
    var a = $.gc.abstractField.prototype.getField.call(this);
    a.settings = {};
    a.settings.placeholder = this.placeholderInput.val();
    this.colsInput && (a.settings.cols = this.colsInput.val());
    a.settings.rows = this.rowsInput.val();
    return a;
  },
  rebuild: function () {
    $.gc.abstractField.prototype.rebuild.call(this);
    this.input.attr("placeholder", this.field.settings.placeholder);
    this.input.addClass("form-control");
    this.field.settings.rows &&
      this.input.attr("rows", this.field.settings.rows);
  },
  getValue: function () {
    return this.input.val();
  },
  setInputClass: function (a) {
    this.input.addClass(a);
  },
});
jQuery.widget("gc.numericField", $.gc.stringField, {
  initEditor: function (a) {
    $.gc.stringField.prototype.initEditor.call(this, a);
    this.unitsInput = this.makeInputField("units", Yii.t("common", "Units"));
    this.options.chartEnabled &&
      ((this.showOnChartInput = this.makeInputCheckbox(
        "show_on_chart",
        Yii.t("common", "Show on chart")
      )),
      (this.hideOnChartByDefaultInput = this.makeInputCheckbox(
        "hide_on_chart_by_default",
        Yii.t("common", "Hidden by default on chart")
      )));
  },
  build: function () {
    $.gc.stringField.prototype.build.call(this);
    this.unitsEl = $(' <span class="units"></span>');
    this.unitsEl.insertAfter(this.input);
  },
  rebuild: function () {
    $.gc.stringField.prototype.rebuild.call(this);
    this.field.settings.units &&
      this.unitsEl.html(" " + this.field.settings.units);
  },
  getField: function () {
    var a = $.gc.stringField.prototype.getField.call(this);
    a.settings.units = this.unitsInput.val();
    this.showOnChartInput &&
      (a.settings.show_on_chart = this.showOnChartInput.prop("checked"));
    this.hideOnChartByDefaultInput &&
      (a.settings.hide_on_chart_by_default =
        this.hideOnChartByDefaultInput.prop("checked"));
    return a;
  },
});
