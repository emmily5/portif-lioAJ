/* ============================================
   ARCH STUDIO - Main JavaScript (ATUALIZADO)
   ============================================ */

// === Theme Management ===
function initTheme() {
  var storageKey = 'arch-studio-theme';
  var savedTheme = localStorage.getItem(storageKey);

  if (savedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  } else {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }
}

function toggleTheme() {
  var storageKey = 'arch-studio-theme';
  var isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem(storageKey, isDark ? 'dark' : 'light');
}

// Initialize theme immediately to prevent flash
initTheme();

// === Mobile Navigation ===
function initMobileNav() {
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function() {
      var isOpen = mobileMenu.classList.toggle('open');
      menuBtn.textContent = isOpen ? '\u2715' : '\u2630';
    });
  }
}

// === Category Filtering (Work & Blog pages) ===
function initFiltering() {
  var filterButtons = document.querySelectorAll('.filter-btn');
  var filterableItems = document.querySelectorAll('[data-category]');

  if (filterButtons.length === 0 || filterableItems.length === 0) return;

  filterButtons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var category = this.getAttribute('data-filter');

      filterButtons.forEach(function(b) { b.classList.remove('active'); });
      this.classList.add('active');

      filterableItems.forEach(function(item) {
        if (category === 'ALL' || item.getAttribute('data-category') === category) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// === Make Project Cards Clickable (work.html) ===
function initProjectCardLinks() {
  var cards = document.querySelectorAll('.project-card');
  if (cards.length === 0) return;

  cards.forEach(function(card) {
    // Pega o título da card para encontrar o projeto correspondente
    var titleEl = card.querySelector('.project-card-title');
    if (!titleEl || typeof projectsData === 'undefined') return;

    var cardTitle = titleEl.textContent.trim();

    // Encontra o projeto pelo título
    var project = projectsData.find(function(p) {
      return p.title === cardTitle;
    });

    if (!project) return;

    var url = 'project.html?id=' + project.id;

    // Torna a imagem clicável
    var imgWrapper = card.querySelector('.project-card-img-wrapper');
    if (imgWrapper) {
      imgWrapper.style.cursor = 'pointer';
      imgWrapper.addEventListener('click', function() {
        window.location.href = url;
      });
    }

    // Torna o título clicável
    if (titleEl) {
      titleEl.style.cursor = 'pointer';
      titleEl.addEventListener('click', function() {
        window.location.href = url;
      });
    }
  });
}

// === Blog Post Rendering ===
function renderBlogPost() {
  var container = document.getElementById('blog-post-container');
  if (!container) return;

  var params = new URLSearchParams(window.location.search);
  var postId = params.get('id');

  if (!postId || typeof blogPosts === 'undefined') {
    container.innerHTML = renderPostNotFound();
    return;
  }

  var post = blogPosts.find(function(p) { return p.id === postId; });

  if (!post) {
    container.innerHTML = renderPostNotFound();
    return;
  }

  container.innerHTML = renderPostContent(post);
}

function renderPostNotFound() {
  return '<div class="page-hero" style="padding-bottom: 8rem;">' +
    '<div class="container"><div class="max-w-4xl" style="text-align:center;">' +
    '<h1 class="page-hero-title text-architectural">Post Not Found</h1>' +
    '<a href="blog.html" class="blog-post-back">&larr; BACK TO BLOG</a>' +
    '</div></div></div>';
}

function renderPostContent(post) {
  var contentHtml = parseContent(post.content);

  var relatedPosts = blogPosts.filter(function(p) {
    return p.id !== post.id && p.category === post.category;
  }).slice(0, 2);

  var relatedHtml = '';
  if (relatedPosts.length > 0) {
    relatedHtml = '<div class="related-posts">' +
      '<h3 class="related-posts-title text-architectural">Related Articles</h3>' +
      '<div class="related-posts-grid">';

    relatedPosts.forEach(function(rp) {
      relatedHtml += '<a href="blog-post.html?id=' + rp.id + '" class="related-post-card">' +
        '<div class="related-post-img-wrapper">' +
        '<img src="' + rp.image + '" alt="' + rp.title + '" class="related-post-img">' +
        '</div>' +
        '<h4 class="related-post-title text-architectural">' + rp.title + '</h4>' +
        '<p class="related-post-meta">' + rp.date + ' &bull; ' + rp.readTime + '</p>' +
        '</a>';
    });

    relatedHtml += '</div></div>';
  }

  return '<a href="blog.html" class="blog-post-back">&larr; BACK TO BLOG</a>' +
    '<div class="blog-post-meta">' +
    '<span class="blog-post-category-badge">' + post.category + '</span>' +
    '<span>' + post.date + '</span>' +
    '<span>&bull;</span>' +
    '<span>' + post.readTime + '</span>' +
    '<span>&bull;</span>' +
    '<span>' + post.author + '</span>' +
    '</div>' +
    '<h1 class="blog-post-title text-architectural">' + post.title + '</h1>' +
    '<p class="blog-post-excerpt">' + post.excerpt + '</p>' +
    '<div class="blog-post-featured-img">' +
    '<img src="' + post.image + '" alt="' + post.title + '">' +
    '</div>' +
    '<div class="blog-post-content">' + contentHtml + '</div>' +
    '<div class="author-info">' +
    '<div class="author-avatar"></div>' +
    '<div>' +
    '<h3 class="author-name">' + post.author + '</h3>' +
    '<p class="author-role">Architect & Writer</p>' +
    '</div>' +
    '</div>' +
    relatedHtml;
}

function parseContent(content) {
  return content
    .split('\n')
    .map(function(line) {
      if (line.startsWith('# ')) {
        return '<h1>' + line.substring(2) + '</h1>';
      } else if (line.startsWith('## ')) {
        return '<h2>' + line.substring(3) + '</h2>';
      } else if (line.startsWith('### ')) {
        return '<h3>' + line.substring(4) + '</h3>';
      } else if (line.startsWith('- **') && line.endsWith('**')) {
        var text = line.substring(4, line.length - 2);
        return '<li><strong>' + text + '</strong></li>';
      } else if (line.startsWith('- ')) {
        return '<li>' + line.substring(2) + '</li>';
      } else if (line.trim() === '') {
        return '<br>';
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return '<p><strong>' + line.substring(2, line.length - 2) + '</strong></p>';
      } else {
        return '<p>' + line + '</p>';
      }
    })
    .join('');
}

// === Project Detail Page Rendering ===
function renderProjectDetail() {
  var container = document.getElementById('project-container');
  if (!container) return;

  var params = new URLSearchParams(window.location.search);
  var projectId = params.get('id');

  if (!projectId || typeof projectsData === 'undefined') {
    container.innerHTML = renderProjectNotFound();
    return;
  }

  var project = projectsData.find(function(p) { return p.id === projectId; });

  if (!project) {
    container.innerHTML = renderProjectNotFound();
    return;
  }

  // Atualiza o título da aba do browser
  document.title = project.title + ' - Ana Julia Ramalho Arquitetura';

  container.innerHTML = buildProjectHTML(project);

  // Após injetar o HTML, inicializa lightbox e carrossel
  initProjectLightbox(project.images);
  initCarousels();
}

function renderProjectNotFound() {
  return '<div style="padding: 4rem 1.5rem; text-align:center;">' +
    '<h1 class="page-hero-title text-architectural" style="margin-bottom:2rem;">Projeto não encontrado</h1>' +
    '<a href="work.html" class="project-back"><span class="project-back-arrow">&larr;</span> VOLTAR AOS PROJETOS</a>' +
    '</div>';
}

function buildProjectHTML(project) {
  // === Hero ===
  var heroHTML =
    '<div class="project-hero">' +
      '<img src="' + project.mainImage + '" alt="' + project.title + '" class="project-hero-img">' +
      '<div class="project-hero-overlay"></div>' +
      '<div class="project-hero-info">' +
        '<div class="project-hero-category">' + project.categoryLabel + '</div>' +
        '<h1 class="project-hero-title text-architectural">' + project.title + '</h1>' +
        '<p class="project-hero-location">' + project.location + ', ' + project.year + '</p>' +
      '</div>' +
    '</div>';

  // === Botão Voltar ===
  var backHTML =
    '<div style="padding: 2.5rem 1.5rem 0; max-width: 1280px; margin: 0 auto;">' +
      '<a href="work.html" class="project-back"><span class="project-back-arrow">&larr;</span> VOLTAR AOS PROJETOS</a>' +
    '</div>';

  // === Descrição + Ficha técnica ===
  var paragraphs = project.description.trim().split('\n').filter(function(l) { return l.trim() !== ''; });
  var descParagraphsHTML = paragraphs.map(function(p) {
    return '<p>' + p.trim() + '</p>';
  }).join('');

  var detailsItemsHTML = project.details.map(function(d) {
    return '<div class="project-detail-item">' +
      '<span class="project-detail-label">' + d.label + '</span>' +
      '<span class="project-detail-value">' + d.value + '</span>' +
    '</div>';
  }).join('');

  var layoutHTML =
    '<div class="project-layout">' +
      '<div class="project-description">' +
        '<p class="project-description-title">SOBRE O PROJETO</p>' +
        '<div class="project-description-text">' + descParagraphsHTML + '</div>' +
      '</div>' +
      '<div class="project-details-card">' +
        '<p class="project-details-title">FICHA TÉCNICA</p>' +
        '<div class="project-details-list">' + detailsItemsHTML + '</div>' +
      '</div>' +
    '</div>';

  // === Galeria ===
  var galleryImgsHTML = project.images.map(function(src, index) {
    return '<div class="project-gallery-img-wrapper" data-lightbox-index="' + index + '">' +
      '<img src="' + src + '" alt="' + project.title + ' - foto ' + (index + 1) + '" class="project-gallery-img" loading="lazy">' +
    '</div>';
  }).join('');

  var galleryHTML =
    '<div class="project-gallery">' +
      '<p class="project-gallery-title">GALERIA DE IMAGENS</p>' +
      '<div class="project-gallery-grid">' + galleryImgsHTML + '</div>' +
    '</div>';

  // === Lightbox ===
  var lightboxHTML =
    '<div class="project-lightbox" id="project-lightbox">' +
      '<button class="project-lightbox-close" id="lightbox-close" aria-label="Fechar">&#10005;</button>' +
      '<button class="project-lightbox-nav project-lightbox-prev" id="lightbox-prev" aria-label="Anterior">&#8592;</button>' +
      '<img src="" alt="" class="project-lightbox-img" id="lightbox-img">' +
      '<button class="project-lightbox-nav project-lightbox-next" id="lightbox-next" aria-label="Próximo">&#8594;</button>' +
      '<span class="project-lightbox-counter" id="lightbox-counter"></span>' +
    '</div>';

  // === Projetos Relacionados ===
  var related = projectsData.filter(function(p) {
    return p.id !== project.id && p.category === project.category;
  }).slice(0, 3);

  var relatedHTML = '';
  if (related.length > 0) {
    var relatedCardsHTML = related.map(function(rp) {
      return '<a href="project.html?id=' + rp.id + '" class="project-related-card">' +
        '<div class="project-related-img-wrapper">' +
          '<img src="' + rp.mainImage + '" alt="' + rp.title + '" class="project-related-img" loading="lazy">' +
        '</div>' +
        '<p class="project-related-card-category">' + rp.categoryLabel + '</p>' +
        '<h3 class="project-related-card-title text-architectural">' + rp.title + '</h3>' +
        '<p class="project-related-card-location">' + rp.location + ', ' + rp.year + '</p>' +
      '</a>';
    }).join('');

    relatedHTML =
      '<div class="project-related">' +
        '<p class="project-related-title">PROJETOS RELACIONADOS</p>' +
        '<div class="project-related-grid">' + relatedCardsHTML + '</div>' +
      '</div>';
  }

  return heroHTML + backHTML + layoutHTML + galleryHTML + lightboxHTML + relatedHTML;
}

// === Lightbox ===
function initProjectLightbox(images) {
  var lightbox = document.getElementById('project-lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxCounter = document.getElementById('lightbox-counter');
  var closeBtn = document.getElementById('lightbox-close');
  var prevBtn = document.getElementById('lightbox-prev');
  var nextBtn = document.getElementById('lightbox-next');

  if (!lightbox || !lightboxImg) return;

  var currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImg.src = images[currentIndex];
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    lightboxImg.src = images[currentIndex];
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    lightboxImg.src = images[currentIndex];
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + images.length;
  }

  // Clique nas imagens da galeria
  document.querySelectorAll('.project-gallery-img-wrapper').forEach(function(wrapper) {
    wrapper.addEventListener('click', function() {
      var index = parseInt(this.getAttribute('data-lightbox-index')) || 0;
      openLightbox(index);
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeLightbox);
  prevBtn && prevBtn.addEventListener('click', showPrev);
  nextBtn && nextBtn.addEventListener('click', showNext);

  // Fechar ao clicar no fundo
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  // Teclas de teclado
  document.addEventListener('keydown', function(e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

// === Portfolio Carousel ===
function initCarousels() {
  var carousels = document.querySelectorAll('.portfolio-carousel');

  carousels.forEach(function(carousel) {
    var track = carousel.querySelector('.carousel-track');
    var images = track.querySelectorAll('.portfolio-img');
    var btnPrev = carousel.querySelector('.carousel-btn-prev');
    var btnNext = carousel.querySelector('.carousel-btn-next');
    var dotsContainer = carousel.querySelector('.carousel-dots');
    var currentIndex = 0;
    var totalSlides = images.length;

    if (totalSlides <= 1) {
      carousel.classList.add('carousel-single');
      return;
    }

    for (var i = 0; i < totalSlides; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Ir para imagem ' + (i + 1));
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', function() {
        goToSlide(parseInt(this.getAttribute('data-index')));
      });
      dotsContainer.appendChild(dot);
    }

    var dots = dotsContainer.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      track.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === currentIndex);
      });
    }

    btnPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      goToSlide(currentIndex - 1);
    });

    btnNext.addEventListener('click', function(e) {
      e.stopPropagation();
      goToSlide(currentIndex + 1);
    });

    var startX = 0;
    var isDragging = false;

    carousel.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
      isDragging = false;
    }, { passive: true });
  });
}

// === Initialize on DOM Ready ===
document.addEventListener('DOMContentLoaded', function() {
  initMobileNav();
  initFiltering();
  renderBlogPost();
  renderProjectDetail();
  initProjectCardLinks();
  initCarousels();

  document.querySelectorAll('.theme-toggle').forEach(function(btn) {
    btn.addEventListener('click', toggleTheme);
  });
});