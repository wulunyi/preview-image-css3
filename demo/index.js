import './index.scss';
import PreviewImage from '../src/preview-image-css3';
import Gesture from 'alloyfinger';
var img = require('./cover.jpg');

let rootDom = document.getElementsByClassName('app')[0];

let previewImage = new PreviewImage(rootDom, {
    imageSrc: 'https://si.geilicdn.com/bj-IM-208863409-1489732174291-2036503674-unadjust.jpg', // 图片地址
    rotatable: false, // 是否开启旋转
    doubleZoom: 2, // 双击缩放
    maxZoom: 4, // 最大缩放
    minZoom: 1, // 最小缩放
    angled: 0, // 初始旋转角度
    softX: true // 边界是否开启过渡动画
  });

  previewImage.start();
  