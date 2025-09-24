/*! For license information please see app.js.LICENSE.txt */
(() => {
  "use strict";
  var e,
    t = {};
  (t.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })()),
    (function (e) {
      (e.CuriousReader = "CuriousReader"),
        (e.GDL = "GDL"),
        (e.Unknown = "Unknown");
    })(e || (e = {}));
  class n {
    constructor(e) {
      (this.emptyGlowImageTag = "empty_glow_image"), (this.contentFilePath = e);
    }
    async parseBook() {
      return new Promise((e, t) => {
        this.parseContentJSONFile()
          .then((t) => {
            (this.contentJSON = t),
              console.log("Content JSON file parsed!"),
              console.log(this.contentJSON);
            let n = {
              bookName: "",
              pages: [],
              bookType: this.determineBookType(),
            };
            (n.pages = this.parsePages(n)), e(n);
          })
          .catch((e) => {
            t(e);
          });
      });
    }
    determineBookType() {
      return void 0 !== this.contentJSON.presentation
        ? e.CuriousReader
        : void 0 !== this.contentJSON.chapters
        ? e.GDL
        : e.Unknown;
    }
    parsePages(t) {
      let n = [];
      if (t.bookType === e.CuriousReader) {
        let e = this.contentJSON.presentation.slides,
          t =
            this.contentJSON.presentation.globalBackgroundSelector
              .fillGlobalBackground;
        for (let i = 0; i < e.length; i++) {
          let o = e[i],
            r = { visualElements: [], backgroundColor: t };
          (r.visualElements = this.parsePageCR(o)), n.push(r);
        }
      } else if (t.bookType === e.GDL) {
        let e = this.contentJSON.chapters,
          t = "#FCFCF2";
        for (let i = 0; i < e.length; i++) {
          let o = e[i],
            r = { visualElements: [], backgroundColor: t };
          (r.visualElements = this.parsePageGDL(o)), n.push(r);
        }
      } else console.log("Unknown book type!");
      return n;
    }
    parsePageCR(e) {
      let t = [],
        n = e.elements;
      for (let e = 0; e < n.length; e++) {
        let i = n[e].action.library;
        if (i.includes("AdvancedText")) {
          let i = this.parseTextElementCR(n[e]);
          t.push(i);
        } else if (i.includes("Image")) {
          let i = this.parseImageElementCR(n[e]);
          t.push(i);
        } else if (i.includes("Audio")) {
          let i = this.parseAudioElementCR(n[e]);
          t.push(i);
        }
      }
      return t;
    }
    parsePageGDL(e) {
      let t = [],
        n = e.params.content;
      for (let e = 0; e < n.length; e++) {
        let i = n[e].content.library;
        if (i.includes("AdvancedText")) {
          let i = this.parseTextElementGDL(n[e].content.params);
          t.push(i);
        } else if (i.includes("Image")) {
          let i = this.parseImageElementGDL(n[e].content.params);
          t.push(i);
        }
      }
      return t;
    }
    parseTextElementCR(e) {
      return {
        type: "text",
        positionX: e.x,
        positionY: e.y,
        width: e.width,
        height: e.height,
        textContentAsHTML: e.action.params.text,
      };
    }
    parseTextElementGDL(e) {
      return {
        type: "text",
        positionX: NaN,
        positionY: NaN,
        width: NaN,
        height: NaN,
        textContentAsHTML: e.text,
      };
    }
    parseImageElementCR(e) {
      let t = "";
      return (
        (t =
          void 0 === e.action.params.file
            ? this.emptyGlowImageTag
            : e.action.params.file.path),
        {
          domID: t === this.emptyGlowImageTag ? e.id : e.action.subContentId,
          type: "image",
          positionX: e.x,
          positionY: e.y,
          width: e.width,
          height: e.height,
          imageSource: t,
        }
      );
    }
    parseImageElementGDL(e) {
      return {
        domID: "",
        type: "image",
        positionX: NaN,
        positionY: NaN,
        width: e.width,
        height: e.height,
        imageSource: e.file.path,
      };
    }
    parseAudioElementCR(e) {
      let t = { timestamps: [] },
        n = e.action.params.timeStampForEachText;
      for (let i = 0; i < n.length; i++) {
        let o = i,
          r = n[i],
          a = {
            domID: e.action.subContentId + "_" + o.toString(),
            word: r.text.replace(/&#039;/g, "'"),
            startTimestamp: r.startDuration,
            endTimestamp: r.endDuration,
            audioSrc: r.wordfile[0].path,
          };
        t.timestamps.push(a);
      }
      return {
        domID: e.action.subContentId,
        type: "audio",
        positionX: e.x,
        positionY: e.y,
        width: e.width,
        height: e.height,
        glowColor: e.action.params.glowColor,
        audioSrc: e.action.params.files[0].path,
        audioTimestamps: t,
        styles: "",
      };
    }
    async parseContentJSONFile() {
      return new Promise((e, t) => {
        let n = new XMLHttpRequest();
        n.open("GET", this.contentFilePath, !0),
          (n.responseType = "json"),
          (n.onload = function () {
            if (200 === n.status) {
              let t = n.response;
              delete t.l10n, delete t.override, e(t);
            } else t(n.response);
          }),
          n.send();
      });
    }
  }
  function i(e, t) {
    for (var n = 0; n < t.length; n++) {
      var i = t[n];
      (i.enumerable = i.enumerable || !1),
        (i.configurable = !0),
        "value" in i && (i.writable = !0),
        Object.defineProperty(e, i.key, i);
    }
  }
  var o = "(prefers-reduced-motion: reduce)";
  function r(e) {
    e.length = 0;
  }
  function a(e, t, n) {
    return Array.prototype.slice.call(e, t, n);
  }
  function s(e) {
    return e.bind.apply(e, [null].concat(a(arguments, 1)));
  }
  var c = setTimeout,
    l = function () {};
  function u(e) {
    return requestAnimationFrame(e);
  }
  function d(e, t) {
    return typeof t === e;
  }
  function h(e) {
    return !y(e) && d("object", e);
  }
  var f = Array.isArray,
    p = s(d, "function"),
    m = s(d, "string"),
    g = s(d, "undefined");
  function y(e) {
    return null === e;
  }
  function v(e) {
    try {
      return e instanceof (e.ownerDocument.defaultView || window).HTMLElement;
    } catch (e) {
      return !1;
    }
  }
  function b(e) {
    return f(e) ? e : [e];
  }
  function w(e, t) {
    b(e).forEach(t);
  }
  function I(e, t) {
    return e.indexOf(t) > -1;
  }
  function E(e, t) {
    return e.push.apply(e, b(t)), e;
  }
  function C(e, t, n) {
    e &&
      w(t, function (t) {
        t && e.classList[n ? "add" : "remove"](t);
      });
  }
  function S(e, t) {
    C(e, m(t) ? t.split(" ") : t, !0);
  }
  function T(e, t) {
    w(t, e.appendChild.bind(e));
  }
  function k(e, t) {
    w(e, function (e) {
      var n = (t || e).parentNode;
      n && n.insertBefore(e, t);
    });
  }
  function A(e, t) {
    return v(e) && (e.msMatchesSelector || e.matches).call(e, t);
  }
  function D(e, t) {
    var n = e ? a(e.children) : [];
    return t
      ? n.filter(function (e) {
          return A(e, t);
        })
      : n;
  }
  function _(e, t) {
    return t ? D(e, t)[0] : e.firstElementChild;
  }
  var P = Object.keys;
  function x(e, t, n) {
    return (
      e &&
        (n ? P(e).reverse() : P(e)).forEach(function (n) {
          "__proto__" !== n && t(e[n], n);
        }),
      e
    );
  }
  function L(e) {
    return (
      a(arguments, 1).forEach(function (t) {
        x(t, function (n, i) {
          e[i] = t[i];
        });
      }),
      e
    );
  }
  function N(e) {
    return (
      a(arguments, 1).forEach(function (t) {
        x(t, function (t, n) {
          f(t)
            ? (e[n] = t.slice())
            : h(t)
            ? (e[n] = N({}, h(e[n]) ? e[n] : {}, t))
            : (e[n] = t);
        });
      }),
      e
    );
  }
  function O(e, t) {
    w(t || P(e), function (t) {
      delete e[t];
    });
  }
  function B(e, t) {
    w(e, function (e) {
      w(t, function (t) {
        e && e.removeAttribute(t);
      });
    });
  }
  function M(e, t, n) {
    h(t)
      ? x(t, function (t, n) {
          M(e, n, t);
        })
      : w(e, function (e) {
          y(n) || "" === n ? B(e, t) : e.setAttribute(t, String(n));
        });
  }
  function F(e, t, n) {
    var i = document.createElement(e);
    return t && (m(t) ? S(i, t) : M(i, t)), n && T(n, i), i;
  }
  function j(e, t, n) {
    if (g(n)) return getComputedStyle(e)[t];
    y(n) || (e.style[t] = "" + n);
  }
  function R(e, t) {
    j(e, "display", t);
  }
  function z(e) {
    (e.setActive && e.setActive()) || e.focus({ preventScroll: !0 });
  }
  function $(e, t) {
    return e.getAttribute(t);
  }
  function H(e, t) {
    return e && e.classList.contains(t);
  }
  function G(e) {
    return e.getBoundingClientRect();
  }
  function W(e) {
    w(e, function (e) {
      e && e.parentNode && e.parentNode.removeChild(e);
    });
  }
  function U(e) {
    return _(new DOMParser().parseFromString(e, "text/html").body);
  }
  function V(e, t) {
    e.preventDefault(),
      t && (e.stopPropagation(), e.stopImmediatePropagation());
  }
  function X(e, t) {
    return e && e.querySelector(t);
  }
  function q(e, t) {
    return t ? a(e.querySelectorAll(t)) : [];
  }
  function Y(e, t) {
    C(e, t, !1);
  }
  function J(e) {
    return e.timeStamp;
  }
  function K(e) {
    return m(e) ? e : e ? e + "px" : "";
  }
  var Q = "splide",
    Z = "data-" + Q;
  function ee(e, t) {
    if (!e) throw new Error("[" + Q + "] " + (t || ""));
  }
  var te = Math.min,
    ne = Math.max,
    ie = Math.floor,
    oe = Math.ceil,
    re = Math.abs;
  function ae(e, t, n) {
    return re(e - t) < n;
  }
  function se(e, t, n, i) {
    var o = te(t, n),
      r = ne(t, n);
    return i ? o < e && e < r : o <= e && e <= r;
  }
  function ce(e, t, n) {
    var i = te(t, n),
      o = ne(t, n);
    return te(ne(i, e), o);
  }
  function le(e) {
    return +(e > 0) - +(e < 0);
  }
  function ue(e, t) {
    return (
      w(t, function (t) {
        e = e.replace("%s", "" + t);
      }),
      e
    );
  }
  function de(e) {
    return e < 10 ? "0" + e : "" + e;
  }
  var he = {};
  function fe() {
    var e = [];
    function t(e, t, n) {
      w(e, function (e) {
        e &&
          w(t, function (t) {
            t.split(" ").forEach(function (t) {
              var i = t.split(".");
              n(e, i[0], i[1]);
            });
          });
      });
    }
    return {
      bind: function (n, i, o, r) {
        t(n, i, function (t, n, i) {
          var a = "addEventListener" in t,
            s = a
              ? t.removeEventListener.bind(t, n, o, r)
              : t.removeListener.bind(t, o);
          a ? t.addEventListener(n, o, r) : t.addListener(o),
            e.push([t, n, i, o, s]);
        });
      },
      unbind: function (n, i, o) {
        t(n, i, function (t, n, i) {
          e = e.filter(function (e) {
            return (
              !!(e[0] !== t || e[1] !== n || e[2] !== i || (o && e[3] !== o)) ||
              (e[4](), !1)
            );
          });
        });
      },
      dispatch: function (e, t, n) {
        var i,
          o = !0;
        return (
          "function" == typeof CustomEvent
            ? (i = new CustomEvent(t, { bubbles: o, detail: n }))
            : (i = document.createEvent("CustomEvent")).initCustomEvent(
                t,
                o,
                !1,
                n
              ),
          e.dispatchEvent(i),
          i
        );
      },
      destroy: function () {
        e.forEach(function (e) {
          e[4]();
        }),
          r(e);
      },
    };
  }
  var pe = "mounted",
    me = "ready",
    ge = "move",
    ye = "moved",
    ve = "click",
    be = "refresh",
    we = "updated",
    Ie = "resize",
    Ee = "resized",
    Ce = "scroll",
    Se = "scrolled",
    Te = "destroy",
    ke = "navigation:mounted",
    Ae = "autoplay:play",
    De = "autoplay:pause",
    _e = "lazyload:loaded",
    Pe = "ei";
  function xe(e) {
    var t = e ? e.event.bus : document.createDocumentFragment(),
      n = fe();
    return (
      e && e.event.on(Te, n.destroy),
      L(n, {
        bus: t,
        on: function (e, i) {
          n.bind(t, b(e).join(" "), function (e) {
            i.apply(i, f(e.detail) ? e.detail : []);
          });
        },
        off: s(n.unbind, t),
        emit: function (e) {
          n.dispatch(t, e, a(arguments, 1));
        },
      })
    );
  }
  function Le(e, t, n, i) {
    var o,
      r,
      a = Date.now,
      s = 0,
      c = !0,
      l = 0;
    function d() {
      if (!c) {
        if (
          ((s = e ? te((a() - o) / e, 1) : 1),
          n && n(s),
          s >= 1 && (t(), (o = a()), i && ++l >= i))
        )
          return h();
        r = u(d);
      }
    }
    function h() {
      c = !0;
    }
    function f() {
      r && cancelAnimationFrame(r), (s = 0), (r = 0), (c = !0);
    }
    return {
      start: function (t) {
        t || f(), (o = a() - (t ? s * e : 0)), (c = !1), (r = u(d));
      },
      rewind: function () {
        (o = a()), (s = 0), n && n(s);
      },
      pause: h,
      cancel: f,
      set: function (t) {
        e = t;
      },
      isPaused: function () {
        return c;
      },
    };
  }
  var Ne = "Arrow",
    Oe = Ne + "Left",
    Be = Ne + "Right",
    Me = Ne + "Up",
    Fe = Ne + "Down",
    je = "ttb",
    Re = {
      width: ["height"],
      left: ["top", "right"],
      right: ["bottom", "left"],
      x: ["y"],
      X: ["Y"],
      Y: ["X"],
      ArrowLeft: [Me, Be],
      ArrowRight: [Fe, Oe],
    };
  var ze = "role",
    $e = "tabindex",
    He = "aria-",
    Ge = He + "controls",
    We = He + "current",
    Ue = He + "selected",
    Ve = He + "label",
    Xe = He + "labelledby",
    qe = He + "hidden",
    Ye = He + "orientation",
    Je = He + "roledescription",
    Ke = He + "live",
    Qe = He + "busy",
    Ze = He + "atomic",
    et = [ze, $e, "disabled", Ge, We, Ve, Xe, qe, Ye, Je],
    tt = Q + "__",
    nt = "is-",
    it = Q,
    ot = tt + "track",
    rt = tt + "list",
    at = tt + "slide",
    st = at + "--clone",
    ct = at + "__container",
    lt = tt + "arrows",
    ut = tt + "arrow",
    dt = ut + "--prev",
    ht = ut + "--next",
    ft = tt + "pagination",
    pt = ft + "__page",
    mt = tt + "progress__bar",
    gt = tt + "toggle",
    yt = tt + "sr",
    vt = nt + "initialized",
    bt = nt + "active",
    wt = nt + "prev",
    It = nt + "next",
    Et = nt + "visible",
    Ct = nt + "loading",
    St = nt + "focus-in",
    Tt = nt + "overflow",
    kt = [bt, Et, wt, It, Ct, St, Tt],
    At = {
      slide: at,
      clone: st,
      arrows: lt,
      arrow: ut,
      prev: dt,
      next: ht,
      pagination: ft,
      page: pt,
      spinner: tt + "spinner",
    },
    Dt = "touchstart mousedown",
    _t = "touchmove mousemove",
    Pt = "touchend touchcancel mouseup click",
    xt = "slide",
    Lt = "loop",
    Nt = "fade";
  var Ot = Z + "-interval",
    Bt = { passive: !1, capture: !0 },
    Mt = { Spacebar: " ", Right: Be, Left: Oe, Up: Me, Down: Fe };
  function Ft(e) {
    return (e = m(e) ? e : e.key), Mt[e] || e;
  }
  var jt = "keydown",
    Rt = Z + "-lazy",
    zt = Rt + "-srcset",
    $t = "[" + Rt + "], [" + zt + "]",
    Ht = [" ", "Enter"],
    Gt = Object.freeze({
      __proto__: null,
      Media: function (e, t, n) {
        var i = e.state,
          r = n.breakpoints || {},
          a = n.reducedMotion || {},
          s = fe(),
          c = [];
        function l(e) {
          e && s.destroy();
        }
        function u(e, t) {
          var n = matchMedia(t);
          s.bind(n, "change", d), c.push([e, n]);
        }
        function d() {
          var t = i.is(7),
            o = n.direction,
            r = c.reduce(function (e, t) {
              return N(e, t[1].matches ? t[0] : {});
            }, {});
          O(n),
            h(r),
            n.destroy
              ? e.destroy("completely" === n.destroy)
              : t
              ? (l(!0), e.mount())
              : o !== n.direction && e.refresh();
        }
        function h(t, o, r) {
          N(n, t),
            o && N(Object.getPrototypeOf(n), t),
            (!r && i.is(1)) || e.emit(we, n);
        }
        return {
          setup: function () {
            var e = "min" === n.mediaQuery;
            P(r)
              .sort(function (t, n) {
                return e ? +t - +n : +n - +t;
              })
              .forEach(function (t) {
                u(r[t], "(" + (e ? "min" : "max") + "-width:" + t + "px)");
              }),
              u(a, o),
              d();
          },
          destroy: l,
          reduce: function (e) {
            matchMedia(o).matches && (e ? N(n, a) : O(n, P(a)));
          },
          set: h,
        };
      },
      Direction: function (e, t, n) {
        return {
          resolve: function (e, t, i) {
            var o =
              "rtl" !== (i = i || n.direction) || t ? (i === je ? 0 : -1) : 1;
            return (
              (Re[e] && Re[e][o]) ||
              e.replace(/width|left|right/i, function (e, t) {
                var n = Re[e.toLowerCase()][o] || e;
                return t > 0 ? n.charAt(0).toUpperCase() + n.slice(1) : n;
              })
            );
          },
          orient: function (e) {
            return e * ("rtl" === n.direction ? 1 : -1);
          },
        };
      },
      Elements: function (e, t, n) {
        var i,
          o,
          a,
          s = xe(e),
          c = s.on,
          l = s.bind,
          u = e.root,
          d = n.i18n,
          h = {},
          f = [],
          m = [],
          g = [];
        function y() {
          var e, t, r;
          (i = w("." + ot)),
            (o = _(i, "." + rt)),
            ee(i && o, "A track/list element is missing."),
            E(f, D(o, "." + at + ":not(." + st + ")")),
            x(
              {
                arrows: lt,
                pagination: ft,
                prev: dt,
                next: ht,
                bar: mt,
                toggle: gt,
              },
              function (e, t) {
                h[t] = w("." + e);
              }
            ),
            L(h, { root: u, track: i, list: o, slides: f }),
            (t = u.id || "" + (e = Q) + de((he[e] = (he[e] || 0) + 1))),
            (r = n.role),
            (u.id = t),
            (i.id = i.id || t + "-track"),
            (o.id = o.id || t + "-list"),
            !$(u, ze) && "SECTION" !== u.tagName && r && M(u, ze, r),
            M(u, Je, d.carousel),
            M(o, ze, "presentation"),
            b();
        }
        function v(e) {
          var t = et.concat("style");
          r(f), Y(u, m), Y(i, g), B([i, o], t), B(u, e ? t : ["style", Je]);
        }
        function b() {
          Y(u, m),
            Y(i, g),
            (m = I(it)),
            (g = I(ot)),
            S(u, m),
            S(i, g),
            M(u, Ve, n.label),
            M(u, Xe, n.labelledby);
        }
        function w(e) {
          var t = X(u, e);
          return t &&
            (function (e, t) {
              if (p(e.closest)) return e.closest(t);
              for (var n = e; n && 1 === n.nodeType && !A(n, t); )
                n = n.parentElement;
              return n;
            })(t, "." + it) === u
            ? t
            : void 0;
        }
        function I(e) {
          return [
            e + "--" + n.type,
            e + "--" + n.direction,
            n.drag && e + "--draggable",
            n.isNavigation && e + "--nav",
            e === it && bt,
          ];
        }
        return L(h, {
          setup: y,
          mount: function () {
            c(be, v),
              c(be, y),
              c(we, b),
              l(
                document,
                Dt + " keydown",
                function (e) {
                  a = "keydown" === e.type;
                },
                { capture: !0 }
              ),
              l(u, "focusin", function () {
                C(u, St, !!a);
              });
          },
          destroy: v,
        });
      },
      Slides: function (e, t, n) {
        var i = xe(e),
          o = i.on,
          a = i.emit,
          c = i.bind,
          l = t.Elements,
          u = l.slides,
          d = l.list,
          h = [];
        function f() {
          u.forEach(function (e, t) {
            y(e, t, -1);
          });
        }
        function g() {
          D(function (e) {
            e.destroy();
          }),
            r(h);
        }
        function y(t, n, i) {
          var o = (function (e, t, n, i) {
            var o,
              r = xe(e),
              a = r.on,
              c = r.emit,
              l = r.bind,
              u = e.Components,
              d = e.root,
              h = e.options,
              f = h.isNavigation,
              p = h.updateOnMove,
              m = h.i18n,
              g = h.pagination,
              y = h.slideFocus,
              v = u.Direction.resolve,
              b = $(i, "style"),
              w = $(i, Ve),
              I = n > -1,
              E = _(i, "." + ct);
            function S() {
              var o = e.splides
                .map(function (e) {
                  var n = e.splide.Components.Slides.getAt(t);
                  return n ? n.slide.id : "";
                })
                .join(" ");
              M(i, Ve, ue(m.slideX, (I ? n : t) + 1)),
                M(i, Ge, o),
                M(i, ze, y ? "button" : ""),
                y && B(i, Je);
            }
            function T() {
              o || k();
            }
            function k() {
              if (!o) {
                var n = e.index;
                (r = A()) !== H(i, bt) &&
                  (C(i, bt, r),
                  M(i, We, (f && r) || ""),
                  c(r ? "active" : "inactive", D)),
                  (function () {
                    var t = (function () {
                        if (e.is(Nt)) return A();
                        var t = G(u.Elements.track),
                          n = G(i),
                          o = v("left", !0),
                          r = v("right", !0);
                        return ie(t[o]) <= oe(n[o]) && ie(n[r]) <= oe(t[r]);
                      })(),
                      n = !t && (!A() || I);
                    if (
                      (e.state.is([4, 5]) || M(i, qe, n || ""),
                      M(q(i, h.focusableNodes || ""), $e, n ? -1 : ""),
                      y && M(i, $e, n ? -1 : 0),
                      t !== H(i, Et) &&
                        (C(i, Et, t), c(t ? "visible" : "hidden", D)),
                      !t && document.activeElement === i)
                    ) {
                      var o = u.Slides.getAt(e.index);
                      o && z(o.slide);
                    }
                  })(),
                  C(i, wt, t === n - 1),
                  C(i, It, t === n + 1);
              }
              var r;
            }
            function A() {
              var i = e.index;
              return i === t || (h.cloneStatus && i === n);
            }
            var D = {
              index: t,
              slideIndex: n,
              slide: i,
              container: E,
              isClone: I,
              mount: function () {
                I ||
                  ((i.id = d.id + "-slide" + de(t + 1)),
                  M(i, ze, g ? "tabpanel" : "group"),
                  M(i, Je, m.slide),
                  M(i, Ve, w || ue(m.slideLabel, [t + 1, e.length]))),
                  l(i, "click", s(c, ve, D)),
                  l(i, "keydown", s(c, "sk", D)),
                  a([ye, "sh", Se], k),
                  a(ke, S),
                  p && a(ge, T);
              },
              destroy: function () {
                (o = !0),
                  r.destroy(),
                  Y(i, kt),
                  B(i, et),
                  M(i, "style", b),
                  M(i, Ve, w || "");
              },
              update: k,
              style: function (e, t, n) {
                j((n && E) || i, e, t);
              },
              isWithin: function (n, i) {
                var o = re(n - t);
                return (
                  I || (!h.rewind && !e.is(Lt)) || (o = te(o, e.length - o)),
                  o <= i
                );
              },
            };
            return D;
          })(e, n, i, t);
          o.mount(),
            h.push(o),
            h.sort(function (e, t) {
              return e.index - t.index;
            });
        }
        function E(e) {
          return e
            ? P(function (e) {
                return !e.isClone;
              })
            : h;
        }
        function D(e, t) {
          E(t).forEach(e);
        }
        function P(e) {
          return h.filter(
            p(e)
              ? e
              : function (t) {
                  return m(e) ? A(t.slide, e) : I(b(e), t.index);
                }
          );
        }
        return {
          mount: function () {
            f(), o(be, g), o(be, f);
          },
          destroy: g,
          update: function () {
            D(function (e) {
              e.update();
            });
          },
          register: y,
          get: E,
          getIn: function (e) {
            var i = t.Controller,
              o = i.toIndex(e),
              r = i.hasFocus() ? 1 : n.perPage;
            return P(function (e) {
              return se(e.index, o, o + r - 1);
            });
          },
          getAt: function (e) {
            return P(e)[0];
          },
          add: function (e, t) {
            w(e, function (e) {
              if ((m(e) && (e = U(e)), v(e))) {
                var i = u[t];
                i ? k(e, i) : T(d, e),
                  S(e, n.classes.slide),
                  (o = e),
                  (r = s(a, Ie)),
                  (l = q(o, "img")),
                  (h = l.length)
                    ? l.forEach(function (e) {
                        c(e, "load error", function () {
                          --h || r();
                        });
                      })
                    : r();
              }
              var o, r, l, h;
            }),
              a(be);
          },
          remove: function (e) {
            W(
              P(e).map(function (e) {
                return e.slide;
              })
            ),
              a(be);
          },
          forEach: D,
          filter: P,
          style: function (e, t, n) {
            D(function (i) {
              i.style(e, t, n);
            });
          },
          getLength: function (e) {
            return e ? u.length : h.length;
          },
          isEnough: function () {
            return h.length > n.perPage;
          },
        };
      },
      Layout: function (e, t, n) {
        var i,
          o,
          r,
          a = xe(e),
          c = a.on,
          l = a.bind,
          u = a.emit,
          d = t.Slides,
          f = t.Direction.resolve,
          p = t.Elements,
          m = p.root,
          g = p.track,
          y = p.list,
          v = d.getAt,
          b = d.style;
        function w() {
          (i = n.direction === je),
            j(m, "maxWidth", K(n.width)),
            j(g, f("paddingLeft"), E(!1)),
            j(g, f("paddingRight"), E(!0)),
            I(!0);
        }
        function I(e) {
          var t,
            a = G(m);
          (e || o.width !== a.width || o.height !== a.height) &&
            (j(
              g,
              "height",
              ((t = ""),
              i &&
                (ee((t = S()), "height or heightRatio is missing."),
                (t = "calc(" + t + " - " + E(!1) + " - " + E(!0) + ")")),
              t)
            ),
            b(f("marginRight"), K(n.gap)),
            b("width", n.autoWidth ? null : K(n.fixedWidth) || (i ? "" : T())),
            b(
              "height",
              K(n.fixedHeight) || (i ? (n.autoHeight ? null : T()) : S()),
              !0
            ),
            (o = a),
            u(Ee),
            r !== (r = x()) && (C(m, Tt, r), u("overflow", r)));
        }
        function E(e) {
          var t = n.padding,
            i = f(e ? "right" : "left");
          return (t && K(t[i] || (h(t) ? 0 : t))) || "0px";
        }
        function S() {
          return K(n.height || G(y).width * n.heightRatio);
        }
        function T() {
          var e = K(n.gap);
          return (
            "calc((100%" +
            (e && " + " + e) +
            ")/" +
            (n.perPage || 1) +
            (e && " - " + e) +
            ")"
          );
        }
        function k() {
          return G(y)[f("width")];
        }
        function A(e, t) {
          var n = v(e || 0);
          return n ? G(n.slide)[f("width")] + (t ? 0 : P()) : 0;
        }
        function D(e, t) {
          var n = v(e);
          if (n) {
            var i = G(n.slide)[f("right")],
              o = G(y)[f("left")];
            return re(i - o) + (t ? 0 : P());
          }
          return 0;
        }
        function _(t) {
          return D(e.length - 1) - D(0) + A(0, t);
        }
        function P() {
          var e = v(0);
          return (e && parseFloat(j(e.slide, f("marginRight")))) || 0;
        }
        function x() {
          return e.is(Nt) || _(!0) > k();
        }
        return {
          mount: function () {
            var e, t;
            w(),
              l(
                window,
                "resize load",
                ((e = s(u, Ie)),
                (t = Le(0, e, null, 1)),
                function () {
                  t.isPaused() && t.start();
                })
              ),
              c([we, be], w),
              c(Ie, I);
          },
          resize: I,
          listSize: k,
          slideSize: A,
          sliderSize: _,
          totalSize: D,
          getPadding: function (e) {
            return parseFloat(j(g, f("padding" + (e ? "Right" : "Left")))) || 0;
          },
          isOverflow: x,
        };
      },
      Clones: function (e, t, n) {
        var i,
          o = xe(e),
          a = o.on,
          s = t.Elements,
          c = t.Slides,
          l = t.Direction.resolve,
          u = [];
        function d() {
          a(be, h),
            a([we, Ie], p),
            (i = m()) &&
              ((function (t) {
                var i = c.get().slice(),
                  o = i.length;
                if (o) {
                  for (; i.length < t; ) E(i, i);
                  E(i.slice(-t), i.slice(0, t)).forEach(function (r, a) {
                    var l = a < t,
                      d = (function (t, i) {
                        var o = t.cloneNode(!0);
                        return (
                          S(o, n.classes.clone),
                          (o.id = e.root.id + "-clone" + de(i + 1)),
                          o
                        );
                      })(r.slide, a);
                    l ? k(d, i[0].slide) : T(s.list, d),
                      E(u, d),
                      c.register(d, a - t + (l ? 0 : o), r.index);
                  });
                }
              })(i),
              t.Layout.resize(!0));
        }
        function h() {
          f(), d();
        }
        function f() {
          W(u), r(u), o.destroy();
        }
        function p() {
          var e = m();
          i !== e && (i < e || !e) && o.emit(be);
        }
        function m() {
          var i = n.clones;
          if (e.is(Lt)) {
            if (g(i)) {
              var o = n[l("fixedWidth")] && t.Layout.slideSize(0);
              i =
                (o && oe(G(s.track)[l("width")] / o)) ||
                (n[l("autoWidth")] && e.length) ||
                2 * n.perPage;
            }
          } else i = 0;
          return i;
        }
        return { mount: d, destroy: f };
      },
      Move: function (e, t, n) {
        var i,
          o = xe(e),
          r = o.on,
          a = o.emit,
          s = e.state.set,
          c = t.Layout,
          l = c.slideSize,
          u = c.getPadding,
          d = c.totalSize,
          h = c.listSize,
          f = c.sliderSize,
          p = t.Direction,
          m = p.resolve,
          y = p.orient,
          v = t.Elements,
          b = v.list,
          w = v.track;
        function I() {
          t.Controller.isBusy() ||
            (t.Scroll.cancel(), E(e.index), t.Slides.update());
        }
        function E(e) {
          C(A(e, !0));
        }
        function C(n, i) {
          if (!e.is(Nt)) {
            var o = i
              ? n
              : (function (n) {
                  if (e.is(Lt)) {
                    var i = k(n),
                      o = i > t.Controller.getEnd();
                    (i < 0 || o) && (n = S(n, o));
                  }
                  return n;
                })(n);
            j(b, "transform", "translate" + m("X") + "(" + o + "px)"),
              n !== o && a("sh");
          }
        }
        function S(e, t) {
          var n = e - _(t),
            i = f();
          return e - y(i * (oe(re(n) / i) || 1)) * (t ? 1 : -1);
        }
        function T() {
          C(D(), !0), i.cancel();
        }
        function k(e) {
          for (
            var n = t.Slides.get(), i = 0, o = 1 / 0, r = 0;
            r < n.length;
            r++
          ) {
            var a = n[r].index,
              s = re(A(a, !0) - e);
            if (!(s <= o)) break;
            (o = s), (i = a);
          }
          return i;
        }
        function A(t, i) {
          var o = y(
            d(t - 1) -
              (function (e) {
                var t = n.focus;
                return "center" === t ? (h() - l(e, !0)) / 2 : +t * l(e) || 0;
              })(t)
          );
          return i
            ? (function (t) {
                return (
                  n.trimSpace && e.is(xt) && (t = ce(t, 0, y(f(!0) - h()))), t
                );
              })(o)
            : o;
        }
        function D() {
          var e = m("left");
          return G(b)[e] - G(w)[e] + y(u(!1));
        }
        function _(e) {
          return A(e ? t.Controller.getEnd() : 0, !!n.trimSpace);
        }
        return {
          mount: function () {
            (i = t.Transition), r([pe, Ee, we, be], I);
          },
          move: function (e, t, n, o) {
            var r, c;
            e !== t &&
              ((r = e > n),
              (c = y(S(D(), r))),
              r ? c >= 0 : c <= b[m("scrollWidth")] - G(w)[m("width")]) &&
              (T(), C(S(D(), e > n), !0)),
              s(4),
              a(ge, t, n, e),
              i.start(t, function () {
                s(3), a(ye, t, n, e), o && o();
              });
          },
          jump: E,
          translate: C,
          shift: S,
          cancel: T,
          toIndex: k,
          toPosition: A,
          getPosition: D,
          getLimit: _,
          exceededLimit: function (e, t) {
            t = g(t) ? D() : t;
            var n = !0 !== e && y(t) < y(_(!1)),
              i = !1 !== e && y(t) > y(_(!0));
            return n || i;
          },
          reposition: I,
        };
      },
      Controller: function (e, t, n) {
        var i,
          o,
          r,
          a,
          c = xe(e),
          l = c.on,
          u = c.emit,
          d = t.Move,
          h = d.getPosition,
          f = d.getLimit,
          p = d.toPosition,
          y = t.Slides,
          v = y.isEnough,
          b = y.getLength,
          w = n.omitEnd,
          I = e.is(Lt),
          E = e.is(xt),
          C = s(_, !1),
          S = s(_, !0),
          T = n.start || 0,
          k = T;
        function A() {
          (o = b(!0)), (r = n.perMove), (a = n.perPage), (i = L());
          var e = ce(T, 0, w ? i : o - 1);
          e !== T && ((T = e), d.reposition());
        }
        function D() {
          i !== L() && u(Pe);
        }
        function _(e, t) {
          var n = r || (M() ? 1 : a),
            o = P(T + n * (e ? -1 : 1), T, !(r || M()));
          return -1 === o && E && !ae(h(), f(!e), 1)
            ? e
              ? 0
              : i
            : t
            ? o
            : x(o);
        }
        function P(t, s, c) {
          if (v() || M()) {
            var l = (function (t) {
              if (E && "move" === n.trimSpace && t !== T)
                for (
                  var i = h();
                  i === p(t, !0) && se(t, 0, e.length - 1, !n.rewind);

                )
                  t < T ? --t : ++t;
              return t;
            })(t);
            l !== t && ((s = t), (t = l), (c = !1)),
              t < 0 || t > i
                ? (t =
                    r || (!se(0, t, s, !0) && !se(i, s, t, !0))
                      ? I
                        ? c
                          ? t < 0
                            ? -(o % a || a)
                            : o
                          : t
                        : n.rewind
                        ? t < 0
                          ? i
                          : 0
                        : -1
                      : N(O(t)))
                : c && t !== s && (t = N(O(s) + (t < s ? -1 : 1)));
          } else t = -1;
          return t;
        }
        function x(e) {
          return I ? (e + o) % o || 0 : e;
        }
        function L() {
          for (var e = o - (M() || (I && r) ? 1 : a); w && e-- > 0; )
            if (p(o - 1, !0) !== p(e, !0)) {
              e++;
              break;
            }
          return ce(e, 0, o - 1);
        }
        function N(e) {
          return ce(M() ? e : a * e, 0, i);
        }
        function O(e) {
          return M() ? te(e, i) : ie((e >= i ? o - 1 : e) / a);
        }
        function B(e) {
          e !== T && ((k = T), (T = e));
        }
        function M() {
          return !g(n.focus) || n.isNavigation;
        }
        function F() {
          return e.state.is([4, 5]) && !!n.waitForTransition;
        }
        return {
          mount: function () {
            A(), l([we, be, Pe], A), l(Ee, D);
          },
          go: function (e, t, n) {
            if (!F()) {
              var o = (function (e) {
                  var t = T;
                  if (m(e)) {
                    var n = e.match(/([+\-<>])(\d+)?/) || [],
                      o = n[1],
                      r = n[2];
                    "+" === o || "-" === o
                      ? (t = P(T + +("" + o + (+r || 1)), T))
                      : ">" === o
                      ? (t = r ? N(+r) : C(!0))
                      : "<" === o && (t = S(!0));
                  } else t = I ? e : ce(e, 0, i);
                  return t;
                })(e),
                r = x(o);
              r > -1 && (t || r !== T) && (B(r), d.move(o, r, k, n));
            }
          },
          scroll: function (e, n, o, r) {
            t.Scroll.scroll(e, n, o, function () {
              var e = x(d.toIndex(h()));
              B(w ? te(e, i) : e), r && r();
            });
          },
          getNext: C,
          getPrev: S,
          getAdjacent: _,
          getEnd: L,
          setIndex: B,
          getIndex: function (e) {
            return e ? k : T;
          },
          toIndex: N,
          toPage: O,
          toDest: function (e) {
            var t = d.toIndex(e);
            return E ? ce(t, 0, i) : t;
          },
          hasFocus: M,
          isBusy: F,
        };
      },
      Arrows: function (e, t, n) {
        var i,
          o,
          r = xe(e),
          a = r.on,
          c = r.bind,
          l = r.emit,
          u = n.classes,
          d = n.i18n,
          h = t.Elements,
          f = t.Controller,
          p = h.arrows,
          m = h.track,
          g = p,
          y = h.prev,
          v = h.next,
          b = {};
        function w() {
          var e;
          !(e = n.arrows) ||
            (y && v) ||
            ((g = p || F("div", u.arrows)),
            (y = A(!0)),
            (v = A(!1)),
            (i = !0),
            T(g, [y, v]),
            !p && k(g, m)),
            y &&
              v &&
              (L(b, { prev: y, next: v }),
              R(g, e ? "" : "none"),
              S(g, (o = lt + "--" + n.direction)),
              e &&
                (a([pe, ye, be, Se, Pe], D),
                c(v, "click", s(C, ">")),
                c(y, "click", s(C, "<")),
                D(),
                M([y, v], Ge, m.id),
                l("arrows:mounted", y, v))),
            a(we, I);
        }
        function I() {
          E(), w();
        }
        function E() {
          r.destroy(),
            Y(g, o),
            i ? (W(p ? [y, v] : g), (y = v = null)) : B([y, v], et);
        }
        function C(e) {
          f.go(e, !0);
        }
        function A(e) {
          return U(
            '<button class="' +
              u.arrow +
              " " +
              (e ? u.prev : u.next) +
              '" type="button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40" focusable="false"><path d="' +
              (n.arrowPath ||
                "m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z") +
              '" />'
          );
        }
        function D() {
          if (y && v) {
            var t = e.index,
              n = f.getPrev(),
              i = f.getNext(),
              o = n > -1 && t < n ? d.last : d.prev,
              r = i > -1 && t > i ? d.first : d.next;
            (y.disabled = n < 0),
              (v.disabled = i < 0),
              M(y, Ve, o),
              M(v, Ve, r),
              l("arrows:updated", y, v, n, i);
          }
        }
        return { arrows: b, mount: w, destroy: E, update: D };
      },
      Autoplay: function (e, t, n) {
        var i,
          o,
          r = xe(e),
          a = r.on,
          s = r.bind,
          c = r.emit,
          l = Le(n.interval, e.go.bind(e, ">"), function (e) {
            var t = d.bar;
            t && j(t, "width", 100 * e + "%"), c("autoplay:playing", e);
          }),
          u = l.isPaused,
          d = t.Elements,
          h = t.Elements,
          f = h.root,
          p = h.toggle,
          m = n.autoplay,
          g = "pause" === m;
        function y() {
          u() &&
            t.Slides.isEnough() &&
            (l.start(!n.resetProgress), (o = i = g = !1), w(), c(Ae));
        }
        function v(e) {
          void 0 === e && (e = !0), (g = !!e), w(), u() || (l.pause(), c(De));
        }
        function b() {
          g || (i || o ? v(!1) : y());
        }
        function w() {
          p && (C(p, bt, !g), M(p, Ve, n.i18n[g ? "play" : "pause"]));
        }
        function I(e) {
          var i = t.Slides.getAt(e);
          l.set((i && +$(i.slide, Ot)) || n.interval);
        }
        return {
          mount: function () {
            m &&
              (n.pauseOnHover &&
                s(f, "mouseenter mouseleave", function (e) {
                  (i = "mouseenter" === e.type), b();
                }),
              n.pauseOnFocus &&
                s(f, "focusin focusout", function (e) {
                  (o = "focusin" === e.type), b();
                }),
              p &&
                s(p, "click", function () {
                  g ? y() : v(!0);
                }),
              a([ge, Ce, be], l.rewind),
              a(ge, I),
              p && M(p, Ge, d.track.id),
              g || y(),
              w());
          },
          destroy: l.cancel,
          play: y,
          pause: v,
          isPaused: u,
        };
      },
      Cover: function (e, t, n) {
        var i = xe(e).on;
        function o(e) {
          t.Slides.forEach(function (t) {
            var n = _(t.container || t.slide, "img");
            n && n.src && r(e, n, t);
          });
        }
        function r(e, t, n) {
          n.style(
            "background",
            e ? 'center/cover no-repeat url("' + t.src + '")' : "",
            !0
          ),
            R(t, e ? "none" : "");
        }
        return {
          mount: function () {
            n.cover && (i(_e, s(r, !0)), i([pe, we, be], s(o, !0)));
          },
          destroy: s(o, !1),
        };
      },
      Scroll: function (e, t, n) {
        var i,
          o,
          r = xe(e),
          a = r.on,
          c = r.emit,
          l = e.state.set,
          u = t.Move,
          d = u.getPosition,
          h = u.getLimit,
          f = u.exceededLimit,
          p = u.translate,
          m = e.is(xt),
          g = 1;
        function y(e, n, r, a, h) {
          var p = d();
          if ((w(), r && (!m || !f()))) {
            var y = t.Layout.sliderSize(),
              I = le(e) * y * ie(re(e) / y) || 0;
            e = u.toPosition(t.Controller.toDest(e % y)) + I;
          }
          var E = ae(p, e, 1);
          (g = 1),
            (n = E ? 0 : n || ne(re(e - p) / 1.5, 800)),
            (o = a),
            (i = Le(n, v, s(b, p, e, h), 1)),
            l(5),
            c(Ce),
            i.start();
        }
        function v() {
          l(3), o && o(), c(Se);
        }
        function b(e, t, i, r) {
          var a,
            s,
            c = d(),
            l =
              (e +
                (t - e) *
                  ((a = r),
                  (s = n.easingFunc) ? s(a) : 1 - Math.pow(1 - a, 4)) -
                c) *
              g;
          p(c + l),
            m &&
              !i &&
              f() &&
              ((g *= 0.6), re(l) < 10 && y(h(f(!0)), 600, !1, o, !0));
        }
        function w() {
          i && i.cancel();
        }
        function I() {
          i && !i.isPaused() && (w(), v());
        }
        return {
          mount: function () {
            a(ge, w), a([we, be], I);
          },
          destroy: w,
          scroll: y,
          cancel: I,
        };
      },
      Drag: function (e, t, n) {
        var i,
          o,
          r,
          a,
          s,
          c,
          u,
          d,
          f = xe(e),
          p = f.on,
          m = f.emit,
          g = f.bind,
          y = f.unbind,
          v = e.state,
          b = t.Move,
          w = t.Scroll,
          I = t.Controller,
          E = t.Elements.track,
          C = t.Media.reduce,
          S = t.Direction,
          T = S.resolve,
          k = S.orient,
          D = b.getPosition,
          _ = b.exceededLimit,
          P = !1;
        function x() {
          var e = n.drag;
          H(!e), (a = "free" === e);
        }
        function L(e) {
          if (((c = !1), !u)) {
            var t = $(e);
            (i = e.target),
              (o = n.noDrag),
              A(i, "." + pt + ", ." + ut) ||
                (o && A(i, o)) ||
                (!t && e.button) ||
                (I.isBusy()
                  ? V(e, !0)
                  : ((d = t ? E : window),
                    (s = v.is([4, 5])),
                    (r = null),
                    g(d, _t, N, Bt),
                    g(d, Pt, O, Bt),
                    b.cancel(),
                    w.cancel(),
                    M(e)));
          }
          var i, o;
        }
        function N(t) {
          if ((v.is(6) || (v.set(6), m("drag")), t.cancelable))
            if (s) {
              b.translate(i + F(t) / (P && e.is(xt) ? 5 : 1));
              var o = j(t) > 200,
                r = P !== (P = _());
              (o || r) && M(t), (c = !0), m("dragging"), V(t);
            } else
              (function (e) {
                return re(F(e)) > re(F(e, !0));
              })(t) &&
                ((s = (function (e) {
                  var t = n.dragMinThreshold,
                    i = h(t),
                    o = (i && t.mouse) || 0,
                    r = (i ? t.touch : +t) || 10;
                  return re(F(e)) > ($(e) ? r : o);
                })(t)),
                V(t));
        }
        function O(i) {
          v.is(6) && (v.set(3), m("dragged")),
            s &&
              ((function (i) {
                var o = (function (t) {
                    if (e.is(Lt) || !P) {
                      var n = j(t);
                      if (n && n < 200) return F(t) / n;
                    }
                    return 0;
                  })(i),
                  r = (function (e) {
                    return (
                      D() +
                      le(e) *
                        te(
                          re(e) * (n.flickPower || 600),
                          a
                            ? 1 / 0
                            : t.Layout.listSize() * (n.flickMaxPages || 1)
                        )
                    );
                  })(o),
                  s = n.rewind && n.rewindByDrag;
                C(!1),
                  a
                    ? I.scroll(r, 0, n.snap)
                    : e.is(Nt)
                    ? I.go(k(le(o)) < 0 ? (s ? "<" : "-") : s ? ">" : "+")
                    : e.is(xt) && P && s
                    ? I.go(_(!0) ? ">" : "<")
                    : I.go(I.toDest(r), !0),
                  C(!0);
              })(i),
              V(i)),
            y(d, _t, N),
            y(d, Pt, O),
            (s = !1);
        }
        function B(e) {
          !u && c && V(e, !0);
        }
        function M(e) {
          (r = o), (o = e), (i = D());
        }
        function F(e, t) {
          return z(e, t) - z(R(e), t);
        }
        function j(e) {
          return J(e) - J(R(e));
        }
        function R(e) {
          return (o === e && r) || o;
        }
        function z(e, t) {
          return ($(e) ? e.changedTouches[0] : e)["page" + T(t ? "Y" : "X")];
        }
        function $(e) {
          return "undefined" != typeof TouchEvent && e instanceof TouchEvent;
        }
        function H(e) {
          u = e;
        }
        return {
          mount: function () {
            g(E, _t, l, Bt),
              g(E, Pt, l, Bt),
              g(E, Dt, L, Bt),
              g(E, "click", B, { capture: !0 }),
              g(E, "dragstart", V),
              p([pe, we], x);
          },
          disable: H,
          isDragging: function () {
            return s;
          },
        };
      },
      Keyboard: function (e, t, n) {
        var i,
          o,
          r = xe(e),
          a = r.on,
          s = r.bind,
          l = r.unbind,
          u = e.root,
          d = t.Direction.resolve;
        function h() {
          var e = n.keyboard;
          e && ((i = "global" === e ? window : u), s(i, jt, m));
        }
        function f() {
          l(i, jt);
        }
        function p() {
          var e = o;
          (o = !0),
            c(function () {
              o = e;
            });
        }
        function m(t) {
          if (!o) {
            var n = Ft(t);
            n === d(Oe) ? e.go("<") : n === d(Be) && e.go(">");
          }
        }
        return {
          mount: function () {
            h(), a(we, f), a(we, h), a(ge, p);
          },
          destroy: f,
          disable: function (e) {
            o = e;
          },
        };
      },
      LazyLoad: function (e, t, n) {
        var i = xe(e),
          o = i.on,
          a = i.off,
          c = i.bind,
          l = i.emit,
          u = "sequential" === n.lazyLoad,
          d = [ye, Se],
          h = [];
        function f() {
          r(h),
            t.Slides.forEach(function (e) {
              q(e.slide, $t).forEach(function (t) {
                var i = $(t, Rt),
                  o = $(t, zt);
                if (i !== t.src || o !== t.srcset) {
                  var r = n.classes.spinner,
                    a = t.parentElement,
                    s = _(a, "." + r) || F("span", r, a);
                  h.push([t, e, s]), t.src || R(t, "none");
                }
              });
            }),
            u ? y() : (a(d), o(d, p), p());
        }
        function p() {
          (h = h.filter(function (t) {
            var i = n.perPage * ((n.preloadPages || 1) + 1) - 1;
            return !t[1].isWithin(e.index, i) || m(t);
          })).length || a(d);
        }
        function m(e) {
          var t = e[0];
          S(e[1].slide, Ct),
            c(t, "load error", s(g, e)),
            M(t, "src", $(t, Rt)),
            M(t, "srcset", $(t, zt)),
            B(t, Rt),
            B(t, zt);
        }
        function g(e, t) {
          var n = e[0],
            i = e[1];
          Y(i.slide, Ct),
            "error" !== t.type && (W(e[2]), R(n, ""), l(_e, n, i), l(Ie)),
            u && y();
        }
        function y() {
          h.length && m(h.shift());
        }
        return {
          mount: function () {
            n.lazyLoad && (f(), o(be, f));
          },
          destroy: s(r, h),
          check: p,
        };
      },
      Pagination: function (e, t, n) {
        var i,
          o,
          c = xe(e),
          l = c.on,
          u = c.emit,
          d = c.bind,
          h = t.Slides,
          f = t.Elements,
          p = t.Controller,
          m = p.hasFocus,
          g = p.getIndex,
          y = p.go,
          v = t.Direction.resolve,
          b = f.pagination,
          w = [];
        function I() {
          i && (W(b ? a(i.children) : i), Y(i, o), r(w), (i = null)),
            c.destroy();
        }
        function E(e) {
          y(">" + e, !0);
        }
        function C(e, t) {
          var n = w.length,
            i = Ft(t),
            o = T(),
            r = -1;
          i === v(Be, !1, o)
            ? (r = ++e % n)
            : i === v(Oe, !1, o)
            ? (r = (--e + n) % n)
            : "Home" === i
            ? (r = 0)
            : "End" === i && (r = n - 1);
          var a = w[r];
          a && (z(a.button), y(">" + r), V(t, !0));
        }
        function T() {
          return n.paginationDirection || n.direction;
        }
        function k(e) {
          return w[p.toPage(e)];
        }
        function A() {
          var e = k(g(!0)),
            t = k(g());
          if (e) {
            var n = e.button;
            Y(n, bt), B(n, Ue), M(n, $e, -1);
          }
          if (t) {
            var o = t.button;
            S(o, bt), M(o, Ue, !0), M(o, $e, "");
          }
          u("pagination:updated", { list: i, items: w }, e, t);
        }
        return {
          items: w,
          mount: function t() {
            I(), l([we, be, Pe], t);
            var r = n.pagination;
            b && R(b, r ? "" : "none"),
              r &&
                (l([ge, Ce, Se], A),
                (function () {
                  var t = e.length,
                    r = n.classes,
                    a = n.i18n,
                    c = n.perPage,
                    l = m() ? p.getEnd() + 1 : oe(t / c);
                  S(
                    (i = b || F("ul", r.pagination, f.track.parentElement)),
                    (o = ft + "--" + T())
                  ),
                    M(i, ze, "tablist"),
                    M(i, Ve, a.select),
                    M(i, Ye, T() === je ? "vertical" : "");
                  for (var u = 0; u < l; u++) {
                    var g = F("li", null, i),
                      y = F("button", { class: r.page, type: "button" }, g),
                      v = h.getIn(u).map(function (e) {
                        return e.slide.id;
                      }),
                      I = !m() && c > 1 ? a.pageX : a.slideX;
                    d(y, "click", s(E, u)),
                      n.paginationKeyboard && d(y, "keydown", s(C, u)),
                      M(g, ze, "presentation"),
                      M(y, ze, "tab"),
                      M(y, Ge, v.join(" ")),
                      M(y, Ve, ue(I, u + 1)),
                      M(y, $e, -1),
                      w.push({ li: g, button: y, page: u });
                  }
                })(),
                A(),
                u("pagination:mounted", { list: i, items: w }, k(e.index)));
          },
          destroy: I,
          getAt: k,
          update: A,
        };
      },
      Sync: function (e, t, n) {
        var i = n.isNavigation,
          o = n.slideFocus,
          a = [];
        function c() {
          var t, n;
          e.splides.forEach(function (t) {
            t.isParent || (u(e, t.splide), u(t.splide, e));
          }),
            i &&
              ((n = (t = xe(e)).on)(ve, h),
              n("sk", f),
              n([pe, we], d),
              a.push(t),
              t.emit(ke, e.splides));
        }
        function l() {
          a.forEach(function (e) {
            e.destroy();
          }),
            r(a);
        }
        function u(e, t) {
          var n = xe(e);
          n.on(ge, function (e, n, i) {
            t.go(t.is(Lt) ? i : e);
          }),
            a.push(n);
        }
        function d() {
          M(t.Elements.list, Ye, n.direction === je ? "vertical" : "");
        }
        function h(t) {
          e.go(t.index);
        }
        function f(e, t) {
          I(Ht, Ft(t)) && (h(e), V(t));
        }
        return {
          setup: s(t.Media.set, { slideFocus: g(o) ? i : o }, !0),
          mount: c,
          destroy: l,
          remount: function () {
            l(), c();
          },
        };
      },
      Wheel: function (e, t, n) {
        var i = xe(e).bind,
          o = 0;
        function r(i) {
          if (i.cancelable) {
            var r = i.deltaY,
              a = r < 0,
              s = J(i),
              c = n.wheelMinThreshold || 0,
              l = n.wheelSleep || 0;
            re(r) > c && s - o > l && (e.go(a ? "<" : ">"), (o = s)),
              (function (i) {
                return (
                  !n.releaseWheel ||
                  e.state.is(4) ||
                  -1 !== t.Controller.getAdjacent(i)
                );
              })(a) && V(i);
          }
        }
        return {
          mount: function () {
            n.wheel && i(t.Elements.track, "wheel", r, Bt);
          },
        };
      },
      Live: function (e, t, n) {
        var i = xe(e).on,
          o = t.Elements.track,
          r = n.live && !n.isNavigation,
          a = F("span", yt),
          c = Le(90, s(l, !1));
        function l(e) {
          M(o, Qe, e), e ? (T(o, a), c.start()) : (W(a), c.cancel());
        }
        function u(e) {
          r && M(o, Ke, e ? "off" : "polite");
        }
        return {
          mount: function () {
            r &&
              (u(!t.Autoplay.isPaused()),
              M(o, Ze, !0),
              (a.textContent = "…"),
              i(Ae, s(u, !0)),
              i(De, s(u, !1)),
              i([ye, Se], s(l, !0)));
          },
          disable: u,
          destroy: function () {
            B(o, [Ke, Ze, Qe]), W(a);
          },
        };
      },
    }),
    Wt = {
      type: "slide",
      role: "region",
      speed: 400,
      perPage: 1,
      cloneStatus: !0,
      arrows: !0,
      pagination: !0,
      paginationKeyboard: !0,
      interval: 5e3,
      pauseOnHover: !0,
      pauseOnFocus: !0,
      resetProgress: !0,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
      drag: !0,
      direction: "ltr",
      trimSpace: !0,
      focusableNodes: "a, button, textarea, input, select, iframe",
      live: !0,
      classes: At,
      i18n: {
        prev: "Previous slide",
        next: "Next slide",
        first: "Go to first slide",
        last: "Go to last slide",
        slideX: "Go to slide %s",
        pageX: "Go to page %s",
        play: "Start autoplay",
        pause: "Pause autoplay",
        carousel: "carousel",
        slide: "slide",
        select: "Select a slide to show",
        slideLabel: "%s of %s",
      },
      reducedMotion: { speed: 0, rewindSpeed: 0, autoplay: "pause" },
    };
  function Ut(e, t, n) {
    var i = t.Slides;
    function o() {
      i.forEach(function (e) {
        e.style("transform", "translateX(-" + 100 * e.index + "%)");
      });
    }
    return {
      mount: function () {
        xe(e).on([pe, be], o);
      },
      start: function (e, t) {
        i.style("transition", "opacity " + n.speed + "ms " + n.easing), c(t);
      },
      cancel: l,
    };
  }
  function Vt(e, t, n) {
    var i,
      o = t.Move,
      r = t.Controller,
      a = t.Scroll,
      c = t.Elements.list,
      l = s(j, c, "transition");
    function u() {
      l(""), a.cancel();
    }
    return {
      mount: function () {
        xe(e).bind(c, "transitionend", function (e) {
          e.target === c && i && (u(), i());
        });
      },
      start: function (t, s) {
        var c = o.toPosition(t, !0),
          u = o.getPosition(),
          d = (function (t) {
            var i = n.rewindSpeed;
            if (e.is(xt) && i) {
              var o = r.getIndex(!0),
                a = r.getEnd();
              if ((0 === o && t >= a) || (o >= a && 0 === t)) return i;
            }
            return n.speed;
          })(t);
        re(c - u) >= 1 && d >= 1
          ? n.useScroll
            ? a.scroll(c, d, !1, s)
            : (l("transform " + d + "ms " + n.easing),
              o.translate(c, !0),
              (i = s))
          : (o.jump(t), s());
      },
      cancel: u,
    };
  }
  var Xt = (function () {
      function e(t, n) {
        var i;
        (this.event = xe()),
          (this.Components = {}),
          (this.state =
            ((i = 1),
            {
              set: function (e) {
                i = e;
              },
              is: function (e) {
                return I(b(e), i);
              },
            })),
          (this.splides = []),
          (this._o = {}),
          (this._E = {});
        var o = m(t) ? X(document, t) : t;
        ee(o, o + " is invalid."),
          (this.root = o),
          (n = N(
            { label: $(o, Ve) || "", labelledby: $(o, Xe) || "" },
            Wt,
            e.defaults,
            n || {}
          ));
        try {
          N(n, JSON.parse($(o, Z)));
        } catch (e) {
          ee(!1, "Invalid JSON");
        }
        this._o = Object.create(N({}, n));
      }
      var t,
        n,
        o = e.prototype;
      return (
        (o.mount = function (e, t) {
          var n = this,
            i = this.state,
            o = this.Components;
          return (
            ee(i.is([1, 7]), "Already mounted!"),
            i.set(1),
            (this._C = o),
            (this._T = t || this._T || (this.is(Nt) ? Ut : Vt)),
            (this._E = e || this._E),
            x(L({}, Gt, this._E, { Transition: this._T }), function (e, t) {
              var i = e(n, o, n._o);
              (o[t] = i), i.setup && i.setup();
            }),
            x(o, function (e) {
              e.mount && e.mount();
            }),
            this.emit(pe),
            S(this.root, vt),
            i.set(3),
            this.emit(me),
            this
          );
        }),
        (o.sync = function (e) {
          return (
            this.splides.push({ splide: e }),
            e.splides.push({ splide: this, isParent: !0 }),
            this.state.is(3) &&
              (this._C.Sync.remount(), e.Components.Sync.remount()),
            this
          );
        }),
        (o.go = function (e) {
          return this._C.Controller.go(e), this;
        }),
        (o.on = function (e, t) {
          return this.event.on(e, t), this;
        }),
        (o.off = function (e) {
          return this.event.off(e), this;
        }),
        (o.emit = function (e) {
          var t;
          return (
            (t = this.event).emit.apply(t, [e].concat(a(arguments, 1))), this
          );
        }),
        (o.add = function (e, t) {
          return this._C.Slides.add(e, t), this;
        }),
        (o.remove = function (e) {
          return this._C.Slides.remove(e), this;
        }),
        (o.is = function (e) {
          return this._o.type === e;
        }),
        (o.refresh = function () {
          return this.emit(be), this;
        }),
        (o.destroy = function (e) {
          void 0 === e && (e = !0);
          var t = this.event,
            n = this.state;
          return (
            n.is(1)
              ? xe(this).on(me, this.destroy.bind(this, e))
              : (x(
                  this._C,
                  function (t) {
                    t.destroy && t.destroy(e);
                  },
                  !0
                ),
                t.emit(Te),
                t.destroy(),
                e && r(this.splides),
                n.set(7)),
            this
          );
        }),
        (t = e),
        (n = [
          {
            key: "options",
            get: function () {
              return this._o;
            },
            set: function (e) {
              this._C.Media.set(e, !0, !0);
            },
          },
          {
            key: "length",
            get: function () {
              return this._C.Slides.getLength(!0);
            },
          },
          {
            key: "index",
            get: function () {
              return this._C.Controller.getIndex();
            },
          },
        ]) && i(t.prototype, n),
        Object.defineProperty(t, "prototype", { writable: !1 }),
        e
      );
    })(),
    qt = Xt;
  (qt.defaults = {}),
    (qt.STATES = {
      CREATED: 1,
      MOUNTED: 2,
      IDLE: 3,
      MOVING: 4,
      SCROLLING: 5,
      DRAGGING: 6,
      DESTROYED: 7,
    });
  class Yt {
    constructor(e, t) {
      (this.emptyGlowImageTag = "empty_glow_image"),
        (this.currentlyPlayingAudioElement = null),
        (this.currentlyActiveGlowImages = []),
        (this.currentlyActiveWord = null),
        (this.imagesPath = e),
        (this.audioPath = t),
        (this.currentPage = 0),
        (this.splideHandle = new qt(".splide", {
          fixedHeight: window.innerHeight - 20,
        }).mount()),
        this.splideHandle.on("move", (e, t, n) => {
          this.currentPage !== e &&
            (console.log("Stopping audio for page from move: " + t),
            (this.transitioningToPage = !0),
            this.stopPageAudio(this.book.pages[t]));
        }),
        this.splideHandle.on("moved", (e, t, n) => {
          this.currentPage !== e &&
            (console.log("Playing audio for page from moved: " + e),
            (this.currentPage = e),
            (this.transitioningToPage = !1),
            this.playPageAudio(this.book.pages[e], e));
        }),
        this.splideHandle.on("drag", (e, t, n) => {
          this.currentPage !== e &&
            (console.log("Stopping audio for page from drag: " + t),
            (this.transitioningToPage = !0),
            this.stopPageAudio(this.book.pages[t]));
        }),
        this.splideHandle.on("dragged", (e, t, n) => {
          this.currentPage !== e &&
            (console.log("Playing audio for page from dragged: " + e),
            (this.currentPage = e),
            (this.transitioningToPage = !1),
            this.playPageAudio(this.book.pages[e], e));
        }),
        this.addPageResizeListener(),
        this.addMinimzationListener();
    }
    addMinimzationListener() {
      document.addEventListener("visibilitychange", () => {
        "visible" === document.visibilityState
          ? this.playPageAudio(
              this.book.pages[this.currentPage],
              this.currentPage
            )
          : this.stopPageAudio(this.book.pages[this.currentPage]);
      });
    }
    stopPageAudio(e) {
      for (let t = 0; t < e.visualElements.length; t++) {
        let n = e.visualElements[t];
        if ("audio" === n.type) {
          let e = n,
            t = document.getElementById(e.domID);
          t.pause(),
            (t.currentTime = 0),
            clearInterval(this.currentPageAutoPlayerInterval);
          for (let t = 0; t < e.audioTimestamps.timestamps.length; t++) {
            let n = document.getElementById(e.domID + "_word_" + t);
            n.classList.remove("cr-clickable-word-active"),
              (n.style.color = "white");
          }
        }
      }
    }
    playPageAudio(e, t) {
      console.log("Attempting to play audio for page: " + t),
        console.log("Book has: " + this.book.pages.length + " pages"),
        console.log(
          "The page has " + e.visualElements.length + " visual elements"
        );
      for (let n = 0; n < e.visualElements.length; n++) {
        let i = e.visualElements[n];
        if ("audio" === i.type) {
          let e = i;
          console.log(
            "Found the audio element in page's visual elements: " + e.audioSrc
          ),
            console.log(
              "Does the audio element have timestamps? " +
                (void 0 !== e.audioTimestamps ? "Yes" : "No")
            ),
            console.log("Audio element domID: " + e.domID);
          let n = document.getElementById(e.domID);
          console.log(
            "Audio element dom is null or undefined? " +
              (null == n ? "Yes" : "No")
          ),
            n.play(),
            (this.currentlyPlayingAudioElement = n);
          let o = 0,
            r = 0;
          console.log(
            "Starting the auto player interval for word highlighting with 60ms interval"
          ),
            (this.currentPageAutoPlayerInterval = setInterval(() => {
              if (void 0 !== e.audioTimestamps) {
                let i = n.currentTime;
                for (let n = 0; n < e.audioTimestamps.timestamps.length; n++) {
                  if (
                    i >= e.audioTimestamps.timestamps[n].startTimestamp &&
                    i <= e.audioTimestamps.timestamps[n].endTimestamp
                  ) {
                    r = n;
                    let i = document.getElementById(e.domID + "_word_" + r);
                    (this.currentlyActiveWord = i),
                      i.classList.add("cr-clickable-word-active"),
                      (i.style.color = e.glowColor),
                      this.enableConnectedGraphicHighlighting(t, r);
                  }
                  if (o < r) {
                    let t = document.getElementById(e.domID + "_word_" + o);
                    t.classList.remove("cr-clickable-word-active"),
                      (t.style.color = "white"),
                      (o = r);
                  }
                }
                if (
                  i >=
                  e.audioTimestamps.timestamps[
                    e.audioTimestamps.timestamps.length - 1
                  ].endTimestamp -
                    0.1
                ) {
                  let t = document.getElementById(e.domID + "_word_" + r);
                  t.classList.remove("cr-clickable-word-active"),
                    (t.style.color = "white"),
                    (this.currentlyPlayingAudioElement = null),
                    clearInterval(this.currentPageAutoPlayerInterval);
                }
              }
            }, 60));
        }
      }
    }
    addPageResizeListener() {
      window.addEventListener("resize", () => {
        (this.splideHandle.options.fixedHeight = window.innerHeight - 20),
          this.splideHandle.refresh();
      });
    }
    initializeBook(t) {
      (this.book = t),
        (this.currentBookType = t.bookType),
        (this.numberOfPages = t.pages.length),
        this.currentBookType === e.CuriousReader
          ? this.initializeCuriousReaderBook(t)
          : this.currentBookType === e.GDL && this.initializeGDLBook(t);
    }
    initializeCuriousReaderBook(e) {
      this.numberOfPages = e.pages.length;
      for (let t = 0; t < e.pages.length; t++) {
        const n = document.createElement("li"),
          i = document.createElement("div");
        (n.style.display = "flex"),
          (n.style.justifyContent = "center"),
          (n.style.alignItems = "center"),
          (i.style.position = "relative"),
          (i.style.width = "90%"),
          (i.style.height = "90%"),
          (i.style.top = "-4%"),
          n.appendChild(i),
          n.classList.add("splide__slide");
        let o = !1;
        for (let r = 0; r < e.pages[t].visualElements.length; r++) {
          let a = e.pages[t].visualElements[r];
          if ("image" == a.type) {
            let e = a,
              n = t;
            i.appendChild(this.createImageContainer(n, e, r));
          } else if ("audio" == a.type) {
            o = !0;
            let n = a,
              r = null;
            for (let n = 0; n < e.pages[t].visualElements.length; n++) {
              let i = e.pages[t].visualElements[n];
              if ("text" == i.type) {
                r = i;
                break;
              }
            }
            let s = null;
            for (let n = 0; n < e.pages[t].visualElements.length; n++) {
              let i = e.pages[t].visualElements[n];
              if ("image" == i.type) {
                s = i;
                break;
              }
            }
            if (r) {
              let e = this.createAudioAndTextContainers(t, n, r, s);
              i.appendChild(e[0]), i.appendChild(e[1]);
            } else i.appendChild(this.createAudioContainer(n));
          }
          this.splideHandle.add(n);
        }
        if (!o)
          for (let n = 0; n < e.pages[t].visualElements.length; n++) {
            let o = e.pages[t].visualElements[n];
            if ("text" == o.type) {
              let e = o;
              i.appendChild(this.createTextContainer(e));
            }
          }
      }
    }
    createTextContainer(e) {
      let t = document.createElement("div");
      return (
        (t.id = "cr-text"),
        t.classList.add("cr-text"),
        (t.style.position = "absolute"),
        (t.style.webkitTextStroke = "1px #303030"),
        (t.style.color = "#FFFFFF"),
        (t.style.textShadow = "0.1rem 0.15rem 0.1rem #303030"),
        (t.style.fontFamily = "Quicksand"),
        (t.style.fontWeight = "800"),
        (t.style.fontSize = "inherit"),
        this.book.bookName.includes("ComeCome") ||
        this.book.bookName.includes("ILove") ||
        this.book.bookName.includes("GuessWhatIAm") ||
        this.book.bookName.includes("TheUmbrellas") ||
        this.book.bookName.includes("IAmFlying")
          ? ((t.style.top = e.positionY + "%"),
            (t.style.left = "0%"),
            (t.style.width = "100%"),
            (t.style.height = e.height + "%"),
            (t.style.textAlign = "center"))
          : ((t.style.top = e.positionY + "%"),
            (t.style.left = e.positionX + "%"),
            (t.style.width = e.width + "%"),
            (t.style.height = e.height + "%")),
        (t.innerHTML = e.textContentAsHTML.replace(/font-size:[^;]+;/g, "")),
        t
      );
    }
    createImageContainer(e, t, n) {
      let i = document.createElement("div");
      if (
        ((i.style.position = "absolute"),
        this.book.bookName.includes("ComeCome") ||
        this.book.bookName.includes("ILove") ||
        this.book.bookName.includes("GuessWhatIAm") ||
        this.book.bookName.includes("TheUmbrellas") ||
        this.book.bookName.includes("IAmFlying")
          ? (t.imageSource === this.emptyGlowImageTag
              ? (t.positionX <= 42
                  ? (i.style.left = t.positionX + 10 + "%")
                  : t.positionX >= 70
                  ? (i.style.left = t.positionX - 10 + "%")
                  : (i.style.left = t.positionX + "%"),
                (i.style.width = 0.7 * t.width + "%"),
                (i.style.height = 0.7 * t.height + "%"))
              : ((i.style.left = t.positionX + 10 + "%"),
                (i.style.width = 0.8 * t.width + "%"),
                (i.style.height = 0.8 * t.height + "%")),
            (i.style.top = t.positionY + "%"))
          : ((i.style.top = t.positionY + "%"),
            (i.style.left = t.positionX + "%"),
            (i.style.width = t.width + "%"),
            (i.style.height = t.height + "%")),
        t.imageSource === this.emptyGlowImageTag)
      )
        if (
          (i.classList.add("cr-image-empty-glow"),
          void 0 === t.domID || null === t.domID || "" === t.domID)
        ) {
          const t = "img" + e + "_" + n;
          (i.id = t),
            i.addEventListener("click", () => {
              this.handleStandaloneGlowImageClick(e, t);
            });
        } else
          i.classList.add(t.domID),
            i.addEventListener("click", () => {
              this.handleGlowImageClick(e, t.domID.split("_")[1]);
            });
      else {
        (i.id = t.domID), i.classList.add("cr-image");
        let e = document.createElement("img");
        (e.src = this.imagesPath + t.imageSource.replace("images/", "")),
          (e.style.width = "100%"),
          (e.style.height = "100%"),
          i.appendChild(e);
      }
      return i;
    }
    createAudioContainer(e) {
      let t = document.createElement("div");
      t.classList.add("cr-audio"), (t.style.position = "absolute");
      let n = document.createElement("audio");
      if (
        ((n.id = e.domID),
        (n.src = this.audioPath + e.audioSrc.replace("audios/", "")),
        (n.controls = !1),
        t.appendChild(n),
        void 0 !== e.audioTimestamps)
      )
        for (let n = 0; n < e.audioTimestamps.timestamps.length; n++) {
          let i = e.audioTimestamps.timestamps[n],
            o = document.createElement("audio");
          (o.id = i.domID),
            (o.src = this.audioPath + i.audioSrc.replace("audios/", "")),
            (o.controls = !1),
            t.appendChild(o);
        }
      return t;
    }
    createAudioAndTextContainers(e, t, n, i) {
      let o = Array(),
        r = document.createElement("div");
      r.classList.add("cr-audio"), (r.style.position = "absolute");
      let a = document.createElement("audio");
      (a.id = t.domID),
        (a.src = this.audioPath + t.audioSrc.replace("audios/", "")),
        (a.controls = !1),
        r.appendChild(a);
      let s = Array();
      if (void 0 !== t.audioTimestamps)
        for (let e = 0; e < t.audioTimestamps.timestamps.length; e++) {
          let n = t.audioTimestamps.timestamps[e],
            i = document.createElement("audio");
          (i.id = n.domID),
            (i.src = this.audioPath + n.audioSrc.replace("audios/", "")),
            (i.controls = !1),
            s.push(n.word.trim()),
            r.appendChild(i);
        }
      o.push(r);
      let c = t.domID,
        l = document.createElement("div");
      (l.id = "cr-text"),
        l.classList.add("cr-text"),
        (l.style.position = "absolute"),
        (l.style.display = "flex"),
        (l.style.justifyContent = "center"),
        (l.style.alignItems = "center"),
        (l.style.webkitTextStroke = "1px #303030"),
        (l.style.color = "#FFFFFF"),
        (l.style.textShadow = "0.1rem 0.15rem 0.1rem #303030"),
        (l.style.fontFamily = "Quicksand"),
        (l.style.fontWeight = "800"),
        this.book.bookName.includes("ComeCome") ||
        this.book.bookName.includes("ILove") ||
        this.book.bookName.includes("GuessWhatIAm") ||
        this.book.bookName.includes("TheUmbrellas") ||
        this.book.bookName.includes("IAmFlying")
          ? ((n.width = 100),
            (n.positionX = 0),
            (n.positionY = 81),
            (l.style.top = "81%"))
          : ((l.style.top = n.positionY + "%"),
            (l.style.height = n.height + "%")),
        i.positionX > 28 && n.width < 88 && n.positionY < 65
          ? ((l.style.left = n.positionX + "%"), (l.style.width = "42%"))
          : i.positionX <= 28 && n.width < 88
          ? ((l.style.left = n.positionX + 2 + "%"),
            (l.style.width = n.width + "%"))
          : (l.style.width = "100%");
      let u = document.createElement("p");
      void 0 !== t.audioTimestamps && t.audioTimestamps.timestamps.length > 15
        ? u.classList.add("cr-sentence-mini-s")
        : void 0 !== t.audioTimestamps &&
          t.audioTimestamps.timestamps.length > 10 &&
          t.audioTimestamps.timestamps.length <= 15 &&
          u.classList.add("cr-sentence-mini"),
        (u.style.textAlign = "center"),
        (u.style.margin = "0px");
      for (let t = 0; t < s.length; t++) {
        let n = document.createElement("div");
        (n.id = c + "_word_" + t),
          n.classList.add("cr-clickable-word"),
          (n.style.marginLeft = "10px"),
          (n.style.marginRight = "10px"),
          (n.innerText = s[t]),
          n.addEventListener("click", (n) => {
            this.handleInteractiveWordClick(e, t);
          }),
          u.appendChild(n);
      }
      return l.appendChild(u), o.push(l), o;
    }
    handleStandaloneGlowImageClick(e, t) {
      if (
        null !== this.currentlyPlayingAudioElement &&
        (this.currentlyPlayingAudioElement.pause(),
        (this.currentlyPlayingAudioElement.currentTime = 0),
        clearInterval(this.currentPageAutoPlayerInterval),
        clearTimeout(this.currentWordPlayingTimeout),
        clearTimeout(this.currentGlowImageTimeout),
        this.currentlyActiveGlowImages.length > 0)
      )
        for (let e = 0; e < this.currentlyActiveGlowImages.length; e++)
          this.currentlyActiveGlowImages[e].style.boxShadow =
            "transparent 0px 0px 20px 20px";
      this.currentlyActiveGlowImages = Array();
      let n = document.getElementById(t);
      this.currentlyActiveGlowImages.push(n),
        (n.style.boxShadow = "orange 0px 0px 20px 20px"),
        (this.currentGlowImageTimeout = setTimeout(() => {
          document.getElementById(t).style.boxShadow =
            "transparent 0px 0px 20px 20px";
        }, 600));
    }
    handleGlowImageClick(e, t) {
      let n = parseInt(t);
      this.handleInteractiveWordClick(e, n);
    }
    enableConnectedGraphicHighlighting(e, t) {
      this.handleInteractiveWordClick(e, t, !0);
    }
    handleInteractiveWordClick(e, t, n = !1) {
      if (
        null !== this.currentlyPlayingAudioElement &&
        !n &&
        (this.currentlyPlayingAudioElement.pause(),
        (this.currentlyPlayingAudioElement.currentTime = 0),
        clearInterval(this.currentPageAutoPlayerInterval),
        clearTimeout(this.currentWordPlayingTimeout),
        clearTimeout(this.currentGlowImageTimeout),
        null !== this.currentlyActiveWord &&
          (this.currentlyActiveWord.classList.remove(
            "cr-clickable-word-active"
          ),
          (this.currentlyActiveWord.style.color = "white")),
        this.currentlyActiveGlowImages.length > 0)
      )
        for (let e = 0; e < this.currentlyActiveGlowImages.length; e++)
          this.currentlyActiveGlowImages[e].style.boxShadow =
            "transparent 0px 0px 20px 20px";
      this.currentlyActiveGlowImages = Array();
      let i = this.book.pages[e];
      for (let e = 0; e < i.visualElements.length; e++) {
        let o = i.visualElements[e];
        if ("audio" === o.type) {
          let e = o,
            i = document.getElementById(e.audioTimestamps.timestamps[t].domID);
          if (!n) {
            let n = document.getElementById(e.domID + "_word_" + t);
            (this.currentlyActiveWord = n),
              n.classList.add("cr-clickable-word-active"),
              (n.style.color = e.glowColor),
              (this.currentWordPlayingTimeout = setTimeout(() => {
                n.classList.remove("cr-clickable-word-active"),
                  (n.style.color = "white");
              }, 600));
          }
          let r = "img" + e.domID + "_" + t,
            a = document.getElementsByClassName(r);
          for (let t = 0; t < a.length; t++) {
            let n = a[t];
            this.currentlyActiveGlowImages.push(n),
              (n.style.boxShadow = e.glowColor + " 0px 0px 20px 20px");
          }
          (this.currentGlowImageTimeout = setTimeout(() => {
            for (let e = 0; e < a.length; e++)
              a[e].style.boxShadow = "transparent 0px 0px 20px 20px";
          }, 600)),
            n || ((this.currentlyPlayingAudioElement = i), i.play());
        }
      }
    }
    initializeGDLBook(e) {
      for (let t = 0; t < e.pages.length; t++) {
        const n = document.createElement("li");
        n.classList.add("splide__slide");
        let i = document.createElement("div");
        i.classList.add("gdl-flex-container"),
          (i.style.display = "flex"),
          (i.style.flexDirection = "column"),
          (i.style.justifyContent = "center"),
          (i.style.alignItems = "center"),
          (i.style.height = "100%"),
          (i.style.width = "100%"),
          n.appendChild(i);
        for (let n = 0; n < e.pages[t].visualElements.length; n++) {
          let o = e.pages[t].visualElements[n];
          if ("text" == o.type) {
            let e = o,
              t = document.createElement("div");
            (t.style.width = "60%"),
              t.classList.add("gdl-text"),
              (t.style.webkitTextStroke = "1px #303030"),
              (t.style.color = "#FFFFFF"),
              (t.style.textShadow = "0.1rem 0.15rem 0.1rem #303030"),
              (t.style.fontFamily = "Quicksand"),
              (t.style.fontWeight = "800"),
              (t.style.fontSize = "1.7em"),
              (t.innerHTML = e.textContentAsHTML.replace("2.25em", "28px")),
              i.appendChild(t);
          } else if ("image" == o.type) {
            let e = o,
              t = document.createElement("div");
            t.classList.add("gdl-image");
            let n = document.createElement("img");
            (n.src = this.imagesPath + e.imageSource.replace("images/", "")),
              (n.style.width = "100%"),
              (n.style.height = "100%"),
              t.appendChild(n),
              i.appendChild(t);
          }
        }
        this.splideHandle.add(n);
      }
    }
    goToNextPage() {
      this.transitioningToPage ||
        (this.currentPage < this.numberOfPages && this.currentPage++,
        this.transitionToPage(this.currentPage));
    }
    goToPreviousPage() {
      this.transitioningToPage ||
        (this.currentPage > 0 && this.currentPage--,
        this.transitionToPage(this.currentPage));
    }
    transitionToPage(e) {
      this.transitioningToPage = !0;
    }
  }
  const Jt = function (e) {
      const t = [];
      let n = 0;
      for (let i = 0; i < e.length; i++) {
        let o = e.charCodeAt(i);
        o < 128
          ? (t[n++] = o)
          : o < 2048
          ? ((t[n++] = (o >> 6) | 192), (t[n++] = (63 & o) | 128))
          : 55296 == (64512 & o) &&
            i + 1 < e.length &&
            56320 == (64512 & e.charCodeAt(i + 1))
          ? ((o = 65536 + ((1023 & o) << 10) + (1023 & e.charCodeAt(++i))),
            (t[n++] = (o >> 18) | 240),
            (t[n++] = ((o >> 12) & 63) | 128),
            (t[n++] = ((o >> 6) & 63) | 128),
            (t[n++] = (63 & o) | 128))
          : ((t[n++] = (o >> 12) | 224),
            (t[n++] = ((o >> 6) & 63) | 128),
            (t[n++] = (63 & o) | 128));
      }
      return t;
    },
    Kt = {
      byteToCharMap_: null,
      charToByteMap_: null,
      byteToCharMapWebSafe_: null,
      charToByteMapWebSafe_: null,
      ENCODED_VALS_BASE:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      get ENCODED_VALS() {
        return this.ENCODED_VALS_BASE + "+/=";
      },
      get ENCODED_VALS_WEBSAFE() {
        return this.ENCODED_VALS_BASE + "-_.";
      },
      HAS_NATIVE_SUPPORT: "function" == typeof atob,
      encodeByteArray(e, t) {
        if (!Array.isArray(e))
          throw Error("encodeByteArray takes an array as a parameter");
        this.init_();
        const n = t ? this.byteToCharMapWebSafe_ : this.byteToCharMap_,
          i = [];
        for (let t = 0; t < e.length; t += 3) {
          const o = e[t],
            r = t + 1 < e.length,
            a = r ? e[t + 1] : 0,
            s = t + 2 < e.length,
            c = s ? e[t + 2] : 0,
            l = o >> 2,
            u = ((3 & o) << 4) | (a >> 4);
          let d = ((15 & a) << 2) | (c >> 6),
            h = 63 & c;
          s || ((h = 64), r || (d = 64)), i.push(n[l], n[u], n[d], n[h]);
        }
        return i.join("");
      },
      encodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? btoa(e)
          : this.encodeByteArray(Jt(e), t);
      },
      decodeString(e, t) {
        return this.HAS_NATIVE_SUPPORT && !t
          ? atob(e)
          : (function (e) {
              const t = [];
              let n = 0,
                i = 0;
              for (; n < e.length; ) {
                const o = e[n++];
                if (o < 128) t[i++] = String.fromCharCode(o);
                else if (o > 191 && o < 224) {
                  const r = e[n++];
                  t[i++] = String.fromCharCode(((31 & o) << 6) | (63 & r));
                } else if (o > 239 && o < 365) {
                  const r =
                    (((7 & o) << 18) |
                      ((63 & e[n++]) << 12) |
                      ((63 & e[n++]) << 6) |
                      (63 & e[n++])) -
                    65536;
                  (t[i++] = String.fromCharCode(55296 + (r >> 10))),
                    (t[i++] = String.fromCharCode(56320 + (1023 & r)));
                } else {
                  const r = e[n++],
                    a = e[n++];
                  t[i++] = String.fromCharCode(
                    ((15 & o) << 12) | ((63 & r) << 6) | (63 & a)
                  );
                }
              }
              return t.join("");
            })(this.decodeStringToByteArray(e, t));
      },
      decodeStringToByteArray(e, t) {
        this.init_();
        const n = t ? this.charToByteMapWebSafe_ : this.charToByteMap_,
          i = [];
        for (let t = 0; t < e.length; ) {
          const o = n[e.charAt(t++)],
            r = t < e.length ? n[e.charAt(t)] : 0;
          ++t;
          const a = t < e.length ? n[e.charAt(t)] : 64;
          ++t;
          const s = t < e.length ? n[e.charAt(t)] : 64;
          if ((++t, null == o || null == r || null == a || null == s))
            throw new Qt();
          const c = (o << 2) | (r >> 4);
          if ((i.push(c), 64 !== a)) {
            const e = ((r << 4) & 240) | (a >> 2);
            if ((i.push(e), 64 !== s)) {
              const e = ((a << 6) & 192) | s;
              i.push(e);
            }
          }
        }
        return i;
      },
      init_() {
        if (!this.byteToCharMap_) {
          (this.byteToCharMap_ = {}),
            (this.charToByteMap_ = {}),
            (this.byteToCharMapWebSafe_ = {}),
            (this.charToByteMapWebSafe_ = {});
          for (let e = 0; e < this.ENCODED_VALS.length; e++)
            (this.byteToCharMap_[e] = this.ENCODED_VALS.charAt(e)),
              (this.charToByteMap_[this.byteToCharMap_[e]] = e),
              (this.byteToCharMapWebSafe_[e] =
                this.ENCODED_VALS_WEBSAFE.charAt(e)),
              (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]] = e),
              e >= this.ENCODED_VALS_BASE.length &&
                ((this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)] = e),
                (this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)] = e));
        }
      },
    };
  class Qt extends Error {
    constructor() {
      super(...arguments), (this.name = "DecodeBase64StringError");
    }
  }
  const Zt = function (e) {
      return (function (e) {
        const t = Jt(e);
        return Kt.encodeByteArray(t, !0);
      })(e).replace(/\./g, "");
    },
    en = () => {
      try {
        return (
          (function () {
            if ("undefined" != typeof self) return self;
            if ("undefined" != typeof window) return window;
            if (void 0 !== t.g) return t.g;
            throw new Error("Unable to locate global object.");
          })().__FIREBASE_DEFAULTS__ ||
          (() => {
            if ("undefined" == typeof process || void 0 === process.env) return;
            const e = process.env.__FIREBASE_DEFAULTS__;
            return e ? JSON.parse(e) : void 0;
          })() ||
          (() => {
            if ("undefined" == typeof document) return;
            let e;
            try {
              e = document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/);
            } catch (e) {
              return;
            }
            const t =
              e &&
              (function (e) {
                try {
                  return Kt.decodeString(e, !0);
                } catch (e) {
                  console.error("base64Decode failed: ", e);
                }
                return null;
              })(e[1]);
            return t && JSON.parse(t);
          })()
        );
      } catch (e) {
        return void console.info(
          `Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`
        );
      }
    },
    tn = () => {
      var e;
      return null === (e = en()) || void 0 === e ? void 0 : e.config;
    };
  class nn {
    constructor() {
      (this.reject = () => {}),
        (this.resolve = () => {}),
        (this.promise = new Promise((e, t) => {
          (this.resolve = e), (this.reject = t);
        }));
    }
    wrapCallback(e) {
      return (t, n) => {
        t ? this.reject(t) : this.resolve(n),
          "function" == typeof e &&
            (this.promise.catch(() => {}), 1 === e.length ? e(t) : e(t, n));
      };
    }
  }
  function on() {
    try {
      return "object" == typeof indexedDB;
    } catch (e) {
      return !1;
    }
  }
  function rn() {
    return new Promise((e, t) => {
      try {
        let n = !0;
        const i = "validate-browser-context-for-indexeddb-analytics-module",
          o = self.indexedDB.open(i);
        (o.onsuccess = () => {
          o.result.close(), n || self.indexedDB.deleteDatabase(i), e(!0);
        }),
          (o.onupgradeneeded = () => {
            n = !1;
          }),
          (o.onerror = () => {
            var e;
            t(
              (null === (e = o.error) || void 0 === e ? void 0 : e.message) ||
                ""
            );
          });
      } catch (e) {
        t(e);
      }
    });
  }
  class an extends Error {
    constructor(e, t, n) {
      super(t),
        (this.code = e),
        (this.customData = n),
        (this.name = "FirebaseError"),
        Object.setPrototypeOf(this, an.prototype),
        Error.captureStackTrace &&
          Error.captureStackTrace(this, sn.prototype.create);
    }
  }
  class sn {
    constructor(e, t, n) {
      (this.service = e), (this.serviceName = t), (this.errors = n);
    }
    create(e, ...t) {
      const n = t[0] || {},
        i = `${this.service}/${e}`,
        o = this.errors[e],
        r = o
          ? (function (e, t) {
              return e.replace(cn, (e, n) => {
                const i = t[n];
                return null != i ? String(i) : `<${n}?>`;
              });
            })(o, n)
          : "Error",
        a = `${this.serviceName}: ${r} (${i}).`;
      return new an(i, a, n);
    }
  }
  const cn = /\{\$([^}]+)}/g;
  function ln(e, t) {
    if (e === t) return !0;
    const n = Object.keys(e),
      i = Object.keys(t);
    for (const o of n) {
      if (!i.includes(o)) return !1;
      const n = e[o],
        r = t[o];
      if (un(n) && un(r)) {
        if (!ln(n, r)) return !1;
      } else if (n !== r) return !1;
    }
    for (const e of i) if (!n.includes(e)) return !1;
    return !0;
  }
  function un(e) {
    return null !== e && "object" == typeof e;
  }
  function dn(e, t = 1e3, n = 2) {
    const i = t * Math.pow(n, e),
      o = Math.round(0.5 * i * (Math.random() - 0.5) * 2);
    return Math.min(144e5, i + o);
  }
  function hn(e) {
    return e && e._delegate ? e._delegate : e;
  }
  class fn {
    constructor(e, t, n) {
      (this.name = e),
        (this.instanceFactory = t),
        (this.type = n),
        (this.multipleInstances = !1),
        (this.serviceProps = {}),
        (this.instantiationMode = "LAZY"),
        (this.onInstanceCreated = null);
    }
    setInstantiationMode(e) {
      return (this.instantiationMode = e), this;
    }
    setMultipleInstances(e) {
      return (this.multipleInstances = e), this;
    }
    setServiceProps(e) {
      return (this.serviceProps = e), this;
    }
    setInstanceCreatedCallback(e) {
      return (this.onInstanceCreated = e), this;
    }
  }
  const pn = "[DEFAULT]";
  class mn {
    constructor(e, t) {
      (this.name = e),
        (this.container = t),
        (this.component = null),
        (this.instances = new Map()),
        (this.instancesDeferred = new Map()),
        (this.instancesOptions = new Map()),
        (this.onInitCallbacks = new Map());
    }
    get(e) {
      const t = this.normalizeInstanceIdentifier(e);
      if (!this.instancesDeferred.has(t)) {
        const e = new nn();
        if (
          (this.instancesDeferred.set(t, e),
          this.isInitialized(t) || this.shouldAutoInitialize())
        )
          try {
            const n = this.getOrInitializeService({ instanceIdentifier: t });
            n && e.resolve(n);
          } catch (e) {}
      }
      return this.instancesDeferred.get(t).promise;
    }
    getImmediate(e) {
      var t;
      const n = this.normalizeInstanceIdentifier(
          null == e ? void 0 : e.identifier
        ),
        i = null !== (t = null == e ? void 0 : e.optional) && void 0 !== t && t;
      if (!this.isInitialized(n) && !this.shouldAutoInitialize()) {
        if (i) return null;
        throw Error(`Service ${this.name} is not available`);
      }
      try {
        return this.getOrInitializeService({ instanceIdentifier: n });
      } catch (e) {
        if (i) return null;
        throw e;
      }
    }
    getComponent() {
      return this.component;
    }
    setComponent(e) {
      if (e.name !== this.name)
        throw Error(
          `Mismatching Component ${e.name} for Provider ${this.name}.`
        );
      if (this.component)
        throw Error(`Component for ${this.name} has already been provided`);
      if (((this.component = e), this.shouldAutoInitialize())) {
        if (
          (function (e) {
            return "EAGER" === e.instantiationMode;
          })(e)
        )
          try {
            this.getOrInitializeService({ instanceIdentifier: pn });
          } catch (e) {}
        for (const [e, t] of this.instancesDeferred.entries()) {
          const n = this.normalizeInstanceIdentifier(e);
          try {
            const e = this.getOrInitializeService({ instanceIdentifier: n });
            t.resolve(e);
          } catch (e) {}
        }
      }
    }
    clearInstance(e = pn) {
      this.instancesDeferred.delete(e),
        this.instancesOptions.delete(e),
        this.instances.delete(e);
    }
    async delete() {
      const e = Array.from(this.instances.values());
      await Promise.all([
        ...e.filter((e) => "INTERNAL" in e).map((e) => e.INTERNAL.delete()),
        ...e.filter((e) => "_delete" in e).map((e) => e._delete()),
      ]);
    }
    isComponentSet() {
      return null != this.component;
    }
    isInitialized(e = pn) {
      return this.instances.has(e);
    }
    getOptions(e = pn) {
      return this.instancesOptions.get(e) || {};
    }
    initialize(e = {}) {
      const { options: t = {} } = e,
        n = this.normalizeInstanceIdentifier(e.instanceIdentifier);
      if (this.isInitialized(n))
        throw Error(`${this.name}(${n}) has already been initialized`);
      if (!this.isComponentSet())
        throw Error(`Component ${this.name} has not been registered yet`);
      const i = this.getOrInitializeService({
        instanceIdentifier: n,
        options: t,
      });
      for (const [e, t] of this.instancesDeferred.entries())
        n === this.normalizeInstanceIdentifier(e) && t.resolve(i);
      return i;
    }
    onInit(e, t) {
      var n;
      const i = this.normalizeInstanceIdentifier(t),
        o =
          null !== (n = this.onInitCallbacks.get(i)) && void 0 !== n
            ? n
            : new Set();
      o.add(e), this.onInitCallbacks.set(i, o);
      const r = this.instances.get(i);
      return (
        r && e(r, i),
        () => {
          o.delete(e);
        }
      );
    }
    invokeOnInitCallbacks(e, t) {
      const n = this.onInitCallbacks.get(t);
      if (n)
        for (const i of n)
          try {
            i(e, t);
          } catch (e) {}
    }
    getOrInitializeService({ instanceIdentifier: e, options: t = {} }) {
      let n = this.instances.get(e);
      if (
        !n &&
        this.component &&
        ((n = this.component.instanceFactory(this.container, {
          instanceIdentifier: ((i = e), i === pn ? void 0 : i),
          options: t,
        })),
        this.instances.set(e, n),
        this.instancesOptions.set(e, t),
        this.invokeOnInitCallbacks(n, e),
        this.component.onInstanceCreated)
      )
        try {
          this.component.onInstanceCreated(this.container, e, n);
        } catch (e) {}
      var i;
      return n || null;
    }
    normalizeInstanceIdentifier(e = pn) {
      return this.component ? (this.component.multipleInstances ? e : pn) : e;
    }
    shouldAutoInitialize() {
      return (
        !!this.component && "EXPLICIT" !== this.component.instantiationMode
      );
    }
  }
  class gn {
    constructor(e) {
      (this.name = e), (this.providers = new Map());
    }
    addComponent(e) {
      const t = this.getProvider(e.name);
      if (t.isComponentSet())
        throw new Error(
          `Component ${e.name} has already been registered with ${this.name}`
        );
      t.setComponent(e);
    }
    addOrOverwriteComponent(e) {
      this.getProvider(e.name).isComponentSet() &&
        this.providers.delete(e.name),
        this.addComponent(e);
    }
    getProvider(e) {
      if (this.providers.has(e)) return this.providers.get(e);
      const t = new mn(e, this);
      return this.providers.set(e, t), t;
    }
    getProviders() {
      return Array.from(this.providers.values());
    }
  }
  const yn = [];
  var vn;
  !(function (e) {
    (e[(e.DEBUG = 0)] = "DEBUG"),
      (e[(e.VERBOSE = 1)] = "VERBOSE"),
      (e[(e.INFO = 2)] = "INFO"),
      (e[(e.WARN = 3)] = "WARN"),
      (e[(e.ERROR = 4)] = "ERROR"),
      (e[(e.SILENT = 5)] = "SILENT");
  })(vn || (vn = {}));
  const bn = {
      debug: vn.DEBUG,
      verbose: vn.VERBOSE,
      info: vn.INFO,
      warn: vn.WARN,
      error: vn.ERROR,
      silent: vn.SILENT,
    },
    wn = vn.INFO,
    In = {
      [vn.DEBUG]: "log",
      [vn.VERBOSE]: "log",
      [vn.INFO]: "info",
      [vn.WARN]: "warn",
      [vn.ERROR]: "error",
    },
    En = (e, t, ...n) => {
      if (t < e.logLevel) return;
      const i = new Date().toISOString(),
        o = In[t];
      if (!o)
        throw new Error(
          `Attempted to log a message with an invalid logType (value: ${t})`
        );
      console[o](`[${i}]  ${e.name}:`, ...n);
    };
  class Cn {
    constructor(e) {
      (this.name = e),
        (this._logLevel = wn),
        (this._logHandler = En),
        (this._userLogHandler = null),
        yn.push(this);
    }
    get logLevel() {
      return this._logLevel;
    }
    set logLevel(e) {
      if (!(e in vn))
        throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);
      this._logLevel = e;
    }
    setLogLevel(e) {
      this._logLevel = "string" == typeof e ? bn[e] : e;
    }
    get logHandler() {
      return this._logHandler;
    }
    set logHandler(e) {
      if ("function" != typeof e)
        throw new TypeError(
          "Value assigned to `logHandler` must be a function"
        );
      this._logHandler = e;
    }
    get userLogHandler() {
      return this._userLogHandler;
    }
    set userLogHandler(e) {
      this._userLogHandler = e;
    }
    debug(...e) {
      this._userLogHandler && this._userLogHandler(this, vn.DEBUG, ...e),
        this._logHandler(this, vn.DEBUG, ...e);
    }
    log(...e) {
      this._userLogHandler && this._userLogHandler(this, vn.VERBOSE, ...e),
        this._logHandler(this, vn.VERBOSE, ...e);
    }
    info(...e) {
      this._userLogHandler && this._userLogHandler(this, vn.INFO, ...e),
        this._logHandler(this, vn.INFO, ...e);
    }
    warn(...e) {
      this._userLogHandler && this._userLogHandler(this, vn.WARN, ...e),
        this._logHandler(this, vn.WARN, ...e);
    }
    error(...e) {
      this._userLogHandler && this._userLogHandler(this, vn.ERROR, ...e),
        this._logHandler(this, vn.ERROR, ...e);
    }
  }
  let Sn, Tn;
  const kn = new WeakMap(),
    An = new WeakMap(),
    Dn = new WeakMap(),
    _n = new WeakMap(),
    Pn = new WeakMap();
  let xn = {
    get(e, t, n) {
      if (e instanceof IDBTransaction) {
        if ("done" === t) return An.get(e);
        if ("objectStoreNames" === t) return e.objectStoreNames || Dn.get(e);
        if ("store" === t)
          return n.objectStoreNames[1]
            ? void 0
            : n.objectStore(n.objectStoreNames[0]);
      }
      return Nn(e[t]);
    },
    set: (e, t, n) => ((e[t] = n), !0),
    has: (e, t) =>
      (e instanceof IDBTransaction && ("done" === t || "store" === t)) ||
      t in e,
  };
  function Ln(e) {
    return "function" == typeof e
      ? (t = e) !== IDBDatabase.prototype.transaction ||
        "objectStoreNames" in IDBTransaction.prototype
        ? (
            Tn ||
            (Tn = [
              IDBCursor.prototype.advance,
              IDBCursor.prototype.continue,
              IDBCursor.prototype.continuePrimaryKey,
            ])
          ).includes(t)
          ? function (...e) {
              return t.apply(On(this), e), Nn(kn.get(this));
            }
          : function (...e) {
              return Nn(t.apply(On(this), e));
            }
        : function (e, ...n) {
            const i = t.call(On(this), e, ...n);
            return Dn.set(i, e.sort ? e.sort() : [e]), Nn(i);
          }
      : (e instanceof IDBTransaction &&
          (function (e) {
            if (An.has(e)) return;
            const t = new Promise((t, n) => {
              const i = () => {
                  e.removeEventListener("complete", o),
                    e.removeEventListener("error", r),
                    e.removeEventListener("abort", r);
                },
                o = () => {
                  t(), i();
                },
                r = () => {
                  n(e.error || new DOMException("AbortError", "AbortError")),
                    i();
                };
              e.addEventListener("complete", o),
                e.addEventListener("error", r),
                e.addEventListener("abort", r);
            });
            An.set(e, t);
          })(e),
        (n = e),
        (
          Sn ||
          (Sn = [
            IDBDatabase,
            IDBObjectStore,
            IDBIndex,
            IDBCursor,
            IDBTransaction,
          ])
        ).some((e) => n instanceof e)
          ? new Proxy(e, xn)
          : e);
    var t, n;
  }
  function Nn(e) {
    if (e instanceof IDBRequest)
      return (function (e) {
        const t = new Promise((t, n) => {
          const i = () => {
              e.removeEventListener("success", o),
                e.removeEventListener("error", r);
            },
            o = () => {
              t(Nn(e.result)), i();
            },
            r = () => {
              n(e.error), i();
            };
          e.addEventListener("success", o), e.addEventListener("error", r);
        });
        return (
          t
            .then((t) => {
              t instanceof IDBCursor && kn.set(t, e);
            })
            .catch(() => {}),
          Pn.set(t, e),
          t
        );
      })(e);
    if (_n.has(e)) return _n.get(e);
    const t = Ln(e);
    return t !== e && (_n.set(e, t), Pn.set(t, e)), t;
  }
  const On = (e) => Pn.get(e);
  function Bn(
    e,
    t,
    { blocked: n, upgrade: i, blocking: o, terminated: r } = {}
  ) {
    const a = indexedDB.open(e, t),
      s = Nn(a);
    return (
      i &&
        a.addEventListener("upgradeneeded", (e) => {
          i(Nn(a.result), e.oldVersion, e.newVersion, Nn(a.transaction), e);
        }),
      n &&
        a.addEventListener("blocked", (e) => n(e.oldVersion, e.newVersion, e)),
      s
        .then((e) => {
          r && e.addEventListener("close", () => r()),
            o &&
              e.addEventListener("versionchange", (e) =>
                o(e.oldVersion, e.newVersion, e)
              );
        })
        .catch(() => {}),
      s
    );
  }
  const Mn = ["get", "getKey", "getAll", "getAllKeys", "count"],
    Fn = ["put", "add", "delete", "clear"],
    jn = new Map();
  function Rn(e, t) {
    if (!(e instanceof IDBDatabase) || t in e || "string" != typeof t) return;
    if (jn.get(t)) return jn.get(t);
    const n = t.replace(/FromIndex$/, ""),
      i = t !== n,
      o = Fn.includes(n);
    if (
      !(n in (i ? IDBIndex : IDBObjectStore).prototype) ||
      (!o && !Mn.includes(n))
    )
      return;
    const r = async function (e, ...t) {
      const r = this.transaction(e, o ? "readwrite" : "readonly");
      let a = r.store;
      return (
        i && (a = a.index(t.shift())),
        (await Promise.all([a[n](...t), o && r.done]))[0]
      );
    };
    return jn.set(t, r), r;
  }
  var zn;
  (zn = xn),
    (xn = {
      ...zn,
      get: (e, t, n) => Rn(e, t) || zn.get(e, t, n),
      has: (e, t) => !!Rn(e, t) || zn.has(e, t),
    });
  class $n {
    constructor(e) {
      this.container = e;
    }
    getPlatformInfoString() {
      return this.container
        .getProviders()
        .map((e) => {
          if (
            (function (e) {
              const t = e.getComponent();
              return "VERSION" === (null == t ? void 0 : t.type);
            })(e)
          ) {
            const t = e.getImmediate();
            return `${t.library}/${t.version}`;
          }
          return null;
        })
        .filter((e) => e)
        .join(" ");
    }
  }
  const Hn = "@firebase/app",
    Gn = "0.9.27",
    Wn = new Cn("@firebase/app"),
    Un = "@firebase/app-compat",
    Vn = "@firebase/analytics-compat",
    Xn = "@firebase/analytics",
    qn = "@firebase/app-check-compat",
    Yn = "@firebase/app-check",
    Jn = "@firebase/auth",
    Kn = "@firebase/auth-compat",
    Qn = "@firebase/database",
    Zn = "@firebase/database-compat",
    ei = "@firebase/functions",
    ti = "@firebase/functions-compat",
    ni = "@firebase/installations",
    ii = "@firebase/installations-compat",
    oi = "@firebase/messaging",
    ri = "@firebase/messaging-compat",
    ai = "@firebase/performance",
    si = "@firebase/performance-compat",
    ci = "@firebase/remote-config",
    li = "@firebase/remote-config-compat",
    ui = "@firebase/storage",
    di = "@firebase/storage-compat",
    hi = "@firebase/firestore",
    fi = "@firebase/firestore-compat",
    pi = "firebase",
    mi = "[DEFAULT]",
    gi = {
      [Hn]: "fire-core",
      [Un]: "fire-core-compat",
      [Xn]: "fire-analytics",
      [Vn]: "fire-analytics-compat",
      [Yn]: "fire-app-check",
      [qn]: "fire-app-check-compat",
      [Jn]: "fire-auth",
      [Kn]: "fire-auth-compat",
      [Qn]: "fire-rtdb",
      [Zn]: "fire-rtdb-compat",
      [ei]: "fire-fn",
      [ti]: "fire-fn-compat",
      [ni]: "fire-iid",
      [ii]: "fire-iid-compat",
      [oi]: "fire-fcm",
      [ri]: "fire-fcm-compat",
      [ai]: "fire-perf",
      [si]: "fire-perf-compat",
      [ci]: "fire-rc",
      [li]: "fire-rc-compat",
      [ui]: "fire-gcs",
      [di]: "fire-gcs-compat",
      [hi]: "fire-fst",
      [fi]: "fire-fst-compat",
      "fire-js": "fire-js",
      [pi]: "fire-js-all",
    },
    yi = new Map(),
    vi = new Map();
  function bi(e, t) {
    try {
      e.container.addComponent(t);
    } catch (n) {
      Wn.debug(
        `Component ${t.name} failed to register with FirebaseApp ${e.name}`,
        n
      );
    }
  }
  function wi(e) {
    const t = e.name;
    if (vi.has(t))
      return (
        Wn.debug(`There were multiple attempts to register component ${t}.`), !1
      );
    vi.set(t, e);
    for (const t of yi.values()) bi(t, e);
    return !0;
  }
  function Ii(e, t) {
    const n = e.container
      .getProvider("heartbeat")
      .getImmediate({ optional: !0 });
    return n && n.triggerHeartbeat(), e.container.getProvider(t);
  }
  const Ei = new sn("app", "Firebase", {
    "no-app":
      "No Firebase App '{$appName}' has been created - call initializeApp() first",
    "bad-app-name": "Illegal App name: '{$appName}",
    "duplicate-app":
      "Firebase App named '{$appName}' already exists with different options or config",
    "app-deleted": "Firebase App named '{$appName}' already deleted",
    "no-options":
      "Need to provide options, when not being deployed to hosting via source.",
    "invalid-app-argument":
      "firebase.{$appName}() takes either no argument or a Firebase App instance.",
    "invalid-log-argument":
      "First argument to `onLog` must be null or a function.",
    "idb-open":
      "Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-get":
      "Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-set":
      "Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",
    "idb-delete":
      "Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",
  });
  class Ci {
    constructor(e, t, n) {
      (this._isDeleted = !1),
        (this._options = Object.assign({}, e)),
        (this._config = Object.assign({}, t)),
        (this._name = t.name),
        (this._automaticDataCollectionEnabled =
          t.automaticDataCollectionEnabled),
        (this._container = n),
        this.container.addComponent(new fn("app", () => this, "PUBLIC"));
    }
    get automaticDataCollectionEnabled() {
      return this.checkDestroyed(), this._automaticDataCollectionEnabled;
    }
    set automaticDataCollectionEnabled(e) {
      this.checkDestroyed(), (this._automaticDataCollectionEnabled = e);
    }
    get name() {
      return this.checkDestroyed(), this._name;
    }
    get options() {
      return this.checkDestroyed(), this._options;
    }
    get config() {
      return this.checkDestroyed(), this._config;
    }
    get container() {
      return this._container;
    }
    get isDeleted() {
      return this._isDeleted;
    }
    set isDeleted(e) {
      this._isDeleted = e;
    }
    checkDestroyed() {
      if (this.isDeleted)
        throw Ei.create("app-deleted", { appName: this._name });
    }
  }
  function Si(e, t = {}) {
    let n = e;
    "object" != typeof t && (t = { name: t });
    const i = Object.assign(
        { name: mi, automaticDataCollectionEnabled: !1 },
        t
      ),
      o = i.name;
    if ("string" != typeof o || !o)
      throw Ei.create("bad-app-name", { appName: String(o) });
    if ((n || (n = tn()), !n)) throw Ei.create("no-options");
    const r = yi.get(o);
    if (r) {
      if (ln(n, r.options) && ln(i, r.config)) return r;
      throw Ei.create("duplicate-app", { appName: o });
    }
    const a = new gn(o);
    for (const e of vi.values()) a.addComponent(e);
    const s = new Ci(n, i, a);
    return yi.set(o, s), s;
  }
  function Ti(e, t, n) {
    var i;
    let o = null !== (i = gi[e]) && void 0 !== i ? i : e;
    n && (o += `-${n}`);
    const r = o.match(/\s|\//),
      a = t.match(/\s|\//);
    if (r || a) {
      const e = [`Unable to register library "${o}" with version "${t}":`];
      return (
        r &&
          e.push(
            `library name "${o}" contains illegal characters (whitespace or "/")`
          ),
        r && a && e.push("and"),
        a &&
          e.push(
            `version name "${t}" contains illegal characters (whitespace or "/")`
          ),
        void Wn.warn(e.join(" "))
      );
    }
    wi(new fn(`${o}-version`, () => ({ library: o, version: t }), "VERSION"));
  }
  const ki = "firebase-heartbeat-store";
  let Ai = null;
  function Di() {
    return (
      Ai ||
        (Ai = Bn("firebase-heartbeat-database", 1, {
          upgrade: (e, t) => {
            if (0 === t)
              try {
                e.createObjectStore(ki);
              } catch (e) {
                console.warn(e);
              }
          },
        }).catch((e) => {
          throw Ei.create("idb-open", { originalErrorMessage: e.message });
        })),
      Ai
    );
  }
  async function _i(e, t) {
    try {
      const n = (await Di()).transaction(ki, "readwrite"),
        i = n.objectStore(ki);
      await i.put(t, Pi(e)), await n.done;
    } catch (e) {
      if (e instanceof an) Wn.warn(e.message);
      else {
        const t = Ei.create("idb-set", {
          originalErrorMessage: null == e ? void 0 : e.message,
        });
        Wn.warn(t.message);
      }
    }
  }
  function Pi(e) {
    return `${e.name}!${e.options.appId}`;
  }
  class xi {
    constructor(e) {
      (this.container = e), (this._heartbeatsCache = null);
      const t = this.container.getProvider("app").getImmediate();
      (this._storage = new Ni(t)),
        (this._heartbeatsCachePromise = this._storage
          .read()
          .then((e) => ((this._heartbeatsCache = e), e)));
    }
    async triggerHeartbeat() {
      var e, t;
      const n = this.container
          .getProvider("platform-logger")
          .getImmediate()
          .getPlatformInfoString(),
        i = Li();
      if (
        (null !=
          (null === (e = this._heartbeatsCache) || void 0 === e
            ? void 0
            : e.heartbeats) ||
          ((this._heartbeatsCache = await this._heartbeatsCachePromise),
          null !=
            (null === (t = this._heartbeatsCache) || void 0 === t
              ? void 0
              : t.heartbeats))) &&
        this._heartbeatsCache.lastSentHeartbeatDate !== i &&
        !this._heartbeatsCache.heartbeats.some((e) => e.date === i)
      )
        return (
          this._heartbeatsCache.heartbeats.push({ date: i, agent: n }),
          (this._heartbeatsCache.heartbeats =
            this._heartbeatsCache.heartbeats.filter((e) => {
              const t = new Date(e.date).valueOf();
              return Date.now() - t <= 2592e6;
            })),
          this._storage.overwrite(this._heartbeatsCache)
        );
    }
    async getHeartbeatsHeader() {
      var e;
      if (
        (null === this._heartbeatsCache && (await this._heartbeatsCachePromise),
        null ==
          (null === (e = this._heartbeatsCache) || void 0 === e
            ? void 0
            : e.heartbeats) || 0 === this._heartbeatsCache.heartbeats.length)
      )
        return "";
      const t = Li(),
        { heartbeatsToSend: n, unsentEntries: i } = (function (e, t = 1024) {
          const n = [];
          let i = e.slice();
          for (const o of e) {
            const e = n.find((e) => e.agent === o.agent);
            if (e) {
              if ((e.dates.push(o.date), Oi(n) > t)) {
                e.dates.pop();
                break;
              }
            } else if (
              (n.push({ agent: o.agent, dates: [o.date] }), Oi(n) > t)
            ) {
              n.pop();
              break;
            }
            i = i.slice(1);
          }
          return { heartbeatsToSend: n, unsentEntries: i };
        })(this._heartbeatsCache.heartbeats),
        o = Zt(JSON.stringify({ version: 2, heartbeats: n }));
      return (
        (this._heartbeatsCache.lastSentHeartbeatDate = t),
        i.length > 0
          ? ((this._heartbeatsCache.heartbeats = i),
            await this._storage.overwrite(this._heartbeatsCache))
          : ((this._heartbeatsCache.heartbeats = []),
            this._storage.overwrite(this._heartbeatsCache)),
        o
      );
    }
  }
  function Li() {
    return new Date().toISOString().substring(0, 10);
  }
  class Ni {
    constructor(e) {
      (this.app = e),
        (this._canUseIndexedDBPromise = this.runIndexedDBEnvironmentCheck());
    }
    async runIndexedDBEnvironmentCheck() {
      return (
        !!on() &&
        rn()
          .then(() => !0)
          .catch(() => !1)
      );
    }
    async read() {
      if (await this._canUseIndexedDBPromise) {
        const e = await (async function (e) {
          try {
            const t = (await Di()).transaction(ki),
              n = await t.objectStore(ki).get(Pi(e));
            return await t.done, n;
          } catch (e) {
            if (e instanceof an) Wn.warn(e.message);
            else {
              const t = Ei.create("idb-get", {
                originalErrorMessage: null == e ? void 0 : e.message,
              });
              Wn.warn(t.message);
            }
          }
        })(this.app);
        return (null == e ? void 0 : e.heartbeats) ? e : { heartbeats: [] };
      }
      return { heartbeats: [] };
    }
    async overwrite(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return _i(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: e.heartbeats,
        });
      }
    }
    async add(e) {
      var t;
      if (await this._canUseIndexedDBPromise) {
        const n = await this.read();
        return _i(this.app, {
          lastSentHeartbeatDate:
            null !== (t = e.lastSentHeartbeatDate) && void 0 !== t
              ? t
              : n.lastSentHeartbeatDate,
          heartbeats: [...n.heartbeats, ...e.heartbeats],
        });
      }
    }
  }
  function Oi(e) {
    return Zt(JSON.stringify({ version: 2, heartbeats: e })).length;
  }
  wi(new fn("platform-logger", (e) => new $n(e), "PRIVATE")),
    wi(new fn("heartbeat", (e) => new xi(e), "PRIVATE")),
    Ti(Hn, Gn, ""),
    Ti(Hn, Gn, "esm2017"),
    Ti("fire-js", ""),
    Ti("firebase", "10.8.0", "app");
  const Bi = "@firebase/installations",
    Mi = "0.6.5",
    Fi = `w:${Mi}`,
    ji = "FIS_v2",
    Ri = new sn("installations", "Installations", {
      "missing-app-config-values":
        'Missing App configuration value: "{$valueName}"',
      "not-registered": "Firebase Installation is not registered.",
      "installation-not-found": "Firebase Installation not found.",
      "request-failed":
        '{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',
      "app-offline": "Could not process request. Application offline.",
      "delete-pending-registration":
        "Can't delete installation while there is a pending registration request.",
    });
  function zi(e) {
    return e instanceof an && e.code.includes("request-failed");
  }
  function $i({ projectId: e }) {
    return `https://firebaseinstallations.googleapis.com/v1/projects/${e}/installations`;
  }
  function Hi(e) {
    return {
      token: e.token,
      requestStatus: 2,
      expiresIn: ((t = e.expiresIn), Number(t.replace("s", "000"))),
      creationTime: Date.now(),
    };
    var t;
  }
  async function Gi(e, t) {
    const n = (await t.json()).error;
    return Ri.create("request-failed", {
      requestName: e,
      serverCode: n.code,
      serverMessage: n.message,
      serverStatus: n.status,
    });
  }
  function Wi({ apiKey: e }) {
    return new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-goog-api-key": e,
    });
  }
  async function Ui(e) {
    const t = await e();
    return t.status >= 500 && t.status < 600 ? e() : t;
  }
  function Vi(e) {
    return new Promise((t) => {
      setTimeout(t, e);
    });
  }
  const Xi = /^[cdef][\w-]{21}$/;
  function qi() {
    try {
      const e = new Uint8Array(17);
      (self.crypto || self.msCrypto).getRandomValues(e),
        (e[0] = 112 + (e[0] % 16));
      const t = (function (e) {
        var t;
        return ((t = e),
        btoa(String.fromCharCode(...t))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")).substr(0, 22);
      })(e);
      return Xi.test(t) ? t : "";
    } catch (e) {
      return "";
    }
  }
  function Yi(e) {
    return `${e.appName}!${e.appId}`;
  }
  const Ji = new Map();
  function Ki(e, t) {
    const n = Yi(e);
    Qi(n, t),
      (function (e, t) {
        const n =
          (!Zi &&
            "BroadcastChannel" in self &&
            ((Zi = new BroadcastChannel("[Firebase] FID Change")),
            (Zi.onmessage = (e) => {
              Qi(e.data.key, e.data.fid);
            })),
          Zi);
        n && n.postMessage({ key: e, fid: t }),
          0 === Ji.size && Zi && (Zi.close(), (Zi = null));
      })(n, t);
  }
  function Qi(e, t) {
    const n = Ji.get(e);
    if (n) for (const e of n) e(t);
  }
  let Zi = null;
  const eo = "firebase-installations-store";
  let to = null;
  function no() {
    return (
      to ||
        (to = Bn("firebase-installations-database", 1, {
          upgrade: (e, t) => {
            0 === t && e.createObjectStore(eo);
          },
        })),
      to
    );
  }
  async function io(e, t) {
    const n = Yi(e),
      i = (await no()).transaction(eo, "readwrite"),
      o = i.objectStore(eo),
      r = await o.get(n);
    return (
      await o.put(t, n), await i.done, (r && r.fid === t.fid) || Ki(e, t.fid), t
    );
  }
  async function oo(e) {
    const t = Yi(e),
      n = (await no()).transaction(eo, "readwrite");
    await n.objectStore(eo).delete(t), await n.done;
  }
  async function ro(e, t) {
    const n = Yi(e),
      i = (await no()).transaction(eo, "readwrite"),
      o = i.objectStore(eo),
      r = await o.get(n),
      a = t(r);
    return (
      void 0 === a ? await o.delete(n) : await o.put(a, n),
      await i.done,
      !a || (r && r.fid === a.fid) || Ki(e, a.fid),
      a
    );
  }
  async function ao(e) {
    let t;
    const n = await ro(e.appConfig, (n) => {
      const i = (function (e) {
          return lo(e || { fid: qi(), registrationStatus: 0 });
        })(n),
        o = (function (e, t) {
          if (0 === t.registrationStatus) {
            if (!navigator.onLine)
              return {
                installationEntry: t,
                registrationPromise: Promise.reject(Ri.create("app-offline")),
              };
            const n = {
                fid: t.fid,
                registrationStatus: 1,
                registrationTime: Date.now(),
              },
              i = (async function (e, t) {
                try {
                  const n = await (async function (
                    { appConfig: e, heartbeatServiceProvider: t },
                    { fid: n }
                  ) {
                    const i = $i(e),
                      o = Wi(e),
                      r = t.getImmediate({ optional: !0 });
                    if (r) {
                      const e = await r.getHeartbeatsHeader();
                      e && o.append("x-firebase-client", e);
                    }
                    const a = {
                        fid: n,
                        authVersion: ji,
                        appId: e.appId,
                        sdkVersion: Fi,
                      },
                      s = {
                        method: "POST",
                        headers: o,
                        body: JSON.stringify(a),
                      },
                      c = await Ui(() => fetch(i, s));
                    if (c.ok) {
                      const e = await c.json();
                      return {
                        fid: e.fid || n,
                        registrationStatus: 2,
                        refreshToken: e.refreshToken,
                        authToken: Hi(e.authToken),
                      };
                    }
                    throw await Gi("Create Installation", c);
                  })(e, t);
                  return io(e.appConfig, n);
                } catch (n) {
                  throw (
                    (zi(n) && 409 === n.customData.serverCode
                      ? await oo(e.appConfig)
                      : await io(e.appConfig, {
                          fid: t.fid,
                          registrationStatus: 0,
                        }),
                    n)
                  );
                }
              })(e, n);
            return { installationEntry: n, registrationPromise: i };
          }
          return 1 === t.registrationStatus
            ? { installationEntry: t, registrationPromise: so(e) }
            : { installationEntry: t };
        })(e, i);
      return (t = o.registrationPromise), o.installationEntry;
    });
    return "" === n.fid
      ? { installationEntry: await t }
      : { installationEntry: n, registrationPromise: t };
  }
  async function so(e) {
    let t = await co(e.appConfig);
    for (; 1 === t.registrationStatus; )
      await Vi(100), (t = await co(e.appConfig));
    if (0 === t.registrationStatus) {
      const { installationEntry: t, registrationPromise: n } = await ao(e);
      return n || t;
    }
    return t;
  }
  function co(e) {
    return ro(e, (e) => {
      if (!e) throw Ri.create("installation-not-found");
      return lo(e);
    });
  }
  function lo(e) {
    return 1 === (t = e).registrationStatus &&
      t.registrationTime + 1e4 < Date.now()
      ? { fid: e.fid, registrationStatus: 0 }
      : e;
    var t;
  }
  async function uo({ appConfig: e, heartbeatServiceProvider: t }, n) {
    const i = (function (e, { fid: t }) {
        return `${$i(e)}/${t}/authTokens:generate`;
      })(e, n),
      o = (function (e, { refreshToken: t }) {
        const n = Wi(e);
        return (
          n.append(
            "Authorization",
            (function (e) {
              return `${ji} ${e}`;
            })(t)
          ),
          n
        );
      })(e, n),
      r = t.getImmediate({ optional: !0 });
    if (r) {
      const e = await r.getHeartbeatsHeader();
      e && o.append("x-firebase-client", e);
    }
    const a = { installation: { sdkVersion: Fi, appId: e.appId } },
      s = { method: "POST", headers: o, body: JSON.stringify(a) },
      c = await Ui(() => fetch(i, s));
    if (c.ok) return Hi(await c.json());
    throw await Gi("Generate Auth Token", c);
  }
  async function ho(e, t = !1) {
    let n;
    const i = await ro(e.appConfig, (i) => {
      if (!po(i)) throw Ri.create("not-registered");
      const o = i.authToken;
      if (
        !t &&
        2 === (r = o).requestStatus &&
        !(function (e) {
          const t = Date.now();
          return t < e.creationTime || e.creationTime + e.expiresIn < t + 36e5;
        })(r)
      )
        return i;
      var r;
      if (1 === o.requestStatus)
        return (
          (n = (async function (e, t) {
            let n = await fo(e.appConfig);
            for (; 1 === n.authToken.requestStatus; )
              await Vi(100), (n = await fo(e.appConfig));
            const i = n.authToken;
            return 0 === i.requestStatus ? ho(e, t) : i;
          })(e, t)),
          i
        );
      {
        if (!navigator.onLine) throw Ri.create("app-offline");
        const t = (function (e) {
          const t = { requestStatus: 1, requestTime: Date.now() };
          return Object.assign(Object.assign({}, e), { authToken: t });
        })(i);
        return (
          (n = (async function (e, t) {
            try {
              const n = await uo(e, t),
                i = Object.assign(Object.assign({}, t), { authToken: n });
              return await io(e.appConfig, i), n;
            } catch (n) {
              if (
                !zi(n) ||
                (401 !== n.customData.serverCode &&
                  404 !== n.customData.serverCode)
              ) {
                const n = Object.assign(Object.assign({}, t), {
                  authToken: { requestStatus: 0 },
                });
                await io(e.appConfig, n);
              } else await oo(e.appConfig);
              throw n;
            }
          })(e, t)),
          t
        );
      }
    });
    return n ? await n : i.authToken;
  }
  function fo(e) {
    return ro(e, (e) => {
      if (!po(e)) throw Ri.create("not-registered");
      return 1 === (t = e.authToken).requestStatus &&
        t.requestTime + 1e4 < Date.now()
        ? Object.assign(Object.assign({}, e), {
            authToken: { requestStatus: 0 },
          })
        : e;
      var t;
    });
  }
  function po(e) {
    return void 0 !== e && 2 === e.registrationStatus;
  }
  function mo(e) {
    return Ri.create("missing-app-config-values", { valueName: e });
  }
  const go = "installations";
  wi(
    new fn(
      go,
      (e) => {
        const t = e.getProvider("app").getImmediate(),
          n = (function (e) {
            if (!e || !e.options) throw mo("App Configuration");
            if (!e.name) throw mo("App Name");
            const t = ["projectId", "apiKey", "appId"];
            for (const n of t) if (!e.options[n]) throw mo(n);
            return {
              appName: e.name,
              projectId: e.options.projectId,
              apiKey: e.options.apiKey,
              appId: e.options.appId,
            };
          })(t);
        return {
          app: t,
          appConfig: n,
          heartbeatServiceProvider: Ii(t, "heartbeat"),
          _delete: () => Promise.resolve(),
        };
      },
      "PUBLIC"
    )
  ),
    wi(
      new fn(
        "installations-internal",
        (e) => {
          const t = Ii(e.getProvider("app").getImmediate(), go).getImmediate();
          return {
            getId: () =>
              (async function (e) {
                const t = e,
                  { installationEntry: n, registrationPromise: i } = await ao(
                    t
                  );
                return (
                  i ? i.catch(console.error) : ho(t).catch(console.error), n.fid
                );
              })(t),
            getToken: (e) =>
              (async function (e, t = !1) {
                const n = e;
                return (
                  await (async function (e) {
                    const { registrationPromise: t } = await ao(e);
                    t && (await t);
                  })(n),
                  (await ho(n, t)).token
                );
              })(t, e),
          };
        },
        "PRIVATE"
      )
    ),
    Ti(Bi, Mi),
    Ti(Bi, Mi, "esm2017");
  const yo = "analytics",
    vo = "https://www.googletagmanager.com/gtag/js",
    bo = new Cn("@firebase/analytics"),
    wo = new sn("analytics", "Analytics", {
      "already-exists":
        "A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.",
      "already-initialized":
        "initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-intialized instance.",
      "already-initialized-settings":
        "Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.",
      "interop-component-reg-failed":
        "Firebase Analytics Interop Component failed to instantiate: {$reason}",
      "invalid-analytics-context":
        "Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
      "indexeddb-unavailable":
        "IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}",
      "fetch-throttle":
        "The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.",
      "config-fetch-failed":
        "Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}",
      "no-api-key":
        'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',
      "no-app-id":
        'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',
      "no-client-id": 'The "client_id" field is empty.',
      "invalid-gtag-resource":
        "Trusted Types detected an invalid gtag resource: {$gtagURL}.",
    });
  function Io(e) {
    if (!e.startsWith(vo)) {
      const t = wo.create("invalid-gtag-resource", { gtagURL: e });
      return bo.warn(t.message), "";
    }
    return e;
  }
  function Eo(e) {
    return Promise.all(e.map((e) => e.catch((e) => e)));
  }
  const Co = new (class {
    constructor(e = {}, t = 1e3) {
      (this.throttleMetadata = e), (this.intervalMillis = t);
    }
    getThrottleMetadata(e) {
      return this.throttleMetadata[e];
    }
    setThrottleMetadata(e, t) {
      this.throttleMetadata[e] = t;
    }
    deleteThrottleMetadata(e) {
      delete this.throttleMetadata[e];
    }
  })();
  function So(e) {
    return new Headers({ Accept: "application/json", "x-goog-api-key": e });
  }
  async function To(e, t = Co, n) {
    const { appId: i, apiKey: o, measurementId: r } = e.options;
    if (!i) throw wo.create("no-app-id");
    if (!o) {
      if (r) return { measurementId: r, appId: i };
      throw wo.create("no-api-key");
    }
    const a = t.getThrottleMetadata(i) || {
        backoffCount: 0,
        throttleEndTimeMillis: Date.now(),
      },
      s = new Ao();
    return (
      setTimeout(
        async () => {
          s.abort();
        },
        void 0 !== n ? n : 6e4
      ),
      ko({ appId: i, apiKey: o, measurementId: r }, a, s, t)
    );
  }
  async function ko(
    e,
    { throttleEndTimeMillis: t, backoffCount: n },
    i,
    o = Co
  ) {
    var r;
    const { appId: a, measurementId: s } = e;
    try {
      await (function (e, t) {
        return new Promise((n, i) => {
          const o = Math.max(t - Date.now(), 0),
            r = setTimeout(n, o);
          e.addEventListener(() => {
            clearTimeout(r),
              i(wo.create("fetch-throttle", { throttleEndTimeMillis: t }));
          });
        });
      })(i, t);
    } catch (e) {
      if (s)
        return (
          bo.warn(
            `Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${
              null == e ? void 0 : e.message
            }]`
          ),
          { appId: a, measurementId: s }
        );
      throw e;
    }
    try {
      const t = await (async function (e) {
        var t;
        const { appId: n, apiKey: i } = e,
          o = { method: "GET", headers: So(i) },
          r =
            "https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig".replace(
              "{app-id}",
              n
            ),
          a = await fetch(r, o);
        if (200 !== a.status && 304 !== a.status) {
          let e = "";
          try {
            const n = await a.json();
            (null === (t = n.error) || void 0 === t ? void 0 : t.message) &&
              (e = n.error.message);
          } catch (e) {}
          throw wo.create("config-fetch-failed", {
            httpStatus: a.status,
            responseMessage: e,
          });
        }
        return a.json();
      })(e);
      return o.deleteThrottleMetadata(a), t;
    } catch (t) {
      const c = t;
      if (
        !(function (e) {
          if (!(e instanceof an && e.customData)) return !1;
          const t = Number(e.customData.httpStatus);
          return 429 === t || 500 === t || 503 === t || 504 === t;
        })(c)
      ) {
        if ((o.deleteThrottleMetadata(a), s))
          return (
            bo.warn(
              `Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${s} provided in the "measurementId" field in the local Firebase config. [${
                null == c ? void 0 : c.message
              }]`
            ),
            { appId: a, measurementId: s }
          );
        throw t;
      }
      const l =
          503 ===
          Number(
            null === (r = null == c ? void 0 : c.customData) || void 0 === r
              ? void 0
              : r.httpStatus
          )
            ? dn(n, o.intervalMillis, 30)
            : dn(n, o.intervalMillis),
        u = { throttleEndTimeMillis: Date.now() + l, backoffCount: n + 1 };
      return (
        o.setThrottleMetadata(a, u),
        bo.debug(`Calling attemptFetch again in ${l} millis`),
        ko(e, u, i, o)
      );
    }
  }
  class Ao {
    constructor() {
      this.listeners = [];
    }
    addEventListener(e) {
      this.listeners.push(e);
    }
    abort() {
      this.listeners.forEach((e) => e());
    }
  }
  let Do, _o;
  async function Po(e, t, n, i, o, r, a) {
    var s;
    const c = To(e);
    c
      .then((t) => {
        (n[t.measurementId] = t.appId),
          e.options.measurementId &&
            t.measurementId !== e.options.measurementId &&
            bo.warn(
              `The measurement ID in the local Firebase config (${e.options.measurementId}) does not match the measurement ID fetched from the server (${t.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`
            );
      })
      .catch((e) => bo.error(e)),
      t.push(c);
    const l = (async function () {
        if (!on())
          return (
            bo.warn(
              wo.create("indexeddb-unavailable", {
                errorInfo: "IndexedDB is not available in this environment.",
              }).message
            ),
            !1
          );
        try {
          await rn();
        } catch (e) {
          return (
            bo.warn(
              wo.create("indexeddb-unavailable", {
                errorInfo: null == e ? void 0 : e.toString(),
              }).message
            ),
            !1
          );
        }
        return !0;
      })().then((e) => (e ? i.getId() : void 0)),
      [u, d] = await Promise.all([c, l]);
    (function (e) {
      const t = window.document.getElementsByTagName("script");
      for (const n of Object.values(t))
        if (n.src && n.src.includes(vo) && n.src.includes(e)) return n;
      return null;
    })(r) ||
      (function (e, t) {
        const n = (function (e, t) {
            let n;
            return (
              window.trustedTypes &&
                (n = window.trustedTypes.createPolicy(
                  "firebase-js-sdk-policy",
                  t
                )),
              n
            );
          })(0, { createScriptURL: Io }),
          i = document.createElement("script"),
          o = `${vo}?l=${e}&id=${t}`;
        (i.src = n ? (null == n ? void 0 : n.createScriptURL(o)) : o),
          (i.async = !0),
          document.head.appendChild(i);
      })(r, u.measurementId),
      _o && (o("consent", "default", _o), (_o = void 0)),
      o("js", new Date());
    const h =
      null !== (s = null == a ? void 0 : a.config) && void 0 !== s ? s : {};
    return (
      (h.origin = "firebase"),
      (h.update = !0),
      null != d && (h.firebase_id = d),
      o("config", u.measurementId, h),
      Do && (o("set", Do), (Do = void 0)),
      u.measurementId
    );
  }
  class xo {
    constructor(e) {
      this.app = e;
    }
    _delete() {
      return delete Lo[this.app.options.appId], Promise.resolve();
    }
  }
  let Lo = {},
    No = [];
  const Oo = {};
  let Bo,
    Mo,
    Fo = "dataLayer",
    jo = !1;
  function Ro(e, t, n) {
    !(function () {
      const e = [];
      if (
        ((function () {
          const e =
            "object" == typeof chrome
              ? chrome.runtime
              : "object" == typeof browser
              ? browser.runtime
              : void 0;
          return "object" == typeof e && void 0 !== e.id;
        })() && e.push("This is a browser extension environment."),
        ("undefined" != typeof navigator && navigator.cookieEnabled) ||
          e.push("Cookies are not available."),
        e.length > 0)
      ) {
        const t = e.map((e, t) => `(${t + 1}) ${e}`).join(" "),
          n = wo.create("invalid-analytics-context", { errorInfo: t });
        bo.warn(n.message);
      }
    })();
    const i = e.options.appId;
    if (!i) throw wo.create("no-app-id");
    if (!e.options.apiKey) {
      if (!e.options.measurementId) throw wo.create("no-api-key");
      bo.warn(
        `The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${e.options.measurementId} provided in the "measurementId" field in the local Firebase config.`
      );
    }
    if (null != Lo[i]) throw wo.create("already-exists", { id: i });
    if (!jo) {
      !(function (e) {
        let t = [];
        Array.isArray(window[e]) ? (t = window[e]) : (window[e] = t);
      })(Fo);
      const { wrappedGtag: e, gtagCore: t } = (function (e, t, n, i, o) {
        let r = function (...e) {
          window[i].push(arguments);
        };
        return (
          window[o] && "function" == typeof window[o] && (r = window[o]),
          (window[o] = (function (e, t, n, i) {
            return async function (o, ...r) {
              try {
                if ("event" === o) {
                  const [i, o] = r;
                  await (async function (e, t, n, i, o) {
                    try {
                      let r = [];
                      if (o && o.send_to) {
                        let e = o.send_to;
                        Array.isArray(e) || (e = [e]);
                        const i = await Eo(n);
                        for (const n of e) {
                          const e = i.find((e) => e.measurementId === n),
                            o = e && t[e.appId];
                          if (!o) {
                            r = [];
                            break;
                          }
                          r.push(o);
                        }
                      }
                      0 === r.length && (r = Object.values(t)),
                        await Promise.all(r),
                        e("event", i, o || {});
                    } catch (e) {
                      bo.error(e);
                    }
                  })(e, t, n, i, o);
                } else if ("config" === o) {
                  const [o, a] = r;
                  await (async function (e, t, n, i, o, r) {
                    const a = i[o];
                    try {
                      if (a) await t[a];
                      else {
                        const e = (await Eo(n)).find(
                          (e) => e.measurementId === o
                        );
                        e && (await t[e.appId]);
                      }
                    } catch (e) {
                      bo.error(e);
                    }
                    e("config", o, r);
                  })(e, t, n, i, o, a);
                } else if ("consent" === o) {
                  const [t] = r;
                  e("consent", "update", t);
                } else if ("get" === o) {
                  const [t, n, i] = r;
                  e("get", t, n, i);
                } else if ("set" === o) {
                  const [t] = r;
                  e("set", t);
                } else e(o, ...r);
              } catch (e) {
                bo.error(e);
              }
            };
          })(r, e, t, n)),
          { gtagCore: r, wrappedGtag: window[o] }
        );
      })(Lo, No, Oo, Fo, "gtag");
      (Mo = e), (Bo = t), (jo = !0);
    }
    return (Lo[i] = Po(e, No, Oo, t, Bo, Fo, n)), new xo(e);
  }
  function zo(e, t, n, i) {
    (e = hn(e)),
      (async function (e, t, n, i, o) {
        if (o && o.global) e("event", n, i);
        else {
          const o = await t;
          e("event", n, Object.assign(Object.assign({}, i), { send_to: o }));
        }
      })(Mo, Lo[e.app.options.appId], t, n, i).catch((e) => bo.error(e));
  }
  const $o = "@firebase/analytics",
    Ho = "0.10.1";
  wi(
    new fn(
      yo,
      (e, { options: t }) =>
        Ro(
          e.getProvider("app").getImmediate(),
          e.getProvider("installations-internal").getImmediate(),
          t
        ),
      "PUBLIC"
    )
  ),
    wi(
      new fn(
        "analytics-internal",
        function (e) {
          try {
            const t = e.getProvider(yo).getImmediate();
            return { logEvent: (e, n, i) => zo(t, e, n, i) };
          } catch (e) {
            throw wo.create("interop-component-reg-failed", { reason: e });
          }
        },
        "PRIVATE"
      )
    ),
    Ti($o, Ho),
    Ti($o, Ho, "esm2017");
  const Go = {
    apiKey: "AIzaSyB8c2lBVi26u7YRL9sxOP97Uaq3yN8hTl4",
    authDomain: "ftm-b9d99.firebaseapp.com",
    databaseURL: "https://ftm-b9d99.firebaseio.com",
    projectId: "ftm-b9d99",
    storageBucket: "ftm-b9d99.appspot.com",
    messagingSenderId: "602402387941",
    appId: "1:602402387941:web:3bdd502b0e7ce6789de10c",
    measurementId: "G-XNE7Y2439V",
  };
  class Wo {
    constructor() {
      try {
        (this.firebaseApp = Si(Go)),
          (this.firebaseAnalytics = (function (
            e = (function (e = mi) {
              const t = yi.get(e);
              if (!t && e === mi && tn()) return Si();
              if (!t) throw Ei.create("no-app", { appName: e });
              return t;
            })()
          ) {
            const t = Ii((e = hn(e)), yo);
            return t.isInitialized()
              ? t.getImmediate()
              : (function (e, t = {}) {
                  const n = Ii(e, yo);
                  if (n.isInitialized()) {
                    const e = n.getImmediate();
                    if (ln(t, n.getOptions())) return e;
                    throw wo.create("already-initialized");
                  }
                  return n.initialize({ options: t });
                })(e);
          })(this.firebaseApp));
      } catch (e) {
        console.error("Error while initializing Firebase:", e);
      }
    }
    static getInstance() {
      return Wo.instance || (Wo.instance = new Wo()), Wo.instance;
    }
    logEventWithPayload(e, t) {
      try {
        console.log(`Sending custom event ${e} with data:`, t),
          zo(this.firebaseAnalytics, e, t);
      } catch (e) {
        console.error("Error while logging custom event:", e);
      }
    }
    logSessionStartWithPayload(e) {
      try {
        console.log("Logging session start with data:", e),
          zo(this.firebaseAnalytics, "session_start", e);
      } catch (e) {
        console.error("Error while logging session start:", e);
      }
    }
    logDownloadProgressWithPayload(e, t) {
      try {
        console.log("Logging download progress for ", e, " with data:", t),
          zo(this.firebaseAnalytics, e, t);
      } catch (e) {
        console.error("Error while logging download progress:", e);
      }
    }
  }
  const Uo = new URLSearchParams(window.location.search);
  Uo.get("cr_user_id"), Uo.get("source"), Uo.get("campaign_id");
  let Vo;
  Wo.getInstance();
  const Xo = window.location.search;
  let qo = new URLSearchParams(Xo).get("book");
  null == qo && (qo = "LetsFlyLevel2En"), console.log("Book Name: " + qo);
  let Yo = new (class {
    constructor(e, t, i, o) {
      console.log("Curious Reader App v0.3.11 initializing!"),
        (this.bookName = e),
        (this.contentFilePath = t),
        (this.imagesPath = i),
        (this.audioPath = o),
        (Vo = new Date()),
        (this.contentParser = new n(t)),
        (this.playBackEngine = new Yt(i, o));
    }
    async initialize() {
      try {
        const e = await this.contentParser.parseBook();
        (e.bookName = this.bookName),
          console.log(">>>>>>>>>>>>>>>>>"),
          console.log("App initialized with book:", e),
          this.enforceLandscapeMode(),
          this.playBackEngine.initializeBook(e),
          console.log("Initialization completed successfully!");
      } catch (e) {
        console.error("Initialization error:", e);
      }
    }
    enforceLandscapeMode() {
      window.Android &&
        "function" == typeof window.Android.setContainerAppOrientation &&
        window.Android.setContainerAppOrientation("landscape");
    }
  })(
    qo,
    `./BookContent/${qo}/content/content.json`,
    `./BookContent/${qo}/content/images/`,
    `./BookContent/${qo}/content/audios/`
  );
  Yo.initialize();
})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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S0FBS00sZ0JBQWtCQSxFQUN2Qk4sS0FBS2l5QixXQUFhQSxFQUNsQmp5QixLQUFLa3lCLFVBQVlBLEVBVWpCK3FCLEdBQW1CLElBQUlycUMsS0FDdkI1UyxLQUFLbTlDLGNBQWdCLElBQUkvOEMsRUFBY0UsR0FDdkNOLEtBQUtvOUMsZUFBaUIsSUFBSXByQixHQUFlQyxFQUFZQyxFQUV2RCxDQUVBLGdCQUFNbVAsR0FDSixJQUVFLE1BQU1wZ0MsUUFBYWpCLEtBQUttOUMsY0FBYzM4QyxZQUN0Q1MsRUFBS0MsU0FBV2xCLEtBQUtrQixTQUNyQkgsUUFBUUMsSUFBSSxxQkFFWkQsUUFBUUMsSUFBSSw2QkFBOEJDLEdBRzFDakIsS0FBS3E5Qyx1QkFPTHI5QyxLQUFLbzlDLGVBQWVwcEIsZUFBZS95QixHQUVuQ0YsUUFBUUMsSUFBSSx5Q0FDZCxDQUFFLE1BQU9RLEdBRVBULFFBQVFTLE1BQU0sd0JBQXlCQSxFQUN6QyxDQUNGLENBRUEsb0JBQUE2N0MsR0FJTWw5QyxPQUFPbTlDLFNBQWdFLG1CQUE5Q245QyxPQUFPbTlDLFFBQVFDLDRCQUUxQ3A5QyxPQUFPbTlDLFFBQVFDLDJCQUEyQixZQUU5QyxHQThIQXI4QyxHQUNBLGlCQUFpQkEsMEJBQ2pCLGlCQUFpQkEscUJBQ2pCLGlCQUFpQkEsc0JBR25CdW9DLEdBQUlwSSIsInNvdXJjZXMiOlsid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly8vLi9zcmMvTW9kZWxzL0Jvb2sudHMiLCJ3ZWJwYWNrOi8vL3dlYnBhY2svcnVudGltZS9nbG9iYWwiLCJ3ZWJwYWNrOi8vLy4vc3JjL1BhcnNlci9Db250ZW50UGFyc2VyLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9Ac3BsaWRlanMvc3BsaWRlL2Rpc3QvanMvc3BsaWRlLmVzbS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvUGxheUJhY2tFbmdpbmUvUGxheUJhY2tFbmdpbmUudHMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS91dGlsL2Rpc3QvaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGZpcmViYXNlL2NvbXBvbmVudC9kaXN0L2VzbS9pbmRleC5lc20yMDE3LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvbG9nZ2VyL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lkYi9idWlsZC93cmFwLWlkYi12YWx1ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvaWRiL2J1aWxkL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9AZmlyZWJhc2UvYXBwL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpcmViYXNlL2FwcC9kaXN0L2VzbS9pbmRleC5lc20uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9pbnN0YWxsYXRpb25zL2Rpc3QvZXNtL2luZGV4LmVzbTIwMTcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BmaXJlYmFzZS9hbmFseXRpY3MvZGlzdC9lc20vaW5kZXguZXNtMjAxNy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQW5hbHl0aWNzL0ZpcmViYXNlL2NvbmZpZy50cyIsIndlYnBhY2s6Ly8vLi9zcmMvQW5hbHl0aWNzL0ZpcmViYXNlL0ZpcmViYXNlTWFuYWdlci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvY29tbW9uL2dsb2JhbC1wcm9wZXJ0aWVzLnRzIiwid2VicGFjazovLy8uL0FwcC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgcmVxdWlyZSBzY29wZVxudmFyIF9fd2VicGFja19yZXF1aXJlX18gPSB7fTtcblxuIiwiLy8gUGFnZSB0eXBlIHRoYXQgZGVcblxuaW1wb3J0IHsgUGFnZSB9IGZyb20gXCIuL1BhZ2VcIjtcblxuZXhwb3J0IGVudW0gQm9va1R5cGUge1xuICAgIEN1cmlvdXNSZWFkZXIgPSBcIkN1cmlvdXNSZWFkZXJcIixcbiAgICBHREwgPSBcIkdETFwiLFxuICAgIFVua25vd24gPSBcIlVua25vd25cIixcbn1cblxuZXhwb3J0IHR5cGUgQm9vayA9IHtcbiAgICBib29rTmFtZTogc3RyaW5nO1xuICAgIHBhZ2VzOiBQYWdlW107XG4gICAgYm9va1R5cGU6IEJvb2tUeXBlO1xufSIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiaW1wb3J0IHtcbiAgICBCb29rLFxuICAgIEJvb2tUeXBlLFxuICAgIFBhZ2UsXG4gICAgVGV4dEVsZW1lbnQsXG4gICAgSW1hZ2VFbGVtZW50LFxuICAgIEF1ZGlvRWxlbWVudCxcbiAgICBBdWRpb1RpbWVzdGFtcHMsXG4gICAgV29yZFRpbWVzdGFtcEVsZW1lbnQsXG59IGZyb20gXCIuLi9Nb2RlbHMvTW9kZWxzXCI7XG5cbmV4cG9ydCBjbGFzcyBDb250ZW50UGFyc2VyIHtcbiAgICBpbWFnZXNQYXRoOiBzdHJpbmc7XG4gICAgYXVkaW9QYXRoOiBzdHJpbmc7XG4gICAgY29udGVudEZpbGVQYXRoOiBzdHJpbmc7XG5cbiAgICBjb250ZW50SlNPTjogYW55O1xuXG4gICAgZW1wdHlHbG93SW1hZ2VUYWc6IHN0cmluZyA9IFwiZW1wdHlfZ2xvd19pbWFnZVwiO1xuXG4gICAgY29uc3RydWN0b3IoY29udGVudEZpbGVQYXRoOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jb250ZW50RmlsZVBhdGggPSBjb250ZW50RmlsZVBhdGg7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2VCb29rKCk6IFByb21pc2U8Qm9vaz4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5wYXJzZUNvbnRlbnRKU09ORmlsZSgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGNvbnRlbnRKU09OKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEpTT04gPSBjb250ZW50SlNPTjtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJDb250ZW50IEpTT04gZmlsZSBwYXJzZWQhXCIpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNvbnRlbnRKU09OKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgYm9vazogQm9vayA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tOYW1lOiBcIlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZXM6IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9va1R5cGU6IHRoaXMuZGV0ZXJtaW5lQm9va1R5cGUoKSxcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBib29rLnBhZ2VzID0gdGhpcy5wYXJzZVBhZ2VzKGJvb2spO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoYm9vayk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGRldGVybWluZUJvb2tUeXBlKCk6IEJvb2tUeXBlIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudEpTT05bXCJwcmVzZW50YXRpb25cIl0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIEJvb2tUeXBlLkN1cmlvdXNSZWFkZXI7XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jb250ZW50SlNPTltcImNoYXB0ZXJzXCJdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBCb29rVHlwZS5HREw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gQm9va1R5cGUuVW5rbm93bjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBhcnNlUGFnZXMoYm9vazogQm9vayk6IFBhZ2VbXSB7XG4gICAgICAgIGxldCBwYWdlczogUGFnZVtdID0gW107XG5cbiAgICAgICAgaWYgKGJvb2suYm9va1R5cGUgPT09IEJvb2tUeXBlLkN1cmlvdXNSZWFkZXIpIHtcbiAgICAgICAgICAgIGxldCBwYWdlc0pTT04gPSB0aGlzLmNvbnRlbnRKU09OW1wicHJlc2VudGF0aW9uXCJdW1wic2xpZGVzXCJdO1xuICAgICAgICAgICAgbGV0IGdsb2JhbEZpbGxDb2xvciA9XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZW50SlNPTltcInByZXNlbnRhdGlvblwiXVtcImdsb2JhbEJhY2tncm91bmRTZWxlY3RvclwiXVtcbiAgICAgICAgICAgICAgICBcImZpbGxHbG9iYWxCYWNrZ3JvdW5kXCJcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYWdlc0pTT04ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcGFnZUpTT04gPSBwYWdlc0pTT05baV07XG4gICAgICAgICAgICAgICAgbGV0IHBhZ2U6IFBhZ2UgPSB7XG4gICAgICAgICAgICAgICAgICAgIHZpc3VhbEVsZW1lbnRzOiBbXSxcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBnbG9iYWxGaWxsQ29sb3IsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBwYWdlLnZpc3VhbEVsZW1lbnRzID0gdGhpcy5wYXJzZVBhZ2VDUihwYWdlSlNPTik7XG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaChwYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChib29rLmJvb2tUeXBlID09PSBCb29rVHlwZS5HREwpIHtcbiAgICAgICAgICAgIGxldCBwYWdlc0pTT04gPSB0aGlzLmNvbnRlbnRKU09OW1wiY2hhcHRlcnNcIl07XG4gICAgICAgICAgICBsZXQgZ2xvYmFsRmlsbENvbG9yID0gXCIjRkNGQ0YyXCI7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhZ2VzSlNPTi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBwYWdlSlNPTiA9IHBhZ2VzSlNPTltpXTtcbiAgICAgICAgICAgICAgICBsZXQgcGFnZTogUGFnZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgdmlzdWFsRWxlbWVudHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IGdsb2JhbEZpbGxDb2xvcixcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHBhZ2UudmlzdWFsRWxlbWVudHMgPSB0aGlzLnBhcnNlUGFnZUdETChwYWdlSlNPTik7XG4gICAgICAgICAgICAgICAgcGFnZXMucHVzaChwYWdlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVW5rbm93biBib29rIHR5cGUhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHBhZ2VzO1xuICAgIH1cblxuICAgIHBhcnNlUGFnZUNSKHBhZ2VKU09OOiBhbnkpOiBhbnlbXSB7XG4gICAgICAgIGxldCB2aXN1YWxFbGVtZW50czogYW55W10gPSBbXTtcbiAgICAgICAgbGV0IGVsZW1lbnRzSlNPTiA9IHBhZ2VKU09OW1wiZWxlbWVudHNcIl07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHNKU09OLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgbGlicmFyeVN0cmluZzogc3RyaW5nID0gZWxlbWVudHNKU09OW2ldW1wiYWN0aW9uXCJdW1wibGlicmFyeVwiXTtcbiAgICAgICAgICAgIGlmIChsaWJyYXJ5U3RyaW5nLmluY2x1ZGVzKFwiQWR2YW5jZWRUZXh0XCIpKSB7XG4gICAgICAgICAgICAgICAgbGV0IHRleHRFbGVtZW50OiBUZXh0RWxlbWVudCA9IHRoaXMucGFyc2VUZXh0RWxlbWVudENSKGVsZW1lbnRzSlNPTltpXSk7XG4gICAgICAgICAgICAgICAgdmlzdWFsRWxlbWVudHMucHVzaCh0ZXh0RWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxpYnJhcnlTdHJpbmcuaW5jbHVkZXMoXCJJbWFnZVwiKSkge1xuICAgICAgICAgICAgICAgIGxldCBpbWFnZUVsZW1lbnQ6IEltYWdlRWxlbWVudCA9IHRoaXMucGFyc2VJbWFnZUVsZW1lbnRDUihcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNKU09OW2ldXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB2aXN1YWxFbGVtZW50cy5wdXNoKGltYWdlRWxlbWVudCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGxpYnJhcnlTdHJpbmcuaW5jbHVkZXMoXCJBdWRpb1wiKSkge1xuICAgICAgICAgICAgICAgIGxldCBhdWRpb0VsZW1lbnQ6IEF1ZGlvRWxlbWVudCA9IHRoaXMucGFyc2VBdWRpb0VsZW1lbnRDUihcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudHNKU09OW2ldXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB2aXN1YWxFbGVtZW50cy5wdXNoKGF1ZGlvRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdmlzdWFsRWxlbWVudHM7XG4gICAgfVxuXG4gICAgcGFyc2VQYWdlR0RMKHBhZ2VKU09OOiBhbnkpOiBhbnlbXSB7XG4gICAgICAgIGxldCB2aXN1YWxFbGVtZW50czogYW55W10gPSBbXTtcbiAgICAgICAgbGV0IGVsZW1lbnRzSlNPTkFycmF5ID0gcGFnZUpTT05bXCJwYXJhbXNcIl1bXCJjb250ZW50XCJdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHNKU09OQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBsaWJyYXJ5U3RyaW5nOiBzdHJpbmcgPSBlbGVtZW50c0pTT05BcnJheVtpXVtcImNvbnRlbnRcIl1bXCJsaWJyYXJ5XCJdO1xuICAgICAgICAgICAgaWYgKGxpYnJhcnlTdHJpbmcuaW5jbHVkZXMoXCJBZHZhbmNlZFRleHRcIikpIHtcbiAgICAgICAgICAgICAgICBsZXQgdGV4dEVsZW1lbnQ6IFRleHRFbGVtZW50ID0gdGhpcy5wYXJzZVRleHRFbGVtZW50R0RMKFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0pTT05BcnJheVtpXVtcImNvbnRlbnRcIl1bXCJwYXJhbXNcIl1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHZpc3VhbEVsZW1lbnRzLnB1c2godGV4dEVsZW1lbnQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChsaWJyYXJ5U3RyaW5nLmluY2x1ZGVzKFwiSW1hZ2VcIikpIHtcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2VFbGVtZW50OiBJbWFnZUVsZW1lbnQgPSB0aGlzLnBhcnNlSW1hZ2VFbGVtZW50R0RMKFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50c0pTT05BcnJheVtpXVtcImNvbnRlbnRcIl1bXCJwYXJhbXNcIl1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHZpc3VhbEVsZW1lbnRzLnB1c2goaW1hZ2VFbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2aXN1YWxFbGVtZW50cztcbiAgICB9XG5cbiAgICBwYXJzZVRleHRFbGVtZW50Q1IoZWxlbWVudEpTT046IGFueSk6IFRleHRFbGVtZW50IHtcbiAgICAgICAgbGV0IHRleHRFbGVtZW50OiBUZXh0RWxlbWVudCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICAgICAgcG9zaXRpb25YOiBlbGVtZW50SlNPTltcInhcIl0sXG4gICAgICAgICAgICBwb3NpdGlvblk6IGVsZW1lbnRKU09OW1wieVwiXSxcbiAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50SlNPTltcIndpZHRoXCJdLFxuICAgICAgICAgICAgaGVpZ2h0OiBlbGVtZW50SlNPTltcImhlaWdodFwiXSxcbiAgICAgICAgICAgIHRleHRDb250ZW50QXNIVE1MOiBlbGVtZW50SlNPTltcImFjdGlvblwiXVtcInBhcmFtc1wiXVtcInRleHRcIl0sXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRleHRFbGVtZW50O1xuICAgIH1cblxuICAgIHBhcnNlVGV4dEVsZW1lbnRHREwoZWxlbWVudEpTT046IGFueSk6IFRleHRFbGVtZW50IHtcbiAgICAgICAgbGV0IHRleHRFbGVtZW50OiBUZXh0RWxlbWVudCA9IHtcbiAgICAgICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICAgICAgcG9zaXRpb25YOiBOYU4sXG4gICAgICAgICAgICBwb3NpdGlvblk6IE5hTixcbiAgICAgICAgICAgIHdpZHRoOiBOYU4sXG4gICAgICAgICAgICBoZWlnaHQ6IE5hTixcbiAgICAgICAgICAgIHRleHRDb250ZW50QXNIVE1MOiBlbGVtZW50SlNPTltcInRleHRcIl0sXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0ZXh0RWxlbWVudDtcbiAgICB9XG5cbiAgICBwYXJzZUltYWdlRWxlbWVudENSKGVsZW1lbnRKU09OOiBhbnkpOiBJbWFnZUVsZW1lbnQge1xuICAgICAgICBsZXQgcGF0aDogc3RyaW5nID0gXCJcIjtcbiAgICAgICAgaWYgKGVsZW1lbnRKU09OW1wiYWN0aW9uXCJdW1wicGFyYW1zXCJdW1wiZmlsZVwiXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBwYXRoID0gdGhpcy5lbXB0eUdsb3dJbWFnZVRhZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhdGggPSBlbGVtZW50SlNPTltcImFjdGlvblwiXVtcInBhcmFtc1wiXVtcImZpbGVcIl1bXCJwYXRoXCJdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBpbWFnZUVsZW1lbnQ6IEltYWdlRWxlbWVudCA9IHtcbiAgICAgICAgICAgIGRvbUlEOiBwYXRoID09PSB0aGlzLmVtcHR5R2xvd0ltYWdlVGFnXG4gICAgICAgICAgICAgICAgICAgID8gZWxlbWVudEpTT05bXCJpZFwiXVxuICAgICAgICAgICAgICAgICAgICA6IGVsZW1lbnRKU09OW1wiYWN0aW9uXCJdW1wic3ViQ29udGVudElkXCJdLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxuICAgICAgICAgICAgcG9zaXRpb25YOiBlbGVtZW50SlNPTltcInhcIl0sXG4gICAgICAgICAgICBwb3NpdGlvblk6IGVsZW1lbnRKU09OW1wieVwiXSxcbiAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50SlNPTltcIndpZHRoXCJdLFxuICAgICAgICAgICAgaGVpZ2h0OiBlbGVtZW50SlNPTltcImhlaWdodFwiXSxcbiAgICAgICAgICAgIGltYWdlU291cmNlOiBwYXRoLFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBpbWFnZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcGFyc2VJbWFnZUVsZW1lbnRHREwoZWxlbWVudEpTT046IGFueSk6IEltYWdlRWxlbWVudCB7XG4gICAgICAgIGxldCBpbWFnZUVsZW1lbnQ6IEltYWdlRWxlbWVudCA9IHtcbiAgICAgICAgICAgIGRvbUlEOiBcIlwiLFxuICAgICAgICAgICAgdHlwZTogXCJpbWFnZVwiLFxuICAgICAgICAgICAgcG9zaXRpb25YOiBOYU4sXG4gICAgICAgICAgICBwb3NpdGlvblk6IE5hTixcbiAgICAgICAgICAgIHdpZHRoOiBlbGVtZW50SlNPTltcIndpZHRoXCJdLFxuICAgICAgICAgICAgaGVpZ2h0OiBlbGVtZW50SlNPTltcImhlaWdodFwiXSxcbiAgICAgICAgICAgIGltYWdlU291cmNlOiBlbGVtZW50SlNPTltcImZpbGVcIl1bXCJwYXRoXCJdLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gaW1hZ2VFbGVtZW50O1xuICAgIH1cblxuICAgIHBhcnNlQXVkaW9FbGVtZW50Q1IoZWxlbWVudEpTT046IGFueSk6IEF1ZGlvRWxlbWVudCB7XG4gICAgICAgIGxldCBhdWRpb1RpbWVzdGFtcHM6IEF1ZGlvVGltZXN0YW1wcyA9IHtcbiAgICAgICAgICAgIHRpbWVzdGFtcHM6IFtdLFxuICAgICAgICB9O1xuICAgICAgICBsZXQgdGltZXN0YW1wc0pTT05BcnJheSA9XG4gICAgICAgICAgICBlbGVtZW50SlNPTltcImFjdGlvblwiXVtcInBhcmFtc1wiXVtcInRpbWVTdGFtcEZvckVhY2hUZXh0XCJdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbWVzdGFtcHNKU09OQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0aW1lc3RhbXBJbmRleCA9IGk7XG4gICAgICAgICAgICBsZXQgdGltZXN0YW1wSlNPTiA9IHRpbWVzdGFtcHNKU09OQXJyYXlbaV07XG4gICAgICAgICAgICBsZXQgdGltZXN0YW1wOiBXb3JkVGltZXN0YW1wRWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICBkb21JRDpcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudEpTT05bXCJhY3Rpb25cIl1bXCJzdWJDb250ZW50SWRcIl0gK1xuICAgICAgICAgICAgICAgICAgICBcIl9cIiArXG4gICAgICAgICAgICAgICAgICAgIHRpbWVzdGFtcEluZGV4LnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgd29yZDogdGltZXN0YW1wSlNPTltcInRleHRcIl0ucmVwbGFjZSgvJiMwMzk7L2csIFwiJ1wiKSxcbiAgICAgICAgICAgICAgICBzdGFydFRpbWVzdGFtcDogdGltZXN0YW1wSlNPTltcInN0YXJ0RHVyYXRpb25cIl0sXG4gICAgICAgICAgICAgICAgZW5kVGltZXN0YW1wOiB0aW1lc3RhbXBKU09OW1wiZW5kRHVyYXRpb25cIl0sXG4gICAgICAgICAgICAgICAgYXVkaW9TcmM6IHRpbWVzdGFtcEpTT05bXCJ3b3JkZmlsZVwiXVswXVtcInBhdGhcIl0sXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYXVkaW9UaW1lc3RhbXBzLnRpbWVzdGFtcHMucHVzaCh0aW1lc3RhbXApO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdWRpb0VsZW1lbnQ6IEF1ZGlvRWxlbWVudCA9IHtcbiAgICAgICAgICAgIGRvbUlEOiBlbGVtZW50SlNPTltcImFjdGlvblwiXVtcInN1YkNvbnRlbnRJZFwiXSxcbiAgICAgICAgICAgIHR5cGU6IFwiYXVkaW9cIixcbiAgICAgICAgICAgIHBvc2l0aW9uWDogZWxlbWVudEpTT05bXCJ4XCJdLFxuICAgICAgICAgICAgcG9zaXRpb25ZOiBlbGVtZW50SlNPTltcInlcIl0sXG4gICAgICAgICAgICB3aWR0aDogZWxlbWVudEpTT05bXCJ3aWR0aFwiXSxcbiAgICAgICAgICAgIGhlaWdodDogZWxlbWVudEpTT05bXCJoZWlnaHRcIl0sXG4gICAgICAgICAgICBnbG93Q29sb3I6IGVsZW1lbnRKU09OW1wiYWN0aW9uXCJdW1wicGFyYW1zXCJdW1wiZ2xvd0NvbG9yXCJdLFxuICAgICAgICAgICAgYXVkaW9TcmM6IGVsZW1lbnRKU09OW1wiYWN0aW9uXCJdW1wicGFyYW1zXCJdW1wiZmlsZXNcIl1bMF1bXCJwYXRoXCJdLFxuICAgICAgICAgICAgYXVkaW9UaW1lc3RhbXBzOiBhdWRpb1RpbWVzdGFtcHMsXG4gICAgICAgICAgICBzdHlsZXM6IFwiXCIsXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGF1ZGlvRWxlbWVudDtcbiAgICB9XG5cbiAgICBhc3luYyBwYXJzZUNvbnRlbnRKU09ORmlsZSgpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgeGhyLm9wZW4oXCJHRVRcIiwgdGhpcy5jb250ZW50RmlsZVBhdGgsIHRydWUpO1xuICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwianNvblwiO1xuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlID0geGhyLnJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzcG9uc2VbXCJsMTBuXCJdO1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgcmVzcG9uc2VbXCJvdmVycmlkZVwiXTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHhoci5yZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbiIsImZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFwicHJvdG90eXBlXCIsIHsgd3JpdGFibGU6IGZhbHNlIH0pOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuLyohXG4gKiBTcGxpZGUuanNcbiAqIFZlcnNpb24gIDogNC4xLjRcbiAqIExpY2Vuc2UgIDogTUlUXG4gKiBDb3B5cmlnaHQ6IDIwMjIgTmFvdG9zaGkgRnVqaXRhXG4gKi9cbnZhciBNRURJQV9QUkVGRVJTX1JFRFVDRURfTU9USU9OID0gXCIocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKVwiO1xudmFyIENSRUFURUQgPSAxO1xudmFyIE1PVU5URUQgPSAyO1xudmFyIElETEUgPSAzO1xudmFyIE1PVklORyA9IDQ7XG52YXIgU0NST0xMSU5HID0gNTtcbnZhciBEUkFHR0lORyA9IDY7XG52YXIgREVTVFJPWUVEID0gNztcbnZhciBTVEFURVMgPSB7XG4gIENSRUFURUQ6IENSRUFURUQsXG4gIE1PVU5URUQ6IE1PVU5URUQsXG4gIElETEU6IElETEUsXG4gIE1PVklORzogTU9WSU5HLFxuICBTQ1JPTExJTkc6IFNDUk9MTElORyxcbiAgRFJBR0dJTkc6IERSQUdHSU5HLFxuICBERVNUUk9ZRUQ6IERFU1RST1lFRFxufTtcblxuZnVuY3Rpb24gZW1wdHkoYXJyYXkpIHtcbiAgYXJyYXkubGVuZ3RoID0gMDtcbn1cblxuZnVuY3Rpb24gc2xpY2UoYXJyYXlMaWtlLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnJheUxpa2UsIHN0YXJ0LCBlbmQpO1xufVxuXG5mdW5jdGlvbiBhcHBseShmdW5jKSB7XG4gIHJldHVybiBmdW5jLmJpbmQuYXBwbHkoZnVuYywgW251bGxdLmNvbmNhdChzbGljZShhcmd1bWVudHMsIDEpKSk7XG59XG5cbnZhciBuZXh0VGljayA9IHNldFRpbWVvdXQ7XG5cbnZhciBub29wID0gZnVuY3Rpb24gbm9vcCgpIHt9O1xuXG5mdW5jdGlvbiByYWYoZnVuYykge1xuICByZXR1cm4gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmMpO1xufVxuXG5mdW5jdGlvbiB0eXBlT2YodHlwZSwgc3ViamVjdCkge1xuICByZXR1cm4gdHlwZW9mIHN1YmplY3QgPT09IHR5cGU7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KHN1YmplY3QpIHtcbiAgcmV0dXJuICFpc051bGwoc3ViamVjdCkgJiYgdHlwZU9mKFwib2JqZWN0XCIsIHN1YmplY3QpO1xufVxuXG52YXIgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7XG52YXIgaXNGdW5jdGlvbiA9IGFwcGx5KHR5cGVPZiwgXCJmdW5jdGlvblwiKTtcbnZhciBpc1N0cmluZyA9IGFwcGx5KHR5cGVPZiwgXCJzdHJpbmdcIik7XG52YXIgaXNVbmRlZmluZWQgPSBhcHBseSh0eXBlT2YsIFwidW5kZWZpbmVkXCIpO1xuXG5mdW5jdGlvbiBpc051bGwoc3ViamVjdCkge1xuICByZXR1cm4gc3ViamVjdCA9PT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNIVE1MRWxlbWVudChzdWJqZWN0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHN1YmplY3QgaW5zdGFuY2VvZiAoc3ViamVjdC5vd25lckRvY3VtZW50LmRlZmF1bHRWaWV3IHx8IHdpbmRvdykuSFRNTEVsZW1lbnQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IFt2YWx1ZV07XG59XG5cbmZ1bmN0aW9uIGZvckVhY2godmFsdWVzLCBpdGVyYXRlZSkge1xuICB0b0FycmF5KHZhbHVlcykuZm9yRWFjaChpdGVyYXRlZSk7XG59XG5cbmZ1bmN0aW9uIGluY2x1ZGVzKGFycmF5LCB2YWx1ZSkge1xuICByZXR1cm4gYXJyYXkuaW5kZXhPZih2YWx1ZSkgPiAtMTtcbn1cblxuZnVuY3Rpb24gcHVzaChhcnJheSwgaXRlbXMpIHtcbiAgYXJyYXkucHVzaC5hcHBseShhcnJheSwgdG9BcnJheShpdGVtcykpO1xuICByZXR1cm4gYXJyYXk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZUNsYXNzKGVsbSwgY2xhc3NlcywgYWRkKSB7XG4gIGlmIChlbG0pIHtcbiAgICBmb3JFYWNoKGNsYXNzZXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBlbG0uY2xhc3NMaXN0W2FkZCA/IFwiYWRkXCIgOiBcInJlbW92ZVwiXShuYW1lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRDbGFzcyhlbG0sIGNsYXNzZXMpIHtcbiAgdG9nZ2xlQ2xhc3MoZWxtLCBpc1N0cmluZyhjbGFzc2VzKSA/IGNsYXNzZXMuc3BsaXQoXCIgXCIpIDogY2xhc3NlcywgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGFwcGVuZChwYXJlbnQsIGNoaWxkcmVuKSB7XG4gIGZvckVhY2goY2hpbGRyZW4sIHBhcmVudC5hcHBlbmRDaGlsZC5iaW5kKHBhcmVudCkpO1xufVxuXG5mdW5jdGlvbiBiZWZvcmUobm9kZXMsIHJlZikge1xuICBmb3JFYWNoKG5vZGVzLCBmdW5jdGlvbiAobm9kZSkge1xuICAgIHZhciBwYXJlbnQgPSAocmVmIHx8IG5vZGUpLnBhcmVudE5vZGU7XG5cbiAgICBpZiAocGFyZW50KSB7XG4gICAgICBwYXJlbnQuaW5zZXJ0QmVmb3JlKG5vZGUsIHJlZik7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gbWF0Y2hlcyhlbG0sIHNlbGVjdG9yKSB7XG4gIHJldHVybiBpc0hUTUxFbGVtZW50KGVsbSkgJiYgKGVsbVtcIm1zTWF0Y2hlc1NlbGVjdG9yXCJdIHx8IGVsbS5tYXRjaGVzKS5jYWxsKGVsbSwgc2VsZWN0b3IpO1xufVxuXG5mdW5jdGlvbiBjaGlsZHJlbihwYXJlbnQsIHNlbGVjdG9yKSB7XG4gIHZhciBjaGlsZHJlbjIgPSBwYXJlbnQgPyBzbGljZShwYXJlbnQuY2hpbGRyZW4pIDogW107XG4gIHJldHVybiBzZWxlY3RvciA/IGNoaWxkcmVuMi5maWx0ZXIoZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgcmV0dXJuIG1hdGNoZXMoY2hpbGQsIHNlbGVjdG9yKTtcbiAgfSkgOiBjaGlsZHJlbjI7XG59XG5cbmZ1bmN0aW9uIGNoaWxkKHBhcmVudCwgc2VsZWN0b3IpIHtcbiAgcmV0dXJuIHNlbGVjdG9yID8gY2hpbGRyZW4ocGFyZW50LCBzZWxlY3RvcilbMF0gOiBwYXJlbnQuZmlyc3RFbGVtZW50Q2hpbGQ7XG59XG5cbnZhciBvd25LZXlzID0gT2JqZWN0LmtleXM7XG5cbmZ1bmN0aW9uIGZvck93bihvYmplY3QsIGl0ZXJhdGVlLCByaWdodCkge1xuICBpZiAob2JqZWN0KSB7XG4gICAgKHJpZ2h0ID8gb3duS2V5cyhvYmplY3QpLnJldmVyc2UoKSA6IG93bktleXMob2JqZWN0KSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICBrZXkgIT09IFwiX19wcm90b19fXCIgJiYgaXRlcmF0ZWUob2JqZWN0W2tleV0sIGtleSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBhc3NpZ24ob2JqZWN0KSB7XG4gIHNsaWNlKGFyZ3VtZW50cywgMSkuZm9yRWFjaChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgZm9yT3duKHNvdXJjZSwgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgIG9iamVjdFtrZXldID0gc291cmNlW2tleV07XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBtZXJnZShvYmplY3QpIHtcbiAgc2xpY2UoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICBmb3JPd24oc291cmNlLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gdmFsdWUuc2xpY2UoKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gbWVyZ2Uoe30sIGlzT2JqZWN0KG9iamVjdFtrZXldKSA/IG9iamVjdFtrZXldIDoge30sIHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9iamVjdFtrZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG5mdW5jdGlvbiBvbWl0KG9iamVjdCwga2V5cykge1xuICBmb3JFYWNoKGtleXMgfHwgb3duS2V5cyhvYmplY3QpLCBmdW5jdGlvbiAoa2V5KSB7XG4gICAgZGVsZXRlIG9iamVjdFtrZXldO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlQXR0cmlidXRlKGVsbXMsIGF0dHJzKSB7XG4gIGZvckVhY2goZWxtcywgZnVuY3Rpb24gKGVsbSkge1xuICAgIGZvckVhY2goYXR0cnMsIGZ1bmN0aW9uIChhdHRyKSB7XG4gICAgICBlbG0gJiYgZWxtLnJlbW92ZUF0dHJpYnV0ZShhdHRyKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZShlbG1zLCBhdHRycywgdmFsdWUpIHtcbiAgaWYgKGlzT2JqZWN0KGF0dHJzKSkge1xuICAgIGZvck93bihhdHRycywgZnVuY3Rpb24gKHZhbHVlMiwgbmFtZSkge1xuICAgICAgc2V0QXR0cmlidXRlKGVsbXMsIG5hbWUsIHZhbHVlMik7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgZm9yRWFjaChlbG1zLCBmdW5jdGlvbiAoZWxtKSB7XG4gICAgICBpc051bGwodmFsdWUpIHx8IHZhbHVlID09PSBcIlwiID8gcmVtb3ZlQXR0cmlidXRlKGVsbSwgYXR0cnMpIDogZWxtLnNldEF0dHJpYnV0ZShhdHRycywgU3RyaW5nKHZhbHVlKSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlKHRhZywgYXR0cnMsIHBhcmVudCkge1xuICB2YXIgZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuXG4gIGlmIChhdHRycykge1xuICAgIGlzU3RyaW5nKGF0dHJzKSA/IGFkZENsYXNzKGVsbSwgYXR0cnMpIDogc2V0QXR0cmlidXRlKGVsbSwgYXR0cnMpO1xuICB9XG5cbiAgcGFyZW50ICYmIGFwcGVuZChwYXJlbnQsIGVsbSk7XG4gIHJldHVybiBlbG07XG59XG5cbmZ1bmN0aW9uIHN0eWxlKGVsbSwgcHJvcCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSkge1xuICAgIHJldHVybiBnZXRDb21wdXRlZFN0eWxlKGVsbSlbcHJvcF07XG4gIH1cblxuICBpZiAoIWlzTnVsbCh2YWx1ZSkpIHtcbiAgICBlbG0uc3R5bGVbcHJvcF0gPSBcIlwiICsgdmFsdWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGxheShlbG0sIGRpc3BsYXkyKSB7XG4gIHN0eWxlKGVsbSwgXCJkaXNwbGF5XCIsIGRpc3BsYXkyKTtcbn1cblxuZnVuY3Rpb24gZm9jdXMoZWxtKSB7XG4gIGVsbVtcInNldEFjdGl2ZVwiXSAmJiBlbG1bXCJzZXRBY3RpdmVcIl0oKSB8fCBlbG0uZm9jdXMoe1xuICAgIHByZXZlbnRTY3JvbGw6IHRydWVcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHJpYnV0ZShlbG0sIGF0dHIpIHtcbiAgcmV0dXJuIGVsbS5nZXRBdHRyaWJ1dGUoYXR0cik7XG59XG5cbmZ1bmN0aW9uIGhhc0NsYXNzKGVsbSwgY2xhc3NOYW1lKSB7XG4gIHJldHVybiBlbG0gJiYgZWxtLmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpO1xufVxuXG5mdW5jdGlvbiByZWN0KHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xufVxuXG5mdW5jdGlvbiByZW1vdmUobm9kZXMpIHtcbiAgZm9yRWFjaChub2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICBpZiAobm9kZSAmJiBub2RlLnBhcmVudE5vZGUpIHtcbiAgICAgIG5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChub2RlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZUh0bWwoaHRtbCkge1xuICByZXR1cm4gY2hpbGQobmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyhodG1sLCBcInRleHQvaHRtbFwiKS5ib2R5KTtcbn1cblxuZnVuY3Rpb24gcHJldmVudChlLCBzdG9wUHJvcGFnYXRpb24pIHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gIGlmIChzdG9wUHJvcGFnYXRpb24pIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcXVlcnkocGFyZW50LCBzZWxlY3Rvcikge1xuICByZXR1cm4gcGFyZW50ICYmIHBhcmVudC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbn1cblxuZnVuY3Rpb24gcXVlcnlBbGwocGFyZW50LCBzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0b3IgPyBzbGljZShwYXJlbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpIDogW107XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsbSwgY2xhc3Nlcykge1xuICB0b2dnbGVDbGFzcyhlbG0sIGNsYXNzZXMsIGZhbHNlKTtcbn1cblxuZnVuY3Rpb24gdGltZU9mKGUpIHtcbiAgcmV0dXJuIGUudGltZVN0YW1wO1xufVxuXG5mdW5jdGlvbiB1bml0KHZhbHVlKSB7XG4gIHJldHVybiBpc1N0cmluZyh2YWx1ZSkgPyB2YWx1ZSA6IHZhbHVlID8gdmFsdWUgKyBcInB4XCIgOiBcIlwiO1xufVxuXG52YXIgUFJPSkVDVF9DT0RFID0gXCJzcGxpZGVcIjtcbnZhciBEQVRBX0FUVFJJQlVURSA9IFwiZGF0YS1cIiArIFBST0pFQ1RfQ09ERTtcblxuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcIltcIiArIFBST0pFQ1RfQ09ERSArIFwiXSBcIiArIChtZXNzYWdlIHx8IFwiXCIpKTtcbiAgfVxufVxuXG52YXIgbWluID0gTWF0aC5taW4sXG4gICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgZmxvb3IgPSBNYXRoLmZsb29yLFxuICAgIGNlaWwgPSBNYXRoLmNlaWwsXG4gICAgYWJzID0gTWF0aC5hYnM7XG5cbmZ1bmN0aW9uIGFwcHJveGltYXRlbHlFcXVhbCh4LCB5LCBlcHNpbG9uKSB7XG4gIHJldHVybiBhYnMoeCAtIHkpIDwgZXBzaWxvbjtcbn1cblxuZnVuY3Rpb24gYmV0d2VlbihudW1iZXIsIHgsIHksIGV4Y2x1c2l2ZSkge1xuICB2YXIgbWluaW11bSA9IG1pbih4LCB5KTtcbiAgdmFyIG1heGltdW0gPSBtYXgoeCwgeSk7XG4gIHJldHVybiBleGNsdXNpdmUgPyBtaW5pbXVtIDwgbnVtYmVyICYmIG51bWJlciA8IG1heGltdW0gOiBtaW5pbXVtIDw9IG51bWJlciAmJiBudW1iZXIgPD0gbWF4aW11bTtcbn1cblxuZnVuY3Rpb24gY2xhbXAobnVtYmVyLCB4LCB5KSB7XG4gIHZhciBtaW5pbXVtID0gbWluKHgsIHkpO1xuICB2YXIgbWF4aW11bSA9IG1heCh4LCB5KTtcbiAgcmV0dXJuIG1pbihtYXgobWluaW11bSwgbnVtYmVyKSwgbWF4aW11bSk7XG59XG5cbmZ1bmN0aW9uIHNpZ24oeCkge1xuICByZXR1cm4gKyh4ID4gMCkgLSArKHggPCAwKTtcbn1cblxuZnVuY3Rpb24gY2FtZWxUb0tlYmFiKHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoLyhbYS16MC05XSkoW0EtWl0pL2csIFwiJDEtJDJcIikudG9Mb3dlckNhc2UoKTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0KHN0cmluZywgcmVwbGFjZW1lbnRzKSB7XG4gIGZvckVhY2gocmVwbGFjZW1lbnRzLCBmdW5jdGlvbiAocmVwbGFjZW1lbnQpIHtcbiAgICBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShcIiVzXCIsIFwiXCIgKyByZXBsYWNlbWVudCk7XG4gIH0pO1xuICByZXR1cm4gc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBwYWQobnVtYmVyKSB7XG4gIHJldHVybiBudW1iZXIgPCAxMCA/IFwiMFwiICsgbnVtYmVyIDogXCJcIiArIG51bWJlcjtcbn1cblxudmFyIGlkcyA9IHt9O1xuXG5mdW5jdGlvbiB1bmlxdWVJZChwcmVmaXgpIHtcbiAgcmV0dXJuIFwiXCIgKyBwcmVmaXggKyBwYWQoaWRzW3ByZWZpeF0gPSAoaWRzW3ByZWZpeF0gfHwgMCkgKyAxKTtcbn1cblxuZnVuY3Rpb24gRXZlbnRCaW5kZXIoKSB7XG4gIHZhciBsaXN0ZW5lcnMgPSBbXTtcblxuICBmdW5jdGlvbiBiaW5kKHRhcmdldHMsIGV2ZW50cywgY2FsbGJhY2ssIG9wdGlvbnMpIHtcbiAgICBmb3JFYWNoRXZlbnQodGFyZ2V0cywgZXZlbnRzLCBmdW5jdGlvbiAodGFyZ2V0LCBldmVudCwgbmFtZXNwYWNlKSB7XG4gICAgICB2YXIgaXNFdmVudFRhcmdldCA9IChcImFkZEV2ZW50TGlzdGVuZXJcIiBpbiB0YXJnZXQpO1xuICAgICAgdmFyIHJlbW92ZXIgPSBpc0V2ZW50VGFyZ2V0ID8gdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIuYmluZCh0YXJnZXQsIGV2ZW50LCBjYWxsYmFjaywgb3B0aW9ucykgOiB0YXJnZXRbXCJyZW1vdmVMaXN0ZW5lclwiXS5iaW5kKHRhcmdldCwgY2FsbGJhY2spO1xuICAgICAgaXNFdmVudFRhcmdldCA/IHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgb3B0aW9ucykgOiB0YXJnZXRbXCJhZGRMaXN0ZW5lclwiXShjYWxsYmFjayk7XG4gICAgICBsaXN0ZW5lcnMucHVzaChbdGFyZ2V0LCBldmVudCwgbmFtZXNwYWNlLCBjYWxsYmFjaywgcmVtb3Zlcl0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdW5iaW5kKHRhcmdldHMsIGV2ZW50cywgY2FsbGJhY2spIHtcbiAgICBmb3JFYWNoRXZlbnQodGFyZ2V0cywgZXZlbnRzLCBmdW5jdGlvbiAodGFyZ2V0LCBldmVudCwgbmFtZXNwYWNlKSB7XG4gICAgICBsaXN0ZW5lcnMgPSBsaXN0ZW5lcnMuZmlsdGVyKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICBpZiAobGlzdGVuZXJbMF0gPT09IHRhcmdldCAmJiBsaXN0ZW5lclsxXSA9PT0gZXZlbnQgJiYgbGlzdGVuZXJbMl0gPT09IG5hbWVzcGFjZSAmJiAoIWNhbGxiYWNrIHx8IGxpc3RlbmVyWzNdID09PSBjYWxsYmFjaykpIHtcbiAgICAgICAgICBsaXN0ZW5lcls0XSgpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNwYXRjaCh0YXJnZXQsIHR5cGUsIGRldGFpbCkge1xuICAgIHZhciBlO1xuICAgIHZhciBidWJibGVzID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgQ3VzdG9tRXZlbnQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgZSA9IG5ldyBDdXN0b21FdmVudCh0eXBlLCB7XG4gICAgICAgIGJ1YmJsZXM6IGJ1YmJsZXMsXG4gICAgICAgIGRldGFpbDogZGV0YWlsXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZSA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KFwiQ3VzdG9tRXZlbnRcIik7XG4gICAgICBlLmluaXRDdXN0b21FdmVudCh0eXBlLCBidWJibGVzLCBmYWxzZSwgZGV0YWlsKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuZGlzcGF0Y2hFdmVudChlKTtcbiAgICByZXR1cm4gZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvckVhY2hFdmVudCh0YXJnZXRzLCBldmVudHMsIGl0ZXJhdGVlKSB7XG4gICAgZm9yRWFjaCh0YXJnZXRzLCBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICB0YXJnZXQgJiYgZm9yRWFjaChldmVudHMsIGZ1bmN0aW9uIChldmVudHMyKSB7XG4gICAgICAgIGV2ZW50czIuc3BsaXQoXCIgXCIpLmZvckVhY2goZnVuY3Rpb24gKGV2ZW50TlMpIHtcbiAgICAgICAgICB2YXIgZnJhZ21lbnQgPSBldmVudE5TLnNwbGl0KFwiLlwiKTtcbiAgICAgICAgICBpdGVyYXRlZSh0YXJnZXQsIGZyYWdtZW50WzBdLCBmcmFnbWVudFsxXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICBkYXRhWzRdKCk7XG4gICAgfSk7XG4gICAgZW1wdHkobGlzdGVuZXJzKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYmluZDogYmluZCxcbiAgICB1bmJpbmQ6IHVuYmluZCxcbiAgICBkaXNwYXRjaDogZGlzcGF0Y2gsXG4gICAgZGVzdHJveTogZGVzdHJveVxuICB9O1xufVxuXG52YXIgRVZFTlRfTU9VTlRFRCA9IFwibW91bnRlZFwiO1xudmFyIEVWRU5UX1JFQURZID0gXCJyZWFkeVwiO1xudmFyIEVWRU5UX01PVkUgPSBcIm1vdmVcIjtcbnZhciBFVkVOVF9NT1ZFRCA9IFwibW92ZWRcIjtcbnZhciBFVkVOVF9DTElDSyA9IFwiY2xpY2tcIjtcbnZhciBFVkVOVF9BQ1RJVkUgPSBcImFjdGl2ZVwiO1xudmFyIEVWRU5UX0lOQUNUSVZFID0gXCJpbmFjdGl2ZVwiO1xudmFyIEVWRU5UX1ZJU0lCTEUgPSBcInZpc2libGVcIjtcbnZhciBFVkVOVF9ISURERU4gPSBcImhpZGRlblwiO1xudmFyIEVWRU5UX1JFRlJFU0ggPSBcInJlZnJlc2hcIjtcbnZhciBFVkVOVF9VUERBVEVEID0gXCJ1cGRhdGVkXCI7XG52YXIgRVZFTlRfUkVTSVpFID0gXCJyZXNpemVcIjtcbnZhciBFVkVOVF9SRVNJWkVEID0gXCJyZXNpemVkXCI7XG52YXIgRVZFTlRfRFJBRyA9IFwiZHJhZ1wiO1xudmFyIEVWRU5UX0RSQUdHSU5HID0gXCJkcmFnZ2luZ1wiO1xudmFyIEVWRU5UX0RSQUdHRUQgPSBcImRyYWdnZWRcIjtcbnZhciBFVkVOVF9TQ1JPTEwgPSBcInNjcm9sbFwiO1xudmFyIEVWRU5UX1NDUk9MTEVEID0gXCJzY3JvbGxlZFwiO1xudmFyIEVWRU5UX09WRVJGTE9XID0gXCJvdmVyZmxvd1wiO1xudmFyIEVWRU5UX0RFU1RST1kgPSBcImRlc3Ryb3lcIjtcbnZhciBFVkVOVF9BUlJPV1NfTU9VTlRFRCA9IFwiYXJyb3dzOm1vdW50ZWRcIjtcbnZhciBFVkVOVF9BUlJPV1NfVVBEQVRFRCA9IFwiYXJyb3dzOnVwZGF0ZWRcIjtcbnZhciBFVkVOVF9QQUdJTkFUSU9OX01PVU5URUQgPSBcInBhZ2luYXRpb246bW91bnRlZFwiO1xudmFyIEVWRU5UX1BBR0lOQVRJT05fVVBEQVRFRCA9IFwicGFnaW5hdGlvbjp1cGRhdGVkXCI7XG52YXIgRVZFTlRfTkFWSUdBVElPTl9NT1VOVEVEID0gXCJuYXZpZ2F0aW9uOm1vdW50ZWRcIjtcbnZhciBFVkVOVF9BVVRPUExBWV9QTEFZID0gXCJhdXRvcGxheTpwbGF5XCI7XG52YXIgRVZFTlRfQVVUT1BMQVlfUExBWUlORyA9IFwiYXV0b3BsYXk6cGxheWluZ1wiO1xudmFyIEVWRU5UX0FVVE9QTEFZX1BBVVNFID0gXCJhdXRvcGxheTpwYXVzZVwiO1xudmFyIEVWRU5UX0xBWllMT0FEX0xPQURFRCA9IFwibGF6eWxvYWQ6bG9hZGVkXCI7XG52YXIgRVZFTlRfU0xJREVfS0VZRE9XTiA9IFwic2tcIjtcbnZhciBFVkVOVF9TSElGVEVEID0gXCJzaFwiO1xudmFyIEVWRU5UX0VORF9JTkRFWF9DSEFOR0VEID0gXCJlaVwiO1xuXG5mdW5jdGlvbiBFdmVudEludGVyZmFjZShTcGxpZGUyKSB7XG4gIHZhciBidXMgPSBTcGxpZGUyID8gU3BsaWRlMi5ldmVudC5idXMgOiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gIHZhciBiaW5kZXIgPSBFdmVudEJpbmRlcigpO1xuXG4gIGZ1bmN0aW9uIG9uKGV2ZW50cywgY2FsbGJhY2spIHtcbiAgICBiaW5kZXIuYmluZChidXMsIHRvQXJyYXkoZXZlbnRzKS5qb2luKFwiIFwiKSwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBpc0FycmF5KGUuZGV0YWlsKSA/IGUuZGV0YWlsIDogW10pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZW1pdChldmVudCkge1xuICAgIGJpbmRlci5kaXNwYXRjaChidXMsIGV2ZW50LCBzbGljZShhcmd1bWVudHMsIDEpKTtcbiAgfVxuXG4gIGlmIChTcGxpZGUyKSB7XG4gICAgU3BsaWRlMi5ldmVudC5vbihFVkVOVF9ERVNUUk9ZLCBiaW5kZXIuZGVzdHJveSk7XG4gIH1cblxuICByZXR1cm4gYXNzaWduKGJpbmRlciwge1xuICAgIGJ1czogYnVzLFxuICAgIG9uOiBvbixcbiAgICBvZmY6IGFwcGx5KGJpbmRlci51bmJpbmQsIGJ1cyksXG4gICAgZW1pdDogZW1pdFxuICB9KTtcbn1cblxuZnVuY3Rpb24gUmVxdWVzdEludGVydmFsKGludGVydmFsLCBvbkludGVydmFsLCBvblVwZGF0ZSwgbGltaXQpIHtcbiAgdmFyIG5vdyA9IERhdGUubm93O1xuICB2YXIgc3RhcnRUaW1lO1xuICB2YXIgcmF0ZSA9IDA7XG4gIHZhciBpZDtcbiAgdmFyIHBhdXNlZCA9IHRydWU7XG4gIHZhciBjb3VudCA9IDA7XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGlmICghcGF1c2VkKSB7XG4gICAgICByYXRlID0gaW50ZXJ2YWwgPyBtaW4oKG5vdygpIC0gc3RhcnRUaW1lKSAvIGludGVydmFsLCAxKSA6IDE7XG4gICAgICBvblVwZGF0ZSAmJiBvblVwZGF0ZShyYXRlKTtcblxuICAgICAgaWYgKHJhdGUgPj0gMSkge1xuICAgICAgICBvbkludGVydmFsKCk7XG4gICAgICAgIHN0YXJ0VGltZSA9IG5vdygpO1xuXG4gICAgICAgIGlmIChsaW1pdCAmJiArK2NvdW50ID49IGxpbWl0KSB7XG4gICAgICAgICAgcmV0dXJuIHBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWQgPSByYWYodXBkYXRlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydChyZXN1bWUpIHtcbiAgICByZXN1bWUgfHwgY2FuY2VsKCk7XG4gICAgc3RhcnRUaW1lID0gbm93KCkgLSAocmVzdW1lID8gcmF0ZSAqIGludGVydmFsIDogMCk7XG4gICAgcGF1c2VkID0gZmFsc2U7XG4gICAgaWQgPSByYWYodXBkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdXNlKCkge1xuICAgIHBhdXNlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiByZXdpbmQoKSB7XG4gICAgc3RhcnRUaW1lID0gbm93KCk7XG4gICAgcmF0ZSA9IDA7XG5cbiAgICBpZiAob25VcGRhdGUpIHtcbiAgICAgIG9uVXBkYXRlKHJhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZCAmJiBjYW5jZWxBbmltYXRpb25GcmFtZShpZCk7XG4gICAgcmF0ZSA9IDA7XG4gICAgaWQgPSAwO1xuICAgIHBhdXNlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBzZXQodGltZSkge1xuICAgIGludGVydmFsID0gdGltZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzUGF1c2VkKCkge1xuICAgIHJldHVybiBwYXVzZWQ7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHN0YXJ0OiBzdGFydCxcbiAgICByZXdpbmQ6IHJld2luZCxcbiAgICBwYXVzZTogcGF1c2UsXG4gICAgY2FuY2VsOiBjYW5jZWwsXG4gICAgc2V0OiBzZXQsXG4gICAgaXNQYXVzZWQ6IGlzUGF1c2VkXG4gIH07XG59XG5cbmZ1bmN0aW9uIFN0YXRlKGluaXRpYWxTdGF0ZSkge1xuICB2YXIgc3RhdGUgPSBpbml0aWFsU3RhdGU7XG5cbiAgZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgc3RhdGUgPSB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzKHN0YXRlcykge1xuICAgIHJldHVybiBpbmNsdWRlcyh0b0FycmF5KHN0YXRlcyksIHN0YXRlKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgc2V0OiBzZXQsXG4gICAgaXM6IGlzXG4gIH07XG59XG5cbmZ1bmN0aW9uIFRocm90dGxlKGZ1bmMsIGR1cmF0aW9uKSB7XG4gIHZhciBpbnRlcnZhbCA9IFJlcXVlc3RJbnRlcnZhbChkdXJhdGlvbiB8fCAwLCBmdW5jLCBudWxsLCAxKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICBpbnRlcnZhbC5pc1BhdXNlZCgpICYmIGludGVydmFsLnN0YXJ0KCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIE1lZGlhKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBzdGF0ZSA9IFNwbGlkZTIuc3RhdGU7XG4gIHZhciBicmVha3BvaW50cyA9IG9wdGlvbnMuYnJlYWtwb2ludHMgfHwge307XG4gIHZhciByZWR1Y2VkTW90aW9uID0gb3B0aW9ucy5yZWR1Y2VkTW90aW9uIHx8IHt9O1xuICB2YXIgYmluZGVyID0gRXZlbnRCaW5kZXIoKTtcbiAgdmFyIHF1ZXJpZXMgPSBbXTtcblxuICBmdW5jdGlvbiBzZXR1cCgpIHtcbiAgICB2YXIgaXNNaW4gPSBvcHRpb25zLm1lZGlhUXVlcnkgPT09IFwibWluXCI7XG4gICAgb3duS2V5cyhicmVha3BvaW50cykuc29ydChmdW5jdGlvbiAobiwgbSkge1xuICAgICAgcmV0dXJuIGlzTWluID8gK24gLSArbSA6ICttIC0gK247XG4gICAgfSkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICByZWdpc3RlcihicmVha3BvaW50c1trZXldLCBcIihcIiArIChpc01pbiA/IFwibWluXCIgOiBcIm1heFwiKSArIFwiLXdpZHRoOlwiICsga2V5ICsgXCJweClcIik7XG4gICAgfSk7XG4gICAgcmVnaXN0ZXIocmVkdWNlZE1vdGlvbiwgTUVESUFfUFJFRkVSU19SRURVQ0VEX01PVElPTik7XG4gICAgdXBkYXRlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KGNvbXBsZXRlbHkpIHtcbiAgICBpZiAoY29tcGxldGVseSkge1xuICAgICAgYmluZGVyLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlcihvcHRpb25zMiwgcXVlcnkpIHtcbiAgICB2YXIgcXVlcnlMaXN0ID0gbWF0Y2hNZWRpYShxdWVyeSk7XG4gICAgYmluZGVyLmJpbmQocXVlcnlMaXN0LCBcImNoYW5nZVwiLCB1cGRhdGUpO1xuICAgIHF1ZXJpZXMucHVzaChbb3B0aW9uczIsIHF1ZXJ5TGlzdF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHZhciBkZXN0cm95ZWQgPSBzdGF0ZS5pcyhERVNUUk9ZRUQpO1xuICAgIHZhciBkaXJlY3Rpb24gPSBvcHRpb25zLmRpcmVjdGlvbjtcbiAgICB2YXIgbWVyZ2VkID0gcXVlcmllcy5yZWR1Y2UoZnVuY3Rpb24gKG1lcmdlZDIsIGVudHJ5KSB7XG4gICAgICByZXR1cm4gbWVyZ2UobWVyZ2VkMiwgZW50cnlbMV0ubWF0Y2hlcyA/IGVudHJ5WzBdIDoge30pO1xuICAgIH0sIHt9KTtcbiAgICBvbWl0KG9wdGlvbnMpO1xuICAgIHNldChtZXJnZWQpO1xuXG4gICAgaWYgKG9wdGlvbnMuZGVzdHJveSkge1xuICAgICAgU3BsaWRlMi5kZXN0cm95KG9wdGlvbnMuZGVzdHJveSA9PT0gXCJjb21wbGV0ZWx5XCIpO1xuICAgIH0gZWxzZSBpZiAoZGVzdHJveWVkKSB7XG4gICAgICBkZXN0cm95KHRydWUpO1xuICAgICAgU3BsaWRlMi5tb3VudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXJlY3Rpb24gIT09IG9wdGlvbnMuZGlyZWN0aW9uICYmIFNwbGlkZTIucmVmcmVzaCgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZHVjZShlbmFibGUpIHtcbiAgICBpZiAobWF0Y2hNZWRpYShNRURJQV9QUkVGRVJTX1JFRFVDRURfTU9USU9OKS5tYXRjaGVzKSB7XG4gICAgICBlbmFibGUgPyBtZXJnZShvcHRpb25zLCByZWR1Y2VkTW90aW9uKSA6IG9taXQob3B0aW9ucywgb3duS2V5cyhyZWR1Y2VkTW90aW9uKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0KG9wdHMsIGJhc2UsIG5vdGlmeSkge1xuICAgIG1lcmdlKG9wdGlvbnMsIG9wdHMpO1xuICAgIGJhc2UgJiYgbWVyZ2UoT2JqZWN0LmdldFByb3RvdHlwZU9mKG9wdGlvbnMpLCBvcHRzKTtcblxuICAgIGlmIChub3RpZnkgfHwgIXN0YXRlLmlzKENSRUFURUQpKSB7XG4gICAgICBTcGxpZGUyLmVtaXQoRVZFTlRfVVBEQVRFRCwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXR1cDogc2V0dXAsXG4gICAgZGVzdHJveTogZGVzdHJveSxcbiAgICByZWR1Y2U6IHJlZHVjZSxcbiAgICBzZXQ6IHNldFxuICB9O1xufVxuXG52YXIgQVJST1cgPSBcIkFycm93XCI7XG52YXIgQVJST1dfTEVGVCA9IEFSUk9XICsgXCJMZWZ0XCI7XG52YXIgQVJST1dfUklHSFQgPSBBUlJPVyArIFwiUmlnaHRcIjtcbnZhciBBUlJPV19VUCA9IEFSUk9XICsgXCJVcFwiO1xudmFyIEFSUk9XX0RPV04gPSBBUlJPVyArIFwiRG93blwiO1xudmFyIExUUiA9IFwibHRyXCI7XG52YXIgUlRMID0gXCJydGxcIjtcbnZhciBUVEIgPSBcInR0YlwiO1xudmFyIE9SSUVOVEFUSU9OX01BUCA9IHtcbiAgd2lkdGg6IFtcImhlaWdodFwiXSxcbiAgbGVmdDogW1widG9wXCIsIFwicmlnaHRcIl0sXG4gIHJpZ2h0OiBbXCJib3R0b21cIiwgXCJsZWZ0XCJdLFxuICB4OiBbXCJ5XCJdLFxuICBYOiBbXCJZXCJdLFxuICBZOiBbXCJYXCJdLFxuICBBcnJvd0xlZnQ6IFtBUlJPV19VUCwgQVJST1dfUklHSFRdLFxuICBBcnJvd1JpZ2h0OiBbQVJST1dfRE9XTiwgQVJST1dfTEVGVF1cbn07XG5cbmZ1bmN0aW9uIERpcmVjdGlvbihTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICBmdW5jdGlvbiByZXNvbHZlKHByb3AsIGF4aXNPbmx5LCBkaXJlY3Rpb24pIHtcbiAgICBkaXJlY3Rpb24gPSBkaXJlY3Rpb24gfHwgb3B0aW9ucy5kaXJlY3Rpb247XG4gICAgdmFyIGluZGV4ID0gZGlyZWN0aW9uID09PSBSVEwgJiYgIWF4aXNPbmx5ID8gMSA6IGRpcmVjdGlvbiA9PT0gVFRCID8gMCA6IC0xO1xuICAgIHJldHVybiBPUklFTlRBVElPTl9NQVBbcHJvcF0gJiYgT1JJRU5UQVRJT05fTUFQW3Byb3BdW2luZGV4XSB8fCBwcm9wLnJlcGxhY2UoL3dpZHRofGxlZnR8cmlnaHQvaSwgZnVuY3Rpb24gKG1hdGNoLCBvZmZzZXQpIHtcbiAgICAgIHZhciByZXBsYWNlbWVudCA9IE9SSUVOVEFUSU9OX01BUFttYXRjaC50b0xvd2VyQ2FzZSgpXVtpbmRleF0gfHwgbWF0Y2g7XG4gICAgICByZXR1cm4gb2Zmc2V0ID4gMCA/IHJlcGxhY2VtZW50LmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgcmVwbGFjZW1lbnQuc2xpY2UoMSkgOiByZXBsYWNlbWVudDtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9yaWVudCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAqIChvcHRpb25zLmRpcmVjdGlvbiA9PT0gUlRMID8gMSA6IC0xKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICBvcmllbnQ6IG9yaWVudFxuICB9O1xufVxuXG52YXIgUk9MRSA9IFwicm9sZVwiO1xudmFyIFRBQl9JTkRFWCA9IFwidGFiaW5kZXhcIjtcbnZhciBESVNBQkxFRCA9IFwiZGlzYWJsZWRcIjtcbnZhciBBUklBX1BSRUZJWCA9IFwiYXJpYS1cIjtcbnZhciBBUklBX0NPTlRST0xTID0gQVJJQV9QUkVGSVggKyBcImNvbnRyb2xzXCI7XG52YXIgQVJJQV9DVVJSRU5UID0gQVJJQV9QUkVGSVggKyBcImN1cnJlbnRcIjtcbnZhciBBUklBX1NFTEVDVEVEID0gQVJJQV9QUkVGSVggKyBcInNlbGVjdGVkXCI7XG52YXIgQVJJQV9MQUJFTCA9IEFSSUFfUFJFRklYICsgXCJsYWJlbFwiO1xudmFyIEFSSUFfTEFCRUxMRURCWSA9IEFSSUFfUFJFRklYICsgXCJsYWJlbGxlZGJ5XCI7XG52YXIgQVJJQV9ISURERU4gPSBBUklBX1BSRUZJWCArIFwiaGlkZGVuXCI7XG52YXIgQVJJQV9PUklFTlRBVElPTiA9IEFSSUFfUFJFRklYICsgXCJvcmllbnRhdGlvblwiO1xudmFyIEFSSUFfUk9MRURFU0NSSVBUSU9OID0gQVJJQV9QUkVGSVggKyBcInJvbGVkZXNjcmlwdGlvblwiO1xudmFyIEFSSUFfTElWRSA9IEFSSUFfUFJFRklYICsgXCJsaXZlXCI7XG52YXIgQVJJQV9CVVNZID0gQVJJQV9QUkVGSVggKyBcImJ1c3lcIjtcbnZhciBBUklBX0FUT01JQyA9IEFSSUFfUFJFRklYICsgXCJhdG9taWNcIjtcbnZhciBBTExfQVRUUklCVVRFUyA9IFtST0xFLCBUQUJfSU5ERVgsIERJU0FCTEVELCBBUklBX0NPTlRST0xTLCBBUklBX0NVUlJFTlQsIEFSSUFfTEFCRUwsIEFSSUFfTEFCRUxMRURCWSwgQVJJQV9ISURERU4sIEFSSUFfT1JJRU5UQVRJT04sIEFSSUFfUk9MRURFU0NSSVBUSU9OXTtcbnZhciBDTEFTU19QUkVGSVggPSBQUk9KRUNUX0NPREUgKyBcIl9fXCI7XG52YXIgU1RBVFVTX0NMQVNTX1BSRUZJWCA9IFwiaXMtXCI7XG52YXIgQ0xBU1NfUk9PVCA9IFBST0pFQ1RfQ09ERTtcbnZhciBDTEFTU19UUkFDSyA9IENMQVNTX1BSRUZJWCArIFwidHJhY2tcIjtcbnZhciBDTEFTU19MSVNUID0gQ0xBU1NfUFJFRklYICsgXCJsaXN0XCI7XG52YXIgQ0xBU1NfU0xJREUgPSBDTEFTU19QUkVGSVggKyBcInNsaWRlXCI7XG52YXIgQ0xBU1NfQ0xPTkUgPSBDTEFTU19TTElERSArIFwiLS1jbG9uZVwiO1xudmFyIENMQVNTX0NPTlRBSU5FUiA9IENMQVNTX1NMSURFICsgXCJfX2NvbnRhaW5lclwiO1xudmFyIENMQVNTX0FSUk9XUyA9IENMQVNTX1BSRUZJWCArIFwiYXJyb3dzXCI7XG52YXIgQ0xBU1NfQVJST1cgPSBDTEFTU19QUkVGSVggKyBcImFycm93XCI7XG52YXIgQ0xBU1NfQVJST1dfUFJFViA9IENMQVNTX0FSUk9XICsgXCItLXByZXZcIjtcbnZhciBDTEFTU19BUlJPV19ORVhUID0gQ0xBU1NfQVJST1cgKyBcIi0tbmV4dFwiO1xudmFyIENMQVNTX1BBR0lOQVRJT04gPSBDTEFTU19QUkVGSVggKyBcInBhZ2luYXRpb25cIjtcbnZhciBDTEFTU19QQUdJTkFUSU9OX1BBR0UgPSBDTEFTU19QQUdJTkFUSU9OICsgXCJfX3BhZ2VcIjtcbnZhciBDTEFTU19QUk9HUkVTUyA9IENMQVNTX1BSRUZJWCArIFwicHJvZ3Jlc3NcIjtcbnZhciBDTEFTU19QUk9HUkVTU19CQVIgPSBDTEFTU19QUk9HUkVTUyArIFwiX19iYXJcIjtcbnZhciBDTEFTU19UT0dHTEUgPSBDTEFTU19QUkVGSVggKyBcInRvZ2dsZVwiO1xudmFyIENMQVNTX1RPR0dMRV9QTEFZID0gQ0xBU1NfVE9HR0xFICsgXCJfX3BsYXlcIjtcbnZhciBDTEFTU19UT0dHTEVfUEFVU0UgPSBDTEFTU19UT0dHTEUgKyBcIl9fcGF1c2VcIjtcbnZhciBDTEFTU19TUElOTkVSID0gQ0xBU1NfUFJFRklYICsgXCJzcGlubmVyXCI7XG52YXIgQ0xBU1NfU1IgPSBDTEFTU19QUkVGSVggKyBcInNyXCI7XG52YXIgQ0xBU1NfSU5JVElBTElaRUQgPSBTVEFUVVNfQ0xBU1NfUFJFRklYICsgXCJpbml0aWFsaXplZFwiO1xudmFyIENMQVNTX0FDVElWRSA9IFNUQVRVU19DTEFTU19QUkVGSVggKyBcImFjdGl2ZVwiO1xudmFyIENMQVNTX1BSRVYgPSBTVEFUVVNfQ0xBU1NfUFJFRklYICsgXCJwcmV2XCI7XG52YXIgQ0xBU1NfTkVYVCA9IFNUQVRVU19DTEFTU19QUkVGSVggKyBcIm5leHRcIjtcbnZhciBDTEFTU19WSVNJQkxFID0gU1RBVFVTX0NMQVNTX1BSRUZJWCArIFwidmlzaWJsZVwiO1xudmFyIENMQVNTX0xPQURJTkcgPSBTVEFUVVNfQ0xBU1NfUFJFRklYICsgXCJsb2FkaW5nXCI7XG52YXIgQ0xBU1NfRk9DVVNfSU4gPSBTVEFUVVNfQ0xBU1NfUFJFRklYICsgXCJmb2N1cy1pblwiO1xudmFyIENMQVNTX09WRVJGTE9XID0gU1RBVFVTX0NMQVNTX1BSRUZJWCArIFwib3ZlcmZsb3dcIjtcbnZhciBTVEFUVVNfQ0xBU1NFUyA9IFtDTEFTU19BQ1RJVkUsIENMQVNTX1ZJU0lCTEUsIENMQVNTX1BSRVYsIENMQVNTX05FWFQsIENMQVNTX0xPQURJTkcsIENMQVNTX0ZPQ1VTX0lOLCBDTEFTU19PVkVSRkxPV107XG52YXIgQ0xBU1NFUyA9IHtcbiAgc2xpZGU6IENMQVNTX1NMSURFLFxuICBjbG9uZTogQ0xBU1NfQ0xPTkUsXG4gIGFycm93czogQ0xBU1NfQVJST1dTLFxuICBhcnJvdzogQ0xBU1NfQVJST1csXG4gIHByZXY6IENMQVNTX0FSUk9XX1BSRVYsXG4gIG5leHQ6IENMQVNTX0FSUk9XX05FWFQsXG4gIHBhZ2luYXRpb246IENMQVNTX1BBR0lOQVRJT04sXG4gIHBhZ2U6IENMQVNTX1BBR0lOQVRJT05fUEFHRSxcbiAgc3Bpbm5lcjogQ0xBU1NfU1BJTk5FUlxufTtcblxuZnVuY3Rpb24gY2xvc2VzdChmcm9tLCBzZWxlY3Rvcikge1xuICBpZiAoaXNGdW5jdGlvbihmcm9tLmNsb3Nlc3QpKSB7XG4gICAgcmV0dXJuIGZyb20uY2xvc2VzdChzZWxlY3Rvcik7XG4gIH1cblxuICB2YXIgZWxtID0gZnJvbTtcblxuICB3aGlsZSAoZWxtICYmIGVsbS5ub2RlVHlwZSA9PT0gMSkge1xuICAgIGlmIChtYXRjaGVzKGVsbSwgc2VsZWN0b3IpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBlbG0gPSBlbG0ucGFyZW50RWxlbWVudDtcbiAgfVxuXG4gIHJldHVybiBlbG07XG59XG5cbnZhciBGUklDVElPTiA9IDU7XG52YXIgTE9HX0lOVEVSVkFMID0gMjAwO1xudmFyIFBPSU5URVJfRE9XTl9FVkVOVFMgPSBcInRvdWNoc3RhcnQgbW91c2Vkb3duXCI7XG52YXIgUE9JTlRFUl9NT1ZFX0VWRU5UUyA9IFwidG91Y2htb3ZlIG1vdXNlbW92ZVwiO1xudmFyIFBPSU5URVJfVVBfRVZFTlRTID0gXCJ0b3VjaGVuZCB0b3VjaGNhbmNlbCBtb3VzZXVwIGNsaWNrXCI7XG5cbmZ1bmN0aW9uIEVsZW1lbnRzKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBfRXZlbnRJbnRlcmZhY2UgPSBFdmVudEludGVyZmFjZShTcGxpZGUyKSxcbiAgICAgIG9uID0gX0V2ZW50SW50ZXJmYWNlLm9uLFxuICAgICAgYmluZCA9IF9FdmVudEludGVyZmFjZS5iaW5kO1xuXG4gIHZhciByb290ID0gU3BsaWRlMi5yb290O1xuICB2YXIgaTE4biA9IG9wdGlvbnMuaTE4bjtcbiAgdmFyIGVsZW1lbnRzID0ge307XG4gIHZhciBzbGlkZXMgPSBbXTtcbiAgdmFyIHJvb3RDbGFzc2VzID0gW107XG4gIHZhciB0cmFja0NsYXNzZXMgPSBbXTtcbiAgdmFyIHRyYWNrO1xuICB2YXIgbGlzdDtcbiAgdmFyIGlzVXNpbmdLZXk7XG5cbiAgZnVuY3Rpb24gc2V0dXAoKSB7XG4gICAgY29sbGVjdCgpO1xuICAgIGluaXQoKTtcbiAgICB1cGRhdGUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIG9uKEVWRU5UX1JFRlJFU0gsIGRlc3Ryb3kpO1xuICAgIG9uKEVWRU5UX1JFRlJFU0gsIHNldHVwKTtcbiAgICBvbihFVkVOVF9VUERBVEVELCB1cGRhdGUpO1xuICAgIGJpbmQoZG9jdW1lbnQsIFBPSU5URVJfRE9XTl9FVkVOVFMgKyBcIiBrZXlkb3duXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpc1VzaW5nS2V5ID0gZS50eXBlID09PSBcImtleWRvd25cIjtcbiAgICB9LCB7XG4gICAgICBjYXB0dXJlOiB0cnVlXG4gICAgfSk7XG4gICAgYmluZChyb290LCBcImZvY3VzaW5cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgdG9nZ2xlQ2xhc3Mocm9vdCwgQ0xBU1NfRk9DVVNfSU4sICEhaXNVc2luZ0tleSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KGNvbXBsZXRlbHkpIHtcbiAgICB2YXIgYXR0cnMgPSBBTExfQVRUUklCVVRFUy5jb25jYXQoXCJzdHlsZVwiKTtcbiAgICBlbXB0eShzbGlkZXMpO1xuICAgIHJlbW92ZUNsYXNzKHJvb3QsIHJvb3RDbGFzc2VzKTtcbiAgICByZW1vdmVDbGFzcyh0cmFjaywgdHJhY2tDbGFzc2VzKTtcbiAgICByZW1vdmVBdHRyaWJ1dGUoW3RyYWNrLCBsaXN0XSwgYXR0cnMpO1xuICAgIHJlbW92ZUF0dHJpYnV0ZShyb290LCBjb21wbGV0ZWx5ID8gYXR0cnMgOiBbXCJzdHlsZVwiLCBBUklBX1JPTEVERVNDUklQVElPTl0pO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHJlbW92ZUNsYXNzKHJvb3QsIHJvb3RDbGFzc2VzKTtcbiAgICByZW1vdmVDbGFzcyh0cmFjaywgdHJhY2tDbGFzc2VzKTtcbiAgICByb290Q2xhc3NlcyA9IGdldENsYXNzZXMoQ0xBU1NfUk9PVCk7XG4gICAgdHJhY2tDbGFzc2VzID0gZ2V0Q2xhc3NlcyhDTEFTU19UUkFDSyk7XG4gICAgYWRkQ2xhc3Mocm9vdCwgcm9vdENsYXNzZXMpO1xuICAgIGFkZENsYXNzKHRyYWNrLCB0cmFja0NsYXNzZXMpO1xuICAgIHNldEF0dHJpYnV0ZShyb290LCBBUklBX0xBQkVMLCBvcHRpb25zLmxhYmVsKTtcbiAgICBzZXRBdHRyaWJ1dGUocm9vdCwgQVJJQV9MQUJFTExFREJZLCBvcHRpb25zLmxhYmVsbGVkYnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gY29sbGVjdCgpIHtcbiAgICB0cmFjayA9IGZpbmQoXCIuXCIgKyBDTEFTU19UUkFDSyk7XG4gICAgbGlzdCA9IGNoaWxkKHRyYWNrLCBcIi5cIiArIENMQVNTX0xJU1QpO1xuICAgIGFzc2VydCh0cmFjayAmJiBsaXN0LCBcIkEgdHJhY2svbGlzdCBlbGVtZW50IGlzIG1pc3NpbmcuXCIpO1xuICAgIHB1c2goc2xpZGVzLCBjaGlsZHJlbihsaXN0LCBcIi5cIiArIENMQVNTX1NMSURFICsgXCI6bm90KC5cIiArIENMQVNTX0NMT05FICsgXCIpXCIpKTtcbiAgICBmb3JPd24oe1xuICAgICAgYXJyb3dzOiBDTEFTU19BUlJPV1MsXG4gICAgICBwYWdpbmF0aW9uOiBDTEFTU19QQUdJTkFUSU9OLFxuICAgICAgcHJldjogQ0xBU1NfQVJST1dfUFJFVixcbiAgICAgIG5leHQ6IENMQVNTX0FSUk9XX05FWFQsXG4gICAgICBiYXI6IENMQVNTX1BST0dSRVNTX0JBUixcbiAgICAgIHRvZ2dsZTogQ0xBU1NfVE9HR0xFXG4gICAgfSwgZnVuY3Rpb24gKGNsYXNzTmFtZSwga2V5KSB7XG4gICAgICBlbGVtZW50c1trZXldID0gZmluZChcIi5cIiArIGNsYXNzTmFtZSk7XG4gICAgfSk7XG4gICAgYXNzaWduKGVsZW1lbnRzLCB7XG4gICAgICByb290OiByb290LFxuICAgICAgdHJhY2s6IHRyYWNrLFxuICAgICAgbGlzdDogbGlzdCxcbiAgICAgIHNsaWRlczogc2xpZGVzXG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBpZCA9IHJvb3QuaWQgfHwgdW5pcXVlSWQoUFJPSkVDVF9DT0RFKTtcbiAgICB2YXIgcm9sZSA9IG9wdGlvbnMucm9sZTtcbiAgICByb290LmlkID0gaWQ7XG4gICAgdHJhY2suaWQgPSB0cmFjay5pZCB8fCBpZCArIFwiLXRyYWNrXCI7XG4gICAgbGlzdC5pZCA9IGxpc3QuaWQgfHwgaWQgKyBcIi1saXN0XCI7XG5cbiAgICBpZiAoIWdldEF0dHJpYnV0ZShyb290LCBST0xFKSAmJiByb290LnRhZ05hbWUgIT09IFwiU0VDVElPTlwiICYmIHJvbGUpIHtcbiAgICAgIHNldEF0dHJpYnV0ZShyb290LCBST0xFLCByb2xlKTtcbiAgICB9XG5cbiAgICBzZXRBdHRyaWJ1dGUocm9vdCwgQVJJQV9ST0xFREVTQ1JJUFRJT04sIGkxOG4uY2Fyb3VzZWwpO1xuICAgIHNldEF0dHJpYnV0ZShsaXN0LCBST0xFLCBcInByZXNlbnRhdGlvblwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmQoc2VsZWN0b3IpIHtcbiAgICB2YXIgZWxtID0gcXVlcnkocm9vdCwgc2VsZWN0b3IpO1xuICAgIHJldHVybiBlbG0gJiYgY2xvc2VzdChlbG0sIFwiLlwiICsgQ0xBU1NfUk9PVCkgPT09IHJvb3QgPyBlbG0gOiB2b2lkIDA7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRDbGFzc2VzKGJhc2UpIHtcbiAgICByZXR1cm4gW2Jhc2UgKyBcIi0tXCIgKyBvcHRpb25zLnR5cGUsIGJhc2UgKyBcIi0tXCIgKyBvcHRpb25zLmRpcmVjdGlvbiwgb3B0aW9ucy5kcmFnICYmIGJhc2UgKyBcIi0tZHJhZ2dhYmxlXCIsIG9wdGlvbnMuaXNOYXZpZ2F0aW9uICYmIGJhc2UgKyBcIi0tbmF2XCIsIGJhc2UgPT09IENMQVNTX1JPT1QgJiYgQ0xBU1NfQUNUSVZFXTtcbiAgfVxuXG4gIHJldHVybiBhc3NpZ24oZWxlbWVudHMsIHtcbiAgICBzZXR1cDogc2V0dXAsXG4gICAgbW91bnQ6IG1vdW50LFxuICAgIGRlc3Ryb3k6IGRlc3Ryb3lcbiAgfSk7XG59XG5cbnZhciBTTElERSA9IFwic2xpZGVcIjtcbnZhciBMT09QID0gXCJsb29wXCI7XG52YXIgRkFERSA9IFwiZmFkZVwiO1xuXG5mdW5jdGlvbiBTbGlkZSQxKFNwbGlkZTIsIGluZGV4LCBzbGlkZUluZGV4LCBzbGlkZSkge1xuICB2YXIgZXZlbnQgPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgdmFyIG9uID0gZXZlbnQub24sXG4gICAgICBlbWl0ID0gZXZlbnQuZW1pdCxcbiAgICAgIGJpbmQgPSBldmVudC5iaW5kO1xuICB2YXIgQ29tcG9uZW50cyA9IFNwbGlkZTIuQ29tcG9uZW50cyxcbiAgICAgIHJvb3QgPSBTcGxpZGUyLnJvb3QsXG4gICAgICBvcHRpb25zID0gU3BsaWRlMi5vcHRpb25zO1xuICB2YXIgaXNOYXZpZ2F0aW9uID0gb3B0aW9ucy5pc05hdmlnYXRpb24sXG4gICAgICB1cGRhdGVPbk1vdmUgPSBvcHRpb25zLnVwZGF0ZU9uTW92ZSxcbiAgICAgIGkxOG4gPSBvcHRpb25zLmkxOG4sXG4gICAgICBwYWdpbmF0aW9uID0gb3B0aW9ucy5wYWdpbmF0aW9uLFxuICAgICAgc2xpZGVGb2N1cyA9IG9wdGlvbnMuc2xpZGVGb2N1cztcbiAgdmFyIHJlc29sdmUgPSBDb21wb25lbnRzLkRpcmVjdGlvbi5yZXNvbHZlO1xuICB2YXIgc3R5bGVzID0gZ2V0QXR0cmlidXRlKHNsaWRlLCBcInN0eWxlXCIpO1xuICB2YXIgbGFiZWwgPSBnZXRBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfTEFCRUwpO1xuICB2YXIgaXNDbG9uZSA9IHNsaWRlSW5kZXggPiAtMTtcbiAgdmFyIGNvbnRhaW5lciA9IGNoaWxkKHNsaWRlLCBcIi5cIiArIENMQVNTX0NPTlRBSU5FUik7XG4gIHZhciBkZXN0cm95ZWQ7XG5cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKCFpc0Nsb25lKSB7XG4gICAgICBzbGlkZS5pZCA9IHJvb3QuaWQgKyBcIi1zbGlkZVwiICsgcGFkKGluZGV4ICsgMSk7XG4gICAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIFJPTEUsIHBhZ2luYXRpb24gPyBcInRhYnBhbmVsXCIgOiBcImdyb3VwXCIpO1xuICAgICAgc2V0QXR0cmlidXRlKHNsaWRlLCBBUklBX1JPTEVERVNDUklQVElPTiwgaTE4bi5zbGlkZSk7XG4gICAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfTEFCRUwsIGxhYmVsIHx8IGZvcm1hdChpMThuLnNsaWRlTGFiZWwsIFtpbmRleCArIDEsIFNwbGlkZTIubGVuZ3RoXSkpO1xuICAgIH1cblxuICAgIGxpc3RlbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgIGJpbmQoc2xpZGUsIFwiY2xpY2tcIiwgYXBwbHkoZW1pdCwgRVZFTlRfQ0xJQ0ssIHNlbGYpKTtcbiAgICBiaW5kKHNsaWRlLCBcImtleWRvd25cIiwgYXBwbHkoZW1pdCwgRVZFTlRfU0xJREVfS0VZRE9XTiwgc2VsZikpO1xuICAgIG9uKFtFVkVOVF9NT1ZFRCwgRVZFTlRfU0hJRlRFRCwgRVZFTlRfU0NST0xMRURdLCB1cGRhdGUpO1xuICAgIG9uKEVWRU5UX05BVklHQVRJT05fTU9VTlRFRCwgaW5pdE5hdmlnYXRpb24pO1xuXG4gICAgaWYgKHVwZGF0ZU9uTW92ZSkge1xuICAgICAgb24oRVZFTlRfTU9WRSwgb25Nb3ZlKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGRlc3Ryb3llZCA9IHRydWU7XG4gICAgZXZlbnQuZGVzdHJveSgpO1xuICAgIHJlbW92ZUNsYXNzKHNsaWRlLCBTVEFUVVNfQ0xBU1NFUyk7XG4gICAgcmVtb3ZlQXR0cmlidXRlKHNsaWRlLCBBTExfQVRUUklCVVRFUyk7XG4gICAgc2V0QXR0cmlidXRlKHNsaWRlLCBcInN0eWxlXCIsIHN0eWxlcyk7XG4gICAgc2V0QXR0cmlidXRlKHNsaWRlLCBBUklBX0xBQkVMLCBsYWJlbCB8fCBcIlwiKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXROYXZpZ2F0aW9uKCkge1xuICAgIHZhciBjb250cm9scyA9IFNwbGlkZTIuc3BsaWRlcy5tYXAoZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgdmFyIFNsaWRlMiA9IHRhcmdldC5zcGxpZGUuQ29tcG9uZW50cy5TbGlkZXMuZ2V0QXQoaW5kZXgpO1xuICAgICAgcmV0dXJuIFNsaWRlMiA/IFNsaWRlMi5zbGlkZS5pZCA6IFwiXCI7XG4gICAgfSkuam9pbihcIiBcIik7XG4gICAgc2V0QXR0cmlidXRlKHNsaWRlLCBBUklBX0xBQkVMLCBmb3JtYXQoaTE4bi5zbGlkZVgsIChpc0Nsb25lID8gc2xpZGVJbmRleCA6IGluZGV4KSArIDEpKTtcbiAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfQ09OVFJPTFMsIGNvbnRyb2xzKTtcbiAgICBzZXRBdHRyaWJ1dGUoc2xpZGUsIFJPTEUsIHNsaWRlRm9jdXMgPyBcImJ1dHRvblwiIDogXCJcIik7XG4gICAgc2xpZGVGb2N1cyAmJiByZW1vdmVBdHRyaWJ1dGUoc2xpZGUsIEFSSUFfUk9MRURFU0NSSVBUSU9OKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTW92ZSgpIHtcbiAgICBpZiAoIWRlc3Ryb3llZCkge1xuICAgICAgdXBkYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGlmICghZGVzdHJveWVkKSB7XG4gICAgICB2YXIgY3VyciA9IFNwbGlkZTIuaW5kZXg7XG4gICAgICB1cGRhdGVBY3Rpdml0eSgpO1xuICAgICAgdXBkYXRlVmlzaWJpbGl0eSgpO1xuICAgICAgdG9nZ2xlQ2xhc3Moc2xpZGUsIENMQVNTX1BSRVYsIGluZGV4ID09PSBjdXJyIC0gMSk7XG4gICAgICB0b2dnbGVDbGFzcyhzbGlkZSwgQ0xBU1NfTkVYVCwgaW5kZXggPT09IGN1cnIgKyAxKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVBY3Rpdml0eSgpIHtcbiAgICB2YXIgYWN0aXZlID0gaXNBY3RpdmUoKTtcblxuICAgIGlmIChhY3RpdmUgIT09IGhhc0NsYXNzKHNsaWRlLCBDTEFTU19BQ1RJVkUpKSB7XG4gICAgICB0b2dnbGVDbGFzcyhzbGlkZSwgQ0xBU1NfQUNUSVZFLCBhY3RpdmUpO1xuICAgICAgc2V0QXR0cmlidXRlKHNsaWRlLCBBUklBX0NVUlJFTlQsIGlzTmF2aWdhdGlvbiAmJiBhY3RpdmUgfHwgXCJcIik7XG4gICAgICBlbWl0KGFjdGl2ZSA/IEVWRU5UX0FDVElWRSA6IEVWRU5UX0lOQUNUSVZFLCBzZWxmKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVWaXNpYmlsaXR5KCkge1xuICAgIHZhciB2aXNpYmxlID0gaXNWaXNpYmxlKCk7XG4gICAgdmFyIGhpZGRlbiA9ICF2aXNpYmxlICYmICghaXNBY3RpdmUoKSB8fCBpc0Nsb25lKTtcblxuICAgIGlmICghU3BsaWRlMi5zdGF0ZS5pcyhbTU9WSU5HLCBTQ1JPTExJTkddKSkge1xuICAgICAgc2V0QXR0cmlidXRlKHNsaWRlLCBBUklBX0hJRERFTiwgaGlkZGVuIHx8IFwiXCIpO1xuICAgIH1cblxuICAgIHNldEF0dHJpYnV0ZShxdWVyeUFsbChzbGlkZSwgb3B0aW9ucy5mb2N1c2FibGVOb2RlcyB8fCBcIlwiKSwgVEFCX0lOREVYLCBoaWRkZW4gPyAtMSA6IFwiXCIpO1xuXG4gICAgaWYgKHNsaWRlRm9jdXMpIHtcbiAgICAgIHNldEF0dHJpYnV0ZShzbGlkZSwgVEFCX0lOREVYLCBoaWRkZW4gPyAtMSA6IDApO1xuICAgIH1cblxuICAgIGlmICh2aXNpYmxlICE9PSBoYXNDbGFzcyhzbGlkZSwgQ0xBU1NfVklTSUJMRSkpIHtcbiAgICAgIHRvZ2dsZUNsYXNzKHNsaWRlLCBDTEFTU19WSVNJQkxFLCB2aXNpYmxlKTtcbiAgICAgIGVtaXQodmlzaWJsZSA/IEVWRU5UX1ZJU0lCTEUgOiBFVkVOVF9ISURERU4sIHNlbGYpO1xuICAgIH1cblxuICAgIGlmICghdmlzaWJsZSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBzbGlkZSkge1xuICAgICAgdmFyIFNsaWRlMiA9IENvbXBvbmVudHMuU2xpZGVzLmdldEF0KFNwbGlkZTIuaW5kZXgpO1xuICAgICAgU2xpZGUyICYmIGZvY3VzKFNsaWRlMi5zbGlkZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc3R5bGUkMShwcm9wLCB2YWx1ZSwgdXNlQ29udGFpbmVyKSB7XG4gICAgc3R5bGUodXNlQ29udGFpbmVyICYmIGNvbnRhaW5lciB8fCBzbGlkZSwgcHJvcCwgdmFsdWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNBY3RpdmUoKSB7XG4gICAgdmFyIGN1cnIgPSBTcGxpZGUyLmluZGV4O1xuICAgIHJldHVybiBjdXJyID09PSBpbmRleCB8fCBvcHRpb25zLmNsb25lU3RhdHVzICYmIGN1cnIgPT09IHNsaWRlSW5kZXg7XG4gIH1cblxuICBmdW5jdGlvbiBpc1Zpc2libGUoKSB7XG4gICAgaWYgKFNwbGlkZTIuaXMoRkFERSkpIHtcbiAgICAgIHJldHVybiBpc0FjdGl2ZSgpO1xuICAgIH1cblxuICAgIHZhciB0cmFja1JlY3QgPSByZWN0KENvbXBvbmVudHMuRWxlbWVudHMudHJhY2spO1xuICAgIHZhciBzbGlkZVJlY3QgPSByZWN0KHNsaWRlKTtcbiAgICB2YXIgbGVmdCA9IHJlc29sdmUoXCJsZWZ0XCIsIHRydWUpO1xuICAgIHZhciByaWdodCA9IHJlc29sdmUoXCJyaWdodFwiLCB0cnVlKTtcbiAgICByZXR1cm4gZmxvb3IodHJhY2tSZWN0W2xlZnRdKSA8PSBjZWlsKHNsaWRlUmVjdFtsZWZ0XSkgJiYgZmxvb3Ioc2xpZGVSZWN0W3JpZ2h0XSkgPD0gY2VpbCh0cmFja1JlY3RbcmlnaHRdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzV2l0aGluKGZyb20sIGRpc3RhbmNlKSB7XG4gICAgdmFyIGRpZmYgPSBhYnMoZnJvbSAtIGluZGV4KTtcblxuICAgIGlmICghaXNDbG9uZSAmJiAob3B0aW9ucy5yZXdpbmQgfHwgU3BsaWRlMi5pcyhMT09QKSkpIHtcbiAgICAgIGRpZmYgPSBtaW4oZGlmZiwgU3BsaWRlMi5sZW5ndGggLSBkaWZmKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlmZiA8PSBkaXN0YW5jZTtcbiAgfVxuXG4gIHZhciBzZWxmID0ge1xuICAgIGluZGV4OiBpbmRleCxcbiAgICBzbGlkZUluZGV4OiBzbGlkZUluZGV4LFxuICAgIHNsaWRlOiBzbGlkZSxcbiAgICBjb250YWluZXI6IGNvbnRhaW5lcixcbiAgICBpc0Nsb25lOiBpc0Nsb25lLFxuICAgIG1vdW50OiBtb3VudCxcbiAgICBkZXN0cm95OiBkZXN0cm95LFxuICAgIHVwZGF0ZTogdXBkYXRlLFxuICAgIHN0eWxlOiBzdHlsZSQxLFxuICAgIGlzV2l0aGluOiBpc1dpdGhpblxuICB9O1xuICByZXR1cm4gc2VsZjtcbn1cblxuZnVuY3Rpb24gU2xpZGVzKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBfRXZlbnRJbnRlcmZhY2UyID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMiksXG4gICAgICBvbiA9IF9FdmVudEludGVyZmFjZTIub24sXG4gICAgICBlbWl0ID0gX0V2ZW50SW50ZXJmYWNlMi5lbWl0LFxuICAgICAgYmluZCA9IF9FdmVudEludGVyZmFjZTIuYmluZDtcblxuICB2YXIgX0NvbXBvbmVudHMyJEVsZW1lbnRzID0gQ29tcG9uZW50czIuRWxlbWVudHMsXG4gICAgICBzbGlkZXMgPSBfQ29tcG9uZW50czIkRWxlbWVudHMuc2xpZGVzLFxuICAgICAgbGlzdCA9IF9Db21wb25lbnRzMiRFbGVtZW50cy5saXN0O1xuICB2YXIgU2xpZGVzMiA9IFtdO1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9SRUZSRVNILCBkZXN0cm95KTtcbiAgICBvbihFVkVOVF9SRUZSRVNILCBpbml0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc2xpZGVzLmZvckVhY2goZnVuY3Rpb24gKHNsaWRlLCBpbmRleCkge1xuICAgICAgcmVnaXN0ZXIoc2xpZGUsIGluZGV4LCAtMSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGZvckVhY2gkMShmdW5jdGlvbiAoU2xpZGUyKSB7XG4gICAgICBTbGlkZTIuZGVzdHJveSgpO1xuICAgIH0pO1xuICAgIGVtcHR5KFNsaWRlczIpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIGZvckVhY2gkMShmdW5jdGlvbiAoU2xpZGUyKSB7XG4gICAgICBTbGlkZTIudXBkYXRlKCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlcihzbGlkZSwgaW5kZXgsIHNsaWRlSW5kZXgpIHtcbiAgICB2YXIgb2JqZWN0ID0gU2xpZGUkMShTcGxpZGUyLCBpbmRleCwgc2xpZGVJbmRleCwgc2xpZGUpO1xuICAgIG9iamVjdC5tb3VudCgpO1xuICAgIFNsaWRlczIucHVzaChvYmplY3QpO1xuICAgIFNsaWRlczIuc29ydChmdW5jdGlvbiAoU2xpZGUxLCBTbGlkZTIpIHtcbiAgICAgIHJldHVybiBTbGlkZTEuaW5kZXggLSBTbGlkZTIuaW5kZXg7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXQoZXhjbHVkZUNsb25lcykge1xuICAgIHJldHVybiBleGNsdWRlQ2xvbmVzID8gZmlsdGVyKGZ1bmN0aW9uIChTbGlkZTIpIHtcbiAgICAgIHJldHVybiAhU2xpZGUyLmlzQ2xvbmU7XG4gICAgfSkgOiBTbGlkZXMyO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SW4ocGFnZSkge1xuICAgIHZhciBDb250cm9sbGVyID0gQ29tcG9uZW50czIuQ29udHJvbGxlcjtcbiAgICB2YXIgaW5kZXggPSBDb250cm9sbGVyLnRvSW5kZXgocGFnZSk7XG4gICAgdmFyIG1heCA9IENvbnRyb2xsZXIuaGFzRm9jdXMoKSA/IDEgOiBvcHRpb25zLnBlclBhZ2U7XG4gICAgcmV0dXJuIGZpbHRlcihmdW5jdGlvbiAoU2xpZGUyKSB7XG4gICAgICByZXR1cm4gYmV0d2VlbihTbGlkZTIuaW5kZXgsIGluZGV4LCBpbmRleCArIG1heCAtIDEpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QXQoaW5kZXgpIHtcbiAgICByZXR1cm4gZmlsdGVyKGluZGV4KVswXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZChpdGVtcywgaW5kZXgpIHtcbiAgICBmb3JFYWNoKGl0ZW1zLCBmdW5jdGlvbiAoc2xpZGUpIHtcbiAgICAgIGlmIChpc1N0cmluZyhzbGlkZSkpIHtcbiAgICAgICAgc2xpZGUgPSBwYXJzZUh0bWwoc2xpZGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAoaXNIVE1MRWxlbWVudChzbGlkZSkpIHtcbiAgICAgICAgdmFyIHJlZiA9IHNsaWRlc1tpbmRleF07XG4gICAgICAgIHJlZiA/IGJlZm9yZShzbGlkZSwgcmVmKSA6IGFwcGVuZChsaXN0LCBzbGlkZSk7XG4gICAgICAgIGFkZENsYXNzKHNsaWRlLCBvcHRpb25zLmNsYXNzZXMuc2xpZGUpO1xuICAgICAgICBvYnNlcnZlSW1hZ2VzKHNsaWRlLCBhcHBseShlbWl0LCBFVkVOVF9SRVNJWkUpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBlbWl0KEVWRU5UX1JFRlJFU0gpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlJDEobWF0Y2hlcikge1xuICAgIHJlbW92ZShmaWx0ZXIobWF0Y2hlcikubWFwKGZ1bmN0aW9uIChTbGlkZTIpIHtcbiAgICAgIHJldHVybiBTbGlkZTIuc2xpZGU7XG4gICAgfSkpO1xuICAgIGVtaXQoRVZFTlRfUkVGUkVTSCk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JFYWNoJDEoaXRlcmF0ZWUsIGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICBnZXQoZXhjbHVkZUNsb25lcykuZm9yRWFjaChpdGVyYXRlZSk7XG4gIH1cblxuICBmdW5jdGlvbiBmaWx0ZXIobWF0Y2hlcikge1xuICAgIHJldHVybiBTbGlkZXMyLmZpbHRlcihpc0Z1bmN0aW9uKG1hdGNoZXIpID8gbWF0Y2hlciA6IGZ1bmN0aW9uIChTbGlkZTIpIHtcbiAgICAgIHJldHVybiBpc1N0cmluZyhtYXRjaGVyKSA/IG1hdGNoZXMoU2xpZGUyLnNsaWRlLCBtYXRjaGVyKSA6IGluY2x1ZGVzKHRvQXJyYXkobWF0Y2hlciksIFNsaWRlMi5pbmRleCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBzdHlsZShwcm9wLCB2YWx1ZSwgdXNlQ29udGFpbmVyKSB7XG4gICAgZm9yRWFjaCQxKGZ1bmN0aW9uIChTbGlkZTIpIHtcbiAgICAgIFNsaWRlMi5zdHlsZShwcm9wLCB2YWx1ZSwgdXNlQ29udGFpbmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9ic2VydmVJbWFnZXMoZWxtLCBjYWxsYmFjaykge1xuICAgIHZhciBpbWFnZXMgPSBxdWVyeUFsbChlbG0sIFwiaW1nXCIpO1xuICAgIHZhciBsZW5ndGggPSBpbWFnZXMubGVuZ3RoO1xuXG4gICAgaWYgKGxlbmd0aCkge1xuICAgICAgaW1hZ2VzLmZvckVhY2goZnVuY3Rpb24gKGltZykge1xuICAgICAgICBiaW5kKGltZywgXCJsb2FkIGVycm9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoISAtLWxlbmd0aCkge1xuICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ2V0TGVuZ3RoKGV4Y2x1ZGVDbG9uZXMpIHtcbiAgICByZXR1cm4gZXhjbHVkZUNsb25lcyA/IHNsaWRlcy5sZW5ndGggOiBTbGlkZXMyLmxlbmd0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRW5vdWdoKCkge1xuICAgIHJldHVybiBTbGlkZXMyLmxlbmd0aCA+IG9wdGlvbnMucGVyUGFnZTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1vdW50LFxuICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgdXBkYXRlOiB1cGRhdGUsXG4gICAgcmVnaXN0ZXI6IHJlZ2lzdGVyLFxuICAgIGdldDogZ2V0LFxuICAgIGdldEluOiBnZXRJbixcbiAgICBnZXRBdDogZ2V0QXQsXG4gICAgYWRkOiBhZGQsXG4gICAgcmVtb3ZlOiByZW1vdmUkMSxcbiAgICBmb3JFYWNoOiBmb3JFYWNoJDEsXG4gICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgc3R5bGU6IHN0eWxlLFxuICAgIGdldExlbmd0aDogZ2V0TGVuZ3RoLFxuICAgIGlzRW5vdWdoOiBpc0Vub3VnaFxuICB9O1xufVxuXG5mdW5jdGlvbiBMYXlvdXQoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgdmFyIF9FdmVudEludGVyZmFjZTMgPSBFdmVudEludGVyZmFjZShTcGxpZGUyKSxcbiAgICAgIG9uID0gX0V2ZW50SW50ZXJmYWNlMy5vbixcbiAgICAgIGJpbmQgPSBfRXZlbnRJbnRlcmZhY2UzLmJpbmQsXG4gICAgICBlbWl0ID0gX0V2ZW50SW50ZXJmYWNlMy5lbWl0O1xuXG4gIHZhciBTbGlkZXMgPSBDb21wb25lbnRzMi5TbGlkZXM7XG4gIHZhciByZXNvbHZlID0gQ29tcG9uZW50czIuRGlyZWN0aW9uLnJlc29sdmU7XG4gIHZhciBfQ29tcG9uZW50czIkRWxlbWVudHMyID0gQ29tcG9uZW50czIuRWxlbWVudHMsXG4gICAgICByb290ID0gX0NvbXBvbmVudHMyJEVsZW1lbnRzMi5yb290LFxuICAgICAgdHJhY2sgPSBfQ29tcG9uZW50czIkRWxlbWVudHMyLnRyYWNrLFxuICAgICAgbGlzdCA9IF9Db21wb25lbnRzMiRFbGVtZW50czIubGlzdDtcbiAgdmFyIGdldEF0ID0gU2xpZGVzLmdldEF0LFxuICAgICAgc3R5bGVTbGlkZXMgPSBTbGlkZXMuc3R5bGU7XG4gIHZhciB2ZXJ0aWNhbDtcbiAgdmFyIHJvb3RSZWN0O1xuICB2YXIgb3ZlcmZsb3c7XG5cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaW5pdCgpO1xuICAgIGJpbmQod2luZG93LCBcInJlc2l6ZSBsb2FkXCIsIFRocm90dGxlKGFwcGx5KGVtaXQsIEVWRU5UX1JFU0laRSkpKTtcbiAgICBvbihbRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVGUkVTSF0sIGluaXQpO1xuICAgIG9uKEVWRU5UX1JFU0laRSwgcmVzaXplKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmVydGljYWwgPSBvcHRpb25zLmRpcmVjdGlvbiA9PT0gVFRCO1xuICAgIHN0eWxlKHJvb3QsIFwibWF4V2lkdGhcIiwgdW5pdChvcHRpb25zLndpZHRoKSk7XG4gICAgc3R5bGUodHJhY2ssIHJlc29sdmUoXCJwYWRkaW5nTGVmdFwiKSwgY3NzUGFkZGluZyhmYWxzZSkpO1xuICAgIHN0eWxlKHRyYWNrLCByZXNvbHZlKFwicGFkZGluZ1JpZ2h0XCIpLCBjc3NQYWRkaW5nKHRydWUpKTtcbiAgICByZXNpemUodHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNpemUoZm9yY2UpIHtcbiAgICB2YXIgbmV3UmVjdCA9IHJlY3Qocm9vdCk7XG5cbiAgICBpZiAoZm9yY2UgfHwgcm9vdFJlY3Qud2lkdGggIT09IG5ld1JlY3Qud2lkdGggfHwgcm9vdFJlY3QuaGVpZ2h0ICE9PSBuZXdSZWN0LmhlaWdodCkge1xuICAgICAgc3R5bGUodHJhY2ssIFwiaGVpZ2h0XCIsIGNzc1RyYWNrSGVpZ2h0KCkpO1xuICAgICAgc3R5bGVTbGlkZXMocmVzb2x2ZShcIm1hcmdpblJpZ2h0XCIpLCB1bml0KG9wdGlvbnMuZ2FwKSk7XG4gICAgICBzdHlsZVNsaWRlcyhcIndpZHRoXCIsIGNzc1NsaWRlV2lkdGgoKSk7XG4gICAgICBzdHlsZVNsaWRlcyhcImhlaWdodFwiLCBjc3NTbGlkZUhlaWdodCgpLCB0cnVlKTtcbiAgICAgIHJvb3RSZWN0ID0gbmV3UmVjdDtcbiAgICAgIGVtaXQoRVZFTlRfUkVTSVpFRCk7XG5cbiAgICAgIGlmIChvdmVyZmxvdyAhPT0gKG92ZXJmbG93ID0gaXNPdmVyZmxvdygpKSkge1xuICAgICAgICB0b2dnbGVDbGFzcyhyb290LCBDTEFTU19PVkVSRkxPVywgb3ZlcmZsb3cpO1xuICAgICAgICBlbWl0KEVWRU5UX09WRVJGTE9XLCBvdmVyZmxvdyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY3NzUGFkZGluZyhyaWdodCkge1xuICAgIHZhciBwYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nO1xuICAgIHZhciBwcm9wID0gcmVzb2x2ZShyaWdodCA/IFwicmlnaHRcIiA6IFwibGVmdFwiKTtcbiAgICByZXR1cm4gcGFkZGluZyAmJiB1bml0KHBhZGRpbmdbcHJvcF0gfHwgKGlzT2JqZWN0KHBhZGRpbmcpID8gMCA6IHBhZGRpbmcpKSB8fCBcIjBweFwiO1xuICB9XG5cbiAgZnVuY3Rpb24gY3NzVHJhY2tIZWlnaHQoKSB7XG4gICAgdmFyIGhlaWdodCA9IFwiXCI7XG5cbiAgICBpZiAodmVydGljYWwpIHtcbiAgICAgIGhlaWdodCA9IGNzc0hlaWdodCgpO1xuICAgICAgYXNzZXJ0KGhlaWdodCwgXCJoZWlnaHQgb3IgaGVpZ2h0UmF0aW8gaXMgbWlzc2luZy5cIik7XG4gICAgICBoZWlnaHQgPSBcImNhbGMoXCIgKyBoZWlnaHQgKyBcIiAtIFwiICsgY3NzUGFkZGluZyhmYWxzZSkgKyBcIiAtIFwiICsgY3NzUGFkZGluZyh0cnVlKSArIFwiKVwiO1xuICAgIH1cblxuICAgIHJldHVybiBoZWlnaHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjc3NIZWlnaHQoKSB7XG4gICAgcmV0dXJuIHVuaXQob3B0aW9ucy5oZWlnaHQgfHwgcmVjdChsaXN0KS53aWR0aCAqIG9wdGlvbnMuaGVpZ2h0UmF0aW8pO1xuICB9XG5cbiAgZnVuY3Rpb24gY3NzU2xpZGVXaWR0aCgpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5hdXRvV2lkdGggPyBudWxsIDogdW5pdChvcHRpb25zLmZpeGVkV2lkdGgpIHx8ICh2ZXJ0aWNhbCA/IFwiXCIgOiBjc3NTbGlkZVNpemUoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjc3NTbGlkZUhlaWdodCgpIHtcbiAgICByZXR1cm4gdW5pdChvcHRpb25zLmZpeGVkSGVpZ2h0KSB8fCAodmVydGljYWwgPyBvcHRpb25zLmF1dG9IZWlnaHQgPyBudWxsIDogY3NzU2xpZGVTaXplKCkgOiBjc3NIZWlnaHQoKSk7XG4gIH1cblxuICBmdW5jdGlvbiBjc3NTbGlkZVNpemUoKSB7XG4gICAgdmFyIGdhcCA9IHVuaXQob3B0aW9ucy5nYXApO1xuICAgIHJldHVybiBcImNhbGMoKDEwMCVcIiArIChnYXAgJiYgXCIgKyBcIiArIGdhcCkgKyBcIikvXCIgKyAob3B0aW9ucy5wZXJQYWdlIHx8IDEpICsgKGdhcCAmJiBcIiAtIFwiICsgZ2FwKSArIFwiKVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gbGlzdFNpemUoKSB7XG4gICAgcmV0dXJuIHJlY3QobGlzdClbcmVzb2x2ZShcIndpZHRoXCIpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNsaWRlU2l6ZShpbmRleCwgd2l0aG91dEdhcCkge1xuICAgIHZhciBTbGlkZSA9IGdldEF0KGluZGV4IHx8IDApO1xuICAgIHJldHVybiBTbGlkZSA/IHJlY3QoU2xpZGUuc2xpZGUpW3Jlc29sdmUoXCJ3aWR0aFwiKV0gKyAod2l0aG91dEdhcCA/IDAgOiBnZXRHYXAoKSkgOiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gdG90YWxTaXplKGluZGV4LCB3aXRob3V0R2FwKSB7XG4gICAgdmFyIFNsaWRlID0gZ2V0QXQoaW5kZXgpO1xuXG4gICAgaWYgKFNsaWRlKSB7XG4gICAgICB2YXIgcmlnaHQgPSByZWN0KFNsaWRlLnNsaWRlKVtyZXNvbHZlKFwicmlnaHRcIildO1xuICAgICAgdmFyIGxlZnQgPSByZWN0KGxpc3QpW3Jlc29sdmUoXCJsZWZ0XCIpXTtcbiAgICAgIHJldHVybiBhYnMocmlnaHQgLSBsZWZ0KSArICh3aXRob3V0R2FwID8gMCA6IGdldEdhcCgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNsaWRlclNpemUod2l0aG91dEdhcCkge1xuICAgIHJldHVybiB0b3RhbFNpemUoU3BsaWRlMi5sZW5ndGggLSAxKSAtIHRvdGFsU2l6ZSgwKSArIHNsaWRlU2l6ZSgwLCB3aXRob3V0R2FwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEdhcCgpIHtcbiAgICB2YXIgU2xpZGUgPSBnZXRBdCgwKTtcbiAgICByZXR1cm4gU2xpZGUgJiYgcGFyc2VGbG9hdChzdHlsZShTbGlkZS5zbGlkZSwgcmVzb2x2ZShcIm1hcmdpblJpZ2h0XCIpKSkgfHwgMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFBhZGRpbmcocmlnaHQpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChzdHlsZSh0cmFjaywgcmVzb2x2ZShcInBhZGRpbmdcIiArIChyaWdodCA/IFwiUmlnaHRcIiA6IFwiTGVmdFwiKSkpKSB8fCAwO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNPdmVyZmxvdygpIHtcbiAgICByZXR1cm4gU3BsaWRlMi5pcyhGQURFKSB8fCBzbGlkZXJTaXplKHRydWUpID4gbGlzdFNpemUoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1vdW50LFxuICAgIHJlc2l6ZTogcmVzaXplLFxuICAgIGxpc3RTaXplOiBsaXN0U2l6ZSxcbiAgICBzbGlkZVNpemU6IHNsaWRlU2l6ZSxcbiAgICBzbGlkZXJTaXplOiBzbGlkZXJTaXplLFxuICAgIHRvdGFsU2l6ZTogdG90YWxTaXplLFxuICAgIGdldFBhZGRpbmc6IGdldFBhZGRpbmcsXG4gICAgaXNPdmVyZmxvdzogaXNPdmVyZmxvd1xuICB9O1xufVxuXG52YXIgTVVMVElQTElFUiA9IDI7XG5cbmZ1bmN0aW9uIENsb25lcyhTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICB2YXIgZXZlbnQgPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgdmFyIG9uID0gZXZlbnQub247XG4gIHZhciBFbGVtZW50cyA9IENvbXBvbmVudHMyLkVsZW1lbnRzLFxuICAgICAgU2xpZGVzID0gQ29tcG9uZW50czIuU2xpZGVzO1xuICB2YXIgcmVzb2x2ZSA9IENvbXBvbmVudHMyLkRpcmVjdGlvbi5yZXNvbHZlO1xuICB2YXIgY2xvbmVzID0gW107XG4gIHZhciBjbG9uZUNvdW50O1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIG9uKEVWRU5UX1JFRlJFU0gsIHJlbW91bnQpO1xuICAgIG9uKFtFVkVOVF9VUERBVEVELCBFVkVOVF9SRVNJWkVdLCBvYnNlcnZlKTtcblxuICAgIGlmIChjbG9uZUNvdW50ID0gY29tcHV0ZUNsb25lQ291bnQoKSkge1xuICAgICAgZ2VuZXJhdGUoY2xvbmVDb3VudCk7XG4gICAgICBDb21wb25lbnRzMi5MYXlvdXQucmVzaXplKHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbW91bnQoKSB7XG4gICAgZGVzdHJveSgpO1xuICAgIG1vdW50KCk7XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIHJlbW92ZShjbG9uZXMpO1xuICAgIGVtcHR5KGNsb25lcyk7XG4gICAgZXZlbnQuZGVzdHJveSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gb2JzZXJ2ZSgpIHtcbiAgICB2YXIgY291bnQgPSBjb21wdXRlQ2xvbmVDb3VudCgpO1xuXG4gICAgaWYgKGNsb25lQ291bnQgIT09IGNvdW50KSB7XG4gICAgICBpZiAoY2xvbmVDb3VudCA8IGNvdW50IHx8ICFjb3VudCkge1xuICAgICAgICBldmVudC5lbWl0KEVWRU5UX1JFRlJFU0gpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdlbmVyYXRlKGNvdW50KSB7XG4gICAgdmFyIHNsaWRlcyA9IFNsaWRlcy5nZXQoKS5zbGljZSgpO1xuICAgIHZhciBsZW5ndGggPSBzbGlkZXMubGVuZ3RoO1xuXG4gICAgaWYgKGxlbmd0aCkge1xuICAgICAgd2hpbGUgKHNsaWRlcy5sZW5ndGggPCBjb3VudCkge1xuICAgICAgICBwdXNoKHNsaWRlcywgc2xpZGVzKTtcbiAgICAgIH1cblxuICAgICAgcHVzaChzbGlkZXMuc2xpY2UoLWNvdW50KSwgc2xpZGVzLnNsaWNlKDAsIGNvdW50KSkuZm9yRWFjaChmdW5jdGlvbiAoU2xpZGUsIGluZGV4KSB7XG4gICAgICAgIHZhciBpc0hlYWQgPSBpbmRleCA8IGNvdW50O1xuICAgICAgICB2YXIgY2xvbmUgPSBjbG9uZURlZXAoU2xpZGUuc2xpZGUsIGluZGV4KTtcbiAgICAgICAgaXNIZWFkID8gYmVmb3JlKGNsb25lLCBzbGlkZXNbMF0uc2xpZGUpIDogYXBwZW5kKEVsZW1lbnRzLmxpc3QsIGNsb25lKTtcbiAgICAgICAgcHVzaChjbG9uZXMsIGNsb25lKTtcbiAgICAgICAgU2xpZGVzLnJlZ2lzdGVyKGNsb25lLCBpbmRleCAtIGNvdW50ICsgKGlzSGVhZCA/IDAgOiBsZW5ndGgpLCBTbGlkZS5pbmRleCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjbG9uZURlZXAoZWxtLCBpbmRleCkge1xuICAgIHZhciBjbG9uZSA9IGVsbS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgYWRkQ2xhc3MoY2xvbmUsIG9wdGlvbnMuY2xhc3Nlcy5jbG9uZSk7XG4gICAgY2xvbmUuaWQgPSBTcGxpZGUyLnJvb3QuaWQgKyBcIi1jbG9uZVwiICsgcGFkKGluZGV4ICsgMSk7XG4gICAgcmV0dXJuIGNsb25lO1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcHV0ZUNsb25lQ291bnQoKSB7XG4gICAgdmFyIGNsb25lczIgPSBvcHRpb25zLmNsb25lcztcblxuICAgIGlmICghU3BsaWRlMi5pcyhMT09QKSkge1xuICAgICAgY2xvbmVzMiA9IDA7XG4gICAgfSBlbHNlIGlmIChpc1VuZGVmaW5lZChjbG9uZXMyKSkge1xuICAgICAgdmFyIGZpeGVkU2l6ZSA9IG9wdGlvbnNbcmVzb2x2ZShcImZpeGVkV2lkdGhcIildICYmIENvbXBvbmVudHMyLkxheW91dC5zbGlkZVNpemUoMCk7XG4gICAgICB2YXIgZml4ZWRDb3VudCA9IGZpeGVkU2l6ZSAmJiBjZWlsKHJlY3QoRWxlbWVudHMudHJhY2spW3Jlc29sdmUoXCJ3aWR0aFwiKV0gLyBmaXhlZFNpemUpO1xuICAgICAgY2xvbmVzMiA9IGZpeGVkQ291bnQgfHwgb3B0aW9uc1tyZXNvbHZlKFwiYXV0b1dpZHRoXCIpXSAmJiBTcGxpZGUyLmxlbmd0aCB8fCBvcHRpb25zLnBlclBhZ2UgKiBNVUxUSVBMSUVSO1xuICAgIH1cblxuICAgIHJldHVybiBjbG9uZXMyO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbW91bnQsXG4gICAgZGVzdHJveTogZGVzdHJveVxuICB9O1xufVxuXG5mdW5jdGlvbiBNb3ZlKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBfRXZlbnRJbnRlcmZhY2U0ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMiksXG4gICAgICBvbiA9IF9FdmVudEludGVyZmFjZTQub24sXG4gICAgICBlbWl0ID0gX0V2ZW50SW50ZXJmYWNlNC5lbWl0O1xuXG4gIHZhciBzZXQgPSBTcGxpZGUyLnN0YXRlLnNldDtcbiAgdmFyIF9Db21wb25lbnRzMiRMYXlvdXQgPSBDb21wb25lbnRzMi5MYXlvdXQsXG4gICAgICBzbGlkZVNpemUgPSBfQ29tcG9uZW50czIkTGF5b3V0LnNsaWRlU2l6ZSxcbiAgICAgIGdldFBhZGRpbmcgPSBfQ29tcG9uZW50czIkTGF5b3V0LmdldFBhZGRpbmcsXG4gICAgICB0b3RhbFNpemUgPSBfQ29tcG9uZW50czIkTGF5b3V0LnRvdGFsU2l6ZSxcbiAgICAgIGxpc3RTaXplID0gX0NvbXBvbmVudHMyJExheW91dC5saXN0U2l6ZSxcbiAgICAgIHNsaWRlclNpemUgPSBfQ29tcG9uZW50czIkTGF5b3V0LnNsaWRlclNpemU7XG4gIHZhciBfQ29tcG9uZW50czIkRGlyZWN0aW8gPSBDb21wb25lbnRzMi5EaXJlY3Rpb24sXG4gICAgICByZXNvbHZlID0gX0NvbXBvbmVudHMyJERpcmVjdGlvLnJlc29sdmUsXG4gICAgICBvcmllbnQgPSBfQ29tcG9uZW50czIkRGlyZWN0aW8ub3JpZW50O1xuICB2YXIgX0NvbXBvbmVudHMyJEVsZW1lbnRzMyA9IENvbXBvbmVudHMyLkVsZW1lbnRzLFxuICAgICAgbGlzdCA9IF9Db21wb25lbnRzMiRFbGVtZW50czMubGlzdCxcbiAgICAgIHRyYWNrID0gX0NvbXBvbmVudHMyJEVsZW1lbnRzMy50cmFjaztcbiAgdmFyIFRyYW5zaXRpb247XG5cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgVHJhbnNpdGlvbiA9IENvbXBvbmVudHMyLlRyYW5zaXRpb247XG4gICAgb24oW0VWRU5UX01PVU5URUQsIEVWRU5UX1JFU0laRUQsIEVWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCByZXBvc2l0aW9uKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcG9zaXRpb24oKSB7XG4gICAgaWYgKCFDb21wb25lbnRzMi5Db250cm9sbGVyLmlzQnVzeSgpKSB7XG4gICAgICBDb21wb25lbnRzMi5TY3JvbGwuY2FuY2VsKCk7XG4gICAgICBqdW1wKFNwbGlkZTIuaW5kZXgpO1xuICAgICAgQ29tcG9uZW50czIuU2xpZGVzLnVwZGF0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdmUoZGVzdCwgaW5kZXgsIHByZXYsIGNhbGxiYWNrKSB7XG4gICAgaWYgKGRlc3QgIT09IGluZGV4ICYmIGNhblNoaWZ0KGRlc3QgPiBwcmV2KSkge1xuICAgICAgY2FuY2VsKCk7XG4gICAgICB0cmFuc2xhdGUoc2hpZnQoZ2V0UG9zaXRpb24oKSwgZGVzdCA+IHByZXYpLCB0cnVlKTtcbiAgICB9XG5cbiAgICBzZXQoTU9WSU5HKTtcbiAgICBlbWl0KEVWRU5UX01PVkUsIGluZGV4LCBwcmV2LCBkZXN0KTtcbiAgICBUcmFuc2l0aW9uLnN0YXJ0KGluZGV4LCBmdW5jdGlvbiAoKSB7XG4gICAgICBzZXQoSURMRSk7XG4gICAgICBlbWl0KEVWRU5UX01PVkVELCBpbmRleCwgcHJldiwgZGVzdCk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24ganVtcChpbmRleCkge1xuICAgIHRyYW5zbGF0ZSh0b1Bvc2l0aW9uKGluZGV4LCB0cnVlKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFuc2xhdGUocG9zaXRpb24sIHByZXZlbnRMb29wKSB7XG4gICAgaWYgKCFTcGxpZGUyLmlzKEZBREUpKSB7XG4gICAgICB2YXIgZGVzdGluYXRpb24gPSBwcmV2ZW50TG9vcCA/IHBvc2l0aW9uIDogbG9vcChwb3NpdGlvbik7XG4gICAgICBzdHlsZShsaXN0LCBcInRyYW5zZm9ybVwiLCBcInRyYW5zbGF0ZVwiICsgcmVzb2x2ZShcIlhcIikgKyBcIihcIiArIGRlc3RpbmF0aW9uICsgXCJweClcIik7XG4gICAgICBwb3NpdGlvbiAhPT0gZGVzdGluYXRpb24gJiYgZW1pdChFVkVOVF9TSElGVEVEKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsb29wKHBvc2l0aW9uKSB7XG4gICAgaWYgKFNwbGlkZTIuaXMoTE9PUCkpIHtcbiAgICAgIHZhciBpbmRleCA9IHRvSW5kZXgocG9zaXRpb24pO1xuICAgICAgdmFyIGV4Y2VlZGVkTWF4ID0gaW5kZXggPiBDb21wb25lbnRzMi5Db250cm9sbGVyLmdldEVuZCgpO1xuICAgICAgdmFyIGV4Y2VlZGVkTWluID0gaW5kZXggPCAwO1xuXG4gICAgICBpZiAoZXhjZWVkZWRNaW4gfHwgZXhjZWVkZWRNYXgpIHtcbiAgICAgICAgcG9zaXRpb24gPSBzaGlmdChwb3NpdGlvbiwgZXhjZWVkZWRNYXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwb3NpdGlvbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNoaWZ0KHBvc2l0aW9uLCBiYWNrd2FyZHMpIHtcbiAgICB2YXIgZXhjZXNzID0gcG9zaXRpb24gLSBnZXRMaW1pdChiYWNrd2FyZHMpO1xuICAgIHZhciBzaXplID0gc2xpZGVyU2l6ZSgpO1xuICAgIHBvc2l0aW9uIC09IG9yaWVudChzaXplICogKGNlaWwoYWJzKGV4Y2VzcykgLyBzaXplKSB8fCAxKSkgKiAoYmFja3dhcmRzID8gMSA6IC0xKTtcbiAgICByZXR1cm4gcG9zaXRpb247XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgdHJhbnNsYXRlKGdldFBvc2l0aW9uKCksIHRydWUpO1xuICAgIFRyYW5zaXRpb24uY2FuY2VsKCk7XG4gIH1cblxuICBmdW5jdGlvbiB0b0luZGV4KHBvc2l0aW9uKSB7XG4gICAgdmFyIFNsaWRlcyA9IENvbXBvbmVudHMyLlNsaWRlcy5nZXQoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBtaW5EaXN0YW5jZSA9IEluZmluaXR5O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBTbGlkZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBzbGlkZUluZGV4ID0gU2xpZGVzW2ldLmluZGV4O1xuICAgICAgdmFyIGRpc3RhbmNlID0gYWJzKHRvUG9zaXRpb24oc2xpZGVJbmRleCwgdHJ1ZSkgLSBwb3NpdGlvbik7XG5cbiAgICAgIGlmIChkaXN0YW5jZSA8PSBtaW5EaXN0YW5jZSkge1xuICAgICAgICBtaW5EaXN0YW5jZSA9IGRpc3RhbmNlO1xuICAgICAgICBpbmRleCA9IHNsaWRlSW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBmdW5jdGlvbiB0b1Bvc2l0aW9uKGluZGV4LCB0cmltbWluZykge1xuICAgIHZhciBwb3NpdGlvbiA9IG9yaWVudCh0b3RhbFNpemUoaW5kZXggLSAxKSAtIG9mZnNldChpbmRleCkpO1xuICAgIHJldHVybiB0cmltbWluZyA/IHRyaW0ocG9zaXRpb24pIDogcG9zaXRpb247XG4gIH1cblxuICBmdW5jdGlvbiBnZXRQb3NpdGlvbigpIHtcbiAgICB2YXIgbGVmdCA9IHJlc29sdmUoXCJsZWZ0XCIpO1xuICAgIHJldHVybiByZWN0KGxpc3QpW2xlZnRdIC0gcmVjdCh0cmFjaylbbGVmdF0gKyBvcmllbnQoZ2V0UGFkZGluZyhmYWxzZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJpbShwb3NpdGlvbikge1xuICAgIGlmIChvcHRpb25zLnRyaW1TcGFjZSAmJiBTcGxpZGUyLmlzKFNMSURFKSkge1xuICAgICAgcG9zaXRpb24gPSBjbGFtcChwb3NpdGlvbiwgMCwgb3JpZW50KHNsaWRlclNpemUodHJ1ZSkgLSBsaXN0U2l6ZSgpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBvc2l0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gb2Zmc2V0KGluZGV4KSB7XG4gICAgdmFyIGZvY3VzID0gb3B0aW9ucy5mb2N1cztcbiAgICByZXR1cm4gZm9jdXMgPT09IFwiY2VudGVyXCIgPyAobGlzdFNpemUoKSAtIHNsaWRlU2l6ZShpbmRleCwgdHJ1ZSkpIC8gMiA6ICtmb2N1cyAqIHNsaWRlU2l6ZShpbmRleCkgfHwgMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldExpbWl0KG1heCkge1xuICAgIHJldHVybiB0b1Bvc2l0aW9uKG1heCA/IENvbXBvbmVudHMyLkNvbnRyb2xsZXIuZ2V0RW5kKCkgOiAwLCAhIW9wdGlvbnMudHJpbVNwYWNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhblNoaWZ0KGJhY2t3YXJkcykge1xuICAgIHZhciBzaGlmdGVkID0gb3JpZW50KHNoaWZ0KGdldFBvc2l0aW9uKCksIGJhY2t3YXJkcykpO1xuICAgIHJldHVybiBiYWNrd2FyZHMgPyBzaGlmdGVkID49IDAgOiBzaGlmdGVkIDw9IGxpc3RbcmVzb2x2ZShcInNjcm9sbFdpZHRoXCIpXSAtIHJlY3QodHJhY2spW3Jlc29sdmUoXCJ3aWR0aFwiKV07XG4gIH1cblxuICBmdW5jdGlvbiBleGNlZWRlZExpbWl0KG1heCwgcG9zaXRpb24pIHtcbiAgICBwb3NpdGlvbiA9IGlzVW5kZWZpbmVkKHBvc2l0aW9uKSA/IGdldFBvc2l0aW9uKCkgOiBwb3NpdGlvbjtcbiAgICB2YXIgZXhjZWVkZWRNaW4gPSBtYXggIT09IHRydWUgJiYgb3JpZW50KHBvc2l0aW9uKSA8IG9yaWVudChnZXRMaW1pdChmYWxzZSkpO1xuICAgIHZhciBleGNlZWRlZE1heCA9IG1heCAhPT0gZmFsc2UgJiYgb3JpZW50KHBvc2l0aW9uKSA+IG9yaWVudChnZXRMaW1pdCh0cnVlKSk7XG4gICAgcmV0dXJuIGV4Y2VlZGVkTWluIHx8IGV4Y2VlZGVkTWF4O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbW91bnQsXG4gICAgbW92ZTogbW92ZSxcbiAgICBqdW1wOiBqdW1wLFxuICAgIHRyYW5zbGF0ZTogdHJhbnNsYXRlLFxuICAgIHNoaWZ0OiBzaGlmdCxcbiAgICBjYW5jZWw6IGNhbmNlbCxcbiAgICB0b0luZGV4OiB0b0luZGV4LFxuICAgIHRvUG9zaXRpb246IHRvUG9zaXRpb24sXG4gICAgZ2V0UG9zaXRpb246IGdldFBvc2l0aW9uLFxuICAgIGdldExpbWl0OiBnZXRMaW1pdCxcbiAgICBleGNlZWRlZExpbWl0OiBleGNlZWRlZExpbWl0LFxuICAgIHJlcG9zaXRpb246IHJlcG9zaXRpb25cbiAgfTtcbn1cblxuZnVuY3Rpb24gQ29udHJvbGxlcihTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICB2YXIgX0V2ZW50SW50ZXJmYWNlNSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpLFxuICAgICAgb24gPSBfRXZlbnRJbnRlcmZhY2U1Lm9uLFxuICAgICAgZW1pdCA9IF9FdmVudEludGVyZmFjZTUuZW1pdDtcblxuICB2YXIgTW92ZSA9IENvbXBvbmVudHMyLk1vdmU7XG4gIHZhciBnZXRQb3NpdGlvbiA9IE1vdmUuZ2V0UG9zaXRpb24sXG4gICAgICBnZXRMaW1pdCA9IE1vdmUuZ2V0TGltaXQsXG4gICAgICB0b1Bvc2l0aW9uID0gTW92ZS50b1Bvc2l0aW9uO1xuICB2YXIgX0NvbXBvbmVudHMyJFNsaWRlcyA9IENvbXBvbmVudHMyLlNsaWRlcyxcbiAgICAgIGlzRW5vdWdoID0gX0NvbXBvbmVudHMyJFNsaWRlcy5pc0Vub3VnaCxcbiAgICAgIGdldExlbmd0aCA9IF9Db21wb25lbnRzMiRTbGlkZXMuZ2V0TGVuZ3RoO1xuICB2YXIgb21pdEVuZCA9IG9wdGlvbnMub21pdEVuZDtcbiAgdmFyIGlzTG9vcCA9IFNwbGlkZTIuaXMoTE9PUCk7XG4gIHZhciBpc1NsaWRlID0gU3BsaWRlMi5pcyhTTElERSk7XG4gIHZhciBnZXROZXh0ID0gYXBwbHkoZ2V0QWRqYWNlbnQsIGZhbHNlKTtcbiAgdmFyIGdldFByZXYgPSBhcHBseShnZXRBZGphY2VudCwgdHJ1ZSk7XG4gIHZhciBjdXJySW5kZXggPSBvcHRpb25zLnN0YXJ0IHx8IDA7XG4gIHZhciBlbmRJbmRleDtcbiAgdmFyIHByZXZJbmRleCA9IGN1cnJJbmRleDtcbiAgdmFyIHNsaWRlQ291bnQ7XG4gIHZhciBwZXJNb3ZlO1xuICB2YXIgcGVyUGFnZTtcblxuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgb24oW0VWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0gsIEVWRU5UX0VORF9JTkRFWF9DSEFOR0VEXSwgaW5pdCk7XG4gICAgb24oRVZFTlRfUkVTSVpFRCwgb25SZXNpemVkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgc2xpZGVDb3VudCA9IGdldExlbmd0aCh0cnVlKTtcbiAgICBwZXJNb3ZlID0gb3B0aW9ucy5wZXJNb3ZlO1xuICAgIHBlclBhZ2UgPSBvcHRpb25zLnBlclBhZ2U7XG4gICAgZW5kSW5kZXggPSBnZXRFbmQoKTtcbiAgICB2YXIgaW5kZXggPSBjbGFtcChjdXJySW5kZXgsIDAsIG9taXRFbmQgPyBlbmRJbmRleCA6IHNsaWRlQ291bnQgLSAxKTtcblxuICAgIGlmIChpbmRleCAhPT0gY3VyckluZGV4KSB7XG4gICAgICBjdXJySW5kZXggPSBpbmRleDtcbiAgICAgIE1vdmUucmVwb3NpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG9uUmVzaXplZCgpIHtcbiAgICBpZiAoZW5kSW5kZXggIT09IGdldEVuZCgpKSB7XG4gICAgICBlbWl0KEVWRU5UX0VORF9JTkRFWF9DSEFOR0VEKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyhjb250cm9sLCBhbGxvd1NhbWVJbmRleCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIWlzQnVzeSgpKSB7XG4gICAgICB2YXIgZGVzdCA9IHBhcnNlKGNvbnRyb2wpO1xuICAgICAgdmFyIGluZGV4ID0gbG9vcChkZXN0KTtcblxuICAgICAgaWYgKGluZGV4ID4gLTEgJiYgKGFsbG93U2FtZUluZGV4IHx8IGluZGV4ICE9PSBjdXJySW5kZXgpKSB7XG4gICAgICAgIHNldEluZGV4KGluZGV4KTtcbiAgICAgICAgTW92ZS5tb3ZlKGRlc3QsIGluZGV4LCBwcmV2SW5kZXgsIGNhbGxiYWNrKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzY3JvbGwoZGVzdGluYXRpb24sIGR1cmF0aW9uLCBzbmFwLCBjYWxsYmFjaykge1xuICAgIENvbXBvbmVudHMyLlNjcm9sbC5zY3JvbGwoZGVzdGluYXRpb24sIGR1cmF0aW9uLCBzbmFwLCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgaW5kZXggPSBsb29wKE1vdmUudG9JbmRleChnZXRQb3NpdGlvbigpKSk7XG4gICAgICBzZXRJbmRleChvbWl0RW5kID8gbWluKGluZGV4LCBlbmRJbmRleCkgOiBpbmRleCk7XG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2UoY29udHJvbCkge1xuICAgIHZhciBpbmRleCA9IGN1cnJJbmRleDtcblxuICAgIGlmIChpc1N0cmluZyhjb250cm9sKSkge1xuICAgICAgdmFyIF9yZWYgPSBjb250cm9sLm1hdGNoKC8oWytcXC08Pl0pKFxcZCspPy8pIHx8IFtdLFxuICAgICAgICAgIGluZGljYXRvciA9IF9yZWZbMV0sXG4gICAgICAgICAgbnVtYmVyID0gX3JlZlsyXTtcblxuICAgICAgaWYgKGluZGljYXRvciA9PT0gXCIrXCIgfHwgaW5kaWNhdG9yID09PSBcIi1cIikge1xuICAgICAgICBpbmRleCA9IGNvbXB1dGVEZXN0SW5kZXgoY3VyckluZGV4ICsgKyhcIlwiICsgaW5kaWNhdG9yICsgKCtudW1iZXIgfHwgMSkpLCBjdXJySW5kZXgpO1xuICAgICAgfSBlbHNlIGlmIChpbmRpY2F0b3IgPT09IFwiPlwiKSB7XG4gICAgICAgIGluZGV4ID0gbnVtYmVyID8gdG9JbmRleCgrbnVtYmVyKSA6IGdldE5leHQodHJ1ZSk7XG4gICAgICB9IGVsc2UgaWYgKGluZGljYXRvciA9PT0gXCI8XCIpIHtcbiAgICAgICAgaW5kZXggPSBnZXRQcmV2KHRydWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpbmRleCA9IGlzTG9vcCA/IGNvbnRyb2wgOiBjbGFtcChjb250cm9sLCAwLCBlbmRJbmRleCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QWRqYWNlbnQocHJldiwgZGVzdGluYXRpb24pIHtcbiAgICB2YXIgbnVtYmVyID0gcGVyTW92ZSB8fCAoaGFzRm9jdXMoKSA/IDEgOiBwZXJQYWdlKTtcbiAgICB2YXIgZGVzdCA9IGNvbXB1dGVEZXN0SW5kZXgoY3VyckluZGV4ICsgbnVtYmVyICogKHByZXYgPyAtMSA6IDEpLCBjdXJySW5kZXgsICEocGVyTW92ZSB8fCBoYXNGb2N1cygpKSk7XG5cbiAgICBpZiAoZGVzdCA9PT0gLTEgJiYgaXNTbGlkZSkge1xuICAgICAgaWYgKCFhcHByb3hpbWF0ZWx5RXF1YWwoZ2V0UG9zaXRpb24oKSwgZ2V0TGltaXQoIXByZXYpLCAxKSkge1xuICAgICAgICByZXR1cm4gcHJldiA/IDAgOiBlbmRJbmRleDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzdGluYXRpb24gPyBkZXN0IDogbG9vcChkZXN0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXB1dGVEZXN0SW5kZXgoZGVzdCwgZnJvbSwgc25hcFBhZ2UpIHtcbiAgICBpZiAoaXNFbm91Z2goKSB8fCBoYXNGb2N1cygpKSB7XG4gICAgICB2YXIgaW5kZXggPSBjb21wdXRlTW92YWJsZURlc3RJbmRleChkZXN0KTtcblxuICAgICAgaWYgKGluZGV4ICE9PSBkZXN0KSB7XG4gICAgICAgIGZyb20gPSBkZXN0O1xuICAgICAgICBkZXN0ID0gaW5kZXg7XG4gICAgICAgIHNuYXBQYWdlID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChkZXN0IDwgMCB8fCBkZXN0ID4gZW5kSW5kZXgpIHtcbiAgICAgICAgaWYgKCFwZXJNb3ZlICYmIChiZXR3ZWVuKDAsIGRlc3QsIGZyb20sIHRydWUpIHx8IGJldHdlZW4oZW5kSW5kZXgsIGZyb20sIGRlc3QsIHRydWUpKSkge1xuICAgICAgICAgIGRlc3QgPSB0b0luZGV4KHRvUGFnZShkZXN0KSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGlzTG9vcCkge1xuICAgICAgICAgICAgZGVzdCA9IHNuYXBQYWdlID8gZGVzdCA8IDAgPyAtKHNsaWRlQ291bnQgJSBwZXJQYWdlIHx8IHBlclBhZ2UpIDogc2xpZGVDb3VudCA6IGRlc3Q7XG4gICAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnJld2luZCkge1xuICAgICAgICAgICAgZGVzdCA9IGRlc3QgPCAwID8gZW5kSW5kZXggOiAwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZXN0ID0gLTE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc25hcFBhZ2UgJiYgZGVzdCAhPT0gZnJvbSkge1xuICAgICAgICAgIGRlc3QgPSB0b0luZGV4KHRvUGFnZShmcm9tKSArIChkZXN0IDwgZnJvbSA/IC0xIDogMSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3QgPSAtMTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXB1dGVNb3ZhYmxlRGVzdEluZGV4KGRlc3QpIHtcbiAgICBpZiAoaXNTbGlkZSAmJiBvcHRpb25zLnRyaW1TcGFjZSA9PT0gXCJtb3ZlXCIgJiYgZGVzdCAhPT0gY3VyckluZGV4KSB7XG4gICAgICB2YXIgcG9zaXRpb24gPSBnZXRQb3NpdGlvbigpO1xuXG4gICAgICB3aGlsZSAocG9zaXRpb24gPT09IHRvUG9zaXRpb24oZGVzdCwgdHJ1ZSkgJiYgYmV0d2VlbihkZXN0LCAwLCBTcGxpZGUyLmxlbmd0aCAtIDEsICFvcHRpb25zLnJld2luZCkpIHtcbiAgICAgICAgZGVzdCA8IGN1cnJJbmRleCA/IC0tZGVzdCA6ICsrZGVzdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZGVzdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvb3AoaW5kZXgpIHtcbiAgICByZXR1cm4gaXNMb29wID8gKGluZGV4ICsgc2xpZGVDb3VudCkgJSBzbGlkZUNvdW50IHx8IDAgOiBpbmRleDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEVuZCgpIHtcbiAgICB2YXIgZW5kID0gc2xpZGVDb3VudCAtIChoYXNGb2N1cygpIHx8IGlzTG9vcCAmJiBwZXJNb3ZlID8gMSA6IHBlclBhZ2UpO1xuXG4gICAgd2hpbGUgKG9taXRFbmQgJiYgZW5kLS0gPiAwKSB7XG4gICAgICBpZiAodG9Qb3NpdGlvbihzbGlkZUNvdW50IC0gMSwgdHJ1ZSkgIT09IHRvUG9zaXRpb24oZW5kLCB0cnVlKSkge1xuICAgICAgICBlbmQrKztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGNsYW1wKGVuZCwgMCwgc2xpZGVDb3VudCAtIDEpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9JbmRleChwYWdlKSB7XG4gICAgcmV0dXJuIGNsYW1wKGhhc0ZvY3VzKCkgPyBwYWdlIDogcGVyUGFnZSAqIHBhZ2UsIDAsIGVuZEluZGV4KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvUGFnZShpbmRleCkge1xuICAgIHJldHVybiBoYXNGb2N1cygpID8gbWluKGluZGV4LCBlbmRJbmRleCkgOiBmbG9vcigoaW5kZXggPj0gZW5kSW5kZXggPyBzbGlkZUNvdW50IC0gMSA6IGluZGV4KSAvIHBlclBhZ2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gdG9EZXN0KGRlc3RpbmF0aW9uKSB7XG4gICAgdmFyIGNsb3Nlc3QgPSBNb3ZlLnRvSW5kZXgoZGVzdGluYXRpb24pO1xuICAgIHJldHVybiBpc1NsaWRlID8gY2xhbXAoY2xvc2VzdCwgMCwgZW5kSW5kZXgpIDogY2xvc2VzdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEluZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4ICE9PSBjdXJySW5kZXgpIHtcbiAgICAgIHByZXZJbmRleCA9IGN1cnJJbmRleDtcbiAgICAgIGN1cnJJbmRleCA9IGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEluZGV4KHByZXYpIHtcbiAgICByZXR1cm4gcHJldiA/IHByZXZJbmRleCA6IGN1cnJJbmRleDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhc0ZvY3VzKCkge1xuICAgIHJldHVybiAhaXNVbmRlZmluZWQob3B0aW9ucy5mb2N1cykgfHwgb3B0aW9ucy5pc05hdmlnYXRpb247XG4gIH1cblxuICBmdW5jdGlvbiBpc0J1c3koKSB7XG4gICAgcmV0dXJuIFNwbGlkZTIuc3RhdGUuaXMoW01PVklORywgU0NST0xMSU5HXSkgJiYgISFvcHRpb25zLndhaXRGb3JUcmFuc2l0aW9uO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbW91bnQsXG4gICAgZ286IGdvLFxuICAgIHNjcm9sbDogc2Nyb2xsLFxuICAgIGdldE5leHQ6IGdldE5leHQsXG4gICAgZ2V0UHJldjogZ2V0UHJldixcbiAgICBnZXRBZGphY2VudDogZ2V0QWRqYWNlbnQsXG4gICAgZ2V0RW5kOiBnZXRFbmQsXG4gICAgc2V0SW5kZXg6IHNldEluZGV4LFxuICAgIGdldEluZGV4OiBnZXRJbmRleCxcbiAgICB0b0luZGV4OiB0b0luZGV4LFxuICAgIHRvUGFnZTogdG9QYWdlLFxuICAgIHRvRGVzdDogdG9EZXN0LFxuICAgIGhhc0ZvY3VzOiBoYXNGb2N1cyxcbiAgICBpc0J1c3k6IGlzQnVzeVxuICB9O1xufVxuXG52YXIgWE1MX05BTUVfU1BBQ0UgPSBcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCI7XG52YXIgUEFUSCA9IFwibTE1LjUgMC45MzItNC4zIDQuMzggMTQuNSAxNC42LTE0LjUgMTQuNSA0LjMgNC40IDE0LjYtMTQuNiA0LjQtNC4zLTQuNC00LjQtMTQuNi0xNC42elwiO1xudmFyIFNJWkUgPSA0MDtcblxuZnVuY3Rpb24gQXJyb3dzKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBldmVudCA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICB2YXIgb24gPSBldmVudC5vbixcbiAgICAgIGJpbmQgPSBldmVudC5iaW5kLFxuICAgICAgZW1pdCA9IGV2ZW50LmVtaXQ7XG4gIHZhciBjbGFzc2VzID0gb3B0aW9ucy5jbGFzc2VzLFxuICAgICAgaTE4biA9IG9wdGlvbnMuaTE4bjtcbiAgdmFyIEVsZW1lbnRzID0gQ29tcG9uZW50czIuRWxlbWVudHMsXG4gICAgICBDb250cm9sbGVyID0gQ29tcG9uZW50czIuQ29udHJvbGxlcjtcbiAgdmFyIHBsYWNlaG9sZGVyID0gRWxlbWVudHMuYXJyb3dzLFxuICAgICAgdHJhY2sgPSBFbGVtZW50cy50cmFjaztcbiAgdmFyIHdyYXBwZXIgPSBwbGFjZWhvbGRlcjtcbiAgdmFyIHByZXYgPSBFbGVtZW50cy5wcmV2O1xuICB2YXIgbmV4dCA9IEVsZW1lbnRzLm5leHQ7XG4gIHZhciBjcmVhdGVkO1xuICB2YXIgd3JhcHBlckNsYXNzZXM7XG4gIHZhciBhcnJvd3MgPSB7fTtcblxuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpbml0KCk7XG4gICAgb24oRVZFTlRfVVBEQVRFRCwgcmVtb3VudCk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdW50KCkge1xuICAgIGRlc3Ryb3koKTtcbiAgICBtb3VudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgZW5hYmxlZCA9IG9wdGlvbnMuYXJyb3dzO1xuXG4gICAgaWYgKGVuYWJsZWQgJiYgIShwcmV2ICYmIG5leHQpKSB7XG4gICAgICBjcmVhdGVBcnJvd3MoKTtcbiAgICB9XG5cbiAgICBpZiAocHJldiAmJiBuZXh0KSB7XG4gICAgICBhc3NpZ24oYXJyb3dzLCB7XG4gICAgICAgIHByZXY6IHByZXYsXG4gICAgICAgIG5leHQ6IG5leHRcbiAgICAgIH0pO1xuICAgICAgZGlzcGxheSh3cmFwcGVyLCBlbmFibGVkID8gXCJcIiA6IFwibm9uZVwiKTtcbiAgICAgIGFkZENsYXNzKHdyYXBwZXIsIHdyYXBwZXJDbGFzc2VzID0gQ0xBU1NfQVJST1dTICsgXCItLVwiICsgb3B0aW9ucy5kaXJlY3Rpb24pO1xuXG4gICAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgICBsaXN0ZW4oKTtcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIHNldEF0dHJpYnV0ZShbcHJldiwgbmV4dF0sIEFSSUFfQ09OVFJPTFMsIHRyYWNrLmlkKTtcbiAgICAgICAgZW1pdChFVkVOVF9BUlJPV1NfTU9VTlRFRCwgcHJldiwgbmV4dCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBldmVudC5kZXN0cm95KCk7XG4gICAgcmVtb3ZlQ2xhc3Mod3JhcHBlciwgd3JhcHBlckNsYXNzZXMpO1xuXG4gICAgaWYgKGNyZWF0ZWQpIHtcbiAgICAgIHJlbW92ZShwbGFjZWhvbGRlciA/IFtwcmV2LCBuZXh0XSA6IHdyYXBwZXIpO1xuICAgICAgcHJldiA9IG5leHQgPSBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmVBdHRyaWJ1dGUoW3ByZXYsIG5leHRdLCBBTExfQVRUUklCVVRFUyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9NT1ZFRCwgRVZFTlRfUkVGUkVTSCwgRVZFTlRfU0NST0xMRUQsIEVWRU5UX0VORF9JTkRFWF9DSEFOR0VEXSwgdXBkYXRlKTtcbiAgICBiaW5kKG5leHQsIFwiY2xpY2tcIiwgYXBwbHkoZ28sIFwiPlwiKSk7XG4gICAgYmluZChwcmV2LCBcImNsaWNrXCIsIGFwcGx5KGdvLCBcIjxcIikpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ28oY29udHJvbCkge1xuICAgIENvbnRyb2xsZXIuZ28oY29udHJvbCwgdHJ1ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJvd3MoKSB7XG4gICAgd3JhcHBlciA9IHBsYWNlaG9sZGVyIHx8IGNyZWF0ZShcImRpdlwiLCBjbGFzc2VzLmFycm93cyk7XG4gICAgcHJldiA9IGNyZWF0ZUFycm93KHRydWUpO1xuICAgIG5leHQgPSBjcmVhdGVBcnJvdyhmYWxzZSk7XG4gICAgY3JlYXRlZCA9IHRydWU7XG4gICAgYXBwZW5kKHdyYXBwZXIsIFtwcmV2LCBuZXh0XSk7XG4gICAgIXBsYWNlaG9sZGVyICYmIGJlZm9yZSh3cmFwcGVyLCB0cmFjayk7XG4gIH1cblxuICBmdW5jdGlvbiBjcmVhdGVBcnJvdyhwcmV2Mikge1xuICAgIHZhciBhcnJvdyA9IFwiPGJ1dHRvbiBjbGFzcz1cXFwiXCIgKyBjbGFzc2VzLmFycm93ICsgXCIgXCIgKyAocHJldjIgPyBjbGFzc2VzLnByZXYgOiBjbGFzc2VzLm5leHQpICsgXCJcXFwiIHR5cGU9XFxcImJ1dHRvblxcXCI+PHN2ZyB4bWxucz1cXFwiXCIgKyBYTUxfTkFNRV9TUEFDRSArIFwiXFxcIiB2aWV3Qm94PVxcXCIwIDAgXCIgKyBTSVpFICsgXCIgXCIgKyBTSVpFICsgXCJcXFwiIHdpZHRoPVxcXCJcIiArIFNJWkUgKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIFNJWkUgKyBcIlxcXCIgZm9jdXNhYmxlPVxcXCJmYWxzZVxcXCI+PHBhdGggZD1cXFwiXCIgKyAob3B0aW9ucy5hcnJvd1BhdGggfHwgUEFUSCkgKyBcIlxcXCIgLz5cIjtcbiAgICByZXR1cm4gcGFyc2VIdG1sKGFycm93KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICBpZiAocHJldiAmJiBuZXh0KSB7XG4gICAgICB2YXIgaW5kZXggPSBTcGxpZGUyLmluZGV4O1xuICAgICAgdmFyIHByZXZJbmRleCA9IENvbnRyb2xsZXIuZ2V0UHJldigpO1xuICAgICAgdmFyIG5leHRJbmRleCA9IENvbnRyb2xsZXIuZ2V0TmV4dCgpO1xuICAgICAgdmFyIHByZXZMYWJlbCA9IHByZXZJbmRleCA+IC0xICYmIGluZGV4IDwgcHJldkluZGV4ID8gaTE4bi5sYXN0IDogaTE4bi5wcmV2O1xuICAgICAgdmFyIG5leHRMYWJlbCA9IG5leHRJbmRleCA+IC0xICYmIGluZGV4ID4gbmV4dEluZGV4ID8gaTE4bi5maXJzdCA6IGkxOG4ubmV4dDtcbiAgICAgIHByZXYuZGlzYWJsZWQgPSBwcmV2SW5kZXggPCAwO1xuICAgICAgbmV4dC5kaXNhYmxlZCA9IG5leHRJbmRleCA8IDA7XG4gICAgICBzZXRBdHRyaWJ1dGUocHJldiwgQVJJQV9MQUJFTCwgcHJldkxhYmVsKTtcbiAgICAgIHNldEF0dHJpYnV0ZShuZXh0LCBBUklBX0xBQkVMLCBuZXh0TGFiZWwpO1xuICAgICAgZW1pdChFVkVOVF9BUlJPV1NfVVBEQVRFRCwgcHJldiwgbmV4dCwgcHJldkluZGV4LCBuZXh0SW5kZXgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgYXJyb3dzOiBhcnJvd3MsXG4gICAgbW91bnQ6IG1vdW50LFxuICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgdXBkYXRlOiB1cGRhdGVcbiAgfTtcbn1cblxudmFyIElOVEVSVkFMX0RBVEFfQVRUUklCVVRFID0gREFUQV9BVFRSSUJVVEUgKyBcIi1pbnRlcnZhbFwiO1xuXG5mdW5jdGlvbiBBdXRvcGxheShTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICB2YXIgX0V2ZW50SW50ZXJmYWNlNiA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpLFxuICAgICAgb24gPSBfRXZlbnRJbnRlcmZhY2U2Lm9uLFxuICAgICAgYmluZCA9IF9FdmVudEludGVyZmFjZTYuYmluZCxcbiAgICAgIGVtaXQgPSBfRXZlbnRJbnRlcmZhY2U2LmVtaXQ7XG5cbiAgdmFyIGludGVydmFsID0gUmVxdWVzdEludGVydmFsKG9wdGlvbnMuaW50ZXJ2YWwsIFNwbGlkZTIuZ28uYmluZChTcGxpZGUyLCBcIj5cIiksIG9uQW5pbWF0aW9uRnJhbWUpO1xuICB2YXIgaXNQYXVzZWQgPSBpbnRlcnZhbC5pc1BhdXNlZDtcbiAgdmFyIEVsZW1lbnRzID0gQ29tcG9uZW50czIuRWxlbWVudHMsXG4gICAgICBfQ29tcG9uZW50czIkRWxlbWVudHM0ID0gQ29tcG9uZW50czIuRWxlbWVudHMsXG4gICAgICByb290ID0gX0NvbXBvbmVudHMyJEVsZW1lbnRzNC5yb290LFxuICAgICAgdG9nZ2xlID0gX0NvbXBvbmVudHMyJEVsZW1lbnRzNC50b2dnbGU7XG4gIHZhciBhdXRvcGxheSA9IG9wdGlvbnMuYXV0b3BsYXk7XG4gIHZhciBob3ZlcmVkO1xuICB2YXIgZm9jdXNlZDtcbiAgdmFyIHN0b3BwZWQgPSBhdXRvcGxheSA9PT0gXCJwYXVzZVwiO1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGlmIChhdXRvcGxheSkge1xuICAgICAgbGlzdGVuKCk7XG4gICAgICB0b2dnbGUgJiYgc2V0QXR0cmlidXRlKHRvZ2dsZSwgQVJJQV9DT05UUk9MUywgRWxlbWVudHMudHJhY2suaWQpO1xuICAgICAgc3RvcHBlZCB8fCBwbGF5KCk7XG4gICAgICB1cGRhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBsaXN0ZW4oKSB7XG4gICAgaWYgKG9wdGlvbnMucGF1c2VPbkhvdmVyKSB7XG4gICAgICBiaW5kKHJvb3QsIFwibW91c2VlbnRlciBtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGhvdmVyZWQgPSBlLnR5cGUgPT09IFwibW91c2VlbnRlclwiO1xuICAgICAgICBhdXRvVG9nZ2xlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5wYXVzZU9uRm9jdXMpIHtcbiAgICAgIGJpbmQocm9vdCwgXCJmb2N1c2luIGZvY3Vzb3V0XCIsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGZvY3VzZWQgPSBlLnR5cGUgPT09IFwiZm9jdXNpblwiO1xuICAgICAgICBhdXRvVG9nZ2xlKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodG9nZ2xlKSB7XG4gICAgICBiaW5kKHRvZ2dsZSwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHN0b3BwZWQgPyBwbGF5KCkgOiBwYXVzZSh0cnVlKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIG9uKFtFVkVOVF9NT1ZFLCBFVkVOVF9TQ1JPTEwsIEVWRU5UX1JFRlJFU0hdLCBpbnRlcnZhbC5yZXdpbmQpO1xuICAgIG9uKEVWRU5UX01PVkUsIG9uTW92ZSk7XG4gIH1cblxuICBmdW5jdGlvbiBwbGF5KCkge1xuICAgIGlmIChpc1BhdXNlZCgpICYmIENvbXBvbmVudHMyLlNsaWRlcy5pc0Vub3VnaCgpKSB7XG4gICAgICBpbnRlcnZhbC5zdGFydCghb3B0aW9ucy5yZXNldFByb2dyZXNzKTtcbiAgICAgIGZvY3VzZWQgPSBob3ZlcmVkID0gc3RvcHBlZCA9IGZhbHNlO1xuICAgICAgdXBkYXRlKCk7XG4gICAgICBlbWl0KEVWRU5UX0FVVE9QTEFZX1BMQVkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHBhdXNlKHN0b3ApIHtcbiAgICBpZiAoc3RvcCA9PT0gdm9pZCAwKSB7XG4gICAgICBzdG9wID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBzdG9wcGVkID0gISFzdG9wO1xuICAgIHVwZGF0ZSgpO1xuXG4gICAgaWYgKCFpc1BhdXNlZCgpKSB7XG4gICAgICBpbnRlcnZhbC5wYXVzZSgpO1xuICAgICAgZW1pdChFVkVOVF9BVVRPUExBWV9QQVVTRSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXV0b1RvZ2dsZSgpIHtcbiAgICBpZiAoIXN0b3BwZWQpIHtcbiAgICAgIGhvdmVyZWQgfHwgZm9jdXNlZCA/IHBhdXNlKGZhbHNlKSA6IHBsYXkoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgaWYgKHRvZ2dsZSkge1xuICAgICAgdG9nZ2xlQ2xhc3ModG9nZ2xlLCBDTEFTU19BQ1RJVkUsICFzdG9wcGVkKTtcbiAgICAgIHNldEF0dHJpYnV0ZSh0b2dnbGUsIEFSSUFfTEFCRUwsIG9wdGlvbnMuaTE4bltzdG9wcGVkID8gXCJwbGF5XCIgOiBcInBhdXNlXCJdKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkFuaW1hdGlvbkZyYW1lKHJhdGUpIHtcbiAgICB2YXIgYmFyID0gRWxlbWVudHMuYmFyO1xuICAgIGJhciAmJiBzdHlsZShiYXIsIFwid2lkdGhcIiwgcmF0ZSAqIDEwMCArIFwiJVwiKTtcbiAgICBlbWl0KEVWRU5UX0FVVE9QTEFZX1BMQVlJTkcsIHJhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Nb3ZlKGluZGV4KSB7XG4gICAgdmFyIFNsaWRlID0gQ29tcG9uZW50czIuU2xpZGVzLmdldEF0KGluZGV4KTtcbiAgICBpbnRlcnZhbC5zZXQoU2xpZGUgJiYgK2dldEF0dHJpYnV0ZShTbGlkZS5zbGlkZSwgSU5URVJWQUxfREFUQV9BVFRSSUJVVEUpIHx8IG9wdGlvbnMuaW50ZXJ2YWwpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbW91bnQsXG4gICAgZGVzdHJveTogaW50ZXJ2YWwuY2FuY2VsLFxuICAgIHBsYXk6IHBsYXksXG4gICAgcGF1c2U6IHBhdXNlLFxuICAgIGlzUGF1c2VkOiBpc1BhdXNlZFxuICB9O1xufVxuXG5mdW5jdGlvbiBDb3ZlcihTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICB2YXIgX0V2ZW50SW50ZXJmYWNlNyA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpLFxuICAgICAgb24gPSBfRXZlbnRJbnRlcmZhY2U3Lm9uO1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGlmIChvcHRpb25zLmNvdmVyKSB7XG4gICAgICBvbihFVkVOVF9MQVpZTE9BRF9MT0FERUQsIGFwcGx5KHRvZ2dsZSwgdHJ1ZSkpO1xuICAgICAgb24oW0VWRU5UX01PVU5URUQsIEVWRU5UX1VQREFURUQsIEVWRU5UX1JFRlJFU0hdLCBhcHBseShjb3ZlciwgdHJ1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGNvdmVyKGNvdmVyMikge1xuICAgIENvbXBvbmVudHMyLlNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChTbGlkZSkge1xuICAgICAgdmFyIGltZyA9IGNoaWxkKFNsaWRlLmNvbnRhaW5lciB8fCBTbGlkZS5zbGlkZSwgXCJpbWdcIik7XG5cbiAgICAgIGlmIChpbWcgJiYgaW1nLnNyYykge1xuICAgICAgICB0b2dnbGUoY292ZXIyLCBpbWcsIFNsaWRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZShjb3ZlcjIsIGltZywgU2xpZGUpIHtcbiAgICBTbGlkZS5zdHlsZShcImJhY2tncm91bmRcIiwgY292ZXIyID8gXCJjZW50ZXIvY292ZXIgbm8tcmVwZWF0IHVybChcXFwiXCIgKyBpbWcuc3JjICsgXCJcXFwiKVwiIDogXCJcIiwgdHJ1ZSk7XG4gICAgZGlzcGxheShpbWcsIGNvdmVyMiA/IFwibm9uZVwiIDogXCJcIik7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1vdW50OiBtb3VudCxcbiAgICBkZXN0cm95OiBhcHBseShjb3ZlciwgZmFsc2UpXG4gIH07XG59XG5cbnZhciBCT1VOQ0VfRElGRl9USFJFU0hPTEQgPSAxMDtcbnZhciBCT1VOQ0VfRFVSQVRJT04gPSA2MDA7XG52YXIgRlJJQ1RJT05fRkFDVE9SID0gMC42O1xudmFyIEJBU0VfVkVMT0NJVFkgPSAxLjU7XG52YXIgTUlOX0RVUkFUSU9OID0gODAwO1xuXG5mdW5jdGlvbiBTY3JvbGwoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgdmFyIF9FdmVudEludGVyZmFjZTggPSBFdmVudEludGVyZmFjZShTcGxpZGUyKSxcbiAgICAgIG9uID0gX0V2ZW50SW50ZXJmYWNlOC5vbixcbiAgICAgIGVtaXQgPSBfRXZlbnRJbnRlcmZhY2U4LmVtaXQ7XG5cbiAgdmFyIHNldCA9IFNwbGlkZTIuc3RhdGUuc2V0O1xuICB2YXIgTW92ZSA9IENvbXBvbmVudHMyLk1vdmU7XG4gIHZhciBnZXRQb3NpdGlvbiA9IE1vdmUuZ2V0UG9zaXRpb24sXG4gICAgICBnZXRMaW1pdCA9IE1vdmUuZ2V0TGltaXQsXG4gICAgICBleGNlZWRlZExpbWl0ID0gTW92ZS5leGNlZWRlZExpbWl0LFxuICAgICAgdHJhbnNsYXRlID0gTW92ZS50cmFuc2xhdGU7XG4gIHZhciBpc1NsaWRlID0gU3BsaWRlMi5pcyhTTElERSk7XG4gIHZhciBpbnRlcnZhbDtcbiAgdmFyIGNhbGxiYWNrO1xuICB2YXIgZnJpY3Rpb24gPSAxO1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIG9uKEVWRU5UX01PVkUsIGNsZWFyKTtcbiAgICBvbihbRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVGUkVTSF0sIGNhbmNlbCk7XG4gIH1cblxuICBmdW5jdGlvbiBzY3JvbGwoZGVzdGluYXRpb24sIGR1cmF0aW9uLCBzbmFwLCBvblNjcm9sbGVkLCBub0NvbnN0cmFpbikge1xuICAgIHZhciBmcm9tID0gZ2V0UG9zaXRpb24oKTtcbiAgICBjbGVhcigpO1xuXG4gICAgaWYgKHNuYXAgJiYgKCFpc1NsaWRlIHx8ICFleGNlZWRlZExpbWl0KCkpKSB7XG4gICAgICB2YXIgc2l6ZSA9IENvbXBvbmVudHMyLkxheW91dC5zbGlkZXJTaXplKCk7XG4gICAgICB2YXIgb2Zmc2V0ID0gc2lnbihkZXN0aW5hdGlvbikgKiBzaXplICogZmxvb3IoYWJzKGRlc3RpbmF0aW9uKSAvIHNpemUpIHx8IDA7XG4gICAgICBkZXN0aW5hdGlvbiA9IE1vdmUudG9Qb3NpdGlvbihDb21wb25lbnRzMi5Db250cm9sbGVyLnRvRGVzdChkZXN0aW5hdGlvbiAlIHNpemUpKSArIG9mZnNldDtcbiAgICB9XG5cbiAgICB2YXIgbm9EaXN0YW5jZSA9IGFwcHJveGltYXRlbHlFcXVhbChmcm9tLCBkZXN0aW5hdGlvbiwgMSk7XG4gICAgZnJpY3Rpb24gPSAxO1xuICAgIGR1cmF0aW9uID0gbm9EaXN0YW5jZSA/IDAgOiBkdXJhdGlvbiB8fCBtYXgoYWJzKGRlc3RpbmF0aW9uIC0gZnJvbSkgLyBCQVNFX1ZFTE9DSVRZLCBNSU5fRFVSQVRJT04pO1xuICAgIGNhbGxiYWNrID0gb25TY3JvbGxlZDtcbiAgICBpbnRlcnZhbCA9IFJlcXVlc3RJbnRlcnZhbChkdXJhdGlvbiwgb25FbmQsIGFwcGx5KHVwZGF0ZSwgZnJvbSwgZGVzdGluYXRpb24sIG5vQ29uc3RyYWluKSwgMSk7XG4gICAgc2V0KFNDUk9MTElORyk7XG4gICAgZW1pdChFVkVOVF9TQ1JPTEwpO1xuICAgIGludGVydmFsLnN0YXJ0KCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkVuZCgpIHtcbiAgICBzZXQoSURMRSk7XG4gICAgY2FsbGJhY2sgJiYgY2FsbGJhY2soKTtcbiAgICBlbWl0KEVWRU5UX1NDUk9MTEVEKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZShmcm9tLCB0bywgbm9Db25zdHJhaW4sIHJhdGUpIHtcbiAgICB2YXIgcG9zaXRpb24gPSBnZXRQb3NpdGlvbigpO1xuICAgIHZhciB0YXJnZXQgPSBmcm9tICsgKHRvIC0gZnJvbSkgKiBlYXNpbmcocmF0ZSk7XG4gICAgdmFyIGRpZmYgPSAodGFyZ2V0IC0gcG9zaXRpb24pICogZnJpY3Rpb247XG4gICAgdHJhbnNsYXRlKHBvc2l0aW9uICsgZGlmZik7XG5cbiAgICBpZiAoaXNTbGlkZSAmJiAhbm9Db25zdHJhaW4gJiYgZXhjZWVkZWRMaW1pdCgpKSB7XG4gICAgICBmcmljdGlvbiAqPSBGUklDVElPTl9GQUNUT1I7XG5cbiAgICAgIGlmIChhYnMoZGlmZikgPCBCT1VOQ0VfRElGRl9USFJFU0hPTEQpIHtcbiAgICAgICAgc2Nyb2xsKGdldExpbWl0KGV4Y2VlZGVkTGltaXQodHJ1ZSkpLCBCT1VOQ0VfRFVSQVRJT04sIGZhbHNlLCBjYWxsYmFjaywgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgaWYgKGludGVydmFsKSB7XG4gICAgICBpbnRlcnZhbC5jYW5jZWwoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKGludGVydmFsICYmICFpbnRlcnZhbC5pc1BhdXNlZCgpKSB7XG4gICAgICBjbGVhcigpO1xuICAgICAgb25FbmQoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBlYXNpbmcodCkge1xuICAgIHZhciBlYXNpbmdGdW5jID0gb3B0aW9ucy5lYXNpbmdGdW5jO1xuICAgIHJldHVybiBlYXNpbmdGdW5jID8gZWFzaW5nRnVuYyh0KSA6IDEgLSBNYXRoLnBvdygxIC0gdCwgNCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1vdW50OiBtb3VudCxcbiAgICBkZXN0cm95OiBjbGVhcixcbiAgICBzY3JvbGw6IHNjcm9sbCxcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufVxuXG52YXIgU0NST0xMX0xJU1RFTkVSX09QVElPTlMgPSB7XG4gIHBhc3NpdmU6IGZhbHNlLFxuICBjYXB0dXJlOiB0cnVlXG59O1xuXG5mdW5jdGlvbiBEcmFnKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBfRXZlbnRJbnRlcmZhY2U5ID0gRXZlbnRJbnRlcmZhY2UoU3BsaWRlMiksXG4gICAgICBvbiA9IF9FdmVudEludGVyZmFjZTkub24sXG4gICAgICBlbWl0ID0gX0V2ZW50SW50ZXJmYWNlOS5lbWl0LFxuICAgICAgYmluZCA9IF9FdmVudEludGVyZmFjZTkuYmluZCxcbiAgICAgIHVuYmluZCA9IF9FdmVudEludGVyZmFjZTkudW5iaW5kO1xuXG4gIHZhciBzdGF0ZSA9IFNwbGlkZTIuc3RhdGU7XG4gIHZhciBNb3ZlID0gQ29tcG9uZW50czIuTW92ZSxcbiAgICAgIFNjcm9sbCA9IENvbXBvbmVudHMyLlNjcm9sbCxcbiAgICAgIENvbnRyb2xsZXIgPSBDb21wb25lbnRzMi5Db250cm9sbGVyLFxuICAgICAgdHJhY2sgPSBDb21wb25lbnRzMi5FbGVtZW50cy50cmFjayxcbiAgICAgIHJlZHVjZSA9IENvbXBvbmVudHMyLk1lZGlhLnJlZHVjZTtcbiAgdmFyIF9Db21wb25lbnRzMiREaXJlY3RpbzIgPSBDb21wb25lbnRzMi5EaXJlY3Rpb24sXG4gICAgICByZXNvbHZlID0gX0NvbXBvbmVudHMyJERpcmVjdGlvMi5yZXNvbHZlLFxuICAgICAgb3JpZW50ID0gX0NvbXBvbmVudHMyJERpcmVjdGlvMi5vcmllbnQ7XG4gIHZhciBnZXRQb3NpdGlvbiA9IE1vdmUuZ2V0UG9zaXRpb24sXG4gICAgICBleGNlZWRlZExpbWl0ID0gTW92ZS5leGNlZWRlZExpbWl0O1xuICB2YXIgYmFzZVBvc2l0aW9uO1xuICB2YXIgYmFzZUV2ZW50O1xuICB2YXIgcHJldkJhc2VFdmVudDtcbiAgdmFyIGlzRnJlZTtcbiAgdmFyIGRyYWdnaW5nO1xuICB2YXIgZXhjZWVkZWQgPSBmYWxzZTtcbiAgdmFyIGNsaWNrUHJldmVudGVkO1xuICB2YXIgZGlzYWJsZWQ7XG4gIHZhciB0YXJnZXQ7XG5cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgYmluZCh0cmFjaywgUE9JTlRFUl9NT1ZFX0VWRU5UUywgbm9vcCwgU0NST0xMX0xJU1RFTkVSX09QVElPTlMpO1xuICAgIGJpbmQodHJhY2ssIFBPSU5URVJfVVBfRVZFTlRTLCBub29wLCBTQ1JPTExfTElTVEVORVJfT1BUSU9OUyk7XG4gICAgYmluZCh0cmFjaywgUE9JTlRFUl9ET1dOX0VWRU5UUywgb25Qb2ludGVyRG93biwgU0NST0xMX0xJU1RFTkVSX09QVElPTlMpO1xuICAgIGJpbmQodHJhY2ssIFwiY2xpY2tcIiwgb25DbGljaywge1xuICAgICAgY2FwdHVyZTogdHJ1ZVxuICAgIH0pO1xuICAgIGJpbmQodHJhY2ssIFwiZHJhZ3N0YXJ0XCIsIHByZXZlbnQpO1xuICAgIG9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9VUERBVEVEXSwgaW5pdCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBkcmFnID0gb3B0aW9ucy5kcmFnO1xuICAgIGRpc2FibGUoIWRyYWcpO1xuICAgIGlzRnJlZSA9IGRyYWcgPT09IFwiZnJlZVwiO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Qb2ludGVyRG93bihlKSB7XG4gICAgY2xpY2tQcmV2ZW50ZWQgPSBmYWxzZTtcblxuICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgIHZhciBpc1RvdWNoID0gaXNUb3VjaEV2ZW50KGUpO1xuXG4gICAgICBpZiAoaXNEcmFnZ2FibGUoZS50YXJnZXQpICYmIChpc1RvdWNoIHx8ICFlLmJ1dHRvbikpIHtcbiAgICAgICAgaWYgKCFDb250cm9sbGVyLmlzQnVzeSgpKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gaXNUb3VjaCA/IHRyYWNrIDogd2luZG93O1xuICAgICAgICAgIGRyYWdnaW5nID0gc3RhdGUuaXMoW01PVklORywgU0NST0xMSU5HXSk7XG4gICAgICAgICAgcHJldkJhc2VFdmVudCA9IG51bGw7XG4gICAgICAgICAgYmluZCh0YXJnZXQsIFBPSU5URVJfTU9WRV9FVkVOVFMsIG9uUG9pbnRlck1vdmUsIFNDUk9MTF9MSVNURU5FUl9PUFRJT05TKTtcbiAgICAgICAgICBiaW5kKHRhcmdldCwgUE9JTlRFUl9VUF9FVkVOVFMsIG9uUG9pbnRlclVwLCBTQ1JPTExfTElTVEVORVJfT1BUSU9OUyk7XG4gICAgICAgICAgTW92ZS5jYW5jZWwoKTtcbiAgICAgICAgICBTY3JvbGwuY2FuY2VsKCk7XG4gICAgICAgICAgc2F2ZShlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwcmV2ZW50KGUsIHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25Qb2ludGVyTW92ZShlKSB7XG4gICAgaWYgKCFzdGF0ZS5pcyhEUkFHR0lORykpIHtcbiAgICAgIHN0YXRlLnNldChEUkFHR0lORyk7XG4gICAgICBlbWl0KEVWRU5UX0RSQUcpO1xuICAgIH1cblxuICAgIGlmIChlLmNhbmNlbGFibGUpIHtcbiAgICAgIGlmIChkcmFnZ2luZykge1xuICAgICAgICBNb3ZlLnRyYW5zbGF0ZShiYXNlUG9zaXRpb24gKyBjb25zdHJhaW4oZGlmZkNvb3JkKGUpKSk7XG4gICAgICAgIHZhciBleHBpcmVkID0gZGlmZlRpbWUoZSkgPiBMT0dfSU5URVJWQUw7XG4gICAgICAgIHZhciBoYXNFeGNlZWRlZCA9IGV4Y2VlZGVkICE9PSAoZXhjZWVkZWQgPSBleGNlZWRlZExpbWl0KCkpO1xuXG4gICAgICAgIGlmIChleHBpcmVkIHx8IGhhc0V4Y2VlZGVkKSB7XG4gICAgICAgICAgc2F2ZShlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNsaWNrUHJldmVudGVkID0gdHJ1ZTtcbiAgICAgICAgZW1pdChFVkVOVF9EUkFHR0lORyk7XG4gICAgICAgIHByZXZlbnQoZSk7XG4gICAgICB9IGVsc2UgaWYgKGlzU2xpZGVyRGlyZWN0aW9uKGUpKSB7XG4gICAgICAgIGRyYWdnaW5nID0gc2hvdWxkU3RhcnQoZSk7XG4gICAgICAgIHByZXZlbnQoZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25Qb2ludGVyVXAoZSkge1xuICAgIGlmIChzdGF0ZS5pcyhEUkFHR0lORykpIHtcbiAgICAgIHN0YXRlLnNldChJRExFKTtcbiAgICAgIGVtaXQoRVZFTlRfRFJBR0dFRCk7XG4gICAgfVxuXG4gICAgaWYgKGRyYWdnaW5nKSB7XG4gICAgICBtb3ZlKGUpO1xuICAgICAgcHJldmVudChlKTtcbiAgICB9XG5cbiAgICB1bmJpbmQodGFyZ2V0LCBQT0lOVEVSX01PVkVfRVZFTlRTLCBvblBvaW50ZXJNb3ZlKTtcbiAgICB1bmJpbmQodGFyZ2V0LCBQT0lOVEVSX1VQX0VWRU5UUywgb25Qb2ludGVyVXApO1xuICAgIGRyYWdnaW5nID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBvbkNsaWNrKGUpIHtcbiAgICBpZiAoIWRpc2FibGVkICYmIGNsaWNrUHJldmVudGVkKSB7XG4gICAgICBwcmV2ZW50KGUsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNhdmUoZSkge1xuICAgIHByZXZCYXNlRXZlbnQgPSBiYXNlRXZlbnQ7XG4gICAgYmFzZUV2ZW50ID0gZTtcbiAgICBiYXNlUG9zaXRpb24gPSBnZXRQb3NpdGlvbigpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW92ZShlKSB7XG4gICAgdmFyIHZlbG9jaXR5ID0gY29tcHV0ZVZlbG9jaXR5KGUpO1xuICAgIHZhciBkZXN0aW5hdGlvbiA9IGNvbXB1dGVEZXN0aW5hdGlvbih2ZWxvY2l0eSk7XG4gICAgdmFyIHJld2luZCA9IG9wdGlvbnMucmV3aW5kICYmIG9wdGlvbnMucmV3aW5kQnlEcmFnO1xuICAgIHJlZHVjZShmYWxzZSk7XG5cbiAgICBpZiAoaXNGcmVlKSB7XG4gICAgICBDb250cm9sbGVyLnNjcm9sbChkZXN0aW5hdGlvbiwgMCwgb3B0aW9ucy5zbmFwKTtcbiAgICB9IGVsc2UgaWYgKFNwbGlkZTIuaXMoRkFERSkpIHtcbiAgICAgIENvbnRyb2xsZXIuZ28ob3JpZW50KHNpZ24odmVsb2NpdHkpKSA8IDAgPyByZXdpbmQgPyBcIjxcIiA6IFwiLVwiIDogcmV3aW5kID8gXCI+XCIgOiBcIitcIik7XG4gICAgfSBlbHNlIGlmIChTcGxpZGUyLmlzKFNMSURFKSAmJiBleGNlZWRlZCAmJiByZXdpbmQpIHtcbiAgICAgIENvbnRyb2xsZXIuZ28oZXhjZWVkZWRMaW1pdCh0cnVlKSA/IFwiPlwiIDogXCI8XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBDb250cm9sbGVyLmdvKENvbnRyb2xsZXIudG9EZXN0KGRlc3RpbmF0aW9uKSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmVkdWNlKHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkU3RhcnQoZSkge1xuICAgIHZhciB0aHJlc2hvbGRzID0gb3B0aW9ucy5kcmFnTWluVGhyZXNob2xkO1xuICAgIHZhciBpc09iaiA9IGlzT2JqZWN0KHRocmVzaG9sZHMpO1xuICAgIHZhciBtb3VzZSA9IGlzT2JqICYmIHRocmVzaG9sZHMubW91c2UgfHwgMDtcbiAgICB2YXIgdG91Y2ggPSAoaXNPYmogPyB0aHJlc2hvbGRzLnRvdWNoIDogK3RocmVzaG9sZHMpIHx8IDEwO1xuICAgIHJldHVybiBhYnMoZGlmZkNvb3JkKGUpKSA+IChpc1RvdWNoRXZlbnQoZSkgPyB0b3VjaCA6IG1vdXNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzU2xpZGVyRGlyZWN0aW9uKGUpIHtcbiAgICByZXR1cm4gYWJzKGRpZmZDb29yZChlKSkgPiBhYnMoZGlmZkNvb3JkKGUsIHRydWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvbXB1dGVWZWxvY2l0eShlKSB7XG4gICAgaWYgKFNwbGlkZTIuaXMoTE9PUCkgfHwgIWV4Y2VlZGVkKSB7XG4gICAgICB2YXIgdGltZSA9IGRpZmZUaW1lKGUpO1xuXG4gICAgICBpZiAodGltZSAmJiB0aW1lIDwgTE9HX0lOVEVSVkFMKSB7XG4gICAgICAgIHJldHVybiBkaWZmQ29vcmQoZSkgLyB0aW1lO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgZnVuY3Rpb24gY29tcHV0ZURlc3RpbmF0aW9uKHZlbG9jaXR5KSB7XG4gICAgcmV0dXJuIGdldFBvc2l0aW9uKCkgKyBzaWduKHZlbG9jaXR5KSAqIG1pbihhYnModmVsb2NpdHkpICogKG9wdGlvbnMuZmxpY2tQb3dlciB8fCA2MDApLCBpc0ZyZWUgPyBJbmZpbml0eSA6IENvbXBvbmVudHMyLkxheW91dC5saXN0U2l6ZSgpICogKG9wdGlvbnMuZmxpY2tNYXhQYWdlcyB8fCAxKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkaWZmQ29vcmQoZSwgb3J0aG9nb25hbCkge1xuICAgIHJldHVybiBjb29yZE9mKGUsIG9ydGhvZ29uYWwpIC0gY29vcmRPZihnZXRCYXNlRXZlbnQoZSksIG9ydGhvZ29uYWwpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlmZlRpbWUoZSkge1xuICAgIHJldHVybiB0aW1lT2YoZSkgLSB0aW1lT2YoZ2V0QmFzZUV2ZW50KGUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEJhc2VFdmVudChlKSB7XG4gICAgcmV0dXJuIGJhc2VFdmVudCA9PT0gZSAmJiBwcmV2QmFzZUV2ZW50IHx8IGJhc2VFdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNvb3JkT2YoZSwgb3J0aG9nb25hbCkge1xuICAgIHJldHVybiAoaXNUb3VjaEV2ZW50KGUpID8gZS5jaGFuZ2VkVG91Y2hlc1swXSA6IGUpW1wicGFnZVwiICsgcmVzb2x2ZShvcnRob2dvbmFsID8gXCJZXCIgOiBcIlhcIildO1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3RyYWluKGRpZmYpIHtcbiAgICByZXR1cm4gZGlmZiAvIChleGNlZWRlZCAmJiBTcGxpZGUyLmlzKFNMSURFKSA/IEZSSUNUSU9OIDogMSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0RyYWdnYWJsZSh0YXJnZXQyKSB7XG4gICAgdmFyIG5vRHJhZyA9IG9wdGlvbnMubm9EcmFnO1xuICAgIHJldHVybiAhbWF0Y2hlcyh0YXJnZXQyLCBcIi5cIiArIENMQVNTX1BBR0lOQVRJT05fUEFHRSArIFwiLCAuXCIgKyBDTEFTU19BUlJPVykgJiYgKCFub0RyYWcgfHwgIW1hdGNoZXModGFyZ2V0Miwgbm9EcmFnKSk7XG4gIH1cblxuICBmdW5jdGlvbiBpc1RvdWNoRXZlbnQoZSkge1xuICAgIHJldHVybiB0eXBlb2YgVG91Y2hFdmVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBlIGluc3RhbmNlb2YgVG91Y2hFdmVudDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRHJhZ2dpbmcoKSB7XG4gICAgcmV0dXJuIGRyYWdnaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzYWJsZSh2YWx1ZSkge1xuICAgIGRpc2FibGVkID0gdmFsdWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG1vdW50OiBtb3VudCxcbiAgICBkaXNhYmxlOiBkaXNhYmxlLFxuICAgIGlzRHJhZ2dpbmc6IGlzRHJhZ2dpbmdcbiAgfTtcbn1cblxudmFyIE5PUk1BTElaQVRJT05fTUFQID0ge1xuICBTcGFjZWJhcjogXCIgXCIsXG4gIFJpZ2h0OiBBUlJPV19SSUdIVCxcbiAgTGVmdDogQVJST1dfTEVGVCxcbiAgVXA6IEFSUk9XX1VQLFxuICBEb3duOiBBUlJPV19ET1dOXG59O1xuXG5mdW5jdGlvbiBub3JtYWxpemVLZXkoa2V5KSB7XG4gIGtleSA9IGlzU3RyaW5nKGtleSkgPyBrZXkgOiBrZXkua2V5O1xuICByZXR1cm4gTk9STUFMSVpBVElPTl9NQVBba2V5XSB8fCBrZXk7XG59XG5cbnZhciBLRVlCT0FSRF9FVkVOVCA9IFwia2V5ZG93blwiO1xuXG5mdW5jdGlvbiBLZXlib2FyZChTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICB2YXIgX0V2ZW50SW50ZXJmYWNlMTAgPSBFdmVudEludGVyZmFjZShTcGxpZGUyKSxcbiAgICAgIG9uID0gX0V2ZW50SW50ZXJmYWNlMTAub24sXG4gICAgICBiaW5kID0gX0V2ZW50SW50ZXJmYWNlMTAuYmluZCxcbiAgICAgIHVuYmluZCA9IF9FdmVudEludGVyZmFjZTEwLnVuYmluZDtcblxuICB2YXIgcm9vdCA9IFNwbGlkZTIucm9vdDtcbiAgdmFyIHJlc29sdmUgPSBDb21wb25lbnRzMi5EaXJlY3Rpb24ucmVzb2x2ZTtcbiAgdmFyIHRhcmdldDtcbiAgdmFyIGRpc2FibGVkO1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGluaXQoKTtcbiAgICBvbihFVkVOVF9VUERBVEVELCBkZXN0cm95KTtcbiAgICBvbihFVkVOVF9VUERBVEVELCBpbml0KTtcbiAgICBvbihFVkVOVF9NT1ZFLCBvbk1vdmUpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIga2V5Ym9hcmQgPSBvcHRpb25zLmtleWJvYXJkO1xuXG4gICAgaWYgKGtleWJvYXJkKSB7XG4gICAgICB0YXJnZXQgPSBrZXlib2FyZCA9PT0gXCJnbG9iYWxcIiA/IHdpbmRvdyA6IHJvb3Q7XG4gICAgICBiaW5kKHRhcmdldCwgS0VZQk9BUkRfRVZFTlQsIG9uS2V5ZG93bik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICB1bmJpbmQodGFyZ2V0LCBLRVlCT0FSRF9FVkVOVCk7XG4gIH1cblxuICBmdW5jdGlvbiBkaXNhYmxlKHZhbHVlKSB7XG4gICAgZGlzYWJsZWQgPSB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uTW92ZSgpIHtcbiAgICB2YXIgX2Rpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGRpc2FibGVkID0gX2Rpc2FibGVkO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb25LZXlkb3duKGUpIHtcbiAgICBpZiAoIWRpc2FibGVkKSB7XG4gICAgICB2YXIga2V5ID0gbm9ybWFsaXplS2V5KGUpO1xuXG4gICAgICBpZiAoa2V5ID09PSByZXNvbHZlKEFSUk9XX0xFRlQpKSB7XG4gICAgICAgIFNwbGlkZTIuZ28oXCI8XCIpO1xuICAgICAgfSBlbHNlIGlmIChrZXkgPT09IHJlc29sdmUoQVJST1dfUklHSFQpKSB7XG4gICAgICAgIFNwbGlkZTIuZ28oXCI+XCIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1vdW50LFxuICAgIGRlc3Ryb3k6IGRlc3Ryb3ksXG4gICAgZGlzYWJsZTogZGlzYWJsZVxuICB9O1xufVxuXG52YXIgU1JDX0RBVEFfQVRUUklCVVRFID0gREFUQV9BVFRSSUJVVEUgKyBcIi1sYXp5XCI7XG52YXIgU1JDU0VUX0RBVEFfQVRUUklCVVRFID0gU1JDX0RBVEFfQVRUUklCVVRFICsgXCItc3Jjc2V0XCI7XG52YXIgSU1BR0VfU0VMRUNUT1IgPSBcIltcIiArIFNSQ19EQVRBX0FUVFJJQlVURSArIFwiXSwgW1wiICsgU1JDU0VUX0RBVEFfQVRUUklCVVRFICsgXCJdXCI7XG5cbmZ1bmN0aW9uIExhenlMb2FkKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBfRXZlbnRJbnRlcmZhY2UxMSA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpLFxuICAgICAgb24gPSBfRXZlbnRJbnRlcmZhY2UxMS5vbixcbiAgICAgIG9mZiA9IF9FdmVudEludGVyZmFjZTExLm9mZixcbiAgICAgIGJpbmQgPSBfRXZlbnRJbnRlcmZhY2UxMS5iaW5kLFxuICAgICAgZW1pdCA9IF9FdmVudEludGVyZmFjZTExLmVtaXQ7XG5cbiAgdmFyIGlzU2VxdWVudGlhbCA9IG9wdGlvbnMubGF6eUxvYWQgPT09IFwic2VxdWVudGlhbFwiO1xuICB2YXIgZXZlbnRzID0gW0VWRU5UX01PVkVELCBFVkVOVF9TQ1JPTExFRF07XG4gIHZhciBlbnRyaWVzID0gW107XG5cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKG9wdGlvbnMubGF6eUxvYWQpIHtcbiAgICAgIGluaXQoKTtcbiAgICAgIG9uKEVWRU5UX1JFRlJFU0gsIGluaXQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgZW1wdHkoZW50cmllcyk7XG4gICAgcmVnaXN0ZXIoKTtcblxuICAgIGlmIChpc1NlcXVlbnRpYWwpIHtcbiAgICAgIGxvYWROZXh0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZihldmVudHMpO1xuICAgICAgb24oZXZlbnRzLCBjaGVjayk7XG4gICAgICBjaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyKCkge1xuICAgIENvbXBvbmVudHMyLlNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChTbGlkZSkge1xuICAgICAgcXVlcnlBbGwoU2xpZGUuc2xpZGUsIElNQUdFX1NFTEVDVE9SKS5mb3JFYWNoKGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgICAgdmFyIHNyYyA9IGdldEF0dHJpYnV0ZShpbWcsIFNSQ19EQVRBX0FUVFJJQlVURSk7XG4gICAgICAgIHZhciBzcmNzZXQgPSBnZXRBdHRyaWJ1dGUoaW1nLCBTUkNTRVRfREFUQV9BVFRSSUJVVEUpO1xuXG4gICAgICAgIGlmIChzcmMgIT09IGltZy5zcmMgfHwgc3Jjc2V0ICE9PSBpbWcuc3Jjc2V0KSB7XG4gICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3Nlcy5zcGlubmVyO1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBpbWcucGFyZW50RWxlbWVudDtcbiAgICAgICAgICB2YXIgc3Bpbm5lciA9IGNoaWxkKHBhcmVudCwgXCIuXCIgKyBjbGFzc05hbWUpIHx8IGNyZWF0ZShcInNwYW5cIiwgY2xhc3NOYW1lLCBwYXJlbnQpO1xuICAgICAgICAgIGVudHJpZXMucHVzaChbaW1nLCBTbGlkZSwgc3Bpbm5lcl0pO1xuICAgICAgICAgIGltZy5zcmMgfHwgZGlzcGxheShpbWcsIFwibm9uZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBjaGVjaygpIHtcbiAgICBlbnRyaWVzID0gZW50cmllcy5maWx0ZXIoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIHZhciBkaXN0YW5jZSA9IG9wdGlvbnMucGVyUGFnZSAqICgob3B0aW9ucy5wcmVsb2FkUGFnZXMgfHwgMSkgKyAxKSAtIDE7XG4gICAgICByZXR1cm4gZGF0YVsxXS5pc1dpdGhpbihTcGxpZGUyLmluZGV4LCBkaXN0YW5jZSkgPyBsb2FkKGRhdGEpIDogdHJ1ZTtcbiAgICB9KTtcbiAgICBlbnRyaWVzLmxlbmd0aCB8fCBvZmYoZXZlbnRzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvYWQoZGF0YSkge1xuICAgIHZhciBpbWcgPSBkYXRhWzBdO1xuICAgIGFkZENsYXNzKGRhdGFbMV0uc2xpZGUsIENMQVNTX0xPQURJTkcpO1xuICAgIGJpbmQoaW1nLCBcImxvYWQgZXJyb3JcIiwgYXBwbHkob25Mb2FkLCBkYXRhKSk7XG4gICAgc2V0QXR0cmlidXRlKGltZywgXCJzcmNcIiwgZ2V0QXR0cmlidXRlKGltZywgU1JDX0RBVEFfQVRUUklCVVRFKSk7XG4gICAgc2V0QXR0cmlidXRlKGltZywgXCJzcmNzZXRcIiwgZ2V0QXR0cmlidXRlKGltZywgU1JDU0VUX0RBVEFfQVRUUklCVVRFKSk7XG4gICAgcmVtb3ZlQXR0cmlidXRlKGltZywgU1JDX0RBVEFfQVRUUklCVVRFKTtcbiAgICByZW1vdmVBdHRyaWJ1dGUoaW1nLCBTUkNTRVRfREFUQV9BVFRSSUJVVEUpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25Mb2FkKGRhdGEsIGUpIHtcbiAgICB2YXIgaW1nID0gZGF0YVswXSxcbiAgICAgICAgU2xpZGUgPSBkYXRhWzFdO1xuICAgIHJlbW92ZUNsYXNzKFNsaWRlLnNsaWRlLCBDTEFTU19MT0FESU5HKTtcblxuICAgIGlmIChlLnR5cGUgIT09IFwiZXJyb3JcIikge1xuICAgICAgcmVtb3ZlKGRhdGFbMl0pO1xuICAgICAgZGlzcGxheShpbWcsIFwiXCIpO1xuICAgICAgZW1pdChFVkVOVF9MQVpZTE9BRF9MT0FERUQsIGltZywgU2xpZGUpO1xuICAgICAgZW1pdChFVkVOVF9SRVNJWkUpO1xuICAgIH1cblxuICAgIGlzU2VxdWVudGlhbCAmJiBsb2FkTmV4dCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbG9hZE5leHQoKSB7XG4gICAgZW50cmllcy5sZW5ndGggJiYgbG9hZChlbnRyaWVzLnNoaWZ0KCkpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbW91bnQsXG4gICAgZGVzdHJveTogYXBwbHkoZW1wdHksIGVudHJpZXMpLFxuICAgIGNoZWNrOiBjaGVja1xuICB9O1xufVxuXG5mdW5jdGlvbiBQYWdpbmF0aW9uKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBldmVudCA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpO1xuICB2YXIgb24gPSBldmVudC5vbixcbiAgICAgIGVtaXQgPSBldmVudC5lbWl0LFxuICAgICAgYmluZCA9IGV2ZW50LmJpbmQ7XG4gIHZhciBTbGlkZXMgPSBDb21wb25lbnRzMi5TbGlkZXMsXG4gICAgICBFbGVtZW50cyA9IENvbXBvbmVudHMyLkVsZW1lbnRzLFxuICAgICAgQ29udHJvbGxlciA9IENvbXBvbmVudHMyLkNvbnRyb2xsZXI7XG4gIHZhciBoYXNGb2N1cyA9IENvbnRyb2xsZXIuaGFzRm9jdXMsXG4gICAgICBnZXRJbmRleCA9IENvbnRyb2xsZXIuZ2V0SW5kZXgsXG4gICAgICBnbyA9IENvbnRyb2xsZXIuZ287XG4gIHZhciByZXNvbHZlID0gQ29tcG9uZW50czIuRGlyZWN0aW9uLnJlc29sdmU7XG4gIHZhciBwbGFjZWhvbGRlciA9IEVsZW1lbnRzLnBhZ2luYXRpb247XG4gIHZhciBpdGVtcyA9IFtdO1xuICB2YXIgbGlzdDtcbiAgdmFyIHBhZ2luYXRpb25DbGFzc2VzO1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIGRlc3Ryb3koKTtcbiAgICBvbihbRVZFTlRfVVBEQVRFRCwgRVZFTlRfUkVGUkVTSCwgRVZFTlRfRU5EX0lOREVYX0NIQU5HRURdLCBtb3VudCk7XG4gICAgdmFyIGVuYWJsZWQgPSBvcHRpb25zLnBhZ2luYXRpb247XG4gICAgcGxhY2Vob2xkZXIgJiYgZGlzcGxheShwbGFjZWhvbGRlciwgZW5hYmxlZCA/IFwiXCIgOiBcIm5vbmVcIik7XG5cbiAgICBpZiAoZW5hYmxlZCkge1xuICAgICAgb24oW0VWRU5UX01PVkUsIEVWRU5UX1NDUk9MTCwgRVZFTlRfU0NST0xMRURdLCB1cGRhdGUpO1xuICAgICAgY3JlYXRlUGFnaW5hdGlvbigpO1xuICAgICAgdXBkYXRlKCk7XG4gICAgICBlbWl0KEVWRU5UX1BBR0lOQVRJT05fTU9VTlRFRCwge1xuICAgICAgICBsaXN0OiBsaXN0LFxuICAgICAgICBpdGVtczogaXRlbXNcbiAgICAgIH0sIGdldEF0KFNwbGlkZTIuaW5kZXgpKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGlmIChsaXN0KSB7XG4gICAgICByZW1vdmUocGxhY2Vob2xkZXIgPyBzbGljZShsaXN0LmNoaWxkcmVuKSA6IGxpc3QpO1xuICAgICAgcmVtb3ZlQ2xhc3MobGlzdCwgcGFnaW5hdGlvbkNsYXNzZXMpO1xuICAgICAgZW1wdHkoaXRlbXMpO1xuICAgICAgbGlzdCA9IG51bGw7XG4gICAgfVxuXG4gICAgZXZlbnQuZGVzdHJveSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlUGFnaW5hdGlvbigpIHtcbiAgICB2YXIgbGVuZ3RoID0gU3BsaWRlMi5sZW5ndGg7XG4gICAgdmFyIGNsYXNzZXMgPSBvcHRpb25zLmNsYXNzZXMsXG4gICAgICAgIGkxOG4gPSBvcHRpb25zLmkxOG4sXG4gICAgICAgIHBlclBhZ2UgPSBvcHRpb25zLnBlclBhZ2U7XG4gICAgdmFyIG1heCA9IGhhc0ZvY3VzKCkgPyBDb250cm9sbGVyLmdldEVuZCgpICsgMSA6IGNlaWwobGVuZ3RoIC8gcGVyUGFnZSk7XG4gICAgbGlzdCA9IHBsYWNlaG9sZGVyIHx8IGNyZWF0ZShcInVsXCIsIGNsYXNzZXMucGFnaW5hdGlvbiwgRWxlbWVudHMudHJhY2sucGFyZW50RWxlbWVudCk7XG4gICAgYWRkQ2xhc3MobGlzdCwgcGFnaW5hdGlvbkNsYXNzZXMgPSBDTEFTU19QQUdJTkFUSU9OICsgXCItLVwiICsgZ2V0RGlyZWN0aW9uKCkpO1xuICAgIHNldEF0dHJpYnV0ZShsaXN0LCBST0xFLCBcInRhYmxpc3RcIik7XG4gICAgc2V0QXR0cmlidXRlKGxpc3QsIEFSSUFfTEFCRUwsIGkxOG4uc2VsZWN0KTtcbiAgICBzZXRBdHRyaWJ1dGUobGlzdCwgQVJJQV9PUklFTlRBVElPTiwgZ2V0RGlyZWN0aW9uKCkgPT09IFRUQiA/IFwidmVydGljYWxcIiA6IFwiXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYXg7IGkrKykge1xuICAgICAgdmFyIGxpID0gY3JlYXRlKFwibGlcIiwgbnVsbCwgbGlzdCk7XG4gICAgICB2YXIgYnV0dG9uID0gY3JlYXRlKFwiYnV0dG9uXCIsIHtcbiAgICAgICAgY2xhc3M6IGNsYXNzZXMucGFnZSxcbiAgICAgICAgdHlwZTogXCJidXR0b25cIlxuICAgICAgfSwgbGkpO1xuICAgICAgdmFyIGNvbnRyb2xzID0gU2xpZGVzLmdldEluKGkpLm1hcChmdW5jdGlvbiAoU2xpZGUpIHtcbiAgICAgICAgcmV0dXJuIFNsaWRlLnNsaWRlLmlkO1xuICAgICAgfSk7XG4gICAgICB2YXIgdGV4dCA9ICFoYXNGb2N1cygpICYmIHBlclBhZ2UgPiAxID8gaTE4bi5wYWdlWCA6IGkxOG4uc2xpZGVYO1xuICAgICAgYmluZChidXR0b24sIFwiY2xpY2tcIiwgYXBwbHkob25DbGljaywgaSkpO1xuXG4gICAgICBpZiAob3B0aW9ucy5wYWdpbmF0aW9uS2V5Ym9hcmQpIHtcbiAgICAgICAgYmluZChidXR0b24sIFwia2V5ZG93blwiLCBhcHBseShvbktleWRvd24sIGkpKTtcbiAgICAgIH1cblxuICAgICAgc2V0QXR0cmlidXRlKGxpLCBST0xFLCBcInByZXNlbnRhdGlvblwiKTtcbiAgICAgIHNldEF0dHJpYnV0ZShidXR0b24sIFJPTEUsIFwidGFiXCIpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9DT05UUk9MUywgY29udHJvbHMuam9pbihcIiBcIikpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgQVJJQV9MQUJFTCwgZm9ybWF0KHRleHQsIGkgKyAxKSk7XG4gICAgICBzZXRBdHRyaWJ1dGUoYnV0dG9uLCBUQUJfSU5ERVgsIC0xKTtcbiAgICAgIGl0ZW1zLnB1c2goe1xuICAgICAgICBsaTogbGksXG4gICAgICAgIGJ1dHRvbjogYnV0dG9uLFxuICAgICAgICBwYWdlOiBpXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBvbkNsaWNrKHBhZ2UpIHtcbiAgICBnbyhcIj5cIiArIHBhZ2UsIHRydWUpO1xuICB9XG5cbiAgZnVuY3Rpb24gb25LZXlkb3duKHBhZ2UsIGUpIHtcbiAgICB2YXIgbGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuICAgIHZhciBrZXkgPSBub3JtYWxpemVLZXkoZSk7XG4gICAgdmFyIGRpciA9IGdldERpcmVjdGlvbigpO1xuICAgIHZhciBuZXh0UGFnZSA9IC0xO1xuXG4gICAgaWYgKGtleSA9PT0gcmVzb2x2ZShBUlJPV19SSUdIVCwgZmFsc2UsIGRpcikpIHtcbiAgICAgIG5leHRQYWdlID0gKytwYWdlICUgbGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSByZXNvbHZlKEFSUk9XX0xFRlQsIGZhbHNlLCBkaXIpKSB7XG4gICAgICBuZXh0UGFnZSA9ICgtLXBhZ2UgKyBsZW5ndGgpICUgbGVuZ3RoO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIkhvbWVcIikge1xuICAgICAgbmV4dFBhZ2UgPSAwO1xuICAgIH0gZWxzZSBpZiAoa2V5ID09PSBcIkVuZFwiKSB7XG4gICAgICBuZXh0UGFnZSA9IGxlbmd0aCAtIDE7XG4gICAgfVxuXG4gICAgdmFyIGl0ZW0gPSBpdGVtc1tuZXh0UGFnZV07XG5cbiAgICBpZiAoaXRlbSkge1xuICAgICAgZm9jdXMoaXRlbS5idXR0b24pO1xuICAgICAgZ28oXCI+XCIgKyBuZXh0UGFnZSk7XG4gICAgICBwcmV2ZW50KGUsIHRydWUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGdldERpcmVjdGlvbigpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5wYWdpbmF0aW9uRGlyZWN0aW9uIHx8IG9wdGlvbnMuZGlyZWN0aW9uO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QXQoaW5kZXgpIHtcbiAgICByZXR1cm4gaXRlbXNbQ29udHJvbGxlci50b1BhZ2UoaW5kZXgpXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICB2YXIgcHJldiA9IGdldEF0KGdldEluZGV4KHRydWUpKTtcbiAgICB2YXIgY3VyciA9IGdldEF0KGdldEluZGV4KCkpO1xuXG4gICAgaWYgKHByZXYpIHtcbiAgICAgIHZhciBidXR0b24gPSBwcmV2LmJ1dHRvbjtcbiAgICAgIHJlbW92ZUNsYXNzKGJ1dHRvbiwgQ0xBU1NfQUNUSVZFKTtcbiAgICAgIHJlbW92ZUF0dHJpYnV0ZShidXR0b24sIEFSSUFfU0VMRUNURUQpO1xuICAgICAgc2V0QXR0cmlidXRlKGJ1dHRvbiwgVEFCX0lOREVYLCAtMSk7XG4gICAgfVxuXG4gICAgaWYgKGN1cnIpIHtcbiAgICAgIHZhciBfYnV0dG9uID0gY3Vyci5idXR0b247XG4gICAgICBhZGRDbGFzcyhfYnV0dG9uLCBDTEFTU19BQ1RJVkUpO1xuICAgICAgc2V0QXR0cmlidXRlKF9idXR0b24sIEFSSUFfU0VMRUNURUQsIHRydWUpO1xuICAgICAgc2V0QXR0cmlidXRlKF9idXR0b24sIFRBQl9JTkRFWCwgXCJcIik7XG4gICAgfVxuXG4gICAgZW1pdChFVkVOVF9QQUdJTkFUSU9OX1VQREFURUQsIHtcbiAgICAgIGxpc3Q6IGxpc3QsXG4gICAgICBpdGVtczogaXRlbXNcbiAgICB9LCBwcmV2LCBjdXJyKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaXRlbXM6IGl0ZW1zLFxuICAgIG1vdW50OiBtb3VudCxcbiAgICBkZXN0cm95OiBkZXN0cm95LFxuICAgIGdldEF0OiBnZXRBdCxcbiAgICB1cGRhdGU6IHVwZGF0ZVxuICB9O1xufVxuXG52YXIgVFJJR0dFUl9LRVlTID0gW1wiIFwiLCBcIkVudGVyXCJdO1xuXG5mdW5jdGlvbiBTeW5jKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBpc05hdmlnYXRpb24gPSBvcHRpb25zLmlzTmF2aWdhdGlvbixcbiAgICAgIHNsaWRlRm9jdXMgPSBvcHRpb25zLnNsaWRlRm9jdXM7XG4gIHZhciBldmVudHMgPSBbXTtcblxuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBTcGxpZGUyLnNwbGlkZXMuZm9yRWFjaChmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICBpZiAoIXRhcmdldC5pc1BhcmVudCkge1xuICAgICAgICBzeW5jKFNwbGlkZTIsIHRhcmdldC5zcGxpZGUpO1xuICAgICAgICBzeW5jKHRhcmdldC5zcGxpZGUsIFNwbGlkZTIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGlzTmF2aWdhdGlvbikge1xuICAgICAgbmF2aWdhdGUoKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGV2ZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgZXZlbnQuZGVzdHJveSgpO1xuICAgIH0pO1xuICAgIGVtcHR5KGV2ZW50cyk7XG4gIH1cblxuICBmdW5jdGlvbiByZW1vdW50KCkge1xuICAgIGRlc3Ryb3koKTtcbiAgICBtb3VudCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gc3luYyhzcGxpZGUsIHRhcmdldCkge1xuICAgIHZhciBldmVudCA9IEV2ZW50SW50ZXJmYWNlKHNwbGlkZSk7XG4gICAgZXZlbnQub24oRVZFTlRfTU9WRSwgZnVuY3Rpb24gKGluZGV4LCBwcmV2LCBkZXN0KSB7XG4gICAgICB0YXJnZXQuZ28odGFyZ2V0LmlzKExPT1ApID8gZGVzdCA6IGluZGV4KTtcbiAgICB9KTtcbiAgICBldmVudHMucHVzaChldmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBuYXZpZ2F0ZSgpIHtcbiAgICB2YXIgZXZlbnQgPSBFdmVudEludGVyZmFjZShTcGxpZGUyKTtcbiAgICB2YXIgb24gPSBldmVudC5vbjtcbiAgICBvbihFVkVOVF9DTElDSywgb25DbGljayk7XG4gICAgb24oRVZFTlRfU0xJREVfS0VZRE9XTiwgb25LZXlkb3duKTtcbiAgICBvbihbRVZFTlRfTU9VTlRFRCwgRVZFTlRfVVBEQVRFRF0sIHVwZGF0ZSk7XG4gICAgZXZlbnRzLnB1c2goZXZlbnQpO1xuICAgIGV2ZW50LmVtaXQoRVZFTlRfTkFWSUdBVElPTl9NT1VOVEVELCBTcGxpZGUyLnNwbGlkZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgIHNldEF0dHJpYnV0ZShDb21wb25lbnRzMi5FbGVtZW50cy5saXN0LCBBUklBX09SSUVOVEFUSU9OLCBvcHRpb25zLmRpcmVjdGlvbiA9PT0gVFRCID8gXCJ2ZXJ0aWNhbFwiIDogXCJcIik7XG4gIH1cblxuICBmdW5jdGlvbiBvbkNsaWNrKFNsaWRlKSB7XG4gICAgU3BsaWRlMi5nbyhTbGlkZS5pbmRleCk7XG4gIH1cblxuICBmdW5jdGlvbiBvbktleWRvd24oU2xpZGUsIGUpIHtcbiAgICBpZiAoaW5jbHVkZXMoVFJJR0dFUl9LRVlTLCBub3JtYWxpemVLZXkoZSkpKSB7XG4gICAgICBvbkNsaWNrKFNsaWRlKTtcbiAgICAgIHByZXZlbnQoZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBzZXR1cDogYXBwbHkoQ29tcG9uZW50czIuTWVkaWEuc2V0LCB7XG4gICAgICBzbGlkZUZvY3VzOiBpc1VuZGVmaW5lZChzbGlkZUZvY3VzKSA/IGlzTmF2aWdhdGlvbiA6IHNsaWRlRm9jdXNcbiAgICB9LCB0cnVlKSxcbiAgICBtb3VudDogbW91bnQsXG4gICAgZGVzdHJveTogZGVzdHJveSxcbiAgICByZW1vdW50OiByZW1vdW50XG4gIH07XG59XG5cbmZ1bmN0aW9uIFdoZWVsKFNwbGlkZTIsIENvbXBvbmVudHMyLCBvcHRpb25zKSB7XG4gIHZhciBfRXZlbnRJbnRlcmZhY2UxMiA9IEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpLFxuICAgICAgYmluZCA9IF9FdmVudEludGVyZmFjZTEyLmJpbmQ7XG5cbiAgdmFyIGxhc3RUaW1lID0gMDtcblxuICBmdW5jdGlvbiBtb3VudCgpIHtcbiAgICBpZiAob3B0aW9ucy53aGVlbCkge1xuICAgICAgYmluZChDb21wb25lbnRzMi5FbGVtZW50cy50cmFjaywgXCJ3aGVlbFwiLCBvbldoZWVsLCBTQ1JPTExfTElTVEVORVJfT1BUSU9OUyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gb25XaGVlbChlKSB7XG4gICAgaWYgKGUuY2FuY2VsYWJsZSkge1xuICAgICAgdmFyIGRlbHRhWSA9IGUuZGVsdGFZO1xuICAgICAgdmFyIGJhY2t3YXJkcyA9IGRlbHRhWSA8IDA7XG4gICAgICB2YXIgdGltZVN0YW1wID0gdGltZU9mKGUpO1xuXG4gICAgICB2YXIgX21pbiA9IG9wdGlvbnMud2hlZWxNaW5UaHJlc2hvbGQgfHwgMDtcblxuICAgICAgdmFyIHNsZWVwID0gb3B0aW9ucy53aGVlbFNsZWVwIHx8IDA7XG5cbiAgICAgIGlmIChhYnMoZGVsdGFZKSA+IF9taW4gJiYgdGltZVN0YW1wIC0gbGFzdFRpbWUgPiBzbGVlcCkge1xuICAgICAgICBTcGxpZGUyLmdvKGJhY2t3YXJkcyA/IFwiPFwiIDogXCI+XCIpO1xuICAgICAgICBsYXN0VGltZSA9IHRpbWVTdGFtcDtcbiAgICAgIH1cblxuICAgICAgc2hvdWxkUHJldmVudChiYWNrd2FyZHMpICYmIHByZXZlbnQoZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkUHJldmVudChiYWNrd2FyZHMpIHtcbiAgICByZXR1cm4gIW9wdGlvbnMucmVsZWFzZVdoZWVsIHx8IFNwbGlkZTIuc3RhdGUuaXMoTU9WSU5HKSB8fCBDb21wb25lbnRzMi5Db250cm9sbGVyLmdldEFkamFjZW50KGJhY2t3YXJkcykgIT09IC0xO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbW91bnRcbiAgfTtcbn1cblxudmFyIFNSX1JFTU9WQUxfREVMQVkgPSA5MDtcblxuZnVuY3Rpb24gTGl2ZShTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICB2YXIgX0V2ZW50SW50ZXJmYWNlMTMgPSBFdmVudEludGVyZmFjZShTcGxpZGUyKSxcbiAgICAgIG9uID0gX0V2ZW50SW50ZXJmYWNlMTMub247XG5cbiAgdmFyIHRyYWNrID0gQ29tcG9uZW50czIuRWxlbWVudHMudHJhY2s7XG4gIHZhciBlbmFibGVkID0gb3B0aW9ucy5saXZlICYmICFvcHRpb25zLmlzTmF2aWdhdGlvbjtcbiAgdmFyIHNyID0gY3JlYXRlKFwic3BhblwiLCBDTEFTU19TUik7XG4gIHZhciBpbnRlcnZhbCA9IFJlcXVlc3RJbnRlcnZhbChTUl9SRU1PVkFMX0RFTEFZLCBhcHBseSh0b2dnbGUsIGZhbHNlKSk7XG5cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgIGRpc2FibGUoIUNvbXBvbmVudHMyLkF1dG9wbGF5LmlzUGF1c2VkKCkpO1xuICAgICAgc2V0QXR0cmlidXRlKHRyYWNrLCBBUklBX0FUT01JQywgdHJ1ZSk7XG4gICAgICBzci50ZXh0Q29udGVudCA9IFwiXFx1MjAyNlwiO1xuICAgICAgb24oRVZFTlRfQVVUT1BMQVlfUExBWSwgYXBwbHkoZGlzYWJsZSwgdHJ1ZSkpO1xuICAgICAgb24oRVZFTlRfQVVUT1BMQVlfUEFVU0UsIGFwcGx5KGRpc2FibGUsIGZhbHNlKSk7XG4gICAgICBvbihbRVZFTlRfTU9WRUQsIEVWRU5UX1NDUk9MTEVEXSwgYXBwbHkodG9nZ2xlLCB0cnVlKSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdG9nZ2xlKGFjdGl2ZSkge1xuICAgIHNldEF0dHJpYnV0ZSh0cmFjaywgQVJJQV9CVVNZLCBhY3RpdmUpO1xuXG4gICAgaWYgKGFjdGl2ZSkge1xuICAgICAgYXBwZW5kKHRyYWNrLCBzcik7XG4gICAgICBpbnRlcnZhbC5zdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZW1vdmUoc3IpO1xuICAgICAgaW50ZXJ2YWwuY2FuY2VsKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICByZW1vdmVBdHRyaWJ1dGUodHJhY2ssIFtBUklBX0xJVkUsIEFSSUFfQVRPTUlDLCBBUklBX0JVU1ldKTtcbiAgICByZW1vdmUoc3IpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGlzYWJsZShkaXNhYmxlZCkge1xuICAgIGlmIChlbmFibGVkKSB7XG4gICAgICBzZXRBdHRyaWJ1dGUodHJhY2ssIEFSSUFfTElWRSwgZGlzYWJsZWQgPyBcIm9mZlwiIDogXCJwb2xpdGVcIik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtb3VudDogbW91bnQsXG4gICAgZGlzYWJsZTogZGlzYWJsZSxcbiAgICBkZXN0cm95OiBkZXN0cm95XG4gIH07XG59XG5cbnZhciBDb21wb25lbnRDb25zdHJ1Y3RvcnMgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7XG4gIF9fcHJvdG9fXzogbnVsbCxcbiAgTWVkaWE6IE1lZGlhLFxuICBEaXJlY3Rpb246IERpcmVjdGlvbixcbiAgRWxlbWVudHM6IEVsZW1lbnRzLFxuICBTbGlkZXM6IFNsaWRlcyxcbiAgTGF5b3V0OiBMYXlvdXQsXG4gIENsb25lczogQ2xvbmVzLFxuICBNb3ZlOiBNb3ZlLFxuICBDb250cm9sbGVyOiBDb250cm9sbGVyLFxuICBBcnJvd3M6IEFycm93cyxcbiAgQXV0b3BsYXk6IEF1dG9wbGF5LFxuICBDb3ZlcjogQ292ZXIsXG4gIFNjcm9sbDogU2Nyb2xsLFxuICBEcmFnOiBEcmFnLFxuICBLZXlib2FyZDogS2V5Ym9hcmQsXG4gIExhenlMb2FkOiBMYXp5TG9hZCxcbiAgUGFnaW5hdGlvbjogUGFnaW5hdGlvbixcbiAgU3luYzogU3luYyxcbiAgV2hlZWw6IFdoZWVsLFxuICBMaXZlOiBMaXZlXG59KTtcbnZhciBJMThOID0ge1xuICBwcmV2OiBcIlByZXZpb3VzIHNsaWRlXCIsXG4gIG5leHQ6IFwiTmV4dCBzbGlkZVwiLFxuICBmaXJzdDogXCJHbyB0byBmaXJzdCBzbGlkZVwiLFxuICBsYXN0OiBcIkdvIHRvIGxhc3Qgc2xpZGVcIixcbiAgc2xpZGVYOiBcIkdvIHRvIHNsaWRlICVzXCIsXG4gIHBhZ2VYOiBcIkdvIHRvIHBhZ2UgJXNcIixcbiAgcGxheTogXCJTdGFydCBhdXRvcGxheVwiLFxuICBwYXVzZTogXCJQYXVzZSBhdXRvcGxheVwiLFxuICBjYXJvdXNlbDogXCJjYXJvdXNlbFwiLFxuICBzbGlkZTogXCJzbGlkZVwiLFxuICBzZWxlY3Q6IFwiU2VsZWN0IGEgc2xpZGUgdG8gc2hvd1wiLFxuICBzbGlkZUxhYmVsOiBcIiVzIG9mICVzXCJcbn07XG52YXIgREVGQVVMVFMgPSB7XG4gIHR5cGU6IFwic2xpZGVcIixcbiAgcm9sZTogXCJyZWdpb25cIixcbiAgc3BlZWQ6IDQwMCxcbiAgcGVyUGFnZTogMSxcbiAgY2xvbmVTdGF0dXM6IHRydWUsXG4gIGFycm93czogdHJ1ZSxcbiAgcGFnaW5hdGlvbjogdHJ1ZSxcbiAgcGFnaW5hdGlvbktleWJvYXJkOiB0cnVlLFxuICBpbnRlcnZhbDogNWUzLFxuICBwYXVzZU9uSG92ZXI6IHRydWUsXG4gIHBhdXNlT25Gb2N1czogdHJ1ZSxcbiAgcmVzZXRQcm9ncmVzczogdHJ1ZSxcbiAgZWFzaW5nOiBcImN1YmljLWJlemllcigwLjI1LCAxLCAwLjUsIDEpXCIsXG4gIGRyYWc6IHRydWUsXG4gIGRpcmVjdGlvbjogXCJsdHJcIixcbiAgdHJpbVNwYWNlOiB0cnVlLFxuICBmb2N1c2FibGVOb2RlczogXCJhLCBidXR0b24sIHRleHRhcmVhLCBpbnB1dCwgc2VsZWN0LCBpZnJhbWVcIixcbiAgbGl2ZTogdHJ1ZSxcbiAgY2xhc3NlczogQ0xBU1NFUyxcbiAgaTE4bjogSTE4TixcbiAgcmVkdWNlZE1vdGlvbjoge1xuICAgIHNwZWVkOiAwLFxuICAgIHJld2luZFNwZWVkOiAwLFxuICAgIGF1dG9wbGF5OiBcInBhdXNlXCJcbiAgfVxufTtcblxuZnVuY3Rpb24gRmFkZShTcGxpZGUyLCBDb21wb25lbnRzMiwgb3B0aW9ucykge1xuICB2YXIgU2xpZGVzID0gQ29tcG9uZW50czIuU2xpZGVzO1xuXG4gIGZ1bmN0aW9uIG1vdW50KCkge1xuICAgIEV2ZW50SW50ZXJmYWNlKFNwbGlkZTIpLm9uKFtFVkVOVF9NT1VOVEVELCBFVkVOVF9SRUZSRVNIXSwgaW5pdCk7XG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIFNsaWRlcy5mb3JFYWNoKGZ1bmN0aW9uIChTbGlkZSkge1xuICAgICAgU2xpZGUuc3R5bGUoXCJ0cmFuc2Zvcm1cIiwgXCJ0cmFuc2xhdGVYKC1cIiArIDEwMCAqIFNsaWRlLmluZGV4ICsgXCIlKVwiKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0KGluZGV4LCBkb25lKSB7XG4gICAgU2xpZGVzLnN0eWxlKFwidHJhbnNpdGlvblwiLCBcIm9wYWNpdHkgXCIgKyBvcHRpb25zLnNwZWVkICsgXCJtcyBcIiArIG9wdGlvbnMuZWFzaW5nKTtcbiAgICBuZXh0VGljayhkb25lKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1vdW50LFxuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBjYW5jZWw6IG5vb3BcbiAgfTtcbn1cblxuZnVuY3Rpb24gU2xpZGUoU3BsaWRlMiwgQ29tcG9uZW50czIsIG9wdGlvbnMpIHtcbiAgdmFyIE1vdmUgPSBDb21wb25lbnRzMi5Nb3ZlLFxuICAgICAgQ29udHJvbGxlciA9IENvbXBvbmVudHMyLkNvbnRyb2xsZXIsXG4gICAgICBTY3JvbGwgPSBDb21wb25lbnRzMi5TY3JvbGw7XG4gIHZhciBsaXN0ID0gQ29tcG9uZW50czIuRWxlbWVudHMubGlzdDtcbiAgdmFyIHRyYW5zaXRpb24gPSBhcHBseShzdHlsZSwgbGlzdCwgXCJ0cmFuc2l0aW9uXCIpO1xuICB2YXIgZW5kQ2FsbGJhY2s7XG5cbiAgZnVuY3Rpb24gbW91bnQoKSB7XG4gICAgRXZlbnRJbnRlcmZhY2UoU3BsaWRlMikuYmluZChsaXN0LCBcInRyYW5zaXRpb25lbmRcIiwgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLnRhcmdldCA9PT0gbGlzdCAmJiBlbmRDYWxsYmFjaykge1xuICAgICAgICBjYW5jZWwoKTtcbiAgICAgICAgZW5kQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0KGluZGV4LCBkb25lKSB7XG4gICAgdmFyIGRlc3RpbmF0aW9uID0gTW92ZS50b1Bvc2l0aW9uKGluZGV4LCB0cnVlKTtcbiAgICB2YXIgcG9zaXRpb24gPSBNb3ZlLmdldFBvc2l0aW9uKCk7XG4gICAgdmFyIHNwZWVkID0gZ2V0U3BlZWQoaW5kZXgpO1xuXG4gICAgaWYgKGFicyhkZXN0aW5hdGlvbiAtIHBvc2l0aW9uKSA+PSAxICYmIHNwZWVkID49IDEpIHtcbiAgICAgIGlmIChvcHRpb25zLnVzZVNjcm9sbCkge1xuICAgICAgICBTY3JvbGwuc2Nyb2xsKGRlc3RpbmF0aW9uLCBzcGVlZCwgZmFsc2UsIGRvbmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdHJhbnNpdGlvbihcInRyYW5zZm9ybSBcIiArIHNwZWVkICsgXCJtcyBcIiArIG9wdGlvbnMuZWFzaW5nKTtcbiAgICAgICAgTW92ZS50cmFuc2xhdGUoZGVzdGluYXRpb24sIHRydWUpO1xuICAgICAgICBlbmRDYWxsYmFjayA9IGRvbmU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIE1vdmUuanVtcChpbmRleCk7XG4gICAgICBkb25lKCk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIHRyYW5zaXRpb24oXCJcIik7XG4gICAgU2Nyb2xsLmNhbmNlbCgpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0U3BlZWQoaW5kZXgpIHtcbiAgICB2YXIgcmV3aW5kU3BlZWQgPSBvcHRpb25zLnJld2luZFNwZWVkO1xuXG4gICAgaWYgKFNwbGlkZTIuaXMoU0xJREUpICYmIHJld2luZFNwZWVkKSB7XG4gICAgICB2YXIgcHJldiA9IENvbnRyb2xsZXIuZ2V0SW5kZXgodHJ1ZSk7XG4gICAgICB2YXIgZW5kID0gQ29udHJvbGxlci5nZXRFbmQoKTtcblxuICAgICAgaWYgKHByZXYgPT09IDAgJiYgaW5kZXggPj0gZW5kIHx8IHByZXYgPj0gZW5kICYmIGluZGV4ID09PSAwKSB7XG4gICAgICAgIHJldHVybiByZXdpbmRTcGVlZDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucy5zcGVlZDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbW91bnQ6IG1vdW50LFxuICAgIHN0YXJ0OiBzdGFydCxcbiAgICBjYW5jZWw6IGNhbmNlbFxuICB9O1xufVxuXG52YXIgX1NwbGlkZSA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIF9TcGxpZGUodGFyZ2V0LCBvcHRpb25zKSB7XG4gICAgdGhpcy5ldmVudCA9IEV2ZW50SW50ZXJmYWNlKCk7XG4gICAgdGhpcy5Db21wb25lbnRzID0ge307XG4gICAgdGhpcy5zdGF0ZSA9IFN0YXRlKENSRUFURUQpO1xuICAgIHRoaXMuc3BsaWRlcyA9IFtdO1xuICAgIHRoaXMuX28gPSB7fTtcbiAgICB0aGlzLl9FID0ge307XG4gICAgdmFyIHJvb3QgPSBpc1N0cmluZyh0YXJnZXQpID8gcXVlcnkoZG9jdW1lbnQsIHRhcmdldCkgOiB0YXJnZXQ7XG4gICAgYXNzZXJ0KHJvb3QsIHJvb3QgKyBcIiBpcyBpbnZhbGlkLlwiKTtcbiAgICB0aGlzLnJvb3QgPSByb290O1xuICAgIG9wdGlvbnMgPSBtZXJnZSh7XG4gICAgICBsYWJlbDogZ2V0QXR0cmlidXRlKHJvb3QsIEFSSUFfTEFCRUwpIHx8IFwiXCIsXG4gICAgICBsYWJlbGxlZGJ5OiBnZXRBdHRyaWJ1dGUocm9vdCwgQVJJQV9MQUJFTExFREJZKSB8fCBcIlwiXG4gICAgfSwgREVGQVVMVFMsIF9TcGxpZGUuZGVmYXVsdHMsIG9wdGlvbnMgfHwge30pO1xuXG4gICAgdHJ5IHtcbiAgICAgIG1lcmdlKG9wdGlvbnMsIEpTT04ucGFyc2UoZ2V0QXR0cmlidXRlKHJvb3QsIERBVEFfQVRUUklCVVRFKSkpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGFzc2VydChmYWxzZSwgXCJJbnZhbGlkIEpTT05cIik7XG4gICAgfVxuXG4gICAgdGhpcy5fbyA9IE9iamVjdC5jcmVhdGUobWVyZ2Uoe30sIG9wdGlvbnMpKTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBfU3BsaWRlLnByb3RvdHlwZTtcblxuICBfcHJvdG8ubW91bnQgPSBmdW5jdGlvbiBtb3VudChFeHRlbnNpb25zLCBUcmFuc2l0aW9uKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBzdGF0ZSA9IHRoaXMuc3RhdGUsXG4gICAgICAgIENvbXBvbmVudHMyID0gdGhpcy5Db21wb25lbnRzO1xuICAgIGFzc2VydChzdGF0ZS5pcyhbQ1JFQVRFRCwgREVTVFJPWUVEXSksIFwiQWxyZWFkeSBtb3VudGVkIVwiKTtcbiAgICBzdGF0ZS5zZXQoQ1JFQVRFRCk7XG4gICAgdGhpcy5fQyA9IENvbXBvbmVudHMyO1xuICAgIHRoaXMuX1QgPSBUcmFuc2l0aW9uIHx8IHRoaXMuX1QgfHwgKHRoaXMuaXMoRkFERSkgPyBGYWRlIDogU2xpZGUpO1xuICAgIHRoaXMuX0UgPSBFeHRlbnNpb25zIHx8IHRoaXMuX0U7XG4gICAgdmFyIENvbnN0cnVjdG9ycyA9IGFzc2lnbih7fSwgQ29tcG9uZW50Q29uc3RydWN0b3JzLCB0aGlzLl9FLCB7XG4gICAgICBUcmFuc2l0aW9uOiB0aGlzLl9UXG4gICAgfSk7XG4gICAgZm9yT3duKENvbnN0cnVjdG9ycywgZnVuY3Rpb24gKENvbXBvbmVudCwga2V5KSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gQ29tcG9uZW50KF90aGlzLCBDb21wb25lbnRzMiwgX3RoaXMuX28pO1xuICAgICAgQ29tcG9uZW50czJba2V5XSA9IGNvbXBvbmVudDtcbiAgICAgIGNvbXBvbmVudC5zZXR1cCAmJiBjb21wb25lbnQuc2V0dXAoKTtcbiAgICB9KTtcbiAgICBmb3JPd24oQ29tcG9uZW50czIsIGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5tb3VudCAmJiBjb21wb25lbnQubW91bnQoKTtcbiAgICB9KTtcbiAgICB0aGlzLmVtaXQoRVZFTlRfTU9VTlRFRCk7XG4gICAgYWRkQ2xhc3ModGhpcy5yb290LCBDTEFTU19JTklUSUFMSVpFRCk7XG4gICAgc3RhdGUuc2V0KElETEUpO1xuICAgIHRoaXMuZW1pdChFVkVOVF9SRUFEWSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX3Byb3RvLnN5bmMgPSBmdW5jdGlvbiBzeW5jKHNwbGlkZSkge1xuICAgIHRoaXMuc3BsaWRlcy5wdXNoKHtcbiAgICAgIHNwbGlkZTogc3BsaWRlXG4gICAgfSk7XG4gICAgc3BsaWRlLnNwbGlkZXMucHVzaCh7XG4gICAgICBzcGxpZGU6IHRoaXMsXG4gICAgICBpc1BhcmVudDogdHJ1ZVxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuaXMoSURMRSkpIHtcbiAgICAgIHRoaXMuX0MuU3luYy5yZW1vdW50KCk7XG5cbiAgICAgIHNwbGlkZS5Db21wb25lbnRzLlN5bmMucmVtb3VudCgpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIF9wcm90by5nbyA9IGZ1bmN0aW9uIGdvKGNvbnRyb2wpIHtcbiAgICB0aGlzLl9DLkNvbnRyb2xsZXIuZ28oY29udHJvbCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfcHJvdG8ub24gPSBmdW5jdGlvbiBvbihldmVudHMsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudC5vbihldmVudHMsIGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfcHJvdG8ub2ZmID0gZnVuY3Rpb24gb2ZmKGV2ZW50cykge1xuICAgIHRoaXMuZXZlbnQub2ZmKGV2ZW50cyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX3Byb3RvLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2ZW50KSB7XG4gICAgdmFyIF90aGlzJGV2ZW50O1xuXG4gICAgKF90aGlzJGV2ZW50ID0gdGhpcy5ldmVudCkuZW1pdC5hcHBseShfdGhpcyRldmVudCwgW2V2ZW50XS5jb25jYXQoc2xpY2UoYXJndW1lbnRzLCAxKSkpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX3Byb3RvLmFkZCA9IGZ1bmN0aW9uIGFkZChzbGlkZXMsIGluZGV4KSB7XG4gICAgdGhpcy5fQy5TbGlkZXMuYWRkKHNsaWRlcywgaW5kZXgpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX3Byb3RvLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZShtYXRjaGVyKSB7XG4gICAgdGhpcy5fQy5TbGlkZXMucmVtb3ZlKG1hdGNoZXIpO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgX3Byb3RvLmlzID0gZnVuY3Rpb24gaXModHlwZSkge1xuICAgIHJldHVybiB0aGlzLl9vLnR5cGUgPT09IHR5cGU7XG4gIH07XG5cbiAgX3Byb3RvLnJlZnJlc2ggPSBmdW5jdGlvbiByZWZyZXNoKCkge1xuICAgIHRoaXMuZW1pdChFVkVOVF9SRUZSRVNIKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfcHJvdG8uZGVzdHJveSA9IGZ1bmN0aW9uIGRlc3Ryb3koY29tcGxldGVseSkge1xuICAgIGlmIChjb21wbGV0ZWx5ID09PSB2b2lkIDApIHtcbiAgICAgIGNvbXBsZXRlbHkgPSB0cnVlO1xuICAgIH1cblxuICAgIHZhciBldmVudCA9IHRoaXMuZXZlbnQsXG4gICAgICAgIHN0YXRlID0gdGhpcy5zdGF0ZTtcblxuICAgIGlmIChzdGF0ZS5pcyhDUkVBVEVEKSkge1xuICAgICAgRXZlbnRJbnRlcmZhY2UodGhpcykub24oRVZFTlRfUkVBRFksIHRoaXMuZGVzdHJveS5iaW5kKHRoaXMsIGNvbXBsZXRlbHkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yT3duKHRoaXMuX0MsIGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgICAgICAgY29tcG9uZW50LmRlc3Ryb3kgJiYgY29tcG9uZW50LmRlc3Ryb3koY29tcGxldGVseSk7XG4gICAgICB9LCB0cnVlKTtcbiAgICAgIGV2ZW50LmVtaXQoRVZFTlRfREVTVFJPWSk7XG4gICAgICBldmVudC5kZXN0cm95KCk7XG4gICAgICBjb21wbGV0ZWx5ICYmIGVtcHR5KHRoaXMuc3BsaWRlcyk7XG4gICAgICBzdGF0ZS5zZXQoREVTVFJPWUVEKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfY3JlYXRlQ2xhc3MoX1NwbGlkZSwgW3tcbiAgICBrZXk6IFwib3B0aW9uc1wiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX287XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldChvcHRpb25zKSB7XG4gICAgICB0aGlzLl9DLk1lZGlhLnNldChvcHRpb25zLCB0cnVlLCB0cnVlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibGVuZ3RoXCIsXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fQy5TbGlkZXMuZ2V0TGVuZ3RoKHRydWUpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJpbmRleFwiLFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0MuQ29udHJvbGxlci5nZXRJbmRleCgpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBfU3BsaWRlO1xufSgpO1xuXG52YXIgU3BsaWRlID0gX1NwbGlkZTtcblNwbGlkZS5kZWZhdWx0cyA9IHt9O1xuU3BsaWRlLlNUQVRFUyA9IFNUQVRFUztcbnZhciBDTEFTU19SRU5ERVJFRCA9IFwiaXMtcmVuZGVyZWRcIjtcbnZhciBSRU5ERVJFUl9ERUZBVUxUX0NPTkZJRyA9IHtcbiAgbGlzdFRhZzogXCJ1bFwiLFxuICBzbGlkZVRhZzogXCJsaVwiXG59O1xuXG52YXIgU3R5bGUgPSAvKiNfX1BVUkVfXyovZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTdHlsZShpZCwgb3B0aW9ucykge1xuICAgIHRoaXMuc3R5bGVzID0ge307XG4gICAgdGhpcy5pZCA9IGlkO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cblxuICB2YXIgX3Byb3RvMiA9IFN0eWxlLnByb3RvdHlwZTtcblxuICBfcHJvdG8yLnJ1bGUgPSBmdW5jdGlvbiBydWxlKHNlbGVjdG9yLCBwcm9wLCB2YWx1ZSwgYnJlYWtwb2ludCkge1xuICAgIGJyZWFrcG9pbnQgPSBicmVha3BvaW50IHx8IFwiZGVmYXVsdFwiO1xuICAgIHZhciBzZWxlY3RvcnMgPSB0aGlzLnN0eWxlc1ticmVha3BvaW50XSA9IHRoaXMuc3R5bGVzW2JyZWFrcG9pbnRdIHx8IHt9O1xuICAgIHZhciBzdHlsZXMgPSBzZWxlY3RvcnNbc2VsZWN0b3JdID0gc2VsZWN0b3JzW3NlbGVjdG9yXSB8fCB7fTtcbiAgICBzdHlsZXNbcHJvcF0gPSB2YWx1ZTtcbiAgfTtcblxuICBfcHJvdG8yLmJ1aWxkID0gZnVuY3Rpb24gYnVpbGQoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgY3NzID0gXCJcIjtcblxuICAgIGlmICh0aGlzLnN0eWxlcy5kZWZhdWx0KSB7XG4gICAgICBjc3MgKz0gdGhpcy5idWlsZFNlbGVjdG9ycyh0aGlzLnN0eWxlcy5kZWZhdWx0KTtcbiAgICB9XG5cbiAgICBPYmplY3Qua2V5cyh0aGlzLnN0eWxlcykuc29ydChmdW5jdGlvbiAobiwgbSkge1xuICAgICAgcmV0dXJuIF90aGlzMi5vcHRpb25zLm1lZGlhUXVlcnkgPT09IFwibWluXCIgPyArbiAtICttIDogK20gLSArbjtcbiAgICB9KS5mb3JFYWNoKGZ1bmN0aW9uIChicmVha3BvaW50KSB7XG4gICAgICBpZiAoYnJlYWtwb2ludCAhPT0gXCJkZWZhdWx0XCIpIHtcbiAgICAgICAgY3NzICs9IFwiQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogXCIgKyBicmVha3BvaW50ICsgXCJweCkge1wiO1xuICAgICAgICBjc3MgKz0gX3RoaXMyLmJ1aWxkU2VsZWN0b3JzKF90aGlzMi5zdHlsZXNbYnJlYWtwb2ludF0pO1xuICAgICAgICBjc3MgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNzcztcbiAgfTtcblxuICBfcHJvdG8yLmJ1aWxkU2VsZWN0b3JzID0gZnVuY3Rpb24gYnVpbGRTZWxlY3RvcnMoc2VsZWN0b3JzKSB7XG4gICAgdmFyIF90aGlzMyA9IHRoaXM7XG5cbiAgICB2YXIgY3NzID0gXCJcIjtcbiAgICBmb3JPd24oc2VsZWN0b3JzLCBmdW5jdGlvbiAoc3R5bGVzLCBzZWxlY3Rvcikge1xuICAgICAgc2VsZWN0b3IgPSAoXCIjXCIgKyBfdGhpczMuaWQgKyBcIiBcIiArIHNlbGVjdG9yKS50cmltKCk7XG4gICAgICBjc3MgKz0gc2VsZWN0b3IgKyBcIiB7XCI7XG4gICAgICBmb3JPd24oc3R5bGVzLCBmdW5jdGlvbiAodmFsdWUsIHByb3ApIHtcbiAgICAgICAgaWYgKHZhbHVlIHx8IHZhbHVlID09PSAwKSB7XG4gICAgICAgICAgY3NzICs9IHByb3AgKyBcIjogXCIgKyB2YWx1ZSArIFwiO1wiO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNzcyArPSBcIn1cIjtcbiAgICB9KTtcbiAgICByZXR1cm4gY3NzO1xuICB9O1xuXG4gIHJldHVybiBTdHlsZTtcbn0oKTtcblxudmFyIFNwbGlkZVJlbmRlcmVyID0gLyojX19QVVJFX18qL2Z1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gU3BsaWRlUmVuZGVyZXIoY29udGVudHMsIG9wdGlvbnMsIGNvbmZpZywgZGVmYXVsdHMpIHtcbiAgICB0aGlzLnNsaWRlcyA9IFtdO1xuICAgIHRoaXMub3B0aW9ucyA9IHt9O1xuICAgIHRoaXMuYnJlYWtwb2ludHMgPSBbXTtcbiAgICBtZXJnZShERUZBVUxUUywgZGVmYXVsdHMgfHwge30pO1xuICAgIG1lcmdlKG1lcmdlKHRoaXMub3B0aW9ucywgREVGQVVMVFMpLCBvcHRpb25zIHx8IHt9KTtcbiAgICB0aGlzLmNvbnRlbnRzID0gY29udGVudHM7XG4gICAgdGhpcy5jb25maWcgPSBhc3NpZ24oe30sIFJFTkRFUkVSX0RFRkFVTFRfQ09ORklHLCBjb25maWcgfHwge30pO1xuICAgIHRoaXMuaWQgPSB0aGlzLmNvbmZpZy5pZCB8fCB1bmlxdWVJZChcInNwbGlkZVwiKTtcbiAgICB0aGlzLlN0eWxlID0gbmV3IFN0eWxlKHRoaXMuaWQsIHRoaXMub3B0aW9ucyk7XG4gICAgdGhpcy5EaXJlY3Rpb24gPSBEaXJlY3Rpb24obnVsbCwgbnVsbCwgdGhpcy5vcHRpb25zKTtcbiAgICBhc3NlcnQodGhpcy5jb250ZW50cy5sZW5ndGgsIFwiUHJvdmlkZSBhdCBsZWFzdCAxIGNvbnRlbnQuXCIpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgU3BsaWRlUmVuZGVyZXIuY2xlYW4gPSBmdW5jdGlvbiBjbGVhbihzcGxpZGUpIHtcbiAgICB2YXIgX0V2ZW50SW50ZXJmYWNlMTQgPSBFdmVudEludGVyZmFjZShzcGxpZGUpLFxuICAgICAgICBvbiA9IF9FdmVudEludGVyZmFjZTE0Lm9uO1xuXG4gICAgdmFyIHJvb3QgPSBzcGxpZGUucm9vdDtcbiAgICB2YXIgY2xvbmVzID0gcXVlcnlBbGwocm9vdCwgXCIuXCIgKyBDTEFTU19DTE9ORSk7XG4gICAgb24oRVZFTlRfTU9VTlRFRCwgZnVuY3Rpb24gKCkge1xuICAgICAgcmVtb3ZlKGNoaWxkKHJvb3QsIFwic3R5bGVcIikpO1xuICAgIH0pO1xuICAgIHJlbW92ZShjbG9uZXMpO1xuICB9O1xuXG4gIHZhciBfcHJvdG8zID0gU3BsaWRlUmVuZGVyZXIucHJvdG90eXBlO1xuXG4gIF9wcm90bzMuaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5wYXJzZUJyZWFrcG9pbnRzKCk7XG4gICAgdGhpcy5pbml0U2xpZGVzKCk7XG4gICAgdGhpcy5yZWdpc3RlclJvb3RTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyVHJhY2tTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyU2xpZGVTdHlsZXMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyTGlzdFN0eWxlcygpO1xuICB9O1xuXG4gIF9wcm90bzMuaW5pdFNsaWRlcyA9IGZ1bmN0aW9uIGluaXRTbGlkZXMoKSB7XG4gICAgdmFyIF90aGlzNCA9IHRoaXM7XG5cbiAgICBwdXNoKHRoaXMuc2xpZGVzLCB0aGlzLmNvbnRlbnRzLm1hcChmdW5jdGlvbiAoY29udGVudCwgaW5kZXgpIHtcbiAgICAgIGNvbnRlbnQgPSBpc1N0cmluZyhjb250ZW50KSA/IHtcbiAgICAgICAgaHRtbDogY29udGVudFxuICAgICAgfSA6IGNvbnRlbnQ7XG4gICAgICBjb250ZW50LnN0eWxlcyA9IGNvbnRlbnQuc3R5bGVzIHx8IHt9O1xuICAgICAgY29udGVudC5hdHRycyA9IGNvbnRlbnQuYXR0cnMgfHwge307XG5cbiAgICAgIF90aGlzNC5jb3Zlcihjb250ZW50KTtcblxuICAgICAgdmFyIGNsYXNzZXMgPSBfdGhpczQub3B0aW9ucy5jbGFzc2VzLnNsaWRlICsgXCIgXCIgKyAoaW5kZXggPT09IDAgPyBDTEFTU19BQ1RJVkUgOiBcIlwiKTtcbiAgICAgIGFzc2lnbihjb250ZW50LmF0dHJzLCB7XG4gICAgICAgIGNsYXNzOiAoY2xhc3NlcyArIFwiIFwiICsgKGNvbnRlbnQuYXR0cnMuY2xhc3MgfHwgXCJcIikpLnRyaW0oKSxcbiAgICAgICAgc3R5bGU6IF90aGlzNC5idWlsZFN0eWxlcyhjb250ZW50LnN0eWxlcylcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkpO1xuXG4gICAgaWYgKHRoaXMuaXNMb29wKCkpIHtcbiAgICAgIHRoaXMuZ2VuZXJhdGVDbG9uZXModGhpcy5zbGlkZXMpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8zLnJlZ2lzdGVyUm9vdFN0eWxlcyA9IGZ1bmN0aW9uIHJlZ2lzdGVyUm9vdFN0eWxlcygpIHtcbiAgICB2YXIgX3RoaXM1ID0gdGhpcztcblxuICAgIHRoaXMuYnJlYWtwb2ludHMuZm9yRWFjaChmdW5jdGlvbiAoX3JlZjIpIHtcbiAgICAgIHZhciB3aWR0aCA9IF9yZWYyWzBdLFxuICAgICAgICAgIG9wdGlvbnMgPSBfcmVmMlsxXTtcblxuICAgICAgX3RoaXM1LlN0eWxlLnJ1bGUoXCIgXCIsIFwibWF4LXdpZHRoXCIsIHVuaXQob3B0aW9ucy53aWR0aCksIHdpZHRoKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8zLnJlZ2lzdGVyVHJhY2tTdHlsZXMgPSBmdW5jdGlvbiByZWdpc3RlclRyYWNrU3R5bGVzKCkge1xuICAgIHZhciBfdGhpczYgPSB0aGlzO1xuXG4gICAgdmFyIFN0eWxlMiA9IHRoaXMuU3R5bGU7XG4gICAgdmFyIHNlbGVjdG9yID0gXCIuXCIgKyBDTEFTU19UUkFDSztcbiAgICB0aGlzLmJyZWFrcG9pbnRzLmZvckVhY2goZnVuY3Rpb24gKF9yZWYzKSB7XG4gICAgICB2YXIgd2lkdGggPSBfcmVmM1swXSxcbiAgICAgICAgICBvcHRpb25zID0gX3JlZjNbMV07XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgX3RoaXM2LnJlc29sdmUoXCJwYWRkaW5nTGVmdFwiKSwgX3RoaXM2LmNzc1BhZGRpbmcob3B0aW9ucywgZmFsc2UpLCB3aWR0aCk7XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgX3RoaXM2LnJlc29sdmUoXCJwYWRkaW5nUmlnaHRcIiksIF90aGlzNi5jc3NQYWRkaW5nKG9wdGlvbnMsIHRydWUpLCB3aWR0aCk7XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgXCJoZWlnaHRcIiwgX3RoaXM2LmNzc1RyYWNrSGVpZ2h0KG9wdGlvbnMpLCB3aWR0aCk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvMy5yZWdpc3Rlckxpc3RTdHlsZXMgPSBmdW5jdGlvbiByZWdpc3Rlckxpc3RTdHlsZXMoKSB7XG4gICAgdmFyIF90aGlzNyA9IHRoaXM7XG5cbiAgICB2YXIgU3R5bGUyID0gdGhpcy5TdHlsZTtcbiAgICB2YXIgc2VsZWN0b3IgPSBcIi5cIiArIENMQVNTX0xJU1Q7XG4gICAgdGhpcy5icmVha3BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChfcmVmNCkge1xuICAgICAgdmFyIHdpZHRoID0gX3JlZjRbMF0sXG4gICAgICAgICAgb3B0aW9ucyA9IF9yZWY0WzFdO1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIFwidHJhbnNmb3JtXCIsIF90aGlzNy5idWlsZFRyYW5zbGF0ZShvcHRpb25zKSwgd2lkdGgpO1xuXG4gICAgICBpZiAoIV90aGlzNy5jc3NTbGlkZUhlaWdodChvcHRpb25zKSkge1xuICAgICAgICBTdHlsZTIucnVsZShzZWxlY3RvciwgXCJhc3BlY3QtcmF0aW9cIiwgX3RoaXM3LmNzc0FzcGVjdFJhdGlvKG9wdGlvbnMpLCB3aWR0aCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvMy5yZWdpc3RlclNsaWRlU3R5bGVzID0gZnVuY3Rpb24gcmVnaXN0ZXJTbGlkZVN0eWxlcygpIHtcbiAgICB2YXIgX3RoaXM4ID0gdGhpcztcblxuICAgIHZhciBTdHlsZTIgPSB0aGlzLlN0eWxlO1xuICAgIHZhciBzZWxlY3RvciA9IFwiLlwiICsgQ0xBU1NfU0xJREU7XG4gICAgdGhpcy5icmVha3BvaW50cy5mb3JFYWNoKGZ1bmN0aW9uIChfcmVmNSkge1xuICAgICAgdmFyIHdpZHRoID0gX3JlZjVbMF0sXG4gICAgICAgICAgb3B0aW9ucyA9IF9yZWY1WzFdO1xuICAgICAgU3R5bGUyLnJ1bGUoc2VsZWN0b3IsIFwid2lkdGhcIiwgX3RoaXM4LmNzc1NsaWRlV2lkdGgob3B0aW9ucyksIHdpZHRoKTtcbiAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCBcImhlaWdodFwiLCBfdGhpczguY3NzU2xpZGVIZWlnaHQob3B0aW9ucykgfHwgXCIxMDAlXCIsIHdpZHRoKTtcbiAgICAgIFN0eWxlMi5ydWxlKHNlbGVjdG9yLCBfdGhpczgucmVzb2x2ZShcIm1hcmdpblJpZ2h0XCIpLCB1bml0KG9wdGlvbnMuZ2FwKSB8fCBcIjBweFwiLCB3aWR0aCk7XG4gICAgICBTdHlsZTIucnVsZShzZWxlY3RvciArIFwiID4gaW1nXCIsIFwiZGlzcGxheVwiLCBvcHRpb25zLmNvdmVyID8gXCJub25lXCIgOiBcImlubGluZVwiLCB3aWR0aCk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvMy5idWlsZFRyYW5zbGF0ZSA9IGZ1bmN0aW9uIGJ1aWxkVHJhbnNsYXRlKG9wdGlvbnMpIHtcbiAgICB2YXIgX3RoaXMkRGlyZWN0aW9uID0gdGhpcy5EaXJlY3Rpb24sXG4gICAgICAgIHJlc29sdmUgPSBfdGhpcyREaXJlY3Rpb24ucmVzb2x2ZSxcbiAgICAgICAgb3JpZW50ID0gX3RoaXMkRGlyZWN0aW9uLm9yaWVudDtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdmFsdWVzLnB1c2godGhpcy5jc3NPZmZzZXRDbG9uZXMob3B0aW9ucykpO1xuICAgIHZhbHVlcy5wdXNoKHRoaXMuY3NzT2Zmc2V0R2FwcyhvcHRpb25zKSk7XG5cbiAgICBpZiAodGhpcy5pc0NlbnRlcihvcHRpb25zKSkge1xuICAgICAgdmFsdWVzLnB1c2godGhpcy5idWlsZENzc1ZhbHVlKG9yaWVudCgtNTApLCBcIiVcIikpO1xuICAgICAgdmFsdWVzLnB1c2guYXBwbHkodmFsdWVzLCB0aGlzLmNzc09mZnNldENlbnRlcihvcHRpb25zKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbHVlcy5maWx0ZXIoQm9vbGVhbikubWFwKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgcmV0dXJuIFwidHJhbnNsYXRlXCIgKyByZXNvbHZlKFwiWFwiKSArIFwiKFwiICsgdmFsdWUgKyBcIilcIjtcbiAgICB9KS5qb2luKFwiIFwiKTtcbiAgfTtcblxuICBfcHJvdG8zLmNzc09mZnNldENsb25lcyA9IGZ1bmN0aW9uIGNzc09mZnNldENsb25lcyhvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzJERpcmVjdGlvbjIgPSB0aGlzLkRpcmVjdGlvbixcbiAgICAgICAgcmVzb2x2ZSA9IF90aGlzJERpcmVjdGlvbjIucmVzb2x2ZSxcbiAgICAgICAgb3JpZW50ID0gX3RoaXMkRGlyZWN0aW9uMi5vcmllbnQ7XG4gICAgdmFyIGNsb25lQ291bnQgPSB0aGlzLmdldENsb25lQ291bnQoKTtcblxuICAgIGlmICh0aGlzLmlzRml4ZWRXaWR0aChvcHRpb25zKSkge1xuICAgICAgdmFyIF90aGlzJHBhcnNlQ3NzVmFsdWUgPSB0aGlzLnBhcnNlQ3NzVmFsdWUob3B0aW9uc1tyZXNvbHZlKFwiZml4ZWRXaWR0aFwiKV0pLFxuICAgICAgICAgIHZhbHVlID0gX3RoaXMkcGFyc2VDc3NWYWx1ZS52YWx1ZSxcbiAgICAgICAgICB1bml0MiA9IF90aGlzJHBhcnNlQ3NzVmFsdWUudW5pdDtcblxuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUpICogY2xvbmVDb3VudCwgdW5pdDIpO1xuICAgIH1cblxuICAgIHZhciBwZXJjZW50ID0gMTAwICogY2xvbmVDb3VudCAvIG9wdGlvbnMucGVyUGFnZTtcbiAgICByZXR1cm4gb3JpZW50KHBlcmNlbnQpICsgXCIlXCI7XG4gIH07XG5cbiAgX3Byb3RvMy5jc3NPZmZzZXRDZW50ZXIgPSBmdW5jdGlvbiBjc3NPZmZzZXRDZW50ZXIob3B0aW9ucykge1xuICAgIHZhciBfdGhpcyREaXJlY3Rpb24zID0gdGhpcy5EaXJlY3Rpb24sXG4gICAgICAgIHJlc29sdmUgPSBfdGhpcyREaXJlY3Rpb24zLnJlc29sdmUsXG4gICAgICAgIG9yaWVudCA9IF90aGlzJERpcmVjdGlvbjMub3JpZW50O1xuXG4gICAgaWYgKHRoaXMuaXNGaXhlZFdpZHRoKG9wdGlvbnMpKSB7XG4gICAgICB2YXIgX3RoaXMkcGFyc2VDc3NWYWx1ZTIgPSB0aGlzLnBhcnNlQ3NzVmFsdWUob3B0aW9uc1tyZXNvbHZlKFwiZml4ZWRXaWR0aFwiKV0pLFxuICAgICAgICAgIHZhbHVlID0gX3RoaXMkcGFyc2VDc3NWYWx1ZTIudmFsdWUsXG4gICAgICAgICAgdW5pdDIgPSBfdGhpcyRwYXJzZUNzc1ZhbHVlMi51bml0O1xuXG4gICAgICByZXR1cm4gW3RoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQodmFsdWUgLyAyKSwgdW5pdDIpXTtcbiAgICB9XG5cbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgdmFyIHBlclBhZ2UgPSBvcHRpb25zLnBlclBhZ2UsXG4gICAgICAgIGdhcCA9IG9wdGlvbnMuZ2FwO1xuICAgIHZhbHVlcy5wdXNoKG9yaWVudCg1MCAvIHBlclBhZ2UpICsgXCIlXCIpO1xuXG4gICAgaWYgKGdhcCkge1xuICAgICAgdmFyIF90aGlzJHBhcnNlQ3NzVmFsdWUzID0gdGhpcy5wYXJzZUNzc1ZhbHVlKGdhcCksXG4gICAgICAgICAgX3ZhbHVlID0gX3RoaXMkcGFyc2VDc3NWYWx1ZTMudmFsdWUsXG4gICAgICAgICAgX3VuaXQgPSBfdGhpcyRwYXJzZUNzc1ZhbHVlMy51bml0O1xuXG4gICAgICB2YXIgZ2FwT2Zmc2V0ID0gKF92YWx1ZSAvIHBlclBhZ2UgLSBfdmFsdWUpIC8gMjtcbiAgICAgIHZhbHVlcy5wdXNoKHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQoZ2FwT2Zmc2V0KSwgX3VuaXQpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWVzO1xuICB9O1xuXG4gIF9wcm90bzMuY3NzT2Zmc2V0R2FwcyA9IGZ1bmN0aW9uIGNzc09mZnNldEdhcHMob3B0aW9ucykge1xuICAgIHZhciBjbG9uZUNvdW50ID0gdGhpcy5nZXRDbG9uZUNvdW50KCk7XG5cbiAgICBpZiAoY2xvbmVDb3VudCAmJiBvcHRpb25zLmdhcCkge1xuICAgICAgdmFyIG9yaWVudCA9IHRoaXMuRGlyZWN0aW9uLm9yaWVudDtcblxuICAgICAgdmFyIF90aGlzJHBhcnNlQ3NzVmFsdWU0ID0gdGhpcy5wYXJzZUNzc1ZhbHVlKG9wdGlvbnMuZ2FwKSxcbiAgICAgICAgICB2YWx1ZSA9IF90aGlzJHBhcnNlQ3NzVmFsdWU0LnZhbHVlLFxuICAgICAgICAgIHVuaXQyID0gX3RoaXMkcGFyc2VDc3NWYWx1ZTQudW5pdDtcblxuICAgICAgaWYgKHRoaXMuaXNGaXhlZFdpZHRoKG9wdGlvbnMpKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJ1aWxkQ3NzVmFsdWUob3JpZW50KHZhbHVlICogY2xvbmVDb3VudCksIHVuaXQyKTtcbiAgICAgIH1cblxuICAgICAgdmFyIHBlclBhZ2UgPSBvcHRpb25zLnBlclBhZ2U7XG4gICAgICB2YXIgZ2FwcyA9IGNsb25lQ291bnQgLyBwZXJQYWdlO1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGRDc3NWYWx1ZShvcmllbnQoZ2FwcyAqIHZhbHVlKSwgdW5pdDIpO1xuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9O1xuXG4gIF9wcm90bzMucmVzb2x2ZSA9IGZ1bmN0aW9uIHJlc29sdmUocHJvcCkge1xuICAgIHJldHVybiBjYW1lbFRvS2ViYWIodGhpcy5EaXJlY3Rpb24ucmVzb2x2ZShwcm9wKSk7XG4gIH07XG5cbiAgX3Byb3RvMy5jc3NQYWRkaW5nID0gZnVuY3Rpb24gY3NzUGFkZGluZyhvcHRpb25zLCByaWdodCkge1xuICAgIHZhciBwYWRkaW5nID0gb3B0aW9ucy5wYWRkaW5nO1xuICAgIHZhciBwcm9wID0gdGhpcy5EaXJlY3Rpb24ucmVzb2x2ZShyaWdodCA/IFwicmlnaHRcIiA6IFwibGVmdFwiLCB0cnVlKTtcbiAgICByZXR1cm4gcGFkZGluZyAmJiB1bml0KHBhZGRpbmdbcHJvcF0gfHwgKGlzT2JqZWN0KHBhZGRpbmcpID8gMCA6IHBhZGRpbmcpKSB8fCBcIjBweFwiO1xuICB9O1xuXG4gIF9wcm90bzMuY3NzVHJhY2tIZWlnaHQgPSBmdW5jdGlvbiBjc3NUcmFja0hlaWdodChvcHRpb25zKSB7XG4gICAgdmFyIGhlaWdodCA9IFwiXCI7XG5cbiAgICBpZiAodGhpcy5pc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGhlaWdodCA9IHRoaXMuY3NzSGVpZ2h0KG9wdGlvbnMpO1xuICAgICAgYXNzZXJ0KGhlaWdodCwgJ1wiaGVpZ2h0XCIgaXMgbWlzc2luZy4nKTtcbiAgICAgIGhlaWdodCA9IFwiY2FsYyhcIiArIGhlaWdodCArIFwiIC0gXCIgKyB0aGlzLmNzc1BhZGRpbmcob3B0aW9ucywgZmFsc2UpICsgXCIgLSBcIiArIHRoaXMuY3NzUGFkZGluZyhvcHRpb25zLCB0cnVlKSArIFwiKVwiO1xuICAgIH1cblxuICAgIHJldHVybiBoZWlnaHQ7XG4gIH07XG5cbiAgX3Byb3RvMy5jc3NIZWlnaHQgPSBmdW5jdGlvbiBjc3NIZWlnaHQob3B0aW9ucykge1xuICAgIHJldHVybiB1bml0KG9wdGlvbnMuaGVpZ2h0KTtcbiAgfTtcblxuICBfcHJvdG8zLmNzc1NsaWRlV2lkdGggPSBmdW5jdGlvbiBjc3NTbGlkZVdpZHRoKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gb3B0aW9ucy5hdXRvV2lkdGggPyBcIlwiIDogdW5pdChvcHRpb25zLmZpeGVkV2lkdGgpIHx8ICh0aGlzLmlzVmVydGljYWwoKSA/IFwiXCIgOiB0aGlzLmNzc1NsaWRlU2l6ZShvcHRpb25zKSk7XG4gIH07XG5cbiAgX3Byb3RvMy5jc3NTbGlkZUhlaWdodCA9IGZ1bmN0aW9uIGNzc1NsaWRlSGVpZ2h0KG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdW5pdChvcHRpb25zLmZpeGVkSGVpZ2h0KSB8fCAodGhpcy5pc1ZlcnRpY2FsKCkgPyBvcHRpb25zLmF1dG9IZWlnaHQgPyBcIlwiIDogdGhpcy5jc3NTbGlkZVNpemUob3B0aW9ucykgOiB0aGlzLmNzc0hlaWdodChvcHRpb25zKSk7XG4gIH07XG5cbiAgX3Byb3RvMy5jc3NTbGlkZVNpemUgPSBmdW5jdGlvbiBjc3NTbGlkZVNpemUob3B0aW9ucykge1xuICAgIHZhciBnYXAgPSB1bml0KG9wdGlvbnMuZ2FwKTtcbiAgICByZXR1cm4gXCJjYWxjKCgxMDAlXCIgKyAoZ2FwICYmIFwiICsgXCIgKyBnYXApICsgXCIpL1wiICsgKG9wdGlvbnMucGVyUGFnZSB8fCAxKSArIChnYXAgJiYgXCIgLSBcIiArIGdhcCkgKyBcIilcIjtcbiAgfTtcblxuICBfcHJvdG8zLmNzc0FzcGVjdFJhdGlvID0gZnVuY3Rpb24gY3NzQXNwZWN0UmF0aW8ob3B0aW9ucykge1xuICAgIHZhciBoZWlnaHRSYXRpbyA9IG9wdGlvbnMuaGVpZ2h0UmF0aW87XG4gICAgcmV0dXJuIGhlaWdodFJhdGlvID8gXCJcIiArIDEgLyBoZWlnaHRSYXRpbyA6IFwiXCI7XG4gIH07XG5cbiAgX3Byb3RvMy5idWlsZENzc1ZhbHVlID0gZnVuY3Rpb24gYnVpbGRDc3NWYWx1ZSh2YWx1ZSwgdW5pdDIpIHtcbiAgICByZXR1cm4gXCJcIiArIHZhbHVlICsgdW5pdDI7XG4gIH07XG5cbiAgX3Byb3RvMy5wYXJzZUNzc1ZhbHVlID0gZnVuY3Rpb24gcGFyc2VDc3NWYWx1ZSh2YWx1ZSkge1xuICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgIHZhciBudW1iZXIgPSBwYXJzZUZsb2F0KHZhbHVlKSB8fCAwO1xuICAgICAgdmFyIHVuaXQyID0gdmFsdWUucmVwbGFjZSgvXFxkKihcXC5cXGQqKT8vLCBcIlwiKSB8fCBcInB4XCI7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWx1ZTogbnVtYmVyLFxuICAgICAgICB1bml0OiB1bml0MlxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgdW5pdDogXCJweFwiXG4gICAgfTtcbiAgfTtcblxuICBfcHJvdG8zLnBhcnNlQnJlYWtwb2ludHMgPSBmdW5jdGlvbiBwYXJzZUJyZWFrcG9pbnRzKCkge1xuICAgIHZhciBfdGhpczkgPSB0aGlzO1xuXG4gICAgdmFyIGJyZWFrcG9pbnRzID0gdGhpcy5vcHRpb25zLmJyZWFrcG9pbnRzO1xuICAgIHRoaXMuYnJlYWtwb2ludHMucHVzaChbXCJkZWZhdWx0XCIsIHRoaXMub3B0aW9uc10pO1xuXG4gICAgaWYgKGJyZWFrcG9pbnRzKSB7XG4gICAgICBmb3JPd24oYnJlYWtwb2ludHMsIGZ1bmN0aW9uIChvcHRpb25zLCB3aWR0aCkge1xuICAgICAgICBfdGhpczkuYnJlYWtwb2ludHMucHVzaChbd2lkdGgsIG1lcmdlKG1lcmdlKHt9LCBfdGhpczkub3B0aW9ucyksIG9wdGlvbnMpXSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvMy5pc0ZpeGVkV2lkdGggPSBmdW5jdGlvbiBpc0ZpeGVkV2lkdGgob3B0aW9ucykge1xuICAgIHJldHVybiAhIW9wdGlvbnNbdGhpcy5EaXJlY3Rpb24ucmVzb2x2ZShcImZpeGVkV2lkdGhcIildO1xuICB9O1xuXG4gIF9wcm90bzMuaXNMb29wID0gZnVuY3Rpb24gaXNMb29wKCkge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMudHlwZSA9PT0gTE9PUDtcbiAgfTtcblxuICBfcHJvdG8zLmlzQ2VudGVyID0gZnVuY3Rpb24gaXNDZW50ZXIob3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLmZvY3VzID09PSBcImNlbnRlclwiKSB7XG4gICAgICBpZiAodGhpcy5pc0xvb3AoKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMub3B0aW9ucy50eXBlID09PSBTTElERSkge1xuICAgICAgICByZXR1cm4gIXRoaXMub3B0aW9ucy50cmltU3BhY2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIF9wcm90bzMuaXNWZXJ0aWNhbCA9IGZ1bmN0aW9uIGlzVmVydGljYWwoKSB7XG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucy5kaXJlY3Rpb24gPT09IFRUQjtcbiAgfTtcblxuICBfcHJvdG8zLmJ1aWxkQ2xhc3NlcyA9IGZ1bmN0aW9uIGJ1aWxkQ2xhc3NlcygpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICByZXR1cm4gW0NMQVNTX1JPT1QsIENMQVNTX1JPT1QgKyBcIi0tXCIgKyBvcHRpb25zLnR5cGUsIENMQVNTX1JPT1QgKyBcIi0tXCIgKyBvcHRpb25zLmRpcmVjdGlvbiwgb3B0aW9ucy5kcmFnICYmIENMQVNTX1JPT1QgKyBcIi0tZHJhZ2dhYmxlXCIsIG9wdGlvbnMuaXNOYXZpZ2F0aW9uICYmIENMQVNTX1JPT1QgKyBcIi0tbmF2XCIsIENMQVNTX0FDVElWRSwgIXRoaXMuY29uZmlnLmhpZGRlbiAmJiBDTEFTU19SRU5ERVJFRF0uZmlsdGVyKEJvb2xlYW4pLmpvaW4oXCIgXCIpO1xuICB9O1xuXG4gIF9wcm90bzMuYnVpbGRBdHRycyA9IGZ1bmN0aW9uIGJ1aWxkQXR0cnMoYXR0cnMpIHtcbiAgICB2YXIgYXR0ciA9IFwiXCI7XG4gICAgZm9yT3duKGF0dHJzLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgYXR0ciArPSB2YWx1ZSA/IFwiIFwiICsgY2FtZWxUb0tlYmFiKGtleSkgKyBcIj1cXFwiXCIgKyB2YWx1ZSArIFwiXFxcIlwiIDogXCJcIjtcbiAgICB9KTtcbiAgICByZXR1cm4gYXR0ci50cmltKCk7XG4gIH07XG5cbiAgX3Byb3RvMy5idWlsZFN0eWxlcyA9IGZ1bmN0aW9uIGJ1aWxkU3R5bGVzKHN0eWxlcykge1xuICAgIHZhciBzdHlsZSA9IFwiXCI7XG4gICAgZm9yT3duKHN0eWxlcywgZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgIHN0eWxlICs9IFwiIFwiICsgY2FtZWxUb0tlYmFiKGtleSkgKyBcIjpcIiArIHZhbHVlICsgXCI7XCI7XG4gICAgfSk7XG4gICAgcmV0dXJuIHN0eWxlLnRyaW0oKTtcbiAgfTtcblxuICBfcHJvdG8zLnJlbmRlclNsaWRlcyA9IGZ1bmN0aW9uIHJlbmRlclNsaWRlcygpIHtcbiAgICB2YXIgX3RoaXMxMCA9IHRoaXM7XG5cbiAgICB2YXIgdGFnID0gdGhpcy5jb25maWcuc2xpZGVUYWc7XG4gICAgcmV0dXJuIHRoaXMuc2xpZGVzLm1hcChmdW5jdGlvbiAoY29udGVudCkge1xuICAgICAgcmV0dXJuIFwiPFwiICsgdGFnICsgXCIgXCIgKyBfdGhpczEwLmJ1aWxkQXR0cnMoY29udGVudC5hdHRycykgKyBcIj5cIiArIChjb250ZW50Lmh0bWwgfHwgXCJcIikgKyBcIjwvXCIgKyB0YWcgKyBcIj5cIjtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIF9wcm90bzMuY292ZXIgPSBmdW5jdGlvbiBjb3Zlcihjb250ZW50KSB7XG4gICAgdmFyIHN0eWxlcyA9IGNvbnRlbnQuc3R5bGVzLFxuICAgICAgICBfY29udGVudCRodG1sID0gY29udGVudC5odG1sLFxuICAgICAgICBodG1sID0gX2NvbnRlbnQkaHRtbCA9PT0gdm9pZCAwID8gXCJcIiA6IF9jb250ZW50JGh0bWw7XG5cbiAgICBpZiAodGhpcy5vcHRpb25zLmNvdmVyICYmICF0aGlzLm9wdGlvbnMubGF6eUxvYWQpIHtcbiAgICAgIHZhciBzcmMgPSBodG1sLm1hdGNoKC88aW1nLio/c3JjXFxzKj1cXHMqKFsnXCJdKSguKz8pXFwxLio/Pi8pO1xuXG4gICAgICBpZiAoc3JjICYmIHNyY1syXSkge1xuICAgICAgICBzdHlsZXMuYmFja2dyb3VuZCA9IFwiY2VudGVyL2NvdmVyIG5vLXJlcGVhdCB1cmwoJ1wiICsgc3JjWzJdICsgXCInKVwiO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBfcHJvdG8zLmdlbmVyYXRlQ2xvbmVzID0gZnVuY3Rpb24gZ2VuZXJhdGVDbG9uZXMoY29udGVudHMpIHtcbiAgICB2YXIgY2xhc3NlcyA9IHRoaXMub3B0aW9ucy5jbGFzc2VzO1xuICAgIHZhciBjb3VudCA9IHRoaXMuZ2V0Q2xvbmVDb3VudCgpO1xuICAgIHZhciBzbGlkZXMgPSBjb250ZW50cy5zbGljZSgpO1xuXG4gICAgd2hpbGUgKHNsaWRlcy5sZW5ndGggPCBjb3VudCkge1xuICAgICAgcHVzaChzbGlkZXMsIHNsaWRlcyk7XG4gICAgfVxuXG4gICAgcHVzaChzbGlkZXMuc2xpY2UoLWNvdW50KS5yZXZlcnNlKCksIHNsaWRlcy5zbGljZSgwLCBjb3VudCkpLmZvckVhY2goZnVuY3Rpb24gKGNvbnRlbnQsIGluZGV4KSB7XG4gICAgICB2YXIgYXR0cnMgPSBhc3NpZ24oe30sIGNvbnRlbnQuYXR0cnMsIHtcbiAgICAgICAgY2xhc3M6IGNvbnRlbnQuYXR0cnMuY2xhc3MgKyBcIiBcIiArIGNsYXNzZXMuY2xvbmVcbiAgICAgIH0pO1xuICAgICAgdmFyIGNsb25lID0gYXNzaWduKHt9LCBjb250ZW50LCB7XG4gICAgICAgIGF0dHJzOiBhdHRyc1xuICAgICAgfSk7XG4gICAgICBpbmRleCA8IGNvdW50ID8gY29udGVudHMudW5zaGlmdChjbG9uZSkgOiBjb250ZW50cy5wdXNoKGNsb25lKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8zLmdldENsb25lQ291bnQgPSBmdW5jdGlvbiBnZXRDbG9uZUNvdW50KCkge1xuICAgIGlmICh0aGlzLmlzTG9vcCgpKSB7XG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgICAgaWYgKG9wdGlvbnMuY2xvbmVzKSB7XG4gICAgICAgIHJldHVybiBvcHRpb25zLmNsb25lcztcbiAgICAgIH1cblxuICAgICAgdmFyIHBlclBhZ2UgPSBtYXguYXBwbHkodm9pZCAwLCB0aGlzLmJyZWFrcG9pbnRzLm1hcChmdW5jdGlvbiAoX3JlZjYpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMyID0gX3JlZjZbMV07XG4gICAgICAgIHJldHVybiBvcHRpb25zMi5wZXJQYWdlO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHBlclBhZ2UgKiAoKG9wdGlvbnMuZmxpY2tNYXhQYWdlcyB8fCAxKSArIDEpO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9O1xuXG4gIF9wcm90bzMucmVuZGVyQXJyb3dzID0gZnVuY3Rpb24gcmVuZGVyQXJyb3dzKCkge1xuICAgIHZhciBodG1sID0gXCJcIjtcbiAgICBodG1sICs9IFwiPGRpdiBjbGFzcz1cXFwiXCIgKyB0aGlzLm9wdGlvbnMuY2xhc3Nlcy5hcnJvd3MgKyBcIlxcXCI+XCI7XG4gICAgaHRtbCArPSB0aGlzLnJlbmRlckFycm93KHRydWUpO1xuICAgIGh0bWwgKz0gdGhpcy5yZW5kZXJBcnJvdyhmYWxzZSk7XG4gICAgaHRtbCArPSBcIjwvZGl2PlwiO1xuICAgIHJldHVybiBodG1sO1xuICB9O1xuXG4gIF9wcm90bzMucmVuZGVyQXJyb3cgPSBmdW5jdGlvbiByZW5kZXJBcnJvdyhwcmV2KSB7XG4gICAgdmFyIF90aGlzJG9wdGlvbnMgPSB0aGlzLm9wdGlvbnMsXG4gICAgICAgIGNsYXNzZXMgPSBfdGhpcyRvcHRpb25zLmNsYXNzZXMsXG4gICAgICAgIGkxOG4gPSBfdGhpcyRvcHRpb25zLmkxOG47XG4gICAgdmFyIGF0dHJzID0ge1xuICAgICAgY2xhc3M6IGNsYXNzZXMuYXJyb3cgKyBcIiBcIiArIChwcmV2ID8gY2xhc3Nlcy5wcmV2IDogY2xhc3Nlcy5uZXh0KSxcbiAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgICBhcmlhTGFiZWw6IHByZXYgPyBpMThuLnByZXYgOiBpMThuLm5leHRcbiAgICB9O1xuICAgIHJldHVybiBcIjxidXR0b24gXCIgKyB0aGlzLmJ1aWxkQXR0cnMoYXR0cnMpICsgXCI+PHN2ZyB4bWxucz1cXFwiXCIgKyBYTUxfTkFNRV9TUEFDRSArIFwiXFxcIiB2aWV3Qm94PVxcXCIwIDAgXCIgKyBTSVpFICsgXCIgXCIgKyBTSVpFICsgXCJcXFwiIHdpZHRoPVxcXCJcIiArIFNJWkUgKyBcIlxcXCIgaGVpZ2h0PVxcXCJcIiArIFNJWkUgKyBcIlxcXCI+PHBhdGggZD1cXFwiXCIgKyAodGhpcy5vcHRpb25zLmFycm93UGF0aCB8fCBQQVRIKSArIFwiXFxcIiAvPjwvc3ZnPjwvYnV0dG9uPlwiO1xuICB9O1xuXG4gIF9wcm90bzMuaHRtbCA9IGZ1bmN0aW9uIGh0bWwoKSB7XG4gICAgdmFyIF90aGlzJGNvbmZpZyA9IHRoaXMuY29uZmlnLFxuICAgICAgICByb290Q2xhc3MgPSBfdGhpcyRjb25maWcucm9vdENsYXNzLFxuICAgICAgICBsaXN0VGFnID0gX3RoaXMkY29uZmlnLmxpc3RUYWcsXG4gICAgICAgIGFycm93cyA9IF90aGlzJGNvbmZpZy5hcnJvd3MsXG4gICAgICAgIGJlZm9yZVRyYWNrID0gX3RoaXMkY29uZmlnLmJlZm9yZVRyYWNrLFxuICAgICAgICBhZnRlclRyYWNrID0gX3RoaXMkY29uZmlnLmFmdGVyVHJhY2ssXG4gICAgICAgIHNsaWRlciA9IF90aGlzJGNvbmZpZy5zbGlkZXIsXG4gICAgICAgIGJlZm9yZVNsaWRlciA9IF90aGlzJGNvbmZpZy5iZWZvcmVTbGlkZXIsXG4gICAgICAgIGFmdGVyU2xpZGVyID0gX3RoaXMkY29uZmlnLmFmdGVyU2xpZGVyO1xuICAgIHZhciBodG1sID0gXCJcIjtcbiAgICBodG1sICs9IFwiPGRpdiBpZD1cXFwiXCIgKyB0aGlzLmlkICsgXCJcXFwiIGNsYXNzPVxcXCJcIiArIHRoaXMuYnVpbGRDbGFzc2VzKCkgKyBcIiBcIiArIChyb290Q2xhc3MgfHwgXCJcIikgKyBcIlxcXCI+XCI7XG4gICAgaHRtbCArPSBcIjxzdHlsZT5cIiArIHRoaXMuU3R5bGUuYnVpbGQoKSArIFwiPC9zdHlsZT5cIjtcblxuICAgIGlmIChzbGlkZXIpIHtcbiAgICAgIGh0bWwgKz0gYmVmb3JlU2xpZGVyIHx8IFwiXCI7XG4gICAgICBodG1sICs9IFwiPGRpdiBjbGFzcz1cXFwic3BsaWRlX19zbGlkZXJcXFwiPlwiO1xuICAgIH1cblxuICAgIGh0bWwgKz0gYmVmb3JlVHJhY2sgfHwgXCJcIjtcblxuICAgIGlmIChhcnJvd3MpIHtcbiAgICAgIGh0bWwgKz0gdGhpcy5yZW5kZXJBcnJvd3MoKTtcbiAgICB9XG5cbiAgICBodG1sICs9IFwiPGRpdiBjbGFzcz1cXFwic3BsaWRlX190cmFja1xcXCI+XCI7XG4gICAgaHRtbCArPSBcIjxcIiArIGxpc3RUYWcgKyBcIiBjbGFzcz1cXFwic3BsaWRlX19saXN0XFxcIj5cIjtcbiAgICBodG1sICs9IHRoaXMucmVuZGVyU2xpZGVzKCk7XG4gICAgaHRtbCArPSBcIjwvXCIgKyBsaXN0VGFnICsgXCI+XCI7XG4gICAgaHRtbCArPSBcIjwvZGl2PlwiO1xuICAgIGh0bWwgKz0gYWZ0ZXJUcmFjayB8fCBcIlwiO1xuXG4gICAgaWYgKHNsaWRlcikge1xuICAgICAgaHRtbCArPSBcIjwvZGl2PlwiO1xuICAgICAgaHRtbCArPSBhZnRlclNsaWRlciB8fCBcIlwiO1xuICAgIH1cblxuICAgIGh0bWwgKz0gXCI8L2Rpdj5cIjtcbiAgICByZXR1cm4gaHRtbDtcbiAgfTtcblxuICByZXR1cm4gU3BsaWRlUmVuZGVyZXI7XG59KCk7XG5cbmV4cG9ydCB7IENMQVNTRVMsIENMQVNTX0FDVElWRSwgQ0xBU1NfQVJST1csIENMQVNTX0FSUk9XUywgQ0xBU1NfQVJST1dfTkVYVCwgQ0xBU1NfQVJST1dfUFJFViwgQ0xBU1NfQ0xPTkUsIENMQVNTX0NPTlRBSU5FUiwgQ0xBU1NfRk9DVVNfSU4sIENMQVNTX0lOSVRJQUxJWkVELCBDTEFTU19MSVNULCBDTEFTU19MT0FESU5HLCBDTEFTU19ORVhULCBDTEFTU19PVkVSRkxPVywgQ0xBU1NfUEFHSU5BVElPTiwgQ0xBU1NfUEFHSU5BVElPTl9QQUdFLCBDTEFTU19QUkVWLCBDTEFTU19QUk9HUkVTUywgQ0xBU1NfUFJPR1JFU1NfQkFSLCBDTEFTU19ST09ULCBDTEFTU19TTElERSwgQ0xBU1NfU1BJTk5FUiwgQ0xBU1NfU1IsIENMQVNTX1RPR0dMRSwgQ0xBU1NfVE9HR0xFX1BBVVNFLCBDTEFTU19UT0dHTEVfUExBWSwgQ0xBU1NfVFJBQ0ssIENMQVNTX1ZJU0lCTEUsIERFRkFVTFRTLCBFVkVOVF9BQ1RJVkUsIEVWRU5UX0FSUk9XU19NT1VOVEVELCBFVkVOVF9BUlJPV1NfVVBEQVRFRCwgRVZFTlRfQVVUT1BMQVlfUEFVU0UsIEVWRU5UX0FVVE9QTEFZX1BMQVksIEVWRU5UX0FVVE9QTEFZX1BMQVlJTkcsIEVWRU5UX0NMSUNLLCBFVkVOVF9ERVNUUk9ZLCBFVkVOVF9EUkFHLCBFVkVOVF9EUkFHR0VELCBFVkVOVF9EUkFHR0lORywgRVZFTlRfRU5EX0lOREVYX0NIQU5HRUQsIEVWRU5UX0hJRERFTiwgRVZFTlRfSU5BQ1RJVkUsIEVWRU5UX0xBWllMT0FEX0xPQURFRCwgRVZFTlRfTU9VTlRFRCwgRVZFTlRfTU9WRSwgRVZFTlRfTU9WRUQsIEVWRU5UX05BVklHQVRJT05fTU9VTlRFRCwgRVZFTlRfT1ZFUkZMT1csIEVWRU5UX1BBR0lOQVRJT05fTU9VTlRFRCwgRVZFTlRfUEFHSU5BVElPTl9VUERBVEVELCBFVkVOVF9SRUFEWSwgRVZFTlRfUkVGUkVTSCwgRVZFTlRfUkVTSVpFLCBFVkVOVF9SRVNJWkVELCBFVkVOVF9TQ1JPTEwsIEVWRU5UX1NDUk9MTEVELCBFVkVOVF9TSElGVEVELCBFVkVOVF9TTElERV9LRVlET1dOLCBFVkVOVF9VUERBVEVELCBFVkVOVF9WSVNJQkxFLCBFdmVudEJpbmRlciwgRXZlbnRJbnRlcmZhY2UsIEZBREUsIExPT1AsIExUUiwgUlRMLCBSZXF1ZXN0SW50ZXJ2YWwsIFNMSURFLCBTVEFUVVNfQ0xBU1NFUywgU3BsaWRlLCBTcGxpZGVSZW5kZXJlciwgU3RhdGUsIFRUQiwgVGhyb3R0bGUsIFNwbGlkZSBhcyBkZWZhdWx0IH07XG4iLCIvLyBDbGFzcyB0aGF0IGhhbmRsZXMgdGhlIHBsYXliYWNrIG9mIHRoZSB3aG9sZSBib29rXG5pbXBvcnQge1xuICAgIEJvb2ssXG4gICAgQm9va1R5cGUsXG4gICAgUGFnZSxcbiAgICBUZXh0RWxlbWVudCxcbiAgICBJbWFnZUVsZW1lbnQsXG4gICAgQXVkaW9FbGVtZW50LFxuICAgIEF1ZGlvVGltZXN0YW1wcyxcbiAgICBXb3JkVGltZXN0YW1wRWxlbWVudCxcbn0gZnJvbSBcIi4uL01vZGVscy9Nb2RlbHNcIjtcbmltcG9ydCB7IEVWRU5UX0FDVElWRSwgU3BsaWRlIH0gZnJvbSBcIkBzcGxpZGVqcy9zcGxpZGVcIjtcblxuZXhwb3J0IGNsYXNzIFBsYXlCYWNrRW5naW5lIHtcbiAgICBjdXJyZW50UGFnZTogbnVtYmVyO1xuICAgIG51bWJlck9mUGFnZXM6IG51bWJlcjtcbiAgICB0cmFuc2l0aW9uaW5nVG9QYWdlOiBib29sZWFuO1xuXG4gICAgaW1hZ2VzUGF0aDogc3RyaW5nO1xuICAgIGF1ZGlvUGF0aDogc3RyaW5nO1xuXG4gICAgZW1wdHlHbG93SW1hZ2VUYWc6IHN0cmluZyA9IFwiZW1wdHlfZ2xvd19pbWFnZVwiO1xuXG4gICAgc3BsaWRlSGFuZGxlOiBTcGxpZGU7XG5cbiAgICBjdXJyZW50Qm9va1R5cGU6IEJvb2tUeXBlO1xuXG4gICAgYm9vazogQm9vaztcblxuICAgIGN1cnJlbnRQYWdlQXV0b1BsYXllckludGVydmFsOiBhbnk7XG5cbiAgICBjdXJyZW50bHlQbGF5aW5nQXVkaW9FbGVtZW50OiBIVE1MQXVkaW9FbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjdXJyZW50V29yZFBsYXlpbmdUaW1lb3V0OiBOb2RlSlMuVGltZW91dDtcblxuICAgIGN1cnJlbnRHbG93SW1hZ2VUaW1lb3V0OiBOb2RlSlMuVGltZW91dDtcblxuICAgIGN1cnJlbnRseUFjdGl2ZUdsb3dJbWFnZXM6IEhUTUxEaXZFbGVtZW50W10gPSBbXTtcblxuICAgIGN1cnJlbnRseUFjdGl2ZVdvcmQ6IEhUTUxEaXZFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihpbWFnZXNQYXRoOiBzdHJpbmcsIGF1ZGlvUGF0aDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuaW1hZ2VzUGF0aCA9IGltYWdlc1BhdGg7XG4gICAgICAgIHRoaXMuYXVkaW9QYXRoID0gYXVkaW9QYXRoO1xuICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gMDtcbiAgICAgICAgdGhpcy5zcGxpZGVIYW5kbGUgPSBuZXcgU3BsaWRlKFwiLnNwbGlkZVwiLCB7XG4gICAgICAgICAgICBmaXhlZEhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IC0gMjAsXG4gICAgICAgIH0pLm1vdW50KCk7XG5cbiAgICAgICAgdGhpcy5zcGxpZGVIYW5kbGUub24oXCJtb3ZlXCIsIChuZXdJbmRleCwgb2xkSW5kZXgsIGRlc3RJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgIT09IG5ld0luZGV4KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdG9wcGluZyBhdWRpbyBmb3IgcGFnZSBmcm9tIG1vdmU6IFwiICsgb2xkSW5kZXgpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmluZ1RvUGFnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wUGFnZUF1ZGlvKHRoaXMuYm9vay5wYWdlc1tvbGRJbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNwbGlkZUhhbmRsZS5vbihcIm1vdmVkXCIsIChjdXJyZW50SW5kZXgsIHByZXZJbmRleCwgZGVzdEluZGV4KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSAhPT0gY3VycmVudEluZGV4KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJQbGF5aW5nIGF1ZGlvIGZvciBwYWdlIGZyb20gbW92ZWQ6IFwiICsgY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gY3VycmVudEluZGV4O1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmluZ1RvUGFnZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheVBhZ2VBdWRpbyh0aGlzLmJvb2sucGFnZXNbY3VycmVudEluZGV4XSwgY3VycmVudEluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zcGxpZGVIYW5kbGUub24oXCJkcmFnXCIsIChuZXdJbmRleCwgb2xkSW5kZXgsIGRlc3RJbmRleCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgIT09IG5ld0luZGV4KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdG9wcGluZyBhdWRpbyBmb3IgcGFnZSBmcm9tIGRyYWc6IFwiICsgb2xkSW5kZXgpO1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvbmluZ1RvUGFnZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wUGFnZUF1ZGlvKHRoaXMuYm9vay5wYWdlc1tvbGRJbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNwbGlkZUhhbmRsZS5vbihcImRyYWdnZWRcIiwgKGN1cnJlbnRJbmRleCwgcHJldkluZGV4LCBkZXN0SW5kZXgpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlICE9PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlBsYXlpbmcgYXVkaW8gZm9yIHBhZ2UgZnJvbSBkcmFnZ2VkOiBcIiArIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IGN1cnJlbnRJbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25pbmdUb1BhZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXlQYWdlQXVkaW8odGhpcy5ib29rLnBhZ2VzW2N1cnJlbnRJbmRleF0sIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuYWRkUGFnZVJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYWRkTWluaW16YXRpb25MaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGFkZE1pbmltemF0aW9uTGlzdGVuZXIoKSB7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsICgpID0+IHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09IFwidmlzaWJsZVwiKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5UGFnZUF1ZGlvKHRoaXMuYm9vay5wYWdlc1t0aGlzLmN1cnJlbnRQYWdlXSwgdGhpcy5jdXJyZW50UGFnZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RvcFBhZ2VBdWRpbyh0aGlzLmJvb2sucGFnZXNbdGhpcy5jdXJyZW50UGFnZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdG9wUGFnZUF1ZGlvKHBhZ2U6IFBhZ2UpIHtcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHBhZ2UncyB2aXN1YWwgZWxlbWVudHMsIGlmIHdlIGZpbmQgYW4gYXVkaW8gb2JqZWN0IGdldCBpdCBieSBpZCBhbmQgc3RvcCBpdFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhZ2UudmlzdWFsRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB2aXN1YWxFbGVtZW50ID0gcGFnZS52aXN1YWxFbGVtZW50c1tpXTtcbiAgICAgICAgICAgIGlmICh2aXN1YWxFbGVtZW50LnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgICAgICAgICAgIGxldCBhdWRpb0VsZW1lbnQ6IEF1ZGlvRWxlbWVudCA9IHZpc3VhbEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgbGV0IGF1ZGlvRWxlbWVudERvbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF1ZGlvRWxlbWVudC5kb21JRCkgYXMgSFRNTEF1ZGlvRWxlbWVudDtcbiAgICAgICAgICAgICAgICBhdWRpb0VsZW1lbnREb20ucGF1c2UoKTtcbiAgICAgICAgICAgICAgICBhdWRpb0VsZW1lbnREb20uY3VycmVudFRpbWUgPSAwO1xuICAgICAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jdXJyZW50UGFnZUF1dG9QbGF5ZXJJbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhdWRpb0VsZW1lbnQuYXVkaW9UaW1lc3RhbXBzLnRpbWVzdGFtcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHdvcmRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXVkaW9FbGVtZW50LmRvbUlEICsgXCJfd29yZF9cIiArIGopIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICB3b3JkRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiY3ItY2xpY2thYmxlLXdvcmQtYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICB3b3JkRWxlbWVudC5zdHlsZS5jb2xvciA9IFwid2hpdGVcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwbGF5UGFnZUF1ZGlvKHBhZ2U6IFBhZ2UsIHBhZ2VJbmRleDogbnVtYmVyKSB7XG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBwYWdlJ3MgdmlzdWFsIGVsZW1lbnRzLCBpZiB3ZSBmaW5kIGFuIGF1ZGlvIG9iamVjdCBnZXQgaXQgYnkgaWQgYW5kIHBsYXkgaXRcbiAgICAgICAgY29uc29sZS5sb2coXCJBdHRlbXB0aW5nIHRvIHBsYXkgYXVkaW8gZm9yIHBhZ2U6IFwiICsgcGFnZUluZGV4KTtcbiAgICAgICAgY29uc29sZS5sb2coXCJCb29rIGhhczogXCIgKyB0aGlzLmJvb2sucGFnZXMubGVuZ3RoICsgXCIgcGFnZXNcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHBhZ2UgaGFzIFwiICsgcGFnZS52aXN1YWxFbGVtZW50cy5sZW5ndGggKyBcIiB2aXN1YWwgZWxlbWVudHNcIik7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhZ2UudmlzdWFsRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB2aXN1YWxFbGVtZW50ID0gcGFnZS52aXN1YWxFbGVtZW50c1tpXTtcbiAgICAgICAgICAgIGlmICh2aXN1YWxFbGVtZW50LnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgICAgICAgICAgIGxldCBhdWRpb0VsZW1lbnQ6IEF1ZGlvRWxlbWVudCA9IHZpc3VhbEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJGb3VuZCB0aGUgYXVkaW8gZWxlbWVudCBpbiBwYWdlJ3MgdmlzdWFsIGVsZW1lbnRzOiBcIiArIGF1ZGlvRWxlbWVudC5hdWRpb1NyYyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJEb2VzIHRoZSBhdWRpbyBlbGVtZW50IGhhdmUgdGltZXN0YW1wcz8gXCIgKyAoYXVkaW9FbGVtZW50LmF1ZGlvVGltZXN0YW1wcyAhPT0gdW5kZWZpbmVkID8gXCJZZXNcIiA6IFwiTm9cIikpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXVkaW8gZWxlbWVudCBkb21JRDogXCIgKyBhdWRpb0VsZW1lbnQuZG9tSUQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBhdWRpb0VsZW1lbnREb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdWRpb0VsZW1lbnQuZG9tSUQpIGFzIEhUTUxBdWRpb0VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBdWRpbyBlbGVtZW50IGRvbSBpcyBudWxsIG9yIHVuZGVmaW5lZD8gXCIgKyAoYXVkaW9FbGVtZW50RG9tID09PSBudWxsIHx8IGF1ZGlvRWxlbWVudERvbSA9PT0gdW5kZWZpbmVkID8gXCJZZXNcIiA6IFwiTm9cIikpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF1ZGlvRWxlbWVudERvbS5wbGF5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlQbGF5aW5nQXVkaW9FbGVtZW50ID0gYXVkaW9FbGVtZW50RG9tO1xuXG4gICAgICAgICAgICAgICAgbGV0IGxhc3RXb3JkSW5kZXggPSAwO1xuICAgICAgICAgICAgICAgIGxldCBjdXJyZW50SW5kZXggPSAwO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdGFydGluZyB0aGUgYXV0byBwbGF5ZXIgaW50ZXJ2YWwgZm9yIHdvcmQgaGlnaGxpZ2h0aW5nIHdpdGggNjBtcyBpbnRlcnZhbFwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlQXV0b1BsYXllckludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGN1cnJlbnRUaW1lID0gYXVkaW9FbGVtZW50RG9tLmN1cnJlbnRUaW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhdWRpb0VsZW1lbnQuYXVkaW9UaW1lc3RhbXBzLnRpbWVzdGFtcHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VycmVudFRpbWUgPj0gYXVkaW9FbGVtZW50LmF1ZGlvVGltZXN0YW1wcy50aW1lc3RhbXBzW2pdLnN0YXJ0VGltZXN0YW1wICYmIGN1cnJlbnRUaW1lIDw9IGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMudGltZXN0YW1wc1tqXS5lbmRUaW1lc3RhbXApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudEluZGV4ID0gajtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHdvcmRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYXVkaW9FbGVtZW50LmRvbUlEICsgXCJfd29yZF9cIiArIGN1cnJlbnRJbmRleCkgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5QWN0aXZlV29yZCA9IHdvcmRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY3ItY2xpY2thYmxlLXdvcmQtYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JkRWxlbWVudC5zdHlsZS5jb2xvciA9IGF1ZGlvRWxlbWVudC5nbG93Q29sb3I7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZW5hYmxlQ29ubmVjdGVkR3JhcGhpY0hpZ2hsaWdodGluZyhwYWdlSW5kZXgsIGN1cnJlbnRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RXb3JkSW5kZXggPCBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDdXJyZW50IGluZGV4OiBcIiArIGN1cnJlbnRJbmRleCArIFwiIGxhc3QgaW5kZXg6IFwiICsgbGFzdFdvcmRJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB3b3JkRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF1ZGlvRWxlbWVudC5kb21JRCArIFwiX3dvcmRfXCIgKyBsYXN0V29yZEluZGV4KSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZShcImNyLWNsaWNrYWJsZS13b3JkLWFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd29yZEVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RXb3JkSW5kZXggPSBjdXJyZW50SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lID49IGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMudGltZXN0YW1wc1thdWRpb0VsZW1lbnQuYXVkaW9UaW1lc3RhbXBzLnRpbWVzdGFtcHMubGVuZ3RoIC0gMV0uZW5kVGltZXN0YW1wIC0gMC4xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJGaW5pc2hlZCBIaWdobGlnaHRpbmchIEN1cnJlbnQgaW5kZXg6IFwiICsgY3VycmVudEluZGV4ICsgXCIgbGFzdCBpbmRleDogXCIgKyBsYXN0V29yZEluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgd29yZEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdWRpb0VsZW1lbnQuZG9tSUQgKyBcIl93b3JkX1wiICsgY3VycmVudEluZGV4KSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3b3JkRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiY3ItY2xpY2thYmxlLXdvcmQtYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdvcmRFbGVtZW50LnN0eWxlLmNvbG9yID0gXCJ3aGl0ZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5UGxheWluZ0F1ZGlvRWxlbWVudCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLmN1cnJlbnRQYWdlQXV0b1BsYXllckludGVydmFsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDYwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFkZFBhZ2VSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zcGxpZGVIYW5kbGUub3B0aW9ucy5maXhlZEhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDIwO1xuICAgICAgICAgICAgdGhpcy5zcGxpZGVIYW5kbGUucmVmcmVzaCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplQm9vayhib29rOiBCb29rKSB7XG4gICAgICAgIHRoaXMuYm9vayA9IGJvb2s7XG4gICAgICAgIHRoaXMuY3VycmVudEJvb2tUeXBlID0gYm9vay5ib29rVHlwZTtcbiAgICAgICAgdGhpcy5udW1iZXJPZlBhZ2VzID0gYm9vay5wYWdlcy5sZW5ndGg7XG5cbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEJvb2tUeXBlID09PSBCb29rVHlwZS5DdXJpb3VzUmVhZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVDdXJpb3VzUmVhZGVyQm9vayhib29rKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRCb29rVHlwZSA9PT0gQm9va1R5cGUuR0RMKSB7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVHRExCb29rKGJvb2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaW5pdGlhbGl6ZUN1cmlvdXNSZWFkZXJCb29rKGJvb2s6IEJvb2spIHtcbiAgICAgICAgdGhpcy5udW1iZXJPZlBhZ2VzID0gYm9vay5wYWdlcy5sZW5ndGg7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib29rLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzbGlkZUxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICAgICAgICAgICAgY29uc3Qgc2xpZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgICAgICBzbGlkZUxpLnN0eWxlLmRpc3BsYXkgPSBcImZsZXhcIjtcbiAgICAgICAgICAgIHNsaWRlTGkuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgc2xpZGVMaS5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2xpZGUuc3R5bGUucG9zaXRpb24gPSBcInJlbGF0aXZlXCI7XG4gICAgICAgICAgICBzbGlkZS5zdHlsZS53aWR0aCA9IFwiOTAlXCI7XG4gICAgICAgICAgICBzbGlkZS5zdHlsZS5oZWlnaHQgPSBcIjkwJVwiO1xuICAgICAgICAgICAgc2xpZGUuc3R5bGUudG9wID0gXCItNCVcIjtcblxuICAgICAgICAgICAgc2xpZGVMaS5hcHBlbmRDaGlsZChzbGlkZSk7XG5cbiAgICAgICAgICAgIHNsaWRlTGkuY2xhc3NMaXN0LmFkZChcInNwbGlkZV9fc2xpZGVcIik7XG5cbiAgICAgICAgICAgIGxldCBzZW50ZW5jZUluaXRpYWxpemVkQnlBdWRpbyA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBGaXJzdCB3ZSBhcmUgYWRkaW5nIHRoZSBpbWFnZSBhbmQgYXVkaW8gZWxlbWVudHMgYW5kIHRoZSB0ZXh0IGFmdGVyXG4gICAgICAgICAgICAvLyB0aGUgcmVhc29uaW5nIGJlaGluZCB0aGlzIGlzIHRoYXQgaWYgdGhlIHBhZ2UgY29udGFpbnMgYW4gYXVkaW9cbiAgICAgICAgICAgIC8vIGVsZW1lbnQgaW4gdGhhdCBjYXNlIHdlIHNob3VsZCBpbml0aWFsaXplIHRleHQgZnJvbSB0aGUgYXVkaW9cbiAgICAgICAgICAgIC8vIHRpbWVzdGFtcHMgdGhhdCB3ZSBnZXQgZnJvbSB0aGUgY29udGVudCBmaWxlXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvb2sucGFnZXNbaV0udmlzdWFsRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdmlzdWFsRWxlbWVudCA9IGJvb2sucGFnZXNbaV0udmlzdWFsRWxlbWVudHNbal07XG4gICAgICAgICAgICAgICAgaWYgKHZpc3VhbEVsZW1lbnQudHlwZSA9PSBcImltYWdlXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltYWdlRWxlbWVudDogSW1hZ2VFbGVtZW50ID0gdmlzdWFsRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBhZ2VJbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSW1hZ2VDb250YWluZXIocGFnZUluZGV4LCBpbWFnZUVsZW1lbnQsIGopKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZpc3VhbEVsZW1lbnQudHlwZSA9PSBcImF1ZGlvXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VudGVuY2VJbml0aWFsaXplZEJ5QXVkaW8gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBsZXQgYXVkaW9FbGVtZW50OiBBdWRpb0VsZW1lbnQgPSB2aXN1YWxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0RWxlbWVudDogVGV4dEVsZW1lbnQgPSBudWxsO1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9vay5wYWdlc1tpXS52aXN1YWxFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHZpc3VhbEVsZW1lbnQgPSBib29rLnBhZ2VzW2ldLnZpc3VhbEVsZW1lbnRzW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZpc3VhbEVsZW1lbnQudHlwZSA9PSBcInRleHRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRFbGVtZW50ID0gdmlzdWFsRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZUVsZW1lbnQ6IEltYWdlRWxlbWVudCA9IG51bGw7XG5cbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBib29rLnBhZ2VzW2ldLnZpc3VhbEVsZW1lbnRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdmlzdWFsRWxlbWVudCA9IGJvb2sucGFnZXNbaV0udmlzdWFsRWxlbWVudHNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmlzdWFsRWxlbWVudC50eXBlID09IFwiaW1hZ2VcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudCA9IHZpc3VhbEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAodGV4dEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdWRpb0FuZFRleHREaXZzID0gdGhpcy5jcmVhdGVBdWRpb0FuZFRleHRDb250YWluZXJzKGksIGF1ZGlvRWxlbWVudCwgdGV4dEVsZW1lbnQsIGltYWdlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZChhdWRpb0FuZFRleHREaXZzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmFwcGVuZENoaWxkKGF1ZGlvQW5kVGV4dERpdnNbMV0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVBdWRpb0NvbnRhaW5lcihhdWRpb0VsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuc3BsaWRlSGFuZGxlLmFkZChzbGlkZUxpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgdGhlIHNlbnRlbmNlIHdhc24ndCBub3QgaW5pdGlhbGl6ZWQgYnkgdGhlIGF1ZGlvIG9iamVjdFxuICAgICAgICAgICAgLy8gdGhlbiB3ZSBhZGQgaXQgaGVyZVxuICAgICAgICAgICAgaWYgKCFzZW50ZW5jZUluaXRpYWxpemVkQnlBdWRpbykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgYm9vay5wYWdlc1tpXS52aXN1YWxFbGVtZW50cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdmlzdWFsRWxlbWVudCA9IGJvb2sucGFnZXNbaV0udmlzdWFsRWxlbWVudHNbal07XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aXN1YWxFbGVtZW50LnR5cGUgPT0gXCJ0ZXh0XCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZXh0RWxlbWVudDogVGV4dEVsZW1lbnQgPSB2aXN1YWxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVRleHRDb250YWluZXIodGV4dEVsZW1lbnQpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVRleHRDb250YWluZXIodGV4dEVsZW1lbnQ6IFRleHRFbGVtZW50KTogSFRNTERpdkVsZW1lbnQge1xuICAgICAgICBsZXQgdGV4dEVsZW1lbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIHRleHRFbGVtZW50RGl2LmlkID0gXCJjci10ZXh0XCI7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LmNsYXNzTGlzdC5hZGQoXCJjci10ZXh0XCIpO1xuICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUud2Via2l0VGV4dFN0cm9rZSA9IFwiMXB4ICMzMDMwMzBcIjtcbiAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUuY29sb3IgPSBcIiNGRkZGRkZcIjtcbiAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUudGV4dFNoYWRvdyA9IFwiMC4xcmVtIDAuMTVyZW0gMC4xcmVtICMzMDMwMzBcIjtcbiAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUuZm9udEZhbWlseSA9IFwiUXVpY2tzYW5kXCI7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmZvbnRXZWlnaHQgPSBcIjgwMFwiO1xuICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5mb250U2l6ZSA9IFwiaW5oZXJpdFwiO1xuICAgICAgICAvLyBUT0RPOiByZW1vdmUgdGhpcyBhZnRlciB3ZSBoYXZlIGZpeGVzIGZyb20gdGhlIHBhcnRuZXIgdGVhbSBvbiB0aGVzZSBib29rc1xuICAgICAgICBpZiAodGhpcy5ib29rLmJvb2tOYW1lLmluY2x1ZGVzKFwiQ29tZUNvbWVcIikgfHxcbiAgICAgICAgdGhpcy5ib29rLmJvb2tOYW1lLmluY2x1ZGVzKFwiSUxvdmVcIikgfHxcbiAgICAgICAgdGhpcy5ib29rLmJvb2tOYW1lLmluY2x1ZGVzKFwiR3Vlc3NXaGF0SUFtXCIpIHx8XG4gICAgICAgIHRoaXMuYm9vay5ib29rTmFtZS5pbmNsdWRlcyhcIlRoZVVtYnJlbGxhc1wiKSB8fFxuICAgICAgICB0aGlzLmJvb2suYm9va05hbWUuaW5jbHVkZXMoXCJJQW1GbHlpbmdcIikpIHtcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLnRvcCA9IHRleHRFbGVtZW50LnBvc2l0aW9uWSArIFwiJVwiO1xuICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUubGVmdCA9IFwiMCVcIjtcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5oZWlnaHQgPSB0ZXh0RWxlbWVudC5oZWlnaHQgKyBcIiVcIjtcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS50b3AgPSB0ZXh0RWxlbWVudC5wb3NpdGlvblkgKyBcIiVcIjtcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmxlZnQgPSB0ZXh0RWxlbWVudC5wb3NpdGlvblggKyBcIiVcIjtcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLndpZHRoID0gdGV4dEVsZW1lbnQud2lkdGggKyBcIiVcIjtcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmhlaWdodCA9IHRleHRFbGVtZW50LmhlaWdodCArIFwiJVwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIHRleHRFbGVtZW50RGl2LmlubmVySFRNTCA9IHRleHRFbGVtZW50LnRleHRDb250ZW50QXNIVE1MLnJlcGxhY2UoXCIyLjI1ZW1cIiwgXCJcIik7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LmlubmVySFRNTCA9IHRleHRFbGVtZW50LnRleHRDb250ZW50QXNIVE1MLnJlcGxhY2UoL2ZvbnQtc2l6ZTpbXjtdKzsvZywgXCJcIik7XG5cbiAgICAgICAgcmV0dXJuIHRleHRFbGVtZW50RGl2O1xuICAgIH1cblxuICAgIGNyZWF0ZUltYWdlQ29udGFpbmVyKHBhZ2VJbmRleDogbnVtYmVyLCBpbWFnZUVsZW1lbnQ6IEltYWdlRWxlbWVudCwgZWxlbWVudEluZGV4OiBudW1iZXIpOiBIVE1MRGl2RWxlbWVudCB7XG4gICAgICAgIGxldCBpbWFnZUVsZW1lbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIHRoZXNlIGxvZ2ljIGVkaXRzIHdoZW4gdGhlc2UgYm9va3MgYXJlIGZpeGVkLlxuICAgICAgICBpZiAodGhpcy5ib29rLmJvb2tOYW1lLmluY2x1ZGVzKFwiQ29tZUNvbWVcIikgfHxcbiAgICAgICAgdGhpcy5ib29rLmJvb2tOYW1lLmluY2x1ZGVzKFwiSUxvdmVcIikgfHxcbiAgICAgICAgdGhpcy5ib29rLmJvb2tOYW1lLmluY2x1ZGVzKFwiR3Vlc3NXaGF0SUFtXCIpIHx8XG4gICAgICAgIHRoaXMuYm9vay5ib29rTmFtZS5pbmNsdWRlcyhcIlRoZVVtYnJlbGxhc1wiKSB8fFxuICAgICAgICB0aGlzLmJvb2suYm9va05hbWUuaW5jbHVkZXMoXCJJQW1GbHlpbmdcIikpIHtcbiAgICAgICAgICAgIGlmIChpbWFnZUVsZW1lbnQuaW1hZ2VTb3VyY2UgPT09IHRoaXMuZW1wdHlHbG93SW1hZ2VUYWcpIHtcbiAgICAgICAgICAgICAgICAvLyBpbWFnZUVsZW1lbnREaXYuc3R5bGUubGVmdCA9IGltYWdlRWxlbWVudC5wb3NpdGlvblggKyAoaW1hZ2VFbGVtZW50LnBvc2l0aW9uWCA8PSA2MCA/IDEwIDogLTEwKSArIFwiJVwiO1xuICAgICAgICAgICAgICAgIGlmIChpbWFnZUVsZW1lbnQucG9zaXRpb25YIDw9IDQyKSB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS5sZWZ0ID0gaW1hZ2VFbGVtZW50LnBvc2l0aW9uWCArIDEwICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpbWFnZUVsZW1lbnQucG9zaXRpb25YID49IDcwKSB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS5sZWZ0ID0gaW1hZ2VFbGVtZW50LnBvc2l0aW9uWCAtIDEwICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VFbGVtZW50RGl2LnN0eWxlLmxlZnQgPSBpbWFnZUVsZW1lbnQucG9zaXRpb25YICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS53aWR0aCA9IGltYWdlRWxlbWVudC53aWR0aCAqIDAuNyArIFwiJVwiO1xuICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS5oZWlnaHQgPSBpbWFnZUVsZW1lbnQuaGVpZ2h0ICogMC43ICsgXCIlXCI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS5sZWZ0ID0gaW1hZ2VFbGVtZW50LnBvc2l0aW9uWCArIDEwICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgaW1hZ2VFbGVtZW50RGl2LnN0eWxlLndpZHRoID0gaW1hZ2VFbGVtZW50LndpZHRoICogMC44ICsgXCIlXCI7XG4gICAgICAgICAgICAgICAgaW1hZ2VFbGVtZW50RGl2LnN0eWxlLmhlaWdodCA9IGltYWdlRWxlbWVudC5oZWlnaHQgKiAwLjggKyBcIiVcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS50b3AgPSBpbWFnZUVsZW1lbnQucG9zaXRpb25ZICsgXCIlXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbWFnZUVsZW1lbnREaXYuc3R5bGUudG9wID0gaW1hZ2VFbGVtZW50LnBvc2l0aW9uWSArIFwiJVwiO1xuICAgICAgICAgICAgaW1hZ2VFbGVtZW50RGl2LnN0eWxlLmxlZnQgPSBpbWFnZUVsZW1lbnQucG9zaXRpb25YICsgXCIlXCI7XG4gICAgICAgICAgICBpbWFnZUVsZW1lbnREaXYuc3R5bGUud2lkdGggPSBpbWFnZUVsZW1lbnQud2lkdGggKyBcIiVcIjtcbiAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5zdHlsZS5oZWlnaHQgPSBpbWFnZUVsZW1lbnQuaGVpZ2h0ICsgXCIlXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1hZ2VFbGVtZW50LmltYWdlU291cmNlID09PSB0aGlzLmVtcHR5R2xvd0ltYWdlVGFnKSB7XG4gICAgICAgICAgICBpbWFnZUVsZW1lbnREaXYuY2xhc3NMaXN0LmFkZChcImNyLWltYWdlLWVtcHR5LWdsb3dcIik7XG4gICAgICAgICAgICAvLyBVc2luZyBjbGFzc2VzIGhlcmUgaW5zdGVhZCBvZiBpZCBhc3NpZ25tZW50LCBiZWNhdXNlIHdlIGNvdWxkIGhhdmUgbXVsdGlwbGUgZ2xvd2luZyBkaXZzXG4gICAgICAgICAgICAvLyBhdHRhY2hlZCB0byBvbmUgd29yZCBpbiB0aGUgc2VudGVuY2UgYW5kIGhhdmluZyBtdWx0aXBsZSBlbGVtZW50cyB3aXRoIHRoZSBzYW1lIGlkIGlzIG5vdFxuICAgICAgICAgICAgLy8gYWxsb3dlZCBpbiBIVE1MXG4gICAgICAgICAgICBpZiAoaW1hZ2VFbGVtZW50LmRvbUlEID09PSB1bmRlZmluZWQgfHwgaW1hZ2VFbGVtZW50LmRvbUlEID09PSBudWxsIHx8IGltYWdlRWxlbWVudC5kb21JRCA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gXCJpbWdcIiArIHBhZ2VJbmRleCArIFwiX1wiICsgZWxlbWVudEluZGV4O1xuICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5pZCA9IGlkO1xuICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIG1lYW5zIHRoYXQgdGhlIGdsb3dpbmcgb2JqZWN0IGlzbid0IGNvbm5lY3RlZCB0byBhbnkgd29yZCBpbiB0aGUgc2VudGVuY2UsIGl0IHNob3VsZCBzdGlsbCBoYXZlXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgZ2xvdyBlZmZlY3QgdGhvdWdoXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU3RhbmRhbG9uZUdsb3dJbWFnZUNsaWNrKHBhZ2VJbmRleCwgaWQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpbWFnZUVsZW1lbnREaXYuY2xhc3NMaXN0LmFkZChpbWFnZUVsZW1lbnQuZG9tSUQpO1xuICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudERpdi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUdsb3dJbWFnZUNsaWNrKHBhZ2VJbmRleCwgaW1hZ2VFbGVtZW50LmRvbUlELnNwbGl0KFwiX1wiKVsxXSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbWFnZUVsZW1lbnREaXYuaWQgPSBpbWFnZUVsZW1lbnQuZG9tSUQ7XG4gICAgICAgICAgICBpbWFnZUVsZW1lbnREaXYuY2xhc3NMaXN0LmFkZChcImNyLWltYWdlXCIpO1xuXG4gICAgICAgICAgICBsZXQgaW1hZ2VFbGVtZW50SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgIGltYWdlRWxlbWVudEltZy5zcmMgPVxuICAgICAgICAgICAgICAgIHRoaXMuaW1hZ2VzUGF0aCArIGltYWdlRWxlbWVudC5pbWFnZVNvdXJjZS5yZXBsYWNlKFwiaW1hZ2VzL1wiLCBcIlwiKTtcbiAgICAgICAgICAgIGltYWdlRWxlbWVudEltZy5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgaW1hZ2VFbGVtZW50SW1nLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgaW1hZ2VFbGVtZW50RGl2LmFwcGVuZENoaWxkKGltYWdlRWxlbWVudEltZyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW1hZ2VFbGVtZW50RGl2O1xuICAgIH1cblxuICAgIGNyZWF0ZUF1ZGlvQ29udGFpbmVyKGF1ZGlvRWxlbWVudDogQXVkaW9FbGVtZW50KTogSFRNTERpdkVsZW1lbnQge1xuICAgICAgICBsZXQgYXVkaW9FbGVtZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblxuICAgICAgICBhdWRpb0VsZW1lbnREaXYuY2xhc3NMaXN0LmFkZChcImNyLWF1ZGlvXCIpO1xuICAgICAgICBhdWRpb0VsZW1lbnREaXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG5cbiAgICAgICAgbGV0IHBhZ2VBdWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcbiAgICAgICAgcGFnZUF1ZGlvLmlkID0gYXVkaW9FbGVtZW50LmRvbUlEO1xuICAgICAgICBwYWdlQXVkaW8uc3JjID0gdGhpcy5hdWRpb1BhdGggKyBhdWRpb0VsZW1lbnQuYXVkaW9TcmMucmVwbGFjZShcImF1ZGlvcy9cIiwgXCJcIik7XG4gICAgICAgIHBhZ2VBdWRpby5jb250cm9scyA9IGZhbHNlO1xuICAgICAgICBhdWRpb0VsZW1lbnREaXYuYXBwZW5kQ2hpbGQocGFnZUF1ZGlvKTtcblxuICAgICAgICBpZiAoYXVkaW9FbGVtZW50LmF1ZGlvVGltZXN0YW1wcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMudGltZXN0YW1wcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCB3b3JkVGltZXN0YW1wRWxlbWVudDogV29yZFRpbWVzdGFtcEVsZW1lbnQgPSBhdWRpb0VsZW1lbnQuYXVkaW9UaW1lc3RhbXBzLnRpbWVzdGFtcHNbaV07XG4gICAgICAgICAgICAgICAgbGV0IHdvcmRBdWRpb0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XG4gICAgICAgICAgICAgICAgd29yZEF1ZGlvRWxlbWVudC5pZCA9IHdvcmRUaW1lc3RhbXBFbGVtZW50LmRvbUlEO1xuICAgICAgICAgICAgICAgIHdvcmRBdWRpb0VsZW1lbnQuc3JjID0gdGhpcy5hdWRpb1BhdGggKyB3b3JkVGltZXN0YW1wRWxlbWVudC5hdWRpb1NyYy5yZXBsYWNlKFwiYXVkaW9zL1wiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICB3b3JkQXVkaW9FbGVtZW50LmNvbnRyb2xzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYXVkaW9FbGVtZW50RGl2LmFwcGVuZENoaWxkKHdvcmRBdWRpb0VsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGF1ZGlvRWxlbWVudERpdjtcbiAgICB9XG5cbiAgICBjcmVhdGVBdWRpb0FuZFRleHRDb250YWluZXJzKHBhZ2VJbmRleDogbnVtYmVyLCBhdWRpb0VsZW1lbnQ6IEF1ZGlvRWxlbWVudCwgdGV4dEVsZW1lbnQ6IFRleHRFbGVtZW50LCBpbWFnZUVsZW1lbnQ6IEltYWdlRWxlbWVudCk6IEhUTUxEaXZFbGVtZW50W10ge1xuICAgICAgICBsZXQgYXVkaW9BbmRUZXh0QXJyYXk6IEhUTUxEaXZFbGVtZW50W10gPSBBcnJheSgpO1xuXG4gICAgICAgIGxldCBhdWRpb0VsZW1lbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXG4gICAgICAgIGF1ZGlvRWxlbWVudERpdi5jbGFzc0xpc3QuYWRkKFwiY3ItYXVkaW9cIik7XG4gICAgICAgIGF1ZGlvRWxlbWVudERpdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcblxuICAgICAgICBsZXQgcGFnZUF1ZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xuICAgICAgICBwYWdlQXVkaW8uaWQgPSBhdWRpb0VsZW1lbnQuZG9tSUQ7XG4gICAgICAgIHBhZ2VBdWRpby5zcmMgPSB0aGlzLmF1ZGlvUGF0aCArIGF1ZGlvRWxlbWVudC5hdWRpb1NyYy5yZXBsYWNlKFwiYXVkaW9zL1wiLCBcIlwiKTtcbiAgICAgICAgcGFnZUF1ZGlvLmNvbnRyb2xzID0gZmFsc2U7XG4gICAgICAgIGF1ZGlvRWxlbWVudERpdi5hcHBlbmRDaGlsZChwYWdlQXVkaW8pO1xuXG4gICAgICAgIGxldCBzZW50ZW5jZUFycmF5VHJpbW1lZDogc3RyaW5nW10gPSBBcnJheSgpO1xuXG4gICAgICAgIGlmIChhdWRpb0VsZW1lbnQuYXVkaW9UaW1lc3RhbXBzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXVkaW9FbGVtZW50LmF1ZGlvVGltZXN0YW1wcy50aW1lc3RhbXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IHdvcmRUaW1lc3RhbXBFbGVtZW50OiBXb3JkVGltZXN0YW1wRWxlbWVudCA9IGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMudGltZXN0YW1wc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgd29yZEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcbiAgICAgICAgICAgICAgICB3b3JkQXVkaW9FbGVtZW50LmlkID0gd29yZFRpbWVzdGFtcEVsZW1lbnQuZG9tSUQ7XG4gICAgICAgICAgICAgICAgd29yZEF1ZGlvRWxlbWVudC5zcmMgPSB0aGlzLmF1ZGlvUGF0aCArIHdvcmRUaW1lc3RhbXBFbGVtZW50LmF1ZGlvU3JjLnJlcGxhY2UoXCJhdWRpb3MvXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgIHdvcmRBdWRpb0VsZW1lbnQuY29udHJvbHMgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZW50ZW5jZUFycmF5VHJpbW1lZC5wdXNoKHdvcmRUaW1lc3RhbXBFbGVtZW50LndvcmQudHJpbSgpKTtcbiAgICAgICAgICAgICAgICBhdWRpb0VsZW1lbnREaXYuYXBwZW5kQ2hpbGQod29yZEF1ZGlvRWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhdWRpb0FuZFRleHRBcnJheS5wdXNoKGF1ZGlvRWxlbWVudERpdik7XG5cbiAgICAgICAgbGV0IGF1ZGlvQ29udGVudERPTUlkID0gYXVkaW9FbGVtZW50LmRvbUlEO1xuXG4gICAgICAgIGxldCB0ZXh0RWxlbWVudERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cbiAgICAgICAgdGV4dEVsZW1lbnREaXYuaWQgPSBcImNyLXRleHRcIjtcbiAgICAgICAgdGV4dEVsZW1lbnREaXYuY2xhc3NMaXN0LmFkZChcImNyLXRleHRcIik7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5kaXNwbGF5ID0gXCJmbGV4XCI7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmp1c3RpZnlDb250ZW50ID0gXCJjZW50ZXJcIjtcbiAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUuYWxpZ25JdGVtcyA9IFwiY2VudGVyXCI7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLndlYmtpdFRleHRTdHJva2UgPSBcIjFweCAjMzAzMDMwXCI7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmNvbG9yID0gXCIjRkZGRkZGXCI7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLnRleHRTaGFkb3cgPSBcIjAuMXJlbSAwLjE1cmVtIDAuMXJlbSAjMzAzMDMwXCI7XG4gICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmZvbnRGYW1pbHkgPSBcIlF1aWNrc2FuZFwiO1xuICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5mb250V2VpZ2h0ID0gXCI4MDBcIjtcbiAgICAgICAgLy8gdGV4dEVsZW1lbnREaXYuc3R5bGUuZm9udFNpemUgPSBcIjJyZW1cIjtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmJvb2suYm9va05hbWUuaW5jbHVkZXMoXCJDb21lQ29tZVwiKSB8fFxuICAgICAgICB0aGlzLmJvb2suYm9va05hbWUuaW5jbHVkZXMoXCJJTG92ZVwiKSB8fFxuICAgICAgICB0aGlzLmJvb2suYm9va05hbWUuaW5jbHVkZXMoXCJHdWVzc1doYXRJQW1cIikgfHxcbiAgICAgICAgdGhpcy5ib29rLmJvb2tOYW1lLmluY2x1ZGVzKFwiVGhlVW1icmVsbGFzXCIpIHx8XG4gICAgICAgIHRoaXMuYm9vay5ib29rTmFtZS5pbmNsdWRlcyhcIklBbUZseWluZ1wiKSkge1xuICAgICAgICAgICAgdGV4dEVsZW1lbnQud2lkdGggPSAxMDA7XG4gICAgICAgICAgICB0ZXh0RWxlbWVudC5wb3NpdGlvblggPSAwO1xuICAgICAgICAgICAgdGV4dEVsZW1lbnQucG9zaXRpb25ZID0gODE7XG4gICAgICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS50b3AgPSBcIjgxJVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUudG9wID0gdGV4dEVsZW1lbnQucG9zaXRpb25ZICsgXCIlXCI7XG4gICAgICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5oZWlnaHQgPSB0ZXh0RWxlbWVudC5oZWlnaHQgKyBcIiVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIFxuICAgICAgICBpZiAoaW1hZ2VFbGVtZW50LnBvc2l0aW9uWCA+IDI4ICYmIHRleHRFbGVtZW50LndpZHRoIDwgODggJiYgdGV4dEVsZW1lbnQucG9zaXRpb25ZIDwgNjUpIHtcbiAgICAgICAgICAgIC8vIExlZnQgc2lkZSBvZiB0aGUgaW1hZ2UsIHR5cGljYWxseSAgdGhlIGxlZnQgYWxpZ25lZCB0ZXh0IHN0YXJ0cyB3YXkgYWJvdmUgY29tcGFyZWQgdG8gdGhlIG1pZGRsZSB0ZXh0XG4gICAgICAgICAgICAvLyB3aGljaCB3b3VsZCBoYXZlIHBvc2l0aW9uWSA+IDcwIGlmIGl0J3MgYXQgdGhlIGJvdHRvbSBvZiB0aGUgaW1hZ2VcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmxlZnQgPSB0ZXh0RWxlbWVudC5wb3NpdGlvblggKyBcIiVcIjtcbiAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLndpZHRoID0gXCI0MiVcIjtcbiAgICAgICAgfSBlbHNlIGlmIChpbWFnZUVsZW1lbnQucG9zaXRpb25YIDw9IDI4ICYmIHRleHRFbGVtZW50LndpZHRoIDwgODgpIHtcbiAgICAgICAgICAgIC8vIFJpZ2h0IHNpZGUgb2YgdGhlIGltYWdlXG4gICAgICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5sZWZ0ID0gdGV4dEVsZW1lbnQucG9zaXRpb25YICsgMiArIFwiJVwiO1xuICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUud2lkdGggPSB0ZXh0RWxlbWVudC53aWR0aCArIFwiJVwiO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZW50ZW5jZVBhcmFncmFwaDogSFRNTFBhcmFncmFwaEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICAgICAgaWYgKGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMgIT09IHVuZGVmaW5lZCAmJiBhdWRpb0VsZW1lbnQuYXVkaW9UaW1lc3RhbXBzLnRpbWVzdGFtcHMubGVuZ3RoID4gMTUpIHtcbiAgICAgICAgICAgIHNlbnRlbmNlUGFyYWdyYXBoLmNsYXNzTGlzdC5hZGQoXCJjci1zZW50ZW5jZS1taW5pLXNcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoYXVkaW9FbGVtZW50LmF1ZGlvVGltZXN0YW1wcyAhPT0gdW5kZWZpbmVkICYmIGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMudGltZXN0YW1wcy5sZW5ndGggPiAxMCAmJlxuICAgICAgICAgICAgYXVkaW9FbGVtZW50LmF1ZGlvVGltZXN0YW1wcy50aW1lc3RhbXBzLmxlbmd0aCA8PSAxNSkge1xuICAgICAgICAgICAgc2VudGVuY2VQYXJhZ3JhcGguY2xhc3NMaXN0LmFkZChcImNyLXNlbnRlbmNlLW1pbmlcIik7XG4gICAgICAgIH1cbiAgICAgICAgc2VudGVuY2VQYXJhZ3JhcGguc3R5bGUudGV4dEFsaWduID0gXCJjZW50ZXJcIjtcbiAgICAgICAgLy8gc2VudGVuY2VQYXJhZ3JhcGguc3R5bGUuZm9udFNpemUgPSBcIjJyZW1cIjtcbiAgICBcbiAgICAgICAgc2VudGVuY2VQYXJhZ3JhcGguc3R5bGUubWFyZ2luID0gXCIwcHhcIjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlbnRlbmNlQXJyYXlUcmltbWVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY2xpY2thYmxlV29yZEVsZW1lbnQ6IEhUTUxTcGFuRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgICAgICBjbGlja2FibGVXb3JkRWxlbWVudC5pZCA9IGF1ZGlvQ29udGVudERPTUlkICsgXCJfd29yZF9cIiArIGk7XG4gICAgICAgICAgICBjbGlja2FibGVXb3JkRWxlbWVudC5jbGFzc0xpc3QuYWRkKFwiY3ItY2xpY2thYmxlLXdvcmRcIik7XG4gICAgICAgICAgICBjbGlja2FibGVXb3JkRWxlbWVudC5zdHlsZS5tYXJnaW5MZWZ0ID0gXCIxMHB4XCI7XG4gICAgICAgICAgICBjbGlja2FibGVXb3JkRWxlbWVudC5zdHlsZS5tYXJnaW5SaWdodCA9IFwiMTBweFwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjbGlja2FibGVXb3JkRWxlbWVudC5pbm5lclRleHQgPSBzZW50ZW5jZUFycmF5VHJpbW1lZFtpXTtcbiAgICAgICAgICAgIGNsaWNrYWJsZVdvcmRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXYpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUludGVyYWN0aXZlV29yZENsaWNrKHBhZ2VJbmRleCwgaSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbnRlbmNlUGFyYWdyYXBoLmFwcGVuZENoaWxkKGNsaWNrYWJsZVdvcmRFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRleHRFbGVtZW50RGl2LmFwcGVuZENoaWxkKHNlbnRlbmNlUGFyYWdyYXBoKTtcblxuICAgICAgICBhdWRpb0FuZFRleHRBcnJheS5wdXNoKHRleHRFbGVtZW50RGl2KTtcblxuICAgICAgICByZXR1cm4gYXVkaW9BbmRUZXh0QXJyYXk7XG4gICAgfVxuXG4gICAgaGFuZGxlU3RhbmRhbG9uZUdsb3dJbWFnZUNsaWNrKHBhZ2VJbmRleDogbnVtYmVyLCBpZDogc3RyaW5nKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVBsYXlpbmdBdWRpb0VsZW1lbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudGx5UGxheWluZ0F1ZGlvRWxlbWVudC5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlQbGF5aW5nQXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jdXJyZW50UGFnZUF1dG9QbGF5ZXJJbnRlcnZhbCk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jdXJyZW50V29yZFBsYXlpbmdUaW1lb3V0KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmN1cnJlbnRHbG93SW1hZ2VUaW1lb3V0KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudGx5QWN0aXZlR2xvd0ltYWdlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmN1cnJlbnRseUFjdGl2ZUdsb3dJbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlBY3RpdmVHbG93SW1hZ2VzW2ldLnN0eWxlLmJveFNoYWRvdyA9IFwidHJhbnNwYXJlbnQgMHB4IDBweCAyMHB4IDIwcHhcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN1cnJlbnRseUFjdGl2ZUdsb3dJbWFnZXMgPSBBcnJheSgpO1xuXG4gICAgICAgIGxldCBnbG93RGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY3VycmVudGx5QWN0aXZlR2xvd0ltYWdlcy5wdXNoKGdsb3dEaXYpO1xuICAgICAgICBnbG93RGl2LnN0eWxlLmJveFNoYWRvdyA9IFwib3JhbmdlIDBweCAwcHggMjBweCAyMHB4XCI7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50R2xvd0ltYWdlVGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGdsb3dEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgYXMgSFRNTERpdkVsZW1lbnQ7XG4gICAgICAgICAgICBnbG93RGl2LnN0eWxlLmJveFNoYWRvdyA9IFwidHJhbnNwYXJlbnQgMHB4IDBweCAyMHB4IDIwcHhcIjtcbiAgICAgICAgfSwgNjAwKTtcbiAgICB9XG5cbiAgICBoYW5kbGVHbG93SW1hZ2VDbGljayhwYWdlSW5kZXg6IG51bWJlciwgd29yZEluZGV4OiBzdHJpbmcpIHtcbiAgICAgICAgLy8gUGFyc2UgdGhlIG51bWJlciBmcm9tIHRoZSB3b3JkSW5kZXhcbiAgICAgICAgbGV0IHdvcmRJbmRleE51bWJlciA9IHBhcnNlSW50KHdvcmRJbmRleCk7XG4gICAgICAgIHRoaXMuaGFuZGxlSW50ZXJhY3RpdmVXb3JkQ2xpY2socGFnZUluZGV4LCB3b3JkSW5kZXhOdW1iZXIpO1xuICAgIH1cblxuICAgIGVuYWJsZUNvbm5lY3RlZEdyYXBoaWNIaWdobGlnaHRpbmcocGFnZUluZGV4OiBudW1iZXIsIHdvcmRJbmRleDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlSW50ZXJhY3RpdmVXb3JkQ2xpY2socGFnZUluZGV4LCB3b3JkSW5kZXgsIHRydWUpO1xuICAgIH1cblxuICAgIGhhbmRsZUludGVyYWN0aXZlV29yZENsaWNrKHBhZ2VJbmRleDogbnVtYmVyLCB3b3JkSW5kZXg6IG51bWJlciwgZ2xvd0ltYWdlT25seTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRseVBsYXlpbmdBdWRpb0VsZW1lbnQgIT09IG51bGwgJiYgIWdsb3dJbWFnZU9ubHkpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudGx5UGxheWluZ0F1ZGlvRWxlbWVudC5wYXVzZSgpO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlQbGF5aW5nQXVkaW9FbGVtZW50LmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jdXJyZW50UGFnZUF1dG9QbGF5ZXJJbnRlcnZhbCk7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy5jdXJyZW50V29yZFBsYXlpbmdUaW1lb3V0KTtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmN1cnJlbnRHbG93SW1hZ2VUaW1lb3V0KTtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRseUFjdGl2ZVdvcmQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseUFjdGl2ZVdvcmQuY2xhc3NMaXN0LnJlbW92ZShcImNyLWNsaWNrYWJsZS13b3JkLWFjdGl2ZVwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseUFjdGl2ZVdvcmQuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlBY3RpdmVHbG93SW1hZ2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY3VycmVudGx5QWN0aXZlR2xvd0ltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseUFjdGl2ZUdsb3dJbWFnZXNbaV0uc3R5bGUuYm94U2hhZG93ID0gXCJ0cmFuc3BhcmVudCAwcHggMHB4IDIwcHggMjBweFwiO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnRseUFjdGl2ZUdsb3dJbWFnZXMgPSBBcnJheSgpO1xuICAgICAgICBsZXQgcGFnZSA9IHRoaXMuYm9vay5wYWdlc1twYWdlSW5kZXhdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhZ2UudmlzdWFsRWxlbWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB2aXN1YWxFbGVtZW50ID0gcGFnZS52aXN1YWxFbGVtZW50c1tpXTtcbiAgICAgICAgICAgIGlmICh2aXN1YWxFbGVtZW50LnR5cGUgPT09IFwiYXVkaW9cIikge1xuICAgICAgICAgICAgICAgIGxldCBhdWRpb0VsZW1lbnQ6IEF1ZGlvRWxlbWVudCA9IHZpc3VhbEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICBsZXQgd29yZEF1ZGlvRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGF1ZGlvRWxlbWVudC5hdWRpb1RpbWVzdGFtcHMudGltZXN0YW1wc1t3b3JkSW5kZXhdLmRvbUlEKSBhcyBIVE1MQXVkaW9FbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgaWYgKCFnbG93SW1hZ2VPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIEhpZ2hsaWdodCB0aGUgd29yZFxuICAgICAgICAgICAgICAgICAgICBsZXQgd29yZEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChhdWRpb0VsZW1lbnQuZG9tSUQgKyBcIl93b3JkX1wiICsgd29yZEluZGV4KSBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlBY3RpdmVXb3JkID0gd29yZEVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdvcmRFbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJjci1jbGlja2FibGUtd29yZC1hY3RpdmVcIik7XG4gICAgICAgICAgICAgICAgICAgIHdvcmRFbGVtZW50LnN0eWxlLmNvbG9yID0gYXVkaW9FbGVtZW50Lmdsb3dDb2xvcjtcbiAgICBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50V29yZFBsYXlpbmdUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JkRWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiY3ItY2xpY2thYmxlLXdvcmQtYWN0aXZlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd29yZEVsZW1lbnQuc3R5bGUuY29sb3IgPSBcIndoaXRlXCI7XG4gICAgICAgICAgICAgICAgICAgIH0sIDYwMCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSGlnaGxpZ2h0IHRoZSBjb25uZWN0ZWQgZ2xvdyBpbWFnZXNcbiAgICAgICAgICAgICAgICBsZXQgY29ubmVjdGVkR2xvd0ltYWdlQ2xhc3MgPSBcImltZ1wiICsgYXVkaW9FbGVtZW50LmRvbUlEICsgXCJfXCIgKyB3b3JkSW5kZXg7XG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3RlZEdsb3dJbWFnZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGNvbm5lY3RlZEdsb3dJbWFnZUNsYXNzKTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbm5lY3RlZEdsb3dJbWFnZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGdsb3dEaXYgPSBjb25uZWN0ZWRHbG93SW1hZ2VzW2ldIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseUFjdGl2ZUdsb3dJbWFnZXMucHVzaChnbG93RGl2KTtcbiAgICAgICAgICAgICAgICAgICAgZ2xvd0Rpdi5zdHlsZS5ib3hTaGFkb3cgPSBhdWRpb0VsZW1lbnQuZ2xvd0NvbG9yICsgXCIgMHB4IDBweCAyMHB4IDIwcHhcIjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRHbG93SW1hZ2VUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29ubmVjdGVkR2xvd0ltYWdlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGdsb3dEaXYgPSBjb25uZWN0ZWRHbG93SW1hZ2VzW2ldIGFzIEhUTUxEaXZFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgZ2xvd0Rpdi5zdHlsZS5ib3hTaGFkb3cgPSBcInRyYW5zcGFyZW50IDBweCAwcHggMjBweCAyMHB4XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LCA2MDApO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFnbG93SW1hZ2VPbmx5KSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5UGxheWluZ0F1ZGlvRWxlbWVudCA9IHdvcmRBdWRpb0VsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHdvcmRBdWRpb0VsZW1lbnQucGxheSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXRpYWxpemVHRExCb29rKGJvb2s6IEJvb2spIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBib29rLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzbGlkZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIHNsaWRlLmNsYXNzTGlzdC5hZGQoXCJzcGxpZGVfX3NsaWRlXCIpO1xuXG4gICAgICAgICAgICAvLyBBZGQgYSBmbGV4Ym94IGNvbnRhaW5lciB0byB0aGUgc2xpZGUgd2l0aCBhIGNvbHVtbiBsYXlvdXRcbiAgICAgICAgICAgIGxldCBmbGV4Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgIGZsZXhDb250YWluZXIuY2xhc3NMaXN0LmFkZChcImdkbC1mbGV4LWNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIGZsZXhDb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xuICAgICAgICAgICAgZmxleENvbnRhaW5lci5zdHlsZS5mbGV4RGlyZWN0aW9uID0gXCJjb2x1bW5cIjtcbiAgICAgICAgICAgIGZsZXhDb250YWluZXIuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgZmxleENvbnRhaW5lci5zdHlsZS5hbGlnbkl0ZW1zID0gXCJjZW50ZXJcIjtcbiAgICAgICAgICAgIGZsZXhDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgICAgICBmbGV4Q29udGFpbmVyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgICBzbGlkZS5hcHBlbmRDaGlsZChmbGV4Q29udGFpbmVyKTtcblxuICAgICAgICAgICAgLy8gZm9yZWFjaCB2aXN1YWxlbGVtZW50IGluIHBhZ2UgYWRkIHRvIHNsaWRlXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGJvb2sucGFnZXNbaV0udmlzdWFsRWxlbWVudHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgdmlzdWFsRWxlbWVudCA9IGJvb2sucGFnZXNbaV0udmlzdWFsRWxlbWVudHNbal07XG4gICAgICAgICAgICAgICAgaWYgKHZpc3VhbEVsZW1lbnQudHlwZSA9PSBcInRleHRcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdGV4dEVsZW1lbnQ6IFRleHRFbGVtZW50ID0gdmlzdWFsRWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRleHRFbGVtZW50RGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUud2lkdGggPSBcIjYwJVwiO1xuXG4gICAgICAgICAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LmNsYXNzTGlzdC5hZGQoXCJnZGwtdGV4dFwiKTtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUud2Via2l0VGV4dFN0cm9rZSA9IFwiMXB4ICMzMDMwMzBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUuY29sb3IgPSBcIiNGRkZGRkZcIjtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUudGV4dFNoYWRvdyA9IFwiMC4xcmVtIDAuMTVyZW0gMC4xcmVtICMzMDMwMzBcIjtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuc3R5bGUuZm9udEZhbWlseSA9IFwiUXVpY2tzYW5kXCI7XG4gICAgICAgICAgICAgICAgICAgIHRleHRFbGVtZW50RGl2LnN0eWxlLmZvbnRXZWlnaHQgPSBcIjgwMFwiO1xuICAgICAgICAgICAgICAgICAgICB0ZXh0RWxlbWVudERpdi5zdHlsZS5mb250U2l6ZSA9IFwiMS43ZW1cIjtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnREaXYuaW5uZXJIVE1MID0gdGV4dEVsZW1lbnQudGV4dENvbnRlbnRBc0hUTUwucmVwbGFjZShcIjIuMjVlbVwiLCBcIjI4cHhcIik7XG4gICAgICAgICAgICAgICAgICAgIGZsZXhDb250YWluZXIuYXBwZW5kQ2hpbGQodGV4dEVsZW1lbnREaXYpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmlzdWFsRWxlbWVudC50eXBlID09IFwiaW1hZ2VcIikge1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2VFbGVtZW50OiBJbWFnZUVsZW1lbnQgPSB2aXN1YWxFbGVtZW50O1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbWFnZUVsZW1lbnREaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICAgICAgICAgICAgICBpbWFnZUVsZW1lbnREaXYuY2xhc3NMaXN0LmFkZChcImdkbC1pbWFnZVwiKTtcblxuICAgICAgICAgICAgICAgICAgICBsZXQgaW1hZ2VFbGVtZW50SW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltZ1wiKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VFbGVtZW50SW1nLnNyYyA9IHRoaXMuaW1hZ2VzUGF0aCArIGltYWdlRWxlbWVudC5pbWFnZVNvdXJjZS5yZXBsYWNlKFwiaW1hZ2VzL1wiLCBcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VFbGVtZW50SW1nLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlRWxlbWVudEltZy5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICAgICAgICAgICAgICAgICAgaW1hZ2VFbGVtZW50RGl2LmFwcGVuZENoaWxkKGltYWdlRWxlbWVudEltZyk7XG4gICAgICAgICAgICAgICAgICAgIGZsZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoaW1hZ2VFbGVtZW50RGl2KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuc3BsaWRlSGFuZGxlLmFkZChzbGlkZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnb1RvTmV4dFBhZ2UoKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zaXRpb25pbmdUb1BhZ2UpIHJldHVybjtcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPCB0aGlzLm51bWJlck9mUGFnZXMpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UrKztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyYW5zaXRpb25Ub1BhZ2UodGhpcy5jdXJyZW50UGFnZSk7XG4gICAgfVxuXG4gICAgZ29Ub1ByZXZpb3VzUGFnZSgpIHtcbiAgICAgICAgaWYgKHRoaXMudHJhbnNpdGlvbmluZ1RvUGFnZSkgcmV0dXJuO1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UtLTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRyYW5zaXRpb25Ub1BhZ2UodGhpcy5jdXJyZW50UGFnZSk7XG4gICAgfVxuXG4gICAgdHJhbnNpdGlvblRvUGFnZShwYWdlTnVtYmVyOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uaW5nVG9QYWdlID0gdHJ1ZTtcbiAgICB9XG59XG4iLCIvKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogQGZpbGVvdmVydmlldyBGaXJlYmFzZSBjb25zdGFudHMuICBTb21lIG9mIHRoZXNlIChAZGVmaW5lcykgY2FuIGJlIG92ZXJyaWRkZW4gYXQgY29tcGlsZS10aW1lLlxyXG4gKi9cclxuY29uc3QgQ09OU1RBTlRTID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVmaW5lIHtib29sZWFufSBXaGV0aGVyIHRoaXMgaXMgdGhlIGNsaWVudCBOb2RlLmpzIFNESy5cclxuICAgICAqL1xyXG4gICAgTk9ERV9DTElFTlQ6IGZhbHNlLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZGVmaW5lIHtib29sZWFufSBXaGV0aGVyIHRoaXMgaXMgdGhlIEFkbWluIE5vZGUuanMgU0RLLlxyXG4gICAgICovXHJcbiAgICBOT0RFX0FETUlOOiBmYWxzZSxcclxuICAgIC8qKlxyXG4gICAgICogRmlyZWJhc2UgU0RLIFZlcnNpb25cclxuICAgICAqL1xyXG4gICAgU0RLX1ZFUlNJT046ICcke0pTQ09SRV9WRVJTSU9OfSdcclxufTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRocm93cyBhbiBlcnJvciBpZiB0aGUgcHJvdmlkZWQgYXNzZXJ0aW9uIGlzIGZhbHN5XHJcbiAqL1xyXG5jb25zdCBhc3NlcnQgPSBmdW5jdGlvbiAoYXNzZXJ0aW9uLCBtZXNzYWdlKSB7XHJcbiAgICBpZiAoIWFzc2VydGlvbikge1xyXG4gICAgICAgIHRocm93IGFzc2VydGlvbkVycm9yKG1lc3NhZ2UpO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogUmV0dXJucyBhbiBFcnJvciBvYmplY3Qgc3VpdGFibGUgZm9yIHRocm93aW5nLlxyXG4gKi9cclxuY29uc3QgYXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiAobWVzc2FnZSkge1xyXG4gICAgcmV0dXJuIG5ldyBFcnJvcignRmlyZWJhc2UgRGF0YWJhc2UgKCcgK1xyXG4gICAgICAgIENPTlNUQU5UUy5TREtfVkVSU0lPTiArXHJcbiAgICAgICAgJykgSU5URVJOQUwgQVNTRVJUIEZBSUxFRDogJyArXHJcbiAgICAgICAgbWVzc2FnZSk7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IHN0cmluZ1RvQnl0ZUFycmF5JDEgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAvLyBUT0RPKHVzZXIpOiBVc2UgbmF0aXZlIGltcGxlbWVudGF0aW9ucyBpZi93aGVuIGF2YWlsYWJsZVxyXG4gICAgY29uc3Qgb3V0ID0gW107XHJcbiAgICBsZXQgcCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgaWYgKGMgPCAxMjgpIHtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSBjO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjIDwgMjA0OCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDYpIHwgMTkyO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjICYgNjMpIHwgMTI4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICgoYyAmIDB4ZmMwMCkgPT09IDB4ZDgwMCAmJlxyXG4gICAgICAgICAgICBpICsgMSA8IHN0ci5sZW5ndGggJiZcclxuICAgICAgICAgICAgKHN0ci5jaGFyQ29kZUF0KGkgKyAxKSAmIDB4ZmMwMCkgPT09IDB4ZGMwMCkge1xyXG4gICAgICAgICAgICAvLyBTdXJyb2dhdGUgUGFpclxyXG4gICAgICAgICAgICBjID0gMHgxMDAwMCArICgoYyAmIDB4MDNmZikgPDwgMTApICsgKHN0ci5jaGFyQ29kZUF0KCsraSkgJiAweDAzZmYpO1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gMTIpIHwgMjI0O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xyXG4vKipcclxuICogVHVybnMgYW4gYXJyYXkgb2YgbnVtYmVycyBpbnRvIHRoZSBzdHJpbmcgZ2l2ZW4gYnkgdGhlIGNvbmNhdGVuYXRpb24gb2YgdGhlXHJcbiAqIGNoYXJhY3RlcnMgdG8gd2hpY2ggdGhlIG51bWJlcnMgY29ycmVzcG9uZC5cclxuICogQHBhcmFtIGJ5dGVzIEFycmF5IG9mIG51bWJlcnMgcmVwcmVzZW50aW5nIGNoYXJhY3RlcnMuXHJcbiAqIEByZXR1cm4gU3RyaW5naWZpY2F0aW9uIG9mIHRoZSBhcnJheS5cclxuICovXHJcbmNvbnN0IGJ5dGVBcnJheVRvU3RyaW5nID0gZnVuY3Rpb24gKGJ5dGVzKSB7XHJcbiAgICAvLyBUT0RPKHVzZXIpOiBVc2UgbmF0aXZlIGltcGxlbWVudGF0aW9ucyBpZi93aGVuIGF2YWlsYWJsZVxyXG4gICAgY29uc3Qgb3V0ID0gW107XHJcbiAgICBsZXQgcG9zID0gMCwgYyA9IDA7XHJcbiAgICB3aGlsZSAocG9zIDwgYnl0ZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgYzEgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgaWYgKGMxIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZShjMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMxID4gMTkxICYmIGMxIDwgMjI0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBvdXRbYysrXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjMSAmIDMxKSA8PCA2KSB8IChjMiAmIDYzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMxID4gMjM5ICYmIGMxIDwgMzY1KSB7XHJcbiAgICAgICAgICAgIC8vIFN1cnJvZ2F0ZSBQYWlyXHJcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCBjMyA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgY29uc3QgYzQgPSBieXRlc1twb3MrK107XHJcbiAgICAgICAgICAgIGNvbnN0IHUgPSAoKChjMSAmIDcpIDw8IDE4KSB8ICgoYzIgJiA2MykgPDwgMTIpIHwgKChjMyAmIDYzKSA8PCA2KSB8IChjNCAmIDYzKSkgLVxyXG4gICAgICAgICAgICAgICAgMHgxMDAwMDtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4ZDgwMCArICh1ID4+IDEwKSk7XHJcbiAgICAgICAgICAgIG91dFtjKytdID0gU3RyaW5nLmZyb21DaGFyQ29kZSgweGRjMDAgKyAodSAmIDEwMjMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGMyID0gYnl0ZXNbcG9zKytdO1xyXG4gICAgICAgICAgICBjb25zdCBjMyA9IGJ5dGVzW3BvcysrXTtcclxuICAgICAgICAgICAgb3V0W2MrK10gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYzEgJiAxNSkgPDwgMTIpIHwgKChjMiAmIDYzKSA8PCA2KSB8IChjMyAmIDYzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dC5qb2luKCcnKTtcclxufTtcclxuLy8gV2UgZGVmaW5lIGl0IGFzIGFuIG9iamVjdCBsaXRlcmFsIGluc3RlYWQgb2YgYSBjbGFzcyBiZWNhdXNlIGEgY2xhc3MgY29tcGlsZWQgZG93biB0byBlczUgY2FuJ3RcclxuLy8gYmUgdHJlZXNoYWtlZC4gaHR0cHM6Ly9naXRodWIuY29tL3JvbGx1cC9yb2xsdXAvaXNzdWVzLzE2OTFcclxuLy8gU3RhdGljIGxvb2t1cCBtYXBzLCBsYXppbHkgcG9wdWxhdGVkIGJ5IGluaXRfKClcclxuY29uc3QgYmFzZTY0ID0ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIGJ5dGVzIHRvIGNoYXJhY3RlcnMuXHJcbiAgICAgKi9cclxuICAgIGJ5dGVUb0NoYXJNYXBfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIGNoYXJhY3RlcnMgdG8gYnl0ZXMuXHJcbiAgICAgKi9cclxuICAgIGNoYXJUb0J5dGVNYXBfOiBudWxsLFxyXG4gICAgLyoqXHJcbiAgICAgKiBNYXBzIGJ5dGVzIHRvIHdlYnNhZmUgY2hhcmFjdGVycy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGJ5dGVUb0NoYXJNYXBXZWJTYWZlXzogbnVsbCxcclxuICAgIC8qKlxyXG4gICAgICogTWFwcyB3ZWJzYWZlIGNoYXJhY3RlcnMgdG8gYnl0ZXMuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjaGFyVG9CeXRlTWFwV2ViU2FmZV86IG51bGwsXHJcbiAgICAvKipcclxuICAgICAqIE91ciBkZWZhdWx0IGFscGhhYmV0LCBzaGFyZWQgYmV0d2VlblxyXG4gICAgICogRU5DT0RFRF9WQUxTIGFuZCBFTkNPREVEX1ZBTFNfV0VCU0FGRVxyXG4gICAgICovXHJcbiAgICBFTkNPREVEX1ZBTFNfQkFTRTogJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaJyArICdhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5eicgKyAnMDEyMzQ1Njc4OScsXHJcbiAgICAvKipcclxuICAgICAqIE91ciBkZWZhdWx0IGFscGhhYmV0LiBWYWx1ZSA2NCAoPSkgaXMgc3BlY2lhbDsgaXQgbWVhbnMgXCJub3RoaW5nLlwiXHJcbiAgICAgKi9cclxuICAgIGdldCBFTkNPREVEX1ZBTFMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnKy89JztcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIE91ciB3ZWJzYWZlIGFscGhhYmV0LlxyXG4gICAgICovXHJcbiAgICBnZXQgRU5DT0RFRF9WQUxTX1dFQlNBRkUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UgKyAnLV8uJztcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIFdoZXRoZXIgdGhpcyBicm93c2VyIHN1cHBvcnRzIHRoZSBhdG9iIGFuZCBidG9hIGZ1bmN0aW9ucy4gVGhpcyBleHRlbnNpb25cclxuICAgICAqIHN0YXJ0ZWQgYXQgTW96aWxsYSBidXQgaXMgbm93IGltcGxlbWVudGVkIGJ5IG1hbnkgYnJvd3NlcnMuIFdlIHVzZSB0aGVcclxuICAgICAqIEFTU1VNRV8qIHZhcmlhYmxlcyB0byBhdm9pZCBwdWxsaW5nIGluIHRoZSBmdWxsIHVzZXJhZ2VudCBkZXRlY3Rpb24gbGlicmFyeVxyXG4gICAgICogYnV0IHN0aWxsIGFsbG93aW5nIHRoZSBzdGFuZGFyZCBwZXItYnJvd3NlciBjb21waWxhdGlvbnMuXHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBIQVNfTkFUSVZFX1NVUFBPUlQ6IHR5cGVvZiBhdG9iID09PSAnZnVuY3Rpb24nLFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZW5jb2RlIGFuIGFycmF5IG9mIGJ5dGVzLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCBBbiBhcnJheSBvZiBieXRlcyAobnVtYmVycyB3aXRoXHJcbiAgICAgKiAgICAgdmFsdWUgaW4gWzAsIDI1NV0pIHRvIGVuY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIEJvb2xlYW4gaW5kaWNhdGluZyB3ZSBzaG91bGQgdXNlIHRoZVxyXG4gICAgICogICAgIGFsdGVybmF0aXZlIGFscGhhYmV0LlxyXG4gICAgICogQHJldHVybiBUaGUgYmFzZTY0IGVuY29kZWQgc3RyaW5nLlxyXG4gICAgICovXHJcbiAgICBlbmNvZGVCeXRlQXJyYXkoaW5wdXQsIHdlYlNhZmUpIHtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW5wdXQpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdlbmNvZGVCeXRlQXJyYXkgdGFrZXMgYW4gYXJyYXkgYXMgYSBwYXJhbWV0ZXInKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0XygpO1xyXG4gICAgICAgIGNvbnN0IGJ5dGVUb0NoYXJNYXAgPSB3ZWJTYWZlXHJcbiAgICAgICAgICAgID8gdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9cclxuICAgICAgICAgICAgOiB0aGlzLmJ5dGVUb0NoYXJNYXBfO1xyXG4gICAgICAgIGNvbnN0IG91dHB1dCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5wdXQubGVuZ3RoOyBpICs9IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTEgPSBpbnB1dFtpXTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUyID0gaSArIDEgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUyID0gaGF2ZUJ5dGUyID8gaW5wdXRbaSArIDFdIDogMDtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUzID0gaSArIDIgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUzID0gaGF2ZUJ5dGUzID8gaW5wdXRbaSArIDJdIDogMDtcclxuICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTEgPSBieXRlMSA+PiAyO1xyXG4gICAgICAgICAgICBjb25zdCBvdXRCeXRlMiA9ICgoYnl0ZTEgJiAweDAzKSA8PCA0KSB8IChieXRlMiA+PiA0KTtcclxuICAgICAgICAgICAgbGV0IG91dEJ5dGUzID0gKChieXRlMiAmIDB4MGYpIDw8IDIpIHwgKGJ5dGUzID4+IDYpO1xyXG4gICAgICAgICAgICBsZXQgb3V0Qnl0ZTQgPSBieXRlMyAmIDB4M2Y7XHJcbiAgICAgICAgICAgIGlmICghaGF2ZUJ5dGUzKSB7XHJcbiAgICAgICAgICAgICAgICBvdXRCeXRlNCA9IDY0O1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXZlQnl0ZTIpIHtcclxuICAgICAgICAgICAgICAgICAgICBvdXRCeXRlMyA9IDY0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTFdLCBieXRlVG9DaGFyTWFwW291dEJ5dGUyXSwgYnl0ZVRvQ2hhck1hcFtvdXRCeXRlM10sIGJ5dGVUb0NoYXJNYXBbb3V0Qnl0ZTRdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dC5qb2luKCcnKTtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIEJhc2U2NC1lbmNvZGUgYSBzdHJpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlucHV0IEEgc3RyaW5nIHRvIGVuY29kZS5cclxuICAgICAqIEBwYXJhbSB3ZWJTYWZlIElmIHRydWUsIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIFRoZSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGVuY29kZVN0cmluZyhpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XHJcbiAgICAgICAgLy8gYSBuYXRpdmUgYmFzZTY0IGVuY29kZXIgaW4gdGhlIGZvcm0gb2YgXCJidG9hL2F0b2JcIlxyXG4gICAgICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYnRvYShpbnB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVuY29kZUJ5dGVBcnJheShzdHJpbmdUb0J5dGVBcnJheSQxKGlucHV0KSwgd2ViU2FmZSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBpbnB1dCB0byBkZWNvZGUuXHJcbiAgICAgKiBAcGFyYW0gd2ViU2FmZSBUcnVlIGlmIHdlIHNob3VsZCB1c2UgdGhlXHJcbiAgICAgKiAgICAgYWx0ZXJuYXRpdmUgYWxwaGFiZXQuXHJcbiAgICAgKiBAcmV0dXJuIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGRlY29kZWQgdmFsdWUuXHJcbiAgICAgKi9cclxuICAgIGRlY29kZVN0cmluZyhpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIC8vIFNob3J0Y3V0IGZvciBNb3ppbGxhIGJyb3dzZXJzIHRoYXQgaW1wbGVtZW50XHJcbiAgICAgICAgLy8gYSBuYXRpdmUgYmFzZTY0IGVuY29kZXIgaW4gdGhlIGZvcm0gb2YgXCJidG9hL2F0b2JcIlxyXG4gICAgICAgIGlmICh0aGlzLkhBU19OQVRJVkVfU1VQUE9SVCAmJiAhd2ViU2FmZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYXRvYihpbnB1dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBieXRlQXJyYXlUb1N0cmluZyh0aGlzLmRlY29kZVN0cmluZ1RvQnl0ZUFycmF5KGlucHV0LCB3ZWJTYWZlKSk7XHJcbiAgICB9LFxyXG4gICAgLyoqXHJcbiAgICAgKiBCYXNlNjQtZGVjb2RlIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEluIGJhc2UtNjQgZGVjb2RpbmcsIGdyb3VwcyBvZiBmb3VyIGNoYXJhY3RlcnMgYXJlIGNvbnZlcnRlZCBpbnRvIHRocmVlXHJcbiAgICAgKiBieXRlcy4gIElmIHRoZSBlbmNvZGVyIGRpZCBub3QgYXBwbHkgcGFkZGluZywgdGhlIGlucHV0IGxlbmd0aCBtYXkgbm90XHJcbiAgICAgKiBiZSBhIG11bHRpcGxlIG9mIDQuXHJcbiAgICAgKlxyXG4gICAgICogSW4gdGhpcyBjYXNlLCB0aGUgbGFzdCBncm91cCB3aWxsIGhhdmUgZmV3ZXIgdGhhbiA0IGNoYXJhY3RlcnMsIGFuZFxyXG4gICAgICogcGFkZGluZyB3aWxsIGJlIGluZmVycmVkLiAgSWYgdGhlIGdyb3VwIGhhcyBvbmUgb3IgdHdvIGNoYXJhY3RlcnMsIGl0IGRlY29kZXNcclxuICAgICAqIHRvIG9uZSBieXRlLiAgSWYgdGhlIGdyb3VwIGhhcyB0aHJlZSBjaGFyYWN0ZXJzLCBpdCBkZWNvZGVzIHRvIHR3byBieXRlcy5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5wdXQgSW5wdXQgdG8gZGVjb2RlLlxyXG4gICAgICogQHBhcmFtIHdlYlNhZmUgVHJ1ZSBpZiB3ZSBzaG91bGQgdXNlIHRoZSB3ZWItc2FmZSBhbHBoYWJldC5cclxuICAgICAqIEByZXR1cm4gYnl0ZXMgcmVwcmVzZW50aW5nIHRoZSBkZWNvZGVkIHZhbHVlLlxyXG4gICAgICovXHJcbiAgICBkZWNvZGVTdHJpbmdUb0J5dGVBcnJheShpbnB1dCwgd2ViU2FmZSkge1xyXG4gICAgICAgIHRoaXMuaW5pdF8oKTtcclxuICAgICAgICBjb25zdCBjaGFyVG9CeXRlTWFwID0gd2ViU2FmZVxyXG4gICAgICAgICAgICA/IHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfXHJcbiAgICAgICAgICAgIDogdGhpcy5jaGFyVG9CeXRlTWFwXztcclxuICAgICAgICBjb25zdCBvdXRwdXQgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDspIHtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTEgPSBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKyspXTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGUyID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTIgPSBoYXZlQnl0ZTIgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiAwO1xyXG4gICAgICAgICAgICArK2k7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhdmVCeXRlMyA9IGkgPCBpbnB1dC5sZW5ndGg7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ5dGUzID0gaGF2ZUJ5dGUzID8gY2hhclRvQnl0ZU1hcFtpbnB1dC5jaGFyQXQoaSldIDogNjQ7XHJcbiAgICAgICAgICAgICsraTtcclxuICAgICAgICAgICAgY29uc3QgaGF2ZUJ5dGU0ID0gaSA8IGlucHV0Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3QgYnl0ZTQgPSBoYXZlQnl0ZTQgPyBjaGFyVG9CeXRlTWFwW2lucHV0LmNoYXJBdChpKV0gOiA2NDtcclxuICAgICAgICAgICAgKytpO1xyXG4gICAgICAgICAgICBpZiAoYnl0ZTEgPT0gbnVsbCB8fCBieXRlMiA9PSBudWxsIHx8IGJ5dGUzID09IG51bGwgfHwgYnl0ZTQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IERlY29kZUJhc2U2NFN0cmluZ0Vycm9yKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTEgPSAoYnl0ZTEgPDwgMikgfCAoYnl0ZTIgPj4gNCk7XHJcbiAgICAgICAgICAgIG91dHB1dC5wdXNoKG91dEJ5dGUxKTtcclxuICAgICAgICAgICAgaWYgKGJ5dGUzICE9PSA2NCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTIgPSAoKGJ5dGUyIDw8IDQpICYgMHhmMCkgfCAoYnl0ZTMgPj4gMik7XHJcbiAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMik7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnl0ZTQgIT09IDY0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0Qnl0ZTMgPSAoKGJ5dGUzIDw8IDYpICYgMHhjMCkgfCBieXRlNDtcclxuICAgICAgICAgICAgICAgICAgICBvdXRwdXQucHVzaChvdXRCeXRlMyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG91dHB1dDtcclxuICAgIH0sXHJcbiAgICAvKipcclxuICAgICAqIExhenkgc3RhdGljIGluaXRpYWxpemF0aW9uIGZ1bmN0aW9uLiBDYWxsZWQgYmVmb3JlXHJcbiAgICAgKiBhY2Nlc3NpbmcgYW55IG9mIHRoZSBzdGF0aWMgbWFwIHZhcmlhYmxlcy5cclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKi9cclxuICAgIGluaXRfKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5ieXRlVG9DaGFyTWFwXykge1xyXG4gICAgICAgICAgICB0aGlzLmJ5dGVUb0NoYXJNYXBfID0ge307XHJcbiAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwV2ViU2FmZV8gPSB7fTtcclxuICAgICAgICAgICAgLy8gV2Ugd2FudCBxdWljayBtYXBwaW5ncyBiYWNrIGFuZCBmb3J0aCwgc28gd2UgcHJlY29tcHV0ZSB0d28gbWFwcy5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLkVOQ09ERURfVkFMUy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwX1tpXSA9IHRoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcF9bdGhpcy5ieXRlVG9DaGFyTWFwX1tpXV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ieXRlVG9DaGFyTWFwV2ViU2FmZV9baV0gPSB0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuYnl0ZVRvQ2hhck1hcFdlYlNhZmVfW2ldXSA9IGk7XHJcbiAgICAgICAgICAgICAgICAvLyBCZSBmb3JnaXZpbmcgd2hlbiBkZWNvZGluZyBhbmQgY29ycmVjdGx5IGRlY29kZSBib3RoIGVuY29kaW5ncy5cclxuICAgICAgICAgICAgICAgIGlmIChpID49IHRoaXMuRU5DT0RFRF9WQUxTX0JBU0UubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFyVG9CeXRlTWFwX1t0aGlzLkVOQ09ERURfVkFMU19XRUJTQUZFLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhclRvQnl0ZU1hcFdlYlNhZmVfW3RoaXMuRU5DT0RFRF9WQUxTLmNoYXJBdChpKV0gPSBpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogQW4gZXJyb3IgZW5jb3VudGVyZWQgd2hpbGUgZGVjb2RpbmcgYmFzZTY0IHN0cmluZy5cclxuICovXHJcbmNsYXNzIERlY29kZUJhc2U2NFN0cmluZ0Vycm9yIGV4dGVuZHMgRXJyb3Ige1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcclxuICAgICAgICB0aGlzLm5hbWUgPSAnRGVjb2RlQmFzZTY0U3RyaW5nRXJyb3InO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBVUkwtc2FmZSBiYXNlNjQgZW5jb2RpbmdcclxuICovXHJcbmNvbnN0IGJhc2U2NEVuY29kZSA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIGNvbnN0IHV0ZjhCeXRlcyA9IHN0cmluZ1RvQnl0ZUFycmF5JDEoc3RyKTtcclxuICAgIHJldHVybiBiYXNlNjQuZW5jb2RlQnl0ZUFycmF5KHV0ZjhCeXRlcywgdHJ1ZSk7XHJcbn07XHJcbi8qKlxyXG4gKiBVUkwtc2FmZSBiYXNlNjQgZW5jb2RpbmcgKHdpdGhvdXQgXCIuXCIgcGFkZGluZyBpbiB0aGUgZW5kKS5cclxuICogZS5nLiBVc2VkIGluIEpTT04gV2ViIFRva2VuIChKV1QpIHBhcnRzLlxyXG4gKi9cclxuY29uc3QgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcgPSBmdW5jdGlvbiAoc3RyKSB7XHJcbiAgICAvLyBVc2UgYmFzZTY0dXJsIGVuY29kaW5nIGFuZCByZW1vdmUgcGFkZGluZyBpbiB0aGUgZW5kIChkb3QgY2hhcmFjdGVycykuXHJcbiAgICByZXR1cm4gYmFzZTY0RW5jb2RlKHN0cikucmVwbGFjZSgvXFwuL2csICcnKTtcclxufTtcclxuLyoqXHJcbiAqIFVSTC1zYWZlIGJhc2U2NCBkZWNvZGluZ1xyXG4gKlxyXG4gKiBOT1RFOiBETyBOT1QgdXNlIHRoZSBnbG9iYWwgYXRvYigpIGZ1bmN0aW9uIC0gaXQgZG9lcyBOT1Qgc3VwcG9ydCB0aGVcclxuICogYmFzZTY0VXJsIHZhcmlhbnQgZW5jb2RpbmcuXHJcbiAqXHJcbiAqIEBwYXJhbSBzdHIgVG8gYmUgZGVjb2RlZFxyXG4gKiBAcmV0dXJuIERlY29kZWQgcmVzdWx0LCBpZiBwb3NzaWJsZVxyXG4gKi9cclxuY29uc3QgYmFzZTY0RGVjb2RlID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICByZXR1cm4gYmFzZTY0LmRlY29kZVN0cmluZyhzdHIsIHRydWUpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdiYXNlNjREZWNvZGUgZmFpbGVkOiAnLCBlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRG8gYSBkZWVwLWNvcHkgb2YgYmFzaWMgSmF2YVNjcmlwdCBPYmplY3RzIG9yIEFycmF5cy5cclxuICovXHJcbmZ1bmN0aW9uIGRlZXBDb3B5KHZhbHVlKSB7XHJcbiAgICByZXR1cm4gZGVlcEV4dGVuZCh1bmRlZmluZWQsIHZhbHVlKTtcclxufVxyXG4vKipcclxuICogQ29weSBwcm9wZXJ0aWVzIGZyb20gc291cmNlIHRvIHRhcmdldCAocmVjdXJzaXZlbHkgYWxsb3dzIGV4dGVuc2lvblxyXG4gKiBvZiBPYmplY3RzIGFuZCBBcnJheXMpLiAgU2NhbGFyIHZhbHVlcyBpbiB0aGUgdGFyZ2V0IGFyZSBvdmVyLXdyaXR0ZW4uXHJcbiAqIElmIHRhcmdldCBpcyB1bmRlZmluZWQsIGFuIG9iamVjdCBvZiB0aGUgYXBwcm9wcmlhdGUgdHlwZSB3aWxsIGJlIGNyZWF0ZWRcclxuICogKGFuZCByZXR1cm5lZCkuXHJcbiAqXHJcbiAqIFdlIHJlY3Vyc2l2ZWx5IGNvcHkgYWxsIGNoaWxkIHByb3BlcnRpZXMgb2YgcGxhaW4gT2JqZWN0cyBpbiB0aGUgc291cmNlLSBzb1xyXG4gKiB0aGF0IG5hbWVzcGFjZS0gbGlrZSBkaWN0aW9uYXJpZXMgYXJlIG1lcmdlZC5cclxuICpcclxuICogTm90ZSB0aGF0IHRoZSB0YXJnZXQgY2FuIGJlIGEgZnVuY3Rpb24sIGluIHdoaWNoIGNhc2UgdGhlIHByb3BlcnRpZXMgaW5cclxuICogdGhlIHNvdXJjZSBPYmplY3QgYXJlIGNvcGllZCBvbnRvIGl0IGFzIHN0YXRpYyBwcm9wZXJ0aWVzIG9mIHRoZSBGdW5jdGlvbi5cclxuICpcclxuICogTm90ZTogd2UgZG9uJ3QgbWVyZ2UgX19wcm90b19fIHRvIHByZXZlbnQgcHJvdG90eXBlIHBvbGx1dGlvblxyXG4gKi9cclxuZnVuY3Rpb24gZGVlcEV4dGVuZCh0YXJnZXQsIHNvdXJjZSkge1xyXG4gICAgaWYgKCEoc291cmNlIGluc3RhbmNlb2YgT2JqZWN0KSkge1xyXG4gICAgICAgIHJldHVybiBzb3VyY2U7XHJcbiAgICB9XHJcbiAgICBzd2l0Y2ggKHNvdXJjZS5jb25zdHJ1Y3Rvcikge1xyXG4gICAgICAgIGNhc2UgRGF0ZTpcclxuICAgICAgICAgICAgLy8gVHJlYXQgRGF0ZXMgbGlrZSBzY2FsYXJzOyBpZiB0aGUgdGFyZ2V0IGRhdGUgb2JqZWN0IGhhZCBhbnkgY2hpbGRcclxuICAgICAgICAgICAgLy8gcHJvcGVydGllcyAtIHRoZXkgd2lsbCBiZSBsb3N0IVxyXG4gICAgICAgICAgICBjb25zdCBkYXRlVmFsdWUgPSBzb3VyY2U7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0ZShkYXRlVmFsdWUuZ2V0VGltZSgpKTtcclxuICAgICAgICBjYXNlIE9iamVjdDpcclxuICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB7fTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEFycmF5OlxyXG4gICAgICAgICAgICAvLyBBbHdheXMgY29weSB0aGUgYXJyYXkgc291cmNlIGFuZCBvdmVyd3JpdGUgdGhlIHRhcmdldC5cclxuICAgICAgICAgICAgdGFyZ2V0ID0gW107XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vIE5vdCBhIHBsYWluIE9iamVjdCAtIHRyZWF0IGl0IGFzIGEgc2NhbGFyLlxyXG4gICAgICAgICAgICByZXR1cm4gc291cmNlO1xyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBwcm9wIGluIHNvdXJjZSkge1xyXG4gICAgICAgIC8vIHVzZSBpc1ZhbGlkS2V5IHRvIGd1YXJkIGFnYWluc3QgcHJvdG90eXBlIHBvbGx1dGlvbi4gU2VlIGh0dHBzOi8vc255ay5pby92dWxuL1NOWUstSlMtTE9EQVNILTQ1MDIwMlxyXG4gICAgICAgIGlmICghc291cmNlLmhhc093blByb3BlcnR5KHByb3ApIHx8ICFpc1ZhbGlkS2V5KHByb3ApKSB7XHJcbiAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0YXJnZXRbcHJvcF0gPSBkZWVwRXh0ZW5kKHRhcmdldFtwcm9wXSwgc291cmNlW3Byb3BdKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbn1cclxuZnVuY3Rpb24gaXNWYWxpZEtleShrZXkpIHtcclxuICAgIHJldHVybiBrZXkgIT09ICdfX3Byb3RvX18nO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBQb2x5ZmlsbCBmb3IgYGdsb2JhbFRoaXNgIG9iamVjdC5cclxuICogQHJldHVybnMgdGhlIGBnbG9iYWxUaGlzYCBvYmplY3QgZm9yIHRoZSBnaXZlbiBlbnZpcm9ubWVudC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0R2xvYmFsKCkge1xyXG4gICAgaWYgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBzZWxmO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgIHJldHVybiBnbG9iYWw7XHJcbiAgICB9XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBsb2NhdGUgZ2xvYmFsIG9iamVjdC4nKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjIgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0c0Zyb21HbG9iYWwgPSAoKSA9PiBnZXRHbG9iYWwoKS5fX0ZJUkVCQVNFX0RFRkFVTFRTX187XHJcbi8qKlxyXG4gKiBBdHRlbXB0IHRvIHJlYWQgZGVmYXVsdHMgZnJvbSBhIEpTT04gc3RyaW5nIHByb3ZpZGVkIHRvXHJcbiAqIHByb2Nlc3MoLillbnYoLilfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb3IgYSBKU09OIGZpbGUgd2hvc2UgcGF0aCBpcyBpblxyXG4gKiBwcm9jZXNzKC4pZW52KC4pX19GSVJFQkFTRV9ERUZBVUxUU19QQVRIX19cclxuICogVGhlIGRvdHMgYXJlIGluIHBhcmVucyBiZWNhdXNlIGNlcnRhaW4gY29tcGlsZXJzIChWaXRlPykgY2Fubm90XHJcbiAqIGhhbmRsZSBzZWVpbmcgdGhhdCB2YXJpYWJsZSBpbiBjb21tZW50cy5cclxuICogU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9maXJlYmFzZS9maXJlYmFzZS1qcy1zZGsvaXNzdWVzLzY4MzhcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlID0gKCkgPT4ge1xyXG4gICAgaWYgKHR5cGVvZiBwcm9jZXNzID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgcHJvY2Vzcy5lbnYgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVmYXVsdHNKc29uU3RyaW5nID0gcHJvY2Vzcy5lbnYuX19GSVJFQkFTRV9ERUZBVUxUU19fO1xyXG4gICAgaWYgKGRlZmF1bHRzSnNvblN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKGRlZmF1bHRzSnNvblN0cmluZyk7XHJcbiAgICB9XHJcbn07XHJcbmNvbnN0IGdldERlZmF1bHRzRnJvbUNvb2tpZSA9ICgpID0+IHtcclxuICAgIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgbGV0IG1hdGNoO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaCgvX19GSVJFQkFTRV9ERUZBVUxUU19fPShbXjtdKykvKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLy8gU29tZSBlbnZpcm9ubWVudHMgc3VjaCBhcyBBbmd1bGFyIFVuaXZlcnNhbCBTU1IgaGF2ZSBhXHJcbiAgICAgICAgLy8gYGRvY3VtZW50YCBvYmplY3QgYnV0IGVycm9yIG9uIGFjY2Vzc2luZyBgZG9jdW1lbnQuY29va2llYC5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjb25zdCBkZWNvZGVkID0gbWF0Y2ggJiYgYmFzZTY0RGVjb2RlKG1hdGNoWzFdKTtcclxuICAgIHJldHVybiBkZWNvZGVkICYmIEpTT04ucGFyc2UoZGVjb2RlZCk7XHJcbn07XHJcbi8qKlxyXG4gKiBHZXQgdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuIEl0IGNoZWNrcyBpbiBvcmRlcjpcclxuICogKDEpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBhcyBhIHByb3BlcnR5IG9mIGBnbG9iYWxUaGlzYFxyXG4gKiAoMikgaWYgc3VjaCBhbiBvYmplY3Qgd2FzIHByb3ZpZGVkIG9uIGEgc2hlbGwgZW52aXJvbm1lbnQgdmFyaWFibGVcclxuICogKDMpIGlmIHN1Y2ggYW4gb2JqZWN0IGV4aXN0cyBpbiBhIGNvb2tpZVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0cyA9ICgpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIChnZXREZWZhdWx0c0Zyb21HbG9iYWwoKSB8fFxyXG4gICAgICAgICAgICBnZXREZWZhdWx0c0Zyb21FbnZWYXJpYWJsZSgpIHx8XHJcbiAgICAgICAgICAgIGdldERlZmF1bHRzRnJvbUNvb2tpZSgpKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ2F0Y2gtYWxsIGZvciBiZWluZyB1bmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWVcclxuICAgICAgICAgKiB0byBhbnkgZW52aXJvbm1lbnQgY2FzZSB3ZSBoYXZlIG5vdCBhY2NvdW50ZWQgZm9yLiBMb2cgdG9cclxuICAgICAgICAgKiBpbmZvIGluc3RlYWQgb2Ygc3dhbGxvd2luZyBzbyB3ZSBjYW4gZmluZCB0aGVzZSB1bmtub3duIGNhc2VzXHJcbiAgICAgICAgICogYW5kIGFkZCBwYXRocyBmb3IgdGhlbSBpZiBuZWVkZWQuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgY29uc29sZS5pbmZvKGBVbmFibGUgdG8gZ2V0IF9fRklSRUJBU0VfREVGQVVMVFNfXyBkdWUgdG86ICR7ZX1gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbn07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3Qgc3RvcmVkIGluIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0XHJcbiAqIGZvciB0aGUgZ2l2ZW4gcHJvZHVjdC5cclxuICogQHJldHVybnMgYSBVUkwgaG9zdCBmb3JtYXR0ZWQgbGlrZSBgMTI3LjAuMC4xOjk5OTlgIG9yIGBbOjoxXTo0MDAwYCBpZiBhdmFpbGFibGVcclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgZ2V0RGVmYXVsdEVtdWxhdG9ySG9zdCA9IChwcm9kdWN0TmFtZSkgPT4geyB2YXIgX2EsIF9iOyByZXR1cm4gKF9iID0gKF9hID0gZ2V0RGVmYXVsdHMoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmVtdWxhdG9ySG9zdHMpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYltwcm9kdWN0TmFtZV07IH07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGVtdWxhdG9yIGhvc3RuYW1lIGFuZCBwb3J0IHN0b3JlZCBpbiB0aGUgX19GSVJFQkFTRV9ERUZBVUxUU19fIG9iamVjdFxyXG4gKiBmb3IgdGhlIGdpdmVuIHByb2R1Y3QuXHJcbiAqIEByZXR1cm5zIGEgcGFpciBvZiBob3N0bmFtZSBhbmQgcG9ydCBsaWtlIGBbXCI6OjFcIiwgNDAwMF1gIGlmIGF2YWlsYWJsZVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXREZWZhdWx0RW11bGF0b3JIb3N0bmFtZUFuZFBvcnQgPSAocHJvZHVjdE5hbWUpID0+IHtcclxuICAgIGNvbnN0IGhvc3QgPSBnZXREZWZhdWx0RW11bGF0b3JIb3N0KHByb2R1Y3ROYW1lKTtcclxuICAgIGlmICghaG9zdCkge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcbiAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IGhvc3QubGFzdEluZGV4T2YoJzonKTsgLy8gRmluZGluZyB0aGUgbGFzdCBzaW5jZSBJUHY2IGFkZHIgYWxzbyBoYXMgY29sb25zLlxyXG4gICAgaWYgKHNlcGFyYXRvckluZGV4IDw9IDAgfHwgc2VwYXJhdG9ySW5kZXggKyAxID09PSBob3N0Lmxlbmd0aCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBob3N0ICR7aG9zdH0gd2l0aCBubyBzZXBhcmF0ZSBob3N0bmFtZSBhbmQgcG9ydCFgKTtcclxuICAgIH1cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLWdsb2JhbHNcclxuICAgIGNvbnN0IHBvcnQgPSBwYXJzZUludChob3N0LnN1YnN0cmluZyhzZXBhcmF0b3JJbmRleCArIDEpLCAxMCk7XHJcbiAgICBpZiAoaG9zdFswXSA9PT0gJ1snKSB7XHJcbiAgICAgICAgLy8gQnJhY2tldC1xdW90ZWQgYFtpcHY2YWRkcl06cG9ydGAgPT4gcmV0dXJuIFwiaXB2NmFkZHJcIiAod2l0aG91dCBicmFja2V0cykuXHJcbiAgICAgICAgcmV0dXJuIFtob3N0LnN1YnN0cmluZygxLCBzZXBhcmF0b3JJbmRleCAtIDEpLCBwb3J0XTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBbaG9zdC5zdWJzdHJpbmcoMCwgc2VwYXJhdG9ySW5kZXgpLCBwb3J0XTtcclxuICAgIH1cclxufTtcclxuLyoqXHJcbiAqIFJldHVybnMgRmlyZWJhc2UgYXBwIGNvbmZpZyBzdG9yZWQgaW4gdGhlIF9fRklSRUJBU0VfREVGQVVMVFNfXyBvYmplY3QuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmNvbnN0IGdldERlZmF1bHRBcHBDb25maWcgPSAoKSA9PiB7IHZhciBfYTsgcmV0dXJuIChfYSA9IGdldERlZmF1bHRzKCkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jb25maWc7IH07XHJcbi8qKlxyXG4gKiBSZXR1cm5zIGFuIGV4cGVyaW1lbnRhbCBzZXR0aW5nIG9uIHRoZSBfX0ZJUkVCQVNFX0RFRkFVTFRTX18gb2JqZWN0IChwcm9wZXJ0aWVzXHJcbiAqIHByZWZpeGVkIGJ5IFwiX1wiKVxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBnZXRFeHBlcmltZW50YWxTZXR0aW5nID0gKG5hbWUpID0+IHsgdmFyIF9hOyByZXR1cm4gKF9hID0gZ2V0RGVmYXVsdHMoKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hW2BfJHtuYW1lfWBdOyB9O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBEZWZlcnJlZCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnJlamVjdCA9ICgpID0+IHsgfTtcclxuICAgICAgICB0aGlzLnJlc29sdmUgPSAoKSA9PiB7IH07XHJcbiAgICAgICAgdGhpcy5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnJlc29sdmUgPSByZXNvbHZlO1xyXG4gICAgICAgICAgICB0aGlzLnJlamVjdCA9IHJlamVjdDtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogT3VyIEFQSSBpbnRlcm5hbHMgYXJlIG5vdCBwcm9taXNlaWZpZWQgYW5kIGNhbm5vdCBiZWNhdXNlIG91ciBjYWxsYmFjayBBUElzIGhhdmUgc3VidGxlIGV4cGVjdGF0aW9ucyBhcm91bmRcclxuICAgICAqIGludm9raW5nIHByb21pc2VzIGlubGluZSwgd2hpY2ggUHJvbWlzZXMgYXJlIGZvcmJpZGRlbiB0byBkby4gVGhpcyBtZXRob2QgYWNjZXB0cyBhbiBvcHRpb25hbCBub2RlLXN0eWxlIGNhbGxiYWNrXHJcbiAgICAgKiBhbmQgcmV0dXJucyBhIG5vZGUtc3R5bGUgY2FsbGJhY2sgd2hpY2ggd2lsbCByZXNvbHZlIG9yIHJlamVjdCB0aGUgRGVmZXJyZWQncyBwcm9taXNlLlxyXG4gICAgICovXHJcbiAgICB3cmFwQ2FsbGJhY2soY2FsbGJhY2spIHtcclxuICAgICAgICByZXR1cm4gKGVycm9yLCB2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVqZWN0KGVycm9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVzb2x2ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgICAgLy8gQXR0YWNoaW5nIG5vb3AgaGFuZGxlciBqdXN0IGluIGNhc2UgZGV2ZWxvcGVyIHdhc24ndCBleHBlY3RpbmdcclxuICAgICAgICAgICAgICAgIC8vIHByb21pc2VzXHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb21pc2UuY2F0Y2goKCkgPT4geyB9KTtcclxuICAgICAgICAgICAgICAgIC8vIFNvbWUgb2Ygb3VyIGNhbGxiYWNrcyBkb24ndCBleHBlY3QgYSB2YWx1ZSBhbmQgb3VyIG93biB0ZXN0c1xyXG4gICAgICAgICAgICAgICAgLy8gYXNzZXJ0IHRoYXQgdGhlIHBhcmFtZXRlciBsZW5ndGggaXMgMVxyXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxiYWNrLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZU1vY2tVc2VyVG9rZW4odG9rZW4sIHByb2plY3RJZCkge1xyXG4gICAgaWYgKHRva2VuLnVpZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIFwidWlkXCIgZmllbGQgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCBieSBtb2NrVXNlclRva2VuLiBQbGVhc2UgdXNlIFwic3ViXCIgaW5zdGVhZCBmb3IgRmlyZWJhc2UgQXV0aCBVc2VyIElELicpO1xyXG4gICAgfVxyXG4gICAgLy8gVW5zZWN1cmVkIEpXVHMgdXNlIFwibm9uZVwiIGFzIHRoZSBhbGdvcml0aG0uXHJcbiAgICBjb25zdCBoZWFkZXIgPSB7XHJcbiAgICAgICAgYWxnOiAnbm9uZScsXHJcbiAgICAgICAgdHlwZTogJ0pXVCdcclxuICAgIH07XHJcbiAgICBjb25zdCBwcm9qZWN0ID0gcHJvamVjdElkIHx8ICdkZW1vLXByb2plY3QnO1xyXG4gICAgY29uc3QgaWF0ID0gdG9rZW4uaWF0IHx8IDA7XHJcbiAgICBjb25zdCBzdWIgPSB0b2tlbi5zdWIgfHwgdG9rZW4udXNlcl9pZDtcclxuICAgIGlmICghc3ViKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibW9ja1VzZXJUb2tlbiBtdXN0IGNvbnRhaW4gJ3N1Yicgb3IgJ3VzZXJfaWQnIGZpZWxkIVwiKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHBheWxvYWQgPSBPYmplY3QuYXNzaWduKHsgXHJcbiAgICAgICAgLy8gU2V0IGFsbCByZXF1aXJlZCBmaWVsZHMgdG8gZGVjZW50IGRlZmF1bHRzXHJcbiAgICAgICAgaXNzOiBgaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tLyR7cHJvamVjdH1gLCBhdWQ6IHByb2plY3QsIGlhdCwgZXhwOiBpYXQgKyAzNjAwLCBhdXRoX3RpbWU6IGlhdCwgc3ViLCB1c2VyX2lkOiBzdWIsIGZpcmViYXNlOiB7XHJcbiAgICAgICAgICAgIHNpZ25faW5fcHJvdmlkZXI6ICdjdXN0b20nLFxyXG4gICAgICAgICAgICBpZGVudGl0aWVzOiB7fVxyXG4gICAgICAgIH0gfSwgdG9rZW4pO1xyXG4gICAgLy8gVW5zZWN1cmVkIEpXVHMgdXNlIHRoZSBlbXB0eSBzdHJpbmcgYXMgYSBzaWduYXR1cmUuXHJcbiAgICBjb25zdCBzaWduYXR1cmUgPSAnJztcclxuICAgIHJldHVybiBbXHJcbiAgICAgICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkoaGVhZGVyKSksXHJcbiAgICAgICAgYmFzZTY0dXJsRW5jb2RlV2l0aG91dFBhZGRpbmcoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpLFxyXG4gICAgICAgIHNpZ25hdHVyZVxyXG4gICAgXS5qb2luKCcuJyk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgbmF2aWdhdG9yLnVzZXJBZ2VudCBzdHJpbmcgb3IgJycgaWYgaXQncyBub3QgZGVmaW5lZC5cclxuICogQHJldHVybiB1c2VyIGFnZW50IHN0cmluZ1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0VUEoKSB7XHJcbiAgICBpZiAodHlwZW9mIG5hdmlnYXRvciAhPT0gJ3VuZGVmaW5lZCcgJiZcclxuICAgICAgICB0eXBlb2YgbmF2aWdhdG9yWyd1c2VyQWdlbnQnXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXR1cm4gbmF2aWdhdG9yWyd1c2VyQWdlbnQnXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxufVxyXG4vKipcclxuICogRGV0ZWN0IENvcmRvdmEgLyBQaG9uZUdhcCAvIElvbmljIGZyYW1ld29ya3Mgb24gYSBtb2JpbGUgZGV2aWNlLlxyXG4gKlxyXG4gKiBEZWxpYmVyYXRlbHkgZG9lcyBub3QgcmVseSBvbiBjaGVja2luZyBgZmlsZTovL2AgVVJMcyAoYXMgdGhpcyBmYWlscyBQaG9uZUdhcFxyXG4gKiBpbiB0aGUgUmlwcGxlIGVtdWxhdG9yKSBub3IgQ29yZG92YSBgb25EZXZpY2VSZWFkeWAsIHdoaWNoIHdvdWxkIG5vcm1hbGx5XHJcbiAqIHdhaXQgZm9yIGEgY2FsbGJhY2suXHJcbiAqL1xyXG5mdW5jdGlvbiBpc01vYmlsZUNvcmRvdmEoKSB7XHJcbiAgICByZXR1cm4gKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSBTZXR0aW5nIHVwIGFuIGJyb2FkbHkgYXBwbGljYWJsZSBpbmRleCBzaWduYXR1cmUgZm9yIFdpbmRvd1xyXG4gICAgICAgIC8vIGp1c3QgdG8gZGVhbCB3aXRoIHRoaXMgY2FzZSB3b3VsZCBwcm9iYWJseSBiZSBhIGJhZCBpZGVhLlxyXG4gICAgICAgICEhKHdpbmRvd1snY29yZG92YSddIHx8IHdpbmRvd1sncGhvbmVnYXAnXSB8fCB3aW5kb3dbJ1Bob25lR2FwJ10pICYmXHJcbiAgICAgICAgL2lvc3xpcGhvbmV8aXBvZHxpcGFkfGFuZHJvaWR8YmxhY2tiZXJyeXxpZW1vYmlsZS9pLnRlc3QoZ2V0VUEoKSkpO1xyXG59XHJcbi8qKlxyXG4gKiBEZXRlY3QgTm9kZS5qcy5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIE5vZGUuanMgZW52aXJvbm1lbnQgaXMgZGV0ZWN0ZWQgb3Igc3BlY2lmaWVkLlxyXG4gKi9cclxuLy8gTm9kZSBkZXRlY3Rpb24gbG9naWMgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL2lsaWFrYW4vZGV0ZWN0LW5vZGUvXHJcbmZ1bmN0aW9uIGlzTm9kZSgpIHtcclxuICAgIHZhciBfYTtcclxuICAgIGNvbnN0IGZvcmNlRW52aXJvbm1lbnQgPSAoX2EgPSBnZXREZWZhdWx0cygpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZm9yY2VFbnZpcm9ubWVudDtcclxuICAgIGlmIChmb3JjZUVudmlyb25tZW50ID09PSAnbm9kZScpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGVsc2UgaWYgKGZvcmNlRW52aXJvbm1lbnQgPT09ICdicm93c2VyJykge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZ2xvYmFsLnByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIERldGVjdCBCcm93c2VyIEVudmlyb25tZW50XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0Jyb3dzZXIoKSB7XHJcbiAgICByZXR1cm4gdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnICYmIHNlbGYuc2VsZiA9PT0gc2VsZjtcclxufVxyXG5mdW5jdGlvbiBpc0Jyb3dzZXJFeHRlbnNpb24oKSB7XHJcbiAgICBjb25zdCBydW50aW1lID0gdHlwZW9mIGNocm9tZSA9PT0gJ29iamVjdCdcclxuICAgICAgICA/IGNocm9tZS5ydW50aW1lXHJcbiAgICAgICAgOiB0eXBlb2YgYnJvd3NlciA9PT0gJ29iamVjdCdcclxuICAgICAgICAgICAgPyBicm93c2VyLnJ1bnRpbWVcclxuICAgICAgICAgICAgOiB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gdHlwZW9mIHJ1bnRpbWUgPT09ICdvYmplY3QnICYmIHJ1bnRpbWUuaWQgIT09IHVuZGVmaW5lZDtcclxufVxyXG4vKipcclxuICogRGV0ZWN0IFJlYWN0IE5hdGl2ZS5cclxuICpcclxuICogQHJldHVybiB0cnVlIGlmIFJlYWN0TmF0aXZlIGVudmlyb25tZW50IGlzIGRldGVjdGVkLlxyXG4gKi9cclxuZnVuY3Rpb24gaXNSZWFjdE5hdGl2ZSgpIHtcclxuICAgIHJldHVybiAodHlwZW9mIG5hdmlnYXRvciA9PT0gJ29iamVjdCcgJiYgbmF2aWdhdG9yWydwcm9kdWN0J10gPT09ICdSZWFjdE5hdGl2ZScpO1xyXG59XHJcbi8qKiBEZXRlY3RzIEVsZWN0cm9uIGFwcHMuICovXHJcbmZ1bmN0aW9uIGlzRWxlY3Ryb24oKSB7XHJcbiAgICByZXR1cm4gZ2V0VUEoKS5pbmRleE9mKCdFbGVjdHJvbi8nKSA+PSAwO1xyXG59XHJcbi8qKiBEZXRlY3RzIEludGVybmV0IEV4cGxvcmVyLiAqL1xyXG5mdW5jdGlvbiBpc0lFKCkge1xyXG4gICAgY29uc3QgdWEgPSBnZXRVQSgpO1xyXG4gICAgcmV0dXJuIHVhLmluZGV4T2YoJ01TSUUgJykgPj0gMCB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpID49IDA7XHJcbn1cclxuLyoqIERldGVjdHMgVW5pdmVyc2FsIFdpbmRvd3MgUGxhdGZvcm0gYXBwcy4gKi9cclxuZnVuY3Rpb24gaXNVV1AoKSB7XHJcbiAgICByZXR1cm4gZ2V0VUEoKS5pbmRleE9mKCdNU0FwcEhvc3QvJykgPj0gMDtcclxufVxyXG4vKipcclxuICogRGV0ZWN0IHdoZXRoZXIgdGhlIGN1cnJlbnQgU0RLIGJ1aWxkIGlzIHRoZSBOb2RlIHZlcnNpb24uXHJcbiAqXHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBpdCdzIHRoZSBOb2RlIFNESyBidWlsZC5cclxuICovXHJcbmZ1bmN0aW9uIGlzTm9kZVNkaygpIHtcclxuICAgIHJldHVybiBDT05TVEFOVFMuTk9ERV9DTElFTlQgPT09IHRydWUgfHwgQ09OU1RBTlRTLk5PREVfQURNSU4gPT09IHRydWU7XHJcbn1cclxuLyoqIFJldHVybnMgdHJ1ZSBpZiB3ZSBhcmUgcnVubmluZyBpbiBTYWZhcmkuICovXHJcbmZ1bmN0aW9uIGlzU2FmYXJpKCkge1xyXG4gICAgcmV0dXJuICghaXNOb2RlKCkgJiZcclxuICAgICAgICAhIW5hdmlnYXRvci51c2VyQWdlbnQgJiZcclxuICAgICAgICBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdTYWZhcmknKSAmJlxyXG4gICAgICAgICFuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdDaHJvbWUnKSk7XHJcbn1cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIGNoZWNrcyBpZiBpbmRleGVkREIgaXMgc3VwcG9ydGVkIGJ5IGN1cnJlbnQgYnJvd3Nlci9zZXJ2aWNlIHdvcmtlciBjb250ZXh0XHJcbiAqIEByZXR1cm4gdHJ1ZSBpZiBpbmRleGVkREIgaXMgc3VwcG9ydGVkIGJ5IGN1cnJlbnQgYnJvd3Nlci9zZXJ2aWNlIHdvcmtlciBjb250ZXh0XHJcbiAqL1xyXG5mdW5jdGlvbiBpc0luZGV4ZWREQkF2YWlsYWJsZSgpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBpbmRleGVkREIgPT09ICdvYmplY3QnO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFRoaXMgbWV0aG9kIHZhbGlkYXRlcyBicm93c2VyL3N3IGNvbnRleHQgZm9yIGluZGV4ZWREQiBieSBvcGVuaW5nIGEgZHVtbXkgaW5kZXhlZERCIGRhdGFiYXNlIGFuZCByZWplY3RcclxuICogaWYgZXJyb3JzIG9jY3VyIGR1cmluZyB0aGUgZGF0YWJhc2Ugb3BlbiBvcGVyYXRpb24uXHJcbiAqXHJcbiAqIEB0aHJvd3MgZXhjZXB0aW9uIGlmIGN1cnJlbnQgYnJvd3Nlci9zdyBjb250ZXh0IGNhbid0IHJ1biBpZGIub3BlbiAoZXg6IFNhZmFyaSBpZnJhbWUsIEZpcmVmb3hcclxuICogcHJpdmF0ZSBicm93c2luZylcclxuICovXHJcbmZ1bmN0aW9uIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGxldCBwcmVFeGlzdCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IERCX0NIRUNLX05BTUUgPSAndmFsaWRhdGUtYnJvd3Nlci1jb250ZXh0LWZvci1pbmRleGVkZGItYW5hbHl0aWNzLW1vZHVsZSc7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBzZWxmLmluZGV4ZWREQi5vcGVuKERCX0NIRUNLX05BTUUpO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3QucmVzdWx0LmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICAvLyBkZWxldGUgZGF0YWJhc2Ugb25seSB3aGVuIGl0IGRvZXNuJ3QgcHJlLWV4aXN0XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByZUV4aXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbmRleGVkREIuZGVsZXRlRGF0YWJhc2UoREJfQ0hFQ0tfTkFNRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHByZUV4aXN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBfYTtcclxuICAgICAgICAgICAgICAgIHJlamVjdCgoKF9hID0gcmVxdWVzdC5lcnJvcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm1lc3NhZ2UpIHx8ICcnKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIFRoaXMgbWV0aG9kIGNoZWNrcyB3aGV0aGVyIGNvb2tpZSBpcyBlbmFibGVkIHdpdGhpbiBjdXJyZW50IGJyb3dzZXJcclxuICogQHJldHVybiB0cnVlIGlmIGNvb2tpZSBpcyBlbmFibGVkIHdpdGhpbiBjdXJyZW50IGJyb3dzZXJcclxuICovXHJcbmZ1bmN0aW9uIGFyZUNvb2tpZXNFbmFibGVkKCkge1xyXG4gICAgaWYgKHR5cGVvZiBuYXZpZ2F0b3IgPT09ICd1bmRlZmluZWQnIHx8ICFuYXZpZ2F0b3IuY29va2llRW5hYmxlZCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAZmlsZW92ZXJ2aWV3IFN0YW5kYXJkaXplZCBGaXJlYmFzZSBFcnJvci5cclxuICpcclxuICogVXNhZ2U6XHJcbiAqXHJcbiAqICAgLy8gVHlwZXNjcmlwdCBzdHJpbmcgbGl0ZXJhbHMgZm9yIHR5cGUtc2FmZSBjb2Rlc1xyXG4gKiAgIHR5cGUgRXJyID1cclxuICogICAgICd1bmtub3duJyB8XHJcbiAqICAgICAnb2JqZWN0LW5vdC1mb3VuZCdcclxuICogICAgIDtcclxuICpcclxuICogICAvLyBDbG9zdXJlIGVudW0gZm9yIHR5cGUtc2FmZSBlcnJvciBjb2Rlc1xyXG4gKiAgIC8vIGF0LWVudW0ge3N0cmluZ31cclxuICogICB2YXIgRXJyID0ge1xyXG4gKiAgICAgVU5LTk9XTjogJ3Vua25vd24nLFxyXG4gKiAgICAgT0JKRUNUX05PVF9GT1VORDogJ29iamVjdC1ub3QtZm91bmQnLFxyXG4gKiAgIH1cclxuICpcclxuICogICBsZXQgZXJyb3JzOiBNYXA8RXJyLCBzdHJpbmc+ID0ge1xyXG4gKiAgICAgJ2dlbmVyaWMtZXJyb3InOiBcIlVua25vd24gZXJyb3JcIixcclxuICogICAgICdmaWxlLW5vdC1mb3VuZCc6IFwiQ291bGQgbm90IGZpbmQgZmlsZTogeyRmaWxlfVwiLFxyXG4gKiAgIH07XHJcbiAqXHJcbiAqICAgLy8gVHlwZS1zYWZlIGZ1bmN0aW9uIC0gbXVzdCBwYXNzIGEgdmFsaWQgZXJyb3IgY29kZSBhcyBwYXJhbS5cclxuICogICBsZXQgZXJyb3IgPSBuZXcgRXJyb3JGYWN0b3J5PEVycj4oJ3NlcnZpY2UnLCAnU2VydmljZScsIGVycm9ycyk7XHJcbiAqXHJcbiAqICAgLi4uXHJcbiAqICAgdGhyb3cgZXJyb3IuY3JlYXRlKEVyci5HRU5FUklDKTtcclxuICogICAuLi5cclxuICogICB0aHJvdyBlcnJvci5jcmVhdGUoRXJyLkZJTEVfTk9UX0ZPVU5ELCB7J2ZpbGUnOiBmaWxlTmFtZX0pO1xyXG4gKiAgIC4uLlxyXG4gKiAgIC8vIFNlcnZpY2U6IENvdWxkIG5vdCBmaWxlIGZpbGU6IGZvby50eHQgKHNlcnZpY2UvZmlsZS1ub3QtZm91bmQpLlxyXG4gKlxyXG4gKiAgIGNhdGNoIChlKSB7XHJcbiAqICAgICBhc3NlcnQoZS5tZXNzYWdlID09PSBcIkNvdWxkIG5vdCBmaW5kIGZpbGU6IGZvby50eHQuXCIpO1xyXG4gKiAgICAgaWYgKChlIGFzIEZpcmViYXNlRXJyb3IpPy5jb2RlID09PSAnc2VydmljZS9maWxlLW5vdC1mb3VuZCcpIHtcclxuICogICAgICAgY29uc29sZS5sb2coXCJDb3VsZCBub3QgcmVhZCBmaWxlOiBcIiArIGVbJ2ZpbGUnXSk7XHJcbiAqICAgICB9XHJcbiAqICAgfVxyXG4gKi9cclxuY29uc3QgRVJST1JfTkFNRSA9ICdGaXJlYmFzZUVycm9yJztcclxuLy8gQmFzZWQgb24gY29kZSBmcm9tOlxyXG4vLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9FcnJvciNDdXN0b21fRXJyb3JfVHlwZXNcclxuY2xhc3MgRmlyZWJhc2VFcnJvciBleHRlbmRzIEVycm9yIHtcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgLyoqIFRoZSBlcnJvciBjb2RlIGZvciB0aGlzIGVycm9yLiAqL1xyXG4gICAgY29kZSwgbWVzc2FnZSwgXHJcbiAgICAvKiogQ3VzdG9tIGRhdGEgZm9yIHRoaXMgZXJyb3IuICovXHJcbiAgICBjdXN0b21EYXRhKSB7XHJcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XHJcbiAgICAgICAgdGhpcy5jb2RlID0gY29kZTtcclxuICAgICAgICB0aGlzLmN1c3RvbURhdGEgPSBjdXN0b21EYXRhO1xyXG4gICAgICAgIC8qKiBUaGUgY3VzdG9tIG5hbWUgZm9yIGFsbCBGaXJlYmFzZUVycm9ycy4gKi9cclxuICAgICAgICB0aGlzLm5hbWUgPSBFUlJPUl9OQU1FO1xyXG4gICAgICAgIC8vIEZpeCBGb3IgRVM1XHJcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL01pY3Jvc29mdC9UeXBlU2NyaXB0LXdpa2kvYmxvYi9tYXN0ZXIvQnJlYWtpbmctQ2hhbmdlcy5tZCNleHRlbmRpbmctYnVpbHQtaW5zLWxpa2UtZXJyb3ItYXJyYXktYW5kLW1hcC1tYXktbm8tbG9uZ2VyLXdvcmtcclxuICAgICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YodGhpcywgRmlyZWJhc2VFcnJvci5wcm90b3R5cGUpO1xyXG4gICAgICAgIC8vIE1haW50YWlucyBwcm9wZXIgc3RhY2sgdHJhY2UgZm9yIHdoZXJlIG91ciBlcnJvciB3YXMgdGhyb3duLlxyXG4gICAgICAgIC8vIE9ubHkgYXZhaWxhYmxlIG9uIFY4LlxyXG4gICAgICAgIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xyXG4gICAgICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFcnJvckZhY3RvcnkucHJvdG90eXBlLmNyZWF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmNsYXNzIEVycm9yRmFjdG9yeSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzZXJ2aWNlLCBzZXJ2aWNlTmFtZSwgZXJyb3JzKSB7XHJcbiAgICAgICAgdGhpcy5zZXJ2aWNlID0gc2VydmljZTtcclxuICAgICAgICB0aGlzLnNlcnZpY2VOYW1lID0gc2VydmljZU5hbWU7XHJcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XHJcbiAgICB9XHJcbiAgICBjcmVhdGUoY29kZSwgLi4uZGF0YSkge1xyXG4gICAgICAgIGNvbnN0IGN1c3RvbURhdGEgPSBkYXRhWzBdIHx8IHt9O1xyXG4gICAgICAgIGNvbnN0IGZ1bGxDb2RlID0gYCR7dGhpcy5zZXJ2aWNlfS8ke2NvZGV9YDtcclxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IHRoaXMuZXJyb3JzW2NvZGVdO1xyXG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSB0ZW1wbGF0ZSA/IHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgY3VzdG9tRGF0YSkgOiAnRXJyb3InO1xyXG4gICAgICAgIC8vIFNlcnZpY2UgTmFtZTogRXJyb3IgbWVzc2FnZSAoc2VydmljZS9jb2RlKS5cclxuICAgICAgICBjb25zdCBmdWxsTWVzc2FnZSA9IGAke3RoaXMuc2VydmljZU5hbWV9OiAke21lc3NhZ2V9ICgke2Z1bGxDb2RlfSkuYDtcclxuICAgICAgICBjb25zdCBlcnJvciA9IG5ldyBGaXJlYmFzZUVycm9yKGZ1bGxDb2RlLCBmdWxsTWVzc2FnZSwgY3VzdG9tRGF0YSk7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHJlcGxhY2VUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGF0YSkge1xyXG4gICAgcmV0dXJuIHRlbXBsYXRlLnJlcGxhY2UoUEFUVEVSTiwgKF8sIGtleSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZGF0YVtrZXldO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZSAhPSBudWxsID8gU3RyaW5nKHZhbHVlKSA6IGA8JHtrZXl9Pz5gO1xyXG4gICAgfSk7XHJcbn1cclxuY29uc3QgUEFUVEVSTiA9IC9cXHtcXCQoW159XSspfS9nO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRXZhbHVhdGVzIGEgSlNPTiBzdHJpbmcgaW50byBhIGphdmFzY3JpcHQgb2JqZWN0LlxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIEEgc3RyaW5nIGNvbnRhaW5pbmcgSlNPTi5cclxuICogQHJldHVybiB7Kn0gVGhlIGphdmFzY3JpcHQgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgc3BlY2lmaWVkIEpTT04uXHJcbiAqL1xyXG5mdW5jdGlvbiBqc29uRXZhbChzdHIpIHtcclxuICAgIHJldHVybiBKU09OLnBhcnNlKHN0cik7XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgSlNPTiByZXByZXNlbnRpbmcgYSBqYXZhc2NyaXB0IG9iamVjdC5cclxuICogQHBhcmFtIHsqfSBkYXRhIEphdmFzY3JpcHQgb2JqZWN0IHRvIGJlIHN0cmluZ2lmaWVkLlxyXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBKU09OIGNvbnRlbnRzIG9mIHRoZSBvYmplY3QuXHJcbiAqL1xyXG5mdW5jdGlvbiBzdHJpbmdpZnkoZGF0YSkge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gaW50byBjb25zdGl0dWVudCBwYXJ0cy5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiB3aXRoIGludmFsaWQgLyBpbmNvbXBsZXRlIGNsYWltcyBpZiB0aGVyZSdzIG5vIG5hdGl2ZSBiYXNlNjQgZGVjb2Rpbmcgc3VwcG9ydC5cclxuICogLSBEb2Vzbid0IGNoZWNrIGlmIHRoZSB0b2tlbiBpcyBhY3R1YWxseSB2YWxpZC5cclxuICovXHJcbmNvbnN0IGRlY29kZSA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgbGV0IGhlYWRlciA9IHt9LCBjbGFpbXMgPSB7fSwgZGF0YSA9IHt9LCBzaWduYXR1cmUgPSAnJztcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcGFydHMgPSB0b2tlbi5zcGxpdCgnLicpO1xyXG4gICAgICAgIGhlYWRlciA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1swXSkgfHwgJycpO1xyXG4gICAgICAgIGNsYWltcyA9IGpzb25FdmFsKGJhc2U2NERlY29kZShwYXJ0c1sxXSkgfHwgJycpO1xyXG4gICAgICAgIHNpZ25hdHVyZSA9IHBhcnRzWzJdO1xyXG4gICAgICAgIGRhdGEgPSBjbGFpbXNbJ2QnXSB8fCB7fTtcclxuICAgICAgICBkZWxldGUgY2xhaW1zWydkJ107XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkgeyB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhlYWRlcixcclxuICAgICAgICBjbGFpbXMsXHJcbiAgICAgICAgZGF0YSxcclxuICAgICAgICBzaWduYXR1cmVcclxuICAgIH07XHJcbn07XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgRmlyZWJhc2UgYXV0aC4gdG9rZW4gYW5kIGNoZWNrcyB0aGUgdmFsaWRpdHkgb2YgaXRzIHRpbWUtYmFzZWQgY2xhaW1zLiBXaWxsIHJldHVybiB0cnVlIGlmIHRoZVxyXG4gKiB0b2tlbiBpcyB3aXRoaW4gdGhlIHRpbWUgd2luZG93IGF1dGhvcml6ZWQgYnkgdGhlICduYmYnIChub3QtYmVmb3JlKSBhbmQgJ2lhdCcgKGlzc3VlZC1hdCkgY2xhaW1zLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIGEgZmFsc2UgbmVnYXRpdmUgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc1ZhbGlkVGltZXN0YW1wID0gZnVuY3Rpb24gKHRva2VuKSB7XHJcbiAgICBjb25zdCBjbGFpbXMgPSBkZWNvZGUodG9rZW4pLmNsYWltcztcclxuICAgIGNvbnN0IG5vdyA9IE1hdGguZmxvb3IobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKTtcclxuICAgIGxldCB2YWxpZFNpbmNlID0gMCwgdmFsaWRVbnRpbCA9IDA7XHJcbiAgICBpZiAodHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCduYmYnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWyduYmYnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoY2xhaW1zLmhhc093blByb3BlcnR5KCdpYXQnKSkge1xyXG4gICAgICAgICAgICB2YWxpZFNpbmNlID0gY2xhaW1zWydpYXQnXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnZXhwJykpIHtcclxuICAgICAgICAgICAgdmFsaWRVbnRpbCA9IGNsYWltc1snZXhwJ107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyB0b2tlbiB3aWxsIGV4cGlyZSBhZnRlciAyNGggYnkgZGVmYXVsdFxyXG4gICAgICAgICAgICB2YWxpZFVudGlsID0gdmFsaWRTaW5jZSArIDg2NDAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiAoISFub3cgJiZcclxuICAgICAgICAhIXZhbGlkU2luY2UgJiZcclxuICAgICAgICAhIXZhbGlkVW50aWwgJiZcclxuICAgICAgICBub3cgPj0gdmFsaWRTaW5jZSAmJlxyXG4gICAgICAgIG5vdyA8PSB2YWxpZFVudGlsKTtcclxufTtcclxuLyoqXHJcbiAqIERlY29kZXMgYSBGaXJlYmFzZSBhdXRoLiB0b2tlbiBhbmQgcmV0dXJucyBpdHMgaXNzdWVkIGF0IHRpbWUgaWYgdmFsaWQsIG51bGwgb3RoZXJ3aXNlLlxyXG4gKlxyXG4gKiBOb3RlczpcclxuICogLSBNYXkgcmV0dXJuIG51bGwgaWYgdGhlcmUncyBubyBuYXRpdmUgYmFzZTY0IGRlY29kaW5nIHN1cHBvcnQuXHJcbiAqIC0gRG9lc24ndCBjaGVjayBpZiB0aGUgdG9rZW4gaXMgYWN0dWFsbHkgdmFsaWQuXHJcbiAqL1xyXG5jb25zdCBpc3N1ZWRBdFRpbWUgPSBmdW5jdGlvbiAodG9rZW4pIHtcclxuICAgIGNvbnN0IGNsYWltcyA9IGRlY29kZSh0b2tlbikuY2xhaW1zO1xyXG4gICAgaWYgKHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0JykpIHtcclxuICAgICAgICByZXR1cm4gY2xhaW1zWydpYXQnXTtcclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59O1xyXG4vKipcclxuICogRGVjb2RlcyBhIEZpcmViYXNlIGF1dGguIHRva2VuIGFuZCBjaGVja3MgdGhlIHZhbGlkaXR5IG9mIGl0cyBmb3JtYXQuIEV4cGVjdHMgYSB2YWxpZCBpc3N1ZWQtYXQgdGltZS5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNWYWxpZEZvcm1hdCA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgZGVjb2RlZCA9IGRlY29kZSh0b2tlbiksIGNsYWltcyA9IGRlY29kZWQuY2xhaW1zO1xyXG4gICAgcmV0dXJuICEhY2xhaW1zICYmIHR5cGVvZiBjbGFpbXMgPT09ICdvYmplY3QnICYmIGNsYWltcy5oYXNPd25Qcm9wZXJ0eSgnaWF0Jyk7XHJcbn07XHJcbi8qKlxyXG4gKiBBdHRlbXB0cyB0byBwZWVyIGludG8gYW4gYXV0aCB0b2tlbiBhbmQgZGV0ZXJtaW5lIGlmIGl0J3MgYW4gYWRtaW4gYXV0aCB0b2tlbiBieSBsb29raW5nIGF0IHRoZSBjbGFpbXMgcG9ydGlvbi5cclxuICpcclxuICogTm90ZXM6XHJcbiAqIC0gTWF5IHJldHVybiBhIGZhbHNlIG5lZ2F0aXZlIGlmIHRoZXJlJ3Mgbm8gbmF0aXZlIGJhc2U2NCBkZWNvZGluZyBzdXBwb3J0LlxyXG4gKiAtIERvZXNuJ3QgY2hlY2sgaWYgdGhlIHRva2VuIGlzIGFjdHVhbGx5IHZhbGlkLlxyXG4gKi9cclxuY29uc3QgaXNBZG1pbiA9IGZ1bmN0aW9uICh0b2tlbikge1xyXG4gICAgY29uc3QgY2xhaW1zID0gZGVjb2RlKHRva2VuKS5jbGFpbXM7XHJcbiAgICByZXR1cm4gdHlwZW9mIGNsYWltcyA9PT0gJ29iamVjdCcgJiYgY2xhaW1zWydhZG1pbiddID09PSB0cnVlO1xyXG59O1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBjb250YWlucyhvYmosIGtleSkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSk7XHJcbn1cclxuZnVuY3Rpb24gc2FmZUdldChvYmosIGtleSkge1xyXG4gICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICByZXR1cm4gb2JqW2tleV07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGlzRW1wdHkob2JqKSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBvYmopIHtcclxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwga2V5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gbWFwKG9iaiwgZm4sIGNvbnRleHRPYmopIHtcclxuICAgIGNvbnN0IHJlcyA9IHt9O1xyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XHJcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSkpIHtcclxuICAgICAgICAgICAgcmVzW2tleV0gPSBmbi5jYWxsKGNvbnRleHRPYmosIG9ialtrZXldLCBrZXksIG9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4vKipcclxuICogRGVlcCBlcXVhbCB0d28gb2JqZWN0cy4gU3VwcG9ydCBBcnJheXMgYW5kIE9iamVjdHMuXHJcbiAqL1xyXG5mdW5jdGlvbiBkZWVwRXF1YWwoYSwgYikge1xyXG4gICAgaWYgKGEgPT09IGIpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIGNvbnN0IGFLZXlzID0gT2JqZWN0LmtleXMoYSk7XHJcbiAgICBjb25zdCBiS2V5cyA9IE9iamVjdC5rZXlzKGIpO1xyXG4gICAgZm9yIChjb25zdCBrIG9mIGFLZXlzKSB7XHJcbiAgICAgICAgaWYgKCFiS2V5cy5pbmNsdWRlcyhrKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGFQcm9wID0gYVtrXTtcclxuICAgICAgICBjb25zdCBiUHJvcCA9IGJba107XHJcbiAgICAgICAgaWYgKGlzT2JqZWN0KGFQcm9wKSAmJiBpc09iamVjdChiUHJvcCkpIHtcclxuICAgICAgICAgICAgaWYgKCFkZWVwRXF1YWwoYVByb3AsIGJQcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGFQcm9wICE9PSBiUHJvcCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZm9yIChjb25zdCBrIG9mIGJLZXlzKSB7XHJcbiAgICAgICAgaWYgKCFhS2V5cy5pbmNsdWRlcyhrKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuZnVuY3Rpb24gaXNPYmplY3QodGhpbmcpIHtcclxuICAgIHJldHVybiB0aGluZyAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpbmcgPT09ICdvYmplY3QnO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZWplY3RzIGlmIHRoZSBnaXZlbiBwcm9taXNlIGRvZXNuJ3QgcmVzb2x2ZSBpbiB0aW1lSW5NUyBtaWxsaXNlY29uZHMuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gcHJvbWlzZVdpdGhUaW1lb3V0KHByb21pc2UsIHRpbWVJbk1TID0gMjAwMCkge1xyXG4gICAgY29uc3QgZGVmZXJyZWRQcm9taXNlID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IGRlZmVycmVkUHJvbWlzZS5yZWplY3QoJ3RpbWVvdXQhJyksIHRpbWVJbk1TKTtcclxuICAgIHByb21pc2UudGhlbihkZWZlcnJlZFByb21pc2UucmVzb2x2ZSwgZGVmZXJyZWRQcm9taXNlLnJlamVjdCk7XHJcbiAgICByZXR1cm4gZGVmZXJyZWRQcm9taXNlLnByb21pc2U7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYSBxdWVyeXN0cmluZy1mb3JtYXR0ZWQgc3RyaW5nIChlLmcuICZhcmc9dmFsJmFyZzI9dmFsMikgZnJvbSBhXHJcbiAqIHBhcmFtcyBvYmplY3QgKGUuZy4ge2FyZzogJ3ZhbCcsIGFyZzI6ICd2YWwyJ30pXHJcbiAqIE5vdGU6IFlvdSBtdXN0IHByZXBlbmQgaXQgd2l0aCA/IHdoZW4gYWRkaW5nIGl0IHRvIGEgVVJMLlxyXG4gKi9cclxuZnVuY3Rpb24gcXVlcnlzdHJpbmcocXVlcnlzdHJpbmdQYXJhbXMpIHtcclxuICAgIGNvbnN0IHBhcmFtcyA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBba2V5LCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMocXVlcnlzdHJpbmdQYXJhbXMpKSB7XHJcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIHZhbHVlLmZvckVhY2goYXJyYXlWYWwgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQoYXJyYXlWYWwpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwYXJhbXMucHVzaChlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYXJhbXMubGVuZ3RoID8gJyYnICsgcGFyYW1zLmpvaW4oJyYnKSA6ICcnO1xyXG59XHJcbi8qKlxyXG4gKiBEZWNvZGVzIGEgcXVlcnlzdHJpbmcgKGUuZy4gP2FyZz12YWwmYXJnMj12YWwyKSBpbnRvIGEgcGFyYW1zIG9iamVjdFxyXG4gKiAoZS5nLiB7YXJnOiAndmFsJywgYXJnMjogJ3ZhbDInfSlcclxuICovXHJcbmZ1bmN0aW9uIHF1ZXJ5c3RyaW5nRGVjb2RlKHF1ZXJ5c3RyaW5nKSB7XHJcbiAgICBjb25zdCBvYmogPSB7fTtcclxuICAgIGNvbnN0IHRva2VucyA9IHF1ZXJ5c3RyaW5nLnJlcGxhY2UoL15cXD8vLCAnJykuc3BsaXQoJyYnKTtcclxuICAgIHRva2Vucy5mb3JFYWNoKHRva2VuID0+IHtcclxuICAgICAgICBpZiAodG9rZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgW2tleSwgdmFsdWVdID0gdG9rZW4uc3BsaXQoJz0nKTtcclxuICAgICAgICAgICAgb2JqW2RlY29kZVVSSUNvbXBvbmVudChrZXkpXSA9IGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gb2JqO1xyXG59XHJcbi8qKlxyXG4gKiBFeHRyYWN0IHRoZSBxdWVyeSBzdHJpbmcgcGFydCBvZiBhIFVSTCwgaW5jbHVkaW5nIHRoZSBsZWFkaW5nIHF1ZXN0aW9uIG1hcmsgKGlmIHByZXNlbnQpLlxyXG4gKi9cclxuZnVuY3Rpb24gZXh0cmFjdFF1ZXJ5c3RyaW5nKHVybCkge1xyXG4gICAgY29uc3QgcXVlcnlTdGFydCA9IHVybC5pbmRleE9mKCc/Jyk7XHJcbiAgICBpZiAoIXF1ZXJ5U3RhcnQpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgICBjb25zdCBmcmFnbWVudFN0YXJ0ID0gdXJsLmluZGV4T2YoJyMnLCBxdWVyeVN0YXJ0KTtcclxuICAgIHJldHVybiB1cmwuc3Vic3RyaW5nKHF1ZXJ5U3RhcnQsIGZyYWdtZW50U3RhcnQgPiAwID8gZnJhZ21lbnRTdGFydCA6IHVuZGVmaW5lZCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBmaWxlb3ZlcnZpZXcgU0hBLTEgY3J5cHRvZ3JhcGhpYyBoYXNoLlxyXG4gKiBWYXJpYWJsZSBuYW1lcyBmb2xsb3cgdGhlIG5vdGF0aW9uIGluIEZJUFMgUFVCIDE4MC0zOlxyXG4gKiBodHRwOi8vY3NyYy5uaXN0Lmdvdi9wdWJsaWNhdGlvbnMvZmlwcy9maXBzMTgwLTMvZmlwczE4MC0zX2ZpbmFsLnBkZi5cclxuICpcclxuICogVXNhZ2U6XHJcbiAqICAgdmFyIHNoYTEgPSBuZXcgc2hhMSgpO1xyXG4gKiAgIHNoYTEudXBkYXRlKGJ5dGVzKTtcclxuICogICB2YXIgaGFzaCA9IHNoYTEuZGlnZXN0KCk7XHJcbiAqXHJcbiAqIFBlcmZvcm1hbmNlOlxyXG4gKiAgIENocm9tZSAyMzogICB+NDAwIE1iaXQvc1xyXG4gKiAgIEZpcmVmb3ggMTY6ICB+MjUwIE1iaXQvc1xyXG4gKlxyXG4gKi9cclxuLyoqXHJcbiAqIFNIQS0xIGNyeXB0b2dyYXBoaWMgaGFzaCBjb25zdHJ1Y3Rvci5cclxuICpcclxuICogVGhlIHByb3BlcnRpZXMgZGVjbGFyZWQgaGVyZSBhcmUgZGlzY3Vzc2VkIGluIHRoZSBhYm92ZSBhbGdvcml0aG0gZG9jdW1lbnQuXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKiBAZmluYWxcclxuICogQHN0cnVjdFxyXG4gKi9cclxuY2xhc3MgU2hhMSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBIb2xkcyB0aGUgcHJldmlvdXMgdmFsdWVzIG9mIGFjY3VtdWxhdGVkIHZhcmlhYmxlcyBhLWUgaW4gdGhlIGNvbXByZXNzX1xyXG4gICAgICAgICAqIGZ1bmN0aW9uLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jaGFpbl8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBIGJ1ZmZlciBob2xkaW5nIHRoZSBwYXJ0aWFsbHkgY29tcHV0ZWQgaGFzaCByZXN1bHQuXHJcbiAgICAgICAgICogQHByaXZhdGVcclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmJ1Zl8gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBBbiBhcnJheSBvZiA4MCBieXRlcywgZWFjaCBhIHBhcnQgb2YgdGhlIG1lc3NhZ2UgdG8gYmUgaGFzaGVkLiAgUmVmZXJyZWQgdG9cclxuICAgICAgICAgKiBhcyB0aGUgbWVzc2FnZSBzY2hlZHVsZSBpbiB0aGUgZG9jcy5cclxuICAgICAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuV18gPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb250YWlucyBkYXRhIG5lZWRlZCB0byBwYWQgbWVzc2FnZXMgbGVzcyB0aGFuIDY0IGJ5dGVzLlxyXG4gICAgICAgICAqIEBwcml2YXRlXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5wYWRfID0gW107XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHByaXZhdGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQHByaXZhdGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRvdGFsXyA9IDA7XHJcbiAgICAgICAgdGhpcy5ibG9ja1NpemUgPSA1MTIgLyA4O1xyXG4gICAgICAgIHRoaXMucGFkX1swXSA9IDEyODtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMuYmxvY2tTaXplOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWRfW2ldID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfVxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bMF0gPSAweDY3NDUyMzAxO1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzFdID0gMHhlZmNkYWI4OTtcclxuICAgICAgICB0aGlzLmNoYWluX1syXSA9IDB4OThiYWRjZmU7XHJcbiAgICAgICAgdGhpcy5jaGFpbl9bM10gPSAweDEwMzI1NDc2O1xyXG4gICAgICAgIHRoaXMuY2hhaW5fWzRdID0gMHhjM2QyZTFmMDtcclxuICAgICAgICB0aGlzLmluYnVmXyA9IDA7XHJcbiAgICAgICAgdGhpcy50b3RhbF8gPSAwO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBJbnRlcm5hbCBjb21wcmVzcyBoZWxwZXIgZnVuY3Rpb24uXHJcbiAgICAgKiBAcGFyYW0gYnVmIEJsb2NrIHRvIGNvbXByZXNzLlxyXG4gICAgICogQHBhcmFtIG9mZnNldCBPZmZzZXQgb2YgdGhlIGJsb2NrIGluIHRoZSBidWZmZXIuXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICovXHJcbiAgICBjb21wcmVzc18oYnVmLCBvZmZzZXQpIHtcclxuICAgICAgICBpZiAoIW9mZnNldCkge1xyXG4gICAgICAgICAgICBvZmZzZXQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBXID0gdGhpcy5XXztcclxuICAgICAgICAvLyBnZXQgMTYgYmlnIGVuZGlhbiB3b3Jkc1xyXG4gICAgICAgIGlmICh0eXBlb2YgYnVmID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIC8vIFRPRE8odXNlcik6IFtidWcgODE0MDEyMl0gUmVjZW50IHZlcnNpb25zIG9mIFNhZmFyaSBmb3IgTWFjIE9TIGFuZCBpT1NcclxuICAgICAgICAgICAgICAgIC8vIGhhdmUgYSBidWcgdGhhdCB0dXJucyB0aGUgcG9zdC1pbmNyZW1lbnQgKysgb3BlcmF0b3IgaW50byBwcmUtaW5jcmVtZW50XHJcbiAgICAgICAgICAgICAgICAvLyBkdXJpbmcgSklUIGNvbXBpbGF0aW9uLiAgV2UgaGF2ZSBjb2RlIHRoYXQgZGVwZW5kcyBoZWF2aWx5IG9uIFNIQS0xIGZvclxyXG4gICAgICAgICAgICAgICAgLy8gY29ycmVjdG5lc3MgYW5kIHdoaWNoIGlzIGFmZmVjdGVkIGJ5IHRoaXMgYnVnLCBzbyBJJ3ZlIHJlbW92ZWQgYWxsIHVzZXNcclxuICAgICAgICAgICAgICAgIC8vIG9mIHBvc3QtaW5jcmVtZW50ICsrIGluIHdoaWNoIHRoZSByZXN1bHQgdmFsdWUgaXMgdXNlZC4gIFdlIGNhbiByZXZlcnRcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMgY2hhbmdlIG9uY2UgdGhlIFNhZmFyaSBidWdcclxuICAgICAgICAgICAgICAgIC8vIChodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTA5MDM2KSBoYXMgYmVlbiBmaXhlZCBhbmRcclxuICAgICAgICAgICAgICAgIC8vIG1vc3QgY2xpZW50cyBoYXZlIGJlZW4gdXBkYXRlZC5cclxuICAgICAgICAgICAgICAgIFdbaV0gPVxyXG4gICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQpIDw8IDI0KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWYuY2hhckNvZGVBdChvZmZzZXQgKyAxKSA8PCAxNikgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmLmNoYXJDb2RlQXQob2Zmc2V0ICsgMikgPDwgOCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWYuY2hhckNvZGVBdChvZmZzZXQgKyAzKTtcclxuICAgICAgICAgICAgICAgIG9mZnNldCArPSA0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIFdbaV0gPVxyXG4gICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0XSA8PCAyNCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAoYnVmW29mZnNldCArIDFdIDw8IDE2KSB8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIChidWZbb2Zmc2V0ICsgMl0gPDwgOCkgfFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZbb2Zmc2V0ICsgM107XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBleHBhbmQgdG8gODAgd29yZHNcclxuICAgICAgICBmb3IgKGxldCBpID0gMTY7IGkgPCA4MDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBXW2kgLSAzXSBeIFdbaSAtIDhdIF4gV1tpIC0gMTRdIF4gV1tpIC0gMTZdO1xyXG4gICAgICAgICAgICBXW2ldID0gKCh0IDw8IDEpIHwgKHQgPj4+IDMxKSkgJiAweGZmZmZmZmZmO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgYSA9IHRoaXMuY2hhaW5fWzBdO1xyXG4gICAgICAgIGxldCBiID0gdGhpcy5jaGFpbl9bMV07XHJcbiAgICAgICAgbGV0IGMgPSB0aGlzLmNoYWluX1syXTtcclxuICAgICAgICBsZXQgZCA9IHRoaXMuY2hhaW5fWzNdO1xyXG4gICAgICAgIGxldCBlID0gdGhpcy5jaGFpbl9bNF07XHJcbiAgICAgICAgbGV0IGYsIGs7XHJcbiAgICAgICAgLy8gVE9ETyh1c2VyKTogVHJ5IHRvIHVucm9sbCB0aGlzIGxvb3AgdG8gc3BlZWQgdXAgdGhlIGNvbXB1dGF0aW9uLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODA7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoaSA8IDQwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA8IDIwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGQgXiAoYiAmIChjIF4gZCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweDVhODI3OTk5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZiA9IGIgXiBjIF4gZDtcclxuICAgICAgICAgICAgICAgICAgICBrID0gMHg2ZWQ5ZWJhMTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChpIDwgNjApIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gKGIgJiBjKSB8IChkICYgKGIgfCBjKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IDB4OGYxYmJjZGM7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmID0gYiBeIGMgXiBkO1xyXG4gICAgICAgICAgICAgICAgICAgIGsgPSAweGNhNjJjMWQ2O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSAoKChhIDw8IDUpIHwgKGEgPj4+IDI3KSkgKyBmICsgZSArIGsgKyBXW2ldKSAmIDB4ZmZmZmZmZmY7XHJcbiAgICAgICAgICAgIGUgPSBkO1xyXG4gICAgICAgICAgICBkID0gYztcclxuICAgICAgICAgICAgYyA9ICgoYiA8PCAzMCkgfCAoYiA+Pj4gMikpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICAgICAgYiA9IGE7XHJcbiAgICAgICAgICAgIGEgPSB0O1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmNoYWluX1swXSA9ICh0aGlzLmNoYWluX1swXSArIGEpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1sxXSA9ICh0aGlzLmNoYWluX1sxXSArIGIpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1syXSA9ICh0aGlzLmNoYWluX1syXSArIGMpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1szXSA9ICh0aGlzLmNoYWluX1szXSArIGQpICYgMHhmZmZmZmZmZjtcclxuICAgICAgICB0aGlzLmNoYWluX1s0XSA9ICh0aGlzLmNoYWluX1s0XSArIGUpICYgMHhmZmZmZmZmZjtcclxuICAgIH1cclxuICAgIHVwZGF0ZShieXRlcywgbGVuZ3RoKSB7XHJcbiAgICAgICAgLy8gVE9ETyhqb2hubGVueik6IHRpZ2h0ZW4gdGhlIGZ1bmN0aW9uIHNpZ25hdHVyZSBhbmQgcmVtb3ZlIHRoaXMgY2hlY2tcclxuICAgICAgICBpZiAoYnl0ZXMgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBsZW5ndGggPSBieXRlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxlbmd0aE1pbnVzQmxvY2sgPSBsZW5ndGggLSB0aGlzLmJsb2NrU2l6ZTtcclxuICAgICAgICBsZXQgbiA9IDA7XHJcbiAgICAgICAgLy8gVXNpbmcgbG9jYWwgaW5zdGVhZCBvZiBtZW1iZXIgdmFyaWFibGVzIGdpdmVzIH41JSBzcGVlZHVwIG9uIEZpcmVmb3ggMTYuXHJcbiAgICAgICAgY29uc3QgYnVmID0gdGhpcy5idWZfO1xyXG4gICAgICAgIGxldCBpbmJ1ZiA9IHRoaXMuaW5idWZfO1xyXG4gICAgICAgIC8vIFRoZSBvdXRlciB3aGlsZSBsb29wIHNob3VsZCBleGVjdXRlIGF0IG1vc3QgdHdpY2UuXHJcbiAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgLy8gV2hlbiB3ZSBoYXZlIG5vIGRhdGEgaW4gdGhlIGJsb2NrIHRvIHRvcCB1cCwgd2UgY2FuIGRpcmVjdGx5IHByb2Nlc3MgdGhlXHJcbiAgICAgICAgICAgIC8vIGlucHV0IGJ1ZmZlciAoYXNzdW1pbmcgaXQgY29udGFpbnMgc3VmZmljaWVudCBkYXRhKS4gVGhpcyBnaXZlcyB+MjUlXHJcbiAgICAgICAgICAgIC8vIHNwZWVkdXAgb24gQ2hyb21lIDIzIGFuZCB+MTUlIHNwZWVkdXAgb24gRmlyZWZveCAxNiwgYnV0IHJlcXVpcmVzIHRoYXRcclxuICAgICAgICAgICAgLy8gdGhlIGRhdGEgaXMgcHJvdmlkZWQgaW4gbGFyZ2UgY2h1bmtzIChvciBpbiBtdWx0aXBsZXMgb2YgNjQgYnl0ZXMpLlxyXG4gICAgICAgICAgICBpZiAoaW5idWYgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChuIDw9IGxlbmd0aE1pbnVzQmxvY2spIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXByZXNzXyhieXRlcywgbik7XHJcbiAgICAgICAgICAgICAgICAgICAgbiArPSB0aGlzLmJsb2NrU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGJ5dGVzID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKG4gPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBidWZbaW5idWZdID0gYnl0ZXMuY2hhckNvZGVBdChuKTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobiA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZltpbmJ1Zl0gPSBieXRlc1tuXTtcclxuICAgICAgICAgICAgICAgICAgICArK2luYnVmO1xyXG4gICAgICAgICAgICAgICAgICAgICsrbjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5idWYgPT09IHRoaXMuYmxvY2tTaXplKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcHJlc3NfKGJ1Zik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluYnVmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSnVtcCB0byB0aGUgb3V0ZXIgbG9vcCBzbyB3ZSB1c2UgdGhlIGZ1bGwtYmxvY2sgb3B0aW1pemF0aW9uLlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbmJ1Zl8gPSBpbmJ1ZjtcclxuICAgICAgICB0aGlzLnRvdGFsXyArPSBsZW5ndGg7XHJcbiAgICB9XHJcbiAgICAvKiogQG92ZXJyaWRlICovXHJcbiAgICBkaWdlc3QoKSB7XHJcbiAgICAgICAgY29uc3QgZGlnZXN0ID0gW107XHJcbiAgICAgICAgbGV0IHRvdGFsQml0cyA9IHRoaXMudG90YWxfICogODtcclxuICAgICAgICAvLyBBZGQgcGFkIDB4ODAgMHgwMCouXHJcbiAgICAgICAgaWYgKHRoaXMuaW5idWZfIDwgNTYpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUodGhpcy5wYWRfLCA1NiAtIHRoaXMuaW5idWZfKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRoaXMucGFkXywgdGhpcy5ibG9ja1NpemUgLSAodGhpcy5pbmJ1Zl8gLSA1NikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBZGQgIyBiaXRzLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLmJsb2NrU2l6ZSAtIDE7IGkgPj0gNTY7IGktLSkge1xyXG4gICAgICAgICAgICB0aGlzLmJ1Zl9baV0gPSB0b3RhbEJpdHMgJiAyNTU7XHJcbiAgICAgICAgICAgIHRvdGFsQml0cyAvPSAyNTY7IC8vIERvbid0IHVzZSBiaXQtc2hpZnRpbmcgaGVyZSFcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wcmVzc18odGhpcy5idWZfKTtcclxuICAgICAgICBsZXQgbiA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA1OyBpKyspIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDI0OyBqID49IDA7IGogLT0gOCkge1xyXG4gICAgICAgICAgICAgICAgZGlnZXN0W25dID0gKHRoaXMuY2hhaW5fW2ldID4+IGopICYgMjU1O1xyXG4gICAgICAgICAgICAgICAgKytuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkaWdlc3Q7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEhlbHBlciB0byBtYWtlIGEgU3Vic2NyaWJlIGZ1bmN0aW9uIChqdXN0IGxpa2UgUHJvbWlzZSBoZWxwcyBtYWtlIGFcclxuICogVGhlbmFibGUpLlxyXG4gKlxyXG4gKiBAcGFyYW0gZXhlY3V0b3IgRnVuY3Rpb24gd2hpY2ggY2FuIG1ha2UgY2FsbHMgdG8gYSBzaW5nbGUgT2JzZXJ2ZXJcclxuICogICAgIGFzIGEgcHJveHkuXHJcbiAqIEBwYXJhbSBvbk5vT2JzZXJ2ZXJzIENhbGxiYWNrIHdoZW4gY291bnQgb2YgT2JzZXJ2ZXJzIGdvZXMgdG8gemVyby5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVN1YnNjcmliZShleGVjdXRvciwgb25Ob09ic2VydmVycykge1xyXG4gICAgY29uc3QgcHJveHkgPSBuZXcgT2JzZXJ2ZXJQcm94eShleGVjdXRvciwgb25Ob09ic2VydmVycyk7XHJcbiAgICByZXR1cm4gcHJveHkuc3Vic2NyaWJlLmJpbmQocHJveHkpO1xyXG59XHJcbi8qKlxyXG4gKiBJbXBsZW1lbnQgZmFuLW91dCBmb3IgYW55IG51bWJlciBvZiBPYnNlcnZlcnMgYXR0YWNoZWQgdmlhIGEgc3Vic2NyaWJlXHJcbiAqIGZ1bmN0aW9uLlxyXG4gKi9cclxuY2xhc3MgT2JzZXJ2ZXJQcm94eSB7XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBleGVjdXRvciBGdW5jdGlvbiB3aGljaCBjYW4gbWFrZSBjYWxscyB0byBhIHNpbmdsZSBPYnNlcnZlclxyXG4gICAgICogICAgIGFzIGEgcHJveHkuXHJcbiAgICAgKiBAcGFyYW0gb25Ob09ic2VydmVycyBDYWxsYmFjayB3aGVuIGNvdW50IG9mIE9ic2VydmVycyBnb2VzIHRvIHplcm8uXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGV4ZWN1dG9yLCBvbk5vT2JzZXJ2ZXJzKSB7XHJcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlcyA9IFtdO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCA9IDA7XHJcbiAgICAgICAgLy8gTWljcm8tdGFzayBzY2hlZHVsaW5nIGJ5IGNhbGxpbmcgdGFzay50aGVuKCkuXHJcbiAgICAgICAgdGhpcy50YXNrID0gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICAgICAgdGhpcy5maW5hbGl6ZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uTm9PYnNlcnZlcnMgPSBvbk5vT2JzZXJ2ZXJzO1xyXG4gICAgICAgIC8vIENhbGwgdGhlIGV4ZWN1dG9yIGFzeW5jaHJvbm91c2x5IHNvIHN1YnNjcmliZXJzIHRoYXQgYXJlIGNhbGxlZFxyXG4gICAgICAgIC8vIHN5bmNocm9ub3VzbHkgYWZ0ZXIgdGhlIGNyZWF0aW9uIG9mIHRoZSBzdWJzY3JpYmUgZnVuY3Rpb25cclxuICAgICAgICAvLyBjYW4gc3RpbGwgcmVjZWl2ZSB0aGUgdmVyeSBmaXJzdCB2YWx1ZSBnZW5lcmF0ZWQgaW4gdGhlIGV4ZWN1dG9yLlxyXG4gICAgICAgIHRoaXMudGFza1xyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGV4ZWN1dG9yKHRoaXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcihlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG5leHQodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh2YWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBlcnJvcihlcnJvcikge1xyXG4gICAgICAgIHRoaXMuZm9yRWFjaE9ic2VydmVyKChvYnNlcnZlcikgPT4ge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnJvcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jbG9zZShlcnJvcik7XHJcbiAgICB9XHJcbiAgICBjb21wbGV0ZSgpIHtcclxuICAgICAgICB0aGlzLmZvckVhY2hPYnNlcnZlcigob2JzZXJ2ZXIpID0+IHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IGNhbiBiZSB1c2VkIHRvIGFkZCBhbiBPYnNlcnZlciB0byB0aGUgZmFuLW91dCBsaXN0LlxyXG4gICAgICpcclxuICAgICAqIC0gV2UgcmVxdWlyZSB0aGF0IG5vIGV2ZW50IGlzIHNlbnQgdG8gYSBzdWJzY3JpYmVyIHN5Y2hyb25vdXNseSB0byB0aGVpclxyXG4gICAgICogICBjYWxsIHRvIHN1YnNjcmliZSgpLlxyXG4gICAgICovXHJcbiAgICBzdWJzY3JpYmUobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSkge1xyXG4gICAgICAgIGxldCBvYnNlcnZlcjtcclxuICAgICAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgPT09IHVuZGVmaW5lZCAmJlxyXG4gICAgICAgICAgICBlcnJvciA9PT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgICAgIGNvbXBsZXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIE9ic2VydmVyLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBBc3NlbWJsZSBhbiBPYnNlcnZlciBvYmplY3Qgd2hlbiBwYXNzZWQgYXMgY2FsbGJhY2sgZnVuY3Rpb25zLlxyXG4gICAgICAgIGlmIChpbXBsZW1lbnRzQW55TWV0aG9kcyhuZXh0T3JPYnNlcnZlciwgW1xyXG4gICAgICAgICAgICAnbmV4dCcsXHJcbiAgICAgICAgICAgICdlcnJvcicsXHJcbiAgICAgICAgICAgICdjb21wbGV0ZSdcclxuICAgICAgICBdKSkge1xyXG4gICAgICAgICAgICBvYnNlcnZlciA9IG5leHRPck9ic2VydmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIgPSB7XHJcbiAgICAgICAgICAgICAgICBuZXh0OiBuZXh0T3JPYnNlcnZlcixcclxuICAgICAgICAgICAgICAgIGVycm9yLFxyXG4gICAgICAgICAgICAgICAgY29tcGxldGVcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLm5leHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5uZXh0ID0gbm9vcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG9ic2VydmVyLmVycm9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IgPSBub29wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob2JzZXJ2ZXIuY29tcGxldGUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSA9IG5vb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHVuc3ViID0gdGhpcy51bnN1YnNjcmliZU9uZS5iaW5kKHRoaXMsIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCk7XHJcbiAgICAgICAgLy8gQXR0ZW1wdCB0byBzdWJzY3JpYmUgdG8gYSB0ZXJtaW5hdGVkIE9ic2VydmFibGUgLSB3ZVxyXG4gICAgICAgIC8vIGp1c3QgcmVzcG9uZCB0byB0aGUgT2JzZXJ2ZXIgd2l0aCB0aGUgZmluYWwgZXJyb3Igb3IgY29tcGxldGVcclxuICAgICAgICAvLyBldmVudC5cclxuICAgICAgICBpZiAodGhpcy5maW5hbGl6ZWQpIHtcclxuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgICAgICB0aGlzLnRhc2sudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmZpbmFsRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IodGhpcy5maW5hbEVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9ic2VydmVycy5wdXNoKG9ic2VydmVyKTtcclxuICAgICAgICByZXR1cm4gdW5zdWI7XHJcbiAgICB9XHJcbiAgICAvLyBVbnN1YnNjcmliZSBpcyBzeW5jaHJvbm91cyAtIHdlIGd1YXJhbnRlZSB0aGF0IG5vIGV2ZW50cyBhcmUgc2VudCB0b1xyXG4gICAgLy8gYW55IHVuc3Vic2NyaWJlZCBPYnNlcnZlci5cclxuICAgIHVuc3Vic2NyaWJlT25lKGkpIHtcclxuICAgICAgICBpZiAodGhpcy5vYnNlcnZlcnMgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm9ic2VydmVyc1tpXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2ldO1xyXG4gICAgICAgIHRoaXMub2JzZXJ2ZXJDb3VudCAtPSAxO1xyXG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyQ291bnQgPT09IDAgJiYgdGhpcy5vbk5vT2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGZvckVhY2hPYnNlcnZlcihmbikge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICAvLyBBbHJlYWR5IGNsb3NlZCBieSBwcmV2aW91cyBldmVudC4uLi5qdXN0IGVhdCB0aGUgYWRkaXRpb25hbCB2YWx1ZXMuXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2luY2Ugc2VuZE9uZSBjYWxscyBhc3luY2hyb25vdXNseSAtIHRoZXJlIGlzIG5vIGNoYW5jZSB0aGF0XHJcbiAgICAgICAgLy8gdGhpcy5vYnNlcnZlcnMgd2lsbCBiZWNvbWUgdW5kZWZpbmVkLlxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vYnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zZW5kT25lKGksIGZuKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvLyBDYWxsIHRoZSBPYnNlcnZlciB2aWEgb25lIG9mIGl0J3MgY2FsbGJhY2sgZnVuY3Rpb24uIFdlIGFyZSBjYXJlZnVsIHRvXHJcbiAgICAvLyBjb25maXJtIHRoYXQgdGhlIG9ic2VydmUgaGFzIG5vdCBiZWVuIHVuc3Vic2NyaWJlZCBzaW5jZSB0aGlzIGFzeW5jaHJvbm91c1xyXG4gICAgLy8gZnVuY3Rpb24gaGFkIGJlZW4gcXVldWVkLlxyXG4gICAgc2VuZE9uZShpLCBmbikge1xyXG4gICAgICAgIC8vIEV4ZWN1dGUgdGhlIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5XHJcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1mbG9hdGluZy1wcm9taXNlc1xyXG4gICAgICAgIHRoaXMudGFzay50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXJzICE9PSB1bmRlZmluZWQgJiYgdGhpcy5vYnNlcnZlcnNbaV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBmbih0aGlzLm9ic2VydmVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElnbm9yZSBleGNlcHRpb25zIHJhaXNlZCBpbiBPYnNlcnZlcnMgb3IgbWlzc2luZyBtZXRob2RzIG9mIGFuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gT2JzZXJ2ZXIuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gTG9nIGVycm9yIHRvIGNvbnNvbGUuIGIvMzE0MDQ4MDZcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmIGNvbnNvbGUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGNsb3NlKGVycikge1xyXG4gICAgICAgIGlmICh0aGlzLmZpbmFsaXplZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZmluYWxpemVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAoZXJyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5maW5hbEVycm9yID0gZXJyO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBQcm94eSBpcyBubyBsb25nZXIgbmVlZGVkIC0gZ2FyYmFnZSBjb2xsZWN0IHJlZmVyZW5jZXNcclxuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWZsb2F0aW5nLXByb21pc2VzXHJcbiAgICAgICAgdGhpcy50YXNrLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLm9ic2VydmVycyA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgdGhpcy5vbk5vT2JzZXJ2ZXJzID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKiBUdXJuIHN5bmNocm9ub3VzIGZ1bmN0aW9uIGludG8gb25lIGNhbGxlZCBhc3luY2hyb25vdXNseS4gKi9cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9iYW4tdHlwZXNcclxuZnVuY3Rpb24gYXN5bmMoZm4sIG9uRXJyb3IpIHtcclxuICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSh0cnVlKVxyXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIGZuKC4uLmFyZ3MpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgaWYgKG9uRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm4gdHJ1ZSBpZiB0aGUgb2JqZWN0IHBhc3NlZCBpbiBpbXBsZW1lbnRzIGFueSBvZiB0aGUgbmFtZWQgbWV0aG9kcy5cclxuICovXHJcbmZ1bmN0aW9uIGltcGxlbWVudHNBbnlNZXRob2RzKG9iaiwgbWV0aG9kcykge1xyXG4gICAgaWYgKHR5cGVvZiBvYmogIT09ICdvYmplY3QnIHx8IG9iaiA9PT0gbnVsbCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGZvciAoY29uc3QgbWV0aG9kIG9mIG1ldGhvZHMpIHtcclxuICAgICAgICBpZiAobWV0aG9kIGluIG9iaiAmJiB0eXBlb2Ygb2JqW21ldGhvZF0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcbmZ1bmN0aW9uIG5vb3AoKSB7XHJcbiAgICAvLyBkbyBub3RoaW5nXHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIENoZWNrIHRvIG1ha2Ugc3VyZSB0aGUgYXBwcm9wcmlhdGUgbnVtYmVyIG9mIGFyZ3VtZW50cyBhcmUgcHJvdmlkZWQgZm9yIGEgcHVibGljIGZ1bmN0aW9uLlxyXG4gKiBUaHJvd3MgYW4gZXJyb3IgaWYgaXQgZmFpbHMuXHJcbiAqXHJcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcclxuICogQHBhcmFtIG1pbkNvdW50IFRoZSBtaW5pbXVtIG51bWJlciBvZiBhcmd1bWVudHMgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBtYXhDb3VudCBUaGUgbWF4aW11bSBudW1iZXIgb2YgYXJndW1lbnQgdG8gYWxsb3cgZm9yIHRoZSBmdW5jdGlvbiBjYWxsXHJcbiAqIEBwYXJhbSBhcmdDb3VudCBUaGUgYWN0dWFsIG51bWJlciBvZiBhcmd1bWVudHMgcHJvdmlkZWQuXHJcbiAqL1xyXG5jb25zdCB2YWxpZGF0ZUFyZ0NvdW50ID0gZnVuY3Rpb24gKGZuTmFtZSwgbWluQ291bnQsIG1heENvdW50LCBhcmdDb3VudCkge1xyXG4gICAgbGV0IGFyZ0Vycm9yO1xyXG4gICAgaWYgKGFyZ0NvdW50IDwgbWluQ291bnQpIHtcclxuICAgICAgICBhcmdFcnJvciA9ICdhdCBsZWFzdCAnICsgbWluQ291bnQ7XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChhcmdDb3VudCA+IG1heENvdW50KSB7XHJcbiAgICAgICAgYXJnRXJyb3IgPSBtYXhDb3VudCA9PT0gMCA/ICdub25lJyA6ICdubyBtb3JlIHRoYW4gJyArIG1heENvdW50O1xyXG4gICAgfVxyXG4gICAgaWYgKGFyZ0Vycm9yKSB7XHJcbiAgICAgICAgY29uc3QgZXJyb3IgPSBmbk5hbWUgK1xyXG4gICAgICAgICAgICAnIGZhaWxlZDogV2FzIGNhbGxlZCB3aXRoICcgK1xyXG4gICAgICAgICAgICBhcmdDb3VudCArXHJcbiAgICAgICAgICAgIChhcmdDb3VudCA9PT0gMSA/ICcgYXJndW1lbnQuJyA6ICcgYXJndW1lbnRzLicpICtcclxuICAgICAgICAgICAgJyBFeHBlY3RzICcgK1xyXG4gICAgICAgICAgICBhcmdFcnJvciArXHJcbiAgICAgICAgICAgICcuJztcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG59O1xyXG4vKipcclxuICogR2VuZXJhdGVzIGEgc3RyaW5nIHRvIHByZWZpeCBhbiBlcnJvciBtZXNzYWdlIGFib3V0IGZhaWxlZCBhcmd1bWVudCB2YWxpZGF0aW9uXHJcbiAqXHJcbiAqIEBwYXJhbSBmbk5hbWUgVGhlIGZ1bmN0aW9uIG5hbWVcclxuICogQHBhcmFtIGFyZ05hbWUgVGhlIG5hbWUgb2YgdGhlIGFyZ3VtZW50XHJcbiAqIEByZXR1cm4gVGhlIHByZWZpeCB0byBhZGQgdG8gdGhlIGVycm9yIHRocm93biBmb3IgdmFsaWRhdGlvbi5cclxuICovXHJcbmZ1bmN0aW9uIGVycm9yUHJlZml4KGZuTmFtZSwgYXJnTmFtZSkge1xyXG4gICAgcmV0dXJuIGAke2ZuTmFtZX0gZmFpbGVkOiAke2FyZ05hbWV9IGFyZ3VtZW50IGA7XHJcbn1cclxuLyoqXHJcbiAqIEBwYXJhbSBmbk5hbWVcclxuICogQHBhcmFtIGFyZ3VtZW50TnVtYmVyXHJcbiAqIEBwYXJhbSBuYW1lc3BhY2VcclxuICogQHBhcmFtIG9wdGlvbmFsXHJcbiAqL1xyXG5mdW5jdGlvbiB2YWxpZGF0ZU5hbWVzcGFjZShmbk5hbWUsIG5hbWVzcGFjZSwgb3B0aW9uYWwpIHtcclxuICAgIGlmIChvcHRpb25hbCAmJiAhbmFtZXNwYWNlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBuYW1lc3BhY2UgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgLy9UT0RPOiBJIHNob3VsZCBkbyBtb3JlIHZhbGlkYXRpb24gaGVyZS4gV2Ugb25seSBhbGxvdyBjZXJ0YWluIGNoYXJzIGluIG5hbWVzcGFjZXMuXHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycm9yUHJlZml4KGZuTmFtZSwgJ25hbWVzcGFjZScpICsgJ211c3QgYmUgYSB2YWxpZCBmaXJlYmFzZSBuYW1lc3BhY2UuJyk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gdmFsaWRhdGVDYWxsYmFjayhmbk5hbWUsIGFyZ3VtZW50TmFtZSwgXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvYmFuLXR5cGVzXHJcbmNhbGxiYWNrLCBvcHRpb25hbCkge1xyXG4gICAgaWYgKG9wdGlvbmFsICYmICFjYWxsYmFjaykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE5hbWUpICsgJ211c3QgYmUgYSB2YWxpZCBmdW5jdGlvbi4nKTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiB2YWxpZGF0ZUNvbnRleHRPYmplY3QoZm5OYW1lLCBhcmd1bWVudE5hbWUsIGNvbnRleHQsIG9wdGlvbmFsKSB7XHJcbiAgICBpZiAob3B0aW9uYWwgJiYgIWNvbnRleHQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZW9mIGNvbnRleHQgIT09ICdvYmplY3QnIHx8IGNvbnRleHQgPT09IG51bGwpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZXJyb3JQcmVmaXgoZm5OYW1lLCBhcmd1bWVudE5hbWUpICsgJ211c3QgYmUgYSB2YWxpZCBjb250ZXh0IG9iamVjdC4nKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vLyBDb2RlIG9yaWdpbmFsbHkgY2FtZSBmcm9tIGdvb2cuY3J5cHQuc3RyaW5nVG9VdGY4Qnl0ZUFycmF5LCBidXQgZm9yIHNvbWUgcmVhc29uIHRoZXlcclxuLy8gYXV0b21hdGljYWxseSByZXBsYWNlZCAnXFxyXFxuJyB3aXRoICdcXG4nLCBhbmQgdGhleSBkaWRuJ3QgaGFuZGxlIHN1cnJvZ2F0ZSBwYWlycyxcclxuLy8gc28gaXQncyBiZWVuIG1vZGlmaWVkLlxyXG4vLyBOb3RlIHRoYXQgbm90IGFsbCBVbmljb2RlIGNoYXJhY3RlcnMgYXBwZWFyIGFzIHNpbmdsZSBjaGFyYWN0ZXJzIGluIEphdmFTY3JpcHQgc3RyaW5ncy5cclxuLy8gZnJvbUNoYXJDb2RlIHJldHVybnMgdGhlIFVURi0xNiBlbmNvZGluZyBvZiBhIGNoYXJhY3RlciAtIHNvIHNvbWUgVW5pY29kZSBjaGFyYWN0ZXJzXHJcbi8vIHVzZSAyIGNoYXJhY3RlcnMgaW4gSmF2YXNjcmlwdC4gIEFsbCA0LWJ5dGUgVVRGLTggY2hhcmFjdGVycyBiZWdpbiB3aXRoIGEgZmlyc3RcclxuLy8gY2hhcmFjdGVyIGluIHRoZSByYW5nZSAweEQ4MDAgLSAweERCRkYgKHRoZSBmaXJzdCBjaGFyYWN0ZXIgb2YgYSBzby1jYWxsZWQgc3Vycm9nYXRlXHJcbi8vIHBhaXIpLlxyXG4vLyBTZWUgaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzUuMS8jc2VjLTE1LjEuM1xyXG4vKipcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJuIHtBcnJheX1cclxuICovXHJcbmNvbnN0IHN0cmluZ1RvQnl0ZUFycmF5ID0gZnVuY3Rpb24gKHN0cikge1xyXG4gICAgY29uc3Qgb3V0ID0gW107XHJcbiAgICBsZXQgcCA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGxldCBjID0gc3RyLmNoYXJDb2RlQXQoaSk7XHJcbiAgICAgICAgLy8gSXMgdGhpcyB0aGUgbGVhZCBzdXJyb2dhdGUgaW4gYSBzdXJyb2dhdGUgcGFpcj9cclxuICAgICAgICBpZiAoYyA+PSAweGQ4MDAgJiYgYyA8PSAweGRiZmYpIHtcclxuICAgICAgICAgICAgY29uc3QgaGlnaCA9IGMgLSAweGQ4MDA7IC8vIHRoZSBoaWdoIDEwIGJpdHMuXHJcbiAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgYXNzZXJ0KGkgPCBzdHIubGVuZ3RoLCAnU3Vycm9nYXRlIHBhaXIgbWlzc2luZyB0cmFpbCBzdXJyb2dhdGUuJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxvdyA9IHN0ci5jaGFyQ29kZUF0KGkpIC0gMHhkYzAwOyAvLyB0aGUgbG93IDEwIGJpdHMuXHJcbiAgICAgICAgICAgIGMgPSAweDEwMDAwICsgKGhpZ2ggPDwgMTApICsgbG93O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoYyA8IDEyOCkge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IGM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCAyMDQ4KSB7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgPj4gNikgfCAxOTI7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGMgPCA2NTUzNikge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDEyKSB8IDIyNDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gNikgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgICAgIG91dFtwKytdID0gKGMgJiA2MykgfCAxMjg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9IChjID4+IDE4KSB8IDI0MDtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoKGMgPj4gMTIpICYgNjMpIHwgMTI4O1xyXG4gICAgICAgICAgICBvdXRbcCsrXSA9ICgoYyA+PiA2KSAmIDYzKSB8IDEyODtcclxuICAgICAgICAgICAgb3V0W3ArK10gPSAoYyAmIDYzKSB8IDEyODtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gb3V0O1xyXG59O1xyXG4vKipcclxuICogQ2FsY3VsYXRlIGxlbmd0aCB3aXRob3V0IGFjdHVhbGx5IGNvbnZlcnRpbmc7IHVzZWZ1bCBmb3IgZG9pbmcgY2hlYXBlciB2YWxpZGF0aW9uLlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm4ge251bWJlcn1cclxuICovXHJcbmNvbnN0IHN0cmluZ0xlbmd0aCA9IGZ1bmN0aW9uIChzdHIpIHtcclxuICAgIGxldCBwID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IHN0ci5jaGFyQ29kZUF0KGkpO1xyXG4gICAgICAgIGlmIChjIDwgMTI4KSB7XHJcbiAgICAgICAgICAgIHArKztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoYyA8IDIwNDgpIHtcclxuICAgICAgICAgICAgcCArPSAyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChjID49IDB4ZDgwMCAmJiBjIDw9IDB4ZGJmZikge1xyXG4gICAgICAgICAgICAvLyBMZWFkIHN1cnJvZ2F0ZSBvZiBhIHN1cnJvZ2F0ZSBwYWlyLiAgVGhlIHBhaXIgdG9nZXRoZXIgd2lsbCB0YWtlIDQgYnl0ZXMgdG8gcmVwcmVzZW50LlxyXG4gICAgICAgICAgICBwICs9IDQ7XHJcbiAgICAgICAgICAgIGkrKzsgLy8gc2tpcCB0cmFpbCBzdXJyb2dhdGUuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBwICs9IDM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHA7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMiBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDb3BpZWQgZnJvbSBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjExNzUyM1xyXG4gKiBHZW5lcmF0ZXMgYSBuZXcgdXVpZC5cclxuICogQHB1YmxpY1xyXG4gKi9cclxuY29uc3QgdXVpZHY0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgYyA9PiB7XHJcbiAgICAgICAgY29uc3QgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCwgdiA9IGMgPT09ICd4JyA/IHIgOiAociAmIDB4MykgfCAweDg7XHJcbiAgICAgICAgcmV0dXJuIHYudG9TdHJpbmcoMTYpO1xyXG4gICAgfSk7XHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaGUgYW1vdW50IG9mIG1pbGxpc2Vjb25kcyB0byBleHBvbmVudGlhbGx5IGluY3JlYXNlLlxyXG4gKi9cclxuY29uc3QgREVGQVVMVF9JTlRFUlZBTF9NSUxMSVMgPSAxMDAwO1xyXG4vKipcclxuICogVGhlIGZhY3RvciB0byBiYWNrb2ZmIGJ5LlxyXG4gKiBTaG91bGQgYmUgYSBudW1iZXIgZ3JlYXRlciB0aGFuIDEuXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0JBQ0tPRkZfRkFDVE9SID0gMjtcclxuLyoqXHJcbiAqIFRoZSBtYXhpbXVtIG1pbGxpc2Vjb25kcyB0byBpbmNyZWFzZSB0by5cclxuICpcclxuICogPHA+VmlzaWJsZSBmb3IgdGVzdGluZ1xyXG4gKi9cclxuY29uc3QgTUFYX1ZBTFVFX01JTExJUyA9IDQgKiA2MCAqIDYwICogMTAwMDsgLy8gRm91ciBob3VycywgbGlrZSBpT1MgYW5kIEFuZHJvaWQuXHJcbi8qKlxyXG4gKiBUaGUgcGVyY2VudGFnZSBvZiBiYWNrb2ZmIHRpbWUgdG8gcmFuZG9taXplIGJ5LlxyXG4gKiBTZWVcclxuICogaHR0cDovL2dvL3NhZmUtY2xpZW50LWJlaGF2aW9yI3N0ZXAtMS1kZXRlcm1pbmUtdGhlLWFwcHJvcHJpYXRlLXJldHJ5LWludGVydmFsLXRvLWhhbmRsZS1zcGlrZS10cmFmZmljXHJcbiAqIGZvciBjb250ZXh0LlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nXHJcbiAqL1xyXG5jb25zdCBSQU5ET01fRkFDVE9SID0gMC41O1xyXG4vKipcclxuICogQmFzZWQgb24gdGhlIGJhY2tvZmYgbWV0aG9kIGZyb21cclxuICogaHR0cHM6Ly9naXRodWIuY29tL2dvb2dsZS9jbG9zdXJlLWxpYnJhcnkvYmxvYi9tYXN0ZXIvY2xvc3VyZS9nb29nL21hdGgvZXhwb25lbnRpYWxiYWNrb2ZmLmpzLlxyXG4gKiBFeHRyYWN0ZWQgaGVyZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHBhc3MgbWV0YWRhdGEgYW5kIGEgc3RhdGVmdWwgRXhwb25lbnRpYWxCYWNrb2ZmIG9iamVjdCBhcm91bmQuXHJcbiAqL1xyXG5mdW5jdGlvbiBjYWxjdWxhdGVCYWNrb2ZmTWlsbGlzKGJhY2tvZmZDb3VudCwgaW50ZXJ2YWxNaWxsaXMgPSBERUZBVUxUX0lOVEVSVkFMX01JTExJUywgYmFja29mZkZhY3RvciA9IERFRkFVTFRfQkFDS09GRl9GQUNUT1IpIHtcclxuICAgIC8vIENhbGN1bGF0ZXMgYW4gZXhwb25lbnRpYWxseSBpbmNyZWFzaW5nIHZhbHVlLlxyXG4gICAgLy8gRGV2aWF0aW9uOiBjYWxjdWxhdGVzIHZhbHVlIGZyb20gY291bnQgYW5kIGEgY29uc3RhbnQgaW50ZXJ2YWwsIHNvIHdlIG9ubHkgbmVlZCB0byBzYXZlIHZhbHVlXHJcbiAgICAvLyBhbmQgY291bnQgdG8gcmVzdG9yZSBzdGF0ZS5cclxuICAgIGNvbnN0IGN1cnJCYXNlVmFsdWUgPSBpbnRlcnZhbE1pbGxpcyAqIE1hdGgucG93KGJhY2tvZmZGYWN0b3IsIGJhY2tvZmZDb3VudCk7XHJcbiAgICAvLyBBIHJhbmRvbSBcImZ1enpcIiB0byBhdm9pZCB3YXZlcyBvZiByZXRyaWVzLlxyXG4gICAgLy8gRGV2aWF0aW9uOiByYW5kb21GYWN0b3IgaXMgcmVxdWlyZWQuXHJcbiAgICBjb25zdCByYW5kb21XYWl0ID0gTWF0aC5yb3VuZChcclxuICAgIC8vIEEgZnJhY3Rpb24gb2YgdGhlIGJhY2tvZmYgdmFsdWUgdG8gYWRkL3N1YnRyYWN0LlxyXG4gICAgLy8gRGV2aWF0aW9uOiBjaGFuZ2VzIG11bHRpcGxpY2F0aW9uIG9yZGVyIHRvIGltcHJvdmUgcmVhZGFiaWxpdHkuXHJcbiAgICBSQU5ET01fRkFDVE9SICpcclxuICAgICAgICBjdXJyQmFzZVZhbHVlICpcclxuICAgICAgICAvLyBBIHJhbmRvbSBmbG9hdCAocm91bmRlZCB0byBpbnQgYnkgTWF0aC5yb3VuZCBhYm92ZSkgaW4gdGhlIHJhbmdlIFstMSwgMV0uIERldGVybWluZXNcclxuICAgICAgICAvLyBpZiB3ZSBhZGQgb3Igc3VidHJhY3QuXHJcbiAgICAgICAgKE1hdGgucmFuZG9tKCkgLSAwLjUpICpcclxuICAgICAgICAyKTtcclxuICAgIC8vIExpbWl0cyBiYWNrb2ZmIHRvIG1heCB0byBhdm9pZCBlZmZlY3RpdmVseSBwZXJtYW5lbnQgYmFja29mZi5cclxuICAgIHJldHVybiBNYXRoLm1pbihNQVhfVkFMVUVfTUlMTElTLCBjdXJyQmFzZVZhbHVlICsgcmFuZG9tV2FpdCk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFByb3ZpZGUgRW5nbGlzaCBvcmRpbmFsIGxldHRlcnMgYWZ0ZXIgYSBudW1iZXJcclxuICovXHJcbmZ1bmN0aW9uIG9yZGluYWwoaSkge1xyXG4gICAgaWYgKCFOdW1iZXIuaXNGaW5pdGUoaSkpIHtcclxuICAgICAgICByZXR1cm4gYCR7aX1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGkgKyBpbmRpY2F0b3IoaSk7XHJcbn1cclxuZnVuY3Rpb24gaW5kaWNhdG9yKGkpIHtcclxuICAgIGkgPSBNYXRoLmFicyhpKTtcclxuICAgIGNvbnN0IGNlbnQgPSBpICUgMTAwO1xyXG4gICAgaWYgKGNlbnQgPj0gMTAgJiYgY2VudCA8PSAyMCkge1xyXG4gICAgICAgIHJldHVybiAndGgnO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZGVjID0gaSAlIDEwO1xyXG4gICAgaWYgKGRlYyA9PT0gMSkge1xyXG4gICAgICAgIHJldHVybiAnc3QnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYyA9PT0gMikge1xyXG4gICAgICAgIHJldHVybiAnbmQnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRlYyA9PT0gMykge1xyXG4gICAgICAgIHJldHVybiAncmQnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICd0aCc7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIxIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0TW9kdWxhckluc3RhbmNlKHNlcnZpY2UpIHtcclxuICAgIGlmIChzZXJ2aWNlICYmIHNlcnZpY2UuX2RlbGVnYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2UuX2RlbGVnYXRlO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHNlcnZpY2U7XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgQ09OU1RBTlRTLCBEZWNvZGVCYXNlNjRTdHJpbmdFcnJvciwgRGVmZXJyZWQsIEVycm9yRmFjdG9yeSwgRmlyZWJhc2VFcnJvciwgTUFYX1ZBTFVFX01JTExJUywgUkFORE9NX0ZBQ1RPUiwgU2hhMSwgYXJlQ29va2llc0VuYWJsZWQsIGFzc2VydCwgYXNzZXJ0aW9uRXJyb3IsIGFzeW5jLCBiYXNlNjQsIGJhc2U2NERlY29kZSwgYmFzZTY0RW5jb2RlLCBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZywgY2FsY3VsYXRlQmFja29mZk1pbGxpcywgY29udGFpbnMsIGNyZWF0ZU1vY2tVc2VyVG9rZW4sIGNyZWF0ZVN1YnNjcmliZSwgZGVjb2RlLCBkZWVwQ29weSwgZGVlcEVxdWFsLCBkZWVwRXh0ZW5kLCBlcnJvclByZWZpeCwgZXh0cmFjdFF1ZXJ5c3RyaW5nLCBnZXREZWZhdWx0QXBwQ29uZmlnLCBnZXREZWZhdWx0RW11bGF0b3JIb3N0LCBnZXREZWZhdWx0RW11bGF0b3JIb3N0bmFtZUFuZFBvcnQsIGdldERlZmF1bHRzLCBnZXRFeHBlcmltZW50YWxTZXR0aW5nLCBnZXRHbG9iYWwsIGdldE1vZHVsYXJJbnN0YW5jZSwgZ2V0VUEsIGlzQWRtaW4sIGlzQnJvd3NlciwgaXNCcm93c2VyRXh0ZW5zaW9uLCBpc0VsZWN0cm9uLCBpc0VtcHR5LCBpc0lFLCBpc0luZGV4ZWREQkF2YWlsYWJsZSwgaXNNb2JpbGVDb3Jkb3ZhLCBpc05vZGUsIGlzTm9kZVNkaywgaXNSZWFjdE5hdGl2ZSwgaXNTYWZhcmksIGlzVVdQLCBpc1ZhbGlkRm9ybWF0LCBpc1ZhbGlkVGltZXN0YW1wLCBpc3N1ZWRBdFRpbWUsIGpzb25FdmFsLCBtYXAsIG9yZGluYWwsIHByb21pc2VXaXRoVGltZW91dCwgcXVlcnlzdHJpbmcsIHF1ZXJ5c3RyaW5nRGVjb2RlLCBzYWZlR2V0LCBzdHJpbmdMZW5ndGgsIHN0cmluZ1RvQnl0ZUFycmF5LCBzdHJpbmdpZnksIHV1aWR2NCwgdmFsaWRhdGVBcmdDb3VudCwgdmFsaWRhdGVDYWxsYmFjaywgdmFsaWRhdGVDb250ZXh0T2JqZWN0LCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlLCB2YWxpZGF0ZU5hbWVzcGFjZSB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsImltcG9ydCB7IERlZmVycmVkIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuXG4vKipcclxuICogQ29tcG9uZW50IGZvciBzZXJ2aWNlIG5hbWUgVCwgZS5nLiBgYXV0aGAsIGBhdXRoLWludGVybmFsYFxyXG4gKi9cclxuY2xhc3MgQ29tcG9uZW50IHtcclxuICAgIC8qKlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIFRoZSBwdWJsaWMgc2VydmljZSBuYW1lLCBlLmcuIGFwcCwgYXV0aCwgZmlyZXN0b3JlLCBkYXRhYmFzZVxyXG4gICAgICogQHBhcmFtIGluc3RhbmNlRmFjdG9yeSBTZXJ2aWNlIGZhY3RvcnkgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBwdWJsaWMgaW50ZXJmYWNlXHJcbiAgICAgKiBAcGFyYW0gdHlwZSB3aGV0aGVyIHRoZSBzZXJ2aWNlIHByb3ZpZGVkIGJ5IHRoZSBjb21wb25lbnQgaXMgcHVibGljIG9yIHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IobmFtZSwgaW5zdGFuY2VGYWN0b3J5LCB0eXBlKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlRmFjdG9yeSA9IGluc3RhbmNlRmFjdG9yeTtcclxuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xyXG4gICAgICAgIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBQcm9wZXJ0aWVzIHRvIGJlIGFkZGVkIHRvIHRoZSBzZXJ2aWNlIG5hbWVzcGFjZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc2VydmljZVByb3BzID0ge307XHJcbiAgICAgICAgdGhpcy5pbnN0YW50aWF0aW9uTW9kZSA9IFwiTEFaWVwiIC8qIEluc3RhbnRpYXRpb25Nb2RlLkxBWlkgKi87XHJcbiAgICAgICAgdGhpcy5vbkluc3RhbmNlQ3JlYXRlZCA9IG51bGw7XHJcbiAgICB9XHJcbiAgICBzZXRJbnN0YW50aWF0aW9uTW9kZShtb2RlKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW50aWF0aW9uTW9kZSA9IG1vZGU7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRNdWx0aXBsZUluc3RhbmNlcyhtdWx0aXBsZUluc3RhbmNlcykge1xyXG4gICAgICAgIHRoaXMubXVsdGlwbGVJbnN0YW5jZXMgPSBtdWx0aXBsZUluc3RhbmNlcztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHNldFNlcnZpY2VQcm9wcyhwcm9wcykge1xyXG4gICAgICAgIHRoaXMuc2VydmljZVByb3BzID0gcHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9XHJcbiAgICBzZXRJbnN0YW5jZUNyZWF0ZWRDYWxsYmFjayhjYWxsYmFjaykge1xyXG4gICAgICAgIHRoaXMub25JbnN0YW5jZUNyZWF0ZWQgPSBjYWxsYmFjaztcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBERUZBVUxUX0VOVFJZX05BTUUgPSAnW0RFRkFVTFRdJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFByb3ZpZGVyIGZvciBpbnN0YW5jZSBmb3Igc2VydmljZSBuYW1lIFQsIGUuZy4gJ2F1dGgnLCAnYXV0aC1pbnRlcm5hbCdcclxuICogTmFtZVNlcnZpY2VNYXBwaW5nW1RdIGlzIGFuIGFsaWFzIGZvciB0aGUgdHlwZSBvZiB0aGUgaW5zdGFuY2VcclxuICovXHJcbmNsYXNzIFByb3ZpZGVyIHtcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUsIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNPcHRpb25zID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMub25Jbml0Q2FsbGJhY2tzID0gbmV3IE1hcCgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gaWRlbnRpZmllciBBIHByb3ZpZGVyIGNhbiBwcm92aWRlIG11bGl0cGxlIGluc3RhbmNlcyBvZiBhIHNlcnZpY2VcclxuICAgICAqIGlmIHRoaXMuY29tcG9uZW50Lm11bHRpcGxlSW5zdGFuY2VzIGlzIHRydWUuXHJcbiAgICAgKi9cclxuICAgIGdldChpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgLy8gaWYgbXVsdGlwbGVJbnN0YW5jZXMgaXMgbm90IHN1cHBvcnRlZCwgdXNlIHRoZSBkZWZhdWx0IG5hbWVcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICghdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5oYXMobm9ybWFsaXplZElkZW50aWZpZXIpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuc2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyLCBkZWZlcnJlZCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpIHx8XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3VsZEF1dG9Jbml0aWFsaXplKCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemUgdGhlIHNlcnZpY2UgaWYgaXQgY2FuIGJlIGF1dG8taW5pdGlhbGl6ZWRcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZWRJZGVudGlmaWVyXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUoaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyBnZXQoKSwgaXQgc2hvdWxkIG5vdCBjYXVzZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgZmF0YWwgZXJyb3IuIFdlIGp1c3QgcmV0dXJuIHRoZSB1bnJlc29sdmVkIHByb21pc2UgaW4gdGhpcyBjYXNlLlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmdldChub3JtYWxpemVkSWRlbnRpZmllcikucHJvbWlzZTtcclxuICAgIH1cclxuICAgIGdldEltbWVkaWF0ZShvcHRpb25zKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIC8vIGlmIG11bHRpcGxlSW5zdGFuY2VzIGlzIG5vdCBzdXBwb3J0ZWQsIHVzZSB0aGUgZGVmYXVsdCBuYW1lXHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZElkZW50aWZpZXIgPSB0aGlzLm5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuaWRlbnRpZmllcik7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uYWwgPSAoX2EgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMub3B0aW9uYWwpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpIHx8XHJcbiAgICAgICAgICAgIHRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T3JJbml0aWFsaXplU2VydmljZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllclxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChvcHRpb25hbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gSW4gY2FzZSBhIGNvbXBvbmVudCBpcyBub3QgaW5pdGlhbGl6ZWQgYW5kIHNob3VsZC9jYW4gbm90IGJlIGF1dG8taW5pdGlhbGl6ZWQgYXQgdGhlIG1vbWVudCwgcmV0dXJuIG51bGwgaWYgdGhlIG9wdGlvbmFsIGZsYWcgaXMgc2V0LCBvciB0aHJvd1xyXG4gICAgICAgICAgICBpZiAob3B0aW9uYWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRXJyb3IoYFNlcnZpY2UgJHt0aGlzLm5hbWV9IGlzIG5vdCBhdmFpbGFibGVgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldENvbXBvbmVudCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb21wb25lbnQ7XHJcbiAgICB9XHJcbiAgICBzZXRDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgaWYgKGNvbXBvbmVudC5uYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYE1pc21hdGNoaW5nIENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBmb3IgUHJvdmlkZXIgJHt0aGlzLm5hbWV9LmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYENvbXBvbmVudCBmb3IgJHt0aGlzLm5hbWV9IGhhcyBhbHJlYWR5IGJlZW4gcHJvdmlkZWRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5jb21wb25lbnQgPSBjb21wb25lbnQ7XHJcbiAgICAgICAgLy8gcmV0dXJuIGVhcmx5IHdpdGhvdXQgYXR0ZW1wdGluZyB0byBpbml0aWFsaXplIHRoZSBjb21wb25lbnQgaWYgdGhlIGNvbXBvbmVudCByZXF1aXJlcyBleHBsaWNpdCBpbml0aWFsaXphdGlvbiAoY2FsbGluZyBgUHJvdmlkZXIuaW5pdGlhbGl6ZSgpYClcclxuICAgICAgICBpZiAoIXRoaXMuc2hvdWxkQXV0b0luaXRpYWxpemUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmIHRoZSBzZXJ2aWNlIGlzIGVhZ2VyLCBpbml0aWFsaXplIHRoZSBkZWZhdWx0IGluc3RhbmNlXHJcbiAgICAgICAgaWYgKGlzQ29tcG9uZW50RWFnZXIoY29tcG9uZW50KSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHsgaW5zdGFuY2VJZGVudGlmaWVyOiBERUZBVUxUX0VOVFJZX05BTUUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIHdoZW4gdGhlIGluc3RhbmNlIGZhY3RvcnkgZm9yIGFuIGVhZ2VyIENvbXBvbmVudCB0aHJvd3MgYW4gZXhjZXB0aW9uIGR1cmluZyB0aGUgZWFnZXJcclxuICAgICAgICAgICAgICAgIC8vIGluaXRpYWxpemF0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlIGEgZmF0YWwgZXJyb3IuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBJbnZlc3RpZ2F0ZSBpZiB3ZSBuZWVkIHRvIG1ha2UgaXQgY29uZmlndXJhYmxlLCBiZWNhdXNlIHNvbWUgY29tcG9uZW50IG1heSB3YW50IHRvIGNhdXNlXHJcbiAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yIGluIHRoaXMgY2FzZT9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDcmVhdGUgc2VydmljZSBpbnN0YW5jZXMgZm9yIHRoZSBwZW5kaW5nIHByb21pc2VzIGFuZCByZXNvbHZlIHRoZW1cclxuICAgICAgICAvLyBOT1RFOiBpZiB0aGlzLm11bHRpcGxlSW5zdGFuY2VzIGlzIGZhbHNlLCBvbmx5IHRoZSBkZWZhdWx0IGluc3RhbmNlIHdpbGwgYmUgY3JlYXRlZFxyXG4gICAgICAgIC8vIGFuZCBhbGwgcHJvbWlzZXMgd2l0aCByZXNvbHZlIHdpdGggaXQgcmVnYXJkbGVzcyBvZiB0aGUgaWRlbnRpZmllci5cclxuICAgICAgICBmb3IgKGNvbnN0IFtpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlRGVmZXJyZWRdIG9mIHRoaXMuaW5zdGFuY2VzRGVmZXJyZWQuZW50cmllcygpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIGBnZXRPckluaXRpYWxpemVTZXJ2aWNlKClgIHNob3VsZCBhbHdheXMgcmV0dXJuIGEgdmFsaWQgaW5zdGFuY2Ugc2luY2UgYSBjb21wb25lbnQgaXMgZ3VhcmFudGVlZC4gdXNlICEgdG8gbWFrZSB0eXBlc2NyaXB0IGhhcHB5LlxyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSB0aGlzLmdldE9ySW5pdGlhbGl6ZVNlcnZpY2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlSWRlbnRpZmllcjogbm9ybWFsaXplZElkZW50aWZpZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gd2hlbiB0aGUgaW5zdGFuY2UgZmFjdG9yeSB0aHJvd3MgYW4gZXhjZXB0aW9uLCBpdCBzaG91bGQgbm90IGNhdXNlXHJcbiAgICAgICAgICAgICAgICAvLyBhIGZhdGFsIGVycm9yLiBXZSBqdXN0IGxlYXZlIHRoZSBwcm9taXNlIHVucmVzb2x2ZWQuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjbGVhckluc3RhbmNlKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc0RlZmVycmVkLmRlbGV0ZShpZGVudGlmaWVyKTtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc09wdGlvbnMuZGVsZXRlKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzLmRlbGV0ZShpZGVudGlmaWVyKTtcclxuICAgIH1cclxuICAgIC8vIGFwcC5kZWxldGUoKSB3aWxsIGNhbGwgdGhpcyBtZXRob2Qgb24gZXZlcnkgcHJvdmlkZXIgdG8gZGVsZXRlIHRoZSBzZXJ2aWNlc1xyXG4gICAgLy8gVE9ETzogc2hvdWxkIHdlIG1hcmsgdGhlIHByb3ZpZGVyIGFzIGRlbGV0ZWQ/XHJcbiAgICBhc3luYyBkZWxldGUoKSB7XHJcbiAgICAgICAgY29uc3Qgc2VydmljZXMgPSBBcnJheS5mcm9tKHRoaXMuaW5zdGFuY2VzLnZhbHVlcygpKTtcclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgICAgIC4uLnNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHNlcnZpY2UgPT4gJ0lOVEVSTkFMJyBpbiBzZXJ2aWNlKSAvLyBsZWdhY3kgc2VydmljZXNcclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICAgICAgICAgICAgICAubWFwKHNlcnZpY2UgPT4gc2VydmljZS5JTlRFUk5BTC5kZWxldGUoKSksXHJcbiAgICAgICAgICAgIC4uLnNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAuZmlsdGVyKHNlcnZpY2UgPT4gJ19kZWxldGUnIGluIHNlcnZpY2UpIC8vIG1vZHVsYXJpemVkIHNlcnZpY2VzXHJcbiAgICAgICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxyXG4gICAgICAgICAgICAgICAgLm1hcChzZXJ2aWNlID0+IHNlcnZpY2UuX2RlbGV0ZSgpKVxyXG4gICAgICAgIF0pO1xyXG4gICAgfVxyXG4gICAgaXNDb21wb25lbnRTZXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50ICE9IG51bGw7XHJcbiAgICB9XHJcbiAgICBpc0luaXRpYWxpemVkKGlkZW50aWZpZXIgPSBERUZBVUxUX0VOVFJZX05BTUUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZXMuaGFzKGlkZW50aWZpZXIpO1xyXG4gICAgfVxyXG4gICAgZ2V0T3B0aW9ucyhpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzT3B0aW9ucy5nZXQoaWRlbnRpZmllcikgfHwge307XHJcbiAgICB9XHJcbiAgICBpbml0aWFsaXplKG9wdHMgPSB7fSkge1xyXG4gICAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IHt9IH0gPSBvcHRzO1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRJZGVudGlmaWVyID0gdGhpcy5ub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIob3B0cy5pbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzSW5pdGlhbGl6ZWQobm9ybWFsaXplZElkZW50aWZpZXIpKSB7XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGAke3RoaXMubmFtZX0oJHtub3JtYWxpemVkSWRlbnRpZmllcn0pIGhhcyBhbHJlYWR5IGJlZW4gaW5pdGlhbGl6ZWRgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzQ29tcG9uZW50U2V0KCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoYENvbXBvbmVudCAke3RoaXMubmFtZX0gaGFzIG5vdCBiZWVuIHJlZ2lzdGVyZWQgeWV0YCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5nZXRPckluaXRpYWxpemVTZXJ2aWNlKHtcclxuICAgICAgICAgICAgaW5zdGFuY2VJZGVudGlmaWVyOiBub3JtYWxpemVkSWRlbnRpZmllcixcclxuICAgICAgICAgICAgb3B0aW9uc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIHJlc29sdmUgYW55IHBlbmRpbmcgcHJvbWlzZSB3YWl0aW5nIGZvciB0aGUgc2VydmljZSBpbnN0YW5jZVxyXG4gICAgICAgIGZvciAoY29uc3QgW2luc3RhbmNlSWRlbnRpZmllciwgaW5zdGFuY2VEZWZlcnJlZF0gb2YgdGhpcy5pbnN0YW5jZXNEZWZlcnJlZC5lbnRyaWVzKCkpIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9ybWFsaXplZERlZmVycmVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGluc3RhbmNlSWRlbnRpZmllcik7XHJcbiAgICAgICAgICAgIGlmIChub3JtYWxpemVkSWRlbnRpZmllciA9PT0gbm9ybWFsaXplZERlZmVycmVkSWRlbnRpZmllcikge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2VEZWZlcnJlZC5yZXNvbHZlKGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBiZSBpbnZva2VkICBhZnRlciB0aGUgcHJvdmlkZXIgaGFzIGJlZW4gaW5pdGlhbGl6ZWQgYnkgY2FsbGluZyBwcm92aWRlci5pbml0aWFsaXplKCkuXHJcbiAgICAgKiBUaGUgZnVuY3Rpb24gaXMgaW52b2tlZCBTWU5DSFJPTk9VU0xZLCBzbyBpdCBzaG91bGQgbm90IGV4ZWN1dGUgYW55IGxvbmdydW5uaW5nIHRhc2tzIGluIG9yZGVyIHRvIG5vdCBibG9jayB0aGUgcHJvZ3JhbS5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaWRlbnRpZmllciBBbiBvcHRpb25hbCBpbnN0YW5jZSBpZGVudGlmaWVyXHJcbiAgICAgKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRvIHVucmVnaXN0ZXIgdGhlIGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIG9uSW5pdChjYWxsYmFjaywgaWRlbnRpZmllcikge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkSWRlbnRpZmllciA9IHRoaXMubm9ybWFsaXplSW5zdGFuY2VJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nQ2FsbGJhY2tzID0gKF9hID0gdGhpcy5vbkluaXRDYWxsYmFja3MuZ2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogbmV3IFNldCgpO1xyXG4gICAgICAgIGV4aXN0aW5nQ2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XHJcbiAgICAgICAgdGhpcy5vbkluaXRDYWxsYmFja3Muc2V0KG5vcm1hbGl6ZWRJZGVudGlmaWVyLCBleGlzdGluZ0NhbGxiYWNrcyk7XHJcbiAgICAgICAgY29uc3QgZXhpc3RpbmdJbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzLmdldChub3JtYWxpemVkSWRlbnRpZmllcik7XHJcbiAgICAgICAgaWYgKGV4aXN0aW5nSW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgY2FsbGJhY2soZXhpc3RpbmdJbnN0YW5jZSwgbm9ybWFsaXplZElkZW50aWZpZXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICAgICAgICBleGlzdGluZ0NhbGxiYWNrcy5kZWxldGUoY2FsbGJhY2spO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEludm9rZSBvbkluaXQgY2FsbGJhY2tzIHN5bmNocm9ub3VzbHlcclxuICAgICAqIEBwYXJhbSBpbnN0YW5jZSB0aGUgc2VydmljZSBpbnN0YW5jZWBcclxuICAgICAqL1xyXG4gICAgaW52b2tlT25Jbml0Q2FsbGJhY2tzKGluc3RhbmNlLCBpZGVudGlmaWVyKSB7XHJcbiAgICAgICAgY29uc3QgY2FsbGJhY2tzID0gdGhpcy5vbkluaXRDYWxsYmFja3MuZ2V0KGlkZW50aWZpZXIpO1xyXG4gICAgICAgIGlmICghY2FsbGJhY2tzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBjYWxsYmFjayBvZiBjYWxsYmFja3MpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGluc3RhbmNlLCBpZGVudGlmaWVyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoX2EpIHtcclxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBlcnJvcnMgaW4gdGhlIG9uSW5pdCBjYWxsYmFja1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZ2V0T3JJbml0aWFsaXplU2VydmljZSh7IGluc3RhbmNlSWRlbnRpZmllciwgb3B0aW9ucyA9IHt9IH0pIHtcclxuICAgICAgICBsZXQgaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlcy5nZXQoaW5zdGFuY2VJZGVudGlmaWVyKTtcclxuICAgICAgICBpZiAoIWluc3RhbmNlICYmIHRoaXMuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gdGhpcy5jb21wb25lbnQuaW5zdGFuY2VGYWN0b3J5KHRoaXMuY29udGFpbmVyLCB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZUlkZW50aWZpZXI6IG5vcm1hbGl6ZUlkZW50aWZpZXJGb3JGYWN0b3J5KGluc3RhbmNlSWRlbnRpZmllciksXHJcbiAgICAgICAgICAgICAgICBvcHRpb25zXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmluc3RhbmNlcy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5zdGFuY2VzT3B0aW9ucy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIEludm9rZSBvbkluaXQgbGlzdGVuZXJzLlxyXG4gICAgICAgICAgICAgKiBOb3RlIHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkIGlzIGRpZmZlcmVudCwgd2hpY2ggaXMgdXNlZCBieSB0aGUgY29tcG9uZW50IGNyZWF0b3IsXHJcbiAgICAgICAgICAgICAqIHdoaWxlIG9uSW5pdCBsaXN0ZW5lcnMgYXJlIHJlZ2lzdGVyZWQgYnkgY29uc3VtZXJzIG9mIHRoZSBwcm92aWRlci5cclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIHRoaXMuaW52b2tlT25Jbml0Q2FsbGJhY2tzKGluc3RhbmNlLCBpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogT3JkZXIgaXMgaW1wb3J0YW50XHJcbiAgICAgICAgICAgICAqIG9uSW5zdGFuY2VDcmVhdGVkKCkgc2hvdWxkIGJlIGNhbGxlZCBhZnRlciB0aGlzLmluc3RhbmNlcy5zZXQoaW5zdGFuY2VJZGVudGlmaWVyLCBpbnN0YW5jZSk7IHdoaWNoXHJcbiAgICAgICAgICAgICAqIG1ha2VzIGBpc0luaXRpYWxpemVkKClgIHJldHVybiB0cnVlLlxyXG4gICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkKSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50Lm9uSW5zdGFuY2VDcmVhdGVkKHRoaXMuY29udGFpbmVyLCBpbnN0YW5jZUlkZW50aWZpZXIsIGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNhdGNoIChfYSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBlcnJvcnMgaW4gdGhlIG9uSW5zdGFuY2VDcmVhdGVkQ2FsbGJhY2tcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2UgfHwgbnVsbDtcclxuICAgIH1cclxuICAgIG5vcm1hbGl6ZUluc3RhbmNlSWRlbnRpZmllcihpZGVudGlmaWVyID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudC5tdWx0aXBsZUluc3RhbmNlcyA/IGlkZW50aWZpZXIgOiBERUZBVUxUX0VOVFJZX05BTUU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gaWRlbnRpZmllcjsgLy8gYXNzdW1lIG11bHRpcGxlIGluc3RhbmNlcyBhcmUgc3VwcG9ydGVkIGJlZm9yZSB0aGUgY29tcG9uZW50IGlzIHByb3ZpZGVkLlxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHNob3VsZEF1dG9Jbml0aWFsaXplKCkge1xyXG4gICAgICAgIHJldHVybiAoISF0aGlzLmNvbXBvbmVudCAmJlxyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5pbnN0YW50aWF0aW9uTW9kZSAhPT0gXCJFWFBMSUNJVFwiIC8qIEluc3RhbnRpYXRpb25Nb2RlLkVYUExJQ0lUICovKTtcclxuICAgIH1cclxufVxyXG4vLyB1bmRlZmluZWQgc2hvdWxkIGJlIHBhc3NlZCB0byB0aGUgc2VydmljZSBmYWN0b3J5IGZvciB0aGUgZGVmYXVsdCBpbnN0YW5jZVxyXG5mdW5jdGlvbiBub3JtYWxpemVJZGVudGlmaWVyRm9yRmFjdG9yeShpZGVudGlmaWVyKSB7XHJcbiAgICByZXR1cm4gaWRlbnRpZmllciA9PT0gREVGQVVMVF9FTlRSWV9OQU1FID8gdW5kZWZpbmVkIDogaWRlbnRpZmllcjtcclxufVxyXG5mdW5jdGlvbiBpc0NvbXBvbmVudEVhZ2VyKGNvbXBvbmVudCkge1xyXG4gICAgcmV0dXJuIGNvbXBvbmVudC5pbnN0YW50aWF0aW9uTW9kZSA9PT0gXCJFQUdFUlwiIC8qIEluc3RhbnRpYXRpb25Nb2RlLkVBR0VSICovO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDb21wb25lbnRDb250YWluZXIgdGhhdCBwcm92aWRlcyBQcm92aWRlcnMgZm9yIHNlcnZpY2UgbmFtZSBULCBlLmcuIGBhdXRoYCwgYGF1dGgtaW50ZXJuYWxgXHJcbiAqL1xyXG5jbGFzcyBDb21wb25lbnRDb250YWluZXIge1xyXG4gICAgY29uc3RydWN0b3IobmFtZSkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5wcm92aWRlcnMgPSBuZXcgTWFwKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29tcG9uZW50IENvbXBvbmVudCBiZWluZyBhZGRlZFxyXG4gICAgICogQHBhcmFtIG92ZXJ3cml0ZSBXaGVuIGEgY29tcG9uZW50IHdpdGggdGhlIHNhbWUgbmFtZSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQsXHJcbiAgICAgKiBpZiBvdmVyd3JpdGUgaXMgdHJ1ZTogb3ZlcndyaXRlIHRoZSBleGlzdGluZyBjb21wb25lbnQgd2l0aCB0aGUgbmV3IGNvbXBvbmVudCBhbmQgY3JlYXRlIGEgbmV3XHJcbiAgICAgKiBwcm92aWRlciB3aXRoIHRoZSBuZXcgY29tcG9uZW50LiBJdCBjYW4gYmUgdXNlZnVsIGluIHRlc3RzIHdoZXJlIHlvdSB3YW50IHRvIHVzZSBkaWZmZXJlbnQgbW9ja3NcclxuICAgICAqIGZvciBkaWZmZXJlbnQgdGVzdHMuXHJcbiAgICAgKiBpZiBvdmVyd3JpdGUgaXMgZmFsc2U6IHRocm93IGFuIGV4Y2VwdGlvblxyXG4gICAgICovXHJcbiAgICBhZGRDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICAgICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLmdldFByb3ZpZGVyKGNvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICBpZiAocHJvdmlkZXIuaXNDb21wb25lbnRTZXQoKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvbXBvbmVudCAke2NvbXBvbmVudC5uYW1lfSBoYXMgYWxyZWFkeSBiZWVuIHJlZ2lzdGVyZWQgd2l0aCAke3RoaXMubmFtZX1gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdmlkZXIuc2V0Q29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBhZGRPck92ZXJ3cml0ZUNvbXBvbmVudChjb21wb25lbnQpIHtcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IHRoaXMuZ2V0UHJvdmlkZXIoY29tcG9uZW50Lm5hbWUpO1xyXG4gICAgICAgIGlmIChwcm92aWRlci5pc0NvbXBvbmVudFNldCgpKSB7XHJcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgZXhpc3RpbmcgcHJvdmlkZXIgZnJvbSB0aGUgY29udGFpbmVyLCBzbyB3ZSBjYW4gcmVnaXN0ZXIgdGhlIG5ldyBjb21wb25lbnRcclxuICAgICAgICAgICAgdGhpcy5wcm92aWRlcnMuZGVsZXRlKGNvbXBvbmVudC5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5hZGRDb21wb25lbnQoY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0UHJvdmlkZXIgcHJvdmlkZXMgYSB0eXBlIHNhZmUgaW50ZXJmYWNlIHdoZXJlIGl0IGNhbiBvbmx5IGJlIGNhbGxlZCB3aXRoIGEgZmllbGQgbmFtZVxyXG4gICAgICogcHJlc2VudCBpbiBOYW1lU2VydmljZU1hcHBpbmcgaW50ZXJmYWNlLlxyXG4gICAgICpcclxuICAgICAqIEZpcmViYXNlIFNES3MgcHJvdmlkaW5nIHNlcnZpY2VzIHNob3VsZCBleHRlbmQgTmFtZVNlcnZpY2VNYXBwaW5nIGludGVyZmFjZSB0byByZWdpc3RlclxyXG4gICAgICogdGhlbXNlbHZlcy5cclxuICAgICAqL1xyXG4gICAgZ2V0UHJvdmlkZXIobmFtZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3ZpZGVycy5oYXMobmFtZSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvdmlkZXJzLmdldChuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY3JlYXRlIGEgUHJvdmlkZXIgZm9yIGEgc2VydmljZSB0aGF0IGhhc24ndCByZWdpc3RlcmVkIHdpdGggRmlyZWJhc2VcclxuICAgICAgICBjb25zdCBwcm92aWRlciA9IG5ldyBQcm92aWRlcihuYW1lLCB0aGlzKTtcclxuICAgICAgICB0aGlzLnByb3ZpZGVycy5zZXQobmFtZSwgcHJvdmlkZXIpO1xyXG4gICAgICAgIHJldHVybiBwcm92aWRlcjtcclxuICAgIH1cclxuICAgIGdldFByb3ZpZGVycygpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnByb3ZpZGVycy52YWx1ZXMoKSk7XHJcbiAgICB9XHJcbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50LCBDb21wb25lbnRDb250YWluZXIsIFByb3ZpZGVyIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE3IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIEEgY29udGFpbmVyIGZvciBhbGwgb2YgdGhlIExvZ2dlciBpbnN0YW5jZXNcclxuICovXHJcbmNvbnN0IGluc3RhbmNlcyA9IFtdO1xyXG4vKipcclxuICogVGhlIEpTIFNESyBzdXBwb3J0cyA1IGxvZyBsZXZlbHMgYW5kIGFsc28gYWxsb3dzIGEgdXNlciB0aGUgYWJpbGl0eSB0b1xyXG4gKiBzaWxlbmNlIHRoZSBsb2dzIGFsdG9nZXRoZXIuXHJcbiAqXHJcbiAqIFRoZSBvcmRlciBpcyBhIGZvbGxvd3M6XHJcbiAqIERFQlVHIDwgVkVSQk9TRSA8IElORk8gPCBXQVJOIDwgRVJST1JcclxuICpcclxuICogQWxsIG9mIHRoZSBsb2cgdHlwZXMgYWJvdmUgdGhlIGN1cnJlbnQgbG9nIGxldmVsIHdpbGwgYmUgY2FwdHVyZWQgKGkuZS4gaWZcclxuICogeW91IHNldCB0aGUgbG9nIGxldmVsIHRvIGBJTkZPYCwgZXJyb3JzIHdpbGwgc3RpbGwgYmUgbG9nZ2VkLCBidXQgYERFQlVHYCBhbmRcclxuICogYFZFUkJPU0VgIGxvZ3Mgd2lsbCBub3QpXHJcbiAqL1xyXG52YXIgTG9nTGV2ZWw7XHJcbihmdW5jdGlvbiAoTG9nTGV2ZWwpIHtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiREVCVUdcIl0gPSAwXSA9IFwiREVCVUdcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiVkVSQk9TRVwiXSA9IDFdID0gXCJWRVJCT1NFXCI7XHJcbiAgICBMb2dMZXZlbFtMb2dMZXZlbFtcIklORk9cIl0gPSAyXSA9IFwiSU5GT1wiO1xyXG4gICAgTG9nTGV2ZWxbTG9nTGV2ZWxbXCJXQVJOXCJdID0gM10gPSBcIldBUk5cIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiRVJST1JcIl0gPSA0XSA9IFwiRVJST1JcIjtcclxuICAgIExvZ0xldmVsW0xvZ0xldmVsW1wiU0lMRU5UXCJdID0gNV0gPSBcIlNJTEVOVFwiO1xyXG59KShMb2dMZXZlbCB8fCAoTG9nTGV2ZWwgPSB7fSkpO1xyXG5jb25zdCBsZXZlbFN0cmluZ1RvRW51bSA9IHtcclxuICAgICdkZWJ1Zyc6IExvZ0xldmVsLkRFQlVHLFxyXG4gICAgJ3ZlcmJvc2UnOiBMb2dMZXZlbC5WRVJCT1NFLFxyXG4gICAgJ2luZm8nOiBMb2dMZXZlbC5JTkZPLFxyXG4gICAgJ3dhcm4nOiBMb2dMZXZlbC5XQVJOLFxyXG4gICAgJ2Vycm9yJzogTG9nTGV2ZWwuRVJST1IsXHJcbiAgICAnc2lsZW50JzogTG9nTGV2ZWwuU0lMRU5UXHJcbn07XHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBsb2cgbGV2ZWxcclxuICovXHJcbmNvbnN0IGRlZmF1bHRMb2dMZXZlbCA9IExvZ0xldmVsLklORk87XHJcbi8qKlxyXG4gKiBCeSBkZWZhdWx0LCBgY29uc29sZS5kZWJ1Z2AgaXMgbm90IGRpc3BsYXllZCBpbiB0aGUgZGV2ZWxvcGVyIGNvbnNvbGUgKGluXHJcbiAqIGNocm9tZSkuIFRvIGF2b2lkIGZvcmNpbmcgdXNlcnMgdG8gaGF2ZSB0byBvcHQtaW4gdG8gdGhlc2UgbG9ncyB0d2ljZVxyXG4gKiAoaS5lLiBvbmNlIGZvciBmaXJlYmFzZSwgYW5kIG9uY2UgaW4gdGhlIGNvbnNvbGUpLCB3ZSBhcmUgc2VuZGluZyBgREVCVUdgXHJcbiAqIGxvZ3MgdG8gdGhlIGBjb25zb2xlLmxvZ2AgZnVuY3Rpb24uXHJcbiAqL1xyXG5jb25zdCBDb25zb2xlTWV0aG9kID0ge1xyXG4gICAgW0xvZ0xldmVsLkRFQlVHXTogJ2xvZycsXHJcbiAgICBbTG9nTGV2ZWwuVkVSQk9TRV06ICdsb2cnLFxyXG4gICAgW0xvZ0xldmVsLklORk9dOiAnaW5mbycsXHJcbiAgICBbTG9nTGV2ZWwuV0FSTl06ICd3YXJuJyxcclxuICAgIFtMb2dMZXZlbC5FUlJPUl06ICdlcnJvcidcclxufTtcclxuLyoqXHJcbiAqIFRoZSBkZWZhdWx0IGxvZyBoYW5kbGVyIHdpbGwgZm9yd2FyZCBERUJVRywgVkVSQk9TRSwgSU5GTywgV0FSTiwgYW5kIEVSUk9SXHJcbiAqIG1lc3NhZ2VzIG9uIHRvIHRoZWlyIGNvcnJlc3BvbmRpbmcgY29uc29sZSBjb3VudGVycGFydHMgKGlmIHRoZSBsb2cgbWV0aG9kXHJcbiAqIGlzIHN1cHBvcnRlZCBieSB0aGUgY3VycmVudCBsb2cgbGV2ZWwpXHJcbiAqL1xyXG5jb25zdCBkZWZhdWx0TG9nSGFuZGxlciA9IChpbnN0YW5jZSwgbG9nVHlwZSwgLi4uYXJncykgPT4ge1xyXG4gICAgaWYgKGxvZ1R5cGUgPCBpbnN0YW5jZS5sb2dMZXZlbCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1ldGhvZCA9IENvbnNvbGVNZXRob2RbbG9nVHlwZV07XHJcbiAgICBpZiAobWV0aG9kKSB7XHJcbiAgICAgICAgY29uc29sZVttZXRob2RdKGBbJHtub3d9XSAgJHtpbnN0YW5jZS5uYW1lfTpgLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQXR0ZW1wdGVkIHRvIGxvZyBhIG1lc3NhZ2Ugd2l0aCBhbiBpbnZhbGlkIGxvZ1R5cGUgKHZhbHVlOiAke2xvZ1R5cGV9KWApO1xyXG4gICAgfVxyXG59O1xyXG5jbGFzcyBMb2dnZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBHaXZlcyB5b3UgYW4gaW5zdGFuY2Ugb2YgYSBMb2dnZXIgdG8gY2FwdHVyZSBtZXNzYWdlcyBhY2NvcmRpbmcgdG9cclxuICAgICAqIEZpcmViYXNlJ3MgbG9nZ2luZyBzY2hlbWUuXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgdGhhdCB0aGUgbG9ncyB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBUaGUgbG9nIGxldmVsIG9mIHRoZSBnaXZlbiBMb2dnZXIgaW5zdGFuY2UuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSBkZWZhdWx0TG9nTGV2ZWw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVGhlIG1haW4gKGludGVybmFsKSBsb2cgaGFuZGxlciBmb3IgdGhlIExvZ2dlciBpbnN0YW5jZS5cclxuICAgICAgICAgKiBDYW4gYmUgc2V0IHRvIGEgbmV3IGZ1bmN0aW9uIGluIGludGVybmFsIHBhY2thZ2UgY29kZSBidXQgbm90IGJ5IHVzZXIuXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlciA9IGRlZmF1bHRMb2dIYW5kbGVyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRoZSBvcHRpb25hbCwgYWRkaXRpb25hbCwgdXNlci1kZWZpbmVkIGxvZyBoYW5kbGVyIGZvciB0aGUgTG9nZ2VyIGluc3RhbmNlLlxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDYXB0dXJlIHRoZSBjdXJyZW50IGluc3RhbmNlIGZvciBsYXRlciB1c2VcclxuICAgICAgICAgKi9cclxuICAgICAgICBpbnN0YW5jZXMucHVzaCh0aGlzKTtcclxuICAgIH1cclxuICAgIGdldCBsb2dMZXZlbCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nTGV2ZWw7XHJcbiAgICB9XHJcbiAgICBzZXQgbG9nTGV2ZWwodmFsKSB7XHJcbiAgICAgICAgaWYgKCEodmFsIGluIExvZ0xldmVsKSkge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBJbnZhbGlkIHZhbHVlIFwiJHt2YWx9XCIgYXNzaWduZWQgdG8gXFxgbG9nTGV2ZWxcXGBgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSB2YWw7XHJcbiAgICB9XHJcbiAgICAvLyBXb3JrYXJvdW5kIGZvciBzZXR0ZXIvZ2V0dGVyIGhhdmluZyB0byBiZSB0aGUgc2FtZSB0eXBlLlxyXG4gICAgc2V0TG9nTGV2ZWwodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fbG9nTGV2ZWwgPSB0eXBlb2YgdmFsID09PSAnc3RyaW5nJyA/IGxldmVsU3RyaW5nVG9FbnVtW3ZhbF0gOiB2YWw7XHJcbiAgICB9XHJcbiAgICBnZXQgbG9nSGFuZGxlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9nSGFuZGxlcjtcclxuICAgIH1cclxuICAgIHNldCBsb2dIYW5kbGVyKHZhbCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdmFsICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1ZhbHVlIGFzc2lnbmVkIHRvIGBsb2dIYW5kbGVyYCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlciA9IHZhbDtcclxuICAgIH1cclxuICAgIGdldCB1c2VyTG9nSGFuZGxlcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlckxvZ0hhbmRsZXI7XHJcbiAgICB9XHJcbiAgICBzZXQgdXNlckxvZ0hhbmRsZXIodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgPSB2YWw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBmdW5jdGlvbnMgYmVsb3cgYXJlIGFsbCBiYXNlZCBvbiB0aGUgYGNvbnNvbGVgIGludGVyZmFjZVxyXG4gICAgICovXHJcbiAgICBkZWJ1ZyguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuREVCVUcsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgbG9nKC4uLmFyZ3MpIHtcclxuICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlciAmJlxyXG4gICAgICAgICAgICB0aGlzLl91c2VyTG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5WRVJCT1NFLCAuLi5hcmdzKTtcclxuICAgICAgICB0aGlzLl9sb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLlZFUkJPU0UsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG4gICAgaW5mbyguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuSU5GTywgLi4uYXJncyk7XHJcbiAgICAgICAgdGhpcy5fbG9nSGFuZGxlcih0aGlzLCBMb2dMZXZlbC5JTkZPLCAuLi5hcmdzKTtcclxuICAgIH1cclxuICAgIHdhcm4oLi4uYXJncykge1xyXG4gICAgICAgIHRoaXMuX3VzZXJMb2dIYW5kbGVyICYmIHRoaXMuX3VzZXJMb2dIYW5kbGVyKHRoaXMsIExvZ0xldmVsLldBUk4sIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuV0FSTiwgLi4uYXJncyk7XHJcbiAgICB9XHJcbiAgICBlcnJvciguLi5hcmdzKSB7XHJcbiAgICAgICAgdGhpcy5fdXNlckxvZ0hhbmRsZXIgJiYgdGhpcy5fdXNlckxvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3MpO1xyXG4gICAgICAgIHRoaXMuX2xvZ0hhbmRsZXIodGhpcywgTG9nTGV2ZWwuRVJST1IsIC4uLmFyZ3MpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIHNldExvZ0xldmVsKGxldmVsKSB7XHJcbiAgICBpbnN0YW5jZXMuZm9yRWFjaChpbnN0ID0+IHtcclxuICAgICAgICBpbnN0LnNldExvZ0xldmVsKGxldmVsKTtcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIHNldFVzZXJMb2dIYW5kbGVyKGxvZ0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIGluc3RhbmNlcykge1xyXG4gICAgICAgIGxldCBjdXN0b21Mb2dMZXZlbCA9IG51bGw7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZXZlbCkge1xyXG4gICAgICAgICAgICBjdXN0b21Mb2dMZXZlbCA9IGxldmVsU3RyaW5nVG9FbnVtW29wdGlvbnMubGV2ZWxdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobG9nQ2FsbGJhY2sgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UudXNlckxvZ0hhbmRsZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaW5zdGFuY2UudXNlckxvZ0hhbmRsZXIgPSAoaW5zdGFuY2UsIGxldmVsLCAuLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtZXNzYWdlID0gYXJnc1xyXG4gICAgICAgICAgICAgICAgICAgIC5tYXAoYXJnID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXJnID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8IHR5cGVvZiBhcmcgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJnLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKGFyZyBpbnN0YW5jZW9mIEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcmcubWVzc2FnZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXRjaCAoaWdub3JlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC5maWx0ZXIoYXJnID0+IGFyZylcclxuICAgICAgICAgICAgICAgICAgICAuam9pbignICcpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGxldmVsID49IChjdXN0b21Mb2dMZXZlbCAhPT0gbnVsbCAmJiBjdXN0b21Mb2dMZXZlbCAhPT0gdm9pZCAwID8gY3VzdG9tTG9nTGV2ZWwgOiBpbnN0YW5jZS5sb2dMZXZlbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBsb2dDYWxsYmFjayh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldmVsOiBMb2dMZXZlbFtsZXZlbF0udG9Mb3dlckNhc2UoKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJncyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogaW5zdGFuY2UubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5leHBvcnQgeyBMb2dMZXZlbCwgTG9nZ2VyLCBzZXRMb2dMZXZlbCwgc2V0VXNlckxvZ0hhbmRsZXIgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmVzbTIwMTcuanMubWFwXG4iLCJjb25zdCBpbnN0YW5jZU9mQW55ID0gKG9iamVjdCwgY29uc3RydWN0b3JzKSA9PiBjb25zdHJ1Y3RvcnMuc29tZSgoYykgPT4gb2JqZWN0IGluc3RhbmNlb2YgYyk7XG5cbmxldCBpZGJQcm94eWFibGVUeXBlcztcbmxldCBjdXJzb3JBZHZhbmNlTWV0aG9kcztcbi8vIFRoaXMgaXMgYSBmdW5jdGlvbiB0byBwcmV2ZW50IGl0IHRocm93aW5nIHVwIGluIG5vZGUgZW52aXJvbm1lbnRzLlxuZnVuY3Rpb24gZ2V0SWRiUHJveHlhYmxlVHlwZXMoKSB7XG4gICAgcmV0dXJuIChpZGJQcm94eWFibGVUeXBlcyB8fFxuICAgICAgICAoaWRiUHJveHlhYmxlVHlwZXMgPSBbXG4gICAgICAgICAgICBJREJEYXRhYmFzZSxcbiAgICAgICAgICAgIElEQk9iamVjdFN0b3JlLFxuICAgICAgICAgICAgSURCSW5kZXgsXG4gICAgICAgICAgICBJREJDdXJzb3IsXG4gICAgICAgICAgICBJREJUcmFuc2FjdGlvbixcbiAgICAgICAgXSkpO1xufVxuLy8gVGhpcyBpcyBhIGZ1bmN0aW9uIHRvIHByZXZlbnQgaXQgdGhyb3dpbmcgdXAgaW4gbm9kZSBlbnZpcm9ubWVudHMuXG5mdW5jdGlvbiBnZXRDdXJzb3JBZHZhbmNlTWV0aG9kcygpIHtcbiAgICByZXR1cm4gKGN1cnNvckFkdmFuY2VNZXRob2RzIHx8XG4gICAgICAgIChjdXJzb3JBZHZhbmNlTWV0aG9kcyA9IFtcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuYWR2YW5jZSxcbiAgICAgICAgICAgIElEQkN1cnNvci5wcm90b3R5cGUuY29udGludWUsXG4gICAgICAgICAgICBJREJDdXJzb3IucHJvdG90eXBlLmNvbnRpbnVlUHJpbWFyeUtleSxcbiAgICAgICAgXSkpO1xufVxuY29uc3QgY3Vyc29yUmVxdWVzdE1hcCA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCB0cmFuc2FjdGlvbkRvbmVNYXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgdHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHRyYW5zZm9ybUNhY2hlID0gbmV3IFdlYWtNYXAoKTtcbmNvbnN0IHJldmVyc2VUcmFuc2Zvcm1DYWNoZSA9IG5ldyBXZWFrTWFwKCk7XG5mdW5jdGlvbiBwcm9taXNpZnlSZXF1ZXN0KHJlcXVlc3QpIHtcbiAgICBjb25zdCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBjb25zdCB1bmxpc3RlbiA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlcXVlc3QucmVtb3ZlRXZlbnRMaXN0ZW5lcignc3VjY2VzcycsIHN1Y2Nlc3MpO1xuICAgICAgICAgICAgcmVxdWVzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9ICgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUod3JhcChyZXF1ZXN0LnJlc3VsdCkpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QocmVxdWVzdC5lcnJvcik7XG4gICAgICAgICAgICB1bmxpc3RlbigpO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ3N1Y2Nlc3MnLCBzdWNjZXNzKTtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGVycm9yKTtcbiAgICB9KTtcbiAgICBwcm9taXNlXG4gICAgICAgIC50aGVuKCh2YWx1ZSkgPT4ge1xuICAgICAgICAvLyBTaW5jZSBjdXJzb3JpbmcgcmV1c2VzIHRoZSBJREJSZXF1ZXN0ICgqc2lnaCopLCB3ZSBjYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsXG4gICAgICAgIC8vIChzZWUgd3JhcEZ1bmN0aW9uKS5cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCQ3Vyc29yKSB7XG4gICAgICAgICAgICBjdXJzb3JSZXF1ZXN0TWFwLnNldCh2YWx1ZSwgcmVxdWVzdCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0Y2hpbmcgdG8gYXZvaWQgXCJVbmNhdWdodCBQcm9taXNlIGV4Y2VwdGlvbnNcIlxuICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgIC8vIFRoaXMgbWFwcGluZyBleGlzdHMgaW4gcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGJ1dCBkb2Vzbid0IGRvZXNuJ3QgZXhpc3QgaW4gdHJhbnNmb3JtQ2FjaGUuIFRoaXNcbiAgICAvLyBpcyBiZWNhdXNlIHdlIGNyZWF0ZSBtYW55IHByb21pc2VzIGZyb20gYSBzaW5nbGUgSURCUmVxdWVzdC5cbiAgICByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuc2V0KHByb21pc2UsIHJlcXVlc3QpO1xuICAgIHJldHVybiBwcm9taXNlO1xufVxuZnVuY3Rpb24gY2FjaGVEb25lUHJvbWlzZUZvclRyYW5zYWN0aW9uKHR4KSB7XG4gICAgLy8gRWFybHkgYmFpbCBpZiB3ZSd2ZSBhbHJlYWR5IGNyZWF0ZWQgYSBkb25lIHByb21pc2UgZm9yIHRoaXMgdHJhbnNhY3Rpb24uXG4gICAgaWYgKHRyYW5zYWN0aW9uRG9uZU1hcC5oYXModHgpKVxuICAgICAgICByZXR1cm47XG4gICAgY29uc3QgZG9uZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgdW5saXN0ZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICB0eC5yZW1vdmVFdmVudExpc3RlbmVyKCdjb21wbGV0ZScsIGNvbXBsZXRlKTtcbiAgICAgICAgICAgIHR4LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICAgICAgdHgucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBlcnJvcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgZXJyb3IgPSAoKSA9PiB7XG4gICAgICAgICAgICByZWplY3QodHguZXJyb3IgfHwgbmV3IERPTUV4Y2VwdGlvbignQWJvcnRFcnJvcicsICdBYm9ydEVycm9yJykpO1xuICAgICAgICAgICAgdW5saXN0ZW4oKTtcbiAgICAgICAgfTtcbiAgICAgICAgdHguYWRkRXZlbnRMaXN0ZW5lcignY29tcGxldGUnLCBjb21wbGV0ZSk7XG4gICAgICAgIHR4LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgZXJyb3IpO1xuICAgICAgICB0eC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGVycm9yKTtcbiAgICB9KTtcbiAgICAvLyBDYWNoZSBpdCBmb3IgbGF0ZXIgcmV0cmlldmFsLlxuICAgIHRyYW5zYWN0aW9uRG9uZU1hcC5zZXQodHgsIGRvbmUpO1xufVxubGV0IGlkYlByb3h5VHJhcHMgPSB7XG4gICAgZ2V0KHRhcmdldCwgcHJvcCwgcmVjZWl2ZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uKSB7XG4gICAgICAgICAgICAvLyBTcGVjaWFsIGhhbmRsaW5nIGZvciB0cmFuc2FjdGlvbi5kb25lLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdkb25lJylcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNhY3Rpb25Eb25lTWFwLmdldCh0YXJnZXQpO1xuICAgICAgICAgICAgLy8gUG9seWZpbGwgZm9yIG9iamVjdFN0b3JlTmFtZXMgYmVjYXVzZSBvZiBFZGdlLlxuICAgICAgICAgICAgaWYgKHByb3AgPT09ICdvYmplY3RTdG9yZU5hbWVzJykge1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXQub2JqZWN0U3RvcmVOYW1lcyB8fCB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuZ2V0KHRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBNYWtlIHR4LnN0b3JlIHJldHVybiB0aGUgb25seSBzdG9yZSBpbiB0aGUgdHJhbnNhY3Rpb24sIG9yIHVuZGVmaW5lZCBpZiB0aGVyZSBhcmUgbWFueS5cbiAgICAgICAgICAgIGlmIChwcm9wID09PSAnc3RvcmUnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY2VpdmVyLm9iamVjdFN0b3JlTmFtZXNbMV1cbiAgICAgICAgICAgICAgICAgICAgPyB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICAgICAgOiByZWNlaXZlci5vYmplY3RTdG9yZShyZWNlaXZlci5vYmplY3RTdG9yZU5hbWVzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBFbHNlIHRyYW5zZm9ybSB3aGF0ZXZlciB3ZSBnZXQgYmFjay5cbiAgICAgICAgcmV0dXJuIHdyYXAodGFyZ2V0W3Byb3BdKTtcbiAgICB9LFxuICAgIHNldCh0YXJnZXQsIHByb3AsIHZhbHVlKSB7XG4gICAgICAgIHRhcmdldFtwcm9wXSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICAgIGhhcyh0YXJnZXQsIHByb3ApIHtcbiAgICAgICAgaWYgKHRhcmdldCBpbnN0YW5jZW9mIElEQlRyYW5zYWN0aW9uICYmXG4gICAgICAgICAgICAocHJvcCA9PT0gJ2RvbmUnIHx8IHByb3AgPT09ICdzdG9yZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcHJvcCBpbiB0YXJnZXQ7XG4gICAgfSxcbn07XG5mdW5jdGlvbiByZXBsYWNlVHJhcHMoY2FsbGJhY2spIHtcbiAgICBpZGJQcm94eVRyYXBzID0gY2FsbGJhY2soaWRiUHJveHlUcmFwcyk7XG59XG5mdW5jdGlvbiB3cmFwRnVuY3Rpb24oZnVuYykge1xuICAgIC8vIER1ZSB0byBleHBlY3RlZCBvYmplY3QgZXF1YWxpdHkgKHdoaWNoIGlzIGVuZm9yY2VkIGJ5IHRoZSBjYWNoaW5nIGluIGB3cmFwYCksIHdlXG4gICAgLy8gb25seSBjcmVhdGUgb25lIG5ldyBmdW5jIHBlciBmdW5jLlxuICAgIC8vIEVkZ2UgZG9lc24ndCBzdXBwb3J0IG9iamVjdFN0b3JlTmFtZXMgKGJvb28pLCBzbyB3ZSBwb2x5ZmlsbCBpdCBoZXJlLlxuICAgIGlmIChmdW5jID09PSBJREJEYXRhYmFzZS5wcm90b3R5cGUudHJhbnNhY3Rpb24gJiZcbiAgICAgICAgISgnb2JqZWN0U3RvcmVOYW1lcycgaW4gSURCVHJhbnNhY3Rpb24ucHJvdG90eXBlKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHN0b3JlTmFtZXMsIC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZnVuYy5jYWxsKHVud3JhcCh0aGlzKSwgc3RvcmVOYW1lcywgLi4uYXJncyk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvblN0b3JlTmFtZXNNYXAuc2V0KHR4LCBzdG9yZU5hbWVzLnNvcnQgPyBzdG9yZU5hbWVzLnNvcnQoKSA6IFtzdG9yZU5hbWVzXSk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcCh0eCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8vIEN1cnNvciBtZXRob2RzIGFyZSBzcGVjaWFsLCBhcyB0aGUgYmVoYXZpb3VyIGlzIGEgbGl0dGxlIG1vcmUgZGlmZmVyZW50IHRvIHN0YW5kYXJkIElEQi4gSW5cbiAgICAvLyBJREIsIHlvdSBhZHZhbmNlIHRoZSBjdXJzb3IgYW5kIHdhaXQgZm9yIGEgbmV3ICdzdWNjZXNzJyBvbiB0aGUgSURCUmVxdWVzdCB0aGF0IGdhdmUgeW91IHRoZVxuICAgIC8vIGN1cnNvci4gSXQncyBraW5kYSBsaWtlIGEgcHJvbWlzZSB0aGF0IGNhbiByZXNvbHZlIHdpdGggbWFueSB2YWx1ZXMuIFRoYXQgZG9lc24ndCBtYWtlIHNlbnNlXG4gICAgLy8gd2l0aCByZWFsIHByb21pc2VzLCBzbyBlYWNoIGFkdmFuY2UgbWV0aG9kcyByZXR1cm5zIGEgbmV3IHByb21pc2UgZm9yIHRoZSBjdXJzb3Igb2JqZWN0LCBvclxuICAgIC8vIHVuZGVmaW5lZCBpZiB0aGUgZW5kIG9mIHRoZSBjdXJzb3IgaGFzIGJlZW4gcmVhY2hlZC5cbiAgICBpZiAoZ2V0Q3Vyc29yQWR2YW5jZU1ldGhvZHMoKS5pbmNsdWRlcyhmdW5jKSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgIC8vIENhbGxpbmcgdGhlIG9yaWdpbmFsIGZ1bmN0aW9uIHdpdGggdGhlIHByb3h5IGFzICd0aGlzJyBjYXVzZXMgSUxMRUdBTCBJTlZPQ0FUSU9OLCBzbyB3ZSB1c2VcbiAgICAgICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgICAgICBmdW5jLmFwcGx5KHVud3JhcCh0aGlzKSwgYXJncyk7XG4gICAgICAgICAgICByZXR1cm4gd3JhcChjdXJzb3JSZXF1ZXN0TWFwLmdldCh0aGlzKSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAvLyBDYWxsaW5nIHRoZSBvcmlnaW5hbCBmdW5jdGlvbiB3aXRoIHRoZSBwcm94eSBhcyAndGhpcycgY2F1c2VzIElMTEVHQUwgSU5WT0NBVElPTiwgc28gd2UgdXNlXG4gICAgICAgIC8vIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgICAgIHJldHVybiB3cmFwKGZ1bmMuYXBwbHkodW53cmFwKHRoaXMpLCBhcmdzKSk7XG4gICAgfTtcbn1cbmZ1bmN0aW9uIHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKVxuICAgICAgICByZXR1cm4gd3JhcEZ1bmN0aW9uKHZhbHVlKTtcbiAgICAvLyBUaGlzIGRvZXNuJ3QgcmV0dXJuLCBpdCBqdXN0IGNyZWF0ZXMgYSAnZG9uZScgcHJvbWlzZSBmb3IgdGhlIHRyYW5zYWN0aW9uLFxuICAgIC8vIHdoaWNoIGlzIGxhdGVyIHJldHVybmVkIGZvciB0cmFuc2FjdGlvbi5kb25lIChzZWUgaWRiT2JqZWN0SGFuZGxlcikuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCVHJhbnNhY3Rpb24pXG4gICAgICAgIGNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbih2YWx1ZSk7XG4gICAgaWYgKGluc3RhbmNlT2ZBbnkodmFsdWUsIGdldElkYlByb3h5YWJsZVR5cGVzKCkpKVxuICAgICAgICByZXR1cm4gbmV3IFByb3h5KHZhbHVlLCBpZGJQcm94eVRyYXBzKTtcbiAgICAvLyBSZXR1cm4gdGhlIHNhbWUgdmFsdWUgYmFjayBpZiB3ZSdyZSBub3QgZ29pbmcgdG8gdHJhbnNmb3JtIGl0LlxuICAgIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIHdyYXAodmFsdWUpIHtcbiAgICAvLyBXZSBzb21ldGltZXMgZ2VuZXJhdGUgbXVsdGlwbGUgcHJvbWlzZXMgZnJvbSBhIHNpbmdsZSBJREJSZXF1ZXN0IChlZyB3aGVuIGN1cnNvcmluZyksIGJlY2F1c2VcbiAgICAvLyBJREIgaXMgd2VpcmQgYW5kIGEgc2luZ2xlIElEQlJlcXVlc3QgY2FuIHlpZWxkIG1hbnkgcmVzcG9uc2VzLCBzbyB0aGVzZSBjYW4ndCBiZSBjYWNoZWQuXG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgSURCUmVxdWVzdClcbiAgICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3QodmFsdWUpO1xuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgdHJhbnNmb3JtZWQgdGhpcyB2YWx1ZSBiZWZvcmUsIHJldXNlIHRoZSB0cmFuc2Zvcm1lZCB2YWx1ZS5cbiAgICAvLyBUaGlzIGlzIGZhc3RlciwgYnV0IGl0IGFsc28gcHJvdmlkZXMgb2JqZWN0IGVxdWFsaXR5LlxuICAgIGlmICh0cmFuc2Zvcm1DYWNoZS5oYXModmFsdWUpKVxuICAgICAgICByZXR1cm4gdHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHRyYW5zZm9ybUNhY2hhYmxlVmFsdWUodmFsdWUpO1xuICAgIC8vIE5vdCBhbGwgdHlwZXMgYXJlIHRyYW5zZm9ybWVkLlxuICAgIC8vIFRoZXNlIG1heSBiZSBwcmltaXRpdmUgdHlwZXMsIHNvIHRoZXkgY2FuJ3QgYmUgV2Vha01hcCBrZXlzLlxuICAgIGlmIChuZXdWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgdHJhbnNmb3JtQ2FjaGUuc2V0KHZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIHJldmVyc2VUcmFuc2Zvcm1DYWNoZS5zZXQobmV3VmFsdWUsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld1ZhbHVlO1xufVxuY29uc3QgdW53cmFwID0gKHZhbHVlKSA9PiByZXZlcnNlVHJhbnNmb3JtQ2FjaGUuZ2V0KHZhbHVlKTtcblxuZXhwb3J0IHsgcmV2ZXJzZVRyYW5zZm9ybUNhY2hlIGFzIGEsIGluc3RhbmNlT2ZBbnkgYXMgaSwgcmVwbGFjZVRyYXBzIGFzIHIsIHVud3JhcCBhcyB1LCB3cmFwIGFzIHcgfTtcbiIsImltcG9ydCB7IHcgYXMgd3JhcCwgciBhcyByZXBsYWNlVHJhcHMgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcbmV4cG9ydCB7IHUgYXMgdW53cmFwLCB3IGFzIHdyYXAgfSBmcm9tICcuL3dyYXAtaWRiLXZhbHVlLmpzJztcblxuLyoqXG4gKiBPcGVuIGEgZGF0YWJhc2UuXG4gKlxuICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgZGF0YWJhc2UuXG4gKiBAcGFyYW0gdmVyc2lvbiBTY2hlbWEgdmVyc2lvbi5cbiAqIEBwYXJhbSBjYWxsYmFja3MgQWRkaXRpb25hbCBjYWxsYmFja3MuXG4gKi9cbmZ1bmN0aW9uIG9wZW5EQihuYW1lLCB2ZXJzaW9uLCB7IGJsb2NrZWQsIHVwZ3JhZGUsIGJsb2NraW5nLCB0ZXJtaW5hdGVkIH0gPSB7fSkge1xuICAgIGNvbnN0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihuYW1lLCB2ZXJzaW9uKTtcbiAgICBjb25zdCBvcGVuUHJvbWlzZSA9IHdyYXAocmVxdWVzdCk7XG4gICAgaWYgKHVwZ3JhZGUpIHtcbiAgICAgICAgcmVxdWVzdC5hZGRFdmVudExpc3RlbmVyKCd1cGdyYWRlbmVlZGVkJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICB1cGdyYWRlKHdyYXAocmVxdWVzdC5yZXN1bHQpLCBldmVudC5vbGRWZXJzaW9uLCBldmVudC5uZXdWZXJzaW9uLCB3cmFwKHJlcXVlc3QudHJhbnNhY3Rpb24pLCBldmVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQubmV3VmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgb3BlblByb21pc2VcbiAgICAgICAgLnRoZW4oKGRiKSA9PiB7XG4gICAgICAgIGlmICh0ZXJtaW5hdGVkKVxuICAgICAgICAgICAgZGIuYWRkRXZlbnRMaXN0ZW5lcignY2xvc2UnLCAoKSA9PiB0ZXJtaW5hdGVkKCkpO1xuICAgICAgICBpZiAoYmxvY2tpbmcpIHtcbiAgICAgICAgICAgIGRiLmFkZEV2ZW50TGlzdGVuZXIoJ3ZlcnNpb25jaGFuZ2UnLCAoZXZlbnQpID0+IGJsb2NraW5nKGV2ZW50Lm9sZFZlcnNpb24sIGV2ZW50Lm5ld1ZlcnNpb24sIGV2ZW50KSk7XG4gICAgICAgIH1cbiAgICB9KVxuICAgICAgICAuY2F0Y2goKCkgPT4geyB9KTtcbiAgICByZXR1cm4gb3BlblByb21pc2U7XG59XG4vKipcbiAqIERlbGV0ZSBhIGRhdGFiYXNlLlxuICpcbiAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGRhdGFiYXNlLlxuICovXG5mdW5jdGlvbiBkZWxldGVEQihuYW1lLCB7IGJsb2NrZWQgfSA9IHt9KSB7XG4gICAgY29uc3QgcmVxdWVzdCA9IGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZShuYW1lKTtcbiAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICByZXF1ZXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2Jsb2NrZWQnLCAoZXZlbnQpID0+IGJsb2NrZWQoXG4gICAgICAgIC8vIENhc3RpbmcgZHVlIHRvIGh0dHBzOi8vZ2l0aHViLmNvbS9taWNyb3NvZnQvVHlwZVNjcmlwdC1ET00tbGliLWdlbmVyYXRvci9wdWxsLzE0MDVcbiAgICAgICAgZXZlbnQub2xkVmVyc2lvbiwgZXZlbnQpKTtcbiAgICB9XG4gICAgcmV0dXJuIHdyYXAocmVxdWVzdCkudGhlbigoKSA9PiB1bmRlZmluZWQpO1xufVxuXG5jb25zdCByZWFkTWV0aG9kcyA9IFsnZ2V0JywgJ2dldEtleScsICdnZXRBbGwnLCAnZ2V0QWxsS2V5cycsICdjb3VudCddO1xuY29uc3Qgd3JpdGVNZXRob2RzID0gWydwdXQnLCAnYWRkJywgJ2RlbGV0ZScsICdjbGVhciddO1xuY29uc3QgY2FjaGVkTWV0aG9kcyA9IG5ldyBNYXAoKTtcbmZ1bmN0aW9uIGdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAoISh0YXJnZXQgaW5zdGFuY2VvZiBJREJEYXRhYmFzZSAmJlxuICAgICAgICAhKHByb3AgaW4gdGFyZ2V0KSAmJlxuICAgICAgICB0eXBlb2YgcHJvcCA9PT0gJ3N0cmluZycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKGNhY2hlZE1ldGhvZHMuZ2V0KHByb3ApKVxuICAgICAgICByZXR1cm4gY2FjaGVkTWV0aG9kcy5nZXQocHJvcCk7XG4gICAgY29uc3QgdGFyZ2V0RnVuY05hbWUgPSBwcm9wLnJlcGxhY2UoL0Zyb21JbmRleCQvLCAnJyk7XG4gICAgY29uc3QgdXNlSW5kZXggPSBwcm9wICE9PSB0YXJnZXRGdW5jTmFtZTtcbiAgICBjb25zdCBpc1dyaXRlID0gd3JpdGVNZXRob2RzLmluY2x1ZGVzKHRhcmdldEZ1bmNOYW1lKTtcbiAgICBpZiAoXG4gICAgLy8gQmFpbCBpZiB0aGUgdGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgb24gdGhlIHRhcmdldC4gRWcsIGdldEFsbCBpc24ndCBpbiBFZGdlLlxuICAgICEodGFyZ2V0RnVuY05hbWUgaW4gKHVzZUluZGV4ID8gSURCSW5kZXggOiBJREJPYmplY3RTdG9yZSkucHJvdG90eXBlKSB8fFxuICAgICAgICAhKGlzV3JpdGUgfHwgcmVhZE1ldGhvZHMuaW5jbHVkZXModGFyZ2V0RnVuY05hbWUpKSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1ldGhvZCA9IGFzeW5jIGZ1bmN0aW9uIChzdG9yZU5hbWUsIC4uLmFyZ3MpIHtcbiAgICAgICAgLy8gaXNXcml0ZSA/ICdyZWFkd3JpdGUnIDogdW5kZWZpbmVkIGd6aXBwcyBiZXR0ZXIsIGJ1dCBmYWlscyBpbiBFZGdlIDooXG4gICAgICAgIGNvbnN0IHR4ID0gdGhpcy50cmFuc2FjdGlvbihzdG9yZU5hbWUsIGlzV3JpdGUgPyAncmVhZHdyaXRlJyA6ICdyZWFkb25seScpO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gdHguc3RvcmU7XG4gICAgICAgIGlmICh1c2VJbmRleClcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5pbmRleChhcmdzLnNoaWZ0KCkpO1xuICAgICAgICAvLyBNdXN0IHJlamVjdCBpZiBvcCByZWplY3RzLlxuICAgICAgICAvLyBJZiBpdCdzIGEgd3JpdGUgb3BlcmF0aW9uLCBtdXN0IHJlamVjdCBpZiB0eC5kb25lIHJlamVjdHMuXG4gICAgICAgIC8vIE11c3QgcmVqZWN0IHdpdGggb3AgcmVqZWN0aW9uIGZpcnN0LlxuICAgICAgICAvLyBNdXN0IHJlc29sdmUgd2l0aCBvcCB2YWx1ZS5cbiAgICAgICAgLy8gTXVzdCBoYW5kbGUgYm90aCBwcm9taXNlcyAobm8gdW5oYW5kbGVkIHJlamVjdGlvbnMpXG4gICAgICAgIHJldHVybiAoYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICAgICAgdGFyZ2V0W3RhcmdldEZ1bmNOYW1lXSguLi5hcmdzKSxcbiAgICAgICAgICAgIGlzV3JpdGUgJiYgdHguZG9uZSxcbiAgICAgICAgXSkpWzBdO1xuICAgIH07XG4gICAgY2FjaGVkTWV0aG9kcy5zZXQocHJvcCwgbWV0aG9kKTtcbiAgICByZXR1cm4gbWV0aG9kO1xufVxucmVwbGFjZVRyYXBzKChvbGRUcmFwcykgPT4gKHtcbiAgICAuLi5vbGRUcmFwcyxcbiAgICBnZXQ6ICh0YXJnZXQsIHByb3AsIHJlY2VpdmVyKSA9PiBnZXRNZXRob2QodGFyZ2V0LCBwcm9wKSB8fCBvbGRUcmFwcy5nZXQodGFyZ2V0LCBwcm9wLCByZWNlaXZlciksXG4gICAgaGFzOiAodGFyZ2V0LCBwcm9wKSA9PiAhIWdldE1ldGhvZCh0YXJnZXQsIHByb3ApIHx8IG9sZFRyYXBzLmhhcyh0YXJnZXQsIHByb3ApLFxufSkpO1xuXG5leHBvcnQgeyBkZWxldGVEQiwgb3BlbkRCIH07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIENvbXBvbmVudENvbnRhaW5lciB9IGZyb20gJ0BmaXJlYmFzZS9jb21wb25lbnQnO1xuaW1wb3J0IHsgTG9nZ2VyLCBzZXRVc2VyTG9nSGFuZGxlciwgc2V0TG9nTGV2ZWwgYXMgc2V0TG9nTGV2ZWwkMSB9IGZyb20gJ0BmaXJlYmFzZS9sb2dnZXInO1xuaW1wb3J0IHsgRXJyb3JGYWN0b3J5LCBnZXREZWZhdWx0QXBwQ29uZmlnLCBkZWVwRXF1YWwsIEZpcmViYXNlRXJyb3IsIGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nLCBpc0luZGV4ZWREQkF2YWlsYWJsZSwgdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmV4cG9ydCB7IEZpcmViYXNlRXJyb3IgfSBmcm9tICdAZmlyZWJhc2UvdXRpbCc7XG5pbXBvcnQgeyBvcGVuREIgfSBmcm9tICdpZGInO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jbGFzcyBQbGF0Zm9ybUxvZ2dlclNlcnZpY2VJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcikge1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgfVxyXG4gICAgLy8gSW4gaW5pdGlhbCBpbXBsZW1lbnRhdGlvbiwgdGhpcyB3aWxsIGJlIGNhbGxlZCBieSBpbnN0YWxsYXRpb25zIG9uXHJcbiAgICAvLyBhdXRoIHRva2VuIHJlZnJlc2gsIGFuZCBpbnN0YWxsYXRpb25zIHdpbGwgc2VuZCB0aGlzIHN0cmluZy5cclxuICAgIGdldFBsYXRmb3JtSW5mb1N0cmluZygpIHtcclxuICAgICAgICBjb25zdCBwcm92aWRlcnMgPSB0aGlzLmNvbnRhaW5lci5nZXRQcm92aWRlcnMoKTtcclxuICAgICAgICAvLyBMb29wIHRocm91Z2ggcHJvdmlkZXJzIGFuZCBnZXQgbGlicmFyeS92ZXJzaW9uIHBhaXJzIGZyb20gYW55IHRoYXQgYXJlXHJcbiAgICAgICAgLy8gdmVyc2lvbiBjb21wb25lbnRzLlxyXG4gICAgICAgIHJldHVybiBwcm92aWRlcnNcclxuICAgICAgICAgICAgLm1hcChwcm92aWRlciA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc1ZlcnNpb25TZXJ2aWNlUHJvdmlkZXIocHJvdmlkZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzZXJ2aWNlID0gcHJvdmlkZXIuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYCR7c2VydmljZS5saWJyYXJ5fS8ke3NlcnZpY2UudmVyc2lvbn1gO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAuZmlsdGVyKGxvZ1N0cmluZyA9PiBsb2dTdHJpbmcpXHJcbiAgICAgICAgICAgIC5qb2luKCcgJyk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBwcm92aWRlciBjaGVjayBpZiB0aGlzIHByb3ZpZGVyIHByb3ZpZGVzIGEgVmVyc2lvblNlcnZpY2VcclxuICpcclxuICogTk9URTogVXNpbmcgUHJvdmlkZXI8J2FwcC12ZXJzaW9uJz4gaXMgYSBoYWNrIHRvIGluZGljYXRlIHRoYXQgdGhlIHByb3ZpZGVyXHJcbiAqIHByb3ZpZGVzIFZlcnNpb25TZXJ2aWNlLiBUaGUgcHJvdmlkZXIgaXMgbm90IG5lY2Vzc2FyaWx5IGEgJ2FwcC12ZXJzaW9uJ1xyXG4gKiBwcm92aWRlci5cclxuICovXHJcbmZ1bmN0aW9uIGlzVmVyc2lvblNlcnZpY2VQcm92aWRlcihwcm92aWRlcikge1xyXG4gICAgY29uc3QgY29tcG9uZW50ID0gcHJvdmlkZXIuZ2V0Q29tcG9uZW50KCk7XHJcbiAgICByZXR1cm4gKGNvbXBvbmVudCA9PT0gbnVsbCB8fCBjb21wb25lbnQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbXBvbmVudC50eXBlKSA9PT0gXCJWRVJTSU9OXCIgLyogQ29tcG9uZW50VHlwZS5WRVJTSU9OICovO1xyXG59XG5cbmNvbnN0IG5hbWUkbyA9IFwiQGZpcmViYXNlL2FwcFwiO1xuY29uc3QgdmVyc2lvbiQxID0gXCIwLjkuMjdcIjtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgbG9nZ2VyID0gbmV3IExvZ2dlcignQGZpcmViYXNlL2FwcCcpO1xuXG5jb25zdCBuYW1lJG4gPSBcIkBmaXJlYmFzZS9hcHAtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkbSA9IFwiQGZpcmViYXNlL2FuYWx5dGljcy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRsID0gXCJAZmlyZWJhc2UvYW5hbHl0aWNzXCI7XG5cbmNvbnN0IG5hbWUkayA9IFwiQGZpcmViYXNlL2FwcC1jaGVjay1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRqID0gXCJAZmlyZWJhc2UvYXBwLWNoZWNrXCI7XG5cbmNvbnN0IG5hbWUkaSA9IFwiQGZpcmViYXNlL2F1dGhcIjtcblxuY29uc3QgbmFtZSRoID0gXCJAZmlyZWJhc2UvYXV0aC1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRnID0gXCJAZmlyZWJhc2UvZGF0YWJhc2VcIjtcblxuY29uc3QgbmFtZSRmID0gXCJAZmlyZWJhc2UvZGF0YWJhc2UtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkZSA9IFwiQGZpcmViYXNlL2Z1bmN0aW9uc1wiO1xuXG5jb25zdCBuYW1lJGQgPSBcIkBmaXJlYmFzZS9mdW5jdGlvbnMtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkYyA9IFwiQGZpcmViYXNlL2luc3RhbGxhdGlvbnNcIjtcblxuY29uc3QgbmFtZSRiID0gXCJAZmlyZWJhc2UvaW5zdGFsbGF0aW9ucy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSRhID0gXCJAZmlyZWJhc2UvbWVzc2FnaW5nXCI7XG5cbmNvbnN0IG5hbWUkOSA9IFwiQGZpcmViYXNlL21lc3NhZ2luZy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQ4ID0gXCJAZmlyZWJhc2UvcGVyZm9ybWFuY2VcIjtcblxuY29uc3QgbmFtZSQ3ID0gXCJAZmlyZWJhc2UvcGVyZm9ybWFuY2UtY29tcGF0XCI7XG5cbmNvbnN0IG5hbWUkNiA9IFwiQGZpcmViYXNlL3JlbW90ZS1jb25maWdcIjtcblxuY29uc3QgbmFtZSQ1ID0gXCJAZmlyZWJhc2UvcmVtb3RlLWNvbmZpZy1jb21wYXRcIjtcblxuY29uc3QgbmFtZSQ0ID0gXCJAZmlyZWJhc2Uvc3RvcmFnZVwiO1xuXG5jb25zdCBuYW1lJDMgPSBcIkBmaXJlYmFzZS9zdG9yYWdlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lJDIgPSBcIkBmaXJlYmFzZS9maXJlc3RvcmVcIjtcblxuY29uc3QgbmFtZSQxID0gXCJAZmlyZWJhc2UvZmlyZXN0b3JlLWNvbXBhdFwiO1xuXG5jb25zdCBuYW1lID0gXCJmaXJlYmFzZVwiO1xuY29uc3QgdmVyc2lvbiA9IFwiMTAuOC4wXCI7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBUaGUgZGVmYXVsdCBhcHAgbmFtZVxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmNvbnN0IERFRkFVTFRfRU5UUllfTkFNRSA9ICdbREVGQVVMVF0nO1xyXG5jb25zdCBQTEFURk9STV9MT0dfU1RSSU5HID0ge1xyXG4gICAgW25hbWUkb106ICdmaXJlLWNvcmUnLFxyXG4gICAgW25hbWUkbl06ICdmaXJlLWNvcmUtY29tcGF0JyxcclxuICAgIFtuYW1lJGxdOiAnZmlyZS1hbmFseXRpY3MnLFxyXG4gICAgW25hbWUkbV06ICdmaXJlLWFuYWx5dGljcy1jb21wYXQnLFxyXG4gICAgW25hbWUkal06ICdmaXJlLWFwcC1jaGVjaycsXHJcbiAgICBbbmFtZSRrXTogJ2ZpcmUtYXBwLWNoZWNrLWNvbXBhdCcsXHJcbiAgICBbbmFtZSRpXTogJ2ZpcmUtYXV0aCcsXHJcbiAgICBbbmFtZSRoXTogJ2ZpcmUtYXV0aC1jb21wYXQnLFxyXG4gICAgW25hbWUkZ106ICdmaXJlLXJ0ZGInLFxyXG4gICAgW25hbWUkZl06ICdmaXJlLXJ0ZGItY29tcGF0JyxcclxuICAgIFtuYW1lJGVdOiAnZmlyZS1mbicsXHJcbiAgICBbbmFtZSRkXTogJ2ZpcmUtZm4tY29tcGF0JyxcclxuICAgIFtuYW1lJGNdOiAnZmlyZS1paWQnLFxyXG4gICAgW25hbWUkYl06ICdmaXJlLWlpZC1jb21wYXQnLFxyXG4gICAgW25hbWUkYV06ICdmaXJlLWZjbScsXHJcbiAgICBbbmFtZSQ5XTogJ2ZpcmUtZmNtLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQ4XTogJ2ZpcmUtcGVyZicsXHJcbiAgICBbbmFtZSQ3XTogJ2ZpcmUtcGVyZi1jb21wYXQnLFxyXG4gICAgW25hbWUkNl06ICdmaXJlLXJjJyxcclxuICAgIFtuYW1lJDVdOiAnZmlyZS1yYy1jb21wYXQnLFxyXG4gICAgW25hbWUkNF06ICdmaXJlLWdjcycsXHJcbiAgICBbbmFtZSQzXTogJ2ZpcmUtZ2NzLWNvbXBhdCcsXHJcbiAgICBbbmFtZSQyXTogJ2ZpcmUtZnN0JyxcclxuICAgIFtuYW1lJDFdOiAnZmlyZS1mc3QtY29tcGF0JyxcclxuICAgICdmaXJlLWpzJzogJ2ZpcmUtanMnLFxyXG4gICAgW25hbWVdOiAnZmlyZS1qcy1hbGwnXHJcbn07XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbmNvbnN0IF9hcHBzID0gbmV3IE1hcCgpO1xyXG4vKipcclxuICogUmVnaXN0ZXJlZCBjb21wb25lbnRzLlxyXG4gKlxyXG4gKiBAaW50ZXJuYWxcclxuICovXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbmNvbnN0IF9jb21wb25lbnRzID0gbmV3IE1hcCgpO1xyXG4vKipcclxuICogQHBhcmFtIGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgYmVpbmcgYWRkZWQgdG8gdGhpcyBhcHAncyBjb250YWluZXJcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfYWRkQ29tcG9uZW50KGFwcCwgY29tcG9uZW50KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGFwcC5jb250YWluZXIuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxvZ2dlci5kZWJ1ZyhgQ29tcG9uZW50ICR7Y29tcG9uZW50Lm5hbWV9IGZhaWxlZCB0byByZWdpc3RlciB3aXRoIEZpcmViYXNlQXBwICR7YXBwLm5hbWV9YCwgZSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2FkZE9yT3ZlcndyaXRlQ29tcG9uZW50KGFwcCwgY29tcG9uZW50KSB7XHJcbiAgICBhcHAuY29udGFpbmVyLmFkZE9yT3ZlcndyaXRlQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRvIHJlZ2lzdGVyXHJcbiAqIEByZXR1cm5zIHdoZXRoZXIgb3Igbm90IHRoZSBjb21wb25lbnQgaXMgcmVnaXN0ZXJlZCBzdWNjZXNzZnVsbHlcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfcmVnaXN0ZXJDb21wb25lbnQoY29tcG9uZW50KSB7XHJcbiAgICBjb25zdCBjb21wb25lbnROYW1lID0gY29tcG9uZW50Lm5hbWU7XHJcbiAgICBpZiAoX2NvbXBvbmVudHMuaGFzKGNvbXBvbmVudE5hbWUpKSB7XHJcbiAgICAgICAgbG9nZ2VyLmRlYnVnKGBUaGVyZSB3ZXJlIG11bHRpcGxlIGF0dGVtcHRzIHRvIHJlZ2lzdGVyIGNvbXBvbmVudCAke2NvbXBvbmVudE5hbWV9LmApO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIF9jb21wb25lbnRzLnNldChjb21wb25lbnROYW1lLCBjb21wb25lbnQpO1xyXG4gICAgLy8gYWRkIHRoZSBjb21wb25lbnQgdG8gZXhpc3RpbmcgYXBwIGluc3RhbmNlc1xyXG4gICAgZm9yIChjb25zdCBhcHAgb2YgX2FwcHMudmFsdWVzKCkpIHtcclxuICAgICAgICBfYWRkQ29tcG9uZW50KGFwcCwgY29tcG9uZW50KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcbi8qKlxyXG4gKlxyXG4gKiBAcGFyYW0gYXBwIC0gRmlyZWJhc2VBcHAgaW5zdGFuY2VcclxuICogQHBhcmFtIG5hbWUgLSBzZXJ2aWNlIG5hbWVcclxuICpcclxuICogQHJldHVybnMgdGhlIHByb3ZpZGVyIGZvciB0aGUgc2VydmljZSB3aXRoIHRoZSBtYXRjaGluZyBuYW1lXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX2dldFByb3ZpZGVyKGFwcCwgbmFtZSkge1xyXG4gICAgY29uc3QgaGVhcnRiZWF0Q29udHJvbGxlciA9IGFwcC5jb250YWluZXJcclxuICAgICAgICAuZ2V0UHJvdmlkZXIoJ2hlYXJ0YmVhdCcpXHJcbiAgICAgICAgLmdldEltbWVkaWF0ZSh7IG9wdGlvbmFsOiB0cnVlIH0pO1xyXG4gICAgaWYgKGhlYXJ0YmVhdENvbnRyb2xsZXIpIHtcclxuICAgICAgICB2b2lkIGhlYXJ0YmVhdENvbnRyb2xsZXIudHJpZ2dlckhlYXJ0YmVhdCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFwcC5jb250YWluZXIuZ2V0UHJvdmlkZXIobmFtZSk7XHJcbn1cclxuLyoqXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBGaXJlYmFzZUFwcCBpbnN0YW5jZVxyXG4gKiBAcGFyYW0gbmFtZSAtIHNlcnZpY2UgbmFtZVxyXG4gKiBAcGFyYW0gaW5zdGFuY2VJZGVudGlmaWVyIC0gc2VydmljZSBpbnN0YW5jZSBpZGVudGlmaWVyIGluIGNhc2UgdGhlIHNlcnZpY2Ugc3VwcG9ydHMgbXVsdGlwbGUgaW5zdGFuY2VzXHJcbiAqXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gX3JlbW92ZVNlcnZpY2VJbnN0YW5jZShhcHAsIG5hbWUsIGluc3RhbmNlSWRlbnRpZmllciA9IERFRkFVTFRfRU5UUllfTkFNRSkge1xyXG4gICAgX2dldFByb3ZpZGVyKGFwcCwgbmFtZSkuY2xlYXJJbnN0YW5jZShpbnN0YW5jZUlkZW50aWZpZXIpO1xyXG59XHJcbi8qKlxyXG4gKiBUZXN0IG9ubHlcclxuICpcclxuICogQGludGVybmFsXHJcbiAqL1xyXG5mdW5jdGlvbiBfY2xlYXJDb21wb25lbnRzKCkge1xyXG4gICAgX2NvbXBvbmVudHMuY2xlYXIoKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBFUlJPUlMgPSB7XHJcbiAgICBbXCJuby1hcHBcIiAvKiBBcHBFcnJvci5OT19BUFAgKi9dOiBcIk5vIEZpcmViYXNlIEFwcCAneyRhcHBOYW1lfScgaGFzIGJlZW4gY3JlYXRlZCAtIFwiICtcclxuICAgICAgICAnY2FsbCBpbml0aWFsaXplQXBwKCkgZmlyc3QnLFxyXG4gICAgW1wiYmFkLWFwcC1uYW1lXCIgLyogQXBwRXJyb3IuQkFEX0FQUF9OQU1FICovXTogXCJJbGxlZ2FsIEFwcCBuYW1lOiAneyRhcHBOYW1lfVwiLFxyXG4gICAgW1wiZHVwbGljYXRlLWFwcFwiIC8qIEFwcEVycm9yLkRVUExJQ0FURV9BUFAgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBleGlzdHMgd2l0aCBkaWZmZXJlbnQgb3B0aW9ucyBvciBjb25maWdcIixcclxuICAgIFtcImFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuQVBQX0RFTEVURUQgKi9dOiBcIkZpcmViYXNlIEFwcCBuYW1lZCAneyRhcHBOYW1lfScgYWxyZWFkeSBkZWxldGVkXCIsXHJcbiAgICBbXCJuby1vcHRpb25zXCIgLyogQXBwRXJyb3IuTk9fT1BUSU9OUyAqL106ICdOZWVkIHRvIHByb3ZpZGUgb3B0aW9ucywgd2hlbiBub3QgYmVpbmcgZGVwbG95ZWQgdG8gaG9zdGluZyB2aWEgc291cmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWFwcC1hcmd1bWVudFwiIC8qIEFwcEVycm9yLklOVkFMSURfQVBQX0FSR1VNRU5UICovXTogJ2ZpcmViYXNlLnskYXBwTmFtZX0oKSB0YWtlcyBlaXRoZXIgbm8gYXJndW1lbnQgb3IgYSAnICtcclxuICAgICAgICAnRmlyZWJhc2UgQXBwIGluc3RhbmNlLicsXHJcbiAgICBbXCJpbnZhbGlkLWxvZy1hcmd1bWVudFwiIC8qIEFwcEVycm9yLklOVkFMSURfTE9HX0FSR1VNRU5UICovXTogJ0ZpcnN0IGFyZ3VtZW50IHRvIGBvbkxvZ2AgbXVzdCBiZSBudWxsIG9yIGEgZnVuY3Rpb24uJyxcclxuICAgIFtcImlkYi1vcGVuXCIgLyogQXBwRXJyb3IuSURCX09QRU4gKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gb3BlbmluZyBJbmRleGVkREIuIE9yaWdpbmFsIGVycm9yOiB7JG9yaWdpbmFsRXJyb3JNZXNzYWdlfS4nLFxyXG4gICAgW1wiaWRiLWdldFwiIC8qIEFwcEVycm9yLklEQl9HRVQgKi9dOiAnRXJyb3IgdGhyb3duIHdoZW4gcmVhZGluZyBmcm9tIEluZGV4ZWREQi4gT3JpZ2luYWwgZXJyb3I6IHskb3JpZ2luYWxFcnJvck1lc3NhZ2V9LicsXHJcbiAgICBbXCJpZGItc2V0XCIgLyogQXBwRXJyb3IuSURCX1dSSVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIHdyaXRpbmcgdG8gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJyxcclxuICAgIFtcImlkYi1kZWxldGVcIiAvKiBBcHBFcnJvci5JREJfREVMRVRFICovXTogJ0Vycm9yIHRocm93biB3aGVuIGRlbGV0aW5nIGZyb20gSW5kZXhlZERCLiBPcmlnaW5hbCBlcnJvcjogeyRvcmlnaW5hbEVycm9yTWVzc2FnZX0uJ1xyXG59O1xyXG5jb25zdCBFUlJPUl9GQUNUT1JZID0gbmV3IEVycm9yRmFjdG9yeSgnYXBwJywgJ0ZpcmViYXNlJywgRVJST1JTKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY2xhc3MgRmlyZWJhc2VBcHBJbXBsIHtcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIG9wdGlvbnMpO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyk7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGNvbmZpZy5uYW1lO1xyXG4gICAgICAgIHRoaXMuX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCA9XHJcbiAgICAgICAgICAgIGNvbmZpZy5hdXRvbWF0aWNEYXRhQ29sbGVjdGlvbkVuYWJsZWQ7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFkZENvbXBvbmVudChuZXcgQ29tcG9uZW50KCdhcHAnLCAoKSA9PiB0aGlzLCBcIlBVQkxJQ1wiIC8qIENvbXBvbmVudFR5cGUuUFVCTElDICovKSk7XHJcbiAgICB9XHJcbiAgICBnZXQgYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkKCkge1xyXG4gICAgICAgIHRoaXMuY2hlY2tEZXN0cm95ZWQoKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkO1xyXG4gICAgfVxyXG4gICAgc2V0IGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCh2YWwpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgdGhpcy5fYXV0b21hdGljRGF0YUNvbGxlY3Rpb25FbmFibGVkID0gdmFsO1xyXG4gICAgfVxyXG4gICAgZ2V0IG5hbWUoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xyXG4gICAgfVxyXG4gICAgZ2V0IG9wdGlvbnMoKSB7XHJcbiAgICAgICAgdGhpcy5jaGVja0Rlc3Ryb3llZCgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9vcHRpb25zO1xyXG4gICAgfVxyXG4gICAgZ2V0IGNvbmZpZygpIHtcclxuICAgICAgICB0aGlzLmNoZWNrRGVzdHJveWVkKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbmZpZztcclxuICAgIH1cclxuICAgIGdldCBjb250YWluZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcclxuICAgIH1cclxuICAgIGdldCBpc0RlbGV0ZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRGVsZXRlZDtcclxuICAgIH1cclxuICAgIHNldCBpc0RlbGV0ZWQodmFsKSB7XHJcbiAgICAgICAgdGhpcy5faXNEZWxldGVkID0gdmFsO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgdGhyb3cgYW4gRXJyb3IgaWYgdGhlIEFwcCBoYXMgYWxyZWFkeSBiZWVuIGRlbGV0ZWQgLVxyXG4gICAgICogdXNlIGJlZm9yZSBwZXJmb3JtaW5nIEFQSSBhY3Rpb25zIG9uIHRoZSBBcHAuXHJcbiAgICAgKi9cclxuICAgIGNoZWNrRGVzdHJveWVkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzRGVsZXRlZCkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1kZWxldGVkXCIgLyogQXBwRXJyb3IuQVBQX0RFTEVURUQgKi8sIHsgYXBwTmFtZTogdGhpcy5fbmFtZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFRoZSBjdXJyZW50IFNESyB2ZXJzaW9uLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5jb25zdCBTREtfVkVSU0lPTiA9IHZlcnNpb247XHJcbmZ1bmN0aW9uIGluaXRpYWxpemVBcHAoX29wdGlvbnMsIHJhd0NvbmZpZyA9IHt9KSB7XHJcbiAgICBsZXQgb3B0aW9ucyA9IF9vcHRpb25zO1xyXG4gICAgaWYgKHR5cGVvZiByYXdDb25maWcgIT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHJhd0NvbmZpZztcclxuICAgICAgICByYXdDb25maWcgPSB7IG5hbWUgfTtcclxuICAgIH1cclxuICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oeyBuYW1lOiBERUZBVUxUX0VOVFJZX05BTUUsIGF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZDogZmFsc2UgfSwgcmF3Q29uZmlnKTtcclxuICAgIGNvbnN0IG5hbWUgPSBjb25maWcubmFtZTtcclxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gJ3N0cmluZycgfHwgIW5hbWUpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImJhZC1hcHAtbmFtZVwiIC8qIEFwcEVycm9yLkJBRF9BUFBfTkFNRSAqLywge1xyXG4gICAgICAgICAgICBhcHBOYW1lOiBTdHJpbmcobmFtZSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIG9wdGlvbnMgfHwgKG9wdGlvbnMgPSBnZXREZWZhdWx0QXBwQ29uZmlnKCkpO1xyXG4gICAgaWYgKCFvcHRpb25zKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1vcHRpb25zXCIgLyogQXBwRXJyb3IuTk9fT1BUSU9OUyAqLyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBleGlzdGluZ0FwcCA9IF9hcHBzLmdldChuYW1lKTtcclxuICAgIGlmIChleGlzdGluZ0FwcCkge1xyXG4gICAgICAgIC8vIHJldHVybiB0aGUgZXhpc3RpbmcgYXBwIGlmIG9wdGlvbnMgYW5kIGNvbmZpZyBkZWVwIGVxdWFsIHRoZSBvbmVzIGluIHRoZSBleGlzdGluZyBhcHAuXHJcbiAgICAgICAgaWYgKGRlZXBFcXVhbChvcHRpb25zLCBleGlzdGluZ0FwcC5vcHRpb25zKSAmJlxyXG4gICAgICAgICAgICBkZWVwRXF1YWwoY29uZmlnLCBleGlzdGluZ0FwcC5jb25maWcpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBleGlzdGluZ0FwcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZHVwbGljYXRlLWFwcFwiIC8qIEFwcEVycm9yLkRVUExJQ0FURV9BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBjb250YWluZXIgPSBuZXcgQ29tcG9uZW50Q29udGFpbmVyKG5hbWUpO1xyXG4gICAgZm9yIChjb25zdCBjb21wb25lbnQgb2YgX2NvbXBvbmVudHMudmFsdWVzKCkpIHtcclxuICAgICAgICBjb250YWluZXIuYWRkQ29tcG9uZW50KGNvbXBvbmVudCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXdBcHAgPSBuZXcgRmlyZWJhc2VBcHBJbXBsKG9wdGlvbnMsIGNvbmZpZywgY29udGFpbmVyKTtcclxuICAgIF9hcHBzLnNldChuYW1lLCBuZXdBcHApO1xyXG4gICAgcmV0dXJuIG5ld0FwcDtcclxufVxyXG4vKipcclxuICogUmV0cmlldmVzIGEge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKlxyXG4gKiBXaGVuIGNhbGxlZCB3aXRoIG5vIGFyZ3VtZW50cywgdGhlIGRlZmF1bHQgYXBwIGlzIHJldHVybmVkLiBXaGVuIGFuIGFwcCBuYW1lXHJcbiAqIGlzIHByb3ZpZGVkLCB0aGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhhdCBuYW1lIGlzIHJldHVybmVkLlxyXG4gKlxyXG4gKiBBbiBleGNlcHRpb24gaXMgdGhyb3duIGlmIHRoZSBhcHAgYmVpbmcgcmV0cmlldmVkIGhhcyBub3QgeWV0IGJlZW5cclxuICogaW5pdGlhbGl6ZWQuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogLy8gUmV0dXJuIHRoZSBkZWZhdWx0IGFwcFxyXG4gKiBjb25zdCBhcHAgPSBnZXRBcHAoKTtcclxuICogYGBgXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogLy8gUmV0dXJuIGEgbmFtZWQgYXBwXHJcbiAqIGNvbnN0IG90aGVyQXBwID0gZ2V0QXBwKFwib3RoZXJBcHBcIik7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBAcGFyYW0gbmFtZSAtIE9wdGlvbmFsIG5hbWUgb2YgdGhlIGFwcCB0byByZXR1cm4uIElmIG5vIG5hbWUgaXNcclxuICogICBwcm92aWRlZCwgdGhlIGRlZmF1bHQgaXMgYFwiW0RFRkFVTFRdXCJgLlxyXG4gKlxyXG4gKiBAcmV0dXJucyBUaGUgYXBwIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3ZpZGVkIGFwcCBuYW1lLlxyXG4gKiAgIElmIG5vIGFwcCBuYW1lIGlzIHByb3ZpZGVkLCB0aGUgZGVmYXVsdCBhcHAgaXMgcmV0dXJuZWQuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFwcChuYW1lID0gREVGQVVMVF9FTlRSWV9OQU1FKSB7XHJcbiAgICBjb25zdCBhcHAgPSBfYXBwcy5nZXQobmFtZSk7XHJcbiAgICBpZiAoIWFwcCAmJiBuYW1lID09PSBERUZBVUxUX0VOVFJZX05BTUUgJiYgZ2V0RGVmYXVsdEFwcENvbmZpZygpKSB7XHJcbiAgICAgICAgcmV0dXJuIGluaXRpYWxpemVBcHAoKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcHBcIiAvKiBBcHBFcnJvci5OT19BUFAgKi8sIHsgYXBwTmFtZTogbmFtZSB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcHA7XHJcbn1cclxuLyoqXHJcbiAqIEEgKHJlYWQtb25seSkgYXJyYXkgb2YgYWxsIGluaXRpYWxpemVkIGFwcHMuXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGdldEFwcHMoKSB7XHJcbiAgICByZXR1cm4gQXJyYXkuZnJvbShfYXBwcy52YWx1ZXMoKSk7XHJcbn1cclxuLyoqXHJcbiAqIFJlbmRlcnMgdGhpcyBhcHAgdW51c2FibGUgYW5kIGZyZWVzIHRoZSByZXNvdXJjZXMgb2YgYWxsIGFzc29jaWF0ZWRcclxuICogc2VydmljZXMuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYGphdmFzY3JpcHRcclxuICogZGVsZXRlQXBwKGFwcClcclxuICogICAudGhlbihmdW5jdGlvbigpIHtcclxuICogICAgIGNvbnNvbGUubG9nKFwiQXBwIGRlbGV0ZWQgc3VjY2Vzc2Z1bGx5XCIpO1xyXG4gKiAgIH0pXHJcbiAqICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAqICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGRlbGV0aW5nIGFwcDpcIiwgZXJyb3IpO1xyXG4gKiAgIH0pO1xyXG4gKiBgYGBcclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlQXBwKGFwcCkge1xyXG4gICAgY29uc3QgbmFtZSA9IGFwcC5uYW1lO1xyXG4gICAgaWYgKF9hcHBzLmhhcyhuYW1lKSkge1xyXG4gICAgICAgIF9hcHBzLmRlbGV0ZShuYW1lKTtcclxuICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChhcHAuY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5nZXRQcm92aWRlcnMoKVxyXG4gICAgICAgICAgICAubWFwKHByb3ZpZGVyID0+IHByb3ZpZGVyLmRlbGV0ZSgpKSk7XHJcbiAgICAgICAgYXBwLmlzRGVsZXRlZCA9IHRydWU7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFJlZ2lzdGVycyBhIGxpYnJhcnkncyBuYW1lIGFuZCB2ZXJzaW9uIGZvciBwbGF0Zm9ybSBsb2dnaW5nIHB1cnBvc2VzLlxyXG4gKiBAcGFyYW0gbGlicmFyeSAtIE5hbWUgb2YgMXAgb3IgM3AgbGlicmFyeSAoZS5nLiBmaXJlc3RvcmUsIGFuZ3VsYXJmaXJlKVxyXG4gKiBAcGFyYW0gdmVyc2lvbiAtIEN1cnJlbnQgdmVyc2lvbiBvZiB0aGF0IGxpYnJhcnkuXHJcbiAqIEBwYXJhbSB2YXJpYW50IC0gQnVuZGxlIHZhcmlhbnQsIGUuZy4sIG5vZGUsIHJuLCBldGMuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyVmVyc2lvbihsaWJyYXJ5S2V5T3JOYW1lLCB2ZXJzaW9uLCB2YXJpYW50KSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICAvLyBUT0RPOiBXZSBjYW4gdXNlIHRoaXMgY2hlY2sgdG8gd2hpdGVsaXN0IHN0cmluZ3Mgd2hlbi9pZiB3ZSBzZXQgdXBcclxuICAgIC8vIGEgZ29vZCB3aGl0ZWxpc3Qgc3lzdGVtLlxyXG4gICAgbGV0IGxpYnJhcnkgPSAoX2EgPSBQTEFURk9STV9MT0dfU1RSSU5HW2xpYnJhcnlLZXlPck5hbWVdKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBsaWJyYXJ5S2V5T3JOYW1lO1xyXG4gICAgaWYgKHZhcmlhbnQpIHtcclxuICAgICAgICBsaWJyYXJ5ICs9IGAtJHt2YXJpYW50fWA7XHJcbiAgICB9XHJcbiAgICBjb25zdCBsaWJyYXJ5TWlzbWF0Y2ggPSBsaWJyYXJ5Lm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBjb25zdCB2ZXJzaW9uTWlzbWF0Y2ggPSB2ZXJzaW9uLm1hdGNoKC9cXHN8XFwvLyk7XHJcbiAgICBpZiAobGlicmFyeU1pc21hdGNoIHx8IHZlcnNpb25NaXNtYXRjaCkge1xyXG4gICAgICAgIGNvbnN0IHdhcm5pbmcgPSBbXHJcbiAgICAgICAgICAgIGBVbmFibGUgdG8gcmVnaXN0ZXIgbGlicmFyeSBcIiR7bGlicmFyeX1cIiB3aXRoIHZlcnNpb24gXCIke3ZlcnNpb259XCI6YFxyXG4gICAgICAgIF07XHJcbiAgICAgICAgaWYgKGxpYnJhcnlNaXNtYXRjaCkge1xyXG4gICAgICAgICAgICB3YXJuaW5nLnB1c2goYGxpYnJhcnkgbmFtZSBcIiR7bGlicmFyeX1cIiBjb250YWlucyBpbGxlZ2FsIGNoYXJhY3RlcnMgKHdoaXRlc3BhY2Ugb3IgXCIvXCIpYCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChsaWJyYXJ5TWlzbWF0Y2ggJiYgdmVyc2lvbk1pc21hdGNoKSB7XHJcbiAgICAgICAgICAgIHdhcm5pbmcucHVzaCgnYW5kJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh2ZXJzaW9uTWlzbWF0Y2gpIHtcclxuICAgICAgICAgICAgd2FybmluZy5wdXNoKGB2ZXJzaW9uIG5hbWUgXCIke3ZlcnNpb259XCIgY29udGFpbnMgaWxsZWdhbCBjaGFyYWN0ZXJzICh3aGl0ZXNwYWNlIG9yIFwiL1wiKWApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsb2dnZXIud2Fybih3YXJuaW5nLmpvaW4oJyAnKSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoYCR7bGlicmFyeX0tdmVyc2lvbmAsICgpID0+ICh7IGxpYnJhcnksIHZlcnNpb24gfSksIFwiVkVSU0lPTlwiIC8qIENvbXBvbmVudFR5cGUuVkVSU0lPTiAqLykpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIGxvZyBoYW5kbGVyIGZvciBhbGwgRmlyZWJhc2UgU0RLcy5cclxuICogQHBhcmFtIGxvZ0NhbGxiYWNrIC0gQW4gb3B0aW9uYWwgY3VzdG9tIGxvZyBoYW5kbGVyIHRoYXQgZXhlY3V0ZXMgdXNlciBjb2RlIHdoZW5ldmVyXHJcbiAqIHRoZSBGaXJlYmFzZSBTREsgbWFrZXMgYSBsb2dnaW5nIGNhbGwuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIG9uTG9nKGxvZ0NhbGxiYWNrLCBvcHRpb25zKSB7XHJcbiAgICBpZiAobG9nQ2FsbGJhY2sgIT09IG51bGwgJiYgdHlwZW9mIGxvZ0NhbGxiYWNrICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLWxvZy1hcmd1bWVudFwiIC8qIEFwcEVycm9yLklOVkFMSURfTE9HX0FSR1VNRU5UICovKTtcclxuICAgIH1cclxuICAgIHNldFVzZXJMb2dIYW5kbGVyKGxvZ0NhbGxiYWNrLCBvcHRpb25zKTtcclxufVxyXG4vKipcclxuICogU2V0cyBsb2cgbGV2ZWwgZm9yIGFsbCBGaXJlYmFzZSBTREtzLlxyXG4gKlxyXG4gKiBBbGwgb2YgdGhlIGxvZyB0eXBlcyBhYm92ZSB0aGUgY3VycmVudCBsb2cgbGV2ZWwgYXJlIGNhcHR1cmVkIChpLmUuIGlmXHJcbiAqIHlvdSBzZXQgdGhlIGxvZyBsZXZlbCB0byBgaW5mb2AsIGVycm9ycyBhcmUgbG9nZ2VkLCBidXQgYGRlYnVnYCBhbmRcclxuICogYHZlcmJvc2VgIGxvZ3MgYXJlIG5vdCkuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIHNldExvZ0xldmVsKGxvZ0xldmVsKSB7XHJcbiAgICBzZXRMb2dMZXZlbCQxKGxvZ0xldmVsKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBEQl9OQU1FID0gJ2ZpcmViYXNlLWhlYXJ0YmVhdC1kYXRhYmFzZSc7XHJcbmNvbnN0IERCX1ZFUlNJT04gPSAxO1xyXG5jb25zdCBTVE9SRV9OQU1FID0gJ2ZpcmViYXNlLWhlYXJ0YmVhdC1zdG9yZSc7XHJcbmxldCBkYlByb21pc2UgPSBudWxsO1xyXG5mdW5jdGlvbiBnZXREYlByb21pc2UoKSB7XHJcbiAgICBpZiAoIWRiUHJvbWlzZSkge1xyXG4gICAgICAgIGRiUHJvbWlzZSA9IG9wZW5EQihEQl9OQU1FLCBEQl9WRVJTSU9OLCB7XHJcbiAgICAgICAgICAgIHVwZ3JhZGU6IChkYiwgb2xkVmVyc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgdXNlICdicmVhaycgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCB0aGUgZmFsbC10aHJvdWdoXHJcbiAgICAgICAgICAgICAgICAvLyBiZWhhdmlvciBpcyB3aGF0IHdlIHdhbnQsIGJlY2F1c2UgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHZlcnNpb25zIGJldHdlZW5cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBvbGQgdmVyc2lvbiBhbmQgdGhlIGN1cnJlbnQgdmVyc2lvbiwgd2Ugd2FudCBBTEwgdGhlIG1pZ3JhdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHRoYXQgY29ycmVzcG9uZCB0byB0aG9zZSB2ZXJzaW9ucyB0byBydW4sIG5vdCBvbmx5IHRoZSBsYXN0IG9uZS5cclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZWZhdWx0LWNhc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2xkVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRiLmNyZWF0ZU9iamVjdFN0b3JlKFNUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTYWZhcmkvaU9TIGJyb3dzZXJzIHRocm93IG9jY2FzaW9uYWwgZXhjZXB0aW9ucyBvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZGIuY3JlYXRlT2JqZWN0U3RvcmUoKSB0aGF0IG1heSBiZSBhIGJ1Zy4gQXZvaWQgYmxvY2tpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSByZXN0IG9mIHRoZSBhcHAgZnVuY3Rpb25hbGl0eS5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuY2F0Y2goZSA9PiB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLW9wZW5cIiAvKiBBcHBFcnJvci5JREJfT1BFTiAqLywge1xyXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFcnJvck1lc3NhZ2U6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYlByb21pc2U7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKGFwcCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkYiA9IGF3YWl0IGdldERiUHJvbWlzZSgpO1xyXG4gICAgICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oU1RPUkVfTkFNRSk7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdHgub2JqZWN0U3RvcmUoU1RPUkVfTkFNRSkuZ2V0KGNvbXB1dGVLZXkoYXBwKSk7XHJcbiAgICAgICAgLy8gV2UgYWxyZWFkeSBoYXZlIHRoZSB2YWx1ZSBidXQgdHguZG9uZSBjYW4gdGhyb3csXHJcbiAgICAgICAgLy8gc28gd2UgbmVlZCB0byBhd2FpdCBpdCBoZXJlIHRvIGNhdGNoIGVycm9yc1xyXG4gICAgICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKGUubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpZGJHZXRFcnJvciA9IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaWRiLWdldFwiIC8qIEFwcEVycm9yLklEQl9HRVQgKi8sIHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiBlID09PSBudWxsIHx8IGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIHdyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCKGFwcCwgaGVhcnRiZWF0T2JqZWN0KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbihTVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICAgICAgY29uc3Qgb2JqZWN0U3RvcmUgPSB0eC5vYmplY3RTdG9yZShTVE9SRV9OQU1FKTtcclxuICAgICAgICBhd2FpdCBvYmplY3RTdG9yZS5wdXQoaGVhcnRiZWF0T2JqZWN0LCBjb21wdXRlS2V5KGFwcCkpO1xyXG4gICAgICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgRmlyZWJhc2VFcnJvcikge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihlLm1lc3NhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaWRiR2V0RXJyb3IgPSBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImlkYi1zZXRcIiAvKiBBcHBFcnJvci5JREJfV1JJVEUgKi8sIHtcclxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXJyb3JNZXNzYWdlOiBlID09PSBudWxsIHx8IGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGUubWVzc2FnZVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oaWRiR2V0RXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNvbXB1dGVLZXkoYXBwKSB7XHJcbiAgICByZXR1cm4gYCR7YXBwLm5hbWV9ISR7YXBwLm9wdGlvbnMuYXBwSWR9YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjEgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBNQVhfSEVBREVSX0JZVEVTID0gMTAyNDtcclxuLy8gMzAgZGF5c1xyXG5jb25zdCBTVE9SRURfSEVBUlRCRUFUX1JFVEVOVElPTl9NQVhfTUlMTElTID0gMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwO1xyXG5jbGFzcyBIZWFydGJlYXRTZXJ2aWNlSW1wbCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXIpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGNvbnRhaW5lcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBJbi1tZW1vcnkgY2FjaGUgZm9yIGhlYXJ0YmVhdHMsIHVzZWQgYnkgZ2V0SGVhcnRiZWF0c0hlYWRlcigpIHRvIGdlbmVyYXRlXHJcbiAgICAgICAgICogdGhlIGhlYWRlciBzdHJpbmcuXHJcbiAgICAgICAgICogU3RvcmVzIG9uZSByZWNvcmQgcGVyIGRhdGUuIFRoaXMgd2lsbCBiZSBjb25zb2xpZGF0ZWQgaW50byB0aGUgc3RhbmRhcmRcclxuICAgICAgICAgKiBmb3JtYXQgb2Ygb25lIHJlY29yZCBwZXIgdXNlciBhZ2VudCBzdHJpbmcgYmVmb3JlIGJlaW5nIHNlbnQgYXMgYSBoZWFkZXIuXHJcbiAgICAgICAgICogUG9wdWxhdGVkIGZyb20gaW5kZXhlZERCIHdoZW4gdGhlIGNvbnRyb2xsZXIgaXMgaW5zdGFudGlhdGVkIGFuZCBzaG91bGRcclxuICAgICAgICAgKiBiZSBrZXB0IGluIHN5bmMgd2l0aCBpbmRleGVkREIuXHJcbiAgICAgICAgICogTGVhdmUgcHVibGljIGZvciBlYXNpZXIgdGVzdGluZy5cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IGFwcCA9IHRoaXMuY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICB0aGlzLl9zdG9yYWdlID0gbmV3IEhlYXJ0YmVhdFN0b3JhZ2VJbXBsKGFwcCk7XHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZSA9IHRoaXMuX3N0b3JhZ2UucmVhZCgpLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBDYWxsZWQgdG8gcmVwb3J0IGEgaGVhcnRiZWF0LiBUaGUgZnVuY3Rpb24gd2lsbCBnZW5lcmF0ZVxyXG4gICAgICogYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgb2JqZWN0LCB1cGRhdGUgaGVhcnRiZWF0c0NhY2hlLCBhbmQgcGVyc2lzdCBpdFxyXG4gICAgICogdG8gSW5kZXhlZERCLlxyXG4gICAgICogTm90ZSB0aGF0IHdlIG9ubHkgc3RvcmUgb25lIGhlYXJ0YmVhdCBwZXIgZGF5LiBTbyBpZiBhIGhlYXJ0YmVhdCBmb3IgdG9kYXkgaXNcclxuICAgICAqIGFscmVhZHkgbG9nZ2VkLCBzdWJzZXF1ZW50IGNhbGxzIHRvIHRoaXMgZnVuY3Rpb24gaW4gdGhlIHNhbWUgZGF5IHdpbGwgYmUgaWdub3JlZC5cclxuICAgICAqL1xyXG4gICAgYXN5bmMgdHJpZ2dlckhlYXJ0YmVhdCgpIHtcclxuICAgICAgICB2YXIgX2EsIF9iO1xyXG4gICAgICAgIGNvbnN0IHBsYXRmb3JtTG9nZ2VyID0gdGhpcy5jb250YWluZXJcclxuICAgICAgICAgICAgLmdldFByb3ZpZGVyKCdwbGF0Zm9ybS1sb2dnZXInKVxyXG4gICAgICAgICAgICAuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgLy8gVGhpcyBpcyB0aGUgXCJGaXJlYmFzZSB1c2VyIGFnZW50XCIgc3RyaW5nIGZyb20gdGhlIHBsYXRmb3JtIGxvZ2dlclxyXG4gICAgICAgIC8vIHNlcnZpY2UsIG5vdCB0aGUgYnJvd3NlciB1c2VyIGFnZW50LlxyXG4gICAgICAgIGNvbnN0IGFnZW50ID0gcGxhdGZvcm1Mb2dnZXIuZ2V0UGxhdGZvcm1JbmZvU3RyaW5nKCk7XHJcbiAgICAgICAgY29uc3QgZGF0ZSA9IGdldFVUQ0RhdGVTdHJpbmcoKTtcclxuICAgICAgICBpZiAoKChfYSA9IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmhlYXJ0YmVhdHMpID09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlID0gYXdhaXQgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZTtcclxuICAgICAgICAgICAgLy8gSWYgd2UgZmFpbGVkIHRvIGNvbnN0cnVjdCBhIGhlYXJ0YmVhdHMgY2FjaGUsIHRoZW4gcmV0dXJuIGltbWVkaWF0ZWx5LlxyXG4gICAgICAgICAgICBpZiAoKChfYiA9IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmhlYXJ0YmVhdHMpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBEbyBub3Qgc3RvcmUgYSBoZWFydGJlYXQgaWYgb25lIGlzIGFscmVhZHkgc3RvcmVkIGZvciB0aGlzIGRheVxyXG4gICAgICAgIC8vIG9yIGlmIGEgaGVhZGVyIGhhcyBhbHJlYWR5IGJlZW4gc2VudCB0b2RheS5cclxuICAgICAgICBpZiAodGhpcy5faGVhcnRiZWF0c0NhY2hlLmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA9PT0gZGF0ZSB8fFxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5zb21lKHNpbmdsZURhdGVIZWFydGJlYXQgPT4gc2luZ2xlRGF0ZUhlYXJ0YmVhdC5kYXRlID09PSBkYXRlKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBpcyBubyBlbnRyeSBmb3IgdGhpcyBkYXRlLiBDcmVhdGUgb25lLlxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5wdXNoKHsgZGF0ZSwgYWdlbnQgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJlbW92ZSBlbnRyaWVzIG9sZGVyIHRoYW4gMzAgZGF5cy5cclxuICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cyA9IHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzLmZpbHRlcihzaW5nbGVEYXRlSGVhcnRiZWF0ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaGJUaW1lc3RhbXAgPSBuZXcgRGF0ZShzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUpLnZhbHVlT2YoKTtcclxuICAgICAgICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5vdyAtIGhiVGltZXN0YW1wIDw9IFNUT1JFRF9IRUFSVEJFQVRfUkVURU5USU9OX01BWF9NSUxMSVM7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0b3JhZ2Uub3ZlcndyaXRlKHRoaXMuX2hlYXJ0YmVhdHNDYWNoZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJldHVybnMgYSBiYXNlNjQgZW5jb2RlZCBzdHJpbmcgd2hpY2ggY2FuIGJlIGF0dGFjaGVkIHRvIHRoZSBoZWFydGJlYXQtc3BlY2lmaWMgaGVhZGVyIGRpcmVjdGx5LlxyXG4gICAgICogSXQgYWxzbyBjbGVhcnMgYWxsIGhlYXJ0YmVhdHMgZnJvbSBtZW1vcnkgYXMgd2VsbCBhcyBpbiBJbmRleGVkREIuXHJcbiAgICAgKlxyXG4gICAgICogTk9URTogQ29uc3VtaW5nIHByb2R1Y3QgU0RLcyBzaG91bGQgbm90IHNlbmQgdGhlIGhlYWRlciBpZiB0aGlzIG1ldGhvZFxyXG4gICAgICogcmV0dXJucyBhbiBlbXB0eSBzdHJpbmcuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdldEhlYXJ0YmVhdHNIZWFkZXIoKSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGlmICh0aGlzLl9oZWFydGJlYXRzQ2FjaGUgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5faGVhcnRiZWF0c0NhY2hlUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSWYgaXQncyBzdGlsbCBudWxsIG9yIHRoZSBhcnJheSBpcyBlbXB0eSwgdGhlcmUgaXMgbm8gZGF0YSB0byBzZW5kLlxyXG4gICAgICAgIGlmICgoKF9hID0gdGhpcy5faGVhcnRiZWF0c0NhY2hlKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaGVhcnRiZWF0cykgPT0gbnVsbCB8fFxyXG4gICAgICAgICAgICB0aGlzLl9oZWFydGJlYXRzQ2FjaGUuaGVhcnRiZWF0cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBkYXRlID0gZ2V0VVRDRGF0ZVN0cmluZygpO1xyXG4gICAgICAgIC8vIEV4dHJhY3QgYXMgbWFueSBoZWFydGJlYXRzIGZyb20gdGhlIGNhY2hlIGFzIHdpbGwgZml0IHVuZGVyIHRoZSBzaXplIGxpbWl0LlxyXG4gICAgICAgIGNvbnN0IHsgaGVhcnRiZWF0c1RvU2VuZCwgdW5zZW50RW50cmllcyB9ID0gZXh0cmFjdEhlYXJ0YmVhdHNGb3JIZWFkZXIodGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMpO1xyXG4gICAgICAgIGNvbnN0IGhlYWRlclN0cmluZyA9IGJhc2U2NHVybEVuY29kZVdpdGhvdXRQYWRkaW5nKEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c1RvU2VuZCB9KSk7XHJcbiAgICAgICAgLy8gU3RvcmUgbGFzdCBzZW50IGRhdGUgdG8gcHJldmVudCBhbm90aGVyIGJlaW5nIGxvZ2dlZC9zZW50IGZvciB0aGUgc2FtZSBkYXkuXHJcbiAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmxhc3RTZW50SGVhcnRiZWF0RGF0ZSA9IGRhdGU7XHJcbiAgICAgICAgaWYgKHVuc2VudEVudHJpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAvLyBTdG9yZSBhbnkgdW5zZW50IGVudHJpZXMgaWYgdGhleSBleGlzdC5cclxuICAgICAgICAgICAgdGhpcy5faGVhcnRiZWF0c0NhY2hlLmhlYXJ0YmVhdHMgPSB1bnNlbnRFbnRyaWVzO1xyXG4gICAgICAgICAgICAvLyBUaGlzIHNlZW1zIG1vcmUgbGlrZWx5IHRoYW4gZW1wdHlpbmcgdGhlIGFycmF5IChiZWxvdykgdG8gbGVhZCB0byBzb21lIG9kZCBzdGF0ZVxyXG4gICAgICAgICAgICAvLyBzaW5jZSB0aGUgY2FjaGUgaXNuJ3QgZW1wdHkgYW5kIHRoaXMgd2lsbCBiZSBjYWxsZWQgYWdhaW4gb24gdGhlIG5leHQgcmVxdWVzdCxcclxuICAgICAgICAgICAgLy8gYW5kIGlzIHByb2JhYmx5IHNhZmVzdCBpZiB3ZSBhd2FpdCBpdC5cclxuICAgICAgICAgICAgYXdhaXQgdGhpcy5fc3RvcmFnZS5vdmVyd3JpdGUodGhpcy5faGVhcnRiZWF0c0NhY2hlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlYXJ0YmVhdHNDYWNoZS5oZWFydGJlYXRzID0gW107XHJcbiAgICAgICAgICAgIC8vIERvIG5vdCB3YWl0IGZvciB0aGlzLCB0byByZWR1Y2UgbGF0ZW5jeS5cclxuICAgICAgICAgICAgdm9pZCB0aGlzLl9zdG9yYWdlLm92ZXJ3cml0ZSh0aGlzLl9oZWFydGJlYXRzQ2FjaGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaGVhZGVyU3RyaW5nO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldFVUQ0RhdGVTdHJpbmcoKSB7XHJcbiAgICBjb25zdCB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAvLyBSZXR1cm5zIGRhdGUgZm9ybWF0ICdZWVlZLU1NLUREJ1xyXG4gICAgcmV0dXJuIHRvZGF5LnRvSVNPU3RyaW5nKCkuc3Vic3RyaW5nKDAsIDEwKTtcclxufVxyXG5mdW5jdGlvbiBleHRyYWN0SGVhcnRiZWF0c0ZvckhlYWRlcihoZWFydGJlYXRzQ2FjaGUsIG1heFNpemUgPSBNQVhfSEVBREVSX0JZVEVTKSB7XHJcbiAgICAvLyBIZWFydGJlYXRzIGdyb3VwZWQgYnkgdXNlciBhZ2VudCBpbiB0aGUgc3RhbmRhcmQgZm9ybWF0IHRvIGJlIHNlbnQgaW5cclxuICAgIC8vIHRoZSBoZWFkZXIuXHJcbiAgICBjb25zdCBoZWFydGJlYXRzVG9TZW5kID0gW107XHJcbiAgICAvLyBTaW5nbGUgZGF0ZSBmb3JtYXQgaGVhcnRiZWF0cyB0aGF0IGFyZSBub3Qgc2VudC5cclxuICAgIGxldCB1bnNlbnRFbnRyaWVzID0gaGVhcnRiZWF0c0NhY2hlLnNsaWNlKCk7XHJcbiAgICBmb3IgKGNvbnN0IHNpbmdsZURhdGVIZWFydGJlYXQgb2YgaGVhcnRiZWF0c0NhY2hlKSB7XHJcbiAgICAgICAgLy8gTG9vayBmb3IgYW4gZXhpc3RpbmcgZW50cnkgd2l0aCB0aGUgc2FtZSB1c2VyIGFnZW50LlxyXG4gICAgICAgIGNvbnN0IGhlYXJ0YmVhdEVudHJ5ID0gaGVhcnRiZWF0c1RvU2VuZC5maW5kKGhiID0+IGhiLmFnZW50ID09PSBzaW5nbGVEYXRlSGVhcnRiZWF0LmFnZW50KTtcclxuICAgICAgICBpZiAoIWhlYXJ0YmVhdEVudHJ5KSB7XHJcbiAgICAgICAgICAgIC8vIElmIG5vIGVudHJ5IGZvciB0aGlzIHVzZXIgYWdlbnQgZXhpc3RzLCBjcmVhdGUgb25lLlxyXG4gICAgICAgICAgICBoZWFydGJlYXRzVG9TZW5kLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgYWdlbnQ6IHNpbmdsZURhdGVIZWFydGJlYXQuYWdlbnQsXHJcbiAgICAgICAgICAgICAgICBkYXRlczogW3NpbmdsZURhdGVIZWFydGJlYXQuZGF0ZV1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGlmIChjb3VudEJ5dGVzKGhlYXJ0YmVhdHNUb1NlbmQpID4gbWF4U2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIGhlYWRlciB3b3VsZCBleGNlZWQgbWF4IHNpemUsIHJlbW92ZSB0aGUgYWRkZWQgaGVhcnRiZWF0XHJcbiAgICAgICAgICAgICAgICAvLyBlbnRyeSBhbmQgc3RvcCBhZGRpbmcgdG8gdGhlIGhlYWRlci5cclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHNUb1NlbmQucG9wKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaGVhcnRiZWF0RW50cnkuZGF0ZXMucHVzaChzaW5nbGVEYXRlSGVhcnRiZWF0LmRhdGUpO1xyXG4gICAgICAgICAgICAvLyBJZiB0aGUgaGVhZGVyIHdvdWxkIGV4Y2VlZCBtYXggc2l6ZSwgcmVtb3ZlIHRoZSBhZGRlZCBkYXRlXHJcbiAgICAgICAgICAgIC8vIGFuZCBzdG9wIGFkZGluZyB0byB0aGUgaGVhZGVyLlxyXG4gICAgICAgICAgICBpZiAoY291bnRCeXRlcyhoZWFydGJlYXRzVG9TZW5kKSA+IG1heFNpemUpIHtcclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdEVudHJ5LmRhdGVzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUG9wIHVuc2VudCBlbnRyeSBmcm9tIHF1ZXVlLiAoU2tpcHBlZCBpZiBhZGRpbmcgdGhlIGVudHJ5IGV4Y2VlZGVkXHJcbiAgICAgICAgLy8gcXVvdGEgYW5kIHRoZSBsb29wIGJyZWFrcyBlYXJseS4pXHJcbiAgICAgICAgdW5zZW50RW50cmllcyA9IHVuc2VudEVudHJpZXMuc2xpY2UoMSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGhlYXJ0YmVhdHNUb1NlbmQsXHJcbiAgICAgICAgdW5zZW50RW50cmllc1xyXG4gICAgfTtcclxufVxyXG5jbGFzcyBIZWFydGJlYXRTdG9yYWdlSW1wbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihhcHApIHtcclxuICAgICAgICB0aGlzLmFwcCA9IGFwcDtcclxuICAgICAgICB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlID0gdGhpcy5ydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrKCk7XHJcbiAgICB9XHJcbiAgICBhc3luYyBydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrKCkge1xyXG4gICAgICAgIGlmICghaXNJbmRleGVkREJBdmFpbGFibGUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdmFsaWRhdGVJbmRleGVkREJPcGVuYWJsZSgpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0cnVlKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIFJlYWQgYWxsIGhlYXJ0YmVhdHMuXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIHJlYWQoKSB7XHJcbiAgICAgICAgY29uc3QgY2FuVXNlSW5kZXhlZERCID0gYXdhaXQgdGhpcy5fY2FuVXNlSW5kZXhlZERCUHJvbWlzZTtcclxuICAgICAgICBpZiAoIWNhblVzZUluZGV4ZWREQikge1xyXG4gICAgICAgICAgICByZXR1cm4geyBoZWFydGJlYXRzOiBbXSB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgaWRiSGVhcnRiZWF0T2JqZWN0ID0gYXdhaXQgcmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCKHRoaXMuYXBwKTtcclxuICAgICAgICAgICAgaWYgKGlkYkhlYXJ0YmVhdE9iamVjdCA9PT0gbnVsbCB8fCBpZGJIZWFydGJlYXRPYmplY3QgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGlkYkhlYXJ0YmVhdE9iamVjdC5oZWFydGJlYXRzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaWRiSGVhcnRiZWF0T2JqZWN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgaGVhcnRiZWF0czogW10gfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIC8vIG92ZXJ3cml0ZSB0aGUgc3RvcmFnZSB3aXRoIHRoZSBwcm92aWRlZCBoZWFydGJlYXRzXHJcbiAgICBhc3luYyBvdmVyd3JpdGUoaGVhcnRiZWF0c09iamVjdCkge1xyXG4gICAgICAgIHZhciBfYTtcclxuICAgICAgICBjb25zdCBjYW5Vc2VJbmRleGVkREIgPSBhd2FpdCB0aGlzLl9jYW5Vc2VJbmRleGVkREJQcm9taXNlO1xyXG4gICAgICAgIGlmICghY2FuVXNlSW5kZXhlZERCKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCA9IGF3YWl0IHRoaXMucmVhZCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gd3JpdGVIZWFydGJlYXRzVG9JbmRleGVkREIodGhpcy5hcHAsIHtcclxuICAgICAgICAgICAgICAgIGxhc3RTZW50SGVhcnRiZWF0RGF0ZTogKF9hID0gaGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGV4aXN0aW5nSGVhcnRiZWF0c09iamVjdC5sYXN0U2VudEhlYXJ0YmVhdERhdGUsXHJcbiAgICAgICAgICAgICAgICBoZWFydGJlYXRzOiBoZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLy8gYWRkIGhlYXJ0YmVhdHNcclxuICAgIGFzeW5jIGFkZChoZWFydGJlYXRzT2JqZWN0KSB7XHJcbiAgICAgICAgdmFyIF9hO1xyXG4gICAgICAgIGNvbnN0IGNhblVzZUluZGV4ZWREQiA9IGF3YWl0IHRoaXMuX2NhblVzZUluZGV4ZWREQlByb21pc2U7XHJcbiAgICAgICAgaWYgKCFjYW5Vc2VJbmRleGVkREIpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0ID0gYXdhaXQgdGhpcy5yZWFkKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB3cml0ZUhlYXJ0YmVhdHNUb0luZGV4ZWREQih0aGlzLmFwcCwge1xyXG4gICAgICAgICAgICAgICAgbGFzdFNlbnRIZWFydGJlYXREYXRlOiAoX2EgPSBoZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogZXhpc3RpbmdIZWFydGJlYXRzT2JqZWN0Lmxhc3RTZW50SGVhcnRiZWF0RGF0ZSxcclxuICAgICAgICAgICAgICAgIGhlYXJ0YmVhdHM6IFtcclxuICAgICAgICAgICAgICAgICAgICAuLi5leGlzdGluZ0hlYXJ0YmVhdHNPYmplY3QuaGVhcnRiZWF0cyxcclxuICAgICAgICAgICAgICAgICAgICAuLi5oZWFydGJlYXRzT2JqZWN0LmhlYXJ0YmVhdHNcclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDYWxjdWxhdGUgYnl0ZXMgb2YgYSBIZWFydGJlYXRzQnlVc2VyQWdlbnQgYXJyYXkgYWZ0ZXIgYmVpbmcgd3JhcHBlZFxyXG4gKiBpbiBhIHBsYXRmb3JtIGxvZ2dpbmcgaGVhZGVyIEpTT04gb2JqZWN0LCBzdHJpbmdpZmllZCwgYW5kIGNvbnZlcnRlZFxyXG4gKiB0byBiYXNlIDY0LlxyXG4gKi9cclxuZnVuY3Rpb24gY291bnRCeXRlcyhoZWFydGJlYXRzQ2FjaGUpIHtcclxuICAgIC8vIGJhc2U2NCBoYXMgYSByZXN0cmljdGVkIHNldCBvZiBjaGFyYWN0ZXJzLCBhbGwgb2Ygd2hpY2ggc2hvdWxkIGJlIDEgYnl0ZS5cclxuICAgIHJldHVybiBiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyhcclxuICAgIC8vIGhlYXJ0YmVhdHNDYWNoZSB3cmFwcGVyIHByb3BlcnRpZXNcclxuICAgIEpTT04uc3RyaW5naWZ5KHsgdmVyc2lvbjogMiwgaGVhcnRiZWF0czogaGVhcnRiZWF0c0NhY2hlIH0pKS5sZW5ndGg7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gcmVnaXN0ZXJDb3JlQ29tcG9uZW50cyh2YXJpYW50KSB7XHJcbiAgICBfcmVnaXN0ZXJDb21wb25lbnQobmV3IENvbXBvbmVudCgncGxhdGZvcm0tbG9nZ2VyJywgY29udGFpbmVyID0+IG5ldyBQbGF0Zm9ybUxvZ2dlclNlcnZpY2VJbXBsKGNvbnRhaW5lciksIFwiUFJJVkFURVwiIC8qIENvbXBvbmVudFR5cGUuUFJJVkFURSAqLykpO1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ2hlYXJ0YmVhdCcsIGNvbnRhaW5lciA9PiBuZXcgSGVhcnRiZWF0U2VydmljZUltcGwoY29udGFpbmVyKSwgXCJQUklWQVRFXCIgLyogQ29tcG9uZW50VHlwZS5QUklWQVRFICovKSk7XHJcbiAgICAvLyBSZWdpc3RlciBgYXBwYCBwYWNrYWdlLlxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUkbywgdmVyc2lvbiQxLCB2YXJpYW50KTtcclxuICAgIC8vIEJVSUxEX1RBUkdFVCB3aWxsIGJlIHJlcGxhY2VkIGJ5IHZhbHVlcyBsaWtlIGVzbTUsIGVzbTIwMTcsIGNqczUsIGV0YyBkdXJpbmcgdGhlIGNvbXBpbGF0aW9uXHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSRvLCB2ZXJzaW9uJDEsICdlc20yMDE3Jyk7XHJcbiAgICAvLyBSZWdpc3RlciBwbGF0Zm9ybSBTREsgaWRlbnRpZmllciAobm8gdmVyc2lvbikuXHJcbiAgICByZWdpc3RlclZlcnNpb24oJ2ZpcmUtanMnLCAnJyk7XHJcbn1cblxuLyoqXHJcbiAqIEZpcmViYXNlIEFwcFxyXG4gKlxyXG4gKiBAcmVtYXJrcyBUaGlzIHBhY2thZ2UgY29vcmRpbmF0ZXMgdGhlIGNvbW11bmljYXRpb24gYmV0d2VlbiB0aGUgZGlmZmVyZW50IEZpcmViYXNlIGNvbXBvbmVudHNcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqL1xyXG5yZWdpc3RlckNvcmVDb21wb25lbnRzKCcnKTtcblxuZXhwb3J0IHsgU0RLX1ZFUlNJT04sIERFRkFVTFRfRU5UUllfTkFNRSBhcyBfREVGQVVMVF9FTlRSWV9OQU1FLCBfYWRkQ29tcG9uZW50LCBfYWRkT3JPdmVyd3JpdGVDb21wb25lbnQsIF9hcHBzLCBfY2xlYXJDb21wb25lbnRzLCBfY29tcG9uZW50cywgX2dldFByb3ZpZGVyLCBfcmVnaXN0ZXJDb21wb25lbnQsIF9yZW1vdmVTZXJ2aWNlSW5zdGFuY2UsIGRlbGV0ZUFwcCwgZ2V0QXBwLCBnZXRBcHBzLCBpbml0aWFsaXplQXBwLCBvbkxvZywgcmVnaXN0ZXJWZXJzaW9uLCBzZXRMb2dMZXZlbCB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtMjAxNy5qcy5tYXBcbiIsImltcG9ydCB7IHJlZ2lzdGVyVmVyc2lvbiB9IGZyb20gJ0BmaXJlYmFzZS9hcHAnO1xuZXhwb3J0ICogZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5cbnZhciBuYW1lID0gXCJmaXJlYmFzZVwiO1xudmFyIHZlcnNpb24gPSBcIjEwLjguMFwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ2FwcCcpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguZXNtLmpzLm1hcFxuIiwiaW1wb3J0IHsgX2dldFByb3ZpZGVyLCBnZXRBcHAsIF9yZWdpc3RlckNvbXBvbmVudCwgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAZmlyZWJhc2UvY29tcG9uZW50JztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgRmlyZWJhc2VFcnJvciB9IGZyb20gJ0BmaXJlYmFzZS91dGlsJztcbmltcG9ydCB7IG9wZW5EQiB9IGZyb20gJ2lkYic7XG5cbmNvbnN0IG5hbWUgPSBcIkBmaXJlYmFzZS9pbnN0YWxsYXRpb25zXCI7XG5jb25zdCB2ZXJzaW9uID0gXCIwLjYuNVwiO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBQRU5ESU5HX1RJTUVPVVRfTVMgPSAxMDAwMDtcclxuY29uc3QgUEFDS0FHRV9WRVJTSU9OID0gYHc6JHt2ZXJzaW9ufWA7XHJcbmNvbnN0IElOVEVSTkFMX0FVVEhfVkVSU0lPTiA9ICdGSVNfdjInO1xyXG5jb25zdCBJTlNUQUxMQVRJT05TX0FQSV9VUkwgPSAnaHR0cHM6Ly9maXJlYmFzZWluc3RhbGxhdGlvbnMuZ29vZ2xlYXBpcy5jb20vdjEnO1xyXG5jb25zdCBUT0tFTl9FWFBJUkFUSU9OX0JVRkZFUiA9IDYwICogNjAgKiAxMDAwOyAvLyBPbmUgaG91clxyXG5jb25zdCBTRVJWSUNFID0gJ2luc3RhbGxhdGlvbnMnO1xyXG5jb25zdCBTRVJWSUNFX05BTUUgPSAnSW5zdGFsbGF0aW9ucyc7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IEVSUk9SX0RFU0NSSVBUSU9OX01BUCA9IHtcclxuICAgIFtcIm1pc3NpbmctYXBwLWNvbmZpZy12YWx1ZXNcIiAvKiBFcnJvckNvZGUuTUlTU0lOR19BUFBfQ09ORklHX1ZBTFVFUyAqL106ICdNaXNzaW5nIEFwcCBjb25maWd1cmF0aW9uIHZhbHVlOiBcInskdmFsdWVOYW1lfVwiJyxcclxuICAgIFtcIm5vdC1yZWdpc3RlcmVkXCIgLyogRXJyb3JDb2RlLk5PVF9SRUdJU1RFUkVEICovXTogJ0ZpcmViYXNlIEluc3RhbGxhdGlvbiBpcyBub3QgcmVnaXN0ZXJlZC4nLFxyXG4gICAgW1wiaW5zdGFsbGF0aW9uLW5vdC1mb3VuZFwiIC8qIEVycm9yQ29kZS5JTlNUQUxMQVRJT05fTk9UX0ZPVU5EICovXTogJ0ZpcmViYXNlIEluc3RhbGxhdGlvbiBub3QgZm91bmQuJyxcclxuICAgIFtcInJlcXVlc3QtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlJFUVVFU1RfRkFJTEVEICovXTogJ3skcmVxdWVzdE5hbWV9IHJlcXVlc3QgZmFpbGVkIHdpdGggZXJyb3IgXCJ7JHNlcnZlckNvZGV9IHskc2VydmVyU3RhdHVzfTogeyRzZXJ2ZXJNZXNzYWdlfVwiJyxcclxuICAgIFtcImFwcC1vZmZsaW5lXCIgLyogRXJyb3JDb2RlLkFQUF9PRkZMSU5FICovXTogJ0NvdWxkIG5vdCBwcm9jZXNzIHJlcXVlc3QuIEFwcGxpY2F0aW9uIG9mZmxpbmUuJyxcclxuICAgIFtcImRlbGV0ZS1wZW5kaW5nLXJlZ2lzdHJhdGlvblwiIC8qIEVycm9yQ29kZS5ERUxFVEVfUEVORElOR19SRUdJU1RSQVRJT04gKi9dOiBcIkNhbid0IGRlbGV0ZSBpbnN0YWxsYXRpb24gd2hpbGUgdGhlcmUgaXMgYSBwZW5kaW5nIHJlZ2lzdHJhdGlvbiByZXF1ZXN0LlwiXHJcbn07XHJcbmNvbnN0IEVSUk9SX0ZBQ1RPUlkgPSBuZXcgRXJyb3JGYWN0b3J5KFNFUlZJQ0UsIFNFUlZJQ0VfTkFNRSwgRVJST1JfREVTQ1JJUFRJT05fTUFQKTtcclxuLyoqIFJldHVybnMgdHJ1ZSBpZiBlcnJvciBpcyBhIEZpcmViYXNlRXJyb3IgdGhhdCBpcyBiYXNlZCBvbiBhbiBlcnJvciBmcm9tIHRoZSBzZXJ2ZXIuICovXHJcbmZ1bmN0aW9uIGlzU2VydmVyRXJyb3IoZXJyb3IpIHtcclxuICAgIHJldHVybiAoZXJyb3IgaW5zdGFuY2VvZiBGaXJlYmFzZUVycm9yICYmXHJcbiAgICAgICAgZXJyb3IuY29kZS5pbmNsdWRlcyhcInJlcXVlc3QtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlJFUVVFU1RfRkFJTEVEICovKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9uc0VuZHBvaW50KHsgcHJvamVjdElkIH0pIHtcclxuICAgIHJldHVybiBgJHtJTlNUQUxMQVRJT05TX0FQSV9VUkx9L3Byb2plY3RzLyR7cHJvamVjdElkfS9pbnN0YWxsYXRpb25zYDtcclxufVxyXG5mdW5jdGlvbiBleHRyYWN0QXV0aFRva2VuSW5mb0Zyb21SZXNwb25zZShyZXNwb25zZSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0b2tlbjogcmVzcG9uc2UudG9rZW4sXHJcbiAgICAgICAgcmVxdWVzdFN0YXR1czogMiAvKiBSZXF1ZXN0U3RhdHVzLkNPTVBMRVRFRCAqLyxcclxuICAgICAgICBleHBpcmVzSW46IGdldEV4cGlyZXNJbkZyb21SZXNwb25zZUV4cGlyZXNJbihyZXNwb25zZS5leHBpcmVzSW4pLFxyXG4gICAgICAgIGNyZWF0aW9uVGltZTogRGF0ZS5ub3coKVxyXG4gICAgfTtcclxufVxyXG5hc3luYyBmdW5jdGlvbiBnZXRFcnJvckZyb21SZXNwb25zZShyZXF1ZXN0TmFtZSwgcmVzcG9uc2UpIHtcclxuICAgIGNvbnN0IHJlc3BvbnNlSnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgIGNvbnN0IGVycm9yRGF0YSA9IHJlc3BvbnNlSnNvbi5lcnJvcjtcclxuICAgIHJldHVybiBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcInJlcXVlc3QtZmFpbGVkXCIgLyogRXJyb3JDb2RlLlJFUVVFU1RfRkFJTEVEICovLCB7XHJcbiAgICAgICAgcmVxdWVzdE5hbWUsXHJcbiAgICAgICAgc2VydmVyQ29kZTogZXJyb3JEYXRhLmNvZGUsXHJcbiAgICAgICAgc2VydmVyTWVzc2FnZTogZXJyb3JEYXRhLm1lc3NhZ2UsXHJcbiAgICAgICAgc2VydmVyU3RhdHVzOiBlcnJvckRhdGEuc3RhdHVzXHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBnZXRIZWFkZXJzKHsgYXBpS2V5IH0pIHtcclxuICAgIHJldHVybiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICBBY2NlcHQ6ICdhcHBsaWNhdGlvbi9qc29uJyxcclxuICAgICAgICAneC1nb29nLWFwaS1rZXknOiBhcGlLZXlcclxuICAgIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGdldEhlYWRlcnNXaXRoQXV0aChhcHBDb25maWcsIHsgcmVmcmVzaFRva2VuIH0pIHtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzKGFwcENvbmZpZyk7XHJcbiAgICBoZWFkZXJzLmFwcGVuZCgnQXV0aG9yaXphdGlvbicsIGdldEF1dGhvcml6YXRpb25IZWFkZXIocmVmcmVzaFRva2VuKSk7XHJcbiAgICByZXR1cm4gaGVhZGVycztcclxufVxyXG4vKipcclxuICogQ2FsbHMgdGhlIHBhc3NlZCBpbiBmZXRjaCB3cmFwcGVyIGFuZCByZXR1cm5zIHRoZSByZXNwb25zZS5cclxuICogSWYgdGhlIHJldHVybmVkIHJlc3BvbnNlIGhhcyBhIHN0YXR1cyBvZiA1eHgsIHJlLXJ1bnMgdGhlIGZ1bmN0aW9uIG9uY2UgYW5kXHJcbiAqIHJldHVybnMgdGhlIHJlc3BvbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gcmV0cnlJZlNlcnZlckVycm9yKGZuKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBmbigpO1xyXG4gICAgaWYgKHJlc3VsdC5zdGF0dXMgPj0gNTAwICYmIHJlc3VsdC5zdGF0dXMgPCA2MDApIHtcclxuICAgICAgICAvLyBJbnRlcm5hbCBTZXJ2ZXIgRXJyb3IuIFJldHJ5IHJlcXVlc3QuXHJcbiAgICAgICAgcmV0dXJuIGZuKCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIGdldEV4cGlyZXNJbkZyb21SZXNwb25zZUV4cGlyZXNJbihyZXNwb25zZUV4cGlyZXNJbikge1xyXG4gICAgLy8gVGhpcyB3b3JrcyBiZWNhdXNlIHRoZSBzZXJ2ZXIgd2lsbCBuZXZlciByZXNwb25kIHdpdGggZnJhY3Rpb25zIG9mIGEgc2Vjb25kLlxyXG4gICAgcmV0dXJuIE51bWJlcihyZXNwb25zZUV4cGlyZXNJbi5yZXBsYWNlKCdzJywgJzAwMCcpKTtcclxufVxyXG5mdW5jdGlvbiBnZXRBdXRob3JpemF0aW9uSGVhZGVyKHJlZnJlc2hUb2tlbikge1xyXG4gICAgcmV0dXJuIGAke0lOVEVSTkFMX0FVVEhfVkVSU0lPTn0gJHtyZWZyZXNoVG9rZW59YDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KHsgYXBwQ29uZmlnLCBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIgfSwgeyBmaWQgfSkge1xyXG4gICAgY29uc3QgZW5kcG9pbnQgPSBnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzKGFwcENvbmZpZyk7XHJcbiAgICAvLyBJZiBoZWFydGJlYXQgc2VydmljZSBleGlzdHMsIGFkZCB0aGUgaGVhcnRiZWF0IHN0cmluZyB0byB0aGUgaGVhZGVyLlxyXG4gICAgY29uc3QgaGVhcnRiZWF0U2VydmljZSA9IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlci5nZXRJbW1lZGlhdGUoe1xyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIGlmIChoZWFydGJlYXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgaGVhcnRiZWF0c0hlYWRlciA9IGF3YWl0IGhlYXJ0YmVhdFNlcnZpY2UuZ2V0SGVhcnRiZWF0c0hlYWRlcigpO1xyXG4gICAgICAgIGlmIChoZWFydGJlYXRzSGVhZGVyKSB7XHJcbiAgICAgICAgICAgIGhlYWRlcnMuYXBwZW5kKCd4LWZpcmViYXNlLWNsaWVudCcsIGhlYXJ0YmVhdHNIZWFkZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgZmlkLFxyXG4gICAgICAgIGF1dGhWZXJzaW9uOiBJTlRFUk5BTF9BVVRIX1ZFUlNJT04sXHJcbiAgICAgICAgYXBwSWQ6IGFwcENvbmZpZy5hcHBJZCxcclxuICAgICAgICBzZGtWZXJzaW9uOiBQQUNLQUdFX1ZFUlNJT05cclxuICAgIH07XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcclxuICAgIH07XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJldHJ5SWZTZXJ2ZXJFcnJvcigoKSA9PiBmZXRjaChlbmRwb2ludCwgcmVxdWVzdCkpO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VWYWx1ZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkgPSB7XHJcbiAgICAgICAgICAgIGZpZDogcmVzcG9uc2VWYWx1ZS5maWQgfHwgZmlkLFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25TdGF0dXM6IDIgLyogUmVxdWVzdFN0YXR1cy5DT01QTEVURUQgKi8sXHJcbiAgICAgICAgICAgIHJlZnJlc2hUb2tlbjogcmVzcG9uc2VWYWx1ZS5yZWZyZXNoVG9rZW4sXHJcbiAgICAgICAgICAgIGF1dGhUb2tlbjogZXh0cmFjdEF1dGhUb2tlbkluZm9Gcm9tUmVzcG9uc2UocmVzcG9uc2VWYWx1ZS5hdXRoVG9rZW4pXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gcmVnaXN0ZXJlZEluc3RhbGxhdGlvbkVudHJ5O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgYXdhaXQgZ2V0RXJyb3JGcm9tUmVzcG9uc2UoJ0NyZWF0ZSBJbnN0YWxsYXRpb24nLCByZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqIFJldHVybnMgYSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgYWZ0ZXIgZ2l2ZW4gdGltZSBwYXNzZXMuICovXHJcbmZ1bmN0aW9uIHNsZWVwKG1zKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XHJcbiAgICAgICAgc2V0VGltZW91dChyZXNvbHZlLCBtcyk7XHJcbiAgICB9KTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBidWZmZXJUb0Jhc2U2NFVybFNhZmUoYXJyYXkpIHtcclxuICAgIGNvbnN0IGI2NCA9IGJ0b2EoU3RyaW5nLmZyb21DaGFyQ29kZSguLi5hcnJheSkpO1xyXG4gICAgcmV0dXJuIGI2NC5yZXBsYWNlKC9cXCsvZywgJy0nKS5yZXBsYWNlKC9cXC8vZywgJ18nKTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBWQUxJRF9GSURfUEFUVEVSTiA9IC9eW2NkZWZdW1xcdy1dezIxfSQvO1xyXG5jb25zdCBJTlZBTElEX0ZJRCA9ICcnO1xyXG4vKipcclxuICogR2VuZXJhdGVzIGEgbmV3IEZJRCB1c2luZyByYW5kb20gdmFsdWVzIGZyb20gV2ViIENyeXB0byBBUEkuXHJcbiAqIFJldHVybnMgYW4gZW1wdHkgc3RyaW5nIGlmIEZJRCBnZW5lcmF0aW9uIGZhaWxzIGZvciBhbnkgcmVhc29uLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2VuZXJhdGVGaWQoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIC8vIEEgdmFsaWQgRklEIGhhcyBleGFjdGx5IDIyIGJhc2U2NCBjaGFyYWN0ZXJzLCB3aGljaCBpcyAxMzIgYml0cywgb3IgMTYuNVxyXG4gICAgICAgIC8vIGJ5dGVzLiBvdXIgaW1wbGVtZW50YXRpb24gZ2VuZXJhdGVzIGEgMTcgYnl0ZSBhcnJheSBpbnN0ZWFkLlxyXG4gICAgICAgIGNvbnN0IGZpZEJ5dGVBcnJheSA9IG5ldyBVaW50OEFycmF5KDE3KTtcclxuICAgICAgICBjb25zdCBjcnlwdG8gPSBzZWxmLmNyeXB0byB8fCBzZWxmLm1zQ3J5cHRvO1xyXG4gICAgICAgIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMoZmlkQnl0ZUFycmF5KTtcclxuICAgICAgICAvLyBSZXBsYWNlIHRoZSBmaXJzdCA0IHJhbmRvbSBiaXRzIHdpdGggdGhlIGNvbnN0YW50IEZJRCBoZWFkZXIgb2YgMGIwMTExLlxyXG4gICAgICAgIGZpZEJ5dGVBcnJheVswXSA9IDBiMDExMTAwMDAgKyAoZmlkQnl0ZUFycmF5WzBdICUgMGIwMDAxMDAwMCk7XHJcbiAgICAgICAgY29uc3QgZmlkID0gZW5jb2RlKGZpZEJ5dGVBcnJheSk7XHJcbiAgICAgICAgcmV0dXJuIFZBTElEX0ZJRF9QQVRURVJOLnRlc3QoZmlkKSA/IGZpZCA6IElOVkFMSURfRklEO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKF9hKSB7XHJcbiAgICAgICAgLy8gRklEIGdlbmVyYXRpb24gZXJyb3JlZFxyXG4gICAgICAgIHJldHVybiBJTlZBTElEX0ZJRDtcclxuICAgIH1cclxufVxyXG4vKiogQ29udmVydHMgYSBGSUQgVWludDhBcnJheSB0byBhIGJhc2U2NCBzdHJpbmcgcmVwcmVzZW50YXRpb24uICovXHJcbmZ1bmN0aW9uIGVuY29kZShmaWRCeXRlQXJyYXkpIHtcclxuICAgIGNvbnN0IGI2NFN0cmluZyA9IGJ1ZmZlclRvQmFzZTY0VXJsU2FmZShmaWRCeXRlQXJyYXkpO1xyXG4gICAgLy8gUmVtb3ZlIHRoZSAyM3JkIGNoYXJhY3RlciB0aGF0IHdhcyBhZGRlZCBiZWNhdXNlIG9mIHRoZSBleHRyYSA0IGJpdHMgYXQgdGhlXHJcbiAgICAvLyBlbmQgb2Ygb3VyIDE3IGJ5dGUgYXJyYXksIGFuZCB0aGUgJz0nIHBhZGRpbmcuXHJcbiAgICByZXR1cm4gYjY0U3RyaW5nLnN1YnN0cigwLCAyMik7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqIFJldHVybnMgYSBzdHJpbmcga2V5IHRoYXQgY2FuIGJlIHVzZWQgdG8gaWRlbnRpZnkgdGhlIGFwcC4gKi9cclxuZnVuY3Rpb24gZ2V0S2V5KGFwcENvbmZpZykge1xyXG4gICAgcmV0dXJuIGAke2FwcENvbmZpZy5hcHBOYW1lfSEke2FwcENvbmZpZy5hcHBJZH1gO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGZpZENoYW5nZUNhbGxiYWNrcyA9IG5ldyBNYXAoKTtcclxuLyoqXHJcbiAqIENhbGxzIHRoZSBvbklkQ2hhbmdlIGNhbGxiYWNrcyB3aXRoIHRoZSBuZXcgRklEIHZhbHVlLCBhbmQgYnJvYWRjYXN0cyB0aGVcclxuICogY2hhbmdlIHRvIG90aGVyIHRhYnMuXHJcbiAqL1xyXG5mdW5jdGlvbiBmaWRDaGFuZ2VkKGFwcENvbmZpZywgZmlkKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNhbGxGaWRDaGFuZ2VDYWxsYmFja3Moa2V5LCBmaWQpO1xyXG4gICAgYnJvYWRjYXN0RmlkQ2hhbmdlKGtleSwgZmlkKTtcclxufVxyXG5mdW5jdGlvbiBhZGRDYWxsYmFjayhhcHBDb25maWcsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBPcGVuIHRoZSBicm9hZGNhc3QgY2hhbm5lbCBpZiBpdCdzIG5vdCBhbHJlYWR5IG9wZW4sXHJcbiAgICAvLyB0byBiZSBhYmxlIHRvIGxpc3RlbiB0byBjaGFuZ2UgZXZlbnRzIGZyb20gb3RoZXIgdGFicy5cclxuICAgIGdldEJyb2FkY2FzdENoYW5uZWwoKTtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgbGV0IGNhbGxiYWNrU2V0ID0gZmlkQ2hhbmdlQ2FsbGJhY2tzLmdldChrZXkpO1xyXG4gICAgaWYgKCFjYWxsYmFja1NldCkge1xyXG4gICAgICAgIGNhbGxiYWNrU2V0ID0gbmV3IFNldCgpO1xyXG4gICAgICAgIGZpZENoYW5nZUNhbGxiYWNrcy5zZXQoa2V5LCBjYWxsYmFja1NldCk7XHJcbiAgICB9XHJcbiAgICBjYWxsYmFja1NldC5hZGQoY2FsbGJhY2spO1xyXG59XHJcbmZ1bmN0aW9uIHJlbW92ZUNhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgY29uc3QgY2FsbGJhY2tTZXQgPSBmaWRDaGFuZ2VDYWxsYmFja3MuZ2V0KGtleSk7XHJcbiAgICBpZiAoIWNhbGxiYWNrU2V0KSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgY2FsbGJhY2tTZXQuZGVsZXRlKGNhbGxiYWNrKTtcclxuICAgIGlmIChjYWxsYmFja1NldC5zaXplID09PSAwKSB7XHJcbiAgICAgICAgZmlkQ2hhbmdlQ2FsbGJhY2tzLmRlbGV0ZShrZXkpO1xyXG4gICAgfVxyXG4gICAgLy8gQ2xvc2UgYnJvYWRjYXN0IGNoYW5uZWwgaWYgdGhlcmUgYXJlIG5vIG1vcmUgY2FsbGJhY2tzLlxyXG4gICAgY2xvc2VCcm9hZGNhc3RDaGFubmVsKCk7XHJcbn1cclxuZnVuY3Rpb24gY2FsbEZpZENoYW5nZUNhbGxiYWNrcyhrZXksIGZpZCkge1xyXG4gICAgY29uc3QgY2FsbGJhY2tzID0gZmlkQ2hhbmdlQ2FsbGJhY2tzLmdldChrZXkpO1xyXG4gICAgaWYgKCFjYWxsYmFja3MpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBmb3IgKGNvbnN0IGNhbGxiYWNrIG9mIGNhbGxiYWNrcykge1xyXG4gICAgICAgIGNhbGxiYWNrKGZpZCk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gYnJvYWRjYXN0RmlkQ2hhbmdlKGtleSwgZmlkKSB7XHJcbiAgICBjb25zdCBjaGFubmVsID0gZ2V0QnJvYWRjYXN0Q2hhbm5lbCgpO1xyXG4gICAgaWYgKGNoYW5uZWwpIHtcclxuICAgICAgICBjaGFubmVsLnBvc3RNZXNzYWdlKHsga2V5LCBmaWQgfSk7XHJcbiAgICB9XHJcbiAgICBjbG9zZUJyb2FkY2FzdENoYW5uZWwoKTtcclxufVxyXG5sZXQgYnJvYWRjYXN0Q2hhbm5lbCA9IG51bGw7XHJcbi8qKiBPcGVucyBhbmQgcmV0dXJucyBhIEJyb2FkY2FzdENoYW5uZWwgaWYgaXQgaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLiAqL1xyXG5mdW5jdGlvbiBnZXRCcm9hZGNhc3RDaGFubmVsKCkge1xyXG4gICAgaWYgKCFicm9hZGNhc3RDaGFubmVsICYmICdCcm9hZGNhc3RDaGFubmVsJyBpbiBzZWxmKSB7XHJcbiAgICAgICAgYnJvYWRjYXN0Q2hhbm5lbCA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKCdbRmlyZWJhc2VdIEZJRCBDaGFuZ2UnKTtcclxuICAgICAgICBicm9hZGNhc3RDaGFubmVsLm9ubWVzc2FnZSA9IGUgPT4ge1xyXG4gICAgICAgICAgICBjYWxsRmlkQ2hhbmdlQ2FsbGJhY2tzKGUuZGF0YS5rZXksIGUuZGF0YS5maWQpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYnJvYWRjYXN0Q2hhbm5lbDtcclxufVxyXG5mdW5jdGlvbiBjbG9zZUJyb2FkY2FzdENoYW5uZWwoKSB7XHJcbiAgICBpZiAoZmlkQ2hhbmdlQ2FsbGJhY2tzLnNpemUgPT09IDAgJiYgYnJvYWRjYXN0Q2hhbm5lbCkge1xyXG4gICAgICAgIGJyb2FkY2FzdENoYW5uZWwuY2xvc2UoKTtcclxuICAgICAgICBicm9hZGNhc3RDaGFubmVsID0gbnVsbDtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBEQVRBQkFTRV9OQU1FID0gJ2ZpcmViYXNlLWluc3RhbGxhdGlvbnMtZGF0YWJhc2UnO1xyXG5jb25zdCBEQVRBQkFTRV9WRVJTSU9OID0gMTtcclxuY29uc3QgT0JKRUNUX1NUT1JFX05BTUUgPSAnZmlyZWJhc2UtaW5zdGFsbGF0aW9ucy1zdG9yZSc7XHJcbmxldCBkYlByb21pc2UgPSBudWxsO1xyXG5mdW5jdGlvbiBnZXREYlByb21pc2UoKSB7XHJcbiAgICBpZiAoIWRiUHJvbWlzZSkge1xyXG4gICAgICAgIGRiUHJvbWlzZSA9IG9wZW5EQihEQVRBQkFTRV9OQU1FLCBEQVRBQkFTRV9WRVJTSU9OLCB7XHJcbiAgICAgICAgICAgIHVwZ3JhZGU6IChkYiwgb2xkVmVyc2lvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8gV2UgZG9uJ3QgdXNlICdicmVhaycgaW4gdGhpcyBzd2l0Y2ggc3RhdGVtZW50LCB0aGUgZmFsbC10aHJvdWdoXHJcbiAgICAgICAgICAgICAgICAvLyBiZWhhdmlvciBpcyB3aGF0IHdlIHdhbnQsIGJlY2F1c2UgaWYgdGhlcmUgYXJlIG11bHRpcGxlIHZlcnNpb25zIGJldHdlZW5cclxuICAgICAgICAgICAgICAgIC8vIHRoZSBvbGQgdmVyc2lvbiBhbmQgdGhlIGN1cnJlbnQgdmVyc2lvbiwgd2Ugd2FudCBBTEwgdGhlIG1pZ3JhdGlvbnNcclxuICAgICAgICAgICAgICAgIC8vIHRoYXQgY29ycmVzcG9uZCB0byB0aG9zZSB2ZXJzaW9ucyB0byBydW4sIG5vdCBvbmx5IHRoZSBsYXN0IG9uZS5cclxuICAgICAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBkZWZhdWx0LWNhc2VcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAob2xkVmVyc2lvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGIuY3JlYXRlT2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGJQcm9taXNlO1xyXG59XHJcbi8qKiBBc3NpZ25zIG9yIG92ZXJ3cml0ZXMgdGhlIHJlY29yZCBmb3IgdGhlIGdpdmVuIGtleSB3aXRoIHRoZSBnaXZlbiB2YWx1ZS4gKi9cclxuYXN5bmMgZnVuY3Rpb24gc2V0KGFwcENvbmZpZywgdmFsdWUpIHtcclxuICAgIGNvbnN0IGtleSA9IGdldEtleShhcHBDb25maWcpO1xyXG4gICAgY29uc3QgZGIgPSBhd2FpdCBnZXREYlByb21pc2UoKTtcclxuICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24oT0JKRUNUX1NUT1JFX05BTUUsICdyZWFkd3JpdGUnKTtcclxuICAgIGNvbnN0IG9iamVjdFN0b3JlID0gdHgub2JqZWN0U3RvcmUoT0JKRUNUX1NUT1JFX05BTUUpO1xyXG4gICAgY29uc3Qgb2xkVmFsdWUgPSAoYXdhaXQgb2JqZWN0U3RvcmUuZ2V0KGtleSkpO1xyXG4gICAgYXdhaXQgb2JqZWN0U3RvcmUucHV0KHZhbHVlLCBrZXkpO1xyXG4gICAgYXdhaXQgdHguZG9uZTtcclxuICAgIGlmICghb2xkVmFsdWUgfHwgb2xkVmFsdWUuZmlkICE9PSB2YWx1ZS5maWQpIHtcclxuICAgICAgICBmaWRDaGFuZ2VkKGFwcENvbmZpZywgdmFsdWUuZmlkKTtcclxuICAgIH1cclxuICAgIHJldHVybiB2YWx1ZTtcclxufVxyXG4vKiogUmVtb3ZlcyByZWNvcmQocykgZnJvbSB0aGUgb2JqZWN0U3RvcmUgdGhhdCBtYXRjaCB0aGUgZ2l2ZW4ga2V5LiAqL1xyXG5hc3luYyBmdW5jdGlvbiByZW1vdmUoYXBwQ29uZmlnKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICBhd2FpdCB0eC5vYmplY3RTdG9yZShPQkpFQ1RfU1RPUkVfTkFNRSkuZGVsZXRlKGtleSk7XHJcbiAgICBhd2FpdCB0eC5kb25lO1xyXG59XHJcbi8qKlxyXG4gKiBBdG9taWNhbGx5IHVwZGF0ZXMgYSByZWNvcmQgd2l0aCB0aGUgcmVzdWx0IG9mIHVwZGF0ZUZuLCB3aGljaCBnZXRzXHJcbiAqIGNhbGxlZCB3aXRoIHRoZSBjdXJyZW50IHZhbHVlLiBJZiBuZXdWYWx1ZSBpcyB1bmRlZmluZWQsIHRoZSByZWNvcmQgaXNcclxuICogZGVsZXRlZCBpbnN0ZWFkLlxyXG4gKiBAcmV0dXJuIFVwZGF0ZWQgdmFsdWVcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHVwZGF0ZShhcHBDb25maWcsIHVwZGF0ZUZuKSB7XHJcbiAgICBjb25zdCBrZXkgPSBnZXRLZXkoYXBwQ29uZmlnKTtcclxuICAgIGNvbnN0IGRiID0gYXdhaXQgZ2V0RGJQcm9taXNlKCk7XHJcbiAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKE9CSkVDVF9TVE9SRV9OQU1FLCAncmVhZHdyaXRlJyk7XHJcbiAgICBjb25zdCBzdG9yZSA9IHR4Lm9iamVjdFN0b3JlKE9CSkVDVF9TVE9SRV9OQU1FKTtcclxuICAgIGNvbnN0IG9sZFZhbHVlID0gKGF3YWl0IHN0b3JlLmdldChrZXkpKTtcclxuICAgIGNvbnN0IG5ld1ZhbHVlID0gdXBkYXRlRm4ob2xkVmFsdWUpO1xyXG4gICAgaWYgKG5ld1ZhbHVlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBhd2FpdCBzdG9yZS5kZWxldGUoa2V5KTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGF3YWl0IHN0b3JlLnB1dChuZXdWYWx1ZSwga2V5KTtcclxuICAgIH1cclxuICAgIGF3YWl0IHR4LmRvbmU7XHJcbiAgICBpZiAobmV3VmFsdWUgJiYgKCFvbGRWYWx1ZSB8fCBvbGRWYWx1ZS5maWQgIT09IG5ld1ZhbHVlLmZpZCkpIHtcclxuICAgICAgICBmaWRDaGFuZ2VkKGFwcENvbmZpZywgbmV3VmFsdWUuZmlkKTtcclxuICAgIH1cclxuICAgIHJldHVybiBuZXdWYWx1ZTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVXBkYXRlcyBhbmQgcmV0dXJucyB0aGUgSW5zdGFsbGF0aW9uRW50cnkgZnJvbSB0aGUgZGF0YWJhc2UuXHJcbiAqIEFsc28gdHJpZ2dlcnMgYSByZWdpc3RyYXRpb24gcmVxdWVzdCBpZiBpdCBpcyBuZWNlc3NhcnkgYW5kIHBvc3NpYmxlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9ucykge1xyXG4gICAgbGV0IHJlZ2lzdHJhdGlvblByb21pc2U7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25FbnRyeSA9IGF3YWl0IHVwZGF0ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGluc3RhbGxhdGlvbkVudHJ5ID0gdXBkYXRlT3JDcmVhdGVJbnN0YWxsYXRpb25FbnRyeShvbGRFbnRyeSk7XHJcbiAgICAgICAgY29uc3QgZW50cnlXaXRoUHJvbWlzZSA9IHRyaWdnZXJSZWdpc3RyYXRpb25JZk5lY2Vzc2FyeShpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZSA9IGVudHJ5V2l0aFByb21pc2UucmVnaXN0cmF0aW9uUHJvbWlzZTtcclxuICAgICAgICByZXR1cm4gZW50cnlXaXRoUHJvbWlzZS5pbnN0YWxsYXRpb25FbnRyeTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGluc3RhbGxhdGlvbkVudHJ5LmZpZCA9PT0gSU5WQUxJRF9GSUQpIHtcclxuICAgICAgICAvLyBGSUQgZ2VuZXJhdGlvbiBmYWlsZWQuIFdhaXRpbmcgZm9yIHRoZSBGSUQgZnJvbSB0aGUgc2VydmVyLlxyXG4gICAgICAgIHJldHVybiB7IGluc3RhbGxhdGlvbkVudHJ5OiBhd2FpdCByZWdpc3RyYXRpb25Qcm9taXNlIH07XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LFxyXG4gICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2VcclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIENyZWF0ZXMgYSBuZXcgSW5zdGFsbGF0aW9uIEVudHJ5IGlmIG9uZSBkb2VzIG5vdCBleGlzdC5cclxuICogQWxzbyBjbGVhcnMgdGltZWQgb3V0IHBlbmRpbmcgcmVxdWVzdHMuXHJcbiAqL1xyXG5mdW5jdGlvbiB1cGRhdGVPckNyZWF0ZUluc3RhbGxhdGlvbkVudHJ5KG9sZEVudHJ5KSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IG9sZEVudHJ5IHx8IHtcclxuICAgICAgICBmaWQ6IGdlbmVyYXRlRmlkKCksXHJcbiAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAwIC8qIFJlcXVlc3RTdGF0dXMuTk9UX1NUQVJURUQgKi9cclxuICAgIH07XHJcbiAgICByZXR1cm4gY2xlYXJUaW1lZE91dFJlcXVlc3QoZW50cnkpO1xyXG59XHJcbi8qKlxyXG4gKiBJZiB0aGUgRmlyZWJhc2UgSW5zdGFsbGF0aW9uIGlzIG5vdCByZWdpc3RlcmVkIHlldCwgdGhpcyB3aWxsIHRyaWdnZXIgdGhlXHJcbiAqIHJlZ2lzdHJhdGlvbiBhbmQgcmV0dXJuIGFuIEluUHJvZ3Jlc3NJbnN0YWxsYXRpb25FbnRyeS5cclxuICpcclxuICogSWYgcmVnaXN0cmF0aW9uUHJvbWlzZSBkb2VzIG5vdCBleGlzdCwgdGhlIGluc3RhbGxhdGlvbkVudHJ5IGlzIGd1YXJhbnRlZWRcclxuICogdG8gYmUgcmVnaXN0ZXJlZC5cclxuICovXHJcbmZ1bmN0aW9uIHRyaWdnZXJSZWdpc3RyYXRpb25JZk5lY2Vzc2FyeShpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgaWYgKGluc3RhbGxhdGlvbkVudHJ5LnJlZ2lzdHJhdGlvblN0YXR1cyA9PT0gMCAvKiBSZXF1ZXN0U3RhdHVzLk5PVF9TVEFSVEVEICovKSB7XHJcbiAgICAgICAgaWYgKCFuYXZpZ2F0b3Iub25MaW5lKSB7XHJcbiAgICAgICAgICAgIC8vIFJlZ2lzdHJhdGlvbiByZXF1aXJlZCBidXQgYXBwIGlzIG9mZmxpbmUuXHJcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lzdHJhdGlvblByb21pc2VXaXRoRXJyb3IgPSBQcm9taXNlLnJlamVjdChFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFwcC1vZmZsaW5lXCIgLyogRXJyb3JDb2RlLkFQUF9PRkZMSU5FICovKSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YWxsYXRpb25FbnRyeSxcclxuICAgICAgICAgICAgICAgIHJlZ2lzdHJhdGlvblByb21pc2U6IHJlZ2lzdHJhdGlvblByb21pc2VXaXRoRXJyb3JcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gVHJ5IHJlZ2lzdGVyaW5nLiBDaGFuZ2Ugc3RhdHVzIHRvIElOX1BST0dSRVNTLlxyXG4gICAgICAgIGNvbnN0IGluUHJvZ3Jlc3NFbnRyeSA9IHtcclxuICAgICAgICAgICAgZmlkOiBpbnN0YWxsYXRpb25FbnRyeS5maWQsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMSAvKiBSZXF1ZXN0U3RhdHVzLklOX1BST0dSRVNTICovLFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25UaW1lOiBEYXRlLm5vdygpXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCByZWdpc3RyYXRpb25Qcm9taXNlID0gcmVnaXN0ZXJJbnN0YWxsYXRpb24oaW5zdGFsbGF0aW9ucywgaW5Qcm9ncmVzc0VudHJ5KTtcclxuICAgICAgICByZXR1cm4geyBpbnN0YWxsYXRpb25FbnRyeTogaW5Qcm9ncmVzc0VudHJ5LCByZWdpc3RyYXRpb25Qcm9taXNlIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIGlmIChpbnN0YWxsYXRpb25FbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDEgLyogUmVxdWVzdFN0YXR1cy5JTl9QUk9HUkVTUyAqLykge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGluc3RhbGxhdGlvbkVudHJ5LFxyXG4gICAgICAgICAgICByZWdpc3RyYXRpb25Qcm9taXNlOiB3YWl0VW50aWxGaWRSZWdpc3RyYXRpb24oaW5zdGFsbGF0aW9ucylcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgaW5zdGFsbGF0aW9uRW50cnkgfTtcclxuICAgIH1cclxufVxyXG4vKiogVGhpcyB3aWxsIGJlIGV4ZWN1dGVkIG9ubHkgb25jZSBmb3IgZWFjaCBuZXcgRmlyZWJhc2UgSW5zdGFsbGF0aW9uLiAqL1xyXG5hc3luYyBmdW5jdGlvbiByZWdpc3Rlckluc3RhbGxhdGlvbihpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkgPSBhd2FpdCBjcmVhdGVJbnN0YWxsYXRpb25SZXF1ZXN0KGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICByZXR1cm4gc2V0KGluc3RhbGxhdGlvbnMuYXBwQ29uZmlnLCByZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoaXNTZXJ2ZXJFcnJvcihlKSAmJiBlLmN1c3RvbURhdGEuc2VydmVyQ29kZSA9PT0gNDA5KSB7XHJcbiAgICAgICAgICAgIC8vIFNlcnZlciByZXR1cm5lZCBhIFwiRklEIGNhbiBub3QgYmUgdXNlZFwiIGVycm9yLlxyXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG5ldyBJRCBuZXh0IHRpbWUuXHJcbiAgICAgICAgICAgIGF3YWl0IHJlbW92ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBSZWdpc3RyYXRpb24gZmFpbGVkLiBTZXQgRklEIGFzIG5vdCByZWdpc3RlcmVkLlxyXG4gICAgICAgICAgICBhd2FpdCBzZXQoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIHtcclxuICAgICAgICAgICAgICAgIGZpZDogaW5zdGFsbGF0aW9uRW50cnkuZmlkLFxyXG4gICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uU3RhdHVzOiAwIC8qIFJlcXVlc3RTdGF0dXMuTk9UX1NUQVJURUQgKi9cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IGU7XHJcbiAgICB9XHJcbn1cclxuLyoqIENhbGwgaWYgRklEIHJlZ2lzdHJhdGlvbiBpcyBwZW5kaW5nIGluIGFub3RoZXIgcmVxdWVzdC4gKi9cclxuYXN5bmMgZnVuY3Rpb24gd2FpdFVudGlsRmlkUmVnaXN0cmF0aW9uKGluc3RhbGxhdGlvbnMpIHtcclxuICAgIC8vIFVuZm9ydHVuYXRlbHksIHRoZXJlIGlzIG5vIHdheSBvZiByZWxpYWJseSBvYnNlcnZpbmcgd2hlbiBhIHZhbHVlIGluXHJcbiAgICAvLyBJbmRleGVkREIgY2hhbmdlcyAoeWV0LCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL1dJQ0cvaW5kZXhlZC1kYi1vYnNlcnZlcnMpLFxyXG4gICAgLy8gc28gd2UgbmVlZCB0byBwb2xsLlxyXG4gICAgbGV0IGVudHJ5ID0gYXdhaXQgdXBkYXRlSW5zdGFsbGF0aW9uUmVxdWVzdChpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICB3aGlsZSAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAxIC8qIFJlcXVlc3RTdGF0dXMuSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAvLyBjcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdCBzdGlsbCBpbiBwcm9ncmVzcy5cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDApO1xyXG4gICAgICAgIGVudHJ5ID0gYXdhaXQgdXBkYXRlSW5zdGFsbGF0aW9uUmVxdWVzdChpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICB9XHJcbiAgICBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAwIC8qIFJlcXVlc3RTdGF0dXMuTk9UX1NUQVJURUQgKi8pIHtcclxuICAgICAgICAvLyBUaGUgcmVxdWVzdCB0aW1lZCBvdXQgb3IgZmFpbGVkIGluIGEgZGlmZmVyZW50IGNhbGwuIFRyeSBhZ2Fpbi5cclxuICAgICAgICBjb25zdCB7IGluc3RhbGxhdGlvbkVudHJ5LCByZWdpc3RyYXRpb25Qcm9taXNlIH0gPSBhd2FpdCBnZXRJbnN0YWxsYXRpb25FbnRyeShpbnN0YWxsYXRpb25zKTtcclxuICAgICAgICBpZiAocmVnaXN0cmF0aW9uUHJvbWlzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVnaXN0cmF0aW9uUHJvbWlzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIG5vIHJlZ2lzdHJhdGlvblByb21pc2UsIGVudHJ5IGlzIHJlZ2lzdGVyZWQuXHJcbiAgICAgICAgICAgIHJldHVybiBpbnN0YWxsYXRpb25FbnRyeTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbn1cclxuLyoqXHJcbiAqIENhbGxlZCBvbmx5IGlmIHRoZXJlIGlzIGEgQ3JlYXRlSW5zdGFsbGF0aW9uIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAqXHJcbiAqIFVwZGF0ZXMgdGhlIEluc3RhbGxhdGlvbkVudHJ5IGluIHRoZSBEQiBiYXNlZCBvbiB0aGUgc3RhdHVzIG9mIHRoZVxyXG4gKiBDcmVhdGVJbnN0YWxsYXRpb24gcmVxdWVzdC5cclxuICpcclxuICogUmV0dXJucyB0aGUgdXBkYXRlZCBJbnN0YWxsYXRpb25FbnRyeS5cclxuICovXHJcbmZ1bmN0aW9uIHVwZGF0ZUluc3RhbGxhdGlvblJlcXVlc3QoYXBwQ29uZmlnKSB7XHJcbiAgICByZXR1cm4gdXBkYXRlKGFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGlmICghb2xkRW50cnkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnN0YWxsYXRpb24tbm90LWZvdW5kXCIgLyogRXJyb3JDb2RlLklOU1RBTExBVElPTl9OT1RfRk9VTkQgKi8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY2xlYXJUaW1lZE91dFJlcXVlc3Qob2xkRW50cnkpO1xyXG4gICAgfSk7XHJcbn1cclxuZnVuY3Rpb24gY2xlYXJUaW1lZE91dFJlcXVlc3QoZW50cnkpIHtcclxuICAgIGlmIChoYXNJbnN0YWxsYXRpb25SZXF1ZXN0VGltZWRPdXQoZW50cnkpKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZmlkOiBlbnRyeS5maWQsXHJcbiAgICAgICAgICAgIHJlZ2lzdHJhdGlvblN0YXR1czogMCAvKiBSZXF1ZXN0U3RhdHVzLk5PVF9TVEFSVEVEICovXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBlbnRyeTtcclxufVxyXG5mdW5jdGlvbiBoYXNJbnN0YWxsYXRpb25SZXF1ZXN0VGltZWRPdXQoaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIHJldHVybiAoaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAxIC8qIFJlcXVlc3RTdGF0dXMuSU5fUFJPR1JFU1MgKi8gJiZcclxuICAgICAgICBpbnN0YWxsYXRpb25FbnRyeS5yZWdpc3RyYXRpb25UaW1lICsgUEVORElOR19USU1FT1VUX01TIDwgRGF0ZS5ub3coKSk7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2VuZXJhdGVBdXRoVG9rZW5SZXF1ZXN0KHsgYXBwQ29uZmlnLCBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIgfSwgaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIGNvbnN0IGVuZHBvaW50ID0gZ2V0R2VuZXJhdGVBdXRoVG9rZW5FbmRwb2ludChhcHBDb25maWcsIGluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgIGNvbnN0IGhlYWRlcnMgPSBnZXRIZWFkZXJzV2l0aEF1dGgoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAvLyBJZiBoZWFydGJlYXQgc2VydmljZSBleGlzdHMsIGFkZCB0aGUgaGVhcnRiZWF0IHN0cmluZyB0byB0aGUgaGVhZGVyLlxyXG4gICAgY29uc3QgaGVhcnRiZWF0U2VydmljZSA9IGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlci5nZXRJbW1lZGlhdGUoe1xyXG4gICAgICAgIG9wdGlvbmFsOiB0cnVlXHJcbiAgICB9KTtcclxuICAgIGlmIChoZWFydGJlYXRTZXJ2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgaGVhcnRiZWF0c0hlYWRlciA9IGF3YWl0IGhlYXJ0YmVhdFNlcnZpY2UuZ2V0SGVhcnRiZWF0c0hlYWRlcigpO1xyXG4gICAgICAgIGlmIChoZWFydGJlYXRzSGVhZGVyKSB7XHJcbiAgICAgICAgICAgIGhlYWRlcnMuYXBwZW5kKCd4LWZpcmViYXNlLWNsaWVudCcsIGhlYXJ0YmVhdHNIZWFkZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNvbnN0IGJvZHkgPSB7XHJcbiAgICAgICAgaW5zdGFsbGF0aW9uOiB7XHJcbiAgICAgICAgICAgIHNka1ZlcnNpb246IFBBQ0tBR0VfVkVSU0lPTixcclxuICAgICAgICAgICAgYXBwSWQ6IGFwcENvbmZpZy5hcHBJZFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGhlYWRlcnMsXHJcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keSlcclxuICAgIH07XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJldHJ5SWZTZXJ2ZXJFcnJvcigoKSA9PiBmZXRjaChlbmRwb2ludCwgcmVxdWVzdCkpO1xyXG4gICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2VWYWx1ZSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICBjb25zdCBjb21wbGV0ZWRBdXRoVG9rZW4gPSBleHRyYWN0QXV0aFRva2VuSW5mb0Zyb21SZXNwb25zZShyZXNwb25zZVZhbHVlKTtcclxuICAgICAgICByZXR1cm4gY29tcGxldGVkQXV0aFRva2VuO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgYXdhaXQgZ2V0RXJyb3JGcm9tUmVzcG9uc2UoJ0dlbmVyYXRlIEF1dGggVG9rZW4nLCByZXNwb25zZSk7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZ2V0R2VuZXJhdGVBdXRoVG9rZW5FbmRwb2ludChhcHBDb25maWcsIHsgZmlkIH0pIHtcclxuICAgIHJldHVybiBgJHtnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQoYXBwQ29uZmlnKX0vJHtmaWR9L2F1dGhUb2tlbnM6Z2VuZXJhdGVgO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBSZXR1cm5zIGEgdmFsaWQgYXV0aGVudGljYXRpb24gdG9rZW4gZm9yIHRoZSBpbnN0YWxsYXRpb24uIEdlbmVyYXRlcyBhIG5ld1xyXG4gKiB0b2tlbiBpZiBvbmUgZG9lc24ndCBleGlzdCwgaXMgZXhwaXJlZCBvciBhYm91dCB0byBleHBpcmUuXHJcbiAqXHJcbiAqIFNob3VsZCBvbmx5IGJlIGNhbGxlZCBpZiB0aGUgRmlyZWJhc2UgSW5zdGFsbGF0aW9uIGlzIHJlZ2lzdGVyZWQuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiByZWZyZXNoQXV0aFRva2VuKGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCA9IGZhbHNlKSB7XHJcbiAgICBsZXQgdG9rZW5Qcm9taXNlO1xyXG4gICAgY29uc3QgZW50cnkgPSBhd2FpdCB1cGRhdGUoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcsIG9sZEVudHJ5ID0+IHtcclxuICAgICAgICBpZiAoIWlzRW50cnlSZWdpc3RlcmVkKG9sZEVudHJ5KSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vdC1yZWdpc3RlcmVkXCIgLyogRXJyb3JDb2RlLk5PVF9SRUdJU1RFUkVEICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgb2xkQXV0aFRva2VuID0gb2xkRW50cnkuYXV0aFRva2VuO1xyXG4gICAgICAgIGlmICghZm9yY2VSZWZyZXNoICYmIGlzQXV0aFRva2VuVmFsaWQob2xkQXV0aFRva2VuKSkge1xyXG4gICAgICAgICAgICAvLyBUaGVyZSBpcyBhIHZhbGlkIHRva2VuIGluIHRoZSBEQi5cclxuICAgICAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChvbGRBdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMSAvKiBSZXF1ZXN0U3RhdHVzLklOX1BST0dSRVNTICovKSB7XHJcbiAgICAgICAgICAgIC8vIFRoZXJlIGFscmVhZHkgaXMgYSB0b2tlbiByZXF1ZXN0IGluIHByb2dyZXNzLlxyXG4gICAgICAgICAgICB0b2tlblByb21pc2UgPSB3YWl0VW50aWxBdXRoVG9rZW5SZXF1ZXN0KGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCk7XHJcbiAgICAgICAgICAgIHJldHVybiBvbGRFbnRyeTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIE5vIHRva2VuIG9yIHRva2VuIGV4cGlyZWQuXHJcbiAgICAgICAgICAgIGlmICghbmF2aWdhdG9yLm9uTGluZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhcHAtb2ZmbGluZVwiIC8qIEVycm9yQ29kZS5BUFBfT0ZGTElORSAqLyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgaW5Qcm9ncmVzc0VudHJ5ID0gbWFrZUF1dGhUb2tlblJlcXVlc3RJblByb2dyZXNzRW50cnkob2xkRW50cnkpO1xyXG4gICAgICAgICAgICB0b2tlblByb21pc2UgPSBmZXRjaEF1dGhUb2tlbkZyb21TZXJ2ZXIoaW5zdGFsbGF0aW9ucywgaW5Qcm9ncmVzc0VudHJ5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGluUHJvZ3Jlc3NFbnRyeTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IHRva2VuUHJvbWlzZVxyXG4gICAgICAgID8gYXdhaXQgdG9rZW5Qcm9taXNlXHJcbiAgICAgICAgOiBlbnRyeS5hdXRoVG9rZW47XHJcbiAgICByZXR1cm4gYXV0aFRva2VuO1xyXG59XHJcbi8qKlxyXG4gKiBDYWxsIG9ubHkgaWYgRklEIGlzIHJlZ2lzdGVyZWQgYW5kIEF1dGggVG9rZW4gcmVxdWVzdCBpcyBpbiBwcm9ncmVzcy5cclxuICpcclxuICogV2FpdHMgdW50aWwgdGhlIGN1cnJlbnQgcGVuZGluZyByZXF1ZXN0IGZpbmlzaGVzLiBJZiB0aGUgcmVxdWVzdCB0aW1lcyBvdXQsXHJcbiAqIHRyaWVzIG9uY2UgaW4gdGhpcyB0aHJlYWQgYXMgd2VsbC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHdhaXRVbnRpbEF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKSB7XHJcbiAgICAvLyBVbmZvcnR1bmF0ZWx5LCB0aGVyZSBpcyBubyB3YXkgb2YgcmVsaWFibHkgb2JzZXJ2aW5nIHdoZW4gYSB2YWx1ZSBpblxyXG4gICAgLy8gSW5kZXhlZERCIGNoYW5nZXMgKHlldCwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9XSUNHL2luZGV4ZWQtZGItb2JzZXJ2ZXJzKSxcclxuICAgIC8vIHNvIHdlIG5lZWQgdG8gcG9sbC5cclxuICAgIGxldCBlbnRyeSA9IGF3YWl0IHVwZGF0ZUF1dGhUb2tlblJlcXVlc3QoaW5zdGFsbGF0aW9ucy5hcHBDb25maWcpO1xyXG4gICAgd2hpbGUgKGVudHJ5LmF1dGhUb2tlbi5yZXF1ZXN0U3RhdHVzID09PSAxIC8qIFJlcXVlc3RTdGF0dXMuSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAvLyBnZW5lcmF0ZUF1dGhUb2tlbiBzdGlsbCBpbiBwcm9ncmVzcy5cclxuICAgICAgICBhd2FpdCBzbGVlcCgxMDApO1xyXG4gICAgICAgIGVudHJ5ID0gYXdhaXQgdXBkYXRlQXV0aFRva2VuUmVxdWVzdChpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBhdXRoVG9rZW4gPSBlbnRyeS5hdXRoVG9rZW47XHJcbiAgICBpZiAoYXV0aFRva2VuLnJlcXVlc3RTdGF0dXMgPT09IDAgLyogUmVxdWVzdFN0YXR1cy5OT1RfU1RBUlRFRCAqLykge1xyXG4gICAgICAgIC8vIFRoZSByZXF1ZXN0IHRpbWVkIG91dCBvciBmYWlsZWQgaW4gYSBkaWZmZXJlbnQgY2FsbC4gVHJ5IGFnYWluLlxyXG4gICAgICAgIHJldHVybiByZWZyZXNoQXV0aFRva2VuKGluc3RhbGxhdGlvbnMsIGZvcmNlUmVmcmVzaCk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYXV0aFRva2VuO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBDYWxsZWQgb25seSBpZiB0aGVyZSBpcyBhIEdlbmVyYXRlQXV0aFRva2VuIHJlcXVlc3QgaW4gcHJvZ3Jlc3MuXHJcbiAqXHJcbiAqIFVwZGF0ZXMgdGhlIEluc3RhbGxhdGlvbkVudHJ5IGluIHRoZSBEQiBiYXNlZCBvbiB0aGUgc3RhdHVzIG9mIHRoZVxyXG4gKiBHZW5lcmF0ZUF1dGhUb2tlbiByZXF1ZXN0LlxyXG4gKlxyXG4gKiBSZXR1cm5zIHRoZSB1cGRhdGVkIEluc3RhbGxhdGlvbkVudHJ5LlxyXG4gKi9cclxuZnVuY3Rpb24gdXBkYXRlQXV0aFRva2VuUmVxdWVzdChhcHBDb25maWcpIHtcclxuICAgIHJldHVybiB1cGRhdGUoYXBwQ29uZmlnLCBvbGRFbnRyeSA9PiB7XHJcbiAgICAgICAgaWYgKCFpc0VudHJ5UmVnaXN0ZXJlZChvbGRFbnRyeSkpIHtcclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJub3QtcmVnaXN0ZXJlZFwiIC8qIEVycm9yQ29kZS5OT1RfUkVHSVNURVJFRCAqLyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG9sZEF1dGhUb2tlbiA9IG9sZEVudHJ5LmF1dGhUb2tlbjtcclxuICAgICAgICBpZiAoaGFzQXV0aFRva2VuUmVxdWVzdFRpbWVkT3V0KG9sZEF1dGhUb2tlbikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgb2xkRW50cnkpLCB7IGF1dGhUb2tlbjogeyByZXF1ZXN0U3RhdHVzOiAwIC8qIFJlcXVlc3RTdGF0dXMuTk9UX1NUQVJURUQgKi8gfSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgfSk7XHJcbn1cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hBdXRoVG9rZW5Gcm9tU2VydmVyKGluc3RhbGxhdGlvbnMsIGluc3RhbGxhdGlvbkVudHJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGF1dGhUb2tlbiA9IGF3YWl0IGdlbmVyYXRlQXV0aFRva2VuUmVxdWVzdChpbnN0YWxsYXRpb25zLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICAgICAgY29uc3QgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBpbnN0YWxsYXRpb25FbnRyeSksIHsgYXV0aFRva2VuIH0pO1xyXG4gICAgICAgIGF3YWl0IHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICByZXR1cm4gYXV0aFRva2VuO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAoaXNTZXJ2ZXJFcnJvcihlKSAmJlxyXG4gICAgICAgICAgICAoZS5jdXN0b21EYXRhLnNlcnZlckNvZGUgPT09IDQwMSB8fCBlLmN1c3RvbURhdGEuc2VydmVyQ29kZSA9PT0gNDA0KSkge1xyXG4gICAgICAgICAgICAvLyBTZXJ2ZXIgcmV0dXJuZWQgYSBcIkZJRCBub3QgZm91bmRcIiBvciBhIFwiSW52YWxpZCBhdXRoZW50aWNhdGlvblwiIGVycm9yLlxyXG4gICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIG5ldyBJRCBuZXh0IHRpbWUuXHJcbiAgICAgICAgICAgIGF3YWl0IHJlbW92ZShpbnN0YWxsYXRpb25zLmFwcENvbmZpZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB1cGRhdGVkSW5zdGFsbGF0aW9uRW50cnkgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGluc3RhbGxhdGlvbkVudHJ5KSwgeyBhdXRoVG9rZW46IHsgcmVxdWVzdFN0YXR1czogMCAvKiBSZXF1ZXN0U3RhdHVzLk5PVF9TVEFSVEVEICovIH0gfSk7XHJcbiAgICAgICAgICAgIGF3YWl0IHNldChpbnN0YWxsYXRpb25zLmFwcENvbmZpZywgdXBkYXRlZEluc3RhbGxhdGlvbkVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxufVxyXG5mdW5jdGlvbiBpc0VudHJ5UmVnaXN0ZXJlZChpbnN0YWxsYXRpb25FbnRyeSkge1xyXG4gICAgcmV0dXJuIChpbnN0YWxsYXRpb25FbnRyeSAhPT0gdW5kZWZpbmVkICYmXHJcbiAgICAgICAgaW5zdGFsbGF0aW9uRW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAyIC8qIFJlcXVlc3RTdGF0dXMuQ09NUExFVEVEICovKTtcclxufVxyXG5mdW5jdGlvbiBpc0F1dGhUb2tlblZhbGlkKGF1dGhUb2tlbikge1xyXG4gICAgcmV0dXJuIChhdXRoVG9rZW4ucmVxdWVzdFN0YXR1cyA9PT0gMiAvKiBSZXF1ZXN0U3RhdHVzLkNPTVBMRVRFRCAqLyAmJlxyXG4gICAgICAgICFpc0F1dGhUb2tlbkV4cGlyZWQoYXV0aFRva2VuKSk7XHJcbn1cclxuZnVuY3Rpb24gaXNBdXRoVG9rZW5FeHBpcmVkKGF1dGhUb2tlbikge1xyXG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgIHJldHVybiAobm93IDwgYXV0aFRva2VuLmNyZWF0aW9uVGltZSB8fFxyXG4gICAgICAgIGF1dGhUb2tlbi5jcmVhdGlvblRpbWUgKyBhdXRoVG9rZW4uZXhwaXJlc0luIDwgbm93ICsgVE9LRU5fRVhQSVJBVElPTl9CVUZGRVIpO1xyXG59XHJcbi8qKiBSZXR1cm5zIGFuIHVwZGF0ZWQgSW5zdGFsbGF0aW9uRW50cnkgd2l0aCBhbiBJblByb2dyZXNzQXV0aFRva2VuLiAqL1xyXG5mdW5jdGlvbiBtYWtlQXV0aFRva2VuUmVxdWVzdEluUHJvZ3Jlc3NFbnRyeShvbGRFbnRyeSkge1xyXG4gICAgY29uc3QgaW5Qcm9ncmVzc0F1dGhUb2tlbiA9IHtcclxuICAgICAgICByZXF1ZXN0U3RhdHVzOiAxIC8qIFJlcXVlc3RTdGF0dXMuSU5fUFJPR1JFU1MgKi8sXHJcbiAgICAgICAgcmVxdWVzdFRpbWU6IERhdGUubm93KClcclxuICAgIH07XHJcbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBvbGRFbnRyeSksIHsgYXV0aFRva2VuOiBpblByb2dyZXNzQXV0aFRva2VuIH0pO1xyXG59XHJcbmZ1bmN0aW9uIGhhc0F1dGhUb2tlblJlcXVlc3RUaW1lZE91dChhdXRoVG9rZW4pIHtcclxuICAgIHJldHVybiAoYXV0aFRva2VuLnJlcXVlc3RTdGF0dXMgPT09IDEgLyogUmVxdWVzdFN0YXR1cy5JTl9QUk9HUkVTUyAqLyAmJlxyXG4gICAgICAgIGF1dGhUb2tlbi5yZXF1ZXN0VGltZSArIFBFTkRJTkdfVElNRU9VVF9NUyA8IERhdGUubm93KCkpO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgRmlyZWJhc2UgSW5zdGFsbGF0aW9uIGlmIHRoZXJlIGlzbid0IG9uZSBmb3IgdGhlIGFwcCBhbmRcclxuICogcmV0dXJucyB0aGUgSW5zdGFsbGF0aW9uIElELlxyXG4gKiBAcGFyYW0gaW5zdGFsbGF0aW9ucyAtIFRoZSBgSW5zdGFsbGF0aW9uc2AgaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldElkKGluc3RhbGxhdGlvbnMpIHtcclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnNJbXBsID0gaW5zdGFsbGF0aW9ucztcclxuICAgIGNvbnN0IHsgaW5zdGFsbGF0aW9uRW50cnksIHJlZ2lzdHJhdGlvblByb21pc2UgfSA9IGF3YWl0IGdldEluc3RhbGxhdGlvbkVudHJ5KGluc3RhbGxhdGlvbnNJbXBsKTtcclxuICAgIGlmIChyZWdpc3RyYXRpb25Qcm9taXNlKSB7XHJcbiAgICAgICAgcmVnaXN0cmF0aW9uUHJvbWlzZS5jYXRjaChjb25zb2xlLmVycm9yKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIC8vIElmIHRoZSBpbnN0YWxsYXRpb24gaXMgYWxyZWFkeSByZWdpc3RlcmVkLCB1cGRhdGUgdGhlIGF1dGhlbnRpY2F0aW9uXHJcbiAgICAgICAgLy8gdG9rZW4gaWYgbmVlZGVkLlxyXG4gICAgICAgIHJlZnJlc2hBdXRoVG9rZW4oaW5zdGFsbGF0aW9uc0ltcGwpLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbkVudHJ5LmZpZDtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogUmV0dXJucyBhIEZpcmViYXNlIEluc3RhbGxhdGlvbnMgYXV0aCB0b2tlbiwgaWRlbnRpZnlpbmcgdGhlIGN1cnJlbnRcclxuICogRmlyZWJhc2UgSW5zdGFsbGF0aW9uLlxyXG4gKiBAcGFyYW0gaW5zdGFsbGF0aW9ucyAtIFRoZSBgSW5zdGFsbGF0aW9uc2AgaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBmb3JjZVJlZnJlc2ggLSBGb3JjZSByZWZyZXNoIHJlZ2FyZGxlc3Mgb2YgdG9rZW4gZXhwaXJhdGlvbi5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZ2V0VG9rZW4oaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoID0gZmFsc2UpIHtcclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnNJbXBsID0gaW5zdGFsbGF0aW9ucztcclxuICAgIGF3YWl0IGNvbXBsZXRlSW5zdGFsbGF0aW9uUmVnaXN0cmF0aW9uKGluc3RhbGxhdGlvbnNJbXBsKTtcclxuICAgIC8vIEF0IHRoaXMgcG9pbnQgd2UgZWl0aGVyIGhhdmUgYSBSZWdpc3RlcmVkIEluc3RhbGxhdGlvbiBpbiB0aGUgREIsIG9yIHdlJ3ZlXHJcbiAgICAvLyBhbHJlYWR5IHRocm93biBhbiBlcnJvci5cclxuICAgIGNvbnN0IGF1dGhUb2tlbiA9IGF3YWl0IHJlZnJlc2hBdXRoVG9rZW4oaW5zdGFsbGF0aW9uc0ltcGwsIGZvcmNlUmVmcmVzaCk7XHJcbiAgICByZXR1cm4gYXV0aFRva2VuLnRva2VuO1xyXG59XHJcbmFzeW5jIGZ1bmN0aW9uIGNvbXBsZXRlSW5zdGFsbGF0aW9uUmVnaXN0cmF0aW9uKGluc3RhbGxhdGlvbnMpIHtcclxuICAgIGNvbnN0IHsgcmVnaXN0cmF0aW9uUHJvbWlzZSB9ID0gYXdhaXQgZ2V0SW5zdGFsbGF0aW9uRW50cnkoaW5zdGFsbGF0aW9ucyk7XHJcbiAgICBpZiAocmVnaXN0cmF0aW9uUHJvbWlzZSkge1xyXG4gICAgICAgIC8vIEEgY3JlYXRlSW5zdGFsbGF0aW9uIHJlcXVlc3QgaXMgaW4gcHJvZ3Jlc3MuIFdhaXQgdW50aWwgaXQgZmluaXNoZXMuXHJcbiAgICAgICAgYXdhaXQgcmVnaXN0cmF0aW9uUHJvbWlzZTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBkZWxldGVJbnN0YWxsYXRpb25SZXF1ZXN0KGFwcENvbmZpZywgaW5zdGFsbGF0aW9uRW50cnkpIHtcclxuICAgIGNvbnN0IGVuZHBvaW50ID0gZ2V0RGVsZXRlRW5kcG9pbnQoYXBwQ29uZmlnLCBpbnN0YWxsYXRpb25FbnRyeSk7XHJcbiAgICBjb25zdCBoZWFkZXJzID0gZ2V0SGVhZGVyc1dpdGhBdXRoKGFwcENvbmZpZywgaW5zdGFsbGF0aW9uRW50cnkpO1xyXG4gICAgY29uc3QgcmVxdWVzdCA9IHtcclxuICAgICAgICBtZXRob2Q6ICdERUxFVEUnLFxyXG4gICAgICAgIGhlYWRlcnNcclxuICAgIH07XHJcbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHJldHJ5SWZTZXJ2ZXJFcnJvcigoKSA9PiBmZXRjaChlbmRwb2ludCwgcmVxdWVzdCkpO1xyXG4gICAgaWYgKCFyZXNwb25zZS5vaykge1xyXG4gICAgICAgIHRocm93IGF3YWl0IGdldEVycm9yRnJvbVJlc3BvbnNlKCdEZWxldGUgSW5zdGFsbGF0aW9uJywgcmVzcG9uc2UpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGdldERlbGV0ZUVuZHBvaW50KGFwcENvbmZpZywgeyBmaWQgfSkge1xyXG4gICAgcmV0dXJuIGAke2dldEluc3RhbGxhdGlvbnNFbmRwb2ludChhcHBDb25maWcpfS8ke2ZpZH1gO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBEZWxldGVzIHRoZSBGaXJlYmFzZSBJbnN0YWxsYXRpb24gYW5kIGFsbCBhc3NvY2lhdGVkIGRhdGEuXHJcbiAqIEBwYXJhbSBpbnN0YWxsYXRpb25zIC0gVGhlIGBJbnN0YWxsYXRpb25zYCBpbnN0YW5jZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZGVsZXRlSW5zdGFsbGF0aW9ucyhpbnN0YWxsYXRpb25zKSB7XHJcbiAgICBjb25zdCB7IGFwcENvbmZpZyB9ID0gaW5zdGFsbGF0aW9ucztcclxuICAgIGNvbnN0IGVudHJ5ID0gYXdhaXQgdXBkYXRlKGFwcENvbmZpZywgb2xkRW50cnkgPT4ge1xyXG4gICAgICAgIGlmIChvbGRFbnRyeSAmJiBvbGRFbnRyeS5yZWdpc3RyYXRpb25TdGF0dXMgPT09IDAgLyogUmVxdWVzdFN0YXR1cy5OT1RfU1RBUlRFRCAqLykge1xyXG4gICAgICAgICAgICAvLyBEZWxldGUgdGhlIHVucmVnaXN0ZXJlZCBlbnRyeSB3aXRob3V0IHNlbmRpbmcgYSBkZWxldGVJbnN0YWxsYXRpb24gcmVxdWVzdC5cclxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9sZEVudHJ5O1xyXG4gICAgfSk7XHJcbiAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAxIC8qIFJlcXVlc3RTdGF0dXMuSU5fUFJPR1JFU1MgKi8pIHtcclxuICAgICAgICAgICAgLy8gQ2FuJ3QgZGVsZXRlIHdoaWxlIHRyeWluZyB0byByZWdpc3Rlci5cclxuICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJkZWxldGUtcGVuZGluZy1yZWdpc3RyYXRpb25cIiAvKiBFcnJvckNvZGUuREVMRVRFX1BFTkRJTkdfUkVHSVNUUkFUSU9OICovKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZW50cnkucmVnaXN0cmF0aW9uU3RhdHVzID09PSAyIC8qIFJlcXVlc3RTdGF0dXMuQ09NUExFVEVEICovKSB7XHJcbiAgICAgICAgICAgIGlmICghbmF2aWdhdG9yLm9uTGluZSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhcHAtb2ZmbGluZVwiIC8qIEVycm9yQ29kZS5BUFBfT0ZGTElORSAqLyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhd2FpdCBkZWxldGVJbnN0YWxsYXRpb25SZXF1ZXN0KGFwcENvbmZpZywgZW50cnkpO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgcmVtb3ZlKGFwcENvbmZpZyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFNldHMgYSBuZXcgY2FsbGJhY2sgdGhhdCB3aWxsIGdldCBjYWxsZWQgd2hlbiBJbnN0YWxsYXRpb24gSUQgY2hhbmdlcy5cclxuICogUmV0dXJucyBhbiB1bnN1YnNjcmliZSBmdW5jdGlvbiB0aGF0IHdpbGwgcmVtb3ZlIHRoZSBjYWxsYmFjayB3aGVuIGNhbGxlZC5cclxuICogQHBhcmFtIGluc3RhbGxhdGlvbnMgLSBUaGUgYEluc3RhbGxhdGlvbnNgIGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBpcyBpbnZva2VkIHdoZW4gRklEIGNoYW5nZXMuXHJcbiAqIEByZXR1cm5zIEEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgY2FsbGVkIHRvIHVuc3Vic2NyaWJlLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBvbklkQ2hhbmdlKGluc3RhbGxhdGlvbnMsIGNhbGxiYWNrKSB7XHJcbiAgICBjb25zdCB7IGFwcENvbmZpZyB9ID0gaW5zdGFsbGF0aW9ucztcclxuICAgIGFkZENhbGxiYWNrKGFwcENvbmZpZywgY2FsbGJhY2spO1xyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgICByZW1vdmVDYWxsYmFjayhhcHBDb25maWcsIGNhbGxiYWNrKTtcclxuICAgIH07XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2Yge0BsaW5rIEluc3RhbGxhdGlvbnN9IGFzc29jaWF0ZWQgd2l0aCB0aGUgZ2l2ZW5cclxuICoge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IGluc3RhbmNlLlxyXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSBpbnN0YW5jZS5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKi9cclxuZnVuY3Rpb24gZ2V0SW5zdGFsbGF0aW9ucyhhcHAgPSBnZXRBcHAoKSkge1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ltcGwgPSBfZ2V0UHJvdmlkZXIoYXBwLCAnaW5zdGFsbGF0aW9ucycpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgcmV0dXJuIGluc3RhbGxhdGlvbnNJbXBsO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmZ1bmN0aW9uIGV4dHJhY3RBcHBDb25maWcoYXBwKSB7XHJcbiAgICBpZiAoIWFwcCB8fCAhYXBwLm9wdGlvbnMpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIENvbmZpZ3VyYXRpb24nKTtcclxuICAgIH1cclxuICAgIGlmICghYXBwLm5hbWUpIHtcclxuICAgICAgICB0aHJvdyBnZXRNaXNzaW5nVmFsdWVFcnJvcignQXBwIE5hbWUnKTtcclxuICAgIH1cclxuICAgIC8vIFJlcXVpcmVkIGFwcCBjb25maWcga2V5c1xyXG4gICAgY29uc3QgY29uZmlnS2V5cyA9IFtcclxuICAgICAgICAncHJvamVjdElkJyxcclxuICAgICAgICAnYXBpS2V5JyxcclxuICAgICAgICAnYXBwSWQnXHJcbiAgICBdO1xyXG4gICAgZm9yIChjb25zdCBrZXlOYW1lIG9mIGNvbmZpZ0tleXMpIHtcclxuICAgICAgICBpZiAoIWFwcC5vcHRpb25zW2tleU5hbWVdKSB7XHJcbiAgICAgICAgICAgIHRocm93IGdldE1pc3NpbmdWYWx1ZUVycm9yKGtleU5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgYXBwTmFtZTogYXBwLm5hbWUsXHJcbiAgICAgICAgcHJvamVjdElkOiBhcHAub3B0aW9ucy5wcm9qZWN0SWQsXHJcbiAgICAgICAgYXBpS2V5OiBhcHAub3B0aW9ucy5hcGlLZXksXHJcbiAgICAgICAgYXBwSWQ6IGFwcC5vcHRpb25zLmFwcElkXHJcbiAgICB9O1xyXG59XHJcbmZ1bmN0aW9uIGdldE1pc3NpbmdWYWx1ZUVycm9yKHZhbHVlTmFtZSkge1xyXG4gICAgcmV0dXJuIEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibWlzc2luZy1hcHAtY29uZmlnLXZhbHVlc1wiIC8qIEVycm9yQ29kZS5NSVNTSU5HX0FQUF9DT05GSUdfVkFMVUVTICovLCB7XHJcbiAgICAgICAgdmFsdWVOYW1lXHJcbiAgICB9KTtcclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMjAgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5jb25zdCBJTlNUQUxMQVRJT05TX05BTUUgPSAnaW5zdGFsbGF0aW9ucyc7XHJcbmNvbnN0IElOU1RBTExBVElPTlNfTkFNRV9JTlRFUk5BTCA9ICdpbnN0YWxsYXRpb25zLWludGVybmFsJztcclxuY29uc3QgcHVibGljRmFjdG9yeSA9IChjb250YWluZXIpID0+IHtcclxuICAgIGNvbnN0IGFwcCA9IGNvbnRhaW5lci5nZXRQcm92aWRlcignYXBwJykuZ2V0SW1tZWRpYXRlKCk7XHJcbiAgICAvLyBUaHJvd3MgaWYgYXBwIGlzbid0IGNvbmZpZ3VyZWQgcHJvcGVybHkuXHJcbiAgICBjb25zdCBhcHBDb25maWcgPSBleHRyYWN0QXBwQ29uZmlnKGFwcCk7XHJcbiAgICBjb25zdCBoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIgPSBfZ2V0UHJvdmlkZXIoYXBwLCAnaGVhcnRiZWF0Jyk7XHJcbiAgICBjb25zdCBpbnN0YWxsYXRpb25zSW1wbCA9IHtcclxuICAgICAgICBhcHAsXHJcbiAgICAgICAgYXBwQ29uZmlnLFxyXG4gICAgICAgIGhlYXJ0YmVhdFNlcnZpY2VQcm92aWRlcixcclxuICAgICAgICBfZGVsZXRlOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoKVxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbnN0YWxsYXRpb25zSW1wbDtcclxufTtcclxuY29uc3QgaW50ZXJuYWxGYWN0b3J5ID0gKGNvbnRhaW5lcikgPT4ge1xyXG4gICAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgIC8vIEludGVybmFsIEZJUyBpbnN0YW5jZSByZWxpZXMgb24gcHVibGljIEZJUyBpbnN0YW5jZS5cclxuICAgIGNvbnN0IGluc3RhbGxhdGlvbnMgPSBfZ2V0UHJvdmlkZXIoYXBwLCBJTlNUQUxMQVRJT05TX05BTUUpLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgY29uc3QgaW5zdGFsbGF0aW9uc0ludGVybmFsID0ge1xyXG4gICAgICAgIGdldElkOiAoKSA9PiBnZXRJZChpbnN0YWxsYXRpb25zKSxcclxuICAgICAgICBnZXRUb2tlbjogKGZvcmNlUmVmcmVzaCkgPT4gZ2V0VG9rZW4oaW5zdGFsbGF0aW9ucywgZm9yY2VSZWZyZXNoKVxyXG4gICAgfTtcclxuICAgIHJldHVybiBpbnN0YWxsYXRpb25zSW50ZXJuYWw7XHJcbn07XHJcbmZ1bmN0aW9uIHJlZ2lzdGVySW5zdGFsbGF0aW9ucygpIHtcclxuICAgIF9yZWdpc3RlckNvbXBvbmVudChuZXcgQ29tcG9uZW50KElOU1RBTExBVElPTlNfTkFNRSwgcHVibGljRmFjdG9yeSwgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLykpO1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoSU5TVEFMTEFUSU9OU19OQU1FX0lOVEVSTkFMLCBpbnRlcm5hbEZhY3RvcnksIFwiUFJJVkFURVwiIC8qIENvbXBvbmVudFR5cGUuUFJJVkFURSAqLykpO1xyXG59XG5cbi8qKlxyXG4gKiBUaGUgRmlyZWJhc2UgSW5zdGFsbGF0aW9ucyBXZWIgU0RLLlxyXG4gKiBUaGlzIFNESyBkb2VzIG5vdCB3b3JrIGluIGEgTm9kZS5qcyBlbnZpcm9ubWVudC5cclxuICpcclxuICogQHBhY2thZ2VEb2N1bWVudGF0aW9uXHJcbiAqL1xyXG5yZWdpc3Rlckluc3RhbGxhdGlvbnMoKTtcclxucmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24pO1xyXG4vLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxyXG5yZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbiwgJ2VzbTIwMTcnKTtcblxuZXhwb3J0IHsgZGVsZXRlSW5zdGFsbGF0aW9ucywgZ2V0SWQsIGdldEluc3RhbGxhdGlvbnMsIGdldFRva2VuLCBvbklkQ2hhbmdlIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiaW1wb3J0IHsgX2dldFByb3ZpZGVyLCBnZXRBcHAsIF9yZWdpc3RlckNvbXBvbmVudCwgcmVnaXN0ZXJWZXJzaW9uIH0gZnJvbSAnQGZpcmViYXNlL2FwcCc7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICdAZmlyZWJhc2UvbG9nZ2VyJztcbmltcG9ydCB7IEVycm9yRmFjdG9yeSwgY2FsY3VsYXRlQmFja29mZk1pbGxpcywgRmlyZWJhc2VFcnJvciwgaXNJbmRleGVkREJBdmFpbGFibGUsIHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUsIGlzQnJvd3NlckV4dGVuc2lvbiwgYXJlQ29va2llc0VuYWJsZWQsIGdldE1vZHVsYXJJbnN0YW5jZSwgZGVlcEVxdWFsIH0gZnJvbSAnQGZpcmViYXNlL3V0aWwnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGZpcmViYXNlL2NvbXBvbmVudCc7XG5pbXBvcnQgJ0BmaXJlYmFzZS9pbnN0YWxsYXRpb25zJztcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuLyoqXHJcbiAqIFR5cGUgY29uc3RhbnQgZm9yIEZpcmViYXNlIEFuYWx5dGljcy5cclxuICovXHJcbmNvbnN0IEFOQUxZVElDU19UWVBFID0gJ2FuYWx5dGljcyc7XHJcbi8vIEtleSB0byBhdHRhY2ggRklEIHRvIGluIGd0YWcgcGFyYW1zLlxyXG5jb25zdCBHQV9GSURfS0VZID0gJ2ZpcmViYXNlX2lkJztcclxuY29uc3QgT1JJR0lOX0tFWSA9ICdvcmlnaW4nO1xyXG5jb25zdCBGRVRDSF9USU1FT1VUX01JTExJUyA9IDYwICogMTAwMDtcclxuY29uc3QgRFlOQU1JQ19DT05GSUdfVVJMID0gJ2h0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlYXBpcy5jb20vdjFhbHBoYS9wcm9qZWN0cy8tL2FwcHMve2FwcC1pZH0vd2ViQ29uZmlnJztcclxuY29uc3QgR1RBR19VUkwgPSAnaHR0cHM6Ly93d3cuZ29vZ2xldGFnbWFuYWdlci5jb20vZ3RhZy9qcyc7XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmNvbnN0IGxvZ2dlciA9IG5ldyBMb2dnZXIoJ0BmaXJlYmFzZS9hbmFseXRpY3MnKTtcblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDE5IEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuY29uc3QgRVJST1JTID0ge1xyXG4gICAgW1wiYWxyZWFkeS1leGlzdHNcIiAvKiBBbmFseXRpY3NFcnJvci5BTFJFQURZX0VYSVNUUyAqL106ICdBIEZpcmViYXNlIEFuYWx5dGljcyBpbnN0YW5jZSB3aXRoIHRoZSBhcHBJZCB7JGlkfSAnICtcclxuICAgICAgICAnIGFscmVhZHkgZXhpc3RzLiAnICtcclxuICAgICAgICAnT25seSBvbmUgRmlyZWJhc2UgQW5hbHl0aWNzIGluc3RhbmNlIGNhbiBiZSBjcmVhdGVkIGZvciBlYWNoIGFwcElkLicsXHJcbiAgICBbXCJhbHJlYWR5LWluaXRpYWxpemVkXCIgLyogQW5hbHl0aWNzRXJyb3IuQUxSRUFEWV9JTklUSUFMSVpFRCAqL106ICdpbml0aWFsaXplQW5hbHl0aWNzKCkgY2Fubm90IGJlIGNhbGxlZCBhZ2FpbiB3aXRoIGRpZmZlcmVudCBvcHRpb25zIHRoYW4gdGhvc2UgJyArXHJcbiAgICAgICAgJ2l0IHdhcyBpbml0aWFsbHkgY2FsbGVkIHdpdGguIEl0IGNhbiBiZSBjYWxsZWQgYWdhaW4gd2l0aCB0aGUgc2FtZSBvcHRpb25zIHRvICcgK1xyXG4gICAgICAgICdyZXR1cm4gdGhlIGV4aXN0aW5nIGluc3RhbmNlLCBvciBnZXRBbmFseXRpY3MoKSBjYW4gYmUgdXNlZCAnICtcclxuICAgICAgICAndG8gZ2V0IGEgcmVmZXJlbmNlIHRvIHRoZSBhbHJlYWR5LWludGlhbGl6ZWQgaW5zdGFuY2UuJyxcclxuICAgIFtcImFscmVhZHktaW5pdGlhbGl6ZWQtc2V0dGluZ3NcIiAvKiBBbmFseXRpY3NFcnJvci5BTFJFQURZX0lOSVRJQUxJWkVEX1NFVFRJTkdTICovXTogJ0ZpcmViYXNlIEFuYWx5dGljcyBoYXMgYWxyZWFkeSBiZWVuIGluaXRpYWxpemVkLicgK1xyXG4gICAgICAgICdzZXR0aW5ncygpIG11c3QgYmUgY2FsbGVkIGJlZm9yZSBpbml0aWFsaXppbmcgYW55IEFuYWx5dGljcyBpbnN0YW5jZScgK1xyXG4gICAgICAgICdvciBpdCB3aWxsIGhhdmUgbm8gZWZmZWN0LicsXHJcbiAgICBbXCJpbnRlcm9wLWNvbXBvbmVudC1yZWctZmFpbGVkXCIgLyogQW5hbHl0aWNzRXJyb3IuSU5URVJPUF9DT01QT05FTlRfUkVHX0ZBSUxFRCAqL106ICdGaXJlYmFzZSBBbmFseXRpY3MgSW50ZXJvcCBDb21wb25lbnQgZmFpbGVkIHRvIGluc3RhbnRpYXRlOiB7JHJlYXNvbn0nLFxyXG4gICAgW1wiaW52YWxpZC1hbmFseXRpY3MtY29udGV4dFwiIC8qIEFuYWx5dGljc0Vycm9yLklOVkFMSURfQU5BTFlUSUNTX0NPTlRFWFQgKi9dOiAnRmlyZWJhc2UgQW5hbHl0aWNzIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBlbnZpcm9ubWVudC4gJyArXHJcbiAgICAgICAgJ1dyYXAgaW5pdGlhbGl6YXRpb24gb2YgYW5hbHl0aWNzIGluIGFuYWx5dGljcy5pc1N1cHBvcnRlZCgpICcgK1xyXG4gICAgICAgICd0byBwcmV2ZW50IGluaXRpYWxpemF0aW9uIGluIHVuc3VwcG9ydGVkIGVudmlyb25tZW50cy4gRGV0YWlsczogeyRlcnJvckluZm99JyxcclxuICAgIFtcImluZGV4ZWRkYi11bmF2YWlsYWJsZVwiIC8qIEFuYWx5dGljc0Vycm9yLklOREVYRUREQl9VTkFWQUlMQUJMRSAqL106ICdJbmRleGVkREIgdW5hdmFpbGFibGUgb3IgcmVzdHJpY3RlZCBpbiB0aGlzIGVudmlyb25tZW50LiAnICtcclxuICAgICAgICAnV3JhcCBpbml0aWFsaXphdGlvbiBvZiBhbmFseXRpY3MgaW4gYW5hbHl0aWNzLmlzU3VwcG9ydGVkKCkgJyArXHJcbiAgICAgICAgJ3RvIHByZXZlbnQgaW5pdGlhbGl6YXRpb24gaW4gdW5zdXBwb3J0ZWQgZW52aXJvbm1lbnRzLiBEZXRhaWxzOiB7JGVycm9ySW5mb30nLFxyXG4gICAgW1wiZmV0Y2gtdGhyb3R0bGVcIiAvKiBBbmFseXRpY3NFcnJvci5GRVRDSF9USFJPVFRMRSAqL106ICdUaGUgY29uZmlnIGZldGNoIHJlcXVlc3QgdGltZWQgb3V0IHdoaWxlIGluIGFuIGV4cG9uZW50aWFsIGJhY2tvZmYgc3RhdGUuJyArXHJcbiAgICAgICAgJyBVbml4IHRpbWVzdGFtcCBpbiBtaWxsaXNlY29uZHMgd2hlbiBmZXRjaCByZXF1ZXN0IHRocm90dGxpbmcgZW5kczogeyR0aHJvdHRsZUVuZFRpbWVNaWxsaXN9LicsXHJcbiAgICBbXCJjb25maWctZmV0Y2gtZmFpbGVkXCIgLyogQW5hbHl0aWNzRXJyb3IuQ09ORklHX0ZFVENIX0ZBSUxFRCAqL106ICdEeW5hbWljIGNvbmZpZyBmZXRjaCBmYWlsZWQ6IFt7JGh0dHBTdGF0dXN9XSB7JHJlc3BvbnNlTWVzc2FnZX0nLFxyXG4gICAgW1wibm8tYXBpLWtleVwiIC8qIEFuYWx5dGljc0Vycm9yLk5PX0FQSV9LRVkgKi9dOiAnVGhlIFwiYXBpS2V5XCIgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gRmlyZWJhc2UgQW5hbHl0aWNzIHJlcXVpcmVzIHRoaXMgZmllbGQgdG8nICtcclxuICAgICAgICAnY29udGFpbiBhIHZhbGlkIEFQSSBrZXkuJyxcclxuICAgIFtcIm5vLWFwcC1pZFwiIC8qIEFuYWx5dGljc0Vycm9yLk5PX0FQUF9JRCAqL106ICdUaGUgXCJhcHBJZFwiIGZpZWxkIGlzIGVtcHR5IGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIEZpcmViYXNlIEFuYWx5dGljcyByZXF1aXJlcyB0aGlzIGZpZWxkIHRvJyArXHJcbiAgICAgICAgJ2NvbnRhaW4gYSB2YWxpZCBhcHAgSUQuJyxcclxuICAgIFtcIm5vLWNsaWVudC1pZFwiIC8qIEFuYWx5dGljc0Vycm9yLk5PX0NMSUVOVF9JRCAqL106ICdUaGUgXCJjbGllbnRfaWRcIiBmaWVsZCBpcyBlbXB0eS4nLFxyXG4gICAgW1wiaW52YWxpZC1ndGFnLXJlc291cmNlXCIgLyogQW5hbHl0aWNzRXJyb3IuSU5WQUxJRF9HVEFHX1JFU09VUkNFICovXTogJ1RydXN0ZWQgVHlwZXMgZGV0ZWN0ZWQgYW4gaW52YWxpZCBndGFnIHJlc291cmNlOiB7JGd0YWdVUkx9LidcclxufTtcclxuY29uc3QgRVJST1JfRkFDVE9SWSA9IG5ldyBFcnJvckZhY3RvcnkoJ2FuYWx5dGljcycsICdBbmFseXRpY3MnLCBFUlJPUlMpO1xuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogVmVyaWZpZXMgYW5kIGNyZWF0ZXMgYSBUcnVzdGVkU2NyaXB0VVJMLlxyXG4gKi9cclxuZnVuY3Rpb24gY3JlYXRlR3RhZ1RydXN0ZWRUeXBlc1NjcmlwdFVSTCh1cmwpIHtcclxuICAgIGlmICghdXJsLnN0YXJ0c1dpdGgoR1RBR19VUkwpKSB7XHJcbiAgICAgICAgY29uc3QgZXJyID0gRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJpbnZhbGlkLWd0YWctcmVzb3VyY2VcIiAvKiBBbmFseXRpY3NFcnJvci5JTlZBTElEX0dUQUdfUkVTT1VSQ0UgKi8sIHtcclxuICAgICAgICAgICAgZ3RhZ1VSTDogdXJsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbG9nZ2VyLndhcm4oZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgIHJldHVybiAnJztcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbn1cclxuLyoqXHJcbiAqIE1ha2VzaGlmdCBwb2x5ZmlsbCBmb3IgUHJvbWlzZS5hbGxTZXR0bGVkKCkuIFJlc29sdmVzIHdoZW4gYWxsIHByb21pc2VzXHJcbiAqIGhhdmUgZWl0aGVyIHJlc29sdmVkIG9yIHJlamVjdGVkLlxyXG4gKlxyXG4gKiBAcGFyYW0gcHJvbWlzZXMgQXJyYXkgb2YgcHJvbWlzZXMgdG8gd2FpdCBmb3IuXHJcbiAqL1xyXG5mdW5jdGlvbiBwcm9taXNlQWxsU2V0dGxlZChwcm9taXNlcykge1xyXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHByb21pc2VzLm1hcChwcm9taXNlID0+IHByb21pc2UuY2F0Y2goZSA9PiBlKSkpO1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGEgVHJ1c3RlZFR5cGVQb2xpY3kgb2JqZWN0IHRoYXQgaW1wbGVtZW50cyB0aGUgcnVsZXMgcGFzc2VkIGFzIHBvbGljeU9wdGlvbnMuXHJcbiAqXHJcbiAqIEBwYXJhbSBwb2xpY3lOYW1lIEEgc3RyaW5nIGNvbnRhaW5pbmcgdGhlIG5hbWUgb2YgdGhlIHBvbGljeVxyXG4gKiBAcGFyYW0gcG9saWN5T3B0aW9ucyBPYmplY3QgY29udGFpbmluZyBpbXBsZW1lbnRhdGlvbnMgb2YgaW5zdGFuY2UgbWV0aG9kcyBmb3IgVHJ1c3RlZFR5cGVzUG9saWN5LCBzZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9UcnVzdGVkVHlwZVBvbGljeSNpbnN0YW5jZV9tZXRob2RzXHJcbiAqIHwgdGhlIFRydXN0ZWRUeXBlUG9saWN5IHJlZmVyZW5jZSBkb2N1bWVudGF0aW9ufS5cclxuICovXHJcbmZ1bmN0aW9uIGNyZWF0ZVRydXN0ZWRUeXBlc1BvbGljeShwb2xpY3lOYW1lLCBwb2xpY3lPcHRpb25zKSB7XHJcbiAgICAvLyBDcmVhdGUgYSBUcnVzdGVkVHlwZXMgcG9saWN5IHRoYXQgd2UgY2FuIHVzZSBmb3IgdXBkYXRpbmcgc3JjXHJcbiAgICAvLyBwcm9wZXJ0aWVzXHJcbiAgICBsZXQgdHJ1c3RlZFR5cGVzUG9saWN5O1xyXG4gICAgaWYgKHdpbmRvdy50cnVzdGVkVHlwZXMpIHtcclxuICAgICAgICB0cnVzdGVkVHlwZXNQb2xpY3kgPSB3aW5kb3cudHJ1c3RlZFR5cGVzLmNyZWF0ZVBvbGljeShwb2xpY3lOYW1lLCBwb2xpY3lPcHRpb25zKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVzdGVkVHlwZXNQb2xpY3k7XHJcbn1cclxuLyoqXHJcbiAqIEluc2VydHMgZ3RhZyBzY3JpcHQgdGFnIGludG8gdGhlIHBhZ2UgdG8gYXN5bmNocm9ub3VzbHkgZG93bmxvYWQgZ3RhZy5cclxuICogQHBhcmFtIGRhdGFMYXllck5hbWUgTmFtZSBvZiBkYXRhbGF5ZXIgKG1vc3Qgb2Z0ZW4gdGhlIGRlZmF1bHQsIFwiX2RhdGFMYXllclwiKS5cclxuICovXHJcbmZ1bmN0aW9uIGluc2VydFNjcmlwdFRhZyhkYXRhTGF5ZXJOYW1lLCBtZWFzdXJlbWVudElkKSB7XHJcbiAgICBjb25zdCB0cnVzdGVkVHlwZXNQb2xpY3kgPSBjcmVhdGVUcnVzdGVkVHlwZXNQb2xpY3koJ2ZpcmViYXNlLWpzLXNkay1wb2xpY3knLCB7XHJcbiAgICAgICAgY3JlYXRlU2NyaXB0VVJMOiBjcmVhdGVHdGFnVHJ1c3RlZFR5cGVzU2NyaXB0VVJMXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xyXG4gICAgLy8gV2UgYXJlIG5vdCBwcm92aWRpbmcgYW4gYW5hbHl0aWNzSWQgaW4gdGhlIFVSTCBiZWNhdXNlIGl0IHdvdWxkIHRyaWdnZXIgYSBgcGFnZV92aWV3YFxyXG4gICAgLy8gd2l0aG91dCBmaWQuIFdlIHdpbGwgaW5pdGlhbGl6ZSBnYS1pZCB1c2luZyBndGFnIChjb25maWcpIGNvbW1hbmQgdG9nZXRoZXIgd2l0aCBmaWQuXHJcbiAgICBjb25zdCBndGFnU2NyaXB0VVJMID0gYCR7R1RBR19VUkx9P2w9JHtkYXRhTGF5ZXJOYW1lfSZpZD0ke21lYXN1cmVtZW50SWR9YDtcclxuICAgIHNjcmlwdC5zcmMgPSB0cnVzdGVkVHlwZXNQb2xpY3lcclxuICAgICAgICA/IHRydXN0ZWRUeXBlc1BvbGljeSA9PT0gbnVsbCB8fCB0cnVzdGVkVHlwZXNQb2xpY3kgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRydXN0ZWRUeXBlc1BvbGljeS5jcmVhdGVTY3JpcHRVUkwoZ3RhZ1NjcmlwdFVSTClcclxuICAgICAgICA6IGd0YWdTY3JpcHRVUkw7XHJcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG59XHJcbi8qKlxyXG4gKiBHZXQgcmVmZXJlbmNlIHRvLCBvciBjcmVhdGUsIGdsb2JhbCBkYXRhbGF5ZXIuXHJcbiAqIEBwYXJhbSBkYXRhTGF5ZXJOYW1lIE5hbWUgb2YgZGF0YWxheWVyIChtb3N0IG9mdGVuIHRoZSBkZWZhdWx0LCBcIl9kYXRhTGF5ZXJcIikuXHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRPckNyZWF0ZURhdGFMYXllcihkYXRhTGF5ZXJOYW1lKSB7XHJcbiAgICAvLyBDaGVjayBmb3IgZXhpc3RpbmcgZGF0YUxheWVyIGFuZCBjcmVhdGUgaWYgbmVlZGVkLlxyXG4gICAgbGV0IGRhdGFMYXllciA9IFtdO1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkod2luZG93W2RhdGFMYXllck5hbWVdKSkge1xyXG4gICAgICAgIGRhdGFMYXllciA9IHdpbmRvd1tkYXRhTGF5ZXJOYW1lXTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIHdpbmRvd1tkYXRhTGF5ZXJOYW1lXSA9IGRhdGFMYXllcjtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhTGF5ZXI7XHJcbn1cclxuLyoqXHJcbiAqIFdyYXBwZWQgZ3RhZyBsb2dpYyB3aGVuIGd0YWcgaXMgY2FsbGVkIHdpdGggJ2NvbmZpZycgY29tbWFuZC5cclxuICpcclxuICogQHBhcmFtIGd0YWdDb3JlIEJhc2ljIGd0YWcgZnVuY3Rpb24gdGhhdCBqdXN0IGFwcGVuZHMgdG8gZGF0YUxheWVyLlxyXG4gKiBAcGFyYW0gaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCBNYXAgb2YgYXBwSWRzIHRvIHRoZWlyIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCBBcnJheSBvZiBkeW5hbWljIGNvbmZpZyBmZXRjaCBwcm9taXNlcy5cclxuICogQHBhcmFtIG1lYXN1cmVtZW50SWRUb0FwcElkIE1hcCBvZiBHQSBtZWFzdXJlbWVudElEcyB0byBjb3JyZXNwb25kaW5nIEZpcmViYXNlIGFwcElkLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZCBHQSBNZWFzdXJlbWVudCBJRCB0byBzZXQgY29uZmlnIGZvci5cclxuICogQHBhcmFtIGd0YWdQYXJhbXMgR3RhZyBjb25maWcgcGFyYW1zIHRvIHNldC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGd0YWdPbkNvbmZpZyhndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIG1lYXN1cmVtZW50SWQsIGd0YWdQYXJhbXMpIHtcclxuICAgIC8vIElmIGNvbmZpZyBpcyBhbHJlYWR5IGZldGNoZWQsIHdlIGtub3cgdGhlIGFwcElkIGFuZCBjYW4gdXNlIGl0IHRvIGxvb2sgdXAgd2hhdCBGSUQgcHJvbWlzZSB3ZVxyXG4gICAgLy8vIGFyZSB3YWl0aW5nIGZvciwgYW5kIHdhaXQgb25seSBvbiB0aGF0IG9uZS5cclxuICAgIGNvbnN0IGNvcnJlc3BvbmRpbmdBcHBJZCA9IG1lYXN1cmVtZW50SWRUb0FwcElkW21lYXN1cmVtZW50SWRdO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBpZiAoY29ycmVzcG9uZGluZ0FwcElkKSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbY29ycmVzcG9uZGluZ0FwcElkXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIElmIGNvbmZpZyBpcyBub3QgZmV0Y2hlZCB5ZXQsIHdhaXQgZm9yIGFsbCBjb25maWdzICh3ZSBkb24ndCBrbm93IHdoaWNoIG9uZSB3ZSBuZWVkKSBhbmRcclxuICAgICAgICAgICAgLy8gZmluZCB0aGUgYXBwSWQgKGlmIGFueSkgY29ycmVzcG9uZGluZyB0byB0aGlzIG1lYXN1cmVtZW50SWQuIElmIHRoZXJlIGlzIG9uZSwgd2FpdCBvblxyXG4gICAgICAgICAgICAvLyB0aGF0IGFwcElkJ3MgaW5pdGlhbGl6YXRpb24gcHJvbWlzZS4gSWYgdGhlcmUgaXMgbm9uZSwgcHJvbWlzZSByZXNvbHZlcyBhbmQgZ3RhZ1xyXG4gICAgICAgICAgICAvLyBjYWxsIGdvZXMgdGhyb3VnaC5cclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY0NvbmZpZ1Jlc3VsdHMgPSBhd2FpdCBwcm9taXNlQWxsU2V0dGxlZChkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0KTtcclxuICAgICAgICAgICAgY29uc3QgZm91bmRDb25maWcgPSBkeW5hbWljQ29uZmlnUmVzdWx0cy5maW5kKGNvbmZpZyA9PiBjb25maWcubWVhc3VyZW1lbnRJZCA9PT0gbWVhc3VyZW1lbnRJZCk7XHJcbiAgICAgICAgICAgIGlmIChmb3VuZENvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFtmb3VuZENvbmZpZy5hcHBJZF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGxvZ2dlci5lcnJvcihlKTtcclxuICAgIH1cclxuICAgIGd0YWdDb3JlKFwiY29uZmlnXCIgLyogR3RhZ0NvbW1hbmQuQ09ORklHICovLCBtZWFzdXJlbWVudElkLCBndGFnUGFyYW1zKTtcclxufVxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGxvZ2ljIHdoZW4gZ3RhZyBpcyBjYWxsZWQgd2l0aCAnZXZlbnQnIGNvbW1hbmQuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBCYXNpYyBndGFnIGZ1bmN0aW9uIHRoYXQganVzdCBhcHBlbmRzIHRvIGRhdGFMYXllci5cclxuICogQHBhcmFtIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAgTWFwIG9mIGFwcElkcyB0byB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgZHluYW1pYyBjb25maWcgZmV0Y2ggcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBtZWFzdXJlbWVudElkIEdBIE1lYXN1cmVtZW50IElEIHRvIGxvZyBldmVudCB0by5cclxuICogQHBhcmFtIGd0YWdQYXJhbXMgUGFyYW1zIHRvIGxvZyB3aXRoIHRoaXMgZXZlbnQuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBndGFnT25FdmVudChndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZCwgZ3RhZ1BhcmFtcykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBsZXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvciA9IFtdO1xyXG4gICAgICAgIC8vIElmIHRoZXJlJ3MgYSAnc2VuZF90bycgcGFyYW0sIGNoZWNrIGlmIGFueSBJRCBzcGVjaWZpZWQgbWF0Y2hlc1xyXG4gICAgICAgIC8vIGFuIGluaXRpYWxpemVJZHMoKSBwcm9taXNlIHdlIGFyZSB3YWl0aW5nIGZvci5cclxuICAgICAgICBpZiAoZ3RhZ1BhcmFtcyAmJiBndGFnUGFyYW1zWydzZW5kX3RvJ10pIHtcclxuICAgICAgICAgICAgbGV0IGdhU2VuZFRvTGlzdCA9IGd0YWdQYXJhbXNbJ3NlbmRfdG8nXTtcclxuICAgICAgICAgICAgLy8gTWFrZSBpdCBhbiBhcnJheSBpZiBpcyBpc24ndCwgc28gaXQgY2FuIGJlIGRlYWx0IHdpdGggdGhlIHNhbWUgd2F5LlxyXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoZ2FTZW5kVG9MaXN0KSkge1xyXG4gICAgICAgICAgICAgICAgZ2FTZW5kVG9MaXN0ID0gW2dhU2VuZFRvTGlzdF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQ2hlY2tpbmcgJ3NlbmRfdG8nIGZpZWxkcyByZXF1aXJlcyBoYXZpbmcgYWxsIG1lYXN1cmVtZW50IElEIHJlc3VsdHMgYmFjayBmcm9tXHJcbiAgICAgICAgICAgIC8vIHRoZSBkeW5hbWljIGNvbmZpZyBmZXRjaC5cclxuICAgICAgICAgICAgY29uc3QgZHluYW1pY0NvbmZpZ1Jlc3VsdHMgPSBhd2FpdCBwcm9taXNlQWxsU2V0dGxlZChkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0KTtcclxuICAgICAgICAgICAgZm9yIChjb25zdCBzZW5kVG9JZCBvZiBnYVNlbmRUb0xpc3QpIHtcclxuICAgICAgICAgICAgICAgIC8vIEFueSBmZXRjaGVkIGR5bmFtaWMgbWVhc3VyZW1lbnQgSUQgdGhhdCBtYXRjaGVzIHRoaXMgJ3NlbmRfdG8nIElEXHJcbiAgICAgICAgICAgICAgICBjb25zdCBmb3VuZENvbmZpZyA9IGR5bmFtaWNDb25maWdSZXN1bHRzLmZpbmQoY29uZmlnID0+IGNvbmZpZy5tZWFzdXJlbWVudElkID09PSBzZW5kVG9JZCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbml0aWFsaXphdGlvblByb21pc2UgPSBmb3VuZENvbmZpZyAmJiBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2ZvdW5kQ29uZmlnLmFwcElkXTtcclxuICAgICAgICAgICAgICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yLnB1c2goaW5pdGlhbGl6YXRpb25Qcm9taXNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIEZvdW5kIGFuIGl0ZW0gaW4gJ3NlbmRfdG8nIHRoYXQgaXMgbm90IGFzc29jaWF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAvLyBkaXJlY3RseSB3aXRoIGFuIEZJRCwgcG9zc2libHkgYSBncm91cC4gIEVtcHR5IHRoaXMgYXJyYXksXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZXhpdCB0aGUgbG9vcCBlYXJseSwgYW5kIGxldCBpdCBnZXQgcG9wdWxhdGVkIGJlbG93LlxyXG4gICAgICAgICAgICAgICAgICAgIGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBUaGlzIHdpbGwgYmUgdW5wb3B1bGF0ZWQgaWYgdGhlcmUgd2FzIG5vICdzZW5kX3RvJyBmaWVsZCAsIG9yXHJcbiAgICAgICAgLy8gaWYgbm90IGFsbCBlbnRyaWVzIGluIHRoZSAnc2VuZF90bycgZmllbGQgY291bGQgYmUgbWFwcGVkIHRvXHJcbiAgICAgICAgLy8gYSBGSUQuIEluIHRoZXNlIGNhc2VzLCB3YWl0IG9uIGFsbCBwZW5kaW5nIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gICAgICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBpbml0aWFsaXphdGlvblByb21pc2VzVG9XYWl0Rm9yID0gT2JqZWN0LnZhbHVlcyhpbml0aWFsaXphdGlvblByb21pc2VzTWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gUnVuIGNvcmUgZ3RhZyBmdW5jdGlvbiB3aXRoIGFyZ3MgYWZ0ZXIgYWxsIHJlbGV2YW50IGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgLy8gcHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkLlxyXG4gICAgICAgIGF3YWl0IFByb21pc2UuYWxsKGluaXRpYWxpemF0aW9uUHJvbWlzZXNUb1dhaXRGb3IpO1xyXG4gICAgICAgIC8vIFdvcmthcm91bmQgZm9yIGh0dHA6Ly9iLzE0MTM3MDQ0OSAtIHRoaXJkIGFyZ3VtZW50IGNhbm5vdCBiZSB1bmRlZmluZWQuXHJcbiAgICAgICAgZ3RhZ0NvcmUoXCJldmVudFwiIC8qIEd0YWdDb21tYW5kLkVWRU5UICovLCBtZWFzdXJlbWVudElkLCBndGFnUGFyYW1zIHx8IHt9KTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgbG9nZ2VyLmVycm9yKGUpO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBXcmFwcyBhIHN0YW5kYXJkIGd0YWcgZnVuY3Rpb24gd2l0aCBleHRyYSBjb2RlIHRvIHdhaXQgZm9yIGNvbXBsZXRpb24gb2ZcclxuICogcmVsZXZhbnQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgYmVmb3JlIHNlbmRpbmcgcmVxdWVzdHMuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnQ29yZSBCYXNpYyBndGFnIGZ1bmN0aW9uIHRoYXQganVzdCBhcHBlbmRzIHRvIGRhdGFMYXllci5cclxuICogQHBhcmFtIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAgTWFwIG9mIGFwcElkcyB0byB0aGVpciBpbml0aWFsaXphdGlvbiBwcm9taXNlcy5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgZHluYW1pYyBjb25maWcgZmV0Y2ggcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBtZWFzdXJlbWVudElkVG9BcHBJZCBNYXAgb2YgR0EgbWVhc3VyZW1lbnRJRHMgdG8gY29ycmVzcG9uZGluZyBGaXJlYmFzZSBhcHBJZC5cclxuICovXHJcbmZ1bmN0aW9uIHdyYXBHdGFnKGd0YWdDb3JlLCBcclxuLyoqXHJcbiAqIEFsbG93cyB3cmFwcGVkIGd0YWcgY2FsbHMgdG8gd2FpdCBvbiB3aGljaGV2ZXIgaW50aWFsaXphdGlvbiBwcm9taXNlcyBhcmUgcmVxdWlyZWQsXHJcbiAqIGRlcGVuZGluZyBvbiB0aGUgY29udGVudHMgb2YgdGhlIGd0YWcgcGFyYW1zJyBgc2VuZF90b2AgZmllbGQsIGlmIGFueS5cclxuICovXHJcbmluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAsIFxyXG4vKipcclxuICogV3JhcHBlZCBndGFnIGNhbGxzIHNvbWV0aW1lcyByZXF1aXJlIGFsbCBkeW5hbWljIGNvbmZpZyBmZXRjaGVzIHRvIGhhdmUgcmV0dXJuZWRcclxuICogYmVmb3JlIGRldGVybWluaW5nIHdoYXQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgKHdoaWNoIGluY2x1ZGUgRklEcykgdG8gd2FpdCBmb3IuXHJcbiAqL1xyXG5keW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBcclxuLyoqXHJcbiAqIFdyYXBwZWQgZ3RhZyBjb25maWcgY2FsbHMgY2FuIG5hcnJvdyBkb3duIHdoaWNoIGluaXRpYWxpemF0aW9uIHByb21pc2UgKHdpdGggRklEKVxyXG4gKiB0byB3YWl0IGZvciBpZiB0aGUgbWVhc3VyZW1lbnRJZCBpcyBhbHJlYWR5IGZldGNoZWQsIGJ5IGdldHRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgYXBwSWQsXHJcbiAqIHdoaWNoIGlzIHRoZSBrZXkgZm9yIHRoZSBpbml0aWFsaXphdGlvbiBwcm9taXNlcyBtYXAuXHJcbiAqL1xyXG5tZWFzdXJlbWVudElkVG9BcHBJZCkge1xyXG4gICAgLyoqXHJcbiAgICAgKiBXcmFwcGVyIGFyb3VuZCBndGFnIHRoYXQgZW5zdXJlcyBGSUQgaXMgc2VudCB3aXRoIGd0YWcgY2FsbHMuXHJcbiAgICAgKiBAcGFyYW0gY29tbWFuZCBHdGFnIGNvbW1hbmQgdHlwZS5cclxuICAgICAqIEBwYXJhbSBpZE9yTmFtZU9yUGFyYW1zIE1lYXN1cmVtZW50IElEIGlmIGNvbW1hbmQgaXMgRVZFTlQvQ09ORklHLCBwYXJhbXMgaWYgY29tbWFuZCBpcyBTRVQuXHJcbiAgICAgKiBAcGFyYW0gZ3RhZ1BhcmFtcyBQYXJhbXMgaWYgZXZlbnQgaXMgRVZFTlQvQ09ORklHLlxyXG4gICAgICovXHJcbiAgICBhc3luYyBmdW5jdGlvbiBndGFnV3JhcHBlcihjb21tYW5kLCAuLi5hcmdzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gSWYgZXZlbnQsIGNoZWNrIHRoYXQgcmVsZXZhbnQgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMgaGF2ZSBjb21wbGV0ZWQuXHJcbiAgICAgICAgICAgIGlmIChjb21tYW5kID09PSBcImV2ZW50XCIgLyogR3RhZ0NvbW1hbmQuRVZFTlQgKi8pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFttZWFzdXJlbWVudElkLCBndGFnUGFyYW1zXSA9IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBFVkVOVCwgc2Vjb25kIGFyZyBtdXN0IGJlIG1lYXN1cmVtZW50SWQuXHJcbiAgICAgICAgICAgICAgICBhd2FpdCBndGFnT25FdmVudChndGFnQ29yZSwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZCwgZ3RhZ1BhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZCA9PT0gXCJjb25maWdcIiAvKiBHdGFnQ29tbWFuZC5DT05GSUcgKi8pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IFttZWFzdXJlbWVudElkLCBndGFnUGFyYW1zXSA9IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICAvLyBJZiBDT05GSUcsIHNlY29uZCBhcmcgbXVzdCBiZSBtZWFzdXJlbWVudElkLlxyXG4gICAgICAgICAgICAgICAgYXdhaXQgZ3RhZ09uQ29uZmlnKGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkVG9BcHBJZCwgbWVhc3VyZW1lbnRJZCwgZ3RhZ1BhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoY29tbWFuZCA9PT0gXCJjb25zZW50XCIgLyogR3RhZ0NvbW1hbmQuQ09OU0VOVCAqLykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW2d0YWdQYXJhbXNdID0gYXJncztcclxuICAgICAgICAgICAgICAgIGd0YWdDb3JlKFwiY29uc2VudFwiIC8qIEd0YWdDb21tYW5kLkNPTlNFTlQgKi8sICd1cGRhdGUnLCBndGFnUGFyYW1zKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kID09PSBcImdldFwiIC8qIEd0YWdDb21tYW5kLkdFVCAqLykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW21lYXN1cmVtZW50SWQsIGZpZWxkTmFtZSwgY2FsbGJhY2tdID0gYXJncztcclxuICAgICAgICAgICAgICAgIGd0YWdDb3JlKFwiZ2V0XCIgLyogR3RhZ0NvbW1hbmQuR0VUICovLCBtZWFzdXJlbWVudElkLCBmaWVsZE5hbWUsIGNhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChjb21tYW5kID09PSBcInNldFwiIC8qIEd0YWdDb21tYW5kLlNFVCAqLykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgW2N1c3RvbVBhcmFtc10gPSBhcmdzO1xyXG4gICAgICAgICAgICAgICAgLy8gSWYgU0VULCBzZWNvbmQgYXJnIG11c3QgYmUgcGFyYW1zLlxyXG4gICAgICAgICAgICAgICAgZ3RhZ0NvcmUoXCJzZXRcIiAvKiBHdGFnQ29tbWFuZC5TRVQgKi8sIGN1c3RvbVBhcmFtcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBndGFnQ29yZShjb21tYW5kLCAuLi5hcmdzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGd0YWdXcmFwcGVyO1xyXG59XHJcbi8qKlxyXG4gKiBDcmVhdGVzIGdsb2JhbCBndGFnIGZ1bmN0aW9uIG9yIHdyYXBzIGV4aXN0aW5nIG9uZSBpZiBmb3VuZC5cclxuICogVGhpcyB3cmFwcGVkIGZ1bmN0aW9uIGF0dGFjaGVzIEZpcmViYXNlIGluc3RhbmNlIElEIChGSUQpIHRvIGd0YWcgJ2NvbmZpZycgYW5kXHJcbiAqICdldmVudCcgY2FsbHMgdGhhdCBiZWxvbmcgdG8gdGhlIEdBSUQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgRmlyZWJhc2UgaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEBwYXJhbSBpbml0aWFsaXphdGlvblByb21pc2VzTWFwIE1hcCBvZiBhcHBJZHMgdG8gdGhlaXIgaW5pdGlhbGl6YXRpb24gcHJvbWlzZXMuXHJcbiAqIEBwYXJhbSBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0IEFycmF5IG9mIGR5bmFtaWMgY29uZmlnIGZldGNoIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZFRvQXBwSWQgTWFwIG9mIEdBIG1lYXN1cmVtZW50SURzIHRvIGNvcnJlc3BvbmRpbmcgRmlyZWJhc2UgYXBwSWQuXHJcbiAqIEBwYXJhbSBkYXRhTGF5ZXJOYW1lIE5hbWUgb2YgZ2xvYmFsIEdBIGRhdGFsYXllciBhcnJheS5cclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbk5hbWUgTmFtZSBvZiBnbG9iYWwgZ3RhZyBmdW5jdGlvbiAoXCJndGFnXCIgaWYgbm90IHVzZXItc3BlY2lmaWVkKS5cclxuICovXHJcbmZ1bmN0aW9uIHdyYXBPckNyZWF0ZUd0YWcoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGRhdGFMYXllck5hbWUsIGd0YWdGdW5jdGlvbk5hbWUpIHtcclxuICAgIC8vIENyZWF0ZSBhIGJhc2ljIGNvcmUgZ3RhZyBmdW5jdGlvblxyXG4gICAgbGV0IGd0YWdDb3JlID0gZnVuY3Rpb24gKC4uLl9hcmdzKSB7XHJcbiAgICAgICAgLy8gTXVzdCBwdXNoIElBcmd1bWVudHMgb2JqZWN0LCBub3QgYW4gYXJyYXkuXHJcbiAgICAgICAgd2luZG93W2RhdGFMYXllck5hbWVdLnB1c2goYXJndW1lbnRzKTtcclxuICAgIH07XHJcbiAgICAvLyBSZXBsYWNlIGl0IHdpdGggZXhpc3Rpbmcgb25lIGlmIGZvdW5kXHJcbiAgICBpZiAod2luZG93W2d0YWdGdW5jdGlvbk5hbWVdICYmXHJcbiAgICAgICAgdHlwZW9mIHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBndGFnQ29yZSA9IHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXTtcclxuICAgIH1cclxuICAgIHdpbmRvd1tndGFnRnVuY3Rpb25OYW1lXSA9IHdyYXBHdGFnKGd0YWdDb3JlLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkVG9BcHBJZCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGd0YWdDb3JlLFxyXG4gICAgICAgIHdyYXBwZWRHdGFnOiB3aW5kb3dbZ3RhZ0Z1bmN0aW9uTmFtZV1cclxuICAgIH07XHJcbn1cclxuLyoqXHJcbiAqIFJldHVybnMgdGhlIHNjcmlwdCB0YWcgaW4gdGhlIERPTSBtYXRjaGluZyBib3RoIHRoZSBndGFnIHVybCBwYXR0ZXJuXHJcbiAqIGFuZCB0aGUgcHJvdmlkZWQgZGF0YSBsYXllciBuYW1lLlxyXG4gKi9cclxuZnVuY3Rpb24gZmluZEd0YWdTY3JpcHRPblBhZ2UoZGF0YUxheWVyTmFtZSkge1xyXG4gICAgY29uc3Qgc2NyaXB0VGFncyA9IHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XHJcbiAgICBmb3IgKGNvbnN0IHRhZyBvZiBPYmplY3QudmFsdWVzKHNjcmlwdFRhZ3MpKSB7XHJcbiAgICAgICAgaWYgKHRhZy5zcmMgJiZcclxuICAgICAgICAgICAgdGFnLnNyYy5pbmNsdWRlcyhHVEFHX1VSTCkgJiZcclxuICAgICAgICAgICAgdGFnLnNyYy5pbmNsdWRlcyhkYXRhTGF5ZXJOYW1lKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGFnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBudWxsO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAyMCBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBCYWNrb2ZmIGZhY3RvciBmb3IgNTAzIGVycm9ycywgd2hpY2ggd2Ugd2FudCB0byBiZSBjb25zZXJ2YXRpdmUgYWJvdXRcclxuICogdG8gYXZvaWQgb3ZlcmxvYWRpbmcgc2VydmVycy4gRWFjaCByZXRyeSBpbnRlcnZhbCB3aWxsIGJlXHJcbiAqIEJBU0VfSU5URVJWQUxfTUlMTElTICogTE9OR19SRVRSWV9GQUNUT1IgXiByZXRyeUNvdW50LCBzbyB0aGUgc2Vjb25kIG9uZVxyXG4gKiB3aWxsIGJlIH4zMCBzZWNvbmRzICh3aXRoIGZ1enppbmcpLlxyXG4gKi9cclxuY29uc3QgTE9OR19SRVRSWV9GQUNUT1IgPSAzMDtcclxuLyoqXHJcbiAqIEJhc2Ugd2FpdCBpbnRlcnZhbCB0byBtdWx0aXBsaWVkIGJ5IGJhY2tvZmZGYWN0b3JeYmFja29mZkNvdW50LlxyXG4gKi9cclxuY29uc3QgQkFTRV9JTlRFUlZBTF9NSUxMSVMgPSAxMDAwO1xyXG4vKipcclxuICogU3R1YmJhYmxlIHJldHJ5IGRhdGEgc3RvcmFnZSBjbGFzcy5cclxuICovXHJcbmNsYXNzIFJldHJ5RGF0YSB7XHJcbiAgICBjb25zdHJ1Y3Rvcih0aHJvdHRsZU1ldGFkYXRhID0ge30sIGludGVydmFsTWlsbGlzID0gQkFTRV9JTlRFUlZBTF9NSUxMSVMpIHtcclxuICAgICAgICB0aGlzLnRocm90dGxlTWV0YWRhdGEgPSB0aHJvdHRsZU1ldGFkYXRhO1xyXG4gICAgICAgIHRoaXMuaW50ZXJ2YWxNaWxsaXMgPSBpbnRlcnZhbE1pbGxpcztcclxuICAgIH1cclxuICAgIGdldFRocm90dGxlTWV0YWRhdGEoYXBwSWQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy50aHJvdHRsZU1ldGFkYXRhW2FwcElkXTtcclxuICAgIH1cclxuICAgIHNldFRocm90dGxlTWV0YWRhdGEoYXBwSWQsIG1ldGFkYXRhKSB7XHJcbiAgICAgICAgdGhpcy50aHJvdHRsZU1ldGFkYXRhW2FwcElkXSA9IG1ldGFkYXRhO1xyXG4gICAgfVxyXG4gICAgZGVsZXRlVGhyb3R0bGVNZXRhZGF0YShhcHBJZCkge1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnRocm90dGxlTWV0YWRhdGFbYXBwSWRdO1xyXG4gICAgfVxyXG59XHJcbmNvbnN0IGRlZmF1bHRSZXRyeURhdGEgPSBuZXcgUmV0cnlEYXRhKCk7XHJcbi8qKlxyXG4gKiBTZXQgR0VUIHJlcXVlc3QgaGVhZGVycy5cclxuICogQHBhcmFtIGFwaUtleSBBcHAgQVBJIGtleS5cclxuICovXHJcbmZ1bmN0aW9uIGdldEhlYWRlcnMoYXBpS2V5KSB7XHJcbiAgICByZXR1cm4gbmV3IEhlYWRlcnMoe1xyXG4gICAgICAgIEFjY2VwdDogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICd4LWdvb2ctYXBpLWtleSc6IGFwaUtleVxyXG4gICAgfSk7XHJcbn1cclxuLyoqXHJcbiAqIEZldGNoZXMgZHluYW1pYyBjb25maWcgZnJvbSBiYWNrZW5kLlxyXG4gKiBAcGFyYW0gYXBwIEZpcmViYXNlIGFwcCB0byBmZXRjaCBjb25maWcgZm9yLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gZmV0Y2hEeW5hbWljQ29uZmlnKGFwcEZpZWxkcykge1xyXG4gICAgdmFyIF9hO1xyXG4gICAgY29uc3QgeyBhcHBJZCwgYXBpS2V5IH0gPSBhcHBGaWVsZHM7XHJcbiAgICBjb25zdCByZXF1ZXN0ID0ge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgaGVhZGVyczogZ2V0SGVhZGVycyhhcGlLZXkpXHJcbiAgICB9O1xyXG4gICAgY29uc3QgYXBwVXJsID0gRFlOQU1JQ19DT05GSUdfVVJMLnJlcGxhY2UoJ3thcHAtaWR9JywgYXBwSWQpO1xyXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChhcHBVcmwsIHJlcXVlc3QpO1xyXG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1cyAhPT0gMjAwICYmIHJlc3BvbnNlLnN0YXR1cyAhPT0gMzA0KSB7XHJcbiAgICAgICAgbGV0IGVycm9yTWVzc2FnZSA9ICcnO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIC8vIFRyeSB0byBnZXQgYW55IGVycm9yIG1lc3NhZ2UgdGV4dCBmcm9tIHNlcnZlciByZXNwb25zZS5cclxuICAgICAgICAgICAgY29uc3QganNvblJlc3BvbnNlID0gKGF3YWl0IHJlc3BvbnNlLmpzb24oKSk7XHJcbiAgICAgICAgICAgIGlmICgoX2EgPSBqc29uUmVzcG9uc2UuZXJyb3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5tZXNzYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBqc29uUmVzcG9uc2UuZXJyb3IubWVzc2FnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoX2lnbm9yZWQpIHsgfVxyXG4gICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiY29uZmlnLWZldGNoLWZhaWxlZFwiIC8qIEFuYWx5dGljc0Vycm9yLkNPTkZJR19GRVRDSF9GQUlMRUQgKi8sIHtcclxuICAgICAgICAgICAgaHR0cFN0YXR1czogcmVzcG9uc2Uuc3RhdHVzLFxyXG4gICAgICAgICAgICByZXNwb25zZU1lc3NhZ2U6IGVycm9yTWVzc2FnZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcclxufVxyXG4vKipcclxuICogRmV0Y2hlcyBkeW5hbWljIGNvbmZpZyBmcm9tIGJhY2tlbmQsIHJldHJ5aW5nIGlmIGZhaWxlZC5cclxuICogQHBhcmFtIGFwcCBGaXJlYmFzZSBhcHAgdG8gZmV0Y2ggY29uZmlnIGZvci5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeShhcHAsIFxyXG4vLyByZXRyeURhdGEgYW5kIHRpbWVvdXRNaWxsaXMgYXJlIHBhcmFtZXRlcml6ZWQgdG8gYWxsb3cgcGFzc2luZyBhIGRpZmZlcmVudCB2YWx1ZSBmb3IgdGVzdGluZy5cclxucmV0cnlEYXRhID0gZGVmYXVsdFJldHJ5RGF0YSwgdGltZW91dE1pbGxpcykge1xyXG4gICAgY29uc3QgeyBhcHBJZCwgYXBpS2V5LCBtZWFzdXJlbWVudElkIH0gPSBhcHAub3B0aW9ucztcclxuICAgIGlmICghYXBwSWQpIHtcclxuICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcIm5vLWFwcC1pZFwiIC8qIEFuYWx5dGljc0Vycm9yLk5PX0FQUF9JRCAqLyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWFwaUtleSkge1xyXG4gICAgICAgIGlmIChtZWFzdXJlbWVudElkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBtZWFzdXJlbWVudElkLFxyXG4gICAgICAgICAgICAgICAgYXBwSWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcGkta2V5XCIgLyogQW5hbHl0aWNzRXJyb3IuTk9fQVBJX0tFWSAqLyk7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0aHJvdHRsZU1ldGFkYXRhID0gcmV0cnlEYXRhLmdldFRocm90dGxlTWV0YWRhdGEoYXBwSWQpIHx8IHtcclxuICAgICAgICBiYWNrb2ZmQ291bnQ6IDAsXHJcbiAgICAgICAgdGhyb3R0bGVFbmRUaW1lTWlsbGlzOiBEYXRlLm5vdygpXHJcbiAgICB9O1xyXG4gICAgY29uc3Qgc2lnbmFsID0gbmV3IEFuYWx5dGljc0Fib3J0U2lnbmFsKCk7XHJcbiAgICBzZXRUaW1lb3V0KGFzeW5jICgpID0+IHtcclxuICAgICAgICAvLyBOb3RlIGEgdmVyeSBsb3cgZGVsYXksIGVnIDwgMTBtcywgY2FuIGVsYXBzZSBiZWZvcmUgbGlzdGVuZXJzIGFyZSBpbml0aWFsaXplZC5cclxuICAgICAgICBzaWduYWwuYWJvcnQoKTtcclxuICAgIH0sIHRpbWVvdXRNaWxsaXMgIT09IHVuZGVmaW5lZCA/IHRpbWVvdXRNaWxsaXMgOiBGRVRDSF9USU1FT1VUX01JTExJUyk7XHJcbiAgICByZXR1cm4gYXR0ZW1wdEZldGNoRHluYW1pY0NvbmZpZ1dpdGhSZXRyeSh7IGFwcElkLCBhcGlLZXksIG1lYXN1cmVtZW50SWQgfSwgdGhyb3R0bGVNZXRhZGF0YSwgc2lnbmFsLCByZXRyeURhdGEpO1xyXG59XHJcbi8qKlxyXG4gKiBSdW5zIG9uZSByZXRyeSBhdHRlbXB0LlxyXG4gKiBAcGFyYW0gYXBwRmllbGRzIE5lY2Vzc2FyeSBhcHAgY29uZmlnIGZpZWxkcy5cclxuICogQHBhcmFtIHRocm90dGxlTWV0YWRhdGEgT25nb2luZyBtZXRhZGF0YSB0byBkZXRlcm1pbmUgdGhyb3R0bGluZyB0aW1lcy5cclxuICogQHBhcmFtIHNpZ25hbCBBYm9ydCBzaWduYWwuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBhdHRlbXB0RmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5KGFwcEZpZWxkcywgeyB0aHJvdHRsZUVuZFRpbWVNaWxsaXMsIGJhY2tvZmZDb3VudCB9LCBzaWduYWwsIHJldHJ5RGF0YSA9IGRlZmF1bHRSZXRyeURhdGEgLy8gZm9yIHRlc3RpbmdcclxuKSB7XHJcbiAgICB2YXIgX2E7XHJcbiAgICBjb25zdCB7IGFwcElkLCBtZWFzdXJlbWVudElkIH0gPSBhcHBGaWVsZHM7XHJcbiAgICAvLyBTdGFydHMgd2l0aCBhIChwb3RlbnRpYWxseSB6ZXJvKSB0aW1lb3V0IHRvIHN1cHBvcnQgcmVzdW1wdGlvbiBmcm9tIHN0b3JlZCBzdGF0ZS5cclxuICAgIC8vIEVuc3VyZXMgdGhlIHRocm90dGxlIGVuZCB0aW1lIGlzIGhvbm9yZWQgaWYgdGhlIGxhc3QgYXR0ZW1wdCB0aW1lZCBvdXQuXHJcbiAgICAvLyBOb3RlIHRoZSBTREsgd2lsbCBuZXZlciBtYWtlIGEgcmVxdWVzdCBpZiB0aGUgZmV0Y2ggdGltZW91dCBleHBpcmVzIGF0IHRoaXMgcG9pbnQuXHJcbiAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IHNldEFib3J0YWJsZVRpbWVvdXQoc2lnbmFsLCB0aHJvdHRsZUVuZFRpbWVNaWxsaXMpO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGUpIHtcclxuICAgICAgICBpZiAobWVhc3VyZW1lbnRJZCkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihgVGltZWQgb3V0IGZldGNoaW5nIHRoaXMgRmlyZWJhc2UgYXBwJ3MgbWVhc3VyZW1lbnQgSUQgZnJvbSB0aGUgc2VydmVyLmAgK1xyXG4gICAgICAgICAgICAgICAgYCBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7bWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgIGAgcHJvdmlkZWQgaW4gdGhlIFwibWVhc3VyZW1lbnRJZFwiIGZpZWxkIGluIHRoZSBsb2NhbCBGaXJlYmFzZSBjb25maWcuIFske2UgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS5tZXNzYWdlfV1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIHsgYXBwSWQsIG1lYXN1cmVtZW50SWQgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhyb3cgZTtcclxuICAgIH1cclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaER5bmFtaWNDb25maWcoYXBwRmllbGRzKTtcclxuICAgICAgICAvLyBOb3RlIHRoZSBTREsgb25seSBjbGVhcnMgdGhyb3R0bGUgc3RhdGUgaWYgcmVzcG9uc2UgaXMgc3VjY2VzcyBvciBub24tcmV0cmlhYmxlLlxyXG4gICAgICAgIHJldHJ5RGF0YS5kZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKTtcclxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgIGNvbnN0IGVycm9yID0gZTtcclxuICAgICAgICBpZiAoIWlzUmV0cmlhYmxlRXJyb3IoZXJyb3IpKSB7XHJcbiAgICAgICAgICAgIHJldHJ5RGF0YS5kZWxldGVUaHJvdHRsZU1ldGFkYXRhKGFwcElkKTtcclxuICAgICAgICAgICAgaWYgKG1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIGxvZ2dlci53YXJuKGBGYWlsZWQgdG8gZmV0Y2ggdGhpcyBGaXJlYmFzZSBhcHAncyBtZWFzdXJlbWVudCBJRCBmcm9tIHRoZSBzZXJ2ZXIuYCArXHJcbiAgICAgICAgICAgICAgICAgICAgYCBGYWxsaW5nIGJhY2sgdG8gdGhlIG1lYXN1cmVtZW50IElEICR7bWVhc3VyZW1lbnRJZH1gICtcclxuICAgICAgICAgICAgICAgICAgICBgIHByb3ZpZGVkIGluIHRoZSBcIm1lYXN1cmVtZW50SWRcIiBmaWVsZCBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnLiBbJHtlcnJvciA9PT0gbnVsbCB8fCBlcnJvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyb3IubWVzc2FnZX1dYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBhcHBJZCwgbWVhc3VyZW1lbnRJZCB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBiYWNrb2ZmTWlsbGlzID0gTnVtYmVyKChfYSA9IGVycm9yID09PSBudWxsIHx8IGVycm9yID09PSB2b2lkIDAgPyB2b2lkIDAgOiBlcnJvci5jdXN0b21EYXRhKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuaHR0cFN0YXR1cykgPT09IDUwM1xyXG4gICAgICAgICAgICA/IGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCByZXRyeURhdGEuaW50ZXJ2YWxNaWxsaXMsIExPTkdfUkVUUllfRkFDVE9SKVxyXG4gICAgICAgICAgICA6IGNhbGN1bGF0ZUJhY2tvZmZNaWxsaXMoYmFja29mZkNvdW50LCByZXRyeURhdGEuaW50ZXJ2YWxNaWxsaXMpO1xyXG4gICAgICAgIC8vIEluY3JlbWVudHMgYmFja29mZiBzdGF0ZS5cclxuICAgICAgICBjb25zdCB0aHJvdHRsZU1ldGFkYXRhID0ge1xyXG4gICAgICAgICAgICB0aHJvdHRsZUVuZFRpbWVNaWxsaXM6IERhdGUubm93KCkgKyBiYWNrb2ZmTWlsbGlzLFxyXG4gICAgICAgICAgICBiYWNrb2ZmQ291bnQ6IGJhY2tvZmZDb3VudCArIDFcclxuICAgICAgICB9O1xyXG4gICAgICAgIC8vIFBlcnNpc3RzIHN0YXRlLlxyXG4gICAgICAgIHJldHJ5RGF0YS5zZXRUaHJvdHRsZU1ldGFkYXRhKGFwcElkLCB0aHJvdHRsZU1ldGFkYXRhKTtcclxuICAgICAgICBsb2dnZXIuZGVidWcoYENhbGxpbmcgYXR0ZW1wdEZldGNoIGFnYWluIGluICR7YmFja29mZk1pbGxpc30gbWlsbGlzYCk7XHJcbiAgICAgICAgcmV0dXJuIGF0dGVtcHRGZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkoYXBwRmllbGRzLCB0aHJvdHRsZU1ldGFkYXRhLCBzaWduYWwsIHJldHJ5RGF0YSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFN1cHBvcnRzIHdhaXRpbmcgb24gYSBiYWNrb2ZmIGJ5OlxyXG4gKlxyXG4gKiA8dWw+XHJcbiAqICAgPGxpPlByb21pc2lmeWluZyBzZXRUaW1lb3V0LCBzbyB3ZSBjYW4gc2V0IGEgdGltZW91dCBpbiBvdXIgUHJvbWlzZSBjaGFpbjwvbGk+XHJcbiAqICAgPGxpPkxpc3RlbmluZyBvbiBhIHNpZ25hbCBidXMgZm9yIGFib3J0IGV2ZW50cywganVzdCBsaWtlIHRoZSBGZXRjaCBBUEk8L2xpPlxyXG4gKiAgIDxsaT5GYWlsaW5nIGluIHRoZSBzYW1lIHdheSB0aGUgRmV0Y2ggQVBJIGZhaWxzLCBzbyB0aW1pbmcgb3V0IGEgbGl2ZSByZXF1ZXN0IGFuZCBhIHRocm90dGxlZFxyXG4gKiAgICAgICByZXF1ZXN0IGFwcGVhciB0aGUgc2FtZS48L2xpPlxyXG4gKiA8L3VsPlxyXG4gKlxyXG4gKiA8cD5WaXNpYmxlIGZvciB0ZXN0aW5nLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0QWJvcnRhYmxlVGltZW91dChzaWduYWwsIHRocm90dGxlRW5kVGltZU1pbGxpcykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAvLyBEZXJpdmVzIGJhY2tvZmYgZnJvbSBnaXZlbiBlbmQgdGltZSwgbm9ybWFsaXppbmcgbmVnYXRpdmUgbnVtYmVycyB0byB6ZXJvLlxyXG4gICAgICAgIGNvbnN0IGJhY2tvZmZNaWxsaXMgPSBNYXRoLm1heCh0aHJvdHRsZUVuZFRpbWVNaWxsaXMgLSBEYXRlLm5vdygpLCAwKTtcclxuICAgICAgICBjb25zdCB0aW1lb3V0ID0gc2V0VGltZW91dChyZXNvbHZlLCBiYWNrb2ZmTWlsbGlzKTtcclxuICAgICAgICAvLyBBZGRzIGxpc3RlbmVyLCByYXRoZXIgdGhhbiBzZXRzIG9uYWJvcnQsIGJlY2F1c2Ugc2lnbmFsIGlzIGEgc2hhcmVkIG9iamVjdC5cclxuICAgICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcigoKSA9PiB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICAgICAgLy8gSWYgdGhlIHJlcXVlc3QgY29tcGxldGVzIGJlZm9yZSB0aGlzIHRpbWVvdXQsIHRoZSByZWplY3Rpb24gaGFzIG5vIGVmZmVjdC5cclxuICAgICAgICAgICAgcmVqZWN0KEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiZmV0Y2gtdGhyb3R0bGVcIiAvKiBBbmFseXRpY3NFcnJvci5GRVRDSF9USFJPVFRMRSAqLywge1xyXG4gICAgICAgICAgICAgICAgdGhyb3R0bGVFbmRUaW1lTWlsbGlzXHJcbiAgICAgICAgICAgIH0pKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHtAbGluayBFcnJvcn0gaW5kaWNhdGVzIGEgZmV0Y2ggcmVxdWVzdCBtYXkgc3VjY2VlZCBsYXRlci5cclxuICovXHJcbmZ1bmN0aW9uIGlzUmV0cmlhYmxlRXJyb3IoZSkge1xyXG4gICAgaWYgKCEoZSBpbnN0YW5jZW9mIEZpcmViYXNlRXJyb3IpIHx8ICFlLmN1c3RvbURhdGEpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICAvLyBVc2VzIHN0cmluZyBpbmRleCBkZWZpbmVkIGJ5IEVycm9yRGF0YSwgd2hpY2ggRmlyZWJhc2VFcnJvciBpbXBsZW1lbnRzLlxyXG4gICAgY29uc3QgaHR0cFN0YXR1cyA9IE51bWJlcihlLmN1c3RvbURhdGFbJ2h0dHBTdGF0dXMnXSk7XHJcbiAgICByZXR1cm4gKGh0dHBTdGF0dXMgPT09IDQyOSB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwMCB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwMyB8fFxyXG4gICAgICAgIGh0dHBTdGF0dXMgPT09IDUwNCk7XHJcbn1cclxuLyoqXHJcbiAqIFNoaW1zIGEgbWluaW1hbCBBYm9ydFNpZ25hbCAoY29waWVkIGZyb20gUmVtb3RlIENvbmZpZykuXHJcbiAqXHJcbiAqIDxwPkFib3J0Q29udHJvbGxlcidzIEFib3J0U2lnbmFsIGNvbnZlbmllbnRseSBkZWNvdXBsZXMgZmV0Y2ggdGltZW91dCBsb2dpYyBmcm9tIG90aGVyIGFzcGVjdHNcclxuICogb2YgbmV0d29ya2luZywgc3VjaCBhcyByZXRyaWVzLiBGaXJlYmFzZSBkb2Vzbid0IHVzZSBBYm9ydENvbnRyb2xsZXIgZW5vdWdoIHRvIGp1c3RpZnkgYVxyXG4gKiBwb2x5ZmlsbCByZWNvbW1lbmRhdGlvbiwgbGlrZSB3ZSBkbyB3aXRoIHRoZSBGZXRjaCBBUEksIGJ1dCB0aGlzIG1pbmltYWwgc2hpbSBjYW4gZWFzaWx5IGJlXHJcbiAqIHN3YXBwZWQgb3V0IGlmL3doZW4gd2UgZG8uXHJcbiAqL1xyXG5jbGFzcyBBbmFseXRpY3NBYm9ydFNpZ25hbCB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgYWRkRXZlbnRMaXN0ZW5lcihsaXN0ZW5lcikge1xyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzLnB1c2gobGlzdGVuZXIpO1xyXG4gICAgfVxyXG4gICAgYWJvcnQoKSB7XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnMuZm9yRWFjaChsaXN0ZW5lciA9PiBsaXN0ZW5lcigpKTtcclxuICAgIH1cclxufVxuXG4vKipcclxuICogQGxpY2Vuc2VcclxuICogQ29weXJpZ2h0IDIwMTkgR29vZ2xlIExMQ1xyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG4vKipcclxuICogRXZlbnQgcGFyYW1ldGVycyB0byBzZXQgb24gJ2d0YWcnIGR1cmluZyBpbml0aWFsaXphdGlvbi5cclxuICovXHJcbmxldCBkZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdDtcclxuLyoqXHJcbiAqIExvZ3MgYW4gYW5hbHl0aWNzIGV2ZW50IHRocm91Z2ggdGhlIEZpcmViYXNlIFNESy5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gZXZlbnROYW1lIEdvb2dsZSBBbmFseXRpY3MgZXZlbnQgbmFtZSwgY2hvb3NlIGZyb20gc3RhbmRhcmQgbGlzdCBvciB1c2UgYSBjdXN0b20gc3RyaW5nLlxyXG4gKiBAcGFyYW0gZXZlbnRQYXJhbXMgQW5hbHl0aWNzIGV2ZW50IHBhcmFtZXRlcnMuXHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBsb2dFdmVudCQxKGd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdsb2JhbCkge1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImV2ZW50XCIgLyogR3RhZ0NvbW1hbmQuRVZFTlQgKi8sIGV2ZW50TmFtZSwgZXZlbnRQYXJhbXMpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgY29uc3QgcGFyYW1zID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBldmVudFBhcmFtcyksIHsgJ3NlbmRfdG8nOiBtZWFzdXJlbWVudElkIH0pO1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImV2ZW50XCIgLyogR3RhZ0NvbW1hbmQuRVZFTlQgKi8sIGV2ZW50TmFtZSwgcGFyYW1zKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2V0IHNjcmVlbl9uYW1lIHBhcmFtZXRlciBmb3IgdGhpcyBHb29nbGUgQW5hbHl0aWNzIElELlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBVc2Uge0BsaW5rIGxvZ0V2ZW50fSB3aXRoIGBldmVudE5hbWVgIGFzICdzY3JlZW5fdmlldycgYW5kIGFkZCByZWxldmFudCBgZXZlbnRQYXJhbXNgLlxyXG4gKiBTZWUge0BsaW5rIGh0dHBzOi8vZmlyZWJhc2UuZ29vZ2xlLmNvbS9kb2NzL2FuYWx5dGljcy9zY3JlZW52aWV3cyB8IFRyYWNrIFNjcmVlbnZpZXdzfS5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gc2NyZWVuTmFtZSBTY3JlZW4gbmFtZSBzdHJpbmcgdG8gc2V0LlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gc2V0Q3VycmVudFNjcmVlbiQxKGd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBzY3JlZW5OYW1lLCBvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmdsb2JhbCkge1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcInNldFwiIC8qIEd0YWdDb21tYW5kLlNFVCAqLywgeyAnc2NyZWVuX25hbWUnOiBzY3JlZW5OYW1lIH0pO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiY29uZmlnXCIgLyogR3RhZ0NvbW1hbmQuQ09ORklHICovLCBtZWFzdXJlbWVudElkLCB7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgJ3NjcmVlbl9uYW1lJzogc2NyZWVuTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBTZXQgdXNlcl9pZCBwYXJhbWV0ZXIgZm9yIHRoaXMgR29vZ2xlIEFuYWx5dGljcyBJRC5cclxuICpcclxuICogQHBhcmFtIGd0YWdGdW5jdGlvbiBXcmFwcGVkIGd0YWcgZnVuY3Rpb24gdGhhdCB3YWl0cyBmb3IgZmlkIHRvIGJlIHNldCBiZWZvcmUgc2VuZGluZyBhbiBldmVudFxyXG4gKiBAcGFyYW0gaWQgVXNlciBJRCBzdHJpbmcgdG8gc2V0XHJcbiAqL1xyXG5hc3luYyBmdW5jdGlvbiBzZXRVc2VySWQkMShndGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZSwgaWQsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwic2V0XCIgLyogR3RhZ0NvbW1hbmQuU0VUICovLCB7ICd1c2VyX2lkJzogaWQgfSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgICAgY29uc3QgbWVhc3VyZW1lbnRJZCA9IGF3YWl0IGluaXRpYWxpemF0aW9uUHJvbWlzZTtcclxuICAgICAgICBndGFnRnVuY3Rpb24oXCJjb25maWdcIiAvKiBHdGFnQ29tbWFuZC5DT05GSUcgKi8sIG1lYXN1cmVtZW50SWQsIHtcclxuICAgICAgICAgICAgdXBkYXRlOiB0cnVlLFxyXG4gICAgICAgICAgICAndXNlcl9pZCc6IGlkXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLyoqXHJcbiAqIFNldCBhbGwgb3RoZXIgdXNlciBwcm9wZXJ0aWVzIG90aGVyIHRoYW4gdXNlcl9pZCBhbmQgc2NyZWVuX25hbWUuXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnRnVuY3Rpb24gV3JhcHBlZCBndGFnIGZ1bmN0aW9uIHRoYXQgd2FpdHMgZm9yIGZpZCB0byBiZSBzZXQgYmVmb3JlIHNlbmRpbmcgYW4gZXZlbnRcclxuICogQHBhcmFtIHByb3BlcnRpZXMgTWFwIG9mIHVzZXIgcHJvcGVydGllcyB0byBzZXRcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldFVzZXJQcm9wZXJ0aWVzJDEoZ3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2UsIHByb3BlcnRpZXMsIG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZ2xvYmFsKSB7XHJcbiAgICAgICAgY29uc3QgZmxhdFByb3BlcnRpZXMgPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhwcm9wZXJ0aWVzKSkge1xyXG4gICAgICAgICAgICAvLyB1c2UgZG90IG5vdGF0aW9uIGZvciBtZXJnZSBiZWhhdmlvciBpbiBndGFnLmpzXHJcbiAgICAgICAgICAgIGZsYXRQcm9wZXJ0aWVzW2B1c2VyX3Byb3BlcnRpZXMuJHtrZXl9YF0gPSBwcm9wZXJ0aWVzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcInNldFwiIC8qIEd0YWdDb21tYW5kLlNFVCAqLywgZmxhdFByb3BlcnRpZXMpO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICAgICAgZ3RhZ0Z1bmN0aW9uKFwiY29uZmlnXCIgLyogR3RhZ0NvbW1hbmQuQ09ORklHICovLCBtZWFzdXJlbWVudElkLCB7XHJcbiAgICAgICAgICAgIHVwZGF0ZTogdHJ1ZSxcclxuICAgICAgICAgICAgJ3VzZXJfcHJvcGVydGllcyc6IHByb3BlcnRpZXNcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogUmV0cmlldmVzIGEgdW5pcXVlIEdvb2dsZSBBbmFseXRpY3MgaWRlbnRpZmllciBmb3IgdGhlIHdlYiBjbGllbnQuXHJcbiAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vYW5hbHl0aWNzL2Rldmd1aWRlcy9jb2xsZWN0aW9uL2dhNC9yZWZlcmVuY2UvY29uZmlnI2NsaWVudF9pZCB8IGNsaWVudF9pZH0uXHJcbiAqXHJcbiAqIEBwYXJhbSBndGFnRnVuY3Rpb24gV3JhcHBlZCBndGFnIGZ1bmN0aW9uIHRoYXQgd2FpdHMgZm9yIGZpZCB0byBiZSBzZXQgYmVmb3JlIHNlbmRpbmcgYW4gZXZlbnRcclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGludGVybmFsR2V0R29vZ2xlQW5hbHl0aWNzQ2xpZW50SWQoZ3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2UpIHtcclxuICAgIGNvbnN0IG1lYXN1cmVtZW50SWQgPSBhd2FpdCBpbml0aWFsaXphdGlvblByb21pc2U7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIGd0YWdGdW5jdGlvbihcImdldFwiIC8qIEd0YWdDb21tYW5kLkdFVCAqLywgbWVhc3VyZW1lbnRJZCwgJ2NsaWVudF9pZCcsIChjbGllbnRJZCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIWNsaWVudElkKSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1jbGllbnQtaWRcIiAvKiBBbmFseXRpY3NFcnJvci5OT19DTElFTlRfSUQgKi8pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXNvbHZlKGNsaWVudElkKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59XHJcbi8qKlxyXG4gKiBTZXQgd2hldGhlciBjb2xsZWN0aW9uIGlzIGVuYWJsZWQgZm9yIHRoaXMgSUQuXHJcbiAqXHJcbiAqIEBwYXJhbSBlbmFibGVkIElmIHRydWUsIGNvbGxlY3Rpb24gaXMgZW5hYmxlZCBmb3IgdGhpcyBJRC5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIHNldEFuYWx5dGljc0NvbGxlY3Rpb25FbmFibGVkJDEoaW5pdGlhbGl6YXRpb25Qcm9taXNlLCBlbmFibGVkKSB7XHJcbiAgICBjb25zdCBtZWFzdXJlbWVudElkID0gYXdhaXQgaW5pdGlhbGl6YXRpb25Qcm9taXNlO1xyXG4gICAgd2luZG93W2BnYS1kaXNhYmxlLSR7bWVhc3VyZW1lbnRJZH1gXSA9ICFlbmFibGVkO1xyXG59XHJcbi8qKlxyXG4gKiBDb25zZW50IHBhcmFtZXRlcnMgdG8gZGVmYXVsdCB0byBkdXJpbmcgJ2d0YWcnIGluaXRpYWxpemF0aW9uLlxyXG4gKi9cclxubGV0IGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0O1xyXG4vKipcclxuICogU2V0cyB0aGUgdmFyaWFibGUge0BsaW5rIGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0fSBmb3IgdXNlIGluIHRoZSBpbml0aWFsaXphdGlvbiBvZlxyXG4gKiBhbmFseXRpY3MuXHJcbiAqXHJcbiAqIEBwYXJhbSBjb25zZW50U2V0dGluZ3MgTWFwcyB0aGUgYXBwbGljYWJsZSBlbmQgdXNlciBjb25zZW50IHN0YXRlIGZvciBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gX3NldENvbnNlbnREZWZhdWx0Rm9ySW5pdChjb25zZW50U2V0dGluZ3MpIHtcclxuICAgIGRlZmF1bHRDb25zZW50U2V0dGluZ3NGb3JJbml0ID0gY29uc2VudFNldHRpbmdzO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIHRoZSB2YXJpYWJsZSBgZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXRgIGZvciB1c2UgaW4gdGhlIGluaXRpYWxpemF0aW9uIG9mXHJcbiAqIGFuYWx5dGljcy5cclxuICpcclxuICogQHBhcmFtIGN1c3RvbVBhcmFtcyBBbnkgY3VzdG9tIHBhcmFtcyB0aGUgdXNlciBtYXkgcGFzcyB0byBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gX3NldERlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0KGN1c3RvbVBhcmFtcykge1xyXG4gICAgZGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQgPSBjdXN0b21QYXJhbXM7XHJcbn1cblxuLyoqXHJcbiAqIEBsaWNlbnNlXHJcbiAqIENvcHlyaWdodCAyMDIwIEdvb2dsZSBMTENcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gdmFsaWRhdGVJbmRleGVkREIoKSB7XHJcbiAgICBpZiAoIWlzSW5kZXhlZERCQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICBsb2dnZXIud2FybihFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImluZGV4ZWRkYi11bmF2YWlsYWJsZVwiIC8qIEFuYWx5dGljc0Vycm9yLklOREVYRUREQl9VTkFWQUlMQUJMRSAqLywge1xyXG4gICAgICAgICAgICBlcnJvckluZm86ICdJbmRleGVkREIgaXMgbm90IGF2YWlsYWJsZSBpbiB0aGlzIGVudmlyb25tZW50LidcclxuICAgICAgICB9KS5tZXNzYWdlKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCB2YWxpZGF0ZUluZGV4ZWREQk9wZW5hYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIGxvZ2dlci53YXJuKEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwiaW5kZXhlZGRiLXVuYXZhaWxhYmxlXCIgLyogQW5hbHl0aWNzRXJyb3IuSU5ERVhFRERCX1VOQVZBSUxBQkxFICovLCB7XHJcbiAgICAgICAgICAgICAgICBlcnJvckluZm86IGUgPT09IG51bGwgfHwgZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZS50b1N0cmluZygpXHJcbiAgICAgICAgICAgIH0pLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgdGhlIGFuYWx5dGljcyBpbnN0YW5jZSBpbiBndGFnLmpzIGJ5IGNhbGxpbmcgY29uZmlnIGNvbW1hbmQgd2l0aCBmaWQuXHJcbiAqXHJcbiAqIE5PVEU6IFdlIGNvbWJpbmUgYW5hbHl0aWNzIGluaXRpYWxpemF0aW9uIGFuZCBzZXR0aW5nIGZpZCB0b2dldGhlciBiZWNhdXNlIHdlIHdhbnQgZmlkIHRvIGJlXHJcbiAqIHBhcnQgb2YgdGhlIGBwYWdlX3ZpZXdgIGV2ZW50IHRoYXQncyBzZW50IGR1cmluZyB0aGUgaW5pdGlhbGl6YXRpb25cclxuICogQHBhcmFtIGFwcCBGaXJlYmFzZSBhcHBcclxuICogQHBhcmFtIGd0YWdDb3JlIFRoZSBndGFnIGZ1bmN0aW9uIHRoYXQncyBub3Qgd3JhcHBlZC5cclxuICogQHBhcmFtIGR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QgQXJyYXkgb2YgYWxsIGR5bmFtaWMgY29uZmlnIHByb21pc2VzLlxyXG4gKiBAcGFyYW0gbWVhc3VyZW1lbnRJZFRvQXBwSWQgTWFwcyBtZWFzdXJlbWVudElEIHRvIGFwcElELlxyXG4gKiBAcGFyYW0gaW5zdGFsbGF0aW9ucyBfRmlyZWJhc2VJbnN0YWxsYXRpb25zSW50ZXJuYWwgaW5zdGFuY2UuXHJcbiAqXHJcbiAqIEByZXR1cm5zIE1lYXN1cmVtZW50IElELlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gX2luaXRpYWxpemVBbmFseXRpY3MoYXBwLCBkeW5hbWljQ29uZmlnUHJvbWlzZXNMaXN0LCBtZWFzdXJlbWVudElkVG9BcHBJZCwgaW5zdGFsbGF0aW9ucywgZ3RhZ0NvcmUsIGRhdGFMYXllck5hbWUsIG9wdGlvbnMpIHtcclxuICAgIHZhciBfYTtcclxuICAgIGNvbnN0IGR5bmFtaWNDb25maWdQcm9taXNlID0gZmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5KGFwcCk7XHJcbiAgICAvLyBPbmNlIGZldGNoZWQsIG1hcCBtZWFzdXJlbWVudElkcyB0byBhcHBJZCwgZm9yIGVhc2Ugb2YgbG9va3VwIGluIHdyYXBwZWQgZ3RhZyBmdW5jdGlvbi5cclxuICAgIGR5bmFtaWNDb25maWdQcm9taXNlXHJcbiAgICAgICAgLnRoZW4oY29uZmlnID0+IHtcclxuICAgICAgICBtZWFzdXJlbWVudElkVG9BcHBJZFtjb25maWcubWVhc3VyZW1lbnRJZF0gPSBjb25maWcuYXBwSWQ7XHJcbiAgICAgICAgaWYgKGFwcC5vcHRpb25zLm1lYXN1cmVtZW50SWQgJiZcclxuICAgICAgICAgICAgY29uZmlnLm1lYXN1cmVtZW50SWQgIT09IGFwcC5vcHRpb25zLm1lYXN1cmVtZW50SWQpIHtcclxuICAgICAgICAgICAgbG9nZ2VyLndhcm4oYFRoZSBtZWFzdXJlbWVudCBJRCBpbiB0aGUgbG9jYWwgRmlyZWJhc2UgY29uZmlnICgke2FwcC5vcHRpb25zLm1lYXN1cmVtZW50SWR9KWAgK1xyXG4gICAgICAgICAgICAgICAgYCBkb2VzIG5vdCBtYXRjaCB0aGUgbWVhc3VyZW1lbnQgSUQgZmV0Y2hlZCBmcm9tIHRoZSBzZXJ2ZXIgKCR7Y29uZmlnLm1lYXN1cmVtZW50SWR9KS5gICtcclxuICAgICAgICAgICAgICAgIGAgVG8gZW5zdXJlIGFuYWx5dGljcyBldmVudHMgYXJlIGFsd2F5cyBzZW50IHRvIHRoZSBjb3JyZWN0IEFuYWx5dGljcyBwcm9wZXJ0eSxgICtcclxuICAgICAgICAgICAgICAgIGAgdXBkYXRlIHRoZWAgK1xyXG4gICAgICAgICAgICAgICAgYCBtZWFzdXJlbWVudCBJRCBmaWVsZCBpbiB0aGUgbG9jYWwgY29uZmlnIG9yIHJlbW92ZSBpdCBmcm9tIHRoZSBsb2NhbCBjb25maWcuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuICAgICAgICAuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG4gICAgLy8gQWRkIHRvIGxpc3QgdG8gdHJhY2sgc3RhdGUgb2YgYWxsIGR5bmFtaWMgY29uZmlnIHByb21pc2VzLlxyXG4gICAgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdC5wdXNoKGR5bmFtaWNDb25maWdQcm9taXNlKTtcclxuICAgIGNvbnN0IGZpZFByb21pc2UgPSB2YWxpZGF0ZUluZGV4ZWREQigpLnRoZW4oZW52SXNWYWxpZCA9PiB7XHJcbiAgICAgICAgaWYgKGVudklzVmFsaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGluc3RhbGxhdGlvbnMuZ2V0SWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBbZHluYW1pY0NvbmZpZywgZmlkXSA9IGF3YWl0IFByb21pc2UuYWxsKFtcclxuICAgICAgICBkeW5hbWljQ29uZmlnUHJvbWlzZSxcclxuICAgICAgICBmaWRQcm9taXNlXHJcbiAgICBdKTtcclxuICAgIC8vIERldGVjdCBpZiB1c2VyIGhhcyBhbHJlYWR5IHB1dCB0aGUgZ3RhZyA8c2NyaXB0PiB0YWcgb24gdGhpcyBwYWdlIHdpdGggdGhlIHBhc3NlZCBpblxyXG4gICAgLy8gZGF0YSBsYXllciBuYW1lLlxyXG4gICAgaWYgKCFmaW5kR3RhZ1NjcmlwdE9uUGFnZShkYXRhTGF5ZXJOYW1lKSkge1xyXG4gICAgICAgIGluc2VydFNjcmlwdFRhZyhkYXRhTGF5ZXJOYW1lLCBkeW5hbWljQ29uZmlnLm1lYXN1cmVtZW50SWQpO1xyXG4gICAgfVxyXG4gICAgLy8gRGV0ZWN0cyBpZiB0aGVyZSBhcmUgY29uc2VudCBzZXR0aW5ncyB0aGF0IG5lZWQgdG8gYmUgY29uZmlndXJlZC5cclxuICAgIGlmIChkZWZhdWx0Q29uc2VudFNldHRpbmdzRm9ySW5pdCkge1xyXG4gICAgICAgIGd0YWdDb3JlKFwiY29uc2VudFwiIC8qIEd0YWdDb21tYW5kLkNPTlNFTlQgKi8sICdkZWZhdWx0JywgZGVmYXVsdENvbnNlbnRTZXR0aW5nc0ZvckluaXQpO1xyXG4gICAgICAgIF9zZXRDb25zZW50RGVmYXVsdEZvckluaXQodW5kZWZpbmVkKTtcclxuICAgIH1cclxuICAgIC8vIFRoaXMgY29tbWFuZCBpbml0aWFsaXplcyBndGFnLmpzIGFuZCBvbmx5IG5lZWRzIHRvIGJlIGNhbGxlZCBvbmNlIGZvciB0aGUgZW50aXJlIHdlYiBhcHAsXHJcbiAgICAvLyBidXQgc2luY2UgaXQgaXMgaWRlbXBvdGVudCwgd2UgY2FuIGNhbGwgaXQgbXVsdGlwbGUgdGltZXMuXHJcbiAgICAvLyBXZSBrZWVwIGl0IHRvZ2V0aGVyIHdpdGggb3RoZXIgaW5pdGlhbGl6YXRpb24gbG9naWMgZm9yIGJldHRlciBjb2RlIHN0cnVjdHVyZS5cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55XHJcbiAgICBndGFnQ29yZSgnanMnLCBuZXcgRGF0ZSgpKTtcclxuICAgIC8vIFVzZXIgY29uZmlnIGFkZGVkIGZpcnN0LiBXZSBkb24ndCB3YW50IHVzZXJzIHRvIGFjY2lkZW50YWxseSBvdmVyd3JpdGVcclxuICAgIC8vIGJhc2UgRmlyZWJhc2UgY29uZmlnIHByb3BlcnRpZXMuXHJcbiAgICBjb25zdCBjb25maWdQcm9wZXJ0aWVzID0gKF9hID0gb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmNvbmZpZykgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDoge307XHJcbiAgICAvLyBndWFyZCBhZ2FpbnN0IGRldmVsb3BlcnMgYWNjaWRlbnRhbGx5IHNldHRpbmcgcHJvcGVydGllcyB3aXRoIHByZWZpeCBgZmlyZWJhc2VfYFxyXG4gICAgY29uZmlnUHJvcGVydGllc1tPUklHSU5fS0VZXSA9ICdmaXJlYmFzZSc7XHJcbiAgICBjb25maWdQcm9wZXJ0aWVzLnVwZGF0ZSA9IHRydWU7XHJcbiAgICBpZiAoZmlkICE9IG51bGwpIHtcclxuICAgICAgICBjb25maWdQcm9wZXJ0aWVzW0dBX0ZJRF9LRVldID0gZmlkO1xyXG4gICAgfVxyXG4gICAgLy8gSXQgc2hvdWxkIGJlIHRoZSBmaXJzdCBjb25maWcgY29tbWFuZCBjYWxsZWQgb24gdGhpcyBHQS1JRFxyXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGlzIEdBLUlEIGFuZCBzZXQgRklEIG9uIGl0IHVzaW5nIHRoZSBndGFnIGNvbmZpZyBBUEkuXHJcbiAgICAvLyBOb3RlOiBUaGlzIHdpbGwgdHJpZ2dlciBhIHBhZ2VfdmlldyBldmVudCB1bmxlc3MgJ3NlbmRfcGFnZV92aWV3JyBpcyBzZXQgdG8gZmFsc2UgaW5cclxuICAgIC8vIGBjb25maWdQcm9wZXJ0aWVzYC5cclxuICAgIGd0YWdDb3JlKFwiY29uZmlnXCIgLyogR3RhZ0NvbW1hbmQuQ09ORklHICovLCBkeW5hbWljQ29uZmlnLm1lYXN1cmVtZW50SWQsIGNvbmZpZ1Byb3BlcnRpZXMpO1xyXG4gICAgLy8gRGV0ZWN0cyBpZiB0aGVyZSBpcyBkYXRhIHRoYXQgd2lsbCBiZSBzZXQgb24gZXZlcnkgZXZlbnQgbG9nZ2VkIGZyb20gdGhlIFNESy5cclxuICAgIGlmIChkZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdCkge1xyXG4gICAgICAgIGd0YWdDb3JlKFwic2V0XCIgLyogR3RhZ0NvbW1hbmQuU0VUICovLCBkZWZhdWx0RXZlbnRQYXJhbWV0ZXJzRm9ySW5pdCk7XHJcbiAgICAgICAgX3NldERlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0KHVuZGVmaW5lZCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZHluYW1pY0NvbmZpZy5tZWFzdXJlbWVudElkO1xyXG59XG5cbi8qKlxyXG4gKiBAbGljZW5zZVxyXG4gKiBDb3B5cmlnaHQgMjAxOSBHb29nbGUgTExDXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbi8qKlxyXG4gKiBBbmFseXRpY3MgU2VydmljZSBjbGFzcy5cclxuICovXHJcbmNsYXNzIEFuYWx5dGljc1NlcnZpY2Uge1xyXG4gICAgY29uc3RydWN0b3IoYXBwKSB7XHJcbiAgICAgICAgdGhpcy5hcHAgPSBhcHA7XHJcbiAgICB9XHJcbiAgICBfZGVsZXRlKCkge1xyXG4gICAgICAgIGRlbGV0ZSBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW3RoaXMuYXBwLm9wdGlvbnMuYXBwSWRdO1xyXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogTWFwcyBhcHBJZCB0byBmdWxsIGluaXRpYWxpemF0aW9uIHByb21pc2UuIFdyYXBwZWQgZ3RhZyBjYWxscyBtdXN0IHdhaXQgb25cclxuICogYWxsIG9yIHNvbWUgb2YgdGhlc2UsIGRlcGVuZGluZyBvbiB0aGUgY2FsbCdzIGBzZW5kX3RvYCBwYXJhbSBhbmQgdGhlIHN0YXR1c1xyXG4gKiBvZiB0aGUgZHluYW1pYyBjb25maWcgZmV0Y2hlcyAoc2VlIGJlbG93KS5cclxuICovXHJcbmxldCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwID0ge307XHJcbi8qKlxyXG4gKiBMaXN0IG9mIGR5bmFtaWMgY29uZmlnIGZldGNoIHByb21pc2VzLiBJbiBjZXJ0YWluIGNhc2VzLCB3cmFwcGVkIGd0YWcgY2FsbHNcclxuICogd2FpdCBvbiBhbGwgdGhlc2UgdG8gYmUgY29tcGxldGUgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIGlmIGl0IGNhbiBzZWxlY3RpdmVseVxyXG4gKiB3YWl0IGZvciBvbmx5IGNlcnRhaW4gaW5pdGlhbGl6YXRpb24gKEZJRCkgcHJvbWlzZXMgb3IgaWYgaXQgbXVzdCB3YWl0IGZvciBhbGwuXHJcbiAqL1xyXG5sZXQgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCA9IFtdO1xyXG4vKipcclxuICogTWFwcyBmZXRjaGVkIG1lYXN1cmVtZW50SWRzIHRvIGFwcElkLiBQb3B1bGF0ZWQgd2hlbiB0aGUgYXBwJ3MgZHluYW1pYyBjb25maWdcclxuICogZmV0Y2ggY29tcGxldGVzLiBJZiBhbHJlYWR5IHBvcHVsYXRlZCwgZ3RhZyBjb25maWcgY2FsbHMgY2FuIHVzZSB0aGlzIHRvXHJcbiAqIHNlbGVjdGl2ZWx5IHdhaXQgZm9yIG9ubHkgdGhpcyBhcHAncyBpbml0aWFsaXphdGlvbiBwcm9taXNlIChGSUQpIGluc3RlYWQgb2YgYWxsXHJcbiAqIGluaXRpYWxpemF0aW9uIHByb21pc2VzLlxyXG4gKi9cclxuY29uc3QgbWVhc3VyZW1lbnRJZFRvQXBwSWQgPSB7fTtcclxuLyoqXHJcbiAqIE5hbWUgZm9yIHdpbmRvdyBnbG9iYWwgZGF0YSBsYXllciBhcnJheSB1c2VkIGJ5IEdBOiBkZWZhdWx0cyB0byAnZGF0YUxheWVyJy5cclxuICovXHJcbmxldCBkYXRhTGF5ZXJOYW1lID0gJ2RhdGFMYXllcic7XHJcbi8qKlxyXG4gKiBOYW1lIGZvciB3aW5kb3cgZ2xvYmFsIGd0YWcgZnVuY3Rpb24gdXNlZCBieSBHQTogZGVmYXVsdHMgdG8gJ2d0YWcnLlxyXG4gKi9cclxubGV0IGd0YWdOYW1lID0gJ2d0YWcnO1xyXG4vKipcclxuICogUmVwcm9kdWN0aW9uIG9mIHN0YW5kYXJkIGd0YWcgZnVuY3Rpb24gb3IgcmVmZXJlbmNlIHRvIGV4aXN0aW5nXHJcbiAqIGd0YWcgZnVuY3Rpb24gb24gd2luZG93IG9iamVjdC5cclxuICovXHJcbmxldCBndGFnQ29yZUZ1bmN0aW9uO1xyXG4vKipcclxuICogV3JhcHBlciBhcm91bmQgZ3RhZyBmdW5jdGlvbiB0aGF0IGVuc3VyZXMgRklEIGlzIHNlbnQgd2l0aCBhbGxcclxuICogcmVsZXZhbnQgZXZlbnQgYW5kIGNvbmZpZyBjYWxscy5cclxuICovXHJcbmxldCB3cmFwcGVkR3RhZ0Z1bmN0aW9uO1xyXG4vKipcclxuICogRmxhZyB0byBlbnN1cmUgcGFnZSBpbml0aWFsaXphdGlvbiBzdGVwcyAoY3JlYXRpb24gb3Igd3JhcHBpbmcgb2ZcclxuICogZGF0YUxheWVyIGFuZCBndGFnIHNjcmlwdCkgYXJlIG9ubHkgcnVuIG9uY2UgcGVyIHBhZ2UgbG9hZC5cclxuICovXHJcbmxldCBnbG9iYWxJbml0RG9uZSA9IGZhbHNlO1xyXG4vKipcclxuICogQ29uZmlndXJlcyBGaXJlYmFzZSBBbmFseXRpY3MgdG8gdXNlIGN1c3RvbSBgZ3RhZ2Agb3IgYGRhdGFMYXllcmAgbmFtZXMuXHJcbiAqIEludGVuZGVkIHRvIGJlIHVzZWQgaWYgYGd0YWcuanNgIHNjcmlwdCBoYXMgYmVlbiBpbnN0YWxsZWQgb25cclxuICogdGhpcyBwYWdlIGluZGVwZW5kZW50bHkgb2YgRmlyZWJhc2UgQW5hbHl0aWNzLCBhbmQgaXMgdXNpbmcgbm9uLWRlZmF1bHRcclxuICogbmFtZXMgZm9yIGVpdGhlciB0aGUgYGd0YWdgIGZ1bmN0aW9uIG9yIGZvciBgZGF0YUxheWVyYC5cclxuICogTXVzdCBiZSBjYWxsZWQgYmVmb3JlIGNhbGxpbmcgYGdldEFuYWx5dGljcygpYCBvciBpdCB3b24ndFxyXG4gKiBoYXZlIGFueSBlZmZlY3QuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIG9wdGlvbnMgLSBDdXN0b20gZ3RhZyBhbmQgZGF0YUxheWVyIG5hbWVzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0dGluZ3Mob3B0aW9ucykge1xyXG4gICAgaWYgKGdsb2JhbEluaXREb25lKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhbHJlYWR5LWluaXRpYWxpemVkXCIgLyogQW5hbHl0aWNzRXJyb3IuQUxSRUFEWV9JTklUSUFMSVpFRCAqLyk7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5kYXRhTGF5ZXJOYW1lKSB7XHJcbiAgICAgICAgZGF0YUxheWVyTmFtZSA9IG9wdGlvbnMuZGF0YUxheWVyTmFtZTtcclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLmd0YWdOYW1lKSB7XHJcbiAgICAgICAgZ3RhZ05hbWUgPSBvcHRpb25zLmd0YWdOYW1lO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBSZXR1cm5zIHRydWUgaWYgbm8gZW52aXJvbm1lbnQgbWlzbWF0Y2ggaXMgZm91bmQuXHJcbiAqIElmIGVudmlyb25tZW50IG1pc21hdGNoZXMgYXJlIGZvdW5kLCB0aHJvd3MgYW4gSU5WQUxJRF9BTkFMWVRJQ1NfQ09OVEVYVFxyXG4gKiBlcnJvciB0aGF0IGFsc28gbGlzdHMgZGV0YWlscyBmb3IgZWFjaCBtaXNtYXRjaCBmb3VuZC5cclxuICovXHJcbmZ1bmN0aW9uIHdhcm5PbkJyb3dzZXJDb250ZXh0TWlzbWF0Y2goKSB7XHJcbiAgICBjb25zdCBtaXNtYXRjaGVkRW52TWVzc2FnZXMgPSBbXTtcclxuICAgIGlmIChpc0Jyb3dzZXJFeHRlbnNpb24oKSkge1xyXG4gICAgICAgIG1pc21hdGNoZWRFbnZNZXNzYWdlcy5wdXNoKCdUaGlzIGlzIGEgYnJvd3NlciBleHRlbnNpb24gZW52aXJvbm1lbnQuJyk7XHJcbiAgICB9XHJcbiAgICBpZiAoIWFyZUNvb2tpZXNFbmFibGVkKCkpIHtcclxuICAgICAgICBtaXNtYXRjaGVkRW52TWVzc2FnZXMucHVzaCgnQ29va2llcyBhcmUgbm90IGF2YWlsYWJsZS4nKTtcclxuICAgIH1cclxuICAgIGlmIChtaXNtYXRjaGVkRW52TWVzc2FnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGNvbnN0IGRldGFpbHMgPSBtaXNtYXRjaGVkRW52TWVzc2FnZXNcclxuICAgICAgICAgICAgLm1hcCgobWVzc2FnZSwgaW5kZXgpID0+IGAoJHtpbmRleCArIDF9KSAke21lc3NhZ2V9YClcclxuICAgICAgICAgICAgLmpvaW4oJyAnKTtcclxuICAgICAgICBjb25zdCBlcnIgPSBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImludmFsaWQtYW5hbHl0aWNzLWNvbnRleHRcIiAvKiBBbmFseXRpY3NFcnJvci5JTlZBTElEX0FOQUxZVElDU19DT05URVhUICovLCB7XHJcbiAgICAgICAgICAgIGVycm9ySW5mbzogZGV0YWlsc1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxvZ2dlci53YXJuKGVyci5tZXNzYWdlKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogQW5hbHl0aWNzIGluc3RhbmNlIGZhY3RvcnkuXHJcbiAqIEBpbnRlcm5hbFxyXG4gKi9cclxuZnVuY3Rpb24gZmFjdG9yeShhcHAsIGluc3RhbGxhdGlvbnMsIG9wdGlvbnMpIHtcclxuICAgIHdhcm5PbkJyb3dzZXJDb250ZXh0TWlzbWF0Y2goKTtcclxuICAgIGNvbnN0IGFwcElkID0gYXBwLm9wdGlvbnMuYXBwSWQ7XHJcbiAgICBpZiAoIWFwcElkKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJuby1hcHAtaWRcIiAvKiBBbmFseXRpY3NFcnJvci5OT19BUFBfSUQgKi8pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFhcHAub3B0aW9ucy5hcGlLZXkpIHtcclxuICAgICAgICBpZiAoYXBwLm9wdGlvbnMubWVhc3VyZW1lbnRJZCkge1xyXG4gICAgICAgICAgICBsb2dnZXIud2FybihgVGhlIFwiYXBpS2V5XCIgZmllbGQgaXMgZW1wdHkgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy4gVGhpcyBpcyBuZWVkZWQgdG8gZmV0Y2ggdGhlIGxhdGVzdGAgK1xyXG4gICAgICAgICAgICAgICAgYCBtZWFzdXJlbWVudCBJRCBmb3IgdGhpcyBGaXJlYmFzZSBhcHAuIEZhbGxpbmcgYmFjayB0byB0aGUgbWVhc3VyZW1lbnQgSUQgJHthcHAub3B0aW9ucy5tZWFzdXJlbWVudElkfWAgK1xyXG4gICAgICAgICAgICAgICAgYCBwcm92aWRlZCBpbiB0aGUgXCJtZWFzdXJlbWVudElkXCIgZmllbGQgaW4gdGhlIGxvY2FsIEZpcmViYXNlIGNvbmZpZy5gKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRocm93IEVSUk9SX0ZBQ1RPUlkuY3JlYXRlKFwibm8tYXBpLWtleVwiIC8qIEFuYWx5dGljc0Vycm9yLk5PX0FQSV9LRVkgKi8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FwcElkXSAhPSBudWxsKSB7XHJcbiAgICAgICAgdGhyb3cgRVJST1JfRkFDVE9SWS5jcmVhdGUoXCJhbHJlYWR5LWV4aXN0c1wiIC8qIEFuYWx5dGljc0Vycm9yLkFMUkVBRFlfRVhJU1RTICovLCB7XHJcbiAgICAgICAgICAgIGlkOiBhcHBJZFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCFnbG9iYWxJbml0RG9uZSkge1xyXG4gICAgICAgIC8vIFN0ZXBzIGhlcmUgc2hvdWxkIG9ubHkgYmUgZG9uZSBvbmNlIHBlciBwYWdlOiBjcmVhdGlvbiBvciB3cmFwcGluZ1xyXG4gICAgICAgIC8vIG9mIGRhdGFMYXllciBhbmQgZ2xvYmFsIGd0YWcgZnVuY3Rpb24uXHJcbiAgICAgICAgZ2V0T3JDcmVhdGVEYXRhTGF5ZXIoZGF0YUxheWVyTmFtZSk7XHJcbiAgICAgICAgY29uc3QgeyB3cmFwcGVkR3RhZywgZ3RhZ0NvcmUgfSA9IHdyYXBPckNyZWF0ZUd0YWcoaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGRhdGFMYXllck5hbWUsIGd0YWdOYW1lKTtcclxuICAgICAgICB3cmFwcGVkR3RhZ0Z1bmN0aW9uID0gd3JhcHBlZEd0YWc7XHJcbiAgICAgICAgZ3RhZ0NvcmVGdW5jdGlvbiA9IGd0YWdDb3JlO1xyXG4gICAgICAgIGdsb2JhbEluaXREb25lID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8vIEFzeW5jIGJ1dCBub24tYmxvY2tpbmcuXHJcbiAgICAvLyBUaGlzIG1hcCByZWZsZWN0cyB0aGUgY29tcGxldGlvbiBzdGF0ZSBvZiBhbGwgcHJvbWlzZXMgZm9yIGVhY2ggYXBwSWQuXHJcbiAgICBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FwcElkXSA9IF9pbml0aWFsaXplQW5hbHl0aWNzKGFwcCwgZHluYW1pY0NvbmZpZ1Byb21pc2VzTGlzdCwgbWVhc3VyZW1lbnRJZFRvQXBwSWQsIGluc3RhbGxhdGlvbnMsIGd0YWdDb3JlRnVuY3Rpb24sIGRhdGFMYXllck5hbWUsIG9wdGlvbnMpO1xyXG4gICAgY29uc3QgYW5hbHl0aWNzSW5zdGFuY2UgPSBuZXcgQW5hbHl0aWNzU2VydmljZShhcHApO1xyXG4gICAgcmV0dXJuIGFuYWx5dGljc0luc3RhbmNlO1xyXG59XG5cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cclxuLyoqXHJcbiAqIFJldHVybnMgYW4ge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UgZm9yIHRoZSBnaXZlbiBhcHAuXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICpcclxuICogQHBhcmFtIGFwcCAtIFRoZSB7QGxpbmsgQGZpcmViYXNlL2FwcCNGaXJlYmFzZUFwcH0gdG8gdXNlLlxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0QW5hbHl0aWNzKGFwcCA9IGdldEFwcCgpKSB7XHJcbiAgICBhcHAgPSBnZXRNb2R1bGFySW5zdGFuY2UoYXBwKTtcclxuICAgIC8vIERlcGVuZGVuY2llc1xyXG4gICAgY29uc3QgYW5hbHl0aWNzUHJvdmlkZXIgPSBfZ2V0UHJvdmlkZXIoYXBwLCBBTkFMWVRJQ1NfVFlQRSk7XHJcbiAgICBpZiAoYW5hbHl0aWNzUHJvdmlkZXIuaXNJbml0aWFsaXplZCgpKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuYWx5dGljc1Byb3ZpZGVyLmdldEltbWVkaWF0ZSgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGluaXRpYWxpemVBbmFseXRpY3MoYXBwKTtcclxufVxyXG4vKipcclxuICogUmV0dXJucyBhbiB7QGxpbmsgQW5hbHl0aWNzfSBpbnN0YW5jZSBmb3IgdGhlIGdpdmVuIGFwcC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcGFyYW0gYXBwIC0gVGhlIHtAbGluayBAZmlyZWJhc2UvYXBwI0ZpcmViYXNlQXBwfSB0byB1c2UuXHJcbiAqL1xyXG5mdW5jdGlvbiBpbml0aWFsaXplQW5hbHl0aWNzKGFwcCwgb3B0aW9ucyA9IHt9KSB7XHJcbiAgICAvLyBEZXBlbmRlbmNpZXNcclxuICAgIGNvbnN0IGFuYWx5dGljc1Byb3ZpZGVyID0gX2dldFByb3ZpZGVyKGFwcCwgQU5BTFlUSUNTX1RZUEUpO1xyXG4gICAgaWYgKGFuYWx5dGljc1Byb3ZpZGVyLmlzSW5pdGlhbGl6ZWQoKSkge1xyXG4gICAgICAgIGNvbnN0IGV4aXN0aW5nSW5zdGFuY2UgPSBhbmFseXRpY3NQcm92aWRlci5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICBpZiAoZGVlcEVxdWFsKG9wdGlvbnMsIGFuYWx5dGljc1Byb3ZpZGVyLmdldE9wdGlvbnMoKSkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGV4aXN0aW5nSW5zdGFuY2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImFscmVhZHktaW5pdGlhbGl6ZWRcIiAvKiBBbmFseXRpY3NFcnJvci5BTFJFQURZX0lOSVRJQUxJWkVEICovKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBhbmFseXRpY3NJbnN0YW5jZSA9IGFuYWx5dGljc1Byb3ZpZGVyLmluaXRpYWxpemUoeyBvcHRpb25zIH0pO1xyXG4gICAgcmV0dXJuIGFuYWx5dGljc0luc3RhbmNlO1xyXG59XHJcbi8qKlxyXG4gKiBUaGlzIGlzIGEgcHVibGljIHN0YXRpYyBtZXRob2QgcHJvdmlkZWQgdG8gdXNlcnMgdGhhdCB3cmFwcyBmb3VyIGRpZmZlcmVudCBjaGVja3M6XHJcbiAqXHJcbiAqIDEuIENoZWNrIGlmIGl0J3Mgbm90IGEgYnJvd3NlciBleHRlbnNpb24gZW52aXJvbm1lbnQuXHJcbiAqIDIuIENoZWNrIGlmIGNvb2tpZXMgYXJlIGVuYWJsZWQgaW4gY3VycmVudCBicm93c2VyLlxyXG4gKiAzLiBDaGVjayBpZiBJbmRleGVkREIgaXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyIGVudmlyb25tZW50LlxyXG4gKiA0LiBDaGVjayBpZiB0aGUgY3VycmVudCBicm93c2VyIGNvbnRleHQgaXMgdmFsaWQgZm9yIHVzaW5nIGBJbmRleGVkREIub3BlbigpYC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKi9cclxuYXN5bmMgZnVuY3Rpb24gaXNTdXBwb3J0ZWQoKSB7XHJcbiAgICBpZiAoaXNCcm93c2VyRXh0ZW5zaW9uKCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoIWFyZUNvb2tpZXNFbmFibGVkKCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoIWlzSW5kZXhlZERCQXZhaWxhYmxlKCkpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGNvbnN0IGlzREJPcGVuYWJsZSA9IGF3YWl0IHZhbGlkYXRlSW5kZXhlZERCT3BlbmFibGUoKTtcclxuICAgICAgICByZXR1cm4gaXNEQk9wZW5hYmxlO1xyXG4gICAgfVxyXG4gICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbi8qKlxyXG4gKiBVc2UgZ3RhZyBgY29uZmlnYCBjb21tYW5kIHRvIHNldCBgc2NyZWVuX25hbWVgLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIFVzZSB7QGxpbmsgbG9nRXZlbnR9IHdpdGggYGV2ZW50TmFtZWAgYXMgJ3NjcmVlbl92aWV3JyBhbmQgYWRkIHJlbGV2YW50IGBldmVudFBhcmFtc2AuXHJcbiAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9maXJlYmFzZS5nb29nbGUuY29tL2RvY3MvYW5hbHl0aWNzL3NjcmVlbnZpZXdzIHwgVHJhY2sgU2NyZWVudmlld3N9LlxyXG4gKlxyXG4gKiBAcGFyYW0gYW5hbHl0aWNzSW5zdGFuY2UgLSBUaGUge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBzY3JlZW5OYW1lIC0gU2NyZWVuIG5hbWUgdG8gc2V0LlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0Q3VycmVudFNjcmVlbihhbmFseXRpY3NJbnN0YW5jZSwgc2NyZWVuTmFtZSwgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0Q3VycmVudFNjcmVlbiQxKHdyYXBwZWRHdGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbYW5hbHl0aWNzSW5zdGFuY2UuYXBwLm9wdGlvbnMuYXBwSWRdLCBzY3JlZW5OYW1lLCBvcHRpb25zKS5jYXRjaChlID0+IGxvZ2dlci5lcnJvcihlKSk7XHJcbn1cclxuLyoqXHJcbiAqIFJldHJpZXZlcyBhIHVuaXF1ZSBHb29nbGUgQW5hbHl0aWNzIGlkZW50aWZpZXIgZm9yIHRoZSB3ZWIgY2xpZW50LlxyXG4gKiBTZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9nYTQvcmVmZXJlbmNlL2NvbmZpZyNjbGllbnRfaWQgfCBjbGllbnRfaWR9LlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqXHJcbiAqIEBwYXJhbSBhcHAgLSBUaGUge0BsaW5rIEBmaXJlYmFzZS9hcHAjRmlyZWJhc2VBcHB9IHRvIHVzZS5cclxuICovXHJcbmFzeW5jIGZ1bmN0aW9uIGdldEdvb2dsZUFuYWx5dGljc0NsaWVudElkKGFuYWx5dGljc0luc3RhbmNlKSB7XHJcbiAgICBhbmFseXRpY3NJbnN0YW5jZSA9IGdldE1vZHVsYXJJbnN0YW5jZShhbmFseXRpY3NJbnN0YW5jZSk7XHJcbiAgICByZXR1cm4gaW50ZXJuYWxHZXRHb29nbGVBbmFseXRpY3NDbGllbnRJZCh3cmFwcGVkR3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSk7XHJcbn1cclxuLyoqXHJcbiAqIFVzZSBndGFnIGBjb25maWdgIGNvbW1hbmQgdG8gc2V0IGB1c2VyX2lkYC5cclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcGFyYW0gYW5hbHl0aWNzSW5zdGFuY2UgLSBUaGUge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBpZCAtIFVzZXIgSUQgdG8gc2V0LlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0VXNlcklkKGFuYWx5dGljc0luc3RhbmNlLCBpZCwgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0VXNlcklkJDEod3JhcHBlZEd0YWdGdW5jdGlvbiwgaW5pdGlhbGl6YXRpb25Qcm9taXNlc01hcFthbmFseXRpY3NJbnN0YW5jZS5hcHAub3B0aW9ucy5hcHBJZF0sIGlkLCBvcHRpb25zKS5jYXRjaChlID0+IGxvZ2dlci5lcnJvcihlKSk7XHJcbn1cclxuLyoqXHJcbiAqIFVzZSBndGFnIGBjb25maWdgIGNvbW1hbmQgdG8gc2V0IGFsbCBwYXJhbXMgc3BlY2lmaWVkLlxyXG4gKlxyXG4gKiBAcHVibGljXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRVc2VyUHJvcGVydGllcyhhbmFseXRpY3NJbnN0YW5jZSwgcHJvcGVydGllcywgb3B0aW9ucykge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0VXNlclByb3BlcnRpZXMkMSh3cmFwcGVkR3RhZ0Z1bmN0aW9uLCBpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgcHJvcGVydGllcywgb3B0aW9ucykuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBTZXRzIHdoZXRoZXIgR29vZ2xlIEFuYWx5dGljcyBjb2xsZWN0aW9uIGlzIGVuYWJsZWQgZm9yIHRoaXMgYXBwIG9uIHRoaXMgZGV2aWNlLlxyXG4gKiBTZXRzIGdsb2JhbCBgd2luZG93WydnYS1kaXNhYmxlLWFuYWx5dGljc0lkJ10gPSB0cnVlO2BcclxuICpcclxuICogQHB1YmxpY1xyXG4gKlxyXG4gKiBAcGFyYW0gYW5hbHl0aWNzSW5zdGFuY2UgLSBUaGUge0BsaW5rIEFuYWx5dGljc30gaW5zdGFuY2UuXHJcbiAqIEBwYXJhbSBlbmFibGVkIC0gSWYgdHJ1ZSwgZW5hYmxlcyBjb2xsZWN0aW9uLCBpZiBmYWxzZSwgZGlzYWJsZXMgaXQuXHJcbiAqL1xyXG5mdW5jdGlvbiBzZXRBbmFseXRpY3NDb2xsZWN0aW9uRW5hYmxlZChhbmFseXRpY3NJbnN0YW5jZSwgZW5hYmxlZCkge1xyXG4gICAgYW5hbHl0aWNzSW5zdGFuY2UgPSBnZXRNb2R1bGFySW5zdGFuY2UoYW5hbHl0aWNzSW5zdGFuY2UpO1xyXG4gICAgc2V0QW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQkMShpbml0aWFsaXphdGlvblByb21pc2VzTWFwW2FuYWx5dGljc0luc3RhbmNlLmFwcC5vcHRpb25zLmFwcElkXSwgZW5hYmxlZCkuY2F0Y2goZSA9PiBsb2dnZXIuZXJyb3IoZSkpO1xyXG59XHJcbi8qKlxyXG4gKiBBZGRzIGRhdGEgdGhhdCB3aWxsIGJlIHNldCBvbiBldmVyeSBldmVudCBsb2dnZWQgZnJvbSB0aGUgU0RLLCBpbmNsdWRpbmcgYXV0b21hdGljIG9uZXMuXHJcbiAqIFdpdGggZ3RhZydzIFwic2V0XCIgY29tbWFuZCwgdGhlIHZhbHVlcyBwYXNzZWQgcGVyc2lzdCBvbiB0aGUgY3VycmVudCBwYWdlIGFuZCBhcmUgcGFzc2VkIHdpdGhcclxuICogYWxsIHN1YnNlcXVlbnQgZXZlbnRzLlxyXG4gKiBAcHVibGljXHJcbiAqIEBwYXJhbSBjdXN0b21QYXJhbXMgLSBBbnkgY3VzdG9tIHBhcmFtcyB0aGUgdXNlciBtYXkgcGFzcyB0byBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0RGVmYXVsdEV2ZW50UGFyYW1ldGVycyhjdXN0b21QYXJhbXMpIHtcclxuICAgIC8vIENoZWNrIGlmIHJlZmVyZW5jZSB0byBleGlzdGluZyBndGFnIGZ1bmN0aW9uIG9uIHdpbmRvdyBvYmplY3QgZXhpc3RzXHJcbiAgICBpZiAod3JhcHBlZEd0YWdGdW5jdGlvbikge1xyXG4gICAgICAgIHdyYXBwZWRHdGFnRnVuY3Rpb24oXCJzZXRcIiAvKiBHdGFnQ29tbWFuZC5TRVQgKi8sIGN1c3RvbVBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfc2V0RGVmYXVsdEV2ZW50UGFyYW1ldGVyc0ZvckluaXQoY3VzdG9tUGFyYW1zKTtcclxuICAgIH1cclxufVxyXG4vKipcclxuICogU2VuZHMgYSBHb29nbGUgQW5hbHl0aWNzIGV2ZW50IHdpdGggZ2l2ZW4gYGV2ZW50UGFyYW1zYC4gVGhpcyBtZXRob2RcclxuICogYXV0b21hdGljYWxseSBhc3NvY2lhdGVzIHRoaXMgbG9nZ2VkIGV2ZW50IHdpdGggdGhpcyBGaXJlYmFzZSB3ZWJcclxuICogYXBwIGluc3RhbmNlIG9uIHRoaXMgZGV2aWNlLlxyXG4gKiBMaXN0IG9mIG9mZmljaWFsIGV2ZW50IHBhcmFtZXRlcnMgY2FuIGJlIGZvdW5kIGluIHRoZSBndGFnLmpzXHJcbiAqIHJlZmVyZW5jZSBkb2N1bWVudGF0aW9uOlxyXG4gKiB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vZ3RhZ2pzL3JlZmVyZW5jZS9nYTQtZXZlbnRzXHJcbiAqIHwgdGhlIEdBNCByZWZlcmVuY2UgZG9jdW1lbnRhdGlvbn0uXHJcbiAqXHJcbiAqIEBwdWJsaWNcclxuICovXHJcbmZ1bmN0aW9uIGxvZ0V2ZW50KGFuYWx5dGljc0luc3RhbmNlLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKSB7XHJcbiAgICBhbmFseXRpY3NJbnN0YW5jZSA9IGdldE1vZHVsYXJJbnN0YW5jZShhbmFseXRpY3NJbnN0YW5jZSk7XHJcbiAgICBsb2dFdmVudCQxKHdyYXBwZWRHdGFnRnVuY3Rpb24sIGluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXBbYW5hbHl0aWNzSW5zdGFuY2UuYXBwLm9wdGlvbnMuYXBwSWRdLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKS5jYXRjaChlID0+IGxvZ2dlci5lcnJvcihlKSk7XHJcbn1cclxuLyoqXHJcbiAqIFNldHMgdGhlIGFwcGxpY2FibGUgZW5kIHVzZXIgY29uc2VudCBzdGF0ZSBmb3IgdGhpcyB3ZWIgYXBwIGFjcm9zcyBhbGwgZ3RhZyByZWZlcmVuY2VzIG9uY2VcclxuICogRmlyZWJhc2UgQW5hbHl0aWNzIGlzIGluaXRpYWxpemVkLlxyXG4gKlxyXG4gKiBVc2UgdGhlIHtAbGluayBDb25zZW50U2V0dGluZ3N9IHRvIHNwZWNpZnkgaW5kaXZpZHVhbCBjb25zZW50IHR5cGUgdmFsdWVzLiBCeSBkZWZhdWx0IGNvbnNlbnRcclxuICogdHlwZXMgYXJlIHNldCB0byBcImdyYW50ZWRcIi5cclxuICogQHB1YmxpY1xyXG4gKiBAcGFyYW0gY29uc2VudFNldHRpbmdzIC0gTWFwcyB0aGUgYXBwbGljYWJsZSBlbmQgdXNlciBjb25zZW50IHN0YXRlIGZvciBndGFnLmpzLlxyXG4gKi9cclxuZnVuY3Rpb24gc2V0Q29uc2VudChjb25zZW50U2V0dGluZ3MpIHtcclxuICAgIC8vIENoZWNrIGlmIHJlZmVyZW5jZSB0byBleGlzdGluZyBndGFnIGZ1bmN0aW9uIG9uIHdpbmRvdyBvYmplY3QgZXhpc3RzXHJcbiAgICBpZiAod3JhcHBlZEd0YWdGdW5jdGlvbikge1xyXG4gICAgICAgIHdyYXBwZWRHdGFnRnVuY3Rpb24oXCJjb25zZW50XCIgLyogR3RhZ0NvbW1hbmQuQ09OU0VOVCAqLywgJ3VwZGF0ZScsIGNvbnNlbnRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBfc2V0Q29uc2VudERlZmF1bHRGb3JJbml0KGNvbnNlbnRTZXR0aW5ncyk7XHJcbiAgICB9XHJcbn1cblxuY29uc3QgbmFtZSA9IFwiQGZpcmViYXNlL2FuYWx5dGljc1wiO1xuY29uc3QgdmVyc2lvbiA9IFwiMC4xMC4xXCI7XG5cbi8qKlxyXG4gKiBUaGUgRmlyZWJhc2UgQW5hbHl0aWNzIFdlYiBTREsuXHJcbiAqIFRoaXMgU0RLIGRvZXMgbm90IHdvcmsgaW4gYSBOb2RlLmpzIGVudmlyb25tZW50LlxyXG4gKlxyXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cclxuICovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyQW5hbHl0aWNzKCkge1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoQU5BTFlUSUNTX1RZUEUsIChjb250YWluZXIsIHsgb3B0aW9uczogYW5hbHl0aWNzT3B0aW9ucyB9KSA9PiB7XHJcbiAgICAgICAgLy8gZ2V0SW1tZWRpYXRlIGZvciBGaXJlYmFzZUFwcCB3aWxsIGFsd2F5cyBzdWNjZWVkXHJcbiAgICAgICAgY29uc3QgYXBwID0gY29udGFpbmVyLmdldFByb3ZpZGVyKCdhcHAnKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICBjb25zdCBpbnN0YWxsYXRpb25zID0gY29udGFpbmVyXHJcbiAgICAgICAgICAgIC5nZXRQcm92aWRlcignaW5zdGFsbGF0aW9ucy1pbnRlcm5hbCcpXHJcbiAgICAgICAgICAgIC5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICByZXR1cm4gZmFjdG9yeShhcHAsIGluc3RhbGxhdGlvbnMsIGFuYWx5dGljc09wdGlvbnMpO1xyXG4gICAgfSwgXCJQVUJMSUNcIiAvKiBDb21wb25lbnRUeXBlLlBVQkxJQyAqLykpO1xyXG4gICAgX3JlZ2lzdGVyQ29tcG9uZW50KG5ldyBDb21wb25lbnQoJ2FuYWx5dGljcy1pbnRlcm5hbCcsIGludGVybmFsRmFjdG9yeSwgXCJQUklWQVRFXCIgLyogQ29tcG9uZW50VHlwZS5QUklWQVRFICovKSk7XHJcbiAgICByZWdpc3RlclZlcnNpb24obmFtZSwgdmVyc2lvbik7XHJcbiAgICAvLyBCVUlMRF9UQVJHRVQgd2lsbCBiZSByZXBsYWNlZCBieSB2YWx1ZXMgbGlrZSBlc201LCBlc20yMDE3LCBjanM1LCBldGMgZHVyaW5nIHRoZSBjb21waWxhdGlvblxyXG4gICAgcmVnaXN0ZXJWZXJzaW9uKG5hbWUsIHZlcnNpb24sICdlc20yMDE3Jyk7XHJcbiAgICBmdW5jdGlvbiBpbnRlcm5hbEZhY3RvcnkoY29udGFpbmVyKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3QgYW5hbHl0aWNzID0gY29udGFpbmVyLmdldFByb3ZpZGVyKEFOQUxZVElDU19UWVBFKS5nZXRJbW1lZGlhdGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGxvZ0V2ZW50OiAoZXZlbnROYW1lLCBldmVudFBhcmFtcywgb3B0aW9ucykgPT4gbG9nRXZlbnQoYW5hbHl0aWNzLCBldmVudE5hbWUsIGV2ZW50UGFyYW1zLCBvcHRpb25zKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgICB0aHJvdyBFUlJPUl9GQUNUT1JZLmNyZWF0ZShcImludGVyb3AtY29tcG9uZW50LXJlZy1mYWlsZWRcIiAvKiBBbmFseXRpY3NFcnJvci5JTlRFUk9QX0NPTVBPTkVOVF9SRUdfRkFJTEVEICovLCB7XHJcbiAgICAgICAgICAgICAgICByZWFzb246IGVcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbnJlZ2lzdGVyQW5hbHl0aWNzKCk7XG5cbmV4cG9ydCB7IGdldEFuYWx5dGljcywgZ2V0R29vZ2xlQW5hbHl0aWNzQ2xpZW50SWQsIGluaXRpYWxpemVBbmFseXRpY3MsIGlzU3VwcG9ydGVkLCBsb2dFdmVudCwgc2V0QW5hbHl0aWNzQ29sbGVjdGlvbkVuYWJsZWQsIHNldENvbnNlbnQsIHNldEN1cnJlbnRTY3JlZW4sIHNldERlZmF1bHRFdmVudFBhcmFtZXRlcnMsIHNldFVzZXJJZCwgc2V0VXNlclByb3BlcnRpZXMsIHNldHRpbmdzIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5lc20yMDE3LmpzLm1hcFxuIiwiZXhwb3J0IGNvbnN0IGZpcmViYXNlQ29uZmlnID0ge1xuICBhcGlLZXk6IFwiQUl6YVN5QjhjMmxCVmkyNnU3WVJMOXN4T1A5N1VhcTN5TjhoVGw0XCIsXG4gIGF1dGhEb21haW46IFwiZnRtLWI5ZDk5LmZpcmViYXNlYXBwLmNvbVwiLFxuICBkYXRhYmFzZVVSTDogXCJodHRwczovL2Z0bS1iOWQ5OS5maXJlYmFzZWlvLmNvbVwiLFxuICBwcm9qZWN0SWQ6IFwiZnRtLWI5ZDk5XCIsXG4gIHN0b3JhZ2VCdWNrZXQ6IFwiZnRtLWI5ZDk5LmFwcHNwb3QuY29tXCIsXG4gIG1lc3NhZ2luZ1NlbmRlcklkOiBcIjYwMjQwMjM4Nzk0MVwiLFxuICBhcHBJZDogXCIxOjYwMjQwMjM4Nzk0MTp3ZWI6M2JkZDUwMmIwZTdjZTY3ODlkZTEwY1wiLFxuICBtZWFzdXJlbWVudElkOiBcIkctWE5FN1kyNDM5VlwiLFxufTtcbiIsImltcG9ydCB7IGluaXRpYWxpemVBcHAsIEZpcmViYXNlQXBwIH0gZnJvbSBcImZpcmViYXNlL2FwcFwiO1xuaW1wb3J0IHsgZ2V0QW5hbHl0aWNzLCBsb2dFdmVudCwgQW5hbHl0aWNzIH0gZnJvbSBcImZpcmViYXNlL2FuYWx5dGljc1wiO1xuaW1wb3J0IHsgZmlyZWJhc2VDb25maWcgfSBmcm9tIFwiLi9jb25maWdcIjtcblxuZXhwb3J0IGNsYXNzIEZpcmViYXNlQW5hbHl0aWNzTWFuYWdlciB7XG4gIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U6IEZpcmViYXNlQW5hbHl0aWNzTWFuYWdlcjtcbiAgcHVibGljIGZpcmViYXNlQXBwOiBGaXJlYmFzZUFwcDtcbiAgcHVibGljIGZpcmViYXNlQW5hbHl0aWNzOiBBbmFseXRpY3M7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLmZpcmViYXNlQXBwID0gaW5pdGlhbGl6ZUFwcChmaXJlYmFzZUNvbmZpZyk7XG4gICAgICB0aGlzLmZpcmViYXNlQW5hbHl0aWNzID0gZ2V0QW5hbHl0aWNzKHRoaXMuZmlyZWJhc2VBcHApO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igd2hpbGUgaW5pdGlhbGl6aW5nIEZpcmViYXNlOlwiLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZSgpOiBGaXJlYmFzZUFuYWx5dGljc01hbmFnZXIge1xuICAgIGlmICghRmlyZWJhc2VBbmFseXRpY3NNYW5hZ2VyLmluc3RhbmNlKSB7XG4gICAgICBGaXJlYmFzZUFuYWx5dGljc01hbmFnZXIuaW5zdGFuY2UgPSBuZXcgRmlyZWJhc2VBbmFseXRpY3NNYW5hZ2VyKCk7XG4gICAgfVxuICAgIHJldHVybiBGaXJlYmFzZUFuYWx5dGljc01hbmFnZXIuaW5zdGFuY2U7XG4gIH1cblxuICBwdWJsaWMgbG9nRXZlbnRXaXRoUGF5bG9hZChldmVudE5hbWU6IHN0cmluZywgcGF5bG9hZDogb2JqZWN0KTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnNvbGUubG9nKGBTZW5kaW5nIGN1c3RvbSBldmVudCAke2V2ZW50TmFtZX0gd2l0aCBkYXRhOmAsIHBheWxvYWQpO1xuICAgICAgbG9nRXZlbnQodGhpcy5maXJlYmFzZUFuYWx5dGljcywgZXZlbnROYW1lLCBwYXlsb2FkKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHdoaWxlIGxvZ2dpbmcgY3VzdG9tIGV2ZW50OlwiLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGxvZ1Nlc3Npb25TdGFydFdpdGhQYXlsb2FkKHBheWxvYWQ6IG9iamVjdCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkxvZ2dpbmcgc2Vzc2lvbiBzdGFydCB3aXRoIGRhdGE6XCIsIHBheWxvYWQpO1xuICAgICAgbG9nRXZlbnQodGhpcy5maXJlYmFzZUFuYWx5dGljcywgXCJzZXNzaW9uX3N0YXJ0XCIsIHBheWxvYWQpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3Igd2hpbGUgbG9nZ2luZyBzZXNzaW9uIHN0YXJ0OlwiLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGxvZ0Rvd25sb2FkUHJvZ3Jlc3NXaXRoUGF5bG9hZChldmVudE5hbWU6IHN0cmluZywgcGF5bG9hZDogb2JqZWN0KTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiTG9nZ2luZyBkb3dubG9hZCBwcm9ncmVzcyBmb3IgXCIsIGV2ZW50TmFtZSwgXCIgd2l0aCBkYXRhOlwiLCBwYXlsb2FkKTtcbiAgICAgIGxvZ0V2ZW50KHRoaXMuZmlyZWJhc2VBbmFseXRpY3MsIGV2ZW50TmFtZSwgcGF5bG9hZCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciB3aGlsZSBsb2dnaW5nIGRvd25sb2FkIHByb2dyZXNzOlwiLCBlcnJvcik7XG4gICAgfVxuICB9XG59XG4iLCIvLyBUaGUgR2xvYmFsIFByb3BlcnRpZXMgZmlsZSBkZXNjcmliZXMgdGhlIHByb3BlcnRpZXMgdGhhdCBhcmUgc2hhcmVkIGFjcm9zcyBtdWx0aXBsZSBmaWxlcyBpbiB0aGUgcHJvamVjdC5cblxuY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcblxuZXhwb3J0IHZhciBjclVzZXJJZDogc3RyaW5nID0gdXJsUGFyYW1zLmdldChcImNyX3VzZXJfaWRcIikgfHwgXCJ1bmtub3duXCI7XG5leHBvcnQgdmFyIGNhbXBhaWduU291cmNlOiBzdHJpbmcgPSB1cmxQYXJhbXMuZ2V0KFwic291cmNlXCIpIHx8IFwidW5rbm93blwiO1xuZXhwb3J0IHZhciBjYW1wYWlnbklkOiBzdHJpbmcgPSB1cmxQYXJhbXMuZ2V0KFwiY2FtcGFpZ25faWRcIikgfHwgXCJ1bmtub3duXCI7XG4iLCIvLyBNYWluIEVudHJ5IGZvciB0aGUgQ3VyaW91cyBSZWFkZXIgV2ViIFBsYXllciBBcHBcbmltcG9ydCB7IENvbnRlbnRQYXJzZXIgfSBmcm9tIFwiLi9zcmMvUGFyc2VyL0NvbnRlbnRQYXJzZXJcIjtcbmltcG9ydCB7IFBsYXlCYWNrRW5naW5lIH0gZnJvbSBcIi4vc3JjL1BsYXlCYWNrRW5naW5lL1BsYXlCYWNrRW5naW5lXCI7XG4vLyBpbXBvcnQgeyBXb3JrYm94LCBXb3JrYm94RXZlbnRNYXAgfSBmcm9tIFwid29ya2JveC13aW5kb3dcIjtcbmltcG9ydCB7IEJvb2sgfSBmcm9tIFwiLi9zcmMvTW9kZWxzL01vZGVsc1wiO1xuaW1wb3J0IHsgRmlyZWJhc2VBbmFseXRpY3NNYW5hZ2VyIH0gZnJvbSBcIi4vc3JjL0FuYWx5dGljcy9GaXJlYmFzZS9GaXJlYmFzZU1hbmFnZXJcIjtcbmltcG9ydCB7IGNhbXBhaWduSWQsIGNhbXBhaWduU291cmNlLCBjclVzZXJJZCB9IGZyb20gXCIuL3NyYy9jb21tb25cIjtcblxubGV0IGFwcFZlcnNpb246IHN0cmluZyA9IFwidjAuMy4xMVwiO1xubGV0IGFwcE5hbWU6IHN0cmluZyA9IFwiQ1JXZWJQbGF5ZXJcIjtcblxuLy8gY29uc3QgY2hhbm5lbCA9IG5ldyBCcm9hZGNhc3RDaGFubmVsKFwibXktY2hhbm5lbFwiKTtcblxuLy8gbGV0IGxvYWRpbmdTY3JlZW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxvYWRpbmdTY3JlZW5cIik7XG5cbmxldCBzZXNzaW9uU3RhcnRUaW1lOiBEYXRlO1xubGV0IGxvZ2dlZDI1UGVyY2VudERvd25sb2FkOiBib29sZWFuID0gZmFsc2U7XG5sZXQgbG9nZ2VkNTBQZXJjZW50RG93bmxvYWQ6IGJvb2xlYW4gPSBmYWxzZTtcbmxldCBsb2dnZWQ3NVBlcmNlbnREb3dubG9hZDogYm9vbGVhbiA9IGZhbHNlO1xubGV0IGxvZ2dlZDEwMFBlcmNlbnREb3dubG9hZDogYm9vbGVhbiA9IGZhbHNlO1xuXG5sZXQgZmlyZWJhc2VBbmFseXRpY3NNYW5hZ2VyOiBGaXJlYmFzZUFuYWx5dGljc01hbmFnZXIgPSBGaXJlYmFzZUFuYWx5dGljc01hbmFnZXIuZ2V0SW5zdGFuY2UoKTtcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG4gIHB1YmxpYyBib29rTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgY29udGVudFBhcnNlcjogQ29udGVudFBhcnNlcjtcbiAgcHVibGljIHBsYXlCYWNrRW5naW5lOiBQbGF5QmFja0VuZ2luZTtcbiAgcHVibGljIGNvbnRlbnRGaWxlUGF0aDogc3RyaW5nO1xuICBwdWJsaWMgaW1hZ2VzUGF0aDogc3RyaW5nO1xuICBwdWJsaWMgYXVkaW9QYXRoOiBzdHJpbmc7XG4gIHB1YmxpYyBicm9hZGNhc3RDaGFubmVsOiBCcm9hZGNhc3RDaGFubmVsO1xuICBwdWJsaWMgbGFuZzogc3RyaW5nO1xuICAvLyBwdWJsaWMgZmlyZWJhc2VBbmFseXRpY3NNYW5hZ2VyOiBGaXJlYmFzZUFuYWx5dGljc01hbmFnZXI7XG5cbiAgY29uc3RydWN0b3IoYm9va05hbWU6IHN0cmluZywgY29udGVudEZpbGVQYXRoOiBzdHJpbmcsIGltYWdlc1BhdGg6IHN0cmluZywgYXVkaW9QYXRoOiBzdHJpbmcpIHtcbiAgICBjb25zb2xlLmxvZyhcIkN1cmlvdXMgUmVhZGVyIEFwcCBcIiArIGFwcFZlcnNpb24gKyBcIiBpbml0aWFsaXppbmchXCIpO1xuICAgIHRoaXMuYm9va05hbWUgPSBib29rTmFtZTtcbiAgICB0aGlzLmNvbnRlbnRGaWxlUGF0aCA9IGNvbnRlbnRGaWxlUGF0aDtcbiAgICB0aGlzLmltYWdlc1BhdGggPSBpbWFnZXNQYXRoO1xuICAgIHRoaXMuYXVkaW9QYXRoID0gYXVkaW9QYXRoO1xuICAgIC8vIExlYXZpbmcgdGhpcyBqdXN0IGluIGNhc2Ugd2UgbmVlZCB0byBsb2cgc2Vzc2lvbiBzdGFydFxuICAgIC8vIGZpcmViYXNlQW5hbHl0aWNzTWFuYWdlci5sb2dTZXNzaW9uU3RhcnRXaXRoUGF5bG9hZCh7XG4gICAgLy8gICAgIGFwcDogYXBwTmFtZSxcbiAgICAvLyAgICAgdmVyc2lvbjogYXBwVmVyc2lvbixcbiAgICAvLyAgICAgY3JfdXNlcl9pZDogY3JVc2VySWQsXG4gICAgLy8gICAgIHNvdXJjZTogY2FtcGFpZ25Tb3VyY2UsXG4gICAgLy8gICAgIGNhbXBhaWduSWQ6IGNhbXBhaWduSWQsXG4gICAgLy8gICAgIGJvb2tfbmFtZTogYm9va05hbWVcbiAgICAvLyB9KTtcbiAgICBzZXNzaW9uU3RhcnRUaW1lID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLmNvbnRlbnRQYXJzZXIgPSBuZXcgQ29udGVudFBhcnNlcihjb250ZW50RmlsZVBhdGgpO1xuICAgIHRoaXMucGxheUJhY2tFbmdpbmUgPSBuZXcgUGxheUJhY2tFbmdpbmUoaW1hZ2VzUGF0aCwgYXVkaW9QYXRoKTtcbiAgICAvLyB0aGlzLmJyb2FkY2FzdENoYW5uZWwgPSBuZXcgQnJvYWRjYXN0Q2hhbm5lbChcImNyLW1lc3NhZ2UtY2hhbm5lbFwiKTtcbiAgfVxuXG4gIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIC8vIExvYWQgYW5kIHBhcnNlIHRoZSBib29rIGRhdGFcbiAgICAgIGNvbnN0IGJvb2sgPSBhd2FpdCB0aGlzLmNvbnRlbnRQYXJzZXIucGFyc2VCb29rKCk7XG4gICAgICBib29rLmJvb2tOYW1lID0gdGhpcy5ib29rTmFtZTtcbiAgICAgIGNvbnNvbGUubG9nKFwiPj4+Pj4+Pj4+Pj4+Pj4+Pj5cIilcbiAgICAgIC8vIExvZyBib29rIGluZm9ybWF0aW9uIGZvciBkZWJ1Z2dpbmdcbiAgICAgIGNvbnNvbGUubG9nKFwiQXBwIGluaXRpYWxpemVkIHdpdGggYm9vazpcIiwgYm9vayk7XG5cbiAgICAgIC8vIEVuZm9yY2UgbGFuZHNjYXBlIG1vZGUgKGlmIHN1cHBvcnRlZClcbiAgICAgIHRoaXMuZW5mb3JjZUxhbmRzY2FwZU1vZGUoKTtcblxuICAgICAgLy8gUmVnaXN0ZXIgYSBzZXJ2aWNlIHdvcmtlciBmb3IgY2FjaGluZ1xuXG4gICAgICAvLyBhd2FpdCB0aGlzLnJlZ2lzdGVyU2VydmljZVdvcmtlcihib29rKTtcblxuICAgICAgLy8gSW5pdGlhbGl6ZSB0aGUgcGxheWJhY2sgZW5naW5lIHdpdGggdGhlIHBhcnNlZCBib29rIGRhdGFcbiAgICAgIHRoaXMucGxheUJhY2tFbmdpbmUuaW5pdGlhbGl6ZUJvb2soYm9vayk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6YXRpb24gY29tcGxldGVkIHN1Y2Nlc3NmdWxseSFcIik7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIEhhbmRsZSBhbnkgZXJyb3JzIHRoYXQgbWF5IG9jY3VyIGR1cmluZyBpbml0aWFsaXphdGlvblxuICAgICAgY29uc29sZS5lcnJvcihcIkluaXRpYWxpemF0aW9uIGVycm9yOlwiLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgZW5mb3JjZUxhbmRzY2FwZU1vZGUoKSB7XG5cbiAgICAvLyBBdHRlbXB0IHRvIGVuZm9yY2UgbGFuZHNjYXBlIG1vZGUgdGhyb3VnaCBBbmRyb2lkIGJyaWRnZSBjYWxsXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmICh3aW5kb3cuQW5kcm9pZCAmJiB0eXBlb2Ygd2luZG93LkFuZHJvaWQuc2V0Q29udGFpbmVyQXBwT3JpZW50YXRpb24gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgLy9AdHMtaWdub3JlXG4gICAgICB3aW5kb3cuQW5kcm9pZC5zZXRDb250YWluZXJBcHBPcmllbnRhdGlvbihcImxhbmRzY2FwZVwiKTtcbiAgICB9XG4gIH1cblxuICAvLyBhc3luYyByZWdpc3RlclNlcnZpY2VXb3JrZXIoYm9vazogQm9vaykge1xuICAvLyAgIGlmIChcInNlcnZpY2VXb3JrZXJcIiBpbiBuYXZpZ2F0b3IpIHtcbiAgLy8gICAgIHRyeSB7XG4gIC8vICAgICAgIC8vIGxldCB3YiA9IG5ldyBXb3JrYm94KFwiL3N3LmpzXCIsIHt9KTtcbiAgLy8gICAgICAgLy8gYXdhaXQgd2IucmVnaXN0ZXIoKTtcbiAgLy8gICAgICAgYXdhaXQgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIucmVhZHk7XG5cbiAgLy8gICAgICAgLy8gbG9hZGluZ1NjcmVlbiEuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuXG5cbiAgLy8gICAgICAgdGhpcy5icm9hZGNhc3RDaGFubmVsLm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAvLyAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwiQ1JhcHA6IE1lc3NhZ2UgUmVjZWl2ZWQhXCIpO1xuICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGV2ZW50LmRhdGEuY29tbWFuZCk7XG4gIC8vICAgICAgICAgaWYgKGV2ZW50LmRhdGEuY29tbWFuZCA9PSBcIkFjdGl2YXRlZFwiKSB7XG4gIC8vICAgICAgICAgICB0aGlzLmJyb2FkY2FzdENoYW5uZWwucG9zdE1lc3NhZ2Uoe1xuICAvLyAgICAgICAgICAgICBjb21tYW5kOiBcIkNhY2hlXCIsXG4gIC8vICAgICAgICAgICAgIGRhdGE6IHtcbiAgLy8gICAgICAgICAgICAgICBsYW5nOiB0aGlzLmxhbmcsXG4gIC8vICAgICAgICAgICAgICAgYm9va0RhdGE6IGJvb2ssXG4gIC8vICAgICAgICAgICAgICAgY29udGVudEZpbGU6IHRoaXMuY29udGVudEZpbGVQYXRoLFxuICAvLyAgICAgICAgICAgICB9LFxuICAvLyAgICAgICAgICAgfSk7XG4gIC8vICAgICAgICAgfVxuICAvLyAgICAgICAgIGlmIChldmVudC5kYXRhLmNvbW1hbmQgPT0gXCJDYWNoaW5nUHJvZ3Jlc3NcIikge1xuICAvLyAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJDYWNoaW5nIFByb2dyZXNzOiBcIiwgZXZlbnQuZGF0YS5kYXRhLnByb2dyZXNzKTtcbiAgLy8gICAgICAgICAgIGxldCBwcm9ncmVzc1ZhbHVlID0gcGFyc2VJbnQoZXZlbnQuZGF0YS5kYXRhLnByb2dyZXNzKTtcbiAgLy8gICAgICAgICAgIGhhbmRsZUxvYWRpbmdNZXNzYWdlKGV2ZW50LCBwcm9ncmVzc1ZhbHVlKTtcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgICAgaWYgKGV2ZW50LmRhdGEuY29tbWFuZCA9PSBcIlVwZGF0ZUZvdW5kXCIpIHtcbiAgLy8gICAgICAgICAgIGhhbmRsZVVwZGF0ZUZvdW5kTWVzc2FnZSgpO1xuICAvLyAgICAgICAgIH1cbiAgLy8gICAgICAgfTtcbiAgLy8gICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gIC8vICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3IgUmVnaXN0ZXJpbmcgU2VydmljZSBXb3JrZXJcIiwgZXJyb3IpO1xuICAvLyAgICAgfVxuICAvLyAgIH1cbiAgLy8gfVxufVxuXG4vLyBUT0RPOiBBZGRlZCB0byBiYWNrbG9nIGZvciBjbGVhbnVwLCB3ZSBpZGVhbGx5IHNob3VsZCBtb3ZlIHRoaXMgdG8gYSBzZXBhcmF0ZSBmaWxlLFxuLy8gYWxsIHRoZSBjYWNoaW5nIGxvZ2ljIHNob3VsZCBiZSBpbiB0aGUgc2VydmljZSB3b3JrZXIgY2xhc3Ncbi8vIHRoZXJlJ3Mgbm8gbmVlZCB0byBoYXZlIHRoZXNlIGZ1bmN0aW9ucyBzZXBhcmF0ZWx5IGFkZGVkIGluIHRoZSBBcHAudHMgYW55bW9yZSBzaW5jZSB3ZSBoYXZlIGFkZGVkIHRoZSBzZXJ2aWNlIHdvcmtlclxuLy8gY29tbXVuaWNhdGlvbiBvdmVyIHRoZSBicm9hZGNhc3QgY2hhbm5lbCBpbnN0ZWFkIG9mIHRoZVxuLy8gW3NlcnZpY2VXb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1lc3NhZ2VcIiwgaGFuZGxlU2VydmljZVdvcmtlck1lc3NhZ2UpO11cbmZ1bmN0aW9uIGhhbmRsZUxvYWRpbmdNZXNzYWdlKGV2ZW50LCBwcm9ncmVzc1ZhbHVlKTogdm9pZCB7XG4gIGxldCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvZ3Jlc3NCYXJcIik7XG4gIGlmIChwcm9ncmVzc1ZhbHVlIDwgMTAwKSB7XG4gICAgcHJvZ3Jlc3NCYXIhLnN0eWxlLndpZHRoID0gcHJvZ3Jlc3NWYWx1ZSArIFwiJVwiO1xuICB9XG5cbiAgaWYgKHByb2dyZXNzVmFsdWUgPj0gMjUgJiYgIWxvZ2dlZDI1UGVyY2VudERvd25sb2FkKSB7XG4gICAgbG9nZ2VkMjVQZXJjZW50RG93bmxvYWQgPSB0cnVlO1xuICAgIGxvZ0Rvd25sb2FkUHJvZ3Jlc3NXaXRoUGF5bG9hZFRvRmlyZWJhc2UoXCJkb3dubG9hZF8yNVwiLCBldmVudC5kYXRhLmRhdGEuYm9va05hbWUpO1xuICB9XG5cbiAgaWYgKHByb2dyZXNzVmFsdWUgPj0gNTAgJiYgIWxvZ2dlZDUwUGVyY2VudERvd25sb2FkKSB7XG4gICAgbG9nZ2VkNTBQZXJjZW50RG93bmxvYWQgPSB0cnVlO1xuICAgIGxvZ0Rvd25sb2FkUHJvZ3Jlc3NXaXRoUGF5bG9hZFRvRmlyZWJhc2UoXCJkb3dubG9hZF81MFwiLCBldmVudC5kYXRhLmRhdGEuYm9va05hbWUpO1xuICB9XG5cbiAgaWYgKHByb2dyZXNzVmFsdWUgPj0gNzUgJiYgIWxvZ2dlZDc1UGVyY2VudERvd25sb2FkKSB7XG4gICAgbG9nZ2VkNzVQZXJjZW50RG93bmxvYWQgPSB0cnVlO1xuICAgIGxvZ0Rvd25sb2FkUHJvZ3Jlc3NXaXRoUGF5bG9hZFRvRmlyZWJhc2UoXCJkb3dubG9hZF83NVwiLCBldmVudC5kYXRhLmRhdGEuYm9va05hbWUpO1xuICB9XG5cbiAgaWYgKHByb2dyZXNzVmFsdWUgPj0gMTAwKSB7XG4gICAgLy8gbG9hZGluZ1NjcmVlbiEuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIGlmICghbG9nZ2VkMTAwUGVyY2VudERvd25sb2FkKSB7XG4gICAgICBsb2dnZWQxMDBQZXJjZW50RG93bmxvYWQgPSB0cnVlO1xuICAgICAgbG9nRG93bmxvYWRQcm9ncmVzc1dpdGhQYXlsb2FkVG9GaXJlYmFzZShcImRvd25sb2FkX2NvbXBsZXRlZFwiLCBldmVudC5kYXRhLmRhdGEuYm9va05hbWUpO1xuICAgIH1cbiAgICAvLyBhZGQgYm9vayB3aXRoIGEgbmFtZSB0byBsb2NhbCBzdG9yYWdlIGFzIGNhY2hlZFxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGV2ZW50LmRhdGEuZGF0YS5ib29rTmFtZSwgXCJ0cnVlXCIpO1xuICAgIHJlYWRMYW5ndWFnZURhdGFGcm9tQ2FjaGVBbmROb3RpZnlBbmRyb2lkQXBwKGV2ZW50LmRhdGEuZGF0YS5ib29rTmFtZSk7XG4gIH1cbn1cblxuLyoqXG4gKiBMb2cgZG93bmxvYWQgcHJvZ3Jlc3Mgd2l0aCBwYXlsb2FkXG4gKiBAcGFyYW0gZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGxvZ1xuICogQHBhcmFtIGJvb2tOYW1lIE5hbWUgb2YgdGhlIGJvb2sgYmVpbmcgZG93bmxvYWRlZFxuICovXG5mdW5jdGlvbiBsb2dEb3dubG9hZFByb2dyZXNzV2l0aFBheWxvYWRUb0ZpcmViYXNlKGV2ZW50TmFtZTogc3RyaW5nLCBib29rTmFtZTogc3RyaW5nKTogdm9pZCB7XG4gIGxldCB0aW1lU3BlbnQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHNlc3Npb25TdGFydFRpbWUuZ2V0VGltZSgpO1xuICBmaXJlYmFzZUFuYWx5dGljc01hbmFnZXIubG9nRG93bmxvYWRQcm9ncmVzc1dpdGhQYXlsb2FkKGV2ZW50TmFtZSwge1xuICAgIGFwcDogYXBwTmFtZSxcbiAgICB2ZXJzaW9uOiBhcHBWZXJzaW9uLFxuICAgIGJvb2tfbmFtZTogYm9va05hbWUsXG4gICAgY3JfdXNlcl9pZDogY3JVc2VySWQsXG4gICAgbXNfc2luY2Vfc2Vzc2lvbl9zdGFydDogdGltZVNwZW50LFxuICB9KTtcbn1cblxuZnVuY3Rpb24gcmVhZExhbmd1YWdlRGF0YUZyb21DYWNoZUFuZE5vdGlmeUFuZHJvaWRBcHAoYm9va05hbWU6IHN0cmluZykge1xuICAvL0B0cy1pZ25vcmVcbiAgaWYgKHdpbmRvdy5BbmRyb2lkKSB7XG4gICAgbGV0IGlzQ29udGVudENhY2hlZDogYm9vbGVhbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGJvb2tOYW1lKSAhPT0gbnVsbDtcbiAgICAvL0B0cy1pZ25vcmVcbiAgICB3aW5kb3cuQW5kcm9pZC5jYWNoZWRTdGF0dXMoaXNDb250ZW50Q2FjaGVkKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYW5kbGVVcGRhdGVGb3VuZE1lc3NhZ2UoKTogdm9pZCB7XG4gIGxldCB0ZXh0ID0gXCJVcGRhdGUgRm91bmQuXFxuUGxlYXNlIGFjY2VwdCB0aGUgdXBkYXRlIGJ5IHByZXNzaW5nIE9rLlwiO1xuICBpZiAoY29uZmlybSh0ZXh0KSA9PSB0cnVlKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9IGVsc2Uge1xuICAgIHRleHQgPSBcIlVwZGF0ZSB3aWxsIGhhcHBlbiBvbiB0aGUgbmV4dCBsYXVuY2guXCI7XG4gIH1cbn1cblxuY29uc3QgcXVlcnlTdHJpbmcgPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhxdWVyeVN0cmluZyk7XG5sZXQgYm9va05hbWUgPSB1cmxQYXJhbXMuZ2V0KFwiYm9va1wiKTtcblxuY29uc3QgZGVmYXVsdEJvb2tOYW1lOiBzdHJpbmcgPSBcIkxldHNGbHlMZXZlbDJFblwiO1xuXG5pZiAoYm9va05hbWUgPT0gbnVsbCkge1xuICBib29rTmFtZSA9IGRlZmF1bHRCb29rTmFtZTtcbn1cblxuY29uc29sZS5sb2coXCJCb29rIE5hbWU6IFwiICsgYm9va05hbWUpO1xuXG5sZXQgYXBwOiBBcHAgPSBuZXcgQXBwKFxuICBib29rTmFtZSxcbiAgYC4vQm9va0NvbnRlbnQvJHtib29rTmFtZX0vY29udGVudC9jb250ZW50Lmpzb25gLFxuICBgLi9Cb29rQ29udGVudC8ke2Jvb2tOYW1lfS9jb250ZW50L2ltYWdlcy9gLFxuICBgLi9Cb29rQ29udGVudC8ke2Jvb2tOYW1lfS9jb250ZW50L2F1ZGlvcy9gXG4pO1xuXG5hcHAuaW5pdGlhbGl6ZSgpO1xuIl0sIm5hbWVzIjpbIkJvb2tUeXBlIiwiX193ZWJwYWNrX3JlcXVpcmVfXyIsImciLCJnbG9iYWxUaGlzIiwidGhpcyIsIkZ1bmN0aW9uIiwiZSIsIndpbmRvdyIsIkNvbnRlbnRQYXJzZXIiLCJjb25zdHJ1Y3RvciIsImNvbnRlbnRGaWxlUGF0aCIsImVtcHR5R2xvd0ltYWdlVGFnIiwicGFyc2VCb29rIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJwYXJzZUNvbnRlbnRKU09ORmlsZSIsInRoZW4iLCJjb250ZW50SlNPTiIsImNvbnNvbGUiLCJsb2ciLCJib29rIiwiYm9va05hbWUiLCJwYWdlcyIsImJvb2tUeXBlIiwiZGV0ZXJtaW5lQm9va1R5cGUiLCJwYXJzZVBhZ2VzIiwiY2F0Y2giLCJlcnJvciIsInVuZGVmaW5lZCIsIkN1cmlvdXNSZWFkZXIiLCJHREwiLCJVbmtub3duIiwicGFnZXNKU09OIiwiZ2xvYmFsRmlsbENvbG9yIiwiaSIsImxlbmd0aCIsInBhZ2VKU09OIiwicGFnZSIsInZpc3VhbEVsZW1lbnRzIiwiYmFja2dyb3VuZENvbG9yIiwicGFyc2VQYWdlQ1IiLCJwdXNoIiwicGFyc2VQYWdlR0RMIiwiZWxlbWVudHNKU09OIiwibGlicmFyeVN0cmluZyIsImluY2x1ZGVzIiwidGV4dEVsZW1lbnQiLCJwYXJzZVRleHRFbGVtZW50Q1IiLCJpbWFnZUVsZW1lbnQiLCJwYXJzZUltYWdlRWxlbWVudENSIiwiYXVkaW9FbGVtZW50IiwicGFyc2VBdWRpb0VsZW1lbnRDUiIsImVsZW1lbnRzSlNPTkFycmF5IiwicGFyc2VUZXh0RWxlbWVudEdETCIsInBhcnNlSW1hZ2VFbGVtZW50R0RMIiwiZWxlbWVudEpTT04iLCJ0eXBlIiwicG9zaXRpb25YIiwicG9zaXRpb25ZIiwid2lkdGgiLCJoZWlnaHQiLCJ0ZXh0Q29udGVudEFzSFRNTCIsIk5hTiIsInBhdGgiLCJkb21JRCIsImltYWdlU291cmNlIiwiYXVkaW9UaW1lc3RhbXBzIiwidGltZXN0YW1wcyIsInRpbWVzdGFtcHNKU09OQXJyYXkiLCJ0aW1lc3RhbXBJbmRleCIsInRpbWVzdGFtcEpTT04iLCJ0aW1lc3RhbXAiLCJ0b1N0cmluZyIsIndvcmQiLCJyZXBsYWNlIiwic3RhcnRUaW1lc3RhbXAiLCJlbmRUaW1lc3RhbXAiLCJhdWRpb1NyYyIsImdsb3dDb2xvciIsInN0eWxlcyIsInhociIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsInN0YXR1cyIsInJlc3BvbnNlIiwic2VuZCIsIl9kZWZpbmVQcm9wZXJ0aWVzIiwidGFyZ2V0IiwicHJvcHMiLCJkZXNjcmlwdG9yIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJrZXkiLCJNRURJQV9QUkVGRVJTX1JFRFVDRURfTU9USU9OIiwiZW1wdHkiLCJhcnJheSIsInNsaWNlIiwiYXJyYXlMaWtlIiwic3RhcnQiLCJlbmQiLCJBcnJheSIsInByb3RvdHlwZSIsImNhbGwiLCJhcHBseSIsImZ1bmMiLCJiaW5kIiwiY29uY2F0IiwiYXJndW1lbnRzIiwibmV4dFRpY2siLCJzZXRUaW1lb3V0Iiwibm9vcCIsInJhZiIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInR5cGVPZiIsInN1YmplY3QiLCJpc09iamVjdCIsImlzTnVsbCIsImlzQXJyYXkiLCJpc0Z1bmN0aW9uIiwiaXNTdHJpbmciLCJpc1VuZGVmaW5lZCIsImlzSFRNTEVsZW1lbnQiLCJvd25lckRvY3VtZW50IiwiZGVmYXVsdFZpZXciLCJIVE1MRWxlbWVudCIsInRvQXJyYXkiLCJ2YWx1ZSIsImZvckVhY2giLCJ2YWx1ZXMiLCJpdGVyYXRlZSIsImluZGV4T2YiLCJpdGVtcyIsInRvZ2dsZUNsYXNzIiwiZWxtIiwiY2xhc3NlcyIsImFkZCIsIm5hbWUiLCJjbGFzc0xpc3QiLCJhZGRDbGFzcyIsInNwbGl0IiwiYXBwZW5kIiwicGFyZW50IiwiY2hpbGRyZW4iLCJhcHBlbmRDaGlsZCIsImJlZm9yZSIsIm5vZGVzIiwicmVmIiwibm9kZSIsInBhcmVudE5vZGUiLCJpbnNlcnRCZWZvcmUiLCJtYXRjaGVzIiwic2VsZWN0b3IiLCJjaGlsZHJlbjIiLCJmaWx0ZXIiLCJjaGlsZCIsImZpcnN0RWxlbWVudENoaWxkIiwib3duS2V5cyIsImtleXMiLCJmb3JPd24iLCJvYmplY3QiLCJyaWdodCIsInJldmVyc2UiLCJzb3VyY2UiLCJtZXJnZSIsIm9taXQiLCJyZW1vdmVBdHRyaWJ1dGUiLCJlbG1zIiwiYXR0cnMiLCJhdHRyIiwic2V0QXR0cmlidXRlIiwidmFsdWUyIiwiU3RyaW5nIiwiY3JlYXRlIiwidGFnIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJwcm9wIiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImRpc3BsYXkiLCJkaXNwbGF5MiIsImZvY3VzIiwicHJldmVudFNjcm9sbCIsImdldEF0dHJpYnV0ZSIsImhhc0NsYXNzIiwiY2xhc3NOYW1lIiwiY29udGFpbnMiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicmVtb3ZlIiwicmVtb3ZlQ2hpbGQiLCJwYXJzZUh0bWwiLCJodG1sIiwiRE9NUGFyc2VyIiwicGFyc2VGcm9tU3RyaW5nIiwiYm9keSIsInByZXZlbnQiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInF1ZXJ5IiwicXVlcnlTZWxlY3RvciIsInF1ZXJ5QWxsIiwicXVlcnlTZWxlY3RvckFsbCIsInJlbW92ZUNsYXNzIiwidGltZU9mIiwidGltZVN0YW1wIiwidW5pdCIsIlBST0pFQ1RfQ09ERSIsIkRBVEFfQVRUUklCVVRFIiwiYXNzZXJ0IiwiY29uZGl0aW9uIiwibWVzc2FnZSIsIkVycm9yIiwibWluIiwiTWF0aCIsIm1heCIsImZsb29yIiwiY2VpbCIsImFicyIsImFwcHJveGltYXRlbHlFcXVhbCIsIngiLCJ5IiwiZXBzaWxvbiIsImJldHdlZW4iLCJudW1iZXIiLCJleGNsdXNpdmUiLCJtaW5pbXVtIiwibWF4aW11bSIsImNsYW1wIiwic2lnbiIsImZvcm1hdCIsInN0cmluZyIsInJlcGxhY2VtZW50cyIsInJlcGxhY2VtZW50IiwicGFkIiwiaWRzIiwiRXZlbnRCaW5kZXIiLCJsaXN0ZW5lcnMiLCJmb3JFYWNoRXZlbnQiLCJ0YXJnZXRzIiwiZXZlbnRzIiwiZXZlbnRzMiIsImV2ZW50TlMiLCJmcmFnbWVudCIsImNhbGxiYWNrIiwib3B0aW9ucyIsImV2ZW50IiwibmFtZXNwYWNlIiwiaXNFdmVudFRhcmdldCIsInJlbW92ZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInVuYmluZCIsImxpc3RlbmVyIiwiZGlzcGF0Y2giLCJkZXRhaWwiLCJidWJibGVzIiwiQ3VzdG9tRXZlbnQiLCJjcmVhdGVFdmVudCIsImluaXRDdXN0b21FdmVudCIsImRpc3BhdGNoRXZlbnQiLCJkZXN0cm95IiwiZGF0YSIsIkVWRU5UX01PVU5URUQiLCJFVkVOVF9SRUFEWSIsIkVWRU5UX01PVkUiLCJFVkVOVF9NT1ZFRCIsIkVWRU5UX0NMSUNLIiwiRVZFTlRfUkVGUkVTSCIsIkVWRU5UX1VQREFURUQiLCJFVkVOVF9SRVNJWkUiLCJFVkVOVF9SRVNJWkVEIiwiRVZFTlRfU0NST0xMIiwiRVZFTlRfU0NST0xMRUQiLCJFVkVOVF9ERVNUUk9ZIiwiRVZFTlRfTkFWSUdBVElPTl9NT1VOVEVEIiwiRVZFTlRfQVVUT1BMQVlfUExBWSIsIkVWRU5UX0FVVE9QTEFZX1BBVVNFIiwiRVZFTlRfTEFaWUxPQURfTE9BREVEIiwiRVZFTlRfRU5EX0lOREVYX0NIQU5HRUQiLCJFdmVudEludGVyZmFjZSIsIlNwbGlkZTIiLCJidXMiLCJjcmVhdGVEb2N1bWVudEZyYWdtZW50IiwiYmluZGVyIiwib24iLCJqb2luIiwib2ZmIiwiZW1pdCIsIlJlcXVlc3RJbnRlcnZhbCIsImludGVydmFsIiwib25JbnRlcnZhbCIsIm9uVXBkYXRlIiwibGltaXQiLCJzdGFydFRpbWUiLCJpZCIsIm5vdyIsIkRhdGUiLCJyYXRlIiwicGF1c2VkIiwiY291bnQiLCJ1cGRhdGUiLCJwYXVzZSIsImNhbmNlbCIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVzdW1lIiwicmV3aW5kIiwic2V0IiwidGltZSIsImlzUGF1c2VkIiwiQVJST1ciLCJBUlJPV19MRUZUIiwiQVJST1dfUklHSFQiLCJBUlJPV19VUCIsIkFSUk9XX0RPV04iLCJUVEIiLCJPUklFTlRBVElPTl9NQVAiLCJsZWZ0IiwiWCIsIlkiLCJBcnJvd0xlZnQiLCJBcnJvd1JpZ2h0IiwiUk9MRSIsIlRBQl9JTkRFWCIsIkFSSUFfUFJFRklYIiwiQVJJQV9DT05UUk9MUyIsIkFSSUFfQ1VSUkVOVCIsIkFSSUFfU0VMRUNURUQiLCJBUklBX0xBQkVMIiwiQVJJQV9MQUJFTExFREJZIiwiQVJJQV9ISURERU4iLCJBUklBX09SSUVOVEFUSU9OIiwiQVJJQV9ST0xFREVTQ1JJUFRJT04iLCJBUklBX0xJVkUiLCJBUklBX0JVU1kiLCJBUklBX0FUT01JQyIsIkFMTF9BVFRSSUJVVEVTIiwiQ0xBU1NfUFJFRklYIiwiU1RBVFVTX0NMQVNTX1BSRUZJWCIsIkNMQVNTX1JPT1QiLCJDTEFTU19UUkFDSyIsIkNMQVNTX0xJU1QiLCJDTEFTU19TTElERSIsIkNMQVNTX0NMT05FIiwiQ0xBU1NfQ09OVEFJTkVSIiwiQ0xBU1NfQVJST1dTIiwiQ0xBU1NfQVJST1ciLCJDTEFTU19BUlJPV19QUkVWIiwiQ0xBU1NfQVJST1dfTkVYVCIsIkNMQVNTX1BBR0lOQVRJT04iLCJDTEFTU19QQUdJTkFUSU9OX1BBR0UiLCJDTEFTU19QUk9HUkVTU19CQVIiLCJDTEFTU19QUk9HUkVTUyIsIkNMQVNTX1RPR0dMRSIsIkNMQVNTX1NSIiwiQ0xBU1NfSU5JVElBTElaRUQiLCJDTEFTU19BQ1RJVkUiLCJDTEFTU19QUkVWIiwiQ0xBU1NfTkVYVCIsIkNMQVNTX1ZJU0lCTEUiLCJDTEFTU19MT0FESU5HIiwiQ0xBU1NfRk9DVVNfSU4iLCJDTEFTU19PVkVSRkxPVyIsIlNUQVRVU19DTEFTU0VTIiwiQ0xBU1NFUyIsInNsaWRlIiwiY2xvbmUiLCJhcnJvd3MiLCJhcnJvdyIsInByZXYiLCJuZXh0IiwicGFnaW5hdGlvbiIsInNwaW5uZXIiLCJQT0lOVEVSX0RPV05fRVZFTlRTIiwiUE9JTlRFUl9NT1ZFX0VWRU5UUyIsIlBPSU5URVJfVVBfRVZFTlRTIiwiU0xJREUiLCJMT09QIiwiRkFERSIsIklOVEVSVkFMX0RBVEFfQVRUUklCVVRFIiwiU0NST0xMX0xJU1RFTkVSX09QVElPTlMiLCJwYXNzaXZlIiwiY2FwdHVyZSIsIk5PUk1BTElaQVRJT05fTUFQIiwiU3BhY2ViYXIiLCJSaWdodCIsIkxlZnQiLCJVcCIsIkRvd24iLCJub3JtYWxpemVLZXkiLCJLRVlCT0FSRF9FVkVOVCIsIlNSQ19EQVRBX0FUVFJJQlVURSIsIlNSQ1NFVF9EQVRBX0FUVFJJQlVURSIsIklNQUdFX1NFTEVDVE9SIiwiVFJJR0dFUl9LRVlTIiwiQ29tcG9uZW50Q29uc3RydWN0b3JzIiwiZnJlZXplIiwiX19wcm90b19fIiwiTWVkaWEiLCJDb21wb25lbnRzMiIsInN0YXRlIiwiYnJlYWtwb2ludHMiLCJyZWR1Y2VkTW90aW9uIiwicXVlcmllcyIsImNvbXBsZXRlbHkiLCJyZWdpc3RlciIsIm9wdGlvbnMyIiwicXVlcnlMaXN0IiwibWF0Y2hNZWRpYSIsImRlc3Ryb3llZCIsImlzIiwiZGlyZWN0aW9uIiwibWVyZ2VkIiwicmVkdWNlIiwibWVyZ2VkMiIsImVudHJ5IiwibW91bnQiLCJyZWZyZXNoIiwib3B0cyIsImJhc2UiLCJub3RpZnkiLCJnZXRQcm90b3R5cGVPZiIsInNldHVwIiwiaXNNaW4iLCJtZWRpYVF1ZXJ5Iiwic29ydCIsIm4iLCJtIiwiZW5hYmxlIiwiRGlyZWN0aW9uIiwiYXhpc09ubHkiLCJpbmRleCIsIm1hdGNoIiwib2Zmc2V0IiwidG9Mb3dlckNhc2UiLCJjaGFyQXQiLCJ0b1VwcGVyQ2FzZSIsIm9yaWVudCIsIkVsZW1lbnRzIiwidHJhY2siLCJsaXN0IiwiaXNVc2luZ0tleSIsIl9FdmVudEludGVyZmFjZSIsInJvb3QiLCJpMThuIiwiZWxlbWVudHMiLCJzbGlkZXMiLCJyb290Q2xhc3NlcyIsInRyYWNrQ2xhc3NlcyIsInByZWZpeCIsInJvbGUiLCJmaW5kIiwiYmFyIiwidG9nZ2xlIiwidGFnTmFtZSIsImNhcm91c2VsIiwiZ2V0Q2xhc3NlcyIsImxhYmVsIiwibGFiZWxsZWRieSIsImZyb20iLCJjbG9zZXN0Iiwibm9kZVR5cGUiLCJwYXJlbnRFbGVtZW50IiwiZHJhZyIsImlzTmF2aWdhdGlvbiIsIlNsaWRlcyIsIl9FdmVudEludGVyZmFjZTIiLCJfQ29tcG9uZW50czIkRWxlbWVudHMiLCJTbGlkZXMyIiwiaW5pdCIsImZvckVhY2gkMSIsIlNsaWRlMiIsInNsaWRlSW5kZXgiLCJDb21wb25lbnRzIiwidXBkYXRlT25Nb3ZlIiwic2xpZGVGb2N1cyIsImlzQ2xvbmUiLCJjb250YWluZXIiLCJpbml0TmF2aWdhdGlvbiIsImNvbnRyb2xzIiwic3BsaWRlcyIsIm1hcCIsInNwbGlkZSIsImdldEF0Iiwic2xpZGVYIiwib25Nb3ZlIiwiY3VyciIsImFjdGl2ZSIsImlzQWN0aXZlIiwic2VsZiIsInZpc2libGUiLCJ0cmFja1JlY3QiLCJzbGlkZVJlY3QiLCJpc1Zpc2libGUiLCJoaWRkZW4iLCJmb2N1c2FibGVOb2RlcyIsImFjdGl2ZUVsZW1lbnQiLCJ1cGRhdGVWaXNpYmlsaXR5IiwiY2xvbmVTdGF0dXMiLCJzbGlkZUxhYmVsIiwidXNlQ29udGFpbmVyIiwiaXNXaXRoaW4iLCJkaXN0YW5jZSIsImRpZmYiLCJTbGlkZSQxIiwiU2xpZGUxIiwiZ2V0IiwiZXhjbHVkZUNsb25lcyIsIm1hdGNoZXIiLCJnZXRJbiIsIkNvbnRyb2xsZXIiLCJ0b0luZGV4IiwiaGFzRm9jdXMiLCJwZXJQYWdlIiwiaW1hZ2VzIiwiaW1nIiwiZ2V0TGVuZ3RoIiwiaXNFbm91Z2giLCJMYXlvdXQiLCJ2ZXJ0aWNhbCIsInJvb3RSZWN0Iiwib3ZlcmZsb3ciLCJfRXZlbnRJbnRlcmZhY2UzIiwiX0NvbXBvbmVudHMyJEVsZW1lbnRzMiIsInN0eWxlU2xpZGVzIiwiY3NzUGFkZGluZyIsInJlc2l6ZSIsImZvcmNlIiwibmV3UmVjdCIsImNzc0hlaWdodCIsImdhcCIsImF1dG9XaWR0aCIsImZpeGVkV2lkdGgiLCJjc3NTbGlkZVNpemUiLCJmaXhlZEhlaWdodCIsImF1dG9IZWlnaHQiLCJpc092ZXJmbG93IiwicGFkZGluZyIsImhlaWdodFJhdGlvIiwibGlzdFNpemUiLCJzbGlkZVNpemUiLCJ3aXRob3V0R2FwIiwiU2xpZGUiLCJnZXRHYXAiLCJ0b3RhbFNpemUiLCJzbGlkZXJTaXplIiwicGFyc2VGbG9hdCIsImdldFBhZGRpbmciLCJDbG9uZXMiLCJjbG9uZUNvdW50IiwiY2xvbmVzIiwicmVtb3VudCIsIm9ic2VydmUiLCJjb21wdXRlQ2xvbmVDb3VudCIsImlzSGVhZCIsImNsb25lTm9kZSIsImNsb25lRGVlcCIsImdlbmVyYXRlIiwiY2xvbmVzMiIsImZpeGVkU2l6ZSIsIk1vdmUiLCJUcmFuc2l0aW9uIiwiX0V2ZW50SW50ZXJmYWNlNCIsIl9Db21wb25lbnRzMiRMYXlvdXQiLCJfQ29tcG9uZW50czIkRGlyZWN0aW8iLCJfQ29tcG9uZW50czIkRWxlbWVudHMzIiwicmVwb3NpdGlvbiIsImlzQnVzeSIsIlNjcm9sbCIsImp1bXAiLCJ0cmFuc2xhdGUiLCJ0b1Bvc2l0aW9uIiwicG9zaXRpb24iLCJwcmV2ZW50TG9vcCIsImRlc3RpbmF0aW9uIiwiZXhjZWVkZWRNYXgiLCJnZXRFbmQiLCJzaGlmdCIsImxvb3AiLCJiYWNrd2FyZHMiLCJleGNlc3MiLCJnZXRMaW1pdCIsInNpemUiLCJnZXRQb3NpdGlvbiIsIm1pbkRpc3RhbmNlIiwiSW5maW5pdHkiLCJ0cmltbWluZyIsInRyaW1TcGFjZSIsInRyaW0iLCJtb3ZlIiwiZGVzdCIsInNoaWZ0ZWQiLCJleGNlZWRlZExpbWl0IiwiZXhjZWVkZWRNaW4iLCJlbmRJbmRleCIsInNsaWRlQ291bnQiLCJwZXJNb3ZlIiwiX0V2ZW50SW50ZXJmYWNlNSIsIl9Db21wb25lbnRzMiRTbGlkZXMiLCJvbWl0RW5kIiwiaXNMb29wIiwiaXNTbGlkZSIsImdldE5leHQiLCJnZXRBZGphY2VudCIsImdldFByZXYiLCJjdXJySW5kZXgiLCJwcmV2SW5kZXgiLCJvblJlc2l6ZWQiLCJjb21wdXRlRGVzdEluZGV4Iiwic25hcFBhZ2UiLCJjb21wdXRlTW92YWJsZURlc3RJbmRleCIsInRvUGFnZSIsInNldEluZGV4Iiwid2FpdEZvclRyYW5zaXRpb24iLCJnbyIsImNvbnRyb2wiLCJhbGxvd1NhbWVJbmRleCIsIl9yZWYiLCJpbmRpY2F0b3IiLCJwYXJzZSIsInNjcm9sbCIsImR1cmF0aW9uIiwic25hcCIsImdldEluZGV4IiwidG9EZXN0IiwiQXJyb3dzIiwiY3JlYXRlZCIsIndyYXBwZXJDbGFzc2VzIiwicGxhY2Vob2xkZXIiLCJ3cmFwcGVyIiwiZW5hYmxlZCIsImNyZWF0ZUFycm93IiwicHJldjIiLCJhcnJvd1BhdGgiLCJuZXh0SW5kZXgiLCJwcmV2TGFiZWwiLCJsYXN0IiwibmV4dExhYmVsIiwiZmlyc3QiLCJkaXNhYmxlZCIsIkF1dG9wbGF5IiwiaG92ZXJlZCIsImZvY3VzZWQiLCJfRXZlbnRJbnRlcmZhY2U2IiwiX0NvbXBvbmVudHMyJEVsZW1lbnRzNCIsImF1dG9wbGF5Iiwic3RvcHBlZCIsInBsYXkiLCJyZXNldFByb2dyZXNzIiwic3RvcCIsImF1dG9Ub2dnbGUiLCJwYXVzZU9uSG92ZXIiLCJwYXVzZU9uRm9jdXMiLCJDb3ZlciIsImNvdmVyIiwiY292ZXIyIiwic3JjIiwiX0V2ZW50SW50ZXJmYWNlOCIsImZyaWN0aW9uIiwib25TY3JvbGxlZCIsIm5vQ29uc3RyYWluIiwiY2xlYXIiLCJub0Rpc3RhbmNlIiwib25FbmQiLCJ0byIsInQiLCJlYXNpbmdGdW5jIiwicG93IiwiRHJhZyIsImJhc2VQb3NpdGlvbiIsImJhc2VFdmVudCIsInByZXZCYXNlRXZlbnQiLCJpc0ZyZWUiLCJkcmFnZ2luZyIsImNsaWNrUHJldmVudGVkIiwiX0V2ZW50SW50ZXJmYWNlOSIsIl9Db21wb25lbnRzMiREaXJlY3RpbzIiLCJleGNlZWRlZCIsImRpc2FibGUiLCJvblBvaW50ZXJEb3duIiwiaXNUb3VjaCIsImlzVG91Y2hFdmVudCIsInRhcmdldDIiLCJub0RyYWciLCJidXR0b24iLCJvblBvaW50ZXJNb3ZlIiwib25Qb2ludGVyVXAiLCJzYXZlIiwiY2FuY2VsYWJsZSIsImRpZmZDb29yZCIsImV4cGlyZWQiLCJkaWZmVGltZSIsImhhc0V4Y2VlZGVkIiwiaXNTbGlkZXJEaXJlY3Rpb24iLCJ0aHJlc2hvbGRzIiwiZHJhZ01pblRocmVzaG9sZCIsImlzT2JqIiwibW91c2UiLCJ0b3VjaCIsInNob3VsZFN0YXJ0IiwidmVsb2NpdHkiLCJjb21wdXRlVmVsb2NpdHkiLCJmbGlja1Bvd2VyIiwiZmxpY2tNYXhQYWdlcyIsImNvbXB1dGVEZXN0aW5hdGlvbiIsInJld2luZEJ5RHJhZyIsIm9uQ2xpY2siLCJvcnRob2dvbmFsIiwiY29vcmRPZiIsImdldEJhc2VFdmVudCIsImNoYW5nZWRUb3VjaGVzIiwiVG91Y2hFdmVudCIsImlzRHJhZ2dpbmciLCJLZXlib2FyZCIsIl9FdmVudEludGVyZmFjZTEwIiwia2V5Ym9hcmQiLCJvbktleWRvd24iLCJfZGlzYWJsZWQiLCJMYXp5TG9hZCIsIl9FdmVudEludGVyZmFjZTExIiwiaXNTZXF1ZW50aWFsIiwibGF6eUxvYWQiLCJlbnRyaWVzIiwic3Jjc2V0IiwibG9hZE5leHQiLCJjaGVjayIsInByZWxvYWRQYWdlcyIsImxvYWQiLCJvbkxvYWQiLCJQYWdpbmF0aW9uIiwicGFnaW5hdGlvbkNsYXNzZXMiLCJkaXIiLCJnZXREaXJlY3Rpb24iLCJuZXh0UGFnZSIsIml0ZW0iLCJwYWdpbmF0aW9uRGlyZWN0aW9uIiwiX2J1dHRvbiIsInNlbGVjdCIsImxpIiwiY2xhc3MiLCJ0ZXh0IiwicGFnZVgiLCJwYWdpbmF0aW9uS2V5Ym9hcmQiLCJjcmVhdGVQYWdpbmF0aW9uIiwiU3luYyIsImlzUGFyZW50Iiwic3luYyIsIldoZWVsIiwibGFzdFRpbWUiLCJvbldoZWVsIiwiZGVsdGFZIiwiX21pbiIsIndoZWVsTWluVGhyZXNob2xkIiwic2xlZXAiLCJ3aGVlbFNsZWVwIiwicmVsZWFzZVdoZWVsIiwic2hvdWxkUHJldmVudCIsIndoZWVsIiwiTGl2ZSIsImxpdmUiLCJzciIsInRleHRDb250ZW50IiwiREVGQVVMVFMiLCJzcGVlZCIsImVhc2luZyIsInJld2luZFNwZWVkIiwiRmFkZSIsImRvbmUiLCJlbmRDYWxsYmFjayIsInRyYW5zaXRpb24iLCJnZXRTcGVlZCIsInVzZVNjcm9sbCIsIl9TcGxpZGUiLCJzdGF0ZXMiLCJfbyIsIl9FIiwiZGVmYXVsdHMiLCJKU09OIiwiQ29uc3RydWN0b3IiLCJwcm90b1Byb3BzIiwiX3Byb3RvIiwiRXh0ZW5zaW9ucyIsIl90aGlzIiwiX0MiLCJfVCIsIkNvbXBvbmVudCIsImNvbXBvbmVudCIsIl90aGlzJGV2ZW50IiwiU3BsaWRlIiwiU1RBVEVTIiwiQ1JFQVRFRCIsIk1PVU5URUQiLCJJRExFIiwiTU9WSU5HIiwiU0NST0xMSU5HIiwiRFJBR0dJTkciLCJERVNUUk9ZRUQiLCJQbGF5QmFja0VuZ2luZSIsImltYWdlc1BhdGgiLCJhdWRpb1BhdGgiLCJjdXJyZW50bHlQbGF5aW5nQXVkaW9FbGVtZW50IiwiY3VycmVudGx5QWN0aXZlR2xvd0ltYWdlcyIsImN1cnJlbnRseUFjdGl2ZVdvcmQiLCJjdXJyZW50UGFnZSIsInNwbGlkZUhhbmRsZSIsImlubmVySGVpZ2h0IiwibmV3SW5kZXgiLCJvbGRJbmRleCIsImRlc3RJbmRleCIsInRyYW5zaXRpb25pbmdUb1BhZ2UiLCJzdG9wUGFnZUF1ZGlvIiwiY3VycmVudEluZGV4IiwicGxheVBhZ2VBdWRpbyIsImFkZFBhZ2VSZXNpemVMaXN0ZW5lciIsImFkZE1pbmltemF0aW9uTGlzdGVuZXIiLCJ2aXNpYmlsaXR5U3RhdGUiLCJ2aXN1YWxFbGVtZW50IiwiYXVkaW9FbGVtZW50RG9tIiwiZ2V0RWxlbWVudEJ5SWQiLCJjdXJyZW50VGltZSIsImNsZWFySW50ZXJ2YWwiLCJjdXJyZW50UGFnZUF1dG9QbGF5ZXJJbnRlcnZhbCIsImoiLCJ3b3JkRWxlbWVudCIsImNvbG9yIiwicGFnZUluZGV4IiwibGFzdFdvcmRJbmRleCIsInNldEludGVydmFsIiwiZW5hYmxlQ29ubmVjdGVkR3JhcGhpY0hpZ2hsaWdodGluZyIsImluaXRpYWxpemVCb29rIiwiY3VycmVudEJvb2tUeXBlIiwibnVtYmVyT2ZQYWdlcyIsImluaXRpYWxpemVDdXJpb3VzUmVhZGVyQm9vayIsImluaXRpYWxpemVHRExCb29rIiwic2xpZGVMaSIsImp1c3RpZnlDb250ZW50IiwiYWxpZ25JdGVtcyIsInRvcCIsInNlbnRlbmNlSW5pdGlhbGl6ZWRCeUF1ZGlvIiwiY3JlYXRlSW1hZ2VDb250YWluZXIiLCJhdWRpb0FuZFRleHREaXZzIiwiY3JlYXRlQXVkaW9BbmRUZXh0Q29udGFpbmVycyIsImNyZWF0ZUF1ZGlvQ29udGFpbmVyIiwiY3JlYXRlVGV4dENvbnRhaW5lciIsInRleHRFbGVtZW50RGl2Iiwid2Via2l0VGV4dFN0cm9rZSIsInRleHRTaGFkb3ciLCJmb250RmFtaWx5IiwiZm9udFdlaWdodCIsImZvbnRTaXplIiwidGV4dEFsaWduIiwiaW5uZXJIVE1MIiwiZWxlbWVudEluZGV4IiwiaW1hZ2VFbGVtZW50RGl2IiwiaGFuZGxlU3RhbmRhbG9uZUdsb3dJbWFnZUNsaWNrIiwiaGFuZGxlR2xvd0ltYWdlQ2xpY2siLCJpbWFnZUVsZW1lbnRJbWciLCJhdWRpb0VsZW1lbnREaXYiLCJwYWdlQXVkaW8iLCJ3b3JkVGltZXN0YW1wRWxlbWVudCIsIndvcmRBdWRpb0VsZW1lbnQiLCJhdWRpb0FuZFRleHRBcnJheSIsInNlbnRlbmNlQXJyYXlUcmltbWVkIiwiYXVkaW9Db250ZW50RE9NSWQiLCJzZW50ZW5jZVBhcmFncmFwaCIsIm1hcmdpbiIsImNsaWNrYWJsZVdvcmRFbGVtZW50IiwibWFyZ2luTGVmdCIsIm1hcmdpblJpZ2h0IiwiaW5uZXJUZXh0IiwiZXYiLCJoYW5kbGVJbnRlcmFjdGl2ZVdvcmRDbGljayIsImNsZWFyVGltZW91dCIsImN1cnJlbnRXb3JkUGxheWluZ1RpbWVvdXQiLCJjdXJyZW50R2xvd0ltYWdlVGltZW91dCIsImJveFNoYWRvdyIsImdsb3dEaXYiLCJ3b3JkSW5kZXgiLCJ3b3JkSW5kZXhOdW1iZXIiLCJwYXJzZUludCIsImdsb3dJbWFnZU9ubHkiLCJjb25uZWN0ZWRHbG93SW1hZ2VDbGFzcyIsImNvbm5lY3RlZEdsb3dJbWFnZXMiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZmxleENvbnRhaW5lciIsImZsZXhEaXJlY3Rpb24iLCJnb1RvTmV4dFBhZ2UiLCJ0cmFuc2l0aW9uVG9QYWdlIiwiZ29Ub1ByZXZpb3VzUGFnZSIsInBhZ2VOdW1iZXIiLCJzdHJpbmdUb0J5dGVBcnJheSQxIiwic3RyIiwib3V0IiwicCIsImMiLCJjaGFyQ29kZUF0IiwiYmFzZTY0IiwiYnl0ZVRvQ2hhck1hcF8iLCJjaGFyVG9CeXRlTWFwXyIsImJ5dGVUb0NoYXJNYXBXZWJTYWZlXyIsImNoYXJUb0J5dGVNYXBXZWJTYWZlXyIsIkVOQ09ERURfVkFMU19CQVNFIiwiRU5DT0RFRF9WQUxTIiwiRU5DT0RFRF9WQUxTX1dFQlNBRkUiLCJIQVNfTkFUSVZFX1NVUFBPUlQiLCJhdG9iIiwiZW5jb2RlQnl0ZUFycmF5IiwiaW5wdXQiLCJ3ZWJTYWZlIiwiaW5pdF8iLCJieXRlVG9DaGFyTWFwIiwib3V0cHV0IiwiYnl0ZTEiLCJoYXZlQnl0ZTIiLCJieXRlMiIsImhhdmVCeXRlMyIsImJ5dGUzIiwib3V0Qnl0ZTEiLCJvdXRCeXRlMiIsIm91dEJ5dGUzIiwib3V0Qnl0ZTQiLCJlbmNvZGVTdHJpbmciLCJidG9hIiwiZGVjb2RlU3RyaW5nIiwiYnl0ZXMiLCJwb3MiLCJjMSIsImZyb21DaGFyQ29kZSIsImMyIiwidSIsImMzIiwiYnl0ZUFycmF5VG9TdHJpbmciLCJkZWNvZGVTdHJpbmdUb0J5dGVBcnJheSIsImNoYXJUb0J5dGVNYXAiLCJieXRlNCIsIkRlY29kZUJhc2U2NFN0cmluZ0Vycm9yIiwic3VwZXIiLCJiYXNlNjR1cmxFbmNvZGVXaXRob3V0UGFkZGluZyIsInV0ZjhCeXRlcyIsImJhc2U2NEVuY29kZSIsImdldERlZmF1bHRzIiwiZ2V0R2xvYmFsIiwiX19GSVJFQkFTRV9ERUZBVUxUU19fIiwicHJvY2VzcyIsImVudiIsImRlZmF1bHRzSnNvblN0cmluZyIsImdldERlZmF1bHRzRnJvbUVudlZhcmlhYmxlIiwiY29va2llIiwiZGVjb2RlZCIsImJhc2U2NERlY29kZSIsImdldERlZmF1bHRzRnJvbUNvb2tpZSIsImluZm8iLCJnZXREZWZhdWx0QXBwQ29uZmlnIiwiX2EiLCJjb25maWciLCJEZWZlcnJlZCIsInByb21pc2UiLCJ3cmFwQ2FsbGJhY2siLCJpbmRleGVkREIiLCJwcmVFeGlzdCIsIkRCX0NIRUNLX05BTUUiLCJyZXF1ZXN0Iiwib25zdWNjZXNzIiwicmVzdWx0IiwiY2xvc2UiLCJkZWxldGVEYXRhYmFzZSIsIm9udXBncmFkZW5lZWRlZCIsIm9uZXJyb3IiLCJGaXJlYmFzZUVycm9yIiwiY29kZSIsImN1c3RvbURhdGEiLCJzZXRQcm90b3R5cGVPZiIsImNhcHR1cmVTdGFja1RyYWNlIiwiRXJyb3JGYWN0b3J5Iiwic2VydmljZSIsInNlcnZpY2VOYW1lIiwiZXJyb3JzIiwiZnVsbENvZGUiLCJ0ZW1wbGF0ZSIsIlBBVFRFUk4iLCJfIiwicmVwbGFjZVRlbXBsYXRlIiwiZnVsbE1lc3NhZ2UiLCJkZWVwRXF1YWwiLCJhIiwiYiIsImFLZXlzIiwiYktleXMiLCJrIiwiYVByb3AiLCJiUHJvcCIsInRoaW5nIiwiY2FsY3VsYXRlQmFja29mZk1pbGxpcyIsImJhY2tvZmZDb3VudCIsImludGVydmFsTWlsbGlzIiwiYmFja29mZkZhY3RvciIsImN1cnJCYXNlVmFsdWUiLCJyYW5kb21XYWl0Iiwicm91bmQiLCJyYW5kb20iLCJfZGVsZWdhdGUiLCJpbnN0YW5jZUZhY3RvcnkiLCJtdWx0aXBsZUluc3RhbmNlcyIsInNlcnZpY2VQcm9wcyIsImluc3RhbnRpYXRpb25Nb2RlIiwib25JbnN0YW5jZUNyZWF0ZWQiLCJzZXRJbnN0YW50aWF0aW9uTW9kZSIsIm1vZGUiLCJzZXRNdWx0aXBsZUluc3RhbmNlcyIsInNldFNlcnZpY2VQcm9wcyIsInNldEluc3RhbmNlQ3JlYXRlZENhbGxiYWNrIiwiREVGQVVMVF9FTlRSWV9OQU1FIiwiUHJvdmlkZXIiLCJpbnN0YW5jZXMiLCJNYXAiLCJpbnN0YW5jZXNEZWZlcnJlZCIsImluc3RhbmNlc09wdGlvbnMiLCJvbkluaXRDYWxsYmFja3MiLCJpZGVudGlmaWVyIiwibm9ybWFsaXplZElkZW50aWZpZXIiLCJub3JtYWxpemVJbnN0YW5jZUlkZW50aWZpZXIiLCJoYXMiLCJkZWZlcnJlZCIsImlzSW5pdGlhbGl6ZWQiLCJzaG91bGRBdXRvSW5pdGlhbGl6ZSIsImluc3RhbmNlIiwiZ2V0T3JJbml0aWFsaXplU2VydmljZSIsImluc3RhbmNlSWRlbnRpZmllciIsImdldEltbWVkaWF0ZSIsIm9wdGlvbmFsIiwiZ2V0Q29tcG9uZW50Iiwic2V0Q29tcG9uZW50IiwiaXNDb21wb25lbnRFYWdlciIsImluc3RhbmNlRGVmZXJyZWQiLCJjbGVhckluc3RhbmNlIiwiZGVsZXRlIiwic2VydmljZXMiLCJhbGwiLCJJTlRFUk5BTCIsIl9kZWxldGUiLCJpc0NvbXBvbmVudFNldCIsImdldE9wdGlvbnMiLCJpbml0aWFsaXplIiwib25Jbml0IiwiZXhpc3RpbmdDYWxsYmFja3MiLCJTZXQiLCJleGlzdGluZ0luc3RhbmNlIiwiaW52b2tlT25Jbml0Q2FsbGJhY2tzIiwiY2FsbGJhY2tzIiwiQ29tcG9uZW50Q29udGFpbmVyIiwicHJvdmlkZXJzIiwiYWRkQ29tcG9uZW50IiwicHJvdmlkZXIiLCJnZXRQcm92aWRlciIsImFkZE9yT3ZlcndyaXRlQ29tcG9uZW50IiwiZ2V0UHJvdmlkZXJzIiwiTG9nTGV2ZWwiLCJsZXZlbFN0cmluZ1RvRW51bSIsIkRFQlVHIiwiVkVSQk9TRSIsIklORk8iLCJXQVJOIiwiRVJST1IiLCJTSUxFTlQiLCJkZWZhdWx0TG9nTGV2ZWwiLCJDb25zb2xlTWV0aG9kIiwiZGVmYXVsdExvZ0hhbmRsZXIiLCJsb2dUeXBlIiwiYXJncyIsImxvZ0xldmVsIiwidG9JU09TdHJpbmciLCJtZXRob2QiLCJMb2dnZXIiLCJfbG9nTGV2ZWwiLCJfbG9nSGFuZGxlciIsIl91c2VyTG9nSGFuZGxlciIsInZhbCIsIlR5cGVFcnJvciIsInNldExvZ0xldmVsIiwibG9nSGFuZGxlciIsInVzZXJMb2dIYW5kbGVyIiwiZGVidWciLCJ3YXJuIiwiaWRiUHJveHlhYmxlVHlwZXMiLCJjdXJzb3JBZHZhbmNlTWV0aG9kcyIsImN1cnNvclJlcXVlc3RNYXAiLCJXZWFrTWFwIiwidHJhbnNhY3Rpb25Eb25lTWFwIiwidHJhbnNhY3Rpb25TdG9yZU5hbWVzTWFwIiwidHJhbnNmb3JtQ2FjaGUiLCJyZXZlcnNlVHJhbnNmb3JtQ2FjaGUiLCJpZGJQcm94eVRyYXBzIiwicmVjZWl2ZXIiLCJJREJUcmFuc2FjdGlvbiIsIm9iamVjdFN0b3JlTmFtZXMiLCJvYmplY3RTdG9yZSIsInRyYW5zZm9ybUNhY2hhYmxlVmFsdWUiLCJJREJEYXRhYmFzZSIsInRyYW5zYWN0aW9uIiwiSURCQ3Vyc29yIiwiYWR2YW5jZSIsImNvbnRpbnVlIiwiY29udGludWVQcmltYXJ5S2V5IiwidW53cmFwIiwic3RvcmVOYW1lcyIsInR4IiwidW5saXN0ZW4iLCJjb21wbGV0ZSIsIkRPTUV4Y2VwdGlvbiIsImNhY2hlRG9uZVByb21pc2VGb3JUcmFuc2FjdGlvbiIsIklEQk9iamVjdFN0b3JlIiwiSURCSW5kZXgiLCJzb21lIiwiUHJveHkiLCJJREJSZXF1ZXN0Iiwic3VjY2VzcyIsInByb21pc2lmeVJlcXVlc3QiLCJuZXdWYWx1ZSIsIm9wZW5EQiIsInZlcnNpb24iLCJibG9ja2VkIiwidXBncmFkZSIsImJsb2NraW5nIiwidGVybWluYXRlZCIsIm9wZW5Qcm9taXNlIiwib2xkVmVyc2lvbiIsIm5ld1ZlcnNpb24iLCJkYiIsInJlYWRNZXRob2RzIiwid3JpdGVNZXRob2RzIiwiY2FjaGVkTWV0aG9kcyIsImdldE1ldGhvZCIsInRhcmdldEZ1bmNOYW1lIiwidXNlSW5kZXgiLCJpc1dyaXRlIiwiYXN5bmMiLCJzdG9yZU5hbWUiLCJzdG9yZSIsIm9sZFRyYXBzIiwiUGxhdGZvcm1Mb2dnZXJTZXJ2aWNlSW1wbCIsImdldFBsYXRmb3JtSW5mb1N0cmluZyIsImlzVmVyc2lvblNlcnZpY2VQcm92aWRlciIsImxpYnJhcnkiLCJsb2dTdHJpbmciLCJuYW1lJG8iLCJ2ZXJzaW9uJDEiLCJsb2dnZXIiLCJuYW1lJG4iLCJuYW1lJG0iLCJuYW1lJGwiLCJuYW1lJGsiLCJuYW1lJGoiLCJuYW1lJGkiLCJuYW1lJGgiLCJuYW1lJGciLCJuYW1lJGYiLCJuYW1lJGUiLCJuYW1lJGQiLCJuYW1lJGMiLCJuYW1lJGIiLCJuYW1lJGEiLCJuYW1lJDkiLCJuYW1lJDgiLCJuYW1lJDciLCJuYW1lJDYiLCJuYW1lJDUiLCJuYW1lJDQiLCJuYW1lJDMiLCJuYW1lJDIiLCJuYW1lJDEiLCJQTEFURk9STV9MT0dfU1RSSU5HIiwiX2FwcHMiLCJfY29tcG9uZW50cyIsIl9hZGRDb21wb25lbnQiLCJhcHAiLCJfcmVnaXN0ZXJDb21wb25lbnQiLCJjb21wb25lbnROYW1lIiwiaGVhcnRiZWF0Q29udHJvbGxlciIsInRyaWdnZXJIZWFydGJlYXQiLCJFUlJPUl9GQUNUT1JZIiwiRmlyZWJhc2VBcHBJbXBsIiwiX2lzRGVsZXRlZCIsIl9vcHRpb25zIiwiYXNzaWduIiwiX2NvbmZpZyIsIl9uYW1lIiwiX2F1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCIsImF1dG9tYXRpY0RhdGFDb2xsZWN0aW9uRW5hYmxlZCIsIl9jb250YWluZXIiLCJjaGVja0Rlc3Ryb3llZCIsImlzRGVsZXRlZCIsImFwcE5hbWUiLCJpbml0aWFsaXplQXBwIiwicmF3Q29uZmlnIiwiZXhpc3RpbmdBcHAiLCJuZXdBcHAiLCJyZWdpc3RlclZlcnNpb24iLCJsaWJyYXJ5S2V5T3JOYW1lIiwidmFyaWFudCIsImxpYnJhcnlNaXNtYXRjaCIsInZlcnNpb25NaXNtYXRjaCIsIndhcm5pbmciLCJTVE9SRV9OQU1FIiwiZGJQcm9taXNlIiwiZ2V0RGJQcm9taXNlIiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJvcmlnaW5hbEVycm9yTWVzc2FnZSIsIndyaXRlSGVhcnRiZWF0c1RvSW5kZXhlZERCIiwiaGVhcnRiZWF0T2JqZWN0IiwicHV0IiwiY29tcHV0ZUtleSIsImlkYkdldEVycm9yIiwiYXBwSWQiLCJIZWFydGJlYXRTZXJ2aWNlSW1wbCIsIl9oZWFydGJlYXRzQ2FjaGUiLCJfc3RvcmFnZSIsIkhlYXJ0YmVhdFN0b3JhZ2VJbXBsIiwiX2hlYXJ0YmVhdHNDYWNoZVByb21pc2UiLCJyZWFkIiwiX2IiLCJhZ2VudCIsImRhdGUiLCJnZXRVVENEYXRlU3RyaW5nIiwiaGVhcnRiZWF0cyIsImxhc3RTZW50SGVhcnRiZWF0RGF0ZSIsInNpbmdsZURhdGVIZWFydGJlYXQiLCJoYlRpbWVzdGFtcCIsInZhbHVlT2YiLCJvdmVyd3JpdGUiLCJnZXRIZWFydGJlYXRzSGVhZGVyIiwiaGVhcnRiZWF0c1RvU2VuZCIsInVuc2VudEVudHJpZXMiLCJoZWFydGJlYXRzQ2FjaGUiLCJtYXhTaXplIiwiaGVhcnRiZWF0RW50cnkiLCJoYiIsImRhdGVzIiwiY291bnRCeXRlcyIsInBvcCIsImV4dHJhY3RIZWFydGJlYXRzRm9ySGVhZGVyIiwiaGVhZGVyU3RyaW5nIiwic3RyaW5naWZ5Iiwic3Vic3RyaW5nIiwiX2NhblVzZUluZGV4ZWREQlByb21pc2UiLCJydW5JbmRleGVkREJFbnZpcm9ubWVudENoZWNrIiwiaWRiSGVhcnRiZWF0T2JqZWN0IiwicmVhZEhlYXJ0YmVhdHNGcm9tSW5kZXhlZERCIiwiaGVhcnRiZWF0c09iamVjdCIsImV4aXN0aW5nSGVhcnRiZWF0c09iamVjdCIsIlBBQ0tBR0VfVkVSU0lPTiIsIklOVEVSTkFMX0FVVEhfVkVSU0lPTiIsImlzU2VydmVyRXJyb3IiLCJnZXRJbnN0YWxsYXRpb25zRW5kcG9pbnQiLCJwcm9qZWN0SWQiLCJleHRyYWN0QXV0aFRva2VuSW5mb0Zyb21SZXNwb25zZSIsInRva2VuIiwicmVxdWVzdFN0YXR1cyIsImV4cGlyZXNJbiIsInJlc3BvbnNlRXhwaXJlc0luIiwiTnVtYmVyIiwiY3JlYXRpb25UaW1lIiwiZ2V0RXJyb3JGcm9tUmVzcG9uc2UiLCJyZXF1ZXN0TmFtZSIsImVycm9yRGF0YSIsImpzb24iLCJzZXJ2ZXJDb2RlIiwic2VydmVyTWVzc2FnZSIsInNlcnZlclN0YXR1cyIsImdldEhlYWRlcnMiLCJhcGlLZXkiLCJIZWFkZXJzIiwiQWNjZXB0IiwicmV0cnlJZlNlcnZlckVycm9yIiwiZm4iLCJtcyIsIlZBTElEX0ZJRF9QQVRURVJOIiwiZ2VuZXJhdGVGaWQiLCJmaWRCeXRlQXJyYXkiLCJVaW50OEFycmF5IiwiY3J5cHRvIiwibXNDcnlwdG8iLCJnZXRSYW5kb21WYWx1ZXMiLCJmaWQiLCJzdWJzdHIiLCJlbmNvZGUiLCJ0ZXN0IiwiZ2V0S2V5IiwiYXBwQ29uZmlnIiwiZmlkQ2hhbmdlQ2FsbGJhY2tzIiwiZmlkQ2hhbmdlZCIsImNhbGxGaWRDaGFuZ2VDYWxsYmFja3MiLCJjaGFubmVsIiwiYnJvYWRjYXN0Q2hhbm5lbCIsIkJyb2FkY2FzdENoYW5uZWwiLCJvbm1lc3NhZ2UiLCJwb3N0TWVzc2FnZSIsImJyb2FkY2FzdEZpZENoYW5nZSIsIk9CSkVDVF9TVE9SRV9OQU1FIiwib2xkVmFsdWUiLCJ1cGRhdGVGbiIsImdldEluc3RhbGxhdGlvbkVudHJ5IiwiaW5zdGFsbGF0aW9ucyIsInJlZ2lzdHJhdGlvblByb21pc2UiLCJpbnN0YWxsYXRpb25FbnRyeSIsIm9sZEVudHJ5IiwiY2xlYXJUaW1lZE91dFJlcXVlc3QiLCJyZWdpc3RyYXRpb25TdGF0dXMiLCJ1cGRhdGVPckNyZWF0ZUluc3RhbGxhdGlvbkVudHJ5IiwiZW50cnlXaXRoUHJvbWlzZSIsIm5hdmlnYXRvciIsIm9uTGluZSIsImluUHJvZ3Jlc3NFbnRyeSIsInJlZ2lzdHJhdGlvblRpbWUiLCJyZWdpc3RlcmVkSW5zdGFsbGF0aW9uRW50cnkiLCJoZWFydGJlYXRTZXJ2aWNlUHJvdmlkZXIiLCJlbmRwb2ludCIsImhlYWRlcnMiLCJoZWFydGJlYXRTZXJ2aWNlIiwiaGVhcnRiZWF0c0hlYWRlciIsImF1dGhWZXJzaW9uIiwic2RrVmVyc2lvbiIsImZldGNoIiwib2siLCJyZXNwb25zZVZhbHVlIiwicmVmcmVzaFRva2VuIiwiYXV0aFRva2VuIiwiY3JlYXRlSW5zdGFsbGF0aW9uUmVxdWVzdCIsInJlZ2lzdGVySW5zdGFsbGF0aW9uIiwid2FpdFVudGlsRmlkUmVnaXN0cmF0aW9uIiwidHJpZ2dlclJlZ2lzdHJhdGlvbklmTmVjZXNzYXJ5IiwidXBkYXRlSW5zdGFsbGF0aW9uUmVxdWVzdCIsImdlbmVyYXRlQXV0aFRva2VuUmVxdWVzdCIsImdldEdlbmVyYXRlQXV0aFRva2VuRW5kcG9pbnQiLCJnZXRBdXRob3JpemF0aW9uSGVhZGVyIiwiZ2V0SGVhZGVyc1dpdGhBdXRoIiwiaW5zdGFsbGF0aW9uIiwicmVmcmVzaEF1dGhUb2tlbiIsImZvcmNlUmVmcmVzaCIsInRva2VuUHJvbWlzZSIsImlzRW50cnlSZWdpc3RlcmVkIiwib2xkQXV0aFRva2VuIiwiaXNBdXRoVG9rZW5FeHBpcmVkIiwidXBkYXRlQXV0aFRva2VuUmVxdWVzdCIsIndhaXRVbnRpbEF1dGhUb2tlblJlcXVlc3QiLCJpblByb2dyZXNzQXV0aFRva2VuIiwicmVxdWVzdFRpbWUiLCJtYWtlQXV0aFRva2VuUmVxdWVzdEluUHJvZ3Jlc3NFbnRyeSIsInVwZGF0ZWRJbnN0YWxsYXRpb25FbnRyeSIsImZldGNoQXV0aFRva2VuRnJvbVNlcnZlciIsImdldE1pc3NpbmdWYWx1ZUVycm9yIiwidmFsdWVOYW1lIiwiSU5TVEFMTEFUSU9OU19OQU1FIiwiY29uZmlnS2V5cyIsImtleU5hbWUiLCJleHRyYWN0QXBwQ29uZmlnIiwiZ2V0SWQiLCJpbnN0YWxsYXRpb25zSW1wbCIsImdldFRva2VuIiwiY29tcGxldGVJbnN0YWxsYXRpb25SZWdpc3RyYXRpb24iLCJBTkFMWVRJQ1NfVFlQRSIsIkdUQUdfVVJMIiwiY3JlYXRlR3RhZ1RydXN0ZWRUeXBlc1NjcmlwdFVSTCIsInVybCIsInN0YXJ0c1dpdGgiLCJlcnIiLCJndGFnVVJMIiwicHJvbWlzZUFsbFNldHRsZWQiLCJwcm9taXNlcyIsImRlZmF1bHRSZXRyeURhdGEiLCJ0aHJvdHRsZU1ldGFkYXRhIiwiZ2V0VGhyb3R0bGVNZXRhZGF0YSIsInNldFRocm90dGxlTWV0YWRhdGEiLCJtZXRhZGF0YSIsImRlbGV0ZVRocm90dGxlTWV0YWRhdGEiLCJmZXRjaER5bmFtaWNDb25maWdXaXRoUmV0cnkiLCJyZXRyeURhdGEiLCJ0aW1lb3V0TWlsbGlzIiwibWVhc3VyZW1lbnRJZCIsInRocm90dGxlRW5kVGltZU1pbGxpcyIsInNpZ25hbCIsIkFuYWx5dGljc0Fib3J0U2lnbmFsIiwiYWJvcnQiLCJhdHRlbXB0RmV0Y2hEeW5hbWljQ29uZmlnV2l0aFJldHJ5IiwiYXBwRmllbGRzIiwiYmFja29mZk1pbGxpcyIsInRpbWVvdXQiLCJzZXRBYm9ydGFibGVUaW1lb3V0IiwiYXBwVXJsIiwiZXJyb3JNZXNzYWdlIiwianNvblJlc3BvbnNlIiwiX2lnbm9yZWQiLCJodHRwU3RhdHVzIiwicmVzcG9uc2VNZXNzYWdlIiwiZmV0Y2hEeW5hbWljQ29uZmlnIiwiaXNSZXRyaWFibGVFcnJvciIsImRlZmF1bHRFdmVudFBhcmFtZXRlcnNGb3JJbml0IiwiZGVmYXVsdENvbnNlbnRTZXR0aW5nc0ZvckluaXQiLCJfaW5pdGlhbGl6ZUFuYWx5dGljcyIsImR5bmFtaWNDb25maWdQcm9taXNlc0xpc3QiLCJtZWFzdXJlbWVudElkVG9BcHBJZCIsImd0YWdDb3JlIiwiZGF0YUxheWVyTmFtZSIsImR5bmFtaWNDb25maWdQcm9taXNlIiwiZmlkUHJvbWlzZSIsImVycm9ySW5mbyIsInZhbGlkYXRlSW5kZXhlZERCIiwiZW52SXNWYWxpZCIsImR5bmFtaWNDb25maWciLCJzY3JpcHRUYWdzIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJmaW5kR3RhZ1NjcmlwdE9uUGFnZSIsInRydXN0ZWRUeXBlc1BvbGljeSIsInBvbGljeU5hbWUiLCJwb2xpY3lPcHRpb25zIiwidHJ1c3RlZFR5cGVzIiwiY3JlYXRlUG9saWN5IiwiY3JlYXRlVHJ1c3RlZFR5cGVzUG9saWN5IiwiY3JlYXRlU2NyaXB0VVJMIiwic2NyaXB0IiwiZ3RhZ1NjcmlwdFVSTCIsImhlYWQiLCJpbnNlcnRTY3JpcHRUYWciLCJjb25maWdQcm9wZXJ0aWVzIiwiQW5hbHl0aWNzU2VydmljZSIsImluaXRpYWxpemF0aW9uUHJvbWlzZXNNYXAiLCJndGFnQ29yZUZ1bmN0aW9uIiwid3JhcHBlZEd0YWdGdW5jdGlvbiIsImdsb2JhbEluaXREb25lIiwiZmFjdG9yeSIsIm1pc21hdGNoZWRFbnZNZXNzYWdlcyIsInJ1bnRpbWUiLCJjaHJvbWUiLCJicm93c2VyIiwiY29va2llRW5hYmxlZCIsImRldGFpbHMiLCJ3YXJuT25Ccm93c2VyQ29udGV4dE1pc21hdGNoIiwiZGF0YUxheWVyIiwiZ2V0T3JDcmVhdGVEYXRhTGF5ZXIiLCJ3cmFwcGVkR3RhZyIsImd0YWdGdW5jdGlvbk5hbWUiLCJfYXJncyIsImNvbW1hbmQiLCJndGFnUGFyYW1zIiwiaW5pdGlhbGl6YXRpb25Qcm9taXNlc1RvV2FpdEZvciIsImdhU2VuZFRvTGlzdCIsImR5bmFtaWNDb25maWdSZXN1bHRzIiwic2VuZFRvSWQiLCJmb3VuZENvbmZpZyIsImluaXRpYWxpemF0aW9uUHJvbWlzZSIsImd0YWdPbkV2ZW50IiwiY29ycmVzcG9uZGluZ0FwcElkIiwiZ3RhZ09uQ29uZmlnIiwiZmllbGROYW1lIiwiY3VzdG9tUGFyYW1zIiwid3JhcEd0YWciLCJ3cmFwT3JDcmVhdGVHdGFnIiwibG9nRXZlbnQiLCJhbmFseXRpY3NJbnN0YW5jZSIsImV2ZW50TmFtZSIsImV2ZW50UGFyYW1zIiwiZ3RhZ0Z1bmN0aW9uIiwiZ2xvYmFsIiwibG9nRXZlbnQkMSIsImFuYWx5dGljc09wdGlvbnMiLCJhbmFseXRpY3MiLCJyZWFzb24iLCJmaXJlYmFzZUNvbmZpZyIsImF1dGhEb21haW4iLCJkYXRhYmFzZVVSTCIsInN0b3JhZ2VCdWNrZXQiLCJtZXNzYWdpbmdTZW5kZXJJZCIsIkZpcmViYXNlQW5hbHl0aWNzTWFuYWdlciIsImZpcmViYXNlQXBwIiwiZmlyZWJhc2VBbmFseXRpY3MiLCJhbmFseXRpY3NQcm92aWRlciIsImluaXRpYWxpemVBbmFseXRpY3MiLCJnZXRBbmFseXRpY3MiLCJnZXRJbnN0YW5jZSIsImxvZ0V2ZW50V2l0aFBheWxvYWQiLCJwYXlsb2FkIiwibG9nU2Vzc2lvblN0YXJ0V2l0aFBheWxvYWQiLCJsb2dEb3dubG9hZFByb2dyZXNzV2l0aFBheWxvYWQiLCJ1cmxQYXJhbXMiLCJVUkxTZWFyY2hQYXJhbXMiLCJsb2NhdGlvbiIsInNlYXJjaCIsInNlc3Npb25TdGFydFRpbWUiLCJxdWVyeVN0cmluZyIsImNvbnRlbnRQYXJzZXIiLCJwbGF5QmFja0VuZ2luZSIsImVuZm9yY2VMYW5kc2NhcGVNb2RlIiwiQW5kcm9pZCIsInNldENvbnRhaW5lckFwcE9yaWVudGF0aW9uIl0sInNvdXJjZVJvb3QiOiIifQ==
