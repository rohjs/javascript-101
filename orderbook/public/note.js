const button = document.querySelector('.button')
const sellTable = document.getElementById('sellTable')
const sellTbody = sellTable.querySelector('tbody')
const buyTable = document.getElementById('buyTable')
const buyTbody = buyTable.querySelector('tbody')

const LENGTH = 20

function processData(rawData, side) {
  let data = [...rawData]
  if (side === 'SELL') {
    data.reverse()
  }
  data = data.slice(0, LENGTH)

  const result = []
  const totalQty = data.reduce(function (acc, item) {
    const { qty } = item
    acc += parseFloat(qty)
    return acc
  }, 0)

  // cumulative 누적
  let cumQty = 0
  data.forEach(function (item, index) {
    const { price, qty } = item
    cumQty += parseFloat(qty)
    const percent = (cumQty / totalQty) * 100
    const newDataItem = {
      price,
      qty,
      cumQty,
      percent,
    }
    result.push(newDataItem)
  })

  console.log(result)
  return result
}

function createTableRow(item) {
  const { price, qty, cumQty, percent } = item
  const row = document.createElement('tr')
  const priceData = document.createElement('td')
  const qtyData = document.createElement('td')
  const cumQtyData = document.createElement('td')

  const cumQtyText = document.createElement('span')
  const cumQtyBar = document.createElement('span')

  priceData.innerText = price
  priceData.setAttribute('class', 'price')

  qtyData.innerText = qty
  qtyData.setAttribute('class', 'qty')

  cumQtyData.setAttribute('class', 'total')
  cumQtyText.innerText = cumQty
  cumQtyBar.setAttribute('class', 'bar')
  cumQtyBar.setAttribute('style', `width: ${percent}%;`)

  cumQtyData.append(cumQtyText, cumQtyBar)
  row.append(priceData, qtyData, cumQtyData)

  return row
}

function renderTable(data, side) {
  if (side === 'SELL') {
    data.forEach(function (item) {
      const newItem = createTableRow(item)
      sellTbody.appendChild(newItem)
    })
  } else {
    data.forEach(function (item) {
      const newItem = createTableRow(item)
      buyTbody.appendChild(newItem)
    })
  }
}

button.addEventListener('click', function () {
  this.parentNode.classList.add('hide')

  axios
    .get('/orderbook')
    .then((res) => {
      const { data } = res
      const sellData = data.filter(function (item) {
        return item.side === 'SELL'
      })
      const buyData = data.filter(function (item) {
        return item.side === 'BUY'
      })
      const sellDataList = processData(sellData, 'SELL')
      const buyDataList = processData(buyData, 'BUY')

      renderTable(sellDataList, 'SELL')
      renderTable(buyDataList, 'BUY')
    })
    .catch((err) => {
      console.error(err)
    })
})
