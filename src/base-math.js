/**
 * @description 基础方法集合
 */

/**
 * @description 返回图片是长图或高图
 * @param {Number} w 宽度
 * @param {Number} h 高度且不为零
 * @returns {Number} 1 为长图 －1 为高图
 */
function judgeShape(w, h) {
  return (w / h) >= 1 ? 1 : -1;
}

function transformWH(bw, bh, w, h, s){
  return transformWH[s+''].apply(null, arguments);
}

transformWH['1'] = function(bw, bh, w, h){
  return {
    w: bw,
    h: h * bw / w
  }
}

transformWH['-1'] = function(bw, bh, w, h){
  return {
    h: bh,
    w: w * bh / h
  }
}

/**
 * @description 基于旋转中心变换后的点在原坐标系的坐标
 * @param {*} op 旋转中心点
 * @param {*} sp 绘制起点
 * @param {*} dp 偏移量
 * @param {*} r 缩放大小
 */
function calculatePoint(op, sp, dp, r){
  return (sp - op) * r + op + dp;
}

function calculagteRange(inS, outS, r){
  let aS = inS * r;

  if(aS <= outS){
    return {
      min: (outS - aS)/2,
      max: (outS - aS)/2
    }
  }

  return {
    min: outS - aS,
    max: 0
  }
}

/**
 * @description 计算是否需要归位 需要的偏移量
 * @param {*} inS 变换图形尺寸宽或高
 * @param {*} outS 容器尺寸宽或高
 * @param {*} sp 初始绘制位置相对于容器坐标系
 * @param {*} dp 偏移量
 * @param {*} r 缩放量
 */
function checkPlace(inS, outS, sp, dp, r){
  // 变换后坐标值
  let p = calculatePoint(outS/2, sp, dp, r);
  // 坐标变化范围
  let range = calculagteRange(inS, outS, r);
  // 返回值
  let result = false;

  // 判断
  if(range.min === range.max){
    result = 0;
  }else if(range.min > p){
    result = range.min - p + dp;
  }else if(range.max < p){
    result = range.max - p + dp;
  }

  return result;
}
/**
 * @description 计算便宜量
 * @param {Number} op 旋转中心坐标
 * @param {Number} tp 点击坐标
 * @param {Number} sp 绘制初始坐标
 * @param {Number} inS 图片容器尺寸
 * @param {Number} outS 包裹容器尺寸
 * @param {Number} r 缩放量
 */
function calculateOffset(op, tp, sp, inS, outS, r){
  // 相对旋转中心点击坐标
  let reTp = tp - op;
  // 相对旋转中心绘制坐标
  let reSp = sp - op;
  
  // 基于中心点变换后相对中心点坐标
  let p1 = (reSp - 0) * r + 0;
  // 基于点击点变换后相对于中心点坐标
  let p2 = (reSp - reTp) * r + reTp;

  // 两种变换差
  let dp = (p2 - p1);

  // 基于点击点变换后基于整个坐标系坐标
  let ap = (p2 + op);

  // 变换后的尺寸
  let aS = inS * r;

  // 最大坐标值
  let maxp = 0;
  // 最小坐标值
  let minp = outS - aS;

  if(aS <= outS){
    dp = 0;
  }else {
    if(ap > maxp){
      dp = maxp - op - p1;
    }

    if(ap < minp){
      dp = minp - op - p1
    }
  }

  return dp;
}

export {
  judgeShape,
  transformWH,
  calculateOffset,
  calculatePoint,
  calculagteRange,
  checkPlace
};