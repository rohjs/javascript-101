const button = document.querySelector('.button')
const asksChart = document.getElementById('asksChart')
const bidsChart = document.getElementById('bidsChart')
const asksTbody = asksChart.querySelector('tbody')
const bidsTbody = bidsChart.querySelector('tbody')

const LENGTH = 20

function processData(rawData, type) {
  let dataList = [...rawData].sort((a, b) => b.price - a.price)

  if (type === 'ASK') {
    dataList.reverse()
  }

  dataList = dataList.slice(0, LENGTH)

  const totalQty = dataList.reduce((acc, d) => {
    acc += Number(d.qty)
    return acc
  }, 0)

  let cumQty = 0
  return dataList.map((data) => {
    const { price, qty } = data
    cumQty += Number(qty)
    const percent = (cumQty / totalQty) * 100

    return {
      price,
      qty,
      cumQty: cumQty,
      percent,
    }
  })
}

function formatNumberValue(value) {
  return Number(value).toLocaleString()
}

function createTableRow(data, index) {
  const { price, qty, cumQty, percent } = data
  const animationDelay = index * 50
  const row = document.createElement('tr')
  const priceData = document.createElement('td')
  const qtyData = document.createElement('td')
  const cumQtyData = document.createElement('td')

  const cumQtyText = document.createElement('span')
  const cumQtyBar = document.createElement('span')

  row.setAttribute('style', `animation-delay: ${animationDelay}ms;`)

  priceData.innerText = formatNumberValue(price)
  priceData.classList.add('price')
  // priceData.setAttribute('class', 'price')

  qtyData.innerText = formatNumberValue(qty)
  // qtyData.setAttribute('class', 'qty')
  qtyData.classList.add('qty')

  cumQtyText.innerText = formatNumberValue(cumQty)
  // cumQtyData.setAttribute('class', 'total')
  cumQtyData.classList.add('total')

  cumQtyBar.setAttribute('style', `width: ${percent}%;`)
  // cumQtyBar.setAttribute('class', 'bar')
  cumQtyBar.classList.add('bar')
  cumQtyData.append(cumQtyText, cumQtyBar)

  row.append(priceData, qtyData, cumQtyData)

  return row
}

function renderChart(data) {
  const asks = data.filter((d) => d.side === 'ASK')
  const bids = data.filter((d) => d.side === 'BID')

  const asksList = processData(asks, 'ASK')
  const bidsList = processData(bids, 'BID')

  asksList.forEach((item, i) => {
    asksTbody.appendChild(createTableRow(item, i))
  })

  bidsList.forEach((item, i) => {
    bidsTbody.appendChild(createTableRow(item, i))
  })
}

button.addEventListener('click', function () {
  this.parentNode.classList.add('hide')

  axios
    .get('/orderbook')
    .then((res) => {
      const { data } = res
      renderChart(data)
    })
    .catch((err) => {
      console.error(err)
    })
})
