/* ============================================
   script.js - 二進数おみくじ 最終版
   16枚札・リセットボタン機能
   ============================================ */

(function() {
    'use strict';

    // ---------- 抽選データ ----------
    const BINARY_LIST = [
        "0000", "0001", "0010", "0011",
        "0100", "0101", "0110", "0111",
        "1000", "1001", "1010", "1011",
        "1100", "1101", "1110", "1111"
    ];
    const WAIT_TIME = 2500;     // 2.5秒
    const CARD_COUNT = 16;      // 16枚

    // DOM要素
    const cardsGrid = document.getElementById('cardsGrid');
    const binaryNumber = document.getElementById('binary-number');
    const binarySuffix = document.getElementById('binary-suffix');
    const waitingMsg = document.getElementById('waiting-message');
    const resetButton = document.getElementById('resetButton');

    let isDrawing = false;
    let timeoutId = null;

    // ---------- 札を16枚生成 ----------
    function buildCards() {
        cardsGrid.innerHTML = '';
        for (let i = 0; i < CARD_COUNT; i++) {
            const card = document.createElement('div');
            card.className = 'omikuji-card';
            card.textContent = 'おみくじ';
            card.setAttribute('data-index', i);
            card.addEventListener('click', onCardClick);
            cardsGrid.appendChild(card);
        }
    }

    // ---------- 札クリック ----------
    function onCardClick(e) {
        if (isDrawing) return;
        startDrawing();
    }

    // ---------- 抽選開始 ----------
    function startDrawing() {
        isDrawing = true;

        const allCards = document.querySelectorAll('.omikuji-card');
        allCards.forEach(card => card.classList.add('disabled'));

        binaryNumber.textContent = '';
        binarySuffix.textContent = '';
        waitingMsg.textContent = '抽選中・・・';

        const randomIndex = Math.floor(Math.random() * BINARY_LIST.length);
        const selectedBinary = BINARY_LIST[randomIndex];

        timeoutId = setTimeout(() => {
            binaryNumber.textContent = selectedBinary;
            binarySuffix.textContent = '(2)';
            waitingMsg.textContent = '';

            allCards.forEach(card => card.classList.remove('disabled'));
            isDrawing = false;
            timeoutId = null;
        }, WAIT_TIME);
    }

    // ---------- リセット処理 ----------
    function resetDisplay() {
        // タイマー解除
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        // 表示を初期化
        binaryNumber.textContent = '----';
        binarySuffix.textContent = '';
        waitingMsg.textContent = '';
        // フラグ解除
        isDrawing = false;
        // 全札を有効化
        const allCards = document.querySelectorAll('.omikuji-card');
        allCards.forEach(card => card.classList.remove('disabled'));
    }

    // ---------- 初期表示 ----------
    function initializeDisplay() {
        binaryNumber.textContent = '----';
        binarySuffix.textContent = '';
        waitingMsg.textContent = '';
    }

    // ---------- スムーススクロール（遊び方リンク用） ----------
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#howto') {
                    e.preventDefault();
                    const target = document.querySelector('#howto');
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            });
        });
    }

    // ---------- 初期化 ----------
    function init() {
        buildCards();
        initializeDisplay();
        setupSmoothScroll();

        if (resetButton) {
            resetButton.addEventListener('click', resetDisplay);
        }

        window.addEventListener('beforeunload', function() {
            if (timeoutId) clearTimeout(timeoutId);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
