/**
 * 功能1：页面加载完成后，高亮当前阅读章节对应的导航项
 * 功能2：点击导航链接时，平滑滚动到目标位置（弥补浏览器默认跳转的生硬）
 */

document.addEventListener('DOMContentLoaded', function () {

    // ---------- 平滑滚动：给所有导航链接加上平滑效果 ----------
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // 只处理页内锚点（以 # 开头）
            if (targetId && targetId.startsWith('#')) {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();  // 阻止默认跳转
                    const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 80; // 减去导航高度
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    // 更新URL哈希（让浏览器地址栏也变化，方便分享）
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ---------- 自动高亮当前章节（滚动时更新导航样式） ----------
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        // 给导航链接添加一个激活样式（CSS 里我们加一个 .active 类）
        const style = document.createElement('style');
        style.textContent = `
            nav a.active {
                color: #2563eb;
                font-weight: 600;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 2px;
            }
        `;
        document.head.appendChild(style);

        // 滚动时检测哪个章节在视口中
        function updateActiveNav() {
            let currentId = '';
            sections.forEach(function (sec) {
                const rect = sec.getBoundingClientRect();
                // 如果章节顶部在视口上方 100px 以内，认为它当前处于激活态
                if (rect.top <= 120) {
                    currentId = sec.getAttribute('id');
                }
            });

            // 更新所有导航链接的样式
            navLinks.forEach(function (link) {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        }

        // 监听滚动事件（节流优化）
        let ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    updateActiveNav();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // 初始调用一次
        updateActiveNav();
    }

    // ---------- 控制台欢迎信息（可选，纯属好玩） ----------
    console.log('🚀 欢迎访问王肖阳的技术博客 | 人形机器人热管理系统设计');
    console.log('📧 联系: sirotail@foxmail.com');
});