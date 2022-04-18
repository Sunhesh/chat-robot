(() => {
    const dom = {
        sendBtn: document.querySelector('.send-btn'),
        nickName: document.querySelector('.nick-name'),
        accountName: document.querySelector('.account-name'),
        loginTime: document.querySelector('.login-time'),
        contentBody: document.querySelector('.content-body'),
        inputContainer: document.querySelector('.input-container'),
        arrowBtn: document.querySelector('.arrow-container'),
        closeBtn: document.querySelector('.close'),
        selectType: document.querySelector('.select-container'),
        clear: document.querySelector('.clear')
    };
    // 定义初始变量
    let page = 0;
    let size = 10;
    let chatTotal = 0;
    let sendType = 'enter';

    /* 创建入口函数 */

    const init = () => {
        getUser();
        list();
        initEvent();
    }

    /* 创建一个事件入口函数 */

    const initEvent = () => {
        dom.sendBtn.addEventListener('click', sendBtnClick)
        dom.contentBody.addEventListener('scroll', onContentScroll)
        dom.arrowBtn.addEventListener('click', onArrowBtnClick)
        document.querySelectorAll('.select-item').forEach(node => node.addEventListener('click', onSelectItemClick))
        dom.inputContainer.addEventListener('keyup', onInputContainerKeyUp)
        dom.closeBtn.addEventListener('click', onCloseBtnClick)
        dom.clear.addEventListener('click', onClear)
    }

    /* 定义事件绑定函数 */
    const sendBtnClick = async() => {
        /* 判断发送值是否为空 */
        const content = dom.inputContainer.value.trim();
        if (!content) {
            window.alert('发送消息不能为空')
            return
        }
        /* 调用渲染函数将自己的内容渲染到界面上 */
        renderChat([{ from: 'user', content }], 'bottom')
        dom.inputContainer.value = ''
            /* 发送数据到后端 */
        const res = await fethcFn({
            url: '/chat',
            method: 'POST',
            params: { content }
        })
        renderChat([{ from: 'd', content: res.content }], 'bottom')
    }

    /* 定义获取用户信息的方法 */
    const getUser = async() => {
        const res = await fethcFn({
            url: '/user/profile'
        })
        dom.nickName.innerHTML = res.nickname
        dom.accountName.innerHTML = res.loginId
        dom.loginTime.innerHTML = formaDate(res.lastLoginTime)
    }

    /* 定义获取聊天历史信息的请求函数 */
    const list = async(direction) => {
        const res = await fethcFn({
            url: '/chat/history',
            params: {
                page,
                size,
            }
        })

        chatTotal = res.chatTotal
            /* 调用渲染聊天界面函数 */
        renderChat(res.data, direction)
    }

    /* 定义渲染聊天界面函数  */

    const renderChat = (list, direction) => {
        /* 没有历史记录的时候，不需要进行一个渲染 */
        list.reverse();
        if (!list.length) {
            contentBody.innerHTML = `
                          <div class="chat-container robot-container">
                            <img src="./img/robot.jpg" alt="">
                            <div class="chat-txt">
                              您好！我是腾讯机器人，非常欢迎您的到来，有什么想和我聊聊的吗？
                            </div>
                          </div>
                                `
            return
        }
        const chatData = list.map(item => {
            /* 左右分别的进行渲染 */
            return item.from === 'user' ?
                `<div class="chat-container avatar-container">
                        <img src="./img/avtar.png" alt="">
                        <div class="chat-txt">${item.content}</div>
          </div>` :
                ` <div class="chat-container robot-container">
                    <img src="./img/robot.jpg" alt="">
                    <div class="chat-txt">
                      ${item.content}
                    </div>
            </div>`
        })
        if (direction === 'bottom') {
            dom.contentBody.innerHTML += chatData.join(' ')
            const bottomDistance = document.querySelectorAll('.chat-container')[document.querySelectorAll('.chat-container').length - 1].offsetTop
            dom.contentBody.scrollTo(0, bottomDistance)
        } else {
            dom.contentBody.innerHTML = chatData.join(' ') + dom.contentBody.innerHTML
        }
    }

    /* 定义滚动事件监听函数 */

    const onContentScroll = function() {
        /* 滚动到顶部的时候进行加载第二页的数据 */
        if (this.scrollTop === 0) {
            /* 判断后端是否还有数据 */
            if (chatTotal <= (page + 1) * size) return
            page++
            list('top')
        }
    }

    /* 定义箭头点击事件 */

    const onArrowBtnClick = () => {
        dom.selectType.style.display = 'block'
    }

    /* 每一个选择按钮的列表项的事件函数 */
    const onSelectItemClick = function() {
        /* 高亮状态的处理 */
        document.querySelectorAll('.select-item').forEach(node => node.classList.remove('on'))
        this.classList.add('on')
            /* 赋值的操作 */
        sendType = this.getAttribute('type')
        dom.selectType.style.display = 'none'
    }

    /* 定义键盘输入事件 */
    const onInputContainerKeyUp = (e) => {
        if (e.keyCode === 13 && sendType === 'enter' && !e.ctrlKey || e.keyCode === 13 && sendType === 'ctrlEnter' && e.ctrlKey) {
            dom.sendBtn.click()
        }
    }

    /* 退出按钮的事件绑定函数 */
    const onCloseBtnClick = () => {
        /* 清空sessionStorage */
        sessionStorage.removeItem('token')
        window.location.replace(baseUrl + 'login.html')
            /* 界面的跳转 */
    }

    /* 清除按钮函数 */
    const onClear = () => {
        dom.inputContainer.value = '';
    }


    init();
})()