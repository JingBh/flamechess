import $ = require("jquery");
require("bootstrap/js/src/index");

import VERSION from "./version";

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr("content")
    }
});

const baseUrl: string = $('meta[name="data-backend"]').attr("content");

function url(uri: string) {
    if (uri.substring(0, 1) != "/") uri = "/" + uri;
    return baseUrl + uri;
}

$("#version").text("v" + VERSION);

$('[data-toggle-link="tab"]').on("click", function(event) {
    event.preventDefault();
    $($(this).attr("href")).tab("show");
});

$("[id^='inputEschool']").on("keyup", function(event) {
    if (event.key == "Enter") $("#eschoolSubmit").trigger("click");
});

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
}).trigger("change");

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
            }

        } else $("#eschoolError").text(data.message).show();

    }).fail(function(error) {

        alert("请求过程中发生错误。\n" + error);

    }).always(function() {

        $("#eschoolSubmit").html('提交')
            .removeAttr("disabled");
    });
});
