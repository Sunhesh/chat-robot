(() => {
    // 一个函数代表一个事件
    // 获取dom
    const dom = {
        formContainer: document.querySelector('#formContainer'),
        userName: document.querySelector('#userName'),
        userPassword: document.querySelector('#userPassword')
    };

    // 程序主函数
    const init = () => {
        // console.log(dom.formContainer, dom.userName, dom.userPassword);
        initEvent();
    }

    const initEvent = () => {
        // 事件绑定
        dom.formContainer.addEventListener('submit', allSubmit);
    }

    // 表单的事件函数
    const allSubmit = (e) => {
        // 阻止表单的默认事件(点击提交按钮表单会自动刷新)
        e.preventDefault();
        // console.log(123);
        // 获取表单填写的数据
        const loginId = dom.userName.value.trim();
        const loginPwd = dom.userPassword.value.trim();
        // console.log(name, pwd);
        if (!loginId || !loginPwd) {
            window.alert('账号或密码不能为空');
        }

        sendData(loginId, loginPwd);
    }

    // 创建函数发送数据
    const sendData = async(loginId, loginPwd) => {
        /* const result = await fetch('https://study.duyiedu.com/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                loginId,
                loginPwd
            })
        })
        const res = await result.json();
        // console.log(res);
        if (res.code !== 0) {
            window.alert(res.msg);
            return;
        }
        window.location.replace('/聊天机器人/index.html') */

        const result = await fethcFn({
            url: '/user/login',
            method: 'POST',
            params: {
                loginId,
                loginPwd
            }
        })
        result && window.location.replace('/聊天机器人/index.html')
    }
    init();
})()