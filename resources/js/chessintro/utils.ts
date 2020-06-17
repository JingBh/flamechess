import jQuery from "jquery"

const $ = jQuery

import {VERSION} from "../version";

$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr("content")
  }
});

$("#version").text("v" + VERSION);

$("[data-toggle='tab']").on("show.bs.tab", function() {
  location.hash = $(this).attr("id");
});

$("[data-toggle='tooltip']").tooltip();

$('[data-toggle-link="tab"]').on("click", function(event) {
  event.preventDefault();
  $($(this).attr("href")).tab("show");
});

$(function() {
  if (location.hash) {
    let ele = $(location.hash);
    if (ele && location.hash != "#tabIntro") {
      ele.tab("show");
    } else location.hash = "";
  }
});

const baseUrl: string = $('meta[name="data-backend"]').attr("content");

export function url(uri: string) {
  if (uri.substring(0, 1) != "/") uri = "/" + uri;
  return baseUrl + uri;
}
