/**
 * CORE IT Landing Page - Main Script (Separated)
 */

'use strict';

/* ─── LocalStorage Database ─── */
class CoreITDatabase {
    constructor() {
        this.prefix = 'coreit_';
        this.init();
    }
    init() {
        if (!localStorage.getItem(this.prefix + 'initialized_v2')) {
            this.seedData();
            localStorage.setItem(this.prefix + 'initialized_v2', 'true');
        }
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    create(collection, data) {
        const items = this.getAll(collection);
        const item = { id: this.generateId(), timestamp: new Date().toISOString(), ...data };
        items.push(item);
        localStorage.setItem(this.prefix + collection, JSON.stringify(items));
        return item;
    }
    getAll(collection) {
        try { return JSON.parse(localStorage.getItem(this.prefix + collection)) || []; }
        catch { return []; }
    }
    delete(collection, id) {
        const items = this.getAll(collection).filter(i => i.id !== id);
        localStorage.setItem(this.prefix + collection, JSON.stringify(items));
    }
    seedData() {
        const gallery = [
            { judul: 'Workshop HTML & CSS', deskripsi: 'Pelatihan dasar pemrograman web untuk anggota baru', kategori: 'workshop', image_url: 'images/workshop_html_css.png' },
            { judul: 'Workshop JavaScript', deskripsi: 'Deep dive JavaScript modern (ES6+)', kategori: 'workshop', src: 'images/image2.jpg' },
            { judul: 'Kompetisi Coding', deskripsi: 'Perlombaan coding antar anggota CORE IT', kategori: 'kompetisi', image_url: 'images/kompetisi_coding.png' },
            { judul: 'Team Building', deskripsi: 'Kegiatan mempererat hubungan antar anggota', kategori: 'kegiatan', image_url: 'images/team_building.png' },
            { judul: 'Proyek Website Kampus', deskripsi: 'Pengembangan website sistem informasi kampus', kategori: 'proyek', image_url: 'images/image1.jpeg' },
            { judul: 'Workshop React.js', deskripsi: 'Pelatihan framework React untuk frontend', kategori: 'workshop', image_url: 'images/workshop_react.png' },
        ];
        localStorage.setItem(this.prefix + 'gallery', JSON.stringify(gallery.map(g => ({ id: this.generateId(), timestamp: new Date().toISOString(), ...g }))));

        const testimonials = [
            { nama: 'Budi Santoso', jabatan: 'Anggota Aktif 2023', komentar: 'CORE IT mengubah cara pandang saya tentang pemrograman!', rating: 5 },
            { nama: 'Ani Wulandari', jabatan: 'Ketua Divisi Web Dev', komentar: 'Komunitas yang sangat supportive dan inspiratif.', rating: 5 },
            { nama: 'Dedi Kurniawan', jabatan: 'Alumni 2022', komentar: 'Berkat CORE IT, saya juara kompetisi coding nasional!', rating: 5 },
        ];
        localStorage.setItem(this.prefix + 'testimonials', JSON.stringify(testimonials.map(t => ({ id: this.generateId(), timestamp: new Date().toISOString(), ...t }))));
    }
}
const db = new CoreITDatabase();

/* ─── Dark Mode ─── */
const applyTheme = (dark) => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('coreit_theme', dark ? 'dark' : 'light');
};
const savedTheme = localStorage.getItem('coreit_theme');
applyTheme(savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches));

const toggleDark = () => applyTheme(!document.documentElement.classList.contains('dark'));
document.getElementById('dark-toggle').addEventListener('click', toggleDark);
document.getElementById('dark-toggle-mobile').addEventListener('click', toggleDark);

/* ─── Navbar Scroll ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('back-top').classList.toggle('show', window.scrollY > 400);
}, { passive: true });

/* ─── Mobile Menu ─── */
const menu = document.getElementById('mobile-menu');
const overlay = document.getElementById('menu-overlay');
const openMenu = () => { menu.classList.add('open'); overlay.classList.remove('hidden'); };
const closeMenu = () => { menu.classList.remove('open'); overlay.classList.add('hidden'); };
document.getElementById('menu-toggle').addEventListener('click', openMenu);
document.getElementById('menu-close').addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', closeMenu));

/* ─── Back to top ─── */
document.getElementById('back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── AOS (Scroll Reveal) ─── */
const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('aos-animate'); aosObserver.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

/* ─── Counter Animation ─── */
const animateCounter = (el, target) => {
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + '+';
        if (current >= target) clearInterval(interval);
    }, 40);
};
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target;
            animateCounter(el, parseInt(el.dataset.target));
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.counter-num').forEach(el => counterObserver.observe(el));

/* ─── Stars ─── */
const renderStars = (containerId, rating) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = Array.from({ length: 5 }, (_, i) =>
        `<i class="fas fa-star text-xs ${i < rating ? 'text-yellow-400 star-fill' : 'text-gray-300'}" style="animation-delay:${i * 0.08}s"></i>`
    ).join('');
};
renderStars('stars-0', 5);
renderStars('stars-1', 5);
renderStars('stars-2', 5);

