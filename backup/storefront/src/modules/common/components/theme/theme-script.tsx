import Script from "next/script"

// Questo script è progettato per essere eseguito prima di tutto.
// Legge il tema da localStorage e imposta data-theme e la classe su <html>.
// È fondamentale per evitare il "flicker" del tema al caricamento della pagina.
const themeLoaderScript = `
(function() {
  try {
    var theme = localStorage.getItem('theme');
    var userSet = localStorage.getItem('theme_user_set');
    var themeToApply = null;

    if (theme && userSet === '1') {
      themeToApply = theme;
    } else {
      var month = new Date().getMonth() + 1;
      if (month >= 3 && month <= 5) themeToApply = 'spring';
      else if (month >= 6 && month <= 8) themeToApply = 'summer';
      else if (month >= 9 && month <= 11) themeToApply = 'autumn';
      else themeToApply = 'winter';
    }
    
    if (themeToApply) {
      document.documentElement.setAttribute('data-theme', themeToApply);
      document.documentElement.className = 'theme-' + themeToApply;
    }
  } catch (e) {
    // In caso di errore (es. localStorage non disponibile), non fare nulla.
  }
})();
`

const ThemeScript = () => {
  return (
    <Script
      id="theme-loader"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: themeLoaderScript,
      }}
    />
  )
}

export default ThemeScript