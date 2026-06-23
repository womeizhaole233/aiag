// static/js/content-loader.js
// AJAX页面加载器 - 消除页面切换闪烁

(function() {
    'use strict';

    // 容器选择器 - 用于替换页面内容的DOM元素
    const CONTENT_CONTAINER = '#app-content';

    // ==================== 页面加载器核心函数 ====================

    /**
     * 通过AJAX加载页面内容并替换当前页面
     * @param {string} pageName - 页面名称（如 'index', 'game'）
     * @param {Object} params - URL参数对象
     */
    async function loadPage(pageName, params = {}) {
        // 显示加载动画
        showLoading();

        // 构建请求URL
        const url = `/api/page/${pageName}` +
                    (Object.keys(params).length ? '?' +
                    new URLSearchParams(params) : '');

        try {
            // 获取页面内容
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}: 加载失败`);
            const html = await response.text();

            // 解析HTML获取内容块
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector(CONTENT_CONTAINER);

            if (!newContent) {
                throw new Error('未找到内容容器');
            }

            // 获取当前容器
            const container = document.querySelector(CONTENT_CONTAINER);
            if (!container) {
                throw new Error('当前页面无内容容器');
            }

            // 带过渡动画替换内容
            container.style.transition = 'opacity 0.3s ease';
            container.style.opacity = '0';

            setTimeout(() => {
                // 替换内容
                container.innerHTML = newContent.innerHTML;

                // 执行新页面的JavaScript
                executePageScripts(container);

                // 恢复显示
                container.style.opacity = '1';

                // 隐藏加载动画
                hideLoading();

                // 更新浏览器历史记录
                history.pushState({ page: pageName }, '', `/${pageName}`);
            }, 300);

        } catch (error) {
            console.error('页面加载失败:', error);
            hideLoading();
            showError('加载失败，请重试');
        }
    }

    // ==================== 加载动画控制 ====================

    /**
     * 显示加载动画
     */
    function showLoading() {
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.innerHTML = `
                <div style="position:fixed;inset:0;background:rgba(0,0,0,0.7);
                            display:flex;align-items:center;justify-content:center;z-index:9999;">
                    <div style="color:#c99d57;font-size:20px;font-family:'STKaiti','KaiTi',serif;">
                        📜 加载中...
                    </div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    /**
     * 隐藏加载动画
     */
    function hideLoading() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    /**
     * 显示错误提示
     * @param {string} message - 错误消息
     */
    function showError(message) {
        alert(message);
    }

    /**
     * 执行新页面加载后的JavaScript脚本
     * @param {HTMLElement} container - 内容容器元素
     */
    function executePageScripts(container) {
        const scripts = container.querySelectorAll('script');
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.textContent = script.textContent;
            document.body.appendChild(newScript);
            document.body.removeChild(newScript);
        });
    }

    // ==================== 链接拦截 ====================

    /**
     * 拦截页面内的链接点击事件
     * @param {MouseEvent} e - 点击事件
     */
    function interceptLinkClick(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        if (!href) return;

        // 忽略外部链接和锚点
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:')) {
            return;
        }

        // 忽略API链接
        if (href.startsWith('/api/')) {
            return;
        }

        // 提取页面名称
        const pageMatch = href.match(/^\/(\w+)/);
        if (!pageMatch) return;

        e.preventDefault();
        const pageName = pageMatch[1];

        // 加载页面
        loadPage(pageName);
    }

    // ==================== 浏览器历史管理 ====================

    /**
     * 处理浏览器前进/后退
     */
    function handlePopState(e) {
        if (e.state && e.state.page) {
            loadPage(e.state.page);
        }
    }

    // ==================== 初始化 ====================

    /**
     * 初始化页面加载器
     */
    function init() {
        // 绑定链接点击事件
        document.addEventListener('click', interceptLinkClick);

        // 绑定浏览器历史事件
        window.addEventListener('popstate', handlePopState);

        // 设置初始历史状态
        const currentPath = window.location.pathname.replace('/', '');
        if (currentPath) {
            history.replaceState({ page: currentPath }, '', window.location.pathname);
        }

        console.log('📜 页面加载器已初始化');
    }

    // 暴露全局函数
    window.loadPage = loadPage;
    window.showLoading = showLoading;
    window.hideLoading = hideLoading;
    window.showError = showError;

    // DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
