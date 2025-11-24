// Функція для завантаження даних JSON
async function loadSettings() {
    try {
        const response = await fetch('settings.json');
        if (!response.ok) {
            throw new Error(`Помилка HTTP: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Не вдалося завантажити settings.json:", error);
        return null;
    }
}

// Функція для відображення даних лідерства
async function populateLeadership() {
    const settings = await loadSettings();
    if (!settings) return;

    // --- 1. Відображення Лідер (Alpha) ---
    const leaderContainer = document.querySelector('.member-card.leader');
    if (leaderContainer) {
        const leader = settings.leadership.leader;
        
        // Оновлення нікнейму, ролі та опису для Лідера
        leaderContainer.querySelector('.member-name').textContent = leader.nickname;
        leaderContainer.querySelector('.role-title').textContent = leader.roleTitle;
        leaderContainer.querySelector('.description').textContent = leader.description;
    }

    // --- 2. Відображення Заступника та Представника (Beta та Warden) ---
    const representativesGrid = document.querySelector('.representatives-grid');
    if (representativesGrid) {
        // Очищаємо початкові заглушки (якщо вони були)
        representativesGrid.innerHTML = ''; 

        const beta = settings.leadership.deputy;
        const warden = settings.leadership.warden;

        // Генерація картки Заступника
        representativesGrid.innerHTML += createMemberCard(
            beta.nickname, 
            beta.roleTitle, 
            beta.description, 
            "Заступник Лідера (Beta)"
        );
        
        // Генерація картки Представника
        representativesGrid.innerHTML += createMemberCard(
            warden.nickname, 
            warden.roleTitle, 
            warden.description, 
            "Представник Клану (Warden)"
        );
    }
}

// Допоміжна функція для створення HTML-картки
function createMemberCard(nickname, roleTitle, description, heading) {
    return `
        <div class="member-card">
            <h3>${heading}</h3>
            <p class="role-title">${roleTitle}</p>
            <p class="member-name">${nickname}</p>
            <p class="description">${description}</p>
        </div>
    `;
}

// --- Запуск функцій при завантаженні сторінки ---
document.addEventListener('DOMContentLoaded', () => {
    // Перевіряємо, чи ми на сторінці лідерства
    if (document.body.classList.contains('leadership-page-body')) {
        populateLeadership();
    }
});


// Функція для оновлення посилань на Discord
async function updateDiscordLinks() {
    const settings = await loadSettings();
    if (!settings) return;

    const discordLink = settings.discord.link;
    const discordCtaText = settings.discord.ctaText;

    // Оновлення великої кнопки на головній
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.href = discordLink;
        // Оновлення тексту (якщо потрібно)
        // ctaButton.textContent = discordCtaText; 
    }

    // Оновлення кнопок Discord у навігації
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.href = discordLink;
    });
}

// ...
document.addEventListener('DOMContentLoaded', () => {
    updateDiscordLinks(); // Виконується на всіх сторінках
    if (document.body.classList.contains('leadership-page-body')) {
        populateLeadership(); // Виконується тільки на сторінці лідерства
    }
});