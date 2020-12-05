const button = document.querySelector('.button')
const chart = document.getElementById('chart')

function renderData(data) {
  console.log(data)
  const sum = data.reduce((acc, d) => {
    acc += d.count
    return acc
  }, 0)
}

button.addEventListener('click', function () {
  axios
    .get('/orderbook')
    .then((res) => {
      const { data } = res
      renderData(data)
    })
    .catch((err) => {
      console.log(err)
    })
})
