# 图片预览组件——H5

## 简介

   图片预览组件，基于 CSS3 实现，提供对图片的放大、缩小、移动、旋转等一些列的变换操作。

## 安装

```shell
  npm install image-preview --save-dev
```

## 使用
```javascript
  var PreviewImage = require("preview-image");
  var previewImage = new PreviewImage( element, {
    imageSrc: 'http://xxx.com/xxx.png', // 图片地址
    doubleZoom: 2, // 双击缩放
    maxZoom: 4, // 最大缩放
    minZoom: 1, // 最小缩放
    softY: true, // x 轴支持
    softX: true, // y 轴支持
  });
  
  previewImage.unbind(); // 解除事件绑定
  previewImage.bind(); // 开启事件绑定
```
