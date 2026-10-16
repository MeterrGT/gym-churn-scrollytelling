/**
 * METEHAN GEZER - KİŞİSEL PORTFOLYO ETKİLEŞİM MOTORU
 * Özellikler: Arka Plan Parçacık Ağı (Canvas), Daktilo Yazma Efekti, Mobil Menü, Form Doğrulama
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Konsol Karşılama Mesajı ---
    console.log(
        "%c[Metehan Gezer // Portfolyo] %cManisa Celal Bayar Üniversitesi Büyük Veri Analistliği",
        "color: #C77DFF; font-weight: bold; font-size: 13px;",
        "color: #94A3B8; font-size: 12px;"
    );

    // --- 2. Arka Plan Parçacık Ağı (Canvas) ---
    const canvas = document.getElementById('cyber-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const particles = [];
        const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);
        const connectionDistance = 110;
        let mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                if (mouse.x !== null && mouse.y !== null) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        const force = (mouse.radius - distance) / mouse.radius;
                        this.x -= (dx / distance) * force * 2;
                        this.y -= (dy / distance) * force * 2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(199, 125, 255, 0.7)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        const alpha = 1 - (distance / connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(157, 78, 221, ${alpha * 0.25})`;
                        ctx.lineWidth = 0.75;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        };

        animate();
    }

    // --- 3. Daktilo (Typing) Efekti ---
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const textToType = "Büyük Veri Analistliği Öğrencisi | Veri Tutkunu";
        let charIndex = 0;
        let isDeleting = false;
        const typingSpeed = 65;
        const pauseDelay = 2600;

        const typeLoop = () => {
            if (!isDeleting) {
                typingElement.textContent = textToType.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === textToType.length) {
                    isDeleting = true;
                    setTimeout(typeLoop, pauseDelay);
                    return;
                }
            } else {
                typingElement.textContent = textToType.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                }
            }

            const speed = isDeleting ? 30 : typingSpeed;
            setTimeout(typeLoop, speed);
        };

        typeLoop();
    }

    // --- 4. Mobil Menü ---
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    }

    // --- 5. Aktif Menü Takibi (Scrollspy) ---
    const sections = document.querySelectorAll('section[id]');
    const updateActiveNav = () => {
        const scrollPos = window.scrollY + 200;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.nav-link[href*="${id}"]`);

            if (link && scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav);

    // --- 6. Form Doğrulama ve Simülasyonu ---
    const contactForm = document.getElementById('contact-form');
    const formAlert = document.getElementById('form-alert');
    const formBtn = document.getElementById('form-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
                alert('Lütfen formdaki tüm alanları doldurunuz.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value.trim())) {
                alert('Lütfen geçerli bir e-posta adresi yazınız.');
                email.focus();
                return;
            }

            const originalBtnHTML = formBtn.innerHTML;
            formBtn.disabled = true;
            formBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>İletiliyor...</span>`;

            setTimeout(() => {
                formBtn.disabled = false;
                formBtn.innerHTML = originalBtnHTML;

                formAlert.classList.remove('hidden');
                contactForm.reset();

                setTimeout(() => {
                    formAlert.classList.add('hidden');
                }, 5000);
            }, 1000);
        });
    }

    // ==========================================================================
    // 7. GİZLİ EASTER EGG (İSME 5 KEZ TIKLAYINCA GLITCH & HACKER MODU)
    // ==========================================================================
    const mainNameElement = document.getElementById('main-name');
    const glitchOverlay = document.getElementById('hacker-glitch-overlay');
    const glitchTerminalLines = document.getElementById('glitch-terminal-lines');
    const matrixCanvas = document.getElementById('matrix-rain-canvas');

    let clickCount = 0;
    let clickResetTimer = null;
    let matrixAnimId = null;

    if (mainNameElement && glitchOverlay && matrixCanvas) {
        mainNameElement.addEventListener('click', () => {
            clickCount++;

            // Tıklama sıfırlama zamanlayıcısı (3 saniye içinde 5 tıklama yapılmalı)
            clearTimeout(clickResetTimer);
            clickResetTimer = setTimeout(() => {
                clickCount = 0;
            }, 3000);

            // 5 Tıklamaya Ulaşıldığında Hacker Glitch Modunu Başlat
            if (clickCount >= 5) {
                clickCount = 0;
                clearTimeout(clickResetTimer);
                triggerHackerGlitchMode();
            }
        });

        function triggerHackerGlitchMode() {
            // Overlay'i göster ve gövdeye sarsıntı/glitch efekti ver
            glitchOverlay.classList.remove('hidden');
            document.body.classList.add('screen-glitch-active');
            glitchTerminalLines.innerHTML = '';

            // Matrix Koyu Neon Mor Kod Yağmuru Başlat
            startMatrixCodeRain();

            // Terminal Metinleri (İstenen Özel Cümleler - Hızlı Akış)
            const linesToType = [
                "> SISTEM BOZULDU...",
                "> VERI ANALIZI DURDURULDU...",
                "> HACKER MODU AKTIF...",
                "> BILGI: CHURN RISKI YUKSEK SEGMENT TESPIT EDILDI..."
            ];

            linesToType.forEach((lineText, idx) => {
                setTimeout(() => {
                    const lineElem = document.createElement('div');
                    lineElem.className = 'glitch-line';
                    lineElem.innerHTML = `<span style="color:#C77DFF; font-weight:bold;">[UYARI]</span> ${lineText}`;
                    glitchTerminalLines.appendChild(lineElem);
                }, idx * 280 + 100);
            });

            // 1.8 Saniye sonra (1-2 saniye aralığında) anında kapat ve orijinal şık temaya dön
            setTimeout(() => {
                glitchOverlay.classList.add('hidden');
                document.body.classList.remove('screen-glitch-active');
                if (matrixAnimId) cancelAnimationFrame(matrixAnimId);
                glitchTerminalLines.innerHTML = '';
            }, 1800);
        }

        // Matrix Koyu Neon Mor Kod Yağmuru Fonksiyonu
        function startMatrixCodeRain() {
            const mCtx = matrixCanvas.getContext('2d');
            const mWidth = matrixCanvas.width = window.innerWidth;
            const mHeight = matrixCanvas.height = window.innerHeight;

            const chars = "010101 METEHAN BIGDATA CHURN PREDICTION GYM KAFKA SQL PYTHON CLUSTER MATRIX 0x8F";
            const fontSize = 14;
            const columns = Math.floor(mWidth / fontSize);
            const drops = Array(columns).fill(1);

            function drawMatrix() {
                mCtx.fillStyle = 'rgba(8, 4, 15, 0.25)';
                mCtx.fillRect(0, 0, mWidth, mHeight);

                mCtx.fillStyle = '#9D4EDD';
                mCtx.font = fontSize + 'px monospace';

                for (let i = 0; i < drops.length; i++) {
                    const text = chars.charAt(Math.floor(Math.random() * chars.length));
                    const x = i * fontSize;
                    const y = drops[i] * fontSize;

                    // Lider harfler parlak lila/mor, diğerleri derin siber mor
                    if (Math.random() > 0.85) {
                        mCtx.fillStyle = '#E0AAFF';
                    } else {
                        mCtx.fillStyle = '#7B2CBF';
                    }

                    mCtx.fillText(text, x, y);

                    if (y > mHeight && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }

                matrixAnimId = requestAnimationFrame(drawMatrix);
            }

            drawMatrix();
        }
    }

    // ==========================================================================
    // 8. 'MOTORU KURTAR' KESTİRİMCİ BAKIM MİNİGAME WIDGET'I
    // ==========================================================================
    const tempFill = document.getElementById('temp-fill');
    const tempStatus = document.getElementById('temp-status');
    const tempPercent = document.getElementById('temp-percent');
    const interventionCount = document.getElementById('intervention-count');
    const coolMotorBtn = document.getElementById('cool-motor-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const gameSuccessBadge = document.getElementById('game-success-badge');
    const motorGear = document.getElementById('motor-gear');

    if (tempFill && coolMotorBtn && restartGameBtn) {
        let currentTemp = 25;
        let successfulInterventions = 0;
        let isGameLocked = false;
        let tempRiseInterval = null;

        function updateWidgetUI() {
            tempFill.style.width = currentTemp + '%';
            tempPercent.textContent = `%${Math.round(currentTemp)} Sıcaklık`;
            interventionCount.textContent = `${successfulInterventions}/10`;

            // Renk ve Kritiklik Durumu
            tempFill.classList.remove('warning', 'critical');
            if (currentTemp >= 75) {
                tempFill.classList.add('critical');
                tempStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> Yüksek Risk: Kritik Aşırı Isınma!';
                if (motorGear) motorGear.style.animationDuration = '0.35s';
            } else if (currentTemp >= 50) {
                tempFill.classList.add('warning');
                tempStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i> Dikkat: Sıcaklık Yükseliyor';
                if (motorGear) motorGear.style.animationDuration = '0.7s';
            } else {
                tempStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Normal Çalışma Seviyesi';
                if (motorGear) motorGear.style.animationDuration = '1.5s';
            }
        }

        // Otomatik Sıcaklık Artış Simülasyonu
        function startSimulation() {
            clearInterval(tempRiseInterval);
            tempRiseInterval = setInterval(() => {
                if (isGameLocked) return;

                currentTemp += 6.5;

                // %100'e Ulaşma Durumu (SİSTEM ÇÖKTÜ)
                if (currentTemp >= 100) {
                    currentTemp = 100;
                    isGameLocked = true;
                    clearInterval(tempRiseInterval);

                    tempFill.style.width = '100%';
                    tempFill.classList.add('critical');
                    tempPercent.textContent = '%100 [KRİTİK]';
                    tempStatus.innerHTML = '<i class="fa-solid fa-skull" style="color:#ef4444;"></i> SİSTEM ÇÖKTÜ - Arıza Meydana Geldi!';

                    coolMotorBtn.disabled = true;
                    restartGameBtn.classList.remove('hidden');

                    if (motorGear) motorGear.style.animationDuration = '0s'; // Motor durdu
                }

                updateWidgetUI();
            }, 850);
        }

        // 'Analiz Et ve Müdahale Et' Buton Tıklaması
        coolMotorBtn.addEventListener('click', () => {
            if (isGameLocked) return;

            successfulInterventions++;
            // Motoru soğut
            currentTemp = Math.max(12, currentTemp - 14);
            updateWidgetUI();

            // KAZANMA ŞARTI: 10 Başarılı Müdahale
            if (successfulInterventions >= 10) {
                isGameLocked = true;
                clearInterval(tempRiseInterval);

                currentTemp = 18;
                tempFill.style.width = '18%';
                tempFill.className = 'temp-fill success-locked';
                tempPercent.textContent = '%18 Optimal Sıcaklık';
                tempStatus.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> SİSTEM KURTARILDI - Erken Uyarı Başarılı!';

                coolMotorBtn.disabled = true;
                gameSuccessBadge.classList.remove('hidden');
                restartGameBtn.classList.remove('hidden');

                if (motorGear) motorGear.style.animationDuration = '2s';
            }
        });

        // Yeniden Başlatma Butonu
        restartGameBtn.addEventListener('click', () => {
            currentTemp = 25;
            successfulInterventions = 0;
            isGameLocked = false;

            coolMotorBtn.disabled = false;
            restartGameBtn.classList.add('hidden');
            gameSuccessBadge.classList.add('hidden');

            updateWidgetUI();
            startSimulation();
        });

        // Simülasyonu başlat
        startSimulation();
    }

    // ==========================================================================
    // 9. 'LAPTOP FİYAT SİMÜLATÖRÜ' WIDGET'I (OLS REGRESYON HESAPLAMA MOTORU)
    // ==========================================================================
    const ramSlider = document.getElementById('ram-slider');
    const cpuSlider = document.getElementById('cpu-slider');
    const gpuSlider = document.getElementById('gpu-slider');
    const ramValDisplay = document.getElementById('ram-val-display');
    const cpuValDisplay = document.getElementById('cpu-val-display');
    const gpuValDisplay = document.getElementById('gpu-val-display');
    const simPriceDisplay = document.getElementById('sim-price-display');

    if (ramSlider && cpuSlider && gpuSlider && simPriceDisplay) {
        
        // Slider Dolum Arka Planı (Neon Mor İlerleme)
        function updateSliderTrack(slider) {
            const min = parseFloat(slider.min) || 0;
            const max = parseFloat(slider.max) || 100;
            const val = parseFloat(slider.value);
            const percentage = ((val - min) / (max - min)) * 100;
            slider.style.background = `linear-gradient(to right, #9D4EDD 0%, #C77DFF ${percentage}%, #171224 ${percentage}%, #171224 100%)`;
        }

        // Çoklu Doğrusal Regresyon (OLS) Fiyat Tahmin Formülü
        function calculateEstimatedPrice() {
            const ram = parseInt(ramSlider.value, 10);
            const cpu = parseInt(cpuSlider.value, 10);
            const gpu = parseInt(gpuSlider.value, 10);

            // 1. RAM Gösterimi
            ramValDisplay.textContent = `${ram} GB`;

            // 2. CPU Açıklayıcı Etiketi
            const cpuDescriptions = {
                1: "Seviye 1 (Giriş Seviyesi)",
                2: "Seviye 2 (Temel i3 / Ryzen 3)",
                3: "Seviye 3 (Orta i5 / Ryzen 5)",
                4: "Seviye 4 (i5 Yüksek Performans)",
                5: "Seviye 5 (İleri i7 / Ryzen 7)",
                6: "Seviye 6 (i7 Güçlü Oyun/İş)",
                7: "Seviye 7 (Üst Düzey i9 / Ryzen 9)",
                8: "Seviye 8 (i9 H-Serisi Canavarı)",
                9: "Seviye 9 (Ultra İş İstasyonu)",
                10: "Seviye 10 (En Üst Düzey Donanım)"
            };
            cpuValDisplay.textContent = cpuDescriptions[cpu] || `Seviye ${cpu}`;

            // 3. GPU Açıklayıcı Etiketi
            const gpuDescriptions = {
                1: "Seviye 1 (Dahili Grafik - Iris Xe)",
                2: "Seviye 2 (Giriş Harici - MX Serisi)",
                3: "Seviye 3 (GTX 1650 / RTX 2050)",
                4: "Seviye 4 (RTX 3050 Güncel)",
                5: "Seviye 5 (RTX 4050 / RTX 4060)",
                6: "Seviye 6 (RTX 4070 Yüksek FPS)",
                7: "Seviye 7 (RTX 4080 Profesyonel)",
                8: "Seviye 8 (RTX 4080 Ti)",
                9: "Seviye 9 (RTX 4090 Taşınabilir Güç)",
                10: "Seviye 10 (RTX 4090 Seviyesi)"
            };
            gpuValDisplay.textContent = gpuDescriptions[gpu] || `Seviye ${gpu}`;

            // --- REGRESYON MATEMATİKSEL MODELİ ---
            // Fiyat = β₀ (Taban Sabit) + β₁(RAM) + β₂(CPU) + β₃(GPU)
            // Taban Fiyat: $280 (En ucuz konfigürasyon: 4GB RAM, CPU 1, GPU 1)
            const basePrice = 280;
            const ramBeta = 16;   // Her 1 GB RAM artışı marjinal olarak $16 ekler
            const cpuBeta = 85;   // Her CPU seviyesi $85 ekler
            const gpuBeta = 155;  // Her GPU seviyesi grafik performansıyla $155 ekler

            const calculatedPrice = Math.round(
                basePrice + 
                ((ram - 4) * ramBeta) + 
                ((cpu - 1) * cpuBeta) + 
                ((gpu - 1) * gpuBeta)
            );

            // Sonucu Biçimlendirerek Göster (Örn: $280, $1,280, $3,400)
            simPriceDisplay.textContent = `$${calculatedPrice.toLocaleString('en-US')}`;

            // Track neon dolgularını anlık güncelle
            updateSliderTrack(ramSlider);
            updateSliderTrack(cpuSlider);
            updateSliderTrack(gpuSlider);
        }

        // Tarayıcının 'yasak' işareti (🚫 / no-drop) ve metin seçme hatasını engelle
        const priceSimWidget = document.getElementById('price-sim-widget');
        if (priceSimWidget) {
            priceSimWidget.addEventListener('dragstart', (e) => e.preventDefault());
        }

        const sliders = [ramSlider, cpuSlider, gpuSlider];
        sliders.forEach(slider => {
            slider.addEventListener('dragstart', (e) => e.preventDefault());
            
            // Pointer Capture ile sürükleme esnasında imleç dışarı çıksa dahi takılmayı önle
            slider.addEventListener('pointerdown', (e) => {
                if (slider.setPointerCapture) {
                    try { slider.setPointerCapture(e.pointerId); } catch (_) {}
                }
            });
        });

        // Slider Dinleyicileri (Anlık / Real-Time Güncelleme)
        ramSlider.addEventListener('input', calculateEstimatedPrice);
        cpuSlider.addEventListener('input', calculateEstimatedPrice);
        gpuSlider.addEventListener('input', calculateEstimatedPrice);

        // Sayfa ilk açıldığında başlangıç hesaplamasını yap ($280)
        calculateEstimatedPrice();
    }

});
