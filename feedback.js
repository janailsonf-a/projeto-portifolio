// Importe as funções do Firebase que você precisará
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==================================================
//  SUA CONFIGURAÇÃO DO FIREBASE VAI AQUI
// ==================================================
// ATENÇÃO: Substitua o objeto abaixo pela configuração do SEU projeto Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- LÓGICA DO MODAL (POP-UP) ---
const modal = document.getElementById('feedback-modal');
const openModalBtn = document.getElementById('open-feedback-form-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

openModalBtn.onclick = () => { modal.style.display = 'block'; document.body.classList.add('no-scroll'); }
closeModalBtn.onclick = () => { modal.style.display = 'none'; document.body.classList.remove('no-scroll'); }
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
}

// --- LÓGICA DAS ESTRELAS DE AVALIAÇÃO ---
const stars = document.querySelectorAll('.star-rating i');
const ratingInput = document.getElementById('rating-value');
stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = star.dataset.value;
        ratingInput.value = rating;
        stars.forEach((s, index) => {
            s.classList.toggle('active', index < rating);
        });
    });
});

// --- LÓGICA DE ENVIO DO FORMULÁRIO ---
const form = document.getElementById('feedback-form');
const successMessage = document.getElementById('form-success-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value;
    const company = form.company.value;
    const rating = parseInt(form.rating.value);
    const message = form.message.value;

    try {
        await addDoc(collection(db, "testimonials"), {
            name: name,
            company: company,
            rating: rating,
            message: message,
            approved: false, // Importante para moderação!
            createdAt: new Date()
        });

        form.reset();
        ratingInput.value = 0;
        stars.forEach(s => s.classList.remove('active'));
        successMessage.style.display = 'block';
        setTimeout(() => {
            successMessage.style.display = 'none';
            modal.style.display = 'none';
            document.body.classList.remove('no-scroll');
        }, 3000);

    } catch (error) {
        console.error("Erro ao adicionar documento: ", error);
        alert("Ocorreu um erro ao enviar seu feedback. Tente novamente.");
    }
});


// --- LÓGICA PARA MOSTRAR OS FEEDBACKS APROVADOS ---
const testimonialsWall = document.getElementById('testimonials-wall');

const q = query(collection(db, "testimonials"), where("approved", "==", true));
onSnapshot(q, (querySnapshot) => {
    testimonialsWall.innerHTML = ''; // Limpa o mural antes de adicionar os novos
    querySnapshot.forEach((doc) => {
        const testimonial = doc.data();

        const card = document.createElement('div');
        card.className = 'testimonial-card';

        let starsHTML = '';
        for(let i = 0; i < 5; i++) {
            starsHTML += `<i class='bx bxs-star${i < testimonial.rating ? '' : '-outline'}'></i>`;
        }

        card.innerHTML = `
            <div class="testimonial-header">
                <img src="img/avatar_placeholder.png" alt="Foto de ${testimonial.name}">
                <div class="testimonial-author-info">
                    <h4>${testimonial.name}</h4>
                    <span>${testimonial.company}</span>
                </div>
            </div>
            <div class="testimonial-stars">${starsHTML}</div>
            <p class="testimonial-text">"${testimonial.message}"</p>
        `;
        testimonialsWall.appendChild(card);
    });
});