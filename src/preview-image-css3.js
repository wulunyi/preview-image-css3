/**
 * @description 图片预览
 */
import Gesture from 'alloyfinger';
import Transform from 'css3transform';
import * as util from './util';
import To from './to';
import * as BaseMath from './base-math'
import './loading-style';

export {
  util
};

export default class PreviewImage {
  /**
   * @description 构造函数
   * @param {Object} element 
   * @param {Object} options 
   */
  constructor(element, options) {
    if (util.isDom(element)) {
      // 配置选项
      this.options = typeof options === 'object' ? options : {};
      // 缓存容器
      this.context = element;
      // 缓存容器几何信息
      this.conBox = element.getBoundingClientRect();
      // 函数调用栈
      this.callList = [];

      // 设置容器样式
      util.setStyle(this.context, {
        position: 'relative',
        overflow: 'hidden'
      });


    } else {
      console.warn('The element isRequierd');
    }
  }

  /**
   * @description 获取配置文件
   */
  get options() {
    return this._options;
  }

  /**
   * @description 设置配置文件
   * @param {Object} options
   */
  set options(options) {
    this._options = {
      imageSrc: '', // 图片地址
      doubleZoom: 2, // 双击
      maxZoom: 4, // 最大缩放
      minZoom: 1, // 最小缩放
      softX: true, // x 轴是否开启过渡动画
      softY: true // y 轴是否开启过渡动画
    };

    for (let key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        this._options[key] = options[key];
      }
    }
  }

  get element() {
    return this._element;
  }

  set element(element) {
    if (this._element) {
      return;
    }

    this._element = element;

    // 插入元素
    this.context.appendChild(this.element);
  }

  start() {
    if(this.element){
      this.bind();

      return;
    }
    
    // loading 动画
    this._loading('start');

    // 拉取图片
    (new util.pullImage(this.options.imageSrc)).after((err, imgDom) => {
      // loading 动画结束
      this._loading('end');

      if (err) {
        this._err();

        return console.warn(err);
      }

      // 开始执行
      this._init(imgDom);

      while (this.callList.length) {
        this.callList.shift()();
      }
    });
  }

  _init(imgDom) {
    if (!imgDom) {
      return console.warn('miss aruments');
    }

    // 计算图片形状 1 为横图 －1 为竖图
    let s = BaseMath.judgeShape(imgDom.width, imgDom.height);

    // 计算初始显示宽高
    let {
      w,
      h
    } = BaseMath.transformWH(
      this.context.clientWidth,
      this.context.clientHeight,
      imgDom.width,
      imgDom.height,
      s
    );

    // 计算定位位置
    let topPx = s === -1 ? 0 : this.context.clientHeight / 2 - h / 2;
    let leftPx = s === 1 ? 0 : this.context.clientWidth / 2 - w / 2;

    // 设置元素样式
    util.setStyle(imgDom, {
      position: 'absolute',
      width: w + 'px',
      height: h + 'px',
      top: topPx + 'px',
      left: leftPx + 'px'
    });

    this.element = imgDom;

    // 缓存元素几何信息
    this.elBox = this.element.getBoundingClientRect();
    this.leftPx = leftPx;
    this.topPx = topPx;

    // 扩展元素变形能力
    Transform(this.element);

    // 绑定事件
    this.bind();
  }

  _loading(comand) {
    if (comand === 'start') {
      if (!this.loadingDom) {
        this.loadingDom = document.createElement('div');
        this.loadingDom.className = 'loader';
      }

      this.context.appendChild(this.loadingDom);
    }

    if (comand === 'end') {
      this.context.removeChild(this.loadingDom);
    }
  }

  _err() {
    if (!this.errDom) {
      this.errDom = document.createElement('p');
      this.errDom.className = 'pr__load--err';
      this.errDom.innerHTML = '图片加载失败'
    }

    this.context.appendChild(this.errDom);
  }

  bind() {
    if (!this.element) {
      this.callList.push(() => {
        this.bind()
      });

      return;
    }

    if (this.gesture) {
      this.unbind();
    }

    let el = this.element;
    let minR = this.options.minZoom;
    let maxR = this.options.maxZoom;
    let elBox = this.elBox;
    let conBox = this.conBox;
    let _this = this;
    let leftPx = this.leftPx;
    let topPx = this.topPx;

    let ease = util.ease;
    let scale = 1;
    let pressMoved = false;

    this.gesture = new Gesture(this.context, {
      multipointStart: function () {
        To.stopAll();

        scale = el.scaleX;
      },

      pinch: function (evt) {
        el.scaleX = el.scaleY = scale * evt.scale;
      },

      multipointEnd: function () {
        if (el.scaleX < minR) {
          new To(el, "scaleX", minR, 500, ease);
          new To(el, "scaleY", minR, 500, ease);
        }

        if (el.scaleX > maxR) {
          new To(el, "scaleX", maxR, 500, ease);
          new To(el, "scaleY", maxR, 500, ease);
        }
      },

      pressMove: function (evt) {
        To.stopAll();

        // 标记 move 执行过
        pressMoved = true;

        let softX = _this.options.softX;
        let softY = _this.options.softY;

        if (softX) {
          el.translateX += evt.deltaX;
          _this.moveX = true;
        } else {
          let mx = BaseMath.checkPlace(elBox.width, conBox.width, leftPx, el.translateX + evt.deltaX, el.scaleX);

          if (mx === false) {
            el.translateX += evt.deltaX;
            _this.moveX = true;
          }else{
            _this.moveX = false;
          }
        }

        if (softY) {
          el.translateY += evt.deltaY;
          _this.moveY = true;
        } else {
          let my = BaseMath.checkPlace(elBox.height, conBox.height, topPx, el.translateY + evt.deltaY, el.scaleY);

          if (my === false) {
            el.translateY += evt.deltaY;
            _this.moveY = true;
          }else{
            _this.moveY = false;
          }
        }

        evt.preventDefault();
      },

      touchEnd: function () {
        // 移动且支持拖拽动画
        if (pressMoved) {
          let my = BaseMath.checkPlace(elBox.height, conBox.height, topPx, el.translateY, el.scaleY);
          let mx = BaseMath.checkPlace(elBox.width, conBox.width, leftPx, el.translateX, el.scaleX);

          // 归位
          if (my !== false) {
            new To(el, "translateY", my, 400, ease);
          }

          // 归位
          if (mx !== false) {
            new To(el, "translateX", mx, 400, ease);
          }
        }

        pressMoved = false;
      },

      doubleTap: function (evt) {
        To.stopAll();

        let r = _this.options.doubleZoom;
        let middleR = (minR + r) / 2;
        let time = 400;

        if (el.scaleX > middleR) {
          new To(el, "scaleX", minR, time, ease);
          new To(el, "scaleY", minR, time, ease);

          new To(el, "translateX", 0, time, ease);
          new To(el, "translateY", 0, time, ease);
        } else {
          // 圆心坐标
          let [ox, oy] = [conBox.width / 2, conBox.height / 2];
          // 点击坐标
          let [tpx, tpy] = [evt.changedTouches[0].pageX, evt.changedTouches[0].pageY];

          // 偏移量
          let dx = BaseMath.calculateOffset(ox, tpx, leftPx, elBox.width, conBox.width, r);
          let dy = BaseMath.calculateOffset(oy, tpy, topPx, elBox.height, conBox.height, r);

          // 缩放
          new To(el, "scaleX", r, time, ease);
          new To(el, "scaleY", r, time, ease);
          // 移动
          new To(el, "translateX", dx, time, ease);
          new To(el, "translateY", dy, time, ease);
        }
      }
    });
  }

  unbind() {
    if (!this.element) {
      this.callList.push(() => {
        this.unbind()
      });

      return;
    }

    this.gesture = this.gesture && this.gesture.destroy();
  }

  reset(t) {
    let time = t || 0;
    let el = this.element;
    let ease = util.ease;

    if (this.element) {
      // 缩放
      new To(el, "scaleX", this.options.minZoom, time, ease);
      new To(el, "scaleY", this.options.minZoom, time, ease);
      // 移动
      new To(el, "translateX", 0, time, ease);
      new To(el, "translateY", 0, time, ease);
    }
  }
}