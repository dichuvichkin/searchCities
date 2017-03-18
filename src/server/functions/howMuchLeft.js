export default function howMuchLeft(arrToSend, initArr, count) {
  const text = `Показано ${arrToSend.length} из ${initArr.length} найденных городов. Уточните запрос, чтобы увидеть остальные`;
  if (initArr.length <= count) return;
  arrToSend.push(text);
}
