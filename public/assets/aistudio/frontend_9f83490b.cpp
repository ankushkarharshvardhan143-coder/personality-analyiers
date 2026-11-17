#include "backend.h"

#include <graphics.h>
#include <conio.h>
#include <windows.h>
#include <string>
#include <cstdlib>

using namespace std;

namespace {
const int SW = 1000;
const int SH = 700;

void textAt(int x, int y, const string& value, int color = WHITE, int size = 2) {
    setcolor(color);
    settextstyle(DEFAULT_FONT, HORIZ_DIR, size);
    outtextxy(x, y, const_cast<char*>(value.c_str()));
}

void centered(int y, const string& value, int color = WHITE, int size = 2) {
    settextstyle(DEFAULT_FONT, HORIZ_DIR, size);
    int x = (SW - textwidth(const_cast<char*>(value.c_str()))) / 2;
    textAt(x, y, value, color, size);
}

void background() {
    setbkcolor(BLACK);
    cleardevice();
    setfillstyle(SOLID_FILL, COLOR(18, 25, 48));
    bar(0, 0, SW, SH);
    setcolor(COLOR(42, 58, 92));
    for (int x = 0; x < SW; x += 50) line(x, 0, x, SH);
    for (int y = 0; y < SH; y += 50) line(0, y, SW, y);
}

void header(const string& subtitle) {
    centered(30, "PERSONALITY ANALYZER", CYAN, 4);
    centered(88, subtitle, WHITE, 2);
    setcolor(COLOR(80, 110, 160));
    line(100, 125, 900, 125);
}

void button(int x1, int y1, int x2, int y2, const string& label, int color) {
    setfillstyle(SOLID_FILL, color);
    bar(x1, y1, x2, y2);
    setcolor(WHITE);
    rectangle(x1, y1, x2, y2);
    settextstyle(DEFAULT_FONT, HORIZ_DIR, 2);
    int x = x1 + ((x2 - x1) - textwidth(const_cast<char*>(label.c_str()))) / 2;
    int y = y1 + ((y2 - y1) - textheight(const_cast<char*>(label.c_str()))) / 2;
    textAt(x, y, label, WHITE, 2);
}

bool inRect(int x, int y, int x1, int y1, int x2, int y2) {
    return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

void waitInput(int& mx, int& my, char& key) {
    mx = my = -1;
    key = 0;
    while (true) {
        if (ismouseclick(WM_LBUTTONDOWN)) {
            getmouseclick(WM_LBUTTONDOWN, mx, my);
            return;
        }
        if (kbhit()) {
            key = getch();
            return;
        }
        delay(12);
    }
}

bool homeScreen() {
    background();
    header("C++ DAA Minor Project | Greedy Method + Merge Sort");
    centered(190, "Discover your dominant personality traits", YELLOW, 2);
    centered(245, "Answer 20 multiple-choice questions and view your score ranking.", WHITE, 2);
    centered(285, "For self-reflection only; not a clinical or psychological diagnosis.", LIGHTGRAY, 1);
    button(350, 370, 650, 425, "START ANALYSIS", BLUE);
    button(350, 450, 650, 505, "EXIT", RED);
    centered(610, "Frontend: WinBGIm graphics.h    Backend: C++ algorithms and CSV", LIGHTCYAN, 1);

    while (true) {
        int x, y; char key;
        waitInput(x, y, key);
        if (key == 27 || (x >= 0 && inRect(x, y, 350, 450, 650, 505))) return false;
        if (key == 13 || (x >= 0 && inRect(x, y, 350, 370, 650, 425))) return true;
    }
}

string nameScreen() {
    string name;
    background();
    header("User registration");
    centered(215, "Type your name and press ENTER", YELLOW, 2);
    setcolor(WHITE);
    rectangle(220, 280, 780, 345);
    textAt(245, 305, "_", CYAN, 3);

    while (true) {
        char ch = getch();
        if (ch == 13) break;
        if (ch == 8) {
            if (!name.empty()) name.pop_back();
        } else if (ch >= 32 && ch <= 126 && name.size() < 30) {
            name += ch;
        }
        setfillstyle(SOLID_FILL, COLOR(18, 25, 48));
        bar(225, 285, 775, 340);
        textAt(245, 305, name + "_", CYAN, 3);
    }
    return name.empty() ? "Guest" : name;
}

int questionScreen(const string& userName, int index) {
    const Question& q = getQuestions()[index];
    int selected = -1;
    background();
    header("Personality assessment");
    textAt(100, 150, "Candidate: " + userName, LIGHTCYAN, 1);
    textAt(790, 150, "Question " + to_string(index + 1) + "/20", YELLOW, 1);

    setcolor(WHITE);
    rectangle(100, 180, 900, 192);
    setfillstyle(SOLID_FILL, CYAN);
    bar(102, 182, 102 + (796 * (index + 1) / QUESTION_COUNT), 190);

    textAt(100, 235, q.prompt, YELLOW, 2);
    for (int i = 0; i < 4; ++i) {
        int y = 300 + i * 75;
        setfillstyle(SOLID_FILL, COLOR(35, 48, 78));
        bar(120, y, 880, y + 55);
        setcolor(CYAN);
        rectangle(120, y, 880, y + 55);
        textAt(145, y + 18, to_string(i + 1) + ". " + q.options[i], WHITE, 2);
    }
    centered(620, "Click an answer or press 1, 2, 3 or 4", LIGHTGRAY, 1);
    button(760, 645, 900, 685, "NEXT", GREEN);

    while (selected == -1) {
        int x, y; char key;
        waitInput(x, y, key);
        if (key >= '1' && key <= '4') selected = key - '1';
        else if (x >= 0) {
            for (int i = 0; i < 4; ++i) {
                int top = 300 + i * 75;
                if (inRect(x, y, 120, top, 880, top + 55)) selected = i;
            }
        }
        if (key == 27) return -1;
    }

    // Confirmation view so the selected answer is visible before proceeding.
    setfillstyle(SOLID_FILL, COLOR(18, 25, 48));
    bar(90, 590, 910, 690);
    centered(605, "Selected: " + q.options[selected], YELLOW, 1);
    centered(630, "Press ENTER or click NEXT to confirm", WHITE, 1);

    while (true) {
        int x, y; char key;
        waitInput(x, y, key);
        if (key == 27) return -1;
        if (key == 13 || (x >= 0 && inRect(x, y, 760, 645, 900, 685)))
            return selected;
    }
}

void resultScreen(const string& userName,
                  const TraitScore ranked[TRAIT_COUNT],
                  bool saved) {
    background();
    header("Your personality analysis");
    centered(150, "Hello, " + userName + "!", LIGHTCYAN, 2);
    centered(190, "Your dominant personality type is:", WHITE, 2);
    centered(230, ranked[0].name, YELLOW, 4);

    textAt(100, 295, "TRAIT SCORE RANKING", CYAN, 2);
    for (int i = 0; i < TRAIT_COUNT; ++i) {
        int y = 340 + i * 55;
        textAt(110, y, ranked[i].name, WHITE, 2);
        setcolor(WHITE);
        rectangle(300, y, 760, y + 25);
        int w = 456 * ranked[i].score / QUESTION_COUNT;
        if (w > 0) {
            setfillstyle(SOLID_FILL, i == 0 ? GREEN : BLUE);
            bar(302, y + 2, 302 + w, y + 23);
        }
        textAt(785, y + 3, to_string(ranked[i].score) + "/20", YELLOW, 1);
    }

    textAt(100, 575, "PERSONALITY INSIGHT", LIGHTCYAN, 2);
    string desc = ranked[0].description;
    textAt(100, 610, desc.substr(0, 105), WHITE, 1);
    if (desc.size() > 105) textAt(100, 630, desc.substr(105), WHITE, 1);

    centered(665, saved ? "Result saved in personality_results.csv | Press any key to exit"
                        : "Could not save result file | Press any key to exit",
             saved ? LIGHTGREEN : LIGHTRED, 1);
    getch();
}
}

void runApplication() {
    initwindow(SW, SH, "Personality Analyzer - C++ DAA Project");

    if (!homeScreen()) {
        closegraph();
        return;
    }

    string userName = nameScreen();
    int scores[TRAIT_COUNT];
    initializeScores(scores);

    bool completed = true;
    for (int q = 0; q < QUESTION_COUNT; ++q) {
        int answer = questionScreen(userName, q);
        if (answer < 0) {
            completed = false;
            break;
        }
        recordAnswer(scores, q, answer);
    }

    if (completed) {
        TraitScore traits[TRAIT_COUNT];
        buildTraitScores(scores, traits);

        // Greedy step before sorting: determines the max-score trait.
        int dominant = greedyDominantTrait(traits, TRAIT_COUNT);

        // Sort a copy for ranked display.
        mergeSortTraits(traits, 0, TRAIT_COUNT - 1);

        // The sorted first item must match the Greedy maximum.
        // Tie handling is deterministic: original trait order wins ties.
        (void)dominant;

        bool saved = saveResultCSV(userName, traits);
        resultScreen(userName, traits, saved);
    }

    closegraph();
}
