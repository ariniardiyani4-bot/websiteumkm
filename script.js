// Array untuk menyimpan item keranjang belanja
let keranjang = [];

// Fungsi Menambahkan Menu ke Keranjang
function tambahKeKeranjang(nama, harga) {
    const itemDitemukan = keranjang.find(item => item.nama === nama);

    if (itemDitemukan) {
        itemDitemukan.jumlah += 1;
    } else {
        keranjang.push({ nama: nama, harga: harga, jumlah: 1 });
    }

    perbaruiTampilanKeranjang();
}

// Fungsi Mengurangi Jumlah Menu
function kurangiJumlah(nama) {
    const itemDitemukan = keranjang.find(item => item.nama === nama);

    if (itemDitemukan) {
        itemDitemukan.jumlah -= 1;
        if (itemDitemukan.jumlah <= 0) {
            keranjang = keranjang.filter(item => item.nama !== nama);
        }
    }

    perbaruiTampilanKeranjang();
}

// Fungsi Memperbarui Tampilan UI Keranjang & Total Harga
function perbaruiTampilanKeranjang() {
    const cartItemList = document.getElementById('cartItemList');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    cartItemList.innerHTML = '';

    let totalHarga = 0;
    let totalJumlahItem = 0;

    if (keranjang.length === 0) {
        cartItemList.innerHTML = '<li class="list-group-item text-center text-muted py-3">Keranjang masih kosong.</li>';
    } else {
        keranjang.forEach(item => {
            const subtotal = item.harga * item.jumlah;
            totalHarga += subtotal;
            totalJumlahItem += item.jumlah;

            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center py-2';
            li.innerHTML = `
                <div>
                    <h6 class="mb-0 fw-bold">${item.nama}</h6>
                    <small class="text-muted">Rp ${item.harga.toLocaleString('id-ID')} x ${item.jumlah}</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span class="fw-bold me-2">Rp ${subtotal.toLocaleString('id-ID')}</span>
                    <button class="btn btn-sm btn-outline-danger px-2 py-0" onclick="kurangiJumlah('${item.nama}')">-</button>
                    <button class="btn btn-sm btn-outline-success px-2 py-0" onclick="tambahKeKeranjang('${item.nama}', ${item.harga})">+</button>
                </div>
            `;
            cartItemList.appendChild(li);
        });
    }

    cartCount.innerText = totalJumlahItem;
    cartTotal.innerText = `Rp ${totalHarga.toLocaleString('id-ID')}`;
}

// Fungsi Mengirim Seluruh Rincian Pesanan ke WhatsApp
function kirimKeranjangKeWA() {
    const nama = document.getElementById('cartNama').value.trim();
    const alamat = document.getElementById('cartAlamat').value.trim();
    const catatan = document.getElementById('cartCatatan') ? document.getElementById('cartCatatan').value.trim() : '-';
    
    // Masukkan nomor WA Toko Anda (menggunakan awalan 62 tanpa angka 0 atau simbol +)
    const nomorWA = "6281230938621"; 

    if (keranjang.length === 0) {
        alert("Keranjang belanja Anda masih kosong!");
        return;
    }

    if (!nama || !alamat) {
        alert("Harap isi Nama Lengkap dan Alamat Pengiriman!");
        return;
    }

    // Mendapatkan tanggal dan waktu saat pesan dikirim
    const sekarang = new Date();
    const opsiTanggal = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    const waktuPesan = sekarang.toLocaleDateString('id-ID', opsiTanggal);

    // Membuat nomor nota/struk acak sederhana
    const idStruk = "MS-" + Math.floor(1000 + Math.random() * 9000);

    let rincianPesanan = "";
    let totalHarga = 0;

    keranjang.forEach((item, index) => {
        const subtotal = item.harga * item.jumlah;
        totalHarga += subtotal;
        rincianPesanan += `${index + 1}. *${item.nama}*\n   ${item.jumlah} x Rp ${item.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    // Format Struk Chat WhatsApp
    const pesan = `==========================\n` +
                  `🧾 *STRUK PEMESANAN - MANIS SENJA*\n` +
                  `==========================\n` +
                  `*No. Struk :* ${idStruk}\n` +
                  `*Tanggal   :* ${waktuPesan}\n\n` +
                  `👤 *DATA PEMESAN*\n` +
                  `• Nama   : ${nama}\n` +
                  `• Alamat : ${alamat}\n` +
                  `• Catatan: ${catatan || '-'}\n\n` +
                  `🛒 *RINCIAN PESANAN*\n` +
                  `${rincianPesanan}` +
                  `------------------------------------------\n` +
                  `💰 *TOTAL PEMBAYARAN : Rp ${totalHarga.toLocaleString('id-ID')}*\n` +
                  `==========================\n\n` +
                  `Halo Toko Manis Senja, mohon diproses pesanan saya di atas ya. Terima kasih!`;

    // Buka aplikasi WhatsApp dengan pesan terformat
    const urlWA = `https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`;
    window.open(urlWA, '_blank');
}

// Fungsi Filter Kategori Menu (Makanan / Minuman / Semua)
function filterMenu(kategori, element) {
    // Ubah status tombol aktif
    const buttons = document.querySelectorAll('#pills-tab .nav-link');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    // Tampilkan / Sembunyikan item berdasarkan kategori
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const itemKategori = item.getAttribute('data-kategori');
        
        if (kategori === 'semua' || itemKategori === kategori) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}