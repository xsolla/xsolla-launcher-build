import ar from './ar.json';
import bg from './bg.json';
import cn from './cn.json';
import cs from './cs.json';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import fr from './fr.json';
import he from './he.json';
import it from './it.json';
import ja from './ja.json';
import ko from './ko.json';
import pl from './pl.json';
import pt from './pt.json';
import ro from './ro.json';
import ru from './ru.json';
import th from './th.json';
import tr from './tr.json';
import tw from './tw.json';
import vi from './vi.json';

const langs = {
  ar,
  bg,
  cn,
  cs,
  de,
  en,
  es,
  fr,
  he,
  it,
  ja,
  ko,
  pl,
  pt,
  ro,
  ru,
  th,
  tr,
  tw,
  vi,
};

export function text(key) {
  return langs[window.lang || 'en'][key];
}
