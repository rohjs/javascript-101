const button = document.querySelector('.button')

function processData(rawData, side) {
  /* TODO:
   * 1. side가 SELL인 데이터와 BUY인 데이터를 나눈다
   * 2. SELL의 경우 가장 싼 값 20개를 추출하고 BUY의 경우 가장 비싼 값 20개를 추출한다
   * 3. 그렇게 추출한 배열 데이터를 테이블을 만드는 데 필요한 데이터로 새로 가공해 리턴한다
   *
   * 필요한 정보
   * {
   *  price: '가격',
   *  qty: '수량',
   *  cumQty: '현 가격까지의 누적수량',
   *  percent: '누적합계 / 전체수량 * 100'
   * }
   **/
}

button.addEventListener('click', function () {
  this.parentNode.classList.add('hide')

  axios
    .get('/orderbook')
    .then((res) => {
      const { data } = res
      processData(data)
    })
    .catch((err) => {
      console.error(err)
    })
})
