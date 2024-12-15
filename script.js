document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有游戏容器
    const gameContainers = document.querySelectorAll('.game-container');
    
    // 设置游戏图标
    document.querySelectorAll('.games-card').forEach(card => {
        const title = card.querySelector('.game-title').textContent.toLowerCase();
        const logoIcon = card.querySelector('.game-logo i');
        
        // 根据游戏标题设置适当的图标
        if (title.includes('hockey')) {
            logoIcon.className = 'fas fa-hockey-puck';
        } else if (title.includes('car')) {
            logoIcon.className = 'fas fa-car';
        } else if (title.includes('ball')) {
            if (title.includes('8 ball') || title.includes('pool')) {
                logoIcon.className = 'fas fa-bowling-ball';
            } else {
                logoIcon.className = 'fas fa-basketball-ball';
            }
        } else if (title.includes('tap')) {
            logoIcon.className = 'fas fa-hand-pointer';
        } else {
            logoIcon.className = 'fas fa-gamepad'; // 默认图标
        }
    });
    
    // 为每个iframe添加加载处理
    gameContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            // 添加加载动画
            container.classList.add('loading');
            
            // 监听iframe加载完成事件
            iframe.addEventListener('load', () => {
                container.classList.remove('loading');
            });

            // 处理iframe加载错误
            iframe.addEventListener('error', () => {
                container.innerHTML = `
                    <div class="error-message">
                        <p>游戏加载失败，请刷新页面重试</p>
                    </div>
                `;
                container.classList.remove('loading');
            });
        }
    });

    // 添加窗口大小变化监听，优化iframe布局
    window.addEventListener('resize', () => {
        gameContainers.forEach(container => {
            const iframe = container.querySelector('iframe');
            if (iframe) {
                // 确保iframe保持正确的宽高比
                const containerWidth = container.offsetWidth;
                const aspectRatio = 4/3; // 保持4:3的宽高比
                iframe.style.height = `${containerWidth / aspectRatio}px`;
            }
        });
    });

    // 初始触发一次resize事件以设置正确的尺寸
    window.dispatchEvent(new Event('resize'));
});