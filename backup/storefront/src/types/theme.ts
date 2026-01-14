// Definisci i nomi dei temi accettati per evitare errori di battitura
export type ThemeName = 'default' | 'spring' | 'winter' | 'autumn' | 'summer';

// Definisci la struttura del Theme Context
export interface ThemeContextType {
  theme: ThemeName;
  changeTheme: (newTheme: ThemeName) => void;
}