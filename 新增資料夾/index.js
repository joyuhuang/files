var homeDepthKV =
/*#__PURE__*/
function () {
  /**
   * コンストラクタ
   */
  function homeDepthKV() {
    _classCallCheck(this, homeDepthKV);

    // クラス名
    this.name = 'homeDepthKV';
    this.isSliding = true;
    this.isStart = false;
    this.isTouch = 'ontouchstart' in window;
    this.autoTimer = null;
    this.init();
  }
  /**
   * 初期設定
   */


  _createClass(homeDepthKV, [{
    key: "init",
    value: function init() {
      var _this = this;

      // DOM
      this.el = document.getElementById('js-home-depthKV');
      this.slides = this.el.querySelectorAll('.p-home-depthKV__slide');
      this.slideItems = []; // ボタン

      this.el.querySelector('.p-btn-kv--left').addEventListener('click', this.onClick.bind(this, 1));
      this.el.querySelector('.p-btn-kv--right').addEventListener('click', this.onClick.bind(this, -1)); // タッチ設定

      if (this.isTouch) {
        var bindSwipe = this.onSwipe.bind(this);
        this.el.addEventListener('touchstart', bindSwipe);
        this.el.addEventListener('touchmove', bindSwipe);
        this.el.addEventListener('touchend', bindSwipe);
        this.el.addEventListener('touchcancel', bindSwipe);
      } // スライド枚数最大


      this.max = this.slides.length; // 角度

      this.obj = {
        angle: 0
      }; // サイズ

      this["default"] = {
        pc: {
          w: 600,
          h: 600,
          winH: 620,
          radius: 1880,
          //1680
          radiusRatio: 0.6,
          zoom: 1.4,
          adjustY: 0.18,
          distance: 60
        },
        sp: {
          w: 660,
          //h: 756,
          //winH: 756,
          h: 620,
          winH: 620,
          radius: 840,
          //1680
          radiusRatio: 0.8,
          zoom: 1.3,
          adjustY: 0.6,
          distance: 60
        }
      };
      this.config = [];
      this.winH = 0; // 表示するスライド前後含む3件

      this.currentSlide = [this.max - 1, 0, 1]; // スライド番号保存用

      this.nextSlide = [];
      this.hideSlide = null;
      this.showSlide = null; // 番号を更新する

      this.setUI(this.currentSlide); // スピード
      //this.speed = 1;
      // 設定

      this.isDevice = _common_AnyStore__WEBPACK_IMPORTED_MODULE_3__["default"].setDevice();
      this.setConfig(); // 機能追加

      this.ScreenFit = new _utils_ScreenFit__WEBPACK_IMPORTED_MODULE_0__["default"](this.el.querySelector('.p-home-depthKV__wrap'));
      this.slides.forEach(function (el, index) {
        _this.slideItems[index] = new _home_kvItem__WEBPACK_IMPORTED_MODULE_2__["default"](el);
      }); // リサイズイベント

      this.resizeUpdate();
      _utils_ResizeWatch__WEBPACK_IMPORTED_MODULE_1__["default"].registerObserver(this.name, this); // 初期位置

      this.moveRotation();
    }
    /**
     * スタート時のアニメ
     */

  }, {
    key: "start",
    value: function start() {
      // サイトタイトル
      TweenMax.fromTo(document.getElementById('js-home-kv').querySelector('.l-home-kv__title'), 1.0, {
        className: '-=is-hide',
        y: -50,
        opacity: 0
      }, {
        delay: 0.4,
        y: 0,
        opacity: 1,
        ease: Cubic.easeOut
      }); // 地面

      TweenMax.fromTo(this.el.querySelector('.p-home-depthKV__base'), 1.0, {
        y: -100,
        opacity: 0
      }, {
        y: 0,
        opacity: 1,
        ease: Cubic.easeOut
      }); // イラスト

      TweenMax.set(this.slides[this.currentSlide[0]], {
        className: '-=is-hide'
      });
      TweenMax.fromTo(this.slides[this.currentSlide[0]].querySelector('.p-kv-slide'), 1.0, {
        y: '-70%'
      }, {
        y: '0%',
        delay: 0.2,
        ease: Bounce.easeOut //ease: Cubic.easeOut

      });
      TweenMax.set(this.slides[this.currentSlide[1]], {
        className: '-=is-hide'
      });
      TweenMax.fromTo(this.slides[this.currentSlide[1]].querySelector('.p-kv-slide'), 1.0, {
        y: '-70%'
      }, {
        y: '0%',
        delay: 0.1,
        ease: Bounce.easeOut
      });
      TweenMax.set(this.slides[this.currentSlide[2]], {
        className: '-=is-hide'
      });
      TweenMax.fromTo(this.slides[this.currentSlide[2]].querySelector('.p-kv-slide'), 1.0, {
        y: '-70%'
      }, {
        y: '0%',
        delay: 0.2,
        ease: Bounce.easeOut,
        onComplete: this.startComp.bind(this)
      });
      this.slideItems[this.currentSlide[1]].show(0.5); // 自動スライド

      this.autoTimer = setTimeout(this.autoSlide.bind(this), 5000);
    }
    /**
     * スタート時のアニメ完了
     */

  }, {
    key: "startComp",
    value: function startComp() {
      this.isStart = true;
      this.isSliding = false;
    }
    /**
     * 自動でスライド
     */

  }, {
    key: "autoSlide",
    value: function autoSlide() {
      this.onClick(-1, null);
      this.autoTimer = setTimeout(this.autoSlide.bind(this), 5000);
    }
    /**
     * スワイプで回転トリガー
     */

  }, {
    key: "onSwipe",
    value: function onSwipe(e) {
      if (!this.isStart) return e.preventDefault();
      if (this.isSliding) return e.preventDefault(); // スライドの移動座標

      var slideW = window.innerWidth * 0.5;

      if (e.type === 'touchstart') {
        // タッチ開始
        clearTimeout(this.autoTimer);
        this.touchStartX = e.touches[0].pageX;
        this.startTime = Date.now();
      } else if (e.type === 'touchmove') {
        // タッチの動きに追従
        this.touchMoveX = e.changedTouches[0].pageX - this.touchStartX;
      } else if (e.type === 'touchend') {
        // タッチ完了で状態を判定
        this.touchMoveX = e.changedTouches[0].pageX - this.touchStartX;

        if (Math.abs(this.touchMoveX) > 10 && Date.now() - this.startTime <= 200) {
          // スライドする
          this.onClick(this.touchMoveX / Math.abs(this.touchMoveX), null);
        } else if (Math.abs(this.touchMoveX) > slideW / 2.5) {
          // スライドする
          this.onClick(this.touchMoveX / Math.abs(this.touchMoveX), null);
        }
      } else {
        // 元に戻す
        this.autoTimer = setTimeout(this.autoSlide.bind(this), 5000);
      }
    }
    /**
     * 回転トリガー
     */

  }, {
    key: "onClick",
    value: function onClick(direction, e) {
      if (e) e.preventDefault();
      if (this.isSliding) return;
      this.isSliding = true;
      clearTimeout(this.autoTimer); // スライド番号を更新する

      this.nextSlide = this.currentSlide.concat();

      for (var i = 0; i < this.nextSlide.length; i++) {
        // スライド番号
        if (direction < 0) {
          this.nextSlide[i]++;
        } else {
          this.nextSlide[i]--;
        } // スライドが範囲外の場合、元に戻す


        if (this.nextSlide[i] >= this.max) {
          this.nextSlide[i] = 0;
        } else if (this.nextSlide[i] < 0) {
          this.nextSlide[i] = this.max - 1;
        }
      }

      if (direction < 0) {
        this.hideSlide = this.currentSlide[0];
        this.showSlide = this.nextSlide[2];
      } else {
        this.hideSlide = this.currentSlide[2];
        this.showSlide = this.nextSlide[0];
      } // 1回転


      TweenMax.to(this.obj, 1.0, {
        angle: this.obj.angle + this.config.distance * direction,
        ease: Quart.easeInOut,
        onUpdate: this.moveRotation.bind(this),
        onComplete: this.moveRotationComp.bind(this)
      }); // 表示・非表示

      TweenMax.to(this.slides[this.hideSlide], 1.0, {
        opacity: 0,
        ease: Quart.easeInOut,
        onComplete: function onComplete() {
          TweenMax.set(this.target, {
            className: '+=is-hide'
          });
        }
      });
      TweenMax.fromTo(this.slides[this.showSlide], 1.0, {
        className: '-=is-hide',
        opacity: 0
      }, {
        opacity: 1,
        ease: Quart.easeInOut
      });
      this.slideItems[this.nextSlide[0]].hide();
      this.slideItems[this.nextSlide[1]].show();
      this.slideItems[this.nextSlide[2]].hide(); // スライド番号を更新する

      this.currentSlide = this.nextSlide; // 表示番号を変更

      this.setUI(this.currentSlide);
    }
    /**
     * 回転位置
     */

  }, {
    key: "moveRotation",
    value: function moveRotation() {
      for (var i = 0; i < this.max; i++) {
        var radian = this.getRadian(this.obj.angle + 360 / this.max * i); // Math.sin(radian)は-1から1までを正弦波で返す
        // radiusをかけることでそれを半径とする円の範囲でアニメーション

        var offsetX = Math.sin(radian) * this.radius;
        var offsetZ = Math.cos(radian) * this.radius;
        TweenMax.set(this.slides[i], {
          x: this.center.x + offsetX,
          y: this.center.y - (this.radius - offsetZ) * this.config.adjustY,
          z: (offsetZ - this.radius) * this.config.zoom,
          //y: this.center.y,
          //z: offsetZ * 1.2,
          zIndex: offsetZ
        });
      }
    }
    /**
     * 1回転終了
     */

  }, {
    key: "moveRotationComp",
    value: function moveRotationComp() {
      //console.log(this.obj);
      // 元に戻す
      this.autoTimer = setTimeout(this.autoSlide.bind(this), 5000);
      this.isSliding = false;
    }
    /**
     * 角度をラジアン
     */

  }, {
    key: "getRadian",
    value: function getRadian(angle) {
      return angle * Math.PI / 180;
    }
    /*
     * 設定値を設定
     */

  }, {
    key: "setConfig",
    value: function setConfig() {
      // デバイスごとの設定を取得
      this.config = this["default"][this.isDevice];

      if (this.isDevice === 'sp') {
        this.winH = this["default"].sp.winH / 750 * window.innerWidth;
      } else {
        this.winH = this["default"].pc.winH;
      }
    }
    /**
     * リサイズイベント
     */

  }, {
    key: "resizeUpdate",
    value: function resizeUpdate() {
      var isDevice = _common_AnyStore__WEBPACK_IMPORTED_MODULE_3__["default"].setDevice(); // デバイスが変わった

      if (this.isDevice != isDevice) {
        this.isDevice = isDevice;
      } // 設定値を設定


      this.setConfig();

      if (window.innerWidth > 1680) {
        this.radius = this.config.radius;
      } else {
        this.radius = window.innerWidth * this.config.radiusRatio;
      } // 中心の座標


      this.center = {
        x: window.innerWidth / 2 - this.slides[0].clientWidth / 2,
        //y: window.innerHeight / 2 - this.slides[0].clientHeight / 2
        y: this.winH / 2 - this.slides[0].clientHeight / 2
      }; // 半径
      //this.radius = 1000;//window.innerHeight / 2;

      this.radius = this.radius * this.config.zoom + this.slides[0].clientHeight * 0.5; // 初期位置

      this.moveRotation();
    }
    /**
     * スライドボタンの番号を変更
     */

  }, {
    key: "setUI",
    value: function setUI(arr) {
      // 消す
      this.el.querySelector('.p-btn-kv--left > span').textContent = '0' + (arr[0] + 1);
      this.el.querySelector('.p-btn-kv--right > span').textContent = '0' + (arr[2] + 1);
    }
    /*
    play() {
     for (let i = 0; i < this.max; i++) {
       let radian = this.getRadian(this.obj.angle + ((360 / this.max) * i));
       // Math.sin(radian)は-1から1までを正弦波で返す
      // radiusをかけることでそれを半径とする円の範囲でアニメーション
      let offsetX = Math.sin(radian) * this.radius;
      let offsetZ = Math.cos(radian) * this.radius;
       TweenMax.set(this.slides[i], {
        x: this.center.x + offsetX,
        y: this.center.y,
        z: offsetZ * 1.2,
        zIndex: offsetZ
      });
     }
     // アニメーションで使用する角度を進める量
    // つまり、速度
    this.obj.angle += this.speed;
     requestAnimationFrame(() => {
      this.play();
    });
    }*/

  }]);

  return homeDepthKV;
}();

