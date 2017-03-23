/**
 * @description 工具库
 */

/**
 * @description 是否是dom元素
 * @param o {object}
 * @returns {boolean}
 */
function isDom(o) {
  if (typeof HTMLElement === 'object') {
    return o instanceof HTMLElement;
  }

  return o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string';
}

/**
 * @description 设置元素样式
 * @param {HTMLElement} element 
 * @param {object} style 
 */
function setStyle(element, style) {
  if (typeof style !== 'object') {
    return;
  }

  for (let key in style) {
    element.style[key] = style[key];
  }
}

/**
 * @description 拉取图片
 * @param {string} src 
 * @returns {object} pullImage
 */
function pullImage(src) {
  let imgDom = document.createElement('img');

  imgDom.addEventListener('load', (ev) => {
    pullImage.AFTER_HOOK && pullImage.AFTER_HOOK(null, imgDom);

    pullImage.AFTER_HOOK = null;
  });

  imgDom.addEventListener('error', (ev) => {
    let err = new Error('图片加载失败');

    pullImage.AFTER_HOOK && pullImage.AFTER_HOOK(err, imgDom);
    pullImage.AFTER_HOOK = null;
  });

  imgDom.src = src;

  return pullImage;
}

pullImage.after = function (fn) {
  pullImage.AFTER_HOOK = fn;
}

/**
 * @description 创建元素
 * @param {*} tag 
 * @param {*} style 
 * @param {*} child 
 */
function createElement(tag, style, child){
  let dom = document.createElement(tag);
  style && setStyle(dom, style);
  child && isDom(child) && dom.appendChild(child);

  return dom;
}

function ease(x) {
  return Math.sqrt(1 - Math.pow(x - 1, 2));
};

export {
  isDom,
  setStyle,
  pullImage,
  createElement,
  ease
};