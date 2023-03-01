var params = new URLSearchParams(window.location.search);
var summary = params.get("textSummarized");

document.getElementById("requestedProduct").innerHTML = summary;