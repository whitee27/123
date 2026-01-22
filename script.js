document.addEventListener('DOMContentLoaded', function() {
  // --- Mobile menu ---
  const burger = document.querySelector('.burger-menu');
  const menu = document.getElementById('mobileMenu');
  const close = document.querySelector('.mobile-menu-close');
  let menuOpen = false;
  let lastScrollY = 0;

  // Hide menu by default (display: none via CSS)
  if (menu) menu.classList.remove('active');

  function openMobileMenu() {
    if (!menu || menuOpen) return;
    // Remember scroll position
    lastScrollY = window.scrollY || window.pageYOffset;
    menu.classList.add('active');
    gsap.fromTo(menu, 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out',
        onStart: function() {
          menu.style.display = 'flex';
          // Hide main and all footers when menu is open
          var main = document.querySelector('main');
          if (main) main.style.display = 'none';
          document.querySelectorAll('footer').forEach(footer => {
            footer.style.display = 'none';
          });
        },
        onComplete: function() {
          menuOpen = true;
          document.body.style.overflow = 'hidden';
        }
      }
    );
  }

  function closeMobileMenu() {
    if (!menu || !menuOpen) return;
    setTimeout(function() {
      gsap.to(menu, {
        y: 40,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onUpdate: function() {
          // nothing
        },
        onComplete: function() {
          menu.classList.remove('active');
          menu.style.display = 'none';
          menuOpen = false;
          document.body.style.overflow = '';
        }
      });
    }, 80); // 80ms delay
  }

  if (burger && menu) {
    burger.addEventListener('click', function() {
      openMobileMenu();
    });
  }
  if (close && menu) {
    close.addEventListener('click', function() {
      closeMobileMenu();
      // Show main and all footers back immediately after clicking the cross
      var main = document.querySelector('main');
      if (main) main.style.display = 'block';
      document.querySelectorAll('footer').forEach(footer => {
        footer.style.display = 'block';
      });
      // Restore scroll without animation (after showing main/footer)
      window.scrollTo({ top: lastScrollY, behavior: 'auto' });
    });
  }

  // --- Mobile search clear button logic ---
  const searchInput = document.getElementById('mobileSearchInput');
  const searchClear = document.getElementById('mobileSearchClear');
  if (searchInput && searchClear) {
    function toggleClearBtn() {
      searchClear.style.display = searchInput.value ? 'flex' : 'none';
    }
    function toggleMobileSearchResults() {
      const hideBlocks = document.querySelector('.mobile-menu-hide-on-search');
      const resultsBlock = document.getElementById('mobileSearchResults');
      if (searchInput.value) {
        if (hideBlocks) hideBlocks.style.display = 'none';
        if (resultsBlock) resultsBlock.style.display = 'flex';
      } else {
        if (hideBlocks) hideBlocks.style.display = '';
        if (resultsBlock) resultsBlock.style.display = 'none';
      }
    }
    searchInput.addEventListener('input', () => {
      toggleClearBtn();
      toggleMobileSearchResults();
    });
    searchInput.addEventListener('focus', () => {
      toggleClearBtn();
      toggleMobileSearchResults();
    });
    searchInput.addEventListener('blur', () => {
      toggleClearBtn();
      toggleMobileSearchResults();
    });
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchClear.style.display = 'none';
      toggleMobileSearchResults();
    });
  }

  const popover = document.getElementById('share-popover');
  let lastBtn = null;

  document.body.addEventListener('click', function(e) {
    // Opening the popover
    if (e.target.closest('.actions-icon[aria-label="Share"]')) {
      const btn = e.target.closest('.actions-icon[aria-label="Share"]');
      lastBtn = btn;
      // Positioning
      const rect = btn.getBoundingClientRect();
      popover.style.display = 'block';
      popover.style.position = 'absolute';
      // Left bottom from the button
      const left = window.scrollX + rect.right - popover.offsetWidth;
      const top = window.scrollY + rect.bottom + 8;
      popover.style.left = left + 'px';
      popover.style.top = top + 'px';
      setTimeout(() => popover.classList.add('active'), 10);
      e.stopPropagation();
      return;
    }
    // Click outside the popover — close it
    if (!e.target.closest('#share-popover')) {
      popover.style.display = 'none';
      popover.classList.remove('active');
      lastBtn = null;
    }
  });

  // Copying the link
  const copyBtn = popover.querySelector('.share-popover-copy');
  if (copyBtn) {
    copyBtn.onclick = function(e) {
      e.preventDefault();
      const input = popover.querySelector('input');
      input.select();
      document.execCommand('copy');
      this.classList.add('copied');
      setTimeout(() => this.classList.remove('copied'), 1000);
    };
  }

  // --- Share Popover Mobile Bottom Sheet Logic ---
  function openSharePopover() {
    var popover = document.getElementById('share-popover');
    if (!popover) return;
    popover.classList.add('active');
    if (window.innerWidth <= 767) {
      let backdrop = document.createElement('div');
      backdrop.className = 'share-popover-backdrop active';
      backdrop.onclick = closeSharePopover;
      backdrop.id = 'share-popover-backdrop';
      document.body.appendChild(backdrop);
    }
  }

  function closeSharePopover() {
    var popover = document.getElementById('share-popover');
    if (!popover) return;
    popover.classList.remove('active');
    let backdrop = document.getElementById('share-popover-backdrop');
    if (backdrop) backdrop.remove();
  }

  // Open on click on any share icon
  document.querySelectorAll('.actions-icon[aria-label="Share"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openSharePopover();
    });
  });

  // Desktop search logic

  // Opening search
  document.querySelectorAll('.nav-icon-btn[aria-label="Search"]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (window.innerWidth >= 768) {
        e.preventDefault();
        document.getElementById('desktopSearchOverlay').style.display = 'flex';
        document.getElementById('desktopSearchInput').focus();
      }
    });
  });

  // Close on click outside the block
  const overlay = document.getElementById('desktopSearchOverlay');
  if (overlay) {
    overlay.addEventListener('mousedown', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  }

  // Clear field
  const input = document.getElementById('desktopSearchInput');
  const clearBtn = document.getElementById('desktopSearchClear');
  if (input && clearBtn) {
    input.addEventListener('input', function() {
      clearBtn.style.display = this.value ? 'block' : 'none';
      // You can add card filtering here
    });
    clearBtn.addEventListener('click', function() {
      input.value = '';
      clearBtn.style.display = 'none';
      // Clear/update search results
    });
  }

  // ESC closes search
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (window.innerWidth >= 768) {
        document.getElementById('desktopSearchOverlay').style.display = 'none';
      }
    }
  });

  // --- Player Container Logic ---
  const player = document.getElementById('player');

  // --- Player Overlay Logic ---
  let playerOverlay = null;
  function showPlayerOverlay() {
    if (window.innerWidth > 767) return;
    if (!playerOverlay) {
      playerOverlay = document.createElement('div');
      playerOverlay.className = 'player-overlay';
      document.body.appendChild(playerOverlay);
      playerOverlay.addEventListener('click', closePlayer);
    }
    playerOverlay.classList.add('active');
  }
  function hidePlayerOverlay() {
    if (playerOverlay) {
      playerOverlay.classList.remove('active');
      setTimeout(() => {
        if (playerOverlay) playerOverlay.remove();
        playerOverlay = null;
      }, 200);
    }
  }

  // --- Responsive player/overlay fix on resize ---
  let lastIsMobile = window.innerWidth <= 767;
  window.addEventListener('resize', function() {
    const isMobile = window.innerWidth <= 767;
    if (!player) return;
    const playerOpen = player.style.display !== 'none';
    // If player is open
    if (playerOpen) {
      if (isMobile) {
        // Mobile mode
        player.style.left = '0';
        // Only update transform if not already correct
        if (!player.style.transform.startsWith('translateY')) {
          player.style.transform = 'translateY(0)';
        }
        // Overlay should be visible
        if (!playerOverlay || !playerOverlay.classList.contains('active')) {
          showPlayerOverlay();
        }
      } else {
        // Desktop mode
        player.style.left = '50%';
        if (!player.style.transform.startsWith('translateX')) {
          player.style.transform = 'translateX(-50%) translateY(0)';
        }
        // Overlay should be hidden
        hidePlayerOverlay();
      }
    } else {
      // If player is closed, always hide overlay
      hidePlayerOverlay();
    }
    lastIsMobile = isMobile;
  });

  function openPlayer() {
    if (!player) return;
    player.style.display = 'flex';
    player.style.opacity = 1;
    if (window.innerWidth <= 767) {
      // Mobile animation: slide up from bottom
      player.style.left = '0';
      player.style.transform = 'translateY(100%)';
      gsap.to(player, {
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        onStart: function() {
          player.style.display = 'flex';
        },
        onUpdate: function() {
          player.style.transform = `translateY(${gsap.getProperty(player, 'y')}px)`;
        },
        onComplete: function() {
          player.style.transform = 'translateY(0)';
        }
      });
      showPlayerOverlay();
    } else {
      // Desktop animation
      player.style.left = '50%';
      player.style.opacity = 0;
      player.style.transform = 'translateX(-50%) translateY(40px)';
      gsap.to(player, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
        onStart: function() {
          player.style.display = 'flex';
        },
        onUpdate: function() {
          player.style.transform = 'translateX(-50%) translateY(' + gsap.getProperty(player, 'y') + 'px)';
        },
        onComplete: function() {
          player.style.opacity = 1;
          player.style.transform = 'translateX(-50%) translateY(0)';
        }
      });
    }
  }
  function closePlayer() {
    if (!player) return;
    if (window.innerWidth <= 767) {
      // Mobile animation: slide down
      gsap.to(player, {
        y: window.innerHeight,
        duration: 0.3,
        ease: 'power2.in',
        onUpdate: function() {
          player.style.transform = `translateY(${gsap.getProperty(player, 'y')}px)`;
        },
        onComplete: function() {
          player.style.display = 'none';
          player.style.left = '0';
          player.style.transform = 'translateY(100%)';
          hidePlayerOverlay();
        }
      });
    } else {
      // Desktop animation
      gsap.to(player, {
        opacity: 0,
        y: 40,
        duration: 0.3,
        ease: 'power2.in',
        onUpdate: function() {
          player.style.transform = 'translateX(-50%) translateY(' + gsap.getProperty(player, 'y') + 'px)';
        },
        onComplete: function() {
          player.style.display = 'none';
          player.style.opacity = 0;
          player.style.left = '50%';
          player.style.transform = 'translateX(-50%) translateY(40px)';
        }
      });
    }
  }

  // Play buttons open the player
  const allPlayButtons = document.querySelectorAll('.actions-play-icon');
  allPlayButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openPlayer();
    });
  });

  // --- ADDED: Play in header-info and live-bar ---
  document.querySelectorAll('.header-info .play-btn, .live-bar .play-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      openPlayer();
    });
  });

  // Player closes when clicking outside the block
  if (player) {
    player.addEventListener('mousedown', function(e) {
      if (e.target === this) {
        closePlayer();
      }
    });
  }

  // ESC closes the player
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closePlayer();
    }
  });

  // Player closes when clicking the chevron button
  const chevronBtn = document.querySelector('.player__chevron');
  if (chevronBtn) {
    chevronBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closePlayer();
    });
  }

  // Player closes when clicking the mobile close button
  const playerMobileCloseBtn = document.querySelector('.player-mobile__close button');
  if (playerMobileCloseBtn) {
    playerMobileCloseBtn.addEventListener('click', function(e) {
      e.preventDefault();
      closePlayer();
    });
  }

  // --- Adaptive main-nav logic ---
  function adaptMainNav() {
    const nav = document.querySelector('.main-nav > ul');
    const more = nav.querySelector('.nav-more');
    const dropdown = more.querySelector('.dropdown');
    // Reset all items back except nav-more
    const dropdownLis = Array.from(dropdown.children);
    dropdownLis.forEach(li => nav.insertBefore(li, more));
    // Hide dropdown if empty
    dropdown.style.display = '';
    // Check for overflow
    let navWidth = nav.offsetWidth;
    let availableWidth = nav.parentElement.offsetWidth - 40; // small reserve
    let items = Array.from(nav.children).filter(li => !li.classList.contains('nav-more'));
    let i = items.length - 1;
    while (nav.scrollWidth > availableWidth && i >= 0) {
      // Do not move nav-more
      if (items[i] === more) break;
      dropdown.insertBefore(items[i], dropdown.firstChild);
      i--;
    }
    // Show/hide nav-more if there are hidden items
    if (dropdown.children.length > 0) {
      more.style.display = '';
    } else {
      more.style.display = '';
      dropdown.style.display = 'none';
    }
  }
  // Run on load and resize
  window.addEventListener('resize', adaptMainNav);
  adaptMainNav();

  // --- GSAP dropdown animation ---
  function positionDropdown(dropdown) {
    const SAFE_MARGIN = 24; // increased safe margin from edges
    dropdown.style.left = '';
    dropdown.style.right = '';
    dropdown.style.transform = '';
    const rect = dropdown.getBoundingClientRect();
    const vw = window.innerWidth;

    // If dropdown goes beyond right edge (considering scroll and SAFE_MARGIN)
    if (rect.right > vw - SAFE_MARGIN) {
      const overflow = rect.right - (vw - SAFE_MARGIN);
      dropdown.style.transform = `translateX(-${overflow}px)`;
    }
    // If dropdown goes beyond left edge (considering SAFE_MARGIN)
    if (rect.left < SAFE_MARGIN) {
      dropdown.style.transform = `translateX(${SAFE_MARGIN - rect.left}px)`;
    }
  }

  function animateDropdown(dropdown, show) {
    if (show) {
      dropdown.style.display = 'block';
      positionDropdown(dropdown);
      gsap.fromTo(dropdown, {opacity: 0, scaleY: 0.95, transformOrigin: 'top'}, {opacity: 1, scaleY: 1, duration: 0.25, ease: 'power2.out'});
    } else {
      gsap.to(dropdown, {opacity: 0, scaleY: 0.95, duration: 0.18, ease: 'power2.in', onComplete: () => {
        dropdown.style.display = '';
        dropdown.style.transform = '';
      }});
    }
  }

  // Navigation menu (nav-more)
  document.querySelectorAll('.nav-more').forEach(more => {
    const dropdown = more.querySelector('.dropdown');
    if (!dropdown) return;
    let over = false;
    more.addEventListener('mouseenter', () => {
      over = true;
      animateDropdown(dropdown, true);
    });
    more.addEventListener('mouseleave', () => {
      over = false;
      animateDropdown(dropdown, false);
    });
    more.addEventListener('focusin', () => {
      over = true;
      animateDropdown(dropdown, true);
    });
    more.addEventListener('focusout', () => {
      over = false;
      animateDropdown(dropdown, false);
    });
  });

  // Language menu (lang-selector)
  document.querySelectorAll('.lang-selector').forEach(sel => {
    const dropdown = sel.querySelector('.lang-dropdown');
    if (!dropdown) return;
    let over = false;
    sel.addEventListener('mouseenter', () => {
      over = true;
      animateDropdown(dropdown, true);
    });
    sel.addEventListener('mouseleave', () => {
      over = false;
      animateDropdown(dropdown, false);
    });
    sel.addEventListener('focusin', () => {
      over = true;
      animateDropdown(dropdown, true);
    });
    sel.addEventListener('focusout', () => {
      over = false;
      animateDropdown(dropdown, false);
    });
  });

  // --- Footer mobile menu More logic ---
  (function() {
    const menu = document.getElementById('footerMobileMenu');
    if (!menu) return;
    const moreTab = document.getElementById('footerMoreTab');
    const moreBtn = document.getElementById('footerMoreBtn');
    const moreDropdown = document.getElementById('footerMoreDropdown');

    function updateFooterTabs() {
      // Reset: return all tabs from dropdown back
      const hiddenLinks = Array.from(moreDropdown.querySelectorAll('a'));
      hiddenLinks.forEach(link => {
        link.classList.add('tab');
        menu.insertBefore(link, moreTab);
      });
      moreDropdown.innerHTML = '';

      // Hide More by default
      moreTab.style.display = 'none';
      moreTab.classList.remove('active');
      moreDropdown.classList.remove('show');
      moreBtn.setAttribute('aria-expanded', 'false');

      // Check if tabs fit (by height and width)
      const tabs = Array.from(menu.querySelectorAll('.tab:not(.nav-more)'));
      let lastVisibleIdx = tabs.length - 1;
      // Save initial height (one row)
      const initialHeight = menu.offsetHeight;
      let totalWidth = 0;
      const menuWidth = menu.offsetWidth - 110; // increased reserve
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        tab.style.display = '';
        totalWidth += tab.offsetWidth + 8; // 8px gap
        // Check: if tabs went to a new line (height increased)
        if (menu.offsetHeight > initialHeight || totalWidth > menuWidth) {
          lastVisibleIdx = i - 1;
          break;
        }
      }
      // If not all fit
      if (lastVisibleIdx < tabs.length - 1) {
        moreTab.style.display = 'flex';
        moreTab.classList.add('active');
        // Move extra tabs to dropdown
        for (let i = lastVisibleIdx + 1; i < tabs.length; i++) {
          const tab = tabs[i];
          const li = document.createElement('li');
          tab.classList.remove('tab');
          li.appendChild(tab);
          moreDropdown.appendChild(li);
        }
      }
    }

    // Open/close dropdown
    moreBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = moreDropdown.classList.toggle('show');
      moreBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Click outside dropdown closes it
    document.addEventListener('click', function(e) {
      if (!moreTab.contains(e.target)) {
        moreDropdown.classList.remove('show');
        moreBtn.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', updateFooterTabs);
    window.addEventListener('DOMContentLoaded', updateFooterTabs);
  })();

  // --- Trending-section mobile More logic ---
  (function() {
    const menu = document.getElementById('trendingTabs');
    if (!menu) return;
    const moreTab = document.getElementById('trendingMoreTab');
    const moreBtn = document.getElementById('trendingMoreBtn');
    const moreDropdown = document.getElementById('trendingMoreDropdown');

    function updateTrendingTabs() {
      // Only on mobile
      if (window.innerWidth > 767) {
        // Return all tabs back
        const hiddenLinks = Array.from(moreDropdown.querySelectorAll('button, a'));
        hiddenLinks.forEach(link => {
          link.classList.add('tab');
          menu.insertBefore(link, moreTab);
        });
        moreDropdown.innerHTML = '';
        moreTab.style.display = 'none';
        moreTab.classList.remove('active');
        moreDropdown.classList.remove('show');
        moreBtn.setAttribute('aria-expanded', 'false');
        return;
      }
      // Reset: return all tabs from dropdown back
      const hiddenLinks = Array.from(moreDropdown.querySelectorAll('button, a'));
      hiddenLinks.forEach(link => {
        link.classList.add('tab');
        menu.insertBefore(link, moreTab);
      });
      moreDropdown.innerHTML = '';
      moreTab.style.display = 'none';
      moreTab.classList.remove('active');
      moreDropdown.classList.remove('show');
      moreBtn.setAttribute('aria-expanded', 'false');

      // Get all tabs except more
      const tabs = Array.from(menu.querySelectorAll('.tab:not(.nav-more)'));
      if (tabs.length === 0) return; // safety
      let lastVisibleIdx = tabs.length - 1;
      // Save initial height (one row)
      const initialHeight = menu.offsetHeight;
      let totalWidth = 0;
      const menuWidth = menu.offsetWidth - 60; // reserve
      for (let i = 0; i < tabs.length; i++) {
        const tab = tabs[i];
        tab.style.display = '';
        totalWidth += tab.offsetWidth + 8; // 8px gap
        // Check: if tabs went to a new line (height increased)
        if (menu.offsetHeight > initialHeight || totalWidth > menuWidth) {
          lastVisibleIdx = i - 1;
          break;
        }
      }
      // If not all fit
      if (lastVisibleIdx < tabs.length - 1) {
        moreTab.style.display = 'flex';
        moreTab.classList.add('active');
        // Move extra tabs to dropdown
        for (let i = lastVisibleIdx + 1; i < tabs.length; i++) {
          const tab = tabs[i];
          const li = document.createElement('li');
          tab.classList.remove('tab');
          li.appendChild(tab);
          moreDropdown.appendChild(li);
        }
      }
    }

    // Open/close dropdown
    moreBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = moreDropdown.classList.toggle('show');
      moreBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      moreDropdown.style.display = isOpen ? 'block' : 'none';
    });
    // Click outside dropdown closes it
    document.addEventListener('click', function(e) {
      if (!moreTab.contains(e.target)) {
        moreDropdown.classList.remove('show');
        moreBtn.setAttribute('aria-expanded', 'false');
        moreDropdown.style.display = 'none';
      }
    });

    window.addEventListener('resize', updateTrendingTabs);
    window.addEventListener('DOMContentLoaded', updateTrendingTabs);
  })();
}); 