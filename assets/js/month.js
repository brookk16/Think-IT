window.onload = function() {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];;
    var date = new Date();

    document.getElementById('month').innerHTML = months[date.getMonth()] + ' ' + date.getFullYear();
};
