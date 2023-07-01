(function (a) {
  "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery);
})(function (a) {
  a.ui = a.ui || {};
  a.ui.version = "1.12.1";
  var b = 0,
    c = Array.prototype.slice;
  a.cleanData = (function (d) {
    return function (b) {
      var c, e, h;
      for (h = 0; null != (e = b[h]); h++)
        try {
          (c = a._data(e, "events")) &&
            c.remove &&
            a(e).triggerHandler("remove");
        } catch (l) {}
      d(b);
    };
  })(a.cleanData);
  a.widget = function (d, b, c) {
    var e,
      h,
      l,
      k = {},
      m = d.split(".")[0];
    d = d.split(".")[1];
    var p = m + "-" + d;
    return (
      c || ((c = b), (b = a.Widget)),
      a.isArray(c) && (c = a.extend.apply(null, [{}].concat(c))),
      (a.expr[":"][p.toLowerCase()] = function (d) {
        return !!a.data(d, p);
      }),
      (a[m] = a[m] || {}),
      (e = a[m][d]),
      (h = a[m][d] =
        function (a, d) {
          return this._createWidget
            ? (arguments.length && this._createWidget(a, d), void 0)
            : new h(a, d);
        }),
      a.extend(h, e, {
        version: c.version,
        _proto: a.extend({}, c),
        _childConstructors: [],
      }),
      (l = new b()),
      (l.options = a.widget.extend({}, l.options)),
      a.each(c, function (d, c) {
        return a.isFunction(c)
          ? ((k[d] = (function () {
              function a() {
                return b.prototype[d].apply(this, arguments);
              }
              function f(a) {
                return b.prototype[d].apply(this, a);
              }
              return function () {
                var d,
                  b = this._super,
                  g = this._superApply;
                return (
                  (this._super = a),
                  (this._superApply = f),
                  (d = c.apply(this, arguments)),
                  (this._super = b),
                  (this._superApply = g),
                  d
                );
              };
            })()),
            void 0)
          : ((k[d] = c), void 0);
      }),
      (h.prototype = a.widget.extend(
        l,
        { widgetEventPrefix: e ? l.widgetEventPrefix || d : d },
        k,
        { constructor: h, namespace: m, widgetName: d, widgetFullName: p }
      )),
      e
        ? (a.each(e._childConstructors, function (d, b) {
            var c = b.prototype;
            a.widget(c.namespace + "." + c.widgetName, h, b._proto);
          }),
          delete e._childConstructors)
        : b._childConstructors.push(h),
      a.widget.bridge(d, h),
      h
    );
  };
  a.widget.extend = function (d) {
    for (var b, f, e = c.call(arguments, 1), h = 0, l = e.length; l > h; h++)
      for (b in e[h])
        (f = e[h][b]),
          e[h].hasOwnProperty(b) &&
            void 0 !== f &&
            (d[b] = a.isPlainObject(f)
              ? a.isPlainObject(d[b])
                ? a.widget.extend({}, d[b], f)
                : a.widget.extend({}, f)
              : f);
    return d;
  };
  a.widget.bridge = function (d, b) {
    var f = b.prototype.widgetFullName || d;
    a.fn[d] = function (e) {
      var h = "string" == typeof e,
        l = c.call(arguments, 1),
        k = this;
      return (
        h
          ? this.length || "instance" !== e
            ? this.each(function () {
                var b,
                  c = a.data(this, f);
                return "instance" === e
                  ? ((k = c), !1)
                  : c
                  ? a.isFunction(c[e]) && "_" !== e.charAt(0)
                    ? ((b = c[e].apply(c, l)),
                      b !== c && void 0 !== b
                        ? ((k = b && b.jquery ? k.pushStack(b.get()) : b), !1)
                        : void 0)
                    : a.error(
                        "no such method '" +
                          e +
                          "' for " +
                          d +
                          " widget instance"
                      )
                  : a.error(
                      "cannot call methods on " +
                        d +
                        " prior to initialization; attempted to call method '" +
                        e +
                        "'"
                    );
              })
            : (k = void 0)
          : (l.length && (e = a.widget.extend.apply(null, [e].concat(l))),
            this.each(function () {
              var d = a.data(this, f);
              d
                ? (d.option(e || {}), d._init && d._init())
                : a.data(this, f, new b(e, this));
            })),
        k
      );
    };
  };
  a.Widget = function () {};
  a.Widget._childConstructors = [];
  a.Widget.prototype = {
    widgetName: "widget",
    widgetEventPrefix: "",
    defaultElement: "<div>",
    options: { classes: {}, disabled: !1, create: null },
    _createWidget: function (d, c) {
      c = a(c || this.defaultElement || this)[0];
      this.element = a(c);
      this.uuid = b++;
      this.eventNamespace = "." + this.widgetName + this.uuid;
      this.bindings = a();
      this.hoverable = a();
      this.focusable = a();
      this.classesElementLookup = {};
      c !== this &&
        (a.data(c, this.widgetFullName, this),
        this._on(!0, this.element, {
          remove: function (a) {
            a.target === c && this.destroy();
          },
        }),
        (this.document = a(c.style ? c.ownerDocument : c.document || c)),
        (this.window = a(
          this.document[0].defaultView || this.document[0].parentWindow
        )));
      this.options = a.widget.extend(
        {},
        this.options,
        this._getCreateOptions(),
        d
      );
      this._create();
      this.options.disabled && this._setOptionDisabled(this.options.disabled);
      this._trigger("create", null, this._getCreateEventData());
      this._init();
    },
    _getCreateOptions: function () {
      return {};
    },
    _getCreateEventData: a.noop,
    _create: a.noop,
    _init: a.noop,
    destroy: function () {
      var d = this;
      this._destroy();
      a.each(this.classesElementLookup, function (a, b) {
        d._removeClass(b, a);
      });
      this.element.off(this.eventNamespace).removeData(this.widgetFullName);
      this.widget().off(this.eventNamespace).removeAttr("aria-disabled");
      this.bindings.off(this.eventNamespace);
    },
    _destroy: a.noop,
    widget: function () {
      return this.element;
    },
    option: function (d, b) {
      var c,
        e,
        h,
        l = d;
      if (0 === arguments.length) return a.widget.extend({}, this.options);
      if ("string" == typeof d)
        if (((l = {}), (c = d.split(".")), (d = c.shift()), c.length)) {
          e = l[d] = a.widget.extend({}, this.options[d]);
          for (h = 0; c.length - 1 > h; h++)
            (e[c[h]] = e[c[h]] || {}), (e = e[c[h]]);
          if (((d = c.pop()), 1 === arguments.length))
            return void 0 === e[d] ? null : e[d];
          e[d] = b;
        } else {
          if (1 === arguments.length)
            return void 0 === this.options[d] ? null : this.options[d];
          l[d] = b;
        }
      return this._setOptions(l), this;
    },
    _setOptions: function (a) {
      for (var b in a) this._setOption(b, a[b]);
      return this;
    },
    _setOption: function (a, b) {
      return (
        "classes" === a && this._setOptionClasses(b),
        (this.options[a] = b),
        "disabled" === a && this._setOptionDisabled(b),
        this
      );
    },
    _setOptionClasses: function (b) {
      var c, f, e;
      for (c in b)
        (e = this.classesElementLookup[c]),
          b[c] !== this.options.classes[c] &&
            e &&
            e.length &&
            ((f = a(e.get())),
            this._removeClass(e, c),
            f.addClass(
              this._classes({ element: f, keys: c, classes: b, add: !0 })
            ));
    },
    _setOptionDisabled: function (a) {
      this._toggleClass(
        this.widget(),
        this.widgetFullName + "-disabled",
        null,
        !!a
      );
      a &&
        (this._removeClass(this.hoverable, null, "ui-state-hover"),
        this._removeClass(this.focusable, null, "ui-state-focus"));
    },
    enable: function () {
      return this._setOptions({ disabled: !1 });
    },
    disable: function () {
      return this._setOptions({ disabled: !0 });
    },
    _classes: function (b) {
      function c(g, l) {
        var k, m;
        for (m = 0; g.length > m; m++)
          (k = e.classesElementLookup[g[m]] || a()),
            (k = b.add
              ? a(a.unique(k.get().concat(b.element.get())))
              : a(k.not(b.element).get())),
            (e.classesElementLookup[g[m]] = k),
            f.push(g[m]),
            l && b.classes[g[m]] && f.push(b.classes[g[m]]);
      }
      var f = [],
        e = this;
      return (
        (b = a.extend(
          { element: this.element, classes: this.options.classes || {} },
          b
        )),
        this._on(b.element, { remove: "_untrackClassesElement" }),
        b.keys && c(b.keys.match(/\S+/g) || [], !0),
        b.extra && c(b.extra.match(/\S+/g) || []),
        f.join(" ")
      );
    },
    _untrackClassesElement: function (b) {
      var c = this;
      a.each(c.classesElementLookup, function (f, e) {
        -1 !== a.inArray(b.target, e) &&
          (c.classesElementLookup[f] = a(e.not(b.target).get()));
      });
    },
    _removeClass: function (a, b, c) {
      return this._toggleClass(a, b, c, !1);
    },
    _addClass: function (a, b, c) {
      return this._toggleClass(a, b, c, !0);
    },
    _toggleClass: function (a, b, c, e) {
      e = "boolean" == typeof e ? e : c;
      var h = "string" == typeof a || null === a;
      a = {
        extra: h ? b : c,
        keys: h ? a : b,
        element: h ? this.element : a,
        add: e,
      };
      return a.element.toggleClass(this._classes(a), e), this;
    },
    _on: function (b, c, f) {
      var e,
        h = this;
      "boolean" != typeof b && ((f = c), (c = b), (b = !1));
      f
        ? ((c = e = a(c)), (this.bindings = this.bindings.add(c)))
        : ((f = c), (c = this.element), (e = this.widget()));
      a.each(f, function (f, k) {
        function m() {
          return b ||
            (!0 !== h.options.disabled &&
              !a(this).hasClass("ui-state-disabled"))
            ? ("string" == typeof k ? h[k] : k).apply(h, arguments)
            : void 0;
        }
        "string" != typeof k &&
          (m.guid = k.guid = k.guid || m.guid || a.guid++);
        var p = f.match(/^([\w:-]*)\s*(.*)$/),
          r = p[1] + h.eventNamespace;
        (p = p[2]) ? e.on(r, p, m) : c.on(r, m);
      });
    },
    _off: function (b, c) {
      c =
        (c || "").split(" ").join(this.eventNamespace + " ") +
        this.eventNamespace;
      b.off(c).off(c);
      this.bindings = a(this.bindings.not(b).get());
      this.focusable = a(this.focusable.not(b).get());
      this.hoverable = a(this.hoverable.not(b).get());
    },
    _delay: function (a, b) {
      var c = this;
      return setTimeout(function () {
        return ("string" == typeof a ? c[a] : a).apply(c, arguments);
      }, b || 0);
    },
    _hoverable: function (b) {
      this.hoverable = this.hoverable.add(b);
      this._on(b, {
        mouseenter: function (b) {
          this._addClass(a(b.currentTarget), null, "ui-state-hover");
        },
        mouseleave: function (b) {
          this._removeClass(a(b.currentTarget), null, "ui-state-hover");
        },
      });
    },
    _focusable: function (b) {
      this.focusable = this.focusable.add(b);
      this._on(b, {
        focusin: function (b) {
          this._addClass(a(b.currentTarget), null, "ui-state-focus");
        },
        focusout: function (b) {
          this._removeClass(a(b.currentTarget), null, "ui-state-focus");
        },
      });
    },
    _trigger: function (b, c, f) {
      var e,
        h = this.options[b];
      if (
        ((f = f || {}),
        (c = a.Event(c)),
        (c.type = (
          b === this.widgetEventPrefix ? b : this.widgetEventPrefix + b
        ).toLowerCase()),
        (c.target = this.element[0]),
        (b = c.originalEvent))
      )
        for (e in b) e in c || (c[e] = b[e]);
      return (
        this.element.trigger(c, f),
        !(
          (a.isFunction(h) && !1 === h.apply(this.element[0], [c].concat(f))) ||
          c.isDefaultPrevented()
        )
      );
    },
  };
  a.each({ show: "fadeIn", hide: "fadeOut" }, function (b, c) {
    a.Widget.prototype["_" + b] = function (f, e, h) {
      "string" == typeof e && (e = { effect: e });
      var l,
        k = e ? (!0 === e || "number" == typeof e ? c : e.effect || c) : b;
      e = e || {};
      "number" == typeof e && (e = { duration: e });
      l = !a.isEmptyObject(e);
      e.complete = h;
      e.delay && f.delay(e.delay);
      l && a.effects && a.effects.effect[k]
        ? f[b](e)
        : k !== b && f[k]
        ? f[k](e.duration, e.easing, h)
        : f.queue(function (c) {
            a(this)[b]();
            h && h.call(f[0]);
            c();
          });
    };
  });
  a.widget;
});
!(function (a, b) {
  var c = b(a, a.document);
  a.lazySizes = c;
  "object" == typeof module && module.exports && (module.exports = c);
})(window, function (a, b) {
  if (b.getElementsByClassName) {
    var c,
      d,
      g = b.documentElement,
      f = a.Date,
      e = a.HTMLPictureElement,
      h = a.addEventListener,
      l = a.setTimeout,
      k = a.requestAnimationFrame || l,
      m = a.requestIdleCallback,
      p = /^picture$/i,
      r = ["load", "error", "lazyincluded", "_lazyloaded"],
      t = {},
      T = Array.prototype.forEach,
      A = function (a, b) {
        return (
          t[b] || (t[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")),
          t[b].test(a.getAttribute("class") || "") && t[b]
        );
      },
      H = function (a, b) {
        A(a, b) ||
          a.setAttribute(
            "class",
            (a.getAttribute("class") || "").trim() + " " + b
          );
      },
      P = function (a, b) {
        var c;
        (c = A(a, b)) &&
          a.setAttribute(
            "class",
            (a.getAttribute("class") || "").replace(c, " ")
          );
      },
      u = function (a, b, c) {
        var d = c ? "addEventListener" : "removeEventListener";
        c && u(a, b);
        r.forEach(function (c) {
          a[d](c, b);
        });
      },
      F = function (a, d, e, f, g) {
        var h = b.createEvent("Event");
        return (
          e || (e = {}),
          (e.instance = c),
          h.initEvent(d, !f, !g),
          (h.detail = e),
          a.dispatchEvent(h),
          h
        );
      },
      Q = function (b, c) {
        var f;
        !e && (f = a.picturefill || d.pf)
          ? (c &&
              c.src &&
              !b.getAttribute("srcset") &&
              b.setAttribute("srcset", c.src),
            f({ reevaluate: !0, elements: [b] }))
          : c && c.src && (b.src = c.src);
      },
      I = function (a, b, c) {
        for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth; )
          (c = b.offsetWidth), (b = b.parentNode);
        return c;
      },
      G = (function () {
        var a,
          c,
          d = [],
          e = [],
          f = d,
          g = function () {
            var b = f;
            f = d.length ? e : d;
            a = !0;
            for (c = !1; b.length; ) b.shift()();
            a = !1;
          },
          h = function (d, e) {
            a && !e
              ? d.apply(this, arguments)
              : (f.push(d), c || ((c = !0), (b.hidden ? l : k)(g)));
          };
        return (h._lsFlush = g), h;
      })(),
      J = function (a, b) {
        return b
          ? function () {
              G(a);
            }
          : function () {
              var b = this,
                c = arguments;
              G(function () {
                a.apply(b, c);
              });
            };
      },
      ba = function (a) {
        var b,
          c = 0,
          e = d.throttleDelay,
          g = d.ricTimeout,
          h = function () {
            b = !1;
            c = f.now();
            a();
          },
          k =
            m && 49 < g
              ? function () {
                  m(h, { timeout: g });
                  g !== d.ricTimeout && (g = d.ricTimeout);
                }
              : J(function () {
                  l(h);
                }, !0);
        return function (a) {
          var d;
          (a = !0 === a) && (g = 33);
          b ||
            ((b = !0),
            (d = e - (f.now() - c)),
            0 > d && (d = 0),
            a || 9 > d ? k() : l(k, d));
        };
      },
      W = function (a) {
        var b,
          c,
          d = function () {
            b = null;
            a();
          },
          e = function () {
            var a = f.now() - c;
            99 > a ? l(e, 99 - a) : (m || d)(d);
          };
        return function () {
          c = f.now();
          b || (b = l(e, 99));
        };
      };
    !(function () {
      var b,
        c = {
          lazyClass: "lazyload",
          loadedClass: "lazyloaded",
          loadingClass: "lazyloading",
          preloadClass: "lazypreload",
          errorClass: "lazyerror",
          autosizesClass: "lazyautosizes",
          srcAttr: "data-src",
          srcsetAttr: "data-srcset",
          sizesAttr: "data-sizes",
          minSize: 40,
          customMedia: {},
          init: !0,
          expFactor: 1.5,
          hFac: 0.8,
          loadMode: 2,
          loadHidden: !0,
          ricTimeout: 0,
          throttleDelay: 125,
        };
      d = a.lazySizesConfig || a.lazysizesConfig || {};
      for (b in c) b in d || (d[b] = c[b]);
      a.lazySizesConfig = d;
      l(function () {
        d.init && y();
      });
    })();
    var O = (function () {
        var e,
          k,
          m,
          t,
          q,
          U,
          V,
          v,
          C,
          D,
          r,
          y,
          I = /^img$/i,
          O = /^iframe$/i,
          ca = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent),
          K = 0,
          w = 0,
          E = -1,
          L = function (a) {
            w--;
            a && a.target && u(a.target, L);
            (!a || 0 > w || !a.target) && (w = 0);
          },
          X = function (a) {
            return (
              null == y &&
                (y =
                  "hidden" ==
                  (getComputedStyle(b.body, null) || {}).visibility),
              y ||
                ("hidden" !=
                  (getComputedStyle(a.parentNode, null) || {}).visibility &&
                  "hidden" != (getComputedStyle(a, null) || {}).visibility)
            );
          },
          Y = function () {
            var a,
              f,
              h,
              l,
              m,
              q,
              p,
              n,
              A,
              z,
              R,
              x = c.elements;
            if ((t = d.loadMode) && 8 > w && (a = x.length)) {
              f = 0;
              E++;
              h =
                !d.expand || 1 > d.expand
                  ? 500 < g.clientHeight && 500 < g.clientWidth
                    ? 500
                    : 370
                  : d.expand;
              z = h * d.expFactor;
              R = d.hFac;
              y = null;
              for (
                K < z && 1 > w && 2 < E && 2 < t && !b.hidden
                  ? ((K = z), (E = 0))
                  : (K = 1 < t && 1 < E && 6 > w ? h : 0);
                f < a;
                f++
              )
                if (x[f] && !x[f]._lazyRace)
                  if (ca) {
                    ((n = x[f].getAttribute("data-expand")) && (q = 1 * n)) ||
                      (q = K);
                    A !== q &&
                      ((U = innerWidth + q * R),
                      (V = innerHeight + q),
                      (p = -1 * q),
                      (A = q));
                    h = x[f].getBoundingClientRect();
                    if (
                      (h =
                        (r = h.bottom) >= p &&
                        (v = h.top) <= V &&
                        (D = h.right) >= p * R &&
                        (C = h.left) <= U &&
                        (r || D || C || v) &&
                        (d.loadHidden || X(x[f]))) &&
                      !(h = k && 3 > w && !n && (3 > t || 4 > E))
                    ) {
                      var u = x[f];
                      h = q;
                      z = void 0;
                      var B = u,
                        u = X(u);
                      v -= h;
                      r += h;
                      C -= h;
                      for (
                        D += h;
                        u && (B = B.offsetParent) && B != b.body && B != g;

                      )
                        (u =
                          0 <
                          ((getComputedStyle(B, null) || {}).opacity || 1)) &&
                          "visible" !=
                            (getComputedStyle(B, null) || {}).overflow &&
                          ((z = B.getBoundingClientRect()),
                          (u =
                            D > z.left &&
                            C < z.right &&
                            r > z.top - 1 &&
                            v < z.bottom + 1));
                      h = u;
                    }
                    if (h) {
                      if ((M(x[f]), (m = !0), 9 < w)) break;
                    } else
                      !m &&
                        k &&
                        !l &&
                        4 > w &&
                        4 > E &&
                        2 < t &&
                        (e[0] || d.preloadAfterLoad) &&
                        (e[0] ||
                          (!n &&
                            (r ||
                              D ||
                              C ||
                              v ||
                              "auto" != x[f].getAttribute(d.sizesAttr)))) &&
                        (l = e[0] || x[f]);
                  } else M(x[f]);
              l && !m && M(l);
            }
          },
          n = ba(Y),
          aa = function (a) {
            H(a.target, d.loadedClass);
            P(a.target, d.loadingClass);
            u(a.target, Z);
            F(a.target, "lazyloaded");
          },
          da = J(aa),
          Z = function (a) {
            da({ target: a.target });
          },
          ea = function (a, b) {
            try {
              a.contentWindow.location.replace(b);
            } catch (c) {
              a.src = b;
            }
          },
          fa = function (a) {
            var b,
              c = a.getAttribute(d.srcsetAttr);
            (b =
              d.customMedia[
                a.getAttribute("data-media") || a.getAttribute("media")
              ]) && a.setAttribute("media", b);
            c && a.setAttribute("srcset", c);
          },
          ga = J(function (a, b, c, f, e) {
            var g, h, k, q, n, v;
            (n = F(a, "lazybeforeunveil", b)).defaultPrevented ||
              (f && (c ? H(a, d.autosizesClass) : a.setAttribute("sizes", f)),
              (h = a.getAttribute(d.srcsetAttr)),
              (g = a.getAttribute(d.srcAttr)),
              e && ((k = a.parentNode), (q = k && p.test(k.nodeName || ""))),
              (v = b.firesLoad || ("src" in a && (h || g || q))),
              (n = { target: a }),
              v &&
                (u(a, L, !0),
                clearTimeout(m),
                (m = l(L, 2500)),
                H(a, d.loadingClass),
                u(a, Z, !0)),
              q && T.call(k.getElementsByTagName("source"), fa),
              h
                ? a.setAttribute("srcset", h)
                : g && !q && (O.test(a.nodeName) ? ea(a, g) : (a.src = g)),
              e && (h || q) && Q(a, { src: g }));
            a._lazyRace && delete a._lazyRace;
            P(a, d.lazyClass);
            G(function () {
              (!v || (a.complete && 1 < a.naturalWidth)) &&
                (v ? L(n) : w--, aa(n));
            }, !0);
          }),
          M = function (a) {
            var b,
              c = I.test(a.nodeName),
              f = c && (a.getAttribute(d.sizesAttr) || a.getAttribute("sizes")),
              e = "auto" == f;
            ((!e && k) ||
              !c ||
              (!a.getAttribute("src") && !a.srcset) ||
              a.complete ||
              A(a, d.errorClass) ||
              !A(a, d.lazyClass)) &&
              ((b = F(a, "lazyunveilread").detail),
              e && S.updateElem(a, !0, a.offsetWidth),
              (a._lazyRace = !0),
              w++,
              ga(a, b, e, f, c));
          },
          N = function () {
            if (!k) {
              if (999 > f.now() - q) return void l(N, 999);
              var a = W(function () {
                d.loadMode = 3;
                n();
              });
              k = !0;
              d.loadMode = 3;
              n();
              h(
                "scroll",
                function () {
                  3 == d.loadMode && (d.loadMode = 2);
                  a();
                },
                !0
              );
            }
          };
        return {
          _: function () {
            q = f.now();
            c.elements = b.getElementsByClassName(d.lazyClass);
            e = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass);
            h("scroll", n, !0);
            h("resize", n, !0);
            a.MutationObserver
              ? new MutationObserver(n).observe(g, {
                  childList: !0,
                  subtree: !0,
                  attributes: !0,
                })
              : (g.addEventListener("DOMNodeInserted", n, !0),
                g.addEventListener("DOMAttrModified", n, !0),
                setInterval(n, 999));
            h("hashchange", n, !0);
            "focus mouseover click load transitionend animationend webkitAnimationEnd"
              .split(" ")
              .forEach(function (a) {
                b.addEventListener(a, n, !0);
              });
            /d$|^c/.test(b.readyState)
              ? N()
              : (h("load", N),
                b.addEventListener("DOMContentLoaded", n),
                l(N, 2e4));
            c.elements.length ? (Y(), G._lsFlush()) : n();
          },
          checkElems: n,
          unveil: M,
        };
      })(),
      S = (function () {
        var a,
          c = J(function (a, b, c, d) {
            var e, f;
            if (
              ((a._lazysizesWidth = d),
              (d += "px"),
              a.setAttribute("sizes", d),
              p.test(b.nodeName || ""))
            )
              for (
                b = b.getElementsByTagName("source"), e = 0, f = b.length;
                e < f;
                e++
              )
                b[e].setAttribute("sizes", d);
            c.detail.dataAttr || Q(a, c.detail);
          }),
          e = function (a, b, d) {
            var e,
              f = a.parentNode;
            f &&
              ((d = I(a, f, d)),
              (e = F(a, "lazybeforesizes", { width: d, dataAttr: !!b })),
              e.defaultPrevented ||
                ((d = e.detail.width) &&
                  d !== a._lazysizesWidth &&
                  c(a, f, e, d)));
          },
          f = W(function () {
            var b,
              c = a.length;
            if (c) for (b = 0; b < c; b++) e(a[b]);
          });
        return {
          _: function () {
            a = b.getElementsByClassName(d.autosizesClass);
            h("resize", f);
          },
          checkElems: f,
          updateElem: e,
        };
      })(),
      y = function () {
        y.i || ((y.i = !0), S._(), O._());
      };
    return (c = {
      cfg: d,
      autoSizer: S,
      loader: O,
      init: y,
      uP: Q,
      aC: H,
      rC: P,
      hC: A,
      fire: F,
      gW: I,
      rAF: G,
    });
  }
});
document.addEventListener("lazybeforeunveil", function (a) {
  var b = a.target.getAttribute("data-bg")
  b && (a.target.style.backgroundImage = "url(" + b + ")");
});
jQuery.widget("gc.animatedBlock", {
  SCROLL_HANDLE_TIMEOUT: 400,
  SCREEN_BOTTOM_GAP: 50,
  ANIMATION_DELAY: 300,
  ANIMATION_ORDER_IN_TURN: "in-turn",
  ANIMATION_ORDER_AT_ONCE: "at-once",
  ANIMATION_MODE_APPEAR: "appear",
  ANIMATION_MODE_INCREASE: "increase",
  ANIMATION_MODE_SLIDE_FROM_LEFT: "slide-from-left",
  ANIMATION_MODE_SLIDE_FROM_RIGHT: "slide-from-right",
  ANIMATION_MODE_SLIDE_FROM_TOP: "slide-from-top",
  ANIMATION_MODE_SLIDE_FROM_BOTTOM: "slide-from-bottom",
  timerId: null,
  phantomTimerId: null,
  _create: function () {
    1024 > $(window).width()
      ? this.element.find(".animated-element").removeClass("animated-element")
      : (this.setScrollHandler(),
        setTimeout(function () {
          $(window).scroll();
        }, this.ANIMATION_DELAY));
  },
  setScrollHandler: function () {
    var a = this;
    $(window).scroll(function (b) {
      a.timerId
        ? a.phantomTimerId ||
          (a.phantomTimerId = setTimeout(function () {
            a.phantomTimerId = null;
            a.recalculateAnimation();
          }, a.SCROLL_HANDLE_TIMEOUT))
        : (clearTimeout(a.phantomTimerId),
          (a.phantomTimerId = null),
          (a.timerId = setTimeout(function () {
            a.timerId = null;
          }, a.SCROLL_HANDLE_TIMEOUT)),
          a.recalculateAnimation());
    });
  },
  animateElement: function (a) {
    a.removeClass("before-animation");
    var b = 1e3 * parseFloat(a.css("transition-duration"));
    setTimeout(function () {
      a.removeClass("animated-element");
    }, b);
  },
  recalculateAnimation: function () {
    var a = this,
      b = $(window).scrollTop(),
      c = b + $(window).height() - a.SCREEN_BOTTOM_GAP,
      d = a.element.data("animation-order"),
      g = 0;
    a.element
      .find(".animated-element.before-animation")
      .not(".animation-will-start-soon")
      .each(function () {
        var f = $(this);
        a.isOnScreen(f, b, c) &&
          (d === a.ANIMATION_ORDER_AT_ONCE
            ? a.animateElement(f)
            : (f.addClass("animation-will-start-soon"),
              setTimeout(function () {
                f.removeClass("animation-will-start-soon");
                a.animateElement(f);
              }, g),
              (g += a.ANIMATION_DELAY)));
      });
  },
  isOnScreen: function (a, b, c) {
    var d = parseInt(a.css("transform").split(",")[5]);
    0 !== d && (c += d);
    d = a.offset().top;
    return b < d + a.height() && d < c;
  },
});
function ajaxCall(a, b, c, d, g) {
  c || (c = {});
  var f = void 0 === c.suppressErrors ? !1 : c.suppressErrors,
    e = void 0 === c.enableCsrf ? !1 : c.enableCsrf,
    h = void 0 === c.enableSimpleSign ? !1 : c.enableSimpleSign,
    l = c.suppressNotify || !1;
  c.btn && c.btn.attr("disabled", "disabled");
  var k = "post";
  c.method && (k = c.method);
  e &&
    void 0 !== window.csrfToken &&
    ("object" === typeof b
      ? (b.csrfToken = window.csrfToken)
      : "string" === typeof b && (b += "&csrfToken=" + window.csrfToken));
  h &&
    void 0 !== window.requestTime &&
    void 0 !== window.requestSimpleSign &&
    ("object" === typeof b
      ? ((b.requestTime = window.requestTime),
        (b.requestSimpleSign = window.requestSimpleSign))
      : "string" === typeof b &&
        ((b += "&requestTime=" + window.requestTime),
        (b += "&requestSimpleSign=" + window.requestSimpleSign)));
  if ("undefined" !== typeof Storage)
    try {
      var m = localStorage.getItem("session"),
        p = localStorage.getItem("visit"),
        r = localStorage.getItem("visitor"),
        t = localStorage.getItem("hash");
      m &&
        t &&
        ("object" === typeof b
          ? ((b.gcSession = m),
            (b.gcVisit = p),
            (b.gcVisitor = r),
            (b.gcSessionHash = t))
          : "string" === typeof b &&
            ((b += "&gcSession=" + m),
            (b += "&gcVisit=" + p),
            (b += "&gcVisitor=" + r),
            (b += "&gcSessionHash=" + t)));
    } catch (T) {}
  e = !0;
  !1 === c.async && (e = !1);
  a = {
    url: a,
    type: k,
    data: b,
    async: e,
    complete: function (a, b) {
      error_text_value = "\u041e\u0448\u0438\u0431\u043a\u0430";
      "undefined" != typeof Yii &&
        (error_text_value = Yii.t("common", "Error"));
      c.btn && c.btn.removeAttr("disabled");
      if ("success" == b)
        if (((response = $.parseJSON(a.responseText)), response.success)) {
          if (!l && response.message && 0 < response.message.length) {
            var e = response.message,
              h = { type: "success" };
            $.toast ? $.toast(e, h) : console.log(e);
          }
          d && d(response);
        } else
          f ||
            ($.toast
              ? $.toast(error_text_value + ": " + response.message, {
                  type: "danger",
                })
              : alert(response.message));
      else {
        if (0 == a.readyState) return;
        f ||
          ($.toast
            ? $.toast(error_text_value + ": " + a.statusText, {
                type: "danger",
              })
            : alert(response.message));
        console.error("error", a.statusText);
        console.error(a.responseText);
      }
      g && g();
    },
  };
  c.crossDomain && (a.crossDomain = !0);
  $.ajax(a);
}
function bodyScrollTo(a, b) {
  null == b && (b = 400);
  a.offset() &&
    $("body,html").animate({ scrollTop: Math.round(a.offset().top) - b }, 200);
}
function initUploadify(a, b) {
  var c =
    "\u0414\u043e\u0431\u0430\u0432\u0438\u0442\u044c \u0444\u0430\u0439\u043b\u044b";
  a.attr("title") && (c = a.attr("title"));
  var d = {
    auto: !0,
    buttonText: b.buttonText ? b.buttonText : c,
    width: b.width ? b.width : 200,
    fileSizeLimit: b.fileSizeLimit ? b.fileSizeLimit : "2GB",
    formData: { userId: b.userId },
    uploadScript: b.url
      ? b.url
      : "/fileservice/widget/upload?deprecated=32&secure=" +
        window.isEnabledSecureUpload +
        "&host=" +
        window.fileserviceUploadHost,
    onUploadError: function (a, b, c) {
      alert("ERROR");
    },
    onUploadComplete: b.onUploadComplete
      ? b.onUploadComplete
      : function (a, c) {
          $hiddenInputEl = $(b.valueElemSelector);
          (newVal = oldVal = $hiddenInputEl.val()) &&
            0 < newVal.length &&
            (newVal += ",");
          newVal += c;
          $hiddenInputEl.val(newVal);
        },
    multi: b.hasOwnProperty("multi") ? b.multi : !0,
  };
  b.onQueueComplete && (d.onQueueComplete = b.onQueueComplete);
  b.onUpload
    ? (d.onUpload = b.onUpload)
    : window.isEnabledSecureUpload &&
      window.fileserviceUploadHost &&
      (d.onUpload = getUploadifySecretLink);
  b.other &&
    $.each(b.other, function (a, b) {
      d[a] = b;
    });
  a.uploadifive(d);
  b.fileSizeLimit &&
    ((c = $(
      "<p class='text-muted'>" +
        (b.fileSizeLimitWarning
          ? b.fileSizeLimitWarning
          : "\u041c\u0430\u043a\u0441. \u0440\u0430\u0437\u043c\u0435\u0440 2 \u0413\u0411") +
        "</p>"
    )),
    a.parent().after(c));
}
window.errCount = 0;
function sendError(a) {
  window.errCount++;
  10 >= window.errCount &&
    $.ajax({ url: "/pl/gc/log", method: "POST", data: { data: a } });
}
function sendCreateLinkError(a, b, c) {
  var d = "";
  a.responseJSON &&
    (d += a.responseJSON ? "json: " + JSON.stringify(a.responseJSON) : "");
  d += "status: " + a.status + " /// ";
  d += a.statusText ? "statusText: " + a.statusText + " /// " : "";
  d =
    d + (b ? "message: " + b + " /// " : "") + (c ? "exc: " + c + " /// " : "");
  console.log(d);
  sendError(d);
}
function getUploadifySecretLink(a, b) {
  $.ajax({
    url: "/fileservice/widget/create-secret-link",
    method: "GET",
    data: {
      host: window.fileserviceUploadHost,
      uri: "/fileservice/widget/secure-direct-upload",
      expires: 600,
    },
    success: function (a) {
      a.link
        ? (b.uploadScript = a.link)
        : ajaxCall("/fileservice/widget/log-error", { m: "No link" }, {});
    },
    error: function (a, b, g) {
      sendCreateLinkError(a, b, g);
    },
    async: !1,
  });
}
function panelPutTaskAside(a) {
  $(".aside-loading").css("opacity", 1);
  $(".aside-link").css("opacity", 0).css("cursor", "default");
  $.ajax({
    url: "/tasks/control/task/setNew",
    method: "post",
    data: { id: a },
    success: function (a) {
      panelLoad();
    },
  });
}
function panelFinishTask(a, b) {
  $(".aside-loading").css("opacity", 1);
  $.ajax({
    url: "/tasks/control/task/setCompleted",
    method: "post",
    data: { id: a, result: b },
    success: function (a) {
      panelLoad();
    },
  });
  return !1;
}
function panelLoad() {
  $.ajax({
    url: "/tasks/control/task/getPanel",
    success: function (a) {
      $("#task-panel-placeholder").html(a);
    },
  });
}
function setElLoading(a) {
  $(a).html(
    '<div class="text-center padding-10"><img src="/public/img/loading.gif"></div>'
  );
}
$(function () {
  $(".editable .edit-link").click(function () {
    $(this).parents(".editable").toggleClass("edit");
    $(this).parents(".editable").find("input").focus();
  });
});
$(function () {
  $(".action-link").click(function () {
    if ($(this).data("gc-confirm") && !confirm($(this).data("gc-confirm")))
      return !1;
    $(".page-main-form").find("input[name=action]").val($(this).data("action"));
    $(".page-main-form").submit();
  });
});
function extend(a, b) {
  var c = function () {};
  c.prototype = b.prototype;
  a.prototype = new c();
  a.prototype.constructor = a;
  a.superclass = b.prototype;
}
function mixin(a, b) {
  for (var c in b) a.prototype[c] || (a.prototype[c] = b[c]);
}
$(function () {
  $(".date-input").datetimepicker &&
    ($(".date-input").datetimepicker({
      timepicker: !1,
      closeOnDateSelect: !0,
      format: "d.m.Y",
      step: 20,
      lang: "ru",
      dayOfWeekStart: 1,
      todayButton: !1,
      validateOnBlur: !0,
      allowBlank: !0,
      yearStart: "2013",
      yearEnd: "2020",
      lazyInit: !1,
    }),
    $(".date-time-input").datetimepicker({
      timepicker: !0,
      closeOnDateSelect: !1,
      format: "d.m.Y H:i",
      step: 20,
      lang: "ru",
      dayOfWeekStart: 1,
      todayButton: !1,
      validateOnBlur: !0,
      allowBlank: !0,
      yearStart: "2013",
      yearEnd: "2020",
      lazyInit: !1,
    }));
});
$.fn.scrollTo = function (a, b, c) {
  "function" == typeof b && 2 == arguments.length && ((c = b), (b = a));
  var d = $.extend(
    { scrollTarget: a, offsetTop: 50, duration: 500, easing: "swing" },
    b
  );
  return this.each(function () {
    var a = $(this),
      b =
        "number" == typeof d.scrollTarget ? d.scrollTarget : $(d.scrollTarget),
      b =
        "number" == typeof b
          ? b
          : b.offset().top + a.scrollTop() - parseInt(d.offsetTop);
    a.animate({ scrollTop: b }, parseInt(d.duration), d.easing, function () {
      "function" == typeof c && c.call(this);
    });
  });
};
function getThumbnailUrl(a, b, c) {
  a = "/fileservice/file/thumbnail/h/" + a + "/s/" + b + "x" + c;
  window.accountId && (a += "/a/" + window.accountId);
  window.fileserviceThumbnailHost &&
    (a = "//" + window.fileserviceThumbnailHost + a);
  return a;
}
function getBorderedThumbnailUrl(a, b, c, d) {
  if ("" == d) return getThumbnailUrl(a, b, c);
  a = "/fileservice/file/bordered/h/" + a + "/s/" + b + "x" + c + "/b/" + d;
  window.accountId && (a += "/a/" + window.accountId);
  window.fileserviceThumbnailHost &&
    (a = "//" + window.fileserviceThumbnailHost + a);
  return a;
}
function getDownloadUrl(a) {
  return "/pl/fileservice/user/file/download?h=" + a;
}
function isImage(a) {
  a = a.split(".");
  return 2 === a.length ? ["jpeg", "jpg", "gif", "png"].includes(a[1]) : !1;
}
function isVideo(a) {
  a = a.toLowerCase().split(".");
  return 2 === a.length ? ["mp4", "mov"].includes(a[1]) : !1;
}
function updateThumbnailVersion(a, b) {
  window.thumbnailVersions || (window.thumbnailVersions = {});
  window.thumbnailVersions[a] = b;
}
function getVideoThumbnailUrl(a, b, c) {
  b = "/pl/fileservice/video/preview-redirect/?file-hash=" + a;
  window.thumbnailVersions &&
    a in window.thumbnailVersions &&
    (b += "&v=" + window.thumbnailVersions[a]);
  return b;
}
function gcGetFileObj(a) {
  var b = a.title;
  b || (b = a.filename);
  b || (b = a.hash);
  return {
    hash: a.hash,
    title: b,
    description: a.description,
    getThumbnailUrl: function (a, b) {
      return "/fileservice/file/thumbnail/h/" + this.hash + "/s/" + a + "x" + b;
    },
    getDownloadUrl: function () {
      return "/pl/fileservice/user/file/download?h=" + this.hash;
    },
  };
}
var getProp = function (a, b, c) {
  return void 0 === a[b] ? c : a[b];
};
$(function () {
  if (0 == $("#blueimp-gallery").length) {
    var a = $(
      '<div id="blueimp-gallery" class="blueimp-gallery blueimp-gallery-controls"><div class="slides next-click"></div><h3 class="title"></h3><a class="prev">\u2039</a><a class="next next-click">\u203a</a><a class="play-pause"></a><ol class="indicator"></ol></div>'
    );
    a.hide();
    a.appendTo($(document.body));
  }
});
$(function () {
  $(".editable-link").each(function (a, b) {
    $el = $(b);
    $wrapper = $el.parents(".editable-link-wrapper");
    0 == $wrapper.length &&
      (($wrapper = $('<span class="editable-link-wrapper"/>')),
      $el.replaceWith($wrapper),
      $el.appendTo($wrapper));
    $link = $('<a class="link"/>');
    $el.data("header")
      ? (($header = $("<h1/>")),
        $link.appendTo($header),
        $header.appendTo($wrapper))
      : $link.appendTo($wrapper);
    var c = null;
    "" != $el.val()
      ? (c = $el.val())
      : $el.attr("placeholder") && "" != $el.attr("placeholder")
      ? (c = $el.attr("placeholder"))
      : ((c = "\u0438\u0437\u043c\u0435\u043d\u0438\u0442\u044c"),
        "undefined" != typeof Yii && (c = Yii.t("common", "change")),
        $wrapper.addClass("no-value"));
    $link.html(c);
    $link.click(function () {
      $(this).parents(".editable-link-wrapper").addClass("edit-mode");
    });
  });
});
window.runOneTimeOnElement = function (a, b, c) {
  a.data(b) || a.data(b, c(a));
};
window.eachAndRunOneTimeOnElement = function (a, b, c) {
  a.each(function (a, g) {
    runOneTimeOnElement($(g), b, c);
  });
};
function objectToQueryString(a) {
  var b, c, d, g;
  c = [];
  d = function (a, b) {
    b = "function" == typeof b ? b() : null == b ? "" : b;
    c[c.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
  };
  if (a instanceof Array) for (g in a) d(g, a[g]);
  else for (b in a) buildParams(b, a[b], d);
  return c.join("&").replace(/%20/g, "+");
}
function buildParams(a, b, c) {
  var d, g, f;
  f = /\[\]$/;
  if (b instanceof Array)
    for (d = 0, g = b.length; d < g; d++)
      f.test(a)
        ? c(a, b[d])
        : buildParams(
            a + "[" + ("object" === typeof b[d] ? d : "") + "]",
            b[d],
            c
          );
  else if ("object" == typeof b)
    for (d in b) buildParams(a + "[" + d + "]", b[d], c);
  else c(a, b);
}
$.fn.serializeObject = function () {
  var a = {},
    b = this.serializeArray();
  $.each(b, function () {
    void 0 !== a[this.name]
      ? (a[this.name].push || (a[this.name] = [a[this.name]]),
        a[this.name].push(this.value || ""))
      : (a[this.name] = this.value || "");
  });
  return a;
};
window.gcIsHiddenTab = function () {
  var a;
  "undefined" !== typeof document.hidden
    ? (a = "visibilityState")
    : "undefined" !== typeof document.mozHidden
    ? (a = "mozVisibilityState")
    : "undefined" !== typeof document.msHidden
    ? (a = "msVisibilityState")
    : "undefined" !== typeof document.webkitHidden &&
      (a = "webkitVisibilityState");
  return "hidden" == document[a];
};
window.gcIsActiveTab = !window.gcIsHiddenTab();
$(window).focus(function () {
  window.gcIsActiveTab = !0;
});
$(window).blur(function () {
  window.gcIsActiveTab = !1;
});
window.gcGetCookie = function (a) {
  return (a = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        a.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  ))
    ? decodeURIComponent(a[1])
    : void 0;
};
window.gcSetCookie = function (a, b, c) {
  c = c || {};
  var d = c.expires;
  if ("number" == typeof d && d) {
    var g = new Date();
    g.setTime(g.getTime() + 1e3 * d);
    d = c.expires = g;
  }
  d && d.toUTCString && (c.expires = d.toUTCString());
  b = encodeURIComponent(b);
  a = a + "=" + b;
  for (var f in c) (a += "; " + f), (b = c[f]), !0 !== b && (a += "=" + b);
  document.cookie = a;
};
function addParamToLocation(a, b) {
  a = encodeURI(a);
  b = encodeURI(b);
  for (
    var c = document.location.search.substr(1).split("&"), d = c.length, g;
    d--;

  )
    if (((g = c[d].split("=")), g[0] == a)) {
      g[1] = b;
      c[d] = g.join("=");
      break;
    }
  0 > d && (c[c.length] = [a, b].join("="));
  document.location.search = c.join("&");
}
function removeParamFromLocation(a) {
  a = encodeURI(a);
  for (
    var b = document.location.search.substr(1).split("&"), c = b.length, d;
    c--;

  )
    if (((d = b[c].split("=")), d[0] == a)) {
      b[c] = null;
      break;
    }
  a = "&" != b.join("&") ? b.join("&") : "";
  document.location.search = a;
}
function escapeDoubleQuotes(a) {
  return a.replace(/\\([\s\S])|(")/g, "\\$1$2");
}
function setVisibilityRelation(a, b) {
  var c = $(a),
    d = $(b),
    g = function () {
      c.prop("checked") ? d.show() : d.hide();
    };
  c.click(g);
  g();
}
function getParamFromLocation(a) {
  a = encodeURI(a);
  for (
    var b = document.location.search.substr(1).split("&"), c = b.length, d;
    c--;

  )
    if (((d = b[c].split("=")), d[0] == a)) return d[1];
  return null;
}
function getParamFromHash(a) {
  a = encodeURI(a);
  for (
    var b = document.location.hash.substr(1).split("&"), c = b.length, d;
    c--;

  )
    if (((d = b[c].split("=")), d[0] == a)) return d[1];
  return null;
}
var gcParseUrl = function (a) {
    var b = document.createElement("a");
    b.href = a;
    return b;
  },
  gcAddResourceElement = function (a, b, c) {
    var d = {};
    return function (g) {
      if (!d.hasOwnProperty(g)) {
        for (
          var f = document.getElementsByTagName(a), e = f.length, h = !1;
          e--;

        ) {
          var l = gcParseUrl(f[e][b]);
          if (l.pathname + l.search == g) {
            h = !0;
            break;
          }
        }
        h || ((d[g] = c(g)), console.log("loaded " + g));
      }
    };
  },
  gcAddScriptElement = (function () {
    return gcAddResourceElement("script", "src", function (a) {
      var b = document.createElement("script");
      b.type = "text/javascript";
      b.src = a;
      document.getElementsByTagName("head")[0].appendChild(b);
      return b;
    });
  })(),
  gcAddLinkElement = (function () {
    return gcAddResourceElement("link", "href", function (a) {
      var b = document.createElement("link");
      b.rel = "stylesheet";
      b.src = a;
      document.getElementsByTagName("head")[0].appendChild(b);
      return b;
    });
  })();
function replaceAll(a, b, c) {
  return a.replace(new RegExp(b, "g"), c);
}
serializeObj = function (a, b) {
  var c = [],
    d;
  for (d in a)
    if (a.hasOwnProperty(d)) {
      var g = b ? b + "[" + d + "]" : d,
        f = a[d];
      "undefined" !== typeof f &&
        null != f &&
        c.push(
          null !== f && "object" === typeof f
            ? serializeObj(f, g)
            : encodeURIComponent(g) + "=" + encodeURIComponent(f)
        );
    }
  return c.join("&");
};
function addGlobalCheckbox(a) {
  var b = !1;
  0 < a.find(".register-form.state-form").length &&
    ((a = a.find(".register-form.state-form")), (b = !0));
  0 < a.find(".form-content").length && (a = a.find(".form-content"));
  if (window.globalCheckboxEnabled) {
    var c = $(
        '<div class="global-confirm-checkbox-block"><label><input class="global-confirm-checkbox" type="checkbox" ' +
          (window.persodataConfirm ? "checked" : "") +
          ' name="globalConfirmCheckbox" > <span class="checkbox-text">' +
          window.globalCheckboxText +
          "</span></label></div>"
      ),
      d = c.find(".global-confirm-checkbox");
    a.find("button[type=submit]");
    c.appendTo(a);
  }
  return function (a) {
    if (window.globalCheckboxEnabled && !d.prop("checked")) {
      if (b && (!a || "register" != a.state)) return !0;
      a =
        "To submit the form, you must agree to the terms and conditions for processing personal data. Check the checkbox";
      "undefined" != typeof Yii && (a = Yii.t("common", a));
      alert(a);
      return !1;
    }
    return !0;
  };
}
function initListSearch(a, b) {
  var c = function (c) {
      c = c.toLowerCase();
      var d = !1;
      a.find(b).each(function () {
        var a = $(this).html().toLowerCase();
        "" == c
          ? ($(this).show(), (d = !0))
          : -1 < a.indexOf(c)
          ? ($(this).show(), (d = !0))
          : $(this).hide();
      });
      return d;
    },
    d = "\u043f\u043e\u0438\u0441\u043a",
    g =
      "\u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e";
  "undefined" != typeof Yii &&
    ((d = Yii.t("common", "search")),
    (g = Yii.t(
      "common",
      "\u043d\u0438\u0447\u0435\u0433\u043e \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e"
    )));
  var f = $(
    "<li style='margin: 0; list-style: none; padding: 5px 3px;'><input class='search-input' placeholder='" +
      d +
      "' type='text'/><div class='nothing-found-label' style='padding-top: 10px; background: lightyellow; display:none'>" +
      g +
      "</div></li>"
  );
  f.prependTo(a);
  f.find("input").keyup(function () {
    c($(this).val())
      ? f.find(".nothing-found-label").hide()
      : f.find(".nothing-found-label").show();
  });
}
function initDropdownSearch(a) {
  a = a.find(".dropdown-menu");
  initListSearch(a, "a");
  a.parent().on("show.bs.dropdown", function () {
    setTimeout(function () {
      a.find(".search-input").focus();
    });
  });
}
function number_format(a, b, c, d) {
  var g, f, e;
  isNaN((b = Math.abs(b))) && (b = 2);
  void 0 == c && (c = ",");
  void 0 == d && (d = ".");
  g = parseInt((a = (+a || 0).toFixed(b))) + "";
  e = (f = 3 < (f = g.length) ? f % 3 : 0) ? g.substr(0, f) + d : "";
  d = g.substr(f).replace(/(\d{3})(?=\d)/g, "$1" + d);
  a = b
    ? c +
      Math.abs(a - g)
        .toFixed(b)
        .replace(/-/, 0)
        .slice(2)
    : "";
  return e + d + a;
}
function onTelegramAuth(a) {
  ajaxCall(
    "/pl/user/profile/login-with-telegram",
    { user: a },
    { method: "get" },
    function (a) {
      window.afterTelegramAuthCallback && window.afterTelegramAuthCallback();
    }
  );
}
window.phoneChecked = !1;
window.checkFormPhone = function (a) {
  var b = $(a).find("input.phone-input");
  return 0 < b.length && !window.phoneChecked
    ? (ajaxCall(
        "/pl/user/profile/set-phone",
        { phone: b.val() },
        {},
        function (b) {
          b.data.success
            ? ((window.phoneChecked = !0), $(a).submit())
            : alert(b.data.error);
        }
      ),
      !1)
    : !0;
};
window.tt = function (a, b, c) {
  return "undefined" != typeof Yii ? Yii.t(a, b, c) : b;
};
jQuery.widget("gc.liteForm", {
  options: {},
  _create: function () {
    var a = this;
    this.formContentBlock = this.element.find(".form-content");
    this.resultBlock = this.element.find(".form-result-block");
    this.buttonSubmit = this.element.find('button[type="submit"]');
    0 < $(this.element).find(".hide-form-if-no-positions").length &&
      0 == $(this.element).find(".form-position").length &&
      this.element.hide();
    var b = addGlobalCheckbox(this.element);
    $(this.element).submit(function () {
      b() && a.sendForm();
      return !1;
    });
    a.onCreate();
  },
  resetState: function () {
    this.resultBlock.removeClass("error");
    this.resultBlock.removeClass("success");
    this.resultBlock.hide();
    this.resultBlock.html("");
    this.formContentBlock.show();
  },
  dealId: null,
  breakedOn: null,
  sendForm: function () {
    this.resultBlock.removeClass("error");
    this.resultBlock.removeClass("success");
    this.resultBlock.hide();
    var a = this.element,
      b = !1;
    $(this.element)
      .find(".required-one-selected")
      .each(function () {
        for (var c = $(this).val().split(","), d = 0; d < c.length; d++)
          if (a.find(".form-position-offer-" + c[d] + ":checked").length)
            return;
        b = !0;
      });
    if (b)
      alert(
        "\u0414\u043e\u043b\u0436\u043d\u043e \u0431\u044b\u0442\u044c \u0432\u044b\u0431\u0440\u0430\u043d\u043e \u043f\u0440\u0435\u0434\u043b\u043e\u0436\u0435\u043d\u0438\u0435"
      );
    else {
      var c = this,
        d = this.element.attr("action"),
        g = $(this.element).serialize();
      (g && "" != g) || (g = {});
      "object" == typeof g
        ? (g.fromUrl = encodeURIComponent(location.href))
        : (g = g + "&fromUrl=" + encodeURIComponent(location.href));
      this.breakedOn && (g = g + "&formParams[breakedOn]=" + this.breakedOn);
      this.dealId && (g = g + "&formParams[dealId]=" + this.dealId);
      $(this.element)
        .find('input[type="checkbox"].form-position-input')
        .not(":checked")
        .each(function (a, b) {
          g = g + "&formParams[not_selected_offer_id][]=" + $(b).val();
        });
      $(this.element)
        .find('input[type="radio"].prolong-offer')
        .not(":checked")
        .each(function (a, b) {
          0 != $(b).attr("data-offer-id") &&
            (g =
              g +
              "&formParams[not_selected_offer_id][]=" +
              $(b).attr("data-offer-id"));
        });
      $(this.element)
        .find('input[type="radio"].prolong-offer:checked')
        .each(function (a, b) {
          0 != $(b).attr("data-offer-id") &&
            (g = g + "&formParams[offer_id][]=" + $(b).attr("data-offer-id"));
        });
      c.buttonSubmit.find(".form-loader").get(0) ||
        (c.buttonSubmit.css("width", c.buttonSubmit.innerWidth()),
        c.buttonSubmit.prepend(
          '<img class="form-loader" src="/public/img/spinner.png"/>'
        ));
      this.resultBlock.html("");
      c.lastSend &&
        4e3 > Date.now() - c.lastSend &&
        alert(
          "\u0417\u0430\u043f\u0440\u043e\u0441 \u0435\u0449\u0435 \u043e\u0431\u0440\u0430\u0431\u0430\u0442\u044b\u0432\u0430\u0435\u0442\u0441\u044f"
        );
      c.lastSend = Date.now();
      ajaxCall(
        d,
        g,
        {
          enableSimpleSign: !0,
          async: 1 == a.data("open-new-window") ? !1 : !0,
        },
        function (a) {
          c.buttonSubmit.find(".form-loader").remove();
          c.lastSend = null;
          c.breakedOn = a.data.breakedOn;
          a.data.dealId && (c.dealId = a.data.dealId);
          if (a.data.formProcessed) {
            if (a.data.preParts)
              for (key in a.data.preParts) {
                var b = a.data.preParts[key];
                b.javascript && eval(b.javascript);
                b.html && c.resultBlock.html(b.html);
              }
            if (a.data.redirectUrl && !a.data.noRedirect) {
              b = a.data.redirectUrl;
              a.data.confirmMessage &&
                a.data.confirmCancelRedirectUrl &&
                !confirm(a.data.confirmMessage) &&
                (b = a.data.confirmCancelRedirectUrl);
              if (a.data.newWindow) {
                null === window.open(b) && (window.location.href = b);
                return;
              }
              window.top !== window.window
                ? (window.top.location.href = b)
                : (window.location.href = b);
              if (!a.data.refreshPage) return;
            }
            if (a.data.refreshPage) window.location.reload();
            else {
              c.resultBlock.html(
                "<h3 class='text-center'>" + a.data.defaultMessage + "</h3>"
              );
              for (key in a.data.parts)
                (b = a.data.parts[key]), b.html && c.resultBlock.html(b.html);
              c.element.height(c.element.height());
              c.resultBlock.show();
              c.formContentBlock.hide();
            }
          } else
            c.resultBlock.show(),
              c.resultBlock.html(
                "<div class='error-message'>" + a.data.error + "</div>"
              ),
              c.resultBlock.addClass("error"),
              c.resultBlock
                .parent()
                .find("button")
                .each(function () {
                  var a = $(this).attr("id");
                  window["prs" + a] = !1;
                  $(this).removeClass("disabled");
                });
        },
        function () {
          c.formContentBlock.trigger("submitForm");
        }
      );
    }
  },
  onCreate: function () {
    this.buttonSubmit &&
      this.buttonSubmit.attr("disabled") &&
      window.fixSubmitButton &&
      this.buttonSubmit.attr("disabled", !1);
  },
});
function ltShowModalBlock(a, b) {
  var c = null,
    c = $("#" + a);
  0 == c.length && (c = $("[data-code='" + a + "']"));
  if (b)
    for (key in b) {
      var d = b[key];
      c.find(".external-value." + key).val(d);
    }
  if (c.hasClass("lt-modal-block")) {
    if (c.hasClass("js--modal-block-popup-type-block")) {
      c.removeClass("lt-modal-block");
      return;
    }
    var g = window.gcModalFactory.create();
    c.data("modal-width") && "" != c.data("modal-width")
      ? g.getModalEl().find(".modal-dialog").width(c.data("modal-width"))
      : g.getModalEl().find(".modal-dialog").width("500px");
    c.data("modal-class") &&
      "" != c.data("modal-class") &&
      g.getModalEl().find(".modal-dialog").addClass(c.data("modal-class"));
    g.setContent("");
    g.getModalEl().addClass("lt-block-modal-window");
    c.appendTo(g.getContentEl());
    c.show();
  } else bodyScrollTo(c, 10);
  if (g)
    g.get$Modal().on("hidden.bs.modal", function (a) {
      (a = $(this).find(".videoWrapper iframe")) &&
        a.attr("src", a.attr("src"));
    });
}
function ltShowModalForm(a) {
  if ("custom" == a.formType) {
    var b = {};
    a.position && a.position.offer_id && (b.offer_id = a.position.offer_id);
    ltShowModalBlock(a.formBlockCode, b);
  } else {
    var c = window.gcModalFactory.create();
    c.getModalEl().addClass("lt-block-modal-window");
    c.getModalEl().addClass("lt-form-modal-window");
    ajaxCall("/pl/lite/block-public/get-block-html", a, {}, function (a) {
      c.setContent(a.data.html);
    });
  }
}
jQuery.widget("gc.liteSinglyForm", {
  currentPartIndex: 0,
  _create: function () {
    this.element.show();
    var a = this;
    this.element.find("input,select").change(function () {
      a.checkNextAvailable();
    });
    this.element.find("input,textarea").keyup(function () {
      a.checkNextAvailable();
    });
    this.surveyFieldsBlock = this.element.find(".part-surveyFields");
    this.otherFieldsBlocks = this.element.find(
      ".builder-item:not(.part-surveyFields)"
    );
    var b = $('<div class="btn-singly-controls"></div>');
    b.appendTo(this.element.find(".builder"));
    this.progressBar = $(
      '<div class="progress-bar-wrapper"><div class="progress-bar"></div></div>'
    );
    this.progressBar.prependTo(this.element.find(".builder"));
    var c = this.surveyFieldsBlock.find(".field-wrapper");
    this.prevBtn = $(
      '<button type="button" class="btn btn-prev btn-default">' +
        Yii.t("common", "Previous") +
        "</button>"
    );
    this.prevBtn.appendTo(b);
    this.nextBtn = $(
      '<button type="button" class="btn btn-next btn-success">' +
        Yii.t("common", "Next") +
        "</button>"
    );
    this.nextBtn.appendTo(b);
    this.nextBtn.click(function () {
      a.next();
    });
    this.prevBtn.click(function () {
      a.prev();
    });
    var d = [];
    c.each(function (a, b) {
      d.push($(b));
    });
    d.push(this.otherFieldsBlocks);
    this.parts = d;
    this.showCurrentPart();
  },
  showCurrentPart: function () {
    for (var a = 0; a < this.parts.length; a++)
      a == this.currentPartIndex ? this.parts[a].show() : this.parts[a].hide();
    this.prevBtn.show();
    this.nextBtn.show();
    this.currentPartIndex == this.parts.length - 1 &&
      (this.prevBtn.hide(), this.nextBtn.hide());
    0 == this.currentPartIndex && this.prevBtn.hide();
    1 < this.parts.length
      ? ((a = Math.round(
          (100 * this.currentPartIndex) / (this.parts.length - 1)
        )),
        this.currentPartIndex >= this.parts.length - 1 &&
          this.progressBar.hide(),
        this.progressBar.find(".progress-bar").width(a + "%"))
      : this.progressBar.hide();
    this.checkNextAvailable();
  },
  checkNextAvailable: function () {
    var a = this.parts[this.currentPartIndex];
    0 < a.find(".type-select.required,.type-multi_select.required").length &&
    0 == a.find("input:checked").length &&
    ("undefined" == typeof a.find("select").val() ||
      "" == a.find("select").val())
      ? this.nextBtn.attr("disabled", "disabled")
      : 0 < a.find(".type-string.required").length &&
        "" == a.find("input").val()
      ? this.nextBtn.attr("disabled", "disabled")
      : 0 < a.find(".type-text").length && "" == a.find("textarea").val()
      ? this.nextBtn.attr("disabled", "disabled")
      : this.nextBtn.removeAttr("disabled");
  },
  next: function () {
    this.currentPartIndex < this.parts.length - 1 &&
      (this.currentPartIndex++, this.showCurrentPart());
  },
  prev: function () {
    0 < this.currentPartIndex &&
      (this.currentPartIndex--, this.showCurrentPart());
  },
});
$(function () {
  $(".lt-singly-form-survey").each(function (a, b) {
    $(b).hasClass("lt-editing") || ($(b).hide(), $(b).liteSinglyForm());
  });
});
jQuery.widget("gc.liteMenu", {
  options: { position: "static" },
  placeholder: null,
  currentAnchorLink: null,
  _create: function () {
    var a = this;
    this.element.find(".toggler").click(function () {
      $(this).parents(".menu-wrapper").toggleClass("expanded");
    });
    this.element.find(".collapsed-content .f-header").click(function () {
      $(this).parents(".menu-wrapper").toggleClass("expanded");
    });
    "sticky" == this.options.position &&
      (($placeholder = $('<div class="lt-menu-placeholder"></div>')),
      $placeholder.insertBefore(this.element),
      (this.placeholder = $placeholder));
    var b = $(".anchor"),
      c = {};
    this.element.find(".menu-list a").each(function () {
      var b = $(this).attr("href");
      0 == b.indexOf("#") &&
        ((c[b.substring(1)] = $(this)),
        $(this).click(function () {
          var b = $($(this).attr("href"));
          if (b.length)
            return (
              980 >= $(window).width() &&
                a.element.find(".menu-wrapper").toggleClass("expanded"),
              $("body,html").animate(
                { scrollTop: Math.round(b.offset().top) },
                300
              ),
              history.pushState(null, null, $(this).attr("href")),
              !1
            );
        }));
    });
    $(window).scroll(function () {
      var d = $(this).scrollTop() + 20,
        g = a.element;
      0 == d ? g.removeClass("scrolled") : g.addClass("scrolled");
      prevAnchorEl = null;
      for (var f = 0; f < b.length; f++) {
        var e = b.eq(f);
        if (e.offset().top > d) break;
        prevAnchorEl = e;
      }
      newAnchorLink = prevAnchorEl ? c[prevAnchorEl.data("anchor")] : null;
      a.currentAnchorLink != newAnchorLink &&
        (a.currentAnchorLink &&
          a.currentAnchorLink.parents("li").removeClass("active"),
        (a.currentAnchorLink = newAnchorLink),
        a.currentAnchorLink &&
          a.currentAnchorLink.parents("li").addClass("active"));
      a.placeholder && a.placeholder.offset().top < d
        ? (a.placeholder.height(g.height()), g.addClass("scroll-passed"))
        : (a.placeholder && a.placeholder.height("auto"),
          g.removeClass("scroll-passed"));
    });
  },
});
jQuery.widget("gc.liteVideoCover", {
  player: null,
  options: { type: null, videoId: null },
  _create: function () {
    var a = this;
    this.playerWrapperEl = $('<div class="player-wrapper"></div>');
    this.playerWrapperEl.appendTo(this.element);
    "youtube" == this.options.type ? this.loadYoutubeApi() : this.loadVimeo();
    $(window).on("load resize", function () {
      a.rescaleVideo();
    });
  },
  loadVimeo: function () {
    var a = document.createElement("script");
    a.src = "//f.vimeocdn.com/js/froogaloop2.min.js";
    var b = document.getElementsByTagName("script")[0];
    b.parentNode.insertBefore(a, b);
    $player = $(
      '<iframe class="player" src="https://player.vimeo.com/video/' +
        this.options.videoId +
        '?api=1&background=1&loop=1&autoplay=1&title=0&byline=0&portrait=0" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
    );
    $player.appendTo(this.playerWrapperEl);
    a.onload = function () {
      var a = $f($player[0]);
      a.addEvent("ready", function () {
        a.api("setVolume", 0);
      });
    };
  },
  loadYoutubeApi: function () {
    var a = this,
      b = document.createElement("script");
    b.src = "https://www.youtube.com/player_api";
    var c = document.getElementsByTagName("script")[0];
    c.parentNode.insertBefore(b, c);
    window.ytPlayerLoadHandlers.push(function () {
      a.playerLoaded();
    });
  },
  playerLoaded: function () {
    var a = this;
    this.playerEl = $('<div class="player"></div>');
    this.playerEl.appendTo(this.playerWrapperEl);
    this.player = new YT.Player(this.playerEl.get(0), {
      events: {
        onReady: function () {
          a.onPlayerReady();
        },
        onStateChange: function (b) {
          a.onPlayerStateChange(b);
        },
      },
      playerVars: {
        autoplay: 0,
        autohide: 1,
        modestbranding: 0,
        rel: 0,
        showinfo: 0,
        controls: 0,
        disablekb: 1,
        enablejsapi: 0,
        iv_load_policy: 3,
      },
    });
  },
  onPlayerReady: function () {
    this.player.loadVideoById({
      videoId: this.options.videoId,
      startSeconds: 0,
      endSeconds: 0,
      suggestedQuality: "hd720",
    });
    this.player.mute();
  },
  onPlayerStateChange: function (a) {
    1 === a.data
      ? this.playerWrapperEl.find(".player").addClass("active")
      : 0 === a.data && this.player.seekTo(0);
  },
  rescaleVideo: function () {
    var a = this.element.width() + 200,
      b = this.element.height() + 200,
      c = this.playerWrapperEl.find(".player");
    a / b > 16 / 9
      ? ("youtube" == this.options.type
          ? this.player.setSize(a, (a / 16) * 9)
          : (c.css("width", a), c.css("height", (a / 16) * 9)),
        c.css({ left: "0px" }))
      : ("youtube" == this.options.type
          ? this.player.setSize((b / 9) * 16, b)
          : (c.css("width", (b / 9) * 16), c.css("height", b)),
        c.css({ left: -(c.outerWidth() - a) / 2 }));
    c.addClass("active");
  },
});
window.ytPlayerLoadHandlers || (window.ytPlayerLoadHandlers = []);
function onYouTubePlayerAPIReady() {
  for (var a = 0; a < window.ytPlayerLoadHandlers.length; a++)
    window.ytPlayerLoadHandlers[a]();
}
function vidRescale() {
  var a = $(window).width() + 200,
    b = $(window).height() + 200;
  a / b > 16 / 9
    ? (tv.setSize(a, (a / 16) * 9), $(".tv .screen").css({ left: "0px" }))
    : (tv.setSize((b / 9) * 16, b),
      $(".tv .screen").css({ left: -($(".tv .screen").outerWidth() - a) / 2 }));
}
$(window).on("load resize", function () {});
