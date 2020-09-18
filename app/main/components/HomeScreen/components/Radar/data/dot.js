/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 11/09/2020.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

'use strict';

const RADIUS = 295;
const RADIUS1B = RADIUS - 230;
const RADIUS2A = RADIUS - 165;
const RADIUS2B = RADIUS - 120;
const RADIUS3A = RADIUS - 55;
const RADIUS3B = RADIUS - 15;
const CENTER_X = 380;
const CENTER_Y = 450;
const TIME_LOOP = 60;
const HALF_TIME_LOOP = TIME_LOOP / 2;
const ONE = Math.PI / 180;
const FRAMES = 60;

const dotWrapper = {
  v: '5.7.1',
  fr: 30,
  ip: 0,
  op: 60,
  w: 720,
  h: 720,
  nm: 'Dot',
  ddd: 0,
  assets: [],
  layers: [],
  markers: [],
};
const dotData = {
  ddd: 0,
  ind: 8,
  ty: 4,
  nm: 'Shape Layer 1',
  sr: 1,
  ks: {
    o: {
      a: 1,
      k: [],
      ix: 11,
    },
    r: {
      a: 0,
      k: 0,
      ix: 10,
    },
    p: {
      a: 0,
      k: [0, 0, 0],
      ix: 2,
    },
    a: {
      a: 0,
      k: [0, 0, 0],
      ix: 1,
    },
    s: {
      a: 0,
      k: [70, 70, 100],
      ix: 6,
    },
  },
  ao: 0,
  shapes: [
    {
      ty: 'gr',
      it: [
        {
          d: 1,
          ty: 'el',
          s: {
            a: 0,
            k: [36, 36],
            ix: 2,
          },
          p: {
            a: 0,
            k: [0, 0],
            ix: 3,
          },
          nm: 'Ellipse Path 1',
          mn: 'ADBE Vector Shape - Ellipse',
          hd: false,
        },
        {
          ty: 'st',
          c: {
            a: 0,
            k: [1, 1, 1, 1],
            ix: 3,
          },
          o: {
            a: 0,
            k: 100,
            ix: 4,
          },
          w: {
            a: 0,
            k: 0,
            ix: 5,
          },
          lc: 1,
          lj: 1,
          ml: 4,
          bm: 0,
          nm: 'Stroke 1',
          mn: 'ADBE Vector Graphic - Stroke',
          hd: false,
        },
        {
          ty: 'fl',
          c: {
            a: 0,
            k: [1, 1, 1, 1],
            ix: 4,
          },
          o: {
            a: 0,
            k: 100,
            ix: 5,
          },
          r: 1,
          bm: 0,
          nm: 'Fill 1',
          mn: 'ADBE Vector Graphic - Fill',
          hd: false,
        },
        {
          ty: 'tr',
          p: {
            a: 0,
            k: [-27, -90],
            ix: 2,
          },
          a: {
            a: 0,
            k: [0, 0],
            ix: 1,
          },
          s: {
            a: 0,
            k: [100, 100],
            ix: 3,
          },
          r: {
            a: 0,
            k: 0,
            ix: 6,
          },
          o: {
            a: 0,
            k: 100,
            ix: 7,
          },
          sk: {
            a: 0,
            k: 0,
            ix: 4,
          },
          sa: {
            a: 0,
            k: 0,
            ix: 5,
          },
          nm: 'Transform',
        },
      ],
      nm: 'Ellipse 1',
      np: 3,
      cix: 2,
      bm: 0,
      ix: 1,
      mn: 'ADBE Vector Group',
      hd: false,
    },
  ],
  ip: 0,
  op: 60,
  st: 0,
  bm: 0,
};
const dotTimeline = {
  i: {
    x: [0.833],
    y: [0.833],
  },
  o: {
    x: [0.167],
    y: [0.167],
  },
  t: 0,
  s: [0],
};

const getDotXYInBottomLeft = (alpha, radius) => {
  const _alpha = ONE * (90 / alpha);
  const result = [];
  for (let i = 0; i < alpha; i++) {
    result.push({
      x: CENTER_X - Math.sin(_alpha * i) * radius,
      y: CENTER_Y + Math.cos(_alpha * i) * radius,
    });
  }
  return result;
};
const getDotXYInTopLeft = (alpha, radius) => {
  const _alpha = ONE * (90 / alpha);
  const result = [];
  for (let i = 0; i < alpha; i++) {
    result.push({
      x: CENTER_X - Math.cos(_alpha * i) * radius,
      y: CENTER_Y - Math.sin(_alpha * i) * radius,
    });
  }
  return result;
};
const getDotXYInTopRight = (alpha, radius) => {
  const _alpha = ONE * (90 / alpha);
  const result = [];
  for (let i = 0; i < alpha; i++) {
    result.push({
      x: CENTER_X + Math.sin(_alpha * i) * radius,
      y: CENTER_Y - Math.cos(_alpha * i) * radius,
    });
  }
  return result;
};
const getDotXYInBottomRight = (alpha, radius) => {
  const _alpha = ONE * (90 / alpha);
  const result = [];
  for (let i = 0; i < alpha; i++) {
    result.push({
      x: CENTER_X + Math.cos(_alpha * i) * radius,
      y: CENTER_Y + Math.sin(_alpha * i) * radius,
    });
  }
  return result;
};
const getDotXY = (alpha, radius) => {
  return [
    ...getDotXYInBottomLeft(alpha, radius),
    ...getDotXYInTopLeft(alpha, radius),
    ...getDotXYInTopRight(alpha, radius),
    ...getDotXYInBottomRight(alpha, radius),
  ];
};

