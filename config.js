/* =========================================================
   La Bella Estética · dados editáveis do site
   Mudou telefone, horário ou feriado? Edite só aqui.
   ========================================================= */
window.CONFIG = {
  versao: "labella-prototipo-v1",

  // WhatsApp só com números: 55 + DDD + número.
  // ATENÇÃO: o Google mostra (92) 98182-2850; a capa do Instagram mostra (92) 98111-2850.
  // Confirmar com a clínica qual é o de agendamento.
  whatsapp: "5592981822850",
  telefoneTexto: "(92) 98182-2850",
  instagram: "dra.lorrenebarroco", // Instagram é o da Dra. (a capa antiga cita @clinica_labella)

  endereco: "Av. Gabriel Corrêa Pedrosa, 387 A, Parque Dez, Manaus - AM, 69055-011",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Cl%C3%ADnica%20La%20Bella%20Est%C3%A9tica%20Dra.%20Lorrene%20Barroco&query_place_id=ChIJMWTQbqkbbJIR6KT5vrnen-4",
  avaliacoesUrl: "https://search.google.com/local/reviews?placeid=ChIJMWTQbqkbbJIR6KT5vrnen-4",

  // Horário de funcionamento. 0 = domingo ... 6 = sábado. null = fechado.
  horarios: {
    0: null,
    1: ["09:00", "18:00"],
    2: ["09:00", "18:00"],
    3: ["09:00", "18:00"],
    4: ["09:00", "18:00"],
    5: ["09:00", "18:00"],
    6: ["09:00", "13:00"]
  },

  // Feriados e dias com horário diferente. abre/fecha null = fechado.
  // Ex.: { data: "2026-11-02", nome: "Finados", abre: null, fecha: null }
  excecoes: [],

  // Faixas de aviso no topo (somem sozinhas depois de "ate").
  // Ex.: { de: "2026-11-01", ate: "2026-11-30", texto: "Novembro: agenda de fim de ano aberta.", curto: "Agenda de fim de ano aberta" }
  avisos: [],

  // Medição sem cookies (Umami). Vazio = desligado.
  umamiId: ""
};
