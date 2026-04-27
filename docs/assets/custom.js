// Enhance with relocation of profile badges to right sidebar below TOC
(function () {
    console.log('Custom JS loaded');
    function moveBadges() {
        const badgeContainer = document.getElementById('profile-links-badges');
        if (!badgeContainer) return;
        const rightSidebar = document.querySelector('.md-sidebar--secondary .md-sidebar__scrollwrap');
        if (!rightSidebar) return;
        let wrapper = rightSidebar.querySelector('.sidebar-badges');
        if (wrapper) {
            if (badgeContainer.parentElement === wrapper) return;
            wrapper.appendChild(badgeContainer);
            badgeContainer.style.display = 'block';
            return;
        }
        const toc = rightSidebar.querySelector('nav ul, .md-nav');
        wrapper = document.createElement('div');
        wrapper.className = 'sidebar-badges';
        const heading = document.createElement('h3');
        heading.textContent = 'Links & Contact';
        wrapper.appendChild(heading);
        badgeContainer.style.display = 'block';
        wrapper.appendChild(badgeContainer);
        if (toc && toc.parentNode) {
            toc.parentNode.appendChild(wrapper);
        } else {
            rightSidebar.appendChild(wrapper);
        }
    }
    function ensureHeaderUtility() {
        const headerInner = document.querySelector('.md-header__inner');
        if (!headerInner) return null;
        let util = headerInner.querySelector('.md-header-utility');
        if (!util) {
            util = document.createElement('div');
            util.className = 'md-header-utility';
            const after = headerInner.querySelector('.md-search');
            if (after && after.parentNode) {
                after.parentNode.insertBefore(util, after.nextSibling);
            } else {
                headerInner.appendChild(util);
            }
        }
        return util;
    }
    function addPdfButton() {
        const util = ensureHeaderUtility();
        if (!util) return;
        if (util.querySelector('#export-pdf')) return;
        const btn = document.createElement('button');
        btn.id = 'export-pdf';
        btn.className = 'md-button md-button--secondary header-print-btn';
        btn.title = 'Print / Save PDF';
        btn.innerHTML = '<svg class="material-icons" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M19 8H5c-1.66 0-3 1.34-3 3v4h4v4h12v-4h4v-4c0-1.66-1.34-3-3-3zm-3 9H8v-5h8v5zm3-9V4H5v4h14z"/></svg><span class="label">PDF</span>';
        util.appendChild(btn);
    }
    function wirePdfButton() {
        const btn = document.getElementById('export-pdf');
        if (btn && !btn.dataset.bound) {
            btn.addEventListener('click', () => window.print());
            btn.dataset.bound = '1';
        }
    }
    function init() {
        moveBadges();
        addPdfButton();
        wirePdfButton();
        setTimeout(() => { moveBadges(); addPdfButton(); wirePdfButton(); }, 200);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