/* ─── Testimonial Carousel ─── */
let testiIndex = 0;
const slides = document.querySelectorAll('.testimonial-slide');
const track = document.getElementById('testimonial-track');
const dotsEl = document.getElementById('testi-dots');
let testiTimer;

const goTo = (i) => {
    testiIndex = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${testiIndex * 100}%)`;
    document.querySelectorAll('.testi-dot').forEach((d, j) => {
        d.classList.toggle('bg-primary-500', j === testiIndex);
        d.classList.toggle('bg-gray-300', j !== testiIndex);
    });
};

slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = `testi-dot w-2.5 h-2.5 rounded-full transition ${i === 0 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'}`;
    dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsEl.appendChild(dot);
});

const resetTimer = () => { clearInterval(testiTimer); testiTimer = setInterval(() => goTo(testiIndex + 1), 5000); };
document.getElementById('prev-btn').addEventListener('click', () => { goTo(testiIndex - 1); resetTimer(); });
document.getElementById('next-btn').addEventListener('click', () => { goTo(testiIndex + 1); resetTimer(); });
resetTimer();

/* ─── Gallery ─── */
const galleryGrid = document.getElementById('gallery-grid');
const allItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
let activeFilteredList = [...allItems];

const filterGallery = (filter = 'all') => {
    activeFilteredList = [];
    allItems.forEach(item => {
        const category = item.dataset.category;
        if (filter === 'all' || category === filter) {
            item.classList.remove('hidden-item');
            activeFilteredList.push(item);
        } else {
            item.classList.add('hidden-item');
        }
    });

    // Update data-idx of visible items to match the current filtered list for lightbox navigation
    activeFilteredList.forEach((item, index) => {
        item.dataset.idx = index;
    });
};

// Bind click listener to each gallery item to open lightbox
allItems.forEach(item => {
    item.addEventListener('click', () => {
        const index = parseInt(item.dataset.idx);
        openLightbox(index, activeFilteredList);
    });
});

document.getElementById('gallery-filters').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active', 'bg-primary-500', 'text-white');
        b.classList.add('bg-gray-100', 'dark:bg-dark-surface', 'text-gray-600', 'dark:text-gray-400');
    });
    btn.classList.add('active', 'bg-primary-500', 'text-white');
    btn.classList.remove('bg-gray-100', 'dark:bg-dark-surface', 'text-gray-600', 'dark:text-gray-400');
    filterGallery(btn.dataset.filter);
});

// Style active filter btn
document.querySelectorAll('.filter-btn').forEach(btn => {
    if (btn.classList.contains('active')) {
        btn.classList.add('bg-primary-500', 'text-white');
    } else {
        btn.classList.add('bg-gray-100', 'dark:bg-dark-surface', 'text-gray-600', 'dark:text-gray-400');
    }
});

/* ─── Lightbox ─── */
let lightboxList = [];
let lightboxCurrent = 0;
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCaption = document.getElementById('lightbox-caption');

const openLightbox = (idx, list) => {
    lightboxList = list;
    lightboxCurrent = idx;
    const activeItem = list[idx];
    const imgEl = activeItem.querySelector('img');
    const titleEl = activeItem.querySelector('.text-white');
    const descEl = activeItem.querySelector('.text-gray-300');

    lbImg.src = imgEl.getAttribute('src');
    lbImg.alt = imgEl.getAttribute('alt');
    lbCaption.textContent = titleEl.textContent.trim() + ' — ' + descEl.textContent.trim();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
};

const closeLightbox = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

const updateLightboxContent = () => {
    const activeItem = lightboxList[lightboxCurrent];
    const imgEl = activeItem.querySelector('img');
    const titleEl = activeItem.querySelector('.text-white');
    const descEl = activeItem.querySelector('.text-gray-300');
    lbImg.src = imgEl.getAttribute('src');
    lbImg.alt = imgEl.getAttribute('alt');
    lbCaption.textContent = titleEl.textContent.trim() + ' — ' + descEl.textContent.trim();
};

document.getElementById('lightbox-prev').addEventListener('click', () => {
    lightboxCurrent = (lightboxCurrent - 1 + lightboxList.length) % lightboxList.length;
    updateLightboxContent();
});
document.getElementById('lightbox-next').addEventListener('click', () => {
    lightboxCurrent = (lightboxCurrent + 1) % lightboxList.length;
    updateLightboxContent();
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        if (lightbox.classList.contains('open')) closeLightbox();
        if (typeof progModal !== 'undefined' && progModal.classList.contains('open')) closeProgramModal();
    }
    if (lightbox.classList.contains('open')) {
        if (e.key === 'ArrowLeft') document.getElementById('lightbox-prev').click();
        if (e.key === 'ArrowRight') document.getElementById('lightbox-next').click();
    }
});

