$(document).ready(function() {
    if (localStorage.getItem("importAccept") == null) {
        localStorage.setItem("importAccept", "video/*");
    }
    if (localStorage.getItem("funcTitle") == null) {
        localStorage.setItem("funcTitle", "影片偵測");
    }
    if (localStorage.getItem("activeType") == null) {
        localStorage.setItem("activeType", "videoDect");
    }
    $('.nav-treeview > li > a').removeClass('active');
    $('#' + localStorage.getItem("activeType")).addClass('active');
    $('#funcTitle').text(localStorage.getItem("funcTitle"));
    $('#importFile').attr("accept", localStorage.getItem("importAccept"));

    var nIntervId;
    localStorage.setItem("i", 0);
});

$('.nav-treeview > li > a').on("click", function(e) {
    e.preventDefault();
    console.log(e);
    // $('.nav-treeview > li > a').removeClass('active');
    localStorage.setItem("activeType", e.target.accessKey);
    // $(this).addClass('active');
    localStorage.setItem("funcTitle", e.target.innerText);
    // $('#funcTitle').text(localStorage.getItem("funcTitle"));
    let targetText = localStorage.getItem("funcTitle");
    localStorage.setItem("importAccept", targetText.indexOf("影片") > -1 ? "video/*" :
        targetText.indexOf("影像") > -1 ? "image/*" :
        targetText.indexOf("聲音") > -1 ? "audio/*" : "");
    // $('#importFile').attr("accept", localStorage.getItem("importAccept"));
    location.reload()
});

$('input[type=file]').change(function() {
    if (!this.files || !this.files[0]) {
        return;
    }
    var filetype = this.files[0].type;
    $('.targetClass').removeClass("targetActive");
    $('#targetImg').attr('src', "");
    $('#tgVideo')[0].src = "";
    $("#targetAudio").attr("src", "");
    if (filetype.indexOf('image') > -1) {
        var files = event.target.files;
        var image = files[0]
        var reader = new FileReader();
        reader.onload = function(file) {
            $('#targetImg').attr('src', file.target.result);
            $('#targetImg').addClass("targetActive");
        }
        reader.readAsDataURL(image);
        getDetectResp(image);
        getResult(image, "targetImg");
    }
    if (filetype.indexOf('video') > -1) {
        var $source = $('#tgVideo');
        $('#targetVideo').addClass("targetActive");
        $source[0].src = URL.createObjectURL(this.files[0]);
        $source.parent()[0].load();
        nIntervId = setInterval(function() {
            getDuration("tgVideo", localStorage.getItem("i"), "video");
        }, 1000);
        getDetectResp(URL.createObjectURL(this.files[0]));
        getResult(URL.createObjectURL(this.files[0]));
    }
    if (filetype.indexOf('audio') > -1) {
        var objUrl = getObjectURL(this.files[0]);
        $("#targetAudio").attr("src", objUrl);
        $("#targetAudio")[0].play();
        $("#targetAudio").addClass("targetActive");
        nIntervId = setInterval(function() {
            getDuration("targetAudio", localStorage.getItem("i"), "audio");
        }, 1000);
        getResult(objUrl);
    }
});

const getObjectURL = (file) => {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

const getDuration = (id, i, type) => {
    var audio = $("#" + id)[0];
    let duration, currentTime, progressPercent, totalTime;
    if (i == 0) {
        $("#" + id).on("loadedmetadata", function() {
            duration = type == "audio" ? audio.duration : audio.parentNode.duration;
            currentTime = type == "audio" ? audio.currentTime : audio.parentNode.currentTime;
            progressPercent = (currentTime / duration) * 100;
        });
    } else {
        duration = type == "audio" ? audio.duration : audio.parentNode.duration;
        currentTime = type == "audio" ? audio.currentTime : audio.parentNode.currentTime;
        progressPercent = (currentTime / duration) * 100;
        if (progressPercent == 100) { stopPlay(); }
    }

    $('#chartBar').css('width', progressPercent + '%');
    $('#dectBar').css('width', progressPercent + '%');

    $('#chartPercentage').css('width', progressPercent + '%');
    $('#chartPercentage').text(Math.round(progressPercent) + "%");
    $('#dectPercentage').css('width', progressPercent + '%');
    $('#dectPercentage').text(Math.round(progressPercent) + "%");
    localStorage.setItem("i", parseInt(localStorage.getItem("i")) + 1);
}

const stopPlay = () => {
    clearInterval(nIntervId);
    localStorage.setItem("i", 0);
}

const getDetectResp = (file) => {
    $('#detectResp').attr('src', "dist/img/favicon.jpg");
}

const getResult = (file, id) => {
    $('#resuTag').css('display', "contents");
    $('#resuList').css('display', "block");
    if (id !== "targetImg") {
        $('#detectRespTime').css('display', "flex");
        $('#detectRespChart').css('display', "flex");
        drawChart();
    }
}

const drawChart = () => {
    var $visitorsChart = $('#visitors-chart')
    var ticksStyle = {
        fontColor: '#495057',
        fontStyle: 'bold'
    }
    var mode = 'index'
    var intersect = true
        // eslint-disable-next-line no-unused-vars
    var visitorsChart = new Chart($visitorsChart, {
        data: {
            labels: ['0s', '2s', '4s', '6s', '8s', '10s', '12s', '14s', '16s', '18s', '20s', '22s', '24s', '26s', '28s', '30s'],
            datasets: [{
                    type: 'line',
                    data: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    backgroundColor: 'transparent',
                    borderColor: '#007bff',
                    pointBorderColor: '#007bff',
                    pointBackgroundColor: '#007bff',
                    fill: false
                        // pointHoverBackgroundColor: '#007bff',
                        // pointHoverBorderColor    : '#007bff'
                },
                {
                    type: 'line',
                    data: [79.248, 77.589, 12.641, 59.169, 32.479, 81.027, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                    backgroundColor: 'tansparent',
                    borderColor: '#ced4da',
                    pointBorderColor: '#ced4da',
                    pointBackgroundColor: '#ced4da',
                    fill: false
                        // pointHoverBackgroundColor: '#ced4da',
                        // pointHoverBorderColor    : '#ced4da'
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                mode: mode,
                intersect: intersect
            },
            hover: {
                mode: mode,
                intersect: intersect
            },
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    // display: false,
                    gridLines: {
                        display: true,
                        lineWidth: '4px',
                        color: 'rgba(0, 0, 0, .2)',
                        zeroLineColor: 'transparent'
                    },
                    ticks: $.extend({
                        beginAtZero: true,
                        suggestedMax: 80
                    }, ticksStyle)
                }],
                xAxes: [{
                    display: true,
                    gridLines: {
                        display: false
                    },
                    ticks: ticksStyle
                }]
            }
        }
    })
}