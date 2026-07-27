import { PlaceholderDinamico, PlaceholderResultDinamico } from '../utility/placeholder/placeholder.js';

import('../menu/aside/aside.js');
import('../pages/text/alphabetical_order/alphabetical_order.js');

const container = document.getElementById('area-text');
const traducao = JSON.parse(container?.dataset.i18n || '{}');

PlaceholderDinamico(traducao.dynamic_phrase);
PlaceholderResultDinamico(traducao.result_phrase);