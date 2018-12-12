// Code taken and repurposed from www.w3schools.com website (https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_topnav)



function hamburgerIcon() {
  var x = document.getElementById("myBottomNav");
  if (x.className === "bottomnav") {
    x.className += " responsive";
  } else {
    x.className = "bottomnav";
  }
}