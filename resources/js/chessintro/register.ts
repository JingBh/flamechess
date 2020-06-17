import jQuery from "jquery"

const $ = jQuery

import {url} from "./utils"

$("[id^='inputEschool']").on("keyup", function(event) {
  if (event.key == "Enter") $("#eschoolSubmit").trigger("click");
})

$("#selectEschoolGroup").on("change", function() {
  let inputs = $("[id^='inputEschool']");
  let groups = inputs.parents(".data-input-group");
  let submit = $("#eschoolSubmit");

  inputs.val("");
  groups.hide();
  submit.show();

  switch (String($(this).val())) {
    case "1":
      $("#inputEschoolName").parents(".data-input-group").show();
      break;

    case "4":
      groups.show();
      break;

    default:
      submit.hide();
  }
}).trigger("change")

$("#eschoolSubmit").on("click", function() {
  $(this).attr("disabled", "disabled")
    .html('<span class="spinner-border spinner-border-sm"></span> 请稍候...');

  $("#eschoolError, #eschoolSuccess").hide();

  $.post(url("user/register/qhfz"), {
    "type": $("#selectEschoolGroup").val(),
    "code": $("#inputEschoolCode").val(),
    "name": $("#inputEschoolName").val()
  }).done(function (data) {

    if (data.success === true) {
      if (window._paq) window._paq.push(['trackEvent', '清华附中', 'Register', data.data.name]);

      if (data.message === "!choose") {
        (function(data) {
          const list = $("#eschoolChooseList");
          list.empty();

          for (let i in data) {
            let user = data[i];

            let ele = $('<button type="button"></button>');
            ele.addClass("list-group-item list-group-item-action");
            ele.html('<p class="lead mb-1">' +
              user.name + '&nbsp;' +
              '<small class="text-weight-strong text-success">' +
              'ID: ' + user.id + '</small></p>');
            ele.attr("data-group", user.type);
            ele.attr("data-code", user.id);
            ele.attr("data-name", user.name);
            ele.on("click", function() {
              $("#selectEschoolGroup").val($(this).attr("data-group"));
              $("#inputEschoolCode").val($(this).attr("data-code"));
              $("#inputEschoolName").val($(this).attr("data-name"));
              $("#eschoolSubmit").trigger("click");
              $("#eschoolChooseModal").modal("hide");
            });

            list.append(ele);
          }

          $("#eschoolChooseModal").modal("show");
        })(data.data);
      } else {
        $("#eschoolSuccess").text("注册成功！您的棋盘码：" + data.data.id).show();
        localStorage.setItem("chessterm_id", data.data.id);
        $("#registerTabGuestTry").tab("show");
      }

    } else $("#eschoolError").text(data.message).show();

  }).fail(function(error) {

    alert("请求过程中发生错误。\n" + error);

  }).always(function() {
    $("[id^='inputEschool']").val("");
    $("#eschoolSubmit").html('提交')
      .removeAttr("disabled");
  });
})

$("[data-guest-try]").on("click", (event) => {
  const gameId = $(event.currentTarget).attr("data-guest-try")
  const userId = localStorage.getItem("chessterm_id")
  if (userId && gameId)
    location.href = `/gui?id=${userId}&game=${gameId}&side=x&bot=true`
})
