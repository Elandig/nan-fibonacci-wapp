// MIT License. Copyright (c) 2021 Elandig

const prePreviousOne = document.getElementById("counter-1")
const previousOne = document.getElementById("counter-2")
const counter = document.getElementById("counter-3")

const updateState = (value, reset) => {
  prePreviousOne.innerHTML = reset ? '...' : previousOne.innerHTML
  previousOne.innerHTML = reset ? '...' : counter.innerHTML
  counter.innerHTML = value
}

document.getElementById("getBtn").addEventListener("click", () => {
  fetch('get').then((response) => {
    if (!response.ok)
      throw Error(response.statusText)
    response.text().then(data => updateState(data.length <= 17 ? data : data + '..'))
  })
})

document.getElementById("resetBtn").addEventListener("click", () => {
  fetch('reset').then((response) => {
    if (!response.ok)
      throw Error(response.statusText)
    response.text().then(data => {
      updateState(data, true)
      fetch('get')
    })
  })
})

fetch('reset')
fetch('get')