/* ─── Program Detail Modal ─── */
const programDetails = {
    web: {
        title: 'Web Development',
        icon: 'fa-code',
        colorClass: 'bg-primary-500',
        description: 'Pelatihan terstruktur untuk menguasai pembuatan aplikasi web modern dari dasar hingga mahir. Kamu akan belajar bagaimana membangun tampilan web responsif hingga mengelola database dan logika server (full-stack).',
        syllabus: [
            'Dasar HTML5, CSS3, & Responsive Web Design',
            'Pemrograman JavaScript Modern (ES6+)',
            'Frontend Development menggunakan React.js',
            'Backend API dengan Node.js & Express.js',
            'Integrasi Database NoSQL (MongoDB)',
            'Deployment Proyek Web ke Cloud Hosting'
        ],
        duration: '3 Bulan (24 Pertemuan @2 Jam)',
        schedule: 'Selasa & Kamis, 19:00 - 21:00 WIB',
        tools: ['VS Code', 'Git & GitHub', 'Chrome DevTools', 'Postman', 'Figma']
    },
    mobile: {
        title: 'Mobile App Development',
        icon: 'fa-mobile-screen-button',
        colorClass: 'bg-accent-purple',
        description: 'Mengembangkan aplikasi mobile cross-platform yang berkinerja tinggi untuk Android dan iOS. Fokus pembelajaran adalah membangun UI yang indah, manajemen state, akses native device API, hingga integrasi backend.',
        syllabus: [
            'Dasar Pemrograman Dart & ES6 JavaScript',
            'UI Layout & Widget Flutter / React Native',
            'Manajemen State (Provider, Redux, atau Context)',
            'Akses Fitur Perangkat (Kamera, GPS, Penyimpanan)',
            'Integrasi REST API & Autentikasi Pengguna',
            'Proses Build & Rilis ke Google Play & App Store'
        ],
        duration: '3 Bulan (24 Pertemuan @2 Jam)',
        schedule: 'Rabu & Jumat, 19:00 - 21:00 WIB',
        tools: ['Android Studio', 'VS Code', 'Git & GitHub', 'Flutter SDK', 'Xcode']
    },
    data: {
        title: 'Data Science & AI',
        icon: 'fa-brain',
        colorClass: 'bg-accent-green',
        description: 'Pelajari cara mengolah, menganalisis, dan mengekstraksi insight dari data dalam jumlah besar. Kamu juga akan diajarkan membuat model machine learning untuk memprediksi data serta memahami dasar-dasar Deep Learning.',
        syllabus: [
            'Dasar Pemrograman Python untuk Data Science',
            'Manipulasi Data dengan Pandas & NumPy',
            'Visualisasi Data (Matplotlib, Seaborn)',
            'Statistika Deskriptif & Inferensial Praktis',
            'Model Machine Learning (Regresi, Klasifikasi)',
            'Pengenalan Deep Learning & TensorFlow'
        ],
        duration: '2.5 Bulan (20 Pertemuan @2 Jam)',
        schedule: 'Senin & Rabu, 19:00 - 21:00 WIB',
        tools: ['Python', 'Jupyter Notebook', 'Google Colab', 'Pandas & NumPy', 'Scikit-Learn']
    },
    cyber: {
        title: 'Cybersecurity',
        icon: 'fa-shield-halved',
        colorClass: 'bg-red-500',
        description: 'Pelajari konsep keamanan siber, pertahanan jaringan, dan ethical hacking. Kamu akan memahami bagaimana penyerang mengeksploitasi sistem dan bagaimana cara mengamankan infrastruktur TI secara menyeluruh.',
        syllabus: [
            'Dasar Jaringan Komputer, Protokol & Kriptografi',
            'Pencarian Kerentanan (Information Gathering)',
            'Network Penetration Testing (Nmap, Wireshark)',
            'Web Application Security (OWASP Top 10)',
            'Praktik System Hacking & Privilege Escalation',
            'Defensive Security & Penanganan Insiden Keamanan'
        ],
        duration: '2 Bulan (16 Pertemuan @3 Jam)',
        schedule: 'Sabtu, 09:00 - 12:00 & 13:00 - 16:00 WIB',
        tools: ['Kali Linux', 'Wireshark', 'Burp Suite', 'Nmap', 'Metasploit']
    },
    uiux: {
        title: 'UI/UX Design',
        icon: 'fa-pen-ruler',
        colorClass: 'bg-pink-500',
        description: 'Pelajari proses merancang desain digital yang berpusat pada pengguna (User-Centered Design). Mulai dari memahami kebutuhan pengguna melalui riset, wireframing, pembuatan visual UI, hingga pengujian kegunaan produk.',
        syllabus: [
            'Pengenalan Design Thinking & User Research',
            'Pembuatan User Persona & Customer Journey',
            'Information Architecture & Wireframing',
            'Visual Design & Design System (Color, Typography)',
            'High-Fidelity Prototyping & Micro-interactions',
            'Usability Testing & Handover File Desain'
        ],
        duration: '2 Bulan (16 Pertemuan @2 Jam)',
        schedule: 'Jumat, 19:00-21:00 & Sabtu, 13:00-15:00 WIB',
        tools: ['Figma', 'FigJam', 'Miro', 'Whimsical', 'Adobe XD']
    }
};

