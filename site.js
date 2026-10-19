/* La Bella Estética · comportamento do site (protótipo v1) */
(function () {
  "use strict";
  var C = window.CONFIG || {};
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

  /* ---------- WhatsApp com mensagem pronta ---------- */
  function linkWa(texto) {
    var base = "https://wa.me/" + (C.whatsapp || "");
    return texto ? base + "?text=" + encodeURIComponent(texto) : base;
  }
  document.querySelectorAll("[data-wa]").forEach(function (a) {
    a.href = linkWa(a.getAttribute("data-wa"));
    a.addEventListener("click", function () { evento("whatsapp_click", { texto: a.getAttribute("data-wa").slice(0, 60) }); });
  });
  if (C.instagram) {
    document.querySelectorAll("[data-ig]").forEach(function (a) {
      a.href = "https://www.instagram.com/" + C.instagram + "/";
      a.addEventListener("click", function () { evento("instagram_click"); });
    });
  }
  if (C.mapsUrl) document.querySelectorAll("[data-maps]").forEach(function (a) { a.href = C.mapsUrl; a.addEventListener("click", function () { evento("abrir_maps"); }); });
  if (C.avaliacoesUrl) document.querySelectorAll("[data-avaliacoes]").forEach(function (a) { a.href = C.avaliacoesUrl; });
  if (C.telefoneTexto) document.querySelectorAll("[data-tel]").forEach(function (s) { s.textContent = C.telefoneTexto; });

  /* ---------- Hora de Manaus ---------- */
  function agoraManaus() {
    try {
      var p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Manaus", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short" }).formatToParts(new Date());
      var o = {}; p.forEach(function (x) { o[x.type] = x.value; });
      var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
      return { data: o.year + "-" + o.month + "-" + o.day, dia: wd, min: parseInt(o.hour, 10) * 60 + parseInt(o.minute, 10) };
    } catch (e) {
      var d = new Date(Date.now() - 4 * 3600 * 1000);
      return { data: d.toISOString().slice(0, 10), dia: d.getUTCDay(), min: d.getUTCHours() * 60 + d.getUTCMinutes() };
    }
  }
  function aMin(h) { var x = h.split(":"); return +x[0] * 60 + +x[1]; }
  function fmt(h) { var x = h.split(":"); return (+x[0]) + "h" + (x[1] !== "00" ? x[1] : ""); }
  function somaDias(iso, n) { var d = new Date(iso + "T12:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

  function horarioDo(iso, dia) {
    var ex = (C.excecoes || []).filter(function (e) { return e.data === iso; })[0];
    if (ex) return ex.abre ? [ex.abre, ex.fecha] : null;
    return (C.horarios || {})[dia] || null;
  }

  function status() {
    var n = agoraManaus();
    var hoje = horarioDo(n.data, n.dia);
    if (hoje && n.min >= aMin(hoje[0]) && n.min < aMin(hoje[1])) return { aberto: true, txt: "Aberto agora · fecha às " + fmt(hoje[1]) };
    if (hoje && n.min < aMin(hoje[0])) return { aberto: false, txt: "Fechado agora · abre hoje às " + fmt(hoje[0]) };
    for (var i = 1; i <= 7; i++) {
      var iso = somaDias(n.data, i), d = (n.dia + i) % 7, h = horarioDo(iso, d);
      if (h) return { aberto: false, txt: "Fechado agora · abre " + (i === 1 ? "amanhã" : DIAS[d]) + " às " + fmt(h[0]) };
    }
    return { aberto: false, txt: "Fechado agora" };
  }
  function pintaStatus() {
    var s = status();
    document.querySelectorAll("[data-status]").forEach(function (el) {
      el.classList.toggle("aberto", s.aberto);
      var t = el.querySelector("[data-status-txt]"); if (t) t.textContent = s.txt;
    });
    var n = agoraManaus();
    document.querySelectorAll(".horas tr").forEach(function (tr) {
      var d = +tr.getAttribute("data-dia");
      tr.classList.toggle("hoje", d === n.dia);
      var ex = (C.excecoes || []).filter(function (e) { return e.data === n.data; })[0];
      if (d === n.dia && ex) tr.querySelector("td").textContent = ex.abre ? fmt(ex.abre) + " às " + fmt(ex.fecha) + " (" + ex.nome + ")" : "Fechado (" + ex.nome + ")";
    });
  }
  pintaStatus();
  setInterval(pintaStatus, 60000);

  /* ---------- Avisos (faixas com validade) + feriado próximo ---------- */
  (function avisos() {
    var box = document.getElementById("avisos"); if (!box) return;
    var hoje = agoraManaus().data, lista = [];
    (C.avisos || []).forEach(function (a) { if ((!a.de || hoje >= a.de) && (!a.ate || hoje <= a.ate)) lista.push(a); });
    (C.excecoes || []).forEach(function (e) {
      if (e.data >= hoje && e.data <= somaDias(hoje, 5)) {
        var dt = e.data.split("-").reverse().slice(0, 2).join("/");
        var t = e.nome + " (" + dt + "): " + (e.abre ? "atendimento das " + fmt(e.abre) + " às " + fmt(e.fecha) : "clínica fechada") + ".";
        lista.push({ texto: t, curto: e.nome + " " + dt + ": " + (e.abre ? fmt(e.abre) + "–" + fmt(e.fecha) : "fechado") });
      }
    });
    lista.forEach(function (a) {
      var div = document.createElement("div");
      div.className = "aviso" + (a.curto ? " tem-curto" : "");
      div.innerHTML = '<span class="aviso__longo"></span><span class="aviso__curto"></span>';
      div.querySelector(".aviso__longo").textContent = a.texto;
      div.querySelector(".aviso__curto").textContent = a.curto ? a.curto + " +" : "";
      if (a.curto) div.addEventListener("click", function () { div.classList.toggle("aberto"); });
      box.appendChild(div);
    });
  })();

  /* ---------- Filtro de procedimentos ---------- */
  var botoes = document.querySelectorAll("[data-filtro]");
  botoes.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filtro");
      botoes.forEach(function (x) { var on = x === b; x.classList.toggle("ativo", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      document.querySelectorAll(".proc").forEach(function (p) {
        var g = (p.getAttribute("data-grupo") || "").split(" ");
        p.hidden = !(f === "todos" || g.indexOf(f) > -1);
      });
      evento("filtro_procedimento", { grupo: f });
    });
  });

  /* ---------- Copiar endereço ---------- */
  document.querySelectorAll("[data-copiar]").forEach(function (b) {
    b.addEventListener("click", function () {
      var txt = C.endereco || "";
      var ok = function () { var o = b.textContent; b.textContent = "Endereço copiado"; setTimeout(function () { b.textContent = o; }, 1800); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(ok, ok);
      else { var t = document.createElement("textarea"); t.value = txt; document.body.appendChild(t); t.select(); try { document.execCommand("copy"); } catch (e) {} t.remove(); ok(); }
    });
  });

  /* ---------- Medição sem cookies (Umami) ---------- */
  function evento(nome, dados) { try { if (window.umami) window.umami.track(nome, dados); } catch (e) {} }
  if (C.umamiId) {
    var s = document.createElement("script");
    s.defer = true; s.src = "https://cloud.umami.is/script.js"; s.setAttribute("data-website-id", C.umamiId);
    document.head.appendChild(s);
  }
})();