const getDotXY3B = () => {
  return getDotXY(10, RADIUS3B);
};
const getDotXY3A = () => {
  return getDotXY(9, RADIUS3A);
};
const getDotXY2B = () => {
  return getDotXY(7, RADIUS2B);
};
const getDotXY2A = () => {
  return getDotXY(5, RADIUS2A);
};
const getDotXY1B = () => {
  return getDotXY(3, RADIUS1B);
};

const _getDots = (dotXYArr, type) => {
  const result = [];
  const dotXYArrLength = dotXYArr.length;
  for (let i = 0; i < dotXYArrLength; i++) {
    const firstStep = (TIME_LOOP / dotXYArrLength) * i;
    const tmp0 = firstStep; // Opacity 0
    const tmp1 = firstStep + 6; // Opacity 100
    const tmp2 = firstStep + (HALF_TIME_LOOP - 6); // Opacity 100
    const tmp3 = firstStep + HALF_TIME_LOOP; // Opacity 0

    let firstBeginFrame = 0;
    let firstEndFrame = 0;
    let otherBeginFrame = 0;
    let otherEndFrame = 0;
    let op = 0;
    let timeline = [];

    if (tmp3 <= TIME_LOOP) {
      timeline = [
        Object.assign({}, dotTimeline, {t: 0, s: [0]}),
        Object.assign({}, dotTimeline, {t: tmp0, s: [0]}),
        Object.assign({}, dotTimeline, {t: tmp1, s: [100]}),
        Object.assign({}, dotTimeline, {t: tmp2, s: [100]}),
        Object.assign({}, dotTimeline, {t: tmp3, s: [0]}),
        Object.assign({}, dotTimeline, {t: TIME_LOOP, s: [0]}),
      ];
      firstBeginFrame = 0;
      firstEndFrame = TIME_LOOP;
      otherBeginFrame = 0;
      otherEndFrame = TIME_LOOP;
      op = TIME_LOOP;
    } else {
      timeline = [
        Object.assign({}, dotTimeline, {t: 0, s: [0]}),
        Object.assign({}, dotTimeline, {t: tmp3 - TIME_LOOP, s: [0]}),
        Object.assign({}, dotTimeline, {t: tmp0, s: [0]}),
        Object.assign({}, dotTimeline, {t: tmp1, s: [100]}),
        Object.assign({}, dotTimeline, {t: tmp2, s: [100]}),
        Object.assign({}, dotTimeline, {t: tmp3, s: [0]}),
      ];
      firstBeginFrame = 0;
      firstEndFrame = tmp3;
      otherBeginFrame = tmp3 - TIME_LOOP;
      otherEndFrame = tmp3;
      op = tmp3;
    }

    const x = dotXYArr[i].x;
    const y = dotXYArr[i].y;
    const data = Object.assign({}, dotData, {
      op,
      nm: `Sharp_${type}_${i}`,
      ks: {o: {k: timeline}, p: {k: [x, y, 0]}},
    });
    const dot = Object.assign({}, dotWrapper, {
      op,
      nm: `Dot_${type}_${i}`,
      layers: [data],
      type,
      firstBeginFrame,
      firstEndFrame,
      otherBeginFrame,
      otherEndFrame,
    });

    result.push(dot);
  }
  return result;
};
const getDots3B = () => {
  return _getDots(getDotXY3B(), 'strong1');
};
const getDots3A = () => {
  return _getDots(getDotXY3A(), 'strong2');
};
const getDots2B = () => {
  return _getDots(getDotXY2B(), 'normal1');
};
const getDots2A = () => {
  return _getDots(getDotXY2A(), 'normal2');
};
const getDots1B = () => {
  return _getDots(getDotXY1B(), 'weak');
};

const strongDots = [...getDots1B()];
const normalDots = [...getDots2B(), ...getDots2A()];
const weakDots = [...getDots3B(), ...getDots3A()];

export {strongDots, normalDots, weakDots};
