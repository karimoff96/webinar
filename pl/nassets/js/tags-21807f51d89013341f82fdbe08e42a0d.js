!(function (a) {
  a.fn.caret = function (a) {
    var b = this[0],
      c = "true" === b.contentEditable;
    if (0 == arguments.length) {
      if (window.getSelection) {
        if (c) {
          b.focus();
          var f = window.getSelection().getRangeAt(0),
            c = f.cloneRange();
          return (
            c.selectNodeContents(b),
            c.setEnd(f.endContainer, f.endOffset),
            c.toString().length
          );
        }
        return b.selectionStart;
      }
      if (document.selection) {
        if ((b.focus(), c))
          return (
            (f = document.selection.createRange()),
            (c = document.body.createTextRange()),
            c.moveToElementText(b),
            c.setEndPoint("EndToEnd", f),
            c.text.length
          );
        a = 0;
        f = b.createTextRange();
        c = document.selection.createRange().duplicate();
        b = c.getBookmark();
        for (f.moveToBookmark(b); 0 !== f.moveStart("character", -1); ) a++;
        return a;
      }
      return b.selectionStart ? b.selectionStart : 0;
    }
    (-1 == a && (a = this[c ? "text" : "val"]().length), window.getSelection)
      ? c
        ? (b.focus(), window.getSelection().collapse(b.firstChild, a))
        : b.setSelectionRange(a, a)
      : document.body.createTextRange &&
        (c
          ? ((f = document.body.createTextRange()),
            f.moveToElementText(b),
            f.moveStart("character", a),
            f.collapse(!0))
          : ((f = b.createTextRange()), f.move("character", a)),
        f.select());
    return c || b.focus(), a;
  };
})(jQuery);
!(function (a) {
  a.fn.tagEditorInput = function () {
    var d = " ",
      b = a(this),
      c = parseInt(b.css("fontSize")),
      f = a("<span/>").css({
        position: "absolute",
        top: -9999,
        left: -9999,
        width: "auto",
        fontSize: b.css("fontSize"),
        fontFamily: b.css("fontFamily"),
        fontWeight: b.css("fontWeight"),
        letterSpacing: b.css("letterSpacing"),
        whiteSpace: "nowrap",
      });
    return (
      f.insertAfter(b),
      b.bind("keyup keydown focus", function () {
        if (d !== (d = b.val())) {
          f.html(
            d
              .replace(/&/g, "&amp;")
              .replace(/\s/g, "&nbsp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
          );
          var a = f.width() + c;
          20 > a && (a = 20);
          a != b.width() && b.width(a);
        }
      })
    );
  };
  a.fn.tagEditor = function (d, b, c) {
    function f(c) {
      if (8 == c.which || 46 == c.which || (c.ctrlKey && 88 == c.which)) {
        try {
          var b = getSelection(),
            d = a(b.getRangeAt(0).commonAncestorContainer);
        } catch (e) {
          d = 0;
        }
        if (d && d.hasClass("tag-editor")) {
          var f = [];
          c = b.toString().split(d.prev().data("options").dregex);
          for (i = 0; i < c.length; i++) (b = a.trim(c[i])) && f.push(b);
          return (
            a(".tag-editor-tag", d).each(function () {
              ~a.inArray(a(this).html(), f) &&
                a(this).closest("li").find(".tag-editor-delete").click();
            }),
            !1
          );
        }
      }
    }
    var k,
      e = a.extend({}, a.fn.tagEditor.defaults, d);
    if (
      ((e.dregex = new RegExp("[" + e.delimiter.replace("-", "-") + "]", "g")),
      "string" == typeof d)
    ) {
      var m = [];
      return (
        this.each(function () {
          var e = a(this),
            f = e.data("options"),
            k = e.next(".tag-editor");
          if ("getTags" == d)
            m.push({ field: e[0], editor: k, tags: k.data("tags") });
          else if ("addTag" == d) {
            if (f.maxTags && k.data("tags").length >= f.maxTags) return !1;
            a(
              '<li><div class="tag-editor-spacer">&nbsp;' +
                f.delimiter[0] +
                '</div><div class="tag-editor-tag"></div><div class="tag-editor-delete"><i></i></div></li>'
            )
              .appendTo(k)
              .find(".tag-editor-tag")
              .html('<input type="text" maxlength="' + f.maxLength + '">')
              .addClass("active")
              .find("input")
              .val(b)
              .blur();
            c ? a(".placeholder", k).remove() : k.click();
          } else
            "removeTag" == d
              ? (a(".tag-editor-tag", k)
                  .filter(function () {
                    return a(this).html() == b;
                  })
                  .closest("li")
                  .find(".tag-editor-delete")
                  .click(),
                c || k.click())
              : "destroy" == d &&
                e
                  .removeClass("tag-editor-hidden-src")
                  .removeData("options")
                  .off("focus.tag-editor")
                  .next(".tag-editor")
                  .remove();
        }),
        "getTags" == d ? m : this
      );
    }
    return (
      window.getSelection &&
        a(document).off("keydown.tag-editor").on("keydown.tag-editor", f),
      this.each(function () {
        function c() {
          !e.placeholder ||
            p.length ||
            a(".deleted, .placeholder, input", g).length ||
            g.append(
              '<li class="placeholder"><div>' + e.placeholder + "</div></li>"
            );
        }
        function d(n) {
          var b = p.toString();
          p = a(".tag-editor-tag:not(.deleted)", g)
            .map(function (d, c) {
              var n = a.trim(
                a(this).hasClass("active")
                  ? a(this).find("input").val()
                  : a(c).text()
              );
              return n ? n : void 0;
            })
            .get();
          g.data("tags", p);
          f.val(p.join(e.delimiter[0]));
          n || (b != p.toString() && e.onChange(f, g, p));
          c();
        }
        function b(c) {
          for (
            var l,
              k = c.closest("li"),
              m = c.val().replace(/ +/, " ").split(e.dregex),
              y = c.data("old_tag"),
              r = p.slice(0),
              u = !1,
              t = 0;
            t < m.length;
            t++
          )
            if (
              ((h = a.trim(m[t]).slice(0, e.maxLength)),
              e.forceLowercase && (h = h.toLowerCase()),
              (l = e.beforeTagSave(f, g, r, y, h)),
              (h = l || h),
              !1 !== l &&
                h &&
                (e.removeDuplicates &&
                  ~a.inArray(h, r) &&
                  a(".tag-editor-tag", g).each(function () {
                    a(this).html() == h && a(this).closest("li").remove();
                  }),
                r.push(h),
                k.before(
                  '<li><div class="tag-editor-spacer">&nbsp;' +
                    e.delimiter[0] +
                    '</div><div class="tag-editor-tag">' +
                    h +
                    '</div><div class="tag-editor-delete"><i></i></div></li>'
                ),
                e.maxTags && r.length >= e.maxTags))
            ) {
              u = !0;
              break;
            }
          c.attr("maxlength", e.maxLength).removeData("old_tag").val("");
          u ? c.blur() : c.focus();
          d();
        }
        var f = a(this),
          p = [],
          g = a(
            "<ul " +
              (e.clickDelete ? 'oncontextmenu="return false;" ' : "") +
              'class="tag-editor"></ul>'
          ).insertAfter(f);
        f.addClass("tag-editor-hidden-src")
          .data("options", e)
          .on("focus.tag-editor", function () {
            g.click();
          });
        g.append('<li style="width:1px">&nbsp;</li>');
        var m =
          '<li><div class="tag-editor-spacer">&nbsp;' +
          e.delimiter[0] +
          '</div><div class="tag-editor-tag"></div><div class="tag-editor-delete"><i></i></div></li>';
        g.click(function (c, d) {
          var b,
            f,
            h = 99999;
          if (!window.getSelection || "" == getSelection())
            return e.maxTags && g.data("tags").length >= e.maxTags
              ? (g.find("input").blur(), !1)
              : ((k = !0),
                a("input:focus", g).blur(),
                k
                  ? ((k = !0),
                    a(".placeholder", g).remove(),
                    d && d.length
                      ? (f = "before")
                      : a(".tag-editor-tag", g).each(function () {
                          var e = a(this),
                            g = e.offset(),
                            k = g.left,
                            g = g.top;
                          c.pageY >= g &&
                            c.pageY <= g + e.height() &&
                            (c.pageX < k
                              ? ((f = "before"), (b = k - c.pageX))
                              : ((f = "after"), (b = c.pageX - k - e.width())),
                            h > b && ((h = b), (d = e)));
                        }),
                    "before" == f
                      ? a(m)
                          .insertBefore(d.closest("li"))
                          .find(".tag-editor-tag")
                          .click()
                      : "after" == f
                      ? a(m)
                          .insertAfter(d.closest("li"))
                          .find(".tag-editor-tag")
                          .click()
                      : a(m).appendTo(g).find(".tag-editor-tag").click(),
                    !1)
                  : !1);
        });
        g.on("click", ".tag-editor-delete", function (b) {
          if (a(this).prev().hasClass("active"))
            return a(this).closest("li").find("input").caret(-1), !1;
          var l = a(this).closest("li");
          b = l.find(".tag-editor-tag");
          return !1 === e.beforeTagDelete(f, g, p, b.html())
            ? !1
            : (b
                .addClass("deleted")
                .animate({ width: 0 }, e.animateDelete, function () {
                  l.remove();
                  c();
                }),
              d(),
              !1);
        });
        e.clickDelete &&
          g.on("mousedown", ".tag-editor-tag", function (b) {
            if (b.ctrlKey || 1 < b.which) {
              var l = a(this).closest("li");
              b = l.find(".tag-editor-tag");
              return !1 === e.beforeTagDelete(f, g, p, b.html())
                ? !1
                : (b
                    .addClass("deleted")
                    .animate({ width: 0 }, e.animateDelete, function () {
                      l.remove();
                      c();
                    }),
                  d(),
                  !1);
            }
          });
        g.on("click", ".tag-editor-tag", function (c) {
          if (e.clickDelete && (c.ctrlKey || 1 < c.which)) return !1;
          if (!a(this).hasClass("active")) {
            var b = a(this).html();
            c = Math.abs((a(this).offset().left - c.pageX) / a(this).width());
            var d = parseInt(b.length * c);
            c = a(this)
              .html(
                '<input type="text" maxlength="' +
                  e.maxLength +
                  '" value="' +
                  b +
                  '">'
              )
              .addClass("active")
              .find("input");
            if (
              (c.data("old_tag", b).tagEditorInput().focus().caret(d),
              e.autocomplete)
            ) {
              var b = a.extend({}, e.autocomplete),
                f = "select" in b ? e.autocomplete.select : "";
              b.select = function (c, b) {
                f && f(c, b);
                setTimeout(function () {
                  g.trigger("click", [
                    a(".active", g)
                      .find("input")
                      .closest("li")
                      .next("li")
                      .find(".tag-editor-tag"),
                  ]);
                }, 20);
              };
              c.autocomplete(b);
            }
          }
          return !1;
        });
        g.on("blur", "input", function (n) {
          n.stopPropagation();
          n = a(this);
          var l = n.data("old_tag"),
            h = a.trim(
              n.val().replace(/ +/, " ").replace(e.dregex, e.delimiter[0])
            );
          if (h) {
            if (0 <= h.indexOf(e.delimiter[0])) return void b(n);
            if (h != l)
              if (
                (e.forceLowercase && (h = h.toLowerCase()),
                (cb_val = e.beforeTagSave(f, g, p, l, h)),
                (h = cb_val || h),
                !1 === cb_val)
              ) {
                if (l) return n.val(l).focus(), (k = !1), void d();
                try {
                  n.closest("li").remove();
                } catch (m) {}
                l && d();
              } else
                e.removeDuplicates &&
                  a(".tag-editor-tag:not(.active)", g).each(function () {
                    a(this).html() == h && a(this).closest("li").remove();
                  });
          } else {
            if (l && !1 === e.beforeTagDelete(f, g, p, l))
              return n.val(l).focus(), (k = !1), void d();
            try {
              n.closest("li").remove();
            } catch (q) {}
            l && d();
          }
          n.parent().html(h).removeClass("active");
          h != l && d();
          c();
        });
        var v;
        g.on("paste", "input", function (c) {
          a(this).removeAttr("maxlength");
          v = a(this);
          setTimeout(function () {
            b(v);
          }, 30);
        });
        var w;
        g.on("keypress", "input", function (c) {
          0 <= e.delimiter.indexOf(String.fromCharCode(c.which)) &&
            ((w = a(this)),
            setTimeout(function () {
              b(w);
            }, 20));
        });
        g.on("keydown", "input", function (c) {
          var b = a(this);
          if (
            ((37 == c.which || (!e.autocomplete && 38 == c.which)) &&
              !b.caret()) ||
            (8 == c.which && !b.val())
          )
            return (
              (c = b.closest("li").prev("li").find(".tag-editor-tag")),
              c.length
                ? c.click().find("input").caret(-1)
                : !b.val() ||
                  (e.maxTags && g.data("tags").length >= e.maxTags) ||
                  a(m)
                    .insertBefore(b.closest("li"))
                    .find(".tag-editor-tag")
                    .click(),
              !1
            );
          if (
            (39 == c.which || (!e.autocomplete && 40 == c.which)) &&
            b.caret() == b.val().length
          )
            return (
              (c = b.closest("li").next("li").find(".tag-editor-tag")),
              c.length
                ? c.click().find("input").caret(0)
                : b.val() && g.click(),
              !1
            );
          if (9 == c.which) {
            if (c.shiftKey) {
              c = b.closest("li").prev("li").find(".tag-editor-tag");
              if (c.length) c.click().find("input").caret(0);
              else {
                if (
                  !b.val() ||
                  (e.maxTags && g.data("tags").length >= e.maxTags)
                )
                  return (
                    f.attr("disabled", "disabled"),
                    void setTimeout(function () {
                      f.removeAttr("disabled");
                    }, 30)
                  );
                a(m)
                  .insertBefore(b.closest("li"))
                  .find(".tag-editor-tag")
                  .click();
              }
              return !1;
            }
            c = b.closest("li").next("li").find(".tag-editor-tag");
            if (c.length) c.click().find("input").caret(0);
            else {
              if (!b.val()) return;
              g.click();
            }
            return !1;
          }
          if (
            !(46 != c.which || (a.trim(b.val()) && b.caret() != b.val().length))
          )
            return (
              (c = b.closest("li").next("li").find(".tag-editor-tag")),
              c.length
                ? c.click().find("input").caret(0)
                : b.val() && g.click(),
              !1
            );
          if (13 == c.which)
            return (
              g.trigger("click", [
                b.closest("li").next("li").find(".tag-editor-tag"),
              ]),
              !1
            );
          if (36 != c.which || b.caret())
            if (35 == c.which && b.caret() == b.val().length)
              g.find(".tag-editor-tag").last().click();
            else {
              if (27 == c.which)
                return (
                  b.val(b.data("old_tag") ? b.data("old_tag") : "").blur(), !1
                );
            }
          else g.find(".tag-editor-tag").first().click();
        });
        for (
          var x = e.initialTags.length
              ? e.initialTags
              : f.val().split(e.dregex),
            q = 0;
          q < x.length && !(e.maxTags && q >= e.maxTags);
          q++
        ) {
          var h = a.trim(x[q].replace(/ +/, " "));
          h &&
            (e.forceLowercase && (h = h.toLowerCase()),
            p.push(h),
            g.append(
              '<li><div class="tag-editor-spacer">&nbsp;' +
                e.delimiter[0] +
                '</div><div class="tag-editor-tag">' +
                h +
                '</div><div class="tag-editor-delete"><i></i></div></li>'
            ));
        }
        d(!0);
        e.sortable &&
          a.fn.sortable &&
          g.sortable({
            distance: 5,
            cancel: ".tag-editor-spacer, input",
            helper: "clone",
            update: function () {
              d();
            },
          });
      })
    );
  };
  a.fn.tagEditor.defaults = {
    initialTags: [],
    maxTags: 0,
    maxLength: 50,
    delimiter: ",;",
    placeholder: "",
    forceLowercase: !0,
    removeDuplicates: !0,
    clickDelete: !1,
    animateDelete: 175,
    sortable: !0,
    autocomplete: null,
    onChange: function () {},
    beforeTagSave: function () {},
    beforeTagDelete: function () {},
  };
})(jQuery);
jQuery.widget("gc.tagsCloud", {
  tags: [],
  noReload: !1,
  tagsEl: [],
  options: {
    objectTypeId: null,
    objectTypeClass: null,
    onChange: null,
    filterByObjects: !0,
    showHeader: !0,
    showArchivedSelector: !0,
    showEditLink: !0,
    tags: null,
    listUrl: null,
    showAllTags: !1,
    defaultTags: null,
    enableCreate: !0,
  },
  cloudEl: null,
  _create: function () {
    var a = this;
    this.options.defaultTags &&
      this.element.attr("value", this.options.defaultTags.join(","));
    this.noReload = !0;
    this.cloudEl = $('<div class="gc-tags-cloud"/>');
    this.closeBtn = $('<div class="gc-close-btn">&times;</div>');
    this.closeBtn.click(function () {
      var c = a.element.tagEditor("getTags")[0].tags;
      if (0 != c.length) {
        a.noReload = !0;
        for (var b in c) a.element.tagEditor("removeTag", c[b]);
        a.noReload = !1;
        a.tagsChanged();
      }
    });
    this.cloudEl.insertAfter(this.element);
    if (this.options.showHeader) {
      this.tagElementWrapper = $("<div class='gc-tags-input-wrapper'>");
      this.tagElementWrapper.appendTo(this.cloudEl);
      this.element.appendTo(this.tagElementWrapper);
      this.closeBtn.prependTo(this.tagElementWrapper);
      var d = "/pl/tag/typeahead?";
      this.options.objectTypeClass &&
        (d += "&objectTypeClass=" + this.options.objectTypeClass);
      this.options.objectTypeId &&
        (d += "&objectTypeId=" + this.options.objectTypeId);
      this.options.contextName &&
        (d += "&contextName=" + this.options.contextName);
      var b = "\u0442\u0435\u0433\u0438";
      "undefined" != typeof Yii && (b = Yii.t("common", "tags"));
      d = {
        autocomplete: { delay: 0, position: { collision: "flip" }, source: d },
        forceLowercase: !1,
        placeholder: b,
        onChange: function (c) {
          a.tagsChanged();
        },
      };
      this.options.enableCreate ||
        (d.beforeTagSave = function (a, b, d, e, m) {
          if (0 === $('.gc-tag>.name:contains("' + m + '")').length) return !1;
        });
      a.options.defaultTags && (d.initialTags = a.options.defaultTags);
      this.element.tagEditor(d);
    }
    this.loadTags();
    this.noReload = !1;
    this.createArchivedSelector();
  },
  createArchivedSelector: function () {
    var a = this,
      d = "\u0432\u0441\u0435 \u0437\u0430\u043f\u0438\u0441\u0438",
      b =
        "\u0442\u043e\u043b\u044c\u043a\u043e \u0430\u043a\u0442\u0443\u0430\u043b\u044c\u043d\u044b\u0435 \u0437\u0430\u043f\u0438\u0441\u0438",
      c = "\u043d\u0435\u0430\u043a\u0442\u0438\u0432\u043d\u044b\u0435";
    "undefined" != typeof Yii &&
      ((d = Yii.t("common", "all posts")),
      (b = Yii.t("common", "only recent entries")),
      (c = Yii.t("common", "inactive")));
    this.archivedSelector = $(
      '<select style="margin-left: 10px; margin-top: 4px; float: right"> <option value="">' +
        d +
        '</option> <option value="actual">' +
        b +
        '</option> <option value="archived">' +
        c +
        "</option> </select> "
    );
    this.options.showArchivedSelector &&
      this.archivedSelector.prependTo(this.tagElementWrapper);
    this.element.data("archived")
      ? this.archivedSelector.val(this.element.data("archived"))
      : this.archivedSelector.val("actual");
    this.archivedSelector.change(function () {
      a.valueChanged();
      a.filterTags();
    });
  },
  configureForm: function () {
    if (this.options.formSelector) {
      var a = $(this.options.formSelector).find('input[name="tagNames"]');
      0 == a.length &&
        ((a = $("<input type=hidden name=tagNames>")),
        a.appendTo($(this.options.formSelector)));
      a.val(this.element.val());
      a = $(this.options.formSelector).find('input[name="archived"]');
      0 == a.length &&
        ((a = $("<input type=hidden name=archived>")),
        a.appendTo($(this.options.formSelector)));
      a.val(this.archivedSelector.val());
    }
  },
  valueChanged: function () {
    this.configureForm();
    $(this.options.formSelector).submit();
    if (this.options.onChange) this.options.onChange(this);
    this.options.valueSelector &&
      $(this.options.valueSelector).val(this.element.val());
  },
  tagsChanged: function () {
    this.noReload ||
      (0 == this.element.val().split(",").length
        ? this.closeBtn.hide()
        : this.closeBtn.show(),
      this.tagsValueEl && this.tagsValueEl.val(this.element.val()),
      this.valueChanged(),
      this.filterTags());
  },
  setTags: function (a) {},
  loadTags: function () {
    var a = this,
      d = function (c) {
        a.tagsListEl && a.tagsListEl.detach();
        a.tagsListEl = $tagsEl = $('<div class="gc-tags-list">');
        c.data.objectTypeId && (a.options.objectTypeId = c.data.objectTypeId);
        if (0 != c.data.tags.length) {
          window.userInfo.isAdmin &&
            a.options.showArchivedSelector &&
            (($settingsEl = $(
              "<div class='gc-tag-settings'><a target='_blank' href='/pl/tag/index' class='fa fa-cog'></a></span></div>"
            )),
            $settingsEl.appendTo($tagsEl));
          var b =
            "\u0442\u043e\u043b\u044c\u043a\u043e \u0438\u0437\u0431\u0440\u0430\u043d\u043d\u044b\u0435 \u0442\u0435\u0433\u0438";
          "undefined" != typeof Yii &&
            (b = Yii.t("common", "only selected tags"));
          $favorites = $("<div class='gc-tag-filter'>" + b + "</div>");
          $favorites.appendTo($tagsEl);
          $favorites.click(function () {
            $tagsEl.toggleClass("only-favorites");
          });
          b = !1;
          for (key in c.data.tags) {
            var d = c.data.tags[key];
            a.tags.push(d.name);
            var e = [
              '<div class="gc-tag"><span class="name">',
              d.url
                ? ['<a href="', d.url, '">', d.name, "</a>"].join("")
                : d.name,
              "</span> ",
              a.options.showEditLink
                ? '<span class="edit-link fa fa-pencil" style="font-size: 0.8em"></span>'
                : "",
              "</div>",
            ].join("");
            $tagEl = $(e);
            $tagEl.data("tag", d.name);
            $tagEl.data("tag-id", d.id);
            $tagEl.data("is-favorite", d.is_favorite);
            1 == d.is_favorite
              ? ((b = !0), $tagEl.addClass("is-favorite"))
              : $tagEl.addClass("not-favorite");
            d.is_active && $tagEl.addClass("is-active");
            a.tagsEl[d.name] = $tagEl;
            $tagEl.appendTo($tagsEl);
          }
          b &&
            ($tagsEl.data("has-favorites", !0),
            $tagsEl.addClass("has-favorites"),
            $tagsEl.addClass("only-favorites"));
          $tagsEl.appendTo(a.cloudEl);
          a.options.showHeader &&
            $tagsEl.find(".gc-tag .name").click(function () {
              a.element.tagEditor(
                "addTag",
                $(this).parents(".gc-tag").data("tag")
              );
            });
          $tagsEl.find(".gc-tag .edit-link").click(function () {
            a.openTagModal($(this).parents(".gc-tag").data("tag-id"));
          });
          $tagsEl.sortable();
          a.filterTags();
        }
      };
    if (this.options.tags) d({ data: { tags: this.options.tags } });
    else {
      var b = this.options.listUrl
        ? this.options.listUrl
        : "/pl/tag/by-object-type";
      (this.options.objectTypeId ||
        this.options.objectTypeClass ||
        this.options.contextName) &&
        ajaxCall(
          b,
          {
            objectTypeId: this.options.objectTypeId,
            objectTypeClass: this.options.objectTypeClass,
            contextName: this.options.contextName,
          },
          {},
          d
        );
    }
  },
  openTagModal: function (a) {
    var d = this;
    this.tagDialog || (this.tagDialog = new TagDialog());
    this.tagDialog.open(a, function () {
      d.loadTags();
      d.tagsChanged();
    });
  },
  filterTags: function () {
    var a = this,
      d = this.element.val().trim();
    "" != d
      ? this.tagsListEl.removeClass("has-favorites")
      : this.tagsListEl.data("has-favorites") &&
        this.tagsListEl.addClass("has-favorites");
    if (this.options.filterByObjects)
      (d = { objectTypeId: this.options.objectTypeId, tags: d }),
        this.archivedSelector &&
          (d.archivedValue = this.archivedSelector.val()),
        ajaxCall("/pl/tag/filter-tags", d, {}, function (b) {
          $(a.cloudEl).find(".gc-tag").addClass("filtered");
          for (key in b.data.tags) {
            var d = b.data.tags[key];
            a.tagsEl[d.name] && a.tagsEl[d.name].removeClass("filtered");
          }
        });
    else
      for (key in ($(this.cloudEl).find(".gc-tag").removeClass("filtered"),
      (d = d.split(",")),
      d)) {
        var b = d[key];
        a.tagsEl[b] && a.tagsEl[b].addClass("filtered");
      }
  },
  getTagsStr: function () {
    return this.element.val().trim();
  },
  getTags: function () {
    var a = this.getTagsStr();
    return "" == a ? [] : a.split(",");
  },
  getArchived: function () {
    return this.archivedSelector.val();
  },
});
function TagDialog() {
  var a = (this.modal = window.gcModalFactory.create({ show: !1, width: 400 })),
    d = this;
  $saveBtn = $(
    '<button class="pull-left btn btn-success">' +
      Yii.t(
        "common",
        "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c"
      ) +
      "</button>"
  );
  $saveBtn.appendTo(a.getFooterEl());
  $saveBtn.click(function () {
    d.modal.getContentEl().find("form").submit();
  });
  this.open = function (a, c) {
    this.modal.reset();
    ajaxCall("/pl/tag/edit-form?id=" + a, {}, {}, function (a) {
      d.modal.setContent(a.data.html);
      d.modal
        .getContentEl()
        .find("form")
        .ajaxForm({
          success: function () {
            d.modal.hide();
            c && c();
          },
        });
    });
    this.modal.show();
  };
}
jQuery.widget("gc.changeActualityLink", {
  _create: function () {
    var a = this,
      d = this.element.data("object-type-id"),
      b = this.element.data("object-id"),
      c = this.element.data("current-value");
    this.element.parents("tr").addClass("has-archived-row");
    c && "" != c && this.element.parents("tr").addClass("archived");
    this.element.click(function () {
      ajaxCall(
        "/pl/tag/model-change-archived",
        { objectTypeId: d, objectId: b, currentValue: c },
        {},
        function (b) {
          a.element.data("current-value", b.data.newValue);
          c = b.data.newValue;
          a.element.html(b.data.label);
          "archived" == c
            ? a.element.parents("tr").addClass("archived")
            : a.element.parents("tr").removeClass("archived");
        }
      );
    });
  },
});
jQuery.widget("gc.modalEditorLink", {
  _create: function () {
    var a = this;
    this.element.parents("tr").dblclick(function () {
      a.element.click();
    });
    this.element.click(function () {
      a.open(
        a.element.data("context-name"),
        a.element.data("object-id"),
        function () {
          a.element.data("tags", newValue);
          a.setTags(newValue);
        }
      );
    });
  },
  open: function (a, d, b) {
    var c = (this.modal = window.gcModalFactory.create({ show: !1 })),
      f = this;
    c.reset();
    ajaxCall(
      "/pl/logic/context/edit-form",
      { context: a, objectId: d },
      {},
      function (a) {
        c.getHeaderEl().html(a.data.title);
        c.setContent(a.data.formHtml);
        f.form = c.getContentEl().find("form");
        f.form.ajaxForm();
      }
    );
    $saveBtn = $(
      '<button class="btn pull-left btn-success">\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c</button>'
    );
    $saveBtn.click(function () {
      f.form.ajaxSubmit({
        url: "/pl/logic/context/edit-form",
        data: { save: !0, context: a, objectId: d },
        success: function (a) {
          window.location.reload();
        },
      });
    });
    $saveBtn.appendTo(c.getFooterEl());
    c.show();
  },
});
jQuery.widget("gc.objectTagsLink", {
  _create: function () {
    var a = this;
    this.setTags(this.element.data("tags"));
    this.options.editable &&
      this.element.click(function (d) {
        d.stopPropagation();
        a.open(
          a.element.data("object-type-id"),
          a.element.data("object-id"),
          function (b) {
            a.element.data("tags", b);
            a.setTags(b);
          }
        );
        return !1;
      });
  },
  setTags: function (a) {
    this.element.empty();
    this.options.inputName &&
      ((this.valueWrapperEl = $('<div style="display: none"></div>')),
      this.valueWrapperEl.appendTo(this.element));
    if ((a = a.toString()) && 0 < a.length)
      for (key in ((a = a.split(",")), a)) {
        var d = a[key].trim();
        if (
          d &&
          ($("<span>" + d + "</span>").appendTo(this.element),
          this.valueWrapperEl)
        ) {
          var b = $('<input type="hidden">');
          b.val(d);
          b.attr("name", this.options.inputName + "[]");
          b.appendTo(this.valueWrapperEl);
        }
      }
    else
      (a = this.element.data("empty-list-text")),
        a ||
          ((a = "\u043d\u0435\u0442 \u0442\u0435\u0433\u043e\u0432"),
          "undefined" != typeof Yii && (a = Yii.t("common", "no tags"))),
        this.element.html("<span class='no-tags'>" + a + "</span>"),
        this.valueWrapperEl &&
          ((b = $('<input type="hidden">')),
          b.val(""),
          b.attr("name", this.options.inputName),
          b.appendTo(this.element));
  },
  open: function (a, d, b) {
    var c = (this.modal = window.gcModalFactory.create({ show: !1 })),
      f = this;
    c.reset();
    c.getModalEl().addClass("tags-cloud-modal");
    c.setContent("");
    var k = $("<input type=text name=tags />");
    k.val(this.element.data("tags"));
    k.appendTo(c.getContentEl());
    k.tagsCloud({
      objectTypeId: a,
      filterByObjects: !1,
      listUrl: this.element.data("list-url"),
      showArchivedSelector: this.element.data("show-archived-selector"),
      showEditLink: this.element.data("show-edit-link"),
      enableCreate: this.element.data("enable-create"),
    });
    var e = "\u0412\u044b\u0431\u0440\u0430\u0442\u044c",
      m = "\u0421\u043e\u0445\u0440\u0430\u043d\u0438\u0442\u044c";
    "undefined" != typeof Yii &&
      ((e = Yii.t("common", "Select")), (m = Yii.t("common", "Save")));
    $saveBtn = f.options.noSave
      ? $('<button class="pull-left btn btn-primary">' + e + "</button>")
      : $('<button class="pull-left btn btn-success">' + m + "</button>");
    $saveBtn.appendTo(c.getFooterEl());
    $saveBtn.click(function () {
      var e = k.tagsCloud("getTagsStr");
      f.options.noSave
        ? (b(e), c.hide())
        : ajaxCall(
            "/pl/tag/set-object-tags?objectTypeId=" + a + "&objectId=" + d,
            { tags: e },
            {},
            function (a) {
              b(e);
              c.hide();
            }
          );
    });
    c.show();
  },
});
