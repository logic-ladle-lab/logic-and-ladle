/*
 * Regenerate articles 12-20 with upgraded, on-brand visuals.
 * Text content is preserved from the original batch; only the diagrams and
 * charts are replaced with the reusable SVG/flow components.
 *
 *   node build/generate-articles.js
 */
const fs = require('fs');
const path = require('path');
const { svgChart, svgBars, flowDiagram, compareGrid, spectrum } = require('./components');

const ACCENT = '#D4AF37';
const ROOT = path.join(__dirname, '..');

const articles = [
  {
    id: '12', category: 'Texture / Hydrocolloids', header_class: 'header-pec',
    title: 'ペクチンのゲル化メカニズム：<br>ジャムとテリーヌの「固まる」条件',
    lead: 'ジャムが固まる時、鍋の中で何が起きているのか。<br>果物に含まれるペクチン、糖、酸の絶妙なバランスが生み出すゲル化の科学。<br>ゼラチンとは異なる「植物性凝固剤」の特性を理解する。',
    h2_1: '1.0 序論：ペクチンとは何か？',
    p_1: 'ペクチンは植物の細胞壁に含まれる多糖類であり、細胞同士を繋ぎ止める「セメント」のような役割を果たしている。<br>これを加熱して抽出し、特定の条件下で再結合させることで、ジャムのようなゲル構造を作ることができる。',
    h2_2: '2.0 ゲル化モデル：網目構造の形成',
    p_2: 'ペクチンのゲル化には主に2つのタイプがある。<br>HMペクチン（高メトキシル）は、多量の糖と酸による脱水作用で水素結合を作る（ジャム）。<br>LMペクチン（低メトキシル）は、カルシウムイオンとの架橋結合（エッグボックス構造）でゲル化する（フルーチェなど）。',
    diagram: flowDiagram('Pectin Network Model', [
      [{ main: 'HMペクチン', sub: '高メトキシル' }, { main: '糖 + 酸' }, { main: '水素結合', sub: 'ジャム', accent: true }],
      [{ main: 'LMペクチン', sub: '低メトキシル' }, { main: 'カルシウム' }, { main: 'イオン架橋', sub: 'エッグボックス構造', accent: true }],
    ]),
    h2_3: '3.0 制御理論：糖度とpH',
    p_3: 'ジャム作りで失敗する（固まらない）最大の原因は、pHの調整不足だ。<br>ペクチン分子が反発しあう電荷を打ち消すために、pHを2.8〜3.5付近にする必要がある。',
    chart: svgChart({
      uid: 'a12', title: 'Gel Strength vs pH',
      series: [{ points: [[0, 0.06], [0.18, 0.42], [0.4, 0.97], [0.66, 0.5], [1, 0.12]], color: ACCENT }],
      xTicks: [{ at: 0, text: 'pH 2.0' }, { at: 0.4, text: 'pH 3.2 (適)' }, { at: 1, text: 'pH 5.0' }],
      annotations: [{ x: 0.4, y: 0.97, text: 'Optimal' }],
      caption: '※pH 2.8〜3.5 でゲル強度が最大になる。',
    }),
    protocols: [
      ['Protocol A: ジャムのpH調整', 'レモン汁を加えるのは風味のためだけではない。pHを下げてゲル化を促進させる物理的スイッチの役割がある。'],
      ['Protocol B: 低糖度ジャムの難しさ', '砂糖を減らすと脱水作用が弱まり、HMペクチンでは固まらない。この場合はLMペクチンまたはカルシウム添加が必要になる。'],
      ['Protocol C: パート・ド・フリュイ', '果汁を煮詰めて作るゼリー菓子。ペクチン濃度と糖度を限界まで高めることで、しっかりとした弾力を生み出す。'],
    ],
  },
  {
    id: '13', category: 'Fermentation', header_class: 'header-lac',
    title: '乳酸発酵の制御：<br>ザワークラウトとピクルスの微生物学',
    lead: '保存食作りは、目に見えない微生物との対話だ。<br>腐敗菌を排除し、乳酸菌だけを優遇する環境設計。<br>塩分濃度と温度管理が織りなす発酵のバリア。',
    h2_1: '1.0 序論：腐敗と発酵の境界線',
    p_1: '人間にとって有益な物質を生み出すのが「発酵」、有害なものが「腐敗」。<br>科学的にはどちらも微生物による有機物の分解だが、我々はそのプロセスをコントロールすることができる。',
    h2_2: '2.0 発酵モデル：乳酸菌の優位性',
    p_2: '野菜の表面には様々な菌がいる。塩を加えることで、塩に弱い腐敗菌を淘汰し、塩に強い乳酸菌（LAB）だけが増殖できるフィールドを作る（選択培地）。<br>乳酸菌が糖を食べて「乳酸」を出し始めると、pHが下がり、酸性環境となって他の菌はさらに生きられなくなる。',
    diagram: flowDiagram('Lacto-Fermentation Cycle', [[
      { main: '塩を添加' }, { main: '腐敗菌を排除' }, { main: '乳酸菌が増殖' }, { main: '乳酸生成・pH低下' }, { main: '保存バリア完成', accent: true },
    ]]),
    h2_3: '3.0 制御理論：塩分濃度とpH降下',
    p_3: '安全な発酵のためには、初期段階で素早くpHを下げる必要がある。<br>塩分濃度2%が一般的に安全と味のバランスが良いラインとされる。',
    chart: svgChart({
      uid: 'a13', title: 'pH Drop over Time',
      series: [{ points: [[0, 1], [0.3, 0.62], [0.6, 0.32], [1, 0.14]], color: ACCENT }],
      yTicks: [{ at: 1, text: 'pH 7.0' }, { at: 0.14, text: 'pH 3.5' }],
      xTicks: [{ at: 0, text: 'Day 0' }, { at: 1, text: 'Days →' }],
      caption: '※初期にpHを素早く下げるほど雑菌リスクが減る。',
    }),
    protocols: [
      ['Protocol A: 2%の塩分ルール', '野菜の総重量（水分込み）に対して2%の塩。これが乳酸菌には快適で、雑菌には厳しい黄金比。'],
      ['Protocol B: 嫌気状態の維持', '乳酸菌の多くは嫌気性（空気を嫌う）または通性嫌気性。食材を液面より下に押し込み、空気から遮断することで、好気性のカビ（産膜酵母）を防ぐ。'],
      ['Protocol C: 温度管理', '20〜25℃が発酵に適している。冬場は時間がかかり、夏場は過発酵になりやすい。'],
    ],
  },
  {
    id: '14', category: 'Protein / Fish', header_class: 'header-fish',
    title: '死後硬直とATP分解：<br>魚の「熟成（Aging）」におけるイノシン酸生成',
    lead: '「新鮮な魚＝美味しい」は必ずしも真実ではない。<br>魚の死後、筋肉の中で静かに進行する生化学反応。<br>ATPが旨味成分イノシン酸に変わる時、魚は食材としてのピークを迎える。',
    h2_1: '1.0 序論：活け締めと熟成',
    p_1: '釣り上げた直後の魚は、まだ筋肉がエネルギー（ATP）を持っており、プリプリしているが旨味は少ない。<br>時間が経つにつれ、ATPが分解されて旨味成分に変わる。これを意図的に管理するのが「熟成」だ。',
    h2_2: '2.0 分解モデル：ATPからIMPへ',
    p_2: 'エネルギー通貨であるATP（アデノシン三リン酸）は、死後、酵素によって分解されていく。<br>ATP → ADP → AMP → IMP（イノシン酸）。このIMPこそが、魚の旨味の主役である。<br>さらに分解が進むと、イノシン（HxR）やヒポキサンチン（Hx）になり、鮮度が落ちて臭みが出る。',
    diagram: flowDiagram('ATP Degradation Pathway', [[
      { main: 'ATP', sub: 'エネルギー' }, { main: 'ADP' }, { main: 'AMP' }, { main: 'IMP', sub: 'イノシン酸・旨味', accent: true }, { main: 'HxR', sub: '無味' }, { main: 'Hx', sub: '苦味・腐敗' },
    ]]),
    h2_3: '3.0 制御理論：K値と熟成期間',
    p_3: '旨味のピークは魚種やサイズ、締め方によって異なる。<br>神経締めをしてATPを温存した魚は、死後硬直の開始を遅らせることができ、より長く熟成させることができる。',
    chart: svgChart({
      uid: 'a14', title: 'Umami (IMP) vs Aging Time',
      series: [{ points: [[0, 0.16], [0.5, 1], [1, 0.12]], color: ACCENT }],
      xTicks: [{ at: 0, text: 'Fresh' }, { at: 0.5, text: 'Aging Peak' }, { at: 1, text: 'Rotten' }],
      annotations: [{ x: 0.5, y: 1, text: 'Peak' }],
      caption: '※イノシン酸は熟成中に増え、ピーク後は減少していく。',
    }),
    protocols: [
      ['Protocol A: 神経締めの効果', '脳からの信号を断つことで、死後硬直までの時間を稼ぎ、ATPの浪費を防ぐ（元エネルギーを残す）。'],
      ['Protocol B: 脱水処理', '熟成中は水分が大敵。ピチットシートなどで余分な水分とドリップを取り除き、臭みの発生とバクテリアの増殖を抑える。'],
      ['Protocol C: 魚種による違い', '白身魚はイノシン酸の分解が遅く熟成に向く。赤身魚（マグロなど）は酸味が出やすいため、熟成の管理がシビアになる。'],
    ],
  },
  {
    id: '15', category: 'Heat Transfer / Sous-vide', header_class: 'header-sousvide',
    title: '真空調理 (Sous-vide) の熱力学：<br>空気断熱の排除と精密温度管理',
    lead: '0.1℃単位の温度制御が可能にする、かつてない食感。<br>「焼く」「煮る」とは根本的に異なる、熱伝達の物理学。<br>なぜ袋に入れるのか？なぜ時間がかかるのか？その理由を解き明かす。',
    h2_1: '1.0 序論：空気は最悪の熱伝導体',
    p_1: '従来のオーブン調理の弱点は「空気」だ。空気は熱を伝えるのが非常に下手（断熱材）である。<br>真空包装することで食材と熱源（お湯）の間の空気を排除し、効率的かつ均一な熱伝導を実現するのが真空調理の真髄だ。',
    h2_2: '2.0 加熱モデル：均一加熱と殺菌',
    p_2: 'タンパク質変性温度（例えば60℃）を狙い撃ちにし、それ以上の温度を与えない。<br>「オーバークック（焼きすぎ）」が物理的に起こり得ないシステムである。<br>ただし、低い温度で調理するため、時間をかけて低温殺菌（パストライゼーション）する必要がある。',
    diagram: compareGrid([
      { title: 'Water 💧', body: '高い熱伝導率。効率的に、かつ均一に熱が伝わる。' },
      { title: 'Air 🌫', body: '低い熱伝導率。実は優れた「断熱材」。' },
      { title: 'Vacuum ⊘', body: '空気を除去し、お湯から食材へ直接伝熱。' },
    ]),
    h2_3: '3.0 制御理論：温度と時間の関係（D値）',
    p_3: '殺菌は「温度」だけでなく「時間」との掛け算で決まる。<br>63℃で30分加熱するのと、75℃で1分加熱するのは、殺菌効果としては同等になり得る（D値の概念）。',
    chart: svgChart({
      uid: 'a15', title: 'Pasteurization Time vs Temp',
      series: [{ points: [[0, 1], [0.5, 0.42], [1, 0.08]], color: ACCENT }],
      yTicks: [{ at: 1, text: '長時間' }, { at: 0.08, text: '短時間' }],
      xTicks: [{ at: 0, text: '55°C' }, { at: 1, text: '75°C' }],
      caption: '※温度が高いほど、必要な加熱（殺菌）時間は短くなる。',
    }),
    protocols: [
      ['Protocol A: 58℃・63℃・68℃の法則', '58℃（ミディアムレア）、63℃（コラーゲン変性開始）、68℃（分水嶺）。この3つの温度帯を使い分ける。'],
      ['Protocol B: 2段階加熱', '例えば野菜なら85℃でペクチンを壊し、肉なら58℃でキープする。食材によって最適な温度帯が全く異なるため、同時調理は難しい。'],
      ['Protocol C: 危険温度帯の回避', '30℃〜50℃は菌が最も繁殖する温度。この帯域をいかに素早く通過させるかが衛生管理の鍵。'],
    ],
  },
  {
    id: '16', category: 'Carbohydrate / Sugar', header_class: 'header-sugar',
    title: '砂糖の熱分解と結晶化：<br>フォンダン、キャラメル、飴細工の相図',
    lead: '砂糖は温度によって変幻自在に姿を変える、食べるガラス素材。<br>シロップから糸引き、そしてカラメルへ。<br>温度計片手に挑む、甘美なる相転移（Phase Transition）。',
    h2_1: '1.0 序論：1℃の違いが別世界',
    p_1: '製菓において砂糖の煮詰め温度は絶対的だ。113℃（フォンダン）と118℃（キャラメル）では、冷え固まった時の結晶構造と食感が全く異なる。',
    h2_2: '2.0 変化モデル：脱水と濃縮',
    p_2: '砂糖水を加熱すると、水分が蒸発して沸点が上昇していく（沸点上昇）。<br>沸点の温度を知ることは、すなわちシロップの「糖分濃度（水分含有量）」を知ることと同義である。',
    diagram: flowDiagram('Sugar Boiling Stages', [[
      { main: '100°C', sub: 'シロップ' }, { main: '115°C', sub: 'ソフトボール' }, { main: '150°C', sub: 'ハードクラック' }, { main: '170°C', sub: 'カラメル', accent: true },
    ]]),
    h2_3: '3.0 制御理論：再結晶化の防止',
    p_3: '煮詰めたシロップは不安定な過飽和溶液であり、ちょっとした刺激（埃、衝撃）ですぐに結晶化し、ザラザラに戻ってしまう。<br>これを防ぐために「転化糖（グルコース・フルクトース）」や酸（レモン汁）を加える。',
    chart: svgChart({
      uid: 'a16', title: 'Temperature vs State',
      series: [{ points: [[0, 0.1], [0.3, 0.32], [0.6, 0.62], [0.85, 0.85], [1, 0.96]], color: '#E2912B' }],
      xTicks: [{ at: 0.05, text: 'Syrup' }, { at: 0.38, text: 'Soft Ball' }, { at: 0.68, text: 'Hard Crack' }, { at: 0.97, text: 'Caramel' }],
      caption: '※温度上昇＝水分減少＝糖濃度上昇。状態が段階的に変化する。',
    }),
    protocols: [
      ['Protocol A: 刷毛と水', '鍋の縁についた砂糖の結晶が「種」となって全体を結晶化させてしまう。濡らした刷毛で丁寧に拭き取るのがパティシエの基本動作。'],
      ['Protocol B: 転化糖の添加', '分子構造の違う糖（水飴や蜂蜜、トリモリン）を混ぜることで、スクロースの綺麗な結晶形成を邪魔し、滑らかな状態を保つ。'],
      ['Protocol C: かき混ぜ厳禁', '煮詰めている最中にスプーンを入れてはいけない。物理的刺激が結晶化のトリガーとなる。'],
    ],
  },
  {
    id: '17', category: 'Flavor / Taste', header_class: 'header-taste',
    title: '味の相互作用 (Taste Interaction)：<br>抑制・対比・相乗効果の生理学',
    lead: '「スイカに塩」は迷信ではない。<br>舌の上で起こるシグナルの上書きと増幅。<br>5つの基本味が複雑に絡み合い、脳内で「美味しさ」に変換されるメカニズム。',
    h2_1: '1.0 序論：1+1≠2の世界',
    p_1: '味には主に3つの相互作用がある。<br>1. 相乗効果（強め合う）<br>2. 抑制効果（打ち消す）<br>3. 対比効果（際立たせる）<br>これらを操ることで、食材のポテンシャル以上の味を引き出せる。',
    h2_2: '2.0 受容体モデル：シグナル伝達',
    p_2: '味覚は舌の受容体が化学物質をキャッチし、電気信号として脳に送ることで感じる。<br>ある味が別の味の信号をブロックしたり、逆に感度を高めたりする。',
    diagram: compareGrid([
      { title: '相乗 Synergy', body: 'グルタミン酸 × イノシン酸 ＝ 旨味 約7倍。' },
      { title: '抑制 Suppression', body: '酸味 + 甘味 → 角が取れてまろやかに。' },
      { title: '対比 Contrast', body: '甘味 + 少量の塩 → 甘さが引き立つ（スイカ）。' },
    ]),
    h2_3: '3.0 制御理論：黄金比',
    p_3: 'グルタミン酸（昆布・野菜）とイノシン酸（魚・肉）を1:1で合わせると、旨味強度は単体の7〜8倍に跳ね上がる。<br>これが日本料理の「出汁」や、ブイヨン、ラーメンスープの正体だ。',
    chart: svgChart({
      uid: 'a17', title: 'Umami Intensity Synergy',
      series: [{ points: [[0, 0.28], [0.5, 1], [1, 0.28]], color: ACCENT }],
      xTicks: [{ at: 0, text: 'Glu Only' }, { at: 0.5, text: '50:50 Mix' }, { at: 1, text: 'Imp Only' }],
      annotations: [{ x: 0.5, y: 1, text: '×7-8' }],
      caption: '※グルタミン酸とイノシン酸が1:1のとき相乗効果が最大化する。',
    }),
    protocols: [
      ['Protocol A: 酢飯の砂糖', '酢だけでは酸っぱすぎて食べられないが、砂糖と塩を加えることで酸味（の感じ方）を抑制し、まろやかにしている。'],
      ['Protocol B: アンチョビの隠し味', 'トマトソース（グルタミン酸）にアンチョビ（イノシン酸）を少量加えることで、魚臭さを出さずに全体の旨味だけを増幅させる。'],
      ['Protocol C: シェフの塩加減', '塩味は他の味（苦味など）を抑制する効果がある。微量の塩が素材の甘みを引き立てる（対比効果）瞬間を見極める。'],
    ],
  },
  {
    id: '18', category: 'Vegetable / Pigment', header_class: 'header-chloro',
    title: 'クロロフィルの退色防止：<br>緑色野菜を鮮やかに茹でるpHと酵素の戦い',
    lead: '鮮やかな緑色の野菜は、食卓の宝石だ。<br>茹でると色が褪せてしまう悲劇を防ぐ。<br>マグネシウムイオンと酸の攻防戦を制するケミカル・クッキング。',
    h2_1: '1.0 序論：美しさは美味しさ',
    p_1: 'ほうれん草やインゲンの鮮やかな緑色は「クロロフィル（葉緑素）」によるものだ。<br>しかし、加熱や酸によって容易に「フェオフィチン」という褐色物質に変化してしまう。',
    h2_2: '2.0 退色モデル：マグネシウムの脱落',
    p_2: 'クロロフィルの中心にはマグネシウムイオン（Mg²⁺）が存在する。<br>加熱により細胞内の有機酸が漏れ出し、酸性になると、このMgが水素イオンと入れ替わってしまう。これが褐色の正体だ。',
    diagram: flowDiagram('Chlorophyll Degradation', [[
      { main: 'クロロフィル', sub: '中心にMg・鮮やかな緑', accent: true }, { main: '+ 酸 / 加熱' }, { main: 'Mg → 水素 に置換' }, { main: 'フェオフィチン', sub: 'オリーブ褐色' },
    ]]),
    h2_3: '3.0 制御理論：アルカリと急冷',
    p_3: 'Mgの脱落を防ぐには、茹で湯を酸性にしないことが重要だ。<br>また、茹でた後にすぐに冷水に取る（ショック）ことで、余熱による化学反応を強制停止させる。',
    chart: svgChart({
      uid: 'a18', title: 'Green Color vs pH',
      series: [{ points: [[0, 0.14], [0.5, 0.5], [1, 0.9]], color: '#3FB66B' }],
      xTicks: [{ at: 0, text: '酸性 (褐色)' }, { at: 1, text: 'アルカリ性 (鮮緑)' }],
      caption: '※茹で湯が酸性に傾くほど、鮮やかな緑は失われる。',
    }),
    protocols: [
      ['Protocol A: たっぷりの湯', '少量の湯で茹でると、野菜から出た酸でpHが下がりやすい。大量の湯を使うことで酸を希釈する。'],
      ['Protocol B: 蓋をしない', '野菜から揮発する有機酸を空気中に逃がすため、茹でる時は蓋をしてはいけない。'],
      ['Protocol C: 重曹の魔法と罠', '重曹を加えてアルカリ性にすると色は鮮やかになるが、細胞壁（ペクチン）が分解されすぎて食感がグズグズになるリスクがある。使い所には注意が必要。'],
    ],
  },
  {
    id: '19', category: 'Vegetable / Pigment', header_class: 'header-antho',
    title: 'アントシアニンのpH変色：<br>赤キャベツとナスの色を操るイオン化学',
    lead: '紫色は、自然界で最も不安定で美しい色の一つ。<br>酸で赤に、アルカリで青に。<br>pH指示薬として振る舞う色素をコントロールし、皿の上に魔法をかける。',
    h2_1: '1.0 序論：カメレオン色素',
    p_1: '紫キャベツ、ナス、ブルーベリーなどに含まれる「アントシアニン」は、pHによって分子構造を変え、色を劇的に変化させる。<br>料理人はこの性質を利用して、意図した色を作り出せる。',
    h2_2: '2.0 変色モデル：構造変化',
    p_2: '酸性側では「フラビリウムイオン」となり鮮やかな赤色を呈する。<br>中性〜アルカリ性に向かうにつれ、紫〜青〜緑と変化していく。<br>ナスの漬物にミョウバン（アルミニウム）や鉄釘を入れるのは、金属イオンと結合させて青紫色（錯体）を安定させるためだ。',
    diagram: spectrum('Anthocyanin Color Scale', 'linear-gradient(to right, #d7263d, #8e44ad, #2e6fdb, #2ecc71)', ['pH 2 (赤)', 'pH 7 (紫)', 'pH 11 (青〜緑)']),
    h2_3: '3.0 制御理論：酸の添加',
    p_3: '赤キャベツのマリネ（ザワークラウト）が鮮やかなピンク色なのは、酢や乳酸によって酸性になっているからだ。<br>逆に、変色させたくない場合はpHを中性に保つ工夫が必要になる。',
    chart: svgBars({
      title: 'Color Stability with Metal Ions',
      bars: [
        { label: '金属なし', value: 0.4, color: '#888', sub: '退色' },
        { label: 'Al / Fe あり', value: 0.85, color: ACCENT, sub: '安定' },
      ],
      caption: '※ミョウバンや鉄イオンと錯体を作ると、青紫色が安定する。',
    }),
    protocols: [
      ['Protocol A: マリネの鮮赤化', '赤キャベツやラディッシュは、酢を加えることで鮮やかなルビー色になる。加熱してもこの色は比較的安定する。'],
      ['Protocol B: ナスの色止め', '油でコーティングして水（と酸素）との接触を断つか、鉄・ミョウバンと共に漬け込むことで、あの美しい紺色を維持できる。'],
      ['Protocol C: 驚きの青い焼きそば', '中華麺（かん水＝アルカリ性）と紫キャベツを炒めると、麺が緑〜青色になる（理科実験として有名）。レモンをかけるとピンクに戻る。'],
    ],
  },
  {
    id: '20', category: 'Physics / Tool', header_class: 'header-micro',
    title: '電子レンジの誘電加熱 (Dielectric Heating)：<br>マイクロ波が「内側から」温める嘘と真実',
    lead: '「レンジは手抜き」という偏見を捨てよ。<br>水分子を振動させ、食材そのものを発熱体に変える唯一の加熱法。<br>マイクロ波の物理特性を知れば、レンジは最強の調理器具になる。',
    h2_1: '1.0 序論：外からか、内からか',
    p_1: 'オーブンやフライパンは「外部加熱（伝導・対流）」であり、熱は外から中へ徐々に伝わる。<br>電子レンジは「内部発熱（誘電加熱）」であり、電波が届く範囲であれば、内部の水分子が一斉に発熱する。',
    h2_2: '2.0 加熱モデル：双極子回転',
    p_2: 'マイクロ波（2.45GHz）は、水分子のプラスとマイナスの極を激しく反転させる。<br>水分子同士が摩擦を起こし、熱エネルギーが発生する。したがって、水分を含まない皿や乾燥した食品は温まらない。',
    diagram: flowDiagram('Microwave Dipole Rotation', [[
      { main: 'マイクロ波', sub: '2.45GHz (+/−)' }, { main: '水分子が反転', sub: '極性に整列' }, { main: '分子同士が摩擦' }, { main: '発熱', sub: 'HEAT', accent: true },
    ]]),
    h2_3: '3.0 制御理論：浸透深度と定在波',
    p_3: '「内側から温まる」と言われるが、マイクロ波にも「浸透できる深さ」の限界がある。<br>また、庫内で電波が強め合う場所と弱め合う場所（定在波）ができ、これも加熱ムラの原因となる。',
    chart: svgChart({
      uid: 'a20', title: 'Heating Speed: Pure Water vs Salt Water',
      series: [
        { points: [[0, 0], [1, 0.95]], color: '#E57373', dashed: true, label: 'Salt Water', area: false },
        { points: [[0, 0], [1, 0.58]], color: '#4FC3F7', label: 'Pure Water', area: false },
      ],
      xTicks: [{ at: 1, text: 'Time →' }],
      caption: '※塩分はイオンが電波を吸収するため、純水より速く加熱される。',
    }),
    protocols: [
      ['Protocol A: 塩分とスピード', '塩はイオンを含み電波を吸収しやすいため、塩気のある部分は異常に早く熱くなる。温め直しで「外は熱々、中は冷たい」現象の一因。'],
      ['Protocol B: 爆発防止', '卵やタラコなど膜に包まれた食材は、内部で発生した水蒸気の逃げ場がなくなり爆発する。必ず穴を開ける。'],
      ['Protocol C: 600W vs 200W', '強いワット数は加熱ムラを生みやすい。解凍や煮込みには低ワット数を使い、熱伝導による均一化（休ませる時間）を計算に入れる。'],
    ],
  },
];

