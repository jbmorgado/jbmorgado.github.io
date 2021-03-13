function showStatistics(selection) {
  clear()
  const statByType = calcByType(selection)
  getContainer().appendChild(createStatTable('by Type', 'Empty selection.', statByType))
}

function clear() {
  const elements = getContainer().getElementsByClassName('stat-list__table')
  for (let i = 0; i < elements.length; i++) {
    elements.item(i).remove()
  }
}

function getContainer() {
  return document.getElementById('stat-container')
}

function createStatTable(title, emptyText, data) {
  const statView = document.createElement('div')
  statView.className = 'stat-list__table'

  const titleView = document.createElement('div')
  titleView.className = 'stat-list__title'
  titleView.innerHTML = `<span>${title}</span>`
  statView.appendChild(titleView)

  if (data.size === 0) {
    const emptyView = document.createElement('div')
    emptyView.className = 'stat-list__empty'
    emptyView.innerText = emptyText
    statView.appendChild(emptyView)
  } else {
    data.forEach((value, key) => {
      let itemView = document.createElement('div')
      itemView.className = 'stat-list__item'
      itemView.innerHTML =
        `<span class="stat-list__item-name">${key.toLowerCase()}</span>` +
        `<span class="stat-list__item-value">${value}</span>`
      statView.appendChild(itemView)
    })
  }
  return statView
}

function calcByType(widgets) {
  return countCards(widgets, (a) => a.type)
}

function countCards(list, keyGetter) {
  let storyPoints = 0
  const map = new Map()
  list.forEach((item) => {
    const key = keyGetter(item)
    if (key === "CARD") {
      const count = map.get(key)
      map.set("Stories", !count ? 1 : count + 1)
      storyPoints = storyPoints + item.customFields[3].value
      map.set("Story Points", storyPoints)
    }
  })
  return new Map([...map.entries()].sort((a, b) => b[1] - a[1]))
}

miro.onReady(() => {
  miro.addListener('SELECTION_UPDATED', (e) => {
    showStatistics(e.data)
  })
  miro.board.selection.get().then(showStatistics)
})