const progModal = document.getElementById('program-modal');
const modalHeader = document.getElementById('modal-header');
const modalIcon = document.getElementById('modal-icon');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-desc');
const modalSyllabus = document.getElementById('modal-syllabus');
const modalDuration = document.getElementById('modal-duration');
const modalSchedule = document.getElementById('modal-schedule');
const modalTools = document.getElementById('modal-tools');
const modalRegisterBtn = document.getElementById('modal-register-btn');

let currentActiveProgram = '';

const openProgramModal = (key) => {
    const data = programDetails[key];
    if (!data) return;

    currentActiveProgram = data.title;

    // Set Header Color Class and Reset previous color classes
    modalHeader.className = `px-6 py-5 text-white flex items-center justify-between relative transition-colors duration-300 ${data.colorClass}`;

    // Set Icon
    modalIcon.className = `fas ${data.icon}`;

    // Set Title & Description
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;

    // Set Syllabus
    modalSyllabus.innerHTML = data.syllabus.map(item => `
    <li class="flex items-start gap-2">
      <i class="fas fa-circle-check text-green-500 mt-0.5 flex-shrink-0"></i>
      <span>${item}</span>
    </li>
  `).join('');

    // Set Duration & Schedule
    modalDuration.textContent = data.duration;
    modalSchedule.textContent = data.schedule;

    // Set Tools
    modalTools.innerHTML = data.tools.map(tool => `
    <span class="text-xs bg-gray-100 dark:bg-dark-bg text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-dark-border font-medium">${tool}</span>
  `).join('');

    // Open modal with transitions
    progModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Reflow
    progModal.offsetHeight;
    progModal.classList.add('open');
};

