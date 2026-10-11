

tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                serifTitle: ['Cinzel', 'serif'],
                serifSubtitle: ['Playfair Display', 'serif'],
                sans: ['Plus Jakarta Sans', 'sans-serif'],
                arabic: ['Amiri', 'serif']
            },
            colors: {
                glass: {
                    bg: 'rgba(255, 255, 255, 0.12)',
                    border: 'rgba(255, 255, 255, 0.22)',
                    darkBg: 'rgba(18, 18, 20, 0.65)',
                    darkBorder: 'rgba(255, 255, 255, 0.12)'
                },
                neutral: {
                    50: '#FAF9F6',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                    950: '#0B0F17'
                }
            }
        }
    }
};
/* ========================================
   JAVASCRIPT READY
   ======================================== */

document.documentElement.classList.add('js-enabled');


/* ========================================
   SUPABASE CONFIGURATION
   ======================================== */

const SUPABASE_URL = 'https://YOUR_SUPABASE_URL.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

let supabaseClient = null;

try {
    if (
        window.supabase &&
        SUPABASE_URL !== 'https://YOUR_SUPABASE_URL.supabase.co' &&
        SUPABASE_KEY !== 'YOUR_SUPABASE_ANON_KEY'
    ) {
        supabaseClient = window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
    }
} catch (error) {
    console.error('Supabase initialization failed:', error);
}


/* ========================================
   GUEST NAME FROM URL
   Contoh: index.html?to=Budi+Santoso
   ======================================== */

const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || urlParams.get('n');
const guestNameDisplay = document.getElementById('guestNameDisplay');

if (guestName && guestNameDisplay) {
    guestNameDisplay.textContent = guestName;
}


/* ========================================
   MUSIC PLAYER
   ======================================== */

const music = document.getElementById('weddingMusic');
const audioToggle = document.getElementById('audioToggle');
const audioIcon = document.getElementById('audioIcon');

let isPlaying = false;

function updateAudioIcon(playing) {
    if (!audioIcon) return;

    audioIcon.className = playing
        ? 'fa-solid fa-music'
        : 'fa-solid fa-volume-xmark';
}

if (music) {
    music.addEventListener('play', () => {
        isPlaying = true;
        updateAudioIcon(true);
    });

    music.addEventListener('pause', () => {
        isPlaying = false;
        updateAudioIcon(false);
    });
}

window.openInvitation = function () {
    const gate = document.getElementById('coverGate');
    const main = document.getElementById('mainContent');

    if (!gate || !main) {
        console.error('Elemen coverGate atau mainContent tidak ditemukan.');
        return;
    }

    // Putar musik setelah interaksi pengguna.
    if (music) {
        music.play().catch(error => {
            console.warn('Musik belum dapat diputar:', error);
        });
    }

    if (audioToggle) {
        audioToggle.classList.remove('hidden');
    }

    // Mulai transisi cover.
    gate.classList.add('opacity-0', 'pointer-events-none');

    // Tampilkan halaman utama setelah transisi cover.
    window.setTimeout(() => {
        gate.style.display = 'none';

        main.classList.remove('hidden');

        // Memastikan browser menerapkan status hidden terlebih dahulu.
        void main.offsetHeight;

        window.requestAnimationFrame(() => {
            main.classList.remove('opacity-0');
        });
    }, 1000);
};

window.toggleAudio = async function () {
    if (!music) return;

    if (!music.paused) {
        music.pause();
        return;
    }

    try {
        await music.play();
    } catch (error) {
        console.error('Gagal memutar audio:', error);
        showToast('Musik belum dapat diputar.');
    }
};


/* ========================================
   WEDDING COUNTDOWN
   ======================================== */

// Waktu lokal Indonesia Barat (WIB).
const weddingDate = new Date('2028-11-18T08:00:00+07:00').getTime();

