# Wordle Game – Angular Edition

A modern, interactive Wordle-inspired game where players guess a hidden 5-letter English word within six attempts. The game provides real-time feedback:

Green: Correct letter in the correct position.

Yellow: Correct letter but misplaced.

Gray: Letter not present in the word.

Frontend
Built with Angular, featuring a clean, intuitive UI for seamless gameplay.

Styled with Tailwind CSS for responsive, visually appealing design.

Integrated simple-keyboard library for mobile-friendly input.

Reactive programming using RxJS for efficient API handling and state management.

Enhanced styling with SCSS for modular and maintainable CSS.

Backend
Developed with Node.js and Express, offering two core APIs:

Random Word Generator: Selects a word from a predefined corpus (logged for debugging).

Word Validation: Checks if a guessed word exists in the corpus.

MongoDB database with Mongoose for structured data storage.

Secured environment variables for sensitive configurations (e.g., DB connection strings).

Key Features
User-friendly progress tracking with visual feedback (colors, keyboard hints).

Optimized for both desktop and mobile play.

Scalable backend architecture with efficient API design.

A fun yet challenging word puzzle, combining sleek frontend design with robust backend logic.
