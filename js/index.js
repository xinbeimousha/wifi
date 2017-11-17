'use strict'
$('#phoneNumber').focus(function () {
    $('.check-phone').removeClass('notice')
})
$('#code').focus(function () {
    $('.check-code').removeClass('notice')
})
//获取验证码
function getCode() {
    var phone = $('#phoneNumber').val()
    var reg = /^1[0-9]{10}$/;
    if (!reg.test(phone)) {
        $('.check-phone').addClass('notice');
    } else {
        getCodeThing();
        var getCode = document.getElementById('getCode');
        var num = 60;
        var timer = setInterval(function () {
            num--;
            getCode.innerHTML = num + '秒后重新获取';
            getCode.style.color = '#cccc';
            getCode.disabled = 'disabled';
            if (num == 0) {
                getCode.disabled = '';
                getCode.style.color = '#fff';
                getCode.innerHTML = '获取验证码';
                clearInterval(timer)
            }
        }, 1000)
    }

}

function getCodeThing() {
    var phone = $('#phoneNumber').val()
    $.ajax({
        url: 'http://10.10.60.26:8181/api/sms/send.do?phoneNum=' + phone,
        type: 'GET',
        success: function (data) {
            console.log(data)
        },
        error: function (err) {
            console.log(err)
        }
    })
}
//登录
function login(path, status, id, time, defaultTime) {
    var code = $('#code').val();
    var phoneNum = $('#phoneNumber').val();
    var reg = /^\d{4}$/;
    if (!reg.test(code)) {
        $('.check-code').addClass('notice')
    } else {
        

        $.ajax({
            url: 'http://10.10.60.26:8181/api/sms/check.do?code=' + code + '&phoneNum=' + phoneNum,
            type: 'GET',
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            success: function (data) {
                if(data.success==true){
                    if (status == 0) {
                        window.location.href = '/src/home/home.html'
                    } else if (status == 1) {
                        $.ajax({
                            url: 'http://10.10.60.26:8181/api/pageTemplete/' + id + '.do',
                            success: function (data) {
                                var welcomePath = path + data.image;
                                $('.wait-banner').show()
                                $('.wait-banner').css('background-image','url('+welcomePath+')')
                                $('.wait-time .time').html(defaultTime);
                                var timer = setInterval(function () {
                                    defaultTime--;
                                    $('.wait-time .time').html(defaultTime);
                                    if (defaultTime == 0) {
                                        clearInterval(timer);
                                        window.location.href = '/src/home/home.html'
                                    }
                                }, 1000)
                            }
                        })
            
                    }
                }else{
                    $('.check-code').addClass('notice');
                    $('.check-code').html(data.msg)
                }
            },
            error: function (err) {
                console.log(err)
            }

        })
    }

}

function controlLogin() {
    var agree = $('#agree')[0];
    if (agree.checked == false) {
        $('#login').attr('disabled', 'disabled')
    } else {
        $('#login').removeAttr('disabled')
    }
}

$(function () {
    var agree = $('#agree')[0];
    if(agree.checked==false){
        $('#login').attr('disabled', 'disabled')
    }
    var path = 'http://10.10.60.26:8181/file/downloadImage.do?filePath='
    $.ajax({
        url: 'http://10.10.60.26:8181/wifiRule/rules.do',
        data:{
            pageType:11
        },
        success: function (data) {
            console.log(data)
            if (data.pagetTemplete.length > 0) {
                var result = data.pagetTemplete[0];
                var loginId = result.loginPageId;
                var welcomeId = result.welcomePageId;
                var welcomeStatus = result.welcomeStatus;
                var defaultTime = result.welcomePageWaitTime;
                var waitTime = result.welcomePageWaitTime * 1000;
                $.ajax({
                    url: 'http://10.10.60.26:8181/api/pageTemplete/' + loginId + '.do',
                    success: function (data) {
                        var loginImg = data.image;
                        var loginImgPath = path + data.image;
                        $('.bg-banner').css('background-image','url('+loginImgPath+')')
                        $('#login').click(function () {
                            login(path, welcomeStatus, welcomeId, waitTime, defaultTime)
                        })
                    }
                })
            }

        }
    })
})