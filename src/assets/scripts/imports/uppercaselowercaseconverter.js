import { PlaceholderDinamico, PlaceholderResultDinamico } from "../utility/placeholder/placeholder";

import('../pages/text/uppercase_lowercase_converter/uppercase_lowercase_converter.js');
import("../pages/text/uppercase_lowercase_converter/Formato.js")

const container = document.getElementById('area-text');
const traducao = JSON.parse(container?.dataset.i18n || '{}');

PlaceholderDinamico();
PlaceholderResultDinamico(traducao.result_phrase);