/**
 * Copyright 2016-present, Bkav, Cop.
 * All rights reserved.
 *
 * This source code is licensed under the Bkav license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @author phucnhb@bkav.com on 12/09/2020.
 *
 * History:
 * @modifier abc@bkav.com on xx/xx/xxxx đã chỉnh sửa abcxyx (Chỉ các thay đổi quan trọng mới cần ghi lại note này)
 */

'use strict';

import {weakDots, normalDots, strongDots} from './dot';

const maxRealDots = {
  weak: Math.floor(weakDots.length / 1.25),
  normal: Math.floor(normalDots.length / 1.25),
  strong: Math.floor(strongDots.length / 1.25),
};

const maxAllDots = Math.floor(
  (weakDots.length + normalDots.length + strongDots.length) / 1.25,
);

const isWeak = rssi => {
  return rssi <= -90;
};
const isNormal = rssi => {
  return rssi > -90 && rssi <= -70;
};
const isStrong = rssi => {
  return rssi > -70;
};

// Tra ve 1 so random trong khoang min, max
const getRandomArbitrary = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getRandomDotAmountSafe = (weakCount, normalCount, strongCount) => {
  const allDots = weakCount + normalCount + strongCount;
  let min = 0;
  let max = 0;
  if (allDots === 0) {
    min = 1;
    max = 3;
  } else {
    // Kiem tra de dam bao so Dot quet duoc + 25% se khong vuot qua so diem co the ve
    const realAllDots = allDots >= maxAllDots ? maxAllDots : allDots;
    // Lay random trong khoang tu _num toi _num * 1.25
    min = realAllDots;
    max = Math.floor(realAllDots * 1.25);
  }
  let dotAmount = getRandomArbitrary(min, max);

  // Tinh toan dam bao so luong Dot quet duong khong vuot qua so diem co the ve ra
  let remain = 0;
  // Neu so Strong Dot quet duoc nhieu hon so diem co the ve
  if (strongCount > strongDots.length) {
    remain = strongCount - strongDots.length;
    strongCount = strongDots.length;
  }
  // Day bot 1 phan Strong Dot sang Normal Dot neu thua
  normalCount = normalCount + remain;
  remain = 0;
  // Neu so Normal Dot quet duoc nhieu hon so diem co the ve
  if (normalCount > normalDots.length) {
    remain = normalCount - normalDots.length;
    normalCount = normalDots.length;
  }
  // Day bot 1 phan Normal Dot sang Weak Dot neu thua
  weakCount = weakCount + remain;
  // Neu so Weak Dot quet duoc vuot qua so diem co the ve thi chi giu lai so luong co the ve
  if (weakCount > weakDots.length) {
    weakCount = weakDots.length;
  }

  // Phan phoi so dotAmount random cho cac trang thai
  if (dotAmount <= strongCount) {
    strongCount = dotAmount;
    normalCount = 0;
    weakCount = 0;
  } else if (dotAmount <= strongCount + normalCount) {
    normalCount = dotAmount - strongCount;
    weakCount = 0;
  } else if (dotAmount <= strongCount + normalCount + weakCount) {
    weakCount = dotAmount - strongCount - normalCount;
  }

  return {
    weakCount,
    normalCount,
    strongCount,
  };
};

const getRandomDotArr = (length, max) => {
  const arr = [];

  while (arr.length < length) {
    const r = Math.floor(Math.random() * max);
    if (arr.indexOf(r) === -1) {
      arr.push(r);
    }
  }
  return arr;
};

const getRandomDotIndex = (bzs = []) => {
  let weakCount = 0;
  let normalCount = 0;
  let strongCount = 0;

  for (let i = 0; i < bzs.length; i++) {
    const rssi = bzs[i];
    if (isWeak(rssi)) {
      weakCount++;
    } else if (isNormal(rssi)) {
      normalCount++;
    } else {
      strongCount++;
    }
  }

  const dotAmounts = getRandomDotAmountSafe(
    weakCount,
    normalCount,
    strongCount,
  );

  const weak = getRandomDotArr(dotAmounts.weakCount, weakDots.length);
  const normal = getRandomDotArr(dotAmounts.normalCount, normalDots.length);
  const strong = getRandomDotArr(dotAmounts.strongCount, strongDots.length);

  return {strong, normal, weak};
};

export {getRandomDotIndex};
