/* script.js - LOGIC & LADLE Database Engine */

const articles = [
    { id: "Exp.01", category: "REACTION", title: "メイラード反応の統一理論", date: "2025.11.28", link: "article01.html" },
    { id: "Exp.02", category: "PHYSICS", title: "乳化のパラドクス", date: "2025.12.05", link: "article02.html" },
    { id: "Exp.03", category: "INGREDIENT", title: "ミオグロビンの変色ロジック", date: "2025.12.12", link: "article03.html" },
    { id: "Exp.04", category: "INGREDIENT", title: "コラーゲンの熱分解とゼラチン化", date: "2025.12.19", link: "article04.html" },
    { id: "Exp.05", category: "PHYSICS", title: "浸透圧と拡散係数：塩の物理学", date: "2025.12.26", link: "article05.html" },
    { id: "Exp.06", category: "INGREDIENT", title: "卵の熱凝固ヒステリシス", date: "2026.01.08", link: "article06.html" },
    { id: "Exp.07", category: "INGREDIENT", title: "澱粉の糊化と老化のメカニズム", date: "2026.01.15", link: "article07.html" },
    { id: "Exp.08", category: "INGREDIENT", title: "油脂の酸化と発煙点管理", date: "2026.01.22", link: "article08.html" },
    { id: "Exp.09", category: "SENSORY", title: "揮発性香気成分の抽出理論", date: "2026.01.29", link: "article09.html" },
    { id: "Exp.10", category: "PHYSICS", title: "熱伝導・対流・放射の最適解", date: "2026.02.05", link: "article10.html" },

    // --- 以下、企画・執筆待ち記事 --- 
    { id: "Exp.11", category: "REACTION", title: "酵素的褐変の抑制生化学", date: "Coming Soon", link: "#" },
    { id: "Exp.12", category: "PHYSICS", title: "ペクチンのゲル化メカニズム", date: "Coming Soon", link: "#" },
    { id: "Exp.13", category: "REACTION", title: "乳酸発酵の制御と微生物学", date: "Coming Soon", link: "#" },
    { id: "Exp.14", category: "INGREDIENT", title: "死後硬直とATP分解：魚の熟成", date: "Coming Soon", link: "#" },
    { id: "Exp.15", category: "TECHNIQUE", title: "真空調理(Sous-vide)の熱力学", date: "Coming Soon", link: "#" },
    { id: "Exp.16", category: "REACTION", title: "砂糖の熱分解と結晶化相図", date: "Coming Soon", link: "#" },
    { id: "Exp.17", category: "SENSORY", title: "味の相互作用：抑制・対比・相乗", date: "Coming Soon", link: "#" },
    { id: "Exp.18", category: "INGREDIENT", title: "クロロフィルの退色防止", date: "Coming Soon", link: "#" },
    { id: "Exp.19", category: "INGREDIENT", title: "アントシアニンのpH変色制御", date: "Coming Soon", link: "#" },
    { id: "Exp.20", category: "TECHNIQUE", title: "電子レンジの誘電加熱特性", date: "Coming Soon", link: "#" },
    { id: "Exp.21", category: "PHYSICS", title: "肉の保水性(WHC)とpHの関係", date: "Coming Soon", link: "#" },
    { id: "Exp.22", category: "INGREDIENT", title: "グルテンの形成と阻害要因", date: "Coming Soon", link: "#" },
    { id: "Exp.23", category: "PHYSICS", title: "ゲル化剤の融点と離水特性", date: "Coming Soon", link: "#" },
    { id: "Exp.24", category: "SENSORY", title: "燻製の化学：フェノール類の吸着", date: "Coming Soon", link: "#" },
    { id: "Exp.25", category: "INGREDIENT", title: "チーズの溶融性と分離ロジック", date: "Coming Soon", link: "#" },
    { id: "Exp.26", category: "INGREDIENT", title: "野菜の硬化と軟化：ペクチン分解", date: "Coming Soon", link: "#" },
    { id: "Exp.27", category: "TECHNIQUE", title: "IH(誘導加熱)の物理学と鍋底", date: "Coming Soon", link: "#" },
    { id: "Exp.28", category: "INGREDIENT", title: "バターの結晶構造とテンパリング", date: "Coming Soon", link: "#" },
    { id: "Exp.29", category: "REACTION", title: "アルコール調理の残留度データ", date: "Coming Soon", link: "#" },
    { id: "Exp.30", category: "INGREDIENT", title: "プロテアーゼ活用：肉の軟化術", date: "Coming Soon", link: "#" },
    { id: "Exp.31", category: "INGREDIENT", title: "ジャガイモの品種と調理適性", date: "Coming Soon", link: "#" },
    { id: "Exp.32", category: "SENSORY", title: "旨味の相乗効果メカニズム", date: "Coming Soon", link: "#" },
    { id: "Exp.33", category: "PHYSICS", title: "余熱調理(Carry-over)の熱計算", date: "Coming Soon", link: "#" },
    { id: "Exp.34", category: "PHYSICS", title: "メレンゲと泡の安定性物理", date: "Coming Soon", link: "#" },
    { id: "Exp.35", category: "INGREDIENT", title: "ニンニク・玉ねぎの香り生成酵素", date: "Coming Soon", link: "#" },
    { id: "Exp.36", category: "INGREDIENT", title: "米の吸水と炊飯の「蟹の穴」", date: "Coming Soon", link: "#" },
    { id: "Exp.37", category: "PHYSICS", title: "揚げ物の吸油メカニズム", date: "Coming Soon", link: "#" },
    { id: "Exp.38", category: "PHYSICS", title: "茶碗蒸しの「す」と気泡膨張", date: "Coming Soon", link: "#" },
    { id: "Exp.39", category: "REACTION", title: "塩による脱水と防腐の浸透圧", date: "Coming Soon", link: "#" },
    { id: "Exp.40", category: "SENSORY", title: "スパイスのブルーミング原理", date: "Coming Soon", link: "#" },
    { id: "Exp.41", category: "INGREDIENT", title: "ハンバーグの結着と塩溶解性", date: "Coming Soon", link: "#" },
    { id: "Exp.42", category: "PHYSICS", title: "パスタの茹で汁と乳化作用", date: "Coming Soon", link: "#" },
    { id: "Exp.43", category: "INGREDIENT", title: "海老・イカのプリプリ感と加熱", date: "Coming Soon", link: "#" },
    { id: "Exp.44", category: "TECHNIQUE", title: "炭火焼きの遠赤外線効果", date: "Coming Soon", link: "#" },
    { id: "Exp.45", category: "TECHNIQUE", title: "50℃洗いのヒートショック原理", date: "Coming Soon", link: "#" },
    { id: "Exp.46", category: "SENSORY", title: "コーヒーの抽出変数と粒度", date: "Coming Soon", link: "#" },
    { id: "Exp.47", category: "INGREDIENT", title: "チョコレートの結晶化と多形", date: "Coming Soon", link: "#" },
    { id: "Exp.48", category: "INGREDIENT", title: "豆の吸水と煮えムラ：硬水の影響", date: "Coming Soon", link: "#" },
    { id: "Exp.49", category: "PHYSICS", title: "ヴィネグレットの不安定性", date: "Coming Soon", link: "#" },
    { id: "Exp.50", category: "TECHNIQUE", title: "急速冷凍と最大氷結晶生成帯", date: "Coming Soon", link: "#" },
    { id: "Exp.51", category: "REACTION", title: "キャラメリゼの温度帯と分解", date: "Coming Soon", link: "#" },
    { id: "Exp.52", category: "SENSORY", title: "食感の音響学(Gastrophysics)", date: "Coming Soon", link: "#" },
    { id: "Exp.53", category: "INGREDIENT", title: "魚の酢締めとタンパク質変性", date: "Coming Soon", link: "#" },
    { id: "Exp.54", category: "INGREDIENT", title: "エチレンガスと果実の追熟制御", date: "Coming Soon", link: "#" },
    { id: "Exp.55", category: "TECHNIQUE", title: "圧力鍋の沸点上昇と時短理論", date: "Coming Soon", link: "#" },
    { id: "Exp.56", category: "TECHNIQUE", title: "コンフィの保存性と熱伝達", date: "Coming Soon", link: "#" },
    { id: "Exp.57", category: "PHYSICS", title: "水溶き片栗粉の粘度とダマ", date: "Coming Soon", link: "#" },
    { id: "Exp.58", category: "INGREDIENT", title: "熟成肉の微生物学と酵素分解", date: "Coming Soon", link: "#" },
    { id: "Exp.59", category: "SENSORY", title: "出汁抽出と水質(硬度)の関係", date: "Coming Soon", link: "#" },
    { id: "Exp.60", category: "PHYSICS", title: "ソースの煮詰めと乳化安定", date: "Coming Soon", link: "#" },
    { id: "Exp.61", category: "REACTION", title: "BPと重曹のガス発生タイミング", date: "Coming Soon", link: "#" },
    { id: "Exp.62", category: "INGREDIENT", title: "根菜の下茹でと酵素失活温度", date: "Coming Soon", link: "#" },
    { id: "Exp.63", category: "INGREDIENT", title: "メレンゲの種類と物理特性", date: "Coming Soon", link: "#" },
    { id: "Exp.64", category: "SENSORY", title: "ハーブオイルの色素抽出管理", date: "Coming Soon", link: "#" },
    { id: "Exp.65", category: "TECHNIQUE", title: "包丁の切れ味と細胞破壊", date: "Coming Soon", link: "#" },
    { id: "Exp.66", category: "INGREDIENT", title: "糖による保水性と防腐の浸透圧", date: "Coming Soon", link: "#" },
    { id: "Exp.67", category: "INGREDIENT", title: "ヨーグルトのレオロジーとpH", date: "Coming Soon", link: "#" },
    { id: "Exp.68", category: "INGREDIENT", title: "野菜ローストの糖化とメイラード", date: "Coming Soon", link: "#" },
    { id: "Exp.69", category: "PHYSICS", title: "アガー・寒天・ゼラチンの比較", date: "Coming Soon", link: "#" },
    { id: "Exp.70", category: "PHYSICS", title: "ガナッシュの乳化と転相点", date: "Coming Soon", link: "#" },
    { id: "Exp.71", category: "TECHNIQUE", title: "中華鍋の煽りと空中熱対流", date: "Coming Soon", link: "#" },
    { id: "Exp.72", category: "INGREDIENT", title: "血の利用とアルブミン凝固", date: "Coming Soon", link: "#" },
    { id: "Exp.73", category: "SENSORY", title: "レトロネイザル香のメカニズム", date: "Coming Soon", link: "#" },
    { id: "Exp.74", category: "SENSORY", title: "カロテノイドの脂溶性と抽出", date: "Coming Soon", link: "#" },
    { id: "Exp.75", category: "REACTION", title: "アルカリ処理(Nixtamalization)", date: "Coming Soon", link: "#" },
    { id: "Exp.76", category: "INGREDIENT", title: "ひき肉の酸化リスクと衛生管理", date: "Coming Soon", link: "#" },
    { id: "Exp.77", category: "PHYSICS", title: "パイ生地の層形成と可塑性", date: "Coming Soon", link: "#" },
    { id: "Exp.78", category: "PHYSICS", title: "塩の粒度と溶解速度の物理", date: "Coming Soon", link: "#" },
    { id: "Exp.79", category: "SENSORY", title: "紅茶のクリームダウン現象", date: "Coming Soon", link: "#" },
    { id: "Exp.80", category: "INGREDIENT", title: "すり身の足：座りと戻り現象", date: "Coming Soon", link: "#" },
    { id: "Exp.81", category: "REACTION", title: "サワー種の乳酸菌とグルテン", date: "Coming Soon", link: "#" },
    { id: "Exp.82", category: "SENSORY", title: "根菜の泥臭さ(ジオスミン)除去", date: "Coming Soon", link: "#" },
    { id: "Exp.83", category: "PHYSICS", title: "オランデーズソースの温度限界", date: "Coming Soon", link: "#" },
    { id: "Exp.84", category: "SENSORY", title: "グラス形状と香りの立ち方", date: "Coming Soon", link: "#" },
    { id: "Exp.85", category: "REACTION", title: "重曹と酸の中和反応と膨張", date: "Coming Soon", link: "#" },
    { id: "Exp.86", category: "INGREDIENT", title: "アクアファバの起泡性とサポニン", date: "Coming Soon", link: "#" },
    { id: "Exp.87", category: "SENSORY", title: "苦味の抑制：塩によるマスキング", date: "Coming Soon", link: "#" },
    { id: "Exp.88", category: "INGREDIENT", title: "肉の熟成酵素と温度管理", date: "Coming Soon", link: "#" },
    { id: "Exp.89", category: "INGREDIENT", title: "野菜の呼吸とガス置換保存", date: "Coming Soon", link: "#" },
    { id: "Exp.90", category: "REACTION", title: "フランベの共沸とアルコール残存", date: "Coming Soon", link: "#" },
    { id: "Exp.91", category: "PHYSICS", title: "チョコの分離と乳化破壊", date: "Coming Soon", link: "#" },
    { id: "Exp.92", category: "PHYSICS", title: "キサンタンガムの擬塑性流動", date: "Coming Soon", link: "#" },
    { id: "Exp.93", category: "SENSORY", title: "香りの閾値とマスキング技術", date: "Coming Soon", link: "#" },
    { id: "Exp.94", category: "TECHNIQUE", title: "熱ショック耐性とガラス器具", date: "Coming Soon", link: "#" },
    { id: "Exp.95", category: "INGREDIENT", title: "ひき肉の脂肪乳化と結着", date: "Coming Soon", link: "#" },
    { id: "Exp.96", category: "INGREDIENT", title: "豆のフィチン酸とミネラル阻害", date: "Coming Soon", link: "#" },
    { id: "Exp.97", category: "INGREDIENT", title: "転化糖の保水力と保存性", date: "Coming Soon", link: "#" },
    { id: "Exp.98", category: "INGREDIENT", title: "油の加水分解と遊離脂肪酸", date: "Coming Soon", link: "#" },
    { id: "Exp.99", category: "SENSORY", title: "辛味の科学：カプサイシンの抽出", date: "Coming Soon", link: "#" },
    { id: "Exp.100", category: "TECHNIQUE", title: "砥石の番手と刃先の微細構造", date: "Coming Soon", link: "#" }
];