const closeProgramModal = () => {
    progModal.classList.remove('open');
    setTimeout(() => {
        if (!progModal.classList.contains('open')) {
            progModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }, 300);
};

// Event Listeners
document.querySelectorAll('.service-card[data-program]').forEach(card => {
    card.addEventListener('click', () => {
        const key = card.dataset.program;
        openProgramModal(key);
    });
});

document.getElementById('modal-close').addEventListener('click', closeProgramModal);
document.getElementById('program-modal-backdrop').addEventListener('click', closeProgramModal);

// Registration Integration
modalRegisterBtn.addEventListener('click', () => {
    closeProgramModal();

    // Scroll to form
    const contactSec = document.getElementById('contact');
    if (contactSec) {
        contactSec.scrollIntoView({ behavior: 'smooth' });

        // Check registration option
        const checkbox = document.getElementById('daftar-anggota');
        if (checkbox) {
            checkbox.checked = true;
        }

        // Populate message
        const pesanInput = document.getElementById('pesan');
        if (pesanInput) {
            pesanInput.value = `Halo, saya tertarik bergabung dan ingin mendaftar untuk Program Pelatihan ${currentActiveProgram}.`;
            // Trigger input event to clear validation error & update counter
            pesanInput.dispatchEvent(new Event('input'));
        }

        // Focus on Name
        const nameInput = document.getElementById('nama');
        if (nameInput) {
            setTimeout(() => nameInput.focus(), 800);
        }
    }
});

/* ─── FAQ ─── */
const faqs = [
    { q: 'Siapa yang bisa bergabung dengan CORE IT?', a: 'Seluruh mahasiswa aktif Global Institute yang memiliki minat di bidang teknologi informasi, tanpa memandang jurusan atau tingkat pengalaman.' },
    { q: 'Apakah ada biaya untuk bergabung?', a: 'Pendaftaran anggota CORE IT tidak dikenakan biaya apapun. Beberapa program pelatihan khusus mungkin memiliki biaya operasional yang sangat terjangkau.' },
    { q: 'Kapan jadwal workshop dan kegiatan?', a: 'Workshop dan kegiatan diadakan secara rutin setiap bulan. Jadwal lengkap akan diumumkan melalui Instagram @coreit_global dan grup anggota.' },
    { q: 'Apa manfaat menjadi anggota CORE IT?', a: 'Anggota mendapatkan akses ke workshop, proyek kolaboratif, jaringan alumni, sertifikat kegiatan, bimbingan mentor berpengalaman, dan kesempatan mengikuti kompetisi teknologi.' },
    { q: 'Bagaimana cara mendaftar sebagai anggota?', a: 'Kamu bisa mendaftar melalui form kontak di halaman ini dengan mencentang opsi "Saya ingin mendaftar sebagai anggota baru". Tim kami akan menghubungi kamu segera.' },
];

const faqList = document.getElementById('faq-list');
faqs.forEach((faq, i) => {
    const item = document.createElement('div');
    item.className = 'faq-item bg-white dark:bg-dark-surface rounded-xl border border-gray-100 dark:border-dark-border overflow-hidden';
    item.innerHTML = `
    <button class="w-full text-left px-5 py-4 flex items-center gap-4 font-medium text-gray-800 dark:text-white text-sm hover:text-primary-500 transition"
      aria-expanded="false" aria-controls="faq-ans-${i}" id="faq-btn-${i}">
      <span class="w-7 h-7 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-500 font-heading font-bold text-xs flex-shrink-0">0${i + 1}</span>
      <span class="flex-1">${faq.q}</span>
      <i class="faq-toggle-icon fas fa-plus text-xs text-gray-400 flex-shrink-0"></i>
    </button>
    <div class="faq-answer px-5 text-gray-500 dark:text-gray-400 text-sm leading-relaxed" id="faq-ans-${i}">
      <div class="pb-4 pl-11">${faq.a}</div>
    </div>
  `;
    item.querySelector('button').addEventListener('click', function () {
        const ans = document.getElementById(`faq-ans-${i}`);
        const isOpen = ans.classList.contains('open');
        // Close all
        document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
        document.querySelectorAll('#faq-list button').forEach(b => b.setAttribute('aria-expanded', 'false'));
        // Toggle current
        if (!isOpen) {
            item.classList.add('active');
            ans.classList.add('open');
            this.setAttribute('aria-expanded', 'true');
        }
    });
    faqList.appendChild(item);
});

/* ─── Form Validation & Submit ─── */
const validators = {
    nama: { test: v => v.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(v), msg: 'Nama minimal 3 karakter, hanya boleh huruf dan spasi' },
    email: { test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Format email tidak valid' },
    pesan: { test: v => v.trim().length >= 10 && v.trim().length <= 500, msg: 'Pesan minimal 10 karakter, maksimal 500 karakter' },
};

const showError = (id, msg) => {
    const el = document.getElementById(id + '-error');
    const input = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
    if (input) input.classList.add('border-red-400');
};
const clearError = (id) => {
    const el = document.getElementById(id + '-error');
    const input = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('hidden'); }
    if (input) input.classList.remove('border-red-400');
};

// Real-time validation
['nama', 'email', 'pesan'].forEach(field => {
    const el = document.getElementById(field);
    if (!el) return;
    el.addEventListener('input', () => {
        if (validators[field].test(el.value)) clearError(field);
        else if (el.value.length > 0) showError(field, validators[field].msg);
        if (field === 'pesan') {
            document.getElementById('pesan-counter').textContent = `${el.value.length} / 500`;
        }
    });
    el.addEventListener('blur', () => {
        if (!validators[field].test(el.value)) showError(field, validators[field].msg);
    });
});

document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;
    ['nama', 'email', 'pesan'].forEach(field => {
        const el = document.getElementById(field);
        if (!validators[field].test(el.value)) { showError(field, validators[field].msg); valid = false; }
        else clearError(field);
    });
    if (!valid) return;

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Mengirim...</span>';

    setTimeout(() => {
        const data = {
            nama: document.getElementById('nama').value.trim(),
            email: document.getElementById('email').value.trim(),
            pesan: document.getElementById('pesan').value.trim(),
            daftar_anggota: document.getElementById('daftar-anggota').checked,
            status: 'unread'
        };
        db.create('contacts', data);
        this.reset();
        document.getElementById('pesan-counter').textContent = '0 / 500';
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-paper-plane"></i><span>Kirim Pesan</span>';
        showToast('Pesan Terkirim! 🎉', 'Terima kasih, kami akan segera menghubungi kamu.');
    }, 1000);
});

/* ─── Toast ─── */
let toastTimer;
const showToast = (title, msg, type = 'success') => {
    document.getElementById('toast-title').textContent = title;
    document.getElementById('toast-msg').textContent = msg;
    const toast = document.getElementById('toast');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 4500);
};
function hideToast() {
    document.getElementById('toast').classList.remove('show');
}

/* ─── Particles ─── */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
};
window.addEventListener('resize', resize, { passive: true });
resize();

const createParticles = () => {
    particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
    }));
};
createParticles();

const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.fill();
    });
    // Draw lines between close particles
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(255,255,255,${0.1 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawParticles);
};
drawParticles();

