import jQuery from "jquery"

const $ = jQuery

import {url} from "./utils"

declare global {
  interface Window {
    _paq?: Array<Array<any>>
  }
}

$.get(url("matomo/live")).done(function(data) {
  if (data.success === true && data.data[0].visits) {
    $("#visitsLive").text(data.data[0].visits).addClass("text-success");
    $("#visits").show();
  }
});

$.get(url("matomo/visits")).done(function(data) {
  if (data.success === true && data.data.nb_visits) {
    $("#visitsCount").text(data.data.nb_visits).addClass("text-primary");
    $("#visits").show();
  }
});
