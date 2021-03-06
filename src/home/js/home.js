var app = new Vue({
    el: '#app',
    data: {
        asyncHtml: []
    },
    methods: {
        LinkTo: function (a) {
            window.location.href = a
        }
    },
    created: function () {
        var _this = this;
        $.ajax({
            url:'http://10.10.60.26:8181/wifiRule/rules.do?pageType=14',
            type:"GET",
            success:function(data){ 
                console.log(data)             
                var id = data.homePageId
                $.ajax({
                    url: 'http://10.10.60.26:8181/pageTemplete/get.do?id='+id,
                    type: "GET",
                    success: function (data) {
                        console.log(data)
                        _this.asyncHtml = JSON.parse(data.html).components
                    }
                })
            }
        })
    },
    updated:function(){
        var mySwiper = new Swiper('.swiper-container', {
            autoplay: 2000,//可选选项，自动滑动
                //分页器
            pagination : '.swiper-pagination',
            paginationClickable :true,
            autoplayDisableOnInteraction : false,
            observer: true 
            })
    }
})