/* ─── VS Code Typing & Compiler Animation ─── */
const editorFilesData = {
    'coreit.js': [
        { text: 'const coreIT = new CORE_IT();', tokens: [['const', 'text-indigo-400'], [' coreIT', 'text-blue-400'], [' = ', 'text-gray-500'], ['new', 'text-indigo-400'], [' CORE_IT', 'text-emerald-400'], ['();', 'text-gray-500']] },
        { text: 'coreIT.on(\'join\', (member) => {', tokens: [['coreIT', 'text-blue-400'], ['.on', 'text-yellow-400'], ['(', 'text-gray-500'], ['\'join\'', 'text-amber-500'], [', ', 'text-gray-500'], ['(', 'text-gray-500'], ['member', 'text-orange-400'], [') => {', 'text-indigo-400']] },
        { text: '  member.learn([\'Coding\', \'Design\']);', tokens: [['  member', 'text-blue-400'], ['.learn', 'text-yellow-400'], ['([', 'text-gray-500'], ['\'Coding\'', 'text-amber-500'], [', ', 'text-gray-500'], ['\'Design\'', 'text-amber-500'], [']);', 'text-gray-500']] },
        { text: '  member.collaborate();', tokens: [['  member', 'text-blue-400'], ['.collaborate', 'text-yellow-400'], ['();', 'text-gray-500']] },
        { text: '});', tokens: [['});', 'text-indigo-400']] },
        { text: 'coreIT.buildFuture();', tokens: [['coreIT', 'text-blue-400'], ['.buildFuture', 'text-yellow-400'], ['();', 'text-gray-500']] }
    ],
    'style.css': [
        { text: '.core-it-member {', tokens: [['.core-it-member', 'text-yellow-400'], [' {', 'text-gray-500']] },
        { text: '  skills: coding & design;', tokens: [['  skills', 'text-cyan-400'], [': ', 'text-gray-500'], ['coding & design', 'text-amber-200'], [';', 'text-gray-500']] },
        { text: '  growth: exponential;', tokens: [['  growth', 'text-cyan-400'], [': ', 'text-gray-500'], ['exponential', 'text-amber-200'], [';', 'text-gray-500']] },
        { text: '  animation: float 2s infinite;', tokens: [['  animation', 'text-cyan-400'], [': ', 'text-gray-500'], ['float 2s infinite', 'text-amber-200'], [';', 'text-gray-500']] },
        { text: '}', tokens: [['}', 'text-gray-500']] }
    ],
    'about.html': [
        { text: '<section class="core-it">', tokens: [['<', 'text-gray-500'], ['section', 'text-pink-400'], [' class', 'text-orange-400'], ['="', 'text-gray-500'], ['core-it', 'text-amber-500'], ['">', 'text-gray-500']] },
        { text: '  <h1>Membangun Masa Depan</h1>', tokens: [['  <', 'text-gray-500'], ['h1', 'text-pink-400'], ['>', 'text-gray-500'], ['Membangun Masa Depan', 'text-gray-200'], ['</', 'text-gray-500'], ['h1', 'text-pink-400'], ['>', 'text-gray-500']] },
        { text: '  <p>Community of Research & Engineering</p>', tokens: [['  <', 'text-gray-500'], ['p', 'text-pink-400'], ['>', 'text-gray-500'], ['Community of Research & Engineering', 'text-gray-200'], ['</', 'text-gray-500'], ['p', 'text-pink-400'], ['>', 'text-gray-500']] },
        { text: '</section>', tokens: [['</', 'text-gray-500'], ['section', 'text-pink-400'], ['>', 'text-gray-500']] }
    ]
};

let currentFile = 'coreit.js';
let typingTimer = null;
let autoCycleTimer = null;
let isTyping = false;

// DOM Elements
const codeArea = document.getElementById('code-editor-area');
const terminalArea = document.getElementById('terminal-content');
const fileTitle = document.getElementById('window-title-file');
const sidebarFileIcon = document.getElementById('sidebar-file-icon');
const tabs = document.querySelectorAll('.editor-tab');
const runBtn = document.getElementById('run-code-btn');

const getFileIconClass = (file) => {
    if (file.endsWith('.js')) return 'fab fa-js text-yellow-500';
    if (file.endsWith('.css')) return 'fab fa-css3-alt text-blue-400';
    if (file.endsWith('.html')) return 'fab fa-html5 text-orange-500';
    return 'fas fa-file';
};

const switchTab = (fileKey) => {
    if (currentFile === fileKey && isTyping) return;
    
    // Clear existing animations
    clearTimeout(typingTimer);
    clearTimeout(autoCycleTimer);
    isTyping = false;
    
    currentFile = fileKey;
    
    // Update tabs UI
    tabs.forEach(tab => {
        const isCurrent = tab.dataset.file === fileKey;
        tab.classList.toggle('active', isCurrent);
        tab.classList.toggle('bg-[#0d1117]', isCurrent);
        tab.classList.toggle('text-gray-300', isCurrent);
        tab.classList.toggle('text-gray-500', !isCurrent);
        tab.classList.toggle('bg-transparent', !isCurrent);
    });
    
    // Update title
    if (fileTitle) {
        fileTitle.textContent = fileKey;
        const fileIcon = fileTitle.previousElementSibling;
        if (fileIcon) {
            fileIcon.className = getFileIconClass(fileKey);
        }
    }
    
    // Update sidebar icon
    if (sidebarFileIcon) {
        sidebarFileIcon.className = getFileIconClass(fileKey);
    }
    
    startTypingAnimation(fileKey);
};

