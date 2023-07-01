function SelectFieldWidget(params = {}) {
  if (
    params["select2Params"] &&
    ("data" in params["select2Params"] ||
      "ajax" in params["select2Params"] ||
      "tags" in params["select2Params"])
  ) {
    this.selectTag = "input";
  } else {
    this.selectTag = "select";
  }
  this.select2Params = params["select2Params"];
  this.selectedValueId = null;
  this.values = [];
  var self = this;

  this.initEl = function ($el, field, value) {
    this.init_selected_url = field.init_selected_url || false;
    this.setValue(value);

    if (field.not_multiple) {
      $selectEl = $("<" + this.selectTag + "></" + this.selectTag + ">");
    } else {
      $selectEl = $(
        "<" + this.selectTag + " multiple size=5></" + this.selectTag + ">"
      );
    }

    $selectEl.addClass("values-selector");
    this.selectEl = $selectEl;

    if (typeof field.values != "undefined") {
      this.configureSelect();

      for (key in field.values) {
        var model = field.values[key];
        var value = model.key ? model.key : key;
        var label = model.label ? model.label : model;
        var $option = $("<option>" + label + "</option>");

        $option.attr("value", value);
        $option.appendTo($selectEl);

        if (self.selectedValueId == value) {
          $option.attr("selected", true);
        }
      }
    }

    if (field.values_url) {
      this.values_url = field.values_url;
      this.refreshValues(window.fdsrevEnabled12);
    }

    this.selectEl.on("change", function () {
      self.selectedValueId = $(this).val();
      self.changed();
      self.valueChanged(self.selectedValueId, self.values);
    });

    this.initFieldEl($el, $selectEl, field);

    this.initSelect2();
  };

  this.valueChanged = function (selectedId, models) {};

  this.configureSelect = function () {
    self.selectEl.empty();

    if (!self.field.notShowEmpty && self.field.not_multiple) {
      var emptyLabel = self.field.emptyLabel ? self.field.emptyLabel : "";
      var $option = $("<option value=''>" + emptyLabel + "</option>");

      $option.attr("value", "");
      $option.appendTo(self.selectEl);
    }
  };

  this.refreshValues = function (initialization = false) {
    if (!this.values_url) {
      return;
    }

    var callback = function (response) {
      var groupElements = {};
      var existedValues = {};

      self.configureSelect();
      self.values = response.models;

      for (key in response.models) {
        var model = response.models[key];
        var value = model.key ? model.key : key;
        existedValues[value] = 1;

        var label = model.label ? model.label : model;
        var group = model.group;

        var $option = $("<option>" + label + "</option>");
        $option.attr("value", value);
        if (group) {
          $groupEl = groupElements[group];
          if (!$groupEl) {
            $groupEl = $("<optgroup/>");
            $groupEl.attr("label", group);
            $groupEl.appendTo(self.selectEl);
            groupElements[group] = $groupEl;
          }
          $option.appendTo($groupEl);
        } else {
          $option.appendTo(self.selectEl);
        }
      }

      var selectedValuesIds = $.isArray(self.selectedValueId)
        ? self.selectedValueId
        : [self.selectedValueId];

      for (var valueId of selectedValuesIds) {
        if (
          valueId &&
          valueId !== null &&
          valueId != "" &&
          !existedValues[valueId]
        ) {
          var $option = $(
            "<option>" +
              Yii.t("common", "Устаревшее значение") +
              ": " +
              valueId +
              "</option>"
          );

          $option.attr("value", valueId);
          $option.appendTo(self.selectEl);
        }
      }

      self.selectEl.val(self.selectedValueId, response.models);
      self.valueChanged(self.selectedValueId, response.models, initialization);
      self.initSelect2();
      self.loaded();
    };

    var valuesUrl = this.values_url;

    if (!window.selectValuesCache) {
      window.selectValuesCache = {};
    }

    if (!window.selectValuesCallbacks) {
      window.selectValuesCallbacks = {};
    }

    if (!window.selectValuesCache[valuesUrl]) {
      if (window.selectValuesCallbacks[valuesUrl] === undefined) {
        window.selectValuesCallbacks[valuesUrl] = [];
        ajaxCall(this.values_url, {}, {}, function (response) {
          window.selectValuesCache[valuesUrl] = response;
          window.selectValuesCallbacks[valuesUrl].forEach(function (fn) {
            fn(response);
          });
        });
      }
      window.selectValuesCallbacks[valuesUrl].push(callback);
    } else {
      const data = window.selectValuesCache[valuesUrl];

      // async call simulation
      setTimeout(function () {
        callback(data);
      }, 10);
    }
  };

  this.loaded = function () {};

  this.initSelect2 = function () {
    if (this.selectEl) {
      if (this.select2Inited) {
        this.selectEl.select2("destroy");
      }

      valueSelect = "Выберите";
      if (typeof Yii != "undefined") {
        valueSelect = Yii.t("common", "Please Select");
      }

      this.selectEl.select2({
        placeholder: valueSelect,
        allowClear: true,
        ...self.select2Params,
      });

      if (this.init_selected_url && this.selectedValueId) {
        $.ajax({
          context: this,
          url: this.init_selected_url,
          data: {
            selectedIds:
              typeof this.selectedValueId === "string"
                ? this.selectedValueId.split(",")
                : this.selectedValueId,
          },
          dataType: "json",
          success: function (response) {
            if (response.success) {
              this.selectEl.select2("data", response.data).change();
            }
          },
        });
      }
      this.select2Inited = true;
    }
  };

  this.getValue = function () {
    return { selected_id: this.selectedValueId };
  };

  this.setValue = function (value) {
    if (value && value.selected_id) {
      this.selectedValueId = value.selected_id;
    } else {
      this.selectedValueId = null;
    }

    if (value && this.selectEl) {
      this.selectEl.val(value.selected_id);

      if (
        this.values_url &&
        value.selected_id &&
        this.values_url.indexOf("isActual=true") > 0
      ) {
        this.values_url = this.values_url + "&selected=" + value.selected_id;
        this.refreshValues();
      }
    } else {
      if (this.selectEl) {
        this.selectEl.val("");
      }
    }

    this.initSelect2();
  };
}

extend(SelectFieldWidget, FieldWidget);
SelectFieldWidget.prototype = new FieldWidget();

window.logicFieldWidgets["select"] = SelectFieldWidget;
