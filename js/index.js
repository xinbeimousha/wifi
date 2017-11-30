'use strict'
$('#phoneNumber').focus(function () {
    $('.check-phone').removeClass('notice')
})
$('#code').focus(function () {
    $('.check-code').removeClass('notice')
})
//关闭开屏页
function closeWelcome(){
    $('.welcome-page').hide();
    $('.closeWelcome').hide();
}
//跳转到确认页面
function routeToConfirm(){
    window.location.href ='/src/confirm/confirm.html'
}
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
function login(status, id, time, defaultTime) {
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
                        window.location.href = '/src/confirm/confirm.html'
                    } else if (status == 1) {
                        $.ajax({
                            url: 'http://10.10.60.26:8181/api/pageTemplete/get.do?id='+id,
                            success: function (data) {
                                var waitHtml = JSON.parse(data.html)
                                //判断是单图片数据还是自定义html
                                if(waitHtml.singleImg.success==true){
                                    $('.wait-banner').css('background-image','url('+waitHtml.singleImg.path+')')
                                }else{
                                    $('.wait-banner').html(waitHtml.reditHtml.html)
                                }
                                $('.wait-time .time').html(defaultTime);
                                $('.wait-banner').show();
                                $('.waitForInter').show();
                                var timer = setInterval(function () {
                                    defaultTime--;
                                    $('.wait-time .time').html(defaultTime);
                                    if (defaultTime == 0) {
                                        clearInterval(timer);
                                        window.location.href = '/src/confirm/confirm.html'
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
    // var path = 'http://10.10.60.26:8181/file/downloadImage.do?filePath='
    //初始化请求
    $.ajax({
        url: 'http://10.10.60.26:8181/wifiRule/rules.do',
        data:{
            pageType:11
        },
        success: function (data) {
                var result = data
                console.log(result)
                if(result.welcomeStatus==1){
                    //判断是否开启开屏页，如果开启则请求开屏页数据
                    $.ajax({
                        url:'http://10.10.60.26:8181/pageTemplete/get.do?id='+result.welcomePageId,
                        success:function(data){
                            var welcomeHtml = JSON.parse(data.html)
                            console.log(welcomeHtml)
                            //判断开屏页是单图片还是自定义HTML
                            //如果是单图片
                            if(welcomeHtml.singleImg.success==true){
                                $('.welcome-page').css('background-image','url('+welcomeHtml.singleImg.path+')')
                            }else{
                                //如果是自定义html
                                $('.welcome-page').html(welcomeHtml.reditHtml.html)
                            }
                            $('.welcome-page').show();
                            $('.closeWelcome').show();
                        }
                    })
                }
                var loginId = result.loginPageId;
                var waitId = result.waitPageId;
                var waitStatus = result.waitStatus;
                var defaultTime = result.waitPageWaitTime;
                var waitTime = result.waitPageWaitTime * 1000;
                //请求登录页面模板
                $.ajax({
                    url: 'http://10.10.60.26:8181/pageTemplete/get.do?id='+loginId,
                    success: function (data) {
                        var loginHtml = JSON.parse(data.html)
                        console.log(loginHtml)
                        //判断开屏页是单图片还是自定义HTML
                            //如果是单图片
                            if(loginHtml.singleImg.success==true){
                                $('.bg-banner').css('background-image','url('+loginHtml.singleImg.path+')')
                            }else{
                                //如果是自定义
                                $('.bg-banner').html(loginHtml.reditHtml.html)
                            }
                        $('#login').click(function () {
                            login(waitStatus,waitId,waitTime,defaultTime)
                        })
                    }
                })
            }
    })
})