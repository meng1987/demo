<div class="cont">
    <form action="up_password" method="post" >
        <p>
            <span class="t">账号：</span>
            <span class="c" style="font-family: MicrosoftYaHei;font-size: 16px;color: #999999;">{{session('student_name')}}</span>
        </p>
        <p>
            <span class="t">原密码：</span>
            <span class="c userUpdateDom"><input name="password" class="input_default"  type="text"></span>
        </p>
        <p>
            <span class="t">新密码：</span>
            <span class="c userUpdateDom"><input name="new_password" class="input_default"  type="text"></span>
        </p>
        <p>
            <input type="submit" value="确认修改"/>
            <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
        </p>
    </form>
</div>