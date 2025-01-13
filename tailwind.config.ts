import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'], // Тёмная тема активируется через класс
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'], // Файлы, в которых Tailwind будет искать классы
  theme: {
    extend: {
      container: {
        center: true, // Центрирование контейнера
        padding: {
          DEFAULT: '1rem', // Отступы по умолчанию для всех экранов
          sm: '2rem', // Отступы для экранов от 640px
          lg: '4rem', // Отступы для экранов от 1024px
        },
        screens: {
          sm: '640px', // Маленькие экраны
          md: '768px', // Планшеты
          lg: '1024px', // Ноутбуки
          xl: '1280px', // Большие экраны
        },
      },
      colors: {
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)', // Большие скругления
        md: 'calc(var(--radius) - 2px)', // Средние скругления
        sm: 'calc(var(--radius) - 4px)', // Маленькие скругления
      },
    },
  },
};

export default config;
