// Siz bergan aniq 31 ta ism
const names = [
    "Akbarov Kamronbek Oybek O‘G‘Li",
    "Axrorova Madina Anvar Qizi",
    "Azizqulova Shaydo Ramziddinovna",
    "Hamidova Gavhar Orifjon qizi",
    "Hasanov Istam Ilyos O‘G‘Li",
    "Ismatullayev Ismoil Isroil o‘g‘li",
    "Izzatullayev Mirziyo Yoqubjon O'g'li",
    "Ishmurodov Oybekjon Otabekovich",
    "Keldiyorov Kamronbek Nurbekovich",
    "Mansurov Umidjon Mirjon O'g'li",
    "Manyapova Dinara Rinatovna",
    "Namozova Asal Olmosovna",
    "Ne'matullayeva Durdona Sherali Qizi",
    "Noridinov Murodbek Namoz o'g'li",
    "Normurotov Jur'at Bekmurodovich",
    "Norqulova Begoyim Navro’Z Qizi",
    "Orolov Sobidjon Tojimalik O`G`Li",
    "Ochilova Munisa Muxiddin qizi",
    "Radjabov Muslimbek Rustamovich",
    "Rozimurodov Quvonchbek Asliddin O‘G‘Li",
    "Safarova Dilnura Nurali Qizi",
    "Samadova Saodat Sohib qizi",
    "Sobirova Barchinoy Avaz qizi",
    "Temirova Umida Xusanovna",
    "Toshpulatova Malika Alisher qizi",
    "Turdiyev Ulug’Bek Nodirbek O’Gli",
    "Xakimova Xonzodabegim Otabekovna",
    "Xasanov Temurbek Alisher o`g`li",
    "Yo'ldoshev Firdavs Ismatullayevich",
    "Shavkatov Behruz Bekzodovich",
    "Shokirova Kumush Sharifovna"
];

// Ranglarni avtomatik generatsiya qilish (har doim har xil chiqishi uchun)
const colors = [];
for(let i=0; i<names.length; i++) {
    // Chiroyli yorqin ranglar palitrasi
    const hue = Math.floor((i * 360) / names.length); 
    colors.push(`hsl(${hue}, 80%, 50%)`);
}

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, index) => {
        const startAngle = index * sliceAngle;
        const endAngle = (index + 1) * sliceAngle;

        // 1. Dilimni chizish
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, startAngle, endAngle);
        ctx.fillStyle = colors[index];
        ctx.fill();

        // 2. Chegarani chizish
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 3. Matnni yozish
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 13px Arial";
        // Ismni juda uzun bo'lsa qisqartirib ko'rsatish (faqat familiyasi)
        const displayName = name.split(' ')[0] + ' ' + (name.split(' ')[1] || '').charAt(0) + '.';
        ctx.fillText(displayName, radius - 20, 5);
        ctx.restore();
    });
}

// Global o'zgaruvchi, oldingi aylanish joyini saqlash uchun
let currentRotation = 0;

function spinWheel() {
    const spinBtn = document.getElementById('spinBtn');
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;

    // 1. G'olibni oldindan aniqlaymiz (Index bo'yicha)
    const winnerIndex = Math.floor(Math.random() * names.length);
    console.log("G'olib: " + names[winnerIndex]);

    // 2. Matematik hisob-kitob (Strelka TEPADA = 270 gradusda)
    const sliceDeg = 360 / names.length;
    
    // Canvasda 0 gradus soat 3 da joylashgan. Strelka esa soat 12 da (270 gradus).
    // Biz 'winnerIndex' ni 270 gradusga olib kelishimiz kerak.
    // Formula: Target = Offset(270) - (Index * Slice + Slice/2)
    const offset = 270; 
    const targetAngle = offset - (winnerIndex * sliceDeg) - (sliceDeg / 2);

    // Kamida 10 marta aylanib keyin to'xtasin (360 * 10)
    // Random qo'shmaymiz, chunki aniq joyga to'xtashi kerak
    const extraSpins = 360 * 10;
    
    // Yangi aylanish burchagi (eski joyidan davom etadi)
    // Modulo 360 qilib hisoblash shart emas, CSS transform shug'ullanadi
    // Faqat musbat tomonga aylanishi uchun:
    let newRotation = currentRotation + extraSpins + (targetAngle - (currentRotation % 360));
    
    // Agar hisob kitob manfiy bo'lib qolsa, to'g'irlash
    if (newRotation < currentRotation) {
        newRotation += 360;
    }
    
    // Burilishni amalga oshirish
    const canvas = document.getElementById('wheelCanvas');
    const duration = 5000; // 5 sekund
    
    canvas.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.7, 0.1, 1)`;
    canvas.style.transform = `rotate(${newRotation}deg)`;

    // Aylanish tugagach natijani chiqarish
    setTimeout(() => {
        showResult(winnerIndex);
        spinBtn.disabled = false;
        currentRotation = newRotation; // Keyingi safar uchun saqlaymiz
    }, duration);
}

function showResult(index) {
    const fullName = names[index];
    document.getElementById('fullWinnerName').textContent = fullName;
    document.getElementById('winnerModal').style.display = 'flex';

    confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
    });
}

// Hodisalar
document.getElementById('spinBtn').addEventListener('click', spinWheel);
document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('winnerModal').style.display = 'none';
});

// Chizish
drawWheel();