const protocolHtml = (title, desc) => `
                            <h3>${title}</h3>
                            <p>${desc}</p>`;

function render(a) {
  const title_text = a.title.replace(/<br>/g, ' ');
  const protocols = a.protocols.map(([t, d]) => protocolHtml(t, d)).join('');
  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title_text} - LOGIC & LADLE</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&family=Roboto+Mono:wght@300;400&family=Shippori+Mincho+B1:wght@500;700&display=swap" rel="stylesheet">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
</head>
<body>
    <header>
        <div class="logo-area">
            <a href="index.html" class="site-logo">LOGIC & LADLE</a>
            <p class="site-desc">Experimental Food Science Lab.</p>
        </div>
        <nav class="site-nav">
            <a href="index.html">TOP</a>
            <a href="#">About</a>
        </nav>
    </header>

    <main class="article-container">
        <article>
            <div class="article-header ${a.header_class}">
                <span class="article-id">Exp.${a.id}</span>
                <span class="category-tag">${a.category}</span>
                <h1 class="article-main-title">${a.title}</h1>
                <p class="lead">${a.lead}</p>
            </div>

            <section>
                <h2>${a.h2_1}</h2>
                <p>${a.p_1}</p>
            </section>

            <section>
                <h2>${a.h2_2}</h2>
                <p>${a.p_2}</p>
                ${a.diagram}
            </section>

            <section>
                <h2>${a.h2_3}</h2>
                <p>${a.p_3}</p>
                ${a.chart}
            </section>

            <section>
                <h2>4.0 LABORATORY PROTOCOLS：実践メソッド</h2>
                ${protocols}
            </section>

            <div class="references">
                <h3>References & Further Reading</h3>
                <ul>
                    <li>[1] McGee, Harold. (2004). <em>On Food and Cooking</em>. Scribner.</li>
                    <li>[2] Myhrvold, Nathan. (2011). <em>Modernist Cuisine</em>. The Cooking Lab.</li>
                </ul>
            </div>
        </article>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-logo">LOGIC & LADLE</div>
            <div class="footer-copy">&copy; 2024 All Rights Reserved.</div>
        </div>
    </footer>
</body>
</html>
`;
}

articles.forEach((a) => {
  const file = path.join(ROOT, `article${a.id}.html`);
  fs.writeFileSync(file, render(a), 'utf8');
  console.log('✓ regenerated article' + a.id + '.html');
});