const startTypingAnimation = (fileKey) => {
    if (!codeArea) return;
    isTyping = true;
    codeArea.innerHTML = '';
    
    const lines = editorFilesData[fileKey];
    let lineIndex = 0;
    let tokenIndex = 0;
    let charIndex = 0;
    
    // Create cursor element
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    
    const appendNewLine = (index) => {
        const lineDiv = document.createElement('div');
        lineDiv.className = 'flex gap-4';
        
        const lineNum = document.createElement('span');
        lineNum.className = 'text-gray-600 select-none w-3 text-right';
        lineNum.textContent = index + 1;
        
        const lineContent = document.createElement('span');
        lineContent.className = 'line-content';
        
        lineDiv.appendChild(lineNum);
        lineDiv.appendChild(lineContent);
        codeArea.appendChild(lineDiv);
        
        codeArea.scrollTop = codeArea.scrollHeight;
        return lineContent;
    };
    
    let currentLineContent = appendNewLine(0);
    
    const typeChar = () => {
        if (!isTyping) return;
        
        if (lineIndex >= lines.length) {
            // Finished typing all lines
            isTyping = false;
            // Remove cursor from DOM
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
            // Run terminal simulation
            runTerminalSimulation(fileKey);
            return;
        }
        
        const currentLine = lines[lineIndex];
        const tokens = currentLine.tokens;
        
        if (tokenIndex >= tokens.length) {
            // Move to next line
            lineIndex++;
            tokenIndex = 0;
            charIndex = 0;
            if (lineIndex < lines.length) {
                currentLineContent = appendNewLine(lineIndex);
                typingTimer = setTimeout(typeChar, 150); // delay before next line
            } else {
                typeChar(); // trigger finish
            }
            return;
        }
        
        const currentToken = tokens[tokenIndex];
        const tokenText = currentToken[0];
        const tokenClass = currentToken[1];
        
        // Find or create span for the token
        let tokenSpan = currentLineContent.querySelector(`.t-${tokenIndex}`);
        if (!tokenSpan) {
            tokenSpan = document.createElement('span');
            tokenSpan.className = `t-${tokenIndex} ${tokenClass}`;
            currentLineContent.appendChild(tokenSpan);
        }
        
        // Append one character
        tokenSpan.textContent += tokenText[charIndex];
        
        // Move cursor next to tokenSpan
        currentLineContent.appendChild(cursor);
        
        charIndex++;
        
        if (charIndex >= tokenText.length) {
            tokenIndex++;
            charIndex = 0;
        }
        
        // Random typing speed variation
        const speed = Math.random() * 30 + 15;
        typingTimer = setTimeout(typeChar, speed);
    };
    
    typingTimer = setTimeout(typeChar, 100);
};

const runTerminalSimulation = (fileKey) => {
    if (!terminalArea) return;
    terminalArea.innerHTML = '';
    
    let logs = [];
    if (fileKey === 'coreit.js') {
        logs = [
            { text: '➜ ~/core-it node coreit.js', type: 'command' },
            { text: '[INFO] Initializing CORE IT System...', type: 'log', delay: 400 },
            { text: '[INFO] Loading Coding & Design modules...', type: 'log', delay: 300 },
            { text: '✔ Compile successful!', type: 'success', delay: 300 },
            { text: '✔ Server running at http://localhost:3000', type: 'success', delay: 200 }
        ];
    } else if (fileKey === 'style.css') {
        logs = [
            { text: '➜ ~/core-it npm run build:css', type: 'command' },
            { text: '> tailwindcss -i ./style.css -o ./dist/style.css --minify', type: 'log', delay: 400 },
            { text: '✔ CSS compiled successfully in 32ms', type: 'success', delay: 300 },
            { text: '✔ Output size: 2.4 KB (saved 65%)', type: 'success', delay: 100 }
        ];
    } else if (fileKey === 'about.html') {
        logs = [
            { text: '➜ ~/core-it npx live-server --port=5500', type: 'command' },
            { text: '[live-server] Serving "." at http://127.0.0.1:5500', type: 'log', delay: 400 },
            { text: '[live-server] Watching for file changes...', type: 'log', delay: 200 },
            { text: '✔ Browser connected successfully!', type: 'success', delay: 300 }
        ];
    }
    
    let logIndex = 0;
    const printLog = () => {
        if (!terminalArea) return;
        if (logIndex >= logs.length) {
            // Auto schedule next file
            const files = Object.keys(editorFilesData);
            const nextIdx = (files.indexOf(fileKey) + 1) % files.length;
            autoCycleTimer = setTimeout(() => {
                switchTab(files[nextIdx]);
            }, 5000); // Wait 5s before switching
            return;
        }
        
        const log = logs[logIndex];
        const line = document.createElement('div');
        
        if (log.type === 'command') {
            line.className = 'flex gap-1.5';
            line.innerHTML = `<span class="text-green-500">➜</span><span class="text-blue-400">~/core-it</span><span class="text-gray-300">${log.text.substring(12)}</span>`;
        } else if (log.type === 'success') {
            line.className = 'text-emerald-400 flex items-center gap-1.5';
            line.innerHTML = `<span>${log.text}</span>`;
        } else {
            line.className = 'text-gray-500';
            line.textContent = log.text;
        }
        
        terminalArea.appendChild(line);
        logIndex++;
        
        const nextDelay = logs[logIndex] ? (logs[logIndex].delay || 200) : 200;
        autoCycleTimer = setTimeout(printLog, nextDelay);
    };
    
    printLog();
};