const gridContainer = document.getElementById('article-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

function renderArticles(filter = 'ALL') {
    if(!gridContainer) return;
    gridContainer.innerHTML = '';
    const filteredData = filter === 'ALL' ? articles : articles.filter(item => item.category === filter);
    let delayIndex = 0;

    filteredData.forEach(item => {
        const card = document.createElement('a');
        card.href = item.link;
        card.className = 'article-card';
        
        if(item.link === "#") {
            card.classList.add('disabled');
            card.style.cursor = "default";
            card.removeAttribute('href');
        }

        card.style.animation = `fadeIn 0.5s ease forwards ${delayIndex * 0.03}s`;
        card.style.opacity = '0';

        card.innerHTML = `
            <div class="card-header">
                <span class="card-id">${item.id}</span>
                <span class="card-cat">${item.category}</span>
            </div>
            <h3 class="card-title">${item.title}</h3>
            <div class="card-footer">
                <span class="card-date">${item.date}</span>
                <span class="card-arrow">${item.link !== '#' ? '→' : '🔒'}</span>
            </div>
        `;
        gridContainer.appendChild(card);
        delayIndex++;
    });
}

if(filterButtons){
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const activeBtn = document.querySelector('.filter-btn.active');
            if(activeBtn) activeBtn.classList.remove('active');
            btn.classList.add('active');
            renderArticles(btn.dataset.filter);
        });
    });
}

const styleSheet = document.createElement("style");
styleSheet.innerText = `
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.article-card.disabled {
    opacity: 0.5;
    pointer-events: none;
    background-color: rgba(255,255,255,0.02);
}
.article-card.disabled:hover {
    background-color: rgba(255,255,255,0.02);
}
`;
document.head.appendChild(styleSheet);

renderArticles('ALL');