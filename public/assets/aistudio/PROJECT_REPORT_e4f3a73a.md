# PERSONALITY ANALYZER USING C++ AND DAA ALGORITHMS
## Minor Project Report – SY BTech CSE, AY 2026–27

**Language:** C++ | **GUI:** WinBGIm `graphics.h` | **DAA:** Greedy Method and Divide and Conquer (Merge Sort)

(Add institution, team member names, roll numbers, guide and submission date.)

## 1. Problem Statement
Build a graphical questionnaire that collects a user's answers, scores four broad self-reflection traits and presents the highest-scoring trait with a ranked summary.

The categories are simplified educational labels, not a validated psychological test or clinical diagnosis.

## 2. Objectives
- Create a GUI-based C++ application using `graphics.h`.
- Ask 20 multiple-choice questions.
- Calculate Introvert, Extrovert, Leader and Creative scores.
- Use Greedy Method to select the maximum-scoring trait.
- Use Merge Sort to rank the four traits.
- Save results in CSV format.

## 3. Proposed System
The user enters a name and selects one of four answers for each question. Each answer adds one point to the mapped trait. After all questions, the backend creates four score records, finds the maximum using Greedy Method, sorts the records with Merge Sort, displays the report and appends a CSV row.

## 4. DAA Algorithms

### 4.1 Greedy Method
```text
GREEDY-DOMINANT(A, n)
    best = 0
    for i = 1 to n - 1
        if A[i].score > A[best].score
            best = i
    return best
```
At every iteration, `best` stores a maximum among all elements seen so far. At termination it therefore identifies a maximum score. Ties retain the first trait in the original order.

### 4.2 Merge Sort (Divide and Conquer)
```text
MERGE-SORT(A, left, right)
    if left >= right: return
    mid = left + (right-left)/2
    MERGE-SORT(A, left, mid)
    MERGE-SORT(A, mid+1, right)
    MERGE(A, left, mid, right)
```
The merge operation combines two descending sorted halves. Equal scores preserve original relative order.

## 5. Flowchart
```text
START
  |
Home screen -> Enter name
  |
Initialize four scores to zero
  |
Display question -> Read answer -> Update mapped score
  |                                  |
  +---------- Repeat 20 times -------+
  |
Build four trait-score records
  |
Greedy maximum selection
  |
Merge Sort ranking
  |
Display result and save CSV
  |
END
```

## 6. Frontend and Backend Modules
- `main.cpp`: program entry point.
- `frontend.cpp`: home, registration, quiz and result screens; mouse and keyboard input.
- `backend.h`: shared structures and function declarations.
- `backend.cpp`: question bank, answer-to-trait mapping, score calculation, Greedy method, Merge Sort and CSV persistence.

## 7. Complexity Analysis
Let n be the number of questions, k the number of traits, and m the number of saved history records.

| Operation | Best | Average | Worst | Extra space |
|---|---:|---:|---:|---:|
| One answer score update | O(1) | O(1) | O(1) | O(1) |
| Complete quiz scoring | O(n) | O(n) | O(n) | O(k) score array |
| Greedy maximum scan | O(k) | O(k) | O(k) | O(1) |
| Merge Sort | O(k log k) | O(k log k) | O(k log k) | O(k) |
| CSV append | I/O dependent | I/O dependent | I/O dependent | O(1) buffer |

Total quiz scoring is O(n); post-quiz ranking is O(k log k). The merge operation requires O(k) auxiliary memory. Here n=20 and k=4.

## 8. Test Cases
See `TEST_CASES.md`. Include each possible dominant trait, equal-score tie, two-way tie, completion, blank name, CSV persistence, mouse input and keyboard input.

## 9. Limitations
- Four simplified categories only.
- One point per answer.
- Not psychometrically validated.
- WinBGIm is Windows-oriented.
- CSV storage has no authentication or database-level protection.

## 10. Future Scope
Add more questions, configurable weights, SQLite, report export, user history search, and a modern cross-platform GUI. Any validated questionnaire must be used with suitable permission and methodology.

## 11. Conclusion
The application demonstrates a practical use of Greedy Method for maximum selection and Merge Sort for ranking in a C++ GUI project. It also demonstrates modular design, file handling, testing and complexity analysis.

## 12. References
1. Supplied *Guidelines for the DAA Minor Project*, SY BTech CSE, AY 2026–27.
2. C++ reference: https://en.cppreference.com/
3. WinBGIm graphics library documentation distributed with the installed BGI package.
4. Course notes on Greedy Method, Divide and Conquer and Merge Sort.