// Bind click listeners to tabs
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        switchTab(tab.dataset.file);
    });
});

// Run Code button
if (runBtn) {
    runBtn.addEventListener('click', () => {
        // Complete code typing instantly
        if (isTyping) {
            clearTimeout(typingTimer);
            isTyping = false;
            codeArea.innerHTML = '';
            
            const lines = editorFilesData[currentFile];
            lines.forEach((line, idx) => {
                const lineDiv = document.createElement('div');
                lineDiv.className = 'flex gap-4';
                
                const lineNum = document.createElement('span');
                lineNum.className = 'text-gray-600 select-none w-3 text-right';
                lineNum.textContent = idx + 1;
                
                const lineContent = document.createElement('span');
                lineContent.className = 'line-content';
                
                line.tokens.forEach(tok => {
                    const span = document.createElement('span');
                    span.className = tok[1];
                    span.textContent = tok[0];
                    lineContent.appendChild(span);
                });
                
                lineDiv.appendChild(lineNum);
                lineDiv.appendChild(lineContent);
                codeArea.appendChild(lineDiv);
            });
            codeArea.scrollTop = codeArea.scrollHeight;
        }
        
        // Execute compilation simulation immediately
        clearTimeout(autoCycleTimer);
        runTerminalSimulation(currentFile);
        
        // Flash Run button feedback
        runBtn.classList.add('text-yellow-400');
        setTimeout(() => runBtn.classList.remove('text-yellow-400'), 500);
    });
}

// Badge controls
const badgeWeb = document.getElementById('badge-web');
const badgeCyber = document.getElementById('badge-cyber');
const badgeUiux = document.getElementById('badge-uiux');
const editorWindow = document.getElementById('editor-window');

if (badgeWeb) {
    badgeWeb.addEventListener('click', () => {
        switchTab('coreit.js');
    });
}

if (badgeCyber) {
    badgeCyber.addEventListener('click', () => {
        clearTimeout(typingTimer);
        clearTimeout(autoCycleTimer);
        isTyping = false;
        
        if (!terminalArea) return;
        
        // Switch terminal to Retro green scan
        terminalArea.innerHTML = '';
        const commandLine = document.createElement('div');
        commandLine.className = 'flex gap-1.5';
        commandLine.innerHTML = `<span class="text-green-500">➜</span><span class="text-blue-400">~/core-it</span><span class="text-gray-300">nmap -sS -O 192.168.1.100</span>`;
        terminalArea.appendChild(commandLine);
        
        const cyberLogs = [
            'Starting Nmap 7.92 ( https://nmap.org ) at 2026-06-16 14:38',
            'Nmap scan report for coreit-secure.local (192.168.1.100)',
            'Host is up (0.00052s latency).',
            'PORT     STATE SERVICE',
            '80/tcp   open  http',
            '443/tcp  open  https',
            '22/tcp   closed ssh',
            '✔ Security check passed! No open vulnerabilities found.'
        ];
        
        let cIdx = 0;
        const printCyberLog = () => {
            if (cIdx >= cyberLogs.length) return;
            const logLine = document.createElement('div');
            if (cyberLogs[cIdx].startsWith('✔')) {
                logLine.className = 'text-emerald-400 font-bold';
            } else if (cyberLogs[cIdx].includes('open')) {
                logLine.className = 'text-green-500 font-mono';
            } else {
                logLine.className = 'text-gray-400 font-mono';
            }
            logLine.textContent = cyberLogs[cIdx];
            terminalArea.appendChild(logLine);
            cIdx++;
            setTimeout(printCyberLog, 250);
        };
        setTimeout(printCyberLog, 400);
    });
}

if (badgeUiux) {
    badgeUiux.addEventListener('click', () => {
        switchTab('style.css');
        
        // Neon Glow Shift effect on the editor window
        if (editorWindow) {
            editorWindow.classList.add('neon-glow-active');
            setTimeout(() => {
                editorWindow.classList.remove('neon-glow-active');
            }, 6000);
        }
    });
}

// Start simulation on load
const initSimulation = () => {
    setTimeout(() => {
        startTypingAnimation('coreit.js');
    }, 1500);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulation);
} else {
    initSimulation();
}

/* ─── Prefers reduced motion ─── */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.float-anim, .orbit-ring, .orbit-ring-r').forEach(el => {
        el.style.animation = 'none';
    });
}