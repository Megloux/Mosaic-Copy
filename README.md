# MosaicWindsurf

A modern fitness routine-building application that helps windsurfers create and manage their training programs.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Database**: Supabase
- **Authentication**: Supabase Auth

## Development Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd mosaic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
mosaic/
├── src/
│   ├── components/     # React components
│   ├── config/        # Configuration files (Supabase, etc.)
│   ├── data/          # Data models and SQL templates
│   └── styles/        # CSS and TailwindCSS styles
├── public/           # Static assets
└── ...config files   # Various configuration files
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

[MIT License](LICENSE)
