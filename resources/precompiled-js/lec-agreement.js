"use strict";

function _(el) {
  return document.getElementById(el);
}

function uploadFile() {
  // reseting messages
  _("progressBar").value = 0;

  _("progressBar").classList.remove("hidden");

  _("status").innerHTML = ""; // starting the upload

  var file = _("file1").files[0]; // alert(file.name+" | "+file.size+" | "+file.type);


  var formdata = new FormData();
  formdata.append("file", file);
  var ajax = new XMLHttpRequest();
  ajax.upload.addEventListener("progress", progressHandler, false);
  ajax.addEventListener("load", completeHandler, false);
  ajax.addEventListener("error", errorHandler, false);
  ajax.addEventListener("abort", abortHandler, false);
  ajax.open("POST", "/student/lec-agreement/upload");
  ajax.send(formdata);
}

function progressHandler(event) {
  var percent = event.loaded / event.total * 100;
  _("progressBar").value = Math.round(percent);
  _("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
}

function completeHandler(event) {
  _("status").innerHTML = event.target.responseText;
  _("progressBar").value = 100;

  _("progressBar").classList.add("hidden");
}

function errorHandler(event) {
  _("status").innerHTML = "Upload Failed. Try again, or email us for support at: mail@iec.org.pk";

  _("progressBar").classList.add("hidden");
}

function abortHandler(event) {
  _("status").innerHTML = "Upload Aborted.  Try again, or email us for support at: mail@iec.org.pk";

  _("progressBar").classList.add("hidden");
}