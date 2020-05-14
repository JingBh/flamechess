import $ = require("jquery");
require("bootstrap/js/src/index");

const moment = require("moment")
moment.locale("zh-cn")

export function listenSendMessage(callback) {
  const inputEle = $(".chesstalk-input")
  const inputBody = inputEle.find(".toast-body")

  inputEle.removeClass("d-none")
  inputEle.find(".close").on("click", (event) => {
    inputEle.remove()
  })

  inputBody.on("input", () => {
    let text = inputBody.val().toString()
    if (text.substring(text.length - 1) == "\n") {
      inputBody.val("")
      text = text.trim()
      if (text) callback(text)
    }
  })
}

export function recievedMessage(data, sid?: string) {
  const isSelf = "用户 " + sid.substring(0, 5) === data.id

  const list = $(".chesstalk-list")

  let ele = $('<div class="toast" aria-live="assertive" aria-atomic="true"></div>')
  if (isSelf) ele.addClass("chesstalk-is-self")

  let headerEle = $('<div class="toast-header"></div>')
  ele.append(headerEle)

  let titleEle = $('<strong class="mr-auto"></strong>')
  titleEle.text(isSelf ? `${data.id} (我)` : data.id)
  headerEle.append(titleEle)

  let timeEle = $('<small class="text-muted data-chesstalk-time">刚刚</small>')
  timeEle.attr("data-timestamp", data.time)
  headerEle.append(timeEle)

  let closeEle = $('' +
    `<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
         <span aria-hidden="true">&times;</span>
     </button>`)
  headerEle.append(closeEle)

  let bodyEle = $('<div class="toast-body"></div>')
  bodyEle.text(data.message)
  ele.append(bodyEle)

  list.prepend(ele)
  if (list.children().length > 30) list.last().remove()

  ele.toast({
    autohide: false
  }).toast("show")
}

export function timing() {
  window.setInterval(() => {
    $(".data-chesstalk-time").each((i, ele) => {
      let timestamp = Number($(ele).attr("data-timestamp"))
      let time = moment(timestamp).fromNow()
      $(ele).text(time)
    })
  }, 500)
}

export function disableChat() {
  $(".chesstalk").remove()
}
