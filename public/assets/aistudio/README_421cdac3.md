# Personality Analyzer – Full C++ Frontend + Backend

## Project structure
- `main.cpp` – program entry point and connects frontend to backend
- `frontend.cpp` – all WinBGIm graphics, screens, mouse and keyboard input
- `backend.cpp` – quiz data, scoring, Greedy algorithm, Merge Sort, CSV storage
- `backend.h` – shared structures and function declarations
- `PROJECT_REPORT.md` – DAA project report
- `TEST_CASES.md` – test cases

## Backend vs frontend
**Frontend:** `frontend.cpp` displays the home screen, name input, question cards, progress bar and results. It collects clicks/keyboard input and calls backend functions.

**Backend:** `backend.cpp` contains all 20 questions, maps each answer to a trait, updates scores, runs the Greedy maximum selection, sorts scores with Merge Sort and saves results to a CSV file.

**Main:** `main.cpp` controls the flow and coordinates frontend/backend. It is included in `frontend.cpp` here as the application entry point; compile all three `.cpp` files.

## Requirements
Windows + MinGW + WinBGIm (`graphics.h` and `libbgi.a`). This uses WinBGIm functions `initwindow`, `ismouseclick`, and `getmouseclick`.

## Compile
From the project folder, use a command similar to:

```bash
g++ main.cpp frontend.cpp backend.cpp -o PersonalityAnalyzer.exe -lbgi -lgdi32 -lcomdlg32 -luuid -loleaut32 -lole32
```


If your WinBGIm package is installed in a custom folder, add `-I"path-to-include"` and `-L"path-to-library"`.

## Run
```bash
PersonalityAnalyzer.exe
```

The result history is appended to `personality_results.csv` in the current working directory.

## DAA
- Greedy Method: O(k) time, O(1) auxiliary space to find the maximum score.
- Merge Sort: O(k log k) time and O(k) auxiliary space to rank traits.
- Quiz scoring: O(n) total time for n questions.
- For this project n=20 questions and k=4 traits.

The quiz is a basic educational self-reflection tool, not a validated clinical assessment.
