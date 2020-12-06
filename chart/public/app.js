const button = document.querySelector('.button')
const sellTable = document.getElementById('sellTable')
const buyTable = document.getElementById('buyTable')
const sellTbody = sellTable.querySelector('tbody')
const buyTbody = buyTable.querySelector('tbody')

const LENGTH = 20

function processData(rawData, side) {
  let dataList = [...rawData].sort((a, b) => b.price - a.price)

  if (side === 'SELL') {
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

  qtyData.innerText = formatNumberValue(qty)
  qtyData.classList.add('qty')

  cumQtyText.innerText = formatNumberValue(cumQty)
  cumQtyData.classList.add('total')

  cumQtyBar.setAttribute('style', `width: ${percent}%;`)
  cumQtyBar.classList.add('bar')
  cumQtyData.append(cumQtyText, cumQtyBar)

  row.append(priceData, qtyData, cumQtyData)

  return row
}

function renderTable(data) {
  const sell = data.filter((d) => d.side === 'SELL')
  const buy = data.filter((d) => d.side === 'BUY')

  const sellList = processData(sell, 'SELL')
  const buyList = processData(buy, 'BUY')

  sellList.forEach((item, i) => {
    sellTbody.appendChild(createTableRow(item, i))
  })

  buyList.forEach((item, i) => {
    buyTbody.appendChild(createTableRow(item, i))
  })
}

button.addEventListener('click', function () {
  this.parentNode.classList.add('hide')

  axios
    .get('/orderbook')
    .then((res) => {
      const { data } = res
      renderTable(data)
    })
    .catch((err) => {
      console.error(err)
    })
})
