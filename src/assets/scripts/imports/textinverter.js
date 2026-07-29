import { PlaceholderDinamico, PlaceholderResultDinamico } from "../utility/placeholder/placeholder";

import('../pages/text/text_inverter/text_inverter.js');

const container = document.getElementById('area-text');
const traducao = JSON.parse(container?.dataset.i18n || '{}');

PlaceholderDinamico();
PlaceholderResultDinamico(traducao.result_phrase);