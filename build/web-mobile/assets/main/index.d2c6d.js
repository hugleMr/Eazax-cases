window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  ArrayUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a42aehq7N9EZ6copkvQ26I3", "ArrayUtil");
    "use strict";
    var __spreadArrays = this && this.__spreadArrays || function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
      k++) r[k] = a[j];
      return r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ArrayUtil = function() {
      function ArrayUtil() {}
      ArrayUtil.copy2DArray = function(array) {
        var newArray = [];
        for (var i = 0; i < array.length; i++) newArray.push(array[i].concat());
        return newArray;
      };
      ArrayUtil.fisherYatesShuffle = function(array) {
        var count = array.length;
        while (count) {
          var index = Math.floor(Math.random() * count--);
          var temp = array[count];
          array[count] = array[index];
          array[index] = temp;
        }
        return array;
      };
      ArrayUtil.confound = function(array) {
        var result = array.slice().sort(function() {
          return Math.random() - .5;
        });
        return result;
      };
      ArrayUtil.flattening = function(array) {
        for (;array.some(function(v) {
          return Array.isArray(v);
        }); ) array = [].concat.apply([], array);
        return array;
      };
      ArrayUtil.combineArrays = function(array1, array2) {
        var newArray = __spreadArrays(array1, array2);
        return newArray;
      };
      ArrayUtil.getRandomValueInArray = function(array) {
        var newArray = array[Math.floor(Math.random() * array.length)];
        return newArray;
      };
      return ArrayUtil;
    }();
    exports.default = ArrayUtil;
    cc._RF.pop();
  }, {} ],
  AudioPlayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9e98eCtw8tCR6UAJkWYfNjd", "AudioPlayer");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var AudioPlayer = function() {
      function AudioPlayer() {}
      Object.defineProperty(AudioPlayer, "masterVolume", {
        get: function() {
          return this._masterVolume;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioPlayer, "musicVolume", {
        get: function() {
          return this._musicVolume;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AudioPlayer, "effectVolume", {
        get: function() {
          return this._effectVolume;
        },
        enumerable: false,
        configurable: true
      });
      AudioPlayer.setMasterVolume = function(value) {
        value < 0 ? value = 0 : value > 1 && (value = 1);
        this._masterVolume = value;
        this.setMusicVolume(this._musicVolume);
        this.setEffectVolume(this._effectVolume);
      };
      AudioPlayer.setVolume = function(value) {
        this.setMusicVolume(value);
        this.setEffectVolume(value);
      };
      AudioPlayer.setMusicVolume = function(value) {
        value < 0 ? value = 0 : value > 1 && (value = 1);
        this._musicVolume = value;
        var realVolume = this._masterVolume * value;
        this._music.forEach(function(id, clip) {
          return cc.audioEngine.setVolume(id, realVolume);
        });
      };
      AudioPlayer.setEffectVolume = function(value) {
        value < 0 ? value = 0 : value > 1 && (value = 1);
        this._effectVolume = value;
        var realVolume = this._masterVolume * value;
        this._effect.forEach(function(clip, id) {
          return cc.audioEngine.setVolume(id, realVolume);
        });
      };
      AudioPlayer.playMusic = function(clip) {
        this._music.has(clip) && this.stopMusic(clip);
        var id = cc.audioEngine.play(clip, true, this._masterVolume * this._musicVolume);
        this._music.set(clip, id);
      };
      AudioPlayer.stopMusic = function(clip) {
        if (!this._music.has(clip)) return;
        cc.audioEngine.stop(this._music.get(clip));
        this._music.delete(clip);
      };
      AudioPlayer.stopAllMusic = function() {
        var _this = this;
        this._music.forEach(function(id, clip) {
          return _this.stopMusic(clip);
        });
      };
      AudioPlayer.pauseMusic = function(clip) {
        if (!this._music.has(clip)) return;
        cc.audioEngine.pause(this._music.get(clip));
      };
      AudioPlayer.pauseAllMusic = function() {
        var _this = this;
        this._music.forEach(function(id, clip) {
          return _this.pauseMusic(clip);
        });
      };
      AudioPlayer.resumeMusic = function(clip) {
        if (!this._music.has(clip)) return;
        cc.audioEngine.resume(this._music.get(clip));
      };
      AudioPlayer.resumeAllMusic = function() {
        var _this = this;
        this._music.forEach(function(id, clip) {
          return _this.resumeMusic(clip);
        });
      };
      AudioPlayer.playEffect = function(clip, loop) {
        var _this = this;
        var id = cc.audioEngine.play(clip, loop, this._masterVolume * this._effectVolume);
        this._effect.set(id, clip);
        loop || cc.audioEngine.setFinishCallback(id, function() {
          return _this._effect.delete(id);
        });
      };
      AudioPlayer.stopEffect = function(clip) {
        var _this = this;
        this._effect.forEach(function(_clip, id) {
          if (_clip === clip) {
            cc.audioEngine.stop(id);
            _this._effect.delete(id);
          }
        });
      };
      AudioPlayer.stopAllEffect = function() {
        var _this = this;
        this._effect.forEach(function(clip, id) {
          cc.audioEngine.stop(id);
          _this._effect.delete(id);
        });
      };
      AudioPlayer.pauseEffect = function(clip) {
        this._effect.forEach(function(_clip, id) {
          return _clip === clip && cc.audioEngine.pause(id);
        });
      };
      AudioPlayer.pauseAllEffect = function() {
        this._effect.forEach(function(clip, id) {
          return cc.audioEngine.pause(id);
        });
      };
      AudioPlayer.resumeEffect = function(clip) {
        this._effect.forEach(function(_clip, id) {
          return _clip === clip && cc.audioEngine.resume(id);
        });
      };
      AudioPlayer.resumeAllEffect = function() {
        this._effect.forEach(function(clip, id) {
          return cc.audioEngine.resume(id);
        });
      };
      AudioPlayer.stopAll = function() {
        this.stopAllMusic();
        this.stopAllEffect();
      };
      AudioPlayer.pauseAll = function() {
        this.pauseAllMusic();
        this.pauseAllEffect();
      };
      AudioPlayer.resumeAll = function() {
        this.resumeAllMusic();
        this.resumeAllEffect();
      };
      AudioPlayer.mute = function() {
        this.setMasterVolume(0);
      };
      AudioPlayer._music = new Map();
      AudioPlayer._effect = new Map();
      AudioPlayer._masterVolume = 1;
      AudioPlayer._musicVolume = 1;
      AudioPlayer._effectVolume = 1;
      return AudioPlayer;
    }();
    exports.default = AudioPlayer;
    cc._RF.pop();
  }, {} ],
  BackgroundFitter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ec242ucTw5L6IDu4ClT+6Wt", "BackgroundFitter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../core/EventManager");
    var Events_1 = require("../constants/Events");
    var ccclass = cc._decorator.ccclass;
    var BackgroundFitter = function(_super) {
      __extends(BackgroundFitter, _super);
      function BackgroundFitter() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      BackgroundFitter.prototype.onLoad = function() {
        EventManager_1.default.on(Events_1.VIEW_RESIZE, this.adapt, this);
      };
      BackgroundFitter.prototype.start = function() {
        this.adapt();
      };
      BackgroundFitter.prototype.onDestroy = function() {
        EventManager_1.default.off(Events_1.VIEW_RESIZE, this.adapt, this);
      };
      BackgroundFitter.prototype.adapt = function() {
        var screenRatio = cc.winSize.height / cc.winSize.width;
        var designRatio = cc.Canvas.instance.designResolution.height / cc.Canvas.instance.designResolution.width;
        if (screenRatio >= designRatio) {
          var scale = cc.winSize.height / cc.Canvas.instance.designResolution.height;
          this.node.scale = scale;
        } else {
          var scale = cc.winSize.width / cc.Canvas.instance.designResolution.width;
          this.node.scale = scale;
        }
      };
      BackgroundFitter = __decorate([ ccclass ], BackgroundFitter);
      return BackgroundFitter;
    }(cc.Component);
    exports.default = BackgroundFitter;
    cc._RF.pop();
  }, {
    "../constants/Events": "Events",
    "../core/EventManager": "EventManager"
  } ],
  BounceMoveTween: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19e64eCR8JPnLwuwQn0STQe", "BounceMoveTween");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BounceMoveTween = function(_super) {
      __extends(BounceMoveTween, _super);
      function BounceMoveTween() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.frequency = 4;
        _this.decay = 2;
        _this.tween = null;
        return _this;
      }
      BounceMoveTween.prototype.start = function() {
        this.play(cc.v2(0, 0), .5);
      };
      BounceMoveTween.prototype.play = function(targetPos, time) {
        var _this = this;
        this.stop();
        var curPos = this.node.getPosition();
        var direction = targetPos.sub(curPos).normalize();
        var bouncingTime = .75;
        var amplitude = cc.Vec2.distance(curPos, targetPos) / time;
        this.tween = cc.tween(this.node);
        cc.tween(this.node).to(time, {
          x: targetPos.x,
          y: targetPos.y
        }, {
          easing: "quadIn"
        }).to(bouncingTime, {
          position: {
            value: cc.v3(targetPos.x, targetPos.y),
            progress: function(start, end, current, t) {
              var pos = direction.mul(-_this.getDifference(amplitude, t));
              return cc.v3(pos.x, pos.y);
            }
          }
        }).start();
      };
      BounceMoveTween.prototype.stop = function() {
        this.tween && this.tween.stop();
      };
      BounceMoveTween.prototype.getDifference = function(amplitude, time) {
        var angularVelocity = this.frequency * Math.PI * 2;
        return amplitude * (Math.sin(time * angularVelocity) / Math.exp(this.decay * time) / angularVelocity);
      };
      __decorate([ property({
        tooltip: false
      }) ], BounceMoveTween.prototype, "frequency", void 0);
      __decorate([ property({
        tooltip: false
      }) ], BounceMoveTween.prototype, "decay", void 0);
      BounceMoveTween = __decorate([ ccclass ], BounceMoveTween);
      return BounceMoveTween;
    }(cc.Component);
    exports.default = BounceMoveTween;
    cc._RF.pop();
  }, {} ],
  BounceScaleTween: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c48a1EQlO9DfJW0g1STpi3T", "BounceScaleTween");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BounceScaleTween = function(_super) {
      __extends(BounceScaleTween, _super);
      function BounceScaleTween() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.frequency = 4;
        _this.decay = 2;
        _this.targetScale = 1;
        _this.totalTime = 1;
        _this.interval = 1;
        _this.playOnLoad = false;
        _this.originalScale = 1;
        _this.tween = null;
        return _this;
      }
      BounceScaleTween.prototype.start = function() {
        this.originalScale = this.node.scale;
        this.playOnLoad && this.play(this.targetScale);
      };
      BounceScaleTween.prototype.play = function(targetScale, repeatTimes) {
        var _this = this;
        var times = void 0 != repeatTimes && repeatTimes > 0 ? repeatTimes : 1;
        var scalingTime = .25 * this.totalTime;
        var bouncingTime = .75 * this.totalTime;
        var amplitude = (targetScale - this.originalScale) / scalingTime;
        this.tween = cc.tween(this.node).repeat(times, cc.tween().set({
          scale: this.originalScale
        }).to(scalingTime, {
          scale: targetScale
        }).to(bouncingTime, {
          scale: {
            value: targetScale,
            progress: function(start, end, current, t) {
              return end + _this.getDifference(amplitude, t);
            }
          }
        }).delay(this.interval)).start();
      };
      BounceScaleTween.prototype.stop = function() {
        this.tween && this.tween.stop();
        this.node.setScale(this.originalScale);
      };
      BounceScaleTween.prototype.getDifference = function(amplitude, time) {
        var angularVelocity = this.frequency * Math.PI * 2;
        return amplitude * (Math.sin(time * angularVelocity) / Math.exp(this.decay * time) / angularVelocity);
      };
      __decorate([ property({
        tooltip: false
      }) ], BounceScaleTween.prototype, "frequency", void 0);
      __decorate([ property({
        tooltip: false
      }) ], BounceScaleTween.prototype, "decay", void 0);
      __decorate([ property({
        tooltip: false
      }) ], BounceScaleTween.prototype, "targetScale", void 0);
      __decorate([ property({
        tooltip: false
      }) ], BounceScaleTween.prototype, "totalTime", void 0);
      __decorate([ property({
        tooltip: false
      }) ], BounceScaleTween.prototype, "interval", void 0);
      __decorate([ property({
        tooltip: false
      }) ], BounceScaleTween.prototype, "playOnLoad", void 0);
      BounceScaleTween = __decorate([ ccclass ], BounceScaleTween);
      return BounceScaleTween;
    }(cc.Component);
    exports.default = BounceScaleTween;
    cc._RF.pop();
  }, {} ],
  BrowserUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "99b90Y8x6RIuZWoY3b1nJuc", "BrowserUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BrowserUtil = function() {
      function BrowserUtil() {}
      BrowserUtil.clearUrlParam = function() {
        if (!window || !window.history) return;
        window.history.replaceState({}, null, ".");
      };
      BrowserUtil.setUrlParam = function(param) {
        if (!window || !window.history) return;
        window.history.replaceState({}, null, "?" + param);
      };
      BrowserUtil.getUrlParam = function(key) {
        if (!window || !window.location) return;
        var query = window.location.search.replace("?", "");
        if ("" === query) return null;
        var keyValues = query.split("&");
        for (var i = 0; i < keyValues.length; i++) {
          var strings = keyValues[i].split("=");
          if (decodeURIComponent(strings[0]) === key) return decodeURIComponent(strings[1]);
        }
        return null;
      };
      BrowserUtil.copy = function(value) {
        if (!document) return false;
        var element = document.createElement("textarea");
        element.readOnly = true;
        element.style.opacity = "0";
        element.value = value;
        document.body.appendChild(element);
        element.select();
        var range = document.createRange();
        range.selectNodeContents(element);
        var selection = getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        var result = document.execCommand("copy");
        element.remove();
        return result;
      };
      return BrowserUtil;
    }();
    exports.default = BrowserUtil;
    cc._RF.pop();
  }, {} ],
  Case_FlipCard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3cf8arMOblOeL4UxCUU8QcT", "Case_FlipCard");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TweenUtil_1 = require("../../../../eazax-ccc/utils/TweenUtil");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Case_FlipCard = function(_super) {
      __extends(Case_FlipCard, _super);
      function Case_FlipCard() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.card = null;
        _this.flipBtn = null;
        _this.button = null;
        _this.frontColor = cc.Color.BLUE;
        _this.backColor = cc.Color.RED;
        return _this;
      }
      Case_FlipCard.prototype.onLoad = function() {
        this.init();
        this.registerEvent();
      };
      Case_FlipCard.prototype.start = function() {
        this.reset();
      };
      Case_FlipCard.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      Case_FlipCard.prototype.registerEvent = function() {
        this.flipBtn.on(cc.Node.EventType.TOUCH_END, this.onFlipBtnClick, this);
      };
      Case_FlipCard.prototype.unregisterEvent = function() {
        this.flipBtn.targetOff(this);
      };
      Case_FlipCard.prototype.init = function() {
        this.button = this.flipBtn.getComponent(cc.Button) || this.flipBtn.addComponent(cc.Button);
      };
      Case_FlipCard.prototype.reset = function() {
        this.card.color = this.frontColor;
        this.setButtonState(true);
      };
      Case_FlipCard.prototype.onFlipBtnClick = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              if (!this.button.interactable) return [ 2 ];
              this.setButtonState(false);
              return [ 4, TweenUtil_1.default.flip(this.card, 1, function() {
                _this.card.color.equals(_this.frontColor) ? _this.card.color = _this.backColor : _this.card.color = _this.frontColor;
              }) ];

             case 1:
              _a.sent();
              this.setButtonState(true);
              return [ 2 ];
            }
          });
        });
      };
      Case_FlipCard.prototype.setButtonState = function(interactable) {
        this.button.interactable = interactable;
        this.flipBtn.color = interactable ? cc.Color.WHITE : cc.Color.GRAY;
      };
      __decorate([ property(cc.Node) ], Case_FlipCard.prototype, "card", void 0);
      __decorate([ property(cc.Node) ], Case_FlipCard.prototype, "flipBtn", void 0);
      Case_FlipCard = __decorate([ ccclass ], Case_FlipCard);
      return Case_FlipCard;
    }(cc.Component);
    exports.default = Case_FlipCard;
    cc._RF.pop();
  }, {
    "../../../../eazax-ccc/utils/TweenUtil": "TweenUtil"
  } ],
  ClickToLoadUrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ea72dfs9ulL86r9WCWSk1ts", "ClickToLoadUrl");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ClickToLoadUrl = function(_super) {
      __extends(ClickToLoadUrl, _super);
      function ClickToLoadUrl() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.url = "https://gitee.com/ifaswind/eazax-ccc";
        _this.openInNewTap = true;
        return _this;
      }
      ClickToLoadUrl.prototype.onLoad = function() {
        this.registerEvent();
      };
      ClickToLoadUrl.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      ClickToLoadUrl.prototype.registerEvent = function() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
      };
      ClickToLoadUrl.prototype.unregisterEvent = function() {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
      };
      ClickToLoadUrl.prototype.onClick = function() {
        this.openInNewTap ? window.open(this.url) : window.location.href = this.url;
      };
      __decorate([ property({
        multiline: true
      }) ], ClickToLoadUrl.prototype, "url", void 0);
      __decorate([ property() ], ClickToLoadUrl.prototype, "openInNewTap", void 0);
      ClickToLoadUrl = __decorate([ ccclass ], ClickToLoadUrl);
      return ClickToLoadUrl;
    }(cc.Component);
    exports.default = ClickToLoadUrl;
    cc._RF.pop();
  }, {} ],
  ClickToShowResPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4eefcThCNNIv7Hni6oMtecW", "ClickToShowResPopup");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupManager_1 = require("../../eazax-ccc/core/PopupManager");
    var ResPopup_1 = require("./popups/resPopup/ResPopup");
    var ResPopupItemInfo_1 = require("./popups/resPopup/ResPopupItemInfo");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ClickToShowResPopup = function(_super) {
      __extends(ClickToShowResPopup, _super);
      function ClickToShowResPopup() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.items = [];
        return _this;
      }
      ClickToShowResPopup.prototype.onLoad = function() {
        this.registerEvent();
      };
      ClickToShowResPopup.prototype.registerEvent = function() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
      };
      ClickToShowResPopup.prototype.onClick = function() {
        var options = {
          items: []
        };
        for (var i = 0; i < this.items.length; i++) options.items.push({
          name: this.items[i].title,
          url: this.items[i].url
        });
        PopupManager_1.default.show(ResPopup_1.default.path, options, PopupManager_1.PopupCacheMode.Frequent);
      };
      __decorate([ property({
        type: [ ResPopupItemInfo_1.default ]
      }) ], ClickToShowResPopup.prototype, "items", void 0);
      ClickToShowResPopup = __decorate([ ccclass ], ClickToShowResPopup);
      return ClickToShowResPopup;
    }(cc.Component);
    exports.default = ClickToShowResPopup;
    cc._RF.pop();
  }, {
    "../../eazax-ccc/core/PopupManager": "PopupManager",
    "./popups/resPopup/ResPopup": "ResPopup",
    "./popups/resPopup/ResPopupItemInfo": "ResPopupItemInfo"
  } ],
  ConfirmPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a300P3mKpFN6kATTIgk3Hw", "ConfirmPopup");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("./PopupBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ConfirmPopup = function(_super) {
      __extends(ConfirmPopup, _super);
      function ConfirmPopup() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.titleLabel = null;
        _this.contentLabel = null;
        _this.confirmBtn = null;
        return _this;
      }
      ConfirmPopup.prototype.onLoad = function() {
        this.registerEvent();
      };
      ConfirmPopup.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      ConfirmPopup.prototype.registerEvent = function() {
        this.confirmBtn.on(cc.Node.EventType.TOUCH_END, this.onConfirmBtnClick, this);
      };
      ConfirmPopup.prototype.unregisterEvent = function() {
        this.confirmBtn.targetOff(this);
      };
      ConfirmPopup.prototype.init = function() {};
      ConfirmPopup.prototype.updateDisplay = function(options) {
        this.titleLabel.string = options.title;
        this.contentLabel.string = options.content;
      };
      ConfirmPopup.prototype.onConfirmBtnClick = function() {
        this.options.confirmCallback && this.options.confirmCallback();
        this.hide();
      };
      __decorate([ property(cc.Label) ], ConfirmPopup.prototype, "titleLabel", void 0);
      __decorate([ property(cc.Label) ], ConfirmPopup.prototype, "contentLabel", void 0);
      __decorate([ property(cc.Node) ], ConfirmPopup.prototype, "confirmBtn", void 0);
      ConfirmPopup = __decorate([ ccclass ], ConfirmPopup);
      return ConfirmPopup;
    }(PopupBase_1.default);
    exports.default = ConfirmPopup;
    cc._RF.pop();
  }, {
    "./PopupBase": "PopupBase"
  } ],
  Counter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "092af/2BZlPjY+nAg7SFRVb", "Counter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent;
    var Counter = function(_super) {
      __extends(Counter, _super);
      function Counter() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.time = 1;
        _this.keepInteger = true;
        _this.label = null;
        _this._value = 0;
        _this.tween = null;
        _this.lastTarget = 0;
        return _this;
      }
      Object.defineProperty(Counter.prototype, "value", {
        get: function() {
          return this._value;
        },
        set: function(value) {
          this.keepInteger && (value = Math.floor(value));
          this._value = value;
          this.label.string = value.toString();
        },
        enumerable: false,
        configurable: true
      });
      Counter.prototype.onLoad = function() {
        this.init();
      };
      Counter.prototype.init = function() {
        this.label = this.getComponent(cc.Label);
        this.value = 0;
      };
      Counter.prototype.setValue = function(value) {
        this.value = value;
      };
      Counter.prototype.setTime = function(time) {
        this.time = time;
      };
      Counter.prototype.to = function(target, time, callback) {
        var _this = this;
        void 0 === time && (time = null);
        return new Promise(function(res) {
          if (_this.tween) {
            _this.tween.stop();
            _this.tween = null;
          }
          null !== time && (_this.time = time);
          _this.lastTarget = target;
          _this.tween = cc.tween(_this).to(_this.time, {
            value: target
          }).call(function() {
            callback && callback();
            _this.tween = null;
            res();
          }).start();
        });
      };
      Counter.prototype.by = function(diff, time, callback) {
        var _this = this;
        void 0 === time && (time = null);
        return new Promise(function(res) {
          if (_this.tween) {
            _this.tween.stop();
            _this.tween = null;
            _this.value = _this.lastTarget;
          }
          null !== time && (_this.time = time);
          _this.lastTarget = _this.value + diff;
          _this.tween = cc.tween(_this).to(_this.time, {
            value: _this.lastTarget
          }).call(function() {
            callback && callback();
            _this.tween = null;
            res();
          }).start();
        });
      };
      __decorate([ property({
        tooltip: false
      }) ], Counter.prototype, "time", void 0);
      __decorate([ property({
        tooltip: false
      }) ], Counter.prototype, "keepInteger", void 0);
      Counter = __decorate([ ccclass, requireComponent(cc.Label) ], Counter);
      return Counter;
    }(cc.Component);
    exports.default = Counter;
    cc._RF.pop();
  }, {} ],
  CustomEngine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0fbd6KU9GlGg7xwHoqjOJg2", "CustomEngine");
    cc.view.enableAutoFullScreen(false);
    cc._RF.pop();
  }, {} ],
  CustomEvents: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "608c2JM+IBHT4tYbjMLBwr5", "CustomEvents");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SWITCH_PAGE = void 0;
    exports.SWITCH_PAGE = "switch-page";
    cc._RF.pop();
  }, {} ],
  DebugUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "443c0HZOJxHiadWuJBZmIbO", "DebugUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DebugUtil = function() {
      function DebugUtil() {}
      DebugUtil.log = function(title, msg) {
        msg ? console.log("%c " + title + " %c " + msg + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;") : console.log("%c " + title + " ", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
      };
      DebugUtil.showDynamicAtlas = function(status) {
        void 0 === status && (status = true);
        return cc.dynamicAtlasManager.showDebug(status);
      };
      DebugUtil.showStats = function(status) {
        void 0 === status && (status = true);
        cc.debug.setDisplayStats(status);
      };
      DebugUtil.setStatsColor = function(font, background) {
        void 0 === font && (font = cc.Color.WHITE);
        void 0 === background && (background = cc.color(0, 0, 0, 150));
        var profiler = cc.find("PROFILER-NODE");
        if (!profiler) return cc.warn("\u672a\u627e\u5230\u7edf\u8ba1\u9762\u677f\u8282\u70b9\uff01");
        profiler.children.forEach(function(node) {
          return node.color = font;
        });
        var node = profiler.getChildByName("BACKGROUND");
        if (!node) {
          node = new cc.Node("BACKGROUND");
          profiler.addChild(node, cc.macro.MIN_ZINDEX);
          node.setContentSize(profiler.getBoundingBoxToWorld());
          node.setPosition(0, 0);
        }
        var graphics = node.getComponent(cc.Graphics) || node.addComponent(cc.Graphics);
        graphics.clear();
        graphics.rect(-5, 12.5, node.width + 10, node.height - 10);
        graphics.fillColor = background;
        graphics.fill();
      };
      DebugUtil.getDrawCalls = function() {
        return cc.renderer.drawCalls;
      };
      return DebugUtil;
    }();
    exports.default = DebugUtil;
    window["eazax"] && (window["eazax"]["debug"] = DebugUtil);
    cc._RF.pop();
  }, {} ],
  DeviceUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a78caXjP+hHlK6eYe66xvL7", "DeviceUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var DeviceUtil = function() {
      function DeviceUtil() {}
      Object.defineProperty(DeviceUtil, "isAndroid", {
        get: function() {
          return cc.sys.platform === cc.sys.ANDROID;
        },
        enumerable: false,
        configurable: true
      });
      return DeviceUtil;
    }();
    exports.default = DeviceUtil;
    cc._RF.pop();
  }, {} ],
  EditorAsset: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d8a7dbrDZNCQ5X+Op8kS6VR", "EditorAsset");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EditorAsset = function() {
      function EditorAsset() {}
      EditorAsset.load = function(path, assetType, callback) {
        true;
        return cc.warn("[EditorAsset]", "\u8be5\u51fd\u6570\u53ea\u5728\u7f16\u8f91\u5668\u73af\u5883\u5185\u6709\u6548\uff01");
      };
      return EditorAsset;
    }();
    exports.default = EditorAsset;
    cc._RF.pop();
  }, {} ],
  EventManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7cf6diX//1L45BRBZxjpzab", "EventManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager = function() {
      function EventManager() {}
      EventManager.on = function(name, callback, target) {
        this.events.has(name) || this.events.set(name, []);
        this.events.get(name).push({
          callback: callback,
          target: target
        });
      };
      EventManager.once = function(name, callback, target) {
        this.onceEvents.has(name) || this.onceEvents.set(name, []);
        this.onceEvents.get(name).push({
          callback: callback,
          target: target
        });
      };
      EventManager.off = function(name, callback, target) {
        if (this.events.has(name)) {
          var subscriptions = this.events.get(name);
          for (var i = 0; i < subscriptions.length; i++) if (subscriptions[i].target === target && (subscriptions[i].callback === callback || subscriptions[i].callback.toString() === callback.toString())) {
            subscriptions.splice(i, 1);
            break;
          }
        }
        if (this.onceEvents.has(name)) {
          var subscriptions = this.onceEvents.get(name);
          for (var i = 0; i < subscriptions.length; i++) if (subscriptions[i].target === target && (subscriptions[i].callback === callback || subscriptions[i].callback.toString() === callback.toString())) {
            subscriptions.splice(i, 1);
            break;
          }
        }
      };
      EventManager.emit = function(name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        if (this.events.has(name)) {
          var subscriptions = this.events.get(name);
          for (var i = 0; i < subscriptions.length; i++) subscriptions[i].callback.apply(subscriptions[i].target, args);
        }
        if (this.onceEvents.has(name)) {
          var subscriptions = this.onceEvents.get(name);
          for (var i = 0; i < subscriptions.length; i++) subscriptions[i].callback.apply(subscriptions[i].target, args);
          subscriptions.length = 0;
        }
      };
      EventManager.remove = function(name) {
        this.events.has(name) && this.events.delete(name);
        this.onceEvents.has(name) && this.onceEvents.delete(name);
      };
      EventManager.removeAll = function() {
        this.events.clear();
        this.onceEvents.clear();
      };
      EventManager.events = new Map();
      EventManager.onceEvents = new Map();
      return EventManager;
    }();
    exports.default = EventManager;
    cc._RF.pop();
  }, {} ],
  Events: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e0c381izNdO5aoU43JPjvWU", "Events");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.VIEW_RESIZE = void 0;
    exports.VIEW_RESIZE = "view-resize";
    cc._RF.pop();
  }, {} ],
  FrameLoad: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6a40au3FthMvYHjcvwK8lLd", "FrameLoad");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var FrameLoad = function(_super) {
      __extends(FrameLoad, _super);
      function FrameLoad() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.item = null;
        _this.content = null;
        _this.normalBtn = null;
        _this.clearBtn = null;
        _this.frameBtn = null;
        return _this;
      }
      FrameLoad.prototype.onLoad = function() {
        this.registerEvent();
      };
      FrameLoad.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      FrameLoad.prototype.registerEvent = function() {
        this.normalBtn.on(cc.Node.EventType.TOUCH_END, this.onNormalBtnClick, this);
        this.clearBtn.on(cc.Node.EventType.TOUCH_END, this.onClearBtnClick, this);
        this.frameBtn.on(cc.Node.EventType.TOUCH_END, this.onFrameBtnClick, this);
      };
      FrameLoad.prototype.unregisterEvent = function() {
        this.normalBtn.off(cc.Node.EventType.TOUCH_END, this.onNormalBtnClick, this);
        this.clearBtn.off(cc.Node.EventType.TOUCH_END, this.onClearBtnClick, this);
        this.frameBtn.off(cc.Node.EventType.TOUCH_END, this.onFrameBtnClick, this);
      };
      FrameLoad.prototype.onNormalBtnClick = function() {
        this.clear();
        this.loadAtOnce();
      };
      FrameLoad.prototype.onClearBtnClick = function() {
        this.clear();
      };
      FrameLoad.prototype.onFrameBtnClick = function() {
        this.clear();
        this.loadByFrame();
      };
      FrameLoad.prototype.clear = function() {
        this.unscheduleAllCallbacks();
        this.content.destroyAllChildren();
      };
      FrameLoad.prototype.addItem = function(index) {
        var node = cc.instantiate(this.item);
        node.setParent(this.content);
        node.children[0].getComponent(cc.Label).string = (index + 1).toString();
        node.active = true;
      };
      FrameLoad.prototype.loadAtOnce = function() {
        var total = 2e3;
        for (var i = 0; i < total; i++) this.addItem(i);
      };
      FrameLoad.prototype.loadByFrame = function() {
        var _this = this;
        var total = 2e3;
        var countPerFrame = 30;
        var index = 0;
        var load = function() {
          if (index < total) {
            var count = Math.min(total - (index + 1), countPerFrame);
            for (var i = 0; i < count; i++) _this.addItem(index++);
          }
          index < total && _this.scheduleOnce(function() {
            return load();
          });
        };
        load();
      };
      __decorate([ property(cc.Node) ], FrameLoad.prototype, "item", void 0);
      __decorate([ property(cc.Node) ], FrameLoad.prototype, "content", void 0);
      __decorate([ property(cc.Node) ], FrameLoad.prototype, "normalBtn", void 0);
      __decorate([ property(cc.Node) ], FrameLoad.prototype, "clearBtn", void 0);
      __decorate([ property(cc.Node) ], FrameLoad.prototype, "frameBtn", void 0);
      FrameLoad = __decorate([ ccclass ], FrameLoad);
      return FrameLoad;
    }(cc.Component);
    exports.default = FrameLoad;
    cc._RF.pop();
  }, {} ],
  GaussianBlur: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f550cOVCwBCkIweEVb2yV8C", "GaussianBlur");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EditorAsset_1 = require("../../misc/EditorAsset");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, executeInEditMode = _a.executeInEditMode, disallowMultiple = _a.disallowMultiple, executionOrder = _a.executionOrder;
    var GaussianBlur = function(_super) {
      __extends(GaussianBlur, _super);
      function GaussianBlur() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._effect = null;
        _this._radius = 10;
        _this.sprite = null;
        _this.material = null;
        return _this;
      }
      Object.defineProperty(GaussianBlur.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        set: function(value) {
          this._effect = value;
          this.init();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(GaussianBlur.prototype, "radius", {
        get: function() {
          return this._radius;
        },
        set: function(value) {
          this._radius = value > 50 ? 50 : value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      GaussianBlur.prototype.onLoad = function() {
        this.init();
      };
      GaussianBlur.prototype.resetInEditor = function() {
        this.init();
      };
      GaussianBlur.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              true;
              return [ 3, 2 ];

             case 1:
              _a.sent();
              _a.label = 2;

             case 2:
              if (!this._effect) return [ 2 ];
              this.sprite = this.node.getComponent(cc.Sprite);
              this.sprite.spriteFrame && (this.sprite.spriteFrame.getTexture().packable = false);
              this.material = cc.Material.create(this._effect);
              this.sprite.setMaterial(0, this.material);
              this.updateProperties();
              return [ 2 ];
            }
          });
        });
      };
      GaussianBlur.prototype.updateProperties = function() {
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("radius", this.radius);
      };
      GaussianBlur.prototype.getNodeSize = function() {
        return cc.v2(this.node.width, this.node.height);
      };
      __decorate([ property ], GaussianBlur.prototype, "_effect", void 0);
      __decorate([ property({
        type: cc.EffectAsset,
        tooltip: false,
        readonly: true
      }) ], GaussianBlur.prototype, "effect", null);
      __decorate([ property ], GaussianBlur.prototype, "_radius", void 0);
      __decorate([ property({
        tooltip: false
      }) ], GaussianBlur.prototype, "radius", null);
      GaussianBlur = __decorate([ ccclass, requireComponent(cc.Sprite), executeInEditMode, disallowMultiple, executionOrder(-100) ], GaussianBlur);
      return GaussianBlur;
    }(cc.Component);
    exports.default = GaussianBlur;
    cc._RF.pop();
  }, {
    "../../misc/EditorAsset": "EditorAsset"
  } ],
  HollowOut: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ea60f2V5RO+IB+WDgN5MHK", "HollowOut");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HollowOutShape = void 0;
    var EditorAsset_1 = require("../../misc/EditorAsset");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, executeInEditMode = _a.executeInEditMode, disallowMultiple = _a.disallowMultiple, executionOrder = _a.executionOrder;
    var HollowOutShape;
    (function(HollowOutShape) {
      HollowOutShape[HollowOutShape["Rect"] = 1] = "Rect";
      HollowOutShape[HollowOutShape["Circle"] = 2] = "Circle";
    })(HollowOutShape = exports.HollowOutShape || (exports.HollowOutShape = {}));
    var HollowOut = function(_super) {
      __extends(HollowOut, _super);
      function HollowOut() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._effect = null;
        _this._shape = HollowOutShape.Rect;
        _this._center = cc.v2();
        _this._width = 300;
        _this._height = 300;
        _this._round = 1;
        _this._radius = 200;
        _this._feather = .5;
        _this.sprite = null;
        _this.material = null;
        _this.tweenRes = null;
        return _this;
      }
      Object.defineProperty(HollowOut.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        set: function(value) {
          this._effect = value;
          this.init();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "shape", {
        get: function() {
          return this._shape;
        },
        set: function(value) {
          this._shape = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "center", {
        get: function() {
          return this._center;
        },
        set: function(value) {
          this._center = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "width", {
        get: function() {
          return this._width;
        },
        set: function(value) {
          this._width = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "height", {
        get: function() {
          return this._height;
        },
        set: function(value) {
          this._height = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "round", {
        get: function() {
          return this._round;
        },
        set: function(value) {
          this._round = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "radius", {
        get: function() {
          return this._radius;
        },
        set: function(value) {
          this._radius = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(HollowOut.prototype, "feather", {
        get: function() {
          return this._feather;
        },
        set: function(value) {
          this._feather = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      HollowOut.prototype.onLoad = function() {
        this.init();
      };
      HollowOut.prototype.resetInEditor = function() {
        this.init();
      };
      HollowOut.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              true;
              return [ 3, 2 ];

             case 1:
              _a.sent();
              _a.label = 2;

             case 2:
              if (!this._effect) return [ 2 ];
              this.sprite = this.node.getComponent(cc.Sprite);
              this.sprite.spriteFrame && (this.sprite.spriteFrame.getTexture().packable = false);
              this.material = cc.Material.create(this._effect);
              this.sprite.setMaterial(0, this.material);
              this.updateProperties();
              return [ 2 ];
            }
          });
        });
      };
      HollowOut.prototype.updateProperties = function() {
        switch (this._shape) {
         case HollowOutShape.Rect:
          this.rect(this._center, this._width, this._height, this._round, this._feather);
          break;

         case HollowOutShape.Circle:
          this.circle(this._center, this._radius, this._feather);
        }
      };
      HollowOut.prototype.rect = function(center, width, height, round, feather) {
        this._shape = HollowOutShape.Rect;
        null !== center && (this._center = center);
        null !== width && (this._width = width);
        null !== height && (this._height = height);
        if (null !== round) {
          this._round = round >= 0 ? round : 0;
          var min = Math.min(this._width / 2, this._height / 2);
          this._round = this._round <= min ? this._round : min;
        }
        if (null !== feather) {
          this._feather = feather >= 0 ? feather : 0;
          this._feather = this._feather <= this._round ? this._feather : this._round;
        }
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("center", this.getCenter(this._center));
        this.material.setProperty("width", this.getWidth(this._width));
        this.material.setProperty("height", this.getHeight(this._height));
        this.material.setProperty("round", this.getRound(this._round));
        this.material.setProperty("feather", this.getFeather(this._feather));
      };
      HollowOut.prototype.circle = function(center, radius, feather) {
        this._shape = HollowOutShape.Circle;
        null !== center && (this._center = center);
        null !== radius && (this._radius = radius);
        null !== feather && (this._feather = feather >= 0 ? feather : 0);
        this.material.setProperty("size", this.getNodeSize());
        this.material.setProperty("center", this.getCenter(this._center));
        this.material.setProperty("width", this.getWidth(2 * this._radius));
        this.material.setProperty("height", this.getHeight(2 * this._radius));
        this.material.setProperty("round", this.getRound(this._radius));
        this.material.setProperty("feather", this.getFeather(this._feather));
      };
      HollowOut.prototype.rectTo = function(time, center, width, height, round, feather) {
        var _this = this;
        void 0 === round && (round = 0);
        void 0 === feather && (feather = 0);
        return new Promise(function(res) {
          cc.Tween.stopAllByTarget(_this);
          _this.unscheduleAllCallbacks();
          _this.tweenRes && _this.tweenRes();
          _this.tweenRes = res;
          round > width / 2 && (round = width / 2);
          round > height / 2 && (round = height / 2);
          feather > round && (feather = round);
          _this._shape = HollowOutShape.Rect;
          cc.tween(_this).to(time, {
            center: center,
            width: width,
            height: height,
            round: round,
            feather: feather
          }).call(function() {
            _this.scheduleOnce(function() {
              if (_this.tweenRes) {
                _this.tweenRes();
                _this.tweenRes = null;
              }
            });
          }).start();
        });
      };
      HollowOut.prototype.circleTo = function(time, center, radius, feather) {
        var _this = this;
        void 0 === feather && (feather = 0);
        return new Promise(function(res) {
          cc.Tween.stopAllByTarget(_this);
          _this.unscheduleAllCallbacks();
          _this.tweenRes && _this.tweenRes();
          _this.tweenRes = res;
          _this._shape = HollowOutShape.Circle;
          cc.tween(_this).to(time, {
            center: center,
            radius: radius,
            feather: feather
          }).call(function() {
            _this.scheduleOnce(function() {
              if (_this.tweenRes) {
                _this.tweenRes();
                _this.tweenRes = null;
              }
            });
          }).start();
        });
      };
      HollowOut.prototype.reset = function() {
        this.rect(cc.v2(), 0, 0, 0, 0);
      };
      HollowOut.prototype.nodeSize = function() {
        this._radius = Math.sqrt(this.node.width * this.node.width + this.node.height * this.node.height) / 2;
        this.rect(this.node.getPosition(), this.node.width, this.node.height, 0, 0);
      };
      HollowOut.prototype.getCenter = function(center) {
        var x = (center.x + this.node.width / 2) / this.node.width;
        var y = (-center.y + this.node.height / 2) / this.node.height;
        return cc.v2(x, y);
      };
      HollowOut.prototype.getNodeSize = function() {
        return cc.v2(this.node.width, this.node.height);
      };
      HollowOut.prototype.getWidth = function(width) {
        return width / this.node.width;
      };
      HollowOut.prototype.getHeight = function(height) {
        return height / this.node.width;
      };
      HollowOut.prototype.getRound = function(round) {
        return round / this.node.width;
      };
      HollowOut.prototype.getFeather = function(feather) {
        return feather / this.node.width;
      };
      __decorate([ property ], HollowOut.prototype, "_effect", void 0);
      __decorate([ property({
        type: cc.EffectAsset,
        tooltip: false,
        readonly: true
      }) ], HollowOut.prototype, "effect", null);
      __decorate([ property ], HollowOut.prototype, "_shape", void 0);
      __decorate([ property({
        type: cc.Enum(HollowOutShape),
        tooltip: false
      }) ], HollowOut.prototype, "shape", null);
      __decorate([ property ], HollowOut.prototype, "_center", void 0);
      __decorate([ property({
        tooltip: false
      }) ], HollowOut.prototype, "center", null);
      __decorate([ property ], HollowOut.prototype, "_width", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Rect;
        }
      }) ], HollowOut.prototype, "width", null);
      __decorate([ property ], HollowOut.prototype, "_height", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Rect;
        }
      }) ], HollowOut.prototype, "height", null);
      __decorate([ property ], HollowOut.prototype, "_round", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Rect;
        }
      }) ], HollowOut.prototype, "round", null);
      __decorate([ property ], HollowOut.prototype, "_radius", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Circle;
        }
      }) ], HollowOut.prototype, "radius", null);
      __decorate([ property ], HollowOut.prototype, "_feather", void 0);
      __decorate([ property({
        tooltip: false,
        visible: function() {
          return this.shape === HollowOutShape.Circle || this.round > 0;
        }
      }) ], HollowOut.prototype, "feather", null);
      HollowOut = __decorate([ ccclass, requireComponent(cc.Sprite), executeInEditMode, disallowMultiple, executionOrder(-100) ], HollowOut);
      return HollowOut;
    }(cc.Component);
    exports.default = HollowOut;
    cc._RF.pop();
  }, {
    "../../misc/EditorAsset": "EditorAsset"
  } ],
  HomePage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2154bCWMgJGPLI4JDK7owxR", "HomePage");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MainContent_1 = require("./MainContent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var HomePage = function(_super) {
      __extends(HomePage, _super);
      function HomePage() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.container = null;
        _this.buttons = null;
        return _this;
      }
      HomePage.prototype.onLoad = function() {
        this.registerEvent();
      };
      HomePage.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      HomePage.prototype.registerEvent = function() {
        this.buttons = this.container.children;
        for (var i = 0; i < this.buttons.length; i++) this.buttons[i].on(cc.Node.EventType.TOUCH_END, this.onBtnClick, this);
      };
      HomePage.prototype.unregisterEvent = function() {
        for (var i = 0; i < this.buttons.length; i++) this.buttons[i].off(cc.Node.EventType.TOUCH_END, this.onBtnClick, this);
      };
      HomePage.prototype.onBtnClick = function(event) {
        var name = event.target.name;
        MainContent_1.default.goCase(name);
      };
      __decorate([ property(cc.Node) ], HomePage.prototype, "container", void 0);
      HomePage = __decorate([ ccclass ], HomePage);
      return HomePage;
    }(cc.Component);
    exports.default = HomePage;
    cc._RF.pop();
  }, {
    "./MainContent": "MainContent"
  } ],
  ImageUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24dc1M+91dNJ4Rf8evARs5H", "ImageUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ImageUtil = function() {
      function ImageUtil() {}
      ImageUtil.getPixelColor = function(texture, x, y) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = texture.width;
        canvas.height = texture.height;
        var image = texture.getHtmlElementObj();
        ctx.drawImage(image, 0, 0, texture.width, texture.height);
        var imageData = ctx.getImageData(0, 0, texture.width, texture.height);
        var pixelIndex = (y - 1) * texture.width * 4 + 4 * (x - 1);
        var pixelData = imageData.data.slice(pixelIndex, pixelIndex + 4);
        var color = cc.color(pixelData[0], pixelData[1], pixelData[2], pixelData[3]);
        image.remove();
        canvas.remove();
        return color;
      };
      ImageUtil.imageToBase64 = function(url, callback) {
        return new Promise(function(res) {
          var _a;
          var extname = null === (_a = /\.png|\.jpg|\.jpeg/.exec(url)) || void 0 === _a ? void 0 : _a[0];
          if ([ ".png", ".jpg", ".jpeg" ].includes(extname)) {
            var canvas_1 = document.createElement("canvas");
            var ctx_1 = canvas_1.getContext("2d");
            var image_1 = new Image();
            image_1.src = url;
            image_1.onload = function() {
              canvas_1.height = image_1.height;
              canvas_1.width = image_1.width;
              ctx_1.drawImage(image_1, 0, 0);
              extname = ".jpg" === extname ? "jpeg" : extname.replace(".", "");
              var dataURL = canvas_1.toDataURL("image/" + extname);
              callback && callback(dataURL);
              res(dataURL);
              image_1.remove();
              canvas_1.remove();
            };
          } else {
            console.warn("Not a jpg/jpeg or png resource!");
            callback && callback(null);
            res(null);
          }
        });
      };
      ImageUtil.base64ToTexture = function(base64) {
        var image = document.createElement("img");
        image.src = base64;
        var texture = new cc.Texture2D();
        texture.initWithElement(image);
        image.remove();
        return texture;
      };
      ImageUtil.base64ToBlob = function(base64) {
        var strings = base64.split(",");
        var type = /image\/\w+|;/.exec(strings[0])[0];
        var data = window.atob(strings[1]);
        var arrayBuffer = new ArrayBuffer(data.length);
        var uint8Array = new Uint8Array(arrayBuffer);
        for (var i = 0; i < data.length; i++) uint8Array[i] = 255 & data.charCodeAt(i);
        return new Blob([ uint8Array ], {
          type: type
        });
      };
      return ImageUtil;
    }();
    exports.default = ImageUtil;
    cc._RF.pop();
  }, {} ],
  InstanceEvent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e5b7ZoW8FHbo2+rROOT/5g", "InstanceEvent");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.InstanceEvent = void 0;
    var InstanceEvent = function() {
      function InstanceEvent() {
        this.events = null;
        this.onceEvents = null;
        this.events = new Array();
        this.onceEvents = new Array();
      }
      InstanceEvent.prototype.on = function(callback, target) {
        this.events.push({
          callback: callback,
          target: target
        });
      };
      InstanceEvent.prototype.once = function(callback, target) {
        this.onceEvents.push({
          callback: callback,
          target: target
        });
      };
      InstanceEvent.prototype.off = function(callback, target) {
        for (var i = 0; i < this.events.length; i++) this.events[i].callback !== callback || target && this.events[i].target !== target || this.events.splice(i, 1);
        for (var i = 0; i < this.onceEvents.length; i++) this.onceEvents[i].callback !== callback || target && this.onceEvents[i].target !== target || this.onceEvents.splice(i, 1);
      };
      InstanceEvent.prototype.emit = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        var promises = [];
        for (var i = 0; i < this.events.length; i++) promises.push(this.events[i].callback.apply(this.events[i].target, args));
        for (var i = 0; i < this.onceEvents.length; i++) promises.push(this.onceEvents[i].callback.apply(this.onceEvents[i].target, args));
        this.onceEvents.length = 0;
        return Promise.all(promises);
      };
      InstanceEvent.prototype.removeAll = function() {
        this.events.length = 0;
        this.onceEvents.length = 0;
      };
      return InstanceEvent;
    }();
    exports.InstanceEvent = InstanceEvent;
    cc._RF.pop();
  }, {} ],
  IntersectionUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a3738x8NTVAaL6AuamxuByE", "IntersectionUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var IntersectionUtil = function() {
      function IntersectionUtil() {}
      IntersectionUtil.lineLine = function(a1, a2, b1, b2) {
        var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
        if (0 !== u_b) {
          var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
          var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
          var ua = ua_t / u_b;
          var ub = ub_t / u_b;
          if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) return true;
        }
        return false;
      };
      IntersectionUtil.lineRect = function(a1, a2, b) {
        var r0 = new cc.Vec2(b.x, b.y);
        var r1 = new cc.Vec2(b.x, b.yMax);
        var r2 = new cc.Vec2(b.xMax, b.yMax);
        var r3 = new cc.Vec2(b.xMax, b.y);
        if (this.lineLine(a1, a2, r0, r1)) return true;
        if (this.lineLine(a1, a2, r1, r2)) return true;
        if (this.lineLine(a1, a2, r2, r3)) return true;
        if (this.lineLine(a1, a2, r3, r0)) return true;
        return false;
      };
      return IntersectionUtil;
    }();
    exports.default = IntersectionUtil;
    cc._RF.pop();
  }, {} ],
  JellyTween: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dc72cElpc1BHpnyDh2UMQQh", "JellyTween");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var JellyTween = function(_super) {
      __extends(JellyTween, _super);
      function JellyTween() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.frequency = 4;
        _this.decay = 2;
        _this.pressScale = .2;
        _this.totalTime = 1;
        _this.interval = 1;
        _this.playOnLoad = false;
        _this.originalScale = 1;
        _this.tween = null;
        return _this;
      }
      JellyTween.prototype.start = function() {
        this.originalScale = this.node.scale;
        this.playOnLoad && this.play();
      };
      JellyTween.prototype.play = function(repeatTimes) {
        var _this = this;
        var times = void 0 != repeatTimes && repeatTimes > 0 ? repeatTimes : 1e9;
        var pressTime = .2 * this.totalTime;
        var scaleBackTime = .15 * this.totalTime;
        var bouncingTime = .65 * this.totalTime;
        var amplitude = this.pressScale / scaleBackTime;
        this.tween = cc.tween(this.node).repeat(times, cc.tween().to(pressTime, {
          scaleX: this.originalScale + this.pressScale,
          scaleY: this.originalScale - this.pressScale
        }, {
          easing: "sineOut"
        }).to(scaleBackTime, {
          scaleX: this.originalScale,
          scaleY: this.originalScale
        }).to(bouncingTime, {
          scaleX: {
            value: this.originalScale,
            progress: function(start, end, current, t) {
              return end - _this.getDifference(amplitude, t);
            }
          },
          scaleY: {
            value: this.originalScale,
            progress: function(start, end, current, t) {
              return end + _this.getDifference(amplitude, t);
            }
          }
        }).delay(this.interval)).start();
      };
      JellyTween.prototype.stop = function() {
        this.tween && this.tween.stop();
        this.node.setScale(this.originalScale);
      };
      JellyTween.prototype.getDifference = function(amplitude, time) {
        var angularVelocity = this.frequency * Math.PI * 2;
        return amplitude * (Math.sin(time * angularVelocity) / Math.exp(this.decay * time) / angularVelocity);
      };
      __decorate([ property({
        tooltip: false
      }) ], JellyTween.prototype, "frequency", void 0);
      __decorate([ property({
        tooltip: false
      }) ], JellyTween.prototype, "decay", void 0);
      __decorate([ property({
        tooltip: false
      }) ], JellyTween.prototype, "pressScale", void 0);
      __decorate([ property({
        tooltip: false
      }) ], JellyTween.prototype, "totalTime", void 0);
      __decorate([ property({
        tooltip: false
      }) ], JellyTween.prototype, "interval", void 0);
      __decorate([ property({
        tooltip: false
      }) ], JellyTween.prototype, "playOnLoad", void 0);
      JellyTween = __decorate([ ccclass ], JellyTween);
      return JellyTween;
    }(cc.Component);
    exports.default = JellyTween;
    cc._RF.pop();
  }, {} ],
  LoadingTip: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9a6a6v9xNlGP7ZxoJbg3IJd", "LoadingTip");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executionOrder = _a.executionOrder;
    var LoadingTip = function(_super) {
      __extends(LoadingTip, _super);
      function LoadingTip() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.main = null;
        return _this;
      }
      LoadingTip_1 = LoadingTip;
      LoadingTip.prototype.onLoad = function() {
        cc.game.addPersistRootNode(this.node);
        LoadingTip_1.instance = this;
      };
      LoadingTip.prototype.start = function() {
        LoadingTip_1.hide();
      };
      LoadingTip.show = function() {
        this.instance.main.active = true;
      };
      LoadingTip.hide = function() {
        this.instance.main.active = false;
      };
      var LoadingTip_1;
      LoadingTip.instance = null;
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], LoadingTip.prototype, "main", void 0);
      LoadingTip = LoadingTip_1 = __decorate([ ccclass, executionOrder(-10) ], LoadingTip);
      return LoadingTip;
    }(cc.Component);
    exports.default = LoadingTip;
    cc._RF.pop();
  }, {} ],
  LocalizationBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2da35x6KthImKlsTLjYrDi5", "LocalizationBase");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DefaultLang = exports.Lang = exports.LANG_CHANGED = void 0;
    var EventManager_1 = require("../../core/EventManager");
    exports.LANG_CHANGED = "lang-change";
    var Lang;
    (function(Lang) {
      Lang["Cn"] = "cn";
      Lang["Eng"] = "eng";
    })(Lang = exports.Lang || (exports.Lang = {}));
    var DefaultLang;
    (function(DefaultLang) {
      DefaultLang[DefaultLang["cn"] = 1] = "cn";
      DefaultLang[DefaultLang["eng"] = 2] = "eng";
    })(DefaultLang = exports.DefaultLang || (exports.DefaultLang = {}));
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LocalizationBase = function(_super) {
      __extends(LocalizationBase, _super);
      function LocalizationBase() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.defaultLang = DefaultLang.cn;
        _this.curLang = Lang.Cn;
        _this.langChanged = function(lang) {
          _this.curLang = lang;
          _this.onLangChanged(lang);
        };
        return _this;
      }
      LocalizationBase.prototype.onLoad = function() {
        EventManager_1.default.on(exports.LANG_CHANGED, this.langChanged, this);
      };
      LocalizationBase.prototype.onDestroy = function() {
        EventManager_1.default.off(exports.LANG_CHANGED, this.langChanged, this);
      };
      LocalizationBase.prototype.onLangChanged = function(lang) {};
      LocalizationBase.prototype.get = function() {
        return this[this.curLang] ? Array.isArray(this[this.curLang]) && 0 === this[this.curLang].length ? this[DefaultLang[this.defaultLang]] : this[this.curLang] : this[DefaultLang[this.defaultLang]];
      };
      __decorate([ property({
        type: cc.Enum(DefaultLang),
        tooltip: false
      }) ], LocalizationBase.prototype, "defaultLang", void 0);
      LocalizationBase = __decorate([ ccclass ], LocalizationBase);
      return LocalizationBase;
    }(cc.Component);
    exports.default = LocalizationBase;
    cc._RF.pop();
  }, {
    "../../core/EventManager": "EventManager"
  } ],
  LocalizationLabelString: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "526f8Shm4BDLpHAiRDRJtQz", "LocalizationLabelString");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LocalizationBase_1 = require("./LocalizationBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent;
    var LocalizationLabelString = function(_super) {
      __extends(LocalizationLabelString, _super);
      function LocalizationLabelString() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.cn = "";
        _this.eng = "";
        _this.label = null;
        return _this;
      }
      LocalizationLabelString.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.label = this.node.getComponent(cc.Label);
      };
      LocalizationLabelString.prototype.onLangChanged = function() {
        this.label && (this.label.string = this.get());
      };
      __decorate([ property() ], LocalizationLabelString.prototype, "cn", void 0);
      __decorate([ property() ], LocalizationLabelString.prototype, "eng", void 0);
      LocalizationLabelString = __decorate([ ccclass, requireComponent(cc.Label) ], LocalizationLabelString);
      return LocalizationLabelString;
    }(LocalizationBase_1.default);
    exports.default = LocalizationLabelString;
    cc._RF.pop();
  }, {
    "./LocalizationBase": "LocalizationBase"
  } ],
  LocalizationSpriteFrame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0b7fb1M65dDXr7mGqAb8NT8", "LocalizationSpriteFrame");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LocalizationBase_1 = require("./LocalizationBase");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent;
    var LocalizationSpriteFrame = function(_super) {
      __extends(LocalizationSpriteFrame, _super);
      function LocalizationSpriteFrame() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.cn = null;
        _this.eng = null;
        _this.sprite = null;
        return _this;
      }
      LocalizationSpriteFrame.prototype.onLoad = function() {
        _super.prototype.onLoad.call(this);
        this.sprite = this.node.getComponent(cc.Sprite);
      };
      LocalizationSpriteFrame.prototype.onLangChanged = function() {
        this.sprite && (this.sprite.spriteFrame = this.get());
      };
      __decorate([ property(cc.SpriteFrame) ], LocalizationSpriteFrame.prototype, "cn", void 0);
      __decorate([ property(cc.SpriteFrame) ], LocalizationSpriteFrame.prototype, "eng", void 0);
      LocalizationSpriteFrame = __decorate([ ccclass, requireComponent(cc.Sprite) ], LocalizationSpriteFrame);
      return LocalizationSpriteFrame;
    }(LocalizationBase_1.default);
    exports.default = LocalizationSpriteFrame;
    cc._RF.pop();
  }, {
    "./LocalizationBase": "LocalizationBase"
  } ],
  LongPress: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4dcd9cs7q9MNY+LUd0TPUX+", "LongPress");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TriggerWay = exports.LONG_PRESS = void 0;
    exports.LONG_PRESS = "longpress";
    var TriggerWay;
    (function(TriggerWay) {
      TriggerWay[TriggerWay["Immediately"] = 1] = "Immediately";
      TriggerWay[TriggerWay["AfterLoosing"] = 2] = "AfterLoosing";
    })(TriggerWay = exports.TriggerWay || (exports.TriggerWay = {}));
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LongPress = function(_super) {
      __extends(LongPress, _super);
      function LongPress() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.trggerTime = 2;
        _this.trggerWay = TriggerWay.Immediately;
        _this.longPressEvents = [];
        _this.hasAccomplished = false;
        return _this;
      }
      LongPress.prototype.onEnable = function() {
        this.registerNodeEvent();
      };
      LongPress.prototype.onDisable = function() {
        this.unregisterNodeEvent();
      };
      LongPress.prototype.registerNodeEvent = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
      };
      LongPress.prototype.unregisterNodeEvent = function() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
      };
      LongPress.prototype.onTouchStart = function() {
        this.hasAccomplished = false;
        this.scheduleOnce(this.onPressAccomplished.bind(this), this.trggerTime);
      };
      LongPress.prototype.onTouchEnd = function() {
        if (this.hasAccomplished) {
          this.hasAccomplished = false;
          this.trigger();
        }
        this.unscheduleAllCallbacks();
      };
      LongPress.prototype.onTouchCancel = function() {
        if (this.hasAccomplished) {
          this.hasAccomplished = false;
          this.trigger();
        }
        this.unscheduleAllCallbacks();
      };
      LongPress.prototype.onPressAccomplished = function() {
        this.trggerWay === TriggerWay.Immediately ? this.trigger() : this.trggerWay === TriggerWay.AfterLoosing && (this.hasAccomplished = true);
      };
      LongPress.prototype.trigger = function() {
        cc.Component.EventHandler.emitEvents(this.longPressEvents, this);
        this.node.emit(exports.LONG_PRESS, this);
      };
      __decorate([ property({
        tooltip: false
      }) ], LongPress.prototype, "trggerTime", void 0);
      __decorate([ property({
        type: cc.Enum(TriggerWay),
        tooltip: false
      }) ], LongPress.prototype, "trggerWay", void 0);
      __decorate([ property({
        type: cc.Component.EventHandler,
        tooltip: false
      }) ], LongPress.prototype, "longPressEvents", void 0);
      LongPress = __decorate([ ccclass ], LongPress);
      return LongPress;
    }(cc.Component);
    exports.default = LongPress;
    cc._RF.pop();
  }, {} ],
  MainContent: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe1924BPtRIy6UHAj8LyHbt", "MainContent");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../../eazax-ccc/core/EventManager");
    var BrowserUtil_1 = require("../../eazax-ccc/utils/BrowserUtil");
    var CustomEvents_1 = require("../common/constants/CustomEvents");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainContent = function(_super) {
      __extends(MainContent, _super);
      function MainContent() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.home = null;
        _this.casesContainer = null;
        _this.cases = null;
        return _this;
      }
      MainContent_1 = MainContent;
      MainContent.prototype.onLoad = function() {
        this.init();
      };
      MainContent.prototype.init = function() {
        MainContent_1.instance = this;
        this.cases = this.casesContainer.children;
        for (var i = 0; i < this.cases.length; i++) MainContent_1.casesMap.set(this.cases[i].name, i);
      };
      MainContent.hasCase = function(name) {
        return MainContent_1.casesMap.has(name);
      };
      MainContent.goHome = function() {
        eazax.log("[Go Home]");
        BrowserUtil_1.default.clearUrlParam();
        this.instance.home.active = true;
        this.instance.casesContainer.active = false;
        EventManager_1.default.emit(CustomEvents_1.SWITCH_PAGE, "home");
      };
      MainContent.goCase = function(name) {
        if (!this.hasCase(name)) return this.goHome();
        eazax.log("[Go Case]", name);
        BrowserUtil_1.default.setUrlParam("case=" + name);
        for (var i = 0; i < this.instance.cases.length; i++) this.instance.cases[i].active = this.instance.cases[i].name === name;
        this.instance.home.active = false;
        this.instance.casesContainer.active = true;
        EventManager_1.default.emit(CustomEvents_1.SWITCH_PAGE, name);
      };
      var MainContent_1;
      MainContent.instance = null;
      MainContent.casesMap = new Map();
      __decorate([ property(cc.Node) ], MainContent.prototype, "home", void 0);
      __decorate([ property(cc.Node) ], MainContent.prototype, "casesContainer", void 0);
      MainContent = MainContent_1 = __decorate([ ccclass ], MainContent);
      return MainContent;
    }(cc.Component);
    exports.default = MainContent;
    cc._RF.pop();
  }, {
    "../../eazax-ccc/core/EventManager": "EventManager",
    "../../eazax-ccc/utils/BrowserUtil": "BrowserUtil",
    "../common/constants/CustomEvents": "CustomEvents"
  } ],
  MainUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4b0acqCn/9E2JVAPHN5qPEE", "MainUI");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../../eazax-ccc/core/EventManager");
    var CustomEvents_1 = require("../common/constants/CustomEvents");
    var MainContent_1 = require("./MainContent");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MainUI = function(_super) {
      __extends(MainUI, _super);
      function MainUI() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.homeBtn = null;
        _this.titleTip = null;
        return _this;
      }
      MainUI.prototype.onLoad = function() {
        this.registerEvent();
      };
      MainUI.prototype.start = function() {
        this.reset();
      };
      MainUI.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      MainUI.prototype.registerEvent = function() {
        this.homeBtn.on(cc.Node.EventType.TOUCH_END, this.onHomeBtnClick, this);
        this.titleTip.on(cc.Node.EventType.TOUCH_END, this.onTitleTipClick, this);
        EventManager_1.default.on(CustomEvents_1.SWITCH_PAGE, this.onPageSwitch, this);
      };
      MainUI.prototype.unregisterEvent = function() {
        this.homeBtn.off(cc.Node.EventType.TOUCH_END, this.onHomeBtnClick, this);
        this.titleTip.off(cc.Node.EventType.TOUCH_END, this.onTitleTipClick, this);
        EventManager_1.default.off(CustomEvents_1.SWITCH_PAGE, this.onPageSwitch, this);
      };
      MainUI.prototype.reset = function() {
        this.titleTip.active = true;
      };
      MainUI.prototype.onHomeBtnClick = function() {
        MainContent_1.default.goHome();
      };
      MainUI.prototype.onTitleTipClick = function() {
        this.titleTip.active = false;
      };
      MainUI.prototype.onPageSwitch = function(name) {
        this.homeBtn.active = "home" !== name;
      };
      __decorate([ property(cc.Node) ], MainUI.prototype, "homeBtn", void 0);
      __decorate([ property(cc.Node) ], MainUI.prototype, "titleTip", void 0);
      MainUI = __decorate([ ccclass ], MainUI);
      return MainUI;
    }(cc.Component);
    exports.default = MainUI;
    cc._RF.pop();
  }, {
    "../../eazax-ccc/core/EventManager": "EventManager",
    "../common/constants/CustomEvents": "CustomEvents",
    "./MainContent": "MainContent"
  } ],
  Main: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "25566cocBlKmoVdf7n3NiKX", "Main");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MainContent_1 = require("./MainContent");
    var BrowserUtil_1 = require("../../eazax-ccc/utils/BrowserUtil");
    var PopupManager_1 = require("../../eazax-ccc/core/PopupManager");
    var LoadingTip_1 = require("../../eazax-ccc/components/LoadingTip");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Main = function(_super) {
      __extends(Main, _super);
      function Main() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      Main.prototype.onEnable = function() {
        var caseName = BrowserUtil_1.default.getUrlParam("case");
        caseName && MainContent_1.default.hasCase(caseName) ? MainContent_1.default.goCase(caseName) : MainContent_1.default.goHome();
        PopupManager_1.default.loadStartCallback = function() {
          return LoadingTip_1.default.show();
        };
        PopupManager_1.default.loadFinishCallback = function() {
          return LoadingTip_1.default.hide();
        };
      };
      Main = __decorate([ ccclass ], Main);
      return Main;
    }(cc.Component);
    exports.default = Main;
    cc._RF.pop();
  }, {
    "../../eazax-ccc/components/LoadingTip": "LoadingTip",
    "../../eazax-ccc/core/PopupManager": "PopupManager",
    "../../eazax-ccc/utils/BrowserUtil": "BrowserUtil",
    "./MainContent": "MainContent"
  } ],
  Marquee: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fbc9dvqZdRO6rqKofACuje5", "Marquee");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Marquee = function(_super) {
      __extends(Marquee, _super);
      function Marquee() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.view = null;
        _this.label = null;
        _this.texts = [];
        _this.speed = 1;
        _this.loop = false;
        _this.playOnLoad = false;
        _this.index = 0;
        _this.isPlaying = false;
        _this.endCallback = null;
        return _this;
      }
      Marquee.prototype.onLoad = function() {
        this.init();
        this.playOnLoad && this.play(0, this.loop);
      };
      Marquee.prototype.update = function(dt) {
        if (!this.isPlaying || 0 === this.texts.length) return;
        this.updatePosition();
      };
      Marquee.prototype.init = function() {
        this.label.node.anchorX = 0;
        this.setLabel("");
      };
      Marquee.prototype.updatePosition = function() {
        this.label.node.x -= this.speed;
        this.label.node.x <= -(this.view.width / 2 + this.label.node.width) && this.next();
      };
      Marquee.prototype.setLabel = function(text) {
        this.label.string = text;
        this.label.node.x = this.view.width / 2;
      };
      Marquee.prototype.next = function() {
        this.index++;
        if (this.index >= this.texts.length) if (this.loop) {
          this.index = 0;
          this.setLabel(this.texts[0]);
        } else {
          if (this.endCallback) {
            this.endCallback();
            this.endCallback = null;
          }
          this.clean();
        } else this.setLabel(this.texts[this.index]);
      };
      Marquee.prototype.push = function(texts) {
        var _a;
        Array.isArray(texts) ? (_a = this.texts).push.apply(_a, texts) : this.texts.push(texts);
      };
      Marquee.prototype.play = function(index, loop, callback) {
        void 0 === index && (index = 0);
        void 0 === loop && (loop = false);
        void 0 === callback && (callback = null);
        if (0 === this.texts.length) return;
        this.index = index < this.texts.length ? index : 0;
        this.setLabel(this.texts[this.index]);
        this.loop = loop;
        this.endCallback = callback;
        this.isPlaying = true;
      };
      Marquee.prototype.stop = function() {
        this.isPlaying = false;
        this.index = 0;
      };
      Marquee.prototype.pause = function() {
        this.isPlaying = false;
      };
      Marquee.prototype.resume = function() {
        this.isPlaying = true;
      };
      Marquee.prototype.clean = function() {
        this.stop();
        this.index = 0;
        this.texts = [];
        this.endCallback = null;
      };
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], Marquee.prototype, "view", void 0);
      __decorate([ property({
        type: cc.RichText,
        tooltip: false
      }) ], Marquee.prototype, "label", void 0);
      __decorate([ property({
        tooltip: "\u6587\u672c\u961f\u5217"
      }) ], Marquee.prototype, "texts", void 0);
      __decorate([ property({
        tooltip: false
      }) ], Marquee.prototype, "speed", void 0);
      __decorate([ property({
        tooltip: false
      }) ], Marquee.prototype, "loop", void 0);
      __decorate([ property({
        tooltip: false
      }) ], Marquee.prototype, "playOnLoad", void 0);
      Marquee = __decorate([ ccclass ], Marquee);
      return Marquee;
    }(cc.Component);
    exports.default = Marquee;
    cc._RF.pop();
  }, {} ],
  MathUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4decaALYrFHY67N5M180Dt0", "MathUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var MathUtil = function() {
      function MathUtil() {}
      MathUtil.getRandomInt = function(min, max) {
        void 0 === min && (min = 0);
        void 0 === max && (max = 1);
        return Math.floor(Math.random() * (max - min) + min);
      };
      MathUtil.getPseudoRandomInt = function(seed, key) {
        return Math.ceil((9301 * seed + 49297) % 233280 / 233280 * key);
      };
      MathUtil.getAngle = function(p1, p2) {
        return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
      };
      MathUtil.getDistance = function(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      };
      MathUtil.angleToRadian = function(angle) {
        return angle * Math.PI / 180;
      };
      MathUtil.addSafely = function(a, b) {
        var aDigits = (a.toString().split(".")[1] || "").length;
        var bDigits = (b.toString().split(".")[1] || "").length;
        var multiplier = Math.pow(10, Math.max(aDigits, bDigits));
        return (a * multiplier + b * multiplier) / multiplier;
      };
      return MathUtil;
    }();
    exports.default = MathUtil;
    cc._RF.pop();
  }, {} ],
  NetworkManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bbd78IU+FxM/pEGmi/66qM0", "NetworkManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var NetworkManager = function() {
      function NetworkManager() {}
      NetworkManager.request = function(url, data) {};
      NetworkManager.xhr = new XMLHttpRequest();
      return NetworkManager;
    }();
    exports.default = NetworkManager;
    cc._RF.pop();
  }, {} ],
  NewGuide: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8a50fcdznlNkoYkMJatN+XL", "NewGuide");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var HollowOut_1 = require("../../../../eazax-ccc/components/effects/HollowOut");
    var TouchBlocker_1 = require("../../../../eazax-ccc/components/TouchBlocker");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var NewGuide = function(_super) {
      __extends(NewGuide, _super);
      function NewGuide() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.hollowOut = null;
        _this.touchBlocker = null;
        _this.startBtn = null;
        _this.oneBtn = null;
        _this.twoBtn = null;
        _this.threeBtn = null;
        return _this;
      }
      NewGuide.prototype.onLoad = function() {
        this.registerEvent();
      };
      NewGuide.prototype.registerEvent = function() {
        this.startBtn.on(cc.Node.EventType.TOUCH_END, this.onStartBtnClick, this);
        this.oneBtn.on(cc.Node.EventType.TOUCH_END, this.onOneBtnClick, this);
        this.twoBtn.on(cc.Node.EventType.TOUCH_END, this.onTwoBtnClick, this);
        this.threeBtn.on(cc.Node.EventType.TOUCH_END, this.onThreeBtnClick, this);
      };
      NewGuide.prototype.start = function() {
        this.reset();
      };
      NewGuide.prototype.reset = function() {
        this.hollowOut.node.active = true;
        this.hollowOut.nodeSize();
        this.touchBlocker.passAll();
      };
      NewGuide.prototype.onStartBtnClick = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.rectTo(.5, this.oneBtn.getPosition(), this.oneBtn.width + 10, this.oneBtn.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.oneBtn);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onOneBtnClick = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.hollowOut.nodeSize();
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.rectTo(.5, this.twoBtn.getPosition(), this.twoBtn.width + 10, this.twoBtn.height + 10, 5, 5) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.twoBtn);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onTwoBtnClick = function() {
        return __awaiter(this, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              this.hollowOut.nodeSize();
              this.touchBlocker.blockAll();
              return [ 4, this.hollowOut.circleTo(.5, this.threeBtn.getPosition(), this.threeBtn.width / 2, 0) ];

             case 1:
              _a.sent();
              this.touchBlocker.setTarget(this.threeBtn);
              return [ 2 ];
            }
          });
        });
      };
      NewGuide.prototype.onThreeBtnClick = function() {
        this.hollowOut.nodeSize();
        this.touchBlocker.passAll();
      };
      __decorate([ property(HollowOut_1.default) ], NewGuide.prototype, "hollowOut", void 0);
      __decorate([ property(TouchBlocker_1.default) ], NewGuide.prototype, "touchBlocker", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "startBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "oneBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "twoBtn", void 0);
      __decorate([ property(cc.Node) ], NewGuide.prototype, "threeBtn", void 0);
      NewGuide = __decorate([ ccclass ], NewGuide);
      return NewGuide;
    }(cc.Component);
    exports.default = NewGuide;
    cc._RF.pop();
  }, {
    "../../../../eazax-ccc/components/TouchBlocker": "TouchBlocker",
    "../../../../eazax-ccc/components/effects/HollowOut": "HollowOut"
  } ],
  NodeUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "55cdbUdSaNNaqWUdZx+xknk", "NodeUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var NodeUtil = function() {
      function NodeUtil() {}
      NodeUtil.getRelativePosition = function(node, container) {
        var worldPos = (node.getParent() || node).convertToWorldSpaceAR(node.getPosition());
        return container.convertToNodeSpaceAR(worldPos);
      };
      NodeUtil.isPosOnNodeRect = function(pos, target) {
        var rect = target.getBoundingBoxToWorld();
        return rect.contains(pos);
      };
      NodeUtil.areNodesOverlap = function(node1, node2, contains) {
        void 0 === contains && (contains = false);
        var rect2 = node2.getBoundingBoxToWorld();
        var rect1 = node1.getBoundingBoxToWorld();
        return contains ? rect2.containsRect(rect1) : rect2.intersects(rect1);
      };
      return NodeUtil;
    }();
    exports.default = NodeUtil;
    cc._RF.pop();
  }, {} ],
  ObjectUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4cfb3aTbO1CNpcW8SypPvaS", "ObjectUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ObjectUtil = function() {
      function ObjectUtil() {}
      ObjectUtil.isObject = function(value) {
        return "[object Object]" === Object.prototype.toString.call(value);
      };
      ObjectUtil.deepCopy = function(target) {
        if (null == target || "object" !== typeof target) return target;
        var result = null;
        if (target instanceof Date) {
          result = new Date();
          result.setTime(target.getTime());
          return result;
        }
        if (target instanceof Array) {
          result = [];
          for (var i = 0, length = target.length; i < length; i++) result[i] = this.deepCopy(target[i]);
          return result;
        }
        if (target instanceof Object) {
          result = {};
          for (var key in target) target.hasOwnProperty(key) && (result[key] = this.deepCopy(target[key]));
          return result;
        }
        console.warn("\u4e0d\u652f\u6301\u7684\u7c7b\u578b\uff1a" + result);
      };
      ObjectUtil.copy = function(target) {
        return JSON.parse(JSON.stringify(target));
      };
      return ObjectUtil;
    }();
    exports.default = ObjectUtil;
    cc._RF.pop();
  }, {} ],
  PoolManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "61d6cGTtGROj5qxDo2PG8ej", "PoolManager");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PoolManager = function() {
      function PoolManager() {}
      Object.defineProperty(PoolManager, "poolMap", {
        get: function() {
          return this._poolMap;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PoolManager, "prefabMap", {
        get: function() {
          return this._prefabMap;
        },
        enumerable: false,
        configurable: true
      });
      PoolManager.get = function(path) {
        return __awaiter(this, void 0, Promise, function() {
          var pool, node;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              pool = this._poolMap.get(path);
              if (pool && pool.size() > 0) return [ 2, pool.get() ];
              if (this._prefabMap.has(path)) return [ 2, cc.instantiate(this._prefabMap.get(path)) ];
              return [ 4, this.getFromRes(path) ];

             case 1:
              node = _a.sent();
              return [ 2, node || null ];
            }
          });
        });
      };
      PoolManager.put = function(path, node) {
        var pool = this._poolMap.get(path);
        if (!pool) {
          pool = new cc.NodePool();
          this._poolMap.set(path, pool);
        }
        pool.put(node);
      };
      PoolManager.getFromRes = function(path) {
        var _this = this;
        return new Promise(function(res) {
          cc.resources.load(path, function(error, prefab) {
            if (error) res(null); else {
              prefab.addRef();
              _this._prefabMap.set(path, prefab);
              res(cc.instantiate(prefab));
            }
          });
        });
      };
      PoolManager._poolMap = new Map();
      PoolManager._prefabMap = new Map();
      return PoolManager;
    }();
    exports.default = PoolManager;
    cc._RF.pop();
  }, {} ],
  PopupBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4f06bMKddJh4jxlZJ7rcMt", "PopupBase");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PopupBase = function(_super) {
      __extends(PopupBase, _super);
      function PopupBase() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.background = null;
        _this.main = null;
        _this.blocker = null;
        _this.animTime = .3;
        _this.options = null;
        _this.finishCallback = null;
        return _this;
      }
      PopupBase.prototype.onShow = function() {};
      PopupBase.prototype.onHide = function(hidByForce) {
        void 0 === hidByForce && (hidByForce = false);
      };
      PopupBase.prototype.show = function(options, time) {
        var _this = this;
        void 0 === time && (time = this.animTime);
        this.options = options;
        this.background.opacity = 0;
        this.background.active = true;
        this.main.scale = 0;
        this.main.active = true;
        this.node.active = true;
        this.init(this.options);
        this.updateDisplay(this.options);
        if (0 === time) {
          this.background.opacity = 200;
          this.main.scale = 1;
          this.onShow && this.onShow();
          return;
        }
        cc.tween(this.background).to(.8 * this.animTime, {
          opacity: 200
        }).start();
        cc.tween(this.main).to(this.animTime, {
          scale: 1
        }, {
          easing: "backOut"
        }).call(function() {
          _this.onShow && _this.onShow();
        }).start();
      };
      PopupBase.prototype.hide = function(time, hidByForce) {
        var _this = this;
        void 0 === time && (time = this.animTime);
        void 0 === hidByForce && (hidByForce = false);
        if (0 === time) {
          this.node.active = false;
          this.onHide && this.onHide(hidByForce);
          this.finishCallback && this.finishCallback(hidByForce);
          return;
        }
        if (!this.blocker) {
          this.blocker = new cc.Node("blocker");
          this.blocker.addComponent(cc.BlockInputEvents);
          this.blocker.setParent(this.node);
          this.blocker.setContentSize(this.node.getContentSize());
        }
        this.blocker.active = true;
        cc.tween(this.background).delay(.2 * this.animTime).to(.8 * this.animTime, {
          opacity: 0
        }).call(function() {
          _this.background.active = false;
        }).start();
        cc.tween(this.main).to(this.animTime, {
          scale: 0
        }, {
          easing: "backIn"
        }).call(function() {
          _this.blocker.active = false;
          _this.main.active = false;
          _this.node.active = false;
          _this.onHide && _this.onHide();
          _this.finishCallback && _this.finishCallback();
        }).start();
      };
      PopupBase.prototype.init = function(options) {};
      PopupBase.prototype.updateDisplay = function(options) {};
      PopupBase.prototype.setFinishCallback = function(callback) {
        this.finishCallback = callback;
      };
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], PopupBase.prototype, "background", void 0);
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], PopupBase.prototype, "main", void 0);
      PopupBase = __decorate([ ccclass ], PopupBase);
      return PopupBase;
    }(cc.Component);
    exports.default = PopupBase;
    cc._RF.pop();
  }, {} ],
  PopupManager_dev: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e51b7I/FxtJ4JO7qAUDgWSW", "PopupManager_dev");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PopupCacheMode = exports.PopupShowResult = exports.PopupShowPriority = void 0;
    var PopupBase_1 = require("../components/popups/PopupBase");
    var PopupManager_dev = function() {
      function PopupManager_dev() {}
      Object.defineProperty(PopupManager_dev, "prefabMap", {
        get: function() {
          return this._prefabMap;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager_dev, "nodeMap", {
        get: function() {
          return this._nodeMap;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager_dev, "queue", {
        get: function() {
          return this._queue;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager_dev, "currents", {
        get: function() {
          return this._currents;
        },
        enumerable: false,
        configurable: true
      });
      PopupManager_dev.show = function(pathOrPrefab, options, cacheMode, priority) {
        var _this = this;
        void 0 === options && (options = null);
        void 0 === cacheMode && (cacheMode = PopupCacheMode.Normal);
        void 0 === priority && (priority = PopupShowPriority.None);
        return new Promise(function(res) {
          return __awaiter(_this, void 0, void 0, function() {
            var current, cur;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
               case 0:
                cc.log("show", pathOrPrefab, options, cacheMode, priority);
                if (this._currents.length > 0 || this.reserved) {
                  cc.log("\u5f53\u524d\u5df2\u6709\u5f39\u7a97\u5728\u5c55\u793a\u4e2d");
                  cc.log("currents", this._currents);
                  if (priority === PopupShowPriority.Cover) cc.log("\u5c55\u793a\u5728\u5f53\u524d\u5f39\u7a97\u4e0a\u5c42"); else {
                    if (priority !== PopupShowPriority.Force) {
                      this.push(pathOrPrefab, options, cacheMode, priority);
                      cc.log("\u52a0\u5165\u7b49\u5f85\u961f\u5217", this._currents);
                      return [ 2, res(PopupShowResult.Wait) ];
                    }
                    cc.log("\u7acb\u5373\u5f3a\u5236\u5c55\u793a\u76ee\u6807\u5f39\u7a97");
                    while (this._currents.length > 0) {
                      current = this._currents[0];
                      cc.log("hide", current);
                      if (current.popup) {
                        this.hidByForce = true;
                        current.popup.hide(0, true);
                        this.hidByForce = false;
                      } else if (current.node) {
                        current.node.active = false;
                        current.node.destroy();
                        current.node = null;
                      }
                    }
                  }
                }
                cur = {
                  request: {
                    pathOrPrefab: pathOrPrefab,
                    options: options,
                    cacheMode: cacheMode
                  },
                  popup: null,
                  node: null
                };
                this._currents.push(cur);
                cc.log("currents push", this._currents);
                if (!("string" === typeof pathOrPrefab)) return [ 3, 3 ];
                this._currents.length > 0 && priority === PopupShowPriority.Cover ? this._prefabMap.has(pathOrPrefab) && (cur.node = cc.instantiate(this._prefabMap.get(pathOrPrefab))) : cur.node = this.getNodeFromCache(pathOrPrefab);
                if (!!cc.isValid(cur.node)) return [ 3, 2 ];
                this.loadStartCallback && this.loadStartCallback();
                return [ 4, new Promise(function(res) {
                  cc.resources.load(pathOrPrefab, function(error, prefab) {
                    if (!error) {
                      cur.node = cc.instantiate(prefab);
                      prefab.addRef();
                      _this._prefabMap.set(pathOrPrefab, prefab);
                    }
                    res();
                  });
                }) ];

               case 1:
                _a.sent();
                this.loadFinishCallback && this.loadFinishCallback();
                _a.label = 2;

               case 2:
                if (!cc.isValid(cur.node)) {
                  cc.warn("[PopupManager_dev]", "\u5f39\u7a97\u52a0\u8f7d\u5931\u8d25", pathOrPrefab);
                  this._currents.splice(this._currents.indexOf(cur));
                  return [ 2, res(PopupShowResult.Fail) ];
                }
                return [ 3, 4 ];

               case 3:
                cur.node = cc.instantiate(pathOrPrefab);
                _a.label = 4;

               case 4:
                cur.node.setParent(cc.Canvas.instance.node);
                cur.node.setSiblingIndex(cc.macro.MAX_ZINDEX);
                cur.popup = cur.node.getComponent(PopupBase_1.default);
                if (cur.popup) {
                  cur.popup.setFinishCallback(function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var _this = this;
                      return __generator(this, function(_a) {
                        switch (_a.label) {
                         case 0:
                          cc.log("finish", options);
                          cc.log("\u5b8c\u6210\u56de\u8c03", cur);
                          this.recycle(cur.request.pathOrPrefab, cur.node, cur.request.cacheMode);
                          this.reserved = this._queue.length > 0;
                          this._currents.splice(this._currents.indexOf(cur));
                          cur = null;
                          cc.log("currents", this._currents);
                          res(PopupShowResult.Done);
                          return [ 4, new Promise(function(res) {
                            cc.Canvas.instance.scheduleOnce(res, _this.interval);
                          }) ];

                         case 1:
                          _a.sent();
                          this.hidByForce || this.next();
                          return [ 2 ];
                        }
                      });
                    });
                  });
                  cur.popup.show(options);
                } else {
                  cur.node.active = true;
                  res(PopupShowResult.Dirty);
                }
                return [ 2 ];
              }
            });
          });
        });
      };
      PopupManager_dev.getNodeFromCache = function(path) {
        if (this._nodeMap.has(path)) {
          var node = this._nodeMap.get(path);
          if (cc.isValid(node)) return node;
          this._nodeMap.delete(path);
        }
        if (this._prefabMap.has(path)) {
          var prefab = this._prefabMap.get(path);
          if (cc.isValid(prefab)) return cc.instantiate(prefab);
          this._prefabMap.delete(path);
        }
        return null;
      };
      PopupManager_dev.next = function() {
        if (this._currents.length > 0 || 0 === this._queue.length) return;
        cc.log("\u4e0b\u4e00\u4e2a\u5f39\u7a97", this._queue);
        var request = this._queue.shift();
        this.reserved = false;
        this.show(request.pathOrPrefab, request.options, request.cacheMode);
      };
      PopupManager_dev.push = function(pathOrPrefab, options, cacheMode, priority) {
        void 0 === options && (options = null);
        void 0 === cacheMode && (cacheMode = PopupCacheMode.Normal);
        void 0 === priority && (priority = PopupShowPriority.None);
        if (0 === this._currents.length && !this.reserved) {
          this.show(pathOrPrefab, options, cacheMode);
          return;
        }
        priority === PopupShowPriority.Prior ? this._queue.unshift({
          pathOrPrefab: pathOrPrefab,
          options: options,
          cacheMode: cacheMode
        }) : this._queue.push({
          pathOrPrefab: pathOrPrefab,
          options: options,
          cacheMode: cacheMode
        });
      };
      PopupManager_dev.recycle = function(pathOrPrefab, node, cacheMode) {
        cc.log("\u56de\u6536\u5f39\u7a97");
        if ("string" !== typeof pathOrPrefab) {
          node.destroy();
          return;
        }
        switch (cacheMode) {
         case PopupCacheMode.Once:
          node.destroy();
          this._nodeMap.has(pathOrPrefab) && this._nodeMap.delete(pathOrPrefab);
          for (var i = 0; i < this._currents.length; i++) if (this._currents[i].request.pathOrPrefab === pathOrPrefab) return;
          this.release(pathOrPrefab);
          break;

         case PopupCacheMode.Normal:
          node.destroy();
          this._nodeMap.has(pathOrPrefab) && this._nodeMap.delete(pathOrPrefab);
          break;

         case PopupCacheMode.Frequent:
          node.removeFromParent(false);
          this._nodeMap.has(pathOrPrefab) || this._nodeMap.set(pathOrPrefab, node);
        }
      };
      PopupManager_dev.release = function(path) {
        cc.log("\u91ca\u653e\u5f39\u7a97\u8d44\u6e90");
        var prefab = this._prefabMap.get(path);
        if (prefab) {
          this._prefabMap.delete(path);
          prefab.decRef();
          prefab = null;
        }
      };
      PopupManager_dev.hasCurrent = function() {
        if (0 === this._currents.length) return false;
        for (var i = 0; i < this._currents.length; i++) if (null !== this._currents[i]) return true;
        return false;
      };
      PopupManager_dev._prefabMap = new Map();
      PopupManager_dev._nodeMap = new Map();
      PopupManager_dev._queue = [];
      PopupManager_dev._currents = [];
      PopupManager_dev.reserved = false;
      PopupManager_dev.hidByForce = false;
      PopupManager_dev.interval = .1;
      PopupManager_dev.loadStartCallback = null;
      PopupManager_dev.loadFinishCallback = null;
      return PopupManager_dev;
    }();
    exports.default = PopupManager_dev;
    var PopupShowPriority;
    (function(PopupShowPriority) {
      PopupShowPriority[PopupShowPriority["None"] = 1] = "None";
      PopupShowPriority[PopupShowPriority["Prior"] = 2] = "Prior";
      PopupShowPriority[PopupShowPriority["Force"] = 3] = "Force";
      PopupShowPriority[PopupShowPriority["Cover"] = 4] = "Cover";
    })(PopupShowPriority = exports.PopupShowPriority || (exports.PopupShowPriority = {}));
    var PopupShowResult;
    (function(PopupShowResult) {
      PopupShowResult[PopupShowResult["Done"] = 1] = "Done";
      PopupShowResult[PopupShowResult["Fail"] = 2] = "Fail";
      PopupShowResult[PopupShowResult["Wait"] = 3] = "Wait";
      PopupShowResult[PopupShowResult["Dirty"] = 4] = "Dirty";
    })(PopupShowResult = exports.PopupShowResult || (exports.PopupShowResult = {}));
    var PopupCacheMode;
    (function(PopupCacheMode) {
      PopupCacheMode[PopupCacheMode["Once"] = 1] = "Once";
      PopupCacheMode[PopupCacheMode["Normal"] = 2] = "Normal";
      PopupCacheMode[PopupCacheMode["Frequent"] = 3] = "Frequent";
    })(PopupCacheMode = exports.PopupCacheMode || (exports.PopupCacheMode = {}));
    cc._RF.pop();
  }, {
    "../components/popups/PopupBase": "PopupBase"
  } ],
  PopupManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "50eaawLPZRENJEcGEpVVJKs", "PopupManager");
    "use strict";
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PopupCacheMode = exports.PopupShowResult = void 0;
    var PopupBase_1 = require("../components/popups/PopupBase");
    var PopupManager = function() {
      function PopupManager() {}
      Object.defineProperty(PopupManager, "prefabMap", {
        get: function() {
          return this._prefabMap;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager, "nodeMap", {
        get: function() {
          return this._nodeMap;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager, "queue", {
        get: function() {
          return this._queue;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(PopupManager, "current", {
        get: function() {
          return this._current;
        },
        enumerable: false,
        configurable: true
      });
      PopupManager.show = function(path, options, mode, priority) {
        var _this = this;
        void 0 === options && (options = null);
        void 0 === mode && (mode = PopupCacheMode.Normal);
        void 0 === priority && (priority = false);
        return new Promise(function(res) {
          return __awaiter(_this, void 0, void 0, function() {
            var node, prefab, popup;
            var _this = this;
            return __generator(this, function(_a) {
              switch (_a.label) {
               case 0:
                if (this._current || this.lockedForNext) {
                  this.push(path, options, mode, priority);
                  return [ 2, res(PopupShowResult.Wait) ];
                }
                this._current = {
                  path: path,
                  options: options,
                  mode: mode
                };
                node = this.getNodeFromCache(path);
                if (!!cc.isValid(node)) return [ 3, 2 ];
                this.loadStartCallback && this.loadStartCallback();
                return [ 4, this.load(path) ];

               case 1:
                prefab = _a.sent();
                this.loadFinishCallback && this.loadFinishCallback();
                if (!cc.isValid(prefab)) {
                  cc.warn("[PopupManager]", "\u5f39\u7a97\u52a0\u8f7d\u5931\u8d25", path);
                  this._current = null;
                  return [ 2, res(PopupShowResult.Fail) ];
                }
                node = cc.instantiate(prefab);
                _a.label = 2;

               case 2:
                this._current.node = node;
                node.setParent(this.container || cc.Canvas.instance.node);
                node.setSiblingIndex(cc.macro.MAX_ZINDEX);
                popup = node.getComponent(PopupBase_1.default);
                if (popup) {
                  this._current.popup = popup;
                  popup.setFinishCallback(function() {
                    return __awaiter(_this, void 0, void 0, function() {
                      var _this = this;
                      return __generator(this, function(_a) {
                        switch (_a.label) {
                         case 0:
                          this.lockedForNext = this._queue.length > 0;
                          this.recycle(path, node, mode);
                          this._current = null;
                          res(PopupShowResult.Done);
                          return [ 4, new Promise(function(res) {
                            cc.Canvas.instance.scheduleOnce(res, _this.interval);
                          }) ];

                         case 1:
                          _a.sent();
                          this.next();
                          return [ 2 ];
                        }
                      });
                    });
                  });
                  popup.show(options);
                } else {
                  node.active = true;
                  res(PopupShowResult.Dirty);
                }
                return [ 2 ];
              }
            });
          });
        });
      };
      PopupManager.hideCurrent = function() {
        if (this._current.popup) this._current.popup.hide(); else if (this._current.node) {
          this._current.node.destroy();
          this.release(this._current.path);
          this._current = null;
        }
      };
      PopupManager.getNodeFromCache = function(path) {
        if (this._nodeMap.has(path)) {
          var node = this._nodeMap.get(path);
          if (cc.isValid(node)) return node;
          this._nodeMap.delete(path);
        }
        if (this._prefabMap.has(path)) {
          var prefab = this._prefabMap.get(path);
          if (cc.isValid(prefab)) return cc.instantiate(prefab);
          this._prefabMap.delete(path);
        }
        return null;
      };
      PopupManager.next = function() {
        if (this._current || 0 === this._queue.length) return;
        var request = this._queue.shift();
        this.lockedForNext = false;
        this.show(request.path, request.options, request.mode);
      };
      PopupManager.push = function(path, options, mode, priority) {
        void 0 === options && (options = null);
        void 0 === mode && (mode = PopupCacheMode.Normal);
        void 0 === priority && (priority = false);
        if (!this._current && !this.lockedForNext) {
          this.show(path, options, mode);
          return;
        }
        priority ? this._queue.unshift({
          path: path,
          options: options,
          mode: mode
        }) : this._queue.push({
          path: path,
          options: options,
          mode: mode
        });
      };
      PopupManager.recycle = function(path, node, mode) {
        switch (mode) {
         case PopupCacheMode.Once:
          node.destroy();
          this._nodeMap.has(path) && this._nodeMap.delete(path);
          this.release(path);
          break;

         case PopupCacheMode.Normal:
          node.destroy();
          this._nodeMap.has(path) && this._nodeMap.delete(path);
          break;

         case PopupCacheMode.Frequent:
          node.removeFromParent(false);
          this._nodeMap.has(path) || this._nodeMap.set(path, node);
        }
      };
      PopupManager.load = function(path) {
        var _this = this;
        return new Promise(function(res) {
          if (_this._prefabMap.has(path)) return res(_this._prefabMap.get(path));
          cc.resources.load(path, function(error, prefab) {
            if (error) res(null); else {
              prefab.addRef();
              _this._prefabMap.set(path, prefab);
              res(prefab);
            }
          });
        });
      };
      PopupManager.release = function(path) {
        var node = this._nodeMap.get(path);
        if (node) {
          this._nodeMap.delete(path);
          cc.isValid(node) && node.destroy();
          node = null;
        }
        var prefab = this._prefabMap.get(path);
        if (prefab) {
          this._prefabMap.delete(path);
          prefab.decRef();
          prefab = null;
        }
      };
      PopupManager._prefabMap = new Map();
      PopupManager._nodeMap = new Map();
      PopupManager._queue = [];
      PopupManager._current = null;
      PopupManager.lockedForNext = false;
      PopupManager.container = null;
      PopupManager.interval = .1;
      PopupManager.loadStartCallback = null;
      PopupManager.loadFinishCallback = null;
      return PopupManager;
    }();
    exports.default = PopupManager;
    var PopupShowResult;
    (function(PopupShowResult) {
      PopupShowResult[PopupShowResult["Done"] = 1] = "Done";
      PopupShowResult[PopupShowResult["Fail"] = 2] = "Fail";
      PopupShowResult[PopupShowResult["Wait"] = 3] = "Wait";
      PopupShowResult[PopupShowResult["Dirty"] = 4] = "Dirty";
    })(PopupShowResult = exports.PopupShowResult || (exports.PopupShowResult = {}));
    var PopupCacheMode;
    (function(PopupCacheMode) {
      PopupCacheMode[PopupCacheMode["Once"] = 1] = "Once";
      PopupCacheMode[PopupCacheMode["Normal"] = 2] = "Normal";
      PopupCacheMode[PopupCacheMode["Frequent"] = 3] = "Frequent";
    })(PopupCacheMode = exports.PopupCacheMode || (exports.PopupCacheMode = {}));
    cc._RF.pop();
  }, {
    "../components/popups/PopupBase": "PopupBase"
  } ],
  PopupTest: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "38e54J2q41JyIOt2ki5tkk4", "PopupTest");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupManager_1 = require("../../../../eazax-ccc/core/PopupManager");
    var TestPopup_1 = require("./TestPopup");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PopupTest = function(_super) {
      __extends(PopupTest, _super);
      function PopupTest() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.btn = null;
        return _this;
      }
      PopupTest.prototype.onLoad = function() {
        this.registerEvent();
      };
      PopupTest.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      PopupTest.prototype.registerEvent = function() {
        this.btn.on(cc.Node.EventType.TOUCH_END, this.onClick, this);
      };
      PopupTest.prototype.unregisterEvent = function() {
        this.btn.off(cc.Node.EventType.TOUCH_END, this.onClick, this);
      };
      PopupTest.prototype.onClick = function() {
        var options = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        PopupManager_1.default.show(TestPopup_1.default.path, options, PopupManager_1.PopupCacheMode.Frequent, false);
      };
      __decorate([ property(cc.Node) ], PopupTest.prototype, "btn", void 0);
      PopupTest = __decorate([ ccclass ], PopupTest);
      return PopupTest;
    }(cc.Component);
    exports.default = PopupTest;
    cc._RF.pop();
  }, {
    "../../../../eazax-ccc/core/PopupManager": "PopupManager",
    "./TestPopup": "TestPopup"
  } ],
  PromiseUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7c127O4BelOEJ0va+YPLUah", "PromiseUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PromiseUtil = function() {
      function PromiseUtil() {}
      PromiseUtil.wait = function(time) {
        return new Promise(function(res) {
          return cc.Canvas.instance.scheduleOnce(res, time);
        });
      };
      return PromiseUtil;
    }();
    exports.default = PromiseUtil;
    cc._RF.pop();
  }, {} ],
  RadarChartController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "76fc5oxGitDSogggrj2rphY", "RadarChartController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    var __spreadArrays = this && this.__spreadArrays || function() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
      for (var r = Array(s), k = 0, i = 0; i < il; i++) for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, 
      k++) r[k] = a[j];
      return r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var RadarChart_1 = require("../../../../eazax-ccc/components/RadarChart");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RadarChartController = function(_super) {
      __extends(RadarChartController, _super);
      function RadarChartController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.radarChart = null;
        _this.timeEditBox = null;
        _this.randomBtn = null;
        _this.lengthEditBox = null;
        _this.axesEditBox = null;
        _this.drawAxesToggle = null;
        _this.drawDataJoinToggle = null;
        _this.nodesEditBox = null;
        _this.lineWidthEditBox = null;
        _this.innerLineWidthEditBox = null;
        _this.data1EditBox = null;
        _this.data2EditBox = null;
        return _this;
      }
      RadarChartController.prototype.onLoad = function() {
        this.registerEvent();
      };
      RadarChartController.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      RadarChartController.prototype.registerEvent = function() {
        this.randomBtn.on(cc.Node.EventType.TOUCH_END, this.onRandomBtnClick, this);
        this.lengthEditBox.node.on("text-changed", this.onAxixLengthChanged, this);
        this.axesEditBox.node.on("text-changed", this.onAxesChanged, this);
        this.drawAxesToggle.node.on("toggle", this.onDrawAxesChanged, this);
        this.drawDataJoinToggle.node.on("toggle", this.onDrawDataJoinChanged, this);
        this.nodesEditBox.node.on("text-changed", this.onAxisScalesChanged, this);
        this.lineWidthEditBox.node.on("text-changed", this.onLineWidthChanged, this);
        this.innerLineWidthEditBox.node.on("text-changed", this.onInnerLineWidthChanged, this);
        this.data1EditBox.node.on("text-changed", this.onDataChanged, this);
        this.data2EditBox.node.on("text-changed", this.onDataChanged, this);
      };
      RadarChartController.prototype.unregisterEvent = function() {
        this.randomBtn.off(cc.Node.EventType.TOUCH_END, this.onRandomBtnClick, this);
        this.lengthEditBox.node.off("text-changed", this.onAxixLengthChanged, this);
        this.axesEditBox.node.off("text-changed", this.onAxesChanged, this);
        this.drawAxesToggle.node.off("toggle", this.onDrawAxesChanged, this);
        this.drawDataJoinToggle.node.off("toggle", this.onDrawDataJoinChanged, this);
        this.nodesEditBox.node.off("text-changed", this.onAxisScalesChanged, this);
        this.lineWidthEditBox.node.off("text-changed", this.onLineWidthChanged, this);
        this.innerLineWidthEditBox.node.off("text-changed", this.onInnerLineWidthChanged, this);
        this.data1EditBox.node.off("text-changed", this.onDataChanged, this);
        this.data2EditBox.node.off("text-changed", this.onDataChanged, this);
      };
      RadarChartController.prototype.onRandomBtnClick = function() {
        return __awaiter(this, void 0, void 0, function() {
          var datas, i, numbers, j, data, time;
          return __generator(this, function(_a) {
            eazax.log("[RadarChartController]", "Random Data");
            datas = [];
            for (i = 0; i < this.radarChart.curDatas.length; i++) {
              numbers = [];
              for (j = 0; j < this.radarChart.curDatas[0].values.length; j++) numbers.push(.8 * Math.random() + .2);
              data = {
                values: i % 2 === 0 ? numbers : numbers.reverse(),
                lineWidth: 6,
                lineColor: this.getRandomColor(255),
                fillColor: this.getRandomColor(100)
              };
              datas.push(data);
            }
            console.log(datas);
            time = parseFloat(this.timeEditBox.string);
            time < 0 || isNaN(time) ? time = .5 : time > 100 && (time = 100);
            this.timeEditBox.string = time.toString();
            this.radarChart.to(datas, time);
            return [ 2 ];
          });
        });
      };
      RadarChartController.prototype.getRandomColor = function(a) {
        var rgb = [ 205 * Math.random() + 50, 205 * Math.random() + 50, 205 * Math.random() + 50 ];
        rgb.sort(function() {
          return .5 - Math.random();
        });
        return cc.color.apply(cc, __spreadArrays(rgb, [ a ]));
      };
      RadarChartController.prototype.onAxixLengthChanged = function(editbox) {
        var number = parseFloat(editbox.string);
        (number < 10 || number > 1e3 || isNaN(number)) && (number = 300);
        this.radarChart.axisLength = number;
        editbox.string = this.radarChart.axisLength.toString();
      };
      RadarChartController.prototype.onAxesChanged = function(editbox) {
        var number = parseFloat(editbox.string);
        number < 3 || isNaN(number) ? number = 3 : number > 500 && (number = 500);
        var axes = Math.floor(number);
        this.radarChart.axes = axes;
        editbox.string = this.radarChart.axes.toString();
      };
      RadarChartController.prototype.onDrawAxesChanged = function(toggle) {
        this.radarChart.drawAxes = toggle.isChecked;
      };
      RadarChartController.prototype.onDrawDataJoinChanged = function(toggle) {
        this.radarChart.drawDataJoin = toggle.isChecked;
      };
      RadarChartController.prototype.onAxisScalesChanged = function(editbox) {
        var number = parseFloat(editbox.string);
        number < 1 || isNaN(number) ? number = 1 : number > 200 && (number = 200);
        var axes = Math.floor(number);
        this.radarChart.axisScales = axes;
        editbox.string = this.radarChart.axisScales.toString();
      };
      RadarChartController.prototype.onLineWidthChanged = function(editbox) {
        var number = parseFloat(editbox.string);
        number < .1 || isNaN(number) ? number = 4 : number > 100 && (number = 100);
        this.radarChart.gridLineWidth = number;
        editbox.string = this.radarChart.gridLineWidth.toString();
      };
      RadarChartController.prototype.onInnerLineWidthChanged = function(editbox) {
        var number = parseFloat(editbox.string);
        number < .1 || isNaN(number) ? number = 4 : number > 100 && (number = 100);
        this.radarChart.innerGridLineWidth = number;
        editbox.string = this.radarChart.innerGridLineWidth.toString();
      };
      RadarChartController.prototype.onDataChanged = function(editbox) {
        this.radarChart.dataValuesStrings = [ this.data1EditBox.string, this.data2EditBox.string ];
      };
      __decorate([ property(RadarChart_1.default) ], RadarChartController.prototype, "radarChart", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "timeEditBox", void 0);
      __decorate([ property(cc.Node) ], RadarChartController.prototype, "randomBtn", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "lengthEditBox", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "axesEditBox", void 0);
      __decorate([ property(cc.Toggle) ], RadarChartController.prototype, "drawAxesToggle", void 0);
      __decorate([ property(cc.Toggle) ], RadarChartController.prototype, "drawDataJoinToggle", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "nodesEditBox", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "lineWidthEditBox", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "innerLineWidthEditBox", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "data1EditBox", void 0);
      __decorate([ property(cc.EditBox) ], RadarChartController.prototype, "data2EditBox", void 0);
      RadarChartController = __decorate([ ccclass ], RadarChartController);
      return RadarChartController;
    }(cc.Component);
    exports.default = RadarChartController;
    cc._RF.pop();
  }, {
    "../../../../eazax-ccc/components/RadarChart": "RadarChart"
  } ],
  RadarChart: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "37a55PFvLVK3bflj3g4a2rl", "RadarChart");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, executeInEditMode = _a.executeInEditMode, executionOrder = _a.executionOrder;
    var RadarChart = function(_super) {
      __extends(RadarChart, _super);
      function RadarChart() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.target = null;
        _this._axisLength = 200;
        _this._axes = 6;
        _this._axisScales = 3;
        _this._drawAxes = true;
        _this._gridLineWidth = 4;
        _this._innerGridLineWidth = 4;
        _this._gridLineColor = cc.Color.GRAY;
        _this._gridFillColor = cc.color(100, 100, 100, 100);
        _this._dataValuesStrings = [ "0.8,0.5,0.6,0.5,0.8,0.6", "0.5,0.9,0.5,0.8,0.5,0.9" ];
        _this._dataLineWidths = [ 5, 5 ];
        _this._dataLineColors = [ cc.Color.BLUE, cc.Color.RED ];
        _this._dataFillColors = [ cc.color(120, 120, 180, 100), cc.color(180, 120, 120, 100) ];
        _this._dataJoinColors = [];
        _this._drawDataJoin = true;
        _this.graphics = null;
        _this.keepUpdating = false;
        _this.angles = null;
        _this._curDatas = [];
        _this.toRes = null;
        return _this;
      }
      Object.defineProperty(RadarChart.prototype, "axisLength", {
        get: function() {
          return this._axisLength;
        },
        set: function(value) {
          this._axisLength = value;
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "axes", {
        get: function() {
          return this._axes;
        },
        set: function(value) {
          this._axes = Math.floor(value >= 3 ? value : 3);
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "axisScales", {
        get: function() {
          return this._axisScales;
        },
        set: function(value) {
          this._axisScales = Math.floor(value >= 1 ? value : 1);
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "drawAxes", {
        get: function() {
          return this._drawAxes;
        },
        set: function(value) {
          this._drawAxes = value;
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "gridLineWidth", {
        get: function() {
          return this._gridLineWidth;
        },
        set: function(value) {
          this._gridLineWidth = value;
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "innerGridLineWidth", {
        get: function() {
          return this._innerGridLineWidth;
        },
        set: function(value) {
          this._innerGridLineWidth = value;
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "gridLineColor", {
        get: function() {
          return this._gridLineColor;
        },
        set: function(value) {
          this._gridLineColor = value;
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "gridFillColor", {
        get: function() {
          return this._gridFillColor;
        },
        set: function(value) {
          this._gridFillColor = value;
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "dataValuesStrings", {
        get: function() {
          return this._dataValuesStrings;
        },
        set: function(value) {
          this._dataValuesStrings = value;
          this.drawWithProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "dataLineWidths", {
        get: function() {
          return this._dataLineWidths;
        },
        set: function(value) {
          this._dataLineWidths = value;
          this.drawWithProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "dataLineColors", {
        get: function() {
          return this._dataLineColors;
        },
        set: function(value) {
          this._dataLineColors = value;
          this.drawWithProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "dataFillColors", {
        get: function() {
          return this._dataFillColors;
        },
        set: function(value) {
          this._dataFillColors = value;
          this.drawWithProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "dataJoinColors", {
        get: function() {
          return this._dataJoinColors;
        },
        set: function(value) {
          this._dataJoinColors = value;
          this.drawWithProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "drawDataJoin", {
        get: function() {
          return this._drawDataJoin;
        },
        set: function(value) {
          this._drawDataJoin = value;
          this.draw(this.curDatas);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(RadarChart.prototype, "curDatas", {
        get: function() {
          return this._curDatas;
        },
        enumerable: false,
        configurable: true
      });
      RadarChart.prototype.onLoad = function() {
        this.init();
        this.drawWithProperties();
      };
      RadarChart.prototype.update = function() {
        if (!this.keepUpdating || 0 === this._curDatas.length) return;
        this.draw(this._curDatas);
      };
      RadarChart.prototype.init = function() {
        this.target || (this.target = this.node);
        this.graphics = this.target.getComponent(cc.Graphics) || this.target.addComponent(cc.Graphics);
        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
      };
      RadarChart.prototype.drawWithProperties = function() {
        var datas = [];
        for (var i = 0; i < this.dataValuesStrings.length; i++) datas.push({
          values: this.processValuesString(this.dataValuesStrings[i]),
          lineWidth: this._dataLineWidths[i] || defaultOptions.lineWidth,
          lineColor: this._dataLineColors[i] || defaultOptions.lineColor,
          fillColor: this._dataFillColors[i] || defaultOptions.fillColor,
          joinColor: this._dataJoinColors[i] || defaultOptions.joinColor
        });
        this.draw(datas);
      };
      RadarChart.prototype.processValuesString = function(valuesString) {
        var strings = valuesString.split(",");
        var values = [];
        for (var j = 0; j < strings.length; j++) {
          var value = parseFloat(strings[j]);
          values.push(isNaN(value) ? 0 : value);
        }
        return values;
      };
      RadarChart.prototype.drawBase = function() {
        this.graphics.lineWidth = this._gridLineWidth;
        this.graphics.strokeColor = this._gridLineColor;
        this.graphics.fillColor = this._gridFillColor;
        this.angles = [];
        var iAngle = 360 / this.axes;
        for (var i = 0; i < this.axes; i++) this.angles.push(iAngle * i);
        var scalesSet = [];
        var iLength = this._axisLength / this._axisScales;
        for (var i = 0; i < this._axisScales; i++) {
          var scales = [];
          var length = this._axisLength - iLength * i;
          for (var j = 0; j < this.angles.length; j++) {
            var radian = Math.PI / 180 * this.angles[j];
            scales.push(cc.v2(length * Math.cos(radian), length * Math.sin(radian)));
          }
          scalesSet.push(scales);
        }
        if (this._drawAxes) for (var i = 0; i < scalesSet[0].length; i++) {
          this.graphics.moveTo(0, 0);
          this.graphics.lineTo(scalesSet[0][i].x, scalesSet[0][i].y);
        }
        this.graphics.moveTo(scalesSet[0][0].x, scalesSet[0][0].y);
        for (var i = 1; i < scalesSet[0].length; i++) this.graphics.lineTo(scalesSet[0][i].x, scalesSet[0][i].y);
        this.graphics.close();
        this.graphics.fill();
        this.graphics.stroke();
        if (scalesSet.length > 1) {
          this.graphics.lineWidth = this._innerGridLineWidth;
          for (var i = 1; i < scalesSet.length; i++) {
            this.graphics.moveTo(scalesSet[i][0].x, scalesSet[i][0].y);
            for (var j = 1; j < scalesSet[i].length; j++) this.graphics.lineTo(scalesSet[i][j].x, scalesSet[i][j].y);
            this.graphics.close();
          }
          this.graphics.stroke();
        }
      };
      RadarChart.prototype.draw = function(data) {
        this.graphics.clear();
        this.drawBase();
        var datas = Array.isArray(data) ? data : [ data ];
        this._curDatas = datas;
        this.resizeCurDatasValues(0);
        for (var i = 0; i < datas.length; i++) {
          this.graphics.strokeColor = datas[i].lineColor || defaultOptions.lineColor;
          this.graphics.fillColor = datas[i].fillColor || defaultOptions.fillColor;
          this.graphics.lineWidth = datas[i].lineWidth || defaultOptions.lineWidth;
          var coords = [];
          for (var j = 0; j < this.axes; j++) {
            var length = (datas[i].values[j] > 1 ? 1 : datas[i].values[j]) * this.axisLength;
            var radian = Math.PI / 180 * this.angles[j];
            coords.push(cc.v2(length * Math.cos(radian), length * Math.sin(radian)));
          }
          this.graphics.moveTo(coords[0].x, coords[0].y);
          for (var j = 1; j < coords.length; j++) this.graphics.lineTo(coords[j].x, coords[j].y);
          this.graphics.close();
          this.graphics.fill();
          this.graphics.stroke();
          if (this._drawDataJoin) for (var j = 0; j < coords.length; j++) {
            this.graphics.strokeColor = datas[i].lineColor || defaultOptions.lineColor;
            this.graphics.circle(coords[j].x, coords[j].y, 2);
            this.graphics.stroke();
            this.graphics.strokeColor = datas[i].joinColor || defaultOptions.joinColor;
            this.graphics.circle(coords[j].x, coords[j].y, .65);
            this.graphics.stroke();
          }
        }
      };
      RadarChart.prototype.to = function(data, duration) {
        var _this = this;
        return new Promise(function(res) {
          var _a;
          _this.unscheduleAllCallbacks();
          _this.toRes && _this.toRes();
          _this.toRes = res;
          var datas = Array.isArray(data) ? data : [ data ];
          _this.keepUpdating = true;
          for (var i = 0; i < datas.length; i++) {
            if (!_this._curDatas[i]) continue;
            for (var j = 0; j < _this._curDatas[i].values.length; j++) cc.tween(_this._curDatas[i].values).to(duration, (_a = {}, 
            _a[j] = datas[i].values[j] > 1 ? 1 : datas[i].values[j], _a)).start();
            cc.tween(_this._curDatas[i]).to(duration, {
              lineWidth: datas[i].lineWidth || _this._curDatas[i].lineWidth,
              lineColor: datas[i].lineColor || _this._curDatas[i].lineColor,
              fillColor: datas[i].fillColor || _this._curDatas[i].fillColor,
              joinColor: datas[i].joinColor || _this._curDatas[i].joinColor
            }).start();
          }
          _this.scheduleOnce(function() {
            _this.keepUpdating = false;
            _this.toRes();
            _this.toRes = null;
          }, duration);
        });
      };
      RadarChart.prototype.resizeCurDatasValues = function(fill) {
        void 0 === fill && (fill = 0);
        for (var i = 0; i < this._curDatas.length; i++) if (this._curDatas[i].values.length < this._axes) {
          var diff = this._axes - this._curDatas[i].values.length;
          for (var j = 0; j < diff; j++) this._curDatas[i].values.push(fill);
        }
      };
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], RadarChart.prototype, "target", void 0);
      __decorate([ property ], RadarChart.prototype, "_axisLength", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "axisLength", null);
      __decorate([ property ], RadarChart.prototype, "_axes", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "axes", null);
      __decorate([ property ], RadarChart.prototype, "_axisScales", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "axisScales", null);
      __decorate([ property ], RadarChart.prototype, "_drawAxes", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "drawAxes", null);
      __decorate([ property ], RadarChart.prototype, "_gridLineWidth", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "gridLineWidth", null);
      __decorate([ property ], RadarChart.prototype, "_innerGridLineWidth", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "innerGridLineWidth", null);
      __decorate([ property ], RadarChart.prototype, "_gridLineColor", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "gridLineColor", null);
      __decorate([ property ], RadarChart.prototype, "_gridFillColor", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "gridFillColor", null);
      __decorate([ property ], RadarChart.prototype, "_dataValuesStrings", void 0);
      __decorate([ property({
        type: [ cc.String ],
        tooltip: false
      }) ], RadarChart.prototype, "dataValuesStrings", null);
      __decorate([ property ], RadarChart.prototype, "_dataLineWidths", void 0);
      __decorate([ property({
        type: [ cc.Integer ],
        tooltip: false
      }) ], RadarChart.prototype, "dataLineWidths", null);
      __decorate([ property ], RadarChart.prototype, "_dataLineColors", void 0);
      __decorate([ property({
        type: [ cc.Color ],
        tooltip: false
      }) ], RadarChart.prototype, "dataLineColors", null);
      __decorate([ property ], RadarChart.prototype, "_dataFillColors", void 0);
      __decorate([ property({
        type: [ cc.Color ],
        tooltip: false
      }) ], RadarChart.prototype, "dataFillColors", null);
      __decorate([ property ], RadarChart.prototype, "_dataJoinColors", void 0);
      __decorate([ property({
        type: [ cc.Color ],
        tooltip: false
      }) ], RadarChart.prototype, "dataJoinColors", null);
      __decorate([ property ], RadarChart.prototype, "_drawDataJoin", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RadarChart.prototype, "drawDataJoin", null);
      RadarChart = __decorate([ ccclass, executeInEditMode, executionOrder(-10) ], RadarChart);
      return RadarChart;
    }(cc.Component);
    exports.default = RadarChart;
    var defaultOptions = {
      lineWidth: 5,
      lineColor: cc.Color.BLUE,
      fillColor: cc.color(120, 120, 180, 100),
      joinColor: cc.Color.WHITE
    };
    cc._RF.pop();
  }, {} ],
  RainbowBrush: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7efa2Ur7ddBHaUWPfAVg3Gy", "RainbowBrush");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RainbowBrush = function(_super) {
      __extends(RainbowBrush, _super);
      function RainbowBrush() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.graphics = null;
        _this.material = null;
        return _this;
      }
      RainbowBrush.prototype.onLoad = function() {
        this.init();
        this.registerEvent();
      };
      RainbowBrush.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      RainbowBrush.prototype.init = function() {
        this.graphics = this.node.getComponent(cc.Graphics) || this.node.addComponent(cc.Graphics);
        this.graphics.strokeColor = cc.Color.WHITE;
        this.graphics.lineJoin = cc.Graphics.LineJoin.ROUND;
        this.graphics.lineCap = cc.Graphics.LineCap.ROUND;
        this.graphics.lineWidth = 20;
        this.material = this.graphics.getMaterial(0);
        this.material.setProperty("size", this.getNodeSize());
      };
      RainbowBrush.prototype.registerEvent = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
      };
      RainbowBrush.prototype.unregisterEvent = function() {
        this.node.targetOff(this);
      };
      RainbowBrush.prototype.onTouchStart = function(event) {
        var pos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.graphics.moveTo(pos.x - 5, pos.y);
        this.graphics.circle(pos.x - 5, pos.y, 1);
        this.graphics.stroke();
        this.graphics.moveTo(pos.x - 5, pos.y);
      };
      RainbowBrush.prototype.onTouchMove = function(event) {
        var pos = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        this.graphics.lineTo(pos.x - 5, pos.y);
        this.graphics.stroke();
        this.graphics.moveTo(pos.x - 5, pos.y);
      };
      RainbowBrush.prototype.getNodeSize = function() {
        return cc.v2(this.node.width, this.node.height);
      };
      RainbowBrush = __decorate([ ccclass ], RainbowBrush);
      return RainbowBrush;
    }(cc.Component);
    exports.default = RainbowBrush;
    cc._RF.pop();
  }, {} ],
  RegexUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "96a04sFvMhOMqfue6e/AFZD", "RegexUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var RegexUtil = function() {
      function RegexUtil() {}
      RegexUtil.isDWORD = function(string) {
        return /[^\x00-\xff]/.test(string);
      };
      return RegexUtil;
    }();
    exports.default = RegexUtil;
    cc._RF.pop();
  }, {} ],
  ResPopupItemInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "16c3cfuVoNGu461eBK2NvRw", "ResPopupItemInfo");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ResPopupItemInfo = function() {
      function ResPopupItemInfo() {
        this.title = "";
        this.url = "";
      }
      __decorate([ property() ], ResPopupItemInfo.prototype, "title", void 0);
      __decorate([ property() ], ResPopupItemInfo.prototype, "url", void 0);
      ResPopupItemInfo = __decorate([ ccclass("ResPopupItemInfo") ], ResPopupItemInfo);
      return ResPopupItemInfo;
    }();
    exports.default = ResPopupItemInfo;
    cc._RF.pop();
  }, {} ],
  ResPopupItem: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7b337W92WlCu6btwC1TvGOE", "ResPopupItem");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ClickToLoadUrl_1 = require("../../ClickToLoadUrl");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ResPopupItem = function(_super) {
      __extends(ResPopupItem, _super);
      function ResPopupItem() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.typeLabel = null;
        _this.nameLabel = null;
        _this.clicker = null;
        return _this;
      }
      ResPopupItem.prototype.set = function(name, url) {
        var extname = name.slice(name.lastIndexOf("."));
        this.typeLabel.string = SymbolMap[extname] || "\ud83d\udce6";
        this.nameLabel.string = name;
        this.clicker.url = url;
      };
      __decorate([ property(cc.Label) ], ResPopupItem.prototype, "typeLabel", void 0);
      __decorate([ property(cc.Label) ], ResPopupItem.prototype, "nameLabel", void 0);
      __decorate([ property(ClickToLoadUrl_1.default) ], ResPopupItem.prototype, "clicker", void 0);
      ResPopupItem = __decorate([ ccclass ], ResPopupItem);
      return ResPopupItem;
    }(cc.Component);
    exports.default = ResPopupItem;
    var SymbolMap = {
      ".ts": "\ud83d\udcc4",
      ".effect": "\ud83c\udfa8"
    };
    cc._RF.pop();
  }, {
    "../../ClickToLoadUrl": "ClickToLoadUrl"
  } ],
  ResPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "342f2b0zQFF/YtFsX6a3E70", "ResPopup");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("../../../../eazax-ccc/components/popups/PopupBase");
    var ResPopupItem_1 = require("./ResPopupItem");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ResPopup = function(_super) {
      __extends(ResPopup, _super);
      function ResPopup() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.closeBtn = null;
        _this.content = null;
        _this.item = null;
        _this.items = [];
        return _this;
      }
      Object.defineProperty(ResPopup, "path", {
        get: function() {
          return "prefabs/ResPopup";
        },
        enumerable: false,
        configurable: true
      });
      ResPopup.prototype.onLoad = function() {
        this.registerEvent();
      };
      ResPopup.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      ResPopup.prototype.registerEvent = function() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick, this);
      };
      ResPopup.prototype.unregisterEvent = function() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick, this);
      };
      ResPopup.prototype.updateDisplay = function(options) {
        var count = Math.max(options.items.length, this.items.length);
        for (var i = 0; i < count; i++) if (options.items[i] && !this.items[i]) {
          var node = cc.instantiate(this.item);
          node.setParent(this.content);
          var item = node.getComponent(ResPopupItem_1.default);
          item.set(options.items[i].name, options.items[i].url);
          item.node.active = true;
          this.items.push(item);
        } else if (options.items[i] && this.items[i]) {
          var item = this.items[i];
          item.set(options.items[i].name, options.items[i].url);
          item.node.active = true;
        } else this.items[i].node.active = false;
      };
      ResPopup.prototype.onCloseBtnClick = function() {
        this.hide();
      };
      __decorate([ property(cc.Node) ], ResPopup.prototype, "closeBtn", void 0);
      __decorate([ property(cc.Node) ], ResPopup.prototype, "content", void 0);
      __decorate([ property(cc.Prefab) ], ResPopup.prototype, "item", void 0);
      ResPopup = __decorate([ ccclass ], ResPopup);
      return ResPopup;
    }(PopupBase_1.default);
    exports.default = ResPopup;
    cc._RF.pop();
  }, {
    "../../../../eazax-ccc/components/popups/PopupBase": "PopupBase",
    "./ResPopupItem": "ResPopupItem"
  } ],
  ResourceManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6ede1lrUyJKG43/vR0bFL0z", "ResourceManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ResourceManager = function() {
      function ResourceManager() {}
      Object.defineProperty(ResourceManager, "resMap", {
        get: function() {
          return this._resMap;
        },
        enumerable: false,
        configurable: true
      });
      ResourceManager.load = function(path) {
        var _this = this;
        return new Promise(function(res) {
          var cache = _this._resMap.get(path);
          if (cache) return res(cache);
          cc.resources.load(path, function(error, asset) {
            if (error) {
              cc.log("[ResourceManager]", "\u52a0\u8f7d\u5931\u8d25", path);
              return res(null);
            }
            _this._resMap.set(path, asset);
            res(asset);
          });
        });
      };
      ResourceManager.get = function(path) {
        return this._resMap.get(path);
      };
      ResourceManager.has = function(path) {
        return this._resMap.has(path);
      };
      ResourceManager.release = function() {};
      ResourceManager.getDepsRecursively = function(uuid) {
        return cc.assetManager.dependUtil.getDepsRecursively(uuid);
      };
      ResourceManager._resMap = new Map();
      return ResourceManager;
    }();
    exports.default = ResourceManager;
    cc._RF.pop();
  }, {} ],
  RotateAround: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f3903fJFh9D85nIWFGQJpbF", "RotateAround");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Axis = void 0;
    var Axis;
    (function(Axis) {
      Axis[Axis["PositiveX"] = 0] = "PositiveX";
      Axis[Axis["PositiveY"] = 1] = "PositiveY";
      Axis[Axis["NegativeX"] = 2] = "NegativeX";
      Axis[Axis["NegativeY"] = 3] = "NegativeY";
    })(Axis = exports.Axis || (exports.Axis = {}));
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RotateAround = function(_super) {
      __extends(RotateAround, _super);
      function RotateAround() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.target = null;
        _this.clockwise = true;
        _this.timePerRound = 10;
        _this.faceToTarget = false;
        _this.faceAxis = Axis.NegativeY;
        _this.autoStart = false;
        _this.angle = 0;
        _this.radius = 0;
        _this.isRotating = false;
        return _this;
      }
      RotateAround.prototype.start = function() {
        this.autoStart && this.run();
      };
      RotateAround.prototype.update = function(dt) {
        if (!this.isRotating || !this.target) return;
        var radian = Math.PI / 180 * this.angle;
        this.node.x = this.target.x + this.radius * Math.cos(radian);
        this.node.y = this.target.y + this.radius * Math.sin(radian);
        if (this.faceToTarget) switch (this.faceAxis) {
         case Axis.PositiveX:
          this.node.angle = this.angle + 180;
          break;

         case Axis.PositiveY:
          this.node.angle = this.angle + 90;
          break;

         case Axis.NegativeX:
          this.node.angle = this.angle;
          break;

         case Axis.NegativeY:
          this.node.angle = this.angle - 90;
        }
        var anglePerFrame = dt * (360 / this.timePerRound);
        this.clockwise ? this.angle -= anglePerFrame : this.angle += anglePerFrame;
        this.angle >= 360 ? this.angle %= 360 : this.angle <= -360 && (this.angle %= -360);
      };
      RotateAround.prototype.run = function(target, clockwise, timePerRound, faceToTarget, faceAxis) {
        target && (this.target = target);
        clockwise && (this.clockwise = clockwise);
        timePerRound && (this.timePerRound = timePerRound);
        faceToTarget && (this.faceToTarget = faceToTarget);
        faceAxis && (this.faceAxis = faceAxis);
        if (!this.target) return cc.log("No target!");
        this.angle = this.getAngle(this.target.getPosition(), this.node.getPosition());
        this.radius = this.getDistance(this.target.getPosition(), this.node.getPosition());
        this.isRotating = true;
      };
      RotateAround.prototype.stop = function() {
        this.isRotating = false;
      };
      RotateAround.prototype.getAngle = function(p1, p2) {
        return Math.atan((p2.y - p1.y) / (p2.x - p1.x));
      };
      RotateAround.prototype.getDistance = function(p1, p2) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
      };
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], RotateAround.prototype, "target", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RotateAround.prototype, "clockwise", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RotateAround.prototype, "timePerRound", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RotateAround.prototype, "faceToTarget", void 0);
      __decorate([ property({
        type: cc.Enum(Axis),
        tooltip: false,
        visible: function() {
          return this.faceToTarget;
        }
      }) ], RotateAround.prototype, "faceAxis", void 0);
      __decorate([ property({
        tooltip: false
      }) ], RotateAround.prototype, "autoStart", void 0);
      RotateAround = __decorate([ ccclass ], RotateAround);
      return RotateAround;
    }(cc.Component);
    exports.default = RotateAround;
    cc._RF.pop();
  }, {} ],
  RunInBackground: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "970dctLoZZCzYoa6ziVrFrx", "RunInBackground");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ccclass = cc._decorator.ccclass;
    var RunInBackground = function(_super) {
      __extends(RunInBackground, _super);
      function RunInBackground() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.worker = null;
        _this.url = "Worker.js";
        return _this;
      }
      RunInBackground.prototype.onLoad = function() {
        var _this = this;
        true;
        this.url = "app/editor/static/preview-templates/Worker.js";
        document.addEventListener("visibilitychange", function() {
          if ("hidden" === document.visibilityState) {
            cc.game["_paused"] && cc.game["resume"]();
            _this.worker = new Worker(_this.url);
            _this.worker.onmessage = function() {
              cc.director["mainLoop"]();
            };
          } else "visible" === document.visibilityState && _this.worker && _this.worker.terminate();
        });
      };
      RunInBackground = __decorate([ ccclass ], RunInBackground);
      return RunInBackground;
    }(cc.Component);
    exports.default = RunInBackground;
    cc._RF.pop();
  }, {} ],
  SceneNavigator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "14cc97JUYJKyLHeB8Y2fKwp", "SceneNavigator");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SceneNavigator = function() {
      function SceneNavigator() {}
      Object.defineProperty(SceneNavigator, "history", {
        get: function() {
          return this._history;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SceneNavigator, "param", {
        get: function() {
          return this._param;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SceneNavigator, "curScene", {
        get: function() {
          return this._curScene;
        },
        enumerable: false,
        configurable: true
      });
      SceneNavigator.setHome = function(name) {
        this._history = [ name ];
      };
      SceneNavigator.goHome = function(param) {
        var _this = this;
        this._param = null;
        var name = this._history[0];
        cc.director.loadScene(name, function() {
          _this._history = [ name ];
          _this._curScene = name;
          _this._param = param;
        });
      };
      SceneNavigator.go = function(name, param) {
        var _this = this;
        this._param = null;
        cc.director.loadScene(name, function() {
          _this._history.push(name);
          _this._curScene = name;
          _this._param = param;
        });
      };
      SceneNavigator.back = function(param) {
        var _this = this;
        if (this._history.length > 1) {
          this._param = null;
          var name_1 = this._history[this._history.length - 2];
          cc.director.loadScene(name_1, function() {
            _this._history.pop();
            _this._curScene = name_1;
            _this._param = param;
          });
        }
      };
      SceneNavigator._history = [];
      SceneNavigator._param = null;
      SceneNavigator._curScene = null;
      return SceneNavigator;
    }();
    exports.default = SceneNavigator;
    cc._RF.pop();
  }, {} ],
  ScreenAdapter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "32ac7U3+OdFpJMImIy13br0", "ScreenAdapter");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var EventManager_1 = require("../core/EventManager");
    var Events_1 = require("../constants/Events");
    var ccclass = cc._decorator.ccclass;
    var ScreenAdapter = function(_super) {
      __extends(ScreenAdapter, _super);
      function ScreenAdapter() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      ScreenAdapter.prototype.onLoad = function() {
        var _this = this;
        cc.view.setResizeCallback(function() {
          return _this.onResize();
        });
      };
      ScreenAdapter.prototype.start = function() {
        this.adapt();
      };
      ScreenAdapter.prototype.onResize = function() {
        EventManager_1.default.emit(Events_1.VIEW_RESIZE);
        this.adapt();
      };
      ScreenAdapter.prototype.adapt = function() {
        var screenRatio = cc.winSize.width / cc.winSize.height;
        var designRatio = cc.Canvas.instance.designResolution.width / cc.Canvas.instance.designResolution.height;
        screenRatio <= 1 && screenRatio <= designRatio ? this.setFitWidth() : this.setFitHeight();
      };
      ScreenAdapter.prototype.setFitHeight = function() {
        cc.Canvas.instance.fitHeight = true;
        cc.Canvas.instance.fitWidth = false;
      };
      ScreenAdapter.prototype.setFitWidth = function() {
        cc.Canvas.instance.fitHeight = false;
        cc.Canvas.instance.fitWidth = true;
      };
      ScreenAdapter = __decorate([ ccclass ], ScreenAdapter);
      return ScreenAdapter;
    }(cc.Component);
    exports.default = ScreenAdapter;
    cc._RF.pop();
  }, {
    "../constants/Events": "Events",
    "../core/EventManager": "EventManager"
  } ],
  SineWaveController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d11caHtQJRPOKyBXwLEJ8Bc", "SineWaveController");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SineWave_1 = require("../../../../eazax-ccc/components/effects/SineWave");
    var JellyTween_1 = require("../../../../eazax-ccc/components/tweens/JellyTween");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var SineWaveController = function(_super) {
      __extends(SineWaveController, _super);
      function SineWaveController() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.sineWave = null;
        _this.fillBtn = null;
        _this.amplitudeEditBox = null;
        _this.angularVelocityEditBox = null;
        _this.frequencyEditBox = null;
        _this.heightEditBox = null;
        _this.toLeftToggle = null;
        _this.interactable = true;
        _this.status = 0;
        return _this;
      }
      SineWaveController.prototype.onLoad = function() {
        this.registerEvent();
      };
      SineWaveController.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      SineWaveController.prototype.registerEvent = function() {
        this.fillBtn.on(cc.Node.EventType.TOUCH_END, this.onFillBtnClick, this);
        this.amplitudeEditBox.node.on("text-changed", this.onAmplitudeChanged, this);
        this.angularVelocityEditBox.node.on("text-changed", this.onAngularVelocityChanged, this);
        this.frequencyEditBox.node.on("text-changed", this.onFrequencyChanged, this);
        this.heightEditBox.node.on("text-changed", this.onHeightChanged, this);
        this.toLeftToggle.node.on("toggle", this.onToLeftChanged, this);
      };
      SineWaveController.prototype.unregisterEvent = function() {
        this.fillBtn.off(cc.Node.EventType.TOUCH_END, this.onFillBtnClick, this);
        this.amplitudeEditBox.node.off("text-changed", this.onAmplitudeChanged, this);
        this.angularVelocityEditBox.node.off("text-changed", this.onAngularVelocityChanged, this);
        this.frequencyEditBox.node.off("text-changed", this.onFrequencyChanged, this);
        this.heightEditBox.node.off("text-changed", this.onHeightChanged, this);
        this.toLeftToggle.node.off("toggle", this.onToLeftChanged, this);
      };
      SineWaveController.prototype.onFillBtnClick = function() {
        var _this = this;
        if (!this.interactable) return;
        this.interactable = false;
        if (0 === this.status) {
          this.status = 1;
          var button_1 = this.fillBtn.getComponent(cc.Button);
          button_1.interactable = false;
          var jelly_1 = this.fillBtn.getComponent(JellyTween_1.default);
          jelly_1.stop();
          cc.tween(this.sineWave).to(3, {
            height: 1
          }).call(function() {
            return _this.heightEditBox.string = "1.0";
          }).to(.5, {
            amplitude: 0
          }).call(function() {
            return _this.amplitudeEditBox.string = "0.0";
          }).call(function() {
            _this.interactable = true;
            _this.fillBtn.getComponentInChildren(cc.Label).string = "\u6062\u590d";
            button_1.interactable = true;
            jelly_1.play();
          }).start();
        } else {
          this.status = 0;
          this.sineWave.height = .5;
          this.heightEditBox.string = "0.5";
          this.sineWave.amplitude = .05;
          this.amplitudeEditBox.string = "0.05";
          this.interactable = true;
          this.fillBtn.getComponentInChildren(cc.Label).string = "\u52a0\u6ee1";
        }
      };
      SineWaveController.prototype.onAmplitudeChanged = function(editbox) {
        this.sineWave.amplitude = parseFloat(editbox.string);
      };
      SineWaveController.prototype.onAngularVelocityChanged = function(editbox) {
        this.sineWave.angularVelocity = parseFloat(editbox.string);
      };
      SineWaveController.prototype.onFrequencyChanged = function(editbox) {
        this.sineWave.frequency = parseFloat(editbox.string);
      };
      SineWaveController.prototype.onHeightChanged = function(editbox) {
        this.sineWave.height = parseFloat(editbox.string);
      };
      SineWaveController.prototype.onToLeftChanged = function(toggle) {
        this.sineWave.direction = toggle.isChecked ? SineWave_1.SineWaveDirection.Left : SineWave_1.SineWaveDirection.Right;
      };
      __decorate([ property(SineWave_1.default) ], SineWaveController.prototype, "sineWave", void 0);
      __decorate([ property(cc.Node) ], SineWaveController.prototype, "fillBtn", void 0);
      __decorate([ property(cc.EditBox) ], SineWaveController.prototype, "amplitudeEditBox", void 0);
      __decorate([ property(cc.EditBox) ], SineWaveController.prototype, "angularVelocityEditBox", void 0);
      __decorate([ property(cc.EditBox) ], SineWaveController.prototype, "frequencyEditBox", void 0);
      __decorate([ property(cc.EditBox) ], SineWaveController.prototype, "heightEditBox", void 0);
      __decorate([ property(cc.Toggle) ], SineWaveController.prototype, "toLeftToggle", void 0);
      SineWaveController = __decorate([ ccclass ], SineWaveController);
      return SineWaveController;
    }(cc.Component);
    exports.default = SineWaveController;
    cc._RF.pop();
  }, {
    "../../../../eazax-ccc/components/effects/SineWave": "SineWave",
    "../../../../eazax-ccc/components/tweens/JellyTween": "JellyTween"
  } ],
  SineWave: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8873cgmM19Mb414MmY3ZA8/", "SineWave");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = this && this.__generator || function(thisArg, body) {
      var _ = {
        label: 0,
        sent: function() {
          if (1 & t[0]) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      }, f, y, t, g;
      return g = {
        next: verb(0),
        throw: verb(1),
        return: verb(2)
      }, "function" === typeof Symbol && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([ n, v ]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
          if (f = 1, y && (t = 2 & op[0] ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 
          0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          (y = 0, t) && (op = [ 2 & op[0], t.value ]);
          switch (op[0]) {
           case 0:
           case 1:
            t = op;
            break;

           case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

           case 5:
            _.label++;
            y = op[1];
            op = [ 0 ];
            continue;

           case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;

           default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (6 === op[0] || 2 === op[0])) {
              _ = 0;
              continue;
            }
            if (3 === op[0] && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (6 === op[0] && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            t[2] && _.ops.pop();
            _.trys.pop();
            continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [ 6, e ];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (5 & op[0]) throw op[1];
        return {
          value: op[0] ? op[1] : void 0,
          done: true
        };
      }
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SineWaveDirection = void 0;
    var EditorAsset_1 = require("../../misc/EditorAsset");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property, requireComponent = _a.requireComponent, executeInEditMode = _a.executeInEditMode, disallowMultiple = _a.disallowMultiple, executionOrder = _a.executionOrder;
    var SineWaveDirection;
    (function(SineWaveDirection) {
      SineWaveDirection[SineWaveDirection["Left"] = 1] = "Left";
      SineWaveDirection[SineWaveDirection["Right"] = 2] = "Right";
    })(SineWaveDirection = exports.SineWaveDirection || (exports.SineWaveDirection = {}));
    var SineWave = function(_super) {
      __extends(SineWave, _super);
      function SineWave() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._effect = null;
        _this._amplitude = .05;
        _this._angularVelocity = 10;
        _this._frequency = 10;
        _this._height = .5;
        _this._direction = SineWaveDirection.Left;
        _this.sprite = null;
        _this.material = null;
        return _this;
      }
      Object.defineProperty(SineWave.prototype, "effect", {
        get: function() {
          return this._effect;
        },
        set: function(value) {
          this._effect = value;
          this.init();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "amplitude", {
        get: function() {
          return this._amplitude;
        },
        set: function(value) {
          this._amplitude = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "angularVelocity", {
        get: function() {
          return this._angularVelocity;
        },
        set: function(value) {
          this._angularVelocity = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "frequency", {
        get: function() {
          return this._frequency;
        },
        set: function(value) {
          this._frequency = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "height", {
        get: function() {
          return this._height;
        },
        set: function(value) {
          this._height = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SineWave.prototype, "direction", {
        get: function() {
          return this._direction;
        },
        set: function(value) {
          this._direction = value;
          this.updateProperties();
        },
        enumerable: false,
        configurable: true
      });
      SineWave.prototype.onLoad = function() {
        this.init();
      };
      SineWave.prototype.resetInEditor = function() {
        this.init();
      };
      SineWave.prototype.init = function() {
        return __awaiter(this, void 0, void 0, function() {
          var _this = this;
          return __generator(this, function(_a) {
            switch (_a.label) {
             case 0:
              true;
              return [ 3, 2 ];

             case 1:
              _a.sent();
              _a.label = 2;

             case 2:
              if (!this._effect) return [ 2 ];
              this.sprite = this.node.getComponent(cc.Sprite);
              this.sprite.spriteFrame && (this.sprite.spriteFrame.getTexture().packable = false);
              this.material = cc.Material.create(this._effect);
              this.sprite.setMaterial(0, this.material);
              this.updateProperties();
              return [ 2 ];
            }
          });
        });
      };
      SineWave.prototype.setSpriteFrame = function(spriteFrame) {
        this.sprite.spriteFrame = spriteFrame;
        this.sprite.spriteFrame.getTexture().packable = false;
        this.updateProperties();
      };
      SineWave.prototype.updateProperties = function() {
        if (!this.effect) return cc.warn("[SineWave]", "\u8bf7\u6307\u5b9a Effect \u8d44\u6e90\uff01");
        this.material.setProperty("amplitude", this._amplitude);
        this.material.setProperty("angularVelocity", this._angularVelocity);
        this.material.setProperty("frequency", this._frequency);
        this.material.setProperty("offset", 1 - this._height + this._amplitude);
        this.material.setProperty("toLeft", this._direction === SineWaveDirection.Left);
      };
      __decorate([ property ], SineWave.prototype, "_effect", void 0);
      __decorate([ property({
        type: cc.EffectAsset,
        tooltip: false,
        readonly: true
      }) ], SineWave.prototype, "effect", null);
      __decorate([ property ], SineWave.prototype, "_amplitude", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "amplitude", null);
      __decorate([ property ], SineWave.prototype, "_angularVelocity", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "angularVelocity", null);
      __decorate([ property ], SineWave.prototype, "_frequency", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "frequency", null);
      __decorate([ property ], SineWave.prototype, "_height", void 0);
      __decorate([ property({
        tooltip: false
      }) ], SineWave.prototype, "height", null);
      __decorate([ property ], SineWave.prototype, "_direction", void 0);
      __decorate([ property({
        type: cc.Enum(SineWaveDirection),
        tooltip: false
      }) ], SineWave.prototype, "direction", null);
      SineWave = __decorate([ ccclass, requireComponent(cc.Sprite), executeInEditMode, disallowMultiple, executionOrder(-100) ], SineWave);
      return SineWave;
    }(cc.Component);
    exports.default = SineWave;
    cc._RF.pop();
  }, {
    "../../misc/EditorAsset": "EditorAsset"
  } ],
  StorageUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d48cd0WtsJDRJOp/8A4XMho", "StorageUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var StorageUtil = function() {
      function StorageUtil() {}
      StorageUtil.set = function(key, value) {
        var dataString = "object" === typeof value ? JSON.stringify(value) : value;
        cc.sys.localStorage.setItem(key, dataString);
      };
      StorageUtil.get = function(key, parse) {
        void 0 === parse && (parse = true);
        var dataString = cc.sys.localStorage.getItem(key);
        if (dataString) {
          if (parse) try {
            return JSON.parse(dataString);
          } catch (_a) {
            return dataString;
          }
          return dataString;
        }
        return null;
      };
      StorageUtil.remove = function(key) {
        cc.sys.localStorage.removeItem(key);
      };
      return StorageUtil;
    }();
    exports.default = StorageUtil;
    cc._RF.pop();
  }, {} ],
  Subtitle: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "04105hiMEhM04bn/nXGON/8", "Subtitle");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Subtitle = function(_super) {
      __extends(Subtitle, _super);
      function Subtitle() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        _this.queen = [];
        _this.curIndex = 0;
        _this.interval = 1.5;
        return _this;
      }
      Subtitle_1 = Subtitle;
      Subtitle.prototype.onLoad = function() {
        Subtitle_1.instance = this;
      };
      Subtitle.print = function(texts, interval) {
        void 0 === interval && (interval = 1.5);
        this.instance.print(texts, interval);
      };
      Subtitle.clear = function() {
        this.instance.clear();
      };
      Subtitle.prototype.print = function(texts, interval) {
        void 0 === interval && (interval = 1.5);
        if (0 === texts.length) return;
        this.unscheduleAllCallbacks();
        this.queen = texts;
        this.interval = interval;
        this.curIndex = -1;
        this.next();
      };
      Subtitle.prototype.next = function() {
        var _this = this;
        this.curIndex++;
        if (this.curIndex >= this.queen.length) {
          this.unscheduleAllCallbacks();
          return;
        }
        this.label.string = this.queen[this.curIndex];
        this.scheduleOnce(function() {
          return _this.next();
        }, this.interval);
      };
      Subtitle.prototype.clear = function() {
        this.unscheduleAllCallbacks();
        this.queen = [];
        this.curIndex = 0;
        this.label.string = "";
      };
      var Subtitle_1;
      Subtitle.instance = null;
      __decorate([ property(cc.Label) ], Subtitle.prototype, "label", void 0);
      Subtitle = Subtitle_1 = __decorate([ ccclass ], Subtitle);
      return Subtitle;
    }(cc.Component);
    exports.default = Subtitle;
    cc._RF.pop();
  }, {} ],
  TestPopup: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a280amvZ71EppVV4wlg851a", "TestPopup");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var PopupBase_1 = require("../../../../eazax-ccc/components/popups/PopupBase");
    var PopupManager_1 = require("../../../../eazax-ccc/core/PopupManager");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TestPopup = function(_super) {
      __extends(TestPopup, _super);
      function TestPopup() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.closeBtn = null;
        _this.curFlagLabel = null;
        _this.newFlagLabel = null;
        _this.normalBtn = null;
        _this.forceBtn = null;
        _this.coverBtn = null;
        _this.newFlag = null;
        return _this;
      }
      TestPopup_1 = TestPopup;
      Object.defineProperty(TestPopup, "path", {
        get: function() {
          return "prefabs/TestPopup";
        },
        enumerable: false,
        configurable: true
      });
      TestPopup.prototype.onLoad = function() {
        this.registerEvent();
      };
      TestPopup.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      TestPopup.prototype.registerEvent = function() {
        this.closeBtn.on(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick, this);
        this.normalBtn.on(cc.Node.EventType.TOUCH_END, this.onNormalBtnClick, this);
        this.forceBtn.on(cc.Node.EventType.TOUCH_END, this.onForceBtnClick, this);
        this.coverBtn.on(cc.Node.EventType.TOUCH_END, this.onCoverBtnClick, this);
      };
      TestPopup.prototype.unregisterEvent = function() {
        this.closeBtn.off(cc.Node.EventType.TOUCH_END, this.onCloseBtnClick, this);
        this.normalBtn.off(cc.Node.EventType.TOUCH_END, this.onNormalBtnClick, this);
        this.forceBtn.off(cc.Node.EventType.TOUCH_END, this.onForceBtnClick, this);
        this.coverBtn.off(cc.Node.EventType.TOUCH_END, this.onCoverBtnClick, this);
      };
      TestPopup.prototype.updateDisplay = function(options) {
        this.curFlagLabel.string = options;
        this.updateNewFlag();
      };
      TestPopup.prototype.updateNewFlag = function() {
        this.newFlag = (1e4 * Math.random()).toFixed(0).padStart(5, "0");
        this.newFlagLabel.string = this.newFlag;
      };
      TestPopup.prototype.onCloseBtnClick = function() {
        this.hide();
      };
      TestPopup.prototype.onNormalBtnClick = function() {
        PopupManager_1.default.show(TestPopup_1.path, this.newFlag, PopupManager_1.PopupCacheMode.Frequent, false);
        this.updateNewFlag();
      };
      TestPopup.prototype.onForceBtnClick = function() {
        PopupManager_1.default.show(TestPopup_1.path, this.newFlag, PopupManager_1.PopupCacheMode.Frequent, false);
      };
      TestPopup.prototype.onCoverBtnClick = function() {
        PopupManager_1.default.show(TestPopup_1.path, this.newFlag, PopupManager_1.PopupCacheMode.Frequent, false);
      };
      var TestPopup_1;
      __decorate([ property(cc.Node) ], TestPopup.prototype, "closeBtn", void 0);
      __decorate([ property(cc.Label) ], TestPopup.prototype, "curFlagLabel", void 0);
      __decorate([ property(cc.Label) ], TestPopup.prototype, "newFlagLabel", void 0);
      __decorate([ property(cc.Node) ], TestPopup.prototype, "normalBtn", void 0);
      __decorate([ property(cc.Node) ], TestPopup.prototype, "forceBtn", void 0);
      __decorate([ property(cc.Node) ], TestPopup.prototype, "coverBtn", void 0);
      TestPopup = TestPopup_1 = __decorate([ ccclass ], TestPopup);
      return TestPopup;
    }(PopupBase_1.default);
    exports.default = TestPopup;
    cc._RF.pop();
  }, {
    "../../../../eazax-ccc/components/popups/PopupBase": "PopupBase",
    "../../../../eazax-ccc/core/PopupManager": "PopupManager"
  } ],
  TimeUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48b69XZILlEzJX3Tl7x6Yp8", "TimeUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TimeUtil = function() {
      function TimeUtil() {}
      TimeUtil.getTargetTimestamp = function(hour, minute, second) {
        void 0 === hour && (hour = 0);
        void 0 === minute && (minute = 0);
        void 0 === second && (second = 0);
        var start = new Date(new Date().toLocaleDateString()).getTime();
        var target = 1e3 * (3600 * hour + 60 * minute + second);
        return new Date(start + target).getTime();
      };
      TimeUtil.msToHMS = function(time, separator, keepHours) {
        void 0 === separator && (separator = ":");
        void 0 === keepHours && (keepHours = true);
        var hours = Math.floor(time / 36e5);
        var minutes = Math.floor((time - 36e5 * hours) / 6e4);
        var seconds = Math.floor((time - 36e5 * hours - 6e4 * minutes) / 1e3);
        var hoursString = 0 !== hours || keepHours ? hours.toString().padStart(2, "0") : "";
        return "" + hoursString + separator + minutes.toString().padStart(2, "0") + separator + seconds.toString().padStart(2, "0");
      };
      TimeUtil.getCurrentTimestamp = function() {
        return new Date().getTime();
      };
      return TimeUtil;
    }();
    exports.default = TimeUtil;
    window["eazax"] && (window["eazax"]["time"] = TimeUtil);
    cc._RF.pop();
  }, {} ],
  TouchBlocker2: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b209X9V79HAbgaI2cogShP", "TouchBlocker2");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TouchBlocker2 = function(_super) {
      __extends(TouchBlocker2, _super);
      function TouchBlocker2() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.allowList = [];
        _this.blocked = false;
        _this.persist = false;
        return _this;
      }
      TouchBlocker2_1 = TouchBlocker2;
      TouchBlocker2.prototype.onLoad = function() {
        this.init();
        this.registerEvent();
      };
      TouchBlocker2.prototype.onDestroy = function() {
        this.unregisterEvent();
        TouchBlocker2_1.instance = null;
      };
      TouchBlocker2.prototype.init = function() {
        if (this.persist) {
          this.node.setParent(cc.Canvas.instance.node);
          this.node.setSiblingIndex(cc.macro.MAX_ZINDEX);
          cc.game.addPersistRootNode(this.node);
        }
        TouchBlocker2_1.instance = this;
      };
      TouchBlocker2.prototype.registerEvent = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEvent, this);
        this.setSwallowTouches(false);
      };
      TouchBlocker2.prototype.unregisterEvent = function() {
        this.node.targetOff(this);
      };
      TouchBlocker2.prototype.onEvent = function(event) {
        this.blocked && !this.clickOnAnyTarget(event.getLocation()) && event.stopPropagationImmediate();
      };
      TouchBlocker2.prototype.clickOnAnyTarget = function(pos) {
        for (var i = 0; i < this.allowList.length; i++) {
          var rect = this.allowList[i].getBoundingBoxToWorld();
          if (rect.contains(pos)) return true;
        }
        return false;
      };
      TouchBlocker2.prototype.setSwallowTouches = function(swallow) {
        this.node._touchListener.setSwallowTouches(swallow);
      };
      TouchBlocker2.addTargets = function(nodes) {
        var _a;
        Array.isArray(nodes) ? (_a = this.instance.allowList).push.apply(_a, nodes) : this.instance.allowList.push(nodes);
      };
      TouchBlocker2.setTarget = function(node) {
        this.clearTargets();
        this.instance.allowList.push(node);
      };
      TouchBlocker2.clearTargets = function() {
        this.instance.allowList.length = 0;
      };
      TouchBlocker2.on = function() {
        this.instance.blocked = true;
      };
      TouchBlocker2.off = function() {
        this.instance.blocked = false;
      };
      var TouchBlocker2_1;
      TouchBlocker2.instance = null;
      __decorate([ property({
        type: [ cc.Node ],
        tooltip: false
      }) ], TouchBlocker2.prototype, "allowList", void 0);
      __decorate([ property({
        tooltip: false
      }) ], TouchBlocker2.prototype, "blocked", void 0);
      __decorate([ property({
        tooltip: false
      }) ], TouchBlocker2.prototype, "persist", void 0);
      TouchBlocker2 = TouchBlocker2_1 = __decorate([ ccclass ], TouchBlocker2);
      return TouchBlocker2;
    }(cc.Component);
    exports.default = TouchBlocker2;
    cc._RF.pop();
  }, {} ],
  TouchBlocker: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ff5f8f/CqNOH5gfQbiVhjvH", "TouchBlocker");
    "use strict";
    var __extends = this && this.__extends || function() {
      var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || {
          __proto__: []
        } instanceof Array && function(d, b) {
          d.__proto__ = b;
        } || function(d, b) {
          for (var p in b) b.hasOwnProperty(p) && (d[p] = b[p]);
        };
        return extendStatics(d, b);
      };
      return function(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype = null === b ? Object.create(b) : (__.prototype = b.prototype, new __());
      };
    }();
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var TouchBlocker = function(_super) {
      __extends(TouchBlocker, _super);
      function TouchBlocker() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.target = null;
        _this.isBlockAll = false;
        _this.isPassAll = false;
        return _this;
      }
      TouchBlocker.prototype.onLoad = function() {
        this.registerEvent();
      };
      TouchBlocker.prototype.onDestroy = function() {
        this.unregisterEvent();
      };
      TouchBlocker.prototype.registerEvent = function() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onEvent, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEvent, this);
        this.setSwallowTouches(false);
      };
      TouchBlocker.prototype.unregisterEvent = function() {
        this.node.targetOff(this);
      };
      TouchBlocker.prototype.onEvent = function(event) {
        if (this.isPassAll) return;
        if (this.isBlockAll || !this.target) {
          event.stopPropagationImmediate();
          return;
        }
        var targetRect = this.target.getBoundingBoxToWorld();
        var isContains = targetRect.contains(event.getLocation());
        isContains || event.stopPropagationImmediate();
      };
      TouchBlocker.prototype.blockAll = function() {
        this.isBlockAll = true;
        this.isPassAll = false;
      };
      TouchBlocker.prototype.passAll = function() {
        this.isPassAll = true;
        this.isBlockAll = false;
      };
      TouchBlocker.prototype.setTarget = function(node) {
        this.target = node;
        this.isBlockAll = false;
        this.isPassAll = false;
      };
      TouchBlocker.prototype.setSwallowTouches = function(swallow) {
        this.node._touchListener.setSwallowTouches(swallow);
      };
      __decorate([ property({
        type: cc.Node,
        tooltip: false
      }) ], TouchBlocker.prototype, "target", void 0);
      TouchBlocker = __decorate([ ccclass ], TouchBlocker);
      return TouchBlocker;
    }(cc.Component);
    exports.default = TouchBlocker;
    cc._RF.pop();
  }, {} ],
  TweenUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c56feN05ThJQKJVb9TcoCoG", "TweenUtil");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var TweenUtil = function() {
      function TweenUtil() {}
      TweenUtil.flip = function(node, duration, onMiddle, onComplete) {
        return new Promise(function(res) {
          var time = duration / 2;
          var skew = 10;
          cc.tween(node).parallel(cc.tween().to(time, {
            scaleX: 0
          }, {
            easing: "sineIn"
          }), cc.tween().to(time, {
            skewY: -skew
          })).set({
            skewY: skew
          }).call(function() {
            onMiddle && onMiddle();
          }).parallel(cc.tween().to(time, {
            scaleX: 1
          }, {
            easing: "sineOut"
          }), cc.tween().to(time, {
            skewY: 0
          })).call(function() {
            onComplete && onComplete();
            res();
          }).start();
        });
      };
      return TweenUtil;
    }();
    exports.default = TweenUtil;
    cc._RF.pop();
  }, {} ],
  eazax: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "df2d6IVrmJFHJG6OVslZw+5", "eazax");
    var eazax;
    (function(eazax) {
      function log(title, msg) {
        msg ? console.log("%c " + title + " %c " + msg + " ", "background: #35495E;padding: 1px;border-radius: 2px 0 0 2px;color: #fff;", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;") : console.log("%c " + title + " ", "background: #409EFF;padding: 1px;border-radius: 0 2px 2px 0;color: #fff;");
      }
      eazax.log = log;
    })(eazax || (eazax = {}));
    window["eazax"] = eazax;
    window["ez"] = window["eazax"];
    cc._RF.pop();
  }, {} ],
  extension: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "65190se/TJEoqBXOTLv8jep", "extension");
    String.prototype.clamp = function(start, threshold, suffix) {
      void 0 === suffix && (suffix = "...");
      if (this.replace(/[^\x00-\xff]/g, "xx").length <= threshold) return this;
      var charCount = 0;
      var result = "";
      for (var i = start; i < this.length; i++) {
        charCount += /[^\x00-\xff]/.test(this[i]) ? 2 : 1;
        if (charCount > threshold) return result + suffix;
        result += this[i];
      }
      return result;
    };
    cc._RF.pop();
  }, {} ]
}, {}, [ "BackgroundFitter", "Counter", "LoadingTip", "LongPress", "Marquee", "RadarChart", "RotateAround", "RunInBackground", "ScreenAdapter", "Subtitle", "TouchBlocker", "TouchBlocker2", "GaussianBlur", "HollowOut", "RainbowBrush", "SineWave", "LocalizationBase", "LocalizationLabelString", "LocalizationSpriteFrame", "ConfirmPopup", "PopupBase", "BounceMoveTween", "BounceScaleTween", "JellyTween", "Events", "AudioPlayer", "EventManager", "InstanceEvent", "NetworkManager", "PoolManager", "PopupManager", "PopupManager_dev", "ResourceManager", "SceneNavigator", "eazax", "extension", "EditorAsset", "ArrayUtil", "BrowserUtil", "DebugUtil", "DeviceUtil", "ImageUtil", "IntersectionUtil", "MathUtil", "NodeUtil", "ObjectUtil", "PromiseUtil", "RegexUtil", "StorageUtil", "TimeUtil", "TweenUtil", "CustomEngine", "CustomEvents", "ClickToLoadUrl", "ClickToShowResPopup", "ResPopup", "ResPopupItem", "ResPopupItemInfo", "HomePage", "Main", "MainContent", "MainUI", "Case_FlipCard", "FrameLoad", "NewGuide", "PopupTest", "TestPopup", "RadarChartController", "SineWaveController" ]);