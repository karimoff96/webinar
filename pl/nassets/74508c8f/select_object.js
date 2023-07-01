function SelectObjectFieldWidget() {
  this.selectedValueId = null;
  this.values = [];
  var self = this;
  var selectedIds = [];
  var preSelectedIds = [];
  this.selectedTags = [];
  var selectAllObjectsWithTags = false;
  var allObjectWithTags = false;
  this.previousModal = null;

  this.initEl = function ($el, field, value) {
    this.field = field;

    var $shortEl = (this.shortEl = $(
      "<div class='select-object-widget select-object-short'></div>"
    ));

    if (field.inputName) {
      this.valueInput = $(
        '<input type="hidden" name="' + field.inputName + '"/>'
      );
      this.valueInput.appendTo($el);
    }
    $shortEl.appendTo($el);

    if (field.linkEdit && value.selected_id) {
      $linkEdit = $(
        '<a href="' +
          field.linkEdit +
          value.selected_id +
          '" target="_blank">  редактировать</a>'
      );
      $linkEdit.appendTo($el);
    }

    $shortEl.click(function () {
      self.openSearchModal();
    });

    this.setValue(value);
  };

  this.searchModal = null;
  this.openSearchModal = function () {
    var self = this;
    var field = this.field;
    this.preSelectedIds = [];
    for (var key in this.selectedIds) {
      this.preSelectedIds.push(this.selectedIds[key]);
    }
    self.detectPreviousActiveModal();
    if (!this.searchModal) {
      var modal = (this.searchModal = window.gcModalFactory.create({
        show: false,
        onShow: function () {
          if (self.previousModal) {
            self.previousModal.hide();
          }
        },
        onHide: function () {
          if (self.previousModal) {
            setTimeout(function () {
              self.previousModal.show();
            }, 10);
          }
        },
      }));

      modal.getContentEl().css("paddingRight", "20px");
      self.modalBody = modal.getContentEl().parents(".modal-body");

      $tagsSelector = $('<input  type="text" class="tags-input">');
      $tagsSelector.appendTo(modal.getHeaderEl());

      if (this.selectedTags) {
        $tagsSelector.val(this.selectedTags);
      }

      this.tagsCloud = $tagsSelector.tagsCloud({
        contextName: field.context,
        objectTypeId: field.objectTypeId,
        onChange: function () {
          self.doSearch();
          11;
        },
      });

      modal.setContent("");

      var placeholderValue = "поиск";
      var buttonValue = "Найти";
      if (typeof Yii != "undefined") {
        placeholderValue = Yii.t("common", "search");
        buttonValue = Yii.t("common", "Find");
      }

      $searchBlock = $(
        '<div class="input-group margin-bottom-10"><input placeholder="' +
          placeholderValue +
          '" type="text" class="search-str form-control"><span class="input-group-btn"><button class="btn btn-primary search-btn" type="submit">' +
          buttonValue +
          "</button></span></div>"
      );
      this.searchStrEl = $searchBlock.find(".search-str");
      this.searchButtonEl = $searchBlock.find(".search-btn");
      $searchBlock.appendTo(modal.getContentEl());
      modal.getHeaderEl().css("backgroundColor", "#F0F0F0");

      self.tableContentEl = $("<div/>");
      self.tableContentEl.appendTo(modal.getContentEl());

      this.searchStrEl.keyup(function (e) {
        self.doSearch();
      });

      this.searchButtonEl.click(function () {
        self.doSearch();
      });

      self.selectedEl = $selectedEl = $(
        '<div style="margin-top: 10px;" class="select-object-preselect select-object-short"></div>'
      );
      $selectedEl.appendTo(modal.getHeaderEl());
      if (!this.field.multi) {
        $selectedEl.hide();
      }

      $buttonsEl = $('<div class="clearfix margin-top-5"/>');

      if (this.field.multi) {
        $buttonsEl.appendTo($selectedEl);
      } else {
        $buttonsEl.appendTo(modal.getFooterEl());
      }

      $saveBtn = $(
        '<button class="pull-left btn btn-success">' +
          Yii.t("common", "Выбрать") +
          "</button>"
      );
      $saveBtn.appendTo($buttonsEl);
      $saveBtn.click(function () {
        if (!self.field.multi) {
          self.doSelect();
        }
        self.saveValue();
      });

      $clearBtn = $(
        '<button class="pull-left margin-left-5 btn btn-link">' +
          Yii.t("common", "Сбросить") +
          " </button>"
      );
      $clearBtn.appendTo($buttonsEl);
      $clearBtn.click(function () {
        self.preSelectedIds = [];
        self.selectedTags = [];
        self.allObjectWithTags = false;
        self.saveValue();
      });
    }
    self.updateSelectedView();

    this.doSearch(field, this.searchModal);
    this.searchModal.show();
  };

  this.detectPreviousActiveModal = function () {
    var active = window.gcModalActive();
    if (active && !active.isActive()) {
      active = null;
    }

    if (
      !active ||
      !this.searchModal ||
      active.getId() !== this.searchModal.getId()
    ) {
      this.previousModal = active;
    }

    return this.previousModal;
  };

  this.doSearch = function () {
    var modal = this.searchModal;
    var field = this.field;

    this.selectedTags = this.tagsCloud.tagsCloud("getTags");
    var archived = this.tagsCloud.tagsCloud("getArchived");
    ajaxCall(
      "/pl/logic/context/select-object",
      {
        context: field.context,
        searchStr: this.searchStrEl.val(),
        tagNames: this.selectedTags.join(","),
        archived: archived,
        free: field.is_free,
      },
      {},
      function (response) {
        self.tableContentEl.html(response.data.html);
        self.makeSelectableTable(self.tableContentEl);
        self.updateSelectedView();
      }
    );
  };

  this.makeSelectableTable = function ($contentEl) {
    $table = $contentEl.find("table");
    $table.addClass("table-selectable");
    self.table = $table;

    $contentEl.find("tr").click(function () {
      $table.find("tr.selected").removeClass("selected");
      $(this).addClass("selected");
    });

    $contentEl.find("tr").dblclick(function () {
      self.doSelect();
    });

    $contentEl.find("a.choose-row-button").click(function () {
      $(this).parents("tr:first").click();
      self.doSelect();
    });
  };

  this.doSelect = function () {
    if (!self.table) {
      alert("Нет выбранного элемента");
      return;
    }
    var key = self.table.find("tr.selected").data("key");

    if (!this.field.multi) {
      this.preSelectedIds = [key];
      this.saveValue();
    } else {
      this.preSelectedIds.push(key);
      this.updateSelectedView();
    }
  };

  this.updateSelectedView = function () {
    var self = this;
    if (!this.selectedEl || !this.field.multi) {
      return;
    }

    self.selectedEl.find(".objects-list").detach();
    var $objectsList = $(
      '<div class="objects-list margin-bottom-5 clearfix"></div>'
    );
    $objectsList.prependTo(self.selectedEl);

    $allWithTags = $(
      "<div><label> Выбирать все с выбранными тегами</label></div>"
    );
    $selectAllObjectsWithTagsEl = $(
      '<input class="margin-right-5" type="checkbox">'
    );
    $selectAllObjectsWithTagsEl.prependTo($allWithTags.find("label"));

    $selectAllObjectsWithTagsEl.click(function () {
      self.allObjectWithTags = $(this).prop("checked");
      if (self.allObjectWithTags) {
        self.modalBody.hide();
      } else {
        self.modalBody.show();
      }
    });

    if (this.allObjectWithTags) {
      //$selectAllObjectsWithTagsEl.prop( 'checked', true )
      $selectAllObjectsWithTagsEl.click();
    }

    if (
      (this.field.multi && this.selectedTags.length == 0) ||
      this.preSelectedIds.length > 1
    ) {
      self.modalBody.show();
    }

    var somethingShown = false;

    if (!this.preSelectedIds.length || this.preSelectedIds.length == 0) {
      //$objectsList.html( "ничего не выбрано" );
      if (this.selectedTags.length > 0) {
        $allWithTags.appendTo($objectsList);
        somethingShown = true;
      }
    } else {
      if (this.preSelectedIds.length > 0) {
        somethingShown = true;
      }

      ajaxCall(
        "/pl/logic/context/object-titles",
        { context: this.field.context, ids: this.preSelectedIds },
        {},
        function (response) {
          for (var key in response.data.ids) {
            var id = response.data.ids[key];
            var title = response.data.titles[id];
            var url = response.data.urls[id];
            var $el = $(
              "<div class='margin-bottom-5'><span>" +
                title +
                " (<a href='" +
                url +
                "' target='_blank'>id:" +
                id +
                "</a>)</span></div>"
            );
            $el.appendTo($objectsList);

            var $btnDel = $(
              "<button class='btn btn-link btn-xs margin-right-5'>x</button>"
            );
            $btnDel.data("object-id", id);
            $btnDel.click(function () {
              var newIds = [];
              for (var i in self.preSelectedIds) {
                if (self.preSelectedIds[i] != $(this).data("object-id"))
                  newIds.push(self.preSelectedIds[i]);
              }
              self.preSelectedIds = newIds;
              self.updateSelectedView();
            });
            $btnDel.prependTo($el);
          }
        }
      );
    }
    if (this.selectedTags && this.selectedTags.length > 0) {
      somethingShown = true;
    }

    if (!somethingShown) {
      self.selectedEl.hide();
    } else {
      self.selectedEl.show();
    }
  };

  this.saveValue = function () {
    this.selectedIds = [];
    for (var key in this.preSelectedIds) {
      this.selectedIds.push(this.preSelectedIds[key]);
    }

    if (self.valueChanged) {
      self.valueChanged(
        this.field.multi ? self.selectedIds : self.selectedIds[0],
        self.values
      );
    }
    self.changed();
    self.loadData(this.shortEl);

    if (this.valueInput && this.selectedIds) {
      this.valueInput.val(this.selectedIds);
    }

    this.searchModal.hide();
  };

  /*this.valueChanged = function( selectedId, models ) {
    	self.doSearch();
    };*/

  this.getValue = function () {
    return {
      selected_id: this.field.multi ? this.selectedIds : this.selectedIds[0],
      selected_tags: this.selectedTags,
      all_object_with_tags: this.allObjectWithTags,
    };
  };

  this.setValue = function (value) {
    if (
      value &&
      value.selected_id &&
      typeof value.selected_id.length != "undefined"
    ) {
      this.selectedIds = value.selected_id;
    } else if (value && value.selected_id) {
      this.selectedIds = [value.selected_id];
    } else {
      this.selectedIds = [];
    }
    if (value) {
      if (value.selected_tags) {
        this.selectedTags = value.selected_tags;
      }
      this.allObjectWithTags = value.all_object_with_tags
        ? value.all_object_with_tags
        : false;
    }

    this.loadData(this.shortEl);
  };

  this.loadData = function (element) {
    var emptyText = this.field.emptyText
      ? this.field.emptyText
      : Yii.t("common", "не выбрано");
    var widget = this;

    if (!this.selectedIds.length) {
      if (this.selectedTags.length > 0 && this.allObjectWithTags) {
        element.html(
          "<span class='fa fa-hand-o-up'></span> Все с тегами: " +
            this.selectedTags.join(", ")
        );
      } else {
        element.html("<span class='fa fa-hand-o-up'></span> " + emptyText);
      }
    } else {
      ajaxCall(
        "/pl/logic/context/object-titles",
        { context: this.field.context, ids: this.selectedIds },
        {},
        function (response) {
          element.empty();
          for (var key in response.data.ids) {
            var id = response.data.ids[key];
            var title = response.data.titles[id];
            var $el = $("<div><span>" + title + "</span></div>");
            $el.appendTo(element);

            if (widget.valueInput && widget.selectedIds) {
              widget.valueInput.val(widget.selectedIds);
            }
          }
        }
      );
    }
  };
}

extend(SelectObjectFieldWidget, FieldWidget);
SelectObjectFieldWidget.prototype = new FieldWidget();

window.logicFieldWidgets["selectObject"] = SelectObjectFieldWidget;
