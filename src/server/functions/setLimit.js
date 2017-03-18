export default function setLimit(arrToSend, initArr, arrLength) {
  if (arrToSend.length === arrLength || initArr[0] === undefined) return;
  arrToSend.unshift(initArr[0]);
  initArr.shift();
  setLimit(arrToSend, initArr, arrLength);
}
