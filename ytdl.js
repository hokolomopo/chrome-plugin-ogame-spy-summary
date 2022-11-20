!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t())
    : "function" == typeof define && define.amd
    ? define([], t)
    : "object" == typeof exports
    ? (exports["ytdl-core"] = t())
    : (e["ytdl-core"] = t());
})(global, function () {
  return (function (e) {
    var t = {};
    function a(i) {
      if (t[i]) return t[i].exports;
      var r = (t[i] = { i: i, l: !1, exports: {} });
      return e[i].call(r.exports, r, r.exports, a), (r.l = !0), r.exports;
    }
    return (
      (a.m = e),
      (a.c = t),
      (a.d = function (e, t, i) {
        a.o(e, t) || Object.defineProperty(e, t, { enumerable: !0, get: i });
      }),
      (a.r = function (e) {
        "undefined" != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(e, "__esModule", { value: !0 });
      }),
      (a.t = function (e, t) {
        if ((1 & t && (e = a(e)), 8 & t)) return e;
        if (4 & t && "object" == typeof e && e && e.__esModule) return e;
        var i = Object.create(null);
        if (
          (a.r(i),
          Object.defineProperty(i, "default", { enumerable: !0, value: e }),
          2 & t && "string" != typeof e)
        )
          for (var r in e)
            a.d(
              i,
              r,
              function (t) {
                return e[t];
              }.bind(null, r)
            );
        return i;
      }),
      (a.n = function (e) {
        var t =
          e && e.__esModule
            ? function () {
                return e.default;
              }
            : function () {
                return e;
              };
        return a.d(t, "a", t), t;
      }),
      (a.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (a.p = ""),
      a((a.s = 13))
    );
  })([
    function (e, t) {
      e.exports = require("stream");
    },
    function (e, t, a) {
      const i = a(2);
      (t.between = (e, t, a) => {
        let i;
        if (t instanceof RegExp) {
          const a = e.match(t);
          if (!a) return "";
          i = a.index + a[0].length;
        } else {
          if (((i = e.indexOf(t)), -1 === i)) return "";
          i += t.length;
        }
        return (
          (i = (e = e.slice(i)).indexOf(a)), -1 === i ? "" : (e = e.slice(0, i))
        );
      }),
        (t.parseAbbreviatedNumber = (e) => {
          const t = e
            .replace(",", ".")
            .replace(" ", "")
            .match(/([\d,.]+)([MK]?)/);
          if (t) {
            let [, e, a] = t;
            return (
              (e = parseFloat(e)),
              Math.round("M" === a ? 1e6 * e : "K" === a ? 1e3 * e : e)
            );
          }
          return null;
        }),
        (t.cutAfterJSON = (e) => {
          let t, a;
          if (
            ("[" === e[0]
              ? ((t = "["), (a = "]"))
              : "{" === e[0] && ((t = "{"), (a = "}")),
            !t)
          )
            throw new Error(
              "Can't cut unsupported JSON (need to begin with [ or { ) but got: " +
                e[0]
            );
          let i,
            r = !1,
            s = !1,
            n = 0;
          for (i = 0; i < e.length; i++)
            if ('"' !== e[i] || s) {
              if (
                ((s = "\\" === e[i] && !s),
                !r && (e[i] === t ? n++ : e[i] === a && n--, 0 === n))
              )
                return e.substr(0, i + 1);
            } else r = !r;
          throw Error(
            "Can't cut unsupported JSON (no matching closing bracket found)"
          );
        }),
        (t.playError = (e, t, a = Error) => {
          let i = e && e.playabilityStatus;
          return i && t.includes(i.status)
            ? new a(i.reason || (i.messages && i.messages[0]))
            : null;
        }),
        (t.exposedMiniget = (e, t = {}, a) => {
          const r = i(e, a || t.requestOptions);
          return (
            "function" == typeof t.requestCallback && t.requestCallback(r), r
          );
        }),
        (t.deprecate = (e, t, a, i, r) => {
          Object.defineProperty(e, t, {
            get: () => (
              console.warn(
                `\`${i}\` will be removed in a near future release, use \`${r}\` instead.`
              ),
              a
            ),
          });
        });
      const r = a(6);
      (t.lastUpdateCheck = 0),
        (t.checkForUpdates = () =>
          !process.env.YTDL_NO_UPDATE &&
          !r.version.startsWith("0.0.0-") &&
          Date.now() - t.lastUpdateCheck >= 432e5
            ? ((t.lastUpdateCheck = Date.now()),
              i(
                "https://api.github.com/repos/fent/node-ytdl-core/releases/latest",
                { headers: { "User-Agent": "ytdl-core" } }
              )
                .text()
                .then(
                  (e) => {
                    JSON.parse(e).tag_name !== "v" + r.version &&
                      console.warn(
                        '[33mWARNING:[0m ytdl-core is out of date! Update with "npm install ytdl-core@latest".'
                      );
                  },
                  (e) => {
                    console.warn("Error checking for updates:", e.message),
                      console.warn(
                        "You can disable this check by setting the `YTDL_NO_UPDATE` env variable."
                      );
                  }
                ))
            : null);
    },
    function (e, t, a) {
      "use strict";
      var i =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      const r = i(a(16)),
        s = i(a(17)),
        n = a(0),
        o = { "http:": r.default, "https:": s.default },
        l = new Set([301, 302, 303, 307, 308]),
        c = new Set([429, 503]),
        u = [
          "connect",
          "continue",
          "information",
          "socket",
          "timeout",
          "upgrade",
        ],
        d = ["aborted"];
      function p(e, t = {}) {
        var a;
        const i = Object.assign({}, p.defaultOptions, t),
          r = new n.PassThrough({ highWaterMark: i.highWaterMark });
        let s, h, m;
        r.destroyed = r.aborted = !1;
        let b,
          f,
          y,
          g = 0,
          T = 0,
          _ = 0,
          E = !1,
          v = 0,
          w = 0;
        if (null === (a = i.headers) || void 0 === a ? void 0 : a.Range) {
          let e = /bytes=(\d+)-(\d+)?/.exec("" + i.headers.Range);
          e && ((v = parseInt(e[1], 10)), (y = parseInt(e[2], 10)));
        }
        i.acceptEncoding &&
          (i.headers = Object.assign(
            { "Accept-Encoding": Object.keys(i.acceptEncoding).join(", ") },
            i.headers
          ));
        const I = (e) =>
            !!("HEAD" !== t.method && E && w !== f && _++ < i.maxReconnects) &&
            (((e) => {
              (m = null), (T = 0);
              let t = i.backoff.inc,
                a = Math.min(t, i.backoff.max);
              (b = setTimeout(A, a)), r.emit("reconnect", _, e);
            })(e),
            !0),
          R = (e) => {
            if (r.destroyed) return !1;
            if (m && w > 0) return I(e.err);
            if (
              (!e.err || "ENOTFOUND" === e.err.message) &&
              T++ < i.maxRetries
            ) {
              let t =
                e.retryAfter || Math.min(T * i.backoff.inc, i.backoff.max);
              return (b = setTimeout(A, t)), r.emit("retry", T, e.err), !0;
            }
            return !1;
          },
          D = (e, t) => {
            for (let a of t) e.on(a, r.emit.bind(r, a));
          },
          A = () => {
            let t,
              a = {};
            try {
              let i = "string" == typeof e ? new URL(e) : e;
              (a = Object.assign(
                {},
                {
                  host: i.host,
                  hostname: i.hostname,
                  path: i.pathname + i.search + i.hash,
                  port: i.port,
                  protocol: i.protocol,
                }
              )),
                i.username && (a.auth = `${i.username}:${i.password}`),
                (t = o[String(a.protocol)]);
            } catch (e) {}
            if (!t)
              return void r.emit(
                "error",
                new p.MinigetError("Invalid URL: " + e)
              );
            if ((Object.assign(a, i), E && w > 0)) {
              let e = w + v,
                t = y || "";
              a.headers = Object.assign({}, a.headers, {
                Range: `bytes=${e}-${t}`,
              });
            }
            if (i.transform) {
              try {
                a = i.transform(a);
              } catch (e) {
                return void r.emit("error", e);
              }
              if (
                (!a || a.protocol) &&
                ((t = o[String(null == a ? void 0 : a.protocol)]), !t)
              )
                return void r.emit(
                  "error",
                  new p.MinigetError(
                    "Invalid URL object from `transform` function"
                  )
                );
            }
            const n = (e) => {
                r.destroyed ||
                  r.readableEnded ||
                  r._readableState.ended ||
                  (T(),
                  R({ err: e })
                    ? s.removeListener("close", b)
                    : r.emit("error", e));
              },
              b = () => {
                T(), R({});
              },
              T = () => {
                s.removeListener("close", b),
                  null == h || h.removeListener("data", _),
                  null == m || m.removeListener("end", O);
              },
              _ = (e) => {
                w += e.length;
              },
              O = () => {
                T(), I() || r.end();
              };
            (s = t.request(a, (t) => {
              if (!r.destroyed)
                if (l.has(t.statusCode)) {
                  if (g++ >= i.maxRedirects)
                    r.emit("error", new p.MinigetError("Too many redirects"));
                  else {
                    if (!t.headers.location) {
                      let e = new p.MinigetError(
                        "Redirect status code given with no location",
                        t.statusCode
                      );
                      return r.emit("error", e), void T();
                    }
                    (e = t.headers.location),
                      setTimeout(
                        A,
                        1e3 * parseInt(t.headers["retry-after"] || "0", 10)
                      ),
                      r.emit("redirect", e);
                  }
                  T();
                } else if (c.has(t.statusCode)) {
                  if (
                    !R({
                      retryAfter: parseInt(t.headers["retry-after"] || "0", 10),
                    })
                  ) {
                    let e = new p.MinigetError(
                      "Status code: " + t.statusCode,
                      t.statusCode
                    );
                    r.emit("error", e);
                  }
                  T();
                } else {
                  if (
                    t.statusCode &&
                    (t.statusCode < 200 || t.statusCode >= 400)
                  ) {
                    let e = new p.MinigetError(
                      "Status code: " + t.statusCode,
                      t.statusCode
                    );
                    return (
                      t.statusCode >= 500 ? n(e) : r.emit("error", e), void T()
                    );
                  }
                  if (
                    ((m = t), i.acceptEncoding && t.headers["content-encoding"])
                  )
                    for (let e of t.headers["content-encoding"]
                      .split(", ")
                      .reverse()) {
                      let t = i.acceptEncoding[e];
                      t && ((m = m.pipe(t())), m.on("error", n));
                    }
                  f ||
                    ((f = parseInt("" + t.headers["content-length"], 10)),
                    (E =
                      "bytes" === t.headers["accept-ranges"] &&
                      f > 0 &&
                      i.maxReconnects > 0)),
                    t.on("data", _),
                    m.on("end", O),
                    m.pipe(r, { end: !E }),
                    (h = t),
                    r.emit("response", t),
                    t.on("error", n),
                    D(t, d);
                }
            })),
              s.on("error", n),
              s.on("close", b),
              D(s, u),
              r.destroyed && L(...N),
              r.emit("request", s),
              s.end();
          };
        let N;
        r.abort = (e) => {
          console.warn(
            "`MinigetStream#abort()` has been deprecated in favor of `MinigetStream#destroy()`"
          ),
            (r.aborted = !0),
            r.emit("abort"),
            r.destroy(e);
        };
        const L = (e) => {
          s.destroy(e),
            null == m || m.unpipe(r),
            null == m || m.destroy(),
            clearTimeout(b);
        };
        return (
          (r._destroy = (...e) => {
            (r.destroyed = !0), s ? L(...e) : (N = e);
          }),
          (r.text = () =>
            new Promise((e, t) => {
              let a = "";
              r.setEncoding("utf8"),
                r.on("data", (e) => (a += e)),
                r.on("end", () => e(a)),
                r.on("error", t);
            })),
          process.nextTick(A),
          r
        );
      }
      (p.MinigetError = class extends Error {
        constructor(e, t) {
          super(e), (this.statusCode = t);
        }
      }),
        (p.defaultOptions = {
          maxRedirects: 10,
          maxRetries: 2,
          maxReconnects: 0,
          backoff: { inc: 100, max: 1e4 },
        }),
        (e.exports = p);
    },
    function (e, t) {
      e.exports = require("querystring");
    },
    function (e, t, a) {
      "use strict";
      var i =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      const r = a(0),
        s = i(a(2)),
        n = i(a(20)),
        o = i(a(21)),
        l = a(22),
        c = a(10),
        u = { m3u8: n.default, "dash-mpd": o.default };
      let d = (e, t = {}) => {
        const a = new r.PassThrough(),
          i = t.chunkReadahead || 3,
          n = t.liveBuffer || 2e4,
          o = t.requestOptions,
          d = u[t.parser || (/\.mpd$/.test(e) ? "dash-mpd" : "m3u8")];
        if (!d) throw TypeError(`parser '${t.parser}' not supported`);
        let p = 0;
        void 0 !== t.begin &&
          (p =
            "string" == typeof t.begin
              ? c.humanStr(t.begin)
              : Math.max(t.begin - n, 0));
        const h = (e) => {
          for (let t of [
            "abort",
            "request",
            "response",
            "redirect",
            "retry",
            "reconnect",
          ])
            e.on(t, a.emit.bind(a, t));
        };
        let m;
        const b = new l.Queue(
          (e, t) => {
            m = e;
            let i = 0;
            e.on("data", (e) => (i += e.length)),
              e.pipe(a, { end: !1 }),
              e.on("end", () => t(null, i));
          },
          { concurrency: 1 }
        );
        let f = 0,
          y = 0;
        const g = new l.Queue(
            (t, i) => {
              let r = Object.assign({}, o);
              t.range &&
                (r.headers = Object.assign({}, r.headers, {
                  Range: `bytes=${t.range.start}-${t.range.end}`,
                }));
              let n = s.default(new URL(t.url, e).toString(), r);
              n.on("error", i),
                h(n),
                b.push(n, (e, r) => {
                  (y += +r),
                    a.emit(
                      "progress",
                      { num: ++f, size: r, duration: t.duration, url: t.url },
                      g.total,
                      y
                    ),
                    i(null);
                });
            },
            { concurrency: i }
          ),
          T = (e) => {
            R || (a.emit("error", e), a.end());
          };
        let _,
          E,
          v,
          w,
          I = !0,
          R = !1,
          D = !1;
        const A = (e) => {
          if (((m = null), e)) T(e);
          else if (!I && !R && !D && g.tasks.length + g.active <= _) {
            let e = Math.max(0, E - (Date.now() - w));
            (I = !0), (v = setTimeout(S, e));
          } else (!R && !D) || g.tasks.length || g.active || a.end();
        };
        let N,
          L,
          O = 0;
        const S = () => {
          (w = Date.now()), (N = s.default(e, o)), N.on("error", T), h(N);
          const a = N.pipe(new d(t.id));
          a.on("starttime", (e) => {
            O || ((O = e), "string" == typeof t.begin && p >= 0 && (p += O));
          }),
            a.on("endlist", () => {
              D = !0;
            }),
            a.on("endearly", N.unpipe.bind(N, a));
          let i = [];
          const r = (e) => {
            if (!e.init) {
              if (e.seq <= L) return;
              L = e.seq;
            }
            (p = e.time), g.push(e, A), i.push(e);
          };
          let l = [],
            c = 0;
          a.on("item", (e) => {
            let t = Object.assign({ time: O }, e);
            if (p <= t.time) r(t);
            else
              for (
                l.push(t), c += t.duration;
                l.length > 1 && c - l[0].duration > n;

              ) {
                const e = l.shift();
                c -= e.duration;
              }
            O += t.duration;
          }),
            a.on("end", () => {
              (N = null),
                !i.length &&
                  l.length &&
                  l.forEach((e) => {
                    r(e);
                  }),
                (_ = Math.max(1, Math.ceil(0.01 * i.length))),
                (E = i.reduce((e, t) => t.duration + e, 0)),
                (I = !1),
                A(null);
            });
        };
        return (
          S(),
          (a.end = () => {
            (R = !0),
              b.die(),
              g.die(),
              clearTimeout(v),
              null == N || N.destroy(),
              null == m || m.destroy(),
              r.PassThrough.prototype.end.call(a, null);
          }),
          a
        );
      };
      (d.parseTimestamp = c.humanStr), (e.exports = d);
    },
    function (e, t, a) {
      !(function (e) {
        (e.parser = function (e, t) {
          return new r(e, t);
        }),
          (e.SAXParser = r),
          (e.SAXStream = n),
          (e.createStream = function (e, t) {
            return new n(e, t);
          }),
          (e.MAX_BUFFER_LENGTH = 65536);
        var t,
          i = [
            "comment",
            "sgmlDecl",
            "textNode",
            "tagName",
            "doctype",
            "procInstName",
            "procInstBody",
            "entity",
            "attribName",
            "attribValue",
            "cdata",
            "script",
          ];
        function r(t, a) {
          if (!(this instanceof r)) return new r(t, a);
          !(function (e) {
            for (var t = 0, a = i.length; t < a; t++) e[i[t]] = "";
          })(this),
            (this.q = this.c = ""),
            (this.bufferCheckPosition = e.MAX_BUFFER_LENGTH),
            (this.opt = a || {}),
            (this.opt.lowercase = this.opt.lowercase || this.opt.lowercasetags),
            (this.looseCase = this.opt.lowercase
              ? "toLowerCase"
              : "toUpperCase"),
            (this.tags = []),
            (this.closed = this.closedRoot = this.sawRoot = !1),
            (this.tag = this.error = null),
            (this.strict = !!t),
            (this.noscript = !(!t && !this.opt.noscript)),
            (this.state = E.BEGIN),
            (this.strictEntities = this.opt.strictEntities),
            (this.ENTITIES = this.strictEntities
              ? Object.create(e.XML_ENTITIES)
              : Object.create(e.ENTITIES)),
            (this.attribList = []),
            this.opt.xmlns && (this.ns = Object.create(l)),
            (this.trackPosition = !1 !== this.opt.position),
            this.trackPosition && (this.position = this.line = this.column = 0),
            w(this, "onready");
        }
        (e.EVENTS = [
          "text",
          "processinginstruction",
          "sgmldeclaration",
          "doctype",
          "comment",
          "opentagstart",
          "attribute",
          "opentag",
          "closetag",
          "opencdata",
          "cdata",
          "closecdata",
          "error",
          "end",
          "ready",
          "script",
          "opennamespace",
          "closenamespace",
        ]),
          Object.create ||
            (Object.create = function (e) {
              function t() {}
              return (t.prototype = e), new t();
            }),
          Object.keys ||
            (Object.keys = function (e) {
              var t = [];
              for (var a in e) e.hasOwnProperty(a) && t.push(a);
              return t;
            }),
          (r.prototype = {
            end: function () {
              N(this);
            },
            write: function (t) {
              if (this.error) throw this.error;
              if (this.closed)
                return A(
                  this,
                  "Cannot write after close. Assign an onready handler."
                );
              if (null === t) return N(this);
              "object" == typeof t && (t = t.toString());
              var a = 0,
                r = "";
              for (; (r = q(t, a++)), (this.c = r), r; )
                switch (
                  (this.trackPosition &&
                    (this.position++,
                    "\n" === r
                      ? (this.line++, (this.column = 0))
                      : this.column++),
                  this.state)
                ) {
                  case E.BEGIN:
                    if (((this.state = E.BEGIN_WHITESPACE), "\ufeff" === r))
                      continue;
                    M(this, r);
                    continue;
                  case E.BEGIN_WHITESPACE:
                    M(this, r);
                    continue;
                  case E.TEXT:
                    if (this.sawRoot && !this.closedRoot) {
                      for (var s = a - 1; r && "<" !== r && "&" !== r; )
                        (r = q(t, a++)) &&
                          this.trackPosition &&
                          (this.position++,
                          "\n" === r
                            ? (this.line++, (this.column = 0))
                            : this.column++);
                      this.textNode += t.substring(s, a - 1);
                    }
                    "<" !== r ||
                    (this.sawRoot && this.closedRoot && !this.strict)
                      ? (h(r) ||
                          (this.sawRoot && !this.closedRoot) ||
                          L(this, "Text data outside of root node."),
                        "&" === r
                          ? (this.state = E.TEXT_ENTITY)
                          : (this.textNode += r))
                      : ((this.state = E.OPEN_WAKA),
                        (this.startTagPosition = this.position));
                    continue;
                  case E.SCRIPT:
                    "<" === r
                      ? (this.state = E.SCRIPT_ENDING)
                      : (this.script += r);
                    continue;
                  case E.SCRIPT_ENDING:
                    "/" === r
                      ? (this.state = E.CLOSE_TAG)
                      : ((this.script += "<" + r), (this.state = E.SCRIPT));
                    continue;
                  case E.OPEN_WAKA:
                    if ("!" === r)
                      (this.state = E.SGML_DECL), (this.sgmlDecl = "");
                    else if (h(r));
                    else if (f(c, r))
                      (this.state = E.OPEN_TAG), (this.tagName = r);
                    else if ("/" === r)
                      (this.state = E.CLOSE_TAG), (this.tagName = "");
                    else if ("?" === r)
                      (this.state = E.PROC_INST),
                        (this.procInstName = this.procInstBody = "");
                    else {
                      if (
                        (L(this, "Unencoded <"),
                        this.startTagPosition + 1 < this.position)
                      ) {
                        var n = this.position - this.startTagPosition;
                        r = new Array(n).join(" ") + r;
                      }
                      (this.textNode += "<" + r), (this.state = E.TEXT);
                    }
                    continue;
                  case E.SGML_DECL:
                    "[CDATA[" === (this.sgmlDecl + r).toUpperCase()
                      ? (I(this, "onopencdata"),
                        (this.state = E.CDATA),
                        (this.sgmlDecl = ""),
                        (this.cdata = ""))
                      : this.sgmlDecl + r === "--"
                      ? ((this.state = E.COMMENT),
                        (this.comment = ""),
                        (this.sgmlDecl = ""))
                      : "DOCTYPE" === (this.sgmlDecl + r).toUpperCase()
                      ? ((this.state = E.DOCTYPE),
                        (this.doctype || this.sawRoot) &&
                          L(
                            this,
                            "Inappropriately located doctype declaration"
                          ),
                        (this.doctype = ""),
                        (this.sgmlDecl = ""))
                      : ">" === r
                      ? (I(this, "onsgmldeclaration", this.sgmlDecl),
                        (this.sgmlDecl = ""),
                        (this.state = E.TEXT))
                      : m(r)
                      ? ((this.state = E.SGML_DECL_QUOTED),
                        (this.sgmlDecl += r))
                      : (this.sgmlDecl += r);
                    continue;
                  case E.SGML_DECL_QUOTED:
                    r === this.q && ((this.state = E.SGML_DECL), (this.q = "")),
                      (this.sgmlDecl += r);
                    continue;
                  case E.DOCTYPE:
                    ">" === r
                      ? ((this.state = E.TEXT),
                        I(this, "ondoctype", this.doctype),
                        (this.doctype = !0))
                      : ((this.doctype += r),
                        "[" === r
                          ? (this.state = E.DOCTYPE_DTD)
                          : m(r) &&
                            ((this.state = E.DOCTYPE_QUOTED), (this.q = r)));
                    continue;
                  case E.DOCTYPE_QUOTED:
                    (this.doctype += r),
                      r === this.q && ((this.q = ""), (this.state = E.DOCTYPE));
                    continue;
                  case E.DOCTYPE_DTD:
                    (this.doctype += r),
                      "]" === r
                        ? (this.state = E.DOCTYPE)
                        : m(r) &&
                          ((this.state = E.DOCTYPE_DTD_QUOTED), (this.q = r));
                    continue;
                  case E.DOCTYPE_DTD_QUOTED:
                    (this.doctype += r),
                      r === this.q &&
                        ((this.state = E.DOCTYPE_DTD), (this.q = ""));
                    continue;
                  case E.COMMENT:
                    "-" === r
                      ? (this.state = E.COMMENT_ENDING)
                      : (this.comment += r);
                    continue;
                  case E.COMMENT_ENDING:
                    "-" === r
                      ? ((this.state = E.COMMENT_ENDED),
                        (this.comment = D(this.opt, this.comment)),
                        this.comment && I(this, "oncomment", this.comment),
                        (this.comment = ""))
                      : ((this.comment += "-" + r), (this.state = E.COMMENT));
                    continue;
                  case E.COMMENT_ENDED:
                    ">" !== r
                      ? (L(this, "Malformed comment"),
                        (this.comment += "--" + r),
                        (this.state = E.COMMENT))
                      : (this.state = E.TEXT);
                    continue;
                  case E.CDATA:
                    "]" === r
                      ? (this.state = E.CDATA_ENDING)
                      : (this.cdata += r);
                    continue;
                  case E.CDATA_ENDING:
                    "]" === r
                      ? (this.state = E.CDATA_ENDING_2)
                      : ((this.cdata += "]" + r), (this.state = E.CDATA));
                    continue;
                  case E.CDATA_ENDING_2:
                    ">" === r
                      ? (this.cdata && I(this, "oncdata", this.cdata),
                        I(this, "onclosecdata"),
                        (this.cdata = ""),
                        (this.state = E.TEXT))
                      : "]" === r
                      ? (this.cdata += "]")
                      : ((this.cdata += "]]" + r), (this.state = E.CDATA));
                    continue;
                  case E.PROC_INST:
                    "?" === r
                      ? (this.state = E.PROC_INST_ENDING)
                      : h(r)
                      ? (this.state = E.PROC_INST_BODY)
                      : (this.procInstName += r);
                    continue;
                  case E.PROC_INST_BODY:
                    if (!this.procInstBody && h(r)) continue;
                    "?" === r
                      ? (this.state = E.PROC_INST_ENDING)
                      : (this.procInstBody += r);
                    continue;
                  case E.PROC_INST_ENDING:
                    ">" === r
                      ? (I(this, "onprocessinginstruction", {
                          name: this.procInstName,
                          body: this.procInstBody,
                        }),
                        (this.procInstName = this.procInstBody = ""),
                        (this.state = E.TEXT))
                      : ((this.procInstBody += "?" + r),
                        (this.state = E.PROC_INST_BODY));
                    continue;
                  case E.OPEN_TAG:
                    f(u, r)
                      ? (this.tagName += r)
                      : (O(this),
                        ">" === r
                          ? C(this)
                          : "/" === r
                          ? (this.state = E.OPEN_TAG_SLASH)
                          : (h(r) || L(this, "Invalid character in tag name"),
                            (this.state = E.ATTRIB)));
                    continue;
                  case E.OPEN_TAG_SLASH:
                    ">" === r
                      ? (C(this, !0), B(this))
                      : (L(
                          this,
                          "Forward-slash in opening tag not followed by >"
                        ),
                        (this.state = E.ATTRIB));
                    continue;
                  case E.ATTRIB:
                    if (h(r)) continue;
                    ">" === r
                      ? C(this)
                      : "/" === r
                      ? (this.state = E.OPEN_TAG_SLASH)
                      : f(c, r)
                      ? ((this.attribName = r),
                        (this.attribValue = ""),
                        (this.state = E.ATTRIB_NAME))
                      : L(this, "Invalid attribute name");
                    continue;
                  case E.ATTRIB_NAME:
                    "=" === r
                      ? (this.state = E.ATTRIB_VALUE)
                      : ">" === r
                      ? (L(this, "Attribute without value"),
                        (this.attribValue = this.attribName),
                        x(this),
                        C(this))
                      : h(r)
                      ? (this.state = E.ATTRIB_NAME_SAW_WHITE)
                      : f(u, r)
                      ? (this.attribName += r)
                      : L(this, "Invalid attribute name");
                    continue;
                  case E.ATTRIB_NAME_SAW_WHITE:
                    if ("=" === r) this.state = E.ATTRIB_VALUE;
                    else {
                      if (h(r)) continue;
                      L(this, "Attribute without value"),
                        (this.tag.attributes[this.attribName] = ""),
                        (this.attribValue = ""),
                        I(this, "onattribute", {
                          name: this.attribName,
                          value: "",
                        }),
                        (this.attribName = ""),
                        ">" === r
                          ? C(this)
                          : f(c, r)
                          ? ((this.attribName = r),
                            (this.state = E.ATTRIB_NAME))
                          : (L(this, "Invalid attribute name"),
                            (this.state = E.ATTRIB));
                    }
                    continue;
                  case E.ATTRIB_VALUE:
                    if (h(r)) continue;
                    m(r)
                      ? ((this.q = r), (this.state = E.ATTRIB_VALUE_QUOTED))
                      : (L(this, "Unquoted attribute value"),
                        (this.state = E.ATTRIB_VALUE_UNQUOTED),
                        (this.attribValue = r));
                    continue;
                  case E.ATTRIB_VALUE_QUOTED:
                    if (r !== this.q) {
                      "&" === r
                        ? (this.state = E.ATTRIB_VALUE_ENTITY_Q)
                        : (this.attribValue += r);
                      continue;
                    }
                    x(this),
                      (this.q = ""),
                      (this.state = E.ATTRIB_VALUE_CLOSED);
                    continue;
                  case E.ATTRIB_VALUE_CLOSED:
                    h(r)
                      ? (this.state = E.ATTRIB)
                      : ">" === r
                      ? C(this)
                      : "/" === r
                      ? (this.state = E.OPEN_TAG_SLASH)
                      : f(c, r)
                      ? (L(this, "No whitespace between attributes"),
                        (this.attribName = r),
                        (this.attribValue = ""),
                        (this.state = E.ATTRIB_NAME))
                      : L(this, "Invalid attribute name");
                    continue;
                  case E.ATTRIB_VALUE_UNQUOTED:
                    if (!b(r)) {
                      "&" === r
                        ? (this.state = E.ATTRIB_VALUE_ENTITY_U)
                        : (this.attribValue += r);
                      continue;
                    }
                    x(this), ">" === r ? C(this) : (this.state = E.ATTRIB);
                    continue;
                  case E.CLOSE_TAG:
                    if (this.tagName)
                      ">" === r
                        ? B(this)
                        : f(u, r)
                        ? (this.tagName += r)
                        : this.script
                        ? ((this.script += "</" + this.tagName),
                          (this.tagName = ""),
                          (this.state = E.SCRIPT))
                        : (h(r) || L(this, "Invalid tagname in closing tag"),
                          (this.state = E.CLOSE_TAG_SAW_WHITE));
                    else {
                      if (h(r)) continue;
                      y(c, r)
                        ? this.script
                          ? ((this.script += "</" + r), (this.state = E.SCRIPT))
                          : L(this, "Invalid tagname in closing tag.")
                        : (this.tagName = r);
                    }
                    continue;
                  case E.CLOSE_TAG_SAW_WHITE:
                    if (h(r)) continue;
                    ">" === r
                      ? B(this)
                      : L(this, "Invalid characters in closing tag");
                    continue;
                  case E.TEXT_ENTITY:
                  case E.ATTRIB_VALUE_ENTITY_Q:
                  case E.ATTRIB_VALUE_ENTITY_U:
                    var o, l;
                    switch (this.state) {
                      case E.TEXT_ENTITY:
                        (o = E.TEXT), (l = "textNode");
                        break;
                      case E.ATTRIB_VALUE_ENTITY_Q:
                        (o = E.ATTRIB_VALUE_QUOTED), (l = "attribValue");
                        break;
                      case E.ATTRIB_VALUE_ENTITY_U:
                        (o = E.ATTRIB_VALUE_UNQUOTED), (l = "attribValue");
                    }
                    ";" === r
                      ? ((this[l] += P(this)),
                        (this.entity = ""),
                        (this.state = o))
                      : f(this.entity.length ? p : d, r)
                      ? (this.entity += r)
                      : (L(this, "Invalid character in entity name"),
                        (this[l] += "&" + this.entity + r),
                        (this.entity = ""),
                        (this.state = o));
                    continue;
                  default:
                    throw new Error(this, "Unknown state: " + this.state);
                }
              this.position >= this.bufferCheckPosition &&
                (function (t) {
                  for (
                    var a = Math.max(e.MAX_BUFFER_LENGTH, 10),
                      r = 0,
                      s = 0,
                      n = i.length;
                    s < n;
                    s++
                  ) {
                    var o = t[i[s]].length;
                    if (o > a)
                      switch (i[s]) {
                        case "textNode":
                          R(t);
                          break;
                        case "cdata":
                          I(t, "oncdata", t.cdata), (t.cdata = "");
                          break;
                        case "script":
                          I(t, "onscript", t.script), (t.script = "");
                          break;
                        default:
                          A(t, "Max buffer length exceeded: " + i[s]);
                      }
                    r = Math.max(r, o);
                  }
                  var l = e.MAX_BUFFER_LENGTH - r;
                  t.bufferCheckPosition = l + t.position;
                })(this);
              return this;
            },
            /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */ resume:
              function () {
                return (this.error = null), this;
              },
            close: function () {
              return this.write(null);
            },
            flush: function () {
              var e;
              R((e = this)),
                "" !== e.cdata && (I(e, "oncdata", e.cdata), (e.cdata = "")),
                "" !== e.script &&
                  (I(e, "onscript", e.script), (e.script = ""));
            },
          });
        try {
          t = a(0).Stream;
        } catch (e) {
          t = function () {};
        }
        var s = e.EVENTS.filter(function (e) {
          return "error" !== e && "end" !== e;
        });
        function n(e, a) {
          if (!(this instanceof n)) return new n(e, a);
          t.apply(this),
            (this._parser = new r(e, a)),
            (this.writable = !0),
            (this.readable = !0);
          var i = this;
          (this._parser.onend = function () {
            i.emit("end");
          }),
            (this._parser.onerror = function (e) {
              i.emit("error", e), (i._parser.error = null);
            }),
            (this._decoder = null),
            s.forEach(function (e) {
              Object.defineProperty(i, "on" + e, {
                get: function () {
                  return i._parser["on" + e];
                },
                set: function (t) {
                  if (!t)
                    return (
                      i.removeAllListeners(e), (i._parser["on" + e] = t), t
                    );
                  i.on(e, t);
                },
                enumerable: !0,
                configurable: !1,
              });
            });
        }
        (n.prototype = Object.create(t.prototype, {
          constructor: { value: n },
        })),
          (n.prototype.write = function (e) {
            if (
              "function" == typeof Buffer &&
              "function" == typeof Buffer.isBuffer &&
              Buffer.isBuffer(e)
            ) {
              if (!this._decoder) {
                var t = a(15).StringDecoder;
                this._decoder = new t("utf8");
              }
              e = this._decoder.write(e);
            }
            return this._parser.write(e.toString()), this.emit("data", e), !0;
          }),
          (n.prototype.end = function (e) {
            return e && e.length && this.write(e), this._parser.end(), !0;
          }),
          (n.prototype.on = function (e, a) {
            var i = this;
            return (
              i._parser["on" + e] ||
                -1 === s.indexOf(e) ||
                (i._parser["on" + e] = function () {
                  var t =
                    1 === arguments.length
                      ? [arguments[0]]
                      : Array.apply(null, arguments);
                  t.splice(0, 0, e), i.emit.apply(i, t);
                }),
              t.prototype.on.call(i, e, a)
            );
          });
        var o = "http://www.w3.org/XML/1998/namespace",
          l = { xml: o, xmlns: "http://www.w3.org/2000/xmlns/" },
          c =
            /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
          u =
            /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/,
          d =
            /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/,
          p =
            /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
        function h(e) {
          return " " === e || "\n" === e || "\r" === e || "\t" === e;
        }
        function m(e) {
          return '"' === e || "'" === e;
        }
        function b(e) {
          return ">" === e || h(e);
        }
        function f(e, t) {
          return e.test(t);
        }
        function y(e, t) {
          return !f(e, t);
        }
        var g,
          T,
          _,
          E = 0;
        for (var v in ((e.STATE = {
          BEGIN: E++,
          BEGIN_WHITESPACE: E++,
          TEXT: E++,
          TEXT_ENTITY: E++,
          OPEN_WAKA: E++,
          SGML_DECL: E++,
          SGML_DECL_QUOTED: E++,
          DOCTYPE: E++,
          DOCTYPE_QUOTED: E++,
          DOCTYPE_DTD: E++,
          DOCTYPE_DTD_QUOTED: E++,
          COMMENT_STARTING: E++,
          COMMENT: E++,
          COMMENT_ENDING: E++,
          COMMENT_ENDED: E++,
          CDATA: E++,
          CDATA_ENDING: E++,
          CDATA_ENDING_2: E++,
          PROC_INST: E++,
          PROC_INST_BODY: E++,
          PROC_INST_ENDING: E++,
          OPEN_TAG: E++,
          OPEN_TAG_SLASH: E++,
          ATTRIB: E++,
          ATTRIB_NAME: E++,
          ATTRIB_NAME_SAW_WHITE: E++,
          ATTRIB_VALUE: E++,
          ATTRIB_VALUE_QUOTED: E++,
          ATTRIB_VALUE_CLOSED: E++,
          ATTRIB_VALUE_UNQUOTED: E++,
          ATTRIB_VALUE_ENTITY_Q: E++,
          ATTRIB_VALUE_ENTITY_U: E++,
          CLOSE_TAG: E++,
          CLOSE_TAG_SAW_WHITE: E++,
          SCRIPT: E++,
          SCRIPT_ENDING: E++,
        }),
        (e.XML_ENTITIES = { amp: "&", gt: ">", lt: "<", quot: '"', apos: "'" }),
        (e.ENTITIES = {
          amp: "&",
          gt: ">",
          lt: "<",
          quot: '"',
          apos: "'",
          AElig: 198,
          Aacute: 193,
          Acirc: 194,
          Agrave: 192,
          Aring: 197,
          Atilde: 195,
          Auml: 196,
          Ccedil: 199,
          ETH: 208,
          Eacute: 201,
          Ecirc: 202,
          Egrave: 200,
          Euml: 203,
          Iacute: 205,
          Icirc: 206,
          Igrave: 204,
          Iuml: 207,
          Ntilde: 209,
          Oacute: 211,
          Ocirc: 212,
          Ograve: 210,
          Oslash: 216,
          Otilde: 213,
          Ouml: 214,
          THORN: 222,
          Uacute: 218,
          Ucirc: 219,
          Ugrave: 217,
          Uuml: 220,
          Yacute: 221,
          aacute: 225,
          acirc: 226,
          aelig: 230,
          agrave: 224,
          aring: 229,
          atilde: 227,
          auml: 228,
          ccedil: 231,
          eacute: 233,
          ecirc: 234,
          egrave: 232,
          eth: 240,
          euml: 235,
          iacute: 237,
          icirc: 238,
          igrave: 236,
          iuml: 239,
          ntilde: 241,
          oacute: 243,
          ocirc: 244,
          ograve: 242,
          oslash: 248,
          otilde: 245,
          ouml: 246,
          szlig: 223,
          thorn: 254,
          uacute: 250,
          ucirc: 251,
          ugrave: 249,
          uuml: 252,
          yacute: 253,
          yuml: 255,
          copy: 169,
          reg: 174,
          nbsp: 160,
          iexcl: 161,
          cent: 162,
          pound: 163,
          curren: 164,
          yen: 165,
          brvbar: 166,
          sect: 167,
          uml: 168,
          ordf: 170,
          laquo: 171,
          not: 172,
          shy: 173,
          macr: 175,
          deg: 176,
          plusmn: 177,
          sup1: 185,
          sup2: 178,
          sup3: 179,
          acute: 180,
          micro: 181,
          para: 182,
          middot: 183,
          cedil: 184,
          ordm: 186,
          raquo: 187,
          frac14: 188,
          frac12: 189,
          frac34: 190,
          iquest: 191,
          times: 215,
          divide: 247,
          OElig: 338,
          oelig: 339,
          Scaron: 352,
          scaron: 353,
          Yuml: 376,
          fnof: 402,
          circ: 710,
          tilde: 732,
          Alpha: 913,
          Beta: 914,
          Gamma: 915,
          Delta: 916,
          Epsilon: 917,
          Zeta: 918,
          Eta: 919,
          Theta: 920,
          Iota: 921,
          Kappa: 922,
          Lambda: 923,
          Mu: 924,
          Nu: 925,
          Xi: 926,
          Omicron: 927,
          Pi: 928,
          Rho: 929,
          Sigma: 931,
          Tau: 932,
          Upsilon: 933,
          Phi: 934,
          Chi: 935,
          Psi: 936,
          Omega: 937,
          alpha: 945,
          beta: 946,
          gamma: 947,
          delta: 948,
          epsilon: 949,
          zeta: 950,
          eta: 951,
          theta: 952,
          iota: 953,
          kappa: 954,
          lambda: 955,
          mu: 956,
          nu: 957,
          xi: 958,
          omicron: 959,
          pi: 960,
          rho: 961,
          sigmaf: 962,
          sigma: 963,
          tau: 964,
          upsilon: 965,
          phi: 966,
          chi: 967,
          psi: 968,
          omega: 969,
          thetasym: 977,
          upsih: 978,
          piv: 982,
          ensp: 8194,
          emsp: 8195,
          thinsp: 8201,
          zwnj: 8204,
          zwj: 8205,
          lrm: 8206,
          rlm: 8207,
          ndash: 8211,
          mdash: 8212,
          lsquo: 8216,
          rsquo: 8217,
          sbquo: 8218,
          ldquo: 8220,
          rdquo: 8221,
          bdquo: 8222,
          dagger: 8224,
          Dagger: 8225,
          bull: 8226,
          hellip: 8230,
          permil: 8240,
          prime: 8242,
          Prime: 8243,
          lsaquo: 8249,
          rsaquo: 8250,
          oline: 8254,
          frasl: 8260,
          euro: 8364,
          image: 8465,
          weierp: 8472,
          real: 8476,
          trade: 8482,
          alefsym: 8501,
          larr: 8592,
          uarr: 8593,
          rarr: 8594,
          darr: 8595,
          harr: 8596,
          crarr: 8629,
          lArr: 8656,
          uArr: 8657,
          rArr: 8658,
          dArr: 8659,
          hArr: 8660,
          forall: 8704,
          part: 8706,
          exist: 8707,
          empty: 8709,
          nabla: 8711,
          isin: 8712,
          notin: 8713,
          ni: 8715,
          prod: 8719,
          sum: 8721,
          minus: 8722,
          lowast: 8727,
          radic: 8730,
          prop: 8733,
          infin: 8734,
          ang: 8736,
          and: 8743,
          or: 8744,
          cap: 8745,
          cup: 8746,
          int: 8747,
          there4: 8756,
          sim: 8764,
          cong: 8773,
          asymp: 8776,
          ne: 8800,
          equiv: 8801,
          le: 8804,
          ge: 8805,
          sub: 8834,
          sup: 8835,
          nsub: 8836,
          sube: 8838,
          supe: 8839,
          oplus: 8853,
          otimes: 8855,
          perp: 8869,
          sdot: 8901,
          lceil: 8968,
          rceil: 8969,
          lfloor: 8970,
          rfloor: 8971,
          lang: 9001,
          rang: 9002,
          loz: 9674,
          spades: 9824,
          clubs: 9827,
          hearts: 9829,
          diams: 9830,
        }),
        Object.keys(e.ENTITIES).forEach(function (t) {
          var a = e.ENTITIES[t],
            i = "number" == typeof a ? String.fromCharCode(a) : a;
          e.ENTITIES[t] = i;
        }),
        e.STATE))
          e.STATE[e.STATE[v]] = v;
        function w(e, t, a) {
          e[t] && e[t](a);
        }
        function I(e, t, a) {
          e.textNode && R(e), w(e, t, a);
        }
        function R(e) {
          (e.textNode = D(e.opt, e.textNode)),
            e.textNode && w(e, "ontext", e.textNode),
            (e.textNode = "");
        }
        function D(e, t) {
          return (
            e.trim && (t = t.trim()),
            e.normalize && (t = t.replace(/\s+/g, " ")),
            t
          );
        }
        function A(e, t) {
          return (
            R(e),
            e.trackPosition &&
              (t +=
                "\nLine: " +
                e.line +
                "\nColumn: " +
                e.column +
                "\nChar: " +
                e.c),
            (t = new Error(t)),
            (e.error = t),
            w(e, "onerror", t),
            e
          );
        }
        function N(e) {
          return (
            e.sawRoot && !e.closedRoot && L(e, "Unclosed root tag"),
            e.state !== E.BEGIN &&
              e.state !== E.BEGIN_WHITESPACE &&
              e.state !== E.TEXT &&
              A(e, "Unexpected end"),
            R(e),
            (e.c = ""),
            (e.closed = !0),
            w(e, "onend"),
            r.call(e, e.strict, e.opt),
            e
          );
        }
        function L(e, t) {
          if ("object" != typeof e || !(e instanceof r))
            throw new Error("bad call to strictFail");
          e.strict && A(e, t);
        }
        function O(e) {
          e.strict || (e.tagName = e.tagName[e.looseCase]());
          var t = e.tags[e.tags.length - 1] || e,
            a = (e.tag = { name: e.tagName, attributes: {} });
          e.opt.xmlns && (a.ns = t.ns),
            (e.attribList.length = 0),
            I(e, "onopentagstart", a);
        }
        function S(e, t) {
          var a = e.indexOf(":") < 0 ? ["", e] : e.split(":"),
            i = a[0],
            r = a[1];
          return (
            t && "xmlns" === e && ((i = "xmlns"), (r = "")),
            { prefix: i, local: r }
          );
        }
        function x(e) {
          if (
            (e.strict || (e.attribName = e.attribName[e.looseCase]()),
            -1 !== e.attribList.indexOf(e.attribName) ||
              e.tag.attributes.hasOwnProperty(e.attribName))
          )
            e.attribName = e.attribValue = "";
          else {
            if (e.opt.xmlns) {
              var t = S(e.attribName, !0),
                a = t.prefix,
                i = t.local;
              if ("xmlns" === a)
                if ("xml" === i && e.attribValue !== o)
                  L(
                    e,
                    "xml: prefix must be bound to " +
                      o +
                      "\nActual: " +
                      e.attribValue
                  );
                else if (
                  "xmlns" === i &&
                  "http://www.w3.org/2000/xmlns/" !== e.attribValue
                )
                  L(
                    e,
                    "xmlns: prefix must be bound to http://www.w3.org/2000/xmlns/\nActual: " +
                      e.attribValue
                  );
                else {
                  var r = e.tag,
                    s = e.tags[e.tags.length - 1] || e;
                  r.ns === s.ns && (r.ns = Object.create(s.ns)),
                    (r.ns[i] = e.attribValue);
                }
              e.attribList.push([e.attribName, e.attribValue]);
            } else
              (e.tag.attributes[e.attribName] = e.attribValue),
                I(e, "onattribute", {
                  name: e.attribName,
                  value: e.attribValue,
                });
            e.attribName = e.attribValue = "";
          }
        }
        function C(e, t) {
          if (e.opt.xmlns) {
            var a = e.tag,
              i = S(e.tagName);
            (a.prefix = i.prefix),
              (a.local = i.local),
              (a.uri = a.ns[i.prefix] || ""),
              a.prefix &&
                !a.uri &&
                (L(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)),
                (a.uri = i.prefix));
            var r = e.tags[e.tags.length - 1] || e;
            a.ns &&
              r.ns !== a.ns &&
              Object.keys(a.ns).forEach(function (t) {
                I(e, "onopennamespace", { prefix: t, uri: a.ns[t] });
              });
            for (var s = 0, n = e.attribList.length; s < n; s++) {
              var o = e.attribList[s],
                l = o[0],
                c = o[1],
                u = S(l, !0),
                d = u.prefix,
                p = u.local,
                h = "" === d ? "" : a.ns[d] || "",
                m = { name: l, value: c, prefix: d, local: p, uri: h };
              d &&
                "xmlns" !== d &&
                !h &&
                (L(e, "Unbound namespace prefix: " + JSON.stringify(d)),
                (m.uri = d)),
                (e.tag.attributes[l] = m),
                I(e, "onattribute", m);
            }
            e.attribList.length = 0;
          }
          (e.tag.isSelfClosing = !!t),
            (e.sawRoot = !0),
            e.tags.push(e.tag),
            I(e, "onopentag", e.tag),
            t ||
              (e.noscript || "script" !== e.tagName.toLowerCase()
                ? (e.state = E.TEXT)
                : (e.state = E.SCRIPT),
              (e.tag = null),
              (e.tagName = "")),
            (e.attribName = e.attribValue = ""),
            (e.attribList.length = 0);
        }
        function B(e) {
          if (!e.tagName)
            return (
              L(e, "Weird empty close tag."),
              (e.textNode += "</>"),
              void (e.state = E.TEXT)
            );
          if (e.script) {
            if ("script" !== e.tagName)
              return (
                (e.script += "</" + e.tagName + ">"),
                (e.tagName = ""),
                void (e.state = E.SCRIPT)
              );
            I(e, "onscript", e.script), (e.script = "");
          }
          var t = e.tags.length,
            a = e.tagName;
          e.strict || (a = a[e.looseCase]());
          for (var i = a; t--; ) {
            if (e.tags[t].name === i) break;
            L(e, "Unexpected close tag");
          }
          if (t < 0)
            return (
              L(e, "Unmatched closing tag: " + e.tagName),
              (e.textNode += "</" + e.tagName + ">"),
              void (e.state = E.TEXT)
            );
          e.tagName = a;
          for (var r = e.tags.length; r-- > t; ) {
            var s = (e.tag = e.tags.pop());
            (e.tagName = e.tag.name), I(e, "onclosetag", e.tagName);
            var n = {};
            for (var o in s.ns) n[o] = s.ns[o];
            var l = e.tags[e.tags.length - 1] || e;
            e.opt.xmlns &&
              s.ns !== l.ns &&
              Object.keys(s.ns).forEach(function (t) {
                var a = s.ns[t];
                I(e, "onclosenamespace", { prefix: t, uri: a });
              });
          }
          0 === t && (e.closedRoot = !0),
            (e.tagName = e.attribValue = e.attribName = ""),
            (e.attribList.length = 0),
            (e.state = E.TEXT);
        }
        function P(e) {
          var t,
            a = e.entity,
            i = a.toLowerCase(),
            r = "";
          return e.ENTITIES[a]
            ? e.ENTITIES[a]
            : e.ENTITIES[i]
            ? e.ENTITIES[i]
            : ("#" === (a = i).charAt(0) &&
                ("x" === a.charAt(1)
                  ? ((a = a.slice(2)), (r = (t = parseInt(a, 16)).toString(16)))
                  : ((a = a.slice(1)),
                    (r = (t = parseInt(a, 10)).toString(10)))),
              (a = a.replace(/^0+/, "")),
              isNaN(t) || r.toLowerCase() !== a
                ? (L(e, "Invalid character entity"), "&" + e.entity + ";")
                : String.fromCodePoint(t));
        }
        function M(e, t) {
          "<" === t
            ? ((e.state = E.OPEN_WAKA), (e.startTagPosition = e.position))
            : h(t) ||
              (L(e, "Non-whitespace before first tag."),
              (e.textNode = t),
              (e.state = E.TEXT));
        }
        function q(e, t) {
          var a = "";
          return t < e.length && (a = e.charAt(t)), a;
        }
        (E = e.STATE),
          String.fromCodePoint ||
            ((g = String.fromCharCode),
            (T = Math.floor),
            (_ = function () {
              var e,
                t,
                a = 16384,
                i = [],
                r = -1,
                s = arguments.length;
              if (!s) return "";
              for (var n = ""; ++r < s; ) {
                var o = Number(arguments[r]);
                if (!isFinite(o) || o < 0 || o > 1114111 || T(o) !== o)
                  throw RangeError("Invalid code point: " + o);
                o <= 65535
                  ? i.push(o)
                  : ((e = 55296 + ((o -= 65536) >> 10)),
                    (t = (o % 1024) + 56320),
                    i.push(e, t)),
                  (r + 1 === s || i.length > a) &&
                    ((n += g.apply(null, i)), (i.length = 0));
              }
              return n;
            }),
            Object.defineProperty
              ? Object.defineProperty(String, "fromCodePoint", {
                  value: _,
                  configurable: !0,
                  writable: !0,
                })
              : (String.fromCodePoint = _));
      })(t);
    },
    function (e) {
      e.exports = {
        _from: "ytdl-core@4.9.2",
        _id: "ytdl-core@4.9.2",
        _inBundle: !1,
        _integrity:
          "sha512-aTlsvsN++03MuOtyVD4DRF9Z/9UAeeuiNbjs+LjQBAiw4Hrdp48T3U9vAmRPyvREzupraY8pqRoBfKGqpq+eHA==",
        _location: "/ytdl-core",
        _phantomChildren: {},
        _requested: {
          type: "version",
          registry: !0,
          raw: "ytdl-core@4.9.2",
          name: "ytdl-core",
          escapedName: "ytdl-core",
          rawSpec: "4.9.2",
          saveSpec: null,
          fetchSpec: "4.9.2",
        },
        _requiredBy: ["#DEV:/"],
        _resolved: "https://registry.npmjs.org/ytdl-core/-/ytdl-core-4.9.2.tgz",
        _shasum: "c2d1ec44ee3cabff35e5843c6831755e69ffacf0",
        _spec: "ytdl-core@4.9.2",
        _where: "/mnt/c/Users/Adrien/Downloads/blob",
        author: {
          name: "fent",
          email: "fentbox@gmail.com",
          url: "https://github.com/fent",
        },
        bugs: { url: "https://github.com/fent/node-ytdl-core/issues" },
        bundleDependencies: !1,
        contributors: [
          { name: "Tobias Kutscha", url: "https://github.com/TimeForANinja" },
          { name: "Andrew Kelley", url: "https://github.com/andrewrk" },
          { name: "Mauricio Allende", url: "https://github.com/mallendeo" },
          { name: "Rodrigo Altamirano", url: "https://github.com/raltamirano" },
          { name: "Jim Buck", url: "https://github.com/JimmyBoh" },
        ],
        dependencies: {
          m3u8stream: "^0.8.4",
          miniget: "^4.0.0",
          sax: "^1.1.3",
        },
        deprecated: !1,
        description: "YouTube video downloader in pure javascript.",
        devDependencies: {
          "@types/node": "^13.1.0",
          "assert-diff": "^3.0.1",
          dtslint: "^3.6.14",
          eslint: "^6.8.0",
          mocha: "^7.0.0",
          "muk-require": "^1.2.0",
          nock: "^13.0.4",
          nyc: "^15.0.0",
          sinon: "^9.0.0",
          "stream-equal": "~1.1.0",
          typescript: "^3.9.7",
        },
        engines: { node: ">=10" },
        files: ["lib", "typings"],
        homepage: "https://github.com/fent/node-ytdl-core#readme",
        keywords: ["youtube", "video", "download"],
        license: "MIT",
        main: "./lib/index.js",
        name: "ytdl-core",
        repository: {
          type: "git",
          url: "git://github.com/fent/node-ytdl-core.git",
        },
        scripts: {
          lint: "eslint ./",
          "lint:fix": "eslint --fix ./",
          "lint:typings": "tslint typings/index.d.ts",
          "lint:typings:fix": "tslint --fix typings/index.d.ts",
          test: "nyc --reporter=lcov --reporter=text-summary npm run test:unit",
          "test:irl": "mocha --timeout 16000 test/irl-test.js",
          "test:unit":
            "mocha --ignore test/irl-test.js test/*-test.js --timeout 4000",
        },
        types: "./typings/index.d.ts",
        version: "4.9.2",
      };
    },
    function (e, t) {
      e.exports = require("timers");
    },
    function (e, t, a) {
      const i = a(1),
        r = a(18),
        s = ["mp4a", "mp3", "vorbis", "aac", "opus", "flac"],
        n = [
          "mp4v",
          "avc1",
          "Sorenson H.283",
          "MPEG-4 Visual",
          "VP8",
          "VP9",
          "H.264",
        ],
        o = (e) => e.bitrate || 0,
        l = (e) => n.findIndex((t) => e.codecs && e.codecs.includes(t)),
        c = (e) => e.audioBitrate || 0,
        u = (e) => s.findIndex((t) => e.codecs && e.codecs.includes(t)),
        d = (e, t, a) => {
          let i = 0;
          for (let r of a) if (((i = r(t) - r(e)), 0 !== i)) break;
          return i;
        },
        p = (e, t) => d(e, t, [(e) => parseInt(e.qualityLabel), o, l]),
        h = (e, t) => d(e, t, [c, u]);
      (t.sortFormats = (e, t) =>
        d(e, t, [
          (e) => +!!e.isHLS,
          (e) => +!!e.isDashMPD,
          (e) => +(e.contentLength > 0),
          (e) => +(e.hasVideo && e.hasAudio),
          (e) => +e.hasVideo,
          (e) => parseInt(e.qualityLabel) || 0,
          o,
          c,
          l,
          u,
        ])),
        (t.chooseFormat = (e, a) => {
          if ("object" == typeof a.format) {
            if (!a.format.url)
              throw Error(
                "Invalid format given, did you use `ytdl.getInfo()`?"
              );
            return a.format;
          }
          let i;
          a.filter && (e = t.filterFormats(e, a.filter)),
            e.some((e) => e.isHLS) &&
              (e = e.filter((e) => e.isHLS || !e.isLive));
          const r = a.quality || "highest";
          switch (r) {
            case "highest":
              i = e[0];
              break;
            case "lowest":
              i = e[e.length - 1];
              break;
            case "highestaudio": {
              (e = t.filterFormats(e, "audio")).sort(h);
              const a = e[0],
                r = (e = e.filter((e) => 0 === h(a, e)))
                  .map((e) => parseInt(e.qualityLabel) || 0)
                  .sort((e, t) => e - t)[0];
              i = e.find((e) => (parseInt(e.qualityLabel) || 0) === r);
              break;
            }
            case "lowestaudio":
              (e = t.filterFormats(e, "audio")).sort(h), (i = e[e.length - 1]);
              break;
            case "highestvideo": {
              (e = t.filterFormats(e, "video")).sort(p);
              const a = e[0],
                r = (e = e.filter((e) => 0 === p(a, e)))
                  .map((e) => e.audioBitrate || 0)
                  .sort((e, t) => e - t)[0];
              i = e.find((e) => (e.audioBitrate || 0) === r);
              break;
            }
            case "lowestvideo":
              (e = t.filterFormats(e, "video")).sort(p), (i = e[e.length - 1]);
              break;
            default:
              i = m(r, e);
          }
          if (!i) throw Error("No such format found: " + r);
          return i;
        });
      const m = (e, t) => {
        let a = (e) => t.find((t) => "" + t.itag == "" + e);
        return Array.isArray(e) ? a(e.find((e) => a(e))) : a(e);
      };
      (t.filterFormats = (e, t) => {
        let a;
        switch (t) {
          case "videoandaudio":
          case "audioandvideo":
            a = (e) => e.hasVideo && e.hasAudio;
            break;
          case "video":
            a = (e) => e.hasVideo;
            break;
          case "videoonly":
            a = (e) => e.hasVideo && !e.hasAudio;
            break;
          case "audio":
            a = (e) => e.hasAudio;
            break;
          case "audioonly":
            a = (e) => !e.hasVideo && e.hasAudio;
            break;
          default:
            if ("function" != typeof t)
              throw TypeError(`Given filter (${t}) is not supported`);
            a = t;
        }
        return e.filter((e) => !!e.url && a(e));
      }),
        (t.addFormatMeta = (e) => (
          ((e = Object.assign({}, r[e.itag], e)).hasVideo = !!e.qualityLabel),
          (e.hasAudio = !!e.audioBitrate),
          (e.container = e.mimeType
            ? e.mimeType.split(";")[0].split("/")[1]
            : null),
          (e.codecs = e.mimeType
            ? i.between(e.mimeType, 'codecs="', '"')
            : null),
          (e.videoCodec =
            e.hasVideo && e.codecs ? e.codecs.split(", ")[0] : null),
          (e.audioCodec =
            e.hasAudio && e.codecs ? e.codecs.split(", ").slice(-1)[0] : null),
          (e.isLive = /\bsource[/=]yt_live_broadcast\b/.test(e.url)),
          (e.isHLS = /\/manifest\/hls_(variant|playlist)\//.test(e.url)),
          (e.isDashMPD = /\/manifest\/dash\//.test(e.url)),
          e
        ));
    },
    function (e, t) {
      const a = new Set([
          "youtube.com",
          "www.youtube.com",
          "m.youtube.com",
          "music.youtube.com",
          "gaming.youtube.com",
        ]),
        i =
          /^https?:\/\/(youtu\.be\/|(www\.)?youtube\.com\/(embed|v|shorts)\/)/;
      t.getURLVideoID = (e) => {
        const r = new URL(e);
        let n = r.searchParams.get("v");
        if (i.test(e) && !n) {
          const e = r.pathname.split("/");
          n = "youtu.be" === r.host ? e[1] : e[2];
        } else if (r.hostname && !a.has(r.hostname))
          throw Error("Not a YouTube domain");
        if (!n) throw Error("No video id found: " + e);
        if (((n = n.substring(0, 11)), !t.validateID(n)))
          throw TypeError(
            `Video id (${n}) does not match expected format (${s.toString()})`
          );
        return n;
      };
      const r = /^https?:\/\//;
      t.getVideoID = (e) => {
        if (t.validateID(e)) return e;
        if (r.test(e)) return t.getURLVideoID(e);
        throw Error("No video id found: " + e);
      };
      const s = /^[a-zA-Z0-9-_]{11}$/;
      (t.validateID = (e) => s.test(e)),
        (t.validateURL = (e) => {
          try {
            return t.getURLVideoID(e), !0;
          } catch (e) {
            return !1;
          }
        });
    },
    function (e, t, a) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (t.durationStr = t.humanStr = void 0);
      const i = /^\d+$/,
        r = /^(?:(?:(\d+):)?(\d{1,2}):)?(\d{1,2})(?:\.(\d{3}))?$/,
        s = { ms: 1, s: 1e3, m: 6e4, h: 36e5 };
      (t.humanStr = (e) => {
        if ("number" == typeof e) return e;
        if (i.test(e)) return +e;
        const t = r.exec(e);
        if (t)
          return (
            +(t[1] || 0) * s.h + +(t[2] || 0) * s.m + +t[3] * s.s + +(t[4] || 0)
          );
        {
          let t = 0;
          const a = /(-?\d+)(ms|s|m|h)/g;
          let i;
          for (; null !== (i = a.exec(e)); ) t += +i[1] * s[i[2]];
          return t;
        }
      }),
        (t.durationStr = (e) => {
          let t = 0;
          const a = /(\d+(?:\.\d+)?)(S|M|H)/g;
          let i;
          for (; null !== (i = a.exec(e)); ) t += +i[1] * s[i[2].toLowerCase()];
          return t;
        });
    },
    function (e, t, a) {
      const i = a(3),
        r = a(12),
        s = a(1),
        n = a(23);
      (t.cache = new r()),
        (t.getFunctions = (e, a) =>
          t.cache.getOrSet(e, async () => {
            const i = await s.exposedMiniget(e, a).text(),
              r = t.extractFunctions(i);
            if (!r || !r.length) throw Error("Could not extract functions");
            return t.cache.set(e, r), r;
          })),
        (t.extractFunctions = (e) => {
          const t = [];
          return (
            (() => {
              const a = s.between(
                e,
                'a.set("alr","yes");c&&(c=',
                "(decodeURIC"
              );
              if (a && a.length) {
                const i = a + "=function(a)",
                  r = e.indexOf(i);
                if (r >= 0) {
                  const n = e.slice(r + i.length);
                  let o = `var ${i}${s.cutAfterJSON(n)}`;
                  (o = `${((t) => {
                    const a = s.between(t, 'a=a.split("");', ".");
                    if (!a) return "";
                    const i = `var ${a}={`,
                      r = e.indexOf(i);
                    if (r < 0) return "";
                    const n = e.slice(r + i.length - 1);
                    return `var ${a}=${s.cutAfterJSON(n)}`;
                  })(o)};${o};${a}(sig);`),
                    t.push(o);
                }
              }
            })(),
            (() => {
              const a = s.between(e, '&&(b=a.get("n"))&&(b=', "(b)");
              if (a && a.length) {
                const i = a + "=function(a)",
                  r = e.indexOf(i);
                if (r >= 0) {
                  const n = e.slice(r + i.length),
                    o = `var ${i}${s.cutAfterJSON(n)};${a}(ncode);`;
                  t.push(o);
                }
              }
            })(),
            t
          );
        }),
        (t.setDownloadURL = (e, t, a) => {
          const r = (e) => {
              const t = new URL(decodeURIComponent(e)),
                i = t.searchParams.get("n");
              return i && a
                ? (t.searchParams.set("n", a.runInNewContext({ ncode: i })),
                  t.toString())
                : e;
            },
            s = !e.url,
            n = e.url || e.signatureCipher || e.cipher;
          (e.url = r(
            s
              ? ((e) => {
                  const a = i.parse(e);
                  if (!a.s || !t) return a.url;
                  const r = new URL(decodeURIComponent(a.url));
                  return (
                    r.searchParams.set(
                      a.sp ? a.sp : "signature",
                      t.runInNewContext({ sig: decodeURIComponent(a.s) })
                    ),
                    r.toString()
                  );
                })(n)
              : n
          )),
            delete e.signatureCipher,
            delete e.cipher;
        }),
        (t.decipherFormats = async (e, a, i) => {
          let r = {},
            s = await t.getFunctions(a, i);
          const o = s.length ? new n.Script(s[0]) : null,
            l = s.length > 1 ? new n.Script(s[1]) : null;
          return (
            e.forEach((e) => {
              t.setDownloadURL(e, o, l), (r[e.url] = e);
            }),
            r
          );
        });
    },
    function (e, t, a) {
      const { setTimeout: i } = a(7);
      e.exports = class extends Map {
        constructor(e = 1e3) {
          super(), (this.timeout = e);
        }
        set(e, t) {
          this.has(e) && clearTimeout(super.get(e).tid),
            super.set(e, {
              tid: i(this.delete.bind(this, e), this.timeout).unref(),
              value: t,
            });
        }
        get(e) {
          let t = super.get(e);
          return t ? t.value : null;
        }
        getOrSet(e, t) {
          if (this.has(e)) return this.get(e);
          {
            let a = t();
            return (
              this.set(e, a),
              (async () => {
                try {
                  await a;
                } catch (t) {
                  this.delete(e);
                }
              })(),
              a
            );
          }
        }
        delete(e) {
          let t = super.get(e);
          t && (clearTimeout(t.tid), super.delete(e));
        }
        clear() {
          for (let e of this.values()) clearTimeout(e.tid);
          super.clear();
        }
      };
    },
    function (e, t, a) {
      const i = a(0).PassThrough,
        r = a(14),
        s = a(1),
        n = a(8),
        o = a(9),
        l = a(11),
        c = a(2),
        u = a(4),
        { parseTimestamp: d } = a(4),
        p = (e, t) => {
          const a = h(t);
          return (
            p.getInfo(e, t).then((e) => {
              b(a, e, t);
            }, a.emit.bind(a, "error")),
            a
          );
        };
      (e.exports = p),
        (p.getBasicInfo = r.getBasicInfo),
        (p.getInfo = r.getInfo),
        (p.chooseFormat = n.chooseFormat),
        (p.filterFormats = n.filterFormats),
        (p.validateID = o.validateID),
        (p.validateURL = o.validateURL),
        (p.getURLVideoID = o.getURLVideoID),
        (p.getVideoID = o.getVideoID),
        (p.cache = {
          sig: l.cache,
          info: r.cache,
          watch: r.watchPageCache,
          cookie: r.cookieCache,
        }),
        (p.version = a(6).version);
      const h = (e) => {
          const t = new i({ highWaterMark: (e && e.highWaterMark) || 524288 });
          return (
            (t._destroy = () => {
              t.destroyed = !0;
            }),
            t
          );
        },
        m = (e, t, a) => {
          [
            "abort",
            "request",
            "response",
            "error",
            "redirect",
            "retry",
            "reconnect",
          ].forEach((a) => {
            e.prependListener(a, t.emit.bind(t, a));
          }),
            e.pipe(t, { end: a });
        },
        b = (e, t, a) => {
          a = a || {};
          let i,
            r = s.playError(t.player_response, [
              "UNPLAYABLE",
              "LIVE_STREAM_OFFLINE",
              "LOGIN_REQUIRED",
            ]);
          if (r) return void e.emit("error", r);
          if (!t.formats.length)
            return void e.emit("error", Error("This video is unavailable"));
          try {
            i = n.chooseFormat(t.formats, a);
          } catch (t) {
            return void e.emit("error", t);
          }
          if ((e.emit("info", t, i), e.destroyed)) return;
          let o,
            l = 0;
          const p = (t) => {
              (l += t.length), e.emit("progress", t.length, l, o);
            },
            h = a.dlChunkSize || 10485760;
          let b,
            f = !0;
          if (i.isHLS || i.isDashMPD)
            (b = u(i.url, {
              chunkReadahead: +t.live_chunk_readahead,
              begin: a.begin || (i.isLive && Date.now()),
              liveBuffer: a.liveBuffer,
              requestOptions: a.requestOptions,
              parser: i.isDashMPD ? "dash-mpd" : "m3u8",
              id: i.itag,
            })),
              b.on("progress", (t, a) => {
                e.emit("progress", t.size, t.num, a);
              }),
              m(b, e, f);
          else {
            const t = Object.assign({}, a.requestOptions, {
              maxReconnects: 6,
              maxRetries: 3,
              backoff: { inc: 500, max: 1e4 },
            });
            if (!(0 === h || (i.hasAudio && i.hasVideo))) {
              let r = (a.range && a.range.start) || 0,
                s = r + h;
              const n = a.range && a.range.end;
              o = a.range
                ? (n ? n + 1 : parseInt(i.contentLength)) - r
                : parseInt(i.contentLength);
              const l = () => {
                !n && s >= o && (s = 0),
                  n && s > n && (s = n),
                  (f = !s || s === n),
                  (t.headers = Object.assign({}, t.headers, {
                    Range: `bytes=${r}-${s || ""}`,
                  })),
                  (b = c(i.url, t)),
                  b.on("data", p),
                  b.on("end", () => {
                    e.destroyed ||
                      (s && s !== n && ((r = s + 1), (s += h), l()));
                  }),
                  m(b, e, f);
              };
              l();
            } else
              a.begin && (i.url += "&begin=" + d(a.begin)),
                a.range &&
                  (a.range.start || a.range.end) &&
                  (t.headers = Object.assign({}, t.headers, {
                    Range: `bytes=${a.range.start || "0"}-${a.range.end || ""}`,
                  })),
                (b = c(i.url, t)),
                b.on("response", (t) => {
                  e.destroyed ||
                    (o = o || parseInt(t.headers["content-length"]));
                }),
                b.on("data", p),
                m(b, e, f);
          }
          e._destroy = () => {
            (e.destroyed = !0), b.destroy(), b.end();
          };
        };
      p.downloadFromInfo = (e, t) => {
        const a = h(t);
        if (!e.full)
          throw Error(
            "Cannot use `ytdl.downloadFromInfo()` when called with info from `ytdl.getBasicInfo()`"
          );
        return (
          setImmediate(() => {
            b(a, e, t);
          }),
          a
        );
      };
    },
    function (e, t, a) {
      const i = a(3),
        r = a(5),
        s = a(2),
        n = a(1),
        { setTimeout: o } = a(7),
        l = a(8),
        c = a(9),
        u = a(19),
        d = a(11),
        p = a(12),
        h = "https://www.youtube.com/watch?v=";
      (t.cache = new p()),
        (t.cookieCache = new p(864e5)),
        (t.watchPageCache = new p());
      let m = "2.20210622.10.00";
      class b extends Error {}
      const f = [
        "support.google.com/youtube/?p=age_restrictions",
        "youtube.com/t/community_guidelines",
      ];
      t.getBasicInfo = async (e, t) => {
        const a = Object.assign({}, s.defaultOptions, t.requestOptions);
        (t.requestOptions = Object.assign({}, t.requestOptions, {})),
          (t.requestOptions.headers = Object.assign(
            {},
            {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36",
            },
            t.requestOptions.headers
          ));
        let i = await w(
          [e, t],
          (e) => {
            let t = n.playError(e.player_response, ["ERROR"], b),
              a = y(e.player_response);
            if (t || a) throw t || a;
            return (
              e &&
              e.player_response &&
              (e.player_response.streamingData ||
                g(e.player_response) ||
                T(e.player_response))
            );
          },
          a,
          [S, O, x]
        );
        Object.assign(i, {
          formats: C(i.player_response),
          related_videos: u.getRelatedVideos(i),
        });
        const r = u.getMedia(i),
          o = {
            author: u.getAuthor(i),
            media: r,
            likes: u.getLikes(i),
            dislikes: u.getDislikes(i),
            age_restricted: !!(
              r &&
              r.notice_url &&
              f.some((e) => r.notice_url.includes(e))
            ),
            video_url: h + e,
            storyboards: u.getStoryboards(i),
            chapters: u.getChapters(i),
          };
        return (
          (i.videoDetails = u.cleanVideoDetails(
            Object.assign(
              {},
              i.player_response &&
                i.player_response.microformat &&
                i.player_response.microformat.playerMicroformatRenderer,
              i.player_response && i.player_response.videoDetails,
              o
            ),
            i
          )),
          i
        );
      };
      const y = (e) => {
          let t = e && e.playabilityStatus;
          return t &&
            "LOGIN_REQUIRED" === t.status &&
            t.messages &&
            t.messages.filter((e) => /This is a private video/.test(e)).length
            ? new b(t.reason || (t.messages && t.messages[0]))
            : null;
        },
        g = (e) => {
          let t = e.playabilityStatus;
          return (
            t &&
            "UNPLAYABLE" === t.status &&
            t.errorScreen &&
            t.errorScreen.playerLegacyDesktopYpcOfferRenderer
          );
        },
        T = (e) => {
          let t = e.playabilityStatus;
          return t && "LIVE_STREAM_OFFLINE" === t.status;
        },
        _ = (e, t) => `${h + e}&hl=${t.lang || "en"}`,
        E = (e, a) => {
          const i = _(e, a);
          return t.watchPageCache.getOrSet(i, () =>
            n.exposedMiniget(i, a).text()
          );
        },
        v = (e) => {
          let t =
            /<script\s+src="([^"]+)"(?:\s+type="text\/javascript")?\s+name="player_ias\/base"\s*>|"jsUrl":"([^"]+)"/.exec(
              e
            );
          return t ? t[1] || t[2] : null;
        },
        w = async (e, t, a, i) => {
          let r;
          for (let s of i)
            try {
              const i = await R(s, e.concat([r]), a);
              if (
                (i.player_response &&
                  ((i.player_response.videoDetails = I(
                    r && r.player_response && r.player_response.videoDetails,
                    i.player_response.videoDetails
                  )),
                  (i.player_response = I(
                    r && r.player_response,
                    i.player_response
                  ))),
                (r = I(r, i)),
                t(r, !1))
              )
                break;
            } catch (e) {
              if (e instanceof b || s === i[i.length - 1]) throw e;
            }
          return r;
        },
        I = (e, t) => {
          if (!e || !t) return e || t;
          for (let [a, i] of Object.entries(t)) null != i && (e[a] = i);
          return e;
        },
        R = async (e, t, a) => {
          let i,
            r = 0;
          for (; r <= a.maxRetries; )
            try {
              i = await e(...t);
              break;
            } catch (e) {
              if (
                e instanceof b ||
                (e instanceof s.MinigetError && e.statusCode < 500) ||
                r >= a.maxRetries
              )
                throw e;
              let t = Math.min(++r * a.backoff.inc, a.backoff.max);
              await new Promise((e) => o(e, t));
            }
          return i;
        },
        D = /^[)\]}'\s]+/,
        A = (e, t, a) => {
          if (!a || "object" == typeof a) return a;
          try {
            return (a = a.replace(D, "")), JSON.parse(a);
          } catch (a) {
            throw Error(`Error parsing ${t} in ${e}: ${a.message}`);
          }
        },
        N = (e, t, a, i, r, s) => {
          let o = n.between(a, i, r);
          if (!o) throw Error(`Could not find ${t} in ${e}`);
          return A(e, t, n.cutAfterJSON(`${s}${o}`));
        },
        L = (e, t) => {
          const a =
            t &&
            ((t.args && t.args.player_response) ||
              t.player_response ||
              t.playerResponse ||
              t.embedded_player_response);
          return A(e, "player_response", a);
        },
        O = async (e, a) => {
          const i = Object.assign({ headers: {} }, a.requestOptions);
          let r = i.headers.Cookie || i.headers.cookie;
          i.headers = Object.assign(
            {
              "x-youtube-client-name": "1",
              "x-youtube-client-version": m,
              "x-youtube-identity-token":
                t.cookieCache.get(r || "browser") || "",
            },
            i.headers
          );
          const s = async (r, s) => {
            i.headers["x-youtube-identity-token"] ||
              (i.headers["x-youtube-identity-token"] = await ((e, a, i, r) =>
                t.cookieCache.getOrSet(i, async () => {
                  let t = (await E(e, a)).match(
                    /(["'])ID_TOKEN\1[:,]\s?"([^"]+)"/
                  );
                  if (!t && r)
                    throw new b(
                      "Cookie header used in request, but unable to find YouTube identity token"
                    );
                  return t && t[2];
                }))(e, a, r, s));
          };
          r && (await s(r, !0));
          const o = ((e, t) => _(e, t) + "&pbj=1")(e, a),
            l = await n.exposedMiniget(o, a, i).text();
          let c = A("watch.json", "body", l);
          if (
            ("now" === c.reload && (await s("browser", !1)),
            "now" === c.reload || !Array.isArray(c))
          )
            throw Error("Unable to retrieve video metadata in watch.json");
          let u = c.reduce((e, t) => Object.assign(t, e), {});
          return (
            (u.player_response = L("watch.json", u)),
            (u.html5player = u.player && u.player.assets && u.player.assets.js),
            u
          );
        },
        S = async (e, t) => {
          let a = await E(e, t),
            i = { page: "watch" };
          try {
            (m = n.between(a, '{"key":"cver","value":"', '"}')),
              (i.player_response = N(
                "watch.html",
                "player_response",
                a,
                /\bytInitialPlayerResponse\s*=\s*\{/i,
                "</script>",
                "{"
              ));
          } catch (e) {
            let t = N(
              "watch.html",
              "player_response",
              a,
              /\bytplayer\.config\s*=\s*{/,
              "</script>",
              "{"
            );
            i.player_response = L("watch.html", t);
          }
          return (
            (i.response = N(
              "watch.html",
              "response",
              a,
              /\bytInitialData("\])?\s*=\s*\{/i,
              "</script>",
              "{"
            )),
            (i.html5player = v(a)),
            i
          );
        },
        x = async (e, t) => {
          const a = new URL("https://www.youtube.com/get_video_info");
          a.searchParams.set("video_id", e),
            a.searchParams.set("c", "TVHTML5"),
            a.searchParams.set("cver", "7" + m.substr(1)),
            a.searchParams.set("eurl", "https://youtube.googleapis.com/v/" + e),
            a.searchParams.set("ps", "default"),
            a.searchParams.set("gl", "US"),
            a.searchParams.set("hl", t.lang || "en"),
            a.searchParams.set("html5", "1");
          const r = await n.exposedMiniget(a.toString(), t).text();
          let s = i.parse(r);
          return (s.player_response = L("get_video_info", s)), s;
        },
        C = (e) => {
          let t = [];
          return (
            e &&
              e.streamingData &&
              (t = t
                .concat(e.streamingData.formats || [])
                .concat(e.streamingData.adaptiveFormats || [])),
            t
          );
        };
      t.getInfo = async (e, a) => {
        let i = await t.getBasicInfo(e, a);
        const r =
          i.player_response &&
          i.player_response.streamingData &&
          (i.player_response.streamingData.dashManifestUrl ||
            i.player_response.streamingData.hlsManifestUrl);
        let s = [];
        if (i.formats.length) {
          if (
            ((i.html5player =
              i.html5player ||
              v(await E(e, a)) ||
              v(
                await ((e, t) => {
                  const a = `${"https://www.youtube.com/embed/" + e}?hl=${
                    t.lang || "en"
                  }`;
                  return n.exposedMiniget(a, t).text();
                })(e, a)
              )),
            !i.html5player)
          )
            throw Error("Unable to find html5player file");
          const t = new URL(i.html5player, h).toString();
          s.push(d.decipherFormats(i.formats, t, a));
        }
        if (r && i.player_response.streamingData.dashManifestUrl) {
          let e = i.player_response.streamingData.dashManifestUrl;
          s.push(B(e, a));
        }
        if (r && i.player_response.streamingData.hlsManifestUrl) {
          let e = i.player_response.streamingData.hlsManifestUrl;
          s.push(P(e, a));
        }
        let o = await Promise.all(s);
        return (
          (i.formats = Object.values(Object.assign({}, ...o))),
          (i.formats = i.formats.map(l.addFormatMeta)),
          i.formats.sort(l.sortFormats),
          (i.full = !0),
          i
        );
      };
      const B = (e, t) =>
          new Promise((a, i) => {
            let s = {};
            const o = r.parser(!1);
            let l;
            (o.onerror = i),
              (o.onopentag = (t) => {
                if ("ADAPTATIONSET" === t.name) l = t.attributes;
                else if ("REPRESENTATION" === t.name) {
                  const a = parseInt(t.attributes.ID);
                  isNaN(a) ||
                    (s[e] = Object.assign(
                      {
                        itag: a,
                        url: e,
                        bitrate: parseInt(t.attributes.BANDWIDTH),
                        mimeType: `${l.MIMETYPE}; codecs="${t.attributes.CODECS}"`,
                      },
                      t.attributes.HEIGHT
                        ? {
                            width: parseInt(t.attributes.WIDTH),
                            height: parseInt(t.attributes.HEIGHT),
                            fps: parseInt(t.attributes.FRAMERATE),
                          }
                        : { audioSampleRate: t.attributes.AUDIOSAMPLINGRATE }
                    ));
                }
              }),
              (o.onend = () => {
                a(s);
              });
            const c = n.exposedMiniget(new URL(e, h).toString(), t);
            c.setEncoding("utf8"),
              c.on("error", i),
              c.on("data", (e) => {
                o.write(e);
              }),
              c.on("end", o.close.bind(o));
          }),
        P = async (e, t) => {
          e = new URL(e, h);
          const a = await n.exposedMiniget(e.toString(), t).text();
          let i = {};
          return (
            a
              .split("\n")
              .filter((e) => /^https?:\/\//.test(e))
              .forEach((e) => {
                const t = parseInt(e.match(/\/itag\/(\d+)\//)[1]);
                i[e] = { itag: t, url: e };
              }),
            i
          );
        };
      for (let e of ["getBasicInfo", "getInfo"]) {
        const a = t[e];
        t[e] = async (i, r = {}) => {
          n.checkForUpdates();
          let s = await c.getVideoID(i);
          const o = [e, s, r.lang].join("-");
          return t.cache.getOrSet(o, () => a(s, r));
        };
      }
      (t.validateID = c.validateID),
        (t.validateURL = c.validateURL),
        (t.getURLVideoID = c.getURLVideoID),
        (t.getVideoID = c.getVideoID);
    },
    function (e, t) {
      e.exports = require("string_decoder");
    },
    function (e, t) {
      e.exports = require("http");
    },
    function (e, t) {
      e.exports = require("https");
    },
    function (e, t) {
      e.exports = {
        5: {
          mimeType: 'video/flv; codecs="Sorenson H.283, mp3"',
          qualityLabel: "240p",
          bitrate: 25e4,
          audioBitrate: 64,
        },
        6: {
          mimeType: 'video/flv; codecs="Sorenson H.263, mp3"',
          qualityLabel: "270p",
          bitrate: 8e5,
          audioBitrate: 64,
        },
        13: {
          mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
          qualityLabel: null,
          bitrate: 5e5,
          audioBitrate: null,
        },
        17: {
          mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
          qualityLabel: "144p",
          bitrate: 5e4,
          audioBitrate: 24,
        },
        18: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "360p",
          bitrate: 5e5,
          audioBitrate: 96,
        },
        22: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "720p",
          bitrate: 2e6,
          audioBitrate: 192,
        },
        34: {
          mimeType: 'video/flv; codecs="H.264, aac"',
          qualityLabel: "360p",
          bitrate: 5e5,
          audioBitrate: 128,
        },
        35: {
          mimeType: 'video/flv; codecs="H.264, aac"',
          qualityLabel: "480p",
          bitrate: 8e5,
          audioBitrate: 128,
        },
        36: {
          mimeType: 'video/3gp; codecs="MPEG-4 Visual, aac"',
          qualityLabel: "240p",
          bitrate: 175e3,
          audioBitrate: 32,
        },
        37: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "1080p",
          bitrate: 3e6,
          audioBitrate: 192,
        },
        38: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "3072p",
          bitrate: 35e5,
          audioBitrate: 192,
        },
        43: {
          mimeType: 'video/webm; codecs="VP8, vorbis"',
          qualityLabel: "360p",
          bitrate: 5e5,
          audioBitrate: 128,
        },
        44: {
          mimeType: 'video/webm; codecs="VP8, vorbis"',
          qualityLabel: "480p",
          bitrate: 1e6,
          audioBitrate: 128,
        },
        45: {
          mimeType: 'video/webm; codecs="VP8, vorbis"',
          qualityLabel: "720p",
          bitrate: 2e6,
          audioBitrate: 192,
        },
        46: {
          mimeType: 'audio/webm; codecs="vp8, vorbis"',
          qualityLabel: "1080p",
          bitrate: null,
          audioBitrate: 192,
        },
        82: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "360p",
          bitrate: 5e5,
          audioBitrate: 96,
        },
        83: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "240p",
          bitrate: 5e5,
          audioBitrate: 96,
        },
        84: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "720p",
          bitrate: 2e6,
          audioBitrate: 192,
        },
        85: {
          mimeType: 'video/mp4; codecs="H.264, aac"',
          qualityLabel: "1080p",
          bitrate: 3e6,
          audioBitrate: 192,
        },
        91: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "144p",
          bitrate: 1e5,
          audioBitrate: 48,
        },
        92: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "240p",
          bitrate: 15e4,
          audioBitrate: 48,
        },
        93: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "360p",
          bitrate: 5e5,
          audioBitrate: 128,
        },
        94: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "480p",
          bitrate: 8e5,
          audioBitrate: 128,
        },
        95: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "720p",
          bitrate: 15e5,
          audioBitrate: 256,
        },
        96: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "1080p",
          bitrate: 25e5,
          audioBitrate: 256,
        },
        100: {
          mimeType: 'audio/webm; codecs="VP8, vorbis"',
          qualityLabel: "360p",
          bitrate: null,
          audioBitrate: 128,
        },
        101: {
          mimeType: 'audio/webm; codecs="VP8, vorbis"',
          qualityLabel: "360p",
          bitrate: null,
          audioBitrate: 192,
        },
        102: {
          mimeType: 'audio/webm; codecs="VP8, vorbis"',
          qualityLabel: "720p",
          bitrate: null,
          audioBitrate: 192,
        },
        120: {
          mimeType: 'video/flv; codecs="H.264, aac"',
          qualityLabel: "720p",
          bitrate: 2e6,
          audioBitrate: 128,
        },
        127: {
          mimeType: 'audio/ts; codecs="aac"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 96,
        },
        128: {
          mimeType: 'audio/ts; codecs="aac"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 96,
        },
        132: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "240p",
          bitrate: 15e4,
          audioBitrate: 48,
        },
        133: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "240p",
          bitrate: 2e5,
          audioBitrate: null,
        },
        134: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "360p",
          bitrate: 3e5,
          audioBitrate: null,
        },
        135: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "480p",
          bitrate: 5e5,
          audioBitrate: null,
        },
        136: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "720p",
          bitrate: 1e6,
          audioBitrate: null,
        },
        137: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "1080p",
          bitrate: 25e5,
          audioBitrate: null,
        },
        138: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "4320p",
          bitrate: 135e5,
          audioBitrate: null,
        },
        139: {
          mimeType: 'audio/mp4; codecs="aac"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 48,
        },
        140: {
          mimeType: 'audio/m4a; codecs="aac"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 128,
        },
        141: {
          mimeType: 'audio/mp4; codecs="aac"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 256,
        },
        151: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "720p",
          bitrate: 5e4,
          audioBitrate: 24,
        },
        160: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "144p",
          bitrate: 1e5,
          audioBitrate: null,
        },
        171: {
          mimeType: 'audio/webm; codecs="vorbis"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 128,
        },
        172: {
          mimeType: 'audio/webm; codecs="vorbis"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 192,
        },
        242: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "240p",
          bitrate: 1e5,
          audioBitrate: null,
        },
        243: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "360p",
          bitrate: 25e4,
          audioBitrate: null,
        },
        244: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "480p",
          bitrate: 5e5,
          audioBitrate: null,
        },
        247: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "720p",
          bitrate: 7e5,
          audioBitrate: null,
        },
        248: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "1080p",
          bitrate: 15e5,
          audioBitrate: null,
        },
        249: {
          mimeType: 'audio/webm; codecs="opus"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 48,
        },
        250: {
          mimeType: 'audio/webm; codecs="opus"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 64,
        },
        251: {
          mimeType: 'audio/webm; codecs="opus"',
          qualityLabel: null,
          bitrate: null,
          audioBitrate: 160,
        },
        264: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "1440p",
          bitrate: 4e6,
          audioBitrate: null,
        },
        266: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "2160p",
          bitrate: 125e5,
          audioBitrate: null,
        },
        271: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "1440p",
          bitrate: 9e6,
          audioBitrate: null,
        },
        272: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "4320p",
          bitrate: 2e7,
          audioBitrate: null,
        },
        278: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "144p 30fps",
          bitrate: 8e4,
          audioBitrate: null,
        },
        298: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "720p",
          bitrate: 3e6,
          audioBitrate: null,
        },
        299: {
          mimeType: 'video/mp4; codecs="H.264"',
          qualityLabel: "1080p",
          bitrate: 55e5,
          audioBitrate: null,
        },
        300: {
          mimeType: 'video/ts; codecs="H.264, aac"',
          qualityLabel: "720p",
          bitrate: 1318e3,
          audioBitrate: 48,
        },
        302: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "720p HFR",
          bitrate: 25e5,
          audioBitrate: null,
        },
        303: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "1080p HFR",
          bitrate: 5e6,
          audioBitrate: null,
        },
        308: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "1440p HFR",
          bitrate: 1e7,
          audioBitrate: null,
        },
        313: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "2160p",
          bitrate: 13e6,
          audioBitrate: null,
        },
        315: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "2160p HFR",
          bitrate: 2e7,
          audioBitrate: null,
        },
        330: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "144p HDR, HFR",
          bitrate: 8e4,
          audioBitrate: null,
        },
        331: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "240p HDR, HFR",
          bitrate: 1e5,
          audioBitrate: null,
        },
        332: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "360p HDR, HFR",
          bitrate: 25e4,
          audioBitrate: null,
        },
        333: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "240p HDR, HFR",
          bitrate: 5e5,
          audioBitrate: null,
        },
        334: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "720p HDR, HFR",
          bitrate: 1e6,
          audioBitrate: null,
        },
        335: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "1080p HDR, HFR",
          bitrate: 15e5,
          audioBitrate: null,
        },
        336: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "1440p HDR, HFR",
          bitrate: 5e6,
          audioBitrate: null,
        },
        337: {
          mimeType: 'video/webm; codecs="VP9"',
          qualityLabel: "2160p HDR, HFR",
          bitrate: 12e6,
          audioBitrate: null,
        },
      };
    },
    function (e, t, a) {
      const i = a(1),
        r = a(3),
        { parseTimestamp: s } = a(4),
        n = "https://www.youtube.com/watch?v=",
        o = { song: { name: "Music", url: "https://music.youtube.com/" } },
        l = (e) => (e ? (e.runs ? e.runs[0].text : e.simpleText) : null);
      t.getMedia = (e) => {
        let t = {},
          a = [];
        try {
          a =
            e.response.contents.twoColumnWatchNextResults.results.results
              .contents;
        } catch (e) {}
        let i = a.find((e) => e.videoSecondaryInfoRenderer);
        if (!i) return {};
        try {
          let e = (
            i.metadataRowContainer ||
            i.videoSecondaryInfoRenderer.metadataRowContainer
          ).metadataRowContainerRenderer.rows;
          for (let a of e)
            if (a.metadataRowRenderer) {
              let e = l(a.metadataRowRenderer.title).toLowerCase(),
                i = a.metadataRowRenderer.contents[0];
              t[e] = l(i);
              let r = i.runs;
              r &&
                r[0].navigationEndpoint &&
                (t[e + "_url"] = new URL(
                  r[0].navigationEndpoint.commandMetadata.webCommandMetadata.url,
                  n
                ).toString()),
                e in o &&
                  ((t.category = o[e].name), (t.category_url = o[e].url));
            } else if (a.richMetadataRowRenderer) {
              let e = a.richMetadataRowRenderer.contents,
                i = e.filter(
                  (e) =>
                    "RICH_METADATA_RENDERER_STYLE_BOX_ART" ===
                    e.richMetadataRenderer.style
                );
              for (let { richMetadataRenderer: e } of i) {
                let a = e;
                t.year = l(a.subtitle);
                let i = l(a.callToAction).split(" ")[1];
                (t[i] = l(a.title)),
                  (t[i + "_url"] = new URL(
                    a.endpoint.commandMetadata.webCommandMetadata.url,
                    n
                  ).toString()),
                  (t.thumbnails = a.thumbnail.thumbnails);
              }
              let r = e.filter(
                (e) =>
                  "RICH_METADATA_RENDERER_STYLE_TOPIC" ===
                  e.richMetadataRenderer.style
              );
              for (let { richMetadataRenderer: e } of r) {
                let a = e;
                (t.category = l(a.title)),
                  (t.category_url = new URL(
                    a.endpoint.commandMetadata.webCommandMetadata.url,
                    n
                  ).toString());
              }
            }
        } catch (e) {}
        return t;
      };
      const c = (e) =>
        !(!e || !e.find((e) => "Verified" === e.metadataBadgeRenderer.tooltip));
      t.getAuthor = (e) => {
        let t,
          a,
          r = [],
          s = !1;
        try {
          let o =
            e.response.contents.twoColumnWatchNextResults.results.results.contents.find(
              (e) =>
                e.videoSecondaryInfoRenderer &&
                e.videoSecondaryInfoRenderer.owner &&
                e.videoSecondaryInfoRenderer.owner.videoOwnerRenderer
            ).videoSecondaryInfoRenderer.owner.videoOwnerRenderer;
          (t = o.navigationEndpoint.browseEndpoint.browseId),
            (r = o.thumbnail.thumbnails.map(
              (e) => ((e.url = new URL(e.url, n).toString()), e)
            )),
            (a = i.parseAbbreviatedNumber(l(o.subscriberCountText))),
            (s = c(o.badges));
        } catch (e) {}
        try {
          let o =
              e.player_response.microformat &&
              e.player_response.microformat.playerMicroformatRenderer,
            l =
              (o && o.channelId) ||
              t ||
              e.player_response.videoDetails.channelId,
            c = {
              id: l,
              name: o
                ? o.ownerChannelName
                : e.player_response.videoDetails.author,
              user: o ? o.ownerProfileUrl.split("/").slice(-1)[0] : null,
              channel_url: "https://www.youtube.com/channel/" + l,
              external_channel_url: o
                ? "https://www.youtube.com/channel/" + o.externalChannelId
                : "",
              user_url: o ? new URL(o.ownerProfileUrl, n).toString() : "",
              thumbnails: r,
              verified: s,
              subscriber_count: a,
            };
          return (
            r.length &&
              i.deprecate(
                c,
                "avatar",
                c.thumbnails[0].url,
                "author.avatar",
                "author.thumbnails[0].url"
              ),
            c
          );
        } catch (e) {
          return {};
        }
      };
      const u = (e, t) => {
        if (e)
          try {
            let a = l(e.viewCountText),
              r = l(e.shortViewCountText),
              o = t.find((t) => t.id === e.videoId);
            /^\d/.test(r) || (r = (o && o.short_view_count_text) || ""),
              (a = (/^\d/.test(a) ? a : r).split(" ")[0]);
            let u = e.shortBylineText.runs[0].navigationEndpoint.browseEndpoint,
              d = u.browseId,
              p = l(e.shortBylineText),
              h = (u.canonicalBaseUrl || "").split("/").slice(-1)[0],
              m = {
                id: e.videoId,
                title: l(e.title),
                published: l(e.publishedTimeText),
                author: {
                  id: d,
                  name: p,
                  user: h,
                  channel_url: "https://www.youtube.com/channel/" + d,
                  user_url: "https://www.youtube.com/user/" + h,
                  thumbnails: e.channelThumbnail.thumbnails.map(
                    (e) => ((e.url = new URL(e.url, n).toString()), e)
                  ),
                  verified: c(e.ownerBadges),
                  [Symbol.toPrimitive]: () => (
                    console.warn(
                      "`relatedVideo.author` will be removed in a near future release, use `relatedVideo.author.name` instead."
                    ),
                    m.author.name
                  ),
                },
                short_view_count_text: r.split(" ")[0],
                view_count: a.replace(/,/g, ""),
                length_seconds: e.lengthText
                  ? Math.floor(s(l(e.lengthText)) / 1e3)
                  : t && "" + t.length_seconds,
                thumbnails: e.thumbnail.thumbnails,
                richThumbnails: e.richThumbnail
                  ? e.richThumbnail.movingThumbnailRenderer
                      .movingThumbnailDetails.thumbnails
                  : [],
                isLive: !(
                  !e.badges ||
                  !e.badges.find(
                    (e) => "LIVE NOW" === e.metadataBadgeRenderer.label
                  )
                ),
              };
            return (
              i.deprecate(
                m,
                "author_thumbnail",
                m.author.thumbnails[0].url,
                "relatedVideo.author_thumbnail",
                "relatedVideo.author.thumbnails[0].url"
              ),
              i.deprecate(
                m,
                "ucid",
                m.author.id,
                "relatedVideo.ucid",
                "relatedVideo.author.id"
              ),
              i.deprecate(
                m,
                "video_thumbnail",
                m.thumbnails[0].url,
                "relatedVideo.video_thumbnail",
                "relatedVideo.thumbnails[0].url"
              ),
              m
            );
          } catch (e) {}
      };
      (t.getRelatedVideos = (e) => {
        let t = [],
          a = [];
        try {
          t = e.response.webWatchNextResponseExtensionData.relatedVideoArgs
            .split(",")
            .map((e) => r.parse(e));
        } catch (e) {}
        try {
          a =
            e.response.contents.twoColumnWatchNextResults.secondaryResults
              .secondaryResults.results;
        } catch (e) {
          return [];
        }
        let i = [];
        for (let e of a || []) {
          let a = e.compactVideoRenderer;
          if (a) {
            let e = u(a, t);
            e && i.push(e);
          } else {
            let a = e.compactAutoplayRenderer || e.itemSectionRenderer;
            if (!a || !Array.isArray(a.contents)) continue;
            for (let e of a.contents) {
              let a = u(e.compactVideoRenderer, t);
              a && i.push(a);
            }
          }
        }
        return i;
      }),
        (t.getLikes = (e) => {
          try {
            let t =
              e.response.contents.twoColumnWatchNextResults.results.results.contents
                .find((e) => e.videoPrimaryInfoRenderer)
                .videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons.find(
                  (e) =>
                    e.toggleButtonRenderer &&
                    "LIKE" === e.toggleButtonRenderer.defaultIcon.iconType
                );
            return parseInt(
              t.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(
                /\D+/g,
                ""
              )
            );
          } catch (e) {
            return null;
          }
        }),
        (t.getDislikes = (e) => {
          try {
            let t =
              e.response.contents.twoColumnWatchNextResults.results.results.contents
                .find((e) => e.videoPrimaryInfoRenderer)
                .videoPrimaryInfoRenderer.videoActions.menuRenderer.topLevelButtons.find(
                  (e) =>
                    e.toggleButtonRenderer &&
                    "DISLIKE" === e.toggleButtonRenderer.defaultIcon.iconType
                );
            return parseInt(
              t.toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(
                /\D+/g,
                ""
              )
            );
          } catch (e) {
            return null;
          }
        }),
        (t.cleanVideoDetails = (e, t) => (
          (e.thumbnails = e.thumbnail.thumbnails),
          delete e.thumbnail,
          i.deprecate(
            e,
            "thumbnail",
            { thumbnails: e.thumbnails },
            "videoDetails.thumbnail.thumbnails",
            "videoDetails.thumbnails"
          ),
          (e.description = e.shortDescription || l(e.description)),
          delete e.shortDescription,
          i.deprecate(
            e,
            "shortDescription",
            e.description,
            "videoDetails.shortDescription",
            "videoDetails.description"
          ),
          (e.lengthSeconds =
            (t.player_response.microformat &&
              t.player_response.microformat.playerMicroformatRenderer
                .lengthSeconds) ||
            t.player_response.videoDetails.lengthSeconds),
          e
        )),
        (t.getStoryboards = (e) => {
          const t =
            e.player_response.storyboards &&
            e.player_response.storyboards.playerStoryboardSpecRenderer &&
            e.player_response.storyboards.playerStoryboardSpecRenderer.spec &&
            e.player_response.storyboards.playerStoryboardSpecRenderer.spec.split(
              "|"
            );
          if (!t) return [];
          const a = new URL(t.shift());
          return t.map((e, t) => {
            let [i, r, s, n, o, l, c, u] = e.split("#");
            a.searchParams.set("sigh", u),
              (s = parseInt(s, 10)),
              (n = parseInt(n, 10)),
              (o = parseInt(o, 10));
            const d = Math.ceil(s / (n * o));
            return {
              templateUrl: a.toString().replace("$L", t).replace("$N", c),
              thumbnailWidth: parseInt(i, 10),
              thumbnailHeight: parseInt(r, 10),
              thumbnailCount: s,
              interval: parseInt(l, 10),
              columns: n,
              rows: o,
              storyboardCount: d,
            };
          });
        }),
        (t.getChapters = (e) => {
          const t =
              e.response &&
              e.response.playerOverlays &&
              e.response.playerOverlays.playerOverlayRenderer,
            a =
              t &&
              t.decoratedPlayerBarRenderer &&
              t.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer &&
              t.decoratedPlayerBarRenderer.decoratedPlayerBarRenderer.playerBar,
            i =
              a &&
              a.multiMarkersPlayerBarRenderer &&
              a.multiMarkersPlayerBarRenderer.markersMap,
            r =
              Array.isArray(i) &&
              i.find((e) => e.value && Array.isArray(e.value.chapters));
          if (!r) return [];
          return r.value.chapters.map((e) => ({
            title: l(e.chapterRenderer.title),
            start_time: e.chapterRenderer.timeRangeStartMillis / 1e3,
          }));
        });
    },
    function (e, t, a) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      const i = a(0);
      class r extends i.Writable {
        constructor() {
          super(),
            (this._lastLine = ""),
            (this._seq = 0),
            (this._nextItemDuration = null),
            (this._nextItemRange = null),
            (this._lastItemRangeEnd = 0),
            this.on("finish", () => {
              this._parseLine(this._lastLine), this.emit("end");
            });
        }
        _parseAttrList(e) {
          let t,
            a = {},
            i = /([A-Z0-9-]+)=(?:"([^"]*?)"|([^,]*?))/g;
          for (; null !== (t = i.exec(e)); ) a[t[1]] = t[2] || t[3];
          return a;
        }
        _parseRange(e) {
          if (!e) return null;
          let t = e.split("@"),
            a = t[1] ? parseInt(t[1]) : this._lastItemRangeEnd + 1,
            i = { start: a, end: a + parseInt(t[0]) - 1 };
          return (this._lastItemRangeEnd = i.end), i;
        }
        _parseLine(e) {
          let t = e.match(/^#(EXT[A-Z0-9-]+)(?::(.*))?/);
          if (t) {
            const e = t[1],
              a = t[2] || "";
            switch (e) {
              case "EXT-X-PROGRAM-DATE-TIME":
                this.emit("starttime", new Date(a).getTime());
                break;
              case "EXT-X-MEDIA-SEQUENCE":
                this._seq = parseInt(a);
                break;
              case "EXT-X-MAP": {
                let e = this._parseAttrList(a);
                if (!e.URI)
                  return void this.destroy(
                    new Error(
                      "`EXT-X-MAP` found without required attribute `URI`"
                    )
                  );
                this.emit("item", {
                  url: e.URI,
                  seq: this._seq,
                  init: !0,
                  duration: 0,
                  range: this._parseRange(e.BYTERANGE),
                });
                break;
              }
              case "EXT-X-BYTERANGE":
                this._nextItemRange = this._parseRange(a);
                break;
              case "EXTINF":
                this._nextItemDuration = Math.round(
                  1e3 * parseFloat(a.split(",")[0])
                );
                break;
              case "EXT-X-ENDLIST":
                this.emit("endlist");
            }
          } else
            !/^#/.test(e) &&
              e.trim() &&
              (this.emit("item", {
                url: e.trim(),
                seq: this._seq++,
                duration: this._nextItemDuration,
                range: this._nextItemRange,
              }),
              (this._nextItemRange = null));
        }
        _write(e, t, a) {
          let i = e.toString("utf8").split("\n");
          this._lastLine && (i[0] = this._lastLine + i[0]),
            i.forEach((e, t) => {
              this.destroyed ||
                (t < i.length - 1 ? this._parseLine(e) : (this._lastLine = e));
            }),
            a();
        }
      }
      t.default = r;
    },
    function (e, t, a) {
      "use strict";
      var i =
        (this && this.__importDefault) ||
        function (e) {
          return e && e.__esModule ? e : { default: e };
        };
      Object.defineProperty(t, "__esModule", { value: !0 });
      const r = a(0),
        s = i(a(5)),
        n = a(10);
      class o extends r.Writable {
        constructor(e) {
          let t;
          super(),
            (this._parser = s.default.createStream(!1, { lowercase: !0 })),
            this._parser.on("error", this.destroy.bind(this));
          let a,
            i,
            r,
            o,
            l,
            c,
            u,
            d,
            p = 0,
            h = 0,
            m = [],
            b = !1,
            f = !1;
          const y = (t) => {
            const a = { RepresentationID: e, Number: h, Time: p };
            return t.replace(/\$(\w+)\$/g, (e, t) => "" + a[t]);
          };
          this._parser.on("opentag", (s) => {
            switch (s.name) {
              case "mpd":
                (p = s.attributes.availabilitystarttime
                  ? new Date(s.attributes.availabilitystarttime).getTime()
                  : 0),
                  (c = "dynamic" !== s.attributes.type);
                break;
              case "period":
                (h = 0),
                  (i = 1e3),
                  (o = 0),
                  (r = 0),
                  (l = []),
                  (u = 0),
                  (d = n.durationStr(s.attributes.start) || 0);
                break;
              case "segmentlist":
                (h = parseInt(s.attributes.startnumber) || h),
                  (i = parseInt(s.attributes.timescale) || i),
                  (o = parseInt(s.attributes.duration) || o),
                  (r = parseInt(s.attributes.presentationtimeoffset) || r);
                break;
              case "segmenttemplate":
                (a = s.attributes),
                  (h = parseInt(s.attributes.startnumber) || h),
                  (i = parseInt(s.attributes.timescale) || i);
                break;
              case "segmenttimeline":
              case "baseurl":
                t = s.name;
                break;
              case "s":
                m.push({
                  duration: parseInt(s.attributes.d),
                  repeat: parseInt(s.attributes.r),
                  time: parseInt(s.attributes.t),
                });
                break;
              case "adaptationset":
              case "representation":
                u++,
                  e || (e = s.attributes.id),
                  (b = s.attributes.id === "" + e),
                  b &&
                    (d && (p += d),
                    r && (p -= (r / i) * 1e3),
                    this.emit("starttime", p));
                break;
              case "initialization":
                b &&
                  this.emit("item", {
                    url: l.filter((e) => !!e).join("") + s.attributes.sourceurl,
                    seq: h,
                    init: !0,
                    duration: 0,
                  });
                break;
              case "segmenturl":
                if (b) {
                  f = !0;
                  let e = m.shift(),
                    t = (((null == e ? void 0 : e.duration) || o) / i) * 1e3;
                  this.emit("item", {
                    url: l.filter((e) => !!e).join("") + s.attributes.media,
                    seq: h++,
                    duration: t,
                  }),
                    (p += t);
                }
            }
          });
          const g = () => {
            c && this.emit("endlist"),
              b
                ? this.emit("end")
                : this.destroy(Error(`Representation '${e}' not found`));
          };
          this._parser.on("closetag", (e) => {
            switch (e) {
              case "adaptationset":
              case "representation":
                if ((u--, a && m.length)) {
                  (f = !0),
                    a.initialization &&
                      this.emit("item", {
                        url:
                          l.filter((e) => !!e).join("") + y(a.initialization),
                        seq: h,
                        init: !0,
                        duration: 0,
                      });
                  for (let { duration: e, repeat: t, time: r } of m) {
                    (e = (e / i) * 1e3), (t = t || 1), (p = r || p);
                    for (let i = 0; i < t; i++)
                      this.emit("item", {
                        url: l.filter((e) => !!e).join("") + y(a.media),
                        seq: h++,
                        duration: e,
                      }),
                        (p += e);
                  }
                }
                f &&
                  (this.emit("endearly"),
                  g(),
                  this._parser.removeAllListeners(),
                  this.removeAllListeners("finish"));
            }
          }),
            this._parser.on("text", (e) => {
              "baseurl" === t && ((l[u] = e), (t = null));
            }),
            this.on("finish", g);
        }
        _write(e, t, a) {
          this._parser.write(e, t), a();
        }
      }
      t.default = o;
    },
    function (e, t, a) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }), (t.Queue = void 0);
      t.Queue = class {
        constructor(e, t = {}) {
          (this._worker = e),
            (this._concurrency = t.concurrency || 1),
            (this.tasks = []),
            (this.total = 0),
            (this.active = 0);
        }
        push(e, t) {
          this.tasks.push({ item: e, callback: t }), this.total++, this._next();
        }
        _next() {
          if (this.active >= this._concurrency || !this.tasks.length) return;
          const { item: e, callback: t } = this.tasks.shift();
          let a = !1;
          this.active++,
            this._worker(e, (e, i) => {
              a ||
                (this.active--, (a = !0), null == t || t(e, i), this._next());
            });
        }
        die() {
          this.tasks = [];
        }
      };
    },
    function (e, t) {
      e.exports = require("vm");
    },
  ]);
});
