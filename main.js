let apikey = "77864033-5b35-4a16-9b35-363cbbb786ec";

// 画面読み込み時の初期化
window.addEventListener("DOMContentLoaded", function() {
    loadTheme();
    select();
});

// --- 取得・表示 ---
function select() {
    let url = "https://db.monaca.education/select?apikey=" + apikey;
    fetch(url)
        .then(response => response.json())
        .then(db => {
            let tbody = document.querySelector("#moneyRecord tbody");
            tbody.innerHTML = ""; // 初期化

            for (let i = 0; i < db.records.length; i++) {
                let rec = db.records[i];
                let tr = document.createElement("tr");

                let id = document.createElement("th");
                let title = document.createElement("td");
                let price = document.createElement("td");
                let flow = document.createElement("td");

                id.innerHTML = rec.id;
                title.innerHTML = rec.text0;
                price.innerHTML = rec.int0;
                
                let flowVal = rec.int1;
                flow.innerHTML = flowVal == 1 ? "収入" : (flowVal == -1 ? "支出" : "？？？");

                // 行クリック時に自動でフォームへセットするイベント
                tr.onclick = function() {
                    setFormForUpdate(rec.id, rec.text0, rec.int0, flowVal);
                };

                tr.appendChild(id);
                tr.appendChild(title);
                tr.appendChild(price);
                tr.appendChild(flow);
                tbody.appendChild(tr);
            }

            // 集計処理
            let incomeTotal = 0;
            let outgoTotal = 0;
            for (let i = 0; i < db.records.length; i++) {
                if (db.records[i].int1 == 1) {
                    incomeTotal += db.records[i].int0;
                } else if (db.records[i].int1 == -1) {
                    outgoTotal += db.records[i].int0;
                }
            }
            document.getElementById("incomeTotal").innerHTML = incomeTotal;
            document.getElementById("outgoTotal").innerHTML = outgoTotal;
            document.getElementById("money").innerHTML = incomeTotal - outgoTotal;
        });
}

// --- 表のクリックからフォームへ値を自動入力して修正モードへ移行 ---
function setFormForUpdate(id, title, price, flow) {
    let form = document.getElementById("mainForm");
    
    // ラジオボタンを修正にセット
    form.mode.value = "update";
    switchMode();

    // 各項目に入力値を格納
    form.id.value = id;
    form.title.value = title;
    form.price.value = price;
    form.flow.value = flow;

    // フォームへスクロール
    form.scrollIntoView({ behavior: 'smooth' });
}

// --- フォーム表示の切り替え ---
function switchMode() {
    let form = document.getElementById("mainForm");
    let mode = form.mode.value;

    let idField = document.getElementById("idField");
    let detailFields = document.getElementById("detailFields");
    let submitBtn = document.getElementById("submitBtn");

    if (mode === "insert") {
        idField.style.display = "none";
        detailFields.style.display = "block";
        submitBtn.innerText = "登録する";
        form.classList.remove("delete-mode");
    } else if (mode === "update") {
        idField.style.display = "block";
        detailFields.style.display = "block";
        submitBtn.innerText = "更新する";
        form.classList.remove("delete-mode");
    } else if (mode === "delete") {
        idField.style.display = "block";
        detailFields.style.display = "none";
        submitBtn.innerText = "削除する";
        form.classList.add("delete-mode");
    }
}

// --- 実行ボタン押下時の処理振り分け ---
function executeAction() {
    let form = document.getElementById("mainForm");
    let mode = form.mode.value;

    if (mode === "insert") {
        insert();
    } else if (mode === "update") {
        update();
    } else if (mode === "delete") {
        deleteDB();
    }
}

// --- DB操作（登録・更新・削除） ---
function insert() {
    let form = document.getElementById("mainForm");
    let title = form.title.value;
    let price = form.price.value;
    let flow = form.flow.value;

    let url = "https://db.monaca.education/insert?apikey=" + apikey;
    url += "&text0=" + encodeURIComponent(title) + "&int0=" + price + "&int1=" + flow;
    fetch(url)
        .then(response => response.json())
        .then(() => location.reload());
}

function update() {
    let form = document.getElementById("mainForm");
    let id = form.id.value;
    let title = form.title.value;
    let price = form.price.value;
    let flow = form.flow.value;

    let url = "https://db.monaca.education/update?apikey=" + apikey;
    url += "&idIn=" + id + "&text0=" + encodeURIComponent(title) + "&int0=" + price + "&int1=" + flow;
    fetch(url)
        .then(response => response.json())
        .then(() => location.reload());
}

function deleteDB() {
    let form = document.getElementById("mainForm");
    let id = form.id.value;

    let url = "https://db.monaca.education/delete?apikey=" + apikey;
    url += "&idIn=" + id;
    fetch(url)
        .then(response => response.json())
        .then(() => location.reload());
}

// --- テーマ切り替え関数 ---
function changeTheme() {
    let select = document.getElementById("themeSelect");
    let selectedTheme = select.value;

    document.body.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("appTheme", selectedTheme);
}

function loadTheme() {
    let savedTheme = localStorage.getItem("appTheme");
    if (savedTheme) {
        document.body.setAttribute("data-theme", savedTheme);
        let select = document.getElementById("themeSelect");
        if (select) {
            select.value = savedTheme;
        }
    }
}