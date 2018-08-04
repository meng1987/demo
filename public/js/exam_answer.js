$(function () {
    //计时
    $(function () {
        // 交卷时间
        var d = new Date();
        var endTime = parseInt(d.getTime()/1000) + answer_time_left;

        //  考试时间倒计时
        timeDownInterval = setInterval(timeDown, 1000);

        //倒计时
        function timeDown(){
            var t = new Date();
            var nowTime = parseInt(t.getTime()/1000);
            var leftTime = endTime - nowTime;

            consume_time = answer_time_left - leftTime;

            if(leftTime<=0){
                $("#timeDown").removeClass("warning");
                $("#timeDown").text("Time's up");
                alert("Time's up！");
                saveExamFn();
            }
            // if(answer_time_left==10){
            //     $("#timeDown").addClass("warning");
            // }

            $("#timeDown").text(formatTime(leftTime));

            // 消耗时间存入cookie,过期时间设置为考试结束时间
            document.cookie = "consume_time_"+exam_results_id+"="+consume_time+"; max-age="+answer_time+";path=/;";
        }

    });

    //心跳链接
    $(function () {
        // 每30秒请求一次考试时间
        setInterval(heartAjax, 30000);

        // 心跳链接，请求考试时间
        function heartAjax() {
            //不显示loading
            $("#spinnerLoading").addClass("hide");

            $.ajax( {
                type:"post",
                url:"/exam/getExamEndTime",
                dataType:"json",
                data: "userId="+examUserId+"&examInfoId="+exam_info_id+"&examResultId="+exam_results_id,
                success:function(msg){
                    //不显示loading
                    $("#spinnerLoading").removeClass("hide");

                    if(msg.success){
                        //code:0 未设置，不操作
                        //code:1 重新设置时间
                        //code:2 立即交卷
                        if(msg.bizContent.code=='1'){

                            if(answer_time!=msg.bizContent.totalTime){
                                $("#timeResetModal .delay-time").text(msg.bizContent.delayTimeStamp);
                                $('#timeResetModal').modal();
                            }

                            answer_time = msg.bizContent.totalTime;
                            answer_time_left = answer_time - consume_time;
                        }else if(msg.bizContent.code=='2'){
                            saveExamFn();
                        }
                    }else{
                        console.log(msg.desc);
                    }
                },
                error: function (msg) {
                    //不显示loading
                    $("#spinnerLoading").removeClass("hide");
                }

            });
        }
    });

    // 格式化时间
    function formatTime(time) {
        var day = Math.floor(time/86400);
        var day_left=time-86400*day;
        var hour = Math.floor(day_left/3600);
        var hour_left=day_left-3600*hour;
        var minutes= Math.floor(hour_left/60);
        var seconds= hour_left-60*minutes;
        var time_show=(day==0?'':(day+'dd:'))+(hour<10?'0'+hour:hour)+':'+(minutes<10?'0'+minutes:minutes)+
            ':'+(seconds<10?'0'+seconds:seconds);

        return time_show;
    }


    //**************************************答案存储**************************************
    var answered_num = 1; //已答未保存考题数量
    var answered_multi_all = []; //所以试题延时提交数据
    var answered_all = [];

    //初始化答题进度
    commitProcess();

    //处理aliyun附件url问题，进行uri编码
    $(".question-content .answers .filled .file-row a").each(function (index, element) {
        var url = aliyunEncodeURI($(this).attr("href"));
        $(this).attr("href", url).attr("download", url).attr("target", "_blank");
    });

    //生成每个编辑器,blur存储
    $('.keyCloze').each(function () {
        var keyCloze = this;
        var editor = new wangEditor(keyCloze);
        var _parent = $(keyCloze).parents('.question-content');
        var questionsId = _parent.attr('data-id');
        editor.config.uploadImgUrl = '/admin/upload/?userRole=staff&action=uploadimage';
        editor.config.uploadImgFileName = 'upfile';
        editor.config.noPaste = true;
        editor.config.menus = [
            'table',
            '|',
            'img',
            'upload',
            '|',
            'fullscreen'
        ];
        editor.config.lang = {
            table: 'Table',
            img: 'Image',
            upload: 'Upload',
            fullscreen: 'Fullscreen',
            submit: 'Submit',
            cancel: 'Cancel'
        };
        editor.create();
        editor.$txt.blur(function () {
            var txt = $.trim(editor.$txt.html());
            if (txt != '<p><br></p>') {
                var keyList = editor.$txt.html();
                $(keyCloze).parents('.wangEditor-container').next().val(keyList);
                saveQuestionsCatch(questionsId, keyList, false, true);
            }
        })
    });

    //问答题上传附件
    $(".question-content .wang-upload-file").change(function () {
        var _this = $(this);

        if($(_this).value == ''){
            return false;
        }

        var question_id = $(_this).parents(".question-content").attr("data-id");
        var uploadUrl = '/exam/attachment_operate/?method=upload&platform=pc&uploadType=uploadFile';
        var formHtml = '<form id="fileupForm" class="hidden" action="'+uploadUrl+'" method="post" enctype="multipart/form-data" target="fileupIframe"></form>';
        var iframeHtml = '<iframe name="fileupIframe" id="fileupIframe" class="append"></iframe>';
        var inputHmtl = '<input type="text" class="append" name="questionId" value="'+question_id+'">'+
            '<input type="text" class="append" name="examInfoId" value="'+exam_info_id+'">'+
            '<input type="text" class="append" name="examResultsId" value="'+exam_results_id+'">';

        $(_this).wrap(formHtml);
        $('#fileupForm').append(iframeHtml+inputHmtl);
        $('#fileupForm').submit();


        //上传回调
        $("#fileupIframe").load(function () {
            var msg = $(this).contents().find('body').text();
            var _parent = $(this).parents(".question-content");
            var questionId = $(_parent).attr("data-id");

            if(msg!=''){
                $('#fileupForm')[0].reset();
                $('#fileupForm .append').remove();
                $('#fileupForm .wang-upload-file').unwrap();

                msg = JSON.parse(msg);
                if (msg.success) {
                    var file_row = '<div class="file-row">'+
                        '<a class="file ellipsis" href="'+aliyunEncodeURI(msg.bizContent.audioUrl)+'">'+msg.bizContent.filename+'</a>'+
                        '<i class="icon icon-m_exam_error2 icon-file-delete"></i>'+
                        '</div>';
                    $(_parent).find('.file-list').append(file_row);
                    commitProcess(questionId, true);
                } else{
                    alert ('Fail, please try again');
                }
            }
        });

    });

    //问答题上传附件删除
    $("body").on("click", ".file-list .icon-file-delete", function () {
        var _this = $(this);
        var _row = $(_this).parent(".file-row");
        var _parent = $(_this).parents(".question-content");
        var fileUrl = $(_row).find(".file").attr("href");
        var filename = $(_row).find(".file").text();
        var questionId = $(_parent).attr("data-id");
        var dataJson = {
            examResultsId: exam_results_id,
            questionId: questionId,
            audioUrl: fileUrl,
            filename: filename
        };

        $.ajax({
            url: '/exam/attachment_operate/?method=remove&removeType=uploadFile',
            type: 'post',
            data: dataJson,
            dataType: 'json',
            success: function (msg) {
                if (msg.success){
                    $(_row).remove();
                }else{
                    alert ('Fail, please try again');
                }
            },
            error: function () {
                alert ('Fail, please try again');
            }
        })
    });


    //单选，多选，判断
    //之所以将事件绑定至label而不是.select，是因为select内同时包含input和label，
    //而label又指向input，这会导致点击select，click被触发两次
    $(".question-content .select label").click(function(e) {
        var _this = $(this);
        var _parent = $(_this).parents(".question-content");
        var _select = $(_this).parents(".select");
        var questionsId = _parent.attr("data-id");
        var keyList = "";

        setTimeout(function () {
            if($(_select).hasClass("single-select")||$(_select).hasClass("judge")){
                $(_parent).find(".radioOrCheck").each(function(index, element) {
                    if($(this).is(":checked")){
                        keyList = $(this).attr("data-name")+",";
                    }
                });
            }else if($(_select).hasClass("multi-select")){
                $(_parent).find(".radioOrCheck").each(function(index, element) {
                    if($(this).is(":checked")){
                        keyList += $(this).attr("data-name")+",";
                    }
                });
            }

            saveQuestionsCatch(questionsId , keyList);
        }, 100);

    });

    //填空
    $(".keyFill").blur(function(e) {
        var _parent = $(this).parents(".question-content");
        var questionsId = _parent.attr("data-id");
        var keyFillDom = _parent.find(".keyFill");
        var keyList = [];

        $(_parent).find(".keyFill").each(function (index, element) {
            keyList[index] = $(this).val();
        });

        saveQuestionsCatch(questionsId , keyList.join("||"));
    });

    //todo 被删除的试题当作已答？？？

    //交卷
    $("#endExamBtn").click(function (e) {
        e.preventDefault();

        var length = $("#numberCardModal .modal-body .box.s1").length;
        var html = "";

        if(length==0){
            html = "Commit immediately?";
        }else {
            html = "Unfinished, whether or not commit immediately?";
        }

        $("#endExamModal .modal-title").html(html);
        $("#endExamModal").modal();
    });

    //确认交卷
    $("#confirmEndExamBtn").click(function (e) {
        e.preventDefault();

        saveExamFn();
    });

    //交卷提交后台异步保存fn
    function saveExamFn(){
        $("#spinnerLoading").removeClass("hidden").removeClass("hide");

        //清除考试时间
        clearInterval(timeDownInterval);

        // 若开启拍照防作弊功能，则在交卷之前再拍一次，确保至少有一张
        if(capture==1){
            var questionId=$("#numberCardModal .modal-body .iconBox:last").attr("questionsId");
            $("#captureForm input[name=questionId]").val(questionId);
            webcam.capture(0);
        }

        //判断是否有未保存的考题
        $.each(answered_multi_all,function(index,value){
            var unsaved_answer = value;
            var has_save = false;
            $.each(answered_all,function(index,value){
                if(value.test_id==unsaved_answer.test_id){
                    value.test_ans = unsaved_answer.test_ans;
                    has_save = true;
                    $("#spinnerLoading").addClass("hidden");
                    return false;
                }
            });
            if(!has_save){
                answered_all.push(unsaved_answer);
            }
        });

        if(answered_all.length>0){
            saveQuestionsCatch("","",true);
            $("#spinnerLoading").addClass("hidden");
            return false;
        }else{
            commit_exam();
        }
    }

    //缓存已答未提交考题数据
    function saveQuestionsCatch(questionsId,keyList,overExam,editor_blur){
        //问答题blur保存答案
        if(editor_blur==true){
            var questionsData = {
                "test_id":questionsId,
                "test_ans":keyList,
                "exam_results_id":exam_results_id,
                "exam_info_id":exam_info_id
            };
            answered_multi_all.push(questionsData);
            commitProcess(questionsId, true);
            saveAnswerFn_timeout();
            return;
        }
        //交卷操作时还有未保存的考题
        if(overExam==true){
            saveAnswerFn_timeout(overExam);
            return;
        }
        var hasSave = false; //是否保存过
        $.each(answered_multi_all,function(index,value){
            if(value.test_id==questionsId){
                value.test_ans = keyList;
                hasSave = true;
                return;
            }
        });
        var questionsData = {
            "test_id":questionsId,
            "test_ans":keyList,
            "exam_results_id":exam_results_id,
            "exam_info_id":exam_info_id
        };
        if(!hasSave){
            answered_multi_all.push(questionsData);
            commitProcess(questionsId, true);
        }
        if(answered_multi_all.length==answered_num){
            saveAnswerFn_timeout();
        }
    }

    //延时答题后提交后台异步保存fn
    function saveAnswerFn_timeout(overExam){
        var exam_test_list_json, exam_test_list;
        //答案数组
        if(overExam){
            exam_test_list_json = answered_all;
        }else{
            exam_test_list_json = answered_multi_all;
            answered_multi_all = [];
        }
        exam_test_list = JSON.stringify(exam_test_list_json);
        //将分割URI的&符号转义为十六进制序列
        exam_test_list = encodeURIComponent(exam_test_list);

        //时间戳
        var timeStamp = new Date();
        var dataForm = "examTestList="+exam_test_list+"&timeStamp="+timeStamp.getTime();

        $("#spinnerLoading").addClass("hide");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/exam/exam_start_ing_multi",
            data: dataForm,
            processData: false,
            success: function(msg){
                $("#spinnerLoading").removeClass("hide");
                if(msg.success=='true'){
                    if(overExam==true){
                        answered_all = [];
                        commit_exam();
                    }
                }else if(msg.success=="answered"){
                    alert("You've commiteed, please close the page.");
                }else{
                    alert("Fail, please try again.");
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                $("#spinnerLoading").removeClass("hide");
                $.each(exam_test_list_json,function(index,value){
                    var fail_answer = value;
                    var has_save = false;

                    $.each(answered_all,function(index,value){
                        if(value.test_id==fail_answer.test_id){
                            value.test_ans = fail_answer.test_ans;
                            has_save = true;
                            return false;
                        }
                    });

                    if(!has_save){
                        answered_all.push(fail_answer);
                    }
                });
                asynSubTimeoutFn(exam_test_list_json);
            }
        });
    }

    //查询成绩时间间隔
    var queryInterval;

    //交卷
    function commit_exam(){
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "/exam/exam_ending",
            data: "examInfoId="+exam_info_id+"&examResultsId="+exam_results_id,
            success: function (msg) {
                if(msg.success){
                    $("#endExamModal").modal('hide');
                    $("#resultInquireModal").modal({
                        backdrop: "static",
                        keyboard: false
                    });
                    //立即执行一次
                    resultInquire();
                    queryInterval = setInterval(resultInquire, 2000);
                }else {
                    alert("Fail, please try again.");
                    $("#resultInquireModal").modal('hide');
                }
            },
            error: function () {
                alert("Fail, please try again.");
                $("#resultInquireModal").modal('hide');
            }
        });
    }

    //生成考试成绩
    function resultInquire() {
        //不显示loading
        $("#spinnerLoading").addClass("hide");
        $.ajax({
            type: "POST",
            dataType: "json",
            url: "/exam/result/inquire",
            data: "examResultsId="+exam_results_id,
            ansyc: false,
            success: function (msg) {
                if(msg.success){
                    clearInterval(queryInterval);
                    window.location.href = "/exam/result/inquire?examResultsId="+exam_results_id;
                }
            }
        });
    }


    //异步提交答案超时FN
    function asynSubTimeoutFn(data){

        $.each(data,function(index,value){
            var questionsId = value.test_id;
            commitProcess(questionsId, false);

        });
        alert("Part of your answer wasn't saved for instability network, please try again.");
    }


    //**************************************答案存储**************************************


    //字号
    $(function () {
        //题干字号默认16
        //内容默认14（单选，多选，判断）
        var questionSize = 16;
        var answerSize = 14;

        //增加字号
        $(".fontsize-plus").click(function (e) {
            e.preventDefault();

            if(questionSize<20){
                questionSize = questionSize +1;
                answerSize = answerSize + 1;
                $(".exam-question").css({
                    "font-size": questionSize+"px"
                });
                $(".answers .select").css({
                    "font-size": answerSize+"px"
                });
            }
        });

        //减小字号
        $(".fontsize-minus").click(function (e) {
            e.preventDefault();

            if(questionSize>14){
                questionSize = questionSize - 1;
                answerSize = answerSize - 1;
                $(".exam-question").css({
                    "font-size": questionSize+"px"
                });
                $(".answers .select").css({
                    "font-size": answerSize+"px"
                });
            }

        });

    });


    //切换中英文
    $("#switchLangBtn").click(function (e) {
       switchLang('ch-ZN');
    });


    //显示答题卡
    $("#numberCardBtn").click(function (e) {
        e.stopPropagation();
        e.preventDefault();

        $("#numberCardModal").modal();
    });
    
    //点击答题卡跳转至对应题,使用了锚点跳转
    //位置调整90（因为有顶栏），并关闭答题卡
    $("#numberCardModal .modal-body .box").click(function (e) {
        
        $("#numberCardModal").modal('hide');
        setTimeout(function () {
            var scrollTop = $("html").scrollTop();

            $("html").animate({scrollTop:scrollTop-90},200);
        },100);

    });


    //固定组合题
    $("body").on("click", ".operation-icon.icon-pushpin", function () {
        $(".stuckMenu.isStuck").removeClass("isStuck").removeClass("stuckMenu").attr("style","");
        $(this).removeClass("icon-pushpin").addClass("icon-pushpined")
            .attr("title","Unfix").attr("data-original-title","Unfix");
        $(this).find(".icon").removeClass("icon-p_exam_fix_de").addClass("icon-p_exam_fix_se");
        $(this).parents(".question-comb").stickUp();
    });

    //取消固定
    $("body").on("click", ".operation-icon.icon-pushpined", function () {
        $(".stuckMenu.isStuck").removeClass("isStuck").removeClass("stuckMenu").attr("style","");
        $(this).removeClass("icon-pushpined").addClass("icon-pushpin")
            .attr("title","Fix").attr("data-original-title","Fix");
        $(this).find(".icon").removeClass("icon-p_exam_fix_se").addClass("icon-p_exam_fix_de")
    });

    //标记试题
    $("body").on("click", ".operation-icon.icon-mark", function () {
        var questionId = $(this).parents(".question-content").attr("data-id");

        $(this).removeClass("icon-mark").addClass("icon-marked")
            .attr("title","Delete").attr("data-original-title","Delete");
        $(this).find(".icon").removeClass("icon-p_exam_tag_de").addClass("icon-p_exam_tag_se");
        $("#numberCardModal a.questions_"+questionId).parent(".box").addClass("marked");

    });

    //取消标记
    $("body").on("click", ".operation-icon.icon-marked", function () {
        var questionId = $(this).parents(".question-content").attr("data-id");

        $(this).removeClass("icon-marked").addClass("icon-mark")
            .attr("title","Mark").attr("data-original-title","Mark");
        $(this).find(".icon").removeClass("icon-p_exam_tag_se").addClass("icon-p_exam_tag_de");
        $("#numberCardModal a.questions_"+questionId).parent(".box").removeClass("marked");
    });


    //删除录音
    $("body").on('click',".audio-list .icon-audio-delete",function(e) {
        e.preventDefault();

        var _this = $(this);
        var _question = $(_this).parents(".question-content");
        var question_id = $(_question).attr("data-id");
        var _audio = $(_this).parents(".audio-row");
        var audio_url = $(_audio).find("audio").attr("src");

        $.ajax({
            type: "POST",
            url: "/exam/attachment_operate/?method=remove",
            dataType:"json",
            data:"examResultsId="+exam_results_id+"&questionId="+question_id+"&audioUrl="+audio_url,
            success:function(msg) {
                if(msg.success){
                    $(_audio).remove();
                }
            }
        });
    });




    //**************************************防作弊**************************************
    //禁止复制粘贴
    document.oncontextmenu=new Function("event.returnValue=false");
    document.oncopy=new Function("event.returnValue=false");
    document.onpaste=new Function("event.returnValue=false");


    //拍照防作弊
    $(function () {
        var webcam_json = {};
        var capture_id;

        // 开启摄像头，拍照防作弊
        if(capture==1){
            $("#webcam").webcam({
                width: 320,
                height: 240,
                mode: "callback",
                swffile: "/static/plugins/webcam/jscam_canvas_only.swf",
                onLoad: function() {
                    //获取题目总数
                    var question_total=$("#numberCardModal .modal-body .box").length;
                    webcam_json = getRandom(1, question_total);//创建json存拍照题号和相应拍照状态
                    console.log(webcam_json);
                },
                onTick: function(remain) {},
                onSave: saveImg(),
                onCapture: function() {
                    webcam.save();
                },
                debug: function(type,string) {
                    // console.log(type + ": " + string);
                    if(type=='notify'&&string=='Camera started'){
                        $("#webcamAlert").addClass("hidden");
                        setTimeout(function () {
                            $("#webCamBar, #webcam").addClass("folded");
                        }, 10000)
                    }
                }
            });

            //点击试题拍照
            $("body").on("click", ".question-content", function () {
                //组合题题干排除
                if(!$(this).hasClass("question-comb")){
                    var questionId = $(this).attr("data-id");

                    if(typeof(webcam_json[questionId])!='undefined' && webcam_json[questionId]==0) {
                        webcam_json[questionId] = 1;
                        $("#captureForm input[name=questionId]").val(questionId);
                        webcam.capture(0);
                    }
                }
            });
        }

        //显示摄像头
        $("#webCamBar").click(function(e) {
            $("#webCamBar, #webcam").removeClass("folded");
        });
        //隐藏摄像头
        $("#webCamFold").click(function(e) {
            $("#webCamBar, #webcam").addClass("folded");
        });

        //获取随机试题
        function getRandom(min, max) {
            //获取试题数目，按照1/10的比例，至少一题
            var random_num = Math.ceil((max-min+1)/10);
            var random_arr = [];
            var random_json = {};
            var question_id;

            for (var i = 0; i < random_num; i++) {
                var random_int = Math.floor(Math.random() * (max - min + 1)) + min;
                if(!random_json[random_int]){
                    question_id = $("#numberCardModal .modal-body .iconBox").eq(random_int).attr("questionsId");
                    random_json[question_id]= 0;
                    random_arr.push(random_int);
                }
            }
            return random_json;
        }

        function saveImg(data) {
            var pos = 0, ctx = null, saveCB, image = [];
            var canvas = document.createElement("canvas");
            canvas.setAttribute('width', 320);
            canvas.setAttribute('height', 240);
            if (canvas.toDataURL) {
                ctx = canvas.getContext("2d");
                image = ctx.getImageData(0, 0, 320, 240);
                saveCB = function(data) {
                    var col = data.split(";");
                    var img = image;
                    for(var i = 0; i < 320; i++) {
                        var tmp = parseInt(col[i]);
                        img.data[pos + 0] = (tmp >> 16) & 0xff;
                        img.data[pos + 1] = (tmp >> 8) & 0xff;
                        img.data[pos + 2] = tmp & 0xff;
                        img.data[pos + 3] = 0xff;
                        pos+= 4;
                    }
                    if (pos >= 4 * 320 * 240) {
                        ctx.putImageData(img, 0, 0);
                        $("#captureForm").append("<textarea name='file'>"+canvas.toDataURL("image/png")+"</textarea>");
                        $("#captureForm").submit();
                        $("#captureForm textarea").remove();
                        pos = 0;
                    }
                };
            }
            return saveCB;
        }

    });


    //切屏防作弊
    //若干次切换后自动交卷
    $(function(){

        // 对count设置cookie，对应到exam_results_id,刷新页面保持计数
        var count=getCookie("blur_count"+exam_results_id);

        if(set_full_screen==0) {

            //若开启全屏防作弊，则点击页面触发全屏
            //screenfull.js?v=201801101413:93
            // Failed to execute 'requestFullscreen' on 'Element':
            // API can only be initiated by a user gesture.
            //必须手动触发
            $("body").on("click", function () {
                //当且仅当页面处于非全屏状态时再次触发全屏请求，否则，每次点击页面都会回到页面顶部
                if(!screenfull.isFullscreen&&screenfull.enabled){
                    screenfull.request();
                }
            });

            //窗口失去焦点
            $(window).blur(function () {
                if (screenfull.isFullscreen) {
                    setTimeout(function () {
                        blurCount();
                    }, 50);
                }
            });

            //退出全屏记一次切屏
            if (screenfull.enabled) {
                document.addEventListener(screenfull.raw.fullscreenchange, function () {
                    if (!screenfull.isFullscreen) {
                        setTimeout(function () {
                            blurCount();
                        }, 50);
                    }
                });
            }
        }


        //切换
        function blurCount(){
            count++;
            setCookie("blur_count"+exam_results_id, count, answer_time);

            if(count>parseInt(blur_count)){
                saveExamFn();
            }else{
                $("#blurCount").text(count);
                $("#blurCountModal").modal();
            }
        }

    });


    //无操作防作弊
    $(function () {
        //若干秒无操作提示，自动交卷
        if(setQuietCheat==1){
            //预留10秒提示时间
            var maxTime = parseInt(quietSecond)+10;
            //剩余时间
            var restTime = maxTime;

            var timeLimitInterval=setInterval(function(){

                if(restTime== 0) {
                    $("#timeLimitAlert").text("Committing...");
                    clearInterval(timeLimitInterval);
                    saveExamFn();
                }else if (restTime<=10) {
                    $("#limitTimeCount").text(restTime);
                    $("#timeLimitAlert").removeClass("hidden");
                }
                restTime--;
            },1000);

            $("body").on('keydown click mousemove scroll', function(e){
                $("#timeLimitAlert").addClass("hidden");
                // reset
                restTime = maxTime;
            });
        }
    })

    //**************************************防作弊**************************************

});