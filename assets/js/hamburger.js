//Function taken and modified from https://www.w3schools.com/howto/howto_js_topnav_responsive.asp

function hamburgerIcon() {
  var x = document.getElementById("myBottomNav");
  if (x.className === "bottomnav") {
    x.className += " responsive";
  } else {
    x.className = "bottomnav";
  }
}