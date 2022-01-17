let mouseXOffset = 0
let mouseYOffset = 0
let dragInterval;
let dash
let mBtn
let dashClone
let dashWidth
let dashHeight
let winWidth
let winHeight
let redrawCount = 0
let redrawMax = 30

function startDragDashboard (event) {
  dash = document.querySelector("#dashboard")
  mBtn = document.querySelector("#move-btn")
  if (event.currentTarget.id = "move-btn") {
    dash.draggable = 'true';
    dashWidth = dash.getBoundingClientRect().right - dash.getBoundingClientRect().left
    winWidth = $(window).width()
    dashHeight = dash.getBoundingClientRect().bottom - dash.getBoundingClientRect().top
    winHeight = $(window).height()
    mouseXOffset =  event.clientX - dash.getBoundingClientRect().left;
    mouseYOffset =  event.clientY - dash.getBoundingClientRect().top;
    // let dashClone = document.getElementById("dash-template").content.firstElementChild.cloneNode(true);
    // dash.insertAdjacentElement('afterend', dashClone)
    dash.addEventListener('dragstart', dragstart_handler)
    dash.addEventListener('dragend', dropDash)
  } else {
    dash.draggable = 'false';
  }
}

const dragstart_handler = (ev) => {
  document.querySelector(".edit-page-identifier").addEventListener('dragover', dragover_handler);
  const currentDrag = ev.currentTarget;

  ev.dataTransfer.setData("application/my-app", currentDrag.id);
  // ev.currentTarget.addEventListener("onMouseUp", dropDash(ev), false);
}

function stopDragDashboard () {
  event.preventDefault();
  if (event.currentTarget.id = "move-btn") {
    dash.removeEventListener('dragstart', dragstart_handler)
    dash.removeEventListener('dragend', dropDash)
    dash.draggable = 'false';
  }
}

function dragDash(event) {
  event.preventDefault();
}

const dragover_handler = (ev) => {
  ev.preventDefault();
  ev.dataTransfer.dropEffect = 'move';
  dash.style.transition = 'all 0s';
  dash.style.opacity = 0;
  mBtn.style.cursor = 'grabbing'
};

function dropDash(ev) {
  console.log('ev.clientX ', ev.clientX)
  // dash.style.left = mouseXOffset - ev.clientX;
  // dash.style.top = mouseYOffset - ev.clientY;

  dash.style.left = `${ev.clientX - mouseXOffset}px`;
  dash.style.top = `${ev.clientY - mouseYOffset}px`;
  updateDashPos()
  dash.style.opacity = 1;
}

function updateDashPos() {
  if (parseInt(document.querySelector("#dashboard").style.top.replace('px', '')) < 50) {
    dash.style.top = '50px'
  }
  if (parseInt(document.querySelector("#dashboard").style.left.replace('px', '')) < 6) {
    dash.style.left = '6px'
  }
  if (parseInt(document.querySelector("#dashboard").style.left.replace('px', '')) + dashWidth > winWidth - 12) {
    dash.style.left = `${winWidth - dashWidth - 12}px`
  }
  if (parseInt(document.querySelector("#dashboard").style.top.replace('px', '')) + dashHeight > winHeight - 12) {
    dash.style.top = `${winHeight - dashHeight - 12}px`
  }
}

export { startDragDashboard, stopDragDashboard }
