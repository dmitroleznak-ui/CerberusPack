// Функція для завантаження settings.json
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

// Функція для відображення даних лідерства
async function populateLeadership() {
    const settings = await loadSettings();
    if (!settings) return;

    // ... (код заповнення Лідерства залишається без змін) ...

    const leaderContainer = document.querySelector('.member-card.leader');
    if (leaderContainer) {
        const leader = settings.leadership.leader;
        leaderContainer.querySelector('.member-name').textContent = leader.nickname;
        leaderContainer.querySelector('.role-title').textContent = leader.roleTitle;
        leaderContainer.querySelector('.description').textContent = leader.description;
    }

    const representativesGrid = document.querySelector('.representatives-grid');
    if (representativesGrid) {
        representativesGrid.innerHTML = ''; 
        const beta = settings.leadership.deputy;
        const warden = settings.leadership.warden;

        representativesGrid.innerHTML += createMemberCard(
            beta.nickname, 
            beta.roleTitle, 
            beta.description, 
            "Заступник Лідера (Beta)"
        );
        
        representativesGrid.innerHTML += createMemberCard(
            warden.nickname, 
            warden.roleTitle, 
            warden.description, 
            "Представник Клану (Warden)"
        );
    }
}

// Функція для оновлення посилань на Discord
async function updateDiscordLinks() {
    const settings = await loadSettings();
    if (!settings) return;

    const discordLink = settings.discord.link;

    // Оновлення великої кнопки на головній
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.href = discordLink;
    }

    // Оновлення кнопок Discord у навігації
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.href = discordLink;
    });
}

// --- НОВА ФУНКЦІЯ: Відображення списку учасників ---
async function populateRoster() {
    const rosterContainer = document.getElementById('member-roster');
    const countElement = document.getElementById('member-count');
    
    // Вбудована функція для завантаження members.json (можемо залишити її тут)
    async function loadRoster() {
        try {
            const response = await fetch('members.json');
            if (!response.ok) {
                throw new Error(`Помилка HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Не вдалося завантажити members.json:", error);
            rosterContainer.innerHTML = '<tr><td colspan="3" style="color:#c93305;">Помилка завантаження списку.</td></tr>';
            return null;
        }
    }

    const rosterData = await loadRoster();
    if (!rosterData || !rosterData.memberList) return;

    // Оновлення загальної кількості
    countElement.textContent = rosterData.totalMembers;

    // Генерація рядків таблиці
    let htmlContent = '';
    rosterData.memberList.forEach(member => {
        htmlContent += `
            <tr>
                <td>${member.nickname}</td>
                <td>${member.role}</td>
                <td>${member.joinDate}</td>
            </tr>
        `;
    });
    
    rosterContainer.innerHTML = htmlContent;
}


// --- ✅ ЄДИНИЙ БЛОК ЗАПУСКУ ФУНКЦІЙ ПРИ ЗАВАНТАЖЕННІ СТОРІНКИ ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Запускається на всіх сторінках для оновлення посилань Discord
    updateDiscordLinks(); 

    // 2. Запускається тільки на сторінці Лідерства
    if (document.body.classList.contains('leadership-page-body')) {
        populateLeadership(); 
    }

    // 3. Запускається тільки на сторінці Складу
    if (document.body.classList.contains('roster-page-body')) {
        populateRoster();
    }
});