function updateCountdown() {
    const distance = weddingDate - Date.now();

    const days = document.getElementById('days');
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');

    if (distance <= 0) {
        if (days) days.textContent = '00';
        if (hours) hours.textContent = '00';
        if (minutes) minutes.textContent = '00';
        if (seconds) seconds.textContent = '00';
        return;
    }

    if (days) {
        days.textContent = String(
            Math.floor(distance / (1000 * 60 * 60 * 24))
        ).padStart(2, '0');
    }

    if (hours) {
        hours.textContent = String(
            Math.floor(
                (distance % (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
            )
        ).padStart(2, '0');
    }

    if (minutes) {
        minutes.textContent = String(
            Math.floor(
                (distance % (1000 * 60 * 60)) /
                (1000 * 60)
            )
        ).padStart(2, '0');
    }

    if (seconds) {
        seconds.textContent = String(
            Math.floor(
                (distance % (1000 * 60)) / 1000
            )
        ).padStart(2, '0');
    }
}

updateCountdown();
window.setInterval(updateCountdown, 1000);


/* ========================================
   TOAST NOTIFICATION
   ======================================== */

function showToast(message) {
    const toast = document.getElementById('toast');

    if (!toast) return;

    toast.textContent = message;
    toast.classList.remove('opacity-0');

    window.setTimeout(() => {
        toast.classList.add('opacity-0');
    }, 3000);
}


/* ========================================
   COPY TO CLIPBOARD
   ======================================== */

window.copyToClipboard = async function (text, bankName) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback untuk lingkungan yang tidak mendukung Clipboard API.
            const input = document.createElement('textarea');

            input.value = text;
            input.style.position = 'fixed';
            input.style.opacity = '0';

            document.body.appendChild(input);
            input.select();

            const copied = document.execCommand('copy');
            input.remove();

            if (!copied) {
                throw new Error('Clipboard tidak tersedia.');
            }
        }

        showToast(`Nomor rekening ${bankName} berhasil disalin!`);
    } catch (error) {
        console.error('Gagal menyalin teks:', error);
        showToast('Gagal menyalin nomor rekening.');
    }
};


/* ========================================
   SUBMIT UCAPAN
   Local list + optional Supabase
   ======================================== */

const formUcapan = document.getElementById('formUcapan');

if (formUcapan) {
    formUcapan.addEventListener('submit', async function (event) {
        event.preventDefault();

        const namaInput = document.getElementById('namaTamu');
        const statusInput = document.getElementById('statusKehadiran');
        const pesanInput = document.getElementById('pesanUcapan');
        const list = document.getElementById('daftarUcapan');

        if (!namaInput || !statusInput || !pesanInput || !list) {
            console.error('Elemen form ucapan tidak lengkap.');
            return;
        }

        const nama = namaInput.value.trim();
        const status = statusInput.value;
        const pesan = pesanInput.value.trim();

        if (!nama || !pesan) return;

        // Buat elemen secara aman tanpa memasukkan input sebagai HTML.
        const card = document.createElement('div');
        card.className =
            'ios-glass-dark p-4 rounded-2xl space-y-1 transition-all';

        const header = document.createElement('div');
        header.className = 'flex justify-between items-center gap-3';

        const nameElement = document.createElement('span');
        nameElement.className = 'text-xs font-semibold text-white';
        nameElement.textContent = nama;

        const statusElement = document.createElement('span');
        statusElement.className =
            'text-[10px] px-2 py-0.5 rounded-full ios-glass text-neutral-300';
        statusElement.textContent = status;

        const messageElement = document.createElement('p');
        messageElement.className = 'text-xs text-neutral-300 font-light';
        messageElement.textContent = `"${pesan}"`;

        header.append(nameElement, statusElement);
        card.append(header, messageElement);

        // Tampilkan ucapan terlebih dahulu.
        list.prepend(card);

        if (supabaseClient) {
            try {
                const { error } = await supabaseClient
                    .from('ucapan')
                    .insert([{ nama, status, pesan }]);

                if (error) throw error;
            } catch (error) {
                console.error(
                    'Gagal menyimpan ucapan ke Supabase:',
                    error
                );

                showToast(
                    'Ucapan tampil, tetapi gagal disimpan ke server.'
                );

                this.reset();
                return;
            }
        }

        this.reset();
        showToast('Terima kasih atas ucapan dan doa Anda!');
    });
}


/* ========================================
   SCROLL REVEAL OBSERVER
   ======================================== */

function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal');

    if (!elements.length) return;

    // Fallback jika IntersectionObserver tidak didukung.
    if (!('IntersectionObserver' in window)) {
        elements.forEach(element => {
            element.classList.add('is-visible');
        });

        return;
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // Animasi berjalan satu kali untuk setiap elemen.
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px',
        }
    );

    elements.forEach(element => {
        observer.observe(element);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener(
        'DOMContentLoaded',
        initScrollReveal,
        { once: true }
    );
} else {
    initScrollReveal();
}