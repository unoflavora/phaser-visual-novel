import EnglishText from "./EnglishText";

const IndonesianText : typeof EnglishText = {
    select_language: "Pilih Bahasa",
    interactions: {
        close: "Tutup",
        back: "Kembali",
        seeResult: "Lihat Hasil",
        backToHome: "Ke Beranda"
    },
    prompts:{
        emotion: "Tebak emosi",
        response: "Pilih respon Anda",
    },
    loading: {
        minigame: "Memuat Minigame...",
    },
    result: {
        thankYou: "Terima kasih telah bermain",
        finished: "Anda telah menyelesaikan gamenya!",
        finishedDate: "Selesai pada tanggal: ",
    },
    mainMenu: {
        startGame: "Mulai Test",
        gameLog: "Log Game",
        settings: {
            title: "Pengaturan",
            language: "Bahasa",
            sound: "Suara",
            music: "Musik",
        },
        recommendation: "Kami merekomendasikan memainkan game ini di browser PC untuk pengalaman terbaik.",
        auth: {
            login: "Masuk",
            logout: "Keluar",
            create_password_title: "Buat Kata Sandi Anda",
            password: "Kata Sandi",
            confirm_password: "Konfirmasi Kata Sandi",
            create_password: "Buat Kata Sandi",
            email: "Alamat Email",
            forgot_password: "Lupa Kata Sandi",
            remember_me: "Ingat Saya",
            wrong_password: "Kata Sandi atau Email Salah",
            reset_password: "Reset Password",
            invalid_email: "Email Tidak Terdaftar",
            forgot_password_title: "Lupa Kata Sandi",
            forgot_password_desc: "Klik tautan di bawah ini dan Anda akan dialihkan ke halaman web lain untuk mengatur ulang kata sandi Anda.",
        },
        overview: {
            title: "Ringkasan",
            score: "Skor",
            takenOn: "Diambil pada",
            backToHome: "Kembali ke Beranda",
            seeDetails: "Detailnya",
        }
    },
    errors: {
        not_taken_assesment: {
            title: "Anda belum mengikuti tes.",
            desc: "Anda belum pernah melakukan tes sebelumnya. Silakan mulai menjalankan tes untuk dapat melihat hasilnya.",
        },
        assesment_taken: {
            title: "Anda telah mengikuti tes.",
            desc: "Silakan hubungi perusahaan Anda agar diberi akses untuk mengulang tes.",
        },
        failed_to_save: {
            title: "Gagal menyimpan game",
            desc: "Gagal menyimpan progress game, silakan periksa koneksi internet Anda dan coba lagi.",
        }
    }
}

export default IndonesianText