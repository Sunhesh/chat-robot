(() => {
    let isRepeat = false;
    const dom = {
        formContainer: document.querySelector('#formContainer'),
        userName: document.querySelector('#userName'),
        userNickname: document.querySelector('#userNickname'),
        userPassword: document.querySelector('#userPassword'),
        userConfirmPassword: document.querySelector('#userConfirmPassword'),
    };
    // console.log(dom.userName);
    // 主函数
    const init = () => {
        initEvent();
    };

    // 事件入口函数
    const initEvent = () => {
        dom.userName.addEventListener('blur', userNameBlur);
        dom.formContainer.addEventListener('submit', onSubmit);
    }

    // 创建账户名失去焦点的事件函数
    const userNameBlur = async() => {
        // 输入的value值
        const loginId = dom.userName.value.trim();
        // console.log(loginId);
        // value为空，不做操作
        if (!loginId) {
            return;
        }
        /* const response = await fetch(`https://study.duyiedu.com/api/user/exists?loginId=${loginId}`)
        const result = await response.json();
        // console.log(result);
        isRepeat = result.data;
        if (result.code !== 0) {
            window.alert(result.msg);
        } */
        const resp = await fethcFn({
            url: '/user/exists',
            method: 'GET',
            params: { loginId }
        })
        isRepeat = resp;
    }

    // 表单点击事件
    const onSubmit = (e) => {
        // 阻止默认的表单点击事件
        e.preventDefault();
        const loginId = dom.userName.value.trim();
        const nickname = dom.userNickname.value.trim();
        const loginPwd = dom.userPassword.value.trim();
        const secondPwd = dom.userConfirmPassword.value.trim();
        // 表单验证
        if (!verification(loginId, nickname, loginPwd, secondPwd)) {
            return;
        }
        // 请求数据
        sendData(loginId, nickname, loginPwd)
    }

    // 请求数据
    const sendData = async(loginId, nickname, loginPwd) => {
        /* const res = await fetch('https://study.duyiedu.com/api/user/reg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginId,
                nickname,
                loginPwd
            }),
        })
        const result = await res.json();
        // console.log(result);
        if (result.code !== 0) {
            window.alert(result.msg)
            return;
        }
        window.location.replace('/聊天机器人/index.html') */

        const res = await fethcFn({
            url: '/user/reg',
            method: 'POST',
            params: { loginId, nickname, loginPwd },
        })
        res && window.location.replace(baseUrl + 'index.html')
    }


    // 表单验证
    const verification = (loginId, nickname, loginPwd, secondPwd) => {
        switch (true) {
            case !loginId:
                window.alert('用户名不能为空')
                return;
            case !nickname:
                window.alert('昵称不能为空')
                return;
            case !loginPwd:
                window.alert('密码不能为空')
                return;
            case !secondPwd:
                window.alert('再次确认密码不能为空')
            case loginPwd !== secondPwd:
                window.alert('两次确认密码不一样')
            case isRepeat:
                window.alert('账户名已经注册过，请更换注册名称')
            default:
                return true
        }
    }



    init();
})()