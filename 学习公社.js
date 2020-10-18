// ==UserScript==
// @name         学习公社刷课脚本
// @namespace    http://salheli.com/
// @version      0.1
// @description  瞎写
// @author       SalHe
// @match        https://study.enaea.edu.cn/*
// @grant        window.close
// ==/UserScript==

(function($) {
    'use strict';

    const KEY_FROM_COURSE_PAGE = 'key_from_course_page';

    let config = {
        close_course_contents: false, // 自动关闭目录
        next_chapter: true, // 自动选节（打开选节页面，然后自动选节）
        continue_play: true, // 自动继续播放
        not_rest: true, // 关闭休息提示
    }


    if (window.location.pathname == '/circleIndexRedirect.do') {
        // 自动切换到下一个视频
        const timerId = setInterval(() => {
            const trs = $('#J_myOptionRecords tr.odd, #J_myOptionRecords tr.even');
            if (trs.length > 0) clearInterval(timerId);
            for (let i = 0; i < trs.length; i++) {
                const element = trs[i];
                if (element.querySelector('.progressvalue').innerText != '100%') {
                    localStorage.setItem(KEY_FROM_COURSE_PAGE, window.location.href);
                    element.querySelector('.saveStuCourse').click(); // 打开播放页面
                    if (config.close_course_contents) window.close();
                    clearInterval(timerId);
                    break;
                }
            }
        }, 1000);
    } else if (window.location.pathname == '/viewerforccvideo.do') {
        // 观看视频页面
        const timerId = setInterval(() => {
            const lis = $('.cvtb-MCK-course-content');
            let isFound = false;
            for (let i = 0; i < lis.length; i++) {
                const element = lis[i];
                if ('100%' != element.querySelector('.cvtb-MCK-CsCt-studyProgress').innerText) {
                    // 不是正在播放的就切换
                    // 如果是，说明当前的还没播放完
                    // 也需要打断循环
                    if (!element.className.indexOf('current') !== -1)
                        element.click();
                    isFound = true;
                    break;
                }
            }

            // 断点播放
            if (config.continue_play) {
                let element = $('#ccH5jumpInto');
                if (element.html() !== undefined) {
                    element.click();
                }
            }

            if (config.not_rest) {
                let button = $('#rest_tip button');
                if (button.html() === '继续学习')
                    button.click();
            }

            // 说明当前页面的视频已经放完
            // 跳到选课，选下一节
            if (config.next_chapter && !isFound) {
                // const url = 'circleIndexRedirect.do?' + window.location.search;
                const url = localStorage.getItem(KEY_FROM_COURSE_PAGE);
                window.open(url, '大学生网络党校刷课');
            }
        }, 1000);
    }

